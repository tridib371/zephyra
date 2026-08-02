const axios = require('axios');
const API_BASE = process.env.API_BASE || 'http://localhost:5000/api';

async function run() {
    try {
        const t = Date.now();
        const emailA = `e2e_a_${t}@example.com`;
        const emailB = `e2e_b_${t}@example.com`;
        const usernameA = `e2e_user_a_${t}`;
        const usernameB = `e2e_user_b_${t}`;
        const password = 'Password1!';

        const regA = await axios.post(`${API_BASE}/auth/register`, { name: usernameA, username: usernameA, email: emailA, password });
        const regB = await axios.post(`${API_BASE}/auth/register`, { name: usernameB, username: usernameB, email: emailB, password });

        const loginA = await axios.post(`${API_BASE}/auth/login`, { email: emailA, password });
        const loginB = await axios.post(`${API_BASE}/auth/login`, { email: emailB, password });

        const tokenA = loginA.data.token;
        const tokenB = loginB.data.token;
        const userA = loginA.data.user;
        const userB = loginB.data.user;

        console.log('tokenA:', tokenA);
        console.log('tokenB:', tokenB);

        const conv = await axios.post(`${API_BASE}/messages/conversations/user/${userB.id}`, {}, { headers: { Authorization: `Bearer ${tokenA}` } });
        console.log('conversation id:', conv.data.conversation._id);
        console.log('Now you can run a CURL like:');
        console.log(`curl -X POST http://localhost:5000/api/messages/conversations/${conv.data.conversation._id} -H \"Authorization: Bearer ${tokenA}\" -H \"Content-Type: application/json\" -d '{"text":"hello via curl"}'`);
    } catch (err) {
        console.error(err.response ? err.response.data : err.message);
        process.exit(1);
    }
}

run();
