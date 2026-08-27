import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
import ConfirmDialog from '../components/ConfirmDialog';

import cookiesBgLight from '../assets/cookies-bg-light.jpg';
import cookiesBgDark from '../assets/cookies-bg-dark.jpg';

// Animated wind gust SVG lines for smooth motion
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25 z-0"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="cookieGust" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        <motion.path
            d="M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
            fill="none"
            stroke="url(#cookieGust)"
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
            stroke="url(#cookieGust)"
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

export default function Cookies() {
    const [themePref, setThemePref] = useState(true);
    const [analyticsPref, setAnalyticsPref] = useState(false);
    const [socketCachePref, setSocketCachePref] = useState(true);
    const [savedNotice, setSavedNotice] = useState(false);
    const [clearedNotice, setClearedNotice] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);

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

    const handleConfirmClear = () => {
        setShowClearModal(false);
        localStorage.clear();
        sessionStorage.clear();
        setClearedNotice(true);
        setTimeout(() => {
            window.location.reload();
        }, 1500);
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
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* Realistic Data Storage & Security Photography Wallpapers - Clear & Sharp */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <img
                    src={cookiesBgLight}
                    alt="Data Storage & Key Security Light Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-95 blur-[0.5px] scale-100 transition-opacity duration-700 dark:hidden"
                />
                <img
                    src={cookiesBgDark}
                    alt="Encrypted Server & Cyber Security Dark Wallpaper"
                    className="absolute inset-0 w-full h-full object-cover opacity-85 blur-[0.5px] scale-100 transition-opacity duration-700 hidden dark:block"
                />
                {/* Overlay Tint Gradients for High Readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/65 via-[#FAF7F2]/45 to-[#FAF7F2]/75 dark:from-[#0E1116]/75 dark:via-[#0E1116]/70 dark:to-[#0E1116]/85" />
            </div>

            <div className="relative max-w-4xl mx-auto space-y-12 z-10">

                {/* Hero Header Card with Entrance Animation & Solid Black Border in Day Mode */}
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
                        Storage & Privacy Control
                    </motion.span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight text-[#1C1008] dark:text-white relative z-10">
                        Cookie & Storage Preferences
                    </h1>
                    <p className="text-base sm:text-xl text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold max-w-xl mx-auto relative z-10">
                        Take full control of how Zephyra stores authentication tokens and interface preferences on your device.
                    </p>
                </motion.div>

                {/* Privacy Pledge Banner with Spring Scroll Motion & Black Border in Day Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.01 }}
                    className="p-6 sm:p-8 rounded-3xl border-2 border-black dark:border-emerald-900/50 bg-emerald-100/80 dark:bg-emerald-950/40 shadow-xl backdrop-blur-xl flex items-start gap-4 cursor-pointer"
                >
                    <div className="p-3 rounded-2xl bg-emerald-200 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-300 text-2xl shrink-0 border border-black dark:border-emerald-700">
                        <HiOutlineShieldCheck />
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-emerald-950 dark:text-[#C5C9D3]">
                        <h3 className="font-extrabold font-['Fraunces'] text-lg text-emerald-950 dark:text-white">
                            Zero Third-Party Advertising Pixels
                        </h3>
                        <p className="leading-relaxed font-bold">
                            Zephyra does not use cross-site tracking cookies, Meta Pixel, Google AdSense tags, or behavioral profiling trackers. We use local browser storage strictly for core platform functionality.
                        </p>
                    </div>
                </motion.div>

                {/* Interactive Preference Control Center with Black Borders & Spring Toggles */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8"
                >
                    <div className="flex items-center justify-between border-b-2 border-black dark:border-[#1F232C] pb-4">
                        <div>
                            <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-black text-[#1C1008] dark:text-white">
                                Granular Storage Preferences
                            </h2>
                            <p className="text-xs text-[#5E3821] dark:text-[#8A8F9C] font-bold">Toggle individual client-side storage permissions below.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* 1. Essential Authentication */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="p-5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26]/80 border-2 border-black dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cursor-pointer"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-900 dark:text-gray-300 text-lg shrink-0 mt-0.5 border border-black dark:border-gray-700">
                                    <HiOutlineLockClosed />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-[#1C1008] dark:text-white">Strictly Necessary Authentication</h3>
                                    <p className="text-xs text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold">
                                        Required for logging in, routing real-time WebSockets, and securing API endpoints. Cannot be deactivated.
                                    </p>
                                </div>
                            </div>
                            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-200 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300 border border-black dark:border-emerald-700 shrink-0 self-start sm:self-center">
                                Always Active
                            </span>
                        </motion.div>

                        {/* 2. Theme & Display */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="p-5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26]/80 border-2 border-black dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cursor-pointer"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-900 dark:text-gray-300 text-lg shrink-0 mt-0.5 border border-black dark:border-gray-700">
                                    <HiOutlinePaintBrush />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-[#1C1008] dark:text-white">Theme & Visual Experience</h3>
                                    <p className="text-xs text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold">
                                        Remembers your theme (Light or Dark mode) and interface animation settings across sessions.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setThemePref(!themePref)}
                                className={`w-14 h-7 flex items-center rounded-full p-1 border-2 border-black transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
                                    themePref ? 'bg-[#D97B4F]' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md border border-black ${
                                        themePref ? 'translate-x-6.5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </motion.div>

                        {/* 3. Real-Time Socket Cache */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="p-5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26]/80 border-2 border-black dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cursor-pointer"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-900 dark:text-gray-300 text-lg shrink-0 mt-0.5 border border-black dark:border-gray-700">
                                    <HiOutlineArrowPath />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-[#1C1008] dark:text-white">Real-Time Socket Reconnection Cache</h3>
                                    <p className="text-xs text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold">
                                        Temporarily preserves unread counts and conversation channels to resume seamlessly after network drops.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSocketCachePref(!socketCachePref)}
                                className={`w-14 h-7 flex items-center rounded-full p-1 border-2 border-black transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
                                    socketCachePref ? 'bg-[#D97B4F]' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md border border-black ${
                                        socketCachePref ? 'translate-x-6.5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </motion.div>

                        {/* 4. Anonymous Diagnostics */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            className="p-5 rounded-2xl bg-[#FFF6EF] dark:bg-[#181C26]/80 border-2 border-black dark:border-[#252A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs cursor-pointer"
                        >
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 rounded-xl bg-gray-200 dark:bg-[#202532] text-gray-900 dark:text-gray-300 text-lg shrink-0 mt-0.5 border border-black dark:border-gray-700">
                                    <HiOutlineChartBar />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-[#1C1008] dark:text-white">Anonymous Error & Latency Diagnostics</h3>
                                    <p className="text-xs text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold">
                                        Sends non-identifying telemetry (e.g. failed image render times) to help our team optimize platform speed.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setAnalyticsPref(!analyticsPref)}
                                className={`w-14 h-7 flex items-center rounded-full p-1 border-2 border-black transition-colors cursor-pointer shrink-0 self-start sm:self-center ${
                                    analyticsPref ? 'bg-[#D97B4F]' : 'bg-gray-300 dark:bg-gray-700'
                                }`}
                            >
                                <motion.div
                                    layout
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    className={`bg-white w-4.5 h-4.5 rounded-full shadow-md border border-black ${
                                        analyticsPref ? 'translate-x-6.5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </motion.div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-4 border-t-2 border-black dark:border-[#1F232C] w-full">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSavePreferences}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black text-xs sm:text-sm font-black transition-all shadow-md cursor-pointer whitespace-nowrap"
                        >
                            <HiOutlineCheck className="text-base shrink-0 stroke-[2.5]" />
                            <span>{savedNotice ? 'Preferences Saved!' : 'Save Preferences'}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleResetDefaults}
                            className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-full border-2 border-black dark:border-[#2A303C] text-xs sm:text-sm font-black text-[#1C1008] dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#181C26] transition-all cursor-pointer text-center whitespace-nowrap"
                        >
                            Reset to Defaults
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={() => setShowClearModal(true)}
                            className="flex items-center justify-center gap-1.5 w-full sm:w-auto sm:ml-auto px-5 py-2.5 sm:py-3 rounded-full border-2 border-black dark:border-rose-900/40 bg-rose-100/80 dark:bg-rose-950/30 text-xs sm:text-sm font-black text-rose-950 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-950/50 transition-all cursor-pointer whitespace-nowrap"
                        >
                            <HiOutlineTrash className="shrink-0 stroke-[2.2]" />
                            <span>{clearedNotice ? 'Cleared! Reloading...' : 'Clear Session Data'}</span>
                        </motion.button>
                    </div>
                </motion.div>

                {/* Storage Matrix Table with Black Border & Motion Entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="rounded-3xl border-2 border-black dark:border-[#1F232C] bg-white/92 dark:bg-[#12151C]/95 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-[#FF8F6B]/20 text-[#9E3610] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] text-xl border-2 border-black dark:border-[#FF8F6B]/40">
                            <HiOutlineDocumentText className="stroke-[2.2]" />
                        </div>
                        <div>
                            <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-black text-[#1C1008] dark:text-white">
                                Complete Local Storage Key Matrix
                            </h2>
                            <p className="text-xs text-[#5E3821] dark:text-[#8A8F9C] font-bold">Exact keys stored in your browser's window.localStorage</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-2 border-black dark:border-[#252A36] rounded-2xl overflow-hidden shadow-xs">
                            <thead className="bg-[#FFF0E6] dark:bg-[#181C26] text-[#9E3610] dark:text-white font-black border-b-2 border-black dark:border-[#252A36]">
                                <tr>
                                    <th className="p-3.5">Key Name</th>
                                    <th className="p-3.5">Category</th>
                                    <th className="p-3.5">Purpose & Description</th>
                                    <th className="p-3.5">Lifespan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y-2 divide-black dark:divide-[#252A36] bg-[#FFF6EF] dark:bg-[#12151C]">
                                {COOKIE_MATRIX.map((row) => (
                                    <tr key={row.key} className="hover:bg-[#FF8F6B]/15 transition-colors">
                                        <td className="p-3.5 font-mono font-black text-[#9E3610] dark:text-[#F5C36B]">{row.key}</td>
                                        <td className="p-3.5 font-black text-[#1C1008] dark:text-gray-300">{row.category}</td>
                                        <td className="p-3.5 text-[#4D3222] dark:text-[#9DA3B4] font-bold max-w-xs">{row.purpose}</td>
                                        <td className="p-3.5 text-[#5E3821] dark:text-gray-400 font-bold">{row.lifespan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Browser Management Guide Card with Black Border */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="rounded-3xl border-2 border-black dark:border-[#1F232C] bg-white/92 dark:bg-[#12151C] p-6 sm:p-8 shadow-xl space-y-4"
                >
                    <div className="flex items-center gap-2 text-[#1C1008] dark:text-white font-black text-sm">
                        <HiOutlineInformationCircle className="text-xl text-[#9E3610] dark:text-[#FF8F6B] stroke-[2.2]" />
                        <span>Managing Storage in Your Web Browser</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4D3222] dark:text-[#9DA3B4] leading-relaxed font-bold">
                        You can also manage or block local storage directly in your browser settings (Chrome, Firefox, Safari, Edge, Brave) under <em>Settings &gt; Privacy & Security &gt; Cookies and Site Data</em>. Note that blocking essential storage will prevent you from signing in to Zephyra.
                    </p>
                </motion.div>

                {/* Custom Elegant Confirmation Modal */}
                <ConfirmDialog
                    isOpen={showClearModal}
                    onClose={() => setShowClearModal(false)}
                    onConfirm={handleConfirmClear}
                    title="Clear Local Session Cache?"
                    message="Are you sure you want to clear your browser session data and local cache? You will be signed out and need to log in again."
                    confirmText="Yes, Clear Session"
                    cancelText="Cancel"
                    iconType="trash"
                />
            </div>
        </div>
    );
}
