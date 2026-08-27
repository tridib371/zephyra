import { useState, useMemo, useEffect, useRef } from 'react';
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
    HiOutlineNewspaper,
    HiOutlineExclamationTriangle,
    HiOutlineSignal,
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
    },
    {
        category: 'messaging',
        title: 'Direct Messaging & Sockets',
        desc: 'Real-time chats, delivery badges, and instant typing pulses.',
        icon: HiOutlineChatBubbleLeftRight,
    },
    {
        category: 'content',
        title: 'Stories & Chronological Feeds',
        desc: 'Publish visual stories, crop images, and explore posts.',
        icon: HiOutlineNewspaper,
    },
    {
        category: 'privacy',
        title: 'Privacy & Data Controls',
        desc: 'Export your account data, manage local storage, or delete data.',
        icon: HiOutlineShieldCheck,
    },
    {
        category: 'safety',
        title: 'Trust & Community Safety',
        desc: 'Report guideline infractions, block users, and stay safe.',
        icon: HiOutlineExclamationTriangle,
    },
];

const FAQS = [
    // 1. Account & Profile Setup (5 Guides)
    {
        id: 'acc-1',
        category: 'account',
        q: 'How do I change my profile photo, banner, and biography?',
        a: 'Click on your avatar in the top navigation bar and select "Profile", then click the "Edit Profile" button. You can upload custom images for your avatar and header banner with interactive crop tools, and update your bio and display name in real-time.',
    },
    {
        id: 'acc-2',
        category: 'account',
        q: 'What should I do if I forget my password or get locked out?',
        a: 'On the Sign In page, click "Forgot Password" to receive a secure, time-limited password reset link delivered to your registered email address.',
    },
    {
        id: 'acc-3',
        category: 'account',
        q: 'How do I customize my unique @username handle?',
        a: 'Navigate to Settings > Profile where you can choose a unique username handle (alphanumeric and underscores). Your username is your unique identifier across the platform and direct message searches.',
    },
    {
        id: 'acc-4',
        category: 'account',
        q: 'How do I toggle between Obsidian Dark Mode and Warm Terracotta Light Mode?',
        a: 'Click the Sun / Moon theme toggle in the top navigation bar at any time. Your preference is automatically stored in your browser local storage so your theme remains consistent every time you visit.',
    },
    {
        id: 'acc-5',
        category: 'account',
        q: 'Can I link my social links or portfolio on my Zephyra profile?',
        a: 'Yes, in your profile edit view you can link personal websites, GitHub, or portfolio URLs to display directly below your bio.',
    },

    // 2. Direct Messaging & Sockets (6 Guides)
    {
        id: 'msg-1',
        category: 'messaging',
        q: 'How does real-time messaging work on Zephyra?',
        a: 'Zephyra uses high-throughput WebSocket connections (WSS) to deliver messages with sub-15ms latency. As soon as you hit send, messages are pushed directly to the recipient without requiring page refreshes.',
    },
    {
        id: 'msg-2',
        category: 'messaging',
        q: 'How do the Sent and Seen checkmarks work in chat?',
        a: 'When you dispatch a message, a bold cocoa single checkmark (✓ Sent) appears once it reaches our server. When the recipient views the conversation thread, it instantly updates to a double checkmark (✓✓ Seen) in real-time.',
    },
    {
        id: 'msg-3',
        category: 'messaging',
        q: 'Can I start a direct chat from someone’s profile page?',
        a: 'Yes! Simply visit any creator’s profile and click the "Message" button to immediately open a private conversation thread. You can also search for handles directly within the Messages inbox.',
    },
    {
        id: 'msg-4',
        category: 'messaging',
        q: 'Can I delete messages or clear an entire conversation thread?',
        a: 'Yes. You can delete individual messages or clear your conversation history. When cleared, messages are removed from active display for that thread.',
    },
    {
        id: 'msg-5',
        category: 'messaging',
        q: 'Is there a character limit on direct messages?',
        a: 'Direct messages support up to 4,000 characters per message, allowing for thoughtful long-form discussions without arbitrary truncation.',
    },
    {
        id: 'msg-6',
        category: 'messaging',
        q: 'Do I get notifications when receiving a message while in another tab?',
        a: 'Yes! If you have the browser tab open in the background, incoming messages trigger an ambient audio ping and update your unread message badge count in the navigation bar in real-time.',
    },

    // 3. Stories & Feeds (4 Guides)
    {
        id: 'feed-1',
        category: 'content',
        q: 'Why is my feed strictly chronological without algorithms?',
        a: 'Zephyra does not use algorithmic sorting or outrage-amplifying machine learning models. You see posts in the exact chronological order they were published by people you follow, ensuring a serene, honest, and unmanipulated browsing experience.',
    },
    {
        id: 'feed-2',
        category: 'content',
        q: 'What image formats and file size limits are supported for stories?',
        a: 'Zephyra supports PNG, JPG, JPEG, WEBP, and GIF image formats up to 10MB per upload. Uploaded media is optimized on secure CDN edge clusters for instantaneous loading.',
    },
    {
        id: 'feed-3',
        category: 'content',
        q: 'How do interactive comment threads and story likes work?',
        a: 'Clicking the heart reaction on any post increments the like counter in real-time. Comments allow you to join the discussion underneath stories with live timestamps and author badges.',
    },
    {
        id: 'feed-4',
        category: 'content',
        q: 'Can I edit or delete my published posts after sharing them?',
        a: 'Yes! Open your post detail page and click the options menu to permanently delete your post. Deleting a post immediately removes it and all associated comments from global feeds.',
    },

    // 4. Privacy & Security (7 Guides)
    {
        id: 'priv-1',
        category: 'privacy',
        q: 'Does Zephyra track my browsing activity across other websites?',
        a: 'No. We have a strict Zero-Tracker Pledge. Zephyra has zero third-party advertising tracking pixels, zero data broker integrations, and zero behavioral telemetry. Browser local storage is used solely for session authentication tokens and your chosen theme preference.',
    },
    {
        id: 'priv-2',
        category: 'privacy',
        q: 'How do I manage local storage keys and browser cookies?',
        a: 'Visit our Cookie & Storage Preferences page at /cookies where you can view our complete storage key matrix, toggle functional cache preferences, or clear your session data with one click.',
    },
    {
        id: 'priv-3',
        category: 'privacy',
        q: 'How do I permanently delete my account and purge all data?',
        a: 'Go to Settings > Account and navigate to the Danger Zone section. Confirming account deletion permanently wipes your profile, published stories, comments, and direct message records from our primary database.',
    },
    {
        id: 'priv-4',
        category: 'privacy',
        q: 'How are passwords and authentication tokens secured?',
        a: 'Passwords are cryptographically hashed using bcrypt with 10 salt rounds before being written to the database. Authenticated requests use signed JSON Web Tokens (JWT) transmitted over secure TLS 1.3 channels.',
    },
    {
        id: 'priv-5',
        category: 'privacy',
        q: 'Can administrators read my private direct messages?',
        a: 'No. Our database access policies isolate conversation queries strictly to authorized participants. Private conversations are never surfaced in the public admin control panel.',
    },
    {
        id: 'priv-6',
        category: 'privacy',
        q: 'How do I request an export of all my personal data?',
        a: 'You can submit a data export request through Settings or by emailing privacy@zephyra.app. We deliver a complete JSON archive of your account records within 48 business hours.',
    },
    {
        id: 'priv-7',
        category: 'privacy',
        q: 'Where is my media hosted and is it encrypted at rest?',
        a: 'Images and media assets are hosted on encrypted Cloudinary CDN buckets with HTTPS TLS delivery, while database records are stored on dedicated MongoDB Atlas clusters with AES-256 encryption at rest.',
    },

    // 5. Trust & Moderation (3 Guides)
    {
        id: 'safe-1',
        category: 'safety',
        q: 'How do I report abuse, harassment, or spam?',
        a: 'Click the three dots (...) menu on any post or comment to submit an instant report to our moderation team. You can also visit our Contact Support page to submit a direct safety ticket. Reports are reviewed promptly by human administrators.',
    },
    {
        id: 'safe-2',
        category: 'safety',
        q: 'What happens when an account is suspended or banned?',
        a: 'Accounts that violate Community Guidelines receive a transparent notification specifying the suspension reason. Suspended users cannot post, comment, or send messages until their appeal is resolved.',
    },
    {
        id: 'safe-3',
        category: 'safety',
        q: 'How do I appeal a moderation decision or account warning?',
        a: 'If you believe your post or account was moderated in error, submit an appeal through our Contact Us page (Category: Account & Login Help) with your username and reference details.',
    },
];

export default function Support() {
    const [inputText, setInputText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [openIndex, setOpenIndex] = useState(null);

    const faqSectionRef = useRef(null);

    // Calculate dynamic guide count for each category
    const getCategoryCount = (catId) => {
        if (catId === 'all') return FAQS.length;
        return FAQS.filter((f) => f.category === catId).length;
    };

    const scrollToResults = () => {
        setTimeout(() => {
            if (faqSectionRef.current) {
                const navOffset = 80;
                const elementPosition = faqSectionRef.current.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth',
                });
            }
        }, 50);
    };

    // User submits search via Search button or Enter key
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault();
        const trimmed = inputText.trim();
        setSearchQuery(trimmed);
        if (trimmed.length > 0 && selectedCategory !== 'all') {
            setSelectedCategory('all');
        }
        scrollToResults();
    };

    const handleClearSearch = () => {
        setInputText('');
        setSearchQuery('');
        setSelectedCategory('all');
        setOpenIndex(null);
    };

    const handleCategorySelect = (catId) => {
        setSelectedCategory(catId);
        setInputText('');
        setSearchQuery('');
        setOpenIndex(null);
        scrollToResults();
    };

    const filteredFaqs = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return FAQS.filter((faq) => {
            const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
            if (!query) return matchesCategory;

            // Search matches question, answer, or category
            const matchesQ = faq.q.toLowerCase().includes(query);
            const matchesA = faq.a.toLowerCase().includes(query);
            const matchesCat = faq.category.toLowerCase().includes(query);

            return matchesCategory && (matchesQ || matchesA || matchesCat);
        });
    }, [searchQuery, selectedCategory]);

    // Automatically expand the first item when a search is executed
    useEffect(() => {
        if (searchQuery.trim().length > 0 && filteredFaqs.length > 0) {
            setOpenIndex(0);
        }
    }, [searchQuery, filteredFaqs.length]);

    const toggleFaq = (idx) => {
        setOpenIndex(openIndex === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0E1116] text-[#101828] dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero Search Section */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/35 text-xs font-black uppercase tracking-widest shadow-xs">
                        Help Center & Knowledge Hub
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#101828] dark:text-white">
                        How can we assist you?
                    </h1>
                    <p className="text-base sm:text-xl text-[#475467] dark:text-[#9DA3B4] leading-relaxed font-medium">
                        Search our knowledge base for guides on real-time messaging, privacy controls, and account management.
                    </p>

                    {/* Interactive Search Bar Form with Search Button */}
                    <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto pt-2">
                        <div className="relative flex items-center bg-white dark:bg-[#181C26] rounded-2xl border border-[#EAECF0] dark:border-[#252A36] shadow-xs p-1.5 focus-within:ring-2 focus-within:ring-[#FF8F6B]/50 transition-all">
                            <HiOutlineMagnifyingGlass className="ml-3 text-[#B85323] text-xl pointer-events-none shrink-0" />
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Search questions, password, messaging, privacy, delete..."
                                className="w-full bg-transparent px-3 py-3 text-sm text-[#101828] dark:text-white placeholder-[#667085] dark:placeholder-gray-400 focus:outline-none font-medium"
                            />
                            {inputText && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="px-2.5 py-1.5 text-xs font-bold text-[#667085] hover:text-[#101828] dark:hover:text-white cursor-pointer mr-1.5 rounded-lg hover:bg-[#F2F4F7] dark:hover:bg-[#202532] transition-colors shrink-0"
                                >
                                    Clear
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-xs sm:text-sm hover:scale-105 transition-all shadow-xs shrink-0 cursor-pointer"
                            >
                                <HiOutlineMagnifyingGlass className="text-base" />
                                <span>Search</span>
                            </button>
                        </div>
                        {searchQuery && (
                            <p className="text-xs text-left text-gray-500 dark:text-gray-400 mt-2 px-2">
                                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for "{searchQuery}"
                            </p>
                        )}
                    </form>

                    {/* System Live Status Pill (Green Dot Removed) */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                        <span className="flex items-center gap-1.5">
                            <HiOutlineSignal />
                            <span>All Systems Operational</span>
                            <span className="text-emerald-600/70 dark:text-emerald-400/70 font-normal">• WebSocket Clusters Online (&lt; 15ms)</span>
                        </span>
                    </div>
                </div>

                {/* Top Category Glass Cards with High-Contrast Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {HELP_CARDS.map((card) => {
                        const Icon = card.icon;
                        const isSelected = selectedCategory === card.category;
                        const count = getCategoryCount(card.category);
                        return (
                            <div
                                key={card.title}
                                onClick={() => handleCategorySelect(card.category)}
                                className={`p-5 rounded-3xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between gap-4 ${
                                    isSelected
                                        ? 'bg-[#FFF6F3] dark:bg-[#1E2638] border-[#FF8F6B] dark:border-[#FF8F6B] ring-2 ring-[#FF8F6B]/40 shadow-lg scale-[1.02]'
                                        : 'bg-white dark:bg-[#161B26] border-gray-200 dark:border-[#2D3748] hover:border-[#FF8F6B]/60 dark:hover:border-[#FF8F6B]/60 shadow-sm'
                                }`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span
                                            className={`p-3 rounded-2xl text-xl inline-flex items-center justify-center transition-all ${
                                                isSelected
                                                    ? 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-md ring-2 ring-[#FF8F6B]/40'
                                                    : 'bg-[#FF8F6B]/15 text-[#C2410C] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-[#FF8F6B]/30'
                                            }`}
                                        >
                                            <Icon className="stroke-[2.2]" />
                                        </span>
                                        <span
                                            className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                isSelected
                                                    ? 'bg-[#FF8F6B] text-[#1A140D]'
                                                    : 'bg-gray-100 dark:bg-[#202736] text-[#C2410C] dark:text-[#F5C36B]'
                                            }`}
                                        >
                                            {count} {count === 1 ? 'Guide' : 'Guides'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-['Fraunces'] font-bold text-sm sm:text-base text-[#0F172A] dark:text-white">
                                            {card.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 dark:text-[#94A3B8] leading-relaxed font-medium mt-1">
                                            {card.desc}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#C2410C] dark:text-[#F5C36B] flex items-center gap-1">
                                    <span>Explore Guides</span>
                                    <span>→</span>
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Filterable FAQ Section / Search Results */}
                <div ref={faqSectionRef} id="faq-results" className="space-y-6 pt-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-[#101828] dark:text-white">
                                {searchQuery ? `Search Results for "${searchQuery}"` : 'Frequently Asked Questions'}
                            </h2>
                            <p className="text-xs sm:text-sm text-[#475467] dark:text-[#8A8F9C] mt-1 font-medium">
                                Showing {filteredFaqs.length} {filteredFaqs.length === 1 ? 'question' : 'questions'}
                            </p>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar whitespace-nowrap shrink-0 max-w-full sm:flex-wrap">
                            {CATEGORIES.map((cat) => {
                                const catCount = getCategoryCount(cat.id);
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.id)}
                                        className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 whitespace-nowrap ${
                                            selectedCategory === cat.id
                                                ? 'bg-[#101828] text-white dark:bg-white dark:text-[#1A140D] shadow-sm scale-[1.02]'
                                                : 'bg-white dark:bg-[#181C26] border border-[#EAECF0] dark:border-[#252A36] text-[#344054] dark:text-[#A0A5B2] hover:bg-[#F2F4F7]'
                                        }`}
                                    >
                                        <span>{cat.label}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${selectedCategory === cat.id ? 'bg-white/20 text-white dark:bg-[#1A140D]/20 dark:text-[#1A140D]' : 'bg-[#F2F4F7] dark:bg-[#202532] text-[#475467]'}`}>
                                            {catCount}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Accordion FAQ List */}
                    <div className="space-y-3.5">
                        {filteredFaqs.length === 0 ? (
                            <div className="p-12 text-center rounded-3xl border border-[#EAECF0] dark:border-[#1F232C] bg-white dark:bg-[#12151C] space-y-3">
                                <p className="text-sm font-bold text-[#101828] dark:text-gray-300">
                                    No questions found matching "{searchQuery}"
                                </p>
                                <p className="text-xs text-[#667085] dark:text-[#8A8F9C]">
                                    Try searching for different keywords or click "All Topics" above.
                                </p>
                                <button
                                    onClick={handleClearSearch}
                                    className="px-4 py-2 rounded-full bg-[#D97B4F] text-[#1A140D] font-extrabold text-xs hover:brightness-105 transition-all cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            filteredFaqs.map((faq, idx) => {
                                const isOpen = openIndex === idx;
                                return (
                                    <div
                                        key={faq.id || faq.q}
                                        className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
                                            isOpen
                                                ? 'border-[#FF8F6B] dark:border-[#FF8F6B] bg-[#FFF7F4] dark:bg-[#1B2232] ring-2 ring-[#FF8F6B]/30 shadow-md'
                                                : 'border-gray-200 dark:border-[#252E42] bg-white dark:bg-[#141824] hover:border-[#FF8F6B]/50'
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleFaq(idx)}
                                            className={`w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-bold text-sm sm:text-base transition-colors cursor-pointer ${
                                                isOpen
                                                    ? 'text-[#C2410C] dark:text-[#F5C36B]'
                                                    : 'text-[#0F172A] dark:text-white hover:text-[#FF8F6B] dark:hover:text-[#FF8F6B]'
                                            }`}
                                        >
                                            <span className="font-['Fraunces'] text-base sm:text-lg flex items-center gap-3">
                                                <span className={`h-2 w-2 rounded-full shrink-0 ${isOpen ? 'bg-[#FF8F6B] animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`} />
                                                <span>{faq.q}</span>
                                            </span>
                                            <span
                                                className={`p-2 rounded-xl text-sm shrink-0 transition-all ${
                                                    isOpen
                                                        ? 'bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] shadow-xs'
                                                        : 'bg-gray-100 dark:bg-[#1E2638] text-gray-500 dark:text-gray-400'
                                                }`}
                                            >
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
                                                    <div className="px-6 sm:px-7 pb-6 text-xs sm:text-sm text-gray-700 dark:text-[#CBD5E1] leading-relaxed border-t border-[#FF8F6B]/20 dark:border-[#2D3748] pt-4 font-medium">
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
                <div className="rounded-3xl border border-[#EAECF0] dark:border-[#FF8F6B]/30 bg-gradient-to-r from-[#F8F9FA] via-white to-[#F2F4F7] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="font-['Fraunces'] text-2xl font-bold text-[#101828] dark:text-white">
                            Cannot find what you are looking for?
                        </h3>
                        <p className="text-xs sm:text-sm text-[#475467] dark:text-[#9DA3B4] max-w-md font-medium">
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
