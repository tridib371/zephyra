import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5007';

export default function Messages() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [searchQueryText, setSearchQueryText] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [text, setText] = useState('');
    const socketRef = useRef(null);
    const bottomRef = useRef(null);
    const startedWithUserRef = useRef(null);
    const activeConversationRef = useRef(null);

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            setConversations(res.data.conversations || []);
        } catch (err) {
            console.error('fetchConversations', err);
        } finally {
            setLoading(false);
        }
    };

    const openConversation = async (conversation, { replaceUrl = false } = {}) => {
        if (!conversation) return;
        setActiveConversation(conversation);
        // indicate loading so UI doesn't flash old messages
        setMessagesLoading(true);
        try {
            // leave previous conversation room if any
            const prevId = activeConversationRef.current;
            if (socketRef.current && prevId && prevId !== conversation._id) {
                socketRef.current.emit('leave_conversation', prevId);
            }

            const res = await api.get(`/messages/conversations/${conversation._id}`);
            const msgs = res.data.messages || [];
            // set the active conversation ref before joining
            activeConversationRef.current = conversation._id;

            setMessages(msgs);
            await api.put(`/messages/conversations/${conversation._id}/read`).catch(() => { });
            setConversations((prev) => prev.map((c) => (c._id === conversation._id ? { ...c, unreadCount: 0, lastMessage: res.data.messages?.[res.data.messages.length - 1] || c.lastMessage } : c)));
            if (socketRef.current) socketRef.current.emit('join_conversation', conversation._id);
            if (replaceUrl) setSearchParams({ conversationId: conversation._id }, { replace: true });
            else setSearchParams({ conversationId: conversation._id });
            scrollToBottom();
        } catch (err) {
            console.error('openConversation', err);
        } finally {
            setMessagesLoading(false);
        }
    };

    const startConversationWithUser = async (userId) => {
        if (!userId || userId === user?._id) return;
        try {
            const res = await api.post(`/messages/conversations/user/${userId}`);
            const conv = res.data.conversation;
            await fetchConversations();
            await openConversation(conv, { replaceUrl: true });
        } catch (err) {
            console.error('startConversationWithUser', err);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    // Debounced search for users
    useEffect(() => {
        const q = searchQueryText.trim();
        if (!q) {
            setSearchResults([]);
            setSearching(false);
            return;
        }

        let cancelled = false;
        setSearching(true);
        const t = setTimeout(async () => {
            try {
                const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
                if (!cancelled) {
                    setSearchResults(res.data.users || []);
                }
            } catch (err) {
                console.error('search users', err);
                if (!cancelled) setSearchResults([]);
            } finally {
                if (!cancelled) setSearching(false);
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [searchQueryText]);

    useEffect(() => {
        if (!user) return;
        const socket = io(SOCKET_URL, { transports: ['websocket'] });
        socketRef.current = socket;
        socket.emit('join', user._id);

        socket.on('message:new', ({ message, conversationId }) => {
            setConversations((prev) => {
                const found = prev.find((c) => c._id === conversationId);
                if (found) {
                    return prev.map((c) => (c._id === conversationId ? { ...c, lastMessage: message, lastMessageAt: new Date(), unreadCount: (c.unreadCount || 0) + (message.sender?._id === user._id ? 0 : 1) } : c));
                }
                return [
                    { _id: conversationId, participants: [message.sender, message.recipient], lastMessage: message, lastMessageAt: new Date(), unreadCount: message.sender?._id === user._id ? 0 : 1 },
                    ...prev,
                ];
            });

            setMessages((prev) => {
                // Use ref to know which conversation is currently active
                if (activeConversationRef.current === conversationId) {
                    const exists = prev.some((m) => m._id === message._id);
                    if (!exists) {
                        // append message
                        setTimeout(() => scrollToBottom(), 30);
                        return [...prev, message];
                    }
                }
                return prev;
            });
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, [user]);

    useEffect(() => {
        const conversationId = searchParams.get('conversationId');
        const userId = searchParams.get('userId');

        // If a conversationId is present, open it only if it's not already active
        if (conversationId && conversations.length > 0) {
            const target = conversations.find((c) => c._id === conversationId);
            if (target && (!activeConversation || activeConversation._id !== conversationId)) {
                openConversation(target);
            }
            return;
        }

        // If userId param is present, start a conversation only once per userId
        if (userId && startedWithUserRef.current !== userId) {
            startedWithUserRef.current = userId;
            startConversationWithUser(userId);
        }
    }, [searchParams, conversations, activeConversation]);

    const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

    const handleSend = async (e) => {
        e.preventDefault();
        if (!activeConversation || !text.trim()) return;
        setSending(true);
        try {
            const res = await api.post(`/messages/conversations/${activeConversation._id}`, { text: text.trim() });
            const msg = res.data.message;
            setMessages((prev) => [...prev, msg]);
            setConversations((prev) => prev.map((c) => (c._id === activeConversation._id ? { ...c, lastMessage: msg, lastMessageAt: new Date() } : c)));
            setText('');
            setTimeout(() => scrollToBottom(), 30);
        } catch (err) {
            console.error('send', err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="min-h-[calc(100dvh-4rem)] overflow-hidden px-4 sm:px-6 py-6 sm:py-8">
            <div className="mx-auto grid h-[calc(100dvh-7.5rem)] max-w-7xl gap-6 lg:grid-cols-12 overflow-hidden">
                <aside className="lg:col-span-4 xl:col-span-3 flex min-h-0 flex-col rounded-3xl border bg-white/80 dark:bg-[#0E1116]/80 overflow-hidden">
                    <div className="px-5 py-4 border-b">
                        <p className="text-xs uppercase text-[#D97B4F]">Direct Messages</p>
                        <h2 className="mt-1 text-xl font-semibold">Chats</h2>
                    </div>

                    <div className="px-4 py-3 border-b">
                        <input
                            placeholder="Search conversations"
                            className="w-full rounded-full border px-4 py-2"
                            value={searchQueryText}
                            onChange={(e) => setSearchQueryText(e.target.value)}
                        />

                        {searchQueryText.trim().length > 0 && (
                            <div className="mt-2 bg-white dark:bg-[#0B0D10] rounded-lg shadow-md border overflow-hidden">
                                {searching ? (
                                    <div className="p-2 text-sm text-gray-500">Searching...</div>
                                ) : searchResults.length === 0 ? (
                                    <div className="p-2 text-sm text-gray-500">No users found.</div>
                                ) : (
                                    searchResults.map((u) => (
                                        <button
                                            key={u._id}
                                            onClick={() => {
                                                setSearchQueryText('');
                                                setSearchResults([]);
                                                startConversationWithUser(u._id);
                                            }}
                                            className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-[#0F1317] flex items-center gap-3"
                                        >
                                            <img src={u.profilePicture || ''} alt="" className="h-8 w-8 rounded-full object-cover" />
                                            <div className="min-w-0">
                                                <div className="truncate font-medium">{u.name}</div>
                                                <div className="text-xs text-gray-500">@{u.username}</div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-sm text-gray-500">Loading...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-sm text-gray-500">No conversations yet.</div>
                        ) : (
                            conversations.map((c) => {
                                const partner = (c.participants || []).find((p) => p._id !== user?._id) || {};
                                return (
                                    <button key={c._id} onClick={() => openConversation(c)} className={`w-full px-4 py-3 border-b text-left ${activeConversation?._id === c._id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
                                        <div className="flex items-center gap-3">
                                            <img src={partner.profilePicture || ''} alt="" className="h-10 w-10 rounded-full object-cover" />
                                            <div className="min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <p className="truncate font-medium">{partner.name || 'Unknown'}</p>
                                                    <span className="text-xs text-gray-500">{c.unreadCount > 0 ? c.unreadCount : ''}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 truncate">{c.lastMessage?.text || 'No messages yet'}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </aside>

                <section className="lg:col-span-8 xl:col-span-9 flex min-h-0 flex-col rounded-3xl border bg-white/80 dark:bg-[#0E1116]/80 overflow-hidden">
                    {!activeConversation ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-3xl">✉️</div>
                                <p className="mt-4">Select a conversation to start chatting.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="px-5 py-4 border-b flex items-center justify-between">
                                <Link to={`/profile/${(activeConversation.participants || []).find((p) => p._id !== user._id)?._id}`} className="flex items-center gap-3">
                                    <img src={(activeConversation.participants || []).find((p) => p._id !== user._id)?.profilePicture || ''} alt="" className="h-10 w-10 rounded-full object-cover" />
                                    <div>
                                        <p className="font-medium">{(activeConversation.participants || []).find((p) => p._id !== user._id)?.name}</p>
                                        <p className="text-sm text-gray-500">@{(activeConversation.participants || []).find((p) => p._id !== user._id)?.username}</p>
                                    </div>
                                </Link>
                            </div>

                            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 space-y-4">
                                {messagesLoading ? (
                                    <div className="text-center text-sm text-gray-500">Loading messages...</div>
                                ) : messages.length === 0 ? (
                                    <div className="text-center text-sm text-gray-500">No messages yet — say hello.</div>
                                ) : (
                                    messages.map((m) => {
                                        const isMine = m.sender?._id === user._id;
                                        return (
                                            <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${isMine ? 'bg-[#F5C36B]' : 'bg-white border'}`}>
                                                    <p className="whitespace-pre-wrap text-sm">{m.text}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}</p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={bottomRef} />
                            </div>

                            <form onSubmit={handleSend} className="p-4 border-t">
                                <div className="flex items-end gap-3">
                                    <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} placeholder="Write a message" className="flex-1 resize-none rounded-lg border px-3 py-2" />
                                    <button disabled={sending || !text.trim()} className="px-4 py-2 rounded bg-[#D97B4F] text-white">Send</button>
                                </div>
                            </form>
                        </>
                    )}
                </section>
            </div>
        </div>
    );
}