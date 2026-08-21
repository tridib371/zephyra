import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineMagnifyingGlass,
    HiOutlineChevronDown,
    HiOutlineChevronUp,
    HiArrowRight,
    HiOutlineChatBubbleLeftRight,
    HiOutlineShieldCheck,
    HiOutlineUserCircle,
    HiOutlineSparkles,
    HiOutlineExclamationTriangle,
    HiOutlineCheckCircle,
    HiOutlineEnvelope,
    HiOutlineSignal,
    HiOutlineDocumentText,
} from 'react-icons/hi2';

const CATEGORIES = [
    { id: 'all', label: 'All Topics' },
    { id: 'account', label: 'Account & Login' },
    { id: 'messaging', label: 'Direct Messaging' },
    { id: 'content', label: 'Stories & Feeds' },
    { id: 'privacy', label: 'Privacy & Security' },
    { id: 'safety', label: 'Trust & Moderation' },
];

const HELP_CARDS = [
    {
        category: 'account',
        title: 'Account & Profile Setup',
        desc: 'Customize your avatar, bio, handle, and display theme.',
        icon: HiOutlineUserCircle,
        articleCount: '4 Guides',
    },
    {
        category: 'messaging',
        title: 'Direct Messaging & Sockets',
        desc: 'Real-time chats, delivery badges, and instant typing pulses.',
        icon: HiOutlineChatBubbleLeftRight,
        articleCount: '5 Guides',
    },
    {
        category: 'privacy',
        title: 'Privacy & Data Controls',
        desc: 'Export your account data, manage local storage, or delete data.',
        icon: HiOutlineShieldCheck,
        articleCount: '6 Guides',
    },
    {
        category: 'safety',
        title: 'Trust & Community Safety',
        desc: 'Report guideline infractions, block users, and stay safe.',
        icon: HiOutlineExclamationTriangle,
        articleCount: '3 Guides',
    },
];

const FAQS = [
    {
        category: 'messaging',
        q: 'How does real-time messaging work on Zephyra?',
        a: 'Zephyra uses high-throughput WebSocket connections (WSS) to deliver messages with sub-15ms latency. As soon as you hit send, messages are pushed directly to the recipient without requiring page refreshes. Real-time indicators automatically show when a message is Sent (single check) and Seen (double check).',
    },
    {
        category: 'account',
        q: 'How do I change my profile photo, banner, and biography?',
        a: 'Click on your avatar in the top navigation bar and select "Profile", then click the "Edit Profile" button. You can upload custom images for your avatar and header banner with interactive crop tools, and update your bio and display name in real-time.',
    },
    {
        category: 'content',
        q: 'Why is my feed strictly chronological?',
        a: 'Zephyra does not use algorithmic sorting or outrage-amplifying machine learning models. You see posts in the exact chronological order they were published by people you follow, ensuring a serene, honest, and unmanipulated browsing experience.',
    },
    {
        category: 'privacy',
        q: 'Does Zephyra track my browsing activity across other websites?',
        a: 'No. We have a strict Zero-Tracker Pledge. Zephyra has zero third-party advertising tracking pixels, zero data broker integrations, and zero behavioral telemetry. Browser local storage is used solely for session authentication tokens and your chosen theme preference.',
    },
    {
        category: 'safety',
        q: 'How do I report abuse, harassment, or spam?',
        a: 'Click the three dots (...) menu on any post or comment to submit an instant report to our moderation team. You can also visit our Contact Support page to submit a direct safety ticket. Reports are reviewed promptly by human administrators.',
    },
    {
        category: 'account',
        q: 'What should I do if I forget my password?',
        a: 'On the Sign In page, click "Forgot Password" to receive a secure, time-limited password reset link delivered to your registered email address.',
    },
    {
        category: 'content',
        q: 'What image formats and file size limits are supported for stories?',
        a: 'Zephyra supports PNG, JPG, JPEG, WEBP, and GIF image formats up to 10MB per upload. Uploaded media is optimized on secure CDN edge clusters for instantaneous loading.',
    },
    {
        category: 'privacy',
        q: 'How do I permanently delete my account and data?',
        a: 'Go to Settings > Account and navigate to the Danger Zone section. Confirming account deletion permanently wipes your profile, published stories, comments, and direct message records from our primary database.',
    },
    {
        category: 'messaging',
        q: 'Can I delete messages after sending them?',
        a: 'Yes, you can delete messages from your active conversation thread. When a conversation is closed or cleared, message records are purged from the primary channel.',
    },
    {
        category: 'safety',
        q: 'What happens when an account is suspended or banned?',
        a: 'Accounts that violate Community Guidelines receive a transparent notification specifying the suspension reason. Suspended users cannot post, comment, or send messages until their appeal is resolved.',
    },
];

export default function Support() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openIndex, setOpenIndex] = useState(null);

    const filteredFaqs = useMemo(() => {
        return FAQS.filter((faq) => {
            const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
            const matchesSearch =
                !searchQuery.trim() ||
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    const toggleFaq = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero Search Section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest">
                        Help Center & Knowledge Hub
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        How can we assist you?
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        Search our knowledge base for guides on real-time messaging, privacy controls, and account management.
                    </p>

                    {/* Interactive Search Bar */}
                    <div className="relative max-w-xl mx-auto pt-2">
                        <div className="relative flex items-center">
                            <HiOutlineMagnifyingGlass className="absolute left-4.5 text-gray-400 text-xl pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions, settings, real-time messaging..."
                                className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-white dark:bg-[#181C26] px-5 py-4 pl-12 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 shadow-md transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* System Live Status Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="flex items-center gap-1.5">
                            <HiOutlineSignal />
                            <span>All Systems Operational</span>
                            <span className="text-emerald-600/70 dark:text-emerald-400/70 font-normal">• WebSocket Clusters Online (&lt; 15ms)</span>
                        </span>
                    </div>
                </div>

                {/* Top Category Glass Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {HELP_CARDS.map((card) => {
                        const Icon = card.icon;
                        const isSelected = selectedCategory === card.category;
                        return (
                            <div
                                key={card.title}
                                onClick={() => setSelectedCategory(card.category)}
                                className={`p-6 rounded-3xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ${
                                    isSelected
                                        ? 'bg-white dark:bg-[#181C26] border-[#D97B4F] dark:border-[#FF8F6B] shadow-md scale-[1.02]'
                                        : 'bg-white/80 dark:bg-[#12151C]/80 border-gray-200/80 dark:border-[#1F232C] hover:border-[#D97B4F]/40 hover:shadow-xs'
                                }`}
                            >
                                <div className="space-y-3">
                                    <span className={`p-3 rounded-2xl text-xl inline-block ${isSelected ? 'bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D]' : 'bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B]'}`}>
                                        <Icon />
                                    </span>
                                    <h3 className="font-['Fraunces'] font-bold text-base text-gray-900 dark:text-white">
                                        {card.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                                        {card.desc}
                                    </p>
                                </div>
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#D97B4F] dark:text-[#F5C36B]">
                                    {card.articleCount} →
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Filterable FAQ Section */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] mt-1">
                                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'guide' : 'guides'}
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                        selectedCategory === cat.id
                                            ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] shadow-xs'
                                            : 'bg-white dark:bg-[#181C26] border border-gray-200 dark:border-[#252A36] text-gray-600 dark:text-[#A0A5B2] hover:border-gray-300'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Accordion FAQ List */}
                    <div className="space-y-3.5">
                        {filteredFaqs.length === 0 ? (
                            <div className="p-12 text-center rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] space-y-3">
                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    No guides found matching "{searchQuery}"
                                </p>
                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">
                                    Try searching for different keywords or select another category above.
                                </p>
                            </div>
                        ) : (
                            filteredFaqs.map((faq, idx) => {
                                const isOpen = openIndex === idx;
                                return (
                                    <div
                                        key={faq.q}
                                        className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 overflow-hidden transition-all shadow-xs"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-gray-900 dark:text-white cursor-pointer hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors"
                                        >
                                            <span className="font-['Fraunces'] text-base sm:text-lg">{faq.q}</span>
                                            <span className="p-2 rounded-xl bg-gray-100 dark:bg-[#181C26] text-gray-500 dark:text-gray-400 text-sm shrink-0 transition-transform">
                                                {isOpen ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                                            </span>
                                        </button>

                                        <AnimatePresence initial={false}>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.25 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 sm:px-7 pb-6 text-xs sm:text-sm text-gray-600 dark:text-[#B5B9C5] leading-relaxed border-t border-gray-100 dark:border-[#1F232C] pt-4">
                                                        {faq.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Direct Help Banner */}
                <div className="rounded-3xl border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-gradient-to-r from-[#FFF5EF] via-white to-[#FAF0E6] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="font-['Fraunces'] text-2xl font-bold text-gray-900 dark:text-white">
                            Cannot find what you are looking for?
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] max-w-md">
                            Our support and safety team is available to assist you with any questions or account inquiries.
                        </p>
                    </div>
                    <Link
                        to="/contact"
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-xs sm:text-sm font-extrabold hover:scale-105 transition-all shadow-sm shrink-0"
                    >
                        <span>Contact Support Team</span>
                        <HiArrowRight className="text-base" />
                    </Link>
                </div>

            </div>
        </div>
    );
}
