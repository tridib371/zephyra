const express = require('express');
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name username profilePicture')
            .populate('post', 'content image')
            .sort({ createdAt: -1 })
            .limit(100);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            read: false,
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protect, async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { $set: { read: true } }
        );

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            read: false,
        });

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            unreadCount,
        });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (!notification.read) {
            notification.read = true;
            await notification.save();
        }

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            read: false,
        });

        res.status(200).json({
            success: true,
            notification,
            unreadCount,
        });
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            read: false,
        });

        res.status(200).json({
            success: true,
            message: 'Notification deleted',
            unreadCount,
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;