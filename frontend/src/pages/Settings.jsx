import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineAdjustmentsHorizontal, HiOutlineShieldCheck, HiOutlineCheck } from 'react-icons/hi2';

// ===== UNIQUE GEAR & CALIBRATION DIAL BACKGROUND ANIMATION =====
const SettingsBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <style>{`
                @keyframes gearRotateClockwise {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes gearRotateCounter {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes sliderFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.35; }
                    50% { transform: translateY(-25px) rotate(8deg); opacity: 0.8; }
                }
                @keyframes calibrationPulse {
                    0%, 100% { transform: scale(1); opacity: 0.35; }
                    50% { transform: scale(1.18); opacity: 0.7; }
                }
                .animate-gear-main {
                    animation: gearRotateClockwise 50s linear infinite;
                    transform-origin: center center;
                }
                .animate-gear-sub {
                    animation: gearRotateCounter 32s linear infinite;
                    transform-origin: center center;
                }
                .animate-slider-1 { animation: sliderFloat 7s ease-in-out infinite; }
                .animate-slider-2 { animation: sliderFloat 9s ease-in-out infinite 2s; }
                .animate-slider-3 { animation: sliderFloat 8s ease-in-out infinite 4s; }
                .animate-calib-pulse { animation: calibrationPulse 8s ease-in-out infinite; }
            `}</style>

            {/* 1. Ambient Radial Calibration Glow Flares */}
            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[480px] sm:w-[750px] h-[480px] sm:h-[750px] rounded-full bg-gradient-to-b from-[#FF8F6B]/25 via-[#D97B4F]/15 to-transparent blur-3xl animate-calib-pulse" />
            <div className="absolute -bottom-28 -left-28 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-tr from-[#F5C36B]/20 via-[#EA580C]/15 to-transparent blur-3xl" />
            <div className="absolute -bottom-28 -right-28 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-gradient-to-tl from-[#FF8F6B]/20 via-[#D97B4F]/15 to-transparent blur-3xl" />

            {/* 2. Interlocking Precision Mechanical Calibration Gears */}
            <div className="absolute -top-12 -right-12 w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] opacity-35 dark:opacity-20">
                {/* Primary Outer Precision Cogwheel */}
                <svg viewBox="0 0 400 400" className="w-full h-full animate-gear-main text-[#D97B4F] dark:text-[#FF8F6B]">
                    <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="14 10" />
                    <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="200" cy="200" r="90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" />
                    <circle cx="200" cy="200" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                    {/* Gear teeth spikes */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                        <line
                            key={deg}
                            x1="200"
                            y1="10"
                            x2="200"
                            y2="35"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            transform={`rotate(${deg} 200 200)`}
                        />
                    ))}
                    {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
                        <circle
                            key={deg}
                            cx="200"
                            cy="75"
                            r="3"
                            fill="currentColor"
                            transform={`rotate(${deg} 200 200)`}
                        />
                    ))}
                </svg>
            </div>

            {/* Secondary Interlocking Sub-Pinion (Bottom Left) */}
            <div className="absolute -bottom-16 -left-16 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] opacity-35 dark:opacity-20">
                <svg viewBox="0 0 300 300" className="w-full h-full animate-gear-sub text-[#F5C36B] dark:text-[#F5C36B]">
                    <circle cx="150" cy="150" r="130" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="8 6" />
                    <circle cx="150" cy="150" r="100" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="150" cy="150" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <line
                            key={deg}
                            x1="150"
                            y1="8"
                            x2="150"
                            y2="28"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            transform={`rotate(${deg} 150 150)`}
                        />
                    ))}
                </svg>
            </div>

            {/* 3. Floating Security & Calibration Badges */}
            <div className="absolute top-[22%] left-[10%] animate-slider-1">
                <div className="px-3.5 py-1.5 rounded-full bg-[#FF8F6B]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase">
                    ⚙️ Calibration Hub
                </div>
            </div>
            <div className="absolute top-[35%] right-[12%] animate-slider-2">
                <div className="px-3.5 py-1.5 rounded-full bg-[#F5C36B]/25 text-[#9E3610] dark:text-[#F5C36B] border border-black/20 dark:border-[#F5C36B]/40 text-[9px] font-black tracking-widest uppercase">
                    🔒 Privacy Vault
                </div>
            </div>
            <div className="absolute bottom-[25%] left-[15%] animate-slider-3">
                <div className="px-3.5 py-1.5 rounded-full bg-[#EA580C]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase">
                    ⚡ Live Synchronization
                </div>
            </div>

            {/* 4. Precision Crosshairs */}
            <div className="absolute top-[15%] left-[30%] opacity-40 dark:opacity-30 text-[#D97B4F] dark:text-[#FF8F6B] text-xs font-black">
                + [0x7E : CALIB]
            </div>
            <div className="absolute bottom-[18%] right-[28%] opacity-40 dark:opacity-30 text-[#F5C36B] dark:text-[#F5C36B] text-xs font-black">
                + [PREF : OK]
            </div>
        </div>
    );
};

const Settings = () => {
    const { user, updateUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');
    const [statusType, setStatusType] = useState('success');
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
            setStatusType('success');
            setStatus('Profile settings updated successfully.');
        } catch (error) {
            console.error('Update profile error:', error);
            setStatusType('error');
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
                setStatusType('error');
                setStatus('New password and confirm password do not match.');
                setSaving(false);
                return;
            }

            await api.put('/users/me/password', passwordData);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setStatusType('success');
            setStatus('Password updated successfully.');
        } catch (error) {
            console.error('Password update error:', error);
            setStatusType('error');
            setStatus(error.response?.data?.message || 'Failed to update password.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] px-4 sm:px-6 py-10 font-[Manrope] transition-colors duration-300 overflow-x-hidden">
            {/* Unique Gear & Calibration Dial Background */}
            <SettingsBackgroundAnimation />

            <div className="relative z-10 max-w-5xl mx-auto space-y-6">
                {/* Header Banner */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl shadow-[6px_6px_0px_#000000] dark:shadow-2xl p-6 sm:p-9"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF8F6B]/30 dark:bg-white/5 px-3.5 py-1 text-[10px] font-black uppercase tracking-widest text-[#6B2207] dark:text-[#F5C36B] border border-black dark:border-[#FF8F6B]/40">
                                ⚙️ System Controls
                            </span>
                            <h1 className="mt-2.5 text-2xl sm:text-4xl font-extrabold font-['Fraunces'] italic tracking-tight text-[#1A0F08] dark:text-white">
                                Edit Profile & Preferences
                            </h1>
                            <p className="mt-1 text-xs sm:text-sm font-extrabold text-[#5C361E] dark:text-[#A0A6B6]">
                                Calibrate your public identity, privacy access controls, and notification preferences.
                            </p>
                        </div>
                    </div>

                    {status && (
                        <div className={`mt-5 rounded-2xl border-2 border-black px-4 py-3 text-xs font-black flex items-center gap-2 shadow-xs ${
                            statusType === 'success'
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-300'
                                : 'bg-red-100 dark:bg-red-950/60 text-red-950 dark:text-red-300'
                        }`}>
                            <HiOutlineCheck className="text-base shrink-0" />
                            <span>{status}</span>
                        </div>
                    )}
                </motion.section>

                <div className="grid gap-6 lg:grid-cols-12">
                    {/* Main Profile Form */}
                    <motion.form
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSubmit}
                        className="lg:col-span-8 rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl shadow-[6px_6px_0px_#000000] dark:shadow-2xl p-6 sm:p-8 space-y-6"
                    >
                        {/* Profile Section */}
                        <div className="pb-4 border-b-2 border-black/15 dark:border-[#1F232C]">
                            <div className="flex items-center gap-2">
                                <HiOutlineUser className="text-xl text-[#9E3610] dark:text-[#FF8F6B]" />
                                <h2 className="text-lg font-black text-[#1A0F08] dark:text-white font-['Fraunces'] italic">
                                    Public Identity
                                </h2>
                            </div>
                            <p className="text-xs font-bold text-[#5C361E] dark:text-[#8A8F9C] mt-0.5">
                                This information is visible to the entire Zephyra community.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Full Name</span>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#F5C36B] text-[#1A0F08] dark:text-[#EDEBE6] shadow-inner"
                                />
                            </label>
                            <label className="space-y-1.5">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Username</span>
                                <input
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#F5C36B] text-[#1A0F08] dark:text-[#EDEBE6] shadow-inner"
                                />
                            </label>
                            <label className="space-y-1.5 sm:col-span-2">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Bio</span>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] p-4 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#F5C36B] text-[#1A0F08] dark:text-[#EDEBE6] resize-none shadow-inner"
                                />
                            </label>
                            <label className="space-y-1.5">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Location</span>
                                <input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="City, Country"
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#F5C36B] text-[#1A0F08] dark:text-[#EDEBE6] placeholder-[#5C361E]/70 shadow-inner"
                                />
                            </label>
                            <label className="space-y-1.5">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Website</span>
                                <input
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    placeholder="https://"
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#F5C36B] text-[#1A0F08] dark:text-[#EDEBE6] placeholder-[#5C361E]/70 shadow-inner"
                                />
                            </label>
                            <label className="space-y-1.5 sm:col-span-2">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Profile Picture URL</span>
                                <input
                                    name="profilePicture"
                                    value={formData.profilePicture}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#F5C36B] text-[#1A0F08] dark:text-[#EDEBE6] placeholder-[#5C361E]/70 shadow-inner"
                                />
                            </label>
                        </div>

                        {/* Preferences Section */}
                        <div className="pt-4 pb-2 border-t-2 border-black/15 dark:border-[#1F232C]">
                            <div className="flex items-center gap-2">
                                <HiOutlineAdjustmentsHorizontal className="text-xl text-[#9E3610] dark:text-[#FF8F6B]" />
                                <h2 className="text-lg font-black text-[#1A0F08] dark:text-white font-['Fraunces'] italic">
                                    Privacy & Notification Preferences
                                </h2>
                            </div>
                            <p className="text-xs font-bold text-[#5C361E] dark:text-[#8A8F9C] mt-0.5">
                                Customize theme mode, direct message access, and automated notification alerts.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-1.5">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Theme Mode</span>
                                <select
                                    name="preferences.theme"
                                    value={formData.preferences.theme}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black text-[#1A0F08] dark:text-[#EDEBE6]"
                                >
                                    <option value="system">System Default</option>
                                    <option value="light">Light Mode</option>
                                    <option value="dark">Dark Mode</option>
                                </select>
                            </label>
                            <label className="space-y-1.5">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Profile Visibility</span>
                                <select
                                    name="preferences.profileVisibility"
                                    value={formData.preferences.profileVisibility}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black text-[#1A0F08] dark:text-[#EDEBE6]"
                                >
                                    <option value="public">Public (Everyone)</option>
                                    <option value="private">Private (Restricted)</option>
                                </select>
                            </label>
                            <label className="space-y-1.5 sm:col-span-2">
                                <span className="text-xs font-black uppercase tracking-wider text-[#5C361E] dark:text-[#E7E6E3]">Direct Messages Allowed From</span>
                                <select
                                    name="preferences.dmAccess"
                                    value={formData.preferences.dmAccess}
                                    onChange={handleChange}
                                    className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-3 text-xs sm:text-sm font-bold outline-none focus:ring-2 focus:ring-black text-[#1A0F08] dark:text-[#EDEBE6]"
                                >
                                    <option value="everyone">Everyone</option>
                                    <option value="followers">Followers only</option>
                                </select>
                            </label>
                            <div className="sm:col-span-2 grid gap-3 rounded-2xl border-2 border-black/25 dark:border-white/10 bg-[#E2B293]/60 dark:bg-white/5 p-4">
                                <label className="flex items-center justify-between gap-3 cursor-pointer">
                                    <span className="text-xs sm:text-sm font-black text-[#1A0F08] dark:text-[#E7E6E3]">Email Notification Digests</span>
                                    <input
                                        type="checkbox"
                                        name="preferences.emailNotifications"
                                        checked={formData.preferences.emailNotifications}
                                        onChange={handleChange}
                                        className="h-5 w-5 rounded-md border-2 border-black text-[#D97B4F] focus:ring-black cursor-pointer"
                                    />
                                </label>
                                <label className="flex items-center justify-between gap-3 cursor-pointer">
                                    <span className="text-xs sm:text-sm font-black text-[#1A0F08] dark:text-[#E7E6E3]">Push Notifications</span>
                                    <input
                                        type="checkbox"
                                        name="preferences.pushNotifications"
                                        checked={formData.preferences.pushNotifications}
                                        onChange={handleChange}
                                        className="h-5 w-5 rounded-md border-2 border-black text-[#D97B4F] focus:ring-black cursor-pointer"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {saving ? 'Saving Changes...' : 'Save Settings →'}
                            </button>
                        </div>
                    </motion.form>

                    {/* Sidebar: Live Preview & Password Update */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Live Avatar Preview Card */}
                        <motion.section
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl shadow-[6px_6px_0px_#000000] dark:shadow-2xl p-6"
                        >
                            <div className="flex items-center gap-2 pb-3 border-b-2 border-black/15 dark:border-[#1F232C]">
                                <HiOutlineShieldCheck className="text-lg text-[#9E3610] dark:text-[#FF8F6B]" />
                                <h2 className="text-base font-black text-[#1A0F08] dark:text-white font-['Fraunces'] italic">
                                    Card Preview
                                </h2>
                            </div>
                            <div className="mt-4 rounded-2xl overflow-hidden border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] shadow-sm">
                                <div className="h-20 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] opacity-90 border-b-2 border-black" />
                                <div className="px-5 pb-5 -mt-10">
                                    <img
                                        src={formData.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                        alt="Preview"
                                        className="h-20 w-20 rounded-full object-cover border-2 border-black ring-4 ring-[#FAF7F2] dark:ring-[#0E1116] shadow-md"
                                        onError={(e) => {
                                            e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                        }}
                                    />
                                    <h3 className="mt-3 text-lg font-extrabold text-[#1A0F08] dark:text-white font-['Fraunces']">
                                        {formData.name || 'Your name'}
                                    </h3>
                                    <p className="text-xs font-extrabold text-[#5C361E] dark:text-[#8A8F9C]">
                                        @{formData.username || 'username'}
                                    </p>
                                    <p className="mt-2 text-xs font-bold text-[#402414] dark:text-[#A0A6B6] leading-relaxed">
                                        {formData.bio || 'Your public bio preview will appear here.'}
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Password Change Card */}
                        <motion.form
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            onSubmit={handlePasswordChange}
                            className="rounded-3xl border-2 border-black dark:border-[#FF8F6B]/35 bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl shadow-[6px_6px_0px_#000000] dark:shadow-2xl p-6 space-y-4"
                        >
                            <div className="flex items-center gap-2 pb-2 border-b-2 border-black/15 dark:border-[#1F232C]">
                                <HiOutlineLockClosed className="text-lg text-[#9E3610] dark:text-[#FF8F6B]" />
                                <h2 className="text-base font-black text-[#1A0F08] dark:text-white font-['Fraunces'] italic">
                                    Change Password
                                </h2>
                            </div>
                            <p className="text-[11px] font-bold text-[#5C361E] dark:text-[#8A8F9C]">
                                Available for registered email and password accounts.
                            </p>

                            <input
                                type="password"
                                placeholder="Current password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-black text-[#1A0F08] dark:text-[#EDEBE6] placeholder-[#5C361E]/70 shadow-inner"
                            />
                            <input
                                type="password"
                                placeholder="New password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-black text-[#1A0F08] dark:text-[#EDEBE6] placeholder-[#5C361E]/70 shadow-inner"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full rounded-2xl border-2 border-black dark:border-white/10 bg-[#E2B293] dark:bg-[#0E1116] px-4 py-2.5 text-xs font-bold outline-none focus:ring-2 focus:ring-black text-[#1A0F08] dark:text-[#EDEBE6] placeholder-[#5C361E]/70 shadow-inner"
                            />

                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-2.5 rounded-full bg-[#E2B293] dark:bg-white/5 border-2 border-black hover:bg-[#D59E7C] text-[#1A0F08] dark:text-[#EDEBE6] text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                {saving ? 'Updating Password...' : 'Update Password'}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;