import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlineEyeSlash,
    HiOutlineDocumentText,
    HiOutlineTrash,
    HiOutlineArrowDownTray,
    HiOutlineGlobeAlt,
    HiOutlineServer,
    HiOutlineEnvelope,
    HiOutlineCheck,
    HiOutlineChevronRight,
} from 'react-icons/hi2';
import { FiFeather, FiWind } from 'react-icons/fi';

const SECTIONS = [
    { id: 'pledge', title: '1. Executive Summary & Zero-Tracker Pledge' },
    { id: 'collection', title: '2. Information We Collect & Why' },
    { id: 'messaging', title: '3. Direct Messaging & Real-Time Privacy' },
    { id: 'non-commercial', title: '4. Non-Commercialization Guarantee' },
    { id: 'infrastructure', title: '5. Storage, Cloud & Encryption Standards' },
    { id: 'retention', title: '6. Data Retention & Automatic Purging' },
    { id: 'rights', title: '7. Your Rights (GDPR, CCPA & Global)' },
    { id: 'cookies', title: '8. Local Storage & Minimal Cookies' },
    { id: 'contact', title: '9. Data Protection Officer Contact' },
];

export default function Privacy() {
    const [activeSection, setActiveSection] = useState('pledge');

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
                        Trust, Transparency & Safety
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Privacy Policy & Data Covenant
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        Last Updated: August 2026 - Version 2.4.0 - Effective for all registered and visiting members globally.
                    </p>
                </div>

                {/* Core Privacy Highlights Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineEyeSlash />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">No Behavioral Tracking</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            We never install cross-site advertising pixels or track your reading habits across the web.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineLockClosed />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Cryptographic Security</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            All passwords use 10-round salted bcrypt hashes, and socket streams communicate over TLS/WSS.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs space-y-3">
                        <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                            <HiOutlineTrash />
                        </div>
                        <h3 className="font-['Fraunces'] font-bold text-lg">True Right to Erasure</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            When you delete a post or account, it is permanently purged from our primary database immediately.
                        </p>
                    </div>
                </div>

                {/* Main Content Layout with Sticky Navigation */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* Table of Contents Sidebar */}
                    <div className="hidden lg:block sticky top-24 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-5 shadow-xs backdrop-blur-xl space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-3 px-2">
                            Policy Navigation
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

                        {/* 1. Executive Summary */}
                        <section id="pledge" className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineShieldCheck />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    1. Executive Summary & Zero-Tracker Pledge
                                </h2>
                            </div>
                            <p>
                                At Zephyra, privacy is not a compliance checkbox - it is the architectural foundation of our entire social platform. We created Zephyra as an intentional alternative to conventional ad-funded networks that monetize human attention, emotional volatility, and personal communication.
                            </p>
                            <p>
                                <strong>Our Core Pledge:</strong> We will never sell, rent, monetize, or trade your personal data, profile insights, reading habits, or message history to any advertising network, third-party broker, or commercial AI training consortium.
                            </p>
                        </section>

                        {/* 2. Collection Breakdown */}
                        <section id="collection" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineDocumentText />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    2. Information We Collect & Why
                                </h2>
                            </div>
                            <p>
                                We collect only the minimum data strictly required to deliver a responsive, real-time social networking experience:
                            </p>
                            <div className="space-y-3">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Account & Identity Information</h3>
                                    <p className="text-xs text-gray-600 dark:text-[#9DA3B4]">
                                        Your chosen display name, unique username, email address, and cryptographically salted password hash. We use this to authenticate your sessions and ensure account security.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Content, Media & Interactions</h3>
                                    <p className="text-xs text-gray-600 dark:text-[#9DA3B4]">
                                        Stories you publish, photos you upload, comments you post, and reactions you give. These are stored on our encrypted clusters to display in the chronological timeline.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Technical Diagnostics</h3>
                                    <p className="text-xs text-gray-600 dark:text-[#9DA3B4]">
                                        IP address, user-agent string, and server error logs maintained for up to 14 days solely for rate-limiting, denial-of-service prevention, and bot mitigation.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 3. Direct Messaging Privacy */}
                        <section id="messaging" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineLockClosed />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    3. Direct Messaging & Real-Time Privacy
                                </h2>
                            </div>
                            <p>
                                Private conversations between members are transmitted using secure WebSocket connections (WSS) over encrypted TLS channels.
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                                <li><strong>Isolation:</strong> Only authenticated participants in a conversation thread have cryptographic query permissions to retrieve or read message histories.</li>
                                <li><strong>Zero Content Scanning:</strong> We do not parse or scan the text of private messages for ad targeting, interest profiling, or keyword mining.</li>
                                <li><strong>Seen Receipts:</strong> Real-time status indicators (Sent and Seen) are exchanged strictly between the conversation participants.</li>
                            </ul>
                        </section>

                        {/* 4. Non-Commercialization Guarantee */}
                        <section id="non-commercial" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineEyeSlash />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    4. Non-Commercialization Guarantee
                                </h2>
                            </div>
                            <p>
                                Unlike traditional social media monopolies, Zephyra's economic model does not rely on surveillance capitalism:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
                                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider">What We Guarantee</h4>
                                    <p className="text-xs text-stone-600 dark:text-[#A0A5B2]">
                                        - 0 third-party advertising SDKs<br />
                                        - 0 data broker syndication<br />
                                        - 0 behavioral profiling algorithms
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-1">
                                    <h4 className="font-bold text-rose-800 dark:text-rose-300 text-xs uppercase tracking-wider">What We Never Do</h4>
                                    <p className="text-xs text-gray-600 dark:text-[#A0A5B2]">
                                        - Sell your email or reading trends<br />
                                        - Share message logs with advertisers<br />
                                        - Feed private drafts to public AI models
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 5. Storage & Encryption */}
                        <section id="infrastructure" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineServer />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    5. Storage, Cloud & Encryption Standards
                                </h2>
                            </div>
                            <p>
                                We partner with leading cloud infrastructure providers that maintain strict SOC 2, ISO 27001, and GDPR compliance certifications:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                                <li><strong>Database Layer:</strong> High-availability MongoDB Atlas clusters featuring AES-256 encryption at rest and isolated network VPC peering.</li>
                                <li><strong>Media Storage:</strong> Cloudinary secure CDN storage with optimized delivery and signed access tokens.</li>
                                <li><strong>In-Transit Protection:</strong> End-to-end TLS 1.3 encryption across all HTTP REST endpoints and WebSocket channels.</li>
                            </ul>
                        </section>

                        {/* 6. Data Retention */}
                        <section id="retention" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineTrash />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    6. Data Retention & Automatic Purging
                                </h2>
                            </div>
                            <p>
                                We maintain data only for as long as your account remains active or until you explicitly delete specific content:
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border border-gray-200 dark:border-[#252A36] rounded-2xl overflow-hidden">
                                    <thead className="bg-gray-50 dark:bg-[#181C26] text-gray-700 dark:text-gray-300 font-bold">
                                        <tr>
                                            <th className="p-3">Data Category</th>
                                            <th className="p-3">Retention Period</th>
                                            <th className="p-3">Deletion Mechanism</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-[#252A36]">
                                        <tr>
                                            <td className="p-3 font-semibold text-gray-900 dark:text-white">User Profile & Account</td>
                                            <td className="p-3">Until Account Deletion</td>
                                            <td className="p-3">Instant purge via Settings</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-gray-900 dark:text-white">Published Stories & Posts</td>
                                            <td className="p-3">Until User Deletion</td>
                                            <td className="p-3">Immediate hard-delete</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-gray-900 dark:text-white">Direct Message History</td>
                                            <td className="p-3">Until Thread Deletion</td>
                                            <td className="p-3">Cascade delete on request</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 font-semibold text-gray-900 dark:text-white">Server Diagnostic Logs</td>
                                            <td className="p-3">14 Days Maximum</td>
                                            <td className="p-3">Automated cron rollover</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 7. User Rights */}
                        <section id="rights" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineGlobeAlt />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    7. Your Rights (GDPR, CCPA & Global Protections)
                                </h2>
                            </div>
                            <p>
                                Regardless of your physical country or legal jurisdiction, Zephyra grants all registered members global data sovereignty rights:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                        <HiOutlineArrowDownTray className="text-[#D97B4F]" /> Right to Access & Export
                                    </h4>
                                    <p className="text-gray-600 dark:text-[#9DA3B4]">
                                        Request a complete JSON archive of all your posts, interactions, profile metadata, and followers.
                                    </p>
                                </div>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-1">
                                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                                        <HiOutlineTrash className="text-rose-500" /> Right to Total Erasure
                                    </h4>
                                    <p className="text-gray-600 dark:text-[#9DA3B4]">
                                        Permanently erase your identity, media assets, direct chats, and comments with zero residual traces.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 8. Cookies */}
                        <section id="cookies" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineShieldCheck />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    8. Local Storage & Minimal Cookies
                                </h2>
                            </div>
                            <p>
                                We do not use third-party marketing or profiling cookies. We use minimal browser Local Storage solely for:
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
                                <li><strong>`zephyra_token`:</strong> Secure JSON Web Token (JWT) used to keep your authenticated session active.</li>
                                <li><strong>`zephyra_theme`:</strong> Remembers your preferred interface appearance (Obsidian Dark vs Warm Terracotta Light).</li>
                            </ul>
                            <p className="pt-2">
                                You can configure or clear your cookie preferences at any time on our{' '}
                                <Link to="/cookies" className="text-[#D97B4F] dark:text-[#F5C36B] font-bold hover:underline">
                                    Cookie Preferences Page
                                </Link>.
                            </p>
                        </section>

                        {/* 9. Contact */}
                        <section id="contact" className="space-y-4 pt-8 border-t border-gray-100 dark:border-[#1F232C]">
                            <div className="flex items-center gap-3">
                                <span className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-lg">
                                    <HiOutlineEnvelope />
                                </span>
                                <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                    9. Data Protection Officer Contact
                                </h2>
                            </div>
                            <p>
                                If you have questions about our privacy practices, wish to submit a data subject access request, or have compliance inquiries, please contact our Data Governance team:
                            </p>
                            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] space-y-2">
                                <p className="font-bold text-gray-900 dark:text-white">Zephyra Privacy & Data Protection Office</p>
                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Direct Privacy Inquiries:</p>
                                <a href="mailto:privacy@zephyra.app" className="text-sm font-bold text-[#D97B4F] dark:text-[#F5C36B] hover:underline block">
                                    privacy@zephyra.app
                                </a>
                                <p className="text-xs text-gray-400">Response time: Within 24 business hours.</p>
                            </div>
                        </section>

                    </div>
                </div>

                {/* Bottom Call to Action */}
                <div className="rounded-3xl border border-[#D97B4F]/30 dark:border-[#FF8F6B]/30 bg-gradient-to-r from-[#FFF5EF] via-white to-[#FAF0E6] dark:from-[#181C26] dark:via-[#12151C] dark:to-[#181C26] p-8 sm:p-12 shadow-sm text-center space-y-4">
                    <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold">Your privacy is guaranteed by design</h2>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] max-w-lg mx-auto">
                        Enjoy genuine conversations, serene chronological feeds, and total peace of mind.
                    </p>
                    <div className="pt-2">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full hover:scale-105 transition-all shadow-sm"
                        >
                            Create Your Private Account
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
