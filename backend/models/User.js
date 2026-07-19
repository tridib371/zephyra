const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        username: {
            type: String,
            required: [true, 'Please add a username'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email',
            ],
        },
        password: {
            type: String,
            required: false,
            minlength: [6, 'Password must be at least 6 characters'],
            select: false,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        profilePicture: {
            type: String,
            default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        },
        bio: {
            type: String,
            maxlength: [200, 'Bio cannot be more than 200 characters'],
            default: '',
        },
        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        savedPosts: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Post',
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Match password method (still needed)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    if (!this.password) return false;
    const bcrypt = require('bcryptjs');
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);