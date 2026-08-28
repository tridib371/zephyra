import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiOutlineKey,
    HiOutlineChatBubbleLeftRight,
    HiOutlineShieldCheck,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineExclamationCircle,
    HiStar,
} from 'react-icons/hi2';
import GoogleButton from '../components/GoogleButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Please enter your email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!password) {
            newErrors.password = 'Please enter your password.';
        }

        if (Object.keys(newErrors).length > 0) {
            setFieldErrors(newErrors);
            return;
        }

        setFieldErrors({});
        setIsLoading(true);
        const result = await login(email.trim(), password);
        setIsLoading(false);
        if (result.success) {
            navigate('/feed');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen relative flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 font-[Manrope] overflow-hidden"
        >
            {/* ============================================
               DEDICATED DAY & NIGHT MODE BACKGROUND WALLPAPERS
               ============================================ */}
            {/* Realistic Photography Background Wallpapers - Clear & Sharp */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6EF] via-[#FAF7F2] to-[#F5EFE6] dark:from-[#0E1116] dark:via-[#121620] dark:to-[#0A0D12]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#FF8F6B]/15 via-transparent to-transparent dark:from-[#FF8F6B]/10" />
            </div>

            {/* Floating Ambient Glowing Beams */}
            <div className="absolute top-1/3 left-12 w-96 h-96 bg-gradient-to-br from-[#FF8F6B]/25 to-[#F5C36B]/20 dark:from-[#8B5CF6]/30 dark:to-[#EC4899]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/3 right-12 w-96 h-96 bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 dark:from-[#FF8F6B]/30 dark:to-[#F5C36B]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Animated Floating Particles Scenario */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    animate={{ y: [0, -40, 0], x: [0, 25, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-20 right-1/3 w-3.5 h-3.5 rounded-full bg-[#E2774C] dark:bg-[#8B5CF6] blur-xs"
                />
                <motion.div
                    animate={{ y: [0, 50, 0], x: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute bottom-1/4 left-1/4 w-4 h-4 rounded-full bg-[#3B82F6] dark:bg-[#FF8F6B] blur-xs"
                />
            </div>

            {/* ============================================
               MAIN CONTAINER (Desktop Split / Mobile Stack)
               ============================================ */}
            <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

                {/* ===== SHOWCASE HERO PANEL (MOBILE & DESKTOP) ===== */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="col-span-1 lg:col-span-5 flex flex-col justify-between space-y-6 sm:space-y-8 text-center lg:text-left items-center lg:items-start pr-0 lg:pr-4"
                >
                    <div className="space-y-3.5 sm:space-y-4 flex flex-col items-center lg:items-start">
                        {/* Welcome Back Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/60 border border-[#D97B4F]/40 dark:border-[#F5C36B]/30 backdrop-blur-md shadow-sm text-xs font-black text-[#C2410C] dark:text-[#F5C36B]">
                            <HiOutlineKey className="h-4 w-4 text-[#C2410C] dark:text-[#F5C36B]" />
                            <span>Welcome Back to Zephyra</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="font-['Fraunces'] italic text-3xl sm:text-4xl xl:text-5xl font-black text-[#0F172A] dark:text-white leading-tight tracking-tight drop-shadow-sm">
                            Reconnect with your realm.
                        </h1>

                        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-bold leading-relaxed max-w-lg">
                            Pick up right where you left off. Access your direct messages, real-time community feeds, and saved gusts seamlessly.
                        </p>
                    </div>

                    {/* Feature Highlight Glass Chips */}
                    <div className="w-full space-y-3 text-left">
                        <motion.div
                            whileHover={{ x: 4 }}
                            className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#12151C]/80 backdrop-blur-xl border border-white dark:border-[#252B38] shadow-md flex items-center gap-3.5"
                        >
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] dark:from-[#8B5CF6] dark:to-[#EC4899] flex items-center justify-center text-[#1A140D] dark:text-white font-bold shadow-xs shrink-0">
                                <HiOutlineChatBubbleLeftRight className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-[#0F172A] dark:text-white">Realtime Direct Inbox</h4>
                                <p className="text-[11px] text-[#334155] dark:text-[#94A3B8] font-bold">Sub-15ms socket chat & instant notifications</p>
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ x: 4 }}
                            className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#12151C]/80 backdrop-blur-xl border border-white dark:border-[#252B38] shadow-md flex items-center gap-3.5"
                        >
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white font-bold shadow-xs shrink-0">
                                <HiOutlineShieldCheck className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-[#0F172A] dark:text-white">Encrypted Session Security</h4>
                                <p className="text-[11px] text-[#334155] dark:text-[#94A3B8] font-bold">JWT authenticated & Google OAuth integration</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Security Guarantee Badge */}
                    <div className="w-full text-left p-4 rounded-2xl bg-white/90 dark:bg-gradient-to-r dark:from-[#1A202C]/85 dark:to-[#121620]/70 backdrop-blur-xl border border-white dark:border-[#2A3447] shadow-md space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[#047857] dark:text-[#10B981] text-xs font-black uppercase tracking-wider">
                            <HiOutlineShieldCheck className="h-4 w-4" />
                            <span>Verified Safe Sign-In</span>
                        </div>
                        <p className="text-xs text-[#1E293B] dark:text-[#CBD5E1] font-semibold leading-relaxed">
                            Your login session is protected with end-to-end token encryption and zero third-party tracking.
                        </p>
                    </div>
                </motion.div>

                {/* ===== RIGHT COLUMN: LOGIN FORM GLASS CARD ===== */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="col-span-1 lg:col-span-7 w-full max-w-md sm:max-w-lg mx-auto"
                >
                    <div className="relative rounded-3xl bg-white/95 dark:bg-[#12151C]/92 backdrop-blur-2xl p-6 sm:p-9 border border-white/90 dark:border-[#252B38] shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300">

                        {/* Top Gradient Beam Line */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]" />

                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-7">
                            <h2
                                className="font-['Fraunces'] italic text-3xl sm:text-4xl bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent pb-1 font-bold"
                                style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}
                            >
                                Welcome Back
                            </h2>
                            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#94A3B8] mt-1 font-[Manrope] font-bold">
                                Sign in to continue your journey on Zephyra
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs text-center font-bold font-[Manrope] shadow-xs"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} noValidate className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#64748B]" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                                        }}
                                        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0E1116]/85 border rounded-2xl text-[#0F172A] dark:text-[#EDEBE6] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-extrabold shadow-xs ${
                                            fieldErrors.email
                                                ? 'border-rose-500 ring-1 ring-rose-500/50 dark:border-rose-500'
                                                : 'border-[#CBD5E1] dark:border-[#2D3546]'
                                        }`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {fieldErrors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 font-[Manrope]"
                                    >
                                        <HiOutlineExclamationCircle className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                                        <span>{fieldErrors.email}</span>
                                    </motion.p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                    Password
                                </label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#64748B]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                                        }}
                                        className={`w-full pl-10 pr-10 py-2.5 sm:py-3 bg-white dark:bg-[#0E1116]/85 border rounded-2xl text-[#0F172A] dark:text-[#EDEBE6] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-extrabold shadow-xs ${
                                            fieldErrors.password
                                                ? 'border-rose-500 ring-1 ring-rose-500/50 dark:border-rose-500'
                                                : 'border-[#CBD5E1] dark:border-[#2D3546]'
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-[#8A8F9C] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer p-1"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <HiOutlineEyeSlash className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {fieldErrors.password && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 font-[Manrope]"
                                    >
                                        <HiOutlineExclamationCircle className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                                        <span>{fieldErrors.password}</span>
                                    </motion.p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] text-[#1A140D] font-black rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-[Manrope] text-sm cursor-pointer mt-3"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-[#1A140D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign In →'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-[#E2E8F0] dark:border-[#252B38]"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-3 bg-white/95 dark:bg-[#12151C]/90 text-[#475467] dark:text-[#94A3B8] font-[Manrope] font-black uppercase tracking-wider">
                                    or continue with
                                </span>
                            </div>
                        </div>

                        <GoogleButton />

                        {/* Footer Link */}
                        <p className="text-center text-xs sm:text-sm text-[#334155] dark:text-[#94A3B8] mt-5 font-[Manrope] font-bold">
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                className="text-[#C2410C] dark:text-[#F5C36B] font-black hover:underline transition-colors"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Login;