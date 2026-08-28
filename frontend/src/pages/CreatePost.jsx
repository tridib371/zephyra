import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { HiOutlinePhoto, HiOutlineVideoCamera } from 'react-icons/hi2';

// ===== UNIQUE CELESTIAL DRAFTING ASTROLABE & CREATIVE SPARKS BACKGROUND =====
const CreateBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 transform-gpu">
            {/* 1. Ambient Creative Wellspring Glow Orbs (GPU Accelerated) */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] rounded-full bg-gradient-to-b from-[#FF8F6B]/20 via-[#D97B4F]/10 to-transparent blur-2xl transform-gpu" />
            <div className="absolute -bottom-24 -left-20 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tr from-[#F5C36B]/15 via-[#EA580C]/10 to-transparent blur-2xl transform-gpu" />

            {/* 2. Desktop Only Astrolabe SVG Compass (Hidden on mobile for smooth 60fps scroll) */}
            <div className="hidden md:block transform-gpu">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] opacity-25">
                    <svg viewBox="0 0 500 500" className="w-full h-full">
                        <circle cx="250" cy="250" r="235" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 8" className="text-[#FF8F6B]" />
                        <circle cx="250" cy="250" r="215" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#F5C36B]" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [media, setMedia] = useState(null);
    const [mediaPreview, setMediaPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null); // 'image' | 'video'
    const [loading, setLoading] = useState(false);
    const [uploadingMedia, setUploadingMedia] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                setError('Image size should be less than 10MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please select a valid image file (JPG, PNG, GIF, WebP)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setMedia(reader.result);
                setMediaPreview(reader.result);
                setMediaType('image');
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check video size (max 30MB)
            if (file.size > 30 * 1024 * 1024) {
                setError('Video size must be less than 30MB');
                return;
            }
            if (!file.type.startsWith('video/')) {
                setError('Please select a valid video file (MP4, WebM, MOV)');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setMedia(reader.result);
                setMediaPreview(reader.result);
                setMediaType('video');
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleRemoveMedia = () => {
        setMedia(null);
        setMediaPreview(null);
        setMediaType(null);
        if (imageInputRef.current) imageInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !media) {
            setError('Please write something or attach an image / video.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let mediaUrl = '';

            // Upload media if present
            if (media) {
                setUploadingMedia(true);
                setUploadStatus(mediaType === 'video' ? 'Uploading & optimizing video...' : 'Uploading photo...');
                const uploadRes = await api.post('/upload', { image: media });
                mediaUrl = uploadRes.data.url;
                setUploadingMedia(false);
            }

            setUploadStatus('Publishing your post...');
            await api.post('/posts', { content, image: mediaUrl });
            navigate('/feed');
        } catch (err) {
            console.error('Create post error:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
            setLoading(false);
            setUploadingMedia(false);
            setUploadStatus('');
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-4rem)] bg-[#FAF7F2] dark:bg-[#0E1116] py-10 px-4 sm:px-6 font-[Manrope] transition-colors duration-300 overflow-x-hidden flex items-center justify-center">
            {/* Unique Celestial Drafting Astrolabe Background Animation */}
            <CreateBackgroundAnimation />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-2xl"
            >
                <div className="bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl rounded-3xl shadow-[6px_6px_0px_#000000] dark:shadow-2xl p-6 sm:p-9 border-2 border-black dark:border-[#FF8F6B]/35">
                    {/* Header with Creator Info */}
                    <div className="flex items-center justify-between pb-5 border-b-2 border-black/15 dark:border-[#1F232C] mb-6">
                        <div className="flex items-center space-x-3.5">
                            <img
                                src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full border-2 border-black dark:border-[#FF8F6B]/60 object-cover shadow-xs"
                                onError={(e) => {
                                    e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                }}
                            />
                            <div>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A0F08] dark:text-[#EDEBE6] font-['Fraunces'] italic tracking-tight">
                                    Compose Post
                                </h2>
                                <p className="text-xs text-[#5C361E] dark:text-[#8A8F9C] font-bold">
                                    Broadcast stories, photos, and videos across Zephyra
                                </p>
                            </div>
                        </div>
                        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF8F6B]/30 text-[#6B2207] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-black dark:border-[#FF8F6B]/40 text-[10px] font-black uppercase tracking-widest">
                            ✍️ Canvas
                        </span>
                    </div>

                    {error && (
                        <div className="mb-5 p-3.5 bg-red-100 dark:bg-red-900/30 border-2 border-black dark:border-red-600 text-red-900 dark:text-red-300 rounded-2xl text-xs font-black">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="What thoughts, videos, or ideas do you want to share today?"
                                rows={5}
                                className="w-full p-4 bg-[#E2B293] dark:bg-[#0E1116] border-2 border-black dark:border-[#3A3F4B] rounded-2xl text-[#1A0F08] dark:text-[#E7E6E3] placeholder-[#5C361E] dark:placeholder-[#6E7280] font-bold focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 transition outline-none resize-none text-sm sm:text-base leading-relaxed shadow-inner"
                            />
                        </div>

                        {/* Media Preview (Photo or Video) */}
                        {mediaPreview && (
                            <div className="relative rounded-2xl overflow-hidden border-2 border-black dark:border-[#1F232C] shadow-sm bg-[#D59E7C] dark:bg-[#0E1116]">
                                {mediaType === 'video' ? (
                                    <video
                                        src={mediaPreview}
                                        controls
                                        autoPlay
                                        muted
                                        className="w-full max-h-80 object-contain rounded-2xl"
                                    />
                                ) : (
                                    <img
                                        src={mediaPreview}
                                        alt="Post preview"
                                        className="w-full max-h-80 object-contain"
                                    />
                                )}

                                <div className="absolute top-2.5 left-2.5 px-3 py-1 bg-black/80 text-white rounded-full text-[10px] font-black uppercase tracking-wider border border-white/30">
                                    {mediaType === 'video' ? '🎬 Video Attached' : '📸 Photo Attached'}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRemoveMedia}
                                    className="absolute top-2.5 right-2.5 p-1.5 bg-black/80 hover:bg-black text-white rounded-full transition-colors cursor-pointer border border-white/40"
                                    title="Remove attachment"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Upload Status Banner */}
                        {uploadStatus && (
                            <div className="p-3 bg-[#E2B293] dark:bg-[#1A1E27] border-2 border-black rounded-2xl flex items-center gap-3 text-xs font-black text-[#1A0F08] dark:text-white">
                                <div className="h-4 w-4 border-2 border-[#9E3610] dark:border-[#FF8F6B] border-t-transparent rounded-full animate-spin" />
                                <span>{uploadStatus}</span>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-between items-center pt-2 gap-3 border-t-2 border-black/15 dark:border-[#1F232C]">
                            <div className="flex flex-wrap gap-2">
                                {/* Photo button */}
                                <button
                                    type="button"
                                    onClick={() => imageInputRef.current?.click()}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 border-black dark:border-[#2A2E3B] transition-all text-xs font-black cursor-pointer shadow-xs ${
                                        mediaType === 'image'
                                            ? 'bg-[#D59E7C] dark:bg-[#2A2E3B] text-[#1A0F08] dark:text-white'
                                            : 'bg-[#E2B293] dark:bg-[#181C26] hover:bg-[#D59E7C] dark:hover:bg-[#252A36] text-[#1A0F08] dark:text-[#EDEBE6]'
                                    }`}
                                >
                                    <HiOutlinePhoto className="text-base text-[#9E3610] dark:text-[#FF8F6B]" />
                                    <span>{mediaType === 'image' ? 'Change Photo' : 'Photo'}</span>
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={imageInputRef}
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                {/* Video button */}
                                <button
                                    type="button"
                                    onClick={() => videoInputRef.current?.click()}
                                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border-2 border-black dark:border-[#2A2E3B] transition-all text-xs font-black cursor-pointer shadow-xs ${
                                        mediaType === 'video'
                                            ? 'bg-[#D59E7C] dark:bg-[#2A2E3B] text-[#1A0F08] dark:text-white'
                                            : 'bg-[#E2B293] dark:bg-[#181C26] hover:bg-[#D59E7C] dark:hover:bg-[#252A36] text-[#1A0F08] dark:text-[#EDEBE6]'
                                    }`}
                                >
                                    <HiOutlineVideoCamera className="text-base text-blue-800 dark:text-blue-400" />
                                    <span>{mediaType === 'video' ? 'Change Video' : 'Video'}</span>
                                </button>
                                <input
                                    type="file"
                                    accept="video/mp4,video/webm,video/quicktime,video/mov"
                                    ref={videoInputRef}
                                    onChange={handleVideoChange}
                                    className="hidden"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || uploadingMedia}
                                className="px-7 py-2.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-black rounded-full hover:scale-105 active:scale-95 transition-all border-2 border-black shadow-xs disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                            >
                                {loading || uploadingMedia ? (uploadStatus || 'Publishing...') : 'Publish Post →'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreatePost;