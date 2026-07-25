const express = require('express');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { image } = req.body;

        console.log('📸 Upload request received');
        console.log('  Image present:', !!image);
        console.log('  Image length:', image ? image.length : 0);

        if (!image) {
            console.log('❌ No image provided');
            return res.status(400).json({
                success: false,
                message: 'No image provided',
            });
        }

        // Check if image is a valid base64 string
        if (!image.startsWith('data:image')) {
            console.log('❌ Invalid image format (not base64)');
            return res.status(400).json({
                success: false,
                message: 'Invalid image format. Please try again.',
            });
        }

        console.log('⏳ Uploading to Cloudinary...');

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'zephyra/posts',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ],
        });

        console.log('✅ Upload successful! Public ID:', result.public_id);

        res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        console.error('  Error message:', error.message);
        console.error('  Error stack:', error.stack);

        // Check for specific Cloudinary errors
        if (error.message && error.message.includes('invalid api key')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Cloudinary credentials. Please check your API keys.',
            });
        }

        if (error.message && error.message.includes('File size too large')) {
            return res.status(413).json({
                success: false,
                message: 'Image file is too large. Please use an image under 5MB.',
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to upload image. Please try again.',
        });
    }
});

module.exports = router;