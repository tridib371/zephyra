import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CreatePost = () => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            setError('Please write something before posting.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/posts', { content });
            navigate('/feed');
        } catch (err) {
            console.error('Create post error:', err);
            setError(err.response?.data?.message || 'Failed to create post. Please try again.');
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto p-4 sm:p-6 min-h-[70vh]"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3 mb-6">
                    <img
                        src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-purple-500 object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Post</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Share what's on your mind</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's happening, 🌬️?"
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none resize-none"
                    />

                    <div className="flex justify-between items-center mt-4">
                        <div className="flex gap-2 text-gray-500 dark:text-gray-400">
                            {/* Image upload button (placeholder) */}
                            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                                📷
                            </button>
                            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                                🎥
                            </button>
                            <button type="button" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
                                #️⃣
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Posting...' : 'Post ✨'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default CreatePost;