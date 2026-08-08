const express = require('express');
const { protect } = require('../middleware/auth');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get conversation list for current user
// @access  Private
router.get('/conversations', protect, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.user._id,
            deletedBy: { $ne: req.user._id },
        })
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
                    deletedFor: { $ne: req.user._id },
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

// @route   POST /api/messages/conversations/user/:userId
// @desc    Get or create a private conversation (by user id)
// @access  Private
router.post('/conversations/user/:userId', protect, async (req, res) => {
    try {
        const { userId } = req.params;

        if (userId === req.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'You cannot message yourself' });
        }

        const otherUser = await User.findById(userId).select('name username profilePicture');
        if (!otherUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const ids = [req.user._id.toString(), userId.toString()].sort();
        const threadKey = `${ids[0]}_${ids[1]}`;

        let conversation = await Conversation.findOne({ threadKey });

        if (!conversation) {
            try {
                conversation = await Conversation.create({
                    participants: [req.user._id, userId],
                    threadKey,
                });
            } catch (err) {
                conversation = await Conversation.findOne({ threadKey });
            }
        }

        // If user previously deleted this conversation, remove them from deletedBy
        if (conversation.deletedBy && conversation.deletedBy.includes(req.user._id)) {
            conversation.deletedBy = conversation.deletedBy.filter(
                (id) => id.toString() !== req.user._id.toString()
            );
            await conversation.save();
        }

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('participants', 'name username profilePicture')
            .populate({
                path: 'lastMessage',
                populate: [
                    { path: 'sender', select: 'name username profilePicture' },
                    { path: 'recipient', select: 'name username profilePicture' },
                ],
            });

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

        const messages = await Message.find({
            conversation: conversation._id,
            deletedFor: { $ne: req.user._id },
        })
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

        const otherParticipant = conversation.participants.find((participant) => {
            const pid = participant && participant._id ? participant._id.toString() : participant.toString();
            return pid !== req.user._id.toString();
        });

        if (!otherParticipant) {
            return res.status(400).json({ success: false, message: 'Recipient not found' });
        }

        const recipientId = otherParticipant._id ? otherParticipant._id : otherParticipant;

        const message = await Message.create({
            conversation: conversation._id,
            sender: req.user._id,
            recipient: recipientId,
            text: text.trim(),
            read: false,
        });

        // Clear deletedBy if recipient had previously deleted conversation
        conversation.deletedBy = [];
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name username profilePicture')
            .populate('recipient', 'name username profilePicture');

        const io = req.app.get('io');
        if (io) {
            const payload = { message: populatedMessage, conversationId: conversation._id };
            io.to(`user_${recipientId}`).emit('message:new', payload);
            io.to(`conversation_${conversation._id}`).emit('message:new', payload);
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

        const io = req.app.get('io');
        if (io) {
            io.to(`conversation_${conversation._id}`).emit('message:read', {
                conversationId: conversation._id,
                readBy: req.user._id,
            });
        }

        res.status(200).json({ success: true, message: 'Messages marked as read' });
    } catch (error) {
        console.error('Mark messages read error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/messages/conversations/:conversationId
// @desc    Delete/clear a conversation for current user
// @access  Private
router.delete('/conversations/:conversationId', protect, async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            _id: req.params.conversationId,
            participants: req.user._id,
        });

        if (!conversation) {
            return res.status(404).json({ success: false, message: 'Conversation not found' });
        }

        // Add user to deletedBy array in conversation
        if (!conversation.deletedBy.includes(req.user._id)) {
            conversation.deletedBy.push(req.user._id);
            await conversation.save();
        }

        // Add user to deletedFor in all messages of this conversation
        await Message.updateMany(
            { conversation: conversation._id },
            { $addToSet: { deletedFor: req.user._id } }
        );

        res.status(200).json({ success: true, message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   DELETE /api/messages/:messageId
// @desc    Delete a message for current user
// @access  Private
router.delete('/:messageId', protect, async (req, res) => {
    try {
        const message = await Message.findById(req.params.messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: 'Message not found' });
        }

        const isParticipant =
            message.sender.toString() === req.user._id.toString() ||
            message.recipient.toString() === req.user._id.toString();

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (!message.deletedFor.includes(req.user._id)) {
            message.deletedFor.push(req.user._id);
            await message.save();
        }

        const io = req.app.get('io');
        if (io) {
            io.to(`conversation_${message.conversation}`).emit('message:deleted', {
                messageId: message._id,
                conversationId: message.conversation,
                deletedBy: req.user._id,
            });
        }

        res.status(200).json({ success: true, message: 'Message deleted' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;