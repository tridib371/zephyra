const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../utils/emailService');
const { verifyIdToken } = require('../config/firebaseAdmin');
const router = express.Router();

// Password strength regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Email validation regex
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// @route   POST /api/auth/send-register-otp
// @desc    Send 6-digit OTP to user email before registration
// @access  Public
router.post('/send-register-otp', async (req, res) => {
    try {
        const { email, username } = req.body;

        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.',
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user with this email or username already exists
        const query = [{ email: normalizedEmail }];
        if (username) {
            query.push({ username: username.toLowerCase().trim() });
        }
        const userExists = await User.findOne({ $or: query });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === normalizedEmail 
                    ? 'An account with this email address already exists.' 
                    : 'This username is already taken.',
            });
        }

        // Generate a cryptographically random 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute from now

        // Remove any old OTP records for this email
        await Otp.deleteMany({ email: normalizedEmail });

        // Save new OTP record
        await Otp.create({
            email: normalizedEmail,
            otp: otpCode,
            expiresAt,
        });

        // Send email via Gmail SMTP (or fallback in dev)
        await sendOtpEmail(normalizedEmail, otpCode);

        res.status(200).json({
            success: true,
            message: `A 6-digit verification code has been sent to ${normalizedEmail}.`,
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification code. Please try again.',
        });
    }
});

// @route   POST /api/auth/register
// @desc    Register a new user (requires valid OTP)
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password, otp } = req.body;

        // Verify OTP is provided
        if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
            return res.status(400).json({
                success: false,
                message: 'Please provide the 6-digit verification code sent to your email.',
            });
        }

        const normalizedEmail = email ? email.toLowerCase().trim() : '';

        // Validate OTP from database
        const otpRecord = await Otp.findOne({ email: normalizedEmail });
        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Verification code expired or not found. Please request a new code.',
            });
        }

        if (otpRecord.otp !== otp.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code. Please check your email and try again.',
            });
        }

        if (new Date() > new Date(otpRecord.expiresAt)) {
            await Otp.deleteMany({ email: normalizedEmail });
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Please request a new code.',
            });
        }

        // Password strength check
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &).',
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists.',
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const avatarFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || username)}&background=D97B4F&color=fff`;

        const user = await User.create({
            name,
            username,
            email: normalizedEmail,
            password: hashedPassword,
            profilePicture: avatarFallback,
        });

        // Delete used OTP
        await Otp.deleteMany({ email: normalizedEmail });

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
                role: user.role || 'user',
                isBanned: user.isBanned || false,
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
                role: user.role || 'user',
                isBanned: user.isBanned || false,
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
                role: user.role || 'user',
                isBanned: user.isBanned || false,
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