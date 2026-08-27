import { Link } from 'react-router-dom';

// ---------- Small line-icon set (kept consistent with Navbar's icon language) ----------

const FeatherMark = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13a1.5 1.5 0 0 1 1.06 2.56L9.62 16.5H18.5a1.5 1.5 0 0 1 0 3h-13a1.5 1.5 0 0 1-1.06-2.56L14.38 7.5H5.5A1.5 1.5 0 0 1 4 5.5z" />
    </svg>
);

const TwitterIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path d="M21 5.5c-.7.3-1.4.5-2.2.6a3.8 3.8 0 0 0 1.7-2.1 7.6 7.6 0 0 1-2.4.9 3.8 3.8 0 0 0-6.5 3.5A10.8 10.8 0 0 1 3.9 4.6a3.8 3.8 0 0 0 1.2 5.1c-.6 0-1.2-.2-1.7-.5v.1c0 1.9 1.3 3.4 3.1 3.8-.6.1-1.1.2-1.7.1a3.8 3.8 0 0 0 3.5 2.6A7.6 7.6 0 0 1 3 17.2a10.7 10.7 0 0 0 5.8 1.7c7 0 10.8-5.8 10.8-10.8v-.5c.8-.5 1.4-1.2 1.9-2Z" strokeLinejoin="round" />
    </svg>
);

const InstagramIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="3.7" />
        <path d="M16.8 7.2h.01" strokeLinecap="round" strokeWidth="2" />
    </svg>
);

const MastodonIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4">
        <path d="M6 8.5C6 5.5 8.2 4 12 4s6 1.5 6 4.5v4c0 3-2.2 4.5-6 4.5-1.3 0-2.4-.2-3.3-.5L6 19v-4" strokeLinejoin="round" strokeLinecap="round" />
        <path d="M9 8.5v4M15 8.5v4" strokeLinecap="round" />
    </svg>
);

const GustDivider = () => (
    <svg
        className="w-full h-6 text-[#D97B4F]/25 dark:text-[#FF8F6B]/30"
        viewBox="0 0 1160 24"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <path
            d="M -20 12 C 200 -6, 380 30, 600 12 S 980 -6, 1180 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        />
    </svg>
);

const FOOTER_LINKS = {
    Product: [
        { label: 'Feed', to: '/feed' },
        { label: 'Explore', to: '/explore' },
        { label: 'Create a post', to: '/create' },
    ],
    Platform: [
        { label: 'About', to: '/about' },
        { label: 'Features', to: '/features' },
        { label: 'Changelog', to: '/changelog' },
    ],
    Legal: [
        { label: 'Privacy', to: '/privacy' },
        { label: 'Terms', to: '/terms' },
        { label: 'Cookie preferences', to: '/cookies' },
    ],
    Support: [
        { label: 'Help center', to: '/support' },
        { label: 'Community guidelines', to: '/guidelines' },
        { label: 'Contact us', to: '/contact' },
    ],
};

const SOCIALS = [
    { label: 'Twitter', icon: TwitterIcon, href: 'https://twitter.com' },
    { label: 'Instagram', icon: InstagramIcon, href: 'https://instagram.com' },
    { label: 'Mastodon', icon: MastodonIcon, href: 'https://mastodon.social' },
];

const Footer = () => {
    return (
        <footer className="relative mt-auto bg-[#0F131C] dark:bg-[#121620] border-t border-[#1E2638] dark:border-[#283244] shadow-[0_-8px_32px_rgba(0,0,0,0.3)] font-[Manrope] transition-colors duration-300 overflow-hidden text-[#E2E8F0]">
            {/* Signature Radiant Sunset Ember Top Accent Line */}
            <div className="h-[2.5px] w-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B]" />

            {/* Subtle Ambient Night / Day Ember Halo */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-r from-transparent via-[#FF8F6B]/15 to-transparent blur-3xl pointer-events-none" />

            <div className="hidden sm:block absolute -top-3 left-0 right-0 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <GustDivider />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 relative z-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
                    <div className="col-span-2 sm:col-span-3 lg:col-span-2 pr-4">
                        <Link to="/" className="flex items-center gap-2.5 group w-fit">
                            <span className="grid h-9.5 w-9.5 place-items-center rounded-2xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-[0_8px_20px_-4px_rgba(255,143,107,0.5)] group-hover:scale-105 group-hover:shadow-[0_10px_25px_-2px_rgba(255,143,107,0.7)] transition-all duration-300 ring-2 ring-[#FF8F6B]/40">
                                <FeatherMark />
                            </span>
                            <span className="font-['Fraunces'] font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#FF8F6B] via-[#F5C36B] to-[#FF8F6B] bg-clip-text text-transparent">
                                Zephyra
                            </span>
                        </Link>
                        <p className="mt-3 text-sm text-[#94A3B8] dark:text-[#94A3B8] max-w-xs leading-relaxed font-medium">
                            Carry your story on the wind - to every corner, to every soul.
                        </p>

                        <div className="flex items-center gap-2 mt-5">
                            {SOCIALS.map(function renderSocial(social) {
                                const SocialIcon = social.icon;
                                return (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={social.label}
                                        className="p-2.5 rounded-2xl text-[#E2E8F0] hover:text-[#F5C36B] bg-[#1E2638] dark:bg-[#1E2636] hover:bg-[#28334A] dark:hover:bg-[#28334A] border border-[#2E3B52] dark:border-[#2D3B52] shadow-xs transition-all duration-200"
                                    >
                                        <SocialIcon />
                                    </a>
                                );
                            })}
                        </div>
                    </div>

                    {Object.keys(FOOTER_LINKS).map(function renderColumn(heading) {
                        const links = FOOTER_LINKS[heading];
                        return (
                            <div key={heading}>
                                <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#F5C36B] dark:text-[#F5C36B] mb-3.5">
                                    {heading}
                                </h3>
                                <ul className="space-y-2.5">
                                    {links.map(function renderLink(link) {
                                        return (
                                            <li key={link.label}>
                                                <Link
                                                    to={link.to}
                                                    onClick={function handleFooterClick() {
                                                        window.scrollTo(0, 0);
                                                    }}
                                                    className="text-sm text-[#CBD5E1] dark:text-[#CBD5E1] hover:text-[#FF8F6B] dark:hover:text-[#FF8F6B] font-medium transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-10 pt-6 border-t border-[#1E2638] dark:border-[#283244] flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left text-xs sm:text-sm text-[#94A3B8] dark:text-[#94A3B8] px-2 sm:px-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-medium">
                        <p>© {new Date().getFullYear()} Zephyra. All rights reserved.</p>
                        <span className="hidden sm:inline">•</span>
                        <Link
                            to="/admin"
                            onClick={function handleAdminClick() {
                                window.scrollTo(0, 0);
                            }}
                            className="hover:text-[#FF8F6B] dark:hover:text-[#F5C36B] transition-colors font-bold"
                        >
                            Admin Portal
                        </Link>
                    </div>
                    <div className="flex items-center justify-center sm:justify-end gap-2 font-medium text-xs sm:text-sm text-center sm:text-right max-w-full">
                        <span>Made for people who create, wonder, and drift between ideas</span>
                        <span className="grid h-5 w-5 sm:h-5.5 sm:w-5.5 place-items-center rounded-md bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-xs ring-1 ring-[#FF8F6B]/30 shrink-0">
                            <FeatherMark />
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;