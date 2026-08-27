import { motion } from 'framer-motion';
import {
    HiOutlineSun,
    HiOutlineBolt,
    HiOutlineShieldCheck,
    HiOutlineCheck,
    HiOutlineChatBubbleLeftRight,
    HiOutlinePaintBrush,
} from 'react-icons/hi2';
import changelogBgLight from '../assets/changelog-bg-light.jpg';
import changelogBgDark from '../assets/changelog-bg-dark.jpg';

// Animated wind gust SVG lines for smooth motion
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25 z-0"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="changelogGust" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        <motion.path
            d="M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
            fill="none"
            stroke="url(#changelogGust)"
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
            stroke="url(#changelogGust)"
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

const RELEASES = [
    {
        version: 'v2.4.0',
        date: 'August 2026',
        tag: 'Latest Release',
        title: 'Real-Time Messaging & Direct Chat Overhaul',
        icon: HiOutlineChatBubbleLeftRight,
        accent: 'from-[#FF8F6B] to-[#D97B4F]',
        changes: [
            'Sub-second WebSocket messaging with live seen and delivery indicators.',
            'Refined mobile chat input with auto-expanding textarea and no scrollbar clutter.',
            'Direct message search and instant recipient conversation opening.',
            'High-contrast Sent and Seen badges for improved readability.',
        ],
    },
    {
        version: 'v2.3.0',
        date: 'August 2026',
        tag: 'Major Update',
        title: 'Master Admin Control Center & RBAC Security',
        icon: HiOutlineShieldCheck,
        accent: 'from-[#F5C36B] to-[#FF8F6B]',
        changes: [
            'Dedicated Administrator security gate with credential authentication.',
            'Platform Analytics dashboard with 7-day registration and story charts.',
            'One-click User Moderation, suspension reasons, and account deletion controls.',
            'System-wide announcement broadcaster with instant Socket.IO push alerts.',
        ],
    },
    {
        version: 'v2.2.0',
        date: 'July 2026',
        tag: 'Feature Release',
        title: 'Visual Storytelling & Lightbox Engine',
        icon: HiOutlinePaintBrush,
        accent: 'from-[#D97B4F] to-[#C6822E]',
        changes: [
            'High-resolution image upload with integrated aspect ratio crop tools.',
            'Smooth interactive image lightbox with backdrop blur.',
            'Rich comment threading and real-time like counters.',
            'Custom user avatars and banner image personalization.',
        ],
    },
    {
        version: 'v2.1.0',
        date: 'June 2026',
        tag: 'Design System',
        title: 'Atmospheric Glassmorphism & Sunset Theme',
        icon: HiOutlineSun,
        accent: 'from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]',
        changes: [
            'Full dual-mode design (Terracotta Warm Light and Obsidian Dark).',
            'Fraunces editorial display font integration for story headlines.',
            'SVG wind breeze particle animations on landing pages.',
            'Zero-tracker privacy architecture and GDPR data management.',
        ],
    },
];

export default function Changelog() {
    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Realistic Photography Background Wallpaper - Light Mode */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat dark:hidden opacity-90 blur-[2.5px] scale-105 transition-all duration-500 pointer-events-none z-0"
                style={{ backgroundImage: `url(${changelogBgLight})` }}
            />
            {/* Realistic Photography Background Wallpaper - Dark Mode */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat hidden dark:block opacity-75 blur-[2.5px] scale-105 transition-all duration-500 pointer-events-none z-0"
                style={{ backgroundImage: `url(${changelogBgDark})` }}
            />

            <div className="relative max-w-4xl mx-auto space-y-12 z-10">

                {/* Hero Header Card with Entrance Motion Animation & Black Border in Day Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative text-center space-y-6 max-w-3xl mx-auto p-8 sm:p-14 rounded-3xl bg-white/92 dark:bg-[#11151F]/90 backdrop-blur-xl border-2 border-black dark:border-[#FF8F6B]/35 shadow-2xl overflow-hidden"
                >
                    <WindBreeze />
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xs font-black uppercase tracking-widest shadow-xs relative z-10"
                    >
                        Release Notes & Changelog
                    </motion.span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1C1008] dark:text-white relative z-10">
                        What's New in Zephyra
                    </h1>
                    <p className="text-base sm:text-xl text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold max-w-xl mx-auto relative z-10">
                        Continuous improvements, speed optimizations, and new features shipped to the community.
                    </p>
                </motion.div>

                {/* Release Timeline with Staggered Animations & Hover Lift */}
                <div className="space-y-8">
                    {RELEASES.map((rel, idx) => {
                        const Icon = rel.icon;
                        return (
                            <motion.div
                                key={rel.version}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                whileHover={{ y: -6, scale: 1.01 }}
                                className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden transition-all cursor-pointer"
                            >
                                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${rel.accent}`} />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-[#1F232C] pb-5">
                                    <div className="flex items-center gap-4">
                                        <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                            <Icon className="stroke-[2.2]" />
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-2.5">
                                                <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-black text-[#1C1008] dark:text-white">
                                                    {rel.version}
                                                </h2>
                                                <span className="px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF8F6B]/20 text-[#9E3610] dark:text-[#F5C36B] border-2 border-black dark:border-[#FF8F6B]/40">
                                                    {rel.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#5E3821] dark:text-gray-400 font-bold mt-0.5">{rel.date}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-sm sm:text-base font-black text-[#1C1008] dark:text-white">{rel.title}</h3>
                                </div>

                                <ul className="space-y-3">
                                    {rel.changes.map((item, itemIdx) => (
                                        <motion.li
                                            key={item}
                                            initial={{ opacity: 0, x: -15 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.35, delay: itemIdx * 0.08 }}
                                            className="flex items-start gap-3 text-xs sm:text-sm text-[#3D2517] dark:text-[#CBD5E1] leading-relaxed font-bold"
                                        >
                                            <span className="p-1 rounded-full bg-emerald-200 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 text-xs shrink-0 mt-0.5 font-black border border-black dark:border-emerald-700">
                                                <HiOutlineCheck />
                                            </span>
                                            <span>{item}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
