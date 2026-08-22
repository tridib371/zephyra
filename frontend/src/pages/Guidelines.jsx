import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineHandRaised,
    HiOutlineSparkles,
    HiOutlineNoSymbol,
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlineScale,
    HiOutlineCheck,
    HiOutlineXMark,
    HiOutlineExclamationTriangle,
    HiOutlineFlag,
    HiOutlineArrowRight,
    HiOutlineUserGroup,
} from 'react-icons/hi2';

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
        icon: HiOutlineSparkles,
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
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero Header */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest">
                        Community Trust, Safety & Ethics
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Community Guidelines
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        These foundational principles ensure that Zephyra remains a welcoming, calm, and inspiring sanctuary for creators and thinkers worldwide.
                    </p>
                </div>

                {/* Philosophy Manifesto Banner */}
                <div className="p-8 sm:p-10 rounded-3xl border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-gradient-to-r from-[#FFF5EF] via-white to-[#FAF0E6] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] shadow-sm flex flex-col sm:flex-row items-center gap-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-3xl shrink-0">
                        <HiOutlineUserGroup />
                    </div>
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="font-['Fraunces'] font-bold text-xl sm:text-2xl text-gray-900 dark:text-white">
                            The Sanctuary Covenant
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#A0A5B2] leading-relaxed">
                            Zephyra is built on the belief that social spaces should nourish creativity rather than provoke outrage. By participating in our community, you commit to respecting fellow creators, upholding authenticity, and fostering positive, thoughtful connections.
                        </p>
                    </div>
                </div>

                {/* Category Navigation Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                                activeTab === cat.id
                                    ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] shadow-sm scale-105'
                                    : 'bg-white dark:bg-[#181C26] border border-gray-200 dark:border-[#252A36] text-gray-600 dark:text-[#A0A5B2] hover:border-gray-300'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Guidelines Cards with Do & Don't Matrix */}
                <div className="space-y-8">
                    {filteredGuidelines.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={item.id}
                                className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-xs backdrop-blur-xl space-y-6 transition-all hover:border-[#D97B4F]/40"
                            >
                                {/* Header of the Card */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-[#1F232C] pb-6">
                                    <div className="flex items-start sm:items-center gap-4">
                                        <div className="p-3.5 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl shrink-0">
                                            <IconComponent />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D97B4F] dark:text-[#F5C36B] block">
                                                Principle {item.number}
                                            </span>
                                            <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                                {item.title}
                                            </h2>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-semibold italic">
                                        {item.tagline}
                                    </span>
                                </div>

                                {/* Body Description */}
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-[#B5B9C5] leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Dos & Don'ts Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                    {/* What's Encouraged */}
                                    <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-3">
                                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm">
                                            <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                                                <HiOutlineCheck className="text-xs" />
                                            </span>
                                            <span>What Is Encouraged</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {item.dos.map((doItem) => (
                                                <li key={doItem} className="text-xs text-gray-700 dark:text-[#C5C9D3] flex items-start gap-2 leading-relaxed">
                                                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                                                    <span>{doItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* What's Prohibited */}
                                    <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-3">
                                        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs sm:text-sm">
                                            <span className="p-1 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                                                <HiOutlineXMark className="text-xs" />
                                            </span>
                                            <span>What Is Prohibited</span>
                                        </div>
                                        <ul className="space-y-2">
                                            {item.donts.map((dontItem) => (
                                                <li key={dontItem} className="text-xs text-gray-700 dark:text-[#C5C9D3] flex items-start gap-2 leading-relaxed">
                                                    <span className="text-rose-500 font-bold mt-0.5">•</span>
                                                    <span>{dontItem}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 4-Step Moderation & Enforcement Ladder */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-8 sm:p-12 shadow-sm space-y-8">
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#D97B4F] dark:text-[#F5C36B]">
                            Fair & Transparent Governance
                        </span>
                        <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            How We Enforce Guidelines
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C]">
                            Our moderation process is guided by proportionality, human oversight, and transparent appeals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {MODERATION_STEPS.map((m) => (
                            <div
                                key={m.step}
                                className="p-6 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-3 relative"
                            >
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FF8F6B]/20 text-[#D97B4F] dark:text-[#F5C36B] font-extrabold text-xs">
                                    {m.step}
                                </span>
                                <h3 className="font-['Fraunces'] font-bold text-base text-gray-900 dark:text-white">
                                    {m.title}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                                    {m.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reporting & Assistance Banner */}
                <div className="rounded-3xl border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-gradient-to-r from-[#FFF5EF] via-white to-[#FAF0E6] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-[#D97B4F] dark:text-[#F5C36B] font-bold text-sm">
                            <HiOutlineFlag className="text-lg" />
                            <span>See something that violates these rules?</span>
                        </div>
                        <h3 className="font-['Fraunces'] text-2xl font-bold text-gray-900 dark:text-white">
                            Submit a Confidential Safety Report
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] max-w-lg">
                            Use the (...) menu on any post or message to flag content, or contact our trust & safety administrators directly.
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            to="/contact"
                            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-xs sm:text-sm font-extrabold hover:scale-105 transition-all shadow-sm"
                        >
                            <span>Contact Safety Team</span>
                            <HiOutlineArrowRight className="text-base" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
