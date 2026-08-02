const axios = require('axios');
const io = require('socket.io-client');

const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

async function createUser(email, username) {
    const password = 'Password1!';
    const res = await axios.post(`${API_BASE}/auth/register`, {
        name: username,
        username,
        email,
        password,
    });
    return res.data;
}

async function login(email, password = 'Password1!') {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return res.data;
}

async function run() {
    try {
        const t = Date.now();
        const emailA = `e2e_a_${t}@example.com`;
        const emailB = `e2e_b_${t}@example.com`;
        const usernameA = `e2e_user_a_${t}`;
        const usernameB = `e2e_user_b_${t}`;

        console.log('Registering users...');
        const regA = await createUser(emailA, usernameA);
        const regB = await createUser(emailB, usernameB);

        console.log('Logging in users...');
        const loginA = await login(emailA);
        const loginB = await login(emailB);

        const tokenA = loginA.token;
        const tokenB = loginB.token;
        const userA = loginA.user;
        const userB = loginB.user;

        console.log('Creating/Getting conversation from A->B');
        const convRes = await axios.post(`${API_BASE}/messages/conversations/user/${userB.id}`, {}, { headers: { Authorization: `Bearer ${tokenA}` } });
        const conversation = convRes.data.conversation;
        console.log('Conversation id:', conversation._id);

        console.log('Connecting socket for B to listen for messages');
        const socketB = io(process.env.SOCKET_URL || 'http://localhost:5000', { transports: ['websocket'] });
        let received = false;

        socketB.on('connect', () => {
            console.log('socketB connected, joining user room');
            socketB.emit('join', userB.id);
        });

        socketB.on('message:new', (payload) => {
            console.log('socketB received message:new', payload.message.text, 'conversationId:', payload.conversationId);
            if (payload.conversationId === conversation._id && payload.message.text === 'Hello from A') {
                received = true;
            }
        });

        // wait for socket to connect
        await wait(1000);

        console.log('A sends a message (via curl)');
        const { execSync } = require('child_process');
        const payload = '{"text":"Hello from A"}';
        const escapedPayload = payload.replace(/"/g, '\\"');
        const curlCmd = `curl -s -X POST "${API_BASE.replace('/api', '')}/api/messages/conversations/${conversation._id}" -H "Authorization: Bearer ${tokenA}" -H "Content-Type: application/json" -d \"${escapedPayload}\"`;
        execSync(curlCmd, { stdio: 'inherit', shell: true });

        console.log('Waiting up to 5s for B to receive...');
        const start = Date.now();
        while (Date.now() - start < 5000) {
            if (received) break;
            await wait(200);
        }

        if (received) {
            console.log('E2E success: message received by B via socket');
            process.exit(0);
        } else {
            console.error('E2E failure: B did not receive message via socket within timeout');
            process.exit(2);
        }
    } catch (err) {
        console.error('E2E error:', err.response ? err.response.data : err.message);
        process.exit(3);
    }
}

run();
