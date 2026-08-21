const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['like', 'comment', 'follow', 'announcement'],
            required: true,
            index: true,
        },
        title: {
            type: String,
            default: '',
            trim: true,
        },
        message: {
            type: String,
            default: '',
            trim: true,
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
        commentId: {
            type: String,
            default: '',
        },
        commentText: {
            type: String,
            default: '',
            trim: true,
            maxlength: [500, 'Comment text cannot be more than 500 characters'],
        },
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

NotificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);