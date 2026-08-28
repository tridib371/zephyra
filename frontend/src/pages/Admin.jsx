import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import AutoPauseVideo from '../components/AutoPauseVideo';
import {
    HiOutlineShieldCheck,
    HiOutlineExclamationCircle,
    HiOutlineUser,
    HiOutlineKey,
    HiOutlineLockClosed,
    HiOutlineChartBar,
    HiOutlineUsers,
    HiOutlineMegaphone,
    HiOutlineDocumentText,
    HiOutlineHeart,
    HiOutlineNoSymbol,
    HiOutlineCheck,
    HiOutlineTrash,
    HiOutlineMagnifyingGlass,
    HiOutlineChatBubbleLeftRight,
    HiOutlineCheckCircle,
    HiOutlinePaperAirplane,
    HiOutlineEye,
    HiOutlineEyeSlash,
    HiOutlineXMark,
} from 'react-icons/hi2';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

// Animated wind gust SVG lines for smooth motion
const WindBreeze = () => (
    <svg
        className="absolute inset-0 h-full w-full pointer-events-none opacity-40 dark:opacity-25 z-0"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        aria-hidden="true"
    >
        <defs>
            <linearGradient id="adminGust" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                <stop offset="50%" stopColor="#D97B4F" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
            </linearGradient>
        </defs>
        <motion.path
            d="M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
            fill="none"
            stroke="url(#adminGust)"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
                d: [
                    "M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220",
                    "M -100 240 C 250 140, 480 260, 800 240 S 1100 60, 1350 180",
                    "M -100 200 C 200 80, 500 320, 850 180 S 1150 100, 1350 220"
                ],
                opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
            d="M -100 500 C 300 620, 600 380, 950 540 S 1180 460, 1350 500"
            fill="none"
            stroke="url(#adminGust)"
            strokeWidth="1.8"
            strokeLinecap="round"
            animate={{
                d: [
                    "M -100 500 C 300 620, 600 380, 950 540 S 1180 460, 1350 500",
                    "M -100 460 C 220 540, 680 460, 900 480 S 1120 580, 1350 520",
                    "M -100 500 C 300 620, 600 380, 950 540 S 1180 460, 1350 500"
                ],
                opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
    </svg>
);

// Animated High-Tech Admin Cyber Matrix Background - Pure Animated Cyber Graphics (No Image Files)
const AnimatedAdminBackground = () => (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Animated Cyber Grid Matrix */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000045_2px,transparent_2px),linear-gradient(to_bottom,#00000045_2px,transparent_2px)] dark:bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:3.2rem_3.2rem]" />

        {/* Ambient Glowing Orbs & Beams */}
        <motion.div
            animate={{
                scale: [1, 1.15, 1],
                opacity: [0.75, 0.95, 0.75],
                x: [0, 35, 0],
                y: [0, -25, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-32 -left-40 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#C2410C]/75 via-[#9A3412]/55 to-transparent dark:from-[#FF8F6B]/35 dark:via-[#D97B4F]/25 blur-xl"
        />

        <motion.div
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0.9, 0.7],
                x: [0, -45, 0],
                y: [0, 35, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#D97706]/75 via-[#C2410C]/55 to-transparent dark:from-[#F5C36B]/35 dark:via-[#FF8F6B]/25 blur-xl"
        />

        <motion.div
            animate={{
                scale: [1, 1.12, 1],
                opacity: [0.65, 0.85, 0.65]
            }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#9A3412]/65 via-[#7C2D12]/45 to-transparent dark:from-[#3B82F6]/25 dark:via-[#8B5CF6]/20 blur-xl"
        />

        {/* Floating Animated Security Pulse Nodes */}
        <div className="absolute inset-0">
            <motion.div
                animate={{ y: [0, -35, 0], x: [0, 20, 0], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/4 left-1/5 w-5 h-5 rounded-full bg-[#B91C1C] dark:bg-[#F5C36B] border-2 border-black dark:border-none shadow-[0_0_25px_#B91C1C]"
            />
            <motion.div
                animate={{ y: [0, 45, 0], x: [0, -25, 0], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute top-2/3 right-1/4 w-5 h-5 rounded-full bg-[#9A3412] dark:bg-[#8B5CF6] border-2 border-black dark:border-none shadow-[0_0_30px_#9A3412]"
            />
            <motion.div
                animate={{ y: [0, -25, 0], x: [0, -15, 0], opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
                className="absolute bottom-1/4 left-1/3 w-4 h-4 rounded-full bg-[#1D4ED8] dark:bg-[#3B82F6] border-2 border-black dark:border-none shadow-[0_0_25px_#1D4ED8]"
            />
        </div>

        {/* Animated Cyber Radar Pulse Line */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full border-3 border-black/55 dark:border-white/10 flex items-center justify-center pointer-events-none">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                className="w-full h-full rounded-full border-3 dark:border border-dashed border-[#9A3412] dark:border-[#FF8F6B]/30"
            />
        </div>

        {/* Real-time Animated Wave Streams */}
        <WindBreeze />
    </div>
);

const safeFormatDate = (d, options = {}) => {
    try {
        if (!d) return '';
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return '';
        return formatDistanceToNow(dt, options);
    } catch {
        return '';
    }
};

export default function Admin() {
    const { user, updateUser } = useAuth();

    // ==========================================
    // ADMIN GATE AUTHENTICATION STATE
    // ==========================================
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
        return Boolean(localStorage.getItem('zephyra_admin_token') || sessionStorage.getItem('zephyra_admin_auth'));
    });

    const [adminInputId, setAdminInputId] = useState('');
    const [adminInputPassword, setAdminInputPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState('');

    // Dashboard State
    const [activeTab, setActiveTab] = useState('overview');

    // Overview Stats
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(false);

    // Users Management
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersPage, setUsersPage] = useState(1);
    const [usersTotalPages, setUsersTotalPages] = useState(1);
    const [usersTotal, setUsersTotal] = useState(0);
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('');
    const [userStatusFilter, setUserStatusFilter] = useState('');

    // Posts Moderation
    const [posts, setPosts] = useState([]);
    const [postsLoading, setPostsLoading] = useState(false);
    const [postsPage, setPostsPage] = useState(1);
    const [postsTotalPages, setPostsTotalPages] = useState(1);
    const [postsTotal, setPostsTotal] = useState(0);
    const [postSearch, setPostSearch] = useState('');

    // Announcements
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementMessage, setAnnouncementMessage] = useState('');
    const [announcementTargetType, setAnnouncementTargetType] = useState('all'); // 'all' | 'individual'
    const [selectedRecipient, setSelectedRecipient] = useState(null); // { _id, name, username, profilePicture, email }
    const [recipientSearch, setRecipientSearch] = useState('');
    const [recipientSearchResults, setRecipientSearchResults] = useState([]);
    const [searchingRecipients, setSearchingRecipients] = useState(false);
    const [announcementSending, setAnnouncementSending] = useState(false);
    const [announcementSuccess, setAnnouncementSuccess] = useState('');

    // Modals & Confirmations
    const [banModalUser, setBanModalUser] = useState(null);
    const [banReason, setBanReason] = useState('');
    const [banActionLoading, setBanActionLoading] = useState(false);
    const [deleteUserConfirm, setDeleteUserConfirm] = useState(null);
    const [deletePostConfirm, setDeletePostConfirm] = useState(null);
    const [toastMessage, setToastMessage] = useState('');

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // ==========================================
    // HANDLE ADMIN GATE LOGIN
    // ==========================================
    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthLoading(true);

        try {
            const res = await api.post('/admin/login', {
                identifier: adminInputId.trim(),
                password: adminInputPassword,
            });

            if (res.data.success) {
                localStorage.setItem('zephyra_admin_token', res.data.token);
                sessionStorage.setItem('zephyra_admin_auth', 'true');
                setIsAdminAuthenticated(true);
                setAuthError('');
                showToast('Welcome, Administrator!');
            }
        } catch (err) {
            setAuthError(
                err.response?.data?.message ||
                'Invalid Administrator Credentials. Access Denied.'
            );
        } finally {
            setAuthLoading(false);
        }
    };

    // Handle Admin Session Lock / Logout
    const handleLockAdminSession = () => {
        localStorage.removeItem('zephyra_admin_token');
        sessionStorage.removeItem('zephyra_admin_auth');
        setIsAdminAuthenticated(false);
        setAdminInputPassword('');
        showToast('Admin session locked successfully');
    };

    const getAdminHeaders = () => {
        const token = localStorage.getItem('zephyra_admin_token') || localStorage.getItem('zephyra_token');
        return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    };

    // 1. Fetch Stats
    const fetchStats = useCallback(async () => {
        if (!isAdminAuthenticated) return;
        try {
            setStatsLoading(true);
            const res = await api.get('/admin/stats', getAdminHeaders());
            setStats(res.data.stats);
        } catch (err) {
            console.error('Error fetching admin stats:', err);
            showToast('Failed to load stats');
        } finally {
            setStatsLoading(false);
        }
    }, [isAdminAuthenticated]);

    // 2. Fetch Users
    const fetchUsers = useCallback(async () => {
        if (!isAdminAuthenticated) return;
        try {
            setUsersLoading(true);
            const params = new URLSearchParams({
                page: usersPage,
                limit: 10,
                ...(userSearch && { q: userSearch }),
                ...(userRoleFilter && { role: userRoleFilter }),
                ...(userStatusFilter && { status: userStatusFilter }),
            });
            const res = await api.get(`/admin/users?${params.toString()}`, getAdminHeaders());
            setUsers(res.data.users || []);
            setUsersTotalPages(res.data.pages || 1);
            setUsersTotal(res.data.total || 0);
        } catch (err) {
            console.error('Error fetching users:', err);
            showToast('Failed to load users');
        } finally {
            setUsersLoading(false);
        }
    }, [isAdminAuthenticated, usersPage, userSearch, userRoleFilter, userStatusFilter]);

    // 3. Fetch Posts
    const fetchPosts = useCallback(async () => {
        if (!isAdminAuthenticated) return;
        try {
            setPostsLoading(true);
            const params = new URLSearchParams({
                page: postsPage,
                limit: 9,
                ...(postSearch && { q: postSearch }),
            });
            const res = await api.get(`/admin/posts?${params.toString()}`, getAdminHeaders());
            setPosts(res.data.posts || []);
            setPostsTotalPages(res.data.pages || 1);
            setPostsTotal(res.data.total || 0);
        } catch (err) {
            console.error('Error fetching posts:', err);
            showToast('Failed to load posts');
        } finally {
            setPostsLoading(false);
        }
    }, [isAdminAuthenticated, postsPage, postSearch]);

    // Tab loads
    useEffect(() => {
        if (isAdminAuthenticated) {
            if (activeTab === 'overview') fetchStats();
            if (activeTab === 'users') fetchUsers();
            if (activeTab === 'posts') fetchPosts();
        }
    }, [isAdminAuthenticated, activeTab, fetchStats, fetchUsers, fetchPosts]);

    // Role update
    const handleRoleChange = async (targetUser, newRole) => {
        try {
            const res = await api.put(`/admin/users/${targetUser._id}/role`, { role: newRole }, getAdminHeaders());
            showToast(res.data.message || 'User role updated');
            setUsers((prev) =>
                prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
            );
            if (targetUser._id === user?._id) {
                updateUser({ ...user, role: newRole });
            }
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update role');
        }
    };

    // Ban / Unban Submit
    const handleBanSubmit = async () => {
        if (!banModalUser) return;
        setBanActionLoading(true);
        const shouldBan = !banModalUser.isBanned;

        try {
            const res = await api.put(`/admin/users/${banModalUser._id}/ban`, {
                isBanned: shouldBan,
                reason: banReason.trim(),
            }, getAdminHeaders());
            showToast(res.data.message || 'User ban status updated');
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === banModalUser._id
                        ? { ...u, isBanned: shouldBan, bannedReason: shouldBan ? banReason : '' }
                        : u
                )
            );
            setBanModalUser(null);
            setBanReason('');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to update ban status');
        } finally {
            setBanActionLoading(false);
        }
    };

    // Delete User
    const handleDeleteUser = async (userId) => {
        try {
            const res = await api.delete(`/admin/users/${userId}`, getAdminHeaders());
            showToast(res.data.message || 'User deleted successfully');
            setUsers((prev) => prev.filter((u) => u._id !== userId));
            setDeleteUserConfirm(null);
            fetchStats();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete user');
        }
    };

    // Delete Post
    const handleDeletePost = async (postId) => {
        try {
            const res = await api.delete(`/admin/posts/${postId}`, getAdminHeaders());
            showToast(res.data.message || 'Post deleted by administrator');
            setPosts((prev) => prev.filter((p) => p._id !== postId));
            setDeletePostConfirm(null);
            fetchStats();
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to delete post');
        }
    };

    // Search users for individual announcement
    useEffect(() => {
        if (announcementTargetType !== 'individual' || !recipientSearch.trim()) {
            setRecipientSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                setSearchingRecipients(true);
                const res = await api.get(`/admin/users?q=${encodeURIComponent(recipientSearch.trim())}&limit=5`, getAdminHeaders());
                setRecipientSearchResults(res.data.users || []);
            } catch (err) {
                console.error('Error searching users for announcement:', err);
            } finally {
                setSearchingRecipients(false);
            }
        }, 250);

        return () => clearTimeout(timer);
    }, [recipientSearch, announcementTargetType]);

    // Quick direct announcement to a specific user from the table
    const handleDirectAnnounceToUser = (userObj) => {
        setSelectedRecipient(userObj);
        setAnnouncementTargetType('individual');
        setAnnouncementSuccess('');
        setRecipientSearch('');
        setRecipientSearchResults([]);
        setActiveTab('announcements');
        showToast(`Preparing announcement for @${userObj.username}`);
    };

    // Broadcast or Direct Announcement Submit
    const handleBroadcastAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementTitle.trim() || !announcementMessage.trim() || announcementSending) return;

        if (announcementTargetType === 'individual' && !selectedRecipient) {
            showToast('Please select a recipient user');
            return;
        }

        setAnnouncementSending(true);
        setAnnouncementSuccess('');

        try {
            const payload = {
                title: announcementTitle.trim(),
                message: announcementMessage.trim(),
                targetType: announcementTargetType,
                ...(announcementTargetType === 'individual' && { recipientId: selectedRecipient._id }),
            };

            const res = await api.post('/admin/announcements', payload, getAdminHeaders());
            setAnnouncementSuccess(res.data.message || 'Announcement sent successfully!');
            setAnnouncementTitle('');
            setAnnouncementMessage('');
            showToast(res.data.message || 'Announcement sent successfully!');
        } catch (err) {
            showToast(err.response?.data?.message || 'Failed to send announcement');
        } finally {
            setAnnouncementSending(false);
        }
    };

    // =========================================================
    // 🔒 SCREEN 1: ADMIN LOGIN GATE (WHEN NOT AUTHENTICATED)
    // =========================================================
    if (!isAdminAuthenticated) {
        return (
            <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 font-[Manrope] flex items-center justify-center overflow-hidden">
                {/* High-Tech Animated Cyber Matrix Background */}
                <AnimatedAdminBackground />

                <div className="relative z-10 w-full max-w-md">

                    {/* Outer Glow Card with Solid Black Border in Day Mode */}
                    <motion.div
                        initial={{ opacity: 0, y: 35, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151D]/90 p-8 sm:p-10 backdrop-blur-2xl shadow-2xl space-y-7 overflow-hidden relative"
                    >
                        <WindBreeze />

                        {/* Top Security Badge */}
                        <div className="text-center space-y-3 relative z-10">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] shadow-md border-2 border-black dark:border-[#FF8F6B]/40">
                                <HiOutlineLockClosed className="h-8 w-8 stroke-[2.2]" />
                            </div>
                            <div>
                                <h2 className="font-['Fraunces'] italic text-2xl sm:text-3xl font-extrabold text-[#1C1008] dark:text-white">
                                    Control Gate
                                </h2>
                                <p className="text-xs font-bold text-[#4D3222] dark:text-gray-400 mt-1">
                                    Super Administrator Authentication Required
                                </p>
                            </div>
                        </div>

                        {/* Error Alert */}
                        {authError && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl bg-rose-100/90 dark:bg-rose-950/40 border-2 border-black dark:border-rose-800/50 p-3.5 text-xs text-rose-950 dark:text-rose-300 font-black flex items-start gap-2.5 shadow-xs"
                            >
                                <HiOutlineExclamationCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5 stroke-[2.2]" />
                                <span>{authError}</span>
                            </motion.div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
                            <div className="space-y-1">
                                <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                    Admin Identifier / Email
                                </label>
                                <div className="relative">
                                    <HiOutlineUser className="absolute left-3.5 top-3.5 h-4 w-4 text-[#9E3610] dark:text-gray-400 stroke-[2.2]" />
                                    <input
                                        type="text"
                                        required
                                        value={adminInputId}
                                        onChange={(e) => setAdminInputId(e.target.value)}
                                        placeholder=""
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] pl-10 pr-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                    Admin Security Key / Password
                                </label>
                                <div className="relative">
                                    <HiOutlineKey className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E3610] dark:text-gray-400 stroke-[2.2]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={adminInputPassword}
                                        onChange={(e) => setAdminInputPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] pl-10 pr-11 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 font-bold transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5E3821] hover:text-[#1C1008] dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer p-1"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <HiOutlineEyeSlash className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={authLoading || !adminInputId.trim() || !adminInputPassword}
                                className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black font-extrabold text-sm hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {authLoading ? (
                                    <div className="h-5 w-5 border-2 border-[#1A140D] border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Unlock Control Center</span>
                                        <HiOutlineShieldCheck className="h-4 w-4 stroke-[2.2]" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        <div className="pt-2 text-center border-t-2 border-black dark:border-[#1F232C] relative z-10">
                            <Link
                                to="/feed"
                                className="text-xs font-black text-[#9E3610] dark:text-gray-400 hover:underline inline-flex items-center gap-1"
                            >
                                ← Return to Community Feed
                            </Link>
                        </div>
                    </motion.div>

                </div>
            </div>
        );
    }

    // =========================================================
    // ⚡ SCREEN 2: UNLOCKED ADMIN CONTROL CENTER
    // =========================================================
    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 font-[Manrope] overflow-hidden">
            {/* High-Tech Animated Cyber Matrix Background */}
            <AnimatedAdminBackground />

            <div className="relative max-w-7xl mx-auto space-y-6 z-10">

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-[#1A140D] dark:bg-white text-white dark:text-[#1A140D] border-2 border-black px-5 py-3 text-sm font-black shadow-2xl flex items-center gap-2.5 animate-bounce">
                        <HiOutlineCheckCircle className="h-5 w-5 text-[#FF8F6B] stroke-[2.2]" />
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Header Section with Black Border in Day Mode */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 shadow-2xl backdrop-blur-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black flex items-center justify-center font-black text-xl shadow-md">
                            <HiOutlineShieldCheck className="h-6 w-6 text-[#1A140D] stroke-[2.2]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1008] dark:text-white">
                                    Control Center
                                </h1>
                                <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FF8F6B]/20 text-[#9E3610] dark:text-[#F5C36B] border border-black dark:border-[#FF8F6B]/40">
                                    Super Admin
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-[#4D3222] dark:text-gray-400 mt-0.5 font-bold">
                                Platform management, community moderation, and broadcast announcements.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={handleLockAdminSession}
                            className="px-4 py-2 text-xs sm:text-sm font-black text-rose-950 dark:text-rose-400 bg-rose-200 dark:bg-rose-950/40 hover:bg-rose-300 rounded-full border-2 border-black dark:border-red-900/50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                            <HiOutlineLockClosed className="h-4 w-4 stroke-[2.2]" /> Lock Session
                        </motion.button>
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                to="/feed"
                                className="px-4 py-2 text-xs sm:text-sm font-black rounded-full border-2 border-black bg-white dark:bg-[#181C26] hover:bg-[#FFF6EF] transition-colors inline-block shadow-xs"
                            >
                                Feed →
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Navigation Tabs with Black Borders in Day Mode */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[
                        { id: 'overview', label: 'Analytics', icon: HiOutlineChartBar },
                        { id: 'users', label: 'User Management', icon: HiOutlineUsers },
                        { id: 'posts', label: 'Moderation', icon: HiOutlineShieldCheck },
                        { id: 'announcements', label: 'Announcements', icon: HiOutlineMegaphone },
                    ].map((tab) => {
                        const TabIcon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap border-2 ${
                                    activeTab === tab.id
                                        ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] border-black dark:border-white shadow-md'
                                        : 'bg-white dark:bg-[#12151C] border-black dark:border-[#1F232C] text-[#1C1008] dark:text-gray-300 hover:bg-[#FFF6EF]'
                                }`}
                            >
                                <TabIcon className="h-4 w-4 stroke-[2.2]" />
                                <span>{tab.label}</span>
                            </motion.button>
                        );
                    })}
                </div>

                {/* ========================================== */}
                {/* 1. OVERVIEW TAB */}
                {/* ========================================== */}
                {activeTab === 'overview' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {statsLoading ? (
                            <div className="py-20 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D97B4F] border-t-transparent mb-2" />
                                <p>Loading analytics...</p>
                            </div>
                        ) : stats ? (
                            <>
                                {/* Stat Cards Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-5 shadow-2xl backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-[#9E3610] dark:text-gray-400 uppercase tracking-wider">Total Users</span>
                                            <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-950 dark:text-blue-300 grid place-items-center text-sm border border-black font-black">
                                                <HiOutlineUsers className="h-4 w-4 stroke-[2.2]" />
                                            </span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-black text-[#1C1008] dark:text-white">{stats.totalUsers.toLocaleString()}</div>
                                        <div className="mt-1 text-[11px] text-[#5E3821] dark:text-gray-400 font-bold">Total registered members</div>
                                    </motion.div>

                                    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-5 shadow-2xl backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-[#9E3610] dark:text-gray-400 uppercase tracking-wider">Published Posts</span>
                                            <span className="h-8 w-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-950 dark:text-amber-300 grid place-items-center text-sm border border-black font-black">
                                                <HiOutlineDocumentText className="h-4 w-4 stroke-[2.2]" />
                                            </span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-black text-[#1C1008] dark:text-white">{stats.totalPosts.toLocaleString()}</div>
                                        <div className="mt-1 text-[11px] text-[#5E3821] dark:text-gray-400 font-bold">Total community stories</div>
                                    </motion.div>

                                    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-5 shadow-2xl backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-[#9E3610] dark:text-gray-400 uppercase tracking-wider">Interactions</span>
                                            <span className="h-8 w-8 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-950 dark:text-rose-300 grid place-items-center text-sm border border-black font-black">
                                                <HiOutlineHeart className="h-4 w-4 stroke-[2.2]" />
                                            </span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-black text-[#1C1008] dark:text-white">{(stats.totalLikes + stats.totalComments).toLocaleString()}</div>
                                        <div className="mt-1 text-[11px] text-[#5E3821] dark:text-gray-400 font-bold">{stats.totalLikes} Likes • {stats.totalComments} Comments</div>
                                    </motion.div>

                                    <motion.div whileHover={{ y: -5, scale: 1.02 }} className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-5 shadow-2xl backdrop-blur-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider">Suspended</span>
                                            <span className="h-8 w-8 rounded-xl bg-rose-200 dark:bg-red-900/40 text-rose-950 dark:text-red-400 grid place-items-center text-sm border border-black font-black">
                                                <HiOutlineNoSymbol className="h-4 w-4 stroke-[2.2]" />
                                            </span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-black text-rose-700 dark:text-red-400">{stats.bannedUsers}</div>
                                        <div className="mt-1 text-[11px] text-rose-800 dark:text-gray-400 font-bold">Banned user accounts</div>
                                    </motion.div>
                                </div>

                                {/* 7-Day User Growth Bar Chart */}
                                <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 shadow-2xl backdrop-blur-xl">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="font-['Fraunces'] text-lg font-bold text-[#1C1008] dark:text-white">New Registrations (Last 7 Days)</h3>
                                            <p className="text-xs text-[#4D3222] dark:text-gray-400 font-bold">Daily signups velocity</p>
                                        </div>
                                        <span className="text-xs font-black text-[#9E3610] dark:text-[#F5C36B] bg-[#FF8F6B]/20 px-3 py-1 rounded-full border border-black dark:border-[#FF8F6B]/40">
                                            Active Growth
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4 border-b-2 border-black dark:border-[#1F232C]">
                                        {stats.growthDays.map((d, i) => {
                                            const maxCount = Math.max(...stats.growthDays.map((x) => x.count), 5);
                                            const heightPct = Math.max((d.count / maxCount) * 100, 8);
                                            return (
                                                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                                                    <span className="text-[10px] sm:text-xs font-black text-[#1C1008] dark:text-gray-300 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                                                        {d.count}
                                                    </span>
                                                    <div
                                                        style={{ height: `${heightPct}%` }}
                                                        className="w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-[#D97B4F] to-[#FF8F6B] border-t-2 border-x-2 border-black group-hover:brightness-110 transition-all shadow-xs"
                                                    />
                                                    <span className="text-[10px] sm:text-xs text-[#5E3821] dark:text-gray-400 uppercase font-black">{d.day}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Registrations & Posts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Latest Users */}
                                    <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 shadow-2xl backdrop-blur-xl">
                                        <h3 className="font-['Fraunces'] text-lg font-bold mb-4 text-[#1C1008] dark:text-white">Latest Registered Users</h3>
                                        <div className="divide-y-2 divide-black dark:divide-[#1F232C]">
                                            {stats.recentUsers.map((u) => (
                                                <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <img
                                                            src={u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=D97B4F&color=fff`}
                                                            alt=""
                                                            referrerPolicy="no-referrer"
                                                            className="h-10 w-10 rounded-2xl object-cover border-2 border-black dark:border-[#1F232C]"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black truncate text-[#1C1008] dark:text-white">{u.name}</p>
                                                            <p className="text-xs text-[#5E3821] dark:text-gray-400 font-bold truncate">@{u.username}</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FFF6EF] dark:bg-[#181C26] text-[#9E3610] dark:text-[#F5C36B] border border-black">
                                                        {safeFormatDate(u.createdAt, { addSuffix: true })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Latest Stories */}
                                    <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 shadow-2xl backdrop-blur-xl">
                                        <h3 className="font-['Fraunces'] text-lg font-bold mb-4 text-[#1C1008] dark:text-white">Recent Published Stories</h3>
                                        <div className="divide-y-2 divide-black dark:divide-[#1F232C]">
                                            {stats.recentPosts.map((p) => (
                                                <div key={p._id} className="py-3 flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black truncate text-[#1C1008] dark:text-white">{p.title || p.content?.slice(0, 40) || 'Untitled Post'}</p>
                                                        <p className="text-xs text-[#5E3821] dark:text-gray-400 font-bold truncate">by @{p.author?.username || 'unknown'}</p>
                                                    </div>
                                                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FFF6EF] dark:bg-[#181C26] text-[#9E3610] dark:text-[#F5C36B] border border-black shrink-0">
                                                        {safeFormatDate(p.createdAt, { addSuffix: true })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </motion.div>
                )}

                {/* ========================================== */}
                {/* 2. USERS TAB */}
                {/* ========================================== */}
                {activeTab === 'users' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* User Filters */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-5 shadow-2xl backdrop-blur-xl">
                            <div className="relative grow max-w-md">
                                <HiOutlineMagnifyingGlass className="absolute left-3.5 top-3.5 h-4 w-4 text-[#9E3610] dark:text-gray-400 stroke-[2.2]" />
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => {
                                        setUserSearch(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    placeholder=""
                                    className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 font-bold"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={userRoleFilter}
                                    onChange={(e) => {
                                        setUserRoleFilter(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    className="rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] px-3 py-2.5 text-xs font-black text-[#1C1008] dark:text-white focus:outline-none"
                                >
                                    <option value="">All Roles</option>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <select
                                    value={userStatusFilter}
                                    onChange={(e) => {
                                        setUserStatusFilter(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    className="rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] px-3 py-2.5 text-xs font-black text-[#1C1008] dark:text-white focus:outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active Only</option>
                                    <option value="banned">Banned Only</option>
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 overflow-hidden shadow-2xl backdrop-blur-xl">
                            {usersLoading ? (
                                <div className="py-20 text-center text-sm font-bold text-gray-500">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D97B4F] border-t-transparent mb-2" />
                                    <p>Loading member directory...</p>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="p-12 text-center text-sm text-gray-500 font-bold">
                                    No users found matching query.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs sm:text-sm">
                                        <thead className="bg-[#FFF0E6] dark:bg-[#181C26] text-[#9E3610] dark:text-white font-black border-b-2 border-black dark:border-[#252A36]">
                                            <tr>
                                                <th className="p-4">User</th>
                                                <th className="p-4">Role</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Joined</th>
                                                <th className="p-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y-2 divide-black dark:divide-[#1F232C]">
                                            {users.map((u) => (
                                                <tr key={u._id} className="hover:bg-[#FFF6EF] dark:hover:bg-[#161B26] transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=D97B4F&color=fff`}
                                                                alt=""
                                                                className="h-9 w-9 rounded-2xl object-cover border-2 border-black"
                                                            />
                                                            <div>
                                                                <div className="font-black text-[#1C1008] dark:text-white">{u.name}</div>
                                                                <div className="text-xs text-[#5E3821] dark:text-gray-400 font-bold">@{u.username} • {u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <select
                                                            value={u.role || 'user'}
                                                            onChange={(e) => handleRoleChange(u, e.target.value)}
                                                            className="rounded-xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] px-2.5 py-1 text-xs font-black text-[#1C1008] dark:text-white focus:outline-none"
                                                        >
                                                            <option value="user">User</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-4">
                                                        {u.isBanned ? (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-200 text-rose-950 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-black border border-black">
                                                                <HiOutlineNoSymbol className="h-3 w-3 stroke-[2.5]" /> Banned
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-black border border-black">
                                                                <HiOutlineCheck className="h-3 w-3 stroke-[2.5]" /> Active
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-xs text-[#5E3821] dark:text-gray-400 font-bold">
                                                        {safeFormatDate(u.createdAt, { addSuffix: true })}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.96 }}
                                                                onClick={() => handleDirectAnnounceToUser(u)}
                                                                title={`Send direct announcement to @${u.username}`}
                                                                className="px-2.5 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-950 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-900/60 border-2 border-black dark:border-blue-700/50 text-xs font-black cursor-pointer shadow-xs flex items-center gap-1"
                                                            >
                                                                <HiOutlineMegaphone className="h-3.5 w-3.5 stroke-[2.2]" />
                                                                <span className="hidden xl:inline">Notice</span>
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.96 }}
                                                                onClick={() => {
                                                                    setBanModalUser(u);
                                                                    setBanReason(u.bannedReason || '');
                                                                }}
                                                                className={`px-3 py-1.5 rounded-xl text-xs font-black border-2 border-black cursor-pointer shadow-xs ${
                                                                    u.isBanned
                                                                        ? 'bg-emerald-200 text-emerald-950 hover:bg-emerald-300'
                                                                        : 'bg-amber-200 text-amber-950 hover:bg-amber-300'
                                                                }`}
                                                            >
                                                                {u.isBanned ? 'Unban' : 'Ban'}
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.96 }}
                                                                onClick={() => setDeleteUserConfirm(u)}
                                                                className="p-1.5 rounded-xl bg-rose-200 text-rose-950 hover:bg-rose-300 border-2 border-black cursor-pointer shadow-xs"
                                                            >
                                                                <HiOutlineTrash className="h-4 w-4 stroke-[2.2]" />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {usersTotalPages > 1 && (
                                <div className="p-4 border-t-2 border-black dark:border-[#1F232C] flex items-center justify-between text-xs font-black">
                                    <span className="text-[#5E3821] dark:text-gray-400">Total: {usersTotal} members</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={usersPage <= 1}
                                            onClick={() => setUsersPage((p) => p - 1)}
                                            className="px-3 py-1 rounded-xl border-2 border-black bg-white dark:bg-[#181C26] disabled:opacity-40"
                                        >
                                            Prev
                                        </button>
                                        <span>Page {usersPage} of {usersTotalPages}</span>
                                        <button
                                            disabled={usersPage >= usersTotalPages}
                                            onClick={() => setUsersPage((p) => p + 1)}
                                            className="px-3 py-1 rounded-xl border-2 border-black bg-white dark:bg-[#181C26] disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* ========================================== */}
                {/* 3. MODERATION POSTS TAB */}
                {/* ========================================== */}
                {activeTab === 'posts' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Search Filter */}
                        <div className="flex items-center gap-4 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-5 shadow-2xl backdrop-blur-xl">
                            <div className="relative grow max-w-md">
                                <HiOutlineMagnifyingGlass className="absolute left-3.5 top-3.5 h-4 w-4 text-[#9E3610] dark:text-gray-400 stroke-[2.2]" />
                                <input
                                    type="text"
                                    value={postSearch}
                                    onChange={(e) => {
                                        setPostSearch(e.target.value);
                                        setPostsPage(1);
                                    }}
                                    placeholder=""
                                    className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 font-bold"
                                />
                            </div>
                        </div>

                        {/* Posts Grid */}
                        {postsLoading ? (
                            <div className="py-20 text-center text-sm font-bold text-gray-500">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D97B4F] border-t-transparent mb-2" />
                                <p>Loading community posts...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="p-12 text-center text-sm text-gray-500 font-bold">
                                No posts match query.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {posts.map((p) => (
                                    <motion.div
                                        key={p._id}
                                        whileHover={{ y: -5, scale: 1.01 }}
                                        className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-5 shadow-2xl backdrop-blur-xl flex flex-col justify-between space-y-4"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <img
                                                        src={p.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.author?.name || 'User')}&background=D97B4F&color=fff`}
                                                        alt=""
                                                        className="h-8 w-8 rounded-xl object-cover border-2 border-black"
                                                    />
                                                    <div>
                                                        <p className="text-xs font-black truncate text-[#1C1008] dark:text-white">{p.author?.name}</p>
                                                        <p className="text-[10px] text-[#5E3821] dark:text-gray-400 font-bold">@{p.author?.username}</p>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-[#5E3821] dark:text-gray-400 font-bold">
                                                    {safeFormatDate(p.createdAt, { addSuffix: true })}
                                                </span>
                                            </div>

                                            {p.title && <h4 className="font-['Fraunces'] font-bold text-base text-[#1C1008] dark:text-white">{p.title}</h4>}
                                            <p className="text-xs text-[#3D2517] dark:text-gray-300 line-clamp-4 leading-relaxed font-bold">
                                                {p.content}
                                            </p>

                                            {(p.image || p.mediaUrl) && (() => {
                                                const mediaSrc = p.image || p.mediaUrl;
                                                const lower = mediaSrc.toLowerCase();
                                                const isVideo = lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.mov') || lower.includes('.avi') || lower.includes('.mkv') || lower.includes('.m4v') || lower.includes('/video/upload/') || lower.includes('/video/') || lower.startsWith('data:video');
                                                if (isVideo) {
                                                    return (
                                                        <AutoPauseVideo
                                                            src={mediaSrc}
                                                            className="h-40 w-full object-contain rounded-2xl border-2 border-black bg-black"
                                                        />
                                                    );
                                                }
                                                return (
                                                    <img
                                                        src={mediaSrc}
                                                        alt="Post media"
                                                        className="h-36 w-full object-cover rounded-2xl border-2 border-black"
                                                    />
                                                );
                                            })()}
                                        </div>

                                        <div className="pt-3 border-t-2 border-black dark:border-[#1F232C] flex items-center justify-between">
                                            <span className="text-[10px] font-black text-[#9E3610] dark:text-gray-400">
                                                {p.likesCount || 0} Likes • {p.commentsCount || 0} Comments
                                            </span>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.96 }}
                                                onClick={() => setDeletePostConfirm(p)}
                                                className="px-3 py-1.5 rounded-xl bg-rose-200 text-rose-950 hover:bg-rose-300 border-2 border-black text-xs font-black cursor-pointer shadow-xs flex items-center gap-1"
                                            >
                                                <HiOutlineTrash className="h-3.5 w-3.5 stroke-[2.2]" /> Delete
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ========================================== */}
                {/* 4. ANNOUNCEMENTS TAB */}
                {/* ========================================== */}
                {activeTab === 'announcements' && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] dark:text-[#FF8F6B] border-2 border-black dark:border-[#FF8F6B]/40 text-2xl">
                                    <HiOutlineMegaphone className="stroke-[2.2]" />
                                </div>
                                <div>
                                    <h3 className="font-['Fraunces'] text-xl font-extrabold text-[#1C1008] dark:text-white">
                                        System Announcements & Notices
                                    </h3>
                                    <p className="text-xs text-[#4D3222] dark:text-gray-400 font-bold">
                                        Deliver high-priority announcements in real-time across Zephyra.
                                    </p>
                                </div>
                            </div>

                            {/* Target Selection Switcher */}
                            <div className="space-y-1.5">
                                <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                    Announcement Target *
                                </label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFF6EF] dark:bg-[#181C26] rounded-2xl border-2 border-black dark:border-[#252A36]">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAnnouncementTargetType('all');
                                            setAnnouncementSuccess('');
                                        }}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                            announcementTargetType === 'all'
                                                ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] shadow-sm'
                                                : 'text-[#5E3821] dark:text-gray-400 hover:text-[#1C1008]'
                                        }`}
                                    >
                                        <HiOutlineUsers className="h-4 w-4 stroke-[2.2]" />
                                        <span>All Users (Broadcast)</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAnnouncementTargetType('individual');
                                            setAnnouncementSuccess('');
                                        }}
                                        className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                            announcementTargetType === 'individual'
                                                ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] shadow-sm'
                                                : 'text-[#5E3821] dark:text-gray-400 hover:text-[#1C1008]'
                                        }`}
                                    >
                                        <HiOutlineUser className="h-4 w-4 stroke-[2.2]" />
                                        <span>Individual User</span>
                                    </button>
                                </div>
                            </div>

                            {/* Individual Recipient Selector */}
                            {announcementTargetType === 'individual' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                        Select Recipient User *
                                    </label>

                                    {selectedRecipient ? (
                                        <div className="flex items-center justify-between p-3 rounded-2xl border-2 border-black dark:border-[#FF8F6B]/40 bg-[#FFF6EF] dark:bg-[#181C26]">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={selectedRecipient.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRecipient.name || selectedRecipient.username)}&background=D97B4F&color=fff`}
                                                    alt=""
                                                    className="h-10 w-10 rounded-2xl object-cover border-2 border-black"
                                                />
                                                <div>
                                                    <div className="font-black text-sm text-[#1C1008] dark:text-white flex items-center gap-2">
                                                        <span>{selectedRecipient.name}</span>
                                                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[#FF8F6B]/20 text-[#9E3610] dark:text-[#FF8F6B] border border-black dark:border-[#FF8F6B]/40">
                                                            {selectedRecipient.role || 'user'}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-[#5E3821] dark:text-gray-400 font-bold">
                                                        @{selectedRecipient.username} • {selectedRecipient.email}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedRecipient(null)}
                                                className="p-1.5 rounded-xl bg-rose-200 text-rose-950 hover:bg-rose-300 border-2 border-black text-xs font-black cursor-pointer"
                                                title="Change recipient"
                                            >
                                                <HiOutlineXMark className="h-4 w-4 stroke-[2.5]" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="relative">
                                                <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9E3610] dark:text-gray-400 stroke-[2.2]" />
                                                <input
                                                    type="text"
                                                    value={recipientSearch}
                                                    onChange={(e) => setRecipientSearch(e.target.value)}
                                                    placeholder="Type username, name, or email to search..."
                                                    className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] pl-10 pr-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black font-bold"
                                                />
                                                {searchingRecipients && (
                                                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-[#D97B4F] border-t-transparent rounded-full animate-spin" />
                                                )}
                                            </div>

                                            {/* Search dropdown results */}
                                            {recipientSearchResults.length > 0 && (
                                                <div className="absolute left-0 right-0 top-full mt-2 z-30 rounded-2xl border-2 border-black dark:border-[#252A36] bg-white dark:bg-[#12151C] shadow-2xl overflow-hidden divide-y-2 divide-black/10 dark:divide-[#252A36]">
                                                    {recipientSearchResults.map((usr) => (
                                                        <button
                                                            key={usr._id}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedRecipient(usr);
                                                                setRecipientSearch('');
                                                                setRecipientSearchResults([]);
                                                            }}
                                                            className="w-full p-3 flex items-center gap-3 hover:bg-[#FFF6EF] dark:hover:bg-[#181C26] text-left transition-colors cursor-pointer"
                                                        >
                                                            <img
                                                                src={usr.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(usr.name || usr.username)}&background=D97B4F&color=fff`}
                                                                alt=""
                                                                className="h-8 w-8 rounded-xl object-cover border border-black"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-black text-xs text-[#1C1008] dark:text-white truncate">
                                                                    {usr.name}
                                                                </div>
                                                                <div className="text-[11px] text-[#5E3821] dark:text-gray-400 font-bold truncate">
                                                                    @{usr.username} • {usr.email}
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-950 dark:text-blue-200 border border-black">
                                                                Select →
                                                            </span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {recipientSearch.trim().length >= 2 && recipientSearchResults.length === 0 && !searchingRecipients && (
                                                <div className="absolute left-0 right-0 top-full mt-2 z-30 p-4 rounded-2xl border-2 border-black bg-white dark:bg-[#12151C] text-xs font-bold text-center text-gray-500">
                                                    No users found matching "{recipientSearch}"
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {announcementSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300 border-2 border-black dark:border-emerald-700/60 text-xs font-black flex items-center gap-2"
                                >
                                    <HiOutlineCheckCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                                    <span>{announcementSuccess}</span>
                                </motion.div>
                            )}

                            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                        Announcement Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={announcementTitle}
                                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                                        placeholder={announcementTargetType === 'individual' ? "e.g., Important Notice Regarding Your Account" : "e.g., Scheduled Platform Maintenance Tonight"}
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] px-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black font-bold"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                        Announcement Message *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={announcementMessage}
                                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                                        placeholder={announcementTargetType === 'individual' ? "Write your direct administrative message or notification here..." : "Write your platform-wide announcement message here..."}
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] p-4 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black resize-none font-bold"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={
                                        announcementSending ||
                                        !announcementTitle.trim() ||
                                        !announcementMessage.trim() ||
                                        (announcementTargetType === 'individual' && !selectedRecipient)
                                    }
                                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <HiOutlinePaperAirplane className="h-4 w-4 stroke-[2.2]" />
                                    <span>
                                        {announcementSending
                                            ? 'Sending Announcement...'
                                            : announcementTargetType === 'individual'
                                            ? `Send to @${selectedRecipient?.username || 'Selected User'}`
                                            : `Broadcast to All Users (${stats?.totalUsers || 'All'})`}
                                    </span>
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                )}

            </div>

            {/* Ban Modal */}
            {banModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full rounded-3xl border-2 border-black bg-white dark:bg-[#12151C] p-6 space-y-4 shadow-2xl">
                        <h3 className="font-['Fraunces'] text-xl font-extrabold text-[#1C1008] dark:text-white">
                            {banModalUser.isBanned ? 'Unban Account' : 'Ban User Account'}
                        </h3>
                        <p className="text-xs font-bold text-[#4D3222] dark:text-gray-400">
                            {banModalUser.isBanned ? `Lift suspension for @${banModalUser.username}?` : `Specify a reason for banning @${banModalUser.username}:`}
                        </p>
                        {!banModalUser.isBanned && (
                            <textarea
                                rows={3}
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder=""
                                className="w-full rounded-2xl border-2 border-black bg-[#FFF6EF] dark:bg-[#181C26] p-3 text-xs font-bold text-[#1C1008] dark:text-white"
                            />
                        )}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setBanModalUser(null)} className="px-4 py-2 rounded-full border-2 border-black text-xs font-black">Cancel</button>
                            <button onClick={handleBanSubmit} disabled={banActionLoading} className="px-4 py-2 rounded-full bg-[#FF8F6B] text-[#1A140D] border-2 border-black text-xs font-black">
                                {banActionLoading ? 'Updating...' : 'Confirm'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Confirm Dialogs */}
            {deleteUserConfirm && (
                <ConfirmDialog
                    isOpen={Boolean(deleteUserConfirm)}
                    title="Delete User Account"
                    message={`Are you sure you want to permanently delete @${deleteUserConfirm.username}? This action is irreversible.`}
                    confirmLabel="Delete User"
                    onConfirm={() => handleDeleteUser(deleteUserConfirm._id)}
                    onCancel={() => setDeleteUserConfirm(null)}
                />
            )}

            {deletePostConfirm && (
                <ConfirmDialog
                    isOpen={Boolean(deletePostConfirm)}
                    title="Delete Community Post"
                    message="Are you sure you want to remove this post from global feeds?"
                    confirmLabel="Delete Post"
                    onConfirm={() => handleDeletePost(deletePostConfirm._id)}
                    onCancel={() => setDeletePostConfirm(null)}
                />
            )}
        </div>
    );
}
