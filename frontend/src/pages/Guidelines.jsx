import {
    HiOutlineHandRaised,
    HiOutlineSparkles,
    HiOutlineNoSymbol,
    HiOutlineShieldCheck,
    HiOutlineLockClosed,
} from 'react-icons/hi2';

export default function Guidelines() {
    const GUIDELINES = [
        {
            icon: HiOutlineHandRaised,
            title: '1. Respect and Human Dignity',
            description: 'Treat fellow creators and thinkers with empathy and respect. Constructive debate is celebrated; harassment, personal attacks, hate speech, and discrimination will never be tolerated.',
        },
        {
            icon: HiOutlineSparkles,
            title: '2. Authenticity & Originality',
            description: 'Share your genuine perspectives, art, stories, and ideas. Do not impersonate other creators, public figures, or brand entities, and do not distribute deceitful or deceptive misinformation.',
        },
        {
            icon: HiOutlineNoSymbol,
            title: '3. Zero Tolerance for Spam & Bots',
            description: 'Automated spam bots, coordinated manipulation, repetitive bulk messaging, and deceptive affiliate links are strictly prohibited and will result in immediate permanent suspension.',
        },
        {
            icon: HiOutlineShieldCheck,
            title: '4. Safety & Age-Appropriate Content',
            description: 'Do not post explicit adult content, violence, self-harm encouragement, or illegal material. Zephyra is dedicated to maintaining a safe harbor for creators of all backgrounds.',
        },
        {
            icon: HiOutlineLockClosed,
            title: '5. Respect Privacy & Confidentiality',
            description: 'Never publish another person’s private contact information, personal documents, or private direct messages without their explicit prior consent (doxxing).',
        },
    ];

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Community Trust & Safety
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Community Guidelines
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-[#9DA3B4] max-w-2xl mx-auto leading-relaxed">
                        These simple rules ensure that Zephyra remains a welcoming, calm, and inspiring sanctuary for all members.
                    </p>
                </div>

                {/* Guidelines Cards */}
                <div className="space-y-4">
                    {GUIDELINES.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <div key={item.title} className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-6 sm:p-8 shadow-xs backdrop-blur-xl flex items-start gap-5">
                                <div className="p-3.5 rounded-2xl bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-2xl shrink-0">
                                    <IconComponent />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-['Fraunces'] text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Enforcement Notice */}
                <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs sm:text-sm text-amber-900 dark:text-amber-300 leading-relaxed space-y-2">
                    <h4 className="font-bold font-['Fraunces'] text-base">Enforcement & Moderation</h4>
                    <p>
                        Violations of these principles are reviewed by our moderation team. Actions may range from content removal and temporary account suspension to permanent removal from Zephyra.
                    </p>
                </div>
            </div>
        </div>
    );
}
