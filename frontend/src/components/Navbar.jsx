import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
);

const CompassIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
        <circle cx="12" cy="12" r="9" />
        <path d="m14.5 9.5-2 5-3 1.5 2-5 3-1.5Z" strokeLinejoin="round" />
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
        <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
);

const FeedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
        <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
    </svg>
);

const BellIcon = ({ hasUnread = false }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M6 8a6 6 0 0 1 12 0c0 4.2 1.2 6 2 7H4c.8-1 2-2.8 2-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 18a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
        {hasUnread && <circle cx="18.5" cy="5.5" r="3" fill="#D97B4F" />}
    </svg>
);

const SunIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5 text-amber-500">
        <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2" />
        <path d="M12 2.5v2M12 19.5v2M21.5 12h-2M4.5 12h-2M18.4 5.6l-1.4 1.4M7 17l-1.4 1.4M18.4 18.4 17 17M7 7 5.6 5.6" strokeLinecap="round" />
    </svg>
);

const MoonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5 text-amber-400">
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" fill="currentColor" fillOpacity="0.2" strokeLinejoin="round" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
);

const ProfileGlyphIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 20c1.2-3.4 4-5 7-5s5.8 1.6 7 5" strokeLinecap="round" />
    </svg>
);

const GearIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <circle cx="12" cy="12" r="3" />
        <path d="M19 12a7 7 0 0 0-.1-1.2l1.9-1.5-2-3.4-2.2.9a7 7 0 0 0-2-1.2L14.2 3h-4.4l-.4 2.6a7 7 0 0 0-2 1.2l-2.2-.9-2 3.4L5.1 10.8A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-1.9 1.5 2 3.4 2.2-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.2.9 2-3.4-1.9-1.5c.1-.4.1-.8.1-1.2Z" strokeLinejoin="round" />
    </svg>
);

const LogoutIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M9 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ShieldKeyIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
        <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HamburgerIcon = ({ open }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
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
    const location = useLocation();

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

    const isActive = (path) => location.pathname === path;

    const navLinkClasses = (path) => `
        flex items-center gap-2 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold rounded-full transition-all duration-200 cursor-pointer font-[Manrope]
        ${isActive(path)
            ? 'bg-[#FF8F6B]/20 dark:bg-[#FF8F6B]/25 text-[#F5C36B] dark:text-[#F5C36B] border border-[#FF8F6B]/40 dark:border-[#FF8F6B]/50 shadow-xs'
            : 'text-[#E2E8F0] dark:text-[#E2E8F0] hover:bg-[#1E2638] dark:hover:bg-[#252D3D] hover:text-[#FF8F6B] dark:hover:text-[#FF8F6B]'
        }
    `;

    const iconBtnClasses = `
        p-2 rounded-full text-[#E2E8F0] dark:text-[#E2E8F0] hover:bg-[#1E2638] dark:hover:bg-[#252D3D] 
        hover:text-[#FF8F6B] dark:hover:text-[#FF8F6B] transition-all duration-200 cursor-pointer relative
        border border-transparent hover:border-[#2E3B52] dark:hover:border-[#3A475C]
    `;

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-[#252E42] dark:border-[#2D3748] bg-[#141824] dark:bg-[#1A202C] backdrop-blur-2xl shadow-[0_8px_30px_rgba(15,23,42,0.25)] dark:shadow-[0_10px_35px_rgba(0,0,0,0.6)] transition-colors duration-300">
            {/* Signature Radiant Sunset Ember Top Line */}
            <div className="h-[3px] w-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <span className="grid h-9.5 w-9.5 place-items-center rounded-2xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-[0_8px_20px_-4px_rgba(255,143,107,0.5)] group-hover:scale-105 group-hover:shadow-[0_10px_25px_-2px_rgba(255,143,107,0.7)] transition-all duration-300 ring-2 ring-[#FF8F6B]/40">
                                <FeatherMark />
                            </span>
                            <span className="font-['Fraunces'] font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#FF8F6B] via-[#F5C36B] to-[#FF8F6B] bg-clip-text text-transparent">
                                Zephyra
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center gap-2">
                        {isAuthenticated ? (
                            <>
                                <Link to="/feed" className={navLinkClasses('/feed')}>
                                    <FeedIcon /> Feed
                                </Link>

                                <Link to="/discover" className={navLinkClasses('/discover')}>
                                    <CompassIcon /> Discover
                                </Link>

                                <Link to="/messages" className={navLinkClasses('/messages')}>
                                    <MessageIcon /> Messages
                                    {unreadMessageCount > 0 && (
                                        <span className="ml-1 grid min-h-4.5 min-w-4.5 place-items-center rounded-full bg-[#FF8F6B] px-1.5 text-[10px] font-extrabold leading-none text-[#1A140D] shadow-xs">
                                            {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                        </span>
                                    )}
                                </Link>

                                <Link to="/search" className={iconBtnClasses} title="Search Users & Posts">
                                    <SearchIcon />
                                </Link>

                                {/* New Post Pulsing CTA */}
                                <Link
                                    to="/create"
                                    className="flex items-center gap-1.5 ml-2 px-4.5 py-2 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-xs sm:text-sm font-extrabold rounded-full hover:brightness-110 hover:scale-105 shadow-[0_6px_20px_-4px_rgba(255,143,107,0.5)] transition-all duration-300 font-[Manrope]"
                                >
                                    <PlusGustIcon /> New Post
                                </Link>

                                {/* Notifications Button */}
                                <div className="relative ml-1" ref={notificationRef}>
                                    <button
                                        onClick={() => setIsNotificationOpen(prev => !prev)}
                                        className={iconBtnClasses}
                                        aria-label="Notifications"
                                        title="Notifications"
                                    >
                                        <BellIcon hasUnread={unreadCount > 0} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-0.5 -right-0.5 grid min-h-4.5 min-w-4.5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-extrabold leading-none text-white shadow-xs">
                                                {unreadCount > 99 ? '99+' : unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* Notification Dropdown Drawer */}
                                    <AnimatePresence>
                                        {isNotificationOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute right-0 mt-3 w-88 rounded-3xl border border-[#252E42] dark:border-[#2D3748] bg-[#141824] dark:bg-[#161B26] backdrop-blur-2xl shadow-2xl overflow-hidden z-50 text-[#E2E8F0]"
                                            >
                                                <div className="flex items-center justify-between px-5 py-4 border-b border-[#252E42] dark:border-[#2D3748] bg-[#1B2130] dark:bg-[#1E2638]">
                                                    <div>
                                                        <p className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-[#F5C36B]">Realtime Inbox</p>
                                                        <h4 className="font-['Fraunces'] italic text-lg font-bold text-white">Notifications</h4>
                                                    </div>
                                                    {unreadCount > 0 && (
                                                        <button onClick={markAllAsRead} className="text-xs font-bold text-[#F5C36B] hover:underline cursor-pointer">
                                                            Mark all read
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="max-h-96 overflow-y-auto divide-y divide-[#252E42] dark:divide-[#2D3748]">
                                                    {notifications.length === 0 ? (
                                                        <div className="px-5 py-10 text-center text-xs font-semibold text-[#94A3B8]">
                                                            No notifications yet.
                                                        </div>
                                                    ) : (
                                                        notifications.map((notification) => {
                                                            const unread = !notification.read;
                                                            const detail = getNotificationDetail(notification);

                                                            return (
                                                                <div
                                                                    key={notification._id}
                                                                    onClick={() => handleNotificationClick(notification)}
                                                                    className={`flex items-start gap-3 px-5 py-4 transition-colors cursor-pointer ${unread
                                                                            ? 'bg-[#1E273A] dark:bg-[#202838] hover:bg-[#253046] dark:hover:bg-[#283348]'
                                                                            : 'hover:bg-[#1B2130] dark:hover:bg-[#1E2638]'
                                                                        }`}
                                                                >
                                                                    <img
                                                                        src={notification.sender?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender?.name || 'User')}&background=D97B4F&color=fff`}
                                                                        alt={notification.sender?.name || 'Sender'}
                                                                        className="h-10 w-10 rounded-2xl object-cover shrink-0 ring-2 ring-[#FF8F6B]/40"
                                                                        onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(notification.sender?.name || 'User')}&background=D97B4F&color=fff`; }}
                                                                    />
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className={`text-xs sm:text-sm ${unread ? 'font-bold text-white' : 'text-[#CBD5E1]'}`}>
                                                                            {getNotificationMessage(notification)}
                                                                        </p>
                                                                        {detail && (
                                                                            <p className="mt-1 text-xs text-[#94A3B8] line-clamp-2 font-medium">
                                                                                {detail}
                                                                            </p>
                                                                        )}
                                                                        <p className="mt-1 text-[10px] font-semibold text-[#64748B]">
                                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={(event) => handleDeleteNotification(event, notification)}
                                                                        className="text-gray-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                                                                        aria-label="Delete notification"
                                                                    >
                                                                        <TrashIcon />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>

                                                <div className="border-t border-[#252E42] dark:border-[#2D3748] px-5 py-3 bg-[#1B2130] dark:bg-[#1E2638]">
                                                    <Link
                                                        to="/notifications"
                                                        onClick={() => setIsNotificationOpen(false)}
                                                        className="block rounded-full bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] px-4 py-2 text-center text-xs font-extrabold text-[#1A140D] hover:brightness-110 transition-all shadow-xs"
                                                    >
                                                        View all notifications →
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        ) : (
                            <Link to="/search" className={iconBtnClasses} title="Search Users & Posts">
                                <SearchIcon />
                            </Link>
                        )}

                        {/* Theme Toggle Pill */}
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#2E3B52] dark:border-[#3A475C] bg-[#1E2638] dark:bg-[#202736] text-[#F1F5F9] hover:bg-[#28334A] dark:hover:bg-[#293246] backdrop-blur-md transition-all cursor-pointer shadow-xs ml-1"
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                            <span className="text-xs font-extrabold font-[Manrope]">
                                {theme === 'dark' ? 'Light' : 'Dark'}
                            </span>
                        </button>

                        {/* Profile Dropdown or Auth CTA */}
                        {isAuthenticated ? (
                            <div className="relative ml-2" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(prev => !prev)}
                                    className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-[#FF8F6B]/60 transition-all cursor-pointer"
                                >
                                    <img
                                        src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=D97B4F&color=fff`}
                                        alt={user?.name || 'User Profile'}
                                        referrerPolicy="no-referrer"
                                        onError={(e) => {
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=D97B4F&color=fff`;
                                        }}
                                        className="h-9 w-9 rounded-full object-cover border-2 border-[#FF8F6B] dark:border-[#F5C36B] shadow-xs"
                                    />
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-3 w-56 rounded-3xl border border-[#252E42] dark:border-[#2D3748] bg-[#141824] dark:bg-[#161B26] backdrop-blur-2xl shadow-2xl overflow-hidden z-50 py-2 text-[#E2E8F0]"
                                        >
                                            <div className="px-4 py-3 border-b border-[#252E42] dark:border-[#2D3748] bg-[#1B2130] dark:bg-[#1E2638]">
                                                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                                <p className="text-xs font-semibold text-[#94A3B8] truncate">@{user?.username}</p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/profile"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#E2E8F0] hover:bg-[#1E2638] dark:hover:bg-[#202736] hover:text-[#FF8F6B] transition-colors"
                                                >
                                                    <ProfileGlyphIcon /> My Profile
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setIsProfileMenuOpen(false)}
                                                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-[#E2E8F0] hover:bg-[#1E2638] dark:hover:bg-[#202736] hover:text-[#FF8F6B] transition-colors"
                                                >
                                                    <GearIcon /> Settings
                                                </Link>
                                            </div>

                                            <div className="border-t border-[#252E42] dark:border-[#2D3748] pt-1 mt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                                >
                                                    <LogoutIcon /> Logout
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    to="/admin"
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-[#94A3B8] hover:text-[#FF8F6B] transition-colors"
                                    title="Administrator Portal"
                                >
                                    <ShieldKeyIcon />
                                    <span>Admin</span>
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-xs sm:text-sm font-bold text-[#E2E8F0] hover:text-[#FF8F6B] transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-xs sm:text-sm font-extrabold rounded-full hover:brightness-110 hover:scale-105 transition-all shadow-xs"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className={iconBtnClasses}
                            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                        >
                            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                        </button>

                        {isAuthenticated && (
                            <button
                                onClick={() => setIsNotificationOpen(prev => !prev)}
                                className={iconBtnClasses}
                                aria-label="Notifications"
                            >
                                <BellIcon hasUnread={unreadCount > 0} />
                            </button>
                        )}

                        <button
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                            className={iconBtnClasses}
                            aria-label="Toggle menu"
                        >
                            <HamburgerIcon open={isMobileMenuOpen} />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                {isMobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-1.5 border-t border-[#252E42] dark:border-[#2D3748] pt-3 font-[Manrope] bg-[#141824] dark:bg-[#161B26] backdrop-blur-2xl rounded-b-3xl px-2 mt-1 shadow-2xl text-[#E2E8F0]">
                        {isAuthenticated ? (
                            <>
                                <Link to="/feed" className={navLinkClasses('/feed')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <FeedIcon /> Feed
                                </Link>
                                <Link to="/discover" className={navLinkClasses('/discover')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <CompassIcon /> Discover
                                </Link>
                                <Link to="/messages" className={navLinkClasses('/messages')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <span className="flex items-center gap-2"><MessageIcon /> Messages</span>
                                    {unreadMessageCount > 0 && (
                                        <span className="ml-auto grid min-h-4.5 min-w-4.5 place-items-center rounded-full bg-[#FF8F6B] px-1.5 text-[10px] font-extrabold leading-none text-[#1A140D]">
                                            {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                                        </span>
                                    )}
                                </Link>
                                <Link to="/search" className={navLinkClasses('/search')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <SearchIcon /> Search
                                </Link>
                                <Link to="/create" className="flex items-center gap-2 px-4 py-2.5 text-xs font-extrabold text-[#1A140D] bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] rounded-full text-center shadow-xs" onClick={() => setIsMobileMenuOpen(false)}>
                                    <PlusGustIcon /> New Post
                                </Link>
                                <Link to="/profile" className={navLinkClasses('/profile')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <ProfileGlyphIcon /> Profile
                                </Link>
                                <Link to="/settings" className={navLinkClasses('/settings')} onClick={() => setIsMobileMenuOpen(false)}>
                                    <GearIcon /> Settings
                                </Link>
                                <hr className="my-2 border-[#252E42] dark:border-[#2D3748]" />
                                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-500/10 rounded-full transition-colors cursor-pointer">
                                    <LogoutIcon /> Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2 p-2">
                                <Link to="/login" className="px-4 py-2.5 text-center text-xs font-bold border border-[#252E42] dark:border-[#2D3748] rounded-full text-[#E2E8F0] bg-[#1B2130] dark:bg-[#1E2638]" onClick={() => setIsMobileMenuOpen(false)}>
                                    Sign In
                                </Link>
                                <Link to="/register" className="px-4 py-2.5 text-center text-xs font-extrabold bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] rounded-full shadow-xs" onClick={() => setIsMobileMenuOpen(false)}>
                                    Get Started
                                </Link>
                                <Link to="/admin" className="flex items-center justify-center gap-1.5 px-4 py-2 text-center text-xs font-bold text-[#94A3B8] hover:text-[#FF8F6B]" onClick={() => setIsMobileMenuOpen(false)}>
                                    <ShieldKeyIcon />
                                    <span>Admin Portal</span>
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;