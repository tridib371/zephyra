const path = require('path');

// Load env from backend/.env for Vercel serverless
require('dotenv').config({ path: path.join(__dirname, '..', 'backend', '.env') });

// Also try root .env
if (!process.env.MONGO_URI) {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
}

const app = require('../backend/server');

module.exports = (req, res) => {
    // Strip /api prefix since Express routes already mount at /api
    // Vercel sends the full path, but Express expects paths relative to the router mount

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    return app(req, res);
};
