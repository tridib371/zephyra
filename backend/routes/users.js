const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const createNotification = require('../utils/notificationHelper');
const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (except current user)
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('name username profilePicture followers following')
            .populate('followers', 'name username profilePicture');
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/profile/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate('followers', 'name username profilePicture')
            .populate('following', 'name username profilePicture');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/users/me
// @desc    Update my profile/settings
// @access  Private
router.put('/me', protect, async (req, res) => {
    try {
        const {
            name,
            username,
            bio,
            location,
            website,
            profilePicture,
            coverPhoto,
            preferences,
        } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username: username.toLowerCase(), _id: { $ne: user._id } });
            if (usernameExists) {
                return res.status(400).json({ success: false, message: 'Username already taken' });
            }
        }

        if (name !== undefined) user.name = name;
        if (username !== undefined) user.username = username.toLowerCase();
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (website !== undefined) user.website = website;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;
        if (coverPhoto !== undefined) user.coverPhoto = coverPhoto;

        if (preferences) {
            user.preferences = {
                ...(user.preferences?._doc || user.preferences || {}),
                ...preferences,
            };
        }

        await user.save();

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/users/me/password
// @desc    Change user password
// @access  Private
router.put('/me/password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all password fields.',
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match.',
            });
        }

        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (user.password) {
            const isMatch = await user.matchPassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect.',
                });
            }
        }

        // Password strength check
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).',
            });
        }

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully.',
        });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ success: false, message: 'Server error updating password.' });
    }
});

// ========== FOLLOW / UNFOLLOW ==========

// @route   POST /api/users/:id/follow
// @desc    Follow a user
// @access  Private
router.post('/:id/follow', protect, async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        if (!userToFollow) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (userToFollow._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot follow yourself' });
        }

        if (req.user.following.includes(userToFollow._id)) {
            return res.status(400).json({ success: false, message: 'Already following this user' });
        }

        req.user.following.push(userToFollow._id);
        await req.user.save();

        userToFollow.followers.push(req.user._id);
        await userToFollow.save();

        await createNotification({
            recipient: userToFollow._id,
            sender: req.user._id,
            type: 'follow',
            io: req.app.get('io'),
        });

        res.status(200).json({
            success: true,
            message: `You are now following ${userToFollow.name}`,
        });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/users/:id/unfollow
// @desc    Unfollow a user
// @access  Private
router.delete('/:id/unfollow', protect, async (req, res) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        if (!userToUnfollow) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!req.user.following.includes(userToUnfollow._id)) {
            return res.status(400).json({ success: false, message: 'You are not following this user' });
        }

        req.user.following = req.user.following.filter(id => id.toString() !== userToUnfollow._id.toString());
        await req.user.save();

        userToUnfollow.followers = userToUnfollow.followers.filter(id => id.toString() !== req.user._id.toString());
        await userToUnfollow.save();

        res.status(200).json({
            success: true,
            message: `You have unfollowed ${userToUnfollow.name}`,
        });
    } catch (error) {
        console.error('Unfollow error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/users/:id/followers
// @desc    Get followers of a user
// @access  Private
router.get('/:id/followers', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'followers',
            select: 'name username profilePicture followers',
            populate: {
                path: 'followers',
                select: '_id',
            },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, followers: user.followers });
    } catch (error) {
        console.error('Get followers error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/users/:id/following
// @desc    Get following of a user
// @access  Private
router.get('/:id/following', protect, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate({
            path: 'following',
            select: 'name username profilePicture followers',
            populate: {
                path: 'followers',
                select: '_id',
            },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, following: user.following });
    } catch (error) {
        console.error('Get following error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;