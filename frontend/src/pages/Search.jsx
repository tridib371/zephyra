import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';

const Search = () => {
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
        }, 350);

        return () => window.clearTimeout(timer);
    }, [query]);

    const stats = useMemo(() => ([
        { label: 'People', value: results.users.length },
        { label: 'Posts', value: results.posts.length },
        { label: 'Hashtags', value: results.hashtags.length },
    ]), [results]);

    const tabs = [
        { key: 'all', label: 'All' },
        { key: 'users', label: 'People' },
        { key: 'posts', label: 'Posts' },
        { key: 'hashtags', label: 'Hashtags' },
    ];

    const showUsers = activeTab === 'all' || activeTab === 'users';
    const showPosts = activeTab === 'all' || activeTab === 'posts';
    const showHashtags = activeTab === 'all' || activeTab === 'hashtags';

    return (
        <div className="min-h-screen px-4 sm:px-6 py-8 bg-[radial-gradient(circle_at_top,_rgba(255,143,107,0.12),_transparent_38%),linear-gradient(180deg,_#fff_0%,_#fbf7f2_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(245,195,107,0.12),_transparent_34%),linear-gradient(180deg,_#0E1116_0%,_#0B0E13_100%)] transition-colors duration-300">
            <div className="max-w-6xl mx-auto space-y-6">
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-[2rem] border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] p-5 sm:p-7"
                >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="inline-flex rounded-full bg-[#FFF1EA] dark:bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase text-[#B5652F] dark:text-[#F5C36B]">
                                Discover
                            </p>
                            <h1 className="mt-3 text-3xl sm:text-4xl font-['Fraunces'] italic text-gray-900 dark:text-white">Search people, posts, and hashtags</h1>
                            <p className="mt-2 max-w-2xl text-sm sm:text-base text-gray-600 dark:text-[#A0A6B6]">
                                Find the right profile, jump into a conversation, or explore tags with a single search.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 sm:min-w-[320px]">
                            {stats.map((item) => (
                                <div key={item.label} className="rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/75 dark:bg-white/5 px-4 py-3">
                                    <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 dark:text-[#8A8F9C]">{item.label}</p>
                                    <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                            </svg>
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by name, username, post text, or #hashtag"
                                className="w-full rounded-full border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] py-3.5 pl-12 pr-4 text-gray-900 dark:text-[#EDEBE6] placeholder:text-gray-400 dark:placeholder:text-[#6E7280] outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B]"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab.key ? 'bg-gray-900 text-white dark:bg-white dark:text-[#11151D]' : 'border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 text-gray-700 dark:text-[#E7E6E3] hover:bg-white dark:hover:bg-white/10'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {loading && (
                    <div className="rounded-[1.75rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80 p-8 text-center text-gray-500 dark:text-[#8A8F9C]">
                        Searching Zephyra...
                    </div>
                )}

                {!loading && !query.trim() && (
                    <div className="rounded-[1.75rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80 p-8 text-center text-gray-500 dark:text-[#8A8F9C]">
                        Start typing to search across users, posts, and hashtags.
                    </div>
                )}

                {!loading && query.trim() && (
                    <div className="grid gap-6 lg:grid-cols-12">
                        {showUsers && (
                            <section className="lg:col-span-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">People</h2>
                                    <span className="text-xs text-gray-500 dark:text-[#8A8F9C]">{results.users.length}</span>
                                </div>
                                {results.users.length === 0 ? (
                                    <div className="rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80 p-5 text-sm text-gray-500 dark:text-[#8A8F9C]">No people found.</div>
                                ) : results.users.map((person) => (
                                    <motion.article key={person._id} whileHover={{ y: -2 }} className="rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-white/85 dark:bg-[#11151D]/80 p-4 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)]">
                                        <div className="flex items-center gap-4">
                                            <img src={person.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt={person.name} className="h-14 w-14 rounded-2xl object-cover ring-2 ring-[#D97B4F]/20 dark:ring-[#F5C36B]/20" />
                                            <div className="min-w-0 flex-1">
                                                <Link to={`/profile/${person._id}`} className="block truncate text-base font-semibold text-gray-900 dark:text-white hover:text-[#D97B4F] dark:hover:text-[#F5C36B]">{person.name}</Link>
                                                <p className="truncate text-sm text-gray-500 dark:text-[#8A8F9C]">@{person.username}</p>
                                                <p className="mt-1 text-xs text-gray-400 dark:text-[#6E7280]">{person.bio || 'No bio added.'}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Link to={`/profile/${person._id}`} className="flex-1 rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-3 py-2 text-center text-sm font-semibold text-gray-700 dark:text-[#E7E6E3]">View profile</Link>
                                            <button onClick={() => navigate(`/messages?userId=${person._id}`)} className="flex-1 rounded-full bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] px-3 py-2 text-sm font-semibold text-[#1A140D]">Message</button>
                                        </div>
                                    </motion.article>
                                ))}
                            </section>
                        )}

                        {showPosts && (
                            <section className="lg:col-span-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Posts</h2>
                                    <span className="text-xs text-gray-500 dark:text-[#8A8F9C]">{results.posts.length}</span>
                                </div>
                                {results.posts.length === 0 ? (
                                    <div className="rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80 p-5 text-sm text-gray-500 dark:text-[#8A8F9C]">No posts found.</div>
                                ) : results.posts.map((post) => (
                                    <motion.article key={post._id} whileHover={{ y: -2 }} onClick={() => navigate(`/post/${post._id}`)} className="cursor-pointer rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-white/85 dark:bg-[#11151D]/80 p-4 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)]">
                                        <div className="flex items-center gap-3">
                                            <img src={post.author?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt={post.author?.name} className="h-11 w-11 rounded-2xl object-cover" />
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">{post.author?.name}</p>
                                                <p className="text-xs text-gray-500 dark:text-[#8A8F9C]">@{post.author?.username} • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-sm text-gray-700 dark:text-[#DADDE6] line-clamp-4 whitespace-pre-wrap">{post.content}</p>
                                        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-[#8A8F9C]">
                                            <span>❤️ {post.likes?.length || 0}</span>
                                            <span>💬 {post.comments?.length || 0}</span>
                                        </div>
                                    </motion.article>
                                ))}
                            </section>
                        )}

                        {showHashtags && (
                            <section className="lg:col-span-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Hashtags</h2>
                                    <span className="text-xs text-gray-500 dark:text-[#8A8F9C]">{results.hashtags.length}</span>
                                </div>
                                {results.hashtags.length === 0 ? (
                                    <div className="rounded-[1.5rem] border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#11151D]/80 p-5 text-sm text-gray-500 dark:text-[#8A8F9C]">No hashtags found.</div>
                                ) : results.hashtags.map((item) => (
                                    <button key={item.tag} onClick={() => setQuery(item.tag)} className="w-full rounded-[1.35rem] border border-gray-200 dark:border-white/10 bg-white/85 dark:bg-[#11151D]/80 px-4 py-4 text-left shadow-[0_16px_40px_-28px_rgba(0,0,0,0.35)] hover:border-[#D97B4F]/30 dark:hover:border-[#F5C36B]/30">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.tag}</p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-[#8A8F9C]">{item.count} post{item.count !== 1 ? 's' : ''}</p>
                                    </button>
                                ))}
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;