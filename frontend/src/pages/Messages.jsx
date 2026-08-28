import { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
    HiOutlineChatBubbleLeftRight,
    HiOutlineInbox,
    HiOutlineChatBubbleBottomCenterText,
    HiOutlineXMark,
    HiCheck,
} from 'react-icons/hi2';
import io from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ===== UNIQUE ACOUSTIC SIGNAL PULSE & TRANSMISSION WAVE BACKGROUND =====
const MessagesBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <style>{`
                @keyframes signalRipple {
                    0% { transform: scale(0.6); opacity: 0.8; }
                    50% { opacity: 0.4; }
                    100% { transform: scale(2.2); opacity: 0; }
                }
                @keyframes eqPulse {
                    0%, 100% { height: 12px; }
                    50% { height: 48px; }
                }
                @keyframes eqPulseAlt {
                    0%, 100% { height: 36px; }
                    50% { height: 16px; }
                }
                @keyframes floatPacket {
                    0% { transform: translateY(30px) scale(0.8); opacity: 0; }
                    50% { opacity: 0.7; }
                    100% { transform: translateY(-70px) scale(1.1); opacity: 0; }
                }
                @keyframes waveShift {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-signal-ring {
                    animation: signalRipple 5s cubic-bezier(0.2, 0.8, 0.4, 1) infinite;
                    transform-origin: center center;
                }
                .animate-signal-ring-delay-1 {
                    animation: signalRipple 5s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 1.6s;
                    transform-origin: center center;
                }
                .animate-signal-ring-delay-2 {
                    animation: signalRipple 5s cubic-bezier(0.2, 0.8, 0.4, 1) infinite 3.2s;
                    transform-origin: center center;
                }
                .animate-packet-1 { animation: floatPacket 6s ease-in-out infinite; }
                .animate-packet-2 { animation: floatPacket 8s ease-in-out infinite 2s; }
                .animate-packet-3 { animation: floatPacket 7s ease-in-out infinite 4s; }
            `}</style>

            {/* 1. Ambient Dynamic Transmission Glow Orbs */}
            <div className="absolute -top-24 -left-20 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-br from-[#FF8F6B]/25 via-[#D97B4F]/15 to-transparent blur-3xl" />
            <div className="absolute top-1/2 -right-24 w-80 sm:w-[450px] h-80 sm:h-[450px] rounded-full bg-gradient-to-bl from-[#F5C36B]/20 via-[#E2774C]/15 to-transparent blur-3xl" />
            <div className="absolute -bottom-20 left-1/3 w-80 sm:w-[460px] h-80 sm:h-[460px] rounded-full bg-gradient-to-tr from-[#EA580C]/20 via-[#FF8F6B]/10 to-transparent blur-3xl" />

            {/* 2. Concentric Transmission Relay Rings (Top-Left Hub) */}
            <div className="absolute top-8 left-8 sm:left-16 w-64 h-64 opacity-40 dark:opacity-30">
                <div className="absolute inset-0 rounded-full border-2 border-[#D97B4F] dark:border-[#FF8F6B] animate-signal-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-[#F5C36B] dark:border-[#F5C36B] animate-signal-ring-delay-1" />
                <div className="absolute inset-0 rounded-full border border-[#EA580C] dark:border-[#FF8F6B] animate-signal-ring-delay-2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#EA580C] dark:bg-[#FF8F6B] shadow-lg shadow-[#FF8F6B]/50" />
            </div>

            {/* 3. Concentric Transmission Relay Rings (Bottom-Right Hub) */}
            <div className="absolute bottom-12 right-10 sm:right-24 w-60 h-60 opacity-35 dark:opacity-25">
                <div className="absolute inset-0 rounded-full border-2 border-[#F5C36B] dark:border-[#F5C36B] animate-signal-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-[#D97B4F] dark:border-[#FF8F6B] animate-signal-ring-delay-1" />
                <div className="absolute inset-0 rounded-full border border-[#E2774C] dark:border-[#F5C36B] animate-signal-ring-delay-2" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#D97B4F] dark:bg-[#F5C36B]" />
            </div>

            {/* 4. Acoustic Frequency Equalizer Waves (Top Right) */}
            <div className="absolute top-4 right-12 sm:right-32 flex items-end gap-1.5 opacity-35 dark:opacity-30">
                {[18, 38, 22, 46, 30, 52, 26, 42, 16, 34, 48, 24, 40, 20].map((h, i) => (
                    <div
                        key={i}
                        className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-[#D97B4F] via-[#FF8F6B] to-[#F5C36B]"
                        style={{
                            height: `${h}px`,
                            animation: `${i % 2 === 0 ? 'eqPulse' : 'eqPulseAlt'} ${2 + (i % 3) * 0.5}s ease-in-out infinite ${(i * 0.15)}s`,
                        }}
                    />
                ))}
            </div>

            {/* 5. Acoustic Frequency Equalizer Waves (Bottom Left) */}
            <div className="absolute bottom-6 left-10 sm:left-32 flex items-end gap-1.5 opacity-30 dark:opacity-25">
                {[28, 16, 42, 24, 50, 32, 18, 44, 26, 38, 14, 46, 22].map((h, i) => (
                    <div
                        key={i}
                        className="w-1 sm:w-1.5 rounded-full bg-gradient-to-t from-[#F5C36B] via-[#D97B4F] to-[#EA580C]"
                        style={{
                            height: `${h}px`,
                            animation: `${i % 2 === 0 ? 'eqPulseAlt' : 'eqPulse'} ${2.4 + (i % 3) * 0.4}s ease-in-out infinite ${(i * 0.18)}s`,
                        }}
                    />
                ))}
            </div>

            {/* 6. Floating Encrypted Dialogue Packets */}
            <div className="absolute top-[35%] left-[18%] animate-packet-1">
                <div className="px-2.5 py-1 rounded-full bg-[#FF8F6B]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase">
                    📡 Sync
                </div>
            </div>
            <div className="absolute top-[60%] right-[22%] animate-packet-2">
                <div className="px-2.5 py-1 rounded-full bg-[#F5C36B]/25 text-[#9E3610] dark:text-[#F5C36B] border border-black/20 dark:border-[#F5C36B]/40 text-[9px] font-black tracking-widest uppercase">
                    💬 Direct
                </div>
            </div>
            <div className="absolute top-[75%] left-[45%] animate-packet-3">
                <div className="px-2.5 py-1 rounded-full bg-[#E2774C]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase">
                    ⚡ Live
                </div>
            </div>
        </div>
    );
};

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

    // 6. Automatic Real-Time Messaging Polling Fallback (Guarantees instant updates across devices)
    useEffect(() => {
        if (!user) return undefined;

        const pollInterval = setInterval(async () => {
            // A. Poll active conversation messages if open
            const activeId = activeConversationRef.current;
            if (activeId) {
                try {
                    const res = await api.get(`/messages/conversations/${activeId}`);
                    const fetchedMsgs = res.data.messages || [];

                    setMessages((prevMsgs) => {
                        if (
                            fetchedMsgs.length !== prevMsgs.length ||
                            (fetchedMsgs.length > 0 &&
                                prevMsgs.length > 0 &&
                                fetchedMsgs[fetchedMsgs.length - 1]._id !== prevMsgs[prevMsgs.length - 1]._id)
                        ) {
                            setTimeout(() => scrollToBottom(), 50);
                            return fetchedMsgs;
                        }
                        return prevMsgs;
                    });

                    // Auto mark as read if new message received while looking at active conversation
                    const myId = String(user?._id || user?.id || '');
                    const lastMsg = fetchedMsgs[fetchedMsgs.length - 1];
                    if (lastMsg) {
                        const senderId = String(lastMsg.sender?._id || lastMsg.sender?.id || lastMsg.sender || '');
                        if (senderId && myId && senderId !== myId && !lastMsg.read) {
                            api.put(`/messages/conversations/${activeId}/read`).catch(() => { });
                        }
                    }
                } catch (err) {
                    // Silent catch for background polling
                }
            }

            // B. Poll conversation list & unread count
            try {
                const res = await api.get('/messages/conversations');
                const fetchedConvs = res.data.conversations || [];
                setConversations((prev) => {
                    const currentSig = JSON.stringify(prev.map(c => ({ id: c._id, last: c.lastMessage?._id, unread: c.unreadCount })));
                    const fetchedSig = JSON.stringify(fetchedConvs.map(c => ({ id: c._id, last: c.lastMessage?._id, unread: c.unreadCount })));
                    return currentSig !== fetchedSig ? fetchedConvs : prev;
                });
                const totalUnread = fetchedConvs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
                if (setUnreadMessageCount) setUnreadMessageCount(totalUnread);
            } catch (err) {
                // Silent catch for background polling
            }
        }, 2000);

        return () => clearInterval(pollInterval);
    }, [user, setUnreadMessageCount]);

    // 7. User search debounced effect
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
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#FAF7F2] dark:bg-[#0E1116] relative overflow-hidden">
                <MessagesBackgroundAnimation />
                <div className="relative z-10 animate-spin rounded-full h-10 w-10 border-2 border-[#9E3610] dark:border-[#FF8F6B] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="relative h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 px-2.5 sm:px-6 py-2 sm:py-4 flex flex-col overflow-hidden font-[Manrope]">
            {/* Unique Acoustic Signal & Telemetry Wave Animation */}
            <MessagesBackgroundAnimation />

            <div className="relative z-10 mx-auto grid flex-1 min-h-0 w-full max-w-7xl gap-3 sm:gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-12 overflow-hidden">

                {/* ===== SIDEBAR: Conversation List & User Search ===== */}
                <aside
                    className={`${activeConversation ? 'hidden lg:flex' : 'flex'
                        } lg:col-span-4 xl:col-span-3 flex-col rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl shadow-[5px_5px_0px_#000000] dark:shadow-xl overflow-hidden h-full min-h-0`}
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b-2 border-black/15 dark:border-[#1F232C] flex items-center justify-between shrink-0">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF8F6B]/30 text-[#6B2207] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-black dark:border-[#FF8F6B]/40 text-[9px] font-black uppercase tracking-widest mb-1">
                                📡 Direct Signal
                            </span>
                            <h2 className="font-['Fraunces'] italic text-xl font-extrabold text-[#1A0F08] dark:text-[#EDEBE6]">
                                Direct Chats
                            </h2>
                        </div>
                    </div>

                    {/* Search Users Input */}
                    <div className="p-3.5 border-b-2 border-black/15 dark:border-[#1F232C] relative shrink-0">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users or chats..."
                                className="w-full rounded-2xl border-2 border-black dark:border-[#1F232C] bg-[#E2B293] dark:bg-[#141821] pl-10 pr-4 py-2 text-xs sm:text-sm text-[#1A0F08] dark:text-white placeholder-[#5C361E] dark:placeholder-gray-500 font-bold focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 transition-all shadow-xs"
                                value={searchQueryText}
                                onChange={(e) => setSearchQueryText(e.target.value)}
                            />
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="absolute left-3.5 top-2.5 h-4 w-4 text-[#5C361E] dark:text-gray-400"
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
                                    className="absolute right-3 top-2.5 text-xs text-[#5C361E] hover:text-black dark:hover:text-white cursor-pointer"
                                >
                                    <HiOutlineXMark className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {searchQueryText.trim().length > 0 && (
                            <div className="absolute left-3.5 right-3.5 top-15 z-30 max-h-64 overflow-y-auto rounded-2xl border-2 border-black dark:border-[#1F232C] bg-[#E2B293] dark:bg-[#11151D] shadow-2xl p-2 space-y-1">
                                {searching ? (
                                    <div className="p-3 text-center text-xs font-bold text-[#5C361E] dark:text-gray-400">
                                        Searching users...
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="p-3 text-center text-xs font-bold text-[#5C361E] dark:text-gray-400">
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
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#D59E7C] dark:hover:bg-[#1A1E27] flex items-center gap-3 transition-colors cursor-pointer border border-black/15 dark:border-transparent"
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
                                                className="h-9 w-9 rounded-full object-cover shrink-0 border-2 border-black dark:border-[#1F232C]"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <div className="truncate font-black text-sm text-[#1A0F08] dark:text-white">
                                                    {u.name}
                                                </div>
                                                <div className="text-xs text-[#5C361E] dark:text-gray-400 truncate font-bold">
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
                    <div className="flex-1 overflow-y-auto min-h-0 divide-y-2 divide-black/10 dark:divide-[#1F232C]/60">
                        {conversationsLoading ? (
                            <div className="p-6 text-center text-xs font-black uppercase tracking-widest text-[#9E3610] dark:text-[#FF8F6B]">
                                Loading signals...
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                                <div className="flex justify-center text-3xl mb-2 text-[#9E3610] dark:text-[#F5C36B]">
                                    <HiOutlineChatBubbleLeftRight className="text-3xl" />
                                </div>
                                <p className="text-sm font-black text-[#1A0F08] dark:text-gray-300">
                                    No conversations yet.
                                </p>
                                <p className="text-xs font-bold text-[#5C361E] dark:text-gray-500">
                                    Search a creator above to start chatting!
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
                                            ? 'bg-[#E2B293] dark:bg-white/10 border-l-4 border-black dark:border-[#FF8F6B]'
                                            : 'hover:bg-[#E8BC9F] dark:hover:bg-[#141821]'
                                            }`}
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={partnerAvatar}
                                                alt={partnerName}
                                                referrerPolicy="no-referrer"
                                                className="h-11 w-11 rounded-2xl object-cover border-2 border-black dark:border-[#1F232C]"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=D97B4F&color=fff`;
                                                }}
                                            />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-1 mb-0.5">
                                                <h4 className={`truncate text-sm ${unread ? 'font-black text-[#1A0F08] dark:text-white' : 'font-extrabold text-[#2C1810] dark:text-[#E7E6E3]'}`}>
                                                    {partnerName}
                                                </h4>
                                                {c.lastMessageAt && safeFormatDistance(c.lastMessageAt) && (
                                                    <span className="text-[10px] text-[#5C361E] dark:text-gray-500 shrink-0 font-bold">
                                                        {safeFormatDistance(c.lastMessageAt, { addSuffix: false })}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`truncate text-xs ${unread ? 'font-black text-[#9E3610] dark:text-[#F5C36B]' : 'font-bold text-[#5C361E] dark:text-gray-400'}`}>
                                                    {c.lastMessage?.text || 'No messages yet'}
                                                </p>
                                                {unread && (
                                                    <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-[#EA580C] px-1.5 text-[10px] font-black text-white shrink-0 border border-black">
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
                        } lg:col-span-8 xl:col-span-9 flex-col rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl shadow-[5px_5px_0px_#000000] dark:shadow-xl overflow-hidden h-full min-h-0`}
                >
                    {!activeConversation ? (
                        /* Empty Chat Selection Screen */
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                            <div className="h-20 w-20 rounded-3xl bg-[#E2B293] dark:bg-gradient-to-br dark:from-[#FF8F6B]/20 dark:to-[#F5C36B]/20 border-2 border-black dark:border-[#FF8F6B]/30 grid place-items-center mb-5 text-4xl shadow-md text-[#9E3610] dark:text-[#FF8F6B]">
                                <HiOutlineInbox className="text-4xl" />
                            </div>
                            <h3 className="font-['Fraunces'] italic text-2xl font-black text-[#1A0F08] dark:text-[#EDEBE6]">
                                Telemetry Inbox
                            </h3>
                            <p className="mt-2 text-xs sm:text-sm text-[#402414] dark:text-gray-400 max-w-sm font-extrabold">
                                Select an active frequency from the left or search for a creator to initiate direct transmission.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Active Chat Header */}
                            <div className="px-5 py-3.5 border-b-2 border-black/15 dark:border-[#1F232C] flex items-center justify-between shrink-0 bg-[#E8BC9F]/80 dark:bg-[#0E1116]/50 backdrop-blur-md">
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Mobile Back Button */}
                                    <button
                                        onClick={handleBackToList}
                                        className="lg:hidden p-2 -ml-2 rounded-xl text-gray-800 dark:text-gray-300 hover:bg-[#D59E7C] dark:hover:bg-[#1A1E27] transition-colors"
                                        aria-label="Back to conversations"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
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
                                                className="h-10 w-10 rounded-2xl object-cover border-2 border-black dark:border-[#1F232C] group-hover:scale-105 transition-transform shadow-xs"
                                                onError={(e) => {
                                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerUser.name || 'User')}&background=D97B4F&color=fff`;
                                                }}
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black text-sm text-[#1A0F08] dark:text-white truncate group-hover:text-[#9E3610] dark:group-hover:text-[#F5C36B] transition-colors">
                                                {partnerUser.name || 'User'}
                                            </h3>
                                            <p className="text-xs text-[#5C361E] dark:text-gray-400 truncate font-extrabold">
                                                {isPartnerTyping ? (
                                                    <span className="text-[#9E3610] dark:text-[#F5C36B] font-black animate-pulse">typing signal...</span>
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
                                        className="p-2 rounded-xl text-[#6B2207] dark:text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors border border-black/20 dark:border-transparent"
                                        title="Delete conversation"
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Message Feed Stream */}
                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 min-h-0">
                                {messagesLoading ? (
                                    <div className="flex items-center justify-center h-full text-xs font-black uppercase tracking-widest text-[#9E3610] dark:text-[#FF8F6B]">
                                        Retrieving packet stream...
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
                                        <div className="flex justify-center text-4xl mb-2 text-[#9E3610] dark:text-[#F5C36B]">
                                            <HiOutlineChatBubbleBottomCenterText className="text-4xl" />
                                        </div>
                                        <p className="text-sm font-black text-[#1A0F08] dark:text-gray-200">
                                            Channel opened
                                        </p>
                                        <p className="text-xs font-bold text-[#5C361E] dark:text-gray-500">
                                            Send the first packet below to begin chatting!
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
                                                        className="h-7 w-7 rounded-full object-cover shrink-0 mb-1 border-2 border-black dark:border-[#1F232C]"
                                                        onError={(e) => {
                                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(m.sender?.name || partnerUser.name || 'User')}&background=D97B4F&color=fff`;
                                                        }}
                                                    />
                                                )}

                                                <div className="relative max-w-[85%] sm:max-w-[70%]">
                                                    {/* Message Bubble */}
                                                    <div
                                                        className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words shadow-xs border-2 border-black ${isMine
                                                            ? 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold rounded-br-xs'
                                                            : 'bg-[#E2B293] dark:bg-[#141821] text-[#1A0F08] dark:text-[#EDEBE6] font-bold rounded-bl-xs'
                                                            }`}
                                                    >
                                                        <p>{m.text}</p>
                                                        <div
                                                            className={`mt-1 flex items-center justify-end gap-1.5 text-[10px] ${isMine ? 'text-[#3D1E0C] font-black' : 'text-[#5C361E] dark:text-gray-400 font-bold'
                                                                }`}
                                                        >
                                                            <span>
                                                                {m.createdAt && safeFormatDistance(m.createdAt)
                                                                    ? safeFormatDistance(m.createdAt, { addSuffix: true })
                                                                    : 'Just now'}
                                                            </span>
                                                            {isMine && (
                                                                m.read ? (
                                                                    <span className="font-black text-[#064E3B] tracking-wide inline-flex items-center gap-0.5">
                                                                        <span className="inline-flex -space-x-1">
                                                                            <HiCheck className="text-xs" />
                                                                            <HiCheck className="text-xs" />
                                                                        </span>
                                                                        <span>Seen</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="font-bold text-[#4A2008] tracking-wide inline-flex items-center gap-0.5">
                                                                        <HiCheck className="text-xs" />
                                                                        <span>Sent</span>
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Delete single message option on hover */}
                                                    <button
                                                        onClick={() => setConfirmDeleteMsg(m._id)}
                                                        className={`opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 ${isMine ? '-left-8' : '-right-8'
                                                            } p-1 text-gray-500 hover:text-red-600`}
                                                        title="Delete message"
                                                    >
                                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
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
                                <div className="px-6 py-1 text-xs text-[#9E3610] dark:text-[#F5C36B] italic font-black animate-pulse">
                                    {partnerUser.name || 'User'} is typing...
                                </div>
                            )}

                            {/* Message Input Form */}
                            <form
                                onSubmit={handleSend}
                                className="p-2.5 sm:p-4 border-t-2 border-black/15 dark:border-[#1F232C] bg-[#E8BC9F]/90 dark:bg-[#12151C]/95 backdrop-blur-md shrink-0"
                            >
                                <div className="flex items-center gap-2 bg-[#E2B293] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] rounded-3xl p-1.5 pl-3.5 sm:pl-4 focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-[#FF8F6B]/50 transition-all shadow-inner">
                                    <textarea
                                        ref={textareaRef}
                                        value={text}
                                        onChange={handleTextChange}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        placeholder="Type a transmission..."
                                        className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-[#1A0F08] dark:text-white placeholder-[#5C361E] dark:placeholder-gray-500 font-bold focus:outline-none focus:ring-0 leading-5 py-1.5 sm:py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-h-28 overflow-y-auto"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !text.trim()}
                                        className="h-9.5 w-9.5 sm:h-10 sm:w-auto sm:px-4.5 shrink-0 rounded-full sm:rounded-2xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 border-2 border-black hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed shadow-xs transition-all duration-200"
                                        title="Send message"
                                        aria-label="Send message"
                                    >
                                        {sending ? (
                                            <div className="h-4 w-4 rounded-full border-2 border-[#1A140D] border-t-transparent animate-spin" />
                                        ) : (
                                            <>
                                                <span className="hidden sm:inline">Send</span>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-4 w-4 sm:h-4.5 sm:w-4.5 translate-x-0.5">
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