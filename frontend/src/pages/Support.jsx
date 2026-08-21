import { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQS = [
    {
        q: 'How do I start a direct chat with someone on Zephyra?',
        a: 'Navigate to any user’s profile or search for them in the Search directory, then click the "Message" button. You can also head straight to the Messages page and search by username to open a conversation.',
    },
    {
        q: 'Are my direct messages private and real-time?',
        a: 'Yes! Messages are delivered with sub-second latency using WebSockets. Only you and the recipient can access your private message thread.',
    },
    {
        q: 'How do I customize my profile picture and banner?',
        a: 'Click on your profile avatar in the navigation bar, choose "Profile", and click "Edit Profile". From there, you can upload a new avatar image, banner photo, and customize your bio.',
    },
    {
        q: 'How do I report spam, abuse, or guideline violations?',
        a: 'Click the three dots (•••) on any post to report it, or visit our Contact Support page to flag a user directly to our moderation team.',
    },
    {
        q: 'Can I switch between Light and Dark mode?',
        a: 'Yes! Simply click the Sun / Moon toggle button in the top navigation bar at any time to switch between high-contrast Dark mode and serene Light mode.',
    },
    {
        q: 'How do I permanently delete my account?',
        a: 'Go to Settings > Account and scroll to the bottom Danger Zone where you can request permanent deletion of your account and all associated data.',
    },
];

export default function Support() {
    const [search, setSearch] = useState('');
    const [openIndex, setOpenIndex] = useState(null);

    const filteredFaqs = FAQS.filter(
        (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Help & Support Center
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        How can we help you?
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-[#9DA3B4] max-w-xl mx-auto">
                        Find quick answers, platform guides, and direct assistance for your Zephyra account.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative pt-4">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search questions, settings, messaging..."
                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-white dark:bg-[#181C26] px-4 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 shadow-xs"
                        />
                        <span className="absolute left-4 top-7 text-gray-400 text-sm">🔍</span>
                    </div>
                </div>

                {/* FAQ List */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-6 sm:p-10 shadow-sm backdrop-blur-xl space-y-4">
                    <h2 className="font-['Fraunces'] text-2xl font-bold mb-4">Frequently Asked Questions</h2>

                    {filteredFaqs.length === 0 ? (
                        <p className="text-center text-sm text-gray-500 py-8">No results found for "{search}". Try another keyword or reach out to us directly.</p>
                    ) : (
                        filteredFaqs.map((faq, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div key={faq.q} className="rounded-2xl border border-gray-100 dark:border-[#1F232C] bg-gray-50/50 dark:bg-[#181C26]/50 overflow-hidden transition-all">
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 font-bold text-sm text-gray-900 dark:text-white cursor-pointer hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <span className="text-xs text-gray-400 transition-transform">{isOpen ? '▲' : '▼'}</span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-4 text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] leading-relaxed border-t border-gray-100 dark:border-[#1F232C] pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Contact Banner */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2 text-center sm:text-left">
                        <h3 className="font-['Fraunces'] text-xl font-bold">Still need help?</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C]">
                            Our community support team is available 24/7 to help you resolve any issues.
                        </p>
                    </div>
                    <Link
                        to="/contact"
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] text-xs sm:text-sm font-extrabold hover:scale-105 transition-all shadow-sm shrink-0"
                    >
                        Contact Support Team →
                    </Link>
                </div>
            </div>
        </div>
    );
}
