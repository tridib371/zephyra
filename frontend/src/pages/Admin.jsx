import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'react-icons/hi2';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

import adminBgLight from '../assets/admin-bg-light.jpg';
import adminBgDark from '../assets/admin-bg-dark.jpg';

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

    // Broadcast Announcement
    const handleBroadcastAnnouncement = async (e) => {
        e.preventDefault();
        if (!announcementTitle.trim() || !announcementMessage.trim() || announcementSending) return;

        setAnnouncementSending(true);
        setAnnouncementSuccess('');

        try {
            const res = await api.post('/admin/announcements', {
                title: announcementTitle.trim(),
                message: announcementMessage.trim(),
            }, getAdminHeaders());
            setAnnouncementSuccess(res.data.message || 'Announcement broadcasted successfully!');
            setAnnouncementTitle('');
            setAnnouncementMessage('');
            showToast('Announcement sent to all users!');
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
                {/* Single Male Animated System Administrator Artwork Wallpapers - Clear & Sharp */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                    <img
                        src={adminBgLight}
                        alt="Single Male Animated System Administrator Light Mode Artwork"
                        className="absolute inset-0 w-full h-full object-cover opacity-100 blur-none scale-100 transition-opacity duration-700 dark:hidden"
                    />
                    <img
                        src={adminBgDark}
                        alt="Single Male Animated System Administrator Dark Mode Artwork"
                        className="absolute inset-0 w-full h-full object-cover opacity-85 blur-[0.5px] scale-100 transition-opacity duration-700 hidden dark:block"
                    />
                    {/* Clear Light Overlay & Dark Tint Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 dark:from-[#0E1116]/80 dark:via-[#0E1116]/75 dark:to-[#0E1116]/90" />
                </div>

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
                                        placeholder="admin@zephyra.app"
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] pl-10 pr-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 font-bold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                    Admin Security Key / Password
                                </label>
                                <div className="relative">
                                    <HiOutlineKey className="absolute left-3.5 top-3.5 h-4 w-4 text-[#9E3610] dark:text-gray-400 stroke-[2.2]" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={adminInputPassword}
                                        onChange={(e) => setAdminInputPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] pl-10 pr-12 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 font-bold transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-3 text-xs text-[#5E3821] hover:text-[#1C1008] dark:hover:text-gray-200 font-black p-0.5"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
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
            {/* Single Male Animated System Administrator Artwork Wallpapers - Clear & Sharp */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <img
                    src={adminBgLight}
                    alt="Single Male Animated System Administrator Light Mode Artwork"
                    className="absolute inset-0 w-full h-full object-cover opacity-100 blur-none scale-100 transition-opacity duration-700 dark:hidden"
                />
                <img
                    src={adminBgDark}
                    alt="Single Male Animated System Administrator Dark Mode Artwork"
                    className="absolute inset-0 w-full h-full object-cover opacity-85 blur-[0.5px] scale-100 transition-opacity duration-700 hidden dark:block"
                />
                {/* Clear Light Overlay & Dark Tint Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30 dark:from-[#0E1116]/75 dark:via-[#0E1116]/70 dark:to-[#0E1116]/85" />
            </div>

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
                                    placeholder="Search by name, username, or email..."
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
                                    placeholder="Search stories by content or author..."
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

                                            {p.mediaUrl && (
                                                <img src={p.mediaUrl} alt="" className="h-32 w-full object-cover rounded-2xl border-2 border-black" />
                                            )}
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
                        <div className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-white/92 dark:bg-[#12151C]/95 p-8 shadow-2xl backdrop-blur-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-[#FF8F6B]/20 text-[#9E3610] border-2 border-black text-2xl">
                                    <HiOutlineMegaphone className="stroke-[2.2]" />
                                </div>
                                <div>
                                    <h3 className="font-['Fraunces'] text-xl font-extrabold text-[#1C1008] dark:text-white">Broadcast System Announcement</h3>
                                    <p className="text-xs text-[#4D3222] dark:text-gray-400 font-bold">Push a high-priority banner notification to all connected platform users in real-time.</p>
                                </div>
                            </div>

                            {announcementSuccess && (
                                <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-950 border-2 border-black text-xs font-black">
                                    ✓ {announcementSuccess}
                                </div>
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
                                        placeholder="e.g. Scheduled System Maintenance Notice"
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] px-4 py-3 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black font-bold"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-[11px] font-black uppercase tracking-wider text-[#9E3610] dark:text-gray-400">
                                        Broadcast Message *
                                    </label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={announcementMessage}
                                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                                        placeholder="Write clear announcement details for all platform members..."
                                        className="w-full rounded-2xl border-2 border-black dark:border-[#252A36] bg-[#FFF6EF] dark:bg-[#181C26] p-4 text-sm text-[#1C1008] dark:text-white focus:outline-none focus:ring-2 focus:ring-black resize-none font-bold"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    disabled={announcementSending || !announcementTitle.trim() || !announcementMessage.trim()}
                                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <HiOutlinePaperAirplane className="stroke-[2.2]" />
                                    <span>{announcementSending ? 'Broadcasting Push...' : 'Broadcast to All Users'}</span>
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
                                placeholder="Enter violation reason..."
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
