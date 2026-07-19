const { verifyIdToken } = require('../config/firebaseAdmin');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const bcrypt = require('bcryptjs');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists',
            });
        }

        // Hash password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user with hashed password
        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                savedPosts: user.savedPosts,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
});

// ========== NEW LOGIN ROUTE (ADD THIS) ==========
// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists with password field included
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check if password matches (only if user has a password)
        if (user.password) {
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }
        } else {
            // User signed up with Google, doesn't have a password
            return res.status(401).json({
                success: false,
                message: 'This account uses Google Sign-In. Please use "Continue with Google".',
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                savedPosts: user.savedPosts,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again.',
        });
    }
});

// ========== GOOGLE AUTH ROUTE ==========
// @route   POST /api/auth/google
// @desc    Authenticate with Google (Firebase)
// @access  Public
router.post('/google', async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({
                success: false,
                message: 'ID token is required',
            });
        }

        // Verify Firebase ID token
        const decodedToken = await verifyIdToken(idToken);
        const { email, name, picture, uid } = decodedToken;

        // Check if user exists with this googleId OR email
        let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });

        if (!user) {
            // Create new user
            let username = email.split('@')[0];
            // Check if username exists and make it unique
            let usernameExists = await User.findOne({ username });
            if (usernameExists) {
                username = `${username}_${Math.floor(Math.random() * 1000)}`;
            }

            user = await User.create({
                name: name || email.split('@')[0],
                username,
                email,
                googleId: uid,
                profilePicture: picture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
            });
        } else {
            // If user exists but doesn't have googleId, update it
            if (!user.googleId) {
                user.googleId = uid;
                await user.save();
            }
            // Update profile picture if Firebase has a new one
            if (picture && user.profilePicture !== picture) {
                user.profilePicture = picture;
                await user.save();
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                followers: user.followers,
                following: user.following,
                savedPosts: user.savedPosts,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Google authentication failed. Please try again.',
        });
    }
});

module.exports = router;