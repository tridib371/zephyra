import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { getNotificationDetail, getNotificationMeta, getNotificationMessage, getNotificationTarget } from '../utils/notificationTools';

const Notifications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();

    const unreadNotifications = useMemo(
        () => notifications.filter(notification => !notification.read),
        [notifications]
    );

    const handleOpenNotification = async (notification) => {
        await markAsRead(notification._id);
        navigate(getNotificationTarget(notification));
    };

    const filters = [
        { key: 'all', label: 'All', count: notifications.length },
        { key: 'unread', label: 'Unread', count: unreadNotifications.length },
        { key: 'read', label: 'Read', count: Math.max(notifications.length - unreadNotifications.length, 0) },
    ];

    const activeNotifications = notifications;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,143,107,0.14),_transparent_38%),linear-gradient(180deg,_#fff_0%,_#fbf7f2_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(245,195,107,0.12),_transparent_34%),linear-gradient(180deg,_#0E1116_0%,_#0B0E13_100%)] px-4 sm:px-6 py-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-6">
                <motion.section
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2rem] border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] px-6 sm:px-8 py-7"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-[#FF8F6B]/10 via-transparent to-[#F5C36B]/10 pointer-events-none" />
                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="inline-flex items-center gap-2 rounded-full bg-[#FFF1EA] dark:bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase text-[#B5652F] dark:text-[#F5C36B]">
                                Inbox
                            </p>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-['Fraunces'] italic text-gray-900 dark:text-white">
                                Your notification stream
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-600 dark:text-[#A0A6B6]">
                                One place for follows, likes, and comments with fast read, delete, and deep-link navigation.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                                className="px-4 py-2 rounded-full bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-sm font-semibold shadow-lg shadow-orange-200/40 dark:shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Mark all read
                            </button>
                            <button
                                onClick={fetchNotifications}
                                className="px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] hover:bg-white dark:hover:bg-white/10 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {filters.map(filter => (
                            <div key={filter.key} className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/75 dark:bg-white/5 px-4 py-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-[#8A8F9C]">{filter.label}</p>
                                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{filter.count}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                <section className="flex flex-wrap gap-2">
                    {['all', 'unread', 'read'].map((key) => {
                        const label = key.charAt(0).toUpperCase() + key.slice(1);
                        return (
                            <button
                                key={key}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${key === 'all' ? 'bg-gray-900 text-white dark:bg-white dark:text-[#11151D] border-transparent' : 'bg-white/70 dark:bg-white/5 text-gray-700 dark:text-[#E7E6E3] border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </section>

                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                    {loading ? (
                        <div className="rounded-[1.75rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80 p-8 text-center text-gray-500 dark:text-[#A0A6B6]">
                            Loading notifications...
                        </div>
                    ) : activeNotifications.length === 0 ? (
                        <div className="rounded-[1.75rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80 p-10 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF8F6B]/15 to-[#F5C36B]/15 text-2xl">
                                🔔
                            </div>
                            <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No notifications yet</h2>
                            <p className="mt-2 text-sm text-gray-500 dark:text-[#A0A6B6]">When people like, comment, or follow you, they will appear here.</p>
                            <Link
                                to={user ? '/feed' : '/login'}
                                className="mt-5 inline-flex rounded-full bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] px-5 py-2.5 text-sm font-semibold text-[#1A140D]"
                            >
                                Go to feed
                            </Link>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {activeNotifications.map((notification, index) => {
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
                                        className={`group rounded-[1.75rem] border p-4 sm:p-5 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)] cursor-pointer ${unread ? 'border-[#FF8F6B]/25 bg-[#FFF8F4] dark:bg-white/6' : 'border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80'}`}
                                        onClick={() => handleOpenNotification(notification)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="relative shrink-0">
                                                <img
                                                    src={notification.sender?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                    alt={notification.sender?.name || 'Sender'}
                                                    className="h-12 w-12 rounded-2xl object-cover ring-2 ring-white dark:ring-[#0E1116]"
                                                    onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }}
                                                />
                                                <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-white dark:border-[#0E1116] bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[11px]">
                                                    {meta.icon}
                                                </span>
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className={`text-sm sm:text-base ${unread ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-[#C4CAD7]'}`}>
                                                            {getNotificationMessage(notification)}
                                                        </p>
                                                        {detail && (
                                                            <p className="mt-1 text-sm text-gray-600 dark:text-[#A0A6B6] line-clamp-2">
                                                                {detail}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-r ${meta.accent} bg-white/80 dark:bg-white/5`}>
                                                        {meta.icon} {meta.label}
                                                    </span>
                                                </div>

                                                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-[#8A8F9C]">
                                                    <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                                    {notification.post?.content && (
                                                        <span className="rounded-full bg-gray-100 dark:bg-white/5 px-2.5 py-1">Linked post</span>
                                                    )}
                                                    {unread && (
                                                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-emerald-600 dark:text-emerald-300">Unread</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-end gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(notification._id);
                                                    }}
                                                    className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                                                    aria-label="Delete notification"
                                                >
                                                    ✕
                                                </button>
                                                {notification.post?.image && (
                                                    <img
                                                        src={notification.post.image}
                                                        alt="Related media"
                                                        className="hidden sm:block h-16 w-16 rounded-2xl object-cover ring-1 ring-gray-200 dark:ring-white/10"
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