import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { HiOutlinePhoto } from 'react-icons/hi2';

// ===== UNIQUE CELESTIAL DRAFTING ASTROLABE & CREATIVE SPARKS BACKGROUND =====
const CreateBackgroundAnimation = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            <style>{`
                @keyframes astrolabeRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes astrolabeReverse {
                    0% { transform: rotate(360deg); }
                    100% { transform: rotate(0deg); }
                }
                @keyframes sparkTwinkle {
                    0%, 100% { transform: scale(0.6) rotate(0deg); opacity: 0.2; }
                    50% { transform: scale(1.4) rotate(45deg); opacity: 0.85; }
                }
                @keyframes quillFloat {
                    0%, 100% { transform: translateY(0px) rotate(-5deg); }
                    50% { transform: translateY(-20px) rotate(15deg); }
                }
                @keyframes draftingPulse {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.15); opacity: 0.75; }
                }
                .animate-astrolabe-main {
                    animation: astrolabeRotate 42s linear infinite;
                    transform-origin: center center;
                }
                .animate-astrolabe-inner {
                    animation: astrolabeReverse 28s linear infinite;
                    transform-origin: center center;
                }
                .animate-spark-1 { animation: sparkTwinkle 3.8s ease-in-out infinite; }
                .animate-spark-2 { animation: sparkTwinkle 5s ease-in-out infinite 1.5s; }
                .animate-spark-3 { animation: sparkTwinkle 4.2s ease-in-out infinite 2.6s; }
                .animate-quill { animation: quillFloat 7s ease-in-out infinite; }
                .animate-drafting-aura { animation: draftingPulse 9s ease-in-out infinite; }
            `}</style>

            {/* 1. Ambient Creative Wellspring Glow Orbs */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] rounded-full bg-gradient-to-b from-[#FF8F6B]/25 via-[#D97B4F]/15 to-transparent blur-3xl animate-drafting-aura" />
            <div className="absolute -bottom-24 -left-20 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tr from-[#F5C36B]/25 via-[#EA580C]/15 to-transparent blur-3xl" />
            <div className="absolute -bottom-24 -right-20 w-80 sm:w-[480px] h-80 sm:h-[480px] rounded-full bg-gradient-to-tl from-[#FF8F6B]/25 via-[#D97B4F]/15 to-transparent blur-3xl" />

            {/* 2. Celestial Drafting Astrolabe / Polyhedral Compass (Centered Behind Canvas) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] sm:w-[720px] h-[480px] sm:h-[720px] opacity-35 dark:opacity-25">
                {/* Outer Drafting Astrolabe Ring */}
                <svg viewBox="0 0 500 500" className="w-full h-full animate-astrolabe-main">
                    <circle cx="250" cy="250" r="235" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="8 8" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                    <circle cx="250" cy="250" r="215" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#F5C36B] dark:text-[#F5C36B]" />
                    {/* 8-Pointed Star Astrolabe Polygon */}
                    <polygon points="250,20 310,190 480,250 310,310 250,480 190,310 20,250 190,190" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" className="text-[#E2774C] dark:text-[#FF8F6B]" />
                    <polygon points="250,55 388,112 445,250 388,388 250,445 112,388 55,250 112,112" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-[#F5C36B]/60 dark:text-[#F5C36B]/50" />
                </svg>

                {/* Inner Counter-Rotating Drafting Rose */}
                <svg viewBox="0 0 500 500" className="absolute inset-0 w-full h-full animate-astrolabe-inner">
                    <circle cx="250" cy="250" r="160" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 5" className="text-[#D97B4F] dark:text-[#FF8F6B]" />
                    <circle cx="250" cy="250" r="110" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#F5C36B] dark:text-[#F5C36B]" />
                    <line x1="140" y1="140" x2="360" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-[#D97B4F]/60 dark:text-[#FF8F6B]/50" />
                    <line x1="140" y1="360" x2="360" y2="140" stroke="currentColor" strokeWidth="1" strokeDasharray="6 6" className="text-[#D97B4F]/60 dark:text-[#FF8F6B]/50" />
                    {/* Orbiting focal markers */}
                    <circle cx="250" cy="90" r="4.5" fill="#FF8F6B" />
                    <circle cx="410" cy="250" r="5" fill="#F5C36B" />
                    <circle cx="250" cy="410" r="4.5" fill="#EA580C" />
                    <circle cx="90" cy="250" r="5" fill="#D97B4F" />
                </svg>
            </div>

            {/* 3. Floating Creative Shimmer Sparks */}
            <div className="absolute top-[18%] left-[12%] animate-spark-1 opacity-70">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#FF8F6B] dark:text-[#FF8F6B]">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>
            <div className="absolute top-[28%] right-[14%] animate-spark-2 opacity-70">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#F5C36B] dark:text-[#F5C36B]">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>
            <div className="absolute bottom-[22%] left-[16%] animate-spark-3 opacity-60">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#E2774C] dark:text-[#FF8F6B]">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>
            <div className="absolute bottom-[30%] right-[15%] animate-spark-1 opacity-65" style={{ animationDelay: '-2s' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[#F5C36B] dark:text-[#F5C36B]">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>

            {/* 4. Ambient Floating Drafting Feather / Quill Badge */}
            <div className="absolute top-[14%] right-[22%] animate-quill opacity-40 dark:opacity-30">
                <div className="px-3 py-1 rounded-full bg-[#FF8F6B]/25 text-[#9E3610] dark:text-[#FF8F6B] border border-black/20 dark:border-[#FF8F6B]/40 text-[9px] font-black tracking-widest uppercase">
                    ✨ Inspiration
                </div>
            </div>
            <div className="absolute bottom-[16%] left-[24%] animate-quill opacity-40 dark:opacity-30" style={{ animationDelay: '-3.5s' }}>
                <div className="px-3 py-1 rounded-full bg-[#F5C36B]/25 text-[#9E3610] dark:text-[#F5C36B] border border-black/20 dark:border-[#F5C36B]/40 text-[9px] font-black tracking-widest uppercase">
                    🪶 Quill Craft
                </div>
            </div>
        </div>
    );
};

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) {
            setError('Please write something or add an image.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            let imageUrl = '';

            if (image) {
                setUploadingImage(true);
                const uploadRes = await api.post('/upload', { image });
                imageUrl = uploadRes.data.url;
                setUploadingImage(false);
            }

            await api.post('/posts', { content, image: imageUrl });
            navigate('/feed');
        } catch (err) {
            console.error('Create post error:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
            setLoading(false);
            setUploadingImage(false);
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
                                    Craft your words and broadcast your voice across Zephyra
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
                                placeholder="What thoughts or ideas do you want to share today?"
                                rows={5}
                                className="w-full p-4 bg-[#E2B293] dark:bg-[#0E1116] border-2 border-black dark:border-[#3A3F4B] rounded-2xl text-[#1A0F08] dark:text-[#E7E6E3] placeholder-[#5C361E] dark:placeholder-[#6E7280] font-bold focus:ring-2 focus:ring-black dark:focus:ring-[#FF8F6B]/50 transition outline-none resize-none text-sm sm:text-base leading-relaxed shadow-inner"
                            />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative rounded-2xl overflow-hidden border-2 border-black dark:border-[#1F232C] shadow-sm">
                                <img
                                    src={imagePreview}
                                    alt="Post preview"
                                    className="w-full max-h-80 object-contain bg-[#D59E7C] dark:bg-[#0E1116]"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2.5 right-2.5 p-1.5 bg-black/80 hover:bg-black text-white rounded-full transition-colors cursor-pointer border border-white/40"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                                        <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        <div className="flex flex-wrap justify-between items-center pt-2 gap-3 border-t-2 border-black/15 dark:border-[#1F232C]">
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-4 py-2 bg-[#E2B293] dark:bg-[#181C26] hover:bg-[#D59E7C] dark:hover:bg-[#252A36] rounded-2xl border-2 border-black dark:border-[#2A2E3B] transition-all text-xs font-black text-[#1A0F08] dark:text-[#EDEBE6] cursor-pointer shadow-xs"
                                >
                                    <HiOutlinePhoto className="text-base text-[#9E3610] dark:text-[#FF8F6B]" />
                                    <span>{image ? 'Change Photo' : 'Attach Photo'}</span>
                                </button>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || uploadingImage}
                                className="px-7 py-2.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-black rounded-full hover:scale-105 active:scale-95 transition-all border-2 border-black shadow-xs disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                            >
                                {loading || uploadingImage ? 'Publishing...' : 'Publish Post →'}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default CreatePost;