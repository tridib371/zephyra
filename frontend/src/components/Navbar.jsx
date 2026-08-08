import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { getNotificationDetail, getNotificationMessage, getNotificationMeta, getNotificationTarget } from '../utils/notificationTools';

const FeatherMark = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13a1.5 1.5 0 0 1 1.06 2.56L9.62 16.5H18.5a1.5 1.5 0 0 1 0 3h-13a1.5 1.5 0 0 1-1.06-2.56L14.38 7.5H5.5A1.5 1.5 0 0 1 4 5.5z" />
    </svg>
);

const PlusGustIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
);

const CompassIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" />
        <path d="m14.5 9.5-2 5-3 1.5 2-5 3-1.5Z" strokeLinejoin="round" />
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
);

const BellIcon = ({ hasUnread = false }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 relative">
        <path d="M6 8a6 6 0 0 1 12 0c0 4.2 1.2 6 2 7H4c.8-1 2-2.8 2-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 18a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
        {hasUnread && <circle cx="19" cy="5" r="3.5" fill="#EF4444" stroke="white" strokeWidth="1.5" />}
    </svg>
);

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4 17 17M7 7 5.6 5.6" strokeLinecap="round" />
    </svg>
);

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
);

const ProfileGlyphIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5" strokeLinecap="round" />
    </svg>
);

const GearIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.2l1.9-1.5-2-3.4-2.2.9a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2l-2.2-.9-2 3.4L5.1 10.8A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-1.9 1.5 2 3.4 2.2-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.2.9 2-3.4-1.9-1.5c.1-.4.1-.8.1-1.2Z" strokeLinejoin="round" />
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HamburgerIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        {open ? (
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        ) : (
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        )}
    </svg>
);

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { notifications, unreadCount, unreadMessageCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setIsNotificationOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsRead(notification._id);
        }
        setIsNotificationOpen(false);
        const target = getNotificationTarget(notification);
        if (target) {
            navigate(target);
        }
    };

    const handleDeleteNotification = async (event, notification) => {
        event.stopPropagation();
        await deleteNotification(notification._id);
    };

    const iconButtonClasses = "p-2 rounded-full text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-all duration-200 cursor-pointer";

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-gray-200/70 dark:border-[#1F232C] bg-[#FAF7F2]/80 dark:bg-[#0B0D10]/80 backdrop-blur-xl transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-linear-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-[0_10px_24px_-10px_rgba(217,123,79,0.7)] group-hover:scale-105 transition-transform duration-200">
                                <FeatherMark />
                            </span>
                            <span className="font-['Fraunces'] font-bold text-xl tracking-tight text-gray-900 dark:text-[#EDEBE6]">
                                Zephyra<span className="text-[#D97B4F] dark:text-[#F5C36B]"> </span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-2 font-[Manrope]">
                        <Link to="/search" className={iconButtonClasses} title="Search">
                            <SearchIcon />
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/create" className="flex items-center gap-1.5 ml-1 px-4 py-2 bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-sm font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)] transition-all duration-200">
                                    <PlusGustIcon /> New Post
                                </Link>
                                <Link to="/discover" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors duration-200">
                                    <CompassIcon /> Discover
                                </Link>
                                <Link to="/messages" className="relative flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors duration-200">
                                    <MessageIcon /> Messages
                                    {unreadMessageCount > 0 && (
                                        <span className="ml-1 grid min-h-4.5 min-w-4.5 place-items-center rounded-full bg-[#D97B4F] px-1.5 text-[10px] font-bold leading-none text-white">
                                            {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                        </span>
                                    )}
                                </Link>

                                <div className="relative" ref={notificationRef}>
                                    <button
                                        onClick={() => setIsNotificationOpen(prev => !prev)}
                                        className={iconButtonClasses}
                                        aria-label="Notifications"
                                    >
                                        <BellIcon hasUnread={unreadCount > 0} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 grid min-h-4.5 min-w-4.5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isNotificationOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                                className="absolute right-0 mt-3 w-88 rounded-3xl border border-gray-200/70 dark:border-[#1F232C] bg-white/95 dark:bg-[#11151D]/95 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] overflow-hidden z-50"
                                            >
                                                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-[#1F232C]">
                                                    <div>
                                                        <p className="text-xs uppercase tracking-[0.2em] text-[#D97B4F] dark:text-[#F5C36B]">Inbox</p>
                                                        <h4 className="font-['Fraunces'] italic text-lg text-gray-900 dark:text-[#EDEBE6]">Notifications</h4>
                                                    </div>
                                                    {unreadCount > 0 && (
                                                        <button onClick={markAllAsRead} className="text-xs font-semibold text-[#D97B4F] dark:text-[#F5C36B] hover:underline">
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="max-h-96 overflow-y-auto">
                                                    {notifications.length === 0 ? (
                                                        <div className="px-5 py-10 text-center text-sm text-gray-500 dark:text-[#8A8F9C]">
                                                            No notifications yet.
                                                        </div>
                                                    ) : (
                                                        notifications.map((notification) => {
                                                            const unread = !notification.read;
                                                            const meta = getNotificationMeta(notification);
                                                            const detail = getNotificationDetail(notification);

                                                            return (
                                                                <div
                                                                    key={notification._id}
                                                                    onClick={() => handleNotificationClick(notification)}
                                                                    className={`flex items-start gap-3 px-5 py-4 border-b border-gray-100/70 dark:border-[#1F232C]/60 hover:bg-[#FAF7F2]/80 dark:hover:bg-[#1A1E27] transition-colors cursor-pointer ${unread ? 'bg-[#FFF8F4] dark:bg-white/5' : ''}`}
                                                                >
                                                                    <img
                                                                        src={notification.sender?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                                        alt={notification.sender?.name || 'Sender'}
                                                                        className="h-10 w-10 rounded-2xl object-cover shrink-0"
                                                                        onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }}
                                                                    />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className={`text-sm ${unread ? 'font-semibold text-gray-900 dark:text-[#EDEBE6]' : 'text-gray-600 dark:text-[#A0A6B6]'}`}>
                                                                            {getNotificationMessage(notification)}
                                                                        </p>
                                                                        {detail && (
                                                                            <p className="mt-1 text-xs text-gray-500 dark:text-[#8A8F9C] line-clamp-2">
                                                                                {detail}
                                                                            </p>
                                                                        )}
                                                                        <p className="mt-1 text-[11px] text-gray-400 dark:text-[#6E7280]">
                                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={(event) => handleDeleteNotification(event, notification)}
                                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                                        aria-label="Delete notification"
                                                                    >
                                                                        <TrashIcon />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>

                                                <div className="border-t border-gray-100 dark:border-[#1F232C] px-5 py-3 bg-[#FAF7F2]/50 dark:bg-[#0E1116]/50">
                                                    <Link
                                                        to="/notifications"
                                                        onClick={() => setIsNotificationOpen(false)}
                                                        className="block rounded-full bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] px-4 py-2 text-center text-sm font-semibold text-[#1A140D] hover:brightness-105 transition-all"
                                                    >
                                                        View all notifications
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : null}

                        <button
                            onClick={toggleTheme}
                            className={iconButtonClasses}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>

                        {isAuthenticated ? (
                            <div className="relative ml-1" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(prev => !prev)}
                                    className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#FF8F6B]/40 transition-all cursor-pointer"
                                >
                                    <img
                                        src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=D97B4F&color=fff`}
                                        alt={user?.name || 'User Profile'}
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=D97B4F&color=fff`;
                                        }}
                                        className="h-9 w-9 rounded-full object-cover border-2 border-[#D97B4F] dark:border-[#F5C36B]"
                                    />
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            className="absolute right-0 mt-3 w-56 rounded-3xl border border-gray-200/70 dark:border-[#1F232C] bg-white/95 dark:bg-[#11151D]/95 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] overflow-hidden z-50 py-2"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-[#1F232C]">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-[#EDEBE6] truncate">{user?.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C] truncate">@{user?.username}</p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors"
                                                >
                                                    <ProfileGlyphIcon /> Profile
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors"
                                                >
                                                    <GearIcon /> Settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-gray-100 dark:border-[#1F232C] pt-1 mt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-sm text-[#C4573F] dark:text-[#FF8F6B] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] transition-colors"
                                                >
                                                    <LogoutIcon /> Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 ml-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-sm font-semibold rounded-full hover:brightness-105 transition-all shadow-xs"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className={iconButtonClasses}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>

                        {isAuthenticated && (
                            <button
                                onClick={() => setIsNotificationOpen(prev => !prev)}
                                className={iconButtonClasses}
                                aria-label="Notifications"
                            >
                                <BellIcon hasUnread={unreadCount > 0} />
                            </button>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                            className={iconButtonClasses}
                            aria-label="Toggle menu"
                        >
                            <HamburgerIcon open={isMobileMenuOpen} />
                        </button>
                    </div>
                </div>

                {isAuthenticated && isMobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-1 border-t border-gray-200 dark:border-[#1F232C] pt-3 font-[Manrope]">
                        <Link to="/search" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <SearchIcon /> Search
                        </Link>
                        <Link to="/create" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <PlusGustIcon /> New Post
                        </Link>
                        <Link to="/discover" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <CompassIcon /> Discover
                        </Link>
                        <Link to="/messages" className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <span className="flex items-center gap-2.5"><MessageIcon /> Messages</span>
                            {unreadMessageCount > 0 && (
                                <span className="grid min-h-4.5 min-w-4.5 place-items-center rounded-full bg-[#D97B4F] px-1.5 text-[10px] font-bold leading-none text-white">
                                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/feed" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <MessageIcon /> Feed
                        </Link>
                        <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <ProfileGlyphIcon /> Profile
                        </Link>
                        <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <GearIcon /> Settings
                        </Link>
                        <hr className="my-1.5 border-gray-200 dark:border-[#1F232C]" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-medium text-[#C4573F] dark:text-[#FF8F6B] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] rounded-xl transition-colors">
                            <LogoutIcon /> Logout
                        </button>
                    </div>
                )}

                <AnimatePresence>
                    {isNotificationOpen && isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="md:hidden fixed inset-x-4 top-18 z-50 rounded-3xl border border-gray-200/70 dark:border-[#1F232C] bg-white/95 dark:bg-[#11151D]/95 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-[#1F232C]">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#D97B4F] dark:text-[#F5C36B]">Inbox</p>
                                    <h4 className="font-['Fraunces'] italic text-lg text-gray-900 dark:text-[#EDEBE6]">Notifications</h4>
                                </div>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="text-xs font-semibold text-[#D97B4F] dark:text-[#F5C36B] hover:underline">
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-104 overflow-y-auto">
                                {notifications.slice(0, 4).length === 0 ? (
                                    <div className="px-5 py-10 text-center text-sm text-gray-500 dark:text-[#8A8F9C]">No notifications yet.</div>
                                ) : (
                                    notifications.slice(0, 4).map((notification) => {
                                        const unread = !notification.read;
                                        const meta = getNotificationMeta(notification);
                                        const detail = getNotificationDetail(notification);

                                        return (
                                            <div
                                                key={notification._id}
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`flex items-start gap-3 px-4 py-4 ${unread ? 'bg-[#FFF8F4] dark:bg-white/5' : ''}`}
                                            >
                                                <img
                                                    src={notification.sender?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                    alt={notification.sender?.name || 'Sender'}
                                                    className="h-10 w-10 rounded-2xl object-cover shrink-0"
                                                    onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }}
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <p className={`text-sm ${unread ? 'font-semibold text-gray-900 dark:text-[#EDEBE6]' : 'text-gray-600 dark:text-[#A0A6B6]'}`}>
                                                        {getNotificationMessage(notification)}
                                                    </p>
                                                    {detail && <p className="mt-1 text-xs text-gray-500 dark:text-[#8A8F9C] line-clamp-2">{detail}</p>}
                                                    <p className="mt-1 text-[11px] text-gray-400 dark:text-[#6E7280]">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</p>
                                                </div>
                                                <button onClick={(event) => handleDeleteNotification(event, notification)} className="text-gray-400 hover:text-red-500" aria-label="Delete notification">
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <div className="border-t border-gray-100 dark:border-[#1F232C] px-4 py-3">
                                <Link to="/notifications" onClick={() => setIsNotificationOpen(false)} className="block rounded-full bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] px-4 py-2 text-center text-sm font-semibold text-[#1A140D]">
                                    Open inbox
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;