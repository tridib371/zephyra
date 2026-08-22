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
                    Icon: HiOutlineFilm,
                    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                };
            }
            if (imageUrl.includes('.gif')) {
                return {
                    type: 'gif',
                    label: 'GIF',
                    Icon: HiOutlineFilm,
                    className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                };
            }
            return {
                type: 'photo',
                label: 'Photo',
                Icon: HiOutlinePhoto,
                className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
            };
        }
        return {
            type: 'text',
            label: 'Text',
            Icon: HiOutlineDocumentText,
            className: 'bg-stone-100 text-stone-700 dark:bg-stone-700/30 dark:text-stone-300'
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
                className="min-h-screen bg-[#F8F9FA] dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300"
            >
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-white dark:bg-[#12151C] rounded-3xl shadow-xs p-6 sm:p-8 border border-[#EAECF0] dark:border-[#1F232C] transition-colors duration-300">
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
                                <h1 className="text-3xl font-bold text-[#101828] dark:text-[#EDEBE6]">
                                    {profileUser.name}
                                </h1>
                                <p className="text-[#667085] dark:text-[#6E7280]">@{profileUser.username}</p>
                                <p className="text-[#475467] dark:text-[#8A8F9C] mt-2 font-medium">
                                    {profileUser.bio || 'No bio yet.'}
                                </p>
                                <div className="flex justify-center sm:justify-start gap-6 mt-3 text-sm text-[#475467] dark:text-[#8A8F9C]">
                                    <button
                                        onClick={() => openModal('following')}
                                        className="hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors cursor-pointer"
                                    >
                                        <strong className="text-[#101828] dark:text-[#EDEBE6]">{followingCount}</strong> Following
                                    </button>
                                    <button
                                        onClick={() => openModal('followers')}
                                        className="hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors cursor-pointer"
                                    >
                                        <strong className="text-[#101828] dark:text-[#EDEBE6]">{followersCount}</strong> Followers
                                    </button>
                                </div>

                                {!isOwnProfile && (
                                    <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={isTogglingFollow}
                                            className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer ${isFollowing
                                                ? 'border border-[#EAECF0] dark:border-[#3A3F4B] text-[#344054] dark:text-[#E7E6E3] hover:bg-[#F2F4F7] dark:hover:bg-[#1A1E27]'
                                                : 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold hover:scale-105 shadow-xs'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isTogglingFollow ? '...' : (isFollowing ? 'Unfollow' : 'Follow')}
                                        </button>

                                        <button
                                            onClick={() => navigate(`/messages?userId=${profileUser._id}`)}
                                            className="px-6 py-2 rounded-full font-semibold text-sm border border-[#EAECF0] dark:border-[#3A3F4B] text-[#344054] dark:text-[#E7E6E3] hover:bg-[#F2F4F7] dark:hover:bg-[#1A1E27] transition-all duration-200 cursor-pointer"
                                        >
                                            Message
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Post Type Stats */}
                        {userPosts.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-3 justify-center sm:justify-start text-xs font-bold text-[#475467] dark:text-[#8A8F9C]">
                                {Object.entries(postStats).map(([type, count]) => {
                                    const typeMap = {
                                        photo: { label: 'Photos', Icon: HiOutlinePhoto },
                                        video: { label: 'Videos', Icon: HiOutlineFilm },
                                        text: { label: 'Text Posts', Icon: HiOutlineDocumentText },
                                    };
                                    const info = typeMap[type] || { label: type, Icon: HiOutlineDocumentText };
                                    const TypeIcon = info.Icon;
                                    return (
                                        <span key={type} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8F9FA] dark:bg-white/5 border border-[#EAECF0] dark:border-[#1F232C]">
                                            <TypeIcon className="text-sm text-[#D97B4F]" />
                                            <span>{count} {info.label}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Filter Tabs */}
                        <div className="mt-6 border-t border-[#EAECF0] dark:border-[#1F232C] pt-4">
                            <div className="flex flex-wrap gap-1 sm:gap-2">
                                {filterTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveFilter(tab.key)}
                                            className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                                                activeFilter === tab.key
                                                    ? 'bg-[#101828] text-white dark:bg-white dark:text-[#1A140D] shadow-xs scale-105'
                                                    : 'bg-[#F8F9FA] dark:bg-[#12151C] border border-[#EAECF0] dark:border-[#252A36] text-[#344054] dark:text-[#A0A5B2] hover:bg-[#F2F4F7]'
                                            }`}
                                        >
                                            {Icon && <Icon className="text-sm" />}
                                            <span>{tab.label}</span>
                                            {postStats[tab.key] > 0 && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EAECF0] dark:bg-[#202532] text-[#344054]">
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
                                    <p className="text-[#475467] dark:text-[#8A8F9C] font-[Manrope] text-sm">
                                        {activeFilter === 'all'
                                            ? (isOwnProfile ? "You haven't posted anything yet." : `${profileUser.name} hasn't posted anything yet.`)
                                            : `No ${activeFilter} posts found.`}
                                    </p>
                                    {isOwnProfile && activeFilter === 'all' && (
                                        <Link
                                            to="/create"
                                            className="inline-block mt-3 px-6 py-2.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-xs rounded-full hover:scale-105 transition-all shadow-xs font-[Manrope]"
                                        >
                                            Create Your First Post
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 gap-2">
                                    {filteredPosts.map((post) => {
                                        const postType = getPostType(post);
                                        const CardIcon = postType.Icon;
                                        return (
                                            <Link
                                                key={post._id}
                                                to={`/post/${post._id}`}
                                                className="aspect-square bg-[#F8F9FA] dark:bg-[#1A1E27] rounded-2xl overflow-hidden relative group cursor-pointer border border-[#EAECF0] dark:border-[#1F232C]"
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
                                                    <div className="w-full h-full flex items-center justify-center text-stone-400 dark:text-[#6E7280]">
                                                        <CardIcon className="text-3xl" />
                                                    </div>
                                                )}
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                                                    <CardIcon className="text-white text-2xl mb-1" />
                                                    <span className="text-white text-xs font-extrabold font-[Manrope] px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                                                        {postType.label}
                                                    </span>
                                                    <div className="flex items-center gap-3 mt-2 text-white text-xs font-bold">
                                                        <span className="flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-rose-400">
                                                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                                            </svg>
                                                            {post.likes?.length || 0}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-amber-300">
                                                                <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
                                                            </svg>
                                                            {post.comments?.length || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Badge */}
                                                <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs ${postType.className}`}>
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