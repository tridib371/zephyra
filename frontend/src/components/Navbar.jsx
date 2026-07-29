import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { getNotificationDetail, getNotificationMessage, getNotificationMeta, getNotificationTarget } from '../utils/notificationTools';

const FeatherMark = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M20.24 3.76 9.5 14.5a4.95 4.95 0 0 0 0 7 4.95 4.95 0 0 0 7 0L20.24 10a4.95 4.95 0 0 0 0-7 4.95 4.95 0 0 0-7 0Z" />
        <path d="M9 15 4 20" strokeLinecap="round" />
        <path d="M13.5 10.5 11 13" strokeLinecap="round" />
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
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileMenuOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(e.target)) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotificationClick = async (notification) => {
        await markAsRead(notification._id);
        setIsNotificationOpen(false);
        navigate(getNotificationTarget(notification));
    };

    const handleDeleteNotification = async (event, notification) => {
        event.stopPropagation();
        await deleteNotification(notification._id);
    };

    const notificationPreview = notifications.slice(0, 5);

    const iconButtonClasses =
        'p-2 rounded-full text-[#6E7280] dark:text-[#8A8F9C] hover:text-[#B5652F] dark:hover:text-[#F5C36B] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] transition-colors duration-200 relative';

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0E1116]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#1F232C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to={isAuthenticated ? '/feed' : '/'} className="flex items-center gap-2 shrink-0">
                        <span className="text-[#D97B4F] dark:text-[#F5C36B]"><FeatherMark /></span>
                        <span className="font-['Fraunces'] italic font-medium text-xl sm:text-2xl bg-linear-to-r from-[#D97B4F] via-[#C6822E] to-[#D97B4F] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent" style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}>Zephyra</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1.5 font-[Manrope]">
                        <button onClick={toggleTheme} className={iconButtonClasses} aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link to="/create" className="flex items-center gap-1.5 ml-1 px-4 py-2 bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-sm font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)] transition-all duration-200">
                                    <PlusGustIcon /> New Post
                                </Link>
                                <Link to="/discover" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors duration-200">
                                    <CompassIcon /> Discover
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
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                                transition={{ duration: 0.16 }}
                                                className="absolute right-0 mt-3 w-[22rem] sm:w-[26rem] overflow-hidden rounded-[1.75rem] border border-gray-200/70 dark:border-[#1F232C] bg-white/95 dark:bg-[#11151D]/95 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur-xl z-50"
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

                                                <div className="max-h-[28rem] overflow-y-auto">
                                                    {notificationPreview.length === 0 ? (
                                                        <div className="px-5 py-10 text-center">
                                                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF8F6B]/15 to-[#F5C36B]/15 text-2xl">
                                                                🔔
                                                            </div>
                                                            <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-[#EDEBE6]">You&apos;re all caught up</p>
                                                            <p className="mt-1 text-xs text-gray-500 dark:text-[#8A8F9C]">New follows, likes, and comments will appear here.</p>
                                                        </div>
                                                    ) : (
                                                        notificationPreview.map((notification) => {
                                                            const unread = !notification.read;
                                                            const meta = getNotificationMeta(notification);
                                                            const detail = getNotificationDetail(notification);

                                                            return (
                                                                <div
                                                                    key={notification._id}
                                                                    onClick={() => handleNotificationClick(notification)}
                                                                    className={`group flex items-start gap-3 px-4 py-4 cursor-pointer transition-colors ${unread ? 'bg-[#FFF8F4] dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                                >
                                                                    <div className="relative shrink-0">
                                                                        <img
                                                                            src={notification.sender?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                                            alt={notification.sender?.name || 'Sender'}
                                                                            className="h-11 w-11 rounded-2xl object-cover ring-2 ring-white dark:ring-[#11151D]"
                                                                            onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }}
                                                                        />
                                                                        <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border border-white dark:border-[#11151D] bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[10px]">
                                                                            {meta.icon}
                                                                        </span>
                                                                    </div>

                                                                    <div className="min-w-0 flex-1">
                                                                        <div className="flex items-start justify-between gap-2">
                                                                            <div className="min-w-0">
                                                                                <p className={`text-sm ${unread ? 'font-semibold text-gray-900 dark:text-[#EDEBE6]' : 'text-gray-600 dark:text-[#A0A6B6]'}`}>
                                                                                    {getNotificationMessage(notification)}
                                                                                </p>
                                                                                {detail && (
                                                                                    <p className="mt-1 text-xs text-gray-500 dark:text-[#8A8F9C] line-clamp-2">
                                                                                        {detail}
                                                                                    </p>
                                                                                )}
                                                                            </div>

                                                                            <span className="rounded-full bg-gray-100 dark:bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500 dark:text-[#9DA3B2]">
                                                                                {meta.label}
                                                                            </span>
                                                                        </div>
                                                                        <p className="mt-2 text-[11px] text-gray-400 dark:text-[#6E7280]">
                                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                                        </p>
                                                                    </div>

                                                                    <button
                                                                        type="button"
                                                                        onClick={(event) => handleDeleteNotification(event, notification)}
                                                                        className="rounded-full p-2 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
                                                                        aria-label="Delete notification"
                                                                    >
                                                                        <TrashIcon />
                                                                    </button>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between border-t border-gray-100 dark:border-[#1F232C] px-4 py-3 text-xs">
                                                    <span className="text-gray-500 dark:text-[#8A8F9C]">{unreadCount} unread</span>
                                                    <Link to="/notifications" onClick={() => setIsNotificationOpen(false)} className="font-semibold text-[#D97B4F] dark:text-[#F5C36B] hover:underline">
                                                        Open inbox
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <button className={iconButtonClasses} aria-label="Messages"><MessageIcon /></button>

                                <div className="relative ml-1" ref={profileRef}>
                                    <button onClick={() => setIsProfileMenuOpen((v) => !v)} className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C36B] rounded-full">
                                        <img src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-[#F5C36B]/60 hover:ring-[#F5C36B] transition-all duration-200" onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }} />
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#12151C] rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-gray-200 dark:border-[#1F232C] py-1.5 z-50">
                                            <Link to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                                                <ProfileGlyphIcon /> My Profile
                                            </Link>
                                            <Link to="/settings" className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                                                <GearIcon /> Settings
                                            </Link>
                                            <hr className="my-1.5 border-gray-200 dark:border-[#1F232C]" />
                                            <button onClick={handleLogout} className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-[#C4573F] dark:text-[#FF8F6B] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] transition-colors">
                                                <LogoutIcon /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 ml-2">
                                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors">Sign In</Link>
                                <Link to="/register" className="px-5 py-2 bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-sm font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)] transition-all duration-200">Get Started</Link>
                            </div>
                        )}
                    </div>

                    <div className="flex md:hidden items-center gap-2">
                        <button onClick={toggleTheme} className={iconButtonClasses} aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        {isAuthenticated ? (
                            <>
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
                                </div>
                                <img src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt="Profile" className="w-8 h-8 rounded-full object-cover ring-2 ring-[#F5C36B]/60" onError={(e) => { e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'; }} />
                                <button onClick={() => setIsMobileMenuOpen((v) => !v)} className={iconButtonClasses} aria-label="Toggle menu">
                                    <HamburgerIcon open={isMobileMenuOpen} />
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="px-4 py-1.5 text-sm font-semibold text-[#1A140D] bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] rounded-full hover:brightness-105 transition-all">Sign In</Link>
                        )}
                    </div>
                </div>

                {isAuthenticated && isMobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-1 border-t border-gray-200 dark:border-[#1F232C] pt-3 font-[Manrope]">
                        <Link to="/create" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <PlusGustIcon /> New Post
                        </Link>
                        <Link to="/discover" className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                            <CompassIcon /> Discover
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
                            className="md:hidden fixed inset-x-4 top-[4.5rem] z-50 rounded-[1.5rem] border border-gray-200/70 dark:border-[#1F232C] bg-white/95 dark:bg-[#11151D]/95 backdrop-blur-xl shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] overflow-hidden"
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
                            <div className="max-h-[26rem] overflow-y-auto">
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