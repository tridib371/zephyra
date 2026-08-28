import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ConfirmDialog from '../components/ConfirmDialog';
import ShareModal from '../components/ShareModal';
import AutoPauseVideo from '../components/AutoPauseVideo';

// ===== Icons =====
const HeartIcon = ({ filled = false }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinejoin="round" />
    </svg>
);

const CommentIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <path d="M4 5.5h16a1 1 0 0 1 1 1V16a1 1 0 0 1-1 1H9l-4.5 4V17H4a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
    </svg>
);

const BookmarkIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <path d="M5 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v16l-7-4-7 4V4Z" strokeLinejoin="round" />
    </svg>
);

const ShareIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
        <circle cx="18" cy="5" r="2.2" />
        <circle cx="6" cy="12" r="2.2" />
        <circle cx="18" cy="19" r="2.2" />
        <path d="M8.6 10.8l6.8-3.6M8.6 13.2l6.8 3.6" strokeLinecap="round" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const PostDetail = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, commentId: null });
    const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
    const [highlightedCommentId, setHighlightedCommentId] = useState(null);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const commentRefs = useRef({});

    const fetchPost = async () => {
        try {
            const res = await api.get(`/posts/${id}`);
            setPost(res.data.post);
            // Check if user liked this post
            if (user && res.data.post.likes?.includes(user._id)) {
                setIsLiked(true);
            }
            setLoading(false);
        } catch (err) {
            console.error('Error fetching post:', err);
            setError('Post not found or has been deleted.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPost();
    }, [id, user]);

    useEffect(() => {
        if (!post) return;

        const commentId = searchParams.get('commentId');
        if (!commentId) {
            setHighlightedCommentId(null);
            return;
        }

        const target = commentRefs.current[commentId];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setHighlightedCommentId(commentId);

            const timeoutId = window.setTimeout(() => {
                setHighlightedCommentId((current) => (current === commentId ? null : current));
            }, 2500);

            return () => window.clearTimeout(timeoutId);
        }
    }, [post, searchParams]);

    const handleLike = async () => {
        try {
            if (isLiked) {
                await api.delete(`/posts/${post._id}/like`);
                setPost(prev => ({
                    ...prev,
                    likes: prev.likes.filter(id => id !== user._id),
                }));
                setIsLiked(false);
            } else {
                await api.post(`/posts/${post._id}/like`);
                setPost(prev => ({
                    ...prev,
                    likes: [...prev.likes, user._id],
                }));
                setIsLiked(true);
            }
        } catch (err) {
            console.error('Like error:', err);
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await api.post(`/posts/${post._id}/comments`, { text: commentText });
            setPost(prev => ({
                ...prev,
                comments: [...prev.comments, res.data.comment],
            }));
            setCommentText('');
        } catch (err) {
            console.error('Comment error:', err);
            alert('Failed to add comment. Please try again.');
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        setDeleteModal({ isOpen: true, commentId });
    };

    const confirmDeleteComment = async () => {
        const { commentId } = deleteModal;
        try {
            await api.delete(`/posts/${post._id}/comments/${commentId}`);
            setPost(prev => ({
                ...prev,
                comments: prev.comments.filter(c => c._id !== commentId),
            }));
            setDeleteModal({ isOpen: false, commentId: null });
        } catch (err) {
            console.error('Delete comment error:', err);
            alert('Failed to delete comment.');
            setDeleteModal({ isOpen: false, commentId: null });
        }
    };

    const confirmDeletePost = async () => {
        setDeletePostModalOpen(false);
        try {
            await api.delete(`/posts/${post._id}`);
            navigate('/feed');
        } catch (err) {
            console.error('Delete post error:', err);
            setError('Failed to delete post.');
        }
    };

    const handleDeletePost = () => {
        setDeletePostModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1116]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D97B4F] dark:border-[#F5C36B]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1116] font-[Manrope]">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-[#8A8F9C] text-lg">{error}</p>
                    <button
                        onClick={() => navigate('/feed')}
                        className="mt-4 px-6 py-2 bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-semibold rounded-full hover:brightness-105 transition-all duration-200"
                    >
                        Back to Feed
                    </button>
                </div>
            </div>
        );
    }

    if (!post) return null;

    const isOwnPost = post.author?._id === user?._id;

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen bg-[#F8F9FA] dark:bg-[#0E1116] py-8 px-4 sm:px-6 font-[Manrope] transition-colors duration-300"
            >
                <div className="max-w-3xl mx-auto">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition-colors mb-4 text-sm font-bold cursor-pointer"
                    >
                        <ArrowLeftIcon />
                        <span>Back to feed</span>
                    </button>

                    {/* Post Card */}
                    <div className="bg-white dark:bg-[#12151C] rounded-3xl shadow-xs p-6 sm:p-8 border border-[#EAECF0] dark:border-[#1F232C]">
                        {/* Author Info */}
                        <div className="flex items-start justify-between">
                            <Link to={`/profile/${post.author?._id}`} className="flex items-center gap-3">
                                <img
                                    src={post.author?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                    alt={post.author?.name}
                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#D97B4F]/60 dark:ring-[#F5C36B]/60"
                                    onError={(e) => {
                                        e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                    }}
                                />
                                <div>
                                    <p className="font-semibold text-[#101828] dark:text-[#EDEBE6]">
                                        {post.author?.name}
                                    </p>
                                    <p className="text-sm text-[#667085] dark:text-[#6E7280]">
                                        @{post.author?.username}
                                    </p>
                                </div>
                            </Link>
                            {isOwnPost && (
                                <button
                                    onClick={handleDeletePost}
                                    className="text-gray-400 dark:text-[#6E7280] hover:text-red-500 dark:hover:text-red-400 transition"
                                >
                                    <TrashIcon />
                                </button>
                            )}
                        </div>

                        {/* Post Content */}
                        <div className="mt-4">
                            <p className="text-[#101828] dark:text-[#E7E6E3] whitespace-pre-wrap break-words leading-relaxed text-lg">
                                {post.content}
                            </p>
                            {post.image && (
                                <div className="mt-4 rounded-2xl overflow-hidden border-2 border-black dark:border-[#1F232C] bg-black/5 dark:bg-black/30">
                                    {(() => {
                                        const lower = (post.image || '').toLowerCase();
                                        const isVideo = lower.includes('.mp4') || lower.includes('.webm') || lower.includes('.mov') || lower.includes('.avi') || lower.includes('.mkv') || lower.includes('.m4v') || lower.includes('/video/upload/') || lower.includes('/video/') || lower.startsWith('data:video');
                                        if (isVideo) {
                                            return (
                                                <AutoPauseVideo
                                                    src={post.image}
                                                    className="w-full max-h-[500px] object-contain bg-black rounded-2xl"
                                                />
                                            );
                                        }
                                        return (
                                            <img
                                                src={post.image}
                                                alt="Post"
                                                className="w-full max-h-[500px] object-contain bg-[#F8F9FA] dark:bg-[#0E1116]"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        );
                                    })()}
                                </div>
                            )}
                        </div>

                        {/* Post Time */}
                        <p className="text-xs text-[#667085] dark:text-[#6E7280] mt-4">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>

                        {/* Stats */}
                        <div className="mt-4 flex items-center gap-6 border-t border-[#EAECF0] dark:border-[#1F232C] pt-4 text-xs font-bold text-[#475467] dark:text-[#8A8F9C]">
                            <span className="flex items-center gap-1.5">
                                <HeartIcon filled={isLiked} />
                                {post.likes?.length || 0} likes
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CommentIcon />
                                {post.comments?.length || 0} comments
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex items-center gap-6 border-t border-[#EAECF0] dark:border-[#1F232C] pt-4">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 transition text-xs font-bold cursor-pointer ${isLiked ? 'text-[#D97B4F] dark:text-[#FF8F6B]' : 'text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#FF8F6B]'}`}
                            >
                                <HeartIcon filled={isLiked} />
                                <span>Like</span>
                            </button>
                            <button className="flex items-center gap-2 text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition text-xs font-bold cursor-pointer">
                                <CommentIcon />
                                <span>Comment</span>
                            </button>
                            <button className="flex items-center gap-2 text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition text-xs font-bold cursor-pointer">
                                <BookmarkIcon />
                                <span>Save</span>
                            </button>
                            <button
                                onClick={() => setIsShareOpen(true)}
                                className="flex items-center gap-2 text-[#475467] dark:text-[#6E7280] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition ml-auto text-xs font-bold cursor-pointer"
                            >
                                <ShareIcon />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Comment Input */}
                        <div className="mt-6 border-t border-[#EAECF0] dark:border-[#1F232C] pt-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                    alt="Your avatar"
                                    className="w-9 h-9 rounded-full object-cover ring-1 ring-[#D97B4F]/40 dark:ring-[#F5C36B]/40 flex-shrink-0"
                                    onError={(e) => {
                                        e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                    }}
                                />
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleCommentSubmit();
                                    }}
                                    placeholder="Write a comment..."
                                    className="flex-1 px-4 py-2.5 bg-[#F8F9FA] dark:bg-[#0E1116] border border-[#EAECF0] dark:border-[#3A3F4B] rounded-full text-sm text-[#101828] dark:text-[#EDEBE6] placeholder:text-[#667085] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope]"
                                />
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={submittingComment || !commentText.trim()}
                                    className="px-5 py-2.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold rounded-full text-xs hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-[Manrope] cursor-pointer shadow-xs"
                                >
                                    {submittingComment ? '...' : 'Post'}
                                </button>
                            </div>
                        </div>

                        {/* Comments List */}
                        <div className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-1">
                            {post.comments?.length === 0 ? (
                                <p className="text-xs text-[#667085] dark:text-[#6E7280] text-center py-4 font-[Manrope]">
                                    No comments yet. Be the first to share your thoughts.
                                </p>
                            ) : (
                                post.comments.map((comment) => {
                                    const isOwnComment = comment.user?._id === user?._id;
                                    return (
                                        <div
                                            key={comment._id}
                                            ref={(node) => {
                                                if (node) {
                                                    commentRefs.current[comment._id] = node;
                                                }
                                            }}
                                            id={`comment-${comment._id}`}
                                            className={`flex items-start gap-3 rounded-xl px-2 py-2 transition-colors ${highlightedCommentId === comment._id ? 'bg-[#F2F4F7] dark:bg-[#1A1E27] ring-1 ring-[#D97B4F]/30 dark:ring-[#F5C36B]/30' : ''}`}
                                        >
                                            <Link to={`/profile/${comment.user?._id}`}>
                                                <img
                                                    src={comment.user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                                                    alt={comment.user?.name}
                                                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#EAECF0] dark:ring-[#3A3F4B] flex-shrink-0"
                                                    onError={(e) => {
                                                        e.target.src = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
                                                    }}
                                                />
                                            </Link>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Link to={`/profile/${comment.user?._id}`} className="text-sm font-semibold text-[#101828] dark:text-[#EDEBE6] hover:text-[#D97B4F] dark:hover:text-[#F5C36B] transition">
                                                        {comment.user?.name}
                                                    </Link>
                                                    <span className="text-xs text-[#667085] dark:text-[#6E7280]">
                                                        @{comment.user?.username}
                                                    </span>
                                                    <span className="text-xs text-[#667085] dark:text-[#6E7280]">
                                                        • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[#344054] dark:text-[#D9D3E6] font-[Manrope] break-words">
                                                    {comment.text}
                                                </p>
                                            </div>
                                            {isOwnComment && (
                                                <button
                                                    onClick={() => handleDeleteComment(comment._id)}
                                                    className="text-gray-400 dark:text-[#6E7280] hover:text-red-500 dark:hover:text-red-400 transition flex-shrink-0 mt-1"
                                                    aria-label="Delete comment"
                                                >
                                                    <TrashIcon />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Confirm Dialog for Comment Deletion */}
            <ConfirmDialog
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, commentId: null })}
                onConfirm={confirmDeleteComment}
                title="Delete Comment?"
                message="This action cannot be undone. Are you sure you want to delete this comment?"
                confirmText="Delete"
                cancelText="Cancel"
            />

            {/* Confirm Dialog for Post Deletion */}
            <ConfirmDialog
                isOpen={deletePostModalOpen}
                onClose={() => setDeletePostModalOpen(false)}
                onConfirm={confirmDeletePost}
                title="Delete Post?"
                message="Are you sure you want to delete this post? It will be permanently removed from all feeds."
                confirmText="Delete Post"
                cancelText="Cancel"
            />

            {/* Share Modal */}
            <ShareModal
                isOpen={isShareOpen}
                onClose={() => setIsShareOpen(false)}
                post={post}
            />
        </>
    );
};

export default PostDetail;