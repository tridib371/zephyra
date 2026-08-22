import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { HiOutlinePhoto, HiOutlineVideoCamera, HiOutlineHashtag } from 'react-icons/hi2';

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
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size should be less than 5MB');
                return;
            }
            // Check file type
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

            // Upload image if present
            if (image) {
                setUploadingImage(true);
                const uploadRes = await api.post('/upload', { image });
                imageUrl = uploadRes.data.url;
                setUploadingImage(false);
            }

            // Create post
            const res = await api.post('/posts', { content, image: imageUrl });
            navigate('/feed');
        } catch (err) {
            console.error('Create post error:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
            setLoading(false);
            setUploadingImage(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto p-4 sm:p-6 min-h-[70vh]"
        >
            <div className="bg-[#FFFDF9] dark:bg-[#12151C] rounded-3xl shadow-[0_8px_30px_-10px_rgba(217,123,79,0.12)] p-6 sm:p-8 border border-[#E2D4C3] dark:border-[#1F232C]">
                <div className="flex items-center space-x-3 mb-6">
                    <img
                        src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-[#D97B4F]/60 dark:border-[#F5C36B]/60 object-cover"
                        onError={(e) => {
                            e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                        }}
                    />
                    <div>
                        <h2 className="text-xl font-bold text-[#1F1710] dark:text-[#EDEBE6] font-['Fraunces'] italic">
                            Create Story
                        </h2>
                        <p className="text-xs text-[#665548] dark:text-[#8A8F9C] font-[Manrope]">
                            Share your thoughts or artwork with the community
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-2xl text-xs font-[Manrope]">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What is on your mind today?"
                        rows={4}
                        className="w-full px-4 py-3 bg-[#F4ECE1] dark:bg-[#0E1116] border border-[#DECDBB] dark:border-[#3A3F4B] rounded-2xl text-[#1F1710] dark:text-[#E7E6E3] placeholder:text-[#877568] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none resize-none font-[Manrope] text-sm"
                    />

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative mt-3 rounded-2xl overflow-hidden border border-[#DECDBB] dark:border-[#1F232C]">
                            <img
                                src={imagePreview}
                                alt="Post preview"
                                className="w-full max-h-80 object-contain bg-[#F4ECE1] dark:bg-[#0E1116]"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors cursor-pointer"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                        <div className="flex gap-1 text-[#665548] dark:text-[#6E7280]">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-[#EFE3D4] dark:hover:bg-[#1A1E27] rounded-xl transition-colors text-xs font-bold font-[Manrope] cursor-pointer"
                            >
                                <HiOutlinePhoto className="text-base text-[#D97B4F]" />
                                <span>Photo</span>
                            </button>
                            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || uploadingImage}
                            className="px-6 py-2.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold rounded-full hover:scale-105 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-[Manrope] text-xs cursor-pointer"
                        >
                            {uploadingImage ? 'Uploading Image...' : loading ? 'Publishing...' : 'Publish Story'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default CreatePost;