const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            lowercase: true,
            trim: true,
            index: true,
        },
        otp: {
            type: String,
            required: [true, 'Please provide an OTP code'],
            trim: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: { expires: 0 }, // Automatically delete document when expiresAt timestamp is reached
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Otp', OtpSchema);
