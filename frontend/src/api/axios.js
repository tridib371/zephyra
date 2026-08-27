import axios from 'axios';

// Prefer explicit VITE_API_URL; otherwise fall back to backend port 5000
const base = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: base,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token to every request
api.interceptors.request.use(
    (config) => {
        let token;
        if (config.url && config.url.includes('/admin')) {
            token = localStorage.getItem('zephyra_admin_token') || localStorage.getItem('zephyra_token');
        } else {
            token = localStorage.getItem('zephyra_token');
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;