import { useState } from 'react';

const OPEN_POSITIONS = [
    {
        title: 'Senior Frontend Engineer (React & Tailwind)',
        department: 'Engineering',
        location: 'Remote / Global',
        type: 'Full-Time',
        description: 'Lead the evolution of Zephyra’s responsive web app, craft silky smooth 60fps micro-interactions, and optimize real-time feeds.',
    },
    {
        title: 'Backend Systems Engineer (Node.js & MongoDB)',
        department: 'Infrastructure',
        location: 'Remote / Hybrid',
        type: 'Full-Time',
        description: 'Scale our real-time Socket.IO clustering, design distributed cache systems, and optimize database read/write throughput.',
    },
    {
        title: 'Product Designer (UI / UX & Motion)',
        department: 'Design',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Define the aesthetic standard of Zephyra across mobile and web. Turn complex interactions into serene, breath-like experiences.',
    },
    {
        title: 'Community Safety & Trust Specialist',
        department: 'Operations',
        location: 'Remote',
        type: 'Full-Time',
        description: 'Uphold community guidelines, coordinate proactive moderation, and ensure Zephyra remains a welcoming space for all creators.',
    },
];

export default function Careers() {
    const [appliedPosition, setAppliedPosition] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [note, setNote] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setAppliedPosition(null);
            setSubmitted(false);
            setName('');
            setEmail('');
            setResumeUrl('');
            setNote('');
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Careers at Zephyra
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Build the Future of Connection
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] max-w-2xl mx-auto leading-relaxed">
                        We are a distributed team of engineers, designers, and dreamers building the next generation of serene social technology.
                    </p>
                </div>

                {/* Perks Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-2">
                        <span className="text-2xl">🌍</span>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Work From Anywhere</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C]">100% remote-first culture with flexible hours across all global timezones.</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-2">
                        <span className="text-2xl">🌿</span>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Wellness & Retreats</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C]">Generous annual leave, health stipends, and annual team retreats in scenic locations.</p>
                    </div>
                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-2">
                        <span className="text-2xl">🚀</span>
                        <h3 className="font-['Fraunces'] font-bold text-lg">Growth & Autonomy</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C]">High ownership, continuous learning allowances, and cutting-edge tech stack.</p>
                    </div>
                </div>

                {/* Open Positions */}
                <div className="space-y-4">
                    <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold">Open Positions ({OPEN_POSITIONS.length})</h2>

                    <div className="space-y-4">
                        {OPEN_POSITIONS.map((job) => (
                            <div key={job.title} className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-2 max-w-xl">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] uppercase tracking-wider">{job.department}</span>
                                        <span className="text-xs text-gray-400">• {job.location} • {job.type}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">{job.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">{job.description}</p>
                                </div>

                                <button
                                    onClick={() => setAppliedPosition(job.title)}
                                    className="px-6 py-3 rounded-full bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] text-xs sm:text-sm font-extrabold hover:scale-105 transition-all shrink-0 cursor-pointer"
                                >
                                    Apply Now →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Application Modal */}
                {appliedPosition && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-lg rounded-3xl border border-gray-200 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 sm:p-8 shadow-2xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-[11px] uppercase font-bold tracking-wider text-[#D97B4F]">Application</span>
                                    <h3 className="font-['Fraunces'] text-lg sm:text-xl font-bold">{appliedPosition}</h3>
                                </div>
                                <button onClick={() => setAppliedPosition(null)} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-lg">✕</button>
                            </div>

                            {submitted ? (
                                <div className="p-6 text-center space-y-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300">
                                    <span className="text-3xl block">🎉</span>
                                    <h4 className="font-bold">Application Received!</h4>
                                    <p className="text-xs">Thank you for your interest in joining Zephyra. Our talent team will review your application and reach out shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Your Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Jane Doe"
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="jane@example.com"
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Portfolio / LinkedIn / GitHub URL</label>
                                        <input
                                            type="url"
                                            required
                                            value={resumeUrl}
                                            onChange={(e) => setResumeUrl(e.target.value)}
                                            placeholder="https://linkedin.com/in/janedoe"
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Why Zephyra? (Brief Note)</label>
                                        <textarea
                                            rows={3}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Tell us what excites you about Zephyra..."
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 resize-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm hover:brightness-105 transition-all shadow-md cursor-pointer"
                                    >
                                        Submit Application 🚀
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
