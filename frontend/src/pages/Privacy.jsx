export default function Privacy() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF8F6B]/15 text-[#D97B4F] dark:text-[#F5C36B] text-xs font-bold uppercase tracking-widest font-[Manrope]">
                        Legal & Compliance
                    </span>
                    <h1 className="font-['Fraunces'] italic text-4xl sm:text-6xl font-extrabold tracking-tight">
                        Privacy Policy
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        Last Updated: August 2026 • Effective Immediately
                    </p>
                </div>

                {/* Content Card */}
                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-8 sm:p-12 shadow-sm backdrop-blur-xl space-y-8 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-[#C5C9D3]">

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">1. Our Commitment to Your Privacy</h2>
                        <p>
                            At Zephyra, privacy is not an afterthought - it is the cornerstone of our platform. We believe you should always know what data we collect, how it is used, and how you retain total control over your digital footprint.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">2. Information We Collect</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong className="text-gray-900 dark:text-white">Account Information:</strong> When you register, we collect your name, username, and email address. Your password is cryptographically hashed with salt and is never stored in plain text.</li>
                            <li><strong className="text-gray-900 dark:text-white">Content & Stories:</strong> Posts, comments, likes, images, and stories you choose to share on Zephyra.</li>
                            <li><strong className="text-gray-900 dark:text-white">Direct Communications:</strong> Messages sent between users are transmitted in real-time and stored securely with strict user authorization boundaries.</li>
                            <li><strong className="text-gray-900 dark:text-white">Technical Telemetry:</strong> Minimal session cookies and device tokens solely used to keep you securely signed in and route notifications.</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">3. How We Use Your Information</h2>
                        <p>
                            We use collected data strictly to provide, maintain, and secure the Zephyra experience. <strong>We do not sell, rent, or trade your personal data or browsing behavior to third-party ad networks or data brokers.</strong>
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">4. Your Data Rights & Deletion</h2>
                        <p>
                            You have the right to request a full export of your account data or permanently delete your account and all associated posts, messages, and media at any time through your Profile Settings.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="font-['Fraunces'] text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">5. Contact Our Privacy Officer</h2>
                        <p>
                            For inquiries regarding GDPR, CCPA, or data governance, please reach out to <a href="mailto:privacy@zephyra.app" className="text-[#D97B4F] dark:text-[#F5C36B] font-bold hover:underline">privacy@zephyra.app</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
