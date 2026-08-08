import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';
import io from 'socket.io-client';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessageCount, setUnreadMessageCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        if (!user) {
            setNotifications([]);
            setUnreadCount(0);
            setUnreadMessageCount(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications || []);
            setUnreadCount(res.data.unreadCount || 0);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching notifications:', err);
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadMessageCount = async () => {
        if (!user) return;
        try {
            const res = await api.get('/messages/conversations');
            const convs = res.data.conversations || [];
            const totalUnread = convs.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
            setUnreadMessageCount(totalUnread);
        } catch (err) {
            console.error('❌ Error fetching unread message count:', err);
        }
    };

    useEffect(() => {
        if (authLoading) return;
        fetchNotifications();
        fetchUnreadMessageCount();
    }, [authLoading, user?._id]);

    useEffect(() => {
        if (!user) return undefined;

        const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const socket = io(SOCKET_URL, {
            transports: ['websocket'],
        });

        socket.emit('join', user._id);

        socket.on('notification:new', ({ notification, unreadCount: nextUnreadCount }) => {
            setNotifications(prev => {
                const exists = prev.some(item => item._id === notification._id);
                return exists ? prev : [notification, ...prev];
            });

            if (typeof nextUnreadCount === 'number') {
                setUnreadCount(nextUnreadCount);
            } else {
                setUnreadCount(prev => prev + 1);
            }
        });

        socket.on('message:new', ({ message }) => {
            if (message.sender?._id !== user._id) {
                setUnreadMessageCount(prev => prev + 1);
            }
        });

        return () => socket.disconnect();
    }, [user]);

    const markAsRead = async (id) => {
        let changed = false;
        setNotifications(prev => prev.map(notification => {
            if (notification._id === id && !notification.read) {
                changed = true;
                return { ...notification, read: true };
            }
            return notification;
        }));

        if (changed) {
            setUnreadCount(prev => Math.max(prev - 1, 0));
        }

        try {
            const res = await api.put(`/notifications/${id}/read`);
            if (typeof res.data.unreadCount === 'number') {
                setUnreadCount(res.data.unreadCount);
            }
            return true;
        } catch (err) {
            console.error('❌ markAsRead error:', err);
            fetchNotifications();
            return false;
        }
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
        setUnreadCount(0);

        try {
            const res = await api.put('/notifications/read-all');
            if (typeof res.data.unreadCount === 'number') {
                setUnreadCount(res.data.unreadCount);
            }
            return true;
        } catch (err) {
            console.error('❌ markAllAsRead error:', err);
            fetchNotifications();
            return false;
        }
    };

    const deleteNotification = async (id) => {
        const removed = notifications.find(notification => notification._id === id);
        setNotifications(prev => prev.filter(notification => notification._id !== id));

        if (removed && !removed.read) {
            setUnreadCount(prev => Math.max(prev - 1, 0));
        }

        try {
            const res = await api.delete(`/notifications/${id}`);
            if (typeof res.data.unreadCount === 'number') {
                setUnreadCount(res.data.unreadCount);
            }
            return true;
        } catch (err) {
            console.error('❌ deleteNotification error:', err);
            fetchNotifications();
            return false;
        }
    };

    const value = {
        notifications,
        unreadCount,
        unreadMessageCount,
        setUnreadMessageCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadMessageCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};