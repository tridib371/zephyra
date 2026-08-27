import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlineEyeSlash,
    HiOutlineDocumentText,
    HiOutlineTrash,
    HiOutlineArrowDownTray,
    HiOutlineGlobeAlt,
    HiOutlineServer,
    HiOutlineEnvelope,
    HiOutlineCheck,
    HiOutlineChevronRight,
} from 'react-icons/hi2';

// Gorgeous fixed full-screen animated background canvas for Day & Night modes (No photo)
const GorgeousAnimatedBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Day Mode Vivid Gradient Waves & Glow Orbs */}
        <div className="absolute inset-0 dark:hidden">
            {/* Glowing Orb 1 - Top Left Terracotta Sunset */}
            <motion.div
                className="absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-gradient-to-br from-[#FF8F6B]/60 via-[#D97B4F]/40 to-[#F5C36B]/20 blur-3xl opacity-75"
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, -50, 40, 0],
                    scale: [1, 1.25, 0.9, 1],
                    rotate: [0, 45, 90, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Glowing Orb 2 - Center Right Golden Amber */}
            <motion.div
                className="absolute top-1/4 -right-32 w-[42rem] h-[42rem] rounded-full bg-gradient-to-bl from-[#F5C36B]/65 via-[#FF8F6B]/45 to-[#E05A47]/30 blur-3xl opacity-70"
                animate={{
                    x: [0, -80, 50, 0],
                    y: [0, 60, -30, 0],
                    scale: [1, 0.85, 1.2, 1],
                    rotate: [0, -60, 30, 0],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            {/* Glowing Orb 3 - Bottom Left Coral Rose */}
            <motion.div
                className="absolute -bottom-32 left-1/3 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-[#E05A47]/50 via-[#FF8F6B]/40 to-[#F5C36B]/30 blur-3xl opacity-75"
                animate={{
                    x: [0, 70, -60, 0],
                    y: [0, -60, 40, 0],
                    scale: [1, 1.15, 0.95, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
            {/* Glowing Floating Ambient Particles */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`day-particle-${i}`}
                    className="absolute rounded-full bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] blur-sm opacity-60"
                    style={{
                        width: `${16 + i * 8}px`,
                        height: `${16 + i * 8}px`,
                        left: `${15 + i * 15}%`,
                        top: `${20 + (i % 4) * 20}%`,
                    }}
                    animate={{
                        y: [0, -80, 0],
                        x: [0, i % 2 === 0 ? 40 : -40, 0],
                        opacity: [0.3, 0.7, 0.3],
                        scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                        duration: 8 + i * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 1.2,
                    }}
                />
            ))}
        </div>

        {/* Dark Mode Vivid Aurora & Midnight Glow Orbs */}
        <div className="absolute inset-0 hidden dark:block">
            {/* Glowing Orb 1 - Deep Sunset Coral Velvet */}
            <motion.div
                className="absolute -top-32 -left-32 w-[38rem] h-[38rem] rounded-full bg-gradient-to-br from-[#FF8F6B]/35 via-[#993B22]/30 to-[#3B1F42]/40 blur-3xl opacity-80"
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, -50, 40, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Glowing Orb 2 - Midnight Amber / Violet */}
            <motion.div
                className="absolute top-1/3 -right-32 w-[44rem] h-[44rem] rounded-full bg-gradient-to-bl from-[#C2410C]/40 via-[#5C243B]/35 to-[#1B2232]/50 blur-3xl opacity-80"
                animate={{
                    x: [0, -70, 40, 0],
                    y: [0, 50, -30, 0],
                    scale: [1, 0.85, 1.15, 1],
                }}
                transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
            {/* Glowing Orb 3 - Deep Terracotta Bottom */}
            <motion.div
                className="absolute -bottom-32 left-1/4 w-[40rem] h-[40rem] rounded-full bg-gradient-to-tr from-[#D97B4F]/35 via-[#FF8F6B]/25 to-transparent blur-3xl opacity-75"
                animate={{
                    x: [0, 50, -50, 0],
                    y: [0, -50, 30, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            />
            {/* Glowing Dark Mode Particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={`dark-particle-${i}`}
                    className="absolute rounded-full bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] blur-sm"
                    style={{
                        width: `${12 + i * 6}px`,
                        height: `${12 + i * 6}px`,
                        left: `${10 + i * 11}%`,
                        top: `${15 + (i % 4) * 22}%`,
                    }}
                    animate={{
                        y: [0, -90, 0],
                        x: [0, i % 2 === 0 ? 50 : -50, 0],
                        opacity: [0.2, 0.7, 0.2],
                        scale: [0.7, 1.3, 0.7],
                    }}
                    transition={{
                        duration: 7 + i * 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.9,
                    }}
                />
            ))}
        </div>

        {/* Dynamic Sweeping SVG Ribbon Waves across the viewport */}
        <svg
            className="absolute inset-0 h-full w-full pointer-events-none opacity-50 dark:opacity-35"
            viewBox="0 0 1400 900"
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id="gorgeousWave1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F5C36B" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="gorgeousWave2" x1="1" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F5C36B" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="#FF8F6B" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#E05A47" stopOpacity="0.8" />
                </linearGradient>
            </defs>
            <motion.path
                d="M -100 250 C 350 50, 750 450, 1150 200 S 1450 150, 1600 300"
                fill="none"
                stroke="url(#gorgeousWave1)"
                strokeWidth="3.5"
                strokeLinecap="round"
                animate={{
                    d: [
                        "M -100 250 C 350 50, 750 450, 1150 200 S 1450 150, 1600 300",
                        "M -100 300 C 400 150, 700 350, 1100 300 S 1400 100, 1600 250",
                        "M -100 250 C 350 50, 750 450, 1150 200 S 1450 150, 1600 300"
                    ],
                }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
                d="M -100 650 C 400 800, 800 500, 1200 700 S 1450 600, 1600 650"
                fill="none"
                stroke="url(#gorgeousWave2)"
                strokeWidth="2.8"
                strokeLinecap="round"
                animate={{
                    d: [
                        "M -100 650 C 400 800, 800 500, 1200 700 S 1450 600, 1600 650",
                        "M -100 600 C 350 700, 850 600, 1150 620 S 1400 750, 1600 680",
                        "M -100 650 C 400 800, 800 500, 1200 700 S 1450 600, 1600 650"
                    ],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
        </svg>
    </div>
);

const SECTIONS = [
    { id: 'pledge', title: '1. Executive Summary & Zero-Tracker Pledge' },
    { id: 'collection', title: '2. Information We Collect & Why' },
    { id: 'messaging', title: '3. Direct Messaging & Real-Time Privacy' },
    { id: 'non-commercial', title: '4. Non-Commercialization Guarantee' },
    { id: 'infrastructure', title: '5. Storage, Cloud & Encryption Standards' },
    { id: 'retention', title: '6. Data Retention & Automatic Purging' },
    { id: 'rights', title: '7. Your Rights (GDPR, CCPA & Global)' },
    { id: 'cookies', title: '8. Local Storage & Minimal Cookies' },
    { id: 'contact', title: '9. Data Protection Officer Contact' },
];

export default function Privacy() {
    const [activeSection, setActiveSection] = useState('pledge');

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY + 180;
            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                const el = document.getElementById(SECTIONS[i].id);
                if (el && el.offsetTop <= scrollPos) {
                    setActiveSection(SECTIONS[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - 100,
                behavior: 'smooth',
            });
            setActiveSection(id);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Dynamic Animated Ambient Color Mesh & Aurora Waves Canvas (No Photo) */}
            <GorgeousAnimatedBackground />

            <div className="relative max-w-6xl mx-auto space-y-12 z-10">

                {/* Hero Header in Frosted Glass Card */}
                <div className="relative text-center space-y-6 max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-white/80 dark:bg-[#11151F]/90 backdrop-blur-2xl border border-white/90 dark:border-[#1F2636] shadow-2xl overflow-hidden">
                    <WindBreeze />
                    <span className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/35 text-xs font-black uppercase tracking-widest shadow-xs relative z-10">
                        Trust, Transparency & Safety
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#0F172A] dark:text-white relative z-10">
                        Privacy Policy & Data Covenant
                    </h1>
                    <p className="text-base sm:text-xl text-[#334155] dark:text-[#9DA3B4] leading-relaxed font-medium max-w-2xl mx-auto relative z-10">
                        Last Updated: August 2026 • Version 2.4.0 • Effective for all registered and visiting members globally.
                    </p>
                </div>

                {/* Core Privacy Highlights Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 sm:p-7 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C] shadow-lg backdrop-blur-xl space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center">
                            <HiOutlineEyeSlash className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#0F172A] dark:text-white">No Behavioral Tracking</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8A8F9C] leading-relaxed font-medium">
                            We never install cross-site advertising pixels or track your reading habits across the web.
                        </p>
                    </div>

                    <div className="p-6 sm:p-7 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C] shadow-lg backdrop-blur-xl space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center">
                            <HiOutlineLockClosed className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#0F172A] dark:text-white">Cryptographic Security</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8A8F9C] leading-relaxed font-medium">
                            All passwords use 10-round salted bcrypt hashes, and socket streams communicate over TLS/WSS.
                        </p>
                    </div>

                    <div className="p-6 sm:p-7 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C] shadow-lg backdrop-blur-xl space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center">
                            <HiOutlineTrash className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#0F172A] dark:text-white">True Right to Erasure</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#8A8F9C] leading-relaxed font-medium">
                            When you delete a post or account, it is permanently purged from our primary database immediately.
                        </p>
                    </div>
                </div>

                {/* Main Content Layout with Sticky Navigation */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Table of Contents Sidebar */}
                    <div className="hidden lg:block sticky top-24 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C]/90 p-5 shadow-lg backdrop-blur-xl space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#C2410C] dark:text-[#FF8F6B] block mb-3 px-2">
                            Policy Navigation
                        </span>
                        {SECTIONS.map((sec) => {
                            const isCurrent = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => scrollToSection(sec.id)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                        isCurrent
                                            ? 'bg-gradient-to-r from-[#FF8F6B]/20 to-[#F5C36B]/20 text-[#C2410C] dark:text-[#F5C36B] font-extrabold border border-[#FF8F6B]/30 shadow-xs'
                                            : 'text-gray-700 dark:text-[#A0A5B2] hover:bg-[#FF8F6B]/10 dark:hover:bg-[#181C26] hover:text-[#C2410C]'
                                    }`}
                                >
                                    <span className="truncate">{sec.title}</span>
                                    {isCurrent && <HiOutlineChevronRight className="shrink-0 text-xs text-[#C2410C] dark:text-[#F5C36B]" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Detailed Legal Content */}
                    <div className="lg:col-span-3 rounded-3xl border border-white/90 dark:border-[#1F232C] bg-white/85 dark:bg-[#12151C]/95 p-8 sm:p-12 shadow-xl backdrop-blur-xl space-y-12 leading-relaxed text-gray-800 dark:text-[#C5C9D3] text-sm sm:text-base">

                        {/* 1. Executive Summary */}
                        <section id="pledge" className="space-y-4">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineShieldCheck className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    1. Executive Summary & Zero-Tracker Pledge
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                At Zephyra, privacy is not a compliance checkbox - it is the architectural foundation of our entire social platform. We created Zephyra as an intentional alternative to conventional ad-funded networks that monetize human attention, emotional volatility, and personal communication.
                            </p>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                <strong className="text-[#0F172A] dark:text-white">Our Core Pledge:</strong> We will never sell, rent, monetize, or trade your personal data, profile insights, reading habits, or message history to any advertising network, third-party broker, or commercial AI training consortium.
                            </p>
                        </section>

                        {/* 2. Collection Breakdown */}
                        <section id="collection" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineDocumentText className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    2. Information We Collect & Why
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                We collect only the minimum data strictly required to deliver a responsive, real-time social networking experience:
                            </p>
                            <div className="space-y-3.5">
                                <div className="p-4.5 rounded-2xl bg-white/90 dark:bg-[#181C26] border border-gray-200/80 dark:border-[#252A36] space-y-1 shadow-xs">
                                    <h3 className="font-bold text-[#0F172A] dark:text-white text-sm">Account & Identity Information</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] font-medium">
                                        Your chosen display name, unique username, email address, and cryptographically salted password hash. We use this to authenticate your sessions and ensure account security.
                                    </p>
                                </div>
                                <div className="p-4.5 rounded-2xl bg-white/90 dark:bg-[#181C26] border border-gray-200/80 dark:border-[#252A36] space-y-1 shadow-xs">
                                    <h3 className="font-bold text-[#0F172A] dark:text-white text-sm">Content, Media & Interactions</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] font-medium">
                                        Stories you publish, photos you upload, comments you post, and reactions you give. These are stored on our encrypted clusters to display in the chronological timeline.
                                    </p>
                                </div>
                                <div className="p-4.5 rounded-2xl bg-white/90 dark:bg-[#181C26] border border-gray-200/80 dark:border-[#252A36] space-y-1 shadow-xs">
                                    <h3 className="font-bold text-[#0F172A] dark:text-white text-sm">Technical Diagnostics</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] font-medium">
                                        IP address, user-agent string, and server error logs maintained for up to 14 days solely for rate-limiting, denial-of-service prevention, and bot mitigation.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Direct Messaging Privacy */}
                        <section id="messaging" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineLockClosed className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    3. Direct Messaging & Real-Time Privacy
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                Private conversations between members are transmitted using secure WebSocket connections (WSS) over encrypted TLS channels.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-[#CBD5E1]">
                                <li><strong className="text-[#0F172A] dark:text-white">Isolation:</strong> Only authenticated participants in a conversation thread have cryptographic query permissions to retrieve or read message histories.</li>
                                <li><strong className="text-[#0F172A] dark:text-white">Zero Content Scanning:</strong> We do not parse or scan the text of private messages for ad targeting, interest profiling, or keyword mining.</li>
                                <li><strong className="text-[#0F172A] dark:text-white">Seen Receipts:</strong> Real-time status indicators (Sent and Seen) are exchanged strictly between the conversation participants.</li>
                            </ul>
                        </section>

                        {/* 4. Non-Commercialization Guarantee */}
                        <section id="non-commercial" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineEyeSlash className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    4. Non-Commercialization Guarantee
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                Unlike traditional social media monopolies, Zephyra's economic model does not rely on surveillance capitalism:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300/80 dark:border-emerald-900/50 space-y-1.5 shadow-xs">
                                    <h4 className="font-black text-emerald-900 dark:text-emerald-300 text-xs uppercase tracking-wider">What We Guarantee</h4>
                                    <p className="text-xs sm:text-sm text-emerald-950 dark:text-[#A0A5B2] font-semibold leading-relaxed">
                                        • 0 third-party advertising SDKs<br />
                                        • 0 data broker syndication<br />
                                        • 0 behavioral profiling algorithms
                                    </p>
                                </div>
                                <div className="p-4.5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-300/80 dark:border-rose-900/50 space-y-1.5 shadow-xs">
                                    <h4 className="font-black text-rose-900 dark:text-rose-300 text-xs uppercase tracking-wider">What We Never Do</h4>
                                    <p className="text-xs sm:text-sm text-rose-950 dark:text-[#A0A5B2] font-semibold leading-relaxed">
                                        • Sell your email or reading trends<br />
                                        • Share message logs with advertisers<br />
                                        • Feed private drafts to public AI models
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 5. Storage & Encryption */}
                        <section id="infrastructure" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineServer className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    5. Storage, Cloud & Encryption Standards
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                We partner with leading cloud infrastructure providers that maintain strict SOC 2, ISO 27001, and GDPR compliance certifications:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-[#CBD5E1]">
                                <li><strong className="text-[#0F172A] dark:text-white">Database Layer:</strong> High-availability MongoDB Atlas clusters featuring AES-256 encryption at rest and isolated network VPC peering.</li>
                                <li><strong className="text-[#0F172A] dark:text-white">Media Storage:</strong> Cloudinary secure CDN storage with optimized delivery and signed access tokens.</li>
                                <li><strong className="text-[#0F172A] dark:text-white">In-Transit Protection:</strong> End-to-end TLS 1.3 encryption across all HTTP REST endpoints and WebSocket channels.</li>
                            </ul>
                        </section>

                        {/* 6. Data Retention */}
                        <section id="retention" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineTrash className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    6. Data Retention & Automatic Purging
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                We maintain data only for as long as your account remains active or until you explicitly delete specific content:
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border border-gray-200/80 dark:border-[#252A36] rounded-2xl overflow-hidden shadow-xs">
                                    <thead className="bg-[#FFF5EF] dark:bg-[#181C26] text-[#0F172A] dark:text-white font-extrabold">
                                        <tr>
                                            <th className="p-3.5">Data Category</th>
                                            <th className="p-3.5">Retention Period</th>
                                            <th className="p-3.5">Deletion Mechanism</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200/80 dark:divide-[#252A36] bg-white/90 dark:bg-[#12151C]">
                                        <tr>
                                            <td className="p-3.5 font-bold text-[#0F172A] dark:text-white">User Profile & Account</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">Until Account Deletion</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">Instant purge via Settings</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-bold text-[#0F172A] dark:text-white">Published Stories & Posts</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">Until User Deletion</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">Immediate hard-delete</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-bold text-[#0F172A] dark:text-white">Direct Message History</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">Until Thread Deletion</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">Cascade delete on request</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3.5 font-bold text-[#0F172A] dark:text-white">Server Diagnostic Logs</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">14 Days Maximum</td>
                                            <td className="p-3.5 font-semibold text-gray-700 dark:text-[#CBD5E1]">Automated cron rollover</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 7. User Rights */}
                        <section id="rights" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineGlobeAlt className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    7. Your Rights (GDPR, CCPA & Global Protections)
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                Regardless of your physical country or legal jurisdiction, Zephyra grants all registered members global data sovereignty rights:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                <div className="p-4.5 rounded-2xl bg-white/90 dark:bg-[#181C26] border border-gray-200/80 dark:border-[#252A36] space-y-1.5 shadow-xs">
                                    <h4 className="font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                                        <HiOutlineArrowDownTray className="text-[#C2410C] dark:text-[#FF8F6B] text-base stroke-[2.2]" /> Right to Access & Export
                                    </h4>
                                    <p className="text-gray-600 dark:text-[#9DA3B4] font-medium">
                                        Request a complete JSON archive of all your posts, interactions, profile metadata, and followers.
                                    </p>
                                </div>
                                <div className="p-4.5 rounded-2xl bg-white/90 dark:bg-[#181C26] border border-gray-200/80 dark:border-[#252A36] space-y-1.5 shadow-xs">
                                    <h4 className="font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                                        <HiOutlineTrash className="text-rose-600 dark:text-rose-400 text-base stroke-[2.2]" /> Right to Total Erasure
                                    </h4>
                                    <p className="text-gray-600 dark:text-[#9DA3B4] font-medium">
                                        Permanently erase your identity, media assets, direct chats, and comments with zero residual traces.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 8. Cookies */}
                        <section id="cookies" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineShieldCheck className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    8. Local Storage & Minimal Cookies
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                We do not use third-party marketing or profiling cookies. We use minimal browser Local Storage solely for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-[#CBD5E1]">
                                <li><strong className="text-[#0F172A] dark:text-white">`zephyra_token`:</strong> Secure JSON Web Token (JWT) used to keep your authenticated session active.</li>
                                <li><strong className="text-[#0F172A] dark:text-white">`zephyra_theme`:</strong> Remembers your preferred interface appearance (Obsidian Dark vs Warm Terracotta Light).</li>
                            </ul>
                            <p className="pt-2 font-medium text-gray-700 dark:text-[#CBD5E1]">
                                You can configure or clear your cookie preferences at any time on our{' '}
                                <Link to="/cookies" className="text-[#C2410C] dark:text-[#F5C36B] font-extrabold hover:underline">
                                    Cookie Preferences Page
                                </Link>.
                            </p>
                        </section>

                        {/* 9. Contact */}
                        <section id="contact" className="space-y-4 pt-8 border-t border-gray-200/80 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineEnvelope className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white">
                                    9. Data Protection Officer Contact
                                </h2>
                            </div>
                            <p className="font-medium text-gray-700 dark:text-[#CBD5E1]">
                                If you have questions about our privacy practices, wish to submit a data subject access request, or have compliance inquiries, please contact our Data Governance team:
                            </p>
                            <div className="p-6 rounded-2xl bg-white/90 dark:bg-[#181C26] border border-gray-200/80 dark:border-[#252A36] space-y-2 shadow-xs">
                                <p className="font-extrabold text-[#0F172A] dark:text-white">Zephyra Privacy & Data Protection Office</p>
                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C] font-semibold">Direct Privacy Inquiries:</p>
                                <a href="mailto:privacy@zephyra.app" className="text-sm font-extrabold text-[#C2410C] dark:text-[#F5C36B] hover:underline block">
                                    privacy@zephyra.app
                                </a>
                                <p className="text-xs text-gray-500 font-medium">Response time: Within 24 business hours.</p>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="rounded-3xl border border-[#FF8F6B]/40 dark:border-[#FF8F6B]/40 bg-gradient-to-r from-[#FFF5EF]/95 via-white/95 to-[#FAF0E6]/95 dark:from-[#181C26]/95 dark:via-[#12151C]/95 dark:to-[#181C26]/95 p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-4">
                    <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white">Your privacy is guaranteed by design</h2>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-[#9DA3B4] max-w-lg mx-auto font-medium">
                        Enjoy genuine conversations, serene chronological feeds, and total peace of mind.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full hover:scale-105 transition-all shadow-md cursor-pointer"
                        >
                            Create Your Private Account
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
