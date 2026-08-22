import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import { HiStar } from 'react-icons/hi2';

const GUST_PATHS = [
    'M -100 140 C 150 60, 350 220, 620 110 S 1000 40, 1300 130',
    'M -100 300 C 200 380, 420 220, 700 320 S 1050 260, 1300 340',
    'M -100 460 C 180 400, 460 520, 760 440 S 1080 500, 1300 430',
];

const PARTICLES = Array.from({ length: 24 }).map((_, i) => ({
    id: i,
    left: `${(i * 4.3 + 3) % 100}%`,
    size: 3 + ((i * 3) % 5),
    duration: 9 + ((i * 3) % 10),
    delay: (i % 7) * 0.8,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 15),
}));

// Animated Count-Up Number Component
const Counter = ({ target, prefix = '', suffix = '', decimals = 0, duration = 2.2 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let startTime = null;

        const animateCount = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const runtime = (timestamp - startTime) / 1000;
            const progress = Math.min(runtime / duration, 1);
            // Ease out exponential progress for premium smooth feel
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = target * easeOut;

            setCount(currentVal);

            if (progress < 1) {
                requestAnimationFrame(animateCount);
            }
        };

        requestAnimationFrame(animateCount);
    }, [isInView, target, duration]);

    return (
        <span ref={ref}>
            {prefix}
            {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
            {suffix}
        </span>
    );
};

const WindLines = ({ reduce }) => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-80 dark:opacity-60"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="gustGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="40%" stopColor="#D97B4F" stopOpacity="0.65" />
                <stop offset="75%" stopColor="#F5C36B" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        {GUST_PATHS.map((d, i) => (
            <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="url(#gustGradient)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                    reduce
                        ? { pathLength: 1, opacity: 0.6 }
                        : {
                            pathLength: 1,
                            opacity: [0, 0.85, 0.5, 0.85],
                            x: [0, 18, -12, 0],
                        }
                }
                transition={
                    reduce
                        ? { duration: 1.2, delay: i * 0.15 }
                        : {
                            pathLength: { duration: 1.6, delay: i * 0.2, ease: 'easeOut' },
                            opacity: { duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut' },
                            x: { duration: 10 + i * 3, repeat: Infinity, ease: 'easeInOut' },
                        }
                }
            />
        ))}
    </svg>
);

const Particles = ({ reduce }) => {
    if (reduce) return null;
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {PARTICLES.map((p) => (
                <motion.span
                    key={p.id}
                    className="absolute rounded-full bg-gradient-to-tr from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]"
                    style={{
                        left: p.left,
                        bottom: '-5%',
                        width: p.size,
                        height: p.size,
                        boxShadow: '0 0 12px rgba(217,123,79,0.7)',
                    }}
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{
                        opacity: [0, 0.95, 0.8, 0],
                        y: ['0%', '-750%'],
                        x: [0, p.drift, p.drift * 0.7],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
};

// Icons
const FeatherIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M20.24 3.76 9.5 14.5a4.95 4.95 0 0 0 0 7 4.95 4.95 0 0 0 7 0L20.24 10a4.95 4.95 0 0 0 0-7 4.95 4.95 0 0 0-7 0Z" />
        <path d="M9 15 4 20" strokeLinecap="round" />
        <path d="M13.5 10.5 11 13" strokeLinecap="round" />
    </svg>
);

const PulseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M3 12h4l2-7 4 14 2-7h6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
);

const CloudLockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M7 16.5a4 4 0 0 1 .3-7.98A5.5 5.5 0 0 1 17.9 10.1 3.5 3.5 0 0 1 17 17H15" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="14" width="7" height="6" rx="1.2" />
        <path d="M10 14v-1.5a1.5 1.5 0 0 1 3 0V14" />
    </svg>
);

const CompassIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="m14.5 9.5-2 5-3 1.5 2-5 3-1.5Z" strokeLinejoin="round" />
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
);

const HeartIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-rose-500">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
);

const FEATURES = [
    {
        icon: FeatherIcon,
        title: 'Set your thoughts adrift',
        description: 'Post updates, media, and spontaneous thoughts - Zephyra carries them to standard feeds instantly.',
        badge: 'Express Freely',
        gradient: 'from-[#FF8F6B] to-[#D97B4F]',
    },
    {
        icon: PulseIcon,
        title: 'Real-time Currents',
        description: 'Instant socket-powered messaging, live interactions, and instant notifications that never sleep.',
        badge: 'Zero Latency',
        gradient: 'from-[#F5C36B] to-[#FF8F6B]',
    },
    {
        icon: CloudLockIcon,
        title: 'Complete Privacy Controls',
        description: 'Every post gives you full control. Public gusts, follower-only updates, or direct messages.',
        badge: 'Private & Secure',
        gradient: 'from-[#D97B4F] to-[#C6822E]',
    },
    {
        icon: CompassIcon,
        title: 'Boundaryless Discovery',
        description: 'Discover trending stories, global topics, and active creators across every realm seamlessly.',
        badge: 'Explore Worlds',
        gradient: 'from-[#F5C36B] to-[#D97B4F]',
    },
];

const STATS = [
    { label: 'Active Creators', target: 50, suffix: 'K+', decimals: 0 },
    { label: 'Realtime Latency', target: 15, prefix: '< ', suffix: 'ms', decimals: 0 },
    { label: 'Daily Interactions', target: 2.5, suffix: 'M+', decimals: 1 },
    { label: 'Uptime SLA', target: 99.9, suffix: '%', decimals: 1 },
];

const TESTIMONIALS = [
    {
        quote: "Zephyra completely changed how I connect with my audience. It's fluid, fast, and stunningly gorgeous.",
        author: "Aria Thorne",
        role: "Digital Artist",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
        quote: "The direct messaging and real-time feed feel so smooth. It's hands down the best social UI I've used.",
        author: "Marcus Vance",
        role: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
        quote: "Minimal, responsive, and blazing fast. Zephyra is the fresh breeze social platforms desperately needed.",
        author: "Elena Rostova",
        role: "Content Strategist",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
];

export default function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const reduce = useReducedMotion();

    const [likesCount, setLikesCount] = useState(1482);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/feed');
        }
    }, [isAuthenticated, navigate]);

    const handleLikeDemo = () => {
        if (hasLiked) {
            setLikesCount((prev) => prev - 1);
            setHasLiked(false);
        } else {
            setLikesCount((prev) => prev + 1);
            setHasLiked(true);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F6EFE6] dark:bg-[#0B0D10] text-[#1F1710] dark:text-[#EDEBE6] font-[Manrope] transition-colors duration-300 overflow-x-hidden">

            {/* Background Ambient Glow Orbs - Tailored for both Light & Dark modes */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full bg-gradient-to-tr from-[#FF8F6B]/45 via-[#F5C36B]/35 to-[#D97B4F]/25 dark:from-[#FF8F6B]/20 dark:via-[#F5C36B]/15 dark:to-transparent blur-3xl opacity-85 dark:opacity-40 animate-pulse" />
                <div className="absolute top-1/3 -left-48 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#FF8F6B]/40 via-[#D97B4F]/25 to-transparent blur-3xl opacity-75 dark:opacity-30" />
                <div className="absolute bottom-10 -right-20 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#F5C36B]/40 via-[#FF8F6B]/25 to-transparent blur-3xl opacity-75 dark:opacity-30" />
            </div>

            {/* ===== HERO SECTION ===== */}
            <section className="relative z-10 flex-1 flex flex-col items-center justify-center pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6">
                <WindLines reduce={reduce} />
                <Particles reduce={reduce} />

                {/* Hero Pill Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6 inline-flex items-center px-5 py-1.5 rounded-full border border-[#D97B4F]/40 dark:border-[#FF8F6B]/30 bg-[#FAF2E8] dark:bg-white/5 backdrop-blur-xl shadow-xs"
                >
                    <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#B85323] dark:text-[#F5C36B] font-[Manrope]">
                        Welcome to Zephyra
                    </span>
                </motion.div>

                {/* Main Heading - Crisp High Contrast in Light & Dark Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-center max-w-4xl mx-auto"
                >
                    <h1
                        className="font-['Fraunces'] italic font-semibold text-5xl sm:text-7xl md:text-8xl leading-[1.08] tracking-tight pb-3 bg-gradient-to-r from-[#B85323] via-[#D97B4F] to-[#C6822E] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent drop-shadow-xs"
                    >
                        Where Thoughts <br />
                        Catch the Wind
                    </h1>

                    <p className="mt-6 text-lg sm:text-2xl text-[#2D241C] dark:text-[#E7E6E3] font-medium leading-relaxed max-w-2xl mx-auto">
                        A modern, real-time social platform crafted for instant conversations, beautiful posts, and genuine connections.
                    </p>

                    <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-[#8A8F9C] max-w-lg mx-auto font-[Manrope]">
                        Experience direct chats, dynamic feeds, and seamless interactions - free of noise and clutter.
                    </p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 mt-9 justify-center items-center"
                    >
                        <Link
                            to="/register"
                            className="group relative px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-base rounded-full hover:brightness-105 shadow-[0_10px_30px_-8px_rgba(217,123,79,0.5)] hover:shadow-[0_15px_35px_-5px_rgba(217,123,79,0.65)] hover:scale-105 transition-all duration-300 text-center font-[Manrope] min-w-48 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Start Your Journey
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-3.5 border border-[#D97B4F]/40 dark:border-[#3A3F4B] bg-white/80 dark:bg-white/5 backdrop-blur-md text-[#1A140D] dark:text-[#E7E6E3] font-bold text-base rounded-full hover:border-[#D97B4F] dark:hover:border-[#F5C36B]/60 hover:text-[#D97B4F] dark:hover:text-[#F5C36B] hover:scale-105 shadow-sm transition-all duration-300 text-center font-[Manrope] min-w-44"
                        >
                            Sign In
                        </Link>
                    </motion.div>
                </motion.div>

                {/* ===== INTERACTIVE DEMO CARD MOCKUP ===== */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-16 w-full max-w-4xl relative"
                >
                    {/* Glowing card border shadow tailored for Light & Dark */}
                    <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#FF8F6B]/40 via-[#F5C36B]/40 to-[#D97B4F]/40 blur-2xl opacity-75 dark:opacity-60" />

                    <div className="relative rounded-3xl border border-[#E2D4C3] dark:border-[#1F232C] bg-[#FFFDF9] dark:bg-[#11151D]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(217,123,79,0.25)] dark:shadow-2xl">
                        {/* Mockup Header Bar */}
                        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EFE5D8] dark:border-[#1F232C]">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full bg-rose-500" />
                                <span className="h-3 w-3 rounded-full bg-amber-500" />
                                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                                <span className="ml-3 text-xs font-bold text-[#665548] dark:text-gray-400 font-[Manrope]">
                                    Zephyra Interactive Feed Preview
                                </span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-[#FFF0E6] dark:bg-[#FF8F6B]/15 text-[#B85323] dark:text-[#F5C36B] text-xs font-extrabold uppercase tracking-wider border border-[#FF8F6B]/30">
                                Live Interactive Demo
                            </span>
                        </div>

                        {/* Interactive Post Card Content */}
                        <div className="grid md:grid-cols-12 gap-6 items-center">
                            <div className="md:col-span-7 space-y-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                                        alt="Aria"
                                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-[#FF8F6B]/60 shadow-xs"
                                    />
                                    <div>
                                        <h4 className="font-bold text-base text-[#1A140D] dark:text-white">Aria Thorne</h4>
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">@ariathorne • 2 mins ago</p>
                                    </div>
                                </div>

                                <p className="text-sm sm:text-base text-[#2D241C] dark:text-[#EDEBE6] leading-relaxed font-medium">
                                    Just released a fresh digital art series inspired by sunset winds! Switched to Zephyra for real-time engagement and it feels amazing.
                                </p>

                                <div className="flex items-center gap-4 pt-2">
                                    <button
                                        onClick={handleLikeDemo}
                                        className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${hasLiked
                                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 ring-2 ring-rose-500/40 scale-105'
                                            : 'bg-[#FFF8F4] dark:bg-[#181D27] text-[#2D241C] dark:text-gray-300 hover:bg-[#FFEFE6] dark:hover:bg-[#202734] border border-[#EFE8DC] dark:border-transparent'
                                            }`}
                                    >
                                        <HeartIcon />
                                        <span>{likesCount} Likes</span>
                                    </button>

                                    <div className="flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold bg-[#FFF8F4] dark:bg-[#181D27] text-[#2D241C] dark:text-gray-300 border border-[#EFE8DC] dark:border-transparent">
                                        <MessageIcon />
                                        <span>42 Comments</span>
                                    </div>
                                </div>
                            </div>

                            {/* Simulated Chat Bubble Floating Mockup */}
                            <div className="md:col-span-5 rounded-2xl bg-[#F4ECE1] dark:bg-[#090B0E] p-4 border border-[#DECDBB] dark:border-[#1F232C] space-y-3 shadow-inner">
                                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#B85323] dark:text-gray-400 uppercase tracking-wider mb-2">
                                    <MessageIcon />
                                    <span>Instant Direct Chat</span>
                                </div>
                                <div className="flex items-start gap-2.5">
                                    <img
                                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                                        alt=""
                                        className="h-8 w-8 rounded-full object-cover shrink-0 ring-1 ring-[#D97B4F]/30"
                                    />
                                    <div className="rounded-2xl bg-[#FFFDF9] dark:bg-[#141821] p-3 text-xs border border-[#DECDBB] dark:border-[#1F232C] shadow-xs">
                                        <p className="font-bold text-[#1F1710] dark:text-white">Marcus</p>
                                        <p className="text-[#5C4A3C] dark:text-gray-300 mt-0.5 font-medium">Loving the colors! Just sent you a DM.</p>
                                    </div>
                                </div>

                                <div className="flex items-end justify-end gap-2.5">
                                    <div className="rounded-2xl bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] p-3 text-xs text-[#1F1710] font-bold shadow-md">
                                        Got it! Reply coming right up.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ===== STATS BANNER WITH COUNT-UP ANIMATIONS ===== */}
            <section className="relative z-10 py-12 border-y border-[#DECDBB] dark:border-[#1F232C] bg-[#EFE6D9]/80 dark:bg-[#0E1116]/50 backdrop-blur-xl shadow-xs">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="p-4 rounded-2xl bg-[#FFFDF9] dark:bg-transparent border border-[#DECDBB] dark:border-transparent shadow-xs dark:shadow-none"
                            >
                                <div className="font-['Fraunces'] italic text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-[#B85323] via-[#D97B4F] to-[#C6822E] dark:from-[#FF8F6B] dark:to-[#F5C36B] bg-clip-text text-transparent">
                                    <Counter
                                        target={stat.target}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals}
                                    />
                                </div>
                                <div className="text-xs sm:text-sm font-extrabold text-[#36271A] dark:text-gray-400 mt-1 uppercase tracking-wider font-[Manrope]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES GRID ===== */}
            <section className="relative z-10 py-24 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B85323] dark:text-[#F5C36B]"
                        >
                            Designed For Expression
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="font-['Fraunces'] italic text-4xl sm:text-5xl font-bold text-[#1F1710] dark:text-[#EDEBE6] mt-3"
                        >
                            Built for the next generation of social interaction
                        </motion.h2>
                        <p className="text-sm sm:text-base text-[#5C4A3C] dark:text-[#8A8F9C] mt-3 font-medium">
                            Everything you need to share, chat, discover, and build meaningful relationships.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="group relative bg-[#FFFDF9] dark:bg-[#12151C] rounded-3xl p-6 border border-[#E2D4C3] dark:border-[#1F232C] shadow-[0_10px_30px_-10px_rgba(217,123,79,0.15)] hover:shadow-[0_20px_40px_-10px_rgba(217,123,79,0.25)] hover:border-[#FF8F6B]/60 dark:hover:border-[#F5C36B]/50 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-5">
                                            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-[#1A140D] shadow-md group-hover:scale-110 transition-transform duration-300`}>
                                                <Icon />
                                            </div>
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FFE8D6] dark:bg-white/10 text-[#B85323] dark:text-[#F5C36B]">
                                                {feature.badge}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-[#1F1710] dark:text-[#EDEBE6] font-[Manrope]">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#5C4A3C] dark:text-[#8A8F9C] mt-2.5 leading-relaxed font-medium font-[Manrope]">
                                            {feature.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-[#EFE5D8] dark:border-[#1F232C]/60 flex items-center text-xs font-extrabold text-[#B85323] dark:text-[#F5C36B]">
                                        <span>Explore feature</span>
                                        <span className="ml-1 transition-transform group-hover:translate-x-1.5">→</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS SECTION ===== */}
            <section className="relative z-10 py-20 px-4 sm:px-6 bg-gradient-to-b from-[#F6EFE6] via-[#EFE6D9] to-[#F6EFE6] dark:from-[#0B0D12] dark:via-[#11151D] dark:to-[#0B0D12]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-14">
                        <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B85323] dark:text-[#F5C36B]">
                            Community Feedback
                        </span>
                        <h2 className="font-['Fraunces'] italic text-3xl sm:text-4xl font-bold text-[#1F1710] dark:text-[#EDEBE6] mt-2">
                            Loved by creators everywhere
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((t, idx) => (
                            <motion.div
                                key={t.author}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="rounded-3xl border border-[#E2D4C3] dark:border-[#1F232C] bg-[#FFFDF9] dark:bg-[#12151C] p-6 shadow-[0_10px_30px_-10px_rgba(217,123,79,0.12)] dark:shadow-xs flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-1 text-amber-500">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <HiStar key={i} className="h-4 w-4 text-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-xs sm:text-sm text-[#36271A] dark:text-[#EDEBE6] italic leading-relaxed font-medium">
                                        "{t.quote}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[#EFE5D8] dark:border-[#1F232C]">
                                    <img
                                        src={t.avatar}
                                        alt={t.author}
                                        className="h-10 w-10 rounded-full object-cover border border-[#D97B4F]/30 dark:border-[#1F232C] ring-2 ring-[#FF8F6B]/20"
                                    />
                                    <div>
                                        <h4 className="text-xs font-bold text-[#1F1710] dark:text-white">{t.author}</h4>
                                        <p className="text-[11px] font-semibold text-[#665548] dark:text-gray-400">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA FOOTER BANNER ===== */}
            <section className="relative z-10 py-24 px-4 sm:px-6 overflow-hidden">
                <div className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] p-8 sm:p-14 shadow-2xl text-center">
                    {/* Background SVG Gust Patterns */}
                    <div className="absolute inset-0 opacity-25 pointer-events-none">
                        <WindLines reduce={reduce} />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                        <h2 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-bold text-[#1A140D] tracking-tight leading-tight drop-shadow-xs">
                            Ready to experience Zephyra?
                        </h2>
                        <p className="text-base sm:text-lg text-[#1A140D] font-semibold">
                            Join thousands of users sharing ideas, messaging friends, and enjoying a distraction-free social realm today.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/register"
                                className="px-8 py-4 bg-[#1A140D] text-white font-extrabold text-sm rounded-full hover:scale-105 transition-all shadow-xl font-[Manrope] min-w-48"
                            >
                                Create Free Account →
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 border border-[#1A140D]/40 bg-white/30 backdrop-blur-md text-[#1A140D] font-extrabold text-sm rounded-full hover:bg-white/40 transition-all font-[Manrope]"
                            >
                                Existing User Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}