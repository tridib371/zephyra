import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiOutlineBolt,
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineChatBubbleLeftRight,
    HiOutlinePhoto,
    HiOutlineSun,
    HiOutlineBellAlert,
    HiOutlineDevicePhoneMobile,
    HiArrowRight,
    HiOutlineCheck,
} from 'react-icons/hi2';
import aboutBgLight from '../assets/about-bg-light.jpg';
import aboutBgDark from '../assets/about-bg-dark.jpg';

// Animated wind gust SVG lines for smooth motion
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25 z-0"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="featureGust" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        <motion.path
            d="M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
            fill="none"
            stroke="url(#featureGust)"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
                d: [
                    "M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220",
                    "M -100 240 C 250 140, 480 260, 800 240 S 1100 60, 1350 180",
                    "M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
                ],
                opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
            d="M -100 500 C 300 620, 600 380, 950 540 S 1180 460, 1350 500"
            fill="none"
            stroke="url(#featureGust)"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{
                d: [
                    "M -100 500 C 300 620, 600 380, 950 540 S 1180 460, 1350 500",
                    "M -100 460 C 220 540, 680 460, 900 480 S 1120 580, 1350 520",
                    "M -100 500 C 300 620, 600 380, 950 540 S 1180 460, 1350 500"
                ],
                opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
    </svg>
);

const CORE_FEATURES = [
    {
        id: 'messaging',
        title: 'Direct Messaging & Live Currents',
        category: 'Real-Time Communication',
        icon: HiOutlineChatBubbleLeftRight,
        desc: 'Sub-second real-time chat powered by WebSocket micro-clusters. Enjoy instant message delivery, seen receipts, live typing indicators, and media sharing.',
        details: [
            'Instant two-way socket delivery with < 15ms latency',
            'Bold seen indicators (Sent and Seen badges)',
            'Auto-resizing chat input bar tuned for mobile keyboards',
            'Full privacy with direct member-to-member channels',
        ],
        gradient: 'from-[#FF8F6B] to-[#D97B4F]',
    },
    {
        id: 'chronological',
        title: 'Unmanipulated Chronological Feed',
        category: 'Serene Content Flow',
        icon: HiOutlineClock,
        desc: 'A pure, distraction-free feed that honors your time. Posts appear in the order they were shared, without rage-bait algorithms or paid boosts.',
        details: [
            '100% chronological post ordering',
            'Zero sponsored ads or algorithmic manipulation',
            'Smooth infinite scroll and instant like / comment reactions',
            'Rich media lightbox for high-res photo viewing',
        ],
        gradient: 'from-[#F5C36B] to-[#FF8F6B]',
    },
    {
        id: 'design',
        title: 'Atmospheric Dusk-to-Dawn Design',
        category: 'Mindful User Experience',
        icon: HiOutlineSun,
        desc: 'Thoughtfully crafted with human-centric warm palettes, organic wind curves, and high-contrast glassmorphic cards in both Light and Dark modes.',
        details: [
            'Warm Terracotta, Sunset Coral, and Golden Amber tones',
            'Deep obsidian Dark Mode engineered to eliminate eye fatigue',
            'Silky 60fps micro-animations and responsive mobile drawers',
            'Fraunces editorial typography for expressive story titles',
        ],
        gradient: 'from-[#D97B4F] to-[#C6822E]',
    },
    {
        id: 'privacy',
        title: 'Granular Privacy & Account Control',
        category: 'Safety & Ownership',
        icon: HiOutlineShieldCheck,
        desc: 'You own your data and decide who connects with you. Manage session security, customize who can view your posts, and delete your account with one click.',
        details: [
            'Zero third-party telemetry or ad-network trackers',
            'Instant account export and permanent deletion options',
            'Cryptographic salted password hashing via bcrypt',
            'Proactive spam protection and community moderation',
        ],
        gradient: 'from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]',
    },
];

export default function Features() {
    const [selectedFeature, setSelectedFeature] = useState(CORE_FEATURES[0].id);
    const active = CORE_FEATURES.find((f) => f.id === selectedFeature) || CORE_FEATURES[0];

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Realistic Photography Background Wallpaper - Light Mode */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat dark:hidden opacity-90 blur-[2.5px] scale-105 transition-all duration-500 pointer-events-none z-0"
                style={{ backgroundImage: `url(${aboutBgLight})` }}
            />
            {/* Realistic Photography Background Wallpaper - Dark Mode */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat hidden dark:block opacity-75 blur-[2.5px] scale-105 transition-all duration-500 pointer-events-none z-0"
                style={{ backgroundImage: `url(${aboutBgDark})` }}
            />

            <div className="relative max-w-5xl mx-auto space-y-16 z-10">

                {/* Hero Header in Frosted Glass Card */}
                <div className="relative text-center space-y-6 max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-white/85 dark:bg-[#11151F]/90 backdrop-blur-xl border border-white/90 dark:border-[#1F2636] shadow-2xl overflow-hidden">
                    <WindBreeze />
                    <span className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/35 text-xs font-black uppercase tracking-widest shadow-xs relative z-10">
                        Platform Capabilities
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-white relative z-10">
                        Built for Meaningful Connection
                    </h1>
                    <p className="text-base sm:text-xl text-[#334155] dark:text-[#9DA3B4] leading-relaxed font-medium max-w-2xl mx-auto relative z-10">
                        Discover the craft, technology, and intentional design behind Zephyra's calm social experience.
                    </p>
                </div>

                {/* Interactive Feature Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {CORE_FEATURES.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedFeature === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelectedFeature(item.id)}
                                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col gap-3.5 ${
                                    isSelected
                                        ? 'bg-[#FFF7F4] dark:bg-[#1E2638] border-[#FF8F6B] dark:border-[#FF8F6B] ring-2 ring-[#FF8F6B]/40 shadow-lg scale-[1.02]'
                                        : 'bg-white/85 dark:bg-[#12151C]/85 border-gray-200 dark:border-[#1F232C] hover:border-[#FF8F6B]/60 shadow-sm backdrop-blur-md'
                                }`}
                            >
                                <span className={`p-3 rounded-xl text-xl w-fit flex items-center justify-center transition-all ${isSelected ? 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-md' : 'bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B]'}`}>
                                    <Icon className="stroke-[2.2]" />
                                </span>
                                <span className={`text-xs sm:text-sm font-bold line-clamp-1 ${isSelected ? 'text-[#C2410C] dark:text-[#F5C36B]' : 'text-[#0F172A] dark:text-white'}`}>
                                    {item.title}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Feature Spotlight Card */}
                <div className="rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C]/90 p-8 sm:p-12 shadow-xl backdrop-blur-xl space-y-8">
                    <div className="space-y-3">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#C2410C] dark:text-[#F5C36B]">
                            {active.category}
                        </span>
                        <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-white">
                            {active.title}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-[#A0A5B2] leading-relaxed max-w-2xl font-medium">
                            {active.desc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200/80 dark:border-[#1F232C]">
                        {active.details.map((point) => (
                            <div key={point} className="flex items-start gap-3 p-4 rounded-2xl bg-white/90 dark:bg-[#181C26] border border-gray-200/80 dark:border-[#252A36] shadow-xs">
                                <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs shrink-0 mt-0.5 font-bold">
                                    <HiOutlineCheck />
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-[#C5C9D3]">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 sm:p-7 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C] shadow-lg backdrop-blur-xl space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center">
                            <HiOutlinePhoto className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#0F172A] dark:text-white">Visual Storytelling</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8A8F9C] leading-relaxed font-medium">
                            Share high-resolution images with seamless aspect ratio preservation and intuitive crop controls.
                        </p>
                    </div>

                    <div className="p-6 sm:p-7 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C] shadow-lg backdrop-blur-xl space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center">
                            <HiOutlineBellAlert className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#0F172A] dark:text-white">Instant Alerts</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8A8F9C] leading-relaxed font-medium">
                            Receive real-time notifications for likes, comments, mentions, and administrative broadcasts.
                        </p>
                    </div>

                    <div className="p-6 sm:p-7 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C] shadow-lg backdrop-blur-xl space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center">
                            <HiOutlineDevicePhoneMobile className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#0F172A] dark:text-white">Adaptive Mobile UX</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8A8F9C] leading-relaxed font-medium">
                            Full-screen responsive layouts crafted specifically for handheld devices and touch interactions.
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="rounded-3xl border border-[#FF8F6B]/40 dark:border-[#FF8F6B]/40 bg-gradient-to-r from-[#FFF5EF]/90 via-white/90 to-[#FAF0E6]/90 dark:from-[#181C26]/90 dark:via-[#12151C]/90 dark:to-[#181C26]/90 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6">
                    <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white">Ready to explore Zephyra?</h2>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-[#9DA3B4] max-w-md mx-auto font-medium">
                        Create your free account today and experience a tranquil, real-time social platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full hover:scale-105 transition-all shadow-md cursor-pointer"
                        >
                            <span>Join the Community</span>
                            <HiArrowRight className="text-base" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}

