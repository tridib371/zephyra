import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
);

const UserGroupIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const PostFeedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4.5 w-4.5">
        <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
    </svg>
);

const HashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4.5 w-4.5">
        <path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18" strokeLinecap="round" />
    </svg>
);

const MessageIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
);

const TRENDING_TAGS = ['#technology', '#design', '#zephyra', '#art', '#mindset', '#future', '#creative'];

export default function Search() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [results, setResults] = useState({ users: [], posts: [], hashtags: [] });

    useEffect(() => {
        const trimmed = query.trim();
        if (!trimmed) {
            setResults({ users: [], posts: [], hashtags: [] });
            return undefined;
        }

        const timer = window.setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.get('/search', { params: { q: trimmed } });
                setResults({
                    users: res.data.users || [],
                    posts: res.data.posts || [],
                    hashtags: res.data.hashtags || [],
                });
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => window.clearTimeout(timer);
    }, [query]);

    const stats = useMemo(() => ([
        { label: 'People', value: results.users.length, icon: UserGroupIcon },
        { label: 'Posts', value: results.posts.length, icon: PostFeedIcon },
        { label: 'Hashtags', value: results.hashtags.length, icon: HashIcon },
    ]), [results]);

    const tabs = [
        { key: 'all', label: 'All Results' },
        { key: 'users', label: `People (${results.users.length})` },
        { key: 'posts', label: `Posts (${results.posts.length})` },
        { key: 'hashtags', label: `Hashtags (${results.hashtags.length})` },
    ];

    const showUsers = activeTab === 'all' || activeTab === 'users';
    const showPosts = activeTab === 'all' || activeTab === 'posts';
    const showHashtags = activeTab === 'all' || activeTab === 'hashtags';

    return (
        <div className="min-h-screen px-4 sm:px-6 py-10 bg-[#FAF7F2] dark:bg-[#0B0D10] text-[#1A140D] dark:text-[#EDEBE6] font-[Manrope] transition-colors duration-300">

            {/* Background Ambient Orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[#FF8F6B]/25 via-[#F5C36B]/20 to-transparent blur-3xl opacity-70 dark:opacity-30" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto space-y-8">

                {/* ===== HEADER & SEARCH BAR SECTION ===== */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="rounded-3xl border border-[#EAE2D5] dark:border-[#1F232C] bg-white/95 dark:bg-[#11151D]/90 backdrop-blur-2xl p-6 sm:p-8 shadow-sm"
                >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF0E6] dark:bg-[#FF8F6B]/15 text-[#B85323] dark:text-[#F5C36B] text-xs font-extrabold uppercase tracking-wider border border-[#FF8F6B]/30">
                                <SearchIcon />
                                <span>Global Explorer</span>
                            </span>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-['Fraunces'] italic font-bold text-stone-900 dark:text-white">
                                Search Zephyra Realm
                            </h1>
                            <p className="mt-1.5 text-xs sm:text-sm text-stone-600 dark:text-[#8A8F9C] font-medium max-w-xl">
                                Instantly discover creators, real-time posts, direct conversations, and trending topics.
                            </p>
                        </div>

                        {/* Search Stats Pills */}
                        {query.trim() && (
                            <div className="grid grid-cols-3 gap-3 sm:min-w-[300px]">
                                {stats.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={item.label} className="rounded-2xl border border-[#EFE8DC] dark:border-[#1F232C] bg-[#FFFDF9] dark:bg-[#151922] p-3 text-center shadow-xs">
                                            <div className="flex items-center justify-center gap-1.5 text-[#B85323] dark:text-[#F5C36B] mb-1">
                                                <Icon />
                                                <span className="text-[10px] uppercase font-extrabold tracking-wider">{item.label}</span>
                                            </div>
                                            <p className="text-xl font-extrabold text-[#1A140D] dark:text-white">{item.value}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Floating Search Input Field */}
                    <div className="mt-7 flex flex-col gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-[#B85323] dark:text-[#F5C36B]">
                                <SearchIcon />
                            </span>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search creators by name, @username, keywords, or #hashtags..."
                                className="w-full rounded-2xl border border-[#EFE8DC] dark:border-[#1F232C] bg-[#FAF7F2] dark:bg-[#0A0D11] py-4 pl-12 pr-12 text-sm sm:text-base font-semibold text-[#1A140D] dark:text-[#EDEBE6] placeholder:text-gray-400 dark:placeholder:text-[#6E7280] outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] shadow-inner transition-all"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                    <CloseIcon />
                                </button>
                            )}
                        </div>

                        {/* Search Filter Tabs */}
                        {query.trim() && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`rounded-full px-4 py-2 text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${activeTab === tab.key
                                                ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] shadow-md scale-105'
                                                : 'border border-[#EFE8DC] dark:border-[#1F232C] bg-white dark:bg-[#151922] text-[#2D241C] dark:text-[#EDEBE6] hover:bg-[#FFF5EF] dark:hover:bg-white/10'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.section>

                {/* ===== LOADING SKELETON STATE ===== */}
                {loading && (
                    <div className="rounded-3xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white/90 dark:bg-[#11151D]/90 p-12 text-center shadow-xs">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#FFF0E6] dark:bg-white/5 text-[#B85323] dark:text-[#F5C36B] font-extrabold text-sm animate-pulse">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#D97B4F] dark:bg-[#F5C36B] animate-ping" />
                            Searching Zephyra Database...
                        </div>
                    </div>
                )}

                {/* ===== EMPTY INITIAL SEARCH STATE ===== */}
                {!loading && !query.trim() && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-3xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white/90 dark:bg-[#11151D]/90 p-8 sm:p-10 shadow-xs space-y-6"
                    >
                        <div>
                            <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#B85323] dark:text-[#F5C36B]">
                                🔥 Trending Topics
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                                Click any topic to instantly start exploring global posts
                            </p>
                            <div className="flex flex-wrap gap-2.5 mt-4">
                                {TRENDING_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setQuery(tag)}
                                        className="px-4 py-2 rounded-full border border-[#EFE8DC] dark:border-[#1F232C] bg-[#FFFDF9] dark:bg-[#151922] text-xs font-bold text-[#1A140D] dark:text-[#EDEBE6] hover:bg-[#FFF5EF] dark:hover:bg-[#1A1E27] hover:border-[#FF8F6B]/50 transition-all cursor-pointer shadow-xs"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ===== SEARCH RESULTS GRID ===== */}
                {!loading && query.trim() && (
                    <div className="grid gap-8 lg:grid-cols-12 items-start">

                        {/* PEOPLE SECTION */}
                        {showUsers && (
                            <section className={`${activeTab === 'users' ? 'lg:col-span-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4' : 'lg:col-span-4 space-y-4'}`}>
                                <div className="flex items-center justify-between col-span-full pb-1 border-b border-[#EFE8DC] dark:border-[#1F232C]">
                                    <h2 className="text-lg font-bold text-[#1A140D] dark:text-white font-[Manrope] flex items-center gap-2">
                                        <UserGroupIcon /> People
                                    </h2>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] dark:bg-white/10 text-[#B85323] dark:text-[#F5C36B] text-xs font-extrabold">
                                        {results.users.length}
                                    </span>
                                </div>

                                {results.users.length === 0 ? (
                                    <div className="col-span-full rounded-2xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white dark:bg-[#11151D] p-6 text-center text-xs font-semibold text-gray-500 dark:text-[#8A8F9C]">
                                        No users matching "{query}"
                                    </div>
                                ) : results.users.map((person) => (
                                    <motion.article
                                        key={person._id}
                                        whileHover={{ y: -4 }}
                                        className="rounded-3xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-5 shadow-[0_10px_30px_-10px_rgba(217,123,79,0.12)] hover:shadow-[0_15px_35px_-5px_rgba(217,123,79,0.22)] transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div className="flex items-start gap-3.5">
                                            <img
                                                src={person.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || 'User')}&background=D97B4F&color=fff`}
                                                alt={person.name}
                                                referrerPolicy="no-referrer"
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || 'User')}&background=D97B4F&color=fff`; }}
                                                className="h-13 w-13 rounded-2xl object-cover ring-2 ring-[#FF8F6B]/40 shrink-0 shadow-xs"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <Link to={`/profile/${person._id}`} className="block truncate text-base font-extrabold text-[#1A140D] dark:text-white hover:text-[#B85323] dark:hover:text-[#F5C36B]">
                                                    {person.name}
                                                </Link>
                                                <p className="truncate text-xs font-semibold text-gray-500 dark:text-[#8A8F9C]">@{person.username}</p>
                                                <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 font-medium">
                                                    {person.bio || 'Zephyra creator.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-[#1F232C] flex gap-2">
                                            <Link
                                                to={`/profile/${person._id}`}
                                                className="flex-1 py-2 text-center rounded-full border border-[#EFE8DC] dark:border-[#1F232C] bg-[#FFFDF9] dark:bg-[#181D27] text-xs font-bold text-[#1A140D] dark:text-white hover:border-[#FF8F6B]/50 transition-all"
                                            >
                                                View Profile
                                            </Link>
                                            <button
                                                onClick={() => navigate(`/messages?userId=${person._id}`)}
                                                className="flex-1 py-2 rounded-full bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-xs font-extrabold text-[#1A140D] hover:brightness-105 transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <MessageIcon /> Chat
                                            </button>
                                        </div>
                                    </motion.article>
                                ))}
                            </section>
                        )}

                        {/* POSTS SECTION */}
                        {showPosts && (
                            <section className={`${activeTab === 'posts' ? 'lg:col-span-12 grid md:grid-cols-2 gap-4' : activeTab === 'all' ? 'lg:col-span-5 space-y-4' : 'lg:col-span-8 space-y-4'}`}>
                                <div className="flex items-center justify-between pb-1 border-b border-[#EFE8DC] dark:border-[#1F232C]">
                                    <h2 className="text-lg font-bold text-[#1A140D] dark:text-white font-[Manrope] flex items-center gap-2">
                                        <PostFeedIcon /> Posts
                                    </h2>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] dark:bg-white/10 text-[#B85323] dark:text-[#F5C36B] text-xs font-extrabold">
                                        {results.posts.length}
                                    </span>
                                </div>

                                {results.posts.length === 0 ? (
                                    <div className="rounded-2xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white dark:bg-[#11151D] p-6 text-center text-xs font-semibold text-gray-500 dark:text-[#8A8F9C]">
                                        No posts matching "{query}"
                                    </div>
                                ) : results.posts.map((post) => (
                                    <motion.article
                                        key={post._id}
                                        whileHover={{ y: -3 }}
                                        onClick={() => navigate(`/post/${post._id}`)}
                                        className="cursor-pointer rounded-3xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-5 shadow-[0_10px_30px_-10px_rgba(217,123,79,0.12)] hover:shadow-[0_15px_35px_-5px_rgba(217,123,79,0.22)] hover:border-[#FF8F6B]/50 transition-all duration-300"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={post.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'Author')}&background=D97B4F&color=fff`}
                                                alt={post.author?.name}
                                                referrerPolicy="no-referrer"
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'Author')}&background=D97B4F&color=fff`; }}
                                                className="h-10 w-10 rounded-2xl object-cover ring-1 ring-[#FF8F6B]/30"
                                            />
                                            <div>
                                                <p className="font-extrabold text-sm text-[#1A140D] dark:text-white">{post.author?.name}</p>
                                                <p className="text-[11px] font-semibold text-gray-500 dark:text-[#8A8F9C]">
                                                    @{post.author?.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="mt-3.5 text-xs sm:text-sm text-[#2D241C] dark:text-[#EDEBE6] line-clamp-3 leading-relaxed font-medium">
                                            {post.content}
                                        </p>

                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#1F232C] flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-[#8A8F9C]">
                                            <span className="flex items-center gap-1">❤️ {post.likes?.length || 0}</span>
                                            <span className="flex items-center gap-1">💬 {post.comments?.length || 0}</span>
                                        </div>
                                    </motion.article>
                                ))}
                            </section>
                        )}

                        {/* HASHTAGS SECTION */}
                        {showHashtags && (
                            <section className={`${activeTab === 'hashtags' ? 'lg:col-span-12 grid md:grid-cols-3 gap-4' : 'lg:col-span-3 space-y-4'}`}>
                                <div className="flex items-center justify-between pb-1 border-b border-[#EFE8DC] dark:border-[#1F232C]">
                                    <h2 className="text-lg font-bold text-[#1A140D] dark:text-white font-[Manrope] flex items-center gap-2">
                                        <HashIcon /> Hashtags
                                    </h2>
                                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFF0E6] dark:bg-white/10 text-[#B85323] dark:text-[#F5C36B] text-xs font-extrabold">
                                        {results.hashtags.length}
                                    </span>
                                </div>

                                {results.hashtags.length === 0 ? (
                                    <div className="rounded-2xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white dark:bg-[#11151D] p-6 text-center text-xs font-semibold text-gray-500 dark:text-[#8A8F9C]">
                                        No hashtags found.
                                    </div>
                                ) : results.hashtags.map((item) => (
                                    <button
                                        key={item.tag}
                                        onClick={() => setQuery(item.tag)}
                                        className="w-full rounded-2xl border border-[#EFE8DC] dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-4 text-left shadow-xs hover:border-[#FF8F6B]/50 transition-all cursor-pointer"
                                    >
                                        <p className="text-sm font-extrabold text-[#B85323] dark:text-[#F5C36B]">{item.tag}</p>
                                        <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-[#8A8F9C]">
                                            {item.count} post{item.count !== 1 ? 's' : ''}
                                        </p>
                                    </button>
                                ))}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}