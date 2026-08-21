import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest">
                        Legal Framework & User Agreement
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        Last Updated: August 2026 - Version 2.4.0 - Please review your rights and responsibilities on Zephyra.
                    </p>
                </div>

                {/* Key Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineScale />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">You Own Your Content</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            You retain 100% intellectual property rights over all stories, art, and posts you share.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineShieldExclamation />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">A Respectful Sanctuary</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            Zero tolerance for harassment, automated spam bots, deceptive impersonation, or illegal activity.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineUserCircle />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Total Account Autonomy</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            You can export your complete history or permanently delete your account at any moment.
                        </p>
                    </div>
                </div>

                {/* Main Content Layout with Sticky Sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Table of Contents Sidebar */}
                    <div className="hidden lg:block sticky top-24 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-5 shadow-xs backdrop-blur-xl space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-3 px-2">
                            Terms Navigation
                        </span>
                        {SECTIONS.map((sec) => {
                            const isCurrent = activeSection === sec.id;
                            return (
                                <button
                                    key={sec.id}
                                    onClick={() => scrollToSection(sec.id)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                                        isCurrent
                                            ? 'bg-gradient-to-r from-[#FF8F6B]/15 to-[#F5C36B]/15 text-[#D97B4F] dark:text-[#F5C36B] font-bold shadow-xs'
                                            : 'text-gray-600 dark:text-[#A0A5B2] hover:bg-gray-50 dark:hover:bg-[#181C26]'
                                    }`}
                                >
                                    <span className="truncate">{sec.title}</span>
                                    {isCurrent && <HiOutlineChevronRight className="shrink-0 text-xs" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Detailed Legal Content */}
                    <div className="lg:col-span-3 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-8 sm:p-12 shadow-sm backdrop-blur-xl space-y-12 leading-relaxed text-gray-700 dark:text-[#C5C9D3] text-sm sm:text-base">

                        {/* 1. Agreement */}
                        <section id="agreement" className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineDocumentText />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    1. Agreement & Acceptance of Terms
                                </h2>
                            </div>
                            <p>
                                Welcome to Zephyra. These Terms of Service constitute a legally binding agreement between you and Zephyra concerning your access to and use of our web platform, APIs, direct messaging systems, and community feeds.
                            </p>
                            <p>
                                By creating an account or accessing any part of Zephyra, you confirm that you have read, understood, and agree to be bound by these Terms and our{' '}
                                <Link to="/privacy" className="text-[#D97B4F] dark:text-[#F5C36B] font-bold hover:underline">
                                    Privacy Policy
                                </Link>.
                            </p>
                        </section>

                        {/* 2. Eligibility */}
                        <section id="eligibility" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineUserCircle />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    2. Eligibility & Account Security
                                </h2>
                            </div>
                            <p>
                                To use Zephyra, you must be at least 13 years of age (or the minimum legal age required in your country).
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                                <li><strong>Credential Confidentiality:</strong> You are solely responsible for maintaining the confidentiality of your login credentials and password.</li>
                                <li><strong>Accurate Information:</strong> You agree to provide an authentic email address during registration to receive critical account security alerts.</li>
                                <li><strong>One Identity:</strong> Automated batch creation of fake accounts or puppet accounts is strictly prohibited.</li>
                            </ul>
                        </section>

                        {/* 3. Acceptable Use */}
                        <section id="conduct" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineNoSymbol />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    3. Acceptable Use & Conduct Standards
                                </h2>
                            </div>
                            <p>
                                Zephyra is committed to fostering authentic dialogue and creative sharing. You agree not to engage in any of the following prohibited behaviors:
                            </p>
                            <div className="space-y-3">
                                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 space-y-1 text-xs sm:text-sm">
                                    <h4 className="font-bold text-rose-800 dark:text-rose-300">Harassment, Abuse & Hate Speech</h4>
                                    <p className="text-gray-600 dark:text-[#A0A5B2]">
                                        Attacking, threatening, doxxing, or discriminating against individuals based on race, ethnicity, nationality, religion, sexual orientation, gender, or disability.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 space-y-1 text-xs sm:text-sm">
                                    <h4 className="font-bold text-rose-800 dark:text-rose-300">Spam, Automated Bots & Scraping</h4>
                                    <p className="text-gray-600 dark:text-[#A0A5B2]">
                                        Deploying automated scrapers, repetitive bulk message bots, unsolicited advertising schemes, or unauthorized API querying tools.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 space-y-1 text-xs sm:text-sm">
                                    <h4 className="font-bold text-rose-800 dark:text-rose-300">Impersonation & Deceptive Media</h4>
                                    <p className="text-gray-600 dark:text-[#A0A5B2]">
                                        Pretending to be another creator, brand, or administrator, or distributing deliberately manipulated media to defraud community members.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4. Content Ownership */}
                        <section id="ownership" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineScale />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    4. Content Ownership & License
                                </h2>
                            </div>
                            <p>
                                <strong>You retain 100% intellectual property ownership</strong> of the original text, photos, illustrations, and media you post on Zephyra.
                            </p>
                            <p>
                                By posting content on public feeds, you grant Zephyra a worldwide, non-exclusive, royalty-free license solely to host, store, cache, format, and display your content to other users in accordance with your chosen privacy settings. This license terminates immediately upon your deletion of the post or account.
                            </p>
                        </section>

                        {/* 5. Real-Time Messaging */}
                        <section id="messaging" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineChatBubbleLeftRight />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    5. Real-Time Messaging & Direct Chats
                                </h2>
                            </div>
                            <p>
                                Direct messaging channels are intended for private, authentic conversation between members:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                                <li>You may not use direct messaging to transmit unsolicited commercial offers or harassment.</li>
                                <li>You are solely responsible for interactions with other users. Zephyra provides tools to block or report malicious members.</li>
                            </ul>
                        </section>

                        {/* 6. Moderation & Enforcement */}
                        <section id="moderation" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineShieldExclamation />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    6. Moderation, Enforcement & Bans
                                </h2>
                            </div>
                            <p>
                                To preserve the tranquil character of our platform, Zephyra's administration and moderation team reserve the right to:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                                <li>Remove or hide any content that violates these Terms or our Community Guidelines.</li>
                                <li>Issue temporary suspensions or permanent account bans for severe or repeated infractions.</li>
                                <li>Provide transparent suspension rationales directly to affected accounts upon review.</li>
                            </ul>
                        </section>

                        {/* 7. Liability & Disclaimers */}
                        <section id="liability" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineDocumentText />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    7. Disclaimers & Limitation of Liability
                                </h2>
                            </div>
                            <p>
                                Zephyra is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. While we strive for continuous sub-15ms real-time uptime, we do not warrant that services will always be uninterrupted, error-free, or entirely bug-free during maintenance windows.
                            </p>
                        </section>

                        {/* 8. Termination */}
                        <section id="termination" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineUserCircle />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    8. Account Termination & Data Deletion
                                </h2>
                            </div>
                            <p>
                                You may close and delete your Zephyra account at any time through your Profile Settings. Upon deletion, all your posted stories, direct messages, media, and profile metadata are permanently wiped from our active databases.
                            </p>
                        </section>

                        {/* 9. Contact */}
                        <section id="contact" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineEnvelope />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    9. Legal Notices & Contact
                                </h2>
                            </div>
                            <p>
                                For questions, legal notices, or copyright inquiries (DMCA), please contact our legal team:
                            </p>
                            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-2">
                                <p className="font-bold text-gray-900 dark:text-white">Zephyra Legal & Compliance Department</p>
                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Direct Inquiries:</p>
                                <a href="mailto:legal@zephyra.app" className="text-sm font-bold text-[#D97B4F] dark:text-[#F5C36B] hover:underline block">
                                    legal@zephyra.app
                                </a>
                                <p className="text-xs text-gray-400">Response time: Within 24-48 business hours.</p>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="rounded-3xl border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-gradient-to-r from-[#FFF5EF] via-white to-[#FAF0E6] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-sm text-center space-y-4">
                    <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold">Ready to share your voice?</h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] max-w-lg mx-auto">
                        Join a community dedicated to mindful, genuine expression.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full hover:scale-105 transition-all shadow-sm"
                        >
                            Get Started on Zephyra
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
