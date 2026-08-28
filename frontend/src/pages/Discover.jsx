import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';

// ===== UNIQUE DISCOVER RADAR & CONSTELLATION NETWORK BACKGROUND =====
const DiscoverBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <style>{`
                @keyframes radarSweep {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes radarSweepReverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes nodePulse {
                    0%, 100% { transform: scale(1); opacity: 0.35; }
                    50% { transform: scale(1.6); opacity: 0.9; }
                }
                @keyframes beamFloat {
                    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.45; }
                    50% { transform: translate(-30px, 40px) scale(1.15); opacity: 0.75; }
                }
                @keyframes beaconFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-25px) rotate(180deg); }
                }
                .animate-radar-sweep {
                    animation: radarSweep 32s linear infinite;
                    transform-origin: center center;
                }
                .animate-radar-reverse {
                    animation: radarSweepReverse 48s linear infinite;
                    transform-origin: center center;
                }
                .animate-node-p1 { animation: nodePulse 4s ease-in-out infinite; }
                .animate-node-p2 { animation: nodePulse 5.5s ease-in-out infinite 1.2s; }
                .animate-node-p3 { animation: nodePulse 6s ease-in-out infinite 2.5s; }
                .animate-beam-float { animation: beamFloat 14s ease-in-out infinite; }
                .animate-beacon { animation: beaconFloat 9s ease-in-out infinite; }
            `}</style>

            {/* 1. Ambient Radial Searchlight Beacons */}
            <div className="absolute -top-32 -left-32 w-96 sm:w-[540px] h-96 sm:h-[540px] rounded-full bg-gradient-to-br from-[#FF8F6B]/25 via-[#D97B4F]/15 to-transparent blur-3xl animate-beam-float" />
            <div className="absolute top-1/3 -right-28 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-bl from-[#F5C36B]/20 via-[#E2774C]/15 to-transparent blur-3xl animate-beam-float" style={{ animationDelay: '-7s' }} />
            <div className="absolute -bottom-32 left-1/4 w-96 sm:w-[500px] h-96 sm:h-[500px] rounded-full bg-gradient-to-tr from-[#EA580C]/20 via-[#F5C36B]/10 to-transparent blur-3xl animate-beam-float" style={{ animationDelay: '-3.5s' }} />

            {/* 2. Rotating Discovery Radar Compass (Top-Right) */}
            <div className="absolute -top-24 -right-24 sm:right-10 w-[360px] sm:w-[520px] h-[360px] sm:h-[520px] opacity-35 dark:opacity-25">
                <svg viewBox="0 0 400 400" className="w-full h-full animate-radar-sweep">
                    {/* Concentric rings */}
                    <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                    <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-[#C25828] dark:text-[#F5C36B]" />
                    <circle cx="200" cy="200" r="90" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                    <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" className="text-[#E2774C] dark:text-[#FF8F6B]" />
                    {/* Crosshair axis */}
                    <line x1="10" y1="200" x2="390" y2="200" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="text-[#D97B4F]/60 dark:text-[#FF8F6B]/50" />
                    <line x1="200" y1="10" x2="200" y2="390" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" className="text-[#D97B4F]/60 dark:text-[#FF8F6B]/50" />
                    {/* Radar Target Markers */}
                    <circle cx="200" cy="60" r="4" fill="currentColor" className="text-[#EA580C] dark:text-[#FF8F6B]" />
                    <circle cx="330" cy="200" r="5" fill="currentColor" className="text-[#D97B4F] dark:text-[#F5C36B]" />
                    <circle cx="110" cy="290" r="3.5" fill="currentColor" className="text-[#C25828] dark:text-[#FF8F6B]" />
                </svg>
            </div>

            {/* 3. Secondary Reverse Radar (Bottom-Left) */}
            <div className="absolute -bottom-28 -left-28 sm:left-4 w-[300px] sm:w-[440px] h-[300px] sm:h-[440px] opacity-25 dark:opacity-20">
                <svg viewBox="0 0 400 400" className="w-full h-full animate-radar-reverse">
                    <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" className="text-[#F5C36B] dark:text-[#F5C36B]" />
                    <circle cx="200" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                    <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" className="text-[#EA580C] dark:text-[#FF8F6B]" />
                    <line x1="60" y1="60" x2="340" y2="340" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="text-[#D97B4F]/40 dark:text-[#FF8F6B]/30" />
                    <line x1="60" y1="340" x2="340" y2="60" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" className="text-[#D97B4F]/40 dark:text-[#FF8F6B]/30" />
                </svg>
            </div>

            {/* 4. Creator Constellation Network Vectors */}
            <svg className="absolute inset-0 w-full h-full opacity-35 dark:opacity-25" xmlns="http://www.w3.org/2000/svg">
                {/* Interconnecting Network Strands */}
                <line x1="12%" y1="18%" x2="28%" y2="32%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                <line x1="28%" y1="32%" x2="45%" y2="20%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" className="text-[#F5C36B] dark:text-[#F5C36B]" />
                <line x1="45%" y1="20%" x2="72%" y2="28%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" className="text-[#E2774C] dark:text-[#FF8F6B]" />
                <line x1="72%" y1="28%" x2="88%" y2="15%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="5 5" className="text-[#D97B4F] dark:text-[#F5C36B]" />
                <line x1="28%" y1="32%" x2="35%" y2="58%" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-[#C25828] dark:text-[#FF8F6B]" />
                <line x1="35%" y1="58%" x2="62%" y2="68%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-[#F5C36B] dark:text-[#F5C36B]" />
                <line x1="62%" y1="68%" x2="85%" y2="54%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" className="text-[#EA580C] dark:text-[#FF8F6B]" />
                <line x1="35%" y1="58%" x2="18%" y2="82%" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                <line x1="62%" y1="68%" x2="75%" y2="88%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4" className="text-[#F5C36B] dark:text-[#F5C36B]" />

                {/* Pulsing Star Nodes */}
                <circle cx="12%" cy="18%" r="4.5" fill="#FF8F6B" className="animate-node-p1" />
                <circle cx="28%" cy="32%" r="5.5" fill="#F5C36B" className="animate-node-p2" />
                <circle cx="45%" cy="20%" r="4" fill="#D97B4F" className="animate-node-p3" />
                <circle cx="72%" cy="28%" r="5" fill="#FF8F6B" className="animate-node-p1" />
                <circle cx="88%" cy="15%" r="4" fill="#F5C36B" className="animate-node-p2" />
                <circle cx="35%" cy="58%" r="5" fill="#E2774C" className="animate-node-p3" />
                <circle cx="62%" cy="68%" r="5.5" fill="#FF8F6B" className="animate-node-p1" />
                <circle cx="85%" cy="54%" r="4.5" fill="#F5C36B" className="animate-node-p2" />
                <circle cx="18%" cy="82%" r="4" fill="#D97B4F" className="animate-node-p3" />
                <circle cx="75%" cy="88%" r="5" fill="#FF8F6B" className="animate-node-p1" />
            </svg>

            {/* 5. Floating Geometric Discovery Beacons */}
            <div className="absolute top-[22%] left-[8%] animate-beacon opacity-40 dark:opacity-30">
                <div className="w-3.5 h-3.5 border-2 border-[#EA580C] dark:border-[#FF8F6B] rotate-45" />
            </div>
            <div className="absolute top-[48%] right-[10%] animate-beacon opacity-40 dark:opacity-30" style={{ animationDelay: '-4s' }}>
                <div className="w-4 h-4 border-2 border-[#D97B4F] dark:border-[#F5C36B] rotate-12" />
            </div>
            <div className="absolute bottom-[20%] left-[22%] animate-beacon opacity-35 dark:opacity-25" style={{ animationDelay: '-6.5s' }}>
                <div className="w-3 h-3 border-2 border-[#F5C36B] dark:border-[#FF8F6B] rotate-45" />
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