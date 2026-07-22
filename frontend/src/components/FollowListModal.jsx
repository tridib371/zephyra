import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const FollowListModal = ({ isOpen, onClose, users, title, onFollowToggle }) => {
    const { user: currentUser } = useAuth();
    const [togglingId, setTogglingId] = useState(null);
    const [following, setFollowing] = useState(new Set());

    if (!isOpen) return null;

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
                // Update parent
                if (onFollowToggle) onFollowToggle(userId, false);
            } else {
                await api.post(`/users/${userId}/follow`);
                setFollowing(prev => new Set(prev).add(userId));
                if (onFollowToggle) onFollowToggle(userId, true);
            }
        } catch (err) {
            console.error('Follow toggle error:', err);
            alert('Failed to update. Please try again.');
        } finally {
            setTogglingId(null);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-[#12151C] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#1F232C] p-6 sm:p-8 max-w-md w-full max-h-[80vh] flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-[#1F232C]">
                        <h3 className="font-['Fraunces'] italic text-xl sm:text-2xl text-gray-900 dark:text-[#EDEBE6]">
                            {title}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#1A1E27] transition-colors text-gray-500 dark:text-[#6E7280]"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                        {users.length === 0 ? (
                            <p className="text-center text-gray-500 dark:text-[#8A8F9C] py-8 font-[Manrope]">
                                No {title.toLowerCase()} yet.
                            </p>
                        ) : (
                            users.map((user) => {
                                const isOwn = user._id === currentUser?._id;
                                const isFollowing = following.has(user._id);
                                const followerCount = user.followers?.length || 0;

                                return (
                                    <div
                                        key={user._id}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1A1E27] transition-colors"
                                    >
                                        <Link to={`/profile/${user._id}`} onClick={onClose} className="flex items-center gap-3 flex-1 min-w-0">
                                            <img
                                                src={user.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D97B4F]/40 dark:ring-[#F5C36B]/40 flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-[#EDEBE6] truncate font-[Manrope]">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-[#6E7280] truncate font-[Manrope]">
                                                    @{user.username}
                                                </p>
                                            </div>
                                        </Link>
                                        {!isOwn && (
                                            <button
                                                onClick={() => handleFollowToggle(user._id)}
                                                disabled={togglingId === user._id}
                                                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex-shrink-0 font-[Manrope] ${isFollowing
                                                        ? 'border border-gray-300 dark:border-[#3A3F4B] text-gray-700 dark:text-[#E7E6E3] hover:bg-gray-50 dark:hover:bg-[#1A1E27]'
                                                        : 'bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] hover:brightness-105 hover:shadow-[0_0_15px_-4px_rgba(255,143,107,0.5)]'
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {togglingId === user._id ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
                                            </button>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FollowListModal;