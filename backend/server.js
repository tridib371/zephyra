const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { protect } = require('./middleware/auth');

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
// Helmet for security headers
app.use(helmet());

// CORS for cross-origin requests
app.use(cors());

// JSON parser with increased limit for image uploads (10MB)
app.use(express.json({ limit: '10mb' }));

// Morgan for logging
app.use(morgan('dev'));

// ===== MONGODB CONNECTION =====
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully');
    })
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    });

// ===== ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));

// ===== TEST ROUTES =====
// Public test route
app.get('/', (req, res) => {
    res.send('Zephyra API is running... 🌬️');
});

// Protected test route
app.get('/api/profile', protect, (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Zephyra backend running on http://localhost:${PORT}`);
});