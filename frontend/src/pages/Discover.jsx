import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';

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
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1116]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D97B4F] dark:border-[#F5C36B]"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#F6EFE6] dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300"
        >
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-['Fraunces'] italic font-bold text-[#1F1710] dark:text-[#EDEBE6]">
                        Discover Creators
                    </h1>
                    <p className="text-[#5C4A3C] dark:text-[#8A8F9C] mt-1 text-sm font-medium">
                        Connect with authentic voices across the Zephyra community.
                    </p>
                </div>

                {users.length === 0 ? (
                    <div className="bg-[#FFFDF9] dark:bg-[#12151C] rounded-3xl shadow-[0_8px_30px_-10px_rgba(217,123,79,0.12)] p-8 text-center border border-[#E2D4C3] dark:border-[#1F232C]">
                        <p className="text-[#5C4A3C] dark:text-[#8A8F9C] text-sm">No other users found yet. Invite some friends to join!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => {
                            const isFollowing = following.has(user._id);
                            const followerCount = user.followers?.length || 0;

                            return (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-[#FFFDF9] dark:bg-[#12151C] rounded-3xl shadow-[0_8px_30px_-10px_rgba(217,123,79,0.12)] p-5 border border-[#E2D4C3] dark:border-[#1F232C] hover:border-[#D97B4F]/50 dark:hover:border-[#F5C36B]/30 transition-all duration-300"
                                >
                                    <Link to={`/profile/${user._id}`} className="flex items-center gap-4">
                                        <img
                                            src={user.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                            alt={user.name}
                                            className="w-13 h-13 rounded-full object-cover ring-2 ring-[#D97B4F]/40 dark:ring-[#F5C36B]/40"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-[#1F1710] dark:text-[#EDEBE6] truncate text-sm">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-[#665548] dark:text-[#6E7280] truncate font-mono">
                                                @{user.username}
                                            </p>
                                            <p className="text-[11px] text-[#877568] dark:text-[#6E7280] mt-0.5 font-medium">
                                                {followerCount} follower{followerCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="mt-4">
                                        <button
                                            onClick={() => handleFollowToggle(user._id)}
                                            disabled={togglingId === user._id}
                                            className={`w-full py-2.5 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer ${isFollowing
                                                ? 'border border-[#DECDBB] dark:border-[#3A3F4B] text-[#5C4A3C] dark:text-[#E7E6E3] hover:bg-[#EFE3D4] dark:hover:bg-[#1A1E27]'
                                                : 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] hover:scale-105 shadow-xs'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {togglingId === user._id ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Discover;