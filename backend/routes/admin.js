const express = require('express');
const jwt = require('jsonwebtoken');
const { protect, requireAdmin } = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const router = express.Router();

// ==========================================
// 0. ADMIN PORTAL GATE LOGIN
// ==========================================
// @route   POST /api/admin/login
// @desc    Authenticate Administrator with fixed credentials
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide administrator Email/Username and Password',
            });
        }

        const cleanId = String(identifier).trim().toLowerCase();
        const isUserMatch =
            cleanId === 'sarkartridib813' ||
            cleanId === 'sarkartridib813@gmail.com' ||
            cleanId === 'tridibsarkar813' ||
            cleanId === 'tridibsarkar813@gmail.com';

        const isPasswordMatch = password === 'SarkarTridib813$';

        if (!isUserMatch || !isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Administrator Credentials. Access Denied.',
            });
        }

        // Find or promote the admin user in DB
        let adminUser = await User.findOne({
            $or: [
                { username: 'tridibsarkar813' },
                { username: 'sarkartridib813' },
                { email: 'tridibsarkar813@gmail.com' },
                { email: 'sarkartridib813@gmail.com' },
            ],
        });

        if (!adminUser) {
            adminUser = await User.findOne({ role: 'admin' });
        }

        if (adminUser) {
            adminUser.role = 'admin';
            await adminUser.save();
        }

        const token = jwt.sign(
            {
                id: adminUser ? adminUser._id : 'admin_super_user',
                username: 'sarkartridib813',
                role: 'admin',
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            success: true,
            message: 'Administrator Authenticated Successfully',
            token,
            admin: {
                username: 'sarkartridib813',
                name: adminUser?.name || 'Tridib Sarkar',
                email: adminUser?.email || 'sarkartridib813@gmail.com',
                role: 'admin',
            },
        });
    } catch (err) {
        console.error('Admin login error:', err);
        res.status(500).json({ success: false, message: 'Server error during admin authentication' });
    }
});

// ==========================================
// 1. STATS & ANALYTICS OVERVIEW
// ==========================================
// @route   GET /api/admin/stats
// @desc    Get system-wide analytics & stats
// @access  Private (Admin Only)
router.get('/stats', protect, requireAdmin, async (req, res) => {
    try {
        const [
            totalUsers,
            totalPosts,
            bannedUsers,
            adminCount,
            moderatorCount,
            recentUsers,
            recentPosts,
        ] = await Promise.all([
            User.countDocuments(),
            Post.countDocuments(),
            User.countDocuments({ isBanned: true }),
            User.countDocuments({ role: 'admin' }),
            User.countDocuments({ role: 'moderator' }),
            User.find()
                .select('name username email profilePicture role isBanned createdAt')
                .sort({ createdAt: -1 })
                .limit(5),
            Post.find()
                .populate('author', 'name username profilePicture')
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        // Aggregate total likes and comments
        const postAggregations = await Post.aggregate([
            {
                $project: {
                    likesCount: { $size: { $ifNull: ['$likes', []] } },
                    commentsCount: { $size: { $ifNull: ['$comments', []] } },
                },
            },
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: '$likesCount' },
                    totalComments: { $sum: '$commentsCount' },
                },
            },
        ]);

        const totalLikes = postAggregations[0]?.totalLikes || 0;
        const totalComments = postAggregations[0]?.totalComments || 0;

        // Calculate 7-day registration growth
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyRegistrations = await User.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Generate full 7-day calendar array
        const growthDays = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const found = dailyRegistrations.find((r) => r._id === dateStr);
            growthDays.push({
                date: dateStr,
                day: d.toLocaleDateString('en-US', { weekday: 'short' }),
                count: found ? found.count : 0,
            });
        }

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalPosts,
                totalLikes,
                totalComments,
                bannedUsers,
                adminCount,
                moderatorCount,
                growthDays,
                recentUsers,
                recentPosts,
            },
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        res.status(500).json({ success: false, message: 'Server error loading admin stats' });
    }
});

// ==========================================
// 2. USER MANAGEMENT
// ==========================================
// @route   GET /api/admin/users
// @desc    Get paginated users with search & filters
// @access  Private (Admin Only)
router.get('/users', protect, requireAdmin, async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 15, 1);
        const search = req.query.q ? req.query.q.trim() : '';
        const roleFilter = req.query.role || '';
        const statusFilter = req.query.status || '';

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (roleFilter && ['user', 'moderator', 'admin'].includes(roleFilter)) {
            query.role = roleFilter;
        }

        if (statusFilter === 'banned') {
            query.isBanned = true;
        } else if (statusFilter === 'active') {
            query.isBanned = { $ne: true };
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Fetch post counts for these users in one batch
        const userIds = users.map((u) => u._id);
        const postCounts = await Post.aggregate([
            { $match: { author: { $in: userIds } } },
            { $group: { _id: '$author', count: { $sum: 1 } } },
        ]);
        const postCountMap = new Map(postCounts.map((p) => [p._id.toString(), p.count]));

        const enrichedUsers = users.map((u) => ({
            ...u.toObject(),
            postCount: postCountMap.get(u._id.toString()) || 0,
        }));

        res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            users: enrichedUsers,
        });
    } catch (error) {
        console.error('Admin users error:', error);
        res.status(500).json({ success: false, message: 'Server error loading users' });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Change user role (user, moderator, admin)
// @access  Private (Admin Only)
router.put('/users/:id/role', protect, requireAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'moderator', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }

        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent self-demotion if the admin is the only admin
        if (targetUser._id.toString() === req.user._id.toString() && role !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot demote the only remaining administrator.',
                });
            }
        }

        targetUser.role = role;
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: `User role updated to ${role} successfully`,
            user: targetUser,
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({ success: false, message: 'Server error updating user role' });
    }
});

// @route   PUT /api/admin/users/:id/ban
// @desc    Ban or Unban a user
// @access  Private (Admin Only)
router.put('/users/:id/ban', protect, requireAdmin, async (req, res) => {
    try {
        const { isBanned, reason } = req.body;
        const targetUser = await User.findById(req.params.id);

        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Prevent banning administrators
        if (targetUser.role === 'admin') {
            return res.status(403).json({ success: false, message: 'Cannot suspend an Administrator account' });
        }

        // Prevent moderators from banning other moderators
        if (req.user.role === 'moderator' && targetUser.role === 'moderator') {
            return res.status(403).json({ success: false, message: 'Moderators cannot suspend other moderators' });
        }

        targetUser.isBanned = Boolean(isBanned);
        targetUser.bannedReason = isBanned ? (reason || 'Violation of community guidelines') : '';
        targetUser.bannedAt = isBanned ? new Date() : null;
        await targetUser.save();

        res.status(200).json({
            success: true,
            message: isBanned ? 'User has been suspended' : 'User suspension lifted',
            user: targetUser,
        });
    } catch (error) {
        console.error('Ban user error:', error);
        res.status(500).json({ success: false, message: 'Server error updating user ban status' });
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Permanently delete a user account
// @access  Private (Admin Only)
router.delete('/users/:id', protect, requireAdmin, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (targetUser._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Cannot delete your own account from admin panel' });
        }

        // Remove user's posts
        await Post.deleteMany({ author: targetUser._id });

        // Remove user
        await User.findByIdAndDelete(targetUser._id);

        res.status(200).json({ success: true, message: 'User account and posts deleted permanently' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting user' });
    }
});

// ==========================================
// 3. POST MODERATION
// ==========================================
// @route   GET /api/admin/posts
// @desc    Get paginated posts for moderation
// @access  Private (Admin Only)
router.get('/posts', protect, requireAdmin, async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit, 10) || 15, 1);
        const search = req.query.q ? req.query.q.trim() : '';

        const query = {};
        if (search) {
            query.content = { $regex: search, $options: 'i' };
        }

        const total = await Post.countDocuments(query);
        const posts = await Post.find(query)
            .populate('author', 'name username profilePicture email role isBanned')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            success: true,
            total,
            page,
            pages: Math.ceil(total / limit),
            posts,
        });
    } catch (error) {
        console.error('Admin posts error:', error);
        res.status(500).json({ success: false, message: 'Server error loading posts' });
    }
});

// @route   DELETE /api/admin/posts/:id
// @desc    Delete any post (Admin moderation)
// @access  Private (Admin Only)
router.delete('/posts/:id', protect, requireAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        await Post.findByIdAndDelete(post._id);

        // Delete associated notifications
        await Notification.deleteMany({ post: post._id });

        // Emit real-time post deletion
        const io = req.app.get('io');
        if (io) {
            io.emit('post:deleted', { postId: post._id });
        }

        res.status(200).json({ success: true, message: 'Post deleted successfully by moderator' });
    } catch (error) {
        console.error('Admin delete post error:', error);
        res.status(500).json({ success: false, message: 'Server error deleting post' });
    }
});

// ==========================================
// 4. PLATFORM ANNOUNCEMENTS
// ==========================================
// @route   POST /api/admin/announcements
// @desc    Broadcast platform announcement to all users
// @access  Private (Admin Only)
router.post('/announcements', protect, requireAdmin, async (req, res) => {
    try {
        const { title, message } = req.body;
        if (!title || !title.trim() || !message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Announcement title and message are required' });
        }

        const cleanTitle = title.trim();
        const cleanMessage = message.trim();

        // Get all active users
        const users = await User.find({ isBanned: { $ne: true } }).select('_id');

        if (users.length === 0) {
            return res.status(200).json({ success: true, message: 'No recipients found' });
        }

        // Create notifications for all users in bulk
        const notificationsData = users.map((u) => ({
            recipient: u._id,
            sender: req.user._id,
            type: 'announcement',
            title: cleanTitle,
            message: cleanMessage,
            read: false,
        }));

        await Notification.insertMany(notificationsData);

        // Emit real-time announcement to all sockets
        const io = req.app.get('io');
        if (io) {
            io.emit('announcement:new', {
                title: cleanTitle,
                message: cleanMessage,
                sender: {
                    _id: req.user._id,
                    name: req.user.name,
                    username: req.user.username,
                    profilePicture: req.user.profilePicture,
                },
                createdAt: new Date(),
            });
        }

        res.status(201).json({
            success: true,
            message: `Announcement broadcasted to ${users.length} users successfully!`,
            count: users.length,
        });
    } catch (error) {
        console.error('Announcement broadcast error:', error);
        res.status(500).json({ success: false, message: 'Server error broadcasting announcement' });
    }
});

module.exports = router;
