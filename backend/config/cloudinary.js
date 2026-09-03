const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials (with reliable production fallbacks)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'j0vgrisp',
    api_key: process.env.CLOUDINARY_API_KEY || '993732552554332',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'NeXWEvheiVYyLBOzvfmqoOQZ_j0',
});

module.exports = cloudinary;