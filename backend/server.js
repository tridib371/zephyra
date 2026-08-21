const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { protect } = require('./middleware/auth');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
});

app.set('io', io);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
});

// ===== ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/search', require('./routes/search'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

// Test route
app.get('/', (req, res) => {
    res.send('Zephyra API is running... 🌬️');
});

app.get('/api/profile', protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

io.on('connection', (socket) => {
    socket.on('join', (userId) => {
        if (userId) {
            socket.join(`user_${userId}`);
        }
    });

    socket.on('leave', (userId) => {
        if (userId) {
            socket.leave(`user_${userId}`);
        }
    });

    socket.on('join_conversation', (conversationId) => {
        if (conversationId) {
            socket.join(`conversation_${conversationId}`);
        }
    });

    socket.on('leave_conversation', (conversationId) => {
        if (conversationId) {
            socket.leave(`conversation_${conversationId}`);
        }
    });

    socket.on('typing', ({ conversationId, userId, username }) => {
        if (conversationId) {
            socket.to(`conversation_${conversationId}`).emit('typing', { conversationId, userId, username });
        }
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
        if (conversationId) {
            socket.to(`conversation_${conversationId}`).emit('stop_typing', { conversationId, userId });
        }
    });
});

const START_PORT = parseInt(process.env.PORT, 10) || 5000;
const MAX_PORT_ATTEMPTS = 10;
const net = require('net');

async function findFreePort(startPort, maxAttempts) {
    let port = startPort;
    for (let i = 0; i < maxAttempts; i += 1) {
        const isFree = await new Promise((resolve) => {
            const tester = net.createServer()
                .once('error', () => resolve(false))
                .once('listening', () => tester.close(() => resolve(true)))
                .listen(port);
        });

        if (isFree) return port;
        port += 1;
    }
    throw new Error(`No free port found in range ${startPort}..${startPort + maxAttempts - 1}`);
}

(async () => {
    try {
        const port = await findFreePort(START_PORT, MAX_PORT_ATTEMPTS);
        server.listen(port, () => {
            console.log(`🚀 Zephyra backend running on http://localhost:${port}`);
        });
    } catch (err) {
        console.error(err.message || err);
        process.exit(1);
    }
})();