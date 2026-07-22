import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import FollowListModal from '../components/FollowListModal';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isTogglingFollow, setIsTogglingFollow] = useState(false);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('followers'); // 'followers' or 'following'
    const [modalUsers, setModalUsers] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

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

        fetchProfile();
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

    // Open modal with followers or following list
    const openModal = async (type) => {
        if (!profileUser) return;
        setModalType(type);
        setLoading(true);
        try {
            const endpoint = type === 'followers' ? 'followers' : 'following';
            const res = await api.get(`/users/${profileUser._id}/${endpoint}`);
            setModalUsers(res.data[type] || []);
            setModalOpen(true);
        } catch (err) {
            console.error(`Error fetching ${type}:`, err);
            alert(`Failed to load ${type}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setModalUsers([]);
    };

    // Update follow state after modal action
    const handleFollowToggleFromModal = (userId, isNowFollowing) => {
        // Update followers count if the user is the profile owner
        if (profileUser && userId === profileUser._id) {
            setFollowersCount(prev => isNowFollowing ? prev + 1 : prev - 1);
            setIsFollowing(isNowFollowing);
        }
        // Refresh the modal list
        openModal(modalType);
    };

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
                className="min-h-screen bg-white dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300"
            >
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-[#12151C] rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-[#1F232C] transition-colors duration-300">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                            <img
                                src={profileUser.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                alt="Profile"
                                className="w-28 h-28 rounded-full object-cover ring-4 ring-[#D97B4F]/60 dark:ring-[#F5C36B]/60"
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

                                {/* Follow Button */}
                                {!isOwnProfile && (
                                    <button
                                        onClick={handleFollowToggle}
                                        disabled={isTogglingFollow}
                                        className={`mt-4 px-6 py-2 rounded-full font-semibold text-sm transition-all duration-200 ${isFollowing
                                            ? 'border border-gray-300 dark:border-[#3A3F4B] text-gray-700 dark:text-[#E7E6E3] hover:bg-gray-50 dark:hover:bg-[#1A1E27]'
                                            : 'bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)]'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {isTogglingFollow
                                            ? '...'
                                            : isFollowing
                                                ? 'Unfollow'
                                                : 'Follow'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="mt-8 border-t border-gray-200 dark:border-[#1F232C] pt-6">
                            <p className="text-center text-gray-500 dark:text-[#6E7280] text-sm font-[Manrope]">
                                {isOwnProfile
                                    ? 'This is your profile. 🌬️'
                                    : `Viewing ${profileUser.name}'s profile`}
                            </p>
                            {/* Placeholder for posts grid */}
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div
                                        key={i}
                                        className="aspect-square bg-gray-100 dark:bg-[#1A1E27] rounded-xl flex items-center justify-center text-gray-400 dark:text-[#6E7280] text-sm"
                                    >
                                        📷
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-xs text-gray-400 dark:text-[#6E7280] mt-4 font-[Manrope]">
                                Posts coming soon.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Followers/Following Modal */}
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