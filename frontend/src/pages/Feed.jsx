import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ConfirmDialog from '../components/ConfirmDialog';
import ShareModal from '../components/ShareModal';
import AutoPauseVideo from '../components/AutoPauseVideo';

// ===== Icons =====
const HeartIcon = ({ filled = false }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinejoin="round" />
    </svg>
);

const CommentIcon = ({ active = false }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`h-5 w-5 ${active ? 'text-[#D97B4F] dark:text-[#F5C36B]' : ''}`}>
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
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13a1.5 1.5 0 0 1 1.06 2.56L9.62 16.5H18.5a1.5 1.5 0 0 1 0 3h-13a1.5 1.5 0 0 1-1.06-2.56L14.38 7.5H5.5A1.5 1.5 0 0 1 4 5.5z" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ===== Animated Background Component for Day & Night Modes =====
const FeedBackgroundAnimation = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {/* Ambient Background Gradient Base */}
            <div className="absolute inset-0 bg-[#FAF7F2] dark:bg-[#0E1116] transition-colors duration-500" />

            {/* Glowing Amber/Terracotta Radial Orbs (Day & Night) */}
            <motion.div
                animate={{
                    scale: [1, 1.25, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    opacity: [0.45, 0.7, 0.45],
                }}
                transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#FF8F6B]/35 via-[#D97B4F]/25 to-transparent dark:from-[#FF8F6B]/20 dark:via-[#9E3610]/15 dark:to-transparent blur-3xl"
            />

            <motion.div
                animate={{
                    scale: [1.1, 0.9, 1.1],
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                    opacity: [0.4, 0.65, 0.4],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute top-1/3 -right-36 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#F5C36B]/35 via-[#E2774C]/25 to-transparent dark:from-[#F5C36B]/15 dark:via-[#D97B4F]/10 dark:to-transparent blur-3xl"
            />

            <motion.div
                animate={{
                    scale: [0.95, 1.2, 0.95],
                    x: [0, 35, 0],
                    y: [0, -45, 0],
                    opacity: [0.35, 0.6, 0.35],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
                className="absolute -bottom-40 left-1/4 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-[#FF8F6B]/30 via-[#F5C36B]/20 to-transparent dark:from-[#E2774C]/15 dark:via-[#7A2B0E]/15 dark:to-transparent blur-3xl"
            />

            {/* Subtle Cyber Dot Matrix Grid (Light & Dark) */}
            <div
                className="absolute inset-0 opacity-[0.35] dark:opacity-[0.2]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(217, 123, 79, 0.4) 1.2px, transparent 0)`,
                    backgroundSize: '36px 36px',
                }}
            />

            {/* Multi-Layered Animated Wind Breeze Wave Currents */}
            <svg
                className="absolute inset-0 h-full w-full opacity-65 dark:opacity-40"
                viewBox="0 0 1400 900"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="feedGustA" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF8F6B" stopOpacity="0" />
                        <stop offset="25%" stopColor="#FF8F6B" stopOpacity="0.8" />
                        <stop offset="70%" stopColor="#E2774C" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#F5C36B" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="feedGustB" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#F5C36B" stopOpacity="0" />
                        <stop offset="35%" stopColor="#D97B4F" stopOpacity="0.75" />
                        <stop offset="80%" stopColor="#FF8F6B" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#E2774C" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Primary undulating wave */}
                <motion.path
                    d="M -150 180 C 220 60, 520 310, 880 160 S 1200 80, 1550 200"
                    fill="none"
                    stroke="url(#feedGustA)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={{
                        d: [
                            "M -150 180 C 220 60, 520 310, 880 160 S 1200 80, 1550 200",
                            "M -150 220 C 280 150, 490 240, 820 230 S 1140 50, 1550 160",
                            "M -150 180 C 220 60, 520 310, 880 160 S 1200 80, 1550 200"
                        ],
                        opacity: [0.35, 0.75, 0.35]
                    }}
                    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Secondary harmonic wave */}
                <motion.path
                    d="M -150 480 C 260 600, 620 360, 980 520 S 1220 440, 1550 490"
                    fill="none"
                    stroke="url(#feedGustB)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    animate={{
                        d: [
                            "M -150 480 C 260 600, 620 360, 980 520 S 1220 440, 1550 490",
                            "M -150 440 C 190 520, 710 440, 930 460 S 1160 560, 1550 510",
                            "M -150 480 C 260 600, 620 360, 980 520 S 1220 440, 1550 490"
                        ],
                        opacity: [0.25, 0.65, 0.25]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                {/* Third low breeze current */}
                <motion.path
                    d="M -150 780 C 350 860, 680 720, 1020 810 S 1300 700, 1550 760"
                    fill="none"
                    stroke="url(#feedGustA)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{
                        d: [
                            "M -150 780 C 350 860, 680 720, 1020 810 S 1300 700, 1550 760",
                            "M -150 740 C 290 800, 750 780, 970 750 S 1240 830, 1550 780",
                            "M -150 780 C 350 860, 680 720, 1020 810 S 1300 700, 1550 760"
                        ],
                        opacity: [0.3, 0.65, 0.3]
                    }}
                    transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                />
            </svg>

            {/* Floating Ambient Feather & Particle Motes */}
            {[
                { top: '12%', left: '8%', size: 8, duration: 8, delay: 0 },
                { top: '22%', left: '88%', size: 12, duration: 10, delay: 1.5 },
                { top: '42%', left: '15%', size: 6, duration: 7, delay: 3 },
                { top: '62%', left: '82%', size: 10, duration: 9, delay: 2 },
                { top: '78%', left: '25%', size: 14, duration: 11, delay: 0.5 },
                { top: '88%', left: '72%', size: 7, duration: 8.5, delay: 4 },
                { top: '32%', left: '52%', size: 9, duration: 9.5, delay: 2.2 },
            ].map((p, idx) => (
                <motion.div
                    key={idx}
                    style={{
                        top: p.top,
                        left: p.left,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                    }}
                    animate={{
                        y: [-25, 30, -25],
                        x: [-15, 20, -15],
                        opacity: [0.2, 0.8, 0.2],
                        scale: [0.85, 1.3, 0.85],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: p.delay,
                    }}
                    className="absolute rounded-full bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] shadow-xs shadow-[#E2774C]/60"
                />
            ))}
        </div>
    );
};

// ===== Feed Component =====
const Feed = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [commentTexts, setCommentTexts] = useState({});
    const [openComments, setOpenComments] = useState({});
    const [submittingComment, setSubmittingComment] = useState({});
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, postId: null, commentId: null });
    const [shareModalPost, setShareModalPost] = useState(null);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts');
            const fetchedPosts = res.data.posts;
            setPosts(fetchedPosts);
            const likedSet = new Set();
            fetchedPosts.forEach(post => {
                if (post.likes && post.likes.includes(user?._id)) {
                    likedSet.add(post._id);
                }
            });
            setLikedPosts(likedSet);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError('Failed to load posts. Please try again.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [user]);

    // Like/Unlike
    const handleLike = async (postId) => {
        const isLiked = likedPosts.has(postId);
        setLikedPosts(prev => {
            const newSet = new Set(prev);
            if (isLiked) newSet.delete(postId);
            else newSet.add(postId);
            return newSet;
        });
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post._id === postId
                    ? {
                        ...post,
                        likes: isLiked
                            ? post.likes.filter(id => id !== user._id)
                            : [...post.likes, user._id],
                    }
                    : post
            )
        );

        try {
            if (isLiked) {
                await api.delete(`/posts/${postId}/like`);
            } else {
                await api.post(`/posts/${postId}/like`);
            }
        } catch (err) {
            console.error('Like error:', err);
            setLikedPosts(prev => {
                const newSet = new Set(prev);
                if (isLiked) newSet.add(postId);
                else newSet.delete(postId);
                return newSet;
            });
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: isLiked
                                ? [...post.likes, user._id]
                                : post.likes.filter(id => id !== user._id),
                        }
                        : post
                )
            );
        }
    };

    // Toggle comments visibility
    const toggleComments = (postId, e) => {
        e.stopPropagation();
        setOpenComments(prev => ({
            ...prev,
            [postId]: !prev[postId],
        }));
    };

    // Handle comment text change
    const handleCommentChange = (postId, text) => {
        setCommentTexts(prev => ({ ...prev, [postId]: text }));
    };

    // Submit comment
    const handleCommentSubmit = async (postId, e) => {
        e.stopPropagation();
        const text = commentTexts[postId] || '';
        if (!text.trim()) return;

        setSubmittingComment(prev => ({ ...prev, [postId]: true }));

        try {
            const res = await api.post(`/posts/${postId}/comments`, { text });
            const newComment = res.data.comment;
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: [...post.comments, newComment],
                        }
                        : post
                )
            );
            setCommentTexts(prev => ({ ...prev, [postId]: '' }));
            setOpenComments(prev => ({ ...prev, [postId]: true }));
        } catch (err) {
            console.error('Comment error:', err);
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmittingComment(prev => ({ ...prev, [postId]: false }));
        }
    };

    // Delete comment - opens the confirmation modal
    const handleDeleteComment = (postId, commentId) => {
        setDeleteModal({ isOpen: true, postId, commentId });
    };

    // Actually perform the deletion
    const confirmDeleteComment = async () => {
        const { postId, commentId } = deleteModal;
        try {
            await api.delete(`/posts/${postId}/comments/${commentId}`);
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            comments: post.comments.filter(c => c._id !== commentId),
                        }
                        : post
                )
            );
            setDeleteModal({ isOpen: false, postId: null, commentId: null });
        } catch (err) {
            console.error('Delete comment error:', err);
            alert('Failed to delete comment. Please try again.');
            setDeleteModal({ isOpen: false, postId: null, commentId: null });
        }
    };

    // Navigate to post detail
    const goToPost = (postId) => {
navigate(`/post/${postId}`);
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-10 px-4 sm:px-6 font-[Manrope] overflow-x-hidden flex justify-center items-center">
                <FeedBackgroundAnimation />
                <div className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-3xl bg-[#F0C9AE] dark:bg-[#12151C]/90 backdrop-blur-xl border-2 border-black dark:border-[#FF8F6B]/35 shadow-[5px_5px_0px_#000000] dark:shadow-2xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9E3610] dark:border-[#FF8F6B]"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-[#9E3610] dark:text-[#FF8F6B]">
                        Loading Streamlines...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-10 px-4 sm:px-6 font-[Manrope] overflow-x-hidden flex justify-center items-center">
                <FeedBackgroundAnimation />
                <div className="relative z-10 max-w-md mx-auto p-8 rounded-3xl bg-[#F0C9AE] dark:bg-[#12151C]/90 backdrop-blur-xl border-2 border-black dark:border-[#FF8F6B]/35 shadow-[5px_5px_0px_#000000] dark:shadow-2xl text-center space-y-4">
                    <p className="text-sm font-black text-[#9E3610] dark:text-[#FF8F6B]">
                        {error}
                    </p>
                    <button
                        onClick={fetchPosts}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black text-xs font-black cursor-pointer hover:scale-105 transition-all shadow-md"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-[#FAF7F2] dark:bg-[#0E1116] text-gray-900 dark:text-[#EDEBE6] transition-colors duration-300 py-8 px-4 sm:px-6 font-[Manrope] overflow-x-hidden">
            {/* Background Animation for Both Day & Night Modes */}
            <FeedBackgroundAnimation />

            <div className="relative max-w-3xl mx-auto space-y-6 z-10">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl rounded-3xl shadow-[5px_5px_0px_#000000] dark:shadow-xl p-6 sm:p-8 border-2 border-black dark:border-[#FF8F6B]/35 relative overflow-hidden"
                >
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FF8F6B]/30 text-[#6B2207] dark:bg-[#FF8F6B]/20 dark:text-[#FF8F6B] border border-black dark:border-[#FF8F6B]/40 text-[10px] font-black uppercase tracking-widest mb-3">
                        ⚡ Chronological Stream
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1A0F08] dark:text-white font-['Fraunces'] italic tracking-tight">
                        Welcome back, {user?.name}
                    </h1>
                    <p className="text-[#402414] dark:text-[#9DA3B4] mt-1.5 text-xs sm:text-sm font-black">
                        Here is the latest from your distraction-free chronological feed.
                    </p>
                </motion.div>

                {/* Posts Feed */}
                {posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#F0C9AE] dark:bg-[#12151C]/92 backdrop-blur-xl rounded-3xl shadow-[5px_5px_0px_#000000] dark:shadow-xl p-10 text-center border-2 border-black dark:border-[#FF8F6B]/35 space-y-4"
                    >
                        <div className="flex justify-center text-[#9E3610] dark:text-[#F5C36B]">
                            <FeatherMark />
                        </div>
                        <p className="text-[#381F10] dark:text-[#8A8F9C] text-sm sm:text-base font-extrabold">
                            No posts yet. Be the first to share your voice on the wind.
                        </p>
                        <Link
                            to="/create"
                            className="inline-block mt-2 px-6 py-2.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-black rounded-full hover:scale-105 transition-all text-xs uppercase tracking-wider border-2 border-black shadow-md"
                        >
                            Create First Post →
                        </Link>
                    </motion.div>
                ) : (
                    posts.map((post, index) => {
                        const isLiked = likedPosts.has(post._id);
                        const isCommentsOpen = openComments[post._id] || false;
                        const commentCount = post.comments?.length || 0;

                        return (
                            <motion.div
                                key={post._id}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.06, duration: 0.5 }}
                                whileHover={{ y: -3 }}
                                className="bg-[#F0C9AE] dark:bg-[#12151C]/92 hover:bg-[#E8BC9F] dark:hover:bg-[#161B24] backdrop-blur-xl rounded-3xl shadow-[5px_5px_0px_#000000] dark:shadow-xl p-6 sm:p-7 border-2 border-black dark:border-[#FF8F6B]/30 hover:border-[#EA580C] dark:hover:border-[#FF8F6B]/70 transition-all duration-300 cursor-pointer"
                                onClick={() => goToPost(post._id)}
                            >
                                {/* Author Info - Clicking this navigates to the author's profile */}
                                <div
                                    className="flex items-start space-x-3"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/profile/${post.author?._id}`);
                                    }}
                                >
                                    <div className="flex-shrink-0">
                                        {post.author?.profilePicture ? (
                                            <img
                                                src={post.author.profilePicture}
                                                alt={post.author.name}
                                                className="h-11 w-11 rounded-full object-cover border-2 border-black dark:border-[#FF8F6B]/50 shadow-xs"
                                            />
                                        ) : (
                                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#FF8F6B] to-[#F5C36B] border-2 border-black dark:border-[#FF8F6B]/50 flex items-center justify-center text-gray-900 font-extrabold text-sm shadow-xs">
                                                {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-black text-[#1A0F08] dark:text-[#EDEBE6] hover:text-[#9E3610] dark:hover:text-[#F5C36B] transition-colors truncate">
                                                {post.author?.name || 'Anonymous'}
                                            </p>
                                            <span className="text-xs text-[#5C361E] dark:text-[#8A8F9C] font-extrabold truncate">
                                                @{post.author?.username || 'user'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#5C361E] dark:text-[#8A8F9C] font-bold">
                                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                </div>

                                {/* Post Content */}
                                <div className="mt-4">
                                    <p className="text-[#1A0F08] dark:text-[#D9D3E6] text-sm sm:text-base font-extrabold whitespace-pre-line break-words leading-relaxed font-[Manrope]">
                                        {post.content}
                                    </p>

                                    {/* Post Media (Image or Video) */}
                                    {post.image && (
                                        <div className="mt-3 rounded-2xl overflow-hidden border-2 border-black dark:border-[#252A36] shadow-xs bg-black/5 dark:bg-black/30">
                                            {(() => {
                                                const lower = (post.image || '').toLowerCase();
                                                const isVideo = lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.mov') || lower.includes('.avi') || lower.includes('.mkv') || lower.includes('.m4v') || lower.includes('/video/upload/') || lower.includes('/video/') || lower.startsWith('data:video');
                                                if (isVideo) {
                                                    return (
                                                        <AutoPauseVideo
                                                            src={post.image}
                                                            className="w-full max-h-96 object-contain rounded-2xl bg-black"
                                                        />
                                                    );
                                                }
                                                return (
                                                    <img
                                                        src={post.image}
                                                        alt="Post media"
                                                        className="w-full max-h-96 object-cover hover:scale-101 transition-transform duration-300"
                                                    />
                                                );
                                            })()}
                                        </div>
                                    )}
                                </div>

                                {/* Post Actions */}
                                <div
                                    className="mt-5 pt-4 border-t-2 border-black/20 dark:border-[#1F232C] flex items-center justify-between text-[#381F10] dark:text-[#8A8F9C]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center space-x-6">
                                        {/* Like Button */}
                                        <button
                                            onClick={() => handleLike(post._id)}
                                            className={`flex items-center space-x-2 text-xs sm:text-sm font-black transition-colors ${
                                                isLiked
                                                    ? 'text-[#E11D48]'
                                                    : 'hover:text-[#E11D48]'
                                            }`}
                                        >
                                            <HeartIcon filled={isLiked} />
                                            <span>{post.likes?.length || 0}</span>
                                        </button>

                                        {/* Comment Toggle Button */}
                                        <button
                                            onClick={() => toggleComments(post._id, { stopPropagation: () => {} })}
                                            className={`flex items-center space-x-2 text-xs sm:text-sm font-black transition-colors hover:text-[#9E3610] dark:hover:text-[#F5C36B] ${
                                                isCommentsOpen ? 'text-[#9E3610] dark:text-[#F5C36B]' : ''
                                            }`}
                                        >
                                            <CommentIcon active={isCommentsOpen} />
                                            <span>{commentCount}</span>
                                        </button>

                                        {/* Share Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShareModalPost(post);
                                            }}
                                            className="flex items-center space-x-1.5 text-xs sm:text-sm font-black hover:text-[#9E3610] dark:hover:text-[#F5C36B] transition-colors cursor-pointer"
                                        >
                                            <ShareIcon />
                                            <span className="hidden sm:inline">Share</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Comments Section */}
                                <AnimatePresence>
                                    {isCommentsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mt-4 pt-4 border-t-2 border-black/20 dark:border-[#1F232C] space-y-4"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            {/* Add Comment Input */}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={commentTexts[post._id] || ''}
                                                    onChange={(e) =>
                                                        setCommentTexts((prev) => ({
                                                            ...prev,
                                                            [post._id]: e.target.value,
                                                        }))
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleCommentSubmit(post._id, e);
                                                    }}
                                                    placeholder="Write a comment..."
                                                    className="flex-1 px-4 py-2 text-xs sm:text-sm font-bold bg-[#FFF6EF] dark:bg-[#181C26] border-2 border-black dark:border-[#2D3546] rounded-xl outline-none focus:border-[#D97B4F] dark:focus:border-[#F5C36B] text-[#1A140D] dark:text-white placeholder-[#5E3821] dark:placeholder-gray-400 font-[Manrope]"
                                                />
                                                <button
                                                    onClick={(e) => handleCommentSubmit(post._id, e)}
                                                    disabled={submittingComment[post._id] || !commentTexts[post._id]?.trim()}
                                                    className="px-4 py-2 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] border-2 border-black font-black text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {submittingComment[post._id] ? 'Posting...' : 'Post'}
                                                </button>
                                            </div>

                                            {/* Comments List */}
                                            {post.comments && post.comments.length > 0 && (
                                                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                                                    {post.comments.map((comment) => {
                                                        const commentAuthor = comment.user || comment.author;
                                                        const commentAuthorName = commentAuthor?.name || 'Anonymous';
                                                        const commentAuthorUsername = commentAuthor?.username || 'user';
                                                        const commentAuthorPic = commentAuthor?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                                        const isCommentOwner = user && (commentAuthor?._id === user._id || commentAuthor?.id === user.id || commentAuthor?._id === user.id || commentAuthor === user._id);

                                                        return (
                                                            <div
                                                                key={comment._id}
                                                                className="flex items-start justify-between bg-[#FFF6EF]/60 dark:bg-[#181C26]/60 border border-black/15 dark:border-[#2D3546] rounded-xl p-2.5 text-xs font-[Manrope]"
                                                            >
                                                                <div className="flex items-start gap-2.5">
                                                                    <img
                                                                        src={commentAuthorPic}
                                                                        alt={commentAuthorName}
                                                                        className="w-6 h-6 rounded-full object-cover border border-black/20 mt-0.5 shrink-0"
                                                                    />
                                                                    <div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <span className="font-black text-[#1A140D] dark:text-white">
                                                                                {commentAuthorName}
                                                                            </span>
                                                                            <span className="text-[10px] font-bold text-[#5E3821] dark:text-gray-400">
                                                                                @{commentAuthorUsername}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[#2C190E] dark:text-gray-200 font-bold mt-0.5">
                                                                            {comment.text}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                {isCommentOwner && (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteComment(post._id, comment._id);
                                                                        }}
                                                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                                                                        title="Delete comment"
                                                                    >
                                                                        <TrashIcon />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })
                )}

                {/* ===== CUSTOM CONFIRMATION MODAL ===== */}
                <ConfirmDialog
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, postId: null, commentId: null })}
                    onConfirm={confirmDeleteComment}
                    title="Delete Comment?"
                    message="This action cannot be undone. Are you sure you want to delete this comment?"
                    confirmText="Delete"
                    cancelText="Cancel"
                />

                {/* ===== SHARE MODAL ===== */}
                <ShareModal
                    isOpen={!!shareModalPost}
                    onClose={() => setShareModalPost(null)}
                    post={shareModalPost}
                />
            </div>
        </div>
    );
};

export default Feed;