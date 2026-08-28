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
    HiOutlineArrowPath,
    HiOutlineQuestionMarkCircle,
    HiOutlineChevronDown,
    HiOutlineChevronUp,
    HiOutlineExclamationCircle,
    HiOutlineSparkles,
} from 'react-icons/hi2';

// Animated wind gust SVG lines for smooth motion
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25 z-0"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="contactGust" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        <motion.path
            d="M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
            fill="none"
            stroke="url(#contactGust)"
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
            stroke="url(#contactGust)"
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
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Real-time custom validation suggestions
    const validateFields = (fieldsToValidate = { name, email, subject, message }) => {
        const newErrors = {};

        if ('name' in fieldsToValidate) {
            if (!fieldsToValidate.name.trim()) {
                newErrors.name = 'Please enter your name or @username so our team knows who to address.';
            } else if (fieldsToValidate.name.trim().length < 2) {
                newErrors.name = 'Name should be at least 2 characters long.';
            }
        }

        if ('email' in fieldsToValidate) {
            if (!fieldsToValidate.email.trim()) {
                newErrors.email = 'Please provide your email address so our team can send you a resolution.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldsToValidate.email.trim())) {
                newErrors.email = 'Please enter a valid email address format (e.g. yourname@gmail.com).';
            }
        }

        if ('subject' in fieldsToValidate) {
            if (!fieldsToValidate.subject.trim()) {
                newErrors.subject = 'Please add a brief summary so we can route your ticket to the right specialist.';
            } else if (fieldsToValidate.subject.trim().length < 4) {
                newErrors.subject = 'Subject should be at least 4 characters long (e.g. "Login assistance").';
            }
        }

        if ('message' in fieldsToValidate) {
            if (!fieldsToValidate.message.trim()) {
                newErrors.message = 'Please describe your inquiry or issue so our support team can assist you.';
            } else if (fieldsToValidate.message.trim().length < 10) {
                newErrors.message = `Please provide a bit more detail (${fieldsToValidate.message.trim().length}/10 characters minimum).`;
            }
        }

        return newErrors;
    };

    const handleFieldChange = (field, value) => {
        if (field === 'name') setName(value);
        if (field === 'email') setEmail(value);
        if (field === 'subject') setSubject(value);
        if (field === 'message') setMessage(value);

        if (touched[field]) {
            const fieldErrors = validateFields({ [field]: value });
            setErrors((prev) => ({
                ...prev,
                [field]: fieldErrors[field] || undefined,
            }));
        }
    };

    const handleFieldBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const values = { name, email, subject, message };
        const fieldErrors = validateFields({ [field]: values[field] });
        setErrors((prev) => ({
            ...prev,
            [field]: fieldErrors[field] || undefined,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, subject: true, message: true });

        const validationErrors = validateFields({ name, email, subject, message });
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
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
        setErrors({});
        setTouched({});
    };

    const toggleFaq = (idx) => {
        setFaqOpenIdx(faqOpenIdx === idx ? null : idx);
    };

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Realistic Support Desk & Correspondence Photography Wallpapers - Clear & Sharp */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFF6EF] via-[#FAF7F2] to-[#F5EFE6] dark:from-[#0E1116] dark:via-[#121620] dark:to-[#0A0D12]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF8F6B]/15 via-transparent to-transparent dark:from-[#FF8F6B]/10" />
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
                        Direct Support & Assistance
                    </motion.span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1C1008] dark:text-white relative z-10">
                        We are here to help
                    </h1>
                    <p className="text-base sm:text-xl text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold max-w-xl mx-auto relative z-10">
                        Have a question, feedback, or need account assistance? Drop our team a message and receive prompt human support.
                    </p>

                    {/* Live Support Status Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border-2 border-black dark:border-emerald-900/40 bg-emerald-100/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-300 text-xs font-black shadow-xs relative z-10">
                        <span className="flex items-center gap-1.5">
                            <HiOutlineBolt className="text-base stroke-[2.2]" />
                            <span>Support Desk Active</span>
                            <span className="text-emerald-800 dark:text-emerald-400 font-bold">• Average Response Time &lt; 2 Hours</span>
                        </span>
                    </div>
                </motion.div>

                {/* Dedicated Communication Channels with Black Borders in Day Mode & Motion Lift */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {CONTACT_CHANNELS.map((ch, idx) => {
                        const Icon = ch.icon;
                        return (
                            <motion.div
                                key={ch.title}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ y: -6, scale: 1.02 }}
                                className="p-6 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 shadow-2xl backdrop-blur-xl flex flex-col justify-between gap-4 transition-all"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-xl inline-flex items-center justify-center">
                                            <Icon className="stroke-[2.2]" />
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFF6EF] dark:bg-[#181C26] text-[#9E3610] dark:text-gray-300 border border-black dark:border-[#252A36]">
                                            {ch.responseTime}
                                        </span>
                                    </div>
                                    <h3 className="font-['Fraunces'] font-bold text-base text-[#1C1008] dark:text-white">
                                        {ch.title}
                                    </h3>
                                    <p className="text-xs text-[#4D3222] dark:text-[#8A8F9C] leading-relaxed font-bold">
                                        {ch.desc}
                                    </p>
                                </div>
                                <a
                                    href={`mailto:${ch.email}`}
                                    className="text-xs font-black text-[#9E3610] dark:text-[#F5C36B] hover:underline flex items-center gap-1"
                                >
                                    <span>{ch.email}</span>
                                    <span>→</span>
                                </a>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Main Contact Form & Sidebar Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left: Interactive Form with Black Borders in Day Mode */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-2 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl"
                    >
                        {submitted ? (
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="p-8 sm:p-12 text-center space-y-5 bg-gradient-to-b from-emerald-100/80 to-white dark:from-emerald-950/20 dark:to-[#12151C] rounded-3xl border-2 border-black dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-300 shadow-xl"
                            >
                                <div className="flex justify-center text-5xl text-emerald-600">
                                    <HiOutlineCheckCircle />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-xs font-mono font-black border-2 border-black bg-emerald-200 dark:bg-emerald-900/50 text-emerald-950 dark:text-emerald-200 px-3.5 py-1 rounded-full inline-block shadow-xs">
                                        Ticket Reference: #{ticketId}
                                    </span>
                                    <h3 className="font-['Fraunces'] font-bold text-2xl text-[#1C1008] dark:text-white">
                                        Message Dispatched!
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#A0A5B2] max-w-md mx-auto leading-relaxed font-bold">
                                        Thank you, <span className="font-black text-[#1C1008] dark:text-white">{name}</span>. Our team has received your ticket and will send a confirmation and resolution to <span className="font-black text-[#1C1008] dark:text-white">{email}</span>.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.96 }}
                                        type="button"
                                        onClick={handleResetForm}
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-black bg-white dark:bg-[#181C26] text-xs font-black text-[#1C1008] dark:text-[#E7E6E3] hover:bg-[#FFF6EF] dark:hover:bg-[#181C26] transition-all cursor-pointer shadow-sm"
                                    >
                                        <HiOutlineArrowPath className="text-sm stroke-[2.2]" />
                                        <span>Submit Another Inquiry</span>
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate className="space-y-6">
                                <div className="border-b-2 border-black dark:border-[#1F232C] pb-4">
                                    <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-[#1C1008] dark:text-white">
                                        Send a Message to Support
                                    </h2>
                                    <p className="text-xs text-[#4D3222] dark:text-[#8A8F9C] mt-0.5 font-bold">
                                        Fill in the details below and we will triage your inquiry immediately.
                                    </p>
                                </div>

                                {/* Top Suggestion Alert if any fields are incomplete */}
                                <AnimatePresence>
                                    {Object.keys(errors).length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                            className="p-3.5 rounded-2xl bg-[#FFF1EB] dark:bg-[#251613] border-2 border-[#EA580C] text-[#9E3610] dark:text-[#FF8F6B] flex items-start gap-2.5 shadow-sm"
                                        >
                                            <HiOutlineSparkles className="text-lg shrink-0 mt-0.5 text-[#EA580C]" />
                                            <div className="space-y-0.5 text-xs">
                                                <p className="font-black text-[#9E3610] dark:text-[#FF8F6B]">
                                                    Quick Attention Needed:
                                                </p>
                                                <p className="text-[11px] text-[#6E280C] dark:text-[#F3A585] font-bold">
                                                    Please review the suggestions highlighted below to help us process your inquiry swiftly.
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Step 1: Category Picker */}
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                        Select Inquiry Category
                                    </label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        {CATEGORIES.map((cat) => {
                                            const Icon = cat.icon;
                                            const isSelected = category === cat.id;
                                            return (
                                                <motion.button
                                                    key={cat.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    type="button"
                                                    onClick={() => setCategory(cat.id)}
                                                    className={`p-3 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                                                        isSelected
                                                            ? 'border-black dark:border-[#FF8F6B] bg-[#FFF7F4] dark:bg-[#1E2638] ring-2 ring-black dark:ring-[#FF8F6B]/40 shadow-md'
                                                            : 'border-black dark:border-[#252A36] bg-white dark:bg-[#181C26]/70 hover:bg-[#FFF6EF]'
                                                    }`}
                                                >
                                                    <span className={`p-2.5 rounded-xl text-base shrink-0 flex items-center justify-center border border-black transition-all ${isSelected ? 'bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] shadow-xs' : 'bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B]'}`}>
                                                        <Icon className="stroke-[2.2]" />
                                                    </span>
                                                    <div className="space-y-0.5">
                                                        <p className={`text-xs font-black ${isSelected ? 'text-[#9E3610] dark:text-[#F5C36B]' : 'text-[#1C1008] dark:text-white'}`}>
                                                            {cat.label}
                                                        </p>
                                                        <p className="text-[10px] text-[#5E3821] dark:text-[#8A8F9C] line-clamp-1 font-bold">
                                                            {cat.desc}
                                                        </p>
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Step 2: Name & Email */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                            Your Name / Username *
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => handleFieldChange('name', e.target.value)}
                                            onBlur={() => handleFieldBlur('name')}
                                            placeholder="e.g. Alex Vance"
                                            className={`w-full rounded-2xl border-2 ${
                                                errors.name
                                                    ? 'border-[#EA580C] bg-[#FFF2EB] dark:bg-[#251512] ring-1 ring-[#EA580C]'
                                                    : 'border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26]/80'
                                            } px-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 transition-all font-bold`}
                                        />
                                        <AnimatePresence>
                                            {errors.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                    exit={{ opacity: 0, y: -4, height: 0 }}
                                                    className="flex items-start gap-1.5 p-2 rounded-xl bg-[#FFF1EB] dark:bg-[#261613] border border-[#EA580C]/80 text-[#9E3610] dark:text-[#FF8F6B] text-[11px] font-bold shadow-xs"
                                                >
                                                    <HiOutlineExclamationCircle className="text-sm shrink-0 mt-0.5 text-[#EA580C]" />
                                                    <span>💡 <strong>Suggestion:</strong> {errors.name}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                            Your Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                            onBlur={() => handleFieldBlur('email')}
                                            placeholder="alex@example.com"
                                            className={`w-full rounded-2xl border-2 ${
                                                errors.email
                                                    ? 'border-[#EA580C] bg-[#FFF2EB] dark:bg-[#251512] ring-1 ring-[#EA580C]'
                                                    : 'border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26]/80'
                                            } px-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 transition-all font-bold`}
                                        />
                                        <AnimatePresence>
                                            {errors.email && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                    exit={{ opacity: 0, y: -4, height: 0 }}
                                                    className="flex items-start gap-1.5 p-2 rounded-xl bg-[#FFF1EB] dark:bg-[#261613] border border-[#EA580C]/80 text-[#9E3610] dark:text-[#FF8F6B] text-[11px] font-bold shadow-xs"
                                                >
                                                    <HiOutlineExclamationCircle className="text-sm shrink-0 mt-0.5 text-[#EA580C]" />
                                                    <span>💡 <strong>Suggestion:</strong> {errors.email}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Step 3: Subject & Urgency */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                            Subject Summary *
                                        </label>
                                        <input
                                            type="text"
                                            value={subject}
                                            onChange={(e) => handleFieldChange('subject', e.target.value)}
                                            onBlur={() => handleFieldBlur('subject')}
                                            placeholder="e.g. Unable to verify my email address..."
                                            className={`w-full rounded-2xl border-2 ${
                                                errors.subject
                                                    ? 'border-[#EA580C] bg-[#FFF2EB] dark:bg-[#251512] ring-1 ring-[#EA580C]'
                                                    : 'border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26]/80'
                                            } px-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 transition-all font-bold`}
                                        />
                                        <AnimatePresence>
                                            {errors.subject && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -4, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                    exit={{ opacity: 0, y: -4, height: 0 }}
                                                    className="flex items-start gap-1.5 p-2 rounded-xl bg-[#FFF1EB] dark:bg-[#261613] border border-[#EA580C]/80 text-[#9E3610] dark:text-[#FF8F6B] text-[11px] font-bold shadow-xs"
                                                >
                                                    <HiOutlineExclamationCircle className="text-sm shrink-0 mt-0.5 text-[#EA580C]" />
                                                    <span>💡 <strong>Suggestion:</strong> {errors.subject}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                            Priority Level
                                        </label>
                                        <select
                                            value={urgency}
                                            onChange={(e) => setUrgency(e.target.value)}
                                            className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26]/80 px-3 py-3 text-xs sm:text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 transition-all font-bold"
                                        >
                                            <option value="normal">Normal (General)</option>
                                            <option value="high">High (Account Blocked)</option>
                                            <option value="urgent">Critical (Safety/Security)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Step 4: Message Body */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                            Inquiry Details *
                                        </label>
                                        <span className="text-[10px] text-[#5E3821] dark:text-[#9DA3B4] font-bold">
                                            {message.length} / 2,000 characters
                                        </span>
                                    </div>
                                    <textarea
                                        rows={5}
                                        maxLength={2000}
                                        value={message}
                                        onChange={(e) => handleFieldChange('message', e.target.value)}
                                        onBlur={() => handleFieldBlur('message')}
                                        placeholder="Please describe what happened, steps to reproduce, or any relevant details..."
                                        className={`w-full rounded-2xl border-2 ${
                                            errors.message
                                                ? 'border-[#EA580C] bg-[#FFF2EB] dark:bg-[#251512] ring-1 ring-[#EA580C]'
                                                : 'border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26]/80'
                                        } p-4 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 resize-none transition-all font-bold`}
                                    />
                                    <AnimatePresence>
                                        {errors.message && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4, height: 0 }}
                                                animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                exit={{ opacity: 0, y: -4, height: 0 }}
                                                className="flex items-start gap-1.5 p-2 rounded-xl bg-[#FFF1EB] dark:bg-[#261613] border border-[#EA580C]/80 text-[#9E3610] dark:text-[#FF8F6B] text-[11px] font-bold shadow-xs"
                                            >
                                                <HiOutlineExclamationCircle className="text-sm shrink-0 mt-0.5 text-[#EA580C]" />
                                                <span>💡 <strong>Suggestion:</strong> {errors.message}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black font-extrabold text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    <span>{submitting ? 'Dispatching Ticket...' : 'Dispatch Support Ticket'}</span>
                                    <HiOutlinePaperAirplane className="text-base stroke-[2.2]" />
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* Right: Quick Support FAQ Accordion */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="rounded-3xl border-2 border-black dark:border-[#1F232C] bg-white/92 dark:bg-[#12151C]/95 p-6 sm:p-8 shadow-2xl space-y-4"
                        >
                            <div className="flex items-center gap-2.5 text-[#1C1008] dark:text-white font-black text-sm">
                                <HiOutlineQuestionMarkCircle className="text-xl text-[#9E3610] dark:text-[#F5C36B] shrink-0 stroke-[2.2]" />
                                <span className="font-['Fraunces'] text-base">Frequently Asked</span>
                            </div>

                            <div className="space-y-2.5 pt-2">
                                {QUICK_FAQS.map((faq, idx) => {
                                    const isOpen = faqOpenIdx === idx;
                                    return (
                                        <div
                                            key={faq.q}
                                            className={`rounded-2xl border-2 text-xs overflow-hidden transition-all duration-200 ${
                                                isOpen
                                                    ? 'border-black dark:border-[#FF8F6B] bg-[#FFF7F4] dark:bg-[#1B2232] ring-1 ring-black dark:ring-[#FF8F6B]/30 shadow-md'
                                                    : 'border-black dark:border-[#202532] bg-[#FFF6EF] dark:bg-[#181C26]/60 hover:border-black'
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => toggleFaq(idx)}
                                                className={`w-full text-left p-3.5 flex items-center justify-between gap-2 font-black cursor-pointer transition-colors ${
                                                    isOpen
                                                        ? 'text-[#9E3610] dark:text-[#F5C36B]'
                                                        : 'text-[#1C1008] dark:text-gray-200 hover:text-[#9E3610] dark:hover:text-[#FF8F6B]'
                                                }`}
                                            >
                                                <span>{faq.q}</span>
                                                <span className={`shrink-0 p-1 rounded-md border border-black transition-all ${isOpen ? 'bg-[#FF8F6B] text-[#1A140D]' : 'bg-gray-200 text-[#1C1008]'}`}>
                                                    {isOpen ? <HiOutlineChevronUp className="stroke-[2.5]" /> : <HiOutlineChevronDown className="stroke-[2.5]" />}
                                                </span>
                                            </button>
                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="px-3.5 pb-3.5 text-[#3D2517] dark:text-[#A0A5B2] leading-relaxed border-t-2 border-black dark:border-[#202532] pt-2 font-bold"
                                                    >
                                                        {faq.a}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-2 border-t-2 border-black dark:border-[#1F232C]">
                                <Link
                                    to="/support"
                                    className="text-xs font-black text-[#9E3610] dark:text-[#F5C36B] hover:underline flex items-center justify-between"
                                >
                                    <span>Browse Full Help Center</span>
                                    <span>→</span>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Privacy & Safety Note */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="p-6 rounded-3xl border-2 border-black dark:border-[#1F232C] bg-white/92 dark:bg-[#12151C] space-y-2 text-xs text-[#3D2517] dark:text-[#9DA3B4] leading-relaxed shadow-xl"
                        >
                            <div className="flex items-center gap-2 font-black text-[#1C1008] dark:text-white text-xs">
                                <HiOutlineShieldCheck className="text-emerald-600 text-base shrink-0 stroke-[2.2]" />
                                <span>Zero-Data Selling Guarantee</span>
                            </div>
                            <p className="font-bold">
                                Support tickets and contact submissions are never syndicated, sold to third parties, or used for commercial advertising.
                            </p>
                        </motion.div>
                    </div>

                </div>

            </div>
        </div>
    );
}
