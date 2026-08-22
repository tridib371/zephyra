import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { FiFeather, FiWind } from 'react-icons/fi';

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
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest">
                        Platform Capabilities
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Built for Meaningful Connection
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        Discover the craft, technology, and intentional design behind Zephyra's calm social experience.
                    </p>
                </div>

                {/* Interactive Feature Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CORE_FEATURES.map((item) => {
                        const Icon = item.icon;
                        const isSelected = selectedFeature === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setSelectedFeature(item.id)}
                                className={`p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col gap-2 ${
                                    isSelected
                                        ? 'bg-white dark:bg-[#181C26] border-[#D97B4F] dark:border-[#FF8F6B] shadow-md scale-[1.02]'
                                        : 'bg-white/60 dark:bg-[#12151C]/60 border-gray-200 dark:border-[#1F232C] hover:border-gray-300'
                                }`}
                            >
                                <span className={`p-2.5 rounded-xl text-lg w-fit ${isSelected ? 'bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D]' : 'bg-gray-100 dark:bg-[#1A1E28] text-gray-600 dark:text-gray-400'}`}>
                                    <Icon />
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{item.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Feature Spotlight Card */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-8 sm:p-12 shadow-sm backdrop-blur-xl space-y-8">
                    <div className="space-y-3">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-[#D97B4F] dark:text-[#F5C36B]">
                            {active.category}
                        </span>
                        <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                            {active.title}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-[#A0A5B2] leading-relaxed max-w-2xl">
                            {active.desc}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-[#1F232C]">
                        {active.details.map((point) => (
                            <div key={point} className="flex items-start gap-3 p-3.5 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36]">
                                <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs shrink-0 mt-0.5">
                                    <HiOutlineCheck />
                                </span>
                                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-[#C5C9D3]">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlinePhoto />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Visual Storytelling</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            Share high-resolution images with seamless aspect ratio preservation and intuitive crop controls.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineBellAlert />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Instant Alerts</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            Receive real-time notifications for likes, comments, mentions, and administrative broadcasts.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineDevicePhoneMobile />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Adaptive Mobile UX</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            Full-screen responsive layouts crafted specifically for handheld devices and touch interactions.
                        </p>
                    </div>
                </div>

                {/* Call to action */}
                <div className="rounded-3xl border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-gradient-to-r from-[#FFF5EF] via-white to-[#FAF0E6] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-sm text-center space-y-6">
                    <h2 className="font-['Fraunces'] text-2xl sm:text-4xl font-extrabold">Ready to explore Zephyra?</h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] max-w-md mx-auto">
                        Create your free account today and experience a tranquil, real-time social platform.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/register"
                            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full hover:scale-105 transition-all shadow-sm"
                        >
                            <span>Join the Community</span>
                            <HiArrowRight className="text-base" />
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
