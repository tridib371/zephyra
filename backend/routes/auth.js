const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { verifyIdToken } = require('../config/firebaseAdmin');
const router = express.Router();

// Password strength regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Password strength check
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).',
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || username)}&background=D97B4F&color=fff`;

        const user = await User.create({
            name,
            username,
            email,
            password: hashedPassword,
            profilePicture: avatarFallback,
        });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            success: true,
            token,
            user: {
                _id: user._id,
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

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        if (user.password) {
            const isMatch = await user.matchPassword(password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid email or password',
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: 'This account uses Google Sign-In. Please use "Continue with Google".',
            });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
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

// ============================================
// GOOGLE AUTH - FIXED PROFILE PICTURE
// ============================================
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
        console.log('Decoded token:', JSON.stringify(decodedToken, null, 2));

        // Extract user data from decoded token
        const { email, name, uid } = decodedToken;
        const picture = decodedToken.picture || decodedToken.photoURL || decodedToken.picture_url || '';

        console.log('Google user data:', { email, name, picture, uid });

        // Check if user exists with this googleId OR email
        let user = await User.findOne({ $or: [{ googleId: uid }, { email }] });

        const displayName = name || email.split('@')[0];
        const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=D97B4F&color=fff`;
        const profilePicture = picture || avatarFallback;

        if (!user) {
            // Generate a unique username from email
            let username = email.split('@')[0];
            username = username.replace(/[^a-zA-Z0-9_]/g, '');
            let usernameExists = await User.findOne({ username });
            if (usernameExists) {
                username = `${username}_${Math.floor(Math.random() * 1000)}`;
            }

            // Create new user
            user = await User.create({
                name: displayName,
                username,
                email,
                googleId: uid,
                profilePicture: profilePicture,
                bio: '',
            });

            console.log('✅ New user created with Google photo:', profilePicture);
        } else {
            // User exists - update profile picture if missing or updated
            if (picture && user.profilePicture !== picture) {
                user.profilePicture = picture;
                await user.save();
                console.log('✅ Updated profile picture for existing user:', picture);
            } else if (!user.profilePicture) {
                user.profilePicture = profilePicture;
                await user.save();
            }

            // If user exists but doesn't have googleId, update it
            if (!user.googleId) {
                user.googleId = uid;
                await user.save();
                console.log('✅ Updated googleId for existing user');
            }
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Return user data
        res.status(200).json({
            success: true,
            token,
            user: {
                _id: user._id,
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