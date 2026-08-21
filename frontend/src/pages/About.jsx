import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

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
        <span ref={ref} className="font-['Fraunces'] font-extrabold text-3xl sm:text-5xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] bg-clip-text text-transparent">
            {prefix}{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
        </span>
    );
};

// Animated wind gust SVG lines
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25"
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
    const [activeTab, setActiveTab] = useState('philosophy');
    const { scrollYProgress } = useScroll();
    const backgroundGlow = useTransform(scrollYProgress, [0, 1], [0.8, 1.2]);

    const TIMELINE = [
        {
            year: 'Phase 01',
            title: 'The Outrage Fatigue',
            subtitle: 'Breaking free from algorithmic toxicity',
            desc: 'Modern social media became an optimization machine for outrage, manufactured debate, and infinite dopamine loops. We asked: What if a platform existed purely to foster calm, genuine self-expression without predatory feeds?',
            icon: '🌱',
            accent: 'from-[#FF8F6B] to-[#D97B4F]'
        },
        {
            year: 'Phase 02',
            title: 'Architecting the West Wind',
            subtitle: 'Sub-second real-time engine',
            desc: 'Engineered from scratch on high-throughput WebSocket micro-clusters. Direct messaging, live typing pulses, and instant reactions deliver zero-lag communication wrapped in an organic sunset aesthetic.',
            icon: '⚡',
            accent: 'from-[#F5C36B] to-[#FF8F6B]'
        },
        {
            year: 'Phase 03',
            title: 'Zero-Tracker Architecture',
            subtitle: 'Privacy as a sacred covenant',
            desc: 'No behavioral ad trackers. No selling user reading habits to data brokers. All user communications and private drafts remain confidential under strict authenticated boundaries.',
            icon: '🛡️',
            accent: 'from-[#D97B4F] to-[#C6822E]'
        },
        {
            year: 'Phase 04',
            title: 'The Living Sanctuary',
            subtitle: 'Global community of mindful creators',
            desc: 'Today, Zephyra is a vibrant, blooming haven for digital artists, thinkers, developers, and writers who cherish beauty, minimalism, and meaningful dialogue.',
            icon: '🪶',
            accent: 'from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]'
        }
    ];

    const ARCHITECTURE = [
        {
            title: 'Real-Time Pulse Engine',
            badge: 'Sub-15ms WebSocket Protocol',
            desc: 'Instant two-way event bus orchestrating active conversations, seen receipts, typing indicators, and system broadcast banners instantaneously.',
            highlight: 'Engineered for zero-lag conversational intimacy.'
        },
        {
            title: 'Organic Chronological Feeds',
            badge: 'Zero Addictive Exploitation',
            desc: 'You see what people you follow actually post in true chronological order. No algorithmic suppression, no forced promotional clutter.',
            highlight: 'Your timeline is yours, completely unmanipulated.'
        },
        {
            title: 'Atmospheric Glassmorphism Design',
            badge: 'Humanist Visual Language',
            desc: 'Carefully tuned HSL color palettes featuring warm sunset ochre, terracotta hues, and deep obsidian dark modes designed to eliminate eye fatigue.',
            highlight: 'A digital space that feels like a quiet evening breeze.'
        }
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#FAF7F2] dark:bg-[#090B0F] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 font-[Manrope]">

            {/* Glowing Atmospheric Orbs */}
            <motion.div
                style={{ scale: backgroundGlow }}
                className="absolute -top-32 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FF8F6B]/25 via-[#D97B4F]/15 to-transparent blur-3xl pointer-events-none"
            />
            <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#F5C36B]/20 via-[#FF8F6B]/15 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#D97B4F]/15 to-transparent blur-3xl pointer-events-none" />

            <WindBreeze />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-28 space-y-24">

                {/* ===== HERO SECTION ===== */}
                <section className="text-center space-y-8 max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-white/80 dark:bg-[#151922]/80 backdrop-blur-xl shadow-xs"
                    >
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF8F6B] animate-ping" />
                        <span className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#B85323] dark:text-[#F5C36B]">
                            The Zephyra Manifesto
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="font-['Fraunces'] italic font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[1.05]"
                    >
                        A Sanctuary for <br />
                        <span className="bg-gradient-to-r from-[#B85323] via-[#D97B4F] to-[#C6822E] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent">
                            Authentic Human Stories
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg sm:text-2xl text-gray-700 dark:text-[#C5C9D3] font-medium leading-relaxed max-w-3xl mx-auto"
                    >
                        We did not build Zephyra to capture your attention and sell it to the highest bidder. We built it so your thoughts can catch the wind — freely, beautifully, and on your own terms.
                    </motion.p>
                </section>

                {/* ===== LIVE STATS GRID ===== */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
                >
                    <div className="p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/80 dark:bg-[#12151C]/80 backdrop-blur-xl shadow-xs text-center space-y-2">
                        <StatCounter target={15} prefix="< " suffix=" ms" />
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-[#8A8F9C]">Socket Latency</p>
                    </div>
                    <div className="p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/80 dark:bg-[#12151C]/80 backdrop-blur-xl shadow-xs text-center space-y-2">
                        <StatCounter target={100} suffix="%" />
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-[#8A8F9C]">Chronological Feed</p>
                    </div>
                    <div className="p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/80 dark:bg-[#12151C]/80 backdrop-blur-xl shadow-xs text-center space-y-2">
                        <StatCounter target={0} suffix=" Ads" />
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-[#8A8F9C]">Zero Ad Trackers</p>
                    </div>
                    <div className="p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/80 dark:bg-[#12151C]/80 backdrop-blur-xl shadow-xs text-center space-y-2">
                        <StatCounter target={99.9} decimals={1} suffix="%" />
                        <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-[#8A8F9C]">Real-Time Uptime</p>
                    </div>
                </motion.section>

                {/* ===== PHILOSOPHY VS TRADITIONAL SOCIAL MEDIA ===== */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="rounded-3xl border border-[#D97B4F]/20 dark:border-[#FF8F6B]/20 bg-gradient-to-b from-white/95 to-gray-50/90 dark:from-[#11151E]/95 dark:to-[#0B0D12]/90 backdrop-blur-2xl p-8 sm:p-14 shadow-xl space-y-8"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-[#1F232C] pb-6">
                        <div>
                            <span className="text-xs uppercase font-extrabold tracking-widest text-[#D97B4F] dark:text-[#F5C36B]">The Zephyra Contrast</span>
                            <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                                Why We Reimagined Social Connection
                            </h2>
                        </div>
                        <span className="text-3xl sm:text-4xl">🕊️</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 space-y-3">
                            <h3 className="font-bold text-base text-rose-700 dark:text-rose-400 flex items-center gap-2">
                                <span>❌</span> Conventional Platforms
                            </h3>
                            <ul className="text-xs sm:text-sm text-gray-600 dark:text-[#A0A5B2] space-y-2.5 leading-relaxed">
                                <li>• Manipulative algorithms engineered to trigger anger and outrage</li>
                                <li>• Cluttered timelines drowning in unskippable sponsored ads</li>
                                <li>• Uncontrolled tracking of personal data, clicks, and messages</li>
                                <li>• Vanity metric addiction that reduces humans to follower counts</li>
                            </ul>
                        </div>

                        <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 space-y-3">
                            <h3 className="font-bold text-base text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                <span>✨</span> The Zephyra Experience
                            </h3>
                            <ul className="text-xs sm:text-sm text-gray-600 dark:text-[#A0A5B2] space-y-2.5 leading-relaxed">
                                <li>• Organic, chronological delivery of stories you actually care about</li>
                                <li>• Breath-like, peaceful UI crafted to inspire mindfulness and creativity</li>
                                <li>• Zero third-party trackers, zero data brokering, zero compromise</li>
                                <li>• Direct, lightning-fast private messaging with real human intimacy</li>
                            </ul>
                        </div>
                    </div>
                </motion.section>

                {/* ===== JOURNEY / TIMELINE ===== */}
                <section className="space-y-10">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#D97B4F] dark:text-[#F5C36B]">Our Journey</span>
                        <h2 className="font-['Fraunces'] text-3xl sm:text-5xl font-extrabold">The Evolution of Zephyra</h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] max-w-lg mx-auto">
                            From a quiet rebellious prototype to a vibrant global sanctuary.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {TIMELINE.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.15 }}
                                className="group p-8 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 backdrop-blur-xl shadow-xs hover:shadow-xl hover:scale-[1.02] transition-all duration-300 space-y-4 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${item.accent}`} />
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#D97B4F] dark:text-[#F5C36B] font-mono">{item.year}</span>
                                    <span className="text-2xl p-2 rounded-2xl bg-gray-100 dark:bg-[#181C26]">{item.icon}</span>
                                </div>
                                <h3 className="font-['Fraunces'] text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                <p className="text-xs font-semibold text-gray-400">{item.subtitle}</p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ===== ARCHITECTURAL PILLARS ===== */}
                <section className="space-y-8">
                    <div className="text-center space-y-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#D97B4F] dark:text-[#F5C36B]">Engineering Rigor</span>
                        <h2 className="font-['Fraunces'] text-3xl sm:text-5xl font-extrabold">Crafted with Obsessive Detail</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {ARCHITECTURE.map((arch) => (
                            <div
                                key={arch.title}
                                className="p-8 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 backdrop-blur-xl shadow-xs space-y-4 flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B]">
                                        {arch.badge}
                                    </span>
                                    <h3 className="font-['Fraunces'] text-xl font-bold text-gray-900 dark:text-white">{arch.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] leading-relaxed">{arch.desc}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-100 dark:border-[#1F232C] text-xs font-semibold text-[#D97B4F] dark:text-[#F5C36B]">
                                    ✓ {arch.highlight}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ===== CREATOR NOTE ===== */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative rounded-3xl border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-gradient-to-br from-[#FFF5EF] via-white to-[#FAF0E6] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-14 shadow-lg text-center space-y-6 overflow-hidden"
                >
                    <div className="text-4xl">🪶</div>
                    <blockquote className="font-['Fraunces'] italic text-2xl sm:text-4xl text-[#1A140D] dark:text-white max-w-3xl mx-auto leading-snug">
                        “When thoughts are no longer held captive by algorithms, they become wind. And wind reaches everywhere.”
                    </blockquote>
                    <div className="space-y-1">
                        <p className="text-sm font-extrabold uppercase tracking-widest text-[#D97B4F] dark:text-[#F5C36B]">Tridib Sarkar</p>
                        <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Creator & Lead Architect, Zephyra</p>
                    </div>
                </motion.section>

                {/* ===== FINAL CALL TO ACTION ===== */}
                <section className="text-center pt-8 space-y-6">
                    <h2 className="font-['Fraunces'] text-3xl sm:text-5xl font-extrabold">Ready to Catch the Wind?</h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-[#9DA3B4] max-w-xl mx-auto">
                        Experience the difference of a serene, distraction-free social platform today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full hover:scale-105 hover:shadow-xl transition-all shadow-md font-[Manrope] min-w-48"
                        >
                            Start Your Journey →
                        </Link>
                        <Link
                            to="/feed"
                            className="px-8 py-4 border border-[#D97B4F]/40 dark:border-[#3A3F4B] bg-white/80 dark:bg-white/5 backdrop-blur-md text-[#1A140D] dark:text-[#EDEBE6] font-bold text-sm rounded-full hover:scale-105 transition-all shadow-xs"
                        >
                            Explore Live Stories
                        </Link>
                    </div>
                </section>

            </div>
        </div>
    );
}
