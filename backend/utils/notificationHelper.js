const Notification = require('../models/Notification');

const createNotification = async ({ recipient, sender, type, post, commentId, commentText, io }) => {
    try {
        if (!recipient || !sender || recipient.toString() === sender.toString()) {
            return null;
        }

        const notification = await Notification.create({
            recipient,
            sender,
            type,
            post: post || null,
            commentId: commentId || '',
            commentText: commentText || '',
            read: false,
        });

        const populated = await notification.populate([
            { path: 'sender', select: 'name username profilePicture' },
            { path: 'post', select: 'content image author' },
        ]);

        if (io) {
            const unreadCount = await Notification.countDocuments({
                recipient,
                read: false,
            });

            io.to(`user_${recipient}`).emit('notification:new', {
                notification: populated,
                unreadCount,
            });
        }

        return populated;
    } catch (error) {
        console.error('❌ Error creating notification:', error);
        return null;
    }
};

module.exports = createNotification;