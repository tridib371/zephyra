const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private (requires token)
router.post('/', protect, async (req, res) => {
    try {
        const { content, image } = req.body;

        if (!content || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Post content is required',
            });
        }

        const post = await Post.create({
            content,
            image: image || '',
            author: req.user._id,
        });

        // Populate the author details before sending response
        await post.populate('author', 'name username profilePicture');

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
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
            .sort({ createdAt: -1 }); // Newest first

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
            .populate('comments.user', 'name username profilePicture');

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

        // Check if the logged-in user is the author
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

// ========== LIKE / UNLIKE ==========

// @route   POST /api/posts/:id/like
// @desc    Like a post
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Check if user already liked
        if (post.likes.includes(req.user._id)) {
            return res.status(400).json({ success: false, message: 'Post already liked' });
        }

        post.likes.push(req.user._id);
        await post.save();

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

        // Check if user has liked
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

module.exports = router;