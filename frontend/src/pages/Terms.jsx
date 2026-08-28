import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    HiOutlineScale,
    HiOutlineUserCircle,
    HiOutlineShieldExclamation,
    HiOutlineDocumentText,
    HiOutlineChatBubbleLeftRight,
    HiOutlineNoSymbol,
    HiOutlineGlobeAlt,
    HiOutlineEnvelope,
    HiOutlineChevronRight,
    HiOutlineCheck,
} from 'react-icons/hi2';

import termsBgLight from '../assets/terms-bg-light.jpg';
import termsBgDark from '../assets/terms-bg-dark.jpg';

// Wind Breeze Floating Motion Element
const WindBreeze = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
        <svg
            className="w-full h-full opacity-35 dark:opacity-20"
            viewBox="0 0 1200 800"
            preserveAspectRatio="none"
        >
            <motion.path
                d="M -100 200 C 300 100, 600 350, 1300 150"
                fill="none"
                stroke="url(#windGradientTerms)"
                strokeWidth="3.5"
                strokeLinecap="round"
                animate={{
                    d: [
                        "M -100 200 C 300 100, 600 350, 1300 150",
                        "M -100 250 C 400 200, 700 250, 1300 200",
                        "M -100 200 C 300 100, 600 350, 1300 150"
                    ],
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
                d="M -100 550 C 400 700, 800 450, 1300 600"
                fill="none"
                stroke="url(#windGradientTerms)"
                strokeWidth="2.5"
                strokeLinecap="round"
                animate={{
                    d: [
                        "M -100 550 C 400 700, 800 450, 1300 600",
                        "M -100 500 C 350 600, 750 550, 1300 520",
                        "M -100 550 C 400 700, 800 450, 1300 600"
                    ],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <defs>
                <linearGradient id="windGradientTerms" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F5C36B" stopOpacity="0.9" />
                </linearGradient>
            </defs>
        </svg>
    </div>
);

const SECTIONS = [
    { id: 'agreement', title: '1. Agreement & Acceptance of Terms' },
    { id: 'eligibility', title: '2. Eligibility & Account Security' },
    { id: 'conduct', title: '3. Acceptable Use & Conduct Standards' },
    { id: 'ownership', title: '4. Content Ownership & License' },
    { id: 'messaging', title: '5. Real-Time Messaging & Direct Chats' },
    { id: 'moderation', title: '6. Moderation, Enforcement & Bans' },
    { id: 'liability', title: '7. Disclaimers & Limitation of Liability' },
    { id: 'termination', title: '8. Account Termination & Data Deletion' },
    { id: 'contact', title: '9. Legal Notices & Contact' },
];

export default function Terms() {
    const [activeSection, setActiveSection] = useState('agreement');

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
        <div className="relative min-h-screen bg-[#F5EFE6] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Realistic Law Library Background Wallpapers - Clear & Sharp */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <img
                    src={termsBgLight}
                    alt="Law Library Light Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-100 blur-none scale-100 transition-opacity duration-700 dark:hidden"
                />
                <img
                    src={termsBgDark}
                    alt="Law Library Dark Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-90 blur-[0.5px] scale-100 transition-opacity duration-700 hidden dark:block"
                />
                {/* Clear Light Overlay & Dark Tint Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 dark:from-[#0E1116]/75 dark:via-[#0E1116]/70 dark:to-[#0E1116]/85" />
            </div>

            {/* Floating SVG Wind Animation */}
            <WindBreeze />

            <div className="relative max-w-6xl mx-auto space-y-12 z-10">

                {/* Hero Header Card with Entrance Animation */}
                <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="relative text-center space-y-6 max-w-4xl mx-auto p-8 sm:p-14 rounded-3xl bg-[#FFFDF7]/92 dark:bg-[#0F141C]/92 backdrop-blur-2xl border-2 border-black dark:border-[#FF8F6B]/35 shadow-2xl shadow-amber-950/15 overflow-hidden"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xs font-black uppercase tracking-widest shadow-xs relative z-10"
                    >
                        Legal Framework & User Agreement
                    </motion.span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#2A1608] dark:text-white relative z-10">
                        Terms of Service
                    </h1>
                    <p className="text-base sm:text-xl text-[#5E3821] dark:text-[#9DA3B4] leading-relaxed font-bold max-w-2xl mx-auto relative z-10">
                        Last Updated: August 2026 • Version 2.4.0 • Please review your rights and responsibilities on Zephyra.
                    </p>
                </motion.div>

                {/* Key Summary Cards with Staggered Scroll Animation & Hover Lift */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF7]/90 dark:bg-[#0F141C]/90 shadow-xl shadow-amber-950/10 backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineScale className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#2A1608] dark:text-white">You Own Your Content</h3>
                        <p className="text-xs sm:text-sm text-[#5E3821] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            You retain 100% intellectual property rights over all stories, art, and posts you share.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF7]/90 dark:bg-[#0F141C]/90 shadow-xl shadow-amber-950/10 backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineShieldExclamation className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#2A1608] dark:text-white">A Respectful Sanctuary</h3>
                        <p className="text-xs sm:text-sm text-[#5E3821] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            Zero tolerance for harassment, automated spam bots, deceptive impersonation, or illegal activity.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="p-6 sm:p-7 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF7]/90 dark:bg-[#0F141C]/90 shadow-xl shadow-amber-950/10 backdrop-blur-xl space-y-3 cursor-pointer"
                    >
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-2xl w-fit flex items-center justify-center border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineUserCircle className="stroke-[2.2]" />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg text-[#2A1608] dark:text-white">Total Account Autonomy</h3>
                        <p className="text-xs sm:text-sm text-[#5E3821] dark:text-[#8A8F9C] leading-relaxed font-bold">
                            You can export your complete history or permanently delete your account at any moment.
                        </p>
                    </motion.div>
                </div>

                {/* Main Content Layout with Animated Sticky Sidebar & Detailed Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Table of Contents Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="hidden lg:block sticky top-24 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/30 bg-[#FFFDF7]/90 dark:bg-[#0F141C]/90 p-5 shadow-xl shadow-amber-950/10 backdrop-blur-xl space-y-2"
                    >
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-[#FF8F6B] block mb-3 px-2">
                            Terms Navigation
                        </span>
                        {SECTIONS.map((sec) => {
                            const isCurrent = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => scrollToSection(sec.id)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-between ${
                                        isCurrent
                                            ? 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold shadow-md scale-[1.02]'
                                            : 'text-[#5E3821] dark:text-[#A0A5B2] font-bold hover:bg-[#FF8F6B]/15 dark:hover:bg-[#181C26] hover:text-[#9E3610]'
                                    }`}
                                >
                                    <span className="truncate">{sec.title}</span>
                                    {isCurrent && <HiOutlineChevronRight className="shrink-0 text-xs text-[#1A140D]" />}
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* Detailed Legal Content Main Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 35 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-3 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#FFFDF7]/92 dark:bg-[#0F141C]/95 p-8 sm:p-12 shadow-2xl shadow-amber-950/15 backdrop-blur-xl space-y-12 leading-relaxed text-[#3D2517] dark:text-[#C5C9D3] text-sm sm:text-base"
                    >

                        {/* 1. Agreement */}
                        <motion.section
                            id="agreement"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineDocumentText className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    1. Agreement & Acceptance of Terms
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                Welcome to Zephyra. These Terms of Service constitute a legally binding agreement between you and Zephyra concerning your access to and use of our web platform, APIs, direct messaging systems, and community feeds.
                            </p>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                By creating an account or accessing any part of Zephyra, you confirm that you have read, understood, and agree to be bound by these Terms and our{' '}
                                <Link to="/privacy" className="text-[#9E3610] dark:text-[#F5C36B] font-black hover:underline">
                                    Privacy Policy
                                </Link>.
                            </p>
                        </motion.section>

                        {/* 2. Eligibility */}
                        <motion.section
                            id="eligibility"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineUserCircle className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    2. Eligibility & Account Security
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                To use Zephyra, you must be at least 13 years of age (or the minimum legal age required in your country).
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                <li><strong className="text-[#2A1608] dark:text-white">Credential Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your login credentials and password.</li>
                                <li><strong className="text-[#2A1608] dark:text-white">Accurate Information:</strong> You agree to provide an authentic email address during registration to receive critical account security alerts.</li>
                                <li><strong className="text-[#2A1608] dark:text-white">One Identity:</strong> Automated batch creation of fake accounts or puppet accounts is strictly prohibited.</li>
                            </ul>
                        </motion.section>

                        {/* 3. Acceptable Use */}
                        <motion.section
                            id="conduct"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineNoSymbol className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    3. Acceptable Use & Conduct Standards
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                Zephyra is committed to fostering authentic dialogue and creative sharing. You agree not to engage in any of the following prohibited behaviors:
                            </p>
                            <div className="space-y-3.5">
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="p-4.5 rounded-2xl bg-rose-100/70 dark:bg-rose-950/30 border-2 border-black dark:border-rose-900/50 space-y-1 shadow-xs cursor-pointer"
                                >
                                    <h4 className="font-black text-rose-950 dark:text-rose-300 text-xs sm:text-sm">Harassment, Abuse & Hate Speech</h4>
                                    <p className="text-xs sm:text-sm text-rose-950 dark:text-[#A0A5B2] font-bold">
                                        Attacking, threatening, doxxing, or discriminating against individuals based on race, ethnicity, nationality, religion, sexual orientation, gender, or disability.
                                    </p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="p-4.5 rounded-2xl bg-rose-100/70 dark:bg-rose-950/30 border-2 border-black dark:border-rose-900/50 space-y-1 shadow-xs cursor-pointer"
                                >
                                    <h4 className="font-black text-rose-950 dark:text-rose-300 text-xs sm:text-sm">Spam, Automated Bots & Scraping</h4>
                                    <p className="text-xs sm:text-sm text-rose-950 dark:text-[#A0A5B2] font-bold">
                                        Deploying automated scrapers, repetitive bulk message bots, unsolicited advertising schemes, or unauthorized API querying tools.
                                    </p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    className="p-4.5 rounded-2xl bg-rose-100/70 dark:bg-rose-950/30 border-2 border-black dark:border-rose-900/50 space-y-1 shadow-xs cursor-pointer"
                                >
                                    <h4 className="font-black text-rose-950 dark:text-rose-300 text-xs sm:text-sm">Impersonation & Deceptive Media</h4>
                                    <p className="text-xs sm:text-sm text-rose-950 dark:text-[#A0A5B2] font-bold">
                                        Pretending to be another creator, brand, or administrator, or distributing deliberately manipulated media to defraud community members.
                                    </p>
                                </motion.div>
                            </div>
                        </motion.section>

                        {/* 4. Content Ownership */}
                        <motion.section
                            id="ownership"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineScale className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    4. Content Ownership & License
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                <strong className="text-[#2A1608] dark:text-white">You retain 100% intellectual property ownership</strong> of the original text, photos, illustrations, and media you post on Zephyra.
                            </p>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                By posting content on public feeds, you grant Zephyra a worldwide, non-exclusive, royalty-free license solely to host, store, cache, format, and display your content to other users in accordance with your chosen privacy settings. This license terminates immediately upon your deletion of the post or account.
                            </p>
                        </motion.section>

                        {/* 5. Real-Time Messaging */}
                        <motion.section
                            id="messaging"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineChatBubbleLeftRight className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    5. Real-Time Messaging & Direct Chats
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                Direct messaging channels are intended for private, authentic conversation between members:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                <li>You may not use direct messaging to transmit unsolicited commercial offers or harassment.</li>
                                <li>You are solely responsible for interactions with other users. Zephyra provides tools to block or report malicious members.</li>
                            </ul>
                        </motion.section>

                        {/* 6. Moderation & Enforcement */}
                        <motion.section
                            id="moderation"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineShieldExclamation className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    6. Moderation, Enforcement & Bans
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                To preserve the tranquil character of our platform, Zephyra's administration and moderation team reserve the right to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                <li>Remove or hide any content that violates these Terms or our Community Guidelines.</li>
                                <li>Issue temporary suspensions or permanent account bans for severe or repeated infractions.</li>
                                <li>Provide transparent suspension rationales directly to affected accounts upon review.</li>
                            </ul>
                        </motion.section>

                        {/* 7. Liability & Disclaimers */}
                        <motion.section
                            id="liability"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineDocumentText className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    7. Disclaimers & Limitation of Liability
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                Zephyra is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. While we strive for continuous sub-15ms real-time uptime, we do not warrant that services will always be uninterrupted, error-free, or entirely bug-free during maintenance windows.
                            </p>
                        </motion.section>

                        {/* 8. Termination */}
                        <motion.section
                            id="termination"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineUserCircle className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    8. Account Termination & Data Deletion
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                You may close and delete your Zephyra account at any time through your Profile Settings. Upon deletion, all your posted stories, direct messages, media, and profile metadata are permanently wiped from our active databases.
                            </p>
                        </motion.section>

                        {/* 9. Contact */}
                        <motion.section
                            id="contact"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4 pt-8 border-t-2 border-black dark:border-[#1F2636]"
                        >
                            <div className="flex items-center gap-3.5">
                                <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl shrink-0 flex items-center justify-center">
                                    <HiOutlineEnvelope className="stroke-[2.2]" />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#2A1608] dark:text-white">
                                    9. Legal Notices & Contact
                                </h2>
                            </div>
                            <p className="font-bold text-[#5E3821] dark:text-[#CBD5E1]">
                                For questions, legal notices, or copyright inquiries (DMCA), please contact our legal team:
                            </p>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="p-6 rounded-2xl bg-[#FFF5EA] dark:bg-[#161B26] border-2 border-black dark:border-[#252E40] space-y-2 shadow-xs cursor-pointer"
                            >
                                <p className="font-black text-[#2A1608] dark:text-white">Zephyra Legal & Compliance Department</p>
                                <p className="text-xs text-[#5E3821] dark:text-[#8A8F9C] font-bold">Direct Inquiries:</p>
                                <a href="mailto:legal@zephyra.app" className="text-sm font-black text-[#9E3610] dark:text-[#F5C36B] hover:underline block">
                                    legal@zephyra.app
                                </a>
                                <p className="text-xs text-[#734A30] font-bold">Response time: Within 24-48 business hours.</p>
                            </motion.div>
                        </motion.section>

                    </motion.div>
                </div>

                {/* Bottom Call to Action with Scroll Animation & Button Hover Pulse */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/40 bg-[#FFFDF7]/92 dark:bg-gradient-to-r dark:from-[#181C26] dark:via-[#0F141C] dark:to-[#181C26] p-8 sm:p-12 shadow-2xl backdrop-blur-xl text-center space-y-4"
                >
                    <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-[#2A1608] dark:text-white">Ready to share your voice?</h2>
                    <p className="text-xs sm:text-sm text-[#5E3821] dark:text-[#9DA3B4] max-w-lg mx-auto font-bold">
                        Join a community dedicated to mindful, genuine expression.
                    </p>
                    <div className="pt-2">
                        <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }} className="inline-block">
                            <Link
                                to="/register"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full transition-all shadow-md cursor-pointer"
                            >
                                Get Started on Zephyra
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
