import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check if user is already logged in on page load
    useEffect(() => {
        const token = localStorage.getItem('zephyra_token');
        if (token) {
            api
                .get('/profile')
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch(() => {
                    localStorage.removeItem('zephyra_token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    // Login function (Email/Password)
    const login = async (email, password) => {
        setError(null);
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token, user } = res.data;
            localStorage.setItem('zephyra_token', token);
            setUser(user);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please try again.';
            setError(message);
            return { success: false, message };
        }
    };

    // Send Register OTP function
    const sendRegisterOtp = async (email, username) => {
        setError(null);
        try {
            const res = await api.post('/auth/send-register-otp', { email, username });
            return { success: true, message: res.data?.message || 'Verification code sent.' };
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to send verification code. Please try again.';
            setError(message);
            return { success: false, message };
        }
    };

    // Register function (Email/Password + OTP)
    const register = async (name, username, email, password, otp) => {
        setError(null);
        try {
            const res = await api.post('/auth/register', { name, username, email, password, otp });
            const { token, user } = res.data;
            localStorage.setItem('zephyra_token', token);
            setUser(user);
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please check the code and try again.';
            setError(message);
            return { success: false, message };
        }
    };

    // =====================================================
    // GOOGLE LOGIN FUNCTION (Add this right here)
    // =====================================================
    const googleLogin = async (idToken) => {
        setError(null);
        try {
            const res = await api.post('/auth/google', { idToken });
            const { token, user } = res.data;
            localStorage.setItem('zephyra_token', token);
            setUser(user);
            return { success: true };
        } catch (err) {
            console.error('Google backend auth error:', err);
            const serverMsg = err.response?.data?.message;
            const message = serverMsg || err.message || 'Google login failed. Please try again.';
            setError(message);
            return { success: false, message };
        }
    };

    // Logout function
    const logout = () => {
        localStorage.removeItem('zephyra_token');
        setUser(null);
    };

    const updateUser = (nextUser) => {
        setUser(nextUser);
    };

    // =====================================================
    // VALUE OBJECT (UPDATED TO INCLUDE sendRegisterOtp & googleLogin)
    // =====================================================
    const value = {
        user,
        loading,
        error,
        login,
        register,
        sendRegisterOtp,
        googleLogin,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};