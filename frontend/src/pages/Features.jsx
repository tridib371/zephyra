import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import featuresBgLight from '../assets/features-bg-light.jpg';
import featuresBgDark from '../assets/features-bg-dark.jpg';

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
            {/* Realistic Platform Capabilities & Features Photography Wallpapers - Clear & Sharp */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <img
                    src={featuresBgLight}
                    alt="Platform Capabilities & Design Workstation Light Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-95 blur-[0.5px] scale-100 transition-opacity duration-700 dark:hidden"
                />
                <img
                    src={featuresBgDark}
                    alt="High-Tech Developer Workstation & Real-Time Analytics Dark Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-85 blur-[0.5px] scale-100 transition-opacity duration-700 hidden dark:block"
                />
                {/* Overlay Tint Gradients for High Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/65 via-[#FAF7F2]/45 to-[#FAF7F2]/75 dark:from-[#0E1116]/75 dark:via-[#0E1116]/70 dark:to-[#0E1116]/85" />
            </div>

            <div className="relative max-w-5xl mx-auto space-y-16 z-10">

                {/* Hero Header Card with Entrance Animation & Black Border in Day Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative text-center space-y-6 max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-white/92 dark:bg-[#11151F]/90 backdrop-blur-xl border-2 border-black dark:border-[#FF8F6B]/35 shadow-2xl overflow-hidden"
                >
                    <WindBreeze />
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xs font-black uppercase tracking-widest shadow-xs relative z-10"
                    >
                        Platform Capabilities
                    </motion.span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1C1008] dark:text-white relative z-10">
                        Built for Meaningful Connection
                    </h1>
                    <p className="text-base sm:text-xl text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold max-w-2xl mx-auto relative z-10">
                        Discover the craft, technology, and intentional design behind Zephyra's calm social experience.
                    </p>
                </motion.div>

                {/* Interactive Feature Tabs with Staggered Entrance & Hover Animation */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {CORE_FEATURES.map((item, idx) => {
                        const Icon = item.icon;
                        const isSelected = selectedFeature === item.id;
                        return (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -5, scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelectedFeature(item.id)}
                                className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer flex flex-col gap-3.5 ${
                                    isSelected
                                        ? 'bg-[#FFF7F4] dark:bg-[#1E2638] border-black dark:border-[#FF8F6B] ring-2 ring-black dark:ring-[#FF8F6B]/40 shadow-xl'
                                        : 'bg-white/90 dark:bg-[#12151C]/90 border-black dark:border-[#1F232C] hover:border-black dark:hover:border-[#FF8F6B]/60 shadow-md backdrop-blur-md'
                                }`}
                            >
                                <span className={`p-3 rounded-xl text-xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40 transition-all ${isSelected ? 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-md' : 'bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B]'}`}>
                                    <Icon className="stroke-[2.2]" />
                                </span>
                                <span className={`text-xs sm:text-sm font-black line-clamp-1 ${isSelected ? 'text-[#9E3610] dark:text-[#F5C36B]' : 'text-[#1C1008] dark:text-white'}`}>
                                    {item.title}
                                </span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Animated Feature Spotlight Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedFeature}
                        initial={{ opacity: 0, y: 25, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.45, ease: 'easeOut' }}
                        className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-8 sm:p-12 shadow-2xl backdrop-blur-xl space-y-8"
                    >
                        <div className="space-y-3">
                            <span className="text-xs font-black uppercase tracking-widest text-[#9E3610] dark:text-[#F5C36B]">
                                {active.category}
                            </span>
                            <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-bold text-[#1C1008] dark:text-white">
                                {active.title}
                            </h2>
                            <p className="text-sm sm:text-base text-[#4D3222] dark:text-[#A0A5B2] leading-relaxed max-w-2xl font-bold">
                                {active.desc}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t-2 border-black dark:border-[#1F232C]">
                            {active.details.map((point, i) => (
                                <motion.div
                                    key={point}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.08, duration: 0.4 }}
                                    whileHover={{ scale: 1.02 }}
                                    className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] shadow-xs cursor-pointer"
                                >
                                    <span className="p-1 rounded-full bg-emerald-200 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 text-xs shrink-0 mt-0.5 font-black border border-black dark:border-emerald-700">
                                        <HiOutlineCheck />
                                    </span>
                                    <span className="text-xs sm:text-sm font-black text-[#1C1008] dark:text-[#C5C9D3]">{point}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Quick Highlights Grid with Scroll Animation */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-white/90 dark:bg-[#12151C] shadow-xl backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlinePhoto className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#1C1008] dark:text-white">Visual Storytelling</h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            Share high-resolution images with seamless aspect ratio preservation and intuitive crop controls.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-white/90 dark:bg-[#12151C] shadow-xl backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineBellAlert className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#1C1008] dark:text-white">Instant Alerts</h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            Receive real-time notifications for likes, comments, mentions, and administrative broadcasts.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-white/90 dark:bg-[#12151C] shadow-xl backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineDevicePhoneMobile className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#1C1008] dark:text-white">Adaptive Mobile UX</h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            Full-screen responsive layouts crafted specifically for handheld devices and touch interactions.
                        </p>
                    </motion.div>
                </div>

                {/* Call to Action with Scroll Animation & Interactive Pulse Button */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/40 bg-white/92 dark:bg-gradient-to-r dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-6"
                >
                    <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-extrabold text-[#1C1008] dark:text-white">Ready to explore Zephyra?</h2>
                    <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#9DA3B4] max-w-md mx-auto font-bold">
                        Create your free account today and experience a tranquil, real-time social platform.
                    </p>
                    <div className="pt-2">
                        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }} className="inline-block">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full transition-all shadow-md cursor-pointer"
                            >
                                Get Started Free <HiArrowRight className="text-base" />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
