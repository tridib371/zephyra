const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const createNotification = require('../utils/notificationHelper');
const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { content, image } = req.body;

        const hasContent = typeof content === 'string' && content.trim().length > 0;
        const hasImage = typeof image === 'string' && image.trim().length > 0;

        if (!hasContent && !hasImage) {
            return res.status(400).json({
                success: false,
                message: 'Please write something or attach an image/video to your post.',
            });
        }

        const post = await Post.create({
            content: hasContent ? content.trim() : '',
            image: hasImage ? image.trim() : '',
            author: req.user._id,
        });

        await post.populate('author', 'name username profilePicture');

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error. Please try again.',
        });
    }
});

// @route   GET /api/posts
// @desc    Get all posts (feed)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name username profilePicture')
            .populate('comments.user', 'name username profilePicture')
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
});

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name username profilePicture')
            .populate('comments.user', 'name username profilePicture')
            .lean();

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        res.status(200).json({
            success: true,
            post,
        });
    } catch (error) {
        console.error('Get single post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post (only by the author)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found',
            });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post',
            });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
        });
    } catch (error) {
        console.error('Delete post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
});

// ========== LIKES ==========

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'Post already liked' });
        }

        post.likes.push(req.user._id);
        await post.save();

        await createNotification({
            recipient: post.author,
            sender: req.user._id,
            type: 'like',
            post: post._id,
            io: req.app.get('io'),
        });

        res.status(200).json({ success: true, likes: post.likes });
    } catch (error) {
        console.error('Like error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/posts/:id/like
// @desc    Unlike a post
// @access  Private
router.delete('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const index = post.likes.indexOf(req.user._id);
        if (index === -1) {
            return res.status(400).json({ success: false, message: 'Post not liked yet' });
        }

        post.likes.splice(index, 1);
        await post.save();

        res.status(200).json({ success: true, likes: post.likes });
    } catch (error) {
        console.error('Unlike error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ========== COMMENTS ==========

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', protect, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim() === '') {
            return res.status(400).json({ success: false, message: 'Comment text is required' });
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const newComment = {
            user: req.user._id,
            text: text.trim(),
            createdAt: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        await post.populate('comments.user', 'name username profilePicture');

        const addedComment = post.comments[post.comments.length - 1];

        await createNotification({
            recipient: post.author,
            sender: req.user._id,
            type: 'comment',
            post: post._id,
            commentId: addedComment._id.toString(),
            commentText: addedComment.text,
            io: req.app.get('io'),
        });

        res.status(201).json({ success: true, comment: addedComment });
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/posts/:id/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:id/comments/:commentId', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const commentIndex = post.comments.findIndex(c => c._id.toString() === req.params.commentId);
        if (commentIndex === -1) {
            return res.status(404).json({ success: false, message: 'Comment not found' });
        }

        const comment = post.comments[commentIndex];
        if (comment.user.toString() !== req.user._id.toString() && post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
        }

        post.comments.splice(commentIndex, 1);
        await post.save();

        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/posts/user/:userId
// @desc    Get all posts by a specific user
// @access  Private
router.get('/user/:userId', protect, async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name username profilePicture')
            .populate('comments.user', 'name username profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: posts.length,
            posts,
        });
    } catch (error) {
        console.error('Get user posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
});

module.exports = router;