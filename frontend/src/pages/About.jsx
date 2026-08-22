import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    HiOutlineBolt,
    HiOutlineShieldCheck,
    HiOutlineClock,
    HiOutlineGlobeAlt,
    HiOutlineChatBubbleLeftRight,
    HiOutlineEyeSlash,
    HiOutlineCheck,
    HiOutlineCheckCircle,
    HiOutlineXMark,
    HiArrowRight,
} from 'react-icons/hi2';
import { FiFeather, FiWind } from 'react-icons/fi';
import { RiLeafLine } from 'react-icons/ri';
import { TbMessageCircleBolt } from 'react-icons/tb';

import aboutBgLight from '../assets/about-bg-light.jpg';
import aboutBgDark from '../assets/about-bg-dark.jpg';

// Animated Counter component
const StatCounter = ({ target, suffix = '', prefix = '', decimals = 0, duration = 2.2 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const runtime = (timestamp - startTime) / 1000;
            const progress = Math.min(runtime / duration, 1);
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            setCount(target * easeOut);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, target, duration]);

    return (
        <span ref={ref} className="font-['Fraunces'] font-black text-xl sm:text-5xl bg-gradient-to-r from-[#B85323] via-[#D97B4F] to-[#C6822E] dark:from-[#FF8F6B] dark:via-[#D97B4F] dark:to-[#F5C36B] bg-clip-text text-transparent whitespace-nowrap inline-block">
            {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
        </span>
    );
};

// Animated wind gust SVG lines
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25 z-0"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="aboutGust" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        <motion.path
            d="M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
            fill="none"
            stroke="url(#aboutGust)"
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
            stroke="url(#aboutGust)"
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

export default function About() {
    const { scrollYProgress } = useScroll();
    const backgroundGlow = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

    const TIMELINE = [
        {
            year: 'Phase 01',
            title: 'The Outrage Fatigue',
            subtitle: 'Breaking free from algorithmic toxicity',
            desc: 'Modern social media became an optimization machine for outrage, manufactured debate, and infinite dopamine loops. We asked: What if a platform existed purely to foster calm, genuine self-expression without predatory feeds?',
            icon: RiLeafLine,
            accent: 'from-[#FF8F6B] to-[#D97B4F]'
        },
        {
            year: 'Phase 02',
            title: 'Architecting the West Wind',
            subtitle: 'Sub-second real-time engine',
            desc: 'Engineered from scratch on high-throughput WebSocket micro-clusters. Direct messaging, live typing pulses, and instant reactions deliver zero-lag communication wrapped in an organic sunset aesthetic.',
            icon: HiOutlineBolt,
            accent: 'from-[#F5C36B] to-[#FF8F6B]'
        },
        {
            year: 'Phase 03',
            title: 'Zero-Tracker Architecture',
            subtitle: 'Privacy as a sacred covenant',
            desc: 'No behavioral ad trackers. No selling user reading habits to data brokers. All user communications and private drafts remain confidential under strict authenticated boundaries.',
            icon: HiOutlineShieldCheck,
            accent: 'from-[#D97B4F] to-[#C6822E]'
        },
        {
            year: 'Phase 04',
            title: 'The Living Sanctuary',
            subtitle: 'Global community of mindful creators',
            desc: 'Today, Zephyra is a vibrant, blooming haven for digital artists, thinkers, developers, and writers who cherish beauty, minimalism, and meaningful dialogue.',
            icon: FiFeather,
            accent: 'from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]'
        }
    ];

    const ARCHITECTURE = [
        {
            title: 'Real-Time Pulse Engine',
            badge: 'Sub-15ms WebSocket Protocol',
            icon: TbMessageCircleBolt,
            desc: 'Instant two-way event bus orchestrating active conversations, seen receipts, typing indicators, and system broadcast banners instantaneously.',
            highlight: 'Engineered for zero-lag conversational intimacy.'
        },
        {
            title: 'Organic Chronological Feeds',
            badge: 'Zero Addictive Exploitation',
            icon: HiOutlineClock,
            desc: 'You see what people you follow actually post in true chronological order. No algorithmic suppression, no forced promotional clutter.',
            highlight: 'Your timeline is yours, completely unmanipulated.'
        },
        {
            title: 'Atmospheric Glassmorphism Design',
            badge: 'Humanist Visual Language',
            icon: FiWind,
            desc: 'Carefully tuned HSL color palettes featuring warm sunset ochre, terracotta hues, and deep obsidian dark modes designed to eliminate eye fatigue.',
            highlight: 'A digital space that feels like a quiet evening breeze.'
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2] dark:bg-[#090B0F] text-[#0F172A] dark:text-[#EDEBE6] transition-colors duration-300 font-[Manrope]">

            {/* Wallpaper Background - Light Mode */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat dark:hidden opacity-45 transition-opacity duration-500 pointer-events-none z-0"
                style={{ backgroundImage: `url(${aboutBgLight})` }}
            />
            {/* Wallpaper Background - Dark Mode */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat hidden dark:block opacity-60 transition-opacity duration-500 pointer-events-none z-0"
                style={{ backgroundImage: `url(${aboutBgDark})` }}
            />

            {/* Glowing Atmospheric Orbs */}
            <motion.div
                style={{ scale: backgroundGlow }}
                className="absolute -top-32 -left-40 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#FF8F6B]/35 via-[#D97B4F]/20 to-transparent blur-3xl pointer-events-none z-0"
            />
            <div className="absolute top-1/3 -right-40 w-[750px] h-[750px] rounded-full bg-gradient-to-tl from-[#F5C36B]/30 via-[#FF8F6B]/20 to-transparent blur-3xl pointer-events-none z-0" />
            <div className="absolute bottom-10 left-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#D97B4F]/20 to-transparent blur-3xl pointer-events-none z-0" />

            <WindBreeze />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-28 space-y-20 sm:space-y-24">

                {/* ===== HERO SECTION ===== */}
                <section className="text-center space-y-6 max-w-4xl mx-auto p-6 sm:p-12 rounded-3xl bg-white/80 dark:bg-[#11151F]/85 backdrop-blur-xl border border-white/90 dark:border-[#1F2636] shadow-xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="inline-flex items-center px-5 py-2 rounded-full border border-[#B85323]/25 dark:border-[#FF8F6B]/30 bg-white/95 dark:bg-[#151922]/90 backdrop-blur-xl shadow-xs"
                    >
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#B85323] dark:text-[#F5C36B]">
                            The Zephyra Manifesto
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="font-['Fraunces'] italic font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.08] text-[#0F172A] dark:text-white"
                    >
                        A Sanctuary for <br />
                        <span className="bg-gradient-to-r from-[#9A3412] via-[#C2410C] to-[#9A3412] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent drop-shadow-xs">
                            Authentic Human Stories
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-base sm:text-xl text-[#0F172A] dark:text-[#E2E8F0] font-extrabold leading-relaxed max-w-2xl mx-auto"
                    >
                        We did not build Zephyra to capture your attention and sell it to the highest bidder. We built it so your thoughts can catch the wind - freely, beautifully, and on your own terms.
                    </motion.p>
                </section>

                {/* ===== LIVE STATS GRID ===== */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-6"
                >
                    <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#CBD5E1] dark:border-[#1F2636] bg-white/95 dark:bg-[#121622] backdrop-blur-xl shadow-md text-center space-y-1 sm:space-y-2 flex flex-col justify-center items-center overflow-hidden min-w-0">
                        <StatCounter target={15} prefix="< " suffix=" ms" />
                        <p className="text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-wider text-[#334155] dark:text-[#CBD5E1] leading-tight w-full truncate">Socket Latency</p>
                    </div>
                    <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#CBD5E1] dark:border-[#1F2636] bg-white/95 dark:bg-[#121622] backdrop-blur-xl shadow-md text-center space-y-1 sm:space-y-2 flex flex-col justify-center items-center overflow-hidden min-w-0">
                        <StatCounter target={100} suffix="%" />
                        <p className="text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-wider text-[#334155] dark:text-[#CBD5E1] leading-tight w-full truncate">Chronological Feed</p>
                    </div>
                    <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#CBD5E1] dark:border-[#1F2636] bg-white/95 dark:bg-[#121622] backdrop-blur-xl shadow-md text-center space-y-1 sm:space-y-2 flex flex-col justify-center items-center overflow-hidden min-w-0">
                        <StatCounter target={0} suffix=" Ads" />
                        <p className="text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-wider text-[#334155] dark:text-[#CBD5E1] leading-tight w-full truncate">Zero Ad Trackers</p>
                    </div>
                    <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#CBD5E1] dark:border-[#1F2636] bg-white/95 dark:bg-[#121622] backdrop-blur-xl shadow-md text-center space-y-1 sm:space-y-2 flex flex-col justify-center items-center overflow-hidden min-w-0">
                        <StatCounter target={99.9} decimals={1} suffix="%" />
                        <p className="text-[9px] sm:text-xs font-black uppercase tracking-tight sm:tracking-wider text-[#334155] dark:text-[#CBD5E1] leading-tight w-full truncate">Real-Time Uptime</p>
                    </div>
                </motion.section>

                {/* ===== PHILOSOPHY VS TRADITIONAL SOCIAL MEDIA ===== */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="rounded-3xl border border-[#CBD5E1] dark:border-[#1F2636] bg-white/95 dark:bg-[#11151F] backdrop-blur-2xl p-6 sm:p-12 shadow-xl space-y-8"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#CBD5E1] dark:border-[#1F2636] pb-6">
                        <div>
                            <span className="text-xs uppercase font-extrabold tracking-widest text-[#B85323] dark:text-[#F5C36B]">The Zephyra Contrast</span>
                            <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white mt-1">
                                Why We Reimagined Social Connection
                            </h2>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl">
                            <FiFeather />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/95 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-900/50 space-y-3 shadow-xs">
                            <h3 className="font-extrabold text-base text-rose-800 dark:text-rose-300 flex items-center gap-2">
                                <HiOutlineXMark className="text-lg" /> Conventional Platforms
                            </h3>
                            <ul className="text-xs sm:text-sm text-[#334155] dark:text-[#E2E8F0] space-y-2.5 leading-relaxed font-semibold">
                                <li className="flex items-start gap-2"><span className="text-rose-600 font-bold">•</span> Manipulative algorithms engineered to trigger anger and outrage</li>
                                <li className="flex items-start gap-2"><span className="text-rose-600 font-bold">•</span> Cluttered timelines drowning in unskippable sponsored ads</li>
                                <li className="flex items-start gap-2"><span className="text-rose-600 font-bold">•</span> Uncontrolled tracking of personal data, clicks, and messages</li>
                                <li className="flex items-start gap-2"><span className="text-rose-600 font-bold">•</span> Vanity metric addiction that reduces humans to follower counts</li>
                            </ul>
                        </div>

                        <div className="p-5 sm:p-6 rounded-2xl bg-emerald-50/95 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-900/50 space-y-3 shadow-xs">
                            <h3 className="font-extrabold text-base text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                                <HiOutlineCheckCircle className="text-lg" /> The Zephyra Experience
                            </h3>
                            <ul className="text-xs sm:text-sm text-[#334155] dark:text-[#E2E8F0] space-y-2.5 leading-relaxed font-semibold">
                                <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold">•</span> Organic, chronological delivery of stories you actually care about</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold">•</span> Breath-like, peaceful UI crafted to inspire mindfulness and creativity</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold">•</span> Zero third-party trackers, zero data brokering, zero compromise</li>
                                <li className="flex items-start gap-2"><span className="text-emerald-600 font-bold">•</span> Direct, lightning-fast private messaging with real human intimacy</li>
                            </ul>
                        </div>
                    </div>
                </motion.section>

                {/* ===== JOURNEY / TIMELINE ===== */}
                <section className="space-y-10">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#D97B4F] dark:text-[#F5C36B]">Our Journey</span>
                        <h2 className="font-['Fraunces'] text-3xl sm:text-5xl font-extrabold text-[#101828] dark:text-white">The Evolution of Zephyra</h2>
                        <p className="text-xs sm:text-sm text-[#667085] dark:text-[#CBD5E1] max-w-lg mx-auto font-medium">
                            From a quiet rebellious prototype to a vibrant global sanctuary.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TIMELINE.map((item, idx) => {
                            const IconComponent = item.icon;
                            return (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: idx * 0.15 }}
                                    className="group p-6 sm:p-8 rounded-3xl border border-[#EAECF0] dark:border-[#1F2636] bg-white dark:bg-[#121622] backdrop-blur-xl shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 space-y-4 relative overflow-hidden"
                                >
                                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.accent}`} />
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#B85323] dark:text-[#F5C36B] font-mono">{item.year}</span>
                                        <span className="p-3 rounded-2xl bg-[#FFE8D6] dark:bg-[#FF8F6B]/20 text-[#B85323] dark:text-[#F5C36B] text-xl">
                                            <IconComponent />
                                        </span>
                                    </div>
                                    <h3 className="font-['Fraunces'] text-xl font-bold text-[#101828] dark:text-white">{item.title}</h3>
                                    <p className="text-xs font-semibold text-[#667085] dark:text-[#CBD5E1]">{item.subtitle}</p>
                                    <p className="text-xs sm:text-sm text-[#475467] dark:text-[#CBD5E1] leading-relaxed font-medium">{item.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ===== ARCHITECTURAL PILLARS ===== */}
                <section className="space-y-8">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#B85323] dark:text-[#F5C36B]">Engineering Rigor</span>
                        <h2 className="font-['Fraunces'] text-3xl sm:text-5xl font-extrabold text-[#101828] dark:text-white">Crafted with Obsessive Detail</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ARCHITECTURE.map((arch) => {
                            const ArchIcon = arch.icon;
                            return (
                                <div
                                    key={arch.title}
                                    className="p-6 sm:p-8 rounded-3xl border border-[#EAECF0] dark:border-[#1F2636] bg-white dark:bg-[#121622] backdrop-blur-xl shadow-xs space-y-4 flex flex-col justify-between"
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#FFE8D6] dark:bg-[#FF8F6B]/20 text-[#B85323] dark:text-[#F5C36B]">
                                                {arch.badge}
                                            </span>
                                            <span className="p-2.5 rounded-xl bg-[#F8F9FA] dark:bg-[#181C26] text-[#B85323] dark:text-[#F5C36B] text-lg">
                                                <ArchIcon />
                                            </span>
                                        </div>
                                        <h3 className="font-['Fraunces'] text-xl font-bold text-[#101828] dark:text-white">{arch.title}</h3>
                                        <p className="text-xs sm:text-sm text-[#475467] dark:text-[#CBD5E1] leading-relaxed font-medium">{arch.desc}</p>
                                    </div>
                                    <div className="pt-4 border-t border-[#EAECF0] dark:border-[#1F2636] text-xs font-bold text-[#B85323] dark:text-[#F5C36B] flex items-center gap-1.5">
                                        <HiOutlineCheck className="text-sm" /> {arch.highlight}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ===== CREATOR NOTE ===== */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative rounded-3xl border border-[#EAECF0] dark:border-[#1F2636] bg-gradient-to-br from-[#F8F9FA] via-white to-[#F2F4F7] dark:from-[#151924] dark:via-[#121622] dark:to-[#151924] p-8 sm:p-14 shadow-xs text-center space-y-6 overflow-hidden"
                >
                    <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-2xl shadow-md">
                        <FiFeather />
                    </div>
                    <blockquote className="font-['Fraunces'] italic text-2xl sm:text-4xl text-[#101828] dark:text-white max-w-3xl mx-auto leading-snug">
                        "When thoughts are no longer held captive by algorithms, they become wind. And wind reaches everywhere."
                    </blockquote>
                    <div className="space-y-1">
                        <p className="text-sm font-extrabold uppercase tracking-widest text-[#B85323] dark:text-[#F5C36B]">Tridib Sarkar</p>
                        <p className="text-xs text-[#667085] dark:text-[#CBD5E1] font-medium">Creator & Lead Architect, Zephyra</p>
                    </div>
                </motion.section>

                {/* ===== FINAL CALL TO ACTION ===== */}
                <section className="text-center pt-8 space-y-6">
                    <h2 className="font-['Fraunces'] text-3xl sm:text-5xl font-extrabold text-[#101828] dark:text-white">Ready to Catch the Wind?</h2>
                    <p className="text-sm sm:text-base text-[#475467] dark:text-[#CBD5E1] max-w-xl mx-auto font-medium">
                        Experience the difference of a serene, distraction-free social platform today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
                        <Link
                            to="/register"
                            className="flex items-center justify-center gap-2 w-full max-w-[240px] sm:w-auto sm:max-w-none px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-xs sm:text-sm rounded-full hover:scale-105 hover:shadow-xl transition-all shadow-md font-[Manrope] whitespace-nowrap"
                        >
                            <span>Start Your Journey</span>
                            <HiArrowRight className="text-sm sm:text-base" />
                        </Link>
                        <Link
                            to="/feed"
                            className="w-full max-w-[240px] sm:w-auto sm:max-w-none px-6 sm:px-8 py-2.5 sm:py-3.5 border border-[#EAECF0] dark:border-[#3A3F4B] bg-white dark:bg-white/5 backdrop-blur-md text-[#101828] dark:text-[#EDEBE6] font-bold text-xs sm:text-sm rounded-full hover:scale-105 transition-all shadow-xs text-center whitespace-nowrap inline-flex items-center justify-center"
                        >
                            Explore Live Stories
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
