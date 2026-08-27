import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
    HiOutlineHeart,
    HiOutlineChatBubbleLeftRight,
    HiOutlineUserPlus,
    HiOutlineMegaphone,
    HiOutlineBell,
    HiOutlineXMark,
    HiOutlineCheckCircle,
    HiOutlineArrowPath
} from 'react-icons/hi2';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { getNotificationDetail, getNotificationMeta, getNotificationMessage, getNotificationTarget } from '../utils/notificationTools';

// ===== UNIQUE SIGNAL BEACON & PULSE WAVE BACKGROUND ANIMATION =====
const NotificationsBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <style>{`
                @keyframes beaconExpand {
                    0% { transform: scale(0.6); opacity: 0.8; }
                    50% { opacity: 0.4; }
                    100% { transform: scale(2.6); opacity: 0; }
                }
                @keyframes pulseFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.35; }
                    50% { transform: translateY(-22px) rotate(6deg); opacity: 0.85; }
                }
                @keyframes bellWiggle {
                    0%, 100% { transform: rotate(0deg); }
                    15% { transform: rotate(14deg); }
                    30% { transform: rotate(-12deg); }
                    45% { transform: rotate(8deg); }
                    60% { transform: rotate(0deg); }
                }
                @keyframes ambientPulse {
                    0%, 100% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.15); opacity: 0.65; }
                }
                .animate-beacon-1 { animation: beaconExpand 5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; }
                .animate-beacon-2 { animation: beaconExpand 5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 1.6s; }
                .animate-beacon-3 { animation: beaconExpand 5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 3.2s; }
                .animate-pulse-1 { animation: pulseFloat 7s ease-in-out infinite; }
                .animate-pulse-2 { animation: pulseFloat 9s ease-in-out infinite 2s; }
                .animate-pulse-3 { animation: pulseFloat 8s ease-in-out infinite 4s; }
                .animate-ambient-glow { animation: ambientPulse 8s ease-in-out infinite; }
            `}</style>

            {/* 1. Luminescent Ambient Glow Flares */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] rounded-full bg-gradient-to-b from-[#FF8F6B]/25 via-[#D97B4F]/15 to-transparent blur-3xl animate-ambient-glow" />
            <div className="absolute -bottom-24 -left-24 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tr from-[#F5C36B]/20 via-[#EA580C]/15 to-transparent blur-3xl" />
            <div className="absolute -bottom-24 -right-24 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tl from-[#FF8F6B]/20 via-[#D97B4F]/15 to-transparent blur-3xl" />

            {/* 2. Concentric Signal Radar Pulse Waves (Top Right) */}
            <div className="absolute -top-10 -right-10 w-[360px] sm:w-[560px] h-[360px] sm:h-[560px] flex items-center justify-center opacity-40 dark:opacity-25">
                <div className="absolute w-40 h-40 rounded-full border-2 border-[#D97B4F] dark:border-[#FF8F6B] animate-beacon-1" />
                <div className="absolute w-40 h-40 rounded-full border-2 border-[#F5C36B] dark:border-[#F5C36B] animate-beacon-2" />
                <div className="absolute w-40 h-40 rounded-full border-2 border-[#EA580C] dark:border-[#FF8F6B] animate-beacon-3" />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF8F6B] to-[#F5C36B] border-2 border-black dark:border-white/20 shadow-lg" />
            </div>

            {/* 3. Secondary Signal Pulse Transmitter (Bottom Left) */}
            <div className="absolute -bottom-12 -left-12 w-[280px] sm:w-[440px] h-[280px] sm:h-[440px] flex items-center justify-center opacity-40 dark:opacity-25">
                <div className="absolute w-32 h-32 rounded-full border-2 border-[#F5C36B] animate-beacon-1" />
                <div className="absolute w-32 h-32 rounded-full border-2 border-[#D97B4F] animate-beacon-2" />
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5C36B] to-[#EA580C] border-2 border-black dark:border-white/20 shadow-lg" />
            </div>

            {/* 4. Floating Interaction & Signal Glyphs */}
            <div className="absolute top-[22%] left-[8%] animate-pulse-1">
                <div className="px-3.5 py-1.5 rounded-full bg-[#FF8F6B]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-ping" />
                    🔔 Live Broadcast
                </div>
            </div>
            <div className="absolute top-[38%] right-[10%] animate-pulse-2">
                <div className="px-3.5 py-1.5 rounded-full bg-[#F5C36B]/25 text-[#9E3610] dark:text-[#F5C36B] border border-black/20 dark:border-[#F5C36B]/40 text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-xs">
                    ❤️ Social Signal
                </div>
            </div>
            <div className="absolute bottom-[28%] left-[14%] animate-pulse-3">
                <div className="px-3.5 py-1.5 rounded-full bg-[#EA580C]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase flex items-center gap-1.5 shadow-xs">
                    💬 Engagement Wave
                </div>
            </div>

            {/* 5. Telemetry Vector Coordinates */}
            <div className="absolute top-[14%] left-[28%] opacity-40 dark:opacity-30 text-[#D97B4F] dark:text-[#FF8F6B] text-xs font-black">
                + [TX_BEACON : SYNCED]
            </div>
            <div className="absolute bottom-[16%] right-[25%] opacity-40 dark:opacity-30 text-[#F5C36B] dark:text-[#F5C36B] text-xs font-black">
                + [STREAM_ID : 0xFE24]
            </div>
        </div>
    );
};

const Notifications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();
    const [activeFilter, setActiveFilter] = useState('all');

    const unreadNotifications = useMemo(
        () => notifications.filter(notification => !notification.read),
        [notifications]
    );

    const readNotifications = useMemo(
        () => notifications.filter(notification => notification.read),
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'unread') return unreadNotifications;
        if (activeFilter === 'read') return readNotifications;
        return notifications;
    }, [activeFilter, notifications, unreadNotifications, readNotifications]);

    const handleOpenNotification = async (notification) => {
        await markAsRead(notification._id);
        navigate(getNotificationTarget(notification));
    };

    const filters = [
        { key: 'all', label: 'All Signals', count: notifications.length },
        { key: 'unread', label: 'Unread', count: unreadNotifications.length },
        { key: 'read', label: 'Archived', count: readNotifications.length },
    ];

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] px-4 sm:px-6 py-10 font-[Manrope] transition-colors duration-300 overflow-x-hidden">
            {/* Unique Signal Beacon Background Animation */}
            <NotificationsBackgroundAnimation />

            <div className="relative z-10 max-w-5xl mx-auto space-y-6">
                {/* Header Banner */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl shadow-[6px_6px_0px_#000000] dark:shadow-2xl p-6 sm:p-9"
                >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF8F6B]/30 dark:bg-white/5 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#6B2207] dark:text-[#F5C36B] border border-black dark:border-[#FF8F6B]/40">
                                🔔 Live Notification Stream
                            </span>
                            <h1 className="mt-2.5 text-2xl sm:text-4xl font-extrabold font-['Fraunces'] italic tracking-tight text-[#1A0F08] dark:text-white">
                                Activity & Signal Stream
                            </h1>
                            <p className="mt-1 text-xs sm:text-sm font-extrabold text-[#5C361E] dark:text-[#A0A6B6]">
                                Real-time interaction pulses, likes, comments, and community connections.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <button
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                                className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-xs font-black uppercase tracking-wider border-2 border-black shadow-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
                            >
                                <HiOutlineCheckCircle className="text-sm stroke-[2.5]" />
                                <span>Mark All Read</span>
                            </button>
                            <button
                                onClick={fetchNotifications}
                                className="px-4 py-2 rounded-full border-2 border-black bg-[#E2B293] dark:bg-white/5 text-[#1A0F08] dark:text-[#EDEBE6] text-xs font-black uppercase tracking-wider hover:bg-[#D59E7C] transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                            >
                                <HiOutlineArrowPath className="text-sm stroke-[2.5]" />
                                <span>Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Metric Cards */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {filters.map((filter) => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key)}
                                className={`rounded-2xl border-2 border-black p-4 text-left transition-all cursor-pointer shadow-xs ${
                                    activeFilter === filter.key
                                        ? 'bg-[#1A0F08] text-white dark:bg-white dark:text-[#1A140D] scale-102'
                                        : 'bg-[#E2B293] dark:bg-[#0E1116] hover:bg-[#D59E7C] text-[#1A0F08] dark:text-white'
                                }`}
                            >
                                <p className={`text-[10px] font-black uppercase tracking-widest ${
                                    activeFilter === filter.key ? 'text-[#F5C36B] dark:text-[#D97B4F]' : 'text-[#5C361E] dark:text-[#8A8F9C]'
                                }`}>
                                    {filter.label}
                                </p>
                                <p className="mt-1 text-2xl font-black font-['Fraunces'] italic">{filter.count}</p>
                            </button>
                        ))}
                    </div>
                </motion.section>

                {/* Stream Content */}
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {loading ? (
                        <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 p-10 text-center text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#A0A6B6] shadow-[6px_6px_0px_#000000] flex items-center justify-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-black dark:border-[#FF8F6B] animate-spin" />
                            <span>Loading live signals...</span>
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 p-10 text-center shadow-[6px_6px_0px_#000000] dark:shadow-2xl">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E2B293] dark:bg-[#181C26] border-2 border-black text-[#9E3610] dark:text-[#FF8F6B] shadow-md">
                                <HiOutlineBell className="text-3xl stroke-[2.2]" />
                            </div>
                            <h2 className="mt-4 text-xl font-extrabold text-[#1A0F08] dark:text-white font-['Fraunces'] italic">
                                {activeFilter === 'unread' ? 'No unread notifications' : 'No notifications in this stream'}
                            </h2>
                            <p className="mt-1 text-xs font-bold text-[#5C361E] dark:text-[#A0A6B6]">
                                When people like your posts, comment, or follow your profile, their signals appear right here.
                            </p>
                            <Link
                                to={user ? '/feed' : '/login'}
                                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#1A140D] border-2 border-black shadow-xs hover:scale-105 transition-all"
                            >
                                Explore Community Feed →
                            </Link>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredNotifications.map((notification, index) => {
                                const meta = getNotificationMeta(notification);
                                const detail = getNotificationDetail(notification);
                                const unread = !notification.read;

                                return (
                                    <motion.article
                                        key={notification._id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.18, delay: Math.min(index * 0.02, 0.12) }}
                                        className={`group rounded-3xl border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_#000000] cursor-pointer transition-all hover:scale-[1.01] ${
                                            unread
                                                ? 'bg-[#FFE2D1] dark:bg-[#1A1E29] dark:border-[#FF8F6B]/60'
                                                : 'bg-[#F0C9AE] dark:bg-[#12151C]/92 dark:border-white/10'
                                        }`}
                                        onClick={() => handleOpenNotification(notification)}
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Avatar Frame */}
                                            <div className="relative shrink-0">
                                                <img
                                                    src={notification.sender?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender?.name || 'User')}&background=D97B4F&color=fff&bold=true`}
                                                    alt={notification.sender?.name || 'Sender'}
                                                    className="h-12 w-12 rounded-full object-cover border-2 border-black shadow-md bg-[#FAF7F2] dark:bg-[#181C26]"
                                                    onError={(e) => {
                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender?.name || 'User')}&background=D97B4F&color=fff&bold=true`;
                                                    }}
                                                />
                                                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-black bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[10px] text-[#1A140D] shadow-xs">
                                                    {notification.type === 'like' && <HiOutlineHeart className="text-xs stroke-[2.5]" />}
                                                    {notification.type === 'comment' && <HiOutlineChatBubbleLeftRight className="text-xs stroke-[2.5]" />}
                                                    {notification.type === 'follow' && <HiOutlineUserPlus className="text-xs stroke-[2.5]" />}
                                                    {notification.type === 'announcement' && <HiOutlineMegaphone className="text-xs stroke-[2.5]" />}
                                                    {!['like', 'comment', 'follow', 'announcement'].includes(notification.type) && <HiOutlineBell className="text-xs stroke-[2.5]" />}
                                                </span>
                                            </div>

                                            {/* Body */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className={`text-xs sm:text-sm font-extrabold ${unread ? 'text-[#1A0F08] dark:text-white' : 'text-[#402414] dark:text-[#C4CAD7]'}`}>
                                                            {getNotificationMessage(notification)}
                                                        </p>
                                                        {detail && (
                                                            <p className="mt-1 text-xs font-bold text-[#5C361E] dark:text-[#A0A6B6] line-clamp-2 leading-relaxed">
                                                                {detail}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-black bg-[#E2B293] dark:bg-white/5 text-[#1A0F08] dark:text-[#EDEBE6]">
                                                        {notification.type === 'like' && <HiOutlineHeart className="text-rose-600" />}
                                                        {notification.type === 'comment' && <HiOutlineChatBubbleLeftRight className="text-amber-600" />}
                                                        {notification.type === 'follow' && <HiOutlineUserPlus className="text-emerald-600" />}
                                                        {notification.type === 'announcement' && <HiOutlineMegaphone className="text-orange-600" />}
                                                        <span>{meta.label}</span>
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex flex-wrap items-center gap-2.5 text-[11px] font-extrabold text-[#5C361E] dark:text-[#8A8F9C]">
                                                    <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                                    {notification.post?.content && (
                                                        <span className="rounded-full bg-[#E2B293] dark:bg-white/5 px-2.5 py-0.5 border border-black/20 text-[#1A0F08] dark:text-[#EDEBE6]">Linked post</span>
                                                    )}
                                                    {unread && (
                                                        <span className="rounded-full bg-emerald-200 dark:bg-emerald-950/80 px-2.5 py-0.5 text-emerald-950 dark:text-emerald-300 font-black border border-black">New</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action / Thumbnail */}
                                            <div className="flex shrink-0 flex-col items-end gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification._id);
                                                    }}
                                                    className="rounded-full p-1.5 text-[#5C361E] dark:text-gray-400 hover:bg-rose-200 hover:text-rose-950 dark:hover:bg-rose-950 transition-all border border-transparent hover:border-black cursor-pointer"
                                                    aria-label="Delete notification"
                                                >
                                                    <HiOutlineXMark className="h-4 w-4 stroke-[2.5]" />
                                                </button>
                                                {notification.post?.image && (
                                                    <img
                                                        src={notification.post.image}
                                                        alt="Related media"
                                                        className="hidden sm:block h-14 w-14 rounded-2xl object-cover border-2 border-black shadow-xs"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    )}
                </motion.section>
            </div>
        </div>
    );
};

export default Notifications;