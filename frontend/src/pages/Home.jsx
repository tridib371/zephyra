import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import {
    HiStar,
    HiOutlinePencilSquare,
    HiOutlineBolt,
    HiOutlineShieldCheck,
    HiOutlineGlobeAlt,
    HiXMark,
    HiCheckCircle,
} from 'react-icons/hi2';

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
        id: 'express',
        icon: HiOutlinePencilSquare,
        title: 'Set your thoughts adrift',
        description: 'Post updates, media, and spontaneous thoughts - Zephyra carries them to standard feeds instantly.',
        badge: 'Express Freely',
        gradient: 'from-[#FF6B6B] via-[#FF8E53] to-[#F5C36B]',
        cardBg: 'bg-gradient-to-br from-[#FFE8E0] via-[#FFF2EC] to-[#FFDDD0] dark:from-[#1E1926] dark:via-[#161B26] dark:to-[#261B25]',
        borderColor: 'border-2 border-[#FF7A59] dark:border-[#4A2B3B]',
        badgeBg: 'bg-[#FF5733] text-white font-extrabold dark:bg-[#FF6B6B]/20 dark:text-[#FF8E53]',
        glowColor: 'shadow-[0_12px_35px_rgba(255,107,107,0.2)] hover:shadow-[0_20px_45px_rgba(255,107,107,0.35)]',
        accentText: 'text-[#D9381E] dark:text-[#FF8E53]',
        modalSubtitle: 'Express Without Boundaries or Suppression',
        details: [
            {
                title: 'Rich Media & Micro-Gusts',
                desc: 'Share high-resolution images, rich Markdown formatting, and spontaneous micro-thoughts with zero file compression degradation.'
            },
            {
                title: 'Chronological Feed Delivery',
                desc: 'Your posts are delivered directly to your followers in exact real-time order with zero algorithmic shadow-banning or artificial throttling.'
            },
            {
                title: 'Wind-Tag Categorization',
                desc: 'Organize your posts with custom topic wind-tags so creators interested in niche topics can discover your voice instantly.'
            }
        ],
        metrics: [
            { label: 'Instant Feed Sync', value: '100%' },
            { label: 'Media Loss', value: '0%' },
            { label: 'Markdown & Code', value: 'Built-in' }
        ],
        ctaText: 'Start Expressing Freely',
        ctaLink: '/register'
    },
    {
        id: 'realtime',
        icon: HiOutlineBolt,
        title: 'Real-time Currents',
        description: 'Instant socket-powered messaging, live interactions, and instant notifications that never sleep.',
        badge: 'Zero Latency',
        gradient: 'from-[#6366F1] via-[#8B5CF6] to-[#EC4899]',
        cardBg: 'bg-gradient-to-br from-[#EAE6FF] via-[#F3F0FF] to-[#DFD8FF] dark:from-[#191832] dark:via-[#161B26] dark:to-[#241A38]',
        borderColor: 'border-2 border-[#6366F1] dark:border-[#3D3366]',
        badgeBg: 'bg-[#4F46E5] text-white font-extrabold dark:bg-[#6366F1]/20 dark:text-[#A5B4FC]',
        glowColor: 'shadow-[0_12px_35px_rgba(99,102,241,0.2)] hover:shadow-[0_20px_45px_rgba(99,102,241,0.35)]',
        accentText: 'text-[#4F46E5] dark:text-[#A5B4FC]',
        modalSubtitle: 'Sub-15ms WebSocket Messaging Engine',
        details: [
            {
                title: 'Sub-15ms Socket Delivery',
                desc: 'Direct 1-on-1 and group messaging powered by an optimized Socket.IO infrastructure for instant message dispatch.'
            },
            {
                title: 'Live Presence & Typing Sync',
                desc: 'Know exactly when your friends are online, actively typing, or reading your messages with live status badges.'
            },
            {
                title: 'Realtime Inbox & Alerts',
                desc: 'Receive instant notifications for likes, comments, and new followers without ever needing to manually refresh the page.'
            }
        ],
        metrics: [
            { label: 'Sync Latency', value: '< 15ms' },
            { label: 'Socket Uptime', value: '99.9%' },
            { label: 'Live Presence', value: 'Realtime' }
        ],
        ctaText: 'Experience Realtime Chat',
        ctaLink: '/register'
    },
    {
        id: 'privacy',
        icon: HiOutlineShieldCheck,
        title: 'Complete Privacy Controls',
        description: 'Every post gives you full control. Public gusts, follower-only updates, or direct messages.',
        badge: 'Private & Secure',
        gradient: 'from-[#10B981] via-[#059669] to-[#F59E0B]',
        cardBg: 'bg-gradient-to-br from-[#DDF7EB] via-[#ECFAF3] to-[#CCF2DF] dark:from-[#13241F] dark:via-[#161B26] dark:to-[#12271E]',
        borderColor: 'border-2 border-[#10B981] dark:border-[#204E3C]',
        badgeBg: 'bg-[#059669] text-white font-extrabold dark:bg-[#10B981]/20 dark:text-[#6EE7B7]',
        glowColor: 'shadow-[0_12px_35px_rgba(16,185,129,0.2)] hover:shadow-[0_20px_45px_rgba(16,185,129,0.35)]',
        accentText: 'text-[#047857] dark:text-[#6EE7B7]',
        modalSubtitle: 'Your Content, Your Data, Your Absolute Rules',
        details: [
            {
                title: 'Granular Audience Scoping',
                desc: 'Choose precisely who views each post - Public Gusts for everyone, Follower-Only updates, or Direct Encrypted messages.'
            },
            {
                title: 'Zero Third-Party Data Selling',
                desc: 'Zephyra never tracks your off-site browsing habits or sells your data to third-party ad networks or brokers.'
            },
            {
                title: 'Instant Data Export & Deletion',
                desc: 'Enjoy complete digital sovereignty - export your complete profile archive or permanently delete your account history in 1 click.'
            }
        ],
        metrics: [
            { label: 'Ad Tracking', value: '0%' },
            { label: 'Data Sovereignty', value: '100%' },
            { label: 'Visibility Control', value: 'Per-Post' }
        ],
        ctaText: 'Manage Your Privacy',
        ctaLink: '/register'
    },
    {
        id: 'discovery',
        icon: HiOutlineGlobeAlt,
        title: 'Boundaryless Discovery',
        description: 'Discover trending stories, global topics, and active creators across every realm seamlessly.',
        badge: 'Explore Worlds',
        gradient: 'from-[#06B6D4] via-[#3B82F6] to-[#6366F1]',
        cardBg: 'bg-gradient-to-br from-[#E0F5FF] via-[#EEF9FF] to-[#D0EFFF] dark:from-[#132435] dark:via-[#161B26] dark:to-[#162A42]',
        borderColor: 'border-2 border-[#0284C7] dark:border-[#22476B]',
        badgeBg: 'bg-[#0284C7] text-white font-extrabold dark:bg-[#06B6D4]/20 dark:text-[#67E8F9]',
        glowColor: 'shadow-[0_12px_35px_rgba(6,182,212,0.2)] hover:shadow-[0_20px_45px_rgba(6,182,212,0.35)]',
        accentText: 'text-[#0E7490] dark:text-[#67E8F9]',
        modalSubtitle: 'Unbiased Global Topic & Creator Exploration',
        details: [
            {
                title: 'Global Topic Realms',
                desc: 'Explore curated channels spanning Digital Art, Software Engineering, Literature, Design, and World Philosophy.'
            },
            {
                title: 'Rising Creator Spotlights',
                desc: 'Discover authentic emerging creators based on genuine community engagement rather than manufactured virality.'
            },
            {
                title: 'Seamless One-Click Follows',
                desc: 'Connect with authors and thought leaders across the platform and customize your daily home stream instantly.'
            }
        ],
        metrics: [
            { label: 'Topic Channels', value: '50+' },
            { label: 'Rage-Bait Algorithms', value: 'Zero' },
            { label: 'Creator Network', value: '50K+' }
        ],
        ctaText: 'Explore Trending Feeds',
        ctaLink: '/register'
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
        badge: "Verified Creator",
        gradient: "bg-gradient-to-br from-[#FFF3EB] to-[#FFE5D4] dark:from-[#1E1A28] dark:to-[#2A1E24]",
        border: "border-2 border-[#FFB899] dark:border-[#542F3E]",
        accent: "text-[#D9381E] dark:text-[#FF8F6B]",
    },
    {
        quote: "The direct messaging and real-time feed feel so smooth. It's hands down the best social UI I've used.",
        author: "Marcus Vance",
        role: "Software Engineer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        badge: "Early Adopter",
        gradient: "bg-gradient-to-br from-[#F0EEFF] to-[#E2DEFF] dark:from-[#191832] dark:to-[#221A38]",
        border: "border-2 border-[#B5A8FF] dark:border-[#3D3366]",
        accent: "text-[#4F46E5] dark:text-[#A5B4FC]",
    },
    {
        quote: "Minimal, responsive, and blazing fast. Zephyra is the fresh breeze social platforms desperately needed.",
        author: "Elena Rostova",
        role: "Content Strategist",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        badge: "Community Lead",
        gradient: "bg-gradient-to-br from-[#E6F9F0] to-[#CCF2DF] dark:from-[#13241F] dark:to-[#122E22]",
        border: "border-2 border-[#8CE6B8] dark:border-[#204E3C]",
        accent: "text-[#047857] dark:text-[#6EE7B7]",
    },
    {
        quote: "The privacy features and sleek night mode make sharing my raw creative process completely anxiety-free.",
        author: "Devon Chen",
        role: "UX Architect",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        badge: "Pro Creator",
        gradient: "bg-gradient-to-br from-[#E6FBFC] to-[#C0ECFF] dark:from-[#132435] dark:to-[#162C44]",
        border: "border-2 border-[#85E0FA] dark:border-[#22476B]",
        accent: "text-[#0E7490] dark:text-[#67E8F9]",
    },
    {
        quote: "I moved my entire photography blog to Zephyra. The instant interaction latency is unbeatable.",
        author: "Sophia Sterling",
        role: "Visual Storyteller",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        badge: "Top Photographer",
        gradient: "bg-gradient-to-br from-[#FFF5F5] to-[#FFE3E3] dark:from-[#281822] dark:to-[#381B28]",
        border: "border-2 border-[#FFB3B3] dark:border-[#5E2B3E]",
        accent: "text-[#E11D48] dark:text-[#FB7185]",
    },
    {
        quote: "Clean, elegant, and distraction-free. It gives your content the spotlight it truly deserves.",
        author: "Liam Montgomery",
        role: "Indie Publisher",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        badge: "Founding Member",
        gradient: "bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] dark:from-[#242016] dark:to-[#332A18]",
        border: "border-2 border-[#FDE047] dark:border-[#52441D]",
        accent: "text-[#D97706] dark:text-[#FBBF24]",
    },
];

export default function Home() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const reduce = useReducedMotion();

    const [likesCount, setLikesCount] = useState(1482);
    const [hasLiked, setHasLiked] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(null);

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
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0B0D10] text-[#101828] dark:text-[#EDEBE6] font-[Manrope] transition-colors duration-300 overflow-x-hidden">

            {/* Background Ambient Glow Orbs - Tailored for both Light & Dark modes */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full bg-gradient-to-tr from-[#FF8F6B]/35 via-[#F5C36B]/25 to-[#D97B4F]/15 dark:from-[#FF8F6B]/20 dark:via-[#F5C36B]/15 dark:to-transparent blur-3xl opacity-75 dark:opacity-40 animate-pulse" />
                <div className="absolute top-1/3 -left-48 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#FF8F6B]/30 via-[#D97B4F]/20 to-transparent blur-3xl opacity-65 dark:opacity-30" />
                <div className="absolute bottom-10 -right-20 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#F5C36B]/30 via-[#FF8F6B]/20 to-transparent blur-3xl opacity-65 dark:opacity-30" />
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
                    className="mb-6 inline-flex items-center px-5 py-1.5 rounded-full border border-[#EAECF0] dark:border-[#FF8F6B]/30 bg-white/90 dark:bg-white/5 backdrop-blur-xl shadow-xs"
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

                    <p className="mt-6 text-lg sm:text-2xl text-[#344054] dark:text-[#E7E6E3] font-medium leading-relaxed max-w-2xl mx-auto">
                        A modern, real-time social platform crafted for instant conversations, beautiful posts, and genuine connections.
                    </p>

                    <p className="mt-3 text-sm sm:text-base text-[#475467] dark:text-[#8A8F9C] max-w-lg mx-auto font-[Manrope]">
                        Experience direct chats, dynamic feeds, and seamless interactions - free of noise and clutter.
                    </p>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 mt-7 sm:mt-9 justify-center items-center w-full"
                    >
                        <Link
                            to="/register"
                            className="group relative w-full max-w-[210px] sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-black text-xs sm:text-base rounded-full hover:brightness-105 shadow-md hover:scale-105 transition-all duration-300 text-center font-[Manrope] sm:min-w-48 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                                Start Your Journey
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 sm:h-4.5 sm:w-4.5 transition-transform group-hover:translate-x-1">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </Link>
                        <Link
                            to="/login"
                            className="w-full max-w-[210px] sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3.5 border border-[#EAECF0] dark:border-[#3A3F4B] bg-white dark:bg-white/5 backdrop-blur-md text-[#101828] dark:text-[#E7E6E3] font-bold text-xs sm:text-base rounded-full hover:border-[#D0D5DD] dark:hover:border-[#F5C36B]/60 hover:text-[#D97B4F] dark:hover:text-[#F5C36B] hover:scale-105 shadow-xs transition-all duration-300 text-center font-[Manrope] sm:min-w-44"
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
                    <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-[#FF8F6B]/30 via-[#F5C36B]/30 to-[#D97B4F]/30 blur-2xl opacity-60 dark:opacity-60" />

                    <div className="relative rounded-3xl border border-[#EAECF0] dark:border-[#1F232C] bg-white dark:bg-[#11151D]/95 backdrop-blur-2xl p-6 sm:p-8 shadow-xs dark:shadow-2xl">
                        {/* Mockup Header Bar */}
                        <div className="flex items-center justify-between gap-2 pb-4 mb-6 border-b border-[#EAECF0] dark:border-[#1F232C]">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-500 shrink-0" />
                                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500 shrink-0" />
                                <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500 shrink-0" />
                                <span className="ml-1.5 sm:ml-3 text-[11px] sm:text-xs font-bold text-[#667085] dark:text-gray-400 font-[Manrope] whitespace-nowrap">
                                    <span className="inline sm:hidden">Zephyra Feed</span>
                                    <span className="hidden sm:inline">Zephyra Interactive Feed Preview</span>
                                </span>
                            </div>
                            <span className="px-2.5 sm:px-3 py-1 rounded-full bg-[#FFE8D6] dark:bg-[#FF8F6B]/15 text-[#B85323] dark:text-[#F5C36B] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider border border-[#FF8F6B]/30 whitespace-nowrap shrink-0">
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
                                        <h4 className="font-bold text-base text-[#101828] dark:text-white">Aria Thorne</h4>
                                        <p className="text-xs font-medium text-[#667085] dark:text-gray-400">@ariathorne • 2 mins ago</p>
                                    </div>
                                </div>

                                <p className="text-sm sm:text-base text-[#344054] dark:text-[#EDEBE6] leading-relaxed font-medium">
                                    Just released a fresh digital art series inspired by sunset winds! Switched to Zephyra for real-time engagement and it feels amazing.
                                </p>

                                <div className="flex items-center gap-4 pt-2">
                                    <button
                                        onClick={handleLikeDemo}
                                        className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${hasLiked
                                            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 ring-2 ring-rose-500/40 scale-105'
                                            : 'bg-[#F8F9FA] dark:bg-[#181D27] text-[#101828] dark:text-gray-300 hover:bg-[#F2F4F7] dark:hover:bg-[#202734] border border-[#EAECF0] dark:border-transparent'
                                            }`}
                                    >
                                        <HeartIcon />
                                        <span>{likesCount} Likes</span>
                                    </button>

                                    <div className="flex items-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold bg-[#F8F9FA] dark:bg-[#181D27] text-[#101828] dark:text-gray-300 border border-[#EAECF0] dark:border-transparent">
                                        <MessageIcon />
                                        <span>42 Comments</span>
                                    </div>
                                </div>
                            </div>

                            {/* Simulated Chat Bubble Floating Mockup */}
                            <div className="md:col-span-5 rounded-2xl bg-[#F8F9FA] dark:bg-[#090B0E] p-4 border border-[#EAECF0] dark:border-[#1F232C] space-y-3 shadow-xs">
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
                                    <div className="rounded-2xl bg-white dark:bg-[#141821] p-3 text-xs border border-[#EAECF0] dark:border-[#1F232C] shadow-xs">
                                        <p className="font-bold text-[#101828] dark:text-white">Marcus</p>
                                        <p className="text-[#475467] dark:text-gray-300 mt-0.5 font-medium">Loving the colors! Just sent you a DM.</p>
                                    </div>
                                </div>

                                <div className="flex items-end justify-end gap-2.5">
                                    <div className="rounded-2xl bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] p-3 text-xs text-[#1A140D] font-bold shadow-xs">
                                        Got it! Reply coming right up.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ===== STATS BANNER WITH COUNT-UP ANIMATIONS ===== */}
            <section className="relative z-10 py-10 sm:py-14 border-y border-[#FF8F6B]/30 dark:border-[#283244] bg-gradient-to-r from-[#FF8F6B] via-[#E2774C] to-[#F5C36B] dark:bg-gradient-to-r dark:from-[#131722] dark:via-[#19202E] dark:to-[#131722] shadow-2xl overflow-hidden">
                {/* Radiant Ambient Glow Aura */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,143,107,0.15),transparent_70%)] pointer-events-none" />

                <div className="max-w-6xl mx-auto px-3.5 sm:px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
                        {STATS.map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ scale: 1.04, y: -4 }}
                                className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/95 dark:bg-[#1C2333]/90 backdrop-blur-md border border-white/60 dark:border-[#2D384D] shadow-xl dark:shadow-2xl hover:shadow-2xl dark:hover:border-[#FF8F6B]/70 dark:hover:shadow-[0_0_25px_rgba(255,143,107,0.2)] transition-all duration-300 flex flex-col justify-center items-center overflow-hidden"
                            >
                                <div className="font-['Fraunces'] italic text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-[#D97706] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent drop-shadow-xs dark:drop-shadow-[0_0_15px_rgba(255,143,107,0.4)] whitespace-nowrap">
                                    <Counter
                                        target={stat.target}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals}
                                    />
                                </div>
                                <div className="text-[10px] sm:text-xs font-black text-[#1A140D] dark:text-[#E2E8F0] mt-1.5 sm:mt-2.5 uppercase tracking-wider sm:tracking-[0.2em] font-[Manrope] leading-tight">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES GRID ===== */}
            <section className="relative z-10 py-24 px-4 sm:px-6 bg-[#F3F4F8] dark:bg-transparent border-y border-[#E2E8F0] dark:border-transparent transition-colors duration-300">
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
                            className="font-['Fraunces'] italic text-4xl sm:text-5xl font-bold text-[#101828] dark:text-[#EDEBE6] mt-3"
                        >
                            Built for the next generation of social interaction
                        </motion.h2>
                        <p className="text-sm sm:text-base text-[#475467] dark:text-[#8A8F9C] mt-3 font-medium">
                            Everything you need to share, chat, discover, and build meaningful relationships.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.12 }}
                                    whileHover={{ y: -10, scale: 1.03 }}
                                    onClick={() => setSelectedFeature(feature)}
                                    className={`group relative rounded-3xl p-6.5 border ${feature.cardBg} ${feature.borderColor} ${feature.glowColor} shadow-md transition-all duration-500 flex flex-col justify-between overflow-hidden cursor-pointer`}
                                >
                                    {/* Ambient Top Corner Gradient Halo Beam */}
                                    <div className={`absolute -top-12 -right-12 h-36 w-36 rounded-full bg-gradient-to-br ${feature.gradient} opacity-20 group-hover:opacity-40 blur-2xl transition-opacity duration-500 pointer-events-none`} />

                                    <div>
                                        <div className="flex items-center justify-between mb-6 relative z-10">
                                            {/* Icon Badge with Pulse Aura & Rotate animation */}
                                            <div className={`h-13 w-13 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ring-2 ring-white/40 dark:ring-black/20`}>
                                                <Icon />
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${feature.badgeBg} border border-current/20 shadow-xs backdrop-blur-md`}>
                                                {feature.badge}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-extrabold text-[#101828] dark:text-white font-[Manrope] group-hover:translate-x-0.5 transition-transform">
                                            {feature.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#475467] dark:text-[#CBD5E1] mt-3 leading-relaxed font-medium font-[Manrope]">
                                            {feature.description}
                                        </p>
                                    </div>

                                    <div className={`mt-8 pt-4 border-t border-current/10 flex items-center text-xs font-black ${feature.accentText} group-hover:gap-2 transition-all`}>
                                        <span>Explore feature</span>
                                        <span className="ml-1 transition-transform group-hover:translate-x-2 text-sm">→</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS SECTION WITH INFINITE MARQUEE ===== */}
            <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-[#F3F4F8] dark:bg-[#10141D] border-y border-[#E2E8F0] dark:border-[#283244] overflow-hidden">
                <div className="max-w-6xl mx-auto mb-8 sm:mb-12 text-center">
                    <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#B85323] dark:text-[#F5C36B]">
                        Community Feedback
                    </span>
                    <h2 className="font-['Fraunces'] italic text-2xl sm:text-4xl md:text-5xl font-bold text-[#101828] dark:text-white mt-1.5 sm:mt-2">
                        Loved by creators everywhere
                    </h2>
                    <p className="text-[11px] sm:text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 font-semibold">
                        Tap or hover any card to pause scrolling
                    </p>
                </div>

                {/* Infinite Scrolling Marquee Track */}
                <div className="relative w-full overflow-hidden py-2 sm:py-4">
                    {/* Left & Right Smooth Fade Gradients */}
                    <div className="absolute top-0 bottom-0 left-0 w-10 sm:w-28 bg-gradient-to-r from-[#F3F4F8] dark:from-[#10141D] to-transparent z-20 pointer-events-none" />
                    <div className="absolute top-0 bottom-0 right-0 w-10 sm:w-28 bg-gradient-to-l from-[#F3F4F8] dark:from-[#10141D] to-transparent z-20 pointer-events-none" />

                    <div className="animate-marquee-track gap-4 sm:gap-6 shrink-0">
                        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, idx) => (
                            <div
                                key={`${t.author}-${idx}`}
                                className={`w-72 sm:w-88 md:w-96 rounded-2xl sm:rounded-3xl p-4 sm:p-6 ${t.gradient} ${t.border} shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between shrink-0 cursor-pointer`}
                            >
                                <div className="space-y-2.5 sm:space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-0.5 sm:gap-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <HiStar key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 drop-shadow-xs" />
                                            ))}
                                        </div>
                                        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 dark:bg-black/40 border border-current/20 shadow-xs ${t.accent}`}>
                                            {t.badge}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-[#1E293B] dark:text-[#E2E8F0] italic leading-relaxed font-medium">
                                        "{t.quote}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 mt-4 pt-3 sm:mt-6 sm:pt-4 border-t border-current/15">
                                    <img
                                        src={t.avatar}
                                        alt={t.author}
                                        className="h-9 w-9 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-white/60 dark:ring-black/40 shadow-sm shrink-0"
                                    />
                                    <div>
                                        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] dark:text-white">{t.author}</h4>
                                        <p className={`text-[10px] sm:text-[11px] font-extrabold ${t.accent}`}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
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

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#1A140D]/15 text-[#1A140D] text-xs font-black uppercase tracking-widest backdrop-blur-md border border-[#1A140D]/20">
                            <span>The Next Era of Social Connection</span>
                        </div>

                        <h2 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-black text-[#1A140D] tracking-tight leading-tight drop-shadow-xs">
                            Ready to experience Zephyra?
                        </h2>

                        <p className="text-base sm:text-lg text-[#1A140D] font-bold leading-relaxed max-w-2xl mx-auto">
                            Join thousands of creators sharing ideas, messaging friends in real time, and enjoying a distraction-free social realm where your voice carries freely on the wind.
                        </p>

                        {/* Animated Informative Platform Pillars Grid */}
                        <div className="grid sm:grid-cols-3 gap-4 pt-2 text-left">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                whileHover={{ y: -6, scale: 1.03 }}
                                className="p-4.5 rounded-2xl bg-white/40 backdrop-blur-md border border-[#1A140D]/15 space-y-1.5 shadow-xs hover:bg-white/60 hover:border-[#1A140D]/35 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <div className="text-xs font-black uppercase tracking-wider text-[#1A140D]">
                                    Sub-15ms Realtime Sync
                                </div>
                                <p className="text-xs text-[#1A140D]/85 font-semibold leading-relaxed">
                                    Socket-powered instant messaging and live notification delivery without latency.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                whileHover={{ y: -6, scale: 1.03 }}
                                className="p-4.5 rounded-2xl bg-white/40 backdrop-blur-md border border-[#1A140D]/15 space-y-1.5 shadow-xs hover:bg-white/60 hover:border-[#1A140D]/35 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <div className="text-xs font-black uppercase tracking-wider text-[#1A140D]">
                                    Complete Privacy Control
                                </div>
                                <p className="text-xs text-[#1A140D]/85 font-semibold leading-relaxed">
                                    Full authority over post visibility - public gusts, follower-only updates, or direct messages.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                whileHover={{ y: -6, scale: 1.03 }}
                                className="p-4.5 rounded-2xl bg-white/40 backdrop-blur-md border border-[#1A140D]/15 space-y-1.5 shadow-xs hover:bg-white/60 hover:border-[#1A140D]/35 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <div className="text-xs font-black uppercase tracking-wider text-[#1A140D]">
                                    Organic Discovery
                                </div>
                                <p className="text-xs text-[#1A140D]/85 font-semibold leading-relaxed">
                                    Pure chronological feeds and active creator exploration free from black-box algorithm bias.
                                </p>
                            </motion.div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center items-center w-full">
                            <Link
                                to="/register"
                                className="w-full max-w-[210px] sm:w-auto px-5 sm:px-9 py-2.5 sm:py-4 bg-[#1A140D] text-white font-black text-xs sm:text-base rounded-full hover:scale-105 transition-all shadow-2xl font-[Manrope] sm:min-w-52 text-center"
                            >
                                Create Free Account →
                            </Link>
                            <Link
                                to="/login"
                                className="w-full max-w-[210px] sm:w-auto px-5 sm:px-9 py-2.5 sm:py-4 border-2 border-[#1A140D]/40 bg-white/40 backdrop-blur-md text-[#1A140D] font-extrabold text-xs sm:text-base rounded-full hover:bg-white/60 transition-all font-[Manrope] sm:min-w-48 text-center"
                            >
                                Existing User Sign In
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-black text-[#1A140D]/80 pt-1">
                            <span>✓ Free Forever</span>
                            <span>•</span>
                            <span>✓ 30-Second Signup</span>
                            <span>•</span>
                            <span>✓ Zero Ad Distractions</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURE DETAIL MODAL ===== */}
            <AnimatePresence>
                {selectedFeature && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        {/* Backdrop Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedFeature(null)}
                            className="fixed inset-0 bg-[#090C15]/80 backdrop-blur-xl"
                        />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-[#141824] border border-[#EAECF0] dark:border-[#283244] p-6 sm:p-8 shadow-2xl z-10 text-[#101828] dark:text-[#E2E8F0] overflow-hidden"
                        >
                            {/* Top Accent Gradient Line */}
                            <div className={`h-2 w-full absolute top-0 left-0 bg-gradient-to-r ${selectedFeature.gradient}`} />

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedFeature(null)}
                                className="absolute top-5 right-5 p-2 rounded-full bg-[#F1F5F9] dark:bg-[#1E2638] text-[#64748B] dark:text-[#94A3B8] hover:text-[#101828] dark:hover:text-white transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <HiXMark className="h-5 w-5" />
                            </button>

                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6 pr-10">
                                <div className={`h-13 w-13 rounded-2xl bg-gradient-to-br ${selectedFeature.gradient} flex items-center justify-center text-white shadow-lg shrink-0`}>
                                    <selectedFeature.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${selectedFeature.badgeBg}`}>
                                        {selectedFeature.badge}
                                    </span>
                                    <h3 className="font-['Fraunces'] italic text-2xl sm:text-3xl font-extrabold text-[#101828] dark:text-white mt-1">
                                        {selectedFeature.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm font-semibold text-[#64748B] dark:text-[#94A3B8]">
                                        {selectedFeature.modalSubtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Detailed Informative Bullet Points */}
                            <div className="space-y-3.5 mb-6">
                                {selectedFeature.details.map((detail, idx) => (
                                    <div key={idx} className="p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#1B2130] border border-[#EAECF0] dark:border-[#252E42] flex items-start gap-3">
                                        <HiCheckCircle className={`h-5 w-5 shrink-0 mt-0.5 ${selectedFeature.accentText}`} />
                                        <div>
                                            <h4 className="text-sm font-extrabold text-[#101828] dark:text-white">
                                                {detail.title}
                                            </h4>
                                            <p className="text-xs text-[#475467] dark:text-[#CBD5E1] mt-1 leading-relaxed font-medium">
                                                {detail.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Metrics Banner */}
                            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#FFF5EE] dark:bg-[#1C2333] border border-[#F5D0C0] dark:border-[#2D384D] text-center mb-6">
                                {selectedFeature.metrics.map((metric, idx) => (
                                    <div key={idx}>
                                        <p className="text-sm sm:text-base font-black text-[#101828] dark:text-white">{metric.value}</p>
                                        <p className="text-[10px] sm:text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase">{metric.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Action CTA */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    onClick={() => setSelectedFeature(null)}
                                    className="px-5 py-2.5 rounded-full border border-[#CBD5E1] dark:border-[#3A475C] text-xs font-bold text-[#475467] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E2638] transition-colors cursor-pointer"
                                >
                                    Close Preview
                                </button>
                                <Link
                                    to={selectedFeature.ctaLink}
                                    onClick={() => setSelectedFeature(null)}
                                    className={`px-6 py-2.5 rounded-full bg-gradient-to-r ${selectedFeature.gradient} text-white text-xs font-extrabold shadow-md hover:brightness-110 hover:scale-105 transition-all`}
                                >
                                    {selectedFeature.ctaText} →
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}