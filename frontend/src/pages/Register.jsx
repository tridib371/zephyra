import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    HiOutlineArrowPath,
    HiOutlinePencilSquare,
    HiStar,
} from 'react-icons/hi2';
import GoogleButton from '../components/GoogleButton';

const Register = () => {
    const [step, setStep] = useState('form'); // 'form' | 'otp'
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });
    const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [statusMessage, setStatusMessage] = useState(null);
    const [localError, setLocalError] = useState(null);

    const { register, sendRegisterOtp, error: authError } = useAuth();
    const navigate = useNavigate();
    const otpInputRefs = useRef([]);

    // Countdown timer effect for OTP resend
    useEffect(() => {
        let interval = null;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [resendTimer]);

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
        setLocalError(null);

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

    // Step 1: Send OTP to Email
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLocalError(null);
        setStatusMessage(null);

        const allValid = Object.values(passwordChecks).every(Boolean);
        if (!allValid) {
            setLocalError('Please satisfy all password requirements before proceeding.');
            return;
        }

        setIsLoading(true);
        const { email, username } = formData;
        const result = await sendRegisterOtp(email, username);
        setIsLoading(false);

        if (result.success) {
            setStep('otp');
            setResendTimer(60); // 60s cooldown
            setStatusMessage(`A 6-digit verification code was sent to ${email}`);
            // Focus first OTP input on next render
            setTimeout(() => {
                if (otpInputRefs.current[0]) {
                    otpInputRefs.current[0].focus();
                }
            }, 150);
        } else {
            setLocalError(result.message || 'Failed to send verification code.');
        }
    };

    // Resend OTP Code
    const handleResendOtp = async () => {
        if (resendTimer > 0 || isResending) return;
        setIsResending(true);
        setLocalError(null);
        setStatusMessage(null);

        const result = await sendRegisterOtp(formData.email, formData.username);
        setIsResending(false);

        if (result.success) {
            setResendTimer(60);
            setStatusMessage(`A fresh verification code was sent to ${formData.email}`);
            setOtpValues(['', '', '', '', '', '']);
            if (otpInputRefs.current[0]) {
                otpInputRefs.current[0].focus();
            }
        } else {
            setLocalError(result.message || 'Failed to resend verification code.');
        }
    };

    // OTP Input Change Handler (Single Digit & Auto-Advance)
    const handleOtpChange = (index, value) => {
        const cleanValue = value.replace(/[^0-9]/g, '');
        const newOtp = [...otpValues];

        if (cleanValue.length > 1) {
            // Handle multiple characters (e.g. autofill)
            const digits = cleanValue.slice(0, 6).split('');
            digits.forEach((d, idx) => {
                if (idx < 6) newOtp[idx] = d;
            });
            setOtpValues(newOtp);
            const nextIndex = Math.min(digits.length, 5);
            if (otpInputRefs.current[nextIndex]) {
                otpInputRefs.current[nextIndex].focus();
            }
            return;
        }

        newOtp[index] = cleanValue;
        setOtpValues(newOtp);
        setLocalError(null);

        // Advance to next box if digit entered
        if (cleanValue && index < 5) {
            if (otpInputRefs.current[index + 1]) {
                otpInputRefs.current[index + 1].focus();
            }
        }
    };

    // Handle Backspace navigation in OTP boxes
    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (!otpValues[index] && index > 0) {
                const newOtp = [...otpValues];
                newOtp[index - 1] = '';
                setOtpValues(newOtp);
                if (otpInputRefs.current[index - 1]) {
                    otpInputRefs.current[index - 1].focus();
                }
            }
        }
    };

    // Handle Paste Event across OTP boxes
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').trim();
        const digits = pasteData.replace(/[^0-9]/g, '').slice(0, 6).split('');

        if (digits.length > 0) {
            const newOtp = ['', '', '', '', '', ''];
            digits.forEach((digit, i) => {
                if (i < 6) newOtp[i] = digit;
            });
            setOtpValues(newOtp);
            const focusIndex = Math.min(digits.length, 5);
            if (otpInputRefs.current[focusIndex]) {
                otpInputRefs.current[focusIndex].focus();
            }
        }
    };

    // Step 2: Submit Registration with OTP
    const handleVerifyAndRegister = async (e) => {
        if (e) e.preventDefault();
        const fullOtp = otpValues.join('');

        if (fullOtp.length !== 6) {
            setLocalError('Please enter all 6 digits of the verification code.');
            return;
        }

        setIsLoading(true);
        setLocalError(null);

        const { name, username, email, password } = formData;
        const result = await register(name, username, email, password, fullOtp);
        setIsLoading(false);

        if (result.success) {
            navigate('/feed');
        } else {
            setLocalError(result.message || 'Verification failed. Please check the code and try again.');
        }
    };

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);
    const isOtpComplete = otpValues.every((d) => d.length === 1);
    const displayError = localError || authError;

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
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <img
                    src={registerBgLight}
                    alt="Register Sanctuary Light Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-100 blur-none scale-100 transition-opacity duration-700 dark:hidden"
                />
                <img
                    src={registerBgDark}
                    alt="Register Sanctuary Dark Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-85 blur-[0.5px] scale-100 transition-opacity duration-700 hidden dark:block"
                />
                {/* Clear Light Overlay & Dark Tint Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 dark:from-[#090C12]/75 dark:via-[#0E1116]/65 dark:to-[#121620]/75" />
            </div>

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

                {/* ===== RIGHT COLUMN: STEP-BY-STEP REGISTRATION / OTP CARD ===== */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="col-span-1 lg:col-span-7 w-full max-w-md sm:max-w-lg mx-auto"
                >
                    <div className="relative rounded-3xl bg-white/95 dark:bg-[#12151C]/92 backdrop-blur-2xl p-6 sm:p-9 border border-white/90 dark:border-[#252B38] shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden transition-all duration-300">

                        {/* Top Gradient Beam Line */}
                        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]" />

                        <AnimatePresence mode="wait">
                            {step === 'form' ? (
                                /* ===================================================
                                   STEP 1: ACCOUNT DETAILS FORM
                                   =================================================== */
                                <motion.div
                                    key="register-form-step"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Header */}
                                    <div className="text-center mb-6 sm:mb-7">
                                        <h2
                                            className="font-['Fraunces'] italic text-3xl sm:text-4xl bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent pb-1 font-bold"
                                            style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}
                                        >
                                            Join Zephyra
                                        </h2>
                                        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#94A3B8] mt-1 font-[Manrope] font-bold">
                                            Create your free account and verify your email
                                        </p>
                                    </div>

                                    {/* Error Message */}
                                    {displayError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs text-center font-bold font-[Manrope] shadow-xs"
                                        >
                                            {displayError}
                                        </motion.div>
                                    )}

                                    {/* Registration Form */}
                                    <form onSubmit={handleRequestOtp} className="space-y-4">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                                Full Name
                                            </label>
                                            <div className="relative">
                                                <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
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
                                                <HiOutlineAtSymbol className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
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
                                                Email Address (Gmail / Valid Email)
                                            </label>
                                            <div className="relative">
                                                <HiOutlineEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0E1116]/85 border border-[#CBD5E1] dark:border-[#2D3546] rounded-2xl text-[#0F172A] dark:text-[#EDEBE6] placeholder:text-[#64748B] dark:placeholder:text-[#64748B] focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-extrabold shadow-xs"
                                                    placeholder="you@gmail.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-[#0F172A] dark:text-[#E2E8F0] mb-1.5 font-[Manrope]">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
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
                                                    Sending Verification Code...
                                                </span>
                                            ) : (
                                                'Continue to Email Verification →'
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
                                </motion.div>
                            ) : (
                                /* ===================================================
                                   STEP 2: 6-DIGIT OTP VERIFICATION SCREEN
                                   =================================================== */
                                <motion.div
                                    key="register-otp-step"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-5 text-center"
                                >
                                    {/* Security Shield Icon */}
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] text-[#1A140D] shadow-lg shadow-[#FF8F6B]/25 mx-auto">
                                        <HiOutlineShieldCheck className="w-8 h-8 stroke-[2.2]" />
                                    </div>

                                    {/* Header */}
                                    <div>
                                        <h2
                                            className="font-['Fraunces'] italic text-2xl sm:text-3xl bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent font-bold pb-1"
                                            style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}
                                        >
                                            Verify Your Email
                                        </h2>
                                        <p className="text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] mt-1.5 font-bold font-[Manrope]">
                                            We sent a 6-digit verification code to:
                                        </p>
                                        <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-full text-xs font-black text-[#C2410C] dark:text-[#F5C36B]">
                                            <span>{formData.email}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setStep('form');
                                                    setLocalError(null);
                                                }}
                                                className="hover:underline flex items-center gap-1 text-[11px] text-[#C2410C] dark:text-[#F5C36B] cursor-pointer"
                                                title="Edit email address"
                                            >
                                                <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Message */}
                                    {statusMessage && !displayError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold"
                                        >
                                            {statusMessage}
                                        </motion.div>
                                    )}

                                    {/* Error Message */}
                                    {displayError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 rounded-2xl text-xs text-center font-bold font-[Manrope]"
                                        >
                                            {displayError}
                                        </motion.div>
                                    )}

                                    {/* 6-Digit OTP Boxes */}
                                    <form onSubmit={handleVerifyAndRegister} className="space-y-5">
                                        <div className="flex justify-center items-center gap-2 sm:gap-2.5 my-3" onPaste={handleOtpPaste}>
                                            {otpValues.map((digit, idx) => (
                                                <input
                                                    key={idx}
                                                    ref={(el) => (otpInputRefs.current[idx] = el)}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                                    className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black bg-white dark:bg-[#0E1116] border-2 border-black dark:border-[#2D3546] dark:focus:border-[#FF8F6B] focus:border-black rounded-xl sm:rounded-2xl text-[#0F172A] dark:text-white outline-none focus:ring-2 focus:ring-[#E2774C] dark:focus:ring-[#FF8F6B]/30 shadow-xs transition-all font-mono"
                                                />
                                            ))}
                                        </div>

                                        {/* Resend Code Action */}
                                        <div className="text-xs text-[#475467] dark:text-[#94A3B8] font-bold">
                                            {resendTimer > 0 ? (
                                                <span>
                                                    Resend code in <strong className="text-[#C2410C] dark:text-[#F5C36B]">{resendTimer}s</strong>
                                                </span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={handleResendOtp}
                                                    disabled={isResending}
                                                    className="inline-flex items-center gap-1.5 text-[#C2410C] dark:text-[#F5C36B] font-black hover:underline cursor-pointer disabled:opacity-50"
                                                >
                                                    <HiOutlineArrowPath className={`w-4 h-4 ${isResending ? 'animate-spin' : ''}`} />
                                                    <span>{isResending ? 'Sending new code...' : 'Resend Verification Code'}</span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Verify & Register Button */}
                                        <button
                                            type="submit"
                                            disabled={isLoading || !isOtpComplete}
                                            className="w-full py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] text-[#1A140D] font-black rounded-full hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-[Manrope] text-sm cursor-pointer"
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <svg className="animate-spin h-5 w-5 text-[#1A140D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Verifying & Creating Account...
                                                </span>
                                            ) : (
                                                'Verify & Complete Registration →'
                                            )}
                                        </button>

                                        {/* Return to Form Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setStep('form');
                                                setLocalError(null);
                                            }}
                                            className="text-xs font-bold text-[#475467] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors cursor-pointer block mx-auto pt-1"
                                        >
                                            ← Back to Registration Details
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
};

export default Register;