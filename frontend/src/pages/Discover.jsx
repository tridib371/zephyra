import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';

// ===== UNIQUE DISCOVER RADAR & CONSTELLATION NETWORK BACKGROUND =====
const DiscoverBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transform-gpu">
            {/* 1. Ambient Radial Searchlight Beacons (GPU Accelerated) */}
            <div className="absolute -top-32 -left-32 w-96 sm:w-[540px] h-96 sm:h-[540px] rounded-full bg-gradient-to-br from-[#FF8F6B]/20 via-[#D97B4F]/10 to-transparent blur-2xl transform-gpu" />
            <div className="absolute top-1/3 -right-28 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-bl from-[#F5C36B]/15 via-[#E2774C]/10 to-transparent blur-2xl transform-gpu" />

            {/* 2. Desktop Only Discovery Radar SVGs (Hidden on mobile for smooth 60fps scroll) */}
            <div className="hidden md:block transform-gpu">
                <div className="absolute -top-24 right-10 w-[520px] h-[520px] opacity-25">
                    <svg viewBox="0 0 400 400" className="w-full h-full">
                        <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-[#FF8F6B]" />
                        <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-[#F5C36B]" />
                        <circle cx="200" cy="200" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#FF8F6B]" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const Discover = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(new Set());
    const [togglingId, setTogglingId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users');
                const fetchedUsers = res.data.users || [];
                // Deduplicate users by _id in case backend returns duplicates
                const byId = new Map();
                fetchedUsers.forEach(u => { if (u && u._id) byId.set(u._id, u); });
                setUsers(Array.from(byId.values()));
                // Pre-populate following set
                const followingSet = new Set();
                fetchedUsers.forEach(u => {
                    if (u.followers?.some(f => f._id === currentUser?._id)) {
                        followingSet.add(u._id);
                    }
                });
                setFollowing(followingSet);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users:', err);
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentUser]);

    const handleFollowToggle = async (userId) => {
        const isFollow = following.has(userId);
        setTogglingId(userId);

        try {
            if (isFollow) {
                await api.delete(`/users/${userId}/unfollow`);
                setFollowing(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(userId);
                    return newSet;
                });
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u._id === userId
                            ? {
                                ...u,
                                followers: u.followers.filter(f => f._id !== currentUser._id),
                            }
                            : u
                    )
                );
            } else {
                await api.post(`/users/${userId}/follow`);
                setFollowing(prev => new Set(prev).add(userId));
                setUsers(prevUsers =>
                    prevUsers.map(u =>
                        u._id === userId
                            ? {
                                ...u,
                                followers: [...u.followers, { _id: currentUser._id }],
                            }
                            : u
                    )
                );
            }
        } catch (err) {
            console.error('Follow toggle error:', err);
            alert('Failed to update. Please try again.');
        } finally {
            setTogglingId(null);
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#0E1116] overflow-hidden">
                <DiscoverBackgroundAnimation />
                <div className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#F0C9AE] dark:bg-[#12151C]/90 backdrop-blur-xl border-2 border-black dark:border-[#FF8F6B]/35 shadow-[5px_5px_0px_#000000] dark:shadow-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9E3610] dark:border-[#FF8F6B]"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#9E3610] dark:text-[#FF8F6B]">
                        Scanning Creator Network...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300 overflow-x-hidden">
            {/* Unique Radar & Constellation Network Background */}
            <DiscoverBackgroundAnimation />

            <div className="relative max-w-4xl mx-auto space-y-6 z-10">
                {/* Header Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl rounded-3xl shadow-[5px_5px_0px_#000000] dark:shadow-xl p-6 sm:p-8 border-2 border-black dark:border-[#FF8F6B]/35 relative overflow-hidden"
                >
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF8F6B]/30 text-[#6B2207] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-black dark:border-[#FF8F6B]/40 text-[10px] font-black uppercase tracking-widest mb-3">
                        🌐 Creator Network
                    </span>
                    <h1 className="text-2xl sm:text-4xl font-['Fraunces'] italic font-bold text-[#1A0F08] dark:text-[#EDEBE6] tracking-tight">
                        Discover Creators
                    </h1>
                    <p className="text-[#402414] dark:text-[#9DA3B4] mt-1 text-xs sm:text-sm font-black">
                        Connect with authentic voices and explore new perspectives across Zephyra.
                    </p>
                </motion.div>

                {users.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl rounded-3xl shadow-[5px_5px_0px_#000000] dark:shadow-xl p-10 text-center border-2 border-black dark:border-[#FF8F6B]/35 space-y-3"
                    >
                        <p className="text-[#381F10] dark:text-[#8A8F9C] text-sm sm:text-base font-extrabold">
                            No other creators found in this frequency. Invite friends to join the network!
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {users.map((user, index) => {
                            const isFollowing = following.has(user._id);
                            const followerCount = user.followers?.length || 0;

                            return (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.4 }}
                                    whileHover={{ y: -4 }}
                                    className="bg-[#F0C9AE] dark:bg-[#12151C]/92 hover:bg-[#E8BC9F] dark:hover:bg-[#161B24] backdrop-blur-xl rounded-3xl shadow-[5px_5px_0px_#000000] dark:shadow-xl p-5 border-2 border-black dark:border-[#FF8F6B]/30 hover:border-[#EA580C] dark:hover:border-[#FF8F6B]/70 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <Link to={`/profile/${user._id}`} className="flex items-center gap-3.5 group">
                                        <div className="relative">
                                            <img
                                                src={user.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                alt={user.name}
                                                className="w-13 h-13 rounded-full object-cover border-2 border-black dark:border-[#FF8F6B]/60 shadow-xs group-hover:scale-105 transition-transform"
                                            />
                                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#10B981] border-2 border-black" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-[#1A0F08] dark:text-[#EDEBE6] group-hover:text-[#9E3610] dark:group-hover:text-[#F5C36B] truncate text-sm sm:text-base transition-colors">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-[#5C361E] dark:text-[#8A8F9C] truncate font-extrabold">
                                                @{user.username}
                                            </p>
                                            <p className="text-[11px] text-[#5C361E] dark:text-[#8A8F9C] mt-0.5 font-bold">
                                                {followerCount} follower{followerCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="mt-4 pt-3 border-t-2 border-black/15 dark:border-[#1F232C]">
                                        <button
                                            onClick={() => handleFollowToggle(user._id)}
                                            disabled={togglingId === user._id}
                                            className={`w-full py-2.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer border-2 border-black shadow-xs ${isFollowing
                                                ? 'bg-[#E2B293] dark:bg-[#1C202B] text-[#1A0F08] dark:text-[#EDEBE6] hover:bg-[#D59E7C] dark:hover:bg-[#252A36]'
                                                : 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] hover:scale-103'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {togglingId === user._id ? '...' : (isFollowing ? '✓ Following' : '+ Follow')}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Discover;