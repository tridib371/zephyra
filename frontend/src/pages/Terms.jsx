export default function Terms() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Legal & Compliance
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Terms of Service
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Last Updated: August 2026 • Please read carefully before using Zephyra
                    </p>
                </div>

                {/* Content Card */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-8 sm:p-12 shadow-sm backdrop-blur-xl space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-[#C5C9D3]">

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using Zephyra, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">2. User Accounts & Security</h2>
                        <p>
                            You must provide accurate information when creating an account. You are responsible for safeguarding your login credentials and for all activities that occur under your account.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">3. Acceptable Use & Conduct</h2>
                        <p>
                            You agree not to post abusive, hateful, defamatory, or unlawful content. Harassment, unauthorized automated scraping, impersonation, or spamming other community members will lead to immediate account suspension or termination.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">4. Intellectual Property</h2>
                        <p>
                            You retain ownership of the original content you post on Zephyra. By posting on public feeds, you grant Zephyra a non-exclusive license to display and distribute your content across the platform.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">5. Account Termination</h2>
                        <p>
                            We reserve the right to suspend or terminate accounts that violate our Community Guidelines or Terms of Service. Users may close their accounts at any time.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
