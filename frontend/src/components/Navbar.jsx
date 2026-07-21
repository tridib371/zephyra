import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to={isAuthenticated ? "/feed" : "/"} className="flex items-center space-x-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            🌬️ Zephyra
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle - Always Visible */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        {/* ========== AUTHENTICATED NAV ========== */}
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create"
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-all duration-200"
                                >
                                    ✨ New Post
                                </Link>

                                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                                    🔔
                                </button>

                                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
                                    💬
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                        className="flex items-center space-x-2 focus:outline-none"
                                    >
                                        <img
                                            src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                            alt="Profile"
                                            className="w-9 h-9 rounded-full border-2 border-purple-500 object-cover"
                                        />
                                    </button>
                                    {isMobileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                                            <Link
                                                to="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                👤 My Profile
                                            </Link>
                                            <Link
                                                to="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                ⚙️ Settings
                                            </Link>
                                            <hr className="border-gray-200 dark:border-gray-700" />
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                🚪 Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* ========== GUEST NAV ========== */
                            <div className="flex items-center space-x-3">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:scale-105 transition-all duration-200"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Menu Button */}
                    <div className="flex md:hidden items-center space-x-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300"
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>

                        {isAuthenticated ? (
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300 focus:outline-none"
                            >
                                <img
                                    src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-purple-500 object-cover"
                                />
                            </button>
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-1.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Dropdown - Only for Authenticated Users */}
                {isAuthenticated && isMobileMenuOpen && (
                    <div className="md:hidden pb-4 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <Link
                            to="/create"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            ✨ New Post
                        </Link>
                        <Link
                            to="/feed"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            📰 Feed
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            👤 Profile
                        </Link>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            🚪 Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;