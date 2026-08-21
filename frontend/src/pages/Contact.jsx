import { useState } from 'react';
import { HiOutlineEnvelope, HiOutlineBolt, HiOutlinePaperAirplane, HiOutlineCheckCircle } from 'react-icons/hi2';

export default function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [category, setCategory] = useState('general');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setName('');
            setEmail('');
            setMessage('');
            setCategory('general');
        }, 3500);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Get In Touch
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Contact Zephyra Support
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] max-w-2xl mx-auto leading-relaxed">
                        Have a question, feedback, or need help with your account? Drop us a message and our team will get back to you promptly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Direct Details Side */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-3">
                            <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                                <HiOutlineEnvelope />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Email Us Directly</h3>
                            <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">For support, partnerships, or general feedback:</p>
                            <a href="mailto:support@zephyra.app" className="text-xs font-bold text-[#D97B4F] dark:text-[#F5C36B] hover:underline block">
                                support@zephyra.app
                            </a>
                        </div>

                        <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-3">
                            <div className="p-3 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl w-fit">
                                <HiOutlineBolt />
                            </div>
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">Response Time</h3>
                            <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">
                                Our average support response time is under <span className="font-bold text-gray-800 dark:text-gray-200">2 hours</span> during active hours.
                            </p>
                        </div>
                    </div>

                    {/* Interactive Form */}
                    <div className="md:col-span-2 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-6 sm:p-10 shadow-sm backdrop-blur-xl">
                        {submitted ? (
                            <div className="p-8 text-center space-y-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300">
                                <div className="flex justify-center text-4xl">
                                    <HiOutlineCheckCircle />
                                </div>
                                <h3 className="font-bold font-['Fraunces'] text-xl">Message Sent Successfully!</h3>
                                <p className="text-xs sm:text-sm">Thank you for reaching out. We have received your inquiry and will reply to <span className="font-bold">{email || 'your email'}</span> shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Your Name</label>
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
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Your Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="jane@example.com"
                                            className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Category</label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                    >
                                        <option value="general">General Question</option>
                                        <option value="account">Account & Login Help</option>
                                        <option value="bug">Report a Bug / Glitch</option>
                                        <option value="feedback">Feature Request / Feedback</option>
                                        <option value="press">Press & Media</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Your Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="How can we help you today?"
                                        className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm hover:brightness-105 transition-all shadow-md cursor-pointer"
                                >
                                    <span>Send Message</span>
                                    <HiOutlinePaperAirplane className="text-base" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
