import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import {
    HiOutlineDocumentText,
    HiOutlinePhoto,
    HiOutlineFilm,
    HiOutlineSquares2X2,
} from 'react-icons/hi2';
import FollowListModal from '../components/FollowListModal';

// ===== UNIQUE SOLAR ORBIT HALO & IDENTITY PRISMS BACKGROUND =====
const ProfileBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <style>{`
                @keyframes solarOrbitRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes solarOrbitReverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes prismFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.35; }
                    50% { transform: translateY(-30px) rotate(180deg) scale(1.2); opacity: 0.8; }
                }
                @keyframes haloPulse {
                    0%, 100% { transform: scale(1); opacity: 0.35; }
                    50% { transform: scale(1.2); opacity: 0.7; }
                }
                .animate-solar-orbit {
                    animation: solarOrbitRotate 45s linear infinite;
                    transform-origin: center center;
                }
                .animate-solar-orbit-reverse {
                    animation: solarOrbitReverse 35s linear infinite;
                    transform-origin: center center;
                }
                .animate-prism-1 { animation: prismFloat 8s ease-in-out infinite; }
                .animate-prism-2 { animation: prismFloat 10s ease-in-out infinite 2.5s; }
                .animate-prism-3 { animation: prismFloat 9s ease-in-out infinite 5s; }
                .animate-halo-pulse { animation: haloPulse 8s ease-in-out infinite; }
            `}</style>

            {/* 1. Ambient Radial Solar Identity Flare */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] rounded-full bg-gradient-to-b from-[#FF8F6B]/25 via-[#F5C36B]/15 to-transparent blur-3xl animate-halo-pulse" />
            <div className="absolute -bottom-28 -left-28 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tr from-[#EA580C]/20 via-[#FF8F6B]/15 to-transparent blur-3xl" />
            <div className="absolute -bottom-28 -right-28 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tl from-[#F5C36B]/20 via-[#D97B4F]/15 to-transparent blur-3xl" />

            {/* 2. Concentric Solar Identity Orbit Rings (Top Centered) */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[520px] sm:w-[760px] h-[520px] sm:h-[760px] opacity-35 dark:opacity-25">
                <svg viewBox="0 0 600 600" className="w-full h-full animate-solar-orbit">
                    {/* Elliptical solar orbits */}
                    <circle cx="300" cy="300" r="280" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                    <circle cx="300" cy="300" r="220" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[#F5C36B] dark:text-[#F5C36B]" />
                    <circle cx="300" cy="300" r="160" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="text-[#EA580C] dark:text-[#FF8F6B]" />
                    {/* Orbiting celestial badges */}
                    <circle cx="300" cy="20" r="6" fill="#FF8F6B" className="shadow-md" />
                    <circle cx="520" cy="300" r="5" fill="#F5C36B" />
                    <circle cx="300" cy="580" r="5.5" fill="#EA580C" />
                    <circle cx="80" cy="300" r="5" fill="#D97B4F" />
                </svg>

                {/* Secondary Reverse Sub-Orbit */}
                <svg viewBox="0 0 600 600" className="absolute inset-0 w-full h-full animate-solar-orbit-reverse">
                    <circle cx="300" cy="300" r="250" fill="none" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 6" className="text-[#F5C36B]/60 dark:text-[#F5C36B]/50" />
                    <circle cx="300" cy="300" r="190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="5 8" className="text-[#D97B4F]/60 dark:text-[#FF8F6B]/50" />
                    <circle cx="480" cy="170" r="4" fill="#FF8F6B" />
                    <circle cx="120" cy="430" r="4.5" fill="#F5C36B" />
                </svg>
            </div>

            {/* 3. Floating Holographic Identity Crystals */}
            <div className="absolute top-[25%] left-[8%] animate-prism-1">
                <div className="w-8 h-8 rounded-xl border-2 border-[#D97B4F] dark:border-[#FF8F6B] rotate-45 flex items-center justify-center bg-[#FF8F6B]/15">
                    <div className="w-3 h-3 rounded-xs bg-[#EA580C] dark:bg-[#FF8F6B]" />
                </div>
            </div>
            <div className="absolute top-[40%] right-[10%] animate-prism-2">
                <div className="w-10 h-10 rounded-2xl border-2 border-[#F5C36B] dark:border-[#F5C36B] rotate-12 flex items-center justify-center bg-[#F5C36B]/15">
                    <div className="w-4 h-4 rounded-xs bg-[#D97B4F] dark:bg-[#F5C36B]" />
                </div>
            </div>
            <div className="absolute bottom-[20%] left-[12%] animate-prism-3">
                <div className="w-7 h-7 rounded-lg border-2 border-[#EA580C] dark:border-[#FF8F6B] rotate-45 flex items-center justify-center bg-[#EA580C]/15">
                    <div className="w-2.5 h-2.5 rounded-xs bg-[#FF8F6B]" />
                </div>
            </div>

            {/* 4. Ambient Floating Creator Badges */}
            <div className="absolute top-[18%] right-[18%] animate-prism-2 opacity-40 dark:opacity-30">
                <div className="px-3 py-1 rounded-full bg-[#FF8F6B]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase">
                    💎 Creator Crest
                </div>
            </div>
            <div className="absolute bottom-[24%] right-[20%] animate-prism-1 opacity-40 dark:opacity-30">
                <div className="px-3 py-1 rounded-full bg-[#F5C36B]/25 text-[#9E3610] dark:text-[#F5C36B] border border-black/20 dark:border-[#F5C36B]/40 text-[9px] font-black tracking-widest uppercase">
                    ⚡ Verified Voice
                </div>
            </div>
        </div>
    );
};

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

    // Live count update when following/unfollowing from modal
    const handleFollowToggleFromModal = (userId, isNowFollowing) => {
        if (profileUser && userId === profileUser._id) {
            setFollowersCount(prev => isNowFollowing ? prev + 1 : prev - 1);
            setIsFollowing(isNowFollowing);
        }

        const isOwnProfile = currentUser?._id === profileUser?._id;
        if (isOwnProfile) {
            setFollowingCount(prev => isNowFollowing ? prev + 1 : prev - 1);
        }

        if (modalOpen) {
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

    const getPostType = (post) => {
        if (post.image) {
            const imageUrl = post.image.toLowerCase();
            if (imageUrl.includes('.mp4') || imageUrl.includes('.webm') || imageUrl.includes('.mov') || imageUrl.includes('.avi')) {
                return {
                    type: 'video',
                    label: 'Video',
                    Icon: HiOutlineFilm,
                    className: 'bg-blue-100 text-blue-900 border border-black dark:bg-blue-900/40 dark:text-blue-300'
                };
            }
            if (imageUrl.includes('.gif')) {
                return {
                    type: 'gif',
                    label: 'GIF',
                    Icon: HiOutlineFilm,
                    className: 'bg-purple-100 text-purple-900 border border-black dark:bg-purple-900/40 dark:text-purple-300'
                };
            }
            return {
                type: 'photo',
                label: 'Photo',
                Icon: HiOutlinePhoto,
                className: 'bg-green-100 text-green-900 border border-black dark:bg-green-900/40 dark:text-green-300'
            };
        }
        return {
            type: 'text',
            label: 'Text',
            Icon: HiOutlineDocumentText,
            className: 'bg-[#FF8F6B]/30 text-[#6B2207] border border-black dark:bg-stone-700/40 dark:text-stone-300'
        };
    };

    const [activeFilter, setActiveFilter] = useState('all');

    const getFilteredPosts = () => {
        if (activeFilter === 'all') return userPosts;
        return userPosts.filter(post => getPostType(post).type === activeFilter);
    };

    const postStats = userPosts.reduce((acc, post) => {
        const { type } = getPostType(post);
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const filterTabs = [
        { key: 'all', label: 'All Posts', icon: HiOutlineSquares2X2 },
        { key: 'photo', label: 'Photos', icon: HiOutlinePhoto },
        { key: 'video', label: 'Videos', icon: HiOutlineFilm },
        { key: 'text', label: 'Text', icon: HiOutlineDocumentText },
    ];

    const filteredPosts = getFilteredPosts();

    if (loading) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#0E1116] overflow-hidden">
                <ProfileBackgroundAnimation />
                <div className="relative z-10 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9E3610] dark:border-[#FF8F6B]"></div>
            </div>
        );
    }

    if (!profileUser) {
        return (
            <div className="relative min-h-screen flex items-center justify-center bg-[#FAF7F2] dark:bg-[#0E1116] font-[Manrope] overflow-hidden">
                <ProfileBackgroundAnimation />
                <p className="relative z-10 text-xs font-black uppercase tracking-widest text-[#9E3610] dark:text-[#FF8F6B]">User not found.</p>
            </div>
        );
    }

    const isOwnProfile = currentUser?._id === profileUser._id;

    return (
        <>
            <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300 overflow-x-hidden">
                {/* Unique Solar Orbit & Identity Crystal Background */}
                <ProfileBackgroundAnimation />

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <div className="bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl rounded-3xl shadow-[6px_6px_0px_#000000] dark:shadow-2xl p-6 sm:p-9 border-2 border-black dark:border-[#FF8F6B]/35 transition-colors duration-300">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <div className="relative">
                                <img
                                    src={profileUser.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full object-cover border-2 border-black dark:border-[#FF8F6B]/70 shadow-md"
                                    onError={(e) => {
                                        e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                    }}
                                />
                                <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-[#10B981] border-2 border-black" />
                            </div>

                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A0F08] dark:text-[#EDEBE6] font-['Fraunces'] italic tracking-tight">
                                            {profileUser.name}
                                        </h1>
                                        <p className="text-xs sm:text-sm text-[#5C361E] dark:text-[#8A8F9C] font-extrabold">@{profileUser.username}</p>
                                    </div>
                                    <span className="self-center sm:self-auto inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF8F6B]/30 text-[#6B2207] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-black dark:border-[#FF8F6B]/40 text-[10px] font-black uppercase tracking-widest">
                                        ⚡ Creator Portfolio
                                    </span>
                                </div>

                                <p className="text-[#402414] dark:text-[#9DA3B4] mt-2.5 text-xs sm:text-sm font-extrabold leading-relaxed">
                                    {profileUser.bio || 'No bio yet.'}
                                </p>

                                <div className="flex justify-center sm:justify-start gap-6 mt-4 text-xs sm:text-sm text-[#5C361E] dark:text-[#8A8F9C] font-black">
                                    <button
                                        onClick={() => openModal('following')}
                                        className="hover:text-[#9E3610] dark:hover:text-[#F5C36B] transition-colors cursor-pointer"
                                    >
                                        <strong className="text-[#1A0F08] dark:text-[#EDEBE6] text-base">{followingCount}</strong> Following
                                    </button>
                                    <button
                                        onClick={() => openModal('followers')}
                                        className="hover:text-[#9E3610] dark:hover:text-[#F5C36B] transition-colors cursor-pointer"
                                    >
                                        <strong className="text-[#1A0F08] dark:text-[#EDEBE6] text-base">{followersCount}</strong> Followers
                                    </button>
                                </div>

                                {!isOwnProfile && (
                                    <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                        <button
                                            onClick={handleFollowToggle}
                                            disabled={isTogglingFollow}
                                            className={`px-6 py-2.5 rounded-full font-black text-xs transition-all duration-200 cursor-pointer border-2 border-black shadow-xs ${isFollowing
                                                ? 'bg-[#E2B293] dark:bg-[#1C202B] text-[#1A0F08] dark:text-[#EDEBE6] hover:bg-[#D59E7C] dark:hover:bg-[#252A36]'
                                                : 'bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] hover:scale-105'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {isTogglingFollow ? '...' : (isFollowing ? '✓ Following' : '+ Follow')}
                                        </button>

                                        <button
                                            onClick={() => navigate(`/messages?userId=${profileUser._id}`)}
                                            className="px-6 py-2.5 rounded-full font-black text-xs border-2 border-black bg-[#E2B293] dark:bg-[#1C202B] text-[#1A0F08] dark:text-[#EDEBE6] hover:bg-[#D59E7C] dark:hover:bg-[#252A36] transition-all duration-200 cursor-pointer shadow-xs"
                                        >
                                            💬 Message
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Post Type Stats */}
                        {userPosts.length > 0 && (
                            <div className="mt-6 flex flex-wrap gap-2.5 justify-center sm:justify-start text-xs font-black text-[#5C361E] dark:text-[#8A8F9C]">
                                {Object.entries(postStats).map(([type, count]) => {
                                    const typeMap = {
                                        photo: { label: 'Photos', Icon: HiOutlinePhoto },
                                        video: { label: 'Videos', Icon: HiOutlineFilm },
                                        text: { label: 'Text Posts', Icon: HiOutlineDocumentText },
                                    };
                                    const info = typeMap[type] || { label: type, Icon: HiOutlineDocumentText };
                                    const TypeIcon = info.Icon;
                                    return (
                                        <span key={type} className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E2B293] dark:bg-white/5 border-2 border-black/25 dark:border-[#1F232C] text-[#1A0F08] dark:text-[#EDEBE6]">
                                            <TypeIcon className="text-sm text-[#9E3610] dark:text-[#FF8F6B]" />
                                            <span>{count} {info.label}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        )}

                        {/* Filter Tabs */}
                        <div className="mt-6 border-t-2 border-black/15 dark:border-[#1F232C] pt-5">
                            <div className="flex flex-wrap gap-2">
                                {filterTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.key}
                                            onClick={() => setActiveFilter(tab.key)}
                                            className={`px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer border-2 border-black ${
                                                activeFilter === tab.key
                                                    ? 'bg-[#1A0F08] text-white dark:bg-white dark:text-[#1A140D] shadow-xs scale-103'
                                                    : 'bg-[#E2B293] dark:bg-[#12151C] text-[#1A0F08] dark:text-[#A0A5B2] hover:bg-[#D59E7C]'
                                            }`}
                                        >
                                            {Icon && <Icon className="text-sm" />}
                                            <span>{tab.label}</span>
                                            {postStats[tab.key] > 0 && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#D59E7C] dark:bg-[#202532] text-[#1A0F08] dark:text-white font-black border border-black/30">
                                                    {postStats[tab.key]}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Posts Grid */}
                        <div className="mt-5">
                            {postsLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9E3610] dark:border-[#FF8F6B]"></div>
                                </div>
                            ) : filteredPosts.length === 0 ? (
                                <div className="text-center py-12 space-y-2">
                                    <p className="text-[#402414] dark:text-[#8A8F9C] font-extrabold text-sm sm:text-base">
                                        {activeFilter === 'all'
                                            ? (isOwnProfile ? "You haven't posted anything yet." : `${profileUser.name} hasn't posted anything yet.`)
                                            : `No ${activeFilter} posts found.`}
                                    </p>
                                    {isOwnProfile && activeFilter === 'all' && (
                                        <Link
                                            to="/create"
                                            className="inline-block mt-3 px-6 py-2.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-black text-xs uppercase tracking-wider rounded-full hover:scale-105 transition-all border-2 border-black shadow-xs"
                                        >
                                            Create Your First Story →
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {filteredPosts.map((post) => {
                                        const postType = getPostType(post);
                                        const CardIcon = postType.Icon;
                                        return (
                                            <Link
                                                key={post._id}
                                                to={`/post/${post._id}`}
                                                className="aspect-square bg-[#E2B293] dark:bg-[#1A1E27] rounded-2xl overflow-hidden relative group cursor-pointer border-2 border-black dark:border-[#1F232C] shadow-xs"
                                            >
                                                {post.image ? (
                                                    <img
                                                        src={post.image}
                                                        alt="Post"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[#5C361E] dark:text-[#6E7280]">
                                                        <CardIcon className="text-3xl" />
                                                    </div>
                                                )}
                                                {/* Overlay */}
                                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-center">
                                                    <CardIcon className="text-white text-2xl mb-1" />
                                                    <span className="text-white text-xs font-black px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                                        {postType.label}
                                                    </span>
                                                    <div className="flex items-center gap-3 mt-2 text-white text-xs font-black">
                                                        <span className="flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-rose-400">
                                                                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                                            </svg>
                                                            {post.likes?.length || 0}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-amber-300">
                                                                <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" />
                                                            </svg>
                                                            {post.comments?.length || 0}
                                                        </span>
                                                    </div>
                                                </div>
                                                {/* Badge */}
                                                <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-black shadow-xs ${postType.className}`}>
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
            </div>

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