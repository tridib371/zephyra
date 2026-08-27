export const getNotificationMeta = (notification) => {
    switch (notification.type) {
        case 'follow':
            return {
                label: 'Follow',
                type: 'follow',
                accent: 'from-sky-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-300',
            };
        case 'like':
            return {
                label: 'Like',
                type: 'like',
                accent: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-300',
            };
        case 'comment':
            return {
                label: 'Comment',
                type: 'comment',
                accent: 'from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-300',
            };
        case 'announcement':
            return {
                label: 'Announcement',
                type: 'announcement',
                accent: 'from-[#FF8F6B]/20 to-[#F5C36B]/20 text-[#D97B4F] dark:text-[#F5C36B]',
            };
        default:
            return {
                label: 'Update',
                type: 'system',
                accent: 'from-gray-500/10 to-slate-500/10 text-gray-700 dark:text-gray-300',
            };
    }
};

export const getNotificationMessage = (notification) => {
    const senderName = notification.sender?.name || 'Someone';

    switch (notification.type) {
        case 'announcement':
            return notification.title || 'Official Platform Announcement';
        case 'follow':
            return `${senderName} started following you`;
        case 'like':
            return `${senderName} liked your post`;
        case 'comment':
            return `${senderName} commented on your post`;
        default:
            return `New notification from ${senderName}`;
    }
};

export const getNotificationDetail = (notification) => {
    if (notification.type === 'announcement') {
        return notification.message || '';
    }

    if (notification.type === 'comment' && notification.commentText) {
        return notification.commentText;
    }

    if (notification.post?.content) {
        const content = notification.post.content.trim();
        return content.length > 110 ? `${content.slice(0, 110)}...` : content;
    }

    return '';
};

export const getNotificationTarget = (notification) => {
    if (!notification) return '/notifications';

    if (notification.type === 'announcement') {
        return '/notifications';
    }

    if (notification.type === 'follow') {
        const senderId = notification.sender?._id || (typeof notification.sender === 'string' ? notification.sender : null);
        return senderId ? `/profile/${senderId}` : '/feed';
    }

    const postId = notification.post?._id || (typeof notification.post === 'string' ? notification.post : null);
    if ((notification.type === 'like' || notification.type === 'comment') && postId) {
        const commentId = notification.commentId || notification.comment;
        return commentId ? `/post/${postId}?commentId=${commentId}` : `/post/${postId}`;
    }

    return '/notifications';
};