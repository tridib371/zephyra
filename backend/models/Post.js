const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Please add content to your post'],
            maxlength: [2000, 'Content cannot be more than 2000 characters'],
            trim: true,
        },
        image: {
            type: String,
            default: '', // Will store Cloudinary URL later
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

// Virtual to count likes and comments (optional but useful)
PostSchema.virtual('likesCount').get(function () {
    return this.likes.length;
});

PostSchema.virtual('commentsCount').get(function () {
    return this.comments.length;
});

// Ensure virtuals are included in JSON output
PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Post', PostSchema);