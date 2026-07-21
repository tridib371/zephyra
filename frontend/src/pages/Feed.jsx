import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const Feed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get('/posts');
                setPosts(res.data.posts);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError('Failed to load posts. Please try again.');
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 text-center text-red-500 dark:text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Here's what's happening on Zephyra.
                </p>
            </motion.div>

            {/* Posts Feed */}
            {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No posts yet. Be the first to share something! ✨
                    </p>
                    <a href="/create" className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition">
                        Create Post
                    </a>
                </div>
            ) : (
                posts.map((post, index) => (
                    <motion.div
                        key={post._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                    >
                        {/* Author Info */}
                        <div className="flex items-start space-x-3">
                            <img
                                src={post.author?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                alt={post.author?.name}
                                className="w-10 h-10 rounded-full border-2 border-purple-500 object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-2">
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {post.author?.name}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        @{post.author?.username}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="mt-3">
                            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                {post.content}
                            </p>
                        </div>

                        {/* Post Actions */}
                        <div className="mt-4 flex items-center gap-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                            <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition group">
                                <span className="text-xl">❤️</span>
                                <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition group">
                                <span className="text-xl">💬</span>
                                <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition">
                                <span className="text-xl">🔖</span>
                            </button>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default Feed;