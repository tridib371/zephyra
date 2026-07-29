import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        bio: '',
        location: '',
        website: '',
        profilePicture: '',
        coverPhoto: '',
        preferences: {
            theme: 'system',
            profileVisibility: 'public',
            dmAccess: 'everyone',
            emailNotifications: true,
            pushNotifications: true,
        },
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (!user) return;

        setFormData({
            name: user.name || '',
            username: user.username || '',
            bio: user.bio || '',
            location: user.location || '',
            website: user.website || '',
            profilePicture: user.profilePicture || '',
            coverPhoto: user.coverPhoto || '',
            preferences: {
                theme: user.preferences?.theme || 'system',
                profileVisibility: user.preferences?.profileVisibility || 'public',
                dmAccess: user.preferences?.dmAccess || 'everyone',
                emailNotifications: user.preferences?.emailNotifications ?? true,
                pushNotifications: user.preferences?.pushNotifications ?? true,
            },
        });
    }, [user]);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        if (name.startsWith('preferences.')) {
            const key = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                preferences: {
                    ...prev.preferences,
                    [key]: type === 'checkbox' ? checked : value,
                },
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus('');

        try {
            const payload = {
                ...formData,
                username: formData.username.trim().toLowerCase(),
            };

            const res = await api.put('/users/me', payload);
            updateUser(res.data.user);
            setStatus('Profile updated successfully.');
        } catch (error) {
            console.error('Update profile error:', error);
            setStatus(error.response?.data?.message || 'Failed to save changes.');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        setSaving(true);
        setStatus('');

        try {
            if (passwordData.newPassword !== passwordData.confirmPassword) {
                setStatus('New password and confirm password do not match.');
                setSaving(false);
                return;
            }

            await api.put('/users/me/password', passwordData);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setStatus('Password updated successfully.');
        } catch (error) {
            console.error('Password update error:', error);
            setStatus(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,143,107,0.12),_transparent_38%),linear-gradient(180deg,_#fff_0%,_#fbf7f2_100%)] dark:bg-[radial-gradient(circle_at_top,_rgba(245,195,107,0.12),_transparent_34%),linear-gradient(180deg,_#0E1116_0%,_#0B0E13_100%)] px-4 sm:px-6 py-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto space-y-6">
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[2rem] border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] p-6 sm:p-8"
                >
                    <p className="inline-flex rounded-full bg-[#FFF1EA] dark:bg-white/5 px-3 py-1 text-xs font-semibold tracking-[0.22em] uppercase text-[#B5652F] dark:text-[#F5C36B]">
                        Settings
                    </p>
                    <h1 className="mt-3 text-3xl sm:text-4xl font-['Fraunces'] italic text-gray-900 dark:text-white">Edit profile and preferences</h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-[#A0A6B6]">
                        Update your identity, privacy controls, and notification style in one place.
                    </p>

                    {status && (
                        <div className="mt-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-white/5 px-4 py-3 text-sm text-gray-700 dark:text-[#E7E6E3]">
                            {status}
                        </div>
                    )}
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-12">
                    <motion.form
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="lg:col-span-8 rounded-[2rem] border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] p-6 sm:p-8 space-y-5"
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile</h2>
                            <p className="text-sm text-gray-500 dark:text-[#8A8F9C]">This information appears publicly on your profile.</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Full name</span>
                                <input name="name" value={formData.name} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Username</span>
                                <input name="username" value={formData.username} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            </label>
                            <label className="space-y-2 sm:col-span-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Bio</span>
                                <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Location</span>
                                <input name="location" value={formData.location} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Website</span>
                                <input name="website" value={formData.website} onChange={handleChange} placeholder="https://" className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            </label>
                            <label className="space-y-2 sm:col-span-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Profile picture URL</span>
                                <input name="profilePicture" value={formData.profilePicture} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            </label>
                            <label className="space-y-2 sm:col-span-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Cover photo URL</span>
                                <input name="coverPhoto" value={formData.coverPhoto} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            </label>
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preferences</h2>
                            <p className="text-sm text-gray-500 dark:text-[#8A8F9C]">Tweak privacy, DM access, and notification behavior.</p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Theme preference</span>
                                <select name="preferences.theme" value={formData.preferences.theme} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]">
                                    <option value="system">System</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Profile visibility</span>
                                <select name="preferences.profileVisibility" value={formData.preferences.profileVisibility} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]">
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </label>
                            <label className="space-y-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Who can message you</span>
                                <select name="preferences.dmAccess" value={formData.preferences.dmAccess} onChange={handleChange} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]">
                                    <option value="everyone">Everyone</option>
                                    <option value="followers">Followers only</option>
                                </select>
                            </label>
                            <div className="grid gap-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 p-4">
                                <label className="flex items-center justify-between gap-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Email notifications</span>
                                    <input type="checkbox" name="preferences.emailNotifications" checked={formData.preferences.emailNotifications} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-[#D97B4F] focus:ring-[#D97B4F]" />
                                </label>
                                <label className="flex items-center justify-between gap-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-[#E7E6E3]">Push notifications</span>
                                    <input type="checkbox" name="preferences.pushNotifications" checked={formData.preferences.pushNotifications} onChange={handleChange} className="h-5 w-5 rounded border-gray-300 text-[#D97B4F] focus:ring-[#D97B4F]" />
                                </label>
                            </div>
                        </div>

                        <button disabled={saving} className="inline-flex rounded-full bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] px-6 py-3 text-sm font-semibold text-[#1A140D] shadow-lg shadow-orange-200/40 dark:shadow-black/20 disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save profile'}
                        </button>
                    </motion.form>

                    <div className="lg:col-span-4 space-y-6">
                        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] p-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Live preview</h2>
                            <div className="mt-4 rounded-[1.5rem] overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0E1116]">
                                <div className="h-24 bg-linear-to-r from-[#FF8F6B] to-[#F5C36B] opacity-90" />
                                <div className="px-5 pb-5 -mt-10">
                                    <img src={formData.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'} alt="Preview" className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white dark:ring-[#0E1116]" />
                                    <h3 className="mt-3 text-xl font-semibold text-gray-900 dark:text-white">{formData.name || 'Your name'}</h3>
                                    <p className="text-sm text-gray-500 dark:text-[#8A8F9C]">@{formData.username || 'username'}</p>
                                    <p className="mt-3 text-sm text-gray-600 dark:text-[#A0A6B6]">{formData.bio || 'Your bio will appear here.'}</p>
                                </div>
                            </div>
                        </motion.section>

                        <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePasswordChange} className="rounded-[2rem] border border-white/40 dark:border-white/8 bg-white/80 dark:bg-[#11151D]/80 backdrop-blur-xl shadow-[0_24px_80px_-40px_rgba(0,0,0,0.35)] p-6 space-y-4">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change password</h2>
                                <p className="text-sm text-gray-500 dark:text-[#8A8F9C]">Only for email/password accounts.</p>
                            </div>
                            <input type="password" placeholder="Current password" value={passwordData.currentPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            <input type="password" placeholder="New password" value={passwordData.newPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            <input type="password" placeholder="Confirm new password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))} className="w-full rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0E1116] px-4 py-3 outline-none focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] text-gray-900 dark:text-[#EDEBE6]" />
                            <button disabled={saving} className="inline-flex rounded-full border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-[#E7E6E3] disabled:opacity-50">
                                {saving ? 'Updating...' : 'Update password'}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;