import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineHandRaised,
    HiOutlineLightBulb,
    HiOutlineNoSymbol,
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlineScale,
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineFlag,
    HiOutlineArrowRight,
    HiOutlineUserGroup,
} from 'react-icons/hi2';

import guidelinesBgLight from '../assets/guidelines-bg-light.jpg';
import guidelinesBgDark from '../assets/guidelines-bg-dark.jpg';

// Animated wind gust SVG lines for smooth motion
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25 z-0"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="guidelinesGust" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        <motion.path
            d="M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
            fill="none"
            stroke="url(#guidelinesGust)"
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
            stroke="url(#guidelinesGust)"
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

const CATEGORIES = [
    { id: 'all', label: 'All Principles' },
    { id: 'conduct', label: 'Creator Conduct' },
    { id: 'safety', label: 'Safety & Privacy' },
    { id: 'enforcement', label: 'Enforcement & Appeals' },
];

const GUIDELINES = [
    {
        id: 'conduct-1',
        category: 'conduct',
        icon: HiOutlineHandRaised,
        number: '01',
        title: 'Empathy, Dignity & Constructive Dialogue',
        tagline: 'Treat every member as a human being with diverse perspectives.',
        description:
            'Zephyra is designed as a sanctuary from the hostility of algorithmic platforms. We encourage passionate debate, creative critique, and intellectual curiosity - provided it remains civil and constructive.',
        dos: [
            'Engage in respectful, good-faith conversations.',
            'Critique arguments and ideas, not individuals.',
            'Support emerging creators with uplifting feedback.',
        ],
        donts: [
            'Personal insults, name-calling, or targeted harassment.',
            'Hate speech targeting race, gender, religion, orientation, or disability.',
            'Coordinated dogpiling or cyberbullying.',
        ],
    },
    {
        id: 'conduct-2',
        category: 'conduct',
        icon: HiOutlineLightBulb,
        number: '02',
        title: 'Authenticity & Original Voice',
        tagline: 'Share your genuine creations, thoughts, and artistic vision.',
        description:
            'Our community values authentic human expression over manufactured virality. Build trust by posting original stories, honest photographs, and unique written pieces.',
        dos: [
            'Publish your own photography, writing, and designs.',
            'Credit original creators when quoting or referencing their work.',
            'Represent your real identity or artistic persona honestly.',
        ],
        donts: [
            'Impersonating other creators, public figures, or platform staff.',
            'Distributing deliberately deceptive misinformation or fraudulent claims.',
            'Mass-reposting stolen content without permission or attribution.',
        ],
    },
    {
        id: 'safety-1',
        category: 'safety',
        icon: HiOutlineLockClosed,
        number: '03',
        title: 'Privacy & Zero Tolerance for Doxxing',
        tagline: 'Protect your own privacy and fiercely guard the privacy of others.',
        description:
            'A creator’s personal safety and confidentiality are absolute. We maintain strict zero-tolerance policies against sharing private information without explicit, verifiable consent.',
        dos: [
            'Respect direct message boundaries and private discussions.',
            'Obtain consent before sharing photos of individuals in private spaces.',
            'Use platform reporting tools if someone attempts to blackmail or threaten you.',
        ],
        donts: [
            'Publishing phone numbers, home addresses, or private emails (doxxing).',
            'Leaking private direct message screenshots maliciously.',
            'Attempting to uncover the real-world identity of anonymous creators.',
        ],
    },
    {
        id: 'safety-2',
        category: 'safety',
        icon: HiOutlineShieldCheck,
        number: '04',
        title: 'Safe Harbor & Content Appropriateness',
        tagline: 'Preserving a welcoming atmosphere for creators of all generations.',
        description:
            'Zephyra is a safe harbor for creative minds. We enforce clear boundaries regarding graphic, violent, or sexually explicit content to maintain an inclusive, inspiring environment.',
        dos: [
            'Share inspiring visual art, portraits, architecture, and scenery.',
            'Discuss sensitive life experiences with care and constructive context.',
            'Report disturbing material to our moderation team immediately.',
        ],
        donts: [
            'Explicit pornography or non-consensual sexual media.',
            'Depictions of gratuitous violence, gore, or physical cruelty.',
            'Encouragement of self-harm, eating disorders, or suicide.',
        ],
    },
    {
        id: 'safety-3',
        category: 'safety',
        icon: HiOutlineNoSymbol,
        number: '05',
        title: 'Zero-Spam & Organic Growth Only',
        tagline: 'No artificial engagement schemes, spam bots, or commercial floods.',
        description:
            'Because Zephyra features an honest chronological feed without algorithmic amplification, artificial engagement and bulk spam schemes disrupt the sanctuary for everyone.',
        dos: [
            'Build your audience organically through high-quality stories.',
            'Share personal projects and thoughtful updates genuinely.',
            'Interact naturally with fellow creators in comment threads.',
        ],
        donts: [
            'Deploying automated bot scripts, scrapers, or auto-like extensions.',
            'Sending unsolicited bulk direct messages or repetitive promo links.',
            'Participating in follow-for-follow rings or deceptive affiliate schemes.',
        ],
    },
    {
        id: 'conduct-3',
        category: 'conduct',
        icon: HiOutlineScale,
        number: '06',
        title: 'Intellectual Property & Fair Attribution',
        tagline: 'You own your work - and honor the rights of fellow artists.',
        description:
            'Creators retain 100% intellectual property ownership over what they post. We respond promptly to valid copyright notices and uphold the integrity of original art.',
        dos: [
            'Upload only media you hold rights to or have permission to display.',
            'Provide clear source links when discussing third-party articles.',
            'File DMCA notices via legal@zephyra.app if your work was copied without consent.',
        ],
        donts: [
            'Cropping out watermarks, signatures, or author credits.',
            'Selling or claiming ownership of other artists’ creations.',
            'Circumventing platform protections to scrape community artwork.',
        ],
    },
];

const MODERATION_STEPS = [
    {
        step: '1',
        title: 'Community Flagging',
        desc: 'Members report violations using the options menu on any post, comment, or direct message.',
    },
    {
        step: '2',
        title: 'Human Review',
        desc: 'Our moderation team inspects the context within hours, evaluating against these Guidelines.',
    },
    {
        step: '3',
        title: 'Proportional Action',
        desc: 'Actions range from content removal to formal warnings, temporary suspensions, or permanent bans.',
    },
    {
        step: '4',
        title: 'Transparent Appeal',
        desc: 'Affected users receive an explicit rationale and can submit an appeal through Support.',
    },
];

export default function Guidelines() {
    const [activeTab, setActiveTab] = useState('all');

    const filteredGuidelines = GUIDELINES.filter((item) => {
        if (activeTab === 'all') return true;
        if (activeTab === 'enforcement') return true;
        return item.category === activeTab;
    });

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Realistic Community Ethics Handbook Photography Wallpapers - Clear & Sharp */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <img
                    src={guidelinesBgLight}
                    alt="Community Guidelines & Ethics Handbook Light Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-95 blur-[0.5px] scale-100 transition-opacity duration-700 dark:hidden"
                />
                <img
                    src={guidelinesBgDark}
                    alt="Community Trust Sanctuary Vault Dark Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-85 blur-[0.5px] scale-100 transition-opacity duration-700 hidden dark:block"
                />
                {/* Overlay Tint Gradients for High Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/65 via-[#FAF7F2]/45 to-[#FAF7F2]/75 dark:from-[#0E1116]/75 dark:via-[#0E1116]/70 dark:to-[#0E1116]/85" />
            </div>

            <div className="relative max-w-5xl mx-auto space-y-16 z-10">

                {/* Hero Header with Entrance Motion & Solid Black Border in Day Mode */}
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
                        Community Trust, Safety & Ethics
                    </motion.span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1C1008] dark:text-white relative z-10">
                        Community Guidelines
                    </h1>
                    <p className="text-base sm:text-xl text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold max-w-xl mx-auto relative z-10">
                        These foundational principles ensure that Zephyra remains a welcoming, calm, and inspiring sanctuary for creators and thinkers worldwide.
                    </p>
                </motion.div>

                {/* Philosophy Manifesto Banner with Solid Black Border in Day Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="p-8 sm:p-10 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center gap-6"
                >
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black text-3xl shrink-0 shadow-md">
                        <HiOutlineUserGroup className="stroke-[2.2]" />
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="font-['Fraunces'] font-bold text-xl sm:text-2xl text-[#1C1008] dark:text-white">
                            The Sanctuary Covenant
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#A0A5B2] leading-relaxed font-bold">
                            Zephyra is built on the belief that social spaces should nourish creativity rather than provoke outrage. By participating in our community, you commit to respecting fellow creators, upholding authenticity, and fostering positive, thoughtful connections.
                        </p>
                    </div>
                </motion.div>

                {/* Category Navigation Pills with Black Borders in Day Mode */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {CATEGORIES.map((cat) => (
                        <motion.button
                            key={cat.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer border-2 ${
                                activeTab === cat.id
                                    ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] border-black dark:border-white shadow-md'
                                    : 'bg-white dark:bg-[#181C26] border-black dark:border-[#252A36] text-[#1C1008] dark:text-[#A0A5B2] hover:bg-[#FFF6EF]'
                            }`}
                        >
                            {cat.label}
                        </motion.button>
                    ))}
                </div>

                {/* Guidelines Cards with Do & Don't Matrix & Motion Lift */}
                <div className="space-y-8">
                    {filteredGuidelines.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                whileHover={{ y: -6, scale: 1.01 }}
                                className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6 transition-all"
                            >
                                {/* Header of the Card */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-[#1F232C] pb-6">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="p-3.5 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-2xl shrink-0 flex items-center justify-center">
                                            <IconComponent className="stroke-[2.2]" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-[#9E3610] dark:text-[#F5C36B] block">
                                                Principle {item.number}
                                            </span>
                                            <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-[#1C1008] dark:text-white">
                                                {item.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <span className="text-xs text-[#5E3821] dark:text-gray-400 font-extrabold italic">
                                        {item.tagline}
                                    </span>
                                </div>

                                {/* Body Description */}
                                <p className="text-xs sm:text-sm text-[#3D2517] dark:text-[#B5B9C5] leading-relaxed font-bold">
                                    {item.description}
                                </p>

                                {/* Dos & Don'ts Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {/* What's Encouraged */}
                                    <motion.div whileHover={{ scale: 1.01 }} className="p-5 rounded-2xl bg-emerald-100/70 dark:bg-emerald-950/20 border-2 border-black dark:border-emerald-900/40 space-y-3 shadow-xs">
                                        <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-300 font-black text-xs sm:text-sm">
                                            <span className="p-1 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-300 border border-black dark:border-emerald-700">
                                                <HiOutlineCheck className="text-xs stroke-[2.5]" />
                                            </span>
                                            <span>What Is Encouraged</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {item.dos.map((doItem) => (
                                                <li key={doItem} className="text-xs text-[#2B1C12] dark:text-[#C5C9D3] flex items-start gap-2 leading-relaxed font-bold">
                                                    <span className="text-emerald-700 dark:text-emerald-400 font-black mt-0.5">•</span>
                                                    <span>{doItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>

                                    {/* What's Prohibited */}
                                    <motion.div whileHover={{ scale: 1.01 }} className="p-5 rounded-2xl bg-rose-100/70 dark:bg-rose-950/20 border-2 border-black dark:border-rose-900/40 space-y-3 shadow-xs">
                                        <div className="flex items-center gap-2 text-rose-950 dark:text-rose-300 font-black text-xs sm:text-sm">
                                            <span className="p-1 rounded-full bg-rose-200 dark:bg-rose-900/60 text-rose-950 dark:text-rose-300 border border-black dark:border-rose-700">
                                                <HiOutlineXMark className="text-xs stroke-[2.5]" />
                                            </span>
                                            <span>What Is Prohibited</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {item.donts.map((dontItem) => (
                                                <li key={dontItem} className="text-xs text-[#2B1C12] dark:text-[#C5C9D3] flex items-start gap-2 leading-relaxed font-bold">
                                                    <span className="text-rose-700 dark:text-rose-400 font-black mt-0.5">•</span>
                                                    <span>{dontItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* 4-Step Moderation & Enforcement Ladder */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-8 sm:p-12 shadow-2xl space-y-8"
                >
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <span className="text-[11px] font-black uppercase tracking-widest text-[#9E3610] dark:text-[#F5C36B]">
                            Fair & Transparent Governance
                        </span>
                        <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#1C1008] dark:text-white">
                            How We Enforce Guidelines
                        </h2>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#8A8F9C] font-bold">
                            Our moderation process is guided by proportionality, human oversight, and transparent appeals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {MODERATION_STEPS.map((m) => (
                            <motion.div
                                key={m.step}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="p-6 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#252A36] space-y-3 relative shadow-md cursor-pointer"
                            >
                                <span className="flex items-center justify-center w-9 h-9 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 font-black text-xs">
                                    {m.step}
                                </span>
                                <h3 className="font-['Fraunces'] font-bold text-base text-[#1C1008] dark:text-white">
                                    {m.title}
                                </h3>
                                <p className="text-xs text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold">
                                    {m.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Reporting & Assistance Banner with Black Border */}
                <motion.div
                    initial={{ opacity: 0, y: 35, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/40 bg-white/92 dark:bg-gradient-to-r dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6"
                >
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-[#9E3610] dark:text-[#F5C36B] font-black text-sm">
                            <HiOutlineFlag className="text-lg stroke-[2.2]" />
                            <span>See something that violates these rules?</span>
                        </div>
                        <h3 className="font-['Fraunces'] text-2xl font-bold text-[#1C1008] dark:text-white">
                            Submit a Confidential Safety Report
                        </h3>
                        <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#9DA3B4] max-w-lg font-bold">
                            Use the (...) menu on any post or message to flag content, or contact our trust & safety administrators directly.
                        </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.97 }} className="shrink-0">
                        <Link
                            to="/contact"
                            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black text-xs sm:text-sm font-extrabold transition-all shadow-md cursor-pointer"
                        >
                            <span>Contact Safety Team</span>
                            <HiOutlineArrowRight className="text-base stroke-[2.2]" />
                        </Link>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
}
