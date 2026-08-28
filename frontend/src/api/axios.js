import axios from 'axios';

const getBaseUrl = () => {
    const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;
    if (envUrl) {
        return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
    }
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return '/api';
    }
    return 'http://localhost:5000/api';
};

const api = axios.create({
    baseURL: getBaseUrl(),
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