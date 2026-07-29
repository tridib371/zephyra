const express = require('express');
const { protect } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

const buildConversationQuery = (userId, otherUserId) => ({
    participants: { $all: [userId, otherUserId] },
    $expr: { $eq: [{ $size: '$participants' }, 2] },
});

// @route   GET /api/messages/conversations
// @desc    Get conversation list for current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
    try {
        const conversations = await Conversation.find({ participants: req.user._id })
            .populate('participants', 'name username profilePicture')
            .populate({
                path: 'lastMessage',
                populate: [
                    { path: 'sender', select: 'name username profilePicture' },
                    { path: 'recipient', select: 'name username profilePicture' },
                ],
            })
            .sort({ lastMessageAt: -1, updatedAt: -1 });

        const conversationIds = conversations.map((conversation) => conversation._id);
        const unreadCounts = await Message.aggregate([
            {
                $match: {
                    conversation: { $in: conversationIds },
                    recipient: req.user._id,
                    read: false,
                },
            },
            {
                $group: {
                    _id: '$conversation',
                    count: { $sum: 1 },
                },
            },
        ]);

        const unreadMap = new Map(unreadCounts.map((item) => [item._id.toString(), item.count]));

        const normalized = conversations.map((conversation) => ({
            ...conversation.toObject(),
            unreadCount: unreadMap.get(conversation._id.toString()) || 0,
        }));

        res.status(200).json({ success: true, conversations: normalized });
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/messages/conversations/:userId
// @desc    Get or create a private conversation
// @access  Private
router.post('/conversations/:userId', protect, async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot message yourself' });
        }

        const otherUser = await User.findById(userId).select('name username profilePicture');
        if (!otherUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        let conversation = await Conversation.findOne(buildConversationQuery(req.user._id, userId));

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [req.user._id, userId],
            });
        }

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('participants', 'name username profilePicture');

        res.status(200).json({
            success: true,
            conversation: populatedConversation,
            otherUser,
        });
    } catch (error) {
        console.error('Create conversation error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   GET /api/messages/conversations/:conversationId
// @desc    Get messages for one conversation
// @access  Private
router.get('/conversations/:conversationId', protect, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.conversationId,
            participants: req.user._id,
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        const messages = await Message.find({ conversation: conversation._id })
            .populate('sender', 'name username profilePicture')
            .populate('recipient', 'name username profilePicture')
            .sort({ createdAt: 1 });

        res.status(200).json({ success: true, conversation, messages });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/messages/conversations/:conversationId
// @desc    Send a message
// @access  Private
router.post('/conversations/:conversationId', protect, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: 'Message text is required' });
        }

        const conversation = await Conversation.findOne({
            _id: req.params.conversationId,
            participants: req.user._id,
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        const recipientId = conversation.participants.find((participant) => participant.toString() !== req.user._id.toString());

        if (!recipientId) {
            return res.status(400).json({ success: false, message: 'Recipient not found' });
        }

        const message = await Message.create({
            conversation: conversation._id,
            sender: req.user._id,
            recipient: recipientId,
            text: text.trim(),
            read: false,
        });

        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name username profilePicture')
            .populate('recipient', 'name username profilePicture');

        const io = req.app.get('io');
        if (io) {
            io.to(`user_${req.user._id}`).emit('message:new', { message: populatedMessage, conversationId: conversation._id });
            io.to(`user_${recipientId}`).emit('message:new', { message: populatedMessage, conversationId: conversation._id });
        }

        res.status(201).json({ success: true, message: populatedMessage });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   PUT /api/messages/conversations/:conversationId/read
// @desc    Mark conversation messages as read for current user
// @access  Private
router.put('/conversations/:conversationId/read', protect, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.conversationId,
            participants: req.user._id,
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        await Message.updateMany(
            {
                conversation: conversation._id,
                recipient: req.user._id,
                read: false,
            },
            {
                $set: { read: true, readAt: new Date() },
            }
        );

        res.status(200).json({ success: true, message: 'Messages marked as read' });
    } catch (error) {
        console.error('Mark messages read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;