import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ConfirmDialog from '../components/ConfirmDialog';

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
                className="bg-white dark:bg-[#12151C] rounded-3xl shadow-xs p-6 border border-[#EAECF0] dark:border-[#1F232C]"
            >
                <h1 className="text-2xl font-bold text-[#101828] dark:text-[#EDEBE6] font-['Fraunces'] italic">
                    Welcome back, {user?.name}
                </h1>
                <p className="text-[#475467] dark:text-[#8A8F9C] mt-1 text-sm font-medium">
                    Here is the latest from your chronological feed.
                </p>
            </motion.div>

            {/* Posts Feed */}
            {posts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#12151C] rounded-3xl shadow-xs p-8 text-center border border-[#EAECF0] dark:border-[#1F232C]"
                >
                    <div className="flex justify-center text-[#D97B4F] dark:text-[#F5C36B] mb-4">
                        <FeatherMark />
                    </div>
                    <p className="text-[#475467] dark:text-[#8A8F9C] text-base font-[Manrope]">
                        No posts yet. Be the first to share your story on the wind.
                    </p>
                    <Link
                        to="/create"
                        className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold rounded-full hover:scale-105 transition-all text-sm shadow-xs"
                    >
                        Create Post
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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="bg-white dark:bg-[#12151C] rounded-3xl shadow-xs p-6 border border-[#EAECF0] dark:border-[#1F232C] hover:border-[#D97B4F]/50 dark:hover:border-[#F5C36B]/30 transition-all duration-300 cursor-pointer"
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
                                <img
                                    src={post.author?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                    alt={post.author?.name}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#D97B4F]/60 dark:ring-[#F5C36B]/60 cursor-pointer hover:ring-[#D97B4F] dark:hover:ring-[#F5C36B] transition-all"
                                    onError={(e) => {
                                        e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                    }}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center flex-wrap gap-2">
                                        <span className="font-semibold text-[#101828] dark:text-[#EDEBE6] font-[Manrope] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors">
                                            {post.author?.name}
                                        </span>
                                        <span className="text-sm text-[#667085] dark:text-[#6E7280] font-[Manrope]">
                                            @{post.author?.username}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#667085] dark:text-[#6E7280] mt-0.5 font-[Manrope]">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </div>

                            {/* Post Content - Clicking this navigates to post detail */}
                            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                                <p className="text-[#344054] dark:text-[#E7E6E3] whitespace-pre-wrap break-words font-[Manrope] leading-relaxed font-medium">
                                    {post.content}
                                </p>
                                {post.image && (
                                    <div className="mt-3 rounded-2xl overflow-hidden border border-[#EAECF0] dark:border-[#1F232C]">
                                        <img
                                            src={post.image}
                                            alt="Post image"
                                            className="w-full max-h-96 object-contain bg-[#F8F9FA] dark:bg-[#0E1116]"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Post Actions - Click handlers with stopPropagation */}
                            <div className="mt-4 flex items-center gap-6 border-t border-[#EAECF0] dark:border-[#1F232C] pt-4">
                                {/* Like Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleLike(post._id);
                                    }}
                                    className={`flex items-center gap-2 transition group ${isLiked
                                        ? 'text-[#D97B4F] dark:text-[#FF8F6B]'
                                        : 'text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#FF8F6B]'
                                        }`}
                                >
                                    <HeartIcon filled={isLiked} />
                                    <span className="text-sm font-medium font-[Manrope]">
                                        {post.likes?.length || 0}
                                    </span>
                                </button>

                                {/* Comment Button */}
                                <button
                                    onClick={(e) => toggleComments(post._id, e)}
                                    className={`flex items-center gap-2 transition group ${isCommentsOpen
                                        ? 'text-[#D97B4F] dark:text-[#F5C36B]'
                                        : 'text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B]'
                                        }`}
                                >
                                    <CommentIcon active={isCommentsOpen} />
                                    <span className="text-sm font-medium font-[Manrope]">
                                        {commentCount}
                                    </span>
                                </button>

                                {/* Bookmark Button */}
                                <button
                                    className="flex items-center gap-2 text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition group"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <BookmarkIcon />
                                </button>

                                {/* Share Button */}
                                <button
                                    className="flex items-center gap-2 text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition group ml-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ShareIcon />
                                </button>
                            </div>

                            {/* Comments Section */}
                            <AnimatePresence>
                                {isCommentsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-4 border-t border-[#EAECF0] dark:border-[#1F232C] pt-4 space-y-3"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* Comment Input */}
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                alt="Your avatar"
                                                className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D97B4F]/40 dark:ring-[#F5C36B]/40 flex-shrink-0"
                                                onError={(e) => {
                                                    e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                                }}
                                            />
                                            <input
                                                type="text"
                                                value={commentTexts[post._id] || ''}
                                                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleCommentSubmit(post._id, e);
                                                }}
                                                placeholder="Write a comment..."
                                                className="flex-1 px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#0E1116] border border-[#EAECF0] dark:border-[#3A3F4B] rounded-full text-sm text-[#101828] dark:text-[#E7E6E3] placeholder:text-[#667085] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope]"
                                            />
                                            <button
                                                onClick={(e) => handleCommentSubmit(post._id, e)}
                                                disabled={submittingComment[post._id] || !(commentTexts[post._id] || '').trim()}
                                                className="px-5 py-2 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold rounded-full text-xs hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-[Manrope] whitespace-nowrap cursor-pointer shadow-xs"
                                            >
                                                {submittingComment[post._id] ? '...' : 'Post'}
                                            </button>
                                        </div>

                                        {/* Comments List */}
                                        {commentCount === 0 ? (
                                            <p className="text-xs text-[#667085] dark:text-[#6E7280] text-center font-[Manrope] py-2">
                                                No comments yet. Be the first to share your thoughts.
                                            </p>
                                        ) : (
                                            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                                {post.comments.map((comment) => {
                                                    const isOwn = comment.user?._id === user?._id;
                                                    const isPostAuthor = post.author?._id === user?._id;
                                                    const canDelete = isOwn || isPostAuthor;

                                                    return (
                                                        <div key={comment._id} className="flex items-start gap-2">
                                                            <Link
                                                                to={`/profile/${comment.user?._id}`}
                                                                className="flex-shrink-0"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <img
                                                                    src={comment.user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                                    alt={comment.user?.name}
                                                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-[#EAECF0] dark:ring-[#3A3F4B] mt-0.5 hover:ring-[#D97B4F] dark:hover:ring-[#F5C36B] transition-all"
                                                                    onError={(e) => {
                                                                        e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                                                    }}
                                                                />
                                                            </Link>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <Link
                                                                        to={`/profile/${comment.user?._id}`}
                                                                        className="text-sm font-semibold text-[#101828] dark:text-[#EDEBE6] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        {comment.user?.name}
                                                                    </Link>
                                                                    <span className="text-xs text-[#667085] dark:text-[#6E7280] font-[Manrope]">
                                                                        @{comment.user?.username}
                                                                    </span>
                                                                    <span className="text-xs text-[#667085] dark:text-[#6E7280] font-[Manrope]">
                                                                        • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-sm text-[#344054] dark:text-[#D9D3E6] font-[Manrope] break-words">
                                                                    {comment.text}
                                                                </p>
                                                            </div>
                                                            {canDelete && (
                                                                <button
                                                                    onClick={() => handleDeleteComment(post._id, comment._id)}
                                                                    className="text-gray-400 dark:text-[#6E7280] hover:text-red-500 dark:hover:text-red-400 transition flex-shrink-0 mt-1"
                                                                    aria-label="Delete comment"
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
        </div>
    );
};

export default Feed;