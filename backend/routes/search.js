const express = require('express');
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');

const router = express.Router();

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @route   GET /api/search
// @desc    Search users, posts, and hashtags
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const query = (req.query.q || '').trim();

        if (!query) {
            return res.status(200).json({
                success: true,
                users: [],
                posts: [],
                hashtags: [],
            });
        }

        const safeQuery = escapeRegex(query);
        const queryRegex = new RegExp(safeQuery, 'i');
        const hashtagRegex = new RegExp(`#${safeQuery}`, 'i');

        const [users, posts] = await Promise.all([
            User.find({
                _id: { $ne: req.user._id },
                $or: [
                    { name: queryRegex },
                    { username: queryRegex },
                    { bio: queryRegex },
                ],
            })
                .select('name username bio profilePicture followers following location website')
                .limit(20),
            Post.find({
                $or: [
                    { content: queryRegex },
                    { content: hashtagRegex },
                ],
            })
                .populate('author', 'name username profilePicture')
                .sort({ createdAt: -1 })
                .limit(20),
        ]);

        const hashtagMap = new Map();
        const allHashtags = [];

        posts.forEach((post) => {
            const matches = post.content.match(/#[a-zA-Z0-9_]+/g) || [];
            matches.forEach((tag) => {
                const lower = tag.toLowerCase();
                if (lower.includes(query.toLowerCase())) {
                    hashtagMap.set(lower, (hashtagMap.get(lower) || 0) + 1);
                }
                allHashtags.push(lower);
            });
        });

        if (query.startsWith('#')) {
            const q = query.toLowerCase();
            Array.from(new Set(allHashtags)).forEach((tag) => {
                if (tag.includes(q)) {
                    hashtagMap.set(tag, (hashtagMap.get(tag) || 0) + 1);
                }
            });
        }

        const hashtags = Array.from(hashtagMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 12);

        res.status(200).json({
            success: true,
            users,
            posts,
            hashtags,
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;