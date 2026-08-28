import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

// Dynamic Sweeping SVG Ribbon Waves across the viewport
const GorgeousAnimatedBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
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
        <div className="relative min-h-screen bg-[#EBE0D5] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Realistic Data Privacy & Sovereignty Photography Wallpapers - Clear & Sharp */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6EF] via-[#FAF7F2] to-[#F5EFE6] dark:from-[#0E1116] dark:via-[#121620] dark:to-[#0A0D12]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF8F6B]/15 via-transparent to-transparent dark:from-[#FF8F6B]/10" />
            </div>

            {/* Dynamic Animated Ambient Color Ribbon Waves Canvas */}
            <GorgeousAnimatedBackground />

            <div className="relative max-w-6xl mx-auto space-y-12 z-10">

                {/* Hero Header Card with 3D Spring Floating Entrance & Solid Black Border in Day Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ scale: 1.015, rotateX: 1.5, rotateY: -1 }}
                    className="relative text-center space-y-6 max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-[#FFFDF9]/92 dark:bg-[#11151F]/90 backdrop-blur-2xl border-2 border-black dark:border-[#FF8F6B]/35 shadow-2xl shadow-[#4A2818]/15 overflow-hidden transition-all duration-300"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.25, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xs font-black uppercase tracking-widest shadow-xs relative z-10"
                    >
                        Trust, Transparency & Safety
                    </motion.span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1C1008] dark:text-white relative z-10">
                        Privacy Policy & Data Covenant
                    </h1>
                    <p className="text-base sm:text-xl text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold max-w-2xl mx-auto relative z-10">
                        Last Updated: August 2026 • Version 2.4.0 • Effective for all registered and visiting members globally.
                    </p>
                </motion.div>

                {/* Core Privacy Highlights Cards - Cascading Spring Entrance & Magnetic Hover Lift */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.1 }}
                        whileHover={{ y: -8, scale: 1.025 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF9]/90 dark:bg-[#12151C]/90 shadow-xl shadow-[#4A2818]/10 backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineEyeSlash className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#1C1008] dark:text-white">No Behavioral Tracking</h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            We never install cross-site advertising pixels or track your reading habits across the web.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.25 }}
                        whileHover={{ y: -8, scale: 1.025 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF9]/90 dark:bg-[#12151C]/90 shadow-xl shadow-[#4A2818]/10 backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineLockClosed className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#1C1008] dark:text-white">Cryptographic Security</h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            All passwords use 10-round salted bcrypt hashes, and socket streams communicate over TLS/WSS.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 140, damping: 12, delay: 0.4 }}
                        whileHover={{ y: -8, scale: 1.025 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF9]/90 dark:bg-[#12151C]/90 shadow-xl shadow-[#4A2818]/10 backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineTrash className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#1C1008] dark:text-white">True Right to Erasure</h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            When you delete a post or account, it is permanently purged from our primary database immediately.
                        </p>
                    </motion.div>
                </div>

                {/* Main Content Layout with Animated Sticky Navigation */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Table of Contents Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -35 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="hidden lg:block sticky top-24 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF9]/90 dark:bg-[#12151C]/90 p-5 shadow-xl shadow-[#4A2818]/10 backdrop-blur-xl space-y-2"
                    >
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-[#FF8F6B] block mb-3 px-2">
                            Policy Navigation
                        </span>
                        {SECTIONS.map((sec) => {
                            const isCurrent = activeSection === sec.id;
                            return (
                                <motion.button
                                    key={sec.id}
                                    whileHover={{ x: 4 }}
                                    onClick={() => scrollToSection(sec.id)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                                        isCurrent
                                            ? 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold shadow-md scale-[1.02]'
                                            : 'text-[#4D3222] dark:text-[#A0A5B2] font-bold hover:bg-[#FF8F6B]/15 dark:hover:bg-[#181C26] hover:text-[#9E3610]'
                                    }`}
                                >
                                    <span className="truncate">{sec.title}</span>
                                    {isCurrent && <HiOutlineChevronRight className="shrink-0 text-xs text-[#1A140D]" />}
                                </motion.button>
                            );
                        })}
                    </motion.div>

                    {/* Detailed Legal Content Main Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-3 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#FFFDF9]/92 dark:bg-[#12151C]/95 p-8 sm:p-12 shadow-2xl shadow-[#4A2818]/15 backdrop-blur-xl space-y-12 leading-relaxed text-[#2B1B10] dark:text-[#C5C9D3] text-sm sm:text-base"
                    >

                        {/* 1. Executive Summary */}
                        <motion.section
                            id="pledge"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineShieldCheck className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    1. Executive Summary & Zero-Tracker Pledge
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                At Zephyra, privacy is not a compliance checkbox - it is the architectural foundation of our entire social platform. We created Zephyra as an intentional alternative to conventional ad-funded networks that monetize human attention, emotional volatility, and personal communication.
                            </p>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                <strong className="text-[#1C1008] dark:text-white">Our Core Pledge:</strong> We will never sell, rent, monetize, or trade your personal data, profile insights, reading habits, or message history to any advertising network, third-party broker, or commercial AI training consortium.
                            </p>
                        </motion.section>

                        {/* 2. Collection Breakdown */}
                        <motion.section
                            id="collection"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineDocumentText className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    2. Information We Collect & Why
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                We collect only the minimum data strictly required to deliver a responsive, real-time social networking experience:
                            </p>
                            <div className="space-y-3.5">
                                <motion.div whileHover={{ scale: 1.01 }} className="p-4.5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] space-y-1 shadow-xs cursor-pointer">
                                    <h3 className="font-black text-[#1C1008] dark:text-white text-sm">Account & Identity Information</h3>
                                    <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#9DA3B4] font-bold">
                                        Your chosen display name, unique username, email address, and cryptographically salted password hash. We use this to authenticate your sessions and ensure account security.
                                    </p>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.01 }} className="p-4.5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] space-y-1 shadow-xs cursor-pointer">
                                    <h3 className="font-black text-[#1C1008] dark:text-white text-sm">Content, Media & Interactions</h3>
                                    <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#9DA3B4] font-bold">
                                        Stories you publish, photos you upload, comments you post, and reactions you give. These are stored on our encrypted clusters to display in the chronological timeline.
                                    </p>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.01 }} className="p-4.5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] space-y-1 shadow-xs cursor-pointer">
                                    <h3 className="font-black text-[#1C1008] dark:text-white text-sm">Technical Diagnostics</h3>
                                    <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#9DA3B4] font-bold">
                                        IP address, user-agent string, and server error logs maintained for up to 14 days solely for rate-limiting, denial-of-service prevention, and bot mitigation.
                                    </p>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* 3. Direct Messaging Privacy */}
                        <motion.section
                            id="messaging"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineLockClosed className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    3. Direct Messaging & Real-Time Privacy
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                Private conversations between members are transmitted using secure WebSocket connections (WSS) over encrypted TLS channels.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                <li><strong className="text-[#1C1008] dark:text-white">Isolation:</strong> Only authenticated participants in a conversation thread have cryptographic query permissions to retrieve or read message histories.</li>
                                <li><strong className="text-[#1C1008] dark:text-white">Zero Content Scanning:</strong> We do not parse or scan the text of private messages for ad targeting, interest profiling, or keyword mining.</li>
                                <li><strong className="text-[#1C1008] dark:text-white">Seen Receipts:</strong> Real-time status indicators (Sent and Seen) are exchanged strictly between the conversation participants.</li>
                            </ul>
                        </motion.section>

                        {/* 4. Non-Commercialization Guarantee */}
                        <motion.section
                            id="non-commercial"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineEyeSlash className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    4. Non-Commercialization Guarantee
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                Unlike traditional social media monopolies, Zephyra's economic model does not rely on surveillance capitalism:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4.5 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/30 border-2 border-black dark:border-emerald-900/50 space-y-1.5 shadow-xs cursor-pointer">
                                    <h4 className="font-black text-emerald-950 dark:text-emerald-300 text-xs uppercase tracking-wider">What We Guarantee</h4>
                                    <p className="text-xs sm:text-sm text-emerald-950 dark:text-[#A0A5B2] font-black leading-relaxed">
                                        • 0 third-party advertising SDKs<br />
                                        • 0 data broker syndication<br />
                                        • 0 behavioral profiling algorithms
                                    </p>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4.5 rounded-2xl bg-rose-100/70 dark:bg-rose-950/30 border-2 border-black dark:border-rose-900/50 space-y-1.5 shadow-xs cursor-pointer">
                                    <h4 className="font-black text-rose-950 dark:text-rose-300 text-xs uppercase tracking-wider">What We Never Do</h4>
                                    <p className="text-xs sm:text-sm text-rose-950 dark:text-[#A0A5B2] font-black leading-relaxed">
                                        • Sell your email or reading trends<br />
                                        • Share message logs with advertisers<br />
                                        • Feed private drafts to public AI models
                                    </p>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* 5. Storage & Encryption */}
                        <motion.section
                            id="infrastructure"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineServer className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    5. Storage, Cloud & Encryption Standards
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                We partner with leading cloud infrastructure providers that maintain strict SOC 2, ISO 27001, and GDPR compliance certifications:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                <li><strong className="text-[#1C1008] dark:text-white">Database Layer:</strong> High-availability MongoDB Atlas clusters featuring AES-256 encryption at rest and isolated network VPC peering.</li>
                                <li><strong className="text-[#1C1008] dark:text-white">Media Storage:</strong> Cloudinary secure CDN storage with optimized delivery and signed access tokens.</li>
                                <li><strong className="text-[#1C1008] dark:text-white">In-Transit Protection:</strong> End-to-end TLS 1.3 encryption across all HTTP REST endpoints and WebSocket channels.</li>
                            </ul>
                        </motion.section>

                        {/* 6. Data Retention */}
                        <motion.section
                            id="retention"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineTrash className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    6. Data Retention & Automatic Purging
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                We maintain data only for as long as your account remains active or until you explicitly delete specific content:
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-2 border-black dark:border-[#252A36] rounded-2xl overflow-hidden shadow-xs">
                                    <thead className="bg-[#FFF0E6] dark:bg-[#181C26] text-[#9E3610] dark:text-white font-black border-b-2 border-black dark:border-[#252A36]">
                                        <tr>
                                            <th className="p-3.5">Data Category</th>
                                            <th className="p-3.5">Retention Period</th>
                                            <th className="p-3.5">Deletion Mechanism</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-2 divide-black dark:divide-[#252A36] bg-[#FFF6EF] dark:bg-[#12151C]">
                                        <tr className="hover:bg-[#FF8F6B]/15 transition-colors">
                                            <td className="p-3.5 font-black text-[#1C1008] dark:text-white">User Profile & Account</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">Until Account Deletion</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">Instant purge via Settings</td>
                                        </tr>
                                        <tr className="hover:bg-[#FF8F6B]/15 transition-colors">
                                            <td className="p-3.5 font-black text-[#1C1008] dark:text-white">Published Stories & Posts</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">Until User Deletion</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">Immediate hard-delete</td>
                                        </tr>
                                        <tr className="hover:bg-[#FF8F6B]/15 transition-colors">
                                            <td className="p-3.5 font-black text-[#1C1008] dark:text-white">Direct Message History</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">Until Thread Deletion</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">Cascade delete on request</td>
                                        </tr>
                                        <tr className="hover:bg-[#FF8F6B]/15 transition-colors">
                                            <td className="p-3.5 font-black text-[#1C1008] dark:text-white">Server Diagnostic Logs</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">14 Days Maximum</td>
                                            <td className="p-3.5 font-bold text-[#4D3222] dark:text-[#CBD5E1]">Automated cron rollover</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </motion.section>

                        {/* 7. User Rights */}
                        <motion.section
                            id="rights"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineGlobeAlt className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    7. Your Rights (GDPR, CCPA & Global Protections)
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                Regardless of your physical country or legal jurisdiction, Zephyra grants all registered members global data sovereignty rights:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4.5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] space-y-1.5 shadow-xs cursor-pointer">
                                    <h4 className="font-bold text-[#1C1008] dark:text-white flex items-center gap-2">
                                        <HiOutlineArrowDownTray className="text-[#9E3610] dark:text-[#FF8F6B] text-base stroke-[2.2]" /> Right to Access & Export
                                    </h4>
                                    <p className="text-[#4D3222] dark:text-[#9DA3B4] font-bold">
                                        Request a complete JSON archive of all your posts, interactions, profile metadata, and followers.
                                    </p>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.02 }} className="p-4.5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] space-y-1.5 shadow-xs cursor-pointer">
                                    <h4 className="font-bold text-[#1C1008] dark:text-white flex items-center gap-2">
                                        <HiOutlineTrash className="text-rose-600 dark:text-rose-400 text-base stroke-[2.2]" /> Right to Total Erasure
                                    </h4>
                                    <p className="text-[#4D3222] dark:text-[#9DA3B4] font-bold">
                                        Permanently erase your identity, media assets, direct chats, and comments with zero residual traces.
                                    </p>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* 8. Cookies */}
                        <motion.section
                            id="cookies"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineShieldCheck className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    8. Local Storage & Minimal Cookies
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                We do not use third-party marketing or profiling cookies. We use minimal browser Local Storage solely for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                <li><strong className="text-[#1C1008] dark:text-white">`zephyra_token`:</strong> Secure JSON Web Token (JWT) used to keep your authenticated session active.</li>
                                <li><strong className="text-[#1C1008] dark:text-white">`zephyra_theme`:</strong> Remembers your preferred interface appearance (Obsidian Dark vs Warm Terracotta Light).</li>
                            </ul>
                            <p className="pt-2 font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                You can configure or clear your cookie preferences at any time on our{' '}
                                <Link to="/cookies" className="text-[#9E3610] dark:text-[#F5C36B] font-black hover:underline">
                                    Cookie Preferences Page
                                </Link>.
                            </p>
                        </motion.section>

                        {/* 9. Contact */}
                        <motion.section
                            id="contact"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 4 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F232C] transition-all"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineEnvelope className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                                    9. Data Protection Officer Contact
                                </h2>
                            </div>
                            <p className="font-bold text-[#4D3222] dark:text-[#CBD5E1]">
                                If you have questions about our privacy practices, wish to submit a data subject access request, or have compliance inquiries, please contact our Data Governance team:
                            </p>
                            <motion.div whileHover={{ scale: 1.01 }} className="p-6 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] space-y-2 shadow-xs cursor-pointer">
                                <p className="font-black text-[#1C1008] dark:text-white">Zephyra Privacy & Data Protection Office</p>
                                <p className="text-xs text-[#4D3222] dark:text-[#8A8F9C] font-bold">Direct Privacy Inquiries:</p>
                                <a href="mailto:privacy@zephyra.app" className="text-sm font-black text-[#9E3610] dark:text-[#F5C36B] hover:underline block">
                                    privacy@zephyra.app
                                </a>
                                <p className="text-xs text-[#6E462E] font-bold">Response time: Within 24 business hours.</p>
                            </motion.div>
                        </motion.section>

                    </motion.div>
                </div>

                {/* Bottom Call to Action Card with Pulse Animation & Button Hover Spring */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/40 bg-[#FFFDF9]/92 dark:bg-gradient-to-r dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-2xl shadow-[#4A2818]/15 backdrop-blur-xl text-center space-y-4"
                >
                    <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[#1C1008] dark:text-white">Your privacy is guaranteed by design</h2>
                    <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#9DA3B4] max-w-lg mx-auto font-bold">
                        Enjoy genuine conversations, serene chronological feeds, and total peace of mind.
                    </p>
                    <div className="pt-2">
                        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }} className="inline-block">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full transition-all shadow-md cursor-pointer"
                            >
                                Create Your Private Account
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
