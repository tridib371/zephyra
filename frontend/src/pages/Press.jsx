import { useState } from 'react';
import { FiFeather } from 'react-icons/fi';
import { HiOutlineEnvelope, HiOutlineCheck } from 'react-icons/hi2';

export default function Press() {
    const [copiedColor, setCopiedColor] = useState(null);

    const BRAND_COLORS = [
        { name: 'Sunset Coral', hex: '#FF8F6B', rgb: 'rgb(255, 143, 107)' },
        { name: 'Warm Terracotta', hex: '#D97B4F', rgb: 'rgb(217, 123, 79)' },
        { name: 'Golden Breeze', hex: '#F5C36B', rgb: 'rgb(245, 195, 107)' },
        { name: 'Deep Cocoa Charcoal', hex: '#1A140D', rgb: 'rgb(26, 20, 13)' },
    ];

    const copyToClipboard = (hex) => {
        navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Press & Media Kit
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Media & Brand Resources
                    </h1>
                    <p className="text-base sm:text-xl text-gray-600 dark:text-[#9DA3B4] max-w-2xl mx-auto leading-relaxed">
                        Official logos, color codes, screenshots, and guidelines for writers, journalists, and media publications.
                    </p>
                </div>

                {/* Brand Assets */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-8 sm:p-10 shadow-sm backdrop-blur-xl space-y-6">
                    <h2 className="font-['Fraunces'] text-2xl font-bold">Brand Identity & Logo</h2>
                    <p className="text-gray-600 dark:text-[#9DA3B4] text-sm leading-relaxed">
                        Zephyra's visual brand uses warm dusk-to-dawn gradients that represent transition, inspiration, and free expression.
                    </p>

                    {/* Logo Preview Card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-8 rounded-2xl bg-white border border-gray-200 flex flex-col items-center justify-center text-center space-y-3">
                            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-2xl font-bold shadow-md">
                                <FiFeather />
                            </span>
                            <span className="font-['Fraunces'] font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#B85323] to-[#C6822E] bg-clip-text text-transparent">
                                Zephyra
                            </span>
                            <span className="text-xs text-gray-400">Light Mode Mark</span>
                        </div>

                        <div className="p-8 rounded-2xl bg-[#0B0D12] border border-[#1F232C] flex flex-col items-center justify-center text-center space-y-3">
                            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] text-2xl font-bold shadow-md">
                                <FiFeather />
                            </span>
                            <span className="font-['Fraunces'] font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] bg-clip-text text-transparent">
                                Zephyra
                            </span>
                            <span className="text-xs text-gray-500">Dark Mode Mark</span>
                        </div>
                    </div>
                </div>

                {/* Color Palette */}
                <div className="space-y-4">
                    <h2 className="font-['Fraunces'] text-2xl font-bold">Brand Color Palette</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {BRAND_COLORS.map((c) => (
                            <div
                                key={c.hex}
                                onClick={() => copyToClipboard(c.hex)}
                                className="group p-4 rounded-2xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] shadow-xs cursor-pointer hover:scale-105 transition-all"
                            >
                                <div className="h-16 rounded-xl mb-3 shadow-inner" style={{ backgroundColor: c.hex }} />
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{c.name}</h4>
                                <p className="text-xs font-mono text-gray-400 group-hover:text-[#D97B4F] transition-colors flex items-center gap-1">
                                    {copiedColor === c.hex ? (
                                        <span className="text-emerald-500 flex items-center gap-1"><HiOutlineCheck /> Copied!</span>
                                    ) : (
                                        c.hex
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Press Inquiries */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h3 className="font-['Fraunces'] text-xl font-bold">Media & Press Inquiries</h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-[#8A8F9C]">
                            Writing a story or podcast review about Zephyra? Our media team responds within 24 business hours.
                        </p>
                    </div>
                    <a
                        href="mailto:press@zephyra.app"
                        className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] text-xs sm:text-sm font-extrabold hover:scale-105 transition-all shrink-0"
                    >
                        <HiOutlineEnvelope className="text-base" />
                        <span>Contact Press Team</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
