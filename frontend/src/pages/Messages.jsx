import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Robust helper to format dates without crashing on invalid/null dates
const safeFormatDistance = (dateValue, options = {}) => {
    try {
        if (!dateValue) return '';
        const d = new Date(dateValue);
        if (isNaN(d.getTime())) return '';
        return formatDistanceToNow(d, options);
    } catch {
        return '';
    }
};

// Robust helper to extract the conversation partner (the other person, never the current user)
const getPartner = (conv, currentUser) => {
    if (!conv) return {};
    const myId = String(currentUser?._id || currentUser?.id || '');

    // 1. Check participants array
    if (Array.isArray(conv.participants) && conv.participants.length > 0) {
        const other = conv.participants.find((p) => {
            const pid = typeof p === 'object' && p !== null 
                ? String(p._id || p.id || '') 
                : String(p || '');
            return pid && myId && pid !== myId;
        });
        if (other && typeof other === 'object') return other;
    }

    // 2. Check otherUser returned by backend
    if (conv.otherUser && typeof conv.otherUser === 'object') {
        return conv.otherUser;
    }

    // 3. Check lastMessage sender or recipient
    if (conv.lastMessage && typeof conv.lastMessage === 'object') {
        const s = conv.lastMessage.sender;
        const r = conv.lastMessage.recipient;
        if (s && typeof s === 'object' && String(s._id || s.id || '') !== myId) return s;
        if (r && typeof r === 'object' && String(r._id || r.id || '') !== myId) return r;
    }

    return {};
};

export default function Messages() {
    const { user } = useAuth();
    const { setUnreadMessageCount, fetchUnreadMessageCount } = useNotifications();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Primary State
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);

    // Loading States
    const [conversationsLoading, setConversationsLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [text, setText] = useState('');

    // Search State
    const [searchQueryText, setSearchQueryText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);

    // Typing State
    const [isPartnerTyping, setIsPartnerTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    // Dialog & UI State
    const [confirmDeleteConv, setConfirmDeleteConv] = useState(null);
    const [confirmDeleteMsg, setConfirmDeleteMsg] = useState(null);

    // Refs to prevent state update loops and duplicate socket setups
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const textareaRef = useRef(null);
    const activeConversationRef = useRef(null);
    const processedUserIdRef = useRef(null);
    const processedConversationIdRef = useRef(null);

    // Keep activeConversationRef in sync
    useEffect(() => {
        activeConversationRef.current = activeConversation?._id || null;
    }, [activeConversation]);

    // 1. Fetch Conversations List once on mount / user change
    const fetchConversations = useCallback(async () => {
        try {
            const res = await api.get('/messages/conversations');
            const fetched = res.data.conversations || [];
            setConversations(fetched);
            const totalUnread = fetched.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
            if (setUnreadMessageCount) setUnreadMessageCount(totalUnread);
            return fetched;
        } catch (err) {
            console.error('Error fetching conversations:', err);
            return [];
        } finally {
            setConversationsLoading(false);
        }
    }, [setUnreadMessageCount]);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user, fetchConversations]);

    // 2. Open a conversation by object or ID cleanly
    const selectConversation = async (conv, { replaceUrl = false } = {}) => {
        if (!conv || !conv._id) return;
        processedConversationIdRef.current = conv._id;

        const prevId = activeConversationRef.current;
        if (socketRef.current && prevId && prevId !== conv._id) {
            socketRef.current.emit('leave_conversation', prevId);
        }

        setActiveConversation(conv);
        setMessagesLoading(true);

        try {
            const res = await api.get(`/messages/conversations/${conv._id}`);
            const fetchedMsgs = res.data.messages || [];
            setMessages(fetchedMsgs);

            // Join socket room for active conversation
            if (socketRef.current) {
                socketRef.current.emit('join_conversation', conv._id);
            }

            // Mark unread messages as read
            await api.put(`/messages/conversations/${conv._id}/read`).catch(() => { });

            // Update local unread state
            setConversations((prev) =>
                prev.map((c) =>
                    c._id === conv._id
                        ? {
                            ...c,
                            unreadCount: 0,
                            lastMessage: fetchedMsgs[fetchedMsgs.length - 1] || c.lastMessage,
                        }
                        : c
                )
            );

            if (fetchUnreadMessageCount) fetchUnreadMessageCount();

            // Update URL only if changed to avoid effect cycles
            if (searchParams.get('conversationId') !== conv._id) {
                setSearchParams({ conversationId: conv._id }, { replace: true });
            }

            setTimeout(() => scrollToBottom(), 50);
        } catch (err) {
            console.error('Error opening conversation:', err);
        } finally {
            setMessagesLoading(false);
        }
    };

    // 3. Start or retrieve conversation with a given userId
    const startConversationWithUser = async (targetUserId) => {
        if (!targetUserId || targetUserId === (user?._id || user?.id)) return;
        try {
            setMessagesLoading(true);
            const res = await api.post(`/messages/conversations/user/${targetUserId}`);
            const conv = res.data.conversation;

            // Refresh conversation list to include newly created/un-deleted conversation
            const updatedConvs = await fetchConversations();
            const target = updatedConvs.find((c) => c._id === conv._id) || conv;

            await selectConversation(target, { replaceUrl: true });
        } catch (err) {
            console.error('Error starting conversation with user:', err);
        } finally {
            setMessagesLoading(false);
        }
    };

    // 4. Handle URL search params (`userId` or `conversationId`) cleanly without re-render loops
    useEffect(() => {
        const conversationIdParam = searchParams.get('conversationId');
        const userIdParam = searchParams.get('userId');

        if (conversationIdParam) {
            if (processedConversationIdRef.current !== conversationIdParam) {
                processedConversationIdRef.current = conversationIdParam;
                const target = conversations.find((c) => c._id === conversationIdParam);
                if (target) {
                    selectConversation(target, { replaceUrl: true });
                } else if (!conversationsLoading) {
                    api.get(`/messages/conversations/${conversationIdParam}`)
                        .then((res) => {
                            if (res.data.conversation) {
                                selectConversation(res.data.conversation, { replaceUrl: true });
                            }
                        })
                        .catch(() => { });
                }
            }
        } else if (userIdParam) {
            if (processedUserIdRef.current !== userIdParam) {
                processedUserIdRef.current = userIdParam;
                startConversationWithUser(userIdParam);
            }
        }
    }, [searchParams, conversationsLoading]);

    // 5. Setup Socket.IO connection & listeners
    useEffect(() => {
        const myId = user?._id || user?.id;
        if (!myId) return;

        const socket = io(SOCKET_URL, { transports: ['websocket'] });
        socketRef.current = socket;

        socket.emit('join', myId);

        socket.on('message:new', ({ message, conversationId }) => {
            const myId = String(user?._id || user?.id || '');
            const isSender = String(message.sender?._id || message.sender?.id || message.sender) === myId;

            // Update conversations list (last message & unread badge)
            setConversations((prev) => {
                const exists = prev.some((c) => c._id === conversationId);
                if (exists) {
                    return prev.map((c) => {
                        if (c._id === conversationId) {
                            const isCurrentActive = activeConversationRef.current === conversationId;
                            return {
                                ...c,
                                lastMessage: message,
                                lastMessageAt: new Date(),
                                unreadCount: isCurrentActive || isSender ? 0 : (c.unreadCount || 0) + 1,
                            };
                        }
                        return c;
                    });
                } else {
                    // Add new conversation if not present
                    return [
                        {
                            _id: conversationId,
                            participants: [message.sender, message.recipient],
                            lastMessage: message,
                            lastMessageAt: new Date(),
                            unreadCount: isSender ? 0 : 1,
                        },
                        ...prev,
                    ];
                }
            });

            // Append to current message thread if open
            if (activeConversationRef.current === conversationId) {
                setMessages((prevMsgs) => {
                    const alreadyHas = prevMsgs.some((m) => m._id === message._id);
                    if (alreadyHas) return prevMsgs;
                    setTimeout(() => scrollToBottom(), 40);
                    return [...prevMsgs, message];
                });

                // Automatically mark as read ONLY IF I am the recipient (NOT the sender)
                const myId = String(user?._id || user?.id || '');
                const senderId = String(message.sender?._id || message.sender?.id || message.sender || '');
                if (senderId && myId && senderId !== myId) {
                    api.put(`/messages/conversations/${conversationId}/read`).catch(() => { });
                }
            }
        });

        socket.on('message:read', ({ conversationId, readBy }) => {
            if (activeConversationRef.current === conversationId) {
                setMessages((prevMsgs) =>
                    prevMsgs.map((m) => {
                        const msgSenderId = String(m.sender?._id || m.sender?.id || m.sender || '');
                        if (!readBy || String(readBy) !== msgSenderId) {
                            return { ...m, read: true };
                        }
                        return m;
                    })
                );
            }
        });

        socket.on('message:deleted', ({ messageId, conversationId }) => {
            if (activeConversationRef.current === conversationId) {
                setMessages((prevMsgs) => prevMsgs.filter((m) => m._id !== messageId));
            }
        });

        socket.on('typing', ({ conversationId }) => {
            if (activeConversationRef.current === conversationId) {
                setIsPartnerTyping(true);
            }
        });

        socket.on('stop_typing', ({ conversationId }) => {
            if (activeConversationRef.current === conversationId) {
                setIsPartnerTyping(false);
            }
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user]);

    // 6. User search debounced effect
    useEffect(() => {
        const q = searchQueryText.trim();
        if (!q) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        let cancelled = false;
        setSearching(true);
        const timer = setTimeout(async () => {
            try {
                const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
                if (!cancelled) {
                    // Filter out current user from results
                    const filtered = (res.data.users || []).filter((u) => u._id !== user?._id);
                    setSearchResults(filtered);
                }
            } catch (err) {
                console.error('Search error:', err);
                if (!cancelled) setSearchResults([]);
            } finally {
                if (!cancelled) setSearching(false);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [searchQueryText, user?._id]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle typing events and dynamic textarea height
    const handleTextChange = (e) => {
        const val = e.target.value;
        setText(val);

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }

        if (!activeConversation || !socketRef.current) return;

        const myId = user?._id || user?.id;
        socketRef.current.emit('typing', {
            conversationId: activeConversation._id,
            userId: myId,
            username: user.username,
        });

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            if (socketRef.current && activeConversation) {
                socketRef.current.emit('stop_typing', {
                    conversationId: activeConversation._id,
                    userId: myId,
                });
            }
        }, 1500);
    };

    // Send message handler
    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!activeConversation || !text.trim() || sending) return;

        const messageText = text.trim();
        setText('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setSending(true);

        const myId = user?._id || user?.id;
        if (socketRef.current) {
            socketRef.current.emit('stop_typing', {
                conversationId: activeConversation._id,
                userId: myId,
            });
        }

        try {
            const res = await api.post(`/messages/conversations/${activeConversation._id}`, {
                text: messageText,
            });
            const newMsg = res.data.message;

            setMessages((prev) => {
                const exists = prev.some((m) => m._id === newMsg._id);
                return exists ? prev : [...prev, newMsg];
            });

            setConversations((prev) =>
                prev.map((c) =>
                    c._id === activeConversation._id
                        ? { ...c, lastMessage: newMsg, lastMessageAt: new Date() }
                        : c
                )
            );

            setTimeout(() => scrollToBottom(), 40);
        } catch (err) {
            console.error('Error sending message:', err);
            setText(messageText); // Restore input text on error
        } finally {
            setSending(false);
        }
    };

    // Handle Enter keypress in textarea (Shift+Enter for newline)
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Delete single message
    const handleDeleteMessage = async (msgId) => {
        try {
            await api.delete(`/messages/${msgId}`);
            setMessages((prev) => prev.filter((m) => m._id !== msgId));
        } catch (err) {
            console.error('Error deleting message:', err);
        } finally {
            setConfirmDeleteMsg(null);
        }
    };

    // Delete entire conversation
    const handleDeleteConversation = async (convId) => {
        try {
            await api.delete(`/messages/conversations/${convId}`);
            setConversations((prev) => prev.filter((c) => c._id !== convId));
            if (activeConversation?._id === convId) {
                setActiveConversation(null);
                setMessages([]);
                setSearchParams({});
                processedConversationIdRef.current = null;
            }
        } catch (err) {
            console.error('Error deleting conversation:', err);
        } finally {
            setConfirmDeleteConv(null);
        }
    };

    // Back button on mobile
    const handleBackToList = () => {
        processedConversationIdRef.current = null;
        processedUserIdRef.current = null;
        if (socketRef.current && activeConversationRef.current) {
            socketRef.current.emit('leave_conversation', activeConversationRef.current);
        }
        setActiveConversation(null);
        setMessages([]);
        setSearchParams({}, { replace: true });
    };

    // Get partner user object for active conversation
    const partnerUser = getPartner(activeConversation, user);

    if (!user) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#FAF7F2] dark:bg-[#0E1116]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#D97B4F] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 px-2.5 sm:px-6 py-2 sm:py-4 flex flex-col">
            <div className="mx-auto grid flex-1 min-h-0 w-full max-w-7xl gap-3 sm:gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-12 overflow-hidden">

                {/* ===== SIDEBAR: Conversation List & User Search ===== */}
                <aside
                    className={`${activeConversation ? 'hidden lg:flex' : 'flex'
                        } lg:col-span-4 xl:col-span-3 flex-col rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-md overflow-hidden h-full min-h-0`}
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1F232C] flex items-center justify-between shrink-0">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-[#D97B4F] dark:text-[#F5C36B]">
                                Messages
                            </p>
                            <h2 className="font-['Fraunces'] italic text-xl font-bold text-gray-900 dark:text-[#EDEBE6]">
                                Direct Chats
                            </h2>
                        </div>
                    </div>

                    {/* Search Users Input */}
                    <div className="p-4 border-b border-gray-100 dark:border-[#1F232C] relative shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users or chats..."
                                className="w-full rounded-2xl border border-gray-200 dark:border-[#1F232C] bg-gray-50 dark:bg-[#141821] pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 transition-all"
                                value={searchQueryText}
                                onChange={(e) => setSearchQueryText(e.target.value)}
                            />
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="absolute left-3.5 top-3 h-4 w-4 text-gray-400 dark:text-gray-500"
                            >
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                            </svg>
                            {searchQueryText && (
                                <button
                                    onClick={() => {
                                        setSearchQueryText('');
                                        setSearchResults([]);
                                    }}
                                    className="absolute right-3 top-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {searchQueryText.trim().length > 0 && (
                            <div className="absolute left-4 right-4 top-16 z-30 max-h-64 overflow-y-auto rounded-2xl border border-gray-200 dark:border-[#1F232C] bg-white dark:bg-[#11151D] shadow-xl p-2 space-y-1">
                                {searching ? (
                                    <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                        Searching users...
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="p-3 text-center text-xs text-gray-500 dark:text-gray-400">
                                        No users found.
                                    </div>
                                ) : (
                                    searchResults.map((u) => (
                                        <button
                                            key={u._id}
                                            onClick={() => {
                                                setSearchQueryText('');
                                                setSearchResults([]);
                                                startConversationWithUser(u._id);
                                            }}
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1A1E27] flex items-center gap-3 transition-colors cursor-pointer"
                                        >
                                            <img
                                                src={
                                                    u.profilePicture ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=D97B4F&color=fff`
                                                }
                                                alt=""
                                                referrerPolicy="no-referrer"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=D97B4F&color=fff`;
                                                }}
                                                className="h-9 w-9 rounded-full object-cover shrink-0 border border-gray-200 dark:border-[#1F232C]"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate font-semibold text-sm text-gray-900 dark:text-white">
                                                    {u.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    @{u.username}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Conversation List Scrollable */}
                    <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100/70 dark:divide-[#1F232C]/60">
                        {conversationsLoading ? (
                            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                Loading conversations...
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center">
                                <div className="text-3xl mb-2">💬</div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    No conversations yet.
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    Search a user above to start chatting!
                                </p>
                            </div>
                        ) : (
                            conversations.map((c) => {
                                const partner = getPartner(c, user);
                                const isActive = activeConversation?._id === c._id;
                                const unread = c.unreadCount > 0;
                                const partnerName = partner?.name || 'Chat Partner';
                                const partnerAvatar = partner?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=D97B4F&color=fff`;

                                return (
                                    <div
                                        key={c._id}
                                        onClick={() => selectConversation(c)}
                                        className={`group relative flex items-center gap-3.5 px-4 py-3.5 transition-all cursor-pointer ${isActive
                                            ? 'bg-[#FFF8F4] dark:bg-white/5 border-l-4 border-[#D97B4F]'
                                            : 'hover:bg-gray-50 dark:hover:bg-[#141821]'
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={partnerAvatar}
                                                alt={partnerName}
                                                referrerPolicy="no-referrer"
                                                className="h-11 w-11 rounded-2xl object-cover border border-gray-200 dark:border-[#1F232C]"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=D97B4F&color=fff`;
                                                }}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                <h4 className={`truncate text-sm ${unread ? 'font-bold text-gray-900 dark:text-white' : 'font-semibold text-gray-800 dark:text-[#E7E6E3]'}`}>
                                                    {partnerName}
                                                </h4>
                                                {c.lastMessageAt && safeFormatDistance(c.lastMessageAt) && (
                                                    <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                                                        {safeFormatDistance(c.lastMessageAt, { addSuffix: false })}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`truncate text-xs ${unread ? 'font-semibold text-[#D97B4F] dark:text-[#F5C36B]' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {c.lastMessage?.text || 'No messages yet'}
                                                </p>
                                                {unread && (
                                                    <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#D97B4F] px-1.5 text-[10px] font-bold text-white shrink-0">
                                                        {c.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* ===== MAIN CHAT PANEL ===== */}
                <section
                    className={`${!activeConversation ? 'hidden lg:flex' : 'flex'
                        } lg:col-span-8 xl:col-span-9 flex-col rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-md overflow-hidden h-full min-h-0`}
                >
                    {!activeConversation ? (
                        /* Empty Chat Selection Screen */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="h-20 w-20 rounded-3xl bg-linear-to-br from-[#FF8F6B]/20 to-[#F5C36B]/20 border border-[#FF8F6B]/30 grid place-items-center mb-5 text-4xl shadow-inner">
                                📬
                            </div>
                            <h3 className="font-['Fraunces'] italic text-2xl font-bold text-gray-900 dark:text-[#EDEBE6]">
                                Your Inbox
                            </h3>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                                Select an existing conversation from the left sidebar or search for a friend to start chatting in real time.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Active Chat Header */}
                            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-[#1F232C] flex items-center justify-between shrink-0 bg-white/50 dark:bg-[#0E1116]/50 backdrop-blur-md">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={handleBackToList}
                                        className="lg:hidden p-2 -ml-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1A1E27] transition-colors"
                                        aria-label="Back to conversations"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>

                                    <Link
                                        to={partnerUser._id ? `/profile/${partnerUser._id}` : '#'}
                                        className="flex items-center gap-3 min-w-0 group"
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={
                                                    partnerUser.profilePicture ||
                                                    `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerUser.name || 'User')}&background=D97B4F&color=fff`
                                                }
                                                alt=""
                                                referrerPolicy="no-referrer"
                                                className="h-10 w-10 rounded-2xl object-cover border border-gray-200 dark:border-[#1F232C] group-hover:scale-105 transition-transform"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerUser.name || 'User')}&background=D97B4F&color=fff`;
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-[#D97B4F] dark:group-hover:text-[#F5C36B] transition-colors">
                                                {partnerUser.name || 'User'}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {isPartnerTyping ? (
                                                    <span className="text-[#D97B4F] dark:text-[#F5C36B] font-medium animate-pulse">typing...</span>
                                                ) : (
                                                    `@${partnerUser.username || ''}`
                                                )}
                                            </p>
                                        </div>
                                    </Link>
                                </div>

                                {/* Options Menu (Delete Conversation) */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => setConfirmDeleteConv(activeConversation._id)}
                                        className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                        title="Delete conversation"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
                                            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Message Feed Stream */}
                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 min-h-0">
                                {messagesLoading ? (
                                    <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-gray-400">
                                        Loading message history...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="text-4xl mb-3">👋</div>
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                                            No messages yet
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            Send a message below to start the conversation!
                                        </p>
                                    </div>
                                ) : (
                                    messages.map((m) => {
                                        const myId = String(user?._id || user?.id || '');
                                        const isMine = String(m.sender?._id || m.sender?.id || m.sender || '') === myId;

                                        return (
                                            <div
                                                key={m._id}
                                                className={`group flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'
                                                    }`}
                                            >
                                                {/* Partner Avatar for incoming message */}
                                                {!isMine && (
                                                    <img
                                                        src={
                                                            m.sender?.profilePicture ||
                                                            partnerUser.profilePicture ||
                                                            `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender?.name || partnerUser.name || 'User')}&background=D97B4F&color=fff`
                                                        }
                                                        alt=""
                                                        referrerPolicy="no-referrer"
                                                        className="h-7 w-7 rounded-full object-cover shrink-0 mb-1 border border-gray-200 dark:border-[#1F232C]"
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender?.name || partnerUser.name || 'User')}&background=D97B4F&color=fff`;
                                                        }}
                                                    />
                                                )}

                                                <div className="relative max-w-[85%] sm:max-w-[70%]">
                                                    {/* Message Bubble */}
                                                    <div
                                                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs ${isMine
                                                            ? 'bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-medium rounded-br-xs'
                                                            : 'bg-white dark:bg-[#141821] border border-gray-200/80 dark:border-[#1F232C] text-gray-900 dark:text-[#EDEBE6] rounded-bl-xs'
                                                            }`}
                                                    >
                                                        <p>{m.text}</p>
                                                        <div
                                                            className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${isMine ? 'text-[#3D1E0C]/85 font-medium' : 'text-gray-400 dark:text-gray-500'
                                                                }`}
                                                        >
                                                            <span>
                                                                {m.createdAt && safeFormatDistance(m.createdAt)
                                                                    ? safeFormatDistance(m.createdAt, { addSuffix: true })
                                                                    : 'Just now'}
                                                            </span>
                                                            {isMine && (
                                                                m.read ? (
                                                                    <span className="font-extrabold text-[#064E3B] tracking-wide inline-flex items-center gap-0.5">
                                                                        <span className="text-[11px]">✓✓</span> Seen
                                                                    </span>
                                                                ) : (
                                                                    <span className="font-bold text-[#4A2008] tracking-wide inline-flex items-center gap-0.5">
                                                                        <span className="text-[11px]">✓</span> Sent
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Delete single message option on hover */}
                                                    <button
                                                        onClick={() => setConfirmDeleteMsg(m._id)}
                                                        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 ${isMine ? '-left-8' : '-right-8'
                                                            } p-1 text-gray-400 hover:text-red-500`}
                                                        title="Delete message"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                                            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Typing Indicator Bar */}
                            {isPartnerTyping && (
                                <div className="px-6 py-1 text-xs text-[#D97B4F] dark:text-[#F5C36B] italic font-medium animate-pulse">
                                    {partnerUser.name || 'User'} is typing...
                                </div>
                            )}

                            {/* Message Input Form */}
                            <form
                                onSubmit={handleSend}
                                className="p-2.5 sm:p-4 border-t border-gray-100 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 backdrop-blur-md shrink-0"
                            >
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#181C26] border border-gray-200/90 dark:border-[#252A36] rounded-3xl p-1.5 pl-3.5 sm:pl-4 focus-within:ring-2 focus-within:ring-[#FF8F6B]/50 transition-all shadow-inner">
                                    <textarea
                                        ref={textareaRef}
                                        value={text}
                                        onChange={handleTextChange}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-transparent border-0 resize-none text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-0 leading-5 py-1.5 sm:py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-h-28 overflow-y-auto"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !text.trim()}
                                        className="h-9.5 w-9.5 sm:h-10 sm:w-auto sm:px-4.5 shrink-0 rounded-full sm:rounded-2xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed shadow-sm transition-all duration-200"
                                        title="Send message"
                                        aria-label="Send message"
                                    >
                                        {sending ? (
                                            <div className="h-4 w-4 rounded-full border-2 border-[#1A140D] border-t-transparent animate-spin" />
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">Send</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4 sm:h-4.5 sm:w-4.5 translate-x-0.5">
                                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </section>
            </div>

            {/* Delete Conversation Confirmation Dialog */}
            {confirmDeleteConv && (
                <ConfirmDialog
                    isOpen={Boolean(confirmDeleteConv)}
                    title="Delete Conversation"
                    message="Are you sure you want to delete this conversation? It will be removed from your chat inbox."
                    confirmText="Delete"
                    confirmVariant="danger"
                    onConfirm={() => handleDeleteConversation(confirmDeleteConv)}
                    onCancel={() => setConfirmDeleteConv(null)}
                />
            )}

            {/* Delete Message Confirmation Dialog */}
            {confirmDeleteMsg && (
                <ConfirmDialog
                    isOpen={Boolean(confirmDeleteMsg)}
                    title="Delete Message"
                    message="Are you sure you want to delete this message?"
                    confirmText="Delete"
                    confirmVariant="danger"
                    onConfirm={() => handleDeleteMessage(confirmDeleteMsg)}
                    onCancel={() => setConfirmDeleteMsg(null)}
                />
            )}
        </div>
    );
}