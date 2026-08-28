import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiOutlineHome,
    HiOutlineMagnifyingGlass,
    HiOutlineGlobeAlt,
    HiOutlineQuestionMarkCircle,
    HiOutlineSparkles,
    HiOutlineArrowLeft,
} from 'react-icons/hi2';

const NotFound = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const invalidPath = location.pathname;

    // Smart suggestion based on URL pattern matching
    const getSuggestion = () => {
        const pathLower = invalidPath.toLowerCase();
        if (pathLower.includes('login') || pathLower.includes('signin') || pathLower.includes('auth')) {
            return { name: 'Sign In Page', path: '/login' };
        }
        if (pathLower.includes('reg') || pathLower.includes('signup') || pathLower.includes('join')) {
            return { name: 'Registration Page', path: '/register' };
        }
        if (pathLower.includes('post') || pathLower.includes('story')) {
            return { name: 'Zephyra Feed', path: '/feed' };
        }
        if (pathLower.includes('search') || pathLower.includes('find')) {
            return { name: 'Search Stories & Creators', path: '/search' };
        }
        if (pathLower.includes('profile') || pathLower.includes('user')) {
            return { name: 'Your Profile', path: '/profile' };
        }
        if (pathLower.includes('support') || pathLower.includes('help') || pathLower.includes('faq')) {
            return { name: 'Support & Help Center', path: '/support' };
        }
        if (pathLower.includes('setting') || pathLower.includes('pref')) {
            return { name: 'Account Settings', path: '/settings' };
        }
        if (pathLower.includes('admin')) {
            return { name: 'Admin Portal', path: '/admin' };
        }
        return null;
    };

    const suggestion = getSuggestion();

    return (
        <div className="relative min-h-[85vh] flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#F6EFE6] dark:bg-[#0E1116] text-[#1F1710] dark:text-[#EDEBE6] transition-colors duration-300 font-[Manrope]">
            {/* Background Ambient Glow & Floating Motes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-[#FF8F6B]/20 via-[#D97B4F]/15 to-[#F5C36B]/20 rounded-full blur-3xl" />
                <motion.div
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 15, -10],
                        opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-16 left-[10%] w-3 h-3 rounded-full bg-[#FF8F6B]"
                />
                <motion.div
                    animate={{
                        y: [15, -25, 15],
                        x: [10, -15, 10],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-24 right-[12%] w-4 h-4 rounded-full bg-[#F5C36B]"
                />
            </div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', damping: 25 }}
                className="relative w-full max-w-lg bg-white/90 dark:bg-[#12151C]/90 backdrop-blur-2xl rounded-3xl border-2 border-black/15 dark:border-[#252B38] shadow-[0_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] p-6 sm:p-10 text-center space-y-6 z-10 overflow-hidden"
            >
                {/* Top Gradient Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]" />

                {/* 404 Compass Graphic */}
                <div className="relative inline-flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] p-0.5 shadow-xl shadow-[#FF8F6B]/20"
                    >
                        <div className="w-full h-full bg-white dark:bg-[#0E1116] rounded-[22px] flex items-center justify-center text-[#C2410C] dark:text-[#F5C36B]">
                            <HiOutlineGlobeAlt className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.8]" />
                        </div>
                    </motion.div>
                    <span className="absolute -top-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#1A140D] text-white dark:bg-[#FF8F6B] dark:text-[#1A140D] text-[10px] font-black uppercase tracking-wider shadow-sm">
                        404
                    </span>
                </div>

                {/* Text Content */}
                <div className="space-y-2">
                    <h1
                        className="font-['Fraunces'] italic text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent"
                        style={{ fontVariationSettings: '"opsz" 30, "wght" 600' }}
                    >
                        Page Lost in the Wind
                    </h1>
                    <p className="text-xs sm:text-sm text-[#475467] dark:text-[#94A3B8] font-bold max-w-sm mx-auto">
                        We couldn't find the destination you were searching for. The page may have been moved or the URL contains a typo.
                    </p>
                </div>

                {/* Requested Path Badge */}
                <div className="inline-flex items-center gap-2 max-w-full px-3.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs font-mono font-bold text-rose-700 dark:text-rose-300 truncate">
                    <span className="shrink-0 text-rose-500">URL:</span>
                    <span className="truncate">{invalidPath}</span>
                </div>

                {/* Smart Suggestion Banner */}
                {suggestion && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-left flex items-start gap-3"
                    >
                        <HiOutlineSparkles className="w-5 h-5 text-[#C2410C] dark:text-[#F5C36B] shrink-0 mt-0.5" />
                        <div className="text-xs font-bold space-y-0.5">
                            <span className="text-[#0F172A] dark:text-white font-extrabold block">Did you mean to go here?</span>
                            <Link
                                to={suggestion.path}
                                className="inline-flex items-center gap-1 text-[#C2410C] dark:text-[#F5C36B] font-black hover:underline"
                            >
                                <span>Go to {suggestion.name}</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border-2 border-black/15 dark:border-[#2D3546] text-[#0F172A] dark:text-white text-xs font-black hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer shadow-xs order-2 sm:order-1"
                    >
                        <HiOutlineArrowLeft className="w-4 h-4 stroke-[2.2]" />
                        <span>Go Back</span>
                    </button>

                    <Link
                        to="/feed"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] text-[#1A140D] text-xs font-black hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md hover:shadow-lg order-1 sm:order-2"
                    >
                        <HiOutlineHome className="w-4 h-4 stroke-[2.2]" />
                        <span>Back to Feed</span>
                    </Link>
                </div>

                {/* Helpful Quick Links Grid */}
                <div className="pt-4 border-t border-black/10 dark:border-[#252B38] space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-wider text-[#64748B] dark:text-[#8A8F9C]">
                        Popular Destinations
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                        <Link
                            to="/feed"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181C26] text-[#0F172A] dark:text-white hover:text-[#C2410C] dark:hover:text-[#F5C36B] transition-colors"
                        >
                            Feed
                        </Link>
                        <Link
                            to="/discover"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181C26] text-[#0F172A] dark:text-white hover:text-[#C2410C] dark:hover:text-[#F5C36B] transition-colors"
                        >
                            Discover
                        </Link>
                        <Link
                            to="/search"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181C26] text-[#0F172A] dark:text-white hover:text-[#C2410C] dark:hover:text-[#F5C36B] transition-colors"
                        >
                            Search
                        </Link>
                        <Link
                            to="/support"
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#181C26] text-[#0F172A] dark:text-white hover:text-[#C2410C] dark:hover:text-[#F5C36B] transition-colors"
                        >
                            Support
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
