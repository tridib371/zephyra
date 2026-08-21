import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
    HiOutlinePaintBrush,
    HiOutlineChartBar,
    HiOutlineTrash,
    HiOutlineCheck,
    HiOutlineArrowPath,
    HiOutlineDocumentText,
    HiOutlineInformationCircle,
} from 'react-icons/hi2';

export default function Cookies() {
    const [themePref, setThemePref] = useState(true);
    const [analyticsPref, setAnalyticsPref] = useState(false);
    const [socketCachePref, setSocketCachePref] = useState(true);
    const [savedNotice, setSavedNotice] = useState(false);
    const [clearedNotice, setClearedNotice] = useState(false);

    useEffect(() => {
        const savedConsent = localStorage.getItem('zephyra_cookie_consent');
        if (savedConsent) {
            try {
                const parsed = JSON.parse(savedConsent);
                setThemePref(parsed.theme ?? true);
                setAnalyticsPref(parsed.analytics ?? false);
                setSocketCachePref(parsed.socketCache ?? true);
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    const handleSavePreferences = () => {
        localStorage.setItem(
            'zephyra_cookie_consent',
            JSON.stringify({
                theme: themePref,
                analytics: analyticsPref,
                socketCache: socketCachePref,
                updatedAt: new Date().toISOString(),
            })
        );
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    const handleResetDefaults = () => {
        setThemePref(true);
        setAnalyticsPref(false);
        setSocketCachePref(true);
        localStorage.removeItem('zephyra_cookie_consent');
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 3000);
    };

    const handleClearLocalStorage = () => {
        if (window.confirm('Are you sure you want to clear your local session cache? You will need to sign in again.')) {
            localStorage.clear();
            sessionStorage.clear();
            setClearedNotice(true);
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    const COOKIE_MATRIX = [
        {
            key: 'zephyra_token',
            category: 'Strictly Essential',
            type: 'Local Storage',
            purpose: 'Cryptographic JSON Web Token (JWT) used to keep your session authenticated.',
            lifespan: '7 Days or until Logout',
        },
        {
            key: 'zephyra_theme',
            category: 'Functional & Display',
            type: 'Local Storage',
            purpose: 'Stores your preferred display theme (Obsidian Dark vs Warm Terracotta Light).',
            lifespan: 'Persistent',
        },
        {
            key: 'zephyra_cookie_consent',
            category: 'Preferences',
            type: 'Local Storage',
            purpose: 'Records your granular privacy and storage preferences configured on this page.',
            lifespan: 'Persistent',
        },
        {
            key: 'zephyra_admin_token',
            category: 'Security Gate',
            type: 'Local Storage',
            purpose: 'Authorizes administrative control center requests (only present for authenticated administrators).',
            lifespan: '7 Days or Session Lock',
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope]">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest">
                        Storage & Privacy Control
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Cookie & Storage Preferences
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        Take full control of how Zephyra stores authentication tokens and interface preferences on your device.
                    </p>
                </div>

                {/* Privacy Pledge Banner */}
                <div className="p-6 sm:p-8 rounded-3xl border border-emerald-200/80 dark:border-emerald-900/40 bg-emerald-50/60 dark:bg-emerald-950/20 shadow-xs flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-2xl shrink-0">
                        <HiOutlineShieldCheck />
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-700 dark:text-[#C5C9D3]">
                        <h3 className="font-bold font-['Fraunces'] text-base text-gray-900 dark:text-white">
                            Zero Third-Party Advertising Pixels
                        </h3>
                        <p className="leading-relaxed">
                            Zephyra does not use cross-site tracking cookies, Meta Pixel, Google AdSense tags, or behavioral profiling trackers. We use local browser storage strictly for core platform functionality.
                        </p>
                    </div>
                </div>

                {/* Interactive Preference Control Center */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-sm backdrop-blur-xl space-y-8">
                    <div className="flex items-center justify-between border-b border-gray-100 dark:border-[#1F232C] pb-4">
                        <div>
                            <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                Granular Storage Preferences
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Toggle individual client-side storage permissions below.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* 1. Essential Authentication */}
                        <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#181C26]/80 border border-gray-200/60 dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-700 dark:text-gray-300 text-lg shrink-0 mt-0.5">
                                    <HiOutlineLockClosed />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Strictly Necessary Authentication</h3>
                                    <p className="text-xs text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                                        Required for logging in, routing real-time WebSockets, and securing API endpoints. Cannot be deactivated.
                                    </p>
                                </div>
                            </div>
                            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 shrink-0 self-start sm:self-center">
                                Always Active
                            </span>
                        </div>

                        {/* 2. Theme & Display */}
                        <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#181C26]/80 border border-gray-200/60 dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-700 dark:text-gray-300 text-lg shrink-0 mt-0.5">
                                    <HiOutlinePaintBrush />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Theme & Visual Experience</h3>
                                    <p className="text-xs text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                                        Remembers your theme (Light or Dark mode) and interface animation settings across sessions.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setThemePref(!themePref)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
                                    themePref ? 'bg-[#D97B4F]' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                    themePref ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>

                        {/* 3. Real-Time Socket Cache */}
                        <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#181C26]/80 border border-gray-200/60 dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-700 dark:text-gray-300 text-lg shrink-0 mt-0.5">
                                    <HiOutlineArrowPath />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Real-Time Socket Reconnection Cache</h3>
                                    <p className="text-xs text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                                        Temporarily preserves unread counts and conversation channels to resume seamlessly after network drops.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSocketCachePref(!socketCachePref)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
                                    socketCachePref ? 'bg-[#D97B4F]' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                    socketCachePref ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>

                        {/* 4. Anonymous Diagnostics */}
                        <div className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#181C26]/80 border border-gray-200/60 dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-700 dark:text-gray-300 text-lg shrink-0 mt-0.5">
                                    <HiOutlineChartBar />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Anonymous Error & Latency Diagnostics</h3>
                                    <p className="text-xs text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                                        Sends non-identifying telemetry (e.g. failed image render times) to help our team optimize platform speed.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAnalyticsPref(!analyticsPref)}
                                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
                                    analyticsPref ? 'bg-[#D97B4F]' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                    analyticsPref ? 'translate-x-6' : 'translate-x-0'
                                }`} />
                            </button>
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-[#1F232C]">
                        <button
                            onClick={handleSavePreferences}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-xs sm:text-sm font-extrabold hover:scale-105 transition-all shadow-sm cursor-pointer"
                        >
                            <HiOutlineCheck className="text-base" />
                            <span>{savedNotice ? 'Preferences Saved!' : 'Save Preferences'}</span>
                        </button>

                        <button
                            onClick={handleResetDefaults}
                            className="px-5 py-3 rounded-full border border-gray-200 dark:border-[#2A303C] text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#181C26] transition-all cursor-pointer"
                        >
                            Reset to Defaults
                        </button>

                        <button
                            onClick={handleClearLocalStorage}
                            className="flex items-center gap-1.5 px-5 py-3 rounded-full border border-rose-200 dark:border-rose-900/40 text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all cursor-pointer ml-auto"
                        >
                            <HiOutlineTrash />
                            <span>{clearedNotice ? 'Cleared! Reloading...' : 'Clear Session Data'}</span>
                        </button>
                    </div>
                </div>

                {/* Storage Matrix Table */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/95 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-sm backdrop-blur-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xl">
                            <HiOutlineDocumentText />
                        </div>
                        <div>
                            <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                Complete Local Storage Key Matrix
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">Exact keys stored in your browser's window.localStorage</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border border-gray-200 dark:border-[#252A36] rounded-2xl overflow-hidden">
                            <thead className="bg-gray-50 dark:bg-[#181C26] text-gray-700 dark:text-gray-300 font-bold">
                                <tr>
                                    <th className="p-3">Key Name</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Purpose & Description</th>
                                    <th className="p-3">Lifespan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-[#252A36]">
                                {COOKIE_MATRIX.map((row) => (
                                    <tr key={row.key} className="hover:bg-gray-50/50 dark:hover:bg-[#181C26]/50">
                                        <td className="p-3 font-mono font-bold text-[#D97B4F] dark:text-[#F5C36B]">{row.key}</td>
                                        <td className="p-3 font-medium text-gray-700 dark:text-gray-300">{row.category}</td>
                                        <td className="p-3 text-gray-600 dark:text-[#9DA3B4] max-w-xs">{row.purpose}</td>
                                        <td className="p-3 text-gray-500 dark:text-gray-400">{row.lifespan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Browser Management Guide */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 sm:p-8 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm">
                        <HiOutlineInformationCircle className="text-lg text-[#D97B4F]" />
                        <span>Managing Storage in Your Web Browser</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] leading-relaxed">
                        You can also manage or block local storage directly in your browser settings (Chrome, Firefox, Safari, Edge, Brave) under <em>Settings &gt; Privacy & Security &gt; Cookies and Site Data</em>. Note that blocking essential storage will prevent you from signing in to Zephyra.
                    </p>
                </div>

                {/* Footer Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-[#8A8F9C] pt-4">
                    <p>Have questions about your client-side data?</p>
                    <div className="flex items-center gap-4">
                        <Link to="/privacy" className="hover:text-[#D97B4F] dark:hover:text-[#F5C36B] font-bold transition-colors">
                            Privacy Policy →
                        </Link>
                        <Link to="/contact" className="hover:text-[#D97B4F] dark:hover:text-[#F5C36B] font-bold transition-colors">
                            Contact Support →
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
