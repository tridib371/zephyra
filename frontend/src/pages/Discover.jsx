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
            className="min-h-screen bg-white dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300"
        >
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-['Fraunces'] italic text-gray-900 dark:text-[#EDEBE6] mb-2">
                    Discover People
                </h1>
                <p className="text-gray-500 dark:text-[#8A8F9C] mb-6">
                    Connect with others on Zephyra.
                </p>

                {users.length === 0 ? (
                    <div className="bg-white dark:bg-[#12151C] rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-[#1F232C]">
                        <p className="text-gray-500 dark:text-[#8A8F9C]">No other users found yet. Invite some friends!</p>
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
                                    className="bg-white dark:bg-[#12151C] rounded-2xl shadow-lg p-5 border border-gray-200 dark:border-[#1F232C] hover:border-[#D97B4F]/30 dark:hover:border-[#F5C36B]/30 transition-all duration-300"
                                >
                                    <Link to={`/profile/${user._id}`} className="flex items-center gap-4">
                                        <img
                                            src={user.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                            alt={user.name}
                                            className="w-14 h-14 rounded-full object-cover ring-2 ring-[#D97B4F]/40 dark:ring-[#F5C36B]/40"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 dark:text-[#EDEBE6] truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-[#6E7280] truncate">
                                                @{user.username}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-[#6E7280]">
                                                {followerCount} follower{followerCount !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="mt-3">
                                        <button
                                            onClick={() => handleFollowToggle(user._id)}
                                            disabled={togglingId === user._id}
                                            className={`w-full py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isFollowing
                                                ? 'border border-gray-300 dark:border-[#3A3F4B] text-gray-700 dark:text-[#E7E6E3] hover:bg-gray-50 dark:hover:bg-[#1A1E27]'
                                                : 'bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] hover:brightness-105 hover:shadow-[0_0_15px_-4px_rgba(255,143,107,0.5)]'
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