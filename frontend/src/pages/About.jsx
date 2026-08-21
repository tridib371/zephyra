import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Our Origin Story
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Where Thoughts Catch the Wind
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] max-w-2xl mx-auto leading-relaxed">
                        Zephyra was born out of a desire for a breath of fresh air in modern social networking — an open, tranquil space for authentic thoughts and real connections.
                    </p>
                </div>

                {/* Mission Card */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-8 sm:p-12 shadow-sm backdrop-blur-xl space-y-6">
                    <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold">The Philosophy of the Gentle Breeze</h2>
                    <p className="text-gray-700 dark:text-[#C5C9D3] leading-relaxed text-sm sm:text-base">
                        In Greek mythology, <span className="font-bold text-[#D97B4F] dark:text-[#F5C36B]">Zephyrus</span> was the god of the gentle west wind, heralding the arrival of spring and fresh ideas. Modern digital spaces are often noisy, algorithmic, and overwhelming. Zephyra is engineered as the antidote: a serene social platform where stories drift freely without artificial outrage algorithms.
                    </p>
                    <p className="text-gray-700 dark:text-[#C5C9D3] leading-relaxed text-sm sm:text-base">
                        Whether you are sharing a fleeting spontaneous idea, exchanging real-time messages with friends, or exploring creative visual stories, Zephyra treats every interaction with elegance, speed, and privacy.
                    </p>
                </div>

                {/* Core Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF8F6B] to-[#D97B4F] text-[#1A140D] text-2xl font-bold grid place-items-center">
                            🕊️
                        </div>
                        <h3 className="font-['Fraunces'] text-lg font-bold">Serene & Human</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            No addictive doomscrolling traps. We design for clarity, mindfulness, and meaningful human expression.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#F5C36B] to-[#FF8F6B] text-[#1A140D] text-2xl font-bold grid place-items-center">
                            ⚡
                        </div>
                        <h3 className="font-['Fraunces'] text-lg font-bold">Real-time Currents</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            Socket-powered direct messages, live notifications, and instant interaction feedback across devices.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs space-y-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#D97B4F] to-[#C6822E] text-[#1A140D] text-2xl font-bold grid place-items-center">
                            🛡️
                        </div>
                        <h3 className="font-['Fraunces'] text-lg font-bold">Privacy by Default</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C] leading-relaxed">
                            Full control over your visibility, direct message access, and data. Your thoughts belong to you.
                        </p>
                    </div>
                </div>

                {/* Call to action */}
                <div className="text-center pt-6 space-y-4">
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm rounded-full hover:scale-105 shadow-md transition-all font-[Manrope]"
                    >
                        Join the Zephyra Community →
                    </Link>
                </div>
            </div>
        </div>
    );
}
