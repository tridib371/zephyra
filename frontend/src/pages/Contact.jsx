import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineEnvelope,
    HiOutlineBolt,
    HiOutlinePaperAirplane,
    HiOutlineCheckCircle,
    HiOutlineShieldCheck,
    HiOutlineScale,
    HiOutlineChatBubbleLeftRight,
    HiOutlineBugAnt,
    HiOutlineLightBulb,
    HiOutlineExclamationTriangle,
    HiOutlineArrowPath,
    HiOutlineQuestionMarkCircle,
    HiOutlineChevronDown,
    HiOutlineChevronUp,
} from 'react-icons/hi2';

const CATEGORIES = [
    { id: 'account', label: 'Account & Login', icon: HiOutlineChatBubbleLeftRight, desc: 'Passwords, handle claims, authentication issues' },
    { id: 'messaging', label: 'Real-Time Messaging', icon: HiOutlineBolt, desc: 'WebSocket chats, delivery checks, audio notifications' },
    { id: 'bug', label: 'Report a Bug', icon: HiOutlineBugAnt, desc: 'Technical glitches, UI render bugs, or network errors' },
    { id: 'feedback', label: 'Feature Request', icon: HiOutlineLightBulb, desc: 'Share ideas to improve Zephyra’s creator experience' },
    { id: 'safety', label: 'Safety & Trust', icon: HiOutlineShieldCheck, desc: 'Harassment reports, guideline appeals, or privacy issues' },
];

const CONTACT_CHANNELS = [
    {
        title: 'General Support & Help',
        email: 'support@zephyra.app',
        desc: 'Questions regarding your account, features, or technical issues.',
        responseTime: '< 2 Hours',
        icon: HiOutlineEnvelope,
    },
    {
        title: 'Trust, Safety & Privacy',
        email: 'privacy@zephyra.app',
        desc: 'Data export requests, account deletion, or safety reports.',
        responseTime: '< 24 Hours',
        icon: HiOutlineShieldCheck,
    },
    {
        title: 'Legal & DMCA Inquiries',
        email: 'legal@zephyra.app',
        desc: 'Copyright notices, compliance filings, or official terms requests.',
        responseTime: '< 48 Hours',
        icon: HiOutlineScale,
    },
];

const QUICK_FAQS = [
    {
        q: 'How quickly will I hear back from support?',
        a: 'Our human support team actively monitors tickets 7 days a week. Most general inquiries receive a response within 2 hours.',
    },
    {
        q: 'Where do I find my account ID when requesting help?',
        a: 'Your unique @username displayed on your profile is all our team needs to locate your account.',
    },
    {
        q: 'Can I report security vulnerabilities confidentially?',
        a: 'Yes! Please email security disclosures to privacy@zephyra.app with steps to reproduce. We honor responsible disclosure.',
    },
];

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('account');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [urgency, setUrgency] = useState('normal');
    const [submitted, setSubmitted] = useState(false);
    const [ticketId, setTicketId] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [faqOpenIdx, setFaqOpenIdx] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);

        setTimeout(() => {
            const randomId = 'ZEP-' + Math.floor(100000 + Math.random() * 900000);
            setTicketId(randomId);
            setSubmitting(false);
            setSubmitted(true);
        }, 800);
    };

    const handleResetForm = () => {
        setSubmitted(false);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setCategory('account');
        setUrgency('normal');
    };

    const toggleFaq = (idx) => {
        setFaqOpenIdx(faqOpenIdx === idx ? null : idx);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-5xl mx-auto space-y-16">

                {/* Hero Header */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest">
                        Direct Support & Assistance
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        We are here to help
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        Have a question, feedback, or need account assistance? Drop our team a message and receive prompt human support.
                    </p>

                    {/* Live Support Status Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="flex items-center gap-1.5">
                            <HiOutlineBolt />
                            <span>Support Desk Active</span>
                            <span className="text-emerald-600/70 dark:text-emerald-400/70 font-normal">• Average Response Time &lt; 2 Hours</span>
                        </span>
                    </div>
                </div>

                {/* Dedicated Communication Channels */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {CONTACT_CHANNELS.map((ch) => {
                        const Icon = ch.icon;
                        return (
                            <div
                                key={ch.title}
                                className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 shadow-xs backdrop-blur-xl flex flex-col justify-between gap-4 transition-all hover:border-[#D97B4F]/40"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xl">
                                            <Icon />
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-gray-100 dark:bg-[#181C26] text-gray-600 dark:text-gray-400 border border-gray-200/60 dark:border-[#252A36]">
                                            {ch.responseTime}
                                        </span>
                                    </div>
                                    <h3 className="font-['Fraunces'] font-bold text-base text-gray-900 dark:text-white">
                                        {ch.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                                        {ch.desc}
                                    </p>
                                </div>
                                <a
                                    href={`mailto:${ch.email}`}
                                    className="text-xs font-extrabold text-[#D97B4F] dark:text-[#F5C36B] hover:underline flex items-center gap-1"
                                >
                                    <span>{ch.email}</span>
                                    <span>→</span>
                                </a>
                            </div>
                        );
                    })}
                </div>

                {/* Main Contact Form & Sidebar Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left: Interactive Form */}
                    <div className="lg:col-span-2 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-sm backdrop-blur-xl">
                        {submitted ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-8 sm:p-12 text-center space-y-5 bg-gradient-to-b from-emerald-50/70 to-white dark:from-emerald-950/20 dark:to-[#12151C] rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300"
                            >
                                <div className="flex justify-center text-5xl text-emerald-500">
                                    <HiOutlineCheckCircle />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-3 py-1 rounded-full inline-block">
                                        Ticket Reference: #{ticketId}
                                    </span>
                                    <h3 className="font-['Fraunces'] font-bold text-2xl text-gray-900 dark:text-white">
                                        Message Dispatched!
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#A0A5B2] max-w-md mx-auto leading-relaxed">
                                        Thank you, <span className="font-bold text-gray-900 dark:text-white">{name}</span>. Our team has received your ticket and will send a confirmation and resolution to <span className="font-bold text-gray-900 dark:text-white">{email}</span>.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={handleResetForm}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 dark:border-[#2E3544] text-xs font-bold text-gray-700 dark:text-[#E7E6E3] hover:bg-gray-50 dark:hover:bg-[#181C26] transition-all cursor-pointer"
                                    >
                                        <HiOutlineArrowPath className="text-sm" />
                                        <span>Submit Another Inquiry</span>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="border-b border-gray-100 dark:border-[#1F232C] pb-4">
                                    <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                        Send a Message to Support
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-[#8A8F9C] mt-0.5">
                                        Fill in the details below and we will triage your inquiry immediately.
                                    </p>
                                </div>

                                {/* Step 1: Category Picker */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                        Select Inquiry Category
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {CATEGORIES.map((cat) => {
                                            const Icon = cat.icon;
                                            const isSelected = category === cat.id;
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'border-[#D97B4F] bg-[#FF8F6B]/10 dark:bg-[#FF8F6B]/15 shadow-xs'
                                                            : 'border-gray-200 dark:border-[#252A36] bg-gray-50/70 dark:bg-[#181C26]/70 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <span className={`p-2 rounded-xl text-base shrink-0 ${isSelected ? 'bg-[#D97B4F] text-white' : 'bg-gray-200 dark:bg-[#202532] text-gray-600 dark:text-gray-300'}`}>
                                                        <Icon />
                                                    </span>
                                                    <div className="space-y-0.5">
                                                        <p className={`text-xs font-bold ${isSelected ? 'text-[#D97B4F] dark:text-[#F5C36B]' : 'text-gray-900 dark:text-white'}`}>
                                                            {cat.label}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 dark:text-[#8A8F9C] line-clamp-1">
                                                            {cat.desc}
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Step 2: Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Your Name / Username *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="e.g. Alex Vance"
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50/80 dark:bg-[#181C26]/80 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Your Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="alex@example.com"
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50/80 dark:bg-[#181C26]/80 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Step 3: Subject & Urgency */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1">
                                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Subject Summary *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            placeholder="Brief overview of your issue..."
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50/80 dark:bg-[#181C26]/80 px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Priority Level
                                        </label>
                                        <select
                                            value={urgency}
                                            onChange={(e) => setUrgency(e.target.value)}
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50/80 dark:bg-[#181C26]/80 px-3 py-3 text-xs sm:text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 transition-all"
                                        >
                                            <option value="normal">Normal (General)</option>
                                            <option value="high">High (Account Blocked)</option>
                                            <option value="urgent">Critical (Safety/Security)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Step 4: Message Body */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            Inquiry Details *
                                        </label>
                                        <span className="text-[10px] text-gray-400">
                                            {message.length} / 2,000 characters
                                        </span>
                                    </div>
                                    <textarea
                                        rows={5}
                                        required
                                        maxLength={2000}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Please provide clear details, device/browser information, or steps to reproduce if reporting an issue..."
                                        className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50/80 dark:bg-[#181C26]/80 p-4 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 resize-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm hover:scale-[1.01] hover:brightness-105 transition-all shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    <span>{submitting ? 'Dispatching Ticket...' : 'Dispatch Support Ticket'}</span>
                                    <HiOutlinePaperAirplane className="text-base" />
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Right: Quick Support FAQ Accordion */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-6 sm:p-8 shadow-xs space-y-4">
                            <div className="flex items-center gap-2.5 text-gray-900 dark:text-white font-bold text-sm">
                                <HiOutlineQuestionMarkCircle className="text-xl text-[#D97B4F] shrink-0" />
                                <span className="font-['Fraunces'] text-base">Frequently Asked</span>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                {QUICK_FAQS.map((faq, idx) => {
                                    const isOpen = faqOpenIdx === idx;
                                    return (
                                        <div
                                            key={faq.q}
                                            className="rounded-2xl border border-gray-100 dark:border-[#202532] bg-gray-50/60 dark:bg-[#181C26]/60 overflow-hidden text-xs"
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleFaq(idx)}
                                                className="w-full text-left p-3.5 flex items-center justify-between gap-2 font-bold text-gray-800 dark:text-gray-200 hover:text-[#D97B4F] dark:hover:text-[#F5C36B] cursor-pointer"
                                            >
                                                <span>{faq.q}</span>
                                                <span className="shrink-0 text-gray-400">
                                                    {isOpen ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
                                                </span>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="px-3.5 pb-3.5 text-gray-600 dark:text-[#A0A5B2] leading-relaxed border-t border-gray-100 dark:border-[#202532] pt-2"
                                                    >
                                                        {faq.a}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-2 border-t border-gray-100 dark:border-[#1F232C]">
                                <Link
                                    to="/support"
                                    className="text-xs font-extrabold text-[#D97B4F] dark:text-[#F5C36B] hover:underline flex items-center justify-between"
                                >
                                    <span>Browse Full Help Center</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Privacy & Safety Note */}
                        <div className="p-6 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] space-y-2 text-xs text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                            <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white text-xs">
                                <HiOutlineShieldCheck className="text-emerald-500 text-base shrink-0" />
                                <span>Zero-Data Selling Guarantee</span>
                            </div>
                            <p>
                                Support tickets and contact submissions are never syndicated, sold to third parties, or used for commercial advertising.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
