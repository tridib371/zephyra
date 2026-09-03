const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            default: '',
            maxlength: [2000, 'Content cannot be more than 2000 characters'],
            trim: true,
        },
        image: {
            type: String,
            default: '',
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                text: {
                    type: String,
                    required: true,
                    trim: true,
                    maxlength: [500, 'Comment cannot be more than 500 characters'],
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

// ===== SAFE VIRTUAL GETTERS (prevent undefined errors) =====
PostSchema.virtual('likesCount').get(function () {
    return this.likes ? this.likes.length : 0;
});

PostSchema.virtual('commentsCount').get(function () {
    return this.comments ? this.comments.length : 0;
});

// Ensure virtuals are included in JSON output
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', PostSchema);