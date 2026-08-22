import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import registerBgLight from '../assets/register-bg-light.jpg';
import registerBgDark from '../assets/register-bg-dark.jpg';
import {
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineUserGroup,
    HiOutlineBolt,
    HiOutlineShieldCheck,
    HiOutlineUser,
    HiOutlineAtSymbol,
    HiOutlineEnvelope,
    HiOutlineLockClosed,
    HiStar,
} from 'react-icons/hi2';
import GoogleButton from '../components/GoogleButton';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password') {
            setPasswordChecks({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[@$!%*?&]/.test(value),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allValid = Object.values(passwordChecks).every(Boolean);
        if (!allValid) {
            alert('Please meet all password requirements before submitting.');
            return;
        }

        setIsLoading(true);
        const { name, username, email, password } = formData;
        const result = await register(name, username, email, password);
        setIsLoading(false);
        if (result.success) {
            navigate('/feed');
        }
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

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
            {/* Day Mode Wallpaper (Bright, Luminous Golden & Sky-Blue) */}
            <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-95 dark:hidden"
                style={{ backgroundImage: `url(${registerBgLight})` }}
            />

            {/* Night Mode Wallpaper (Cosmic Ethereal Waves) */}
            <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-85 hidden dark:block"
                style={{ backgroundImage: `url(${registerBgDark})` }}
            />

            {/* Mode-Adaptive Translucent Glass Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#FFF9F5]/45 via-white/20 to-[#FFF0E6]/45 dark:from-[#090C12]/75 dark:via-[#0E1116]/65 dark:to-[#121620]/75 backdrop-blur-xs transition-colors duration-500" />

            {/* Floating Ambient Glowing Beams */}
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-gradient-to-br from-[#FF8F6B]/25 to-[#F5C36B]/20 dark:from-[#6366F1]/20 dark:to-[#06B6D4]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-br from-[#06B6D4]/20 to-[#3B82F6]/20 dark:from-[#FF8F6B]/30 dark:to-[#F5C36B]/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

            {/* Animated Floating Particles Scenario */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    animate={{ y: [0, -35, 0], x: [0, 20, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-16 left-1/4 w-3 h-3 rounded-full bg-[#E2774C] dark:bg-[#FF8F6B] blur-xs"
                />
                <motion.div
                    animate={{ y: [0, 45, 0], x: [0, -25, 0], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-[#3B82F6] dark:bg-[#F5C36B] blur-xs"
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
                        {/* Live Community Badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-black/60 border border-[#D97B4F]/40 dark:border-[#F5C36B]/30 backdrop-blur-md shadow-sm text-xs font-black text-[#C2410C] dark:text-[#F5C36B]">
                            <HiOutlineUserGroup className="h-4 w-4 text-[#C2410C] dark:text-[#F5C36B]" />
                            <span>Join 50,000+ Active Creators</span>
                        </div>

                        {/* Main Title */}
                        <h1 className="font-['Fraunces'] italic text-3xl sm:text-4xl xl:text-5xl font-black text-[#0F172A] dark:text-white leading-tight tracking-tight drop-shadow-sm">
                            Where your voice carries on the wind.
                        </h1>

                        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] font-bold leading-relaxed max-w-lg">
                            Experience a distraction-free social realm built for instant expression, realtime messaging, and complete privacy control.
                        </p>
                    </div>

                    {/* Feature Highlight Glass Chips */}
                    <div className="w-full space-y-3 text-left">
                        <motion.div
                            whileHover={{ x: 4 }}
                            className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#12151C]/80 backdrop-blur-xl border border-white dark:border-[#252B38] shadow-md flex items-center gap-3.5"
                        >
                            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] flex items-center justify-center text-[#1A140D] font-bold shadow-xs shrink-0">
                                <HiOutlineBolt className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-[#0F172A] dark:text-white">Sub-15ms Realtime Sync</h4>
                                <p className="text-[11px] text-[#334155] dark:text-[#94A3B8] font-bold">Socket messaging & live unread updates</p>
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
                                <h4 className="text-xs font-black text-[#0F172A] dark:text-white">100% Privacy Sovereignty</h4>
                                <p className="text-[11px] text-[#334155] dark:text-[#94A3B8] font-bold">Granular visibility & zero ad tracking</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Floating Testimonial Snippet */}
                    <div className="w-full text-left p-4 rounded-2xl bg-white/90 dark:bg-gradient-to-r dark:from-[#1A202C]/85 dark:to-[#121620]/70 backdrop-blur-xl border border-white dark:border-[#2A3447] shadow-md space-y-2">
                        <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <HiStar key={i} className="h-3.5 w-3.5" />
                            ))}
                        </div>
                        <p className="text-xs italic text-[#1E293B] dark:text-[#CBD5E1] font-semibold leading-relaxed">
                            "Zephyra is the fresh breeze social media needed. Sleek, fast, and completely distraction-free."
                        </p>
                        <div className="flex items-center gap-2 pt-0.5">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-[#FF8F6B] to-[#F5C36B] flex items-center justify-center text-[10px] font-black text-[#1A140D]">
                                A
                            </div>
                            <span className="text-[11px] font-black text-[#0F172A] dark:text-white">Aria Vance</span>
                            <span className="text-[10px] font-bold text-[#475467] dark:text-[#8A8F9C]">• Verified Creator</span>
                        </div>
                    </div>
                </motion.div>

                {/* ===== RIGHT COLUMN: REGISTRATION FORM GLASS CARD ===== */}
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
                                Join Zephyra
                            </h2>
                            <p className="text-xs sm:text-sm text-[#334155] dark:text-[#94A3B8] mt-1 font-[Manrope] font-bold">
                                Create your free account and start sharing ideas
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

                        {/* Registration Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#64748B]" />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0E1116]/85 border border-[#CBD5E1] dark:border-[#2D3546] rounded-2xl text-[#0F172A] dark:text-[#EDEBE6] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-extrabold shadow-xs"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                    Username
                                </label>
                                <div className="relative">
                                    <HiOutlineAtSymbol className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#64748B]" />
                                    <input
                                        type="text"
                                        name="username"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0E1116]/85 border border-[#CBD5E1] dark:border-[#2D3546] rounded-2xl text-[#0F172A] dark:text-[#EDEBE6] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-extrabold shadow-xs"
                                        placeholder="johndoe"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#64748B]" />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0E1116]/85 border border-[#CBD5E1] dark:border-[#2D3546] rounded-2xl text-[#0F172A] dark:text-[#EDEBE6] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-extrabold shadow-xs"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                    Password
                                </label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] dark:text-[#64748B]" />
                                    <input
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0E1116]/85 border rounded-2xl text-[#0F172A] dark:text-[#EDEBE6] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-extrabold shadow-xs ${formData.password.length > 0 && !isPasswordValid
                                            ? 'border-rose-500 dark:border-rose-500'
                                            : formData.password.length > 0 && isPasswordValid
                                                ? 'border-emerald-500 dark:border-emerald-500'
                                                : 'border-[#CBD5E1] dark:border-[#2D3546]'
                                            }`}
                                        placeholder="Enter a strong password"
                                    />
                                </div>

                                {/* Password Strength Checklist */}
                                {formData.password.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-2.5 text-xs space-y-1.5 font-[Manrope] bg-slate-50/90 dark:bg-[#181C26]/90 p-3.5 rounded-2xl border border-[#CBD5E1] dark:border-[#252A36]"
                                    >
                                        <p className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-rose-600 dark:text-rose-400 font-bold'}`}>
                                            {passwordChecks.length ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                            <span>At least 8 characters</span>
                                        </p>
                                        <p className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-rose-600 dark:text-rose-400 font-bold'}`}>
                                            {passwordChecks.uppercase ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                            <span>At least 1 uppercase letter</span>
                                        </p>
                                        <p className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-rose-600 dark:text-rose-400 font-bold'}`}>
                                            {passwordChecks.lowercase ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                            <span>At least 1 lowercase letter</span>
                                        </p>
                                        <p className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-rose-600 dark:text-rose-400 font-bold'}`}>
                                            {passwordChecks.number ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                            <span>At least 1 number</span>
                                        </p>
                                        <p className={`flex items-center gap-1.5 ${passwordChecks.special ? 'text-emerald-700 dark:text-emerald-400 font-extrabold' : 'text-rose-600 dark:text-rose-400 font-bold'}`}>
                                            {passwordChecks.special ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                            <span>At least 1 special character (@$!%*?&)</span>
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !isPasswordValid}
                                className="w-full py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] text-[#1A140D] font-black rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-[Manrope] text-sm cursor-pointer mt-3"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-[#1A140D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating account...
                                    </span>
                                ) : (
                                    'Create Free Account →'
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
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-[#C2410C] dark:text-[#F5C36B] font-black hover:underline transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Register;