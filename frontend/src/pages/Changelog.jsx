import {
    HiOutlineSun,
    HiOutlineBolt,
    HiOutlineShieldCheck,
    HiOutlineCheck,
    HiOutlineChatBubbleLeftRight,
    HiOutlinePaintBrush,
} from 'react-icons/hi2';

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
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest">
                        Release Notes
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        What's New in Zephyra
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        Continuous improvements, speed optimizations, and new features shipped to the community.
                    </p>
                </div>

                {/* Release Timeline */}
                <div className="space-y-8">
                    {RELEASES.map((rel) => {
                        const Icon = rel.icon;
                        return (
                            <div
                                key={rel.version}
                                className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-xs backdrop-blur-xl space-y-6 relative overflow-hidden"
                            >
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${rel.accent}`} />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-[#1F232C] pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xl">
                                            <Icon />
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                                    {rel.version}
                                                </h2>
                                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#FF8F6B]/20 text-[#D97B4F] dark:text-[#F5C36B]">
                                                    {rel.tag}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium">{rel.date}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{rel.title}</h3>
                                </div>

                                <ul className="space-y-2.5">
                                    {rel.changes.map((item) => (
                                        <li key={item} className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 dark:text-[#B5B9C5] leading-relaxed">
                                            <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs shrink-0 mt-0.5">
                                                <HiOutlineCheck />
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
