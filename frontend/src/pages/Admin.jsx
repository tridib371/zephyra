import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

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
    const [activeTab, setActiveTab] = useState('overview');

    // Overview Stats
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

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

    const isAdmin = user?.role === 'admin';

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // 1. Fetch Stats
    const fetchStats = useCallback(async () => {
        try {
            setStatsLoading(true);
            const res = await api.get('/admin/stats');
            setStats(res.data.stats);
        } catch (err) {
            console.error('Error fetching admin stats:', err);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    // 2. Fetch Users
    const fetchUsers = useCallback(async () => {
        try {
            setUsersLoading(true);
            const params = new URLSearchParams({
                page: usersPage,
                limit: 10,
                ...(userSearch && { q: userSearch }),
                ...(userRoleFilter && { role: userRoleFilter }),
                ...(userStatusFilter && { status: userStatusFilter }),
            });
            const res = await api.get(`/admin/users?${params.toString()}`);
            setUsers(res.data.users || []);
            setUsersTotalPages(res.data.pages || 1);
            setUsersTotal(res.data.total || 0);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setUsersLoading(false);
        }
    }, [usersPage, userSearch, userRoleFilter, userStatusFilter]);

    // 3. Fetch Posts
    const fetchPosts = useCallback(async () => {
        try {
            setPostsLoading(true);
            const params = new URLSearchParams({
                page: postsPage,
                limit: 9,
                ...(postSearch && { q: postSearch }),
            });
            const res = await api.get(`/admin/posts?${params.toString()}`);
            setPosts(res.data.posts || []);
            setPostsTotalPages(res.data.pages || 1);
            setPostsTotal(res.data.total || 0);
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setPostsLoading(false);
        }
    }, [postsPage, postSearch]);

    // Initial and tab-dependent loads
    useEffect(() => {
        if (activeTab === 'overview') fetchStats();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'posts') fetchPosts();
    }, [activeTab, fetchStats, fetchUsers, fetchPosts]);

    // Role update
    const handleRoleChange = async (targetUser, newRole) => {
        if (!isAdmin) {
            showToast('Only Administrators can modify user roles.');
            return;
        }
        try {
            const res = await api.put(`/admin/users/${targetUser._id}/role`, { role: newRole });
            showToast(res.data.message || 'User role updated');
            setUsers((prev) =>
                prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
            );
            if (targetUser._id === user._id) {
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
            });
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
            const res = await api.delete(`/admin/users/${userId}`);
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
            const res = await api.delete(`/admin/posts/${postId}`);
            showToast(res.data.message || 'Post deleted by moderator');
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
            });
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

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-3 text-sm font-semibold shadow-2xl flex items-center gap-2.5 animate-bounce">
                        <span>⚡</span>
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white/90 dark:bg-[#12151C]/90 p-6 backdrop-blur-xl shadow-xs">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] flex items-center justify-center font-bold text-2xl shadow-md">
                            ⚡
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="font-['Fraunces'] text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    Control Center
                                </h1>
                                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${user?.role === 'admin' ? 'bg-[#FF8F6B]/20 text-[#D97B4F] dark:text-[#F5C36B]' : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300'}`}>
                                    {user?.role || 'Admin'}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                Platform management, community moderation, and broadcast announcements.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            to="/feed"
                            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border border-gray-200 dark:border-[#1F232C] hover:bg-gray-50 dark:hover:bg-[#181C26] transition-colors"
                        >
                            ← Back to Feed
                        </Link>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {[
                        { id: 'overview', label: '📊 Analytics', icon: '📊' },
                        { id: 'users', label: '👥 User Management', icon: '👥' },
                        { id: 'posts', label: '🛡️ Moderation', icon: '🛡️' },
                        { id: 'announcements', label: '📢 Announcements', icon: '📢' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[#1A140D] text-white dark:bg-white dark:text-[#1A140D] shadow-md scale-102'
                                : 'bg-white dark:bg-[#12151C] border border-gray-200/80 dark:border-[#1F232C] text-gray-600 dark:text-gray-300 hover:border-[#D97B4F]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ========================================== */}
                {/* 1. OVERVIEW TAB */}
                {/* ========================================== */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {statsLoading ? (
                            <div className="py-20 text-center text-sm text-gray-400 dark:text-gray-500">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D97B4F] border-t-transparent mb-2" />
                                <p>Loading analytics...</p>
                            </div>
                        ) : stats ? (
                            <>
                                {/* Stat Cards Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-5 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Users</span>
                                            <span className="h-8 w-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 grid place-items-center text-sm">👥</span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-extrabold">{stats.totalUsers.toLocaleString()}</div>
                                        <div className="mt-1 text-[11px] text-gray-400">{stats.adminCount} Admins • {stats.moderatorCount} Mods</div>
                                    </div>

                                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-5 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published Posts</span>
                                            <span className="h-8 w-8 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 grid place-items-center text-sm">✍️</span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-extrabold">{stats.totalPosts.toLocaleString()}</div>
                                        <div className="mt-1 text-[11px] text-gray-400">Total community stories</div>
                                    </div>

                                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-5 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Interactions</span>
                                            <span className="h-8 w-8 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 grid place-items-center text-sm">❤️</span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-extrabold">{(stats.totalLikes + stats.totalComments).toLocaleString()}</div>
                                        <div className="mt-1 text-[11px] text-gray-400">{stats.totalLikes} Likes • {stats.totalComments} Comments</div>
                                    </div>

                                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-5 shadow-xs">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Suspended</span>
                                            <span className="h-8 w-8 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 grid place-items-center text-sm">🚫</span>
                                        </div>
                                        <div className="mt-3 font-['Fraunces'] text-2xl sm:text-3xl font-extrabold text-red-600 dark:text-red-400">{stats.bannedUsers}</div>
                                        <div className="mt-1 text-[11px] text-gray-400">Banned user accounts</div>
                                    </div>
                                </div>

                                {/* 7-Day User Growth Bar Chart */}
                                <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs">
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h3 className="font-['Fraunces'] text-lg font-bold">New Registrations (Last 7 Days)</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Daily signups velocity</p>
                                        </div>
                                        <span className="text-xs font-bold text-[#D97B4F] dark:text-[#F5C36B] bg-[#FF8F6B]/15 px-3 py-1 rounded-full">
                                            Active Growth
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4 border-b border-gray-100 dark:border-[#1F232C]">
                                        {stats.growthDays.map((d, i) => {
                                            const maxCount = Math.max(...stats.growthDays.map((x) => x.count), 5);
                                            const heightPct = Math.max((d.count / maxCount) * 100, 8);
                                            return (
                                                <div key={i} className="flex flex-col items-center gap-2 h-full justify-end group">
                                                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 dark:text-gray-300 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-transform">
                                                        {d.count}
                                                    </span>
                                                    <div
                                                        style={{ height: `${heightPct}%` }}
                                                        className="w-full max-w-[36px] rounded-t-xl bg-gradient-to-t from-[#D97B4F] to-[#FF8F6B] group-hover:brightness-110 transition-all shadow-xs"
                                                    />
                                                    <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-medium">{d.day}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Recent Registrations & Posts */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Latest Users */}
                                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs">
                                        <h3 className="font-['Fraunces'] text-lg font-bold mb-4">Latest Registered Users</h3>
                                        <div className="divide-y divide-gray-100 dark:divide-[#1F232C]">
                                            {stats.recentUsers.map((u) => (
                                                <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <img
                                                            src={u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=D97B4F&color=fff`}
                                                            alt=""
                                                            referrerPolicy="no-referrer"
                                                            className="h-10 w-10 rounded-2xl object-cover border border-gray-200 dark:border-[#1F232C]"
                                                        />
                                                        <div className="min-w-0">
                                                            <div className="font-semibold text-sm truncate">{u.name}</div>
                                                            <div className="text-xs text-gray-400 truncate">@{u.username}</div>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 shrink-0">
                                                        {safeFormatDate(u.createdAt, { addSuffix: true })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Latest Posts */}
                                    <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs">
                                        <h3 className="font-['Fraunces'] text-lg font-bold mb-4">Latest Published Stories</h3>
                                        <div className="divide-y divide-gray-100 dark:divide-[#1F232C]">
                                            {stats.recentPosts.map((p) => (
                                                <div key={p._id} className="py-3 flex items-center justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-medium line-clamp-1">{p.content}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">by @{p.author?.username || 'user'}</p>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 shrink-0">
                                                        {safeFormatDate(p.createdAt, { addSuffix: true })}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                )}

                {/* ========================================== */}
                {/* 2. USERS MANAGEMENT TAB */}
                {/* ========================================== */}
                {activeTab === 'users' && (
                    <div className="space-y-4">
                        {/* Search & Filter Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-4 shadow-xs">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search users by name, username, or email..."
                                    value={userSearch}
                                    onChange={(e) => {
                                        setUserSearch(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                />
                                <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={userRoleFilter}
                                    onChange={(e) => {
                                        setUserRoleFilter(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    className="rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none"
                                >
                                    <option value="">All Roles</option>
                                    <option value="admin">Admins</option>
                                    <option value="moderator">Moderators</option>
                                    <option value="user">Regular Users</option>
                                </select>

                                <select
                                    value={userStatusFilter}
                                    onChange={(e) => {
                                        setUserStatusFilter(e.target.value);
                                        setUsersPage(1);
                                    }}
                                    className="rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-3.5 py-2.5 text-xs sm:text-sm font-semibold focus:outline-none"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active Only</option>
                                    <option value="banned">Suspended Only</option>
                                </select>
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] overflow-hidden shadow-xs">
                            {usersLoading ? (
                                <div className="py-20 text-center text-sm text-gray-400">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D97B4F] border-t-transparent mb-2" />
                                    <p>Loading user directory...</p>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="py-16 text-center text-sm text-gray-500">
                                    No users found matching your criteria.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-50/80 dark:bg-[#181C26]/80 text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-[#1F232C]">
                                            <tr>
                                                <th className="px-5 py-3.5 font-bold">User</th>
                                                <th className="px-5 py-3.5 font-bold">Role</th>
                                                <th className="px-5 py-3.5 font-bold">Status</th>
                                                <th className="px-5 py-3.5 font-bold">Stories</th>
                                                <th className="px-5 py-3.5 font-bold">Joined</th>
                                                <th className="px-5 py-3.5 font-bold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-[#1F232C]">
                                            {users.map((u) => (
                                                <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-[#181C26]/40 transition-colors">
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={u.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=D97B4F&color=fff`}
                                                                alt=""
                                                                referrerPolicy="no-referrer"
                                                                className="h-10 w-10 rounded-2xl object-cover border border-gray-200 dark:border-[#1F232C] shrink-0"
                                                            />
                                                            <div className="min-w-0">
                                                                <div className="font-bold text-sm truncate flex items-center gap-1.5">
                                                                    <span>{u.name}</span>
                                                                    {u._id === user?._id && (
                                                                        <span className="text-[9px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 font-extrabold px-1.5 py-0.2 rounded-full">YOU</span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-400 truncate">@{u.username} • {u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {isAdmin && u._id !== user?._id ? (
                                                            <select
                                                                value={u.role || 'user'}
                                                                onChange={(e) => handleRoleChange(u, e.target.value)}
                                                                className="rounded-xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-2.5 py-1 text-xs font-bold focus:outline-none"
                                                            >
                                                                <option value="user">User</option>
                                                                <option value="moderator">Moderator</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        ) : (
                                                            <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full ${u.role === 'admin' ? 'bg-[#FF8F6B]/20 text-[#D97B4F] dark:text-[#F5C36B]' : u.role === 'moderator' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`}>
                                                                {u.role || 'user'}
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4">
                                                        {u.isBanned ? (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 rounded-full">
                                                                <span>🚫</span> Suspended
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2.5 py-0.5 rounded-full">
                                                                <span>✓</span> Active
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 font-semibold text-xs text-gray-500">
                                                        {u.postCount || 0} posts
                                                    </td>

                                                    <td className="px-5 py-4 text-xs text-gray-400">
                                                        {safeFormatDate(u.createdAt, { addSuffix: true })}
                                                    </td>

                                                    <td className="px-5 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            {u._id !== user?._id && u.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setBanModalUser(u);
                                                                        setBanReason(u.bannedReason || '');
                                                                    }}
                                                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${u.isBanned ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30' : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30'}`}
                                                                >
                                                                    {u.isBanned ? 'Lift Ban' : 'Suspend'}
                                                                </button>
                                                            )}

                                                            {isAdmin && u._id !== user?._id && (
                                                                <button
                                                                    onClick={() => setDeleteUserConfirm(u._id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                                    title="Permanently Delete User"
                                                                >
                                                                    🗑️
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {usersTotalPages > 1 && (
                                <div className="px-5 py-3.5 border-t border-gray-100 dark:border-[#1F232C] flex items-center justify-between text-xs text-gray-500">
                                    <span>Showing page {usersPage} of {usersTotalPages} ({usersTotal} total)</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            disabled={usersPage <= 1}
                                            onClick={() => setUsersPage((p) => Math.max(p - 1, 1))}
                                            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#252A36] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#181C26]"
                                        >
                                            Previous
                                        </button>
                                        <button
                                            disabled={usersPage >= usersTotalPages}
                                            onClick={() => setUsersPage((p) => p + 1)}
                                            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#252A36] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#181C26]"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========================================== */}
                {/* 3. POST MODERATION TAB */}
                {/* ========================================== */}
                {activeTab === 'posts' && (
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="flex gap-3 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-4 shadow-xs">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search stories by content or keyword..."
                                    value={postSearch}
                                    onChange={(e) => {
                                        setPostSearch(e.target.value);
                                        setPostsPage(1);
                                    }}
                                    className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-2.5 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                />
                                <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
                            </div>
                        </div>

                        {/* Posts Grid */}
                        {postsLoading ? (
                            <div className="py-20 text-center text-sm text-gray-400">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#D97B4F] border-t-transparent mb-2" />
                                <p>Loading posts stream...</p>
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="py-16 text-center text-sm text-gray-500 rounded-3xl bg-white dark:bg-[#12151C] border border-gray-200 dark:border-[#1F232C]">
                                No posts found.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {posts.map((p) => (
                                    <div key={p._id} className="rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-5 shadow-xs flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <img
                                                        src={p.author?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.author?.name || 'User')}&background=D97B4F&color=fff`}
                                                        alt=""
                                                        referrerPolicy="no-referrer"
                                                        className="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-[#1F232C]"
                                                    />
                                                    <div className="min-w-0">
                                                        <div className="font-bold text-xs truncate">{p.author?.name}</div>
                                                        <div className="text-[10px] text-gray-400 truncate">@{p.author?.username}</div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-gray-400 shrink-0">
                                                    {safeFormatDate(p.createdAt, { addSuffix: true })}
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-800 dark:text-[#E7E6E3] line-clamp-3 leading-relaxed whitespace-pre-wrap">
                                                {p.content}
                                            </p>

                                            {p.image && (
                                                <div className="mt-3 rounded-2xl overflow-hidden h-36 bg-gray-100 dark:bg-black/30">
                                                    <img src={p.image} alt="" className="h-full w-full object-cover" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-[#1F232C] flex items-center justify-between">
                                            <div className="flex items-center gap-3 text-xs text-gray-400">
                                                <span>❤️ {p.likes?.length || 0}</span>
                                                <span>💬 {p.comments?.length || 0}</span>
                                            </div>

                                            <button
                                                onClick={() => setDeletePostConfirm(p._id)}
                                                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold transition-colors flex items-center gap-1"
                                            >
                                                <span>🗑️ Delete Story</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {postsTotalPages > 1 && (
                            <div className="px-5 py-3.5 rounded-2xl bg-white dark:bg-[#12151C] border border-gray-200 dark:border-[#1F232C] flex items-center justify-between text-xs text-gray-500">
                                <span>Showing page {postsPage} of {postsTotalPages} ({postsTotal} total)</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        disabled={postsPage <= 1}
                                        onClick={() => setPostsPage((p) => Math.max(p - 1, 1))}
                                        className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#252A36] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#181C26]"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        disabled={postsPage >= postsTotalPages}
                                        onClick={() => setPostsPage((p) => p + 1)}
                                        className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-[#252A36] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#181C26]"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================== */}
                {/* 4. ANNOUNCEMENTS TAB */}
                {/* ========================================== */}
                {activeTab === 'announcements' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Compose Form */}
                        <div className="lg:col-span-7 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs">
                            <div className="flex items-center gap-3 mb-5">
                                <span className="h-10 w-10 rounded-2xl bg-[#FF8F6B]/20 text-[#D97B4F] dark:text-[#F5C36B] grid place-items-center text-xl font-bold">📢</span>
                                <div>
                                    <h3 className="font-['Fraunces'] text-xl font-bold">Broadcast Announcement</h3>
                                    <p className="text-xs text-gray-400">Send an instant notification alert to all active platform users</p>
                                </div>
                            </div>

                            {announcementSuccess && (
                                <div className="mb-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
                                    <span>✅</span>
                                    <span>{announcementSuccess}</span>
                                </div>
                            )}

                            <form onSubmit={handleBroadcastAnnouncement} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                                        Announcement Title
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 🎉 Welcome to Zephyra 2.0! or ⚡ Scheduled Maintenance"
                                        value={announcementTitle}
                                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1.5">
                                        Message Details
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Write your announcement content here. All users will receive this as an official notification alert..."
                                        value={announcementMessage}
                                        onChange={(e) => setAnnouncementMessage(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8F6B]/50 resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={announcementSending || !announcementTitle.trim() || !announcementMessage.trim()}
                                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold text-sm hover:brightness-105 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all flex items-center justify-center gap-2"
                                >
                                    {announcementSending ? (
                                        <div className="h-5 w-5 border-2 border-[#1A140D] border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Broadcast to All Users</span>
                                            <span>🚀</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Live Preview Card */}
                        <div className="lg:col-span-5 rounded-3xl border border-gray-200/80 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-xs flex flex-col justify-between">
                            <div>
                                <span className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-3 block">
                                    Recipient Notification Preview
                                </span>

                                <div className="rounded-2xl border border-[#D97B4F]/30 bg-[#FFF8F4] dark:bg-[#181C26] p-4 shadow-sm space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-[#D97B4F] dark:text-[#F5C36B]">
                                        <span>📢</span>
                                        <span>OFFICIAL ANNOUNCEMENT</span>
                                    </div>
                                    <h4 className="font-['Fraunces'] font-bold text-base text-gray-900 dark:text-white">
                                        {announcementTitle || 'Announcement Title Preview'}
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                        {announcementMessage || 'Your message will appear here in the user notification drawer and live popups.'}
                                    </p>
                                    <div className="text-[10px] text-gray-400 pt-2 border-t border-gray-200/60 dark:border-[#252A36]">
                                        Just now • Sent by Zephyra Administration
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 rounded-2xl bg-gray-50 dark:bg-[#181C26] border border-gray-100 dark:border-[#252A36] text-xs text-gray-500 space-y-1">
                                <p className="font-bold text-gray-700 dark:text-gray-300">💡 Broadcast Note</p>
                                <p>Announcements trigger a high-priority notification in the notification badge and drawer for every member of Zephyra.</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Ban / Suspension Modal */}
            {banModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-gray-200 dark:border-[#1F232C] bg-white dark:bg-[#12151C] p-6 shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="h-10 w-10 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 grid place-items-center text-xl">🚫</span>
                            <div>
                                <h3 className="font-['Fraunces'] text-lg font-bold">
                                    {banModalUser.isBanned ? 'Lift Account Suspension' : 'Suspend User Account'}
                                </h3>
                                <p className="text-xs text-gray-400">@{banModalUser.username} ({banModalUser.name})</p>
                            </div>
                        </div>

                        {!banModalUser.isBanned && (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-1">
                                    Reason for Suspension
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Explain why this account is being suspended (visible to user)..."
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-200 dark:border-[#252A36] bg-gray-50 dark:bg-[#181C26] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                />
                            </div>
                        )}

                        <p className="text-xs text-gray-500">
                            {banModalUser.isBanned
                                ? 'Lifting this suspension will restore the user’s ability to post, message, and interact on the platform.'
                                : 'Suspending this user will immediately revoke their posting, commenting, and direct messaging privileges.'}
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <button
                                onClick={() => setBanModalUser(null)}
                                className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 dark:border-[#252A36] hover:bg-gray-50 dark:hover:bg-[#181C26]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBanSubmit}
                                disabled={banActionLoading}
                                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-colors ${banModalUser.isBanned ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}
                            >
                                {banActionLoading ? 'Saving...' : banModalUser.isBanned ? 'Lift Suspension' : 'Confirm Suspension'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete User Confirmation */}
            {deleteUserConfirm && (
                <ConfirmDialog
                    isOpen={Boolean(deleteUserConfirm)}
                    title="Permanently Delete User"
                    message="Are you sure you want to permanently delete this user account? All their stories and interactions will be removed forever."
                    confirmText="Delete Account"
                    confirmVariant="danger"
                    onConfirm={() => handleDeleteUser(deleteUserConfirm)}
                    onCancel={() => setDeleteUserConfirm(null)}
                />
            )}

            {/* Delete Post Confirmation */}
            {deletePostConfirm && (
                <ConfirmDialog
                    isOpen={Boolean(deletePostConfirm)}
                    title="Delete Community Story"
                    message="Are you sure you want to remove this story? As an administrator, this content will be removed immediately from Zephyra."
                    confirmText="Delete Story"
                    confirmVariant="danger"
                    onConfirm={() => handleDeletePost(deletePostConfirm)}
                    onCancel={() => setDeletePostConfirm(null)}
                />
            )}
        </div>
    );
}
