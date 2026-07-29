import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import io from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Messages = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [socketReady, setSocketReady] = useState(false);
    const socketRef = useRef(null);
    const bottomRef = useRef(null);

    const activePartner = useMemo(() => {
        if (!activeConversation || !user) return null;
        return activeConversation.participants.find((participant) => participant._id !== user._id) || null;
    }, [activeConversation, user]);

    const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            setConversations(res.data.conversations || []);
        } catch (error) {
            console.error('Fetch conversations error:', error);
        } finally {
            setLoading(false);
        }
    };

    const openConversation = async (conversation) => {
        if (!conversation) return;

        setActiveConversation(conversation);
        setMessagesLoading(true);
        setSearchParams({ conversationId: conversation._id });

        try {
            const res = await api.get(`/messages/conversations/${conversation._id}`);
            setMessages(res.data.messages || []);
            await api.put(`/messages/conversations/${conversation._id}/read`);
            setConversations((prev) => prev.map((item) => item._id === conversation._id ? { ...item, unreadCount: 0 } : item));
        } catch (error) {
            console.error('Open conversation error:', error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const startConversationWithUser = async (userId) => {
        try {
            const res = await api.post(`/messages/conversations/${userId}`);
            const createdConversation = res.data.conversation;
            await fetchConversations();
            await openConversation(createdConversation);
        } catch (error) {
            console.error('Start conversation error:', error);
        }
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (!user) return undefined;

        const socket = io('http://localhost:5000', { transports: ['websocket'] });
        socketRef.current = socket;

        socket.emit('join', user._id);

        socket.on('message:new', ({ message, conversationId }) => {
            setConversations((prev) => prev.map((conversation) => {
                if (conversation._id !== conversationId) {
                    return conversation;
                }

                return {
                    ...conversation,
                    lastMessage: message,
                    lastMessageAt: new Date(),
                    unreadCount: activeConversation?._id === conversationId && message.sender?._id !== user._id ? 0 : (conversation.unreadCount || 0) + (message.sender?._id === user._id ? 0 : 1),
                };
            }));

            if (activeConversation?._id === conversationId) {
                setMessages((prev) => {
                    const exists = prev.some((item) => item._id === message._id);
                    return exists ? prev : [...prev, message];
                });
                scrollToBottom();
            }
        });

        setSocketReady(true);

        return () => socket.disconnect();
    }, [user, activeConversation]);

    useEffect(() => {
        const conversationId = searchParams.get('conversationId');
        const userId = searchParams.get('userId');

        if (conversationId && conversations.length > 0) {
            const target = conversations.find((conversation) => conversation._id === conversationId);
            if (target) {
                openConversation(target);
            }
            return;
        }

        if (userId) {
            startConversationWithUser(userId);
        }
    }, [conversations]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (event) => {
        event.preventDefault();
        if (!activeConversation || !messageText.trim()) return;

        try {
            const res = await api.post(`/messages/conversations/${activeConversation._id}`, { text: messageText });
            setMessages((prev) => [...prev, res.data.message]);
            setMessageText('');
            setConversations((prev) => prev.map((conversation) => conversation._id === activeConversation._id ? { ...conversation, lastMessage: res.data.message, lastMessageAt: new Date() } : conversation));
        } catch (error) {
            console.error('Send message error:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,143,107,0.12),transparent_38%),linear-gradient(180deg,#fff_0%,#fbf7f2_100%)] dark:bg-[radial-gradient(circle_at_top,rgba(245,195,107,0.12),transparent_34%),linear-gradient(180deg,#0E1116_0%,#0B0E13_100%)] px-4 sm:px-6 py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid gap-6 lg:grid-cols-12">
                <motion.aside initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4 xl:col-span-3 rounded-4xl border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] overflow-hidden">
                    <div className="border-b border-gray-100 dark:border-[#1F232C] px-5 py-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-[#D97B4F] dark:text-[#F5C36B]">Direct Messages</p>
                        <h1 className="mt-1 text-2xl font-['Fraunces'] italic text-gray-900 dark:text-white">Chats</h1>
                    </div>
                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                        {loading ? (
                            <div className="p-5 text-sm text-gray-500 dark:text-[#8A8F9C]">Loading conversations...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-5 text-sm text-gray-500 dark:text-[#8A8F9C]">
                                No conversations yet. Use search or visit a profile to start a chat.
                            </div>
                        ) : (
                            conversations.map((conversation) => {
                                const partner = conversation.participants.find((participant) => participant._id !== user._id);
                                const unreadCount = conversation.unreadCount || 0;
                                const lastMessageText = conversation.lastMessage?.text || 'No messages yet';

                                return (
                                    <button
                                        key={conversation._id}
                                        onClick={() => openConversation(conversation)}
                                        className={`w-full border-b border-gray-100 dark:border-[#1F232C] px-5 py-4 text-left transition-colors ${activeConversation?._id === conversation._id ? 'bg-[#FFF7F2] dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img src={partner?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt={partner?.name} className="h-12 w-12 rounded-2xl object-cover" />
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="truncate font-semibold text-gray-900 dark:text-white">{partner?.name || 'Unknown user'}</p>
                                                    {unreadCount > 0 && <span className="rounded-full bg-[#D97B4F] px-2 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>}
                                                </div>
                                                <p className="truncate text-sm text-gray-500 dark:text-[#8A8F9C]">@{partner?.username}</p>
                                                <p className="truncate text-xs text-gray-400 dark:text-[#6E7280]">{lastMessageText}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </motion.aside>

                <motion.section initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8 xl:col-span-9 rounded-4xl border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col min-h-[75vh]">
                    {!activeConversation ? (
                        <div className="flex flex-1 items-center justify-center p-8 text-center">
                            <div>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF8F6B]/15 to-[#F5C36B]/15 text-2xl">✉️</div>
                                <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">Choose a chat</h2>
                                <p className="mt-2 text-sm text-gray-500 dark:text-[#8A8F9C]">Select a conversation or start one from search.</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="border-b border-gray-100 dark:border-[#1F232C] px-5 py-4 flex items-center justify-between gap-4">
                                <Link to={`/profile/${activePartner?._id}`} className="flex items-center gap-3">
                                    <img src={activePartner?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt={activePartner?.name} className="h-11 w-11 rounded-2xl object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{activePartner?.name}</p>
                                        <p className="text-sm text-gray-500 dark:text-[#8A8F9C]">@{activePartner?.username}</p>
                                    </div>
                                </Link>
                                <span className="rounded-full border border-gray-200 dark:border-[#1F232C] px-3 py-1 text-xs text-gray-500 dark:text-[#8A8F9C]">
                                    {socketReady ? 'Live' : 'Connecting...'}
                                </span>
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4">
                                {messagesLoading ? (
                                    <div className="py-16 text-center text-sm text-gray-500 dark:text-[#8A8F9C]">Loading messages...</div>
                                ) : messages.length === 0 ? (
                                    <div className="py-16 text-center text-sm text-gray-500 dark:text-[#8A8F9C]">Say hello and start the conversation.</div>
                                ) : messages.map((message) => {
                                    const isOwn = message.sender?._id === user._id;
                                    return (
                                        <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] sm:max-w-[70%] rounded-3xl px-4 py-3 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)] ${isOwn ? 'bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D]' : 'bg-white dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] border border-gray-200 dark:border-[#1F232C]'}`}>
                                                <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6">{message.text}</p>
                                                <p className={`mt-2 text-[11px] ${isOwn ? 'text-[#1A140D]/70' : 'text-gray-400 dark:text-[#6E7280]'}`}>
                                                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </div>

                            <form onSubmit={handleSend} className="border-t border-gray-100 dark:border-[#1F232C] p-4 sm:p-5">
                                <div className="flex items-end gap-3">
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        rows="1"
                                        placeholder={`Message @${activePartner?.username}`}
                                        className="flex-1 resize-none rounded-[1.4rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]"
                                    />
                                    <button disabled={!messageText.trim()} className="rounded-full bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] px-5 py-3 text-sm font-semibold text-[#1A140D] disabled:opacity-50">
                                        Send
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </motion.section>
            </div>
        </div>
    );
};

export default Messages;