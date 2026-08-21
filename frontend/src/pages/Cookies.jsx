import { useState } from 'react';
import { HiOutlineCheck } from 'react-icons/hi2';

export default function Cookies() {
    const [analytics, setAnalytics] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Preferences
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Cookie Preferences
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Understand and control how Zephyra uses local storage and cookies.
                    </p>
                </div>

                {/* Main Card */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-8 sm:p-12 shadow-sm backdrop-blur-xl space-y-8">

                    <p className="text-sm sm:text-base text-gray-700 dark:text-[#C5C9D3] leading-relaxed">
                        Zephyra uses local storage and cookies strictly to authenticate your login session, remember your theme preference (Light or Dark mode), and measure anonymous system performance.
                    </p>

                    {/* Preference Toggles */}
                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-[#1F232C]">
                        {/* Essential */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-200/60 dark:border-[#252A36]">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Strictly Necessary & Auth Cookies</h3>
                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Required for secure login, real-time messaging sockets, and CSRF protection.</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                Always Active
                            </span>
                        </div>

                        {/* Functional & Theme */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-200/60 dark:border-[#252A36]">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Theme & Display Preferences</h3>
                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Stores your preferred interface theme (Light or Dark) locally on your device.</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                                Active
                            </span>
                        </div>

                        {/* Anonymous Analytics */}
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-200/60 dark:border-[#252A36]">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Anonymous Error Diagnostics</h3>
                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Helps our engineering team detect crashing feeds and UI latency without personal tracking.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAnalytics(!analytics)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${analytics ? 'bg-[#D97B4F]' : 'bg-gray-300 dark:bg-gray-700'}`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${analytics ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-xs sm:text-sm font-extrabold hover:brightness-105 transition-all shadow-sm cursor-pointer"
                        >
                            {saved ? (
                                <>
                                    <HiOutlineCheck className="text-base" />
                                    <span>Preferences Saved!</span>
                                </>
                            ) : (
                                <span>Save Preferences</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
