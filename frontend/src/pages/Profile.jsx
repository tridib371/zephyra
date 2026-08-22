import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
    HiOutlineDocumentText,
    HiOutlinePhoto,
    HiOutlineFilm,
    HiOutlineSquares2X2,
} from 'react-icons/hi2';
import FollowListModal from '../components/FollowListModal';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('followers');
    const [modalUsers, setModalUsers] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);

    const fetchProfile = async () => {
        try {
            const userId = id || currentUser?._id;
            if (!userId) return;

            const res = await api.get(`/users/profile/${userId}`);
            const userData = res.data.user;
            setProfileUser(userData);
            setFollowersCount(userData.followers?.length || 0);
            setFollowingCount(userData.following?.length || 0);

            if (currentUser && userData._id !== currentUser._id) {
                const isFollow = userData.followers?.some(
                    (f) => f._id === currentUser._id
                ) || false;
                setIsFollowing(isFollow);
            } else {
                setIsFollowing(false);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const userId = id || currentUser?._id;
            if (!userId) return;

            const res = await api.get(`/posts/user/${userId}`);
            setUserPosts(res.data.posts || []);
            setPostsLoading(false);
        } catch (err) {
            console.error('Error fetching user posts:', err);
            setPostsLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchProfile();
        fetchUserPosts();
    }, [id, currentUser, isAuthenticated, navigate]);

    const handleFollowToggle = async () => {
        if (!profileUser) return;
        setIsTogglingFollow(true);

        try {
            if (isFollowing) {
                await api.delete(`/users/${profileUser._id}/unfollow`);
                setIsFollowing(false);
                setFollowersCount(prev => prev - 1);
            } else {
                await api.post(`/users/${profileUser._id}/follow`);
                setIsFollowing(true);
                setFollowersCount(prev => prev + 1);
            }
        } catch (err) {
            console.error('Follow toggle error:', err);
            alert('Failed to update follow status. Please try again.');
        } finally {
            setIsTogglingFollow(false);
        }
    };

    const openModal = async (type) => {
        if (!profileUser) return;
        setModalType(type);
        setModalLoading(true);
        setModalOpen(true);
        try {
            const endpoint = type === 'followers' ? 'followers' : 'following';
            const res = await api.get(`/users/${profileUser._id}/${endpoint}`);
            setModalUsers(res.data[type] || []);
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            alert(`Failed to load ${type}. Please try again.`);
            setModalOpen(false);
        } finally {
            setModalLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalUsers([]);
    };

    // ===== FIX: Live count update when following/unfollowing from modal =====
    const handleFollowToggleFromModal = (userId, isNowFollowing) => {
        // If the action involves the profile user (someone else viewing your profile)
        if (profileUser && userId === profileUser._id) {
            setFollowersCount(prev => isNowFollowing ? prev + 1 : prev - 1);
            setIsFollowing(isNowFollowing);
        }

        // If this is the current user's own profile, update following count
        // Because we're viewing our own profile and following/unfollowing someone
        const isOwnProfile = currentUser?._id === profileUser?._id;
        if (isOwnProfile) {
            setFollowingCount(prev => isNowFollowing ? prev + 1 : prev - 1);
        }

        // Refresh the modal data to reflect the change
        if (modalOpen) {
            // Re-fetch the list with updated data
            const fetchUpdatedList = async () => {
                try {
                    const endpoint = modalType === 'followers' ? 'followers' : 'following';
                    const res = await api.get(`/users/${profileUser?._id}/${endpoint}`);
                    setModalUsers(res.data[modalType] || []);
                } catch (err) {
                    console.error('Error refreshing modal list:', err);
                }
            };
            fetchUpdatedList();
        }
    };

    // ===== Helper function to determine post type =====
    const getPostType = (post) => {
        if (post.image) {
            const imageUrl = post.image.toLowerCase();
            if (imageUrl.includes('.mp4') || imageUrl.includes('.webm') || imageUrl.includes('.mov') || imageUrl.includes('.avi')) {
                return {
                    type: 'video',
                    label: 'Video',
                    icon: '🎬',
                    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                };
            }
            if (imageUrl.includes('.gif')) {
                return {
                    type: 'gif',
                    label: 'GIF',
                    icon: '🎞️',
                    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                };
            }
            return {
                type: 'photo',
                label: 'Photo',
                icon: '📷',
                className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            };
        }
        return {
            type: 'text',
            label: 'Text',
            icon: '📝',
            className: 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300'
        };
    };

    // Filter posts based on active filter
    const [activeFilter, setActiveFilter] = useState('all');

    const getFilteredPosts = () => {
        if (activeFilter === 'all') return userPosts;
        return userPosts.filter(post => getPostType(post).type === activeFilter);
    };

    // Count posts by type for stats
    const postStats = userPosts.reduce((acc, post) => {
        const { type } = getPostType(post);
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    // Filter tabs configuration
    const filterTabs = [
        { key: 'all', label: 'All Posts', icon: HiOutlineSquares2X2 },
        { key: 'photo', label: 'Photos', icon: HiOutlinePhoto },
        { key: 'video', label: 'Videos', icon: HiOutlineFilm },
        { key: 'text', label: 'Text', icon: HiOutlineDocumentText },
    ];

    const filteredPosts = getFilteredPosts();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1116]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D97B4F] dark:border-[#F5C36B]"></div>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1116] font-[Manrope]">
                <p className="text-gray-500 dark:text-[#8A8F9C]">User not found.</p>
            </div>
        );
    }

    const isOwnProfile = currentUser?._id === profileUser._id;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300"
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white/95 dark:bg-[#12151C] rounded-3xl shadow-sm p-6 sm:p-8 border border-[#EAE2D5] dark:border-[#1F232C] transition-colors duration-300">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <img
                                src={profileUser.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover ring-4 ring-[#D97B4F]/60 dark:ring-[#F5C36B]/60"
                                onError={(e) => {
                                    e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                }}
                            />
                            <div className="flex-1 text-center sm:text-left">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-[#EDEBE6]">
                                    {profileUser.name}
                                </h1>
                                <p className="text-gray-500 dark:text-[#6E7280]">@{profileUser.username}</p>
                                <p className="text-gray-600 dark:text-[#8A8F9C] mt-2">
                                    {profileUser.bio || 'No bio yet.'}
                                </p>
                                <div className="flex justify-center sm:justify-start gap-6 mt-3 text-sm text-gray-600 dark:text-[#8A8F9C]">
                                    <button
                                        onClick={() => openModal('following')}
                                        className="hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors cursor-pointer"
                                    >
                                        <strong className="text-gray-900 dark:text-[#EDEBE6]">{followingCount}</strong> Following
                                    </button>
                                    <button
                                        onClick={() => openModal('followers')}
                                        className="hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors cursor-pointer"
                                    >
                                        <strong className="text-gray-900 dark:text-[#EDEBE6]">{followersCount}</strong> Followers
                                    </button>
                                </div>

                                {!isOwnProfile && (
                                    <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={isTogglingFollow}
                                            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${isFollowing
                                                ? 'border border-gray-300 dark:border-[#3A3F4B] text-gray-700 dark:text-[#E7E6E3] hover:bg-gray-50 dark:hover:bg-[#1A1E27]'
                                                : 'bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)]'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isTogglingFollow ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
                                        </button>

                                        <button
                                            onClick={() => navigate(`/messages?userId=${profileUser._id}`)}
                                            className="px-6 py-2 rounded-full font-semibold text-sm border border-gray-300 dark:border-[#3A3F4B] text-gray-700 dark:text-[#E7E6E3] hover:bg-gray-50 dark:hover:bg-[#1A1E27] transition-all duration-200"
                                        >
                                            Message
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Post Type Stats */}
                        {userPosts.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start text-sm text-gray-500 dark:text-[#6E7280]">
                                {Object.entries(postStats).map(([type, count]) => {
                                    const typeMap = {
                                        photo: { label: 'Photos', icon: '📷' },
                                        video: { label: 'Videos', icon: '🎬' },
                                        gif: { label: 'GIFs', icon: '🎞️' },
                                        text: { label: 'Text Posts', icon: '📝' },
                                    };
                                    const info = typeMap[type] || { label: type, icon: '📄' };
                                    return (
                                        <span key={type}>
                                            {info.icon} {count} {info.label}
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Filter Tabs */}
                        <div className="mt-6 border-t border-[#EAE2D5] dark:border-[#1F232C] pt-4">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                {filterTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveFilter(tab.key)}
                                            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                                                activeFilter === tab.key
                                                    ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] shadow-xs'
                                                    : 'bg-white/80 dark:bg-[#12151C] border border-[#EAE2D5] dark:border-[#252A36] text-stone-600 dark:text-[#A0A5B2] hover:border-stone-300'
                                            }`}
                                        >
                                            {Icon && <Icon className="text-sm" />}
                                            <span>{tab.label}</span>
                                            {postStats[tab.key] > 0 && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 dark:bg-[#202532] text-stone-500">
                                                    {postStats[tab.key]}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="mt-4">
                            {postsLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#D97B4F] dark:border-[#F5C36B]"></div>
                                </div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 dark:text-[#8A8F9C] font-[Manrope]">
                                        {activeFilter === 'all'
                                            ? (isOwnProfile ? "You haven't posted anything yet. 🌬️" : `${profileUser.name} hasn't posted anything yet.`)
                                            : `No ${activeFilter} posts found.`}
                                    </p>
                                    {isOwnProfile && activeFilter === 'all' && (
                                        <Link
                                            to="/create"
                                            className="inline-block mt-3 px-6 py-2 bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-semibold rounded-full hover:brightness-105 transition-all duration-200 font-[Manrope]"
                                        >
                                            Create Your First Post
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {filteredPosts.map((post) => {
                                        const postType = getPostType(post);
                                        return (
                                            <Link
                                                key={post._id}
                                                to={`/post/${post._id}`}
                                                className="aspect-square bg-gray-100 dark:bg-[#1A1E27] rounded-xl overflow-hidden relative group cursor-pointer"
                                            >
                                                {post.image ? (
                                                    <img
                                                        src={post.image}
                                                        alt="Post"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-[#6E7280] text-4xl">
                                                        {postType.icon}
                                                    </div>
                                                )}
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                                                    <span className="text-white text-3xl mb-1">{postType.icon}</span>
                                                    <span className="text-white text-xs font-medium font-[Manrope] px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                                                        {postType.label}
                                                    </span>
                                                    <div className="flex items-center gap-4 mt-2 text-white text-sm">
                                                        <span className="flex items-center gap-1">❤️ {post.likes?.length || 0}</span>
                                                        <span className="flex items-center gap-1">💬 {post.comments?.length || 0}</span>
                                                    </div>
                                                </div>
                                                {/* Badge */}
                                                <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium ${postType.className}`}>
                                                    {postType.label}
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            <FollowListModal
                isOpen={modalOpen}
                onClose={closeModal}
                users={modalUsers}
                title={modalType === 'followers' ? 'Followers' : 'Following'}
                onFollowToggle={handleFollowToggleFromModal}
            />
        </>
    );
};

export default Profile;