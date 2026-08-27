const express = require('express');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/upload
// @desc    Upload an image or video to Cloudinary
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const media = req.body.image || req.body.video || req.body.media;

        console.log('📸/🎬 Upload request received');
        console.log('  Media present:', !!media);
        console.log('  Media length:', media ? media.length : 0);

        if (!media) {
            console.log('❌ No media provided');
            return res.status(400).json({
                success: false,
                message: 'No image or video file provided',
            });
        }

        const isImage = media.startsWith('data:image');
        const isVideo = media.startsWith('data:video');

        if (!isImage && !isVideo) {
            console.log('❌ Invalid media format (must be data:image or data:video)');
            return res.status(400).json({
                success: false,
                message: 'Invalid file format. Please upload a valid image or video.',
            });
        }

        console.log(`⏳ Uploading ${isVideo ? 'video' : 'image'} to Cloudinary...`);

        const uploadOptions = {
            folder: 'zephyra/posts',
            resource_type: isVideo ? 'video' : 'image',
        };

        if (isImage) {
            uploadOptions.transformation = [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' },
            ];
        }

        const result = await cloudinary.uploader.upload(media, uploadOptions);

        console.log('✅ Upload successful! Public ID:', result.public_id, 'Resource Type:', result.resource_type);

        res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type || (isVideo ? 'video' : 'image'),
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        console.error('  Error message:', error.message);

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
                message: 'Media file is too large. Please use a smaller file under 30MB.',
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Failed to upload media. Please try again.',
        });
    }
});

module.exports = router;