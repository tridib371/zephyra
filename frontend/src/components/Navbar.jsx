import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

/*
  FONTS
  This navbar assumes the same fonts as the landing page are already loaded globally:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;1,9..144,400;1,9..144,500&family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet">
*/

// ---------- Small line-icon set (matches the feather/wind icon language on the landing page) ----------

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

const BellIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M6 8a6 6 0 0 1 12 0c0 4.2 1.2 6 2 7H4c.8-1 2-2.8 2-7Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 18a2.5 2.5 0 0 0 5 0" strokeLinecap="round" />
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
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
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    };

    // Close the profile dropdown when clicking outside it.
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const iconButtonClasses =
        'p-2 rounded-full text-[#6E7280] dark:text-[#8A8F9C] hover:text-[#B5652F] dark:hover:text-[#F5C36B] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] transition-colors duration-200';

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-[#0E1116]/90 backdrop-blur-md border-b border-gray-200 dark:border-[#1F232C]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link
                        to={isAuthenticated ? '/feed' : '/'}
                        className="flex items-center gap-2 shrink-0"
                    >
                        <span className="text-[#D97B4F] dark:text-[#F5C36B]">
                            <FeatherMark />
                        </span>
                        <span
                            className="font-['Fraunces'] italic font-medium text-xl sm:text-2xl bg-gradient-to-r from-[#D97B4F] via-[#C6822E] to-[#D97B4F] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent"
                            style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}
                        >
                            Zephyra
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1.5 font-[Manrope]">
                        <button
                            onClick={toggleTheme}
                            className={iconButtonClasses}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create"
                                    className="flex items-center gap-1.5 ml-1 px-4 py-2 bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-sm font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)] transition-all duration-200"
                                >
                                    <PlusGustIcon />
                                    New Post
                                </Link>

                                <button className={iconButtonClasses} aria-label="Notifications">
                                    <BellIcon />
                                </button>

                                <button className={iconButtonClasses} aria-label="Messages">
                                    <MessageIcon />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative ml-1" ref={profileRef}>
                                    <button
                                        onClick={() => setIsProfileMenuOpen((v) => !v)}
                                        className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C36B] rounded-full"
                                    >
                                        <img
                                            src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                            alt="Profile"
                                            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#F5C36B]/60 hover:ring-[#F5C36B] transition-all duration-200"
                                        />
                                    </button>
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#12151C] rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/40 border border-gray-200 dark:border-[#1F232C] py-1.5 z-50">
                                            <Link
                                                to="/profile"
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <ProfileGlyphIcon /> My Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors"
                                                onClick={() => setIsProfileMenuOpen(false)}
                                            >
                                                <GearIcon /> Settings
                                            </Link>
                                            <hr className="my-1.5 border-gray-200 dark:border-[#1F232C]" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm text-[#C4573F] dark:text-[#FF8F6B] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] transition-colors"
                                            >
                                                <LogoutIcon /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* ========== GUEST NAV ========== */
                            <div className="flex items-center gap-3 ml-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] hover:text-[#B5652F] dark:hover:text-[#F5C36B] transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2 bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-sm font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)] transition-all duration-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile controls */}
                    <div className="flex md:hidden items-center gap-2">
                        <button onClick={toggleTheme} className={iconButtonClasses} aria-label="Toggle theme">
                            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                <img
                                    src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#F5C36B]/60"
                                />
                                <button
                                    onClick={() => setIsMobileMenuOpen((v) => !v)}
                                    className={iconButtonClasses}
                                    aria-label="Toggle menu"
                                >
                                    <HamburgerIcon open={isMobileMenuOpen} />
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-1.5 text-sm font-semibold text-[#1A140D] bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] rounded-full hover:brightness-105 transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown - Only for Authenticated Users */}
                {isAuthenticated && isMobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-1 border-t border-gray-200 dark:border-[#1F232C] pt-3 font-[Manrope]">
                        <Link
                            to="/create"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <PlusGustIcon /> New Post
                        </Link>
                        <Link
                            to="/feed"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <MessageIcon /> Feed
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <ProfileGlyphIcon /> Profile
                        </Link>
                        <Link
                            to="/settings"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-[#E7E6E3] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] hover:text-[#B5652F] dark:hover:text-[#F5C36B] rounded-xl transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <GearIcon /> Settings
                        </Link>
                        <hr className="my-1.5 border-gray-200 dark:border-[#1F232C]" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 text-left px-4 py-2.5 text-sm font-medium text-[#C4573F] dark:text-[#FF8F6B] hover:bg-[#F5EFE6] dark:hover:bg-[#1A1E27] rounded-xl transition-colors"
                        >
                            <LogoutIcon /> Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;