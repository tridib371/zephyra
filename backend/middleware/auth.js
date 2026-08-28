const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes – verifies JWT token
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Get token from header (format: "Bearer <token>")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token (excluding password)
            if (decoded.id === 'admin_super_user' || decoded.role === 'admin') {
                const foundUser = decoded.id !== 'admin_super_user' ? await User.findById(decoded.id).select('-password') : null;
                req.user = foundUser || {
                    _id: 'admin_super_user',
                    id: 'admin_super_user',
                    name: 'Super Admin',
                    username: decoded.username || 'admin',
                    email: 'admin@zephyra.com',
                    role: 'admin',
                    isBanned: false,
                };
            } else {
                req.user = await User.findById(decoded.id).select('-password');
            }

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found',
                });
            }

            // Check if account is banned/suspended
            if (req.user.isBanned) {
                return res.status(403).json({
                    success: false,
                    isBanned: true,
                    message: req.user.bannedReason
                        ? `Your account has been suspended: ${req.user.bannedReason}`
                        : 'Your account has been suspended by an administrator.',
                });
            }

            next(); // Proceed to the next middleware/route
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
        });
    }
};

// Middleware to require Admin role
const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Administrator privileges required.',
        });
    }
    next();
};

// Middleware to require Moderator or Admin role
const requireModeratorOrAdmin = (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Moderator or Administrator privileges required.',
        });
    }
    next();
};

module.exports = { protect, requireAdmin, requireModeratorOrAdmin };