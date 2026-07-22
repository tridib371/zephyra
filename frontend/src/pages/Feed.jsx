import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

// ---------- Icon set (matching Navbar/Footer icon language) ----------

const HeartIcon = ({ filled = false }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinejoin="round" />
    </svg>
);

const CommentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
);

const BookmarkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M5 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16l-7-4-7 4V4Z" strokeLinejoin="round" />
    </svg>
);

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <circle cx="18" cy="5" r="2.2" />
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="18" cy="19" r="2.2" />
        <path d="M8.6 10.8l6.8-3.6M8.6 13.2l6.8 3.6" strokeLinecap="round" />
    </svg>
);

const FeatherMark = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
        <path d="M20.24 3.76 9.5 14.5a4.95 4.95 0 0 0 0 7 4.95 4.95 0 0 0 7 0L20.24 10a4.95 4.95 0 0 0 0-7 4.95 4.95 0 0 0-7 0Z" />
        <path d="M9 15 4 20" strokeLinecap="round" />
        <path d="M13.5 10.5 11 13" strokeLinecap="round" />
    </svg>
);

const Feed = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [likedPosts, setLikedPosts] = useState(new Set());

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

    const handleLike = async (postId) => {
        try {
            const res = await api.post(`/posts/${postId}/like`);
            // Update local state
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: res.data.likes,
                        }
                        : post
                )
            );
            // Toggle liked state
            setLikedPosts((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(postId)) {
                    newSet.delete(postId);
                } else {
                    newSet.add(postId);
                }
                return newSet;
            });
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D97B4F] dark:border-[#F5C36B]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-3xl mx-auto p-4 sm:p-6 text-center text-[#C4573F] dark:text-[#FF8F6B]">
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
                className="bg-white dark:bg-[#12151C] rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-[#1F232C]"
            >
                <h1 className="text-2xl font-bold text-gray-900 dark:text-[#EDEBE6]">
                    Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-gray-600 dark:text-[#8A8F9C] mt-1">
                    Here's what's happening on Zephyra.
                </p>
            </motion.div>

            {/* Posts Feed */}
            {posts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#12151C] rounded-2xl shadow-lg p-8 text-center border border-gray-200 dark:border-[#1F232C]"
                >
                    <div className="flex justify-center text-[#D97B4F] dark:text-[#F5C36B] mb-4">
                        <FeatherMark />
                    </div>
                    <p className="text-gray-500 dark:text-[#8A8F9C] text-lg font-[Manrope]">
                        No posts yet. Be the first to share something! ✨
                    </p>
                    <Link
                        to="/create"
                        className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(255,143,107,0.6)] transition-all duration-200"
                    >
                        Create Post
                    </Link>
                </motion.div>
            ) : (
                posts.map((post, index) => {
                    const isLiked = likedPosts.has(post._id);
                    return (
                        <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="bg-white dark:bg-[#12151C] rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-[#1F232C] hover:border-[#D97B4F]/30 dark:hover:border-[#F5C36B]/30 transition-all duration-300"
                        >
                            {/* Author Info */}
                            <div className="flex items-start space-x-3">
                                <img
                                    src={post.author?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                    alt={post.author?.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D97B4F]/60 dark:ring-[#F5C36B]/60"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="font-semibold text-gray-900 dark:text-[#EDEBE6] font-[Manrope]">
                                            {post.author?.name}
                                        </span>
                                        <span className="text-sm text-gray-500 dark:text-[#6E7280] font-[Manrope]">
                                            @{post.author?.username}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 dark:text-[#6E7280] mt-0.5 font-[Manrope]">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="mt-3">
                                <p className="text-gray-800 dark:text-[#E7E6E3] whitespace-pre-wrap break-words font-[Manrope] leading-relaxed">
                                    {post.content}
                                </p>
                            </div>

                            {/* Post Actions */}
                            <div className="mt-4 flex items-center gap-6 border-t border-gray-100 dark:border-[#1F232C] pt-4">
                                {/* Like Button */}
                                <button
                                    onClick={() => handleLike(post._id)}
                                    className={`flex items-center gap-2 transition group ${isLiked
                                        ? 'text-[#D97B4F] dark:text-[#FF8F6B]'
                                        : 'text-gray-500 dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#FF8F6B]'
                                        }`}
                                >
                                    <HeartIcon filled={isLiked} />
                                    <span className="text-sm font-medium font-[Manrope]">
                                        {post.likes?.length || 0}
                                    </span>
                                </button>

                                {/* Comment Button */}
                                <button className="flex items-center gap-2 text-gray-500 dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition group">
                                    <CommentIcon />
                                    <span className="text-sm font-medium font-[Manrope]">
                                        {post.comments?.length || 0}
                                    </span>
                                </button>

                                {/* Bookmark Button */}
                                <button className="flex items-center gap-2 text-gray-500 dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition group">
                                    <BookmarkIcon />
                                </button>

                                {/* Share Button */}
                                <button className="flex items-center gap-2 text-gray-500 dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition group ml-auto">
                                    <ShareIcon />
                                </button>
                            </div>
                        </motion.div>
                    );
                })
            )}
        </div>
    );
};

export default Feed;