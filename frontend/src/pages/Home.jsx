import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  FONTS – already loaded in index.html
  Fraunces (italic) – display; Manrope – body/UI.
*/

const GUST_PATHS = [
    'M -100 140 C 150 60, 350 220, 620 110 S 1000 40, 1300 130',
    'M -100 300 C 200 380, 420 220, 700 320 S 1050 260, 1300 340',
    'M -100 460 C 180 400, 460 520, 760 440 S 1080 500, 1300 430',
];

const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    left: `${(i * 7.3) % 100}%`,
    size: 3 + ((i * 5) % 5),
    duration: 14 + ((i * 3) % 10),
    delay: (i % 7) * 1.4,
    drift: (i % 2 === 0 ? 1 : -1) * (20 + (i % 4) * 10),
}));

const WindLines = ({ reduce }) => (
    <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="gustGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="45%" stopColor="#FF8F6B" stopOpacity="0.55" />
                <stop offset="75%" stopColor="#F5C36B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        {GUST_PATHS.map((d, i) => (
            <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="url(#gustGradient)"
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={
                    reduce
                        ? { pathLength: 1, opacity: 0.5 }
                        : {
                            pathLength: 1,
                            opacity: [0, 0.6, 0.4, 0.6],
                            x: [0, 12, -8, 0],
                        }
                }
                transition={
                    reduce
                        ? { duration: 1.2, delay: i * 0.15 }
                        : {
                            pathLength: { duration: 1.6, delay: i * 0.2, ease: 'easeOut' },
                            opacity: { duration: 10 + i * 2, repeat: Infinity, ease: 'easeInOut' },
                            x: { duration: 14 + i * 3, repeat: Infinity, ease: 'easeInOut' },
                        }
                }
            />
        ))}
    </svg>
);

const Particles = ({ reduce }) => {
    if (reduce) return null;
    return (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {PARTICLES.map((p) => (
                <motion.span
                    key={p.id}
                    className="absolute rounded-full bg-[#F5D8B0] dark:bg-[#F5D8B0]/80"
                    style={{
                        left: p.left,
                        bottom: '-4%',
                        width: p.size,
                        height: p.size,
                        filter: 'blur(0.3px)',
                    }}
                    initial={{ opacity: 0, y: 0, x: 0 }}
                    animate={{
                        opacity: [0, 0.8, 0.8, 0],
                        y: ['0%', '-620%'],
                        x: [0, p.drift, p.drift * 0.6],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            ))}
        </div>
    );
};

const FeatherIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M20.24 3.76 9.5 14.5a4.95 4.95 0 0 0 0 7 4.95 4.95 0 0 0 7 0L20.24 10a4.95 4.95 0 0 0 0-7 4.95 4.95 0 0 0-7 0Z" />
        <path d="M9 15 4 20" />
        <path d="M13.5 10.5 11 13" />
    </svg>
);

const PulseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M3 12h4l2-7 4 14 2-7h6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
);

const CloudLockIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path d="M7 16.5a4 4 0 0 1 .3-7.98A5.5 5.5 0 0 1 17.9 10.1 3.5 3.5 0 0 1 17 17H15" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="8" y="14" width="7" height="6" rx="1.2" />
        <path d="M10 14v-1.5a1.5 1.5 0 0 1 3 0V14" />
    </svg>
);

const CompassIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <path d="m14.5 9.5-2 5-3 1.5 2-5 3-1.5Z" strokeLinejoin="round" />
    </svg>
);

const FEATURES = [
    {
        icon: FeatherIcon,
        title: 'Set your thoughts adrift',
        description: 'Post updates, photos, and half-finished ideas - Zephyra carries them to the people who want to see.',
    },
    {
        icon: PulseIcon,
        title: 'Follow the currents that move you',
        description: 'Like, comment, and follow the people whose posts change how your day feels.',
    },
    {
        icon: CloudLockIcon,
        title: 'Choose your weather',
        description: 'Every post has a climate you control - public gust, private calm, or somewhere between.',
    },
    {
        icon: CompassIcon,
        title: 'A world without borders',
        description: 'Conversations drift in from every timezone. Follow one thread and end up somewhere new.',
    },
];

const Home = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const reduce = useReducedMotion();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/feed');
        }
    }, [isAuthenticated, navigate]);

    const featureConnector = useMemo(
        () => 'M 40 40 C 160 -10, 280 90, 400 40 S 640 -10, 760 40 S 1000 90, 1120 40',
        []
    );

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#0E1116] font-[Manrope] transition-colors duration-300">
            {/* Hero */}
            <section className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6 py-24 sm:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-[#151A24] dark:via-[#0E1116] dark:to-[#0B0D12] transition-colors duration-300">
                <WindLines reduce={reduce} />
                <Particles reduce={reduce} />

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative z-10 text-center max-w-2xl"
                >
                    <span className="inline-block text-[11px] sm:text-xs tracking-[0.3em] uppercase text-[#D97B4F] dark:text-[#F5C36B]/80 mb-6 font-[Manrope]">
                        A gentle current for your thoughts
                    </span>

                    <h1
                        className="font-['Fraunces'] italic font-medium text-6xl sm:text-7xl md:text-8xl leading-[1.15] pb-2 bg-gradient-to-r from-[#D97B4F] via-[#C6822E] to-[#D97B4F] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent"
                        style={{ fontVariationSettings: '"opsz" 40, "wght" 500, "SOFT" 0, "WONK" 0' }}
                    >
                        Zephyra
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-gray-700 dark:text-[#E7E6E3] leading-relaxed font-[Manrope]">
                        Share your world the way wind shares a season -
                        <br className="hidden sm:block" />
                        freely, and everywhere at once.
                    </p>

                    <p className="mt-4 text-sm sm:text-base text-gray-500 dark:text-[#8A8F9C] max-w-md mx-auto font-[Manrope]">
                        A social space for people who create, wonder, and drift between ideas.
                    </p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 justify-center"
                    >
                        <Link
                            to="/register"
                            className="px-8 py-3 bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_30px_-6px_rgba(255,143,107,0.55)] transition-all duration-300 text-center font-[Manrope]"
                        >
                            Get Started Free
                        </Link>
                        <Link
                            to="/login"
                            className="group px-8 py-3 border border-gray-300 dark:border-[#3A3F4B] text-gray-700 dark:text-[#E7E6E3] font-semibold rounded-full hover:border-[#D97B4F] dark:hover:border-[#F5C36B]/60 hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-all duration-300 text-center font-[Manrope]"
                        >
                            Sign In <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                        </Link>
                    </motion.div>
                </motion.div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#0B0D12] to-transparent" />
            </section>

            {/* Features */}
            <section className="relative py-24 px-4 sm:px-6 bg-gray-50 dark:bg-[#0B0D12] transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="font-['Fraunces'] italic text-3xl sm:text-4xl text-center text-gray-900 dark:text-[#EDEBE6] mb-4"
                        style={{ fontVariationSettings: '"opsz" 30, "SOFT" 0, "WONK" 0' }}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Why Zephyra?
                    </motion.h2>
                    <p className="text-center text-sm text-gray-500 dark:text-[#6E7280] mb-16 max-w-md mx-auto font-[Manrope]">
                        Four reasons people stay longer than they mean to.
                    </p>

                    <div className="relative">
                        <svg
                            className="hidden lg:block absolute -top-4 left-0 w-full h-24 text-[#D97B4F]/30 dark:text-[#F5C36B]/15"
                            viewBox="0 0 1160 80"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <path d={featureConnector} fill="none" stroke="currentColor" strokeWidth="1" />
                        </svg>

                        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {FEATURES.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={feature.title}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className={`relative bg-white dark:bg-[#12151C] rounded-2xl p-6 border border-gray-200 dark:border-[#1F232C] hover:border-[#D97B4F]/30 dark:hover:border-[#F5C36B]/30 transition-all duration-300 hover:-translate-y-1.5 ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-10'
                                            }`}
                                    >
                                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#FF8F6B]/15 to-[#F5C36B]/15 flex items-center justify-center text-[#D97B4F] dark:text-[#F5C36B] mb-4">
                                            <Icon />
                                        </div>
                                        <h3 className="text-base font-semibold text-gray-900 dark:text-[#EDEBE6] font-[Manrope]">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-[#8A8F9C] mt-2 leading-relaxed font-[Manrope]">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-24 px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-[#F5EFE6] to-[#F8F4EC] dark:from-[#241F3E] dark:via-[#3B2F4A] dark:to-[#4A2E2A] transition-colors duration-300">
                <WindLines reduce={reduce} />
                <motion.div
                    className="relative z-10 max-w-2xl mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2
                        className="font-['Fraunces'] italic text-4xl sm:text-5xl text-gray-900 dark:text-[#F8F4EC]"
                        style={{ fontVariationSettings: '"opsz" 30, "SOFT" 0, "WONK" 0' }}
                    >
                        Ready to catch the wind?
                    </h2>
                    <p className="text-base sm:text-lg mt-4 text-gray-700 dark:text-[#D9D3E6] font-[Manrope]">
                        Thousands of creators are already riding the Zephyra current. Your story is next.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block mt-8 px-8 py-3 bg-[#1A140D] dark:bg-[#F8F4EC] text-white dark:text-[#241F3E] font-semibold rounded-full hover:scale-105 transition-all duration-300 font-[Manrope]"
                    >
                        Create Your Account
                    </Link>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;