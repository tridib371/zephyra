export const getNotificationMeta = (notification) => {
    switch (notification.type) {
        case 'follow':
            return {
                label: 'Follow',
                icon: '👤',
                accent: 'from-sky-500/10 to-cyan-500/10 text-sky-600 dark:text-sky-300',
            };
        case 'like':
            return {
                label: 'Like',
                icon: '❤️',
                accent: 'from-rose-500/10 to-pink-500/10 text-rose-600 dark:text-rose-300',
            };
        case 'comment':
            return {
                label: 'Comment',
                icon: '💬',
                accent: 'from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-300',
            };
        default:
            return {
                label: 'Update',
                icon: '🔔',
                accent: 'from-gray-500/10 to-slate-500/10 text-gray-700 dark:text-gray-300',
            };
    }
};

export const getNotificationMessage = (notification) => {
    const senderName = notification.sender?.name || 'Someone';

    switch (notification.type) {
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
    if (notification.type === 'follow') {
        return notification.sender?._id ? `/profile/${notification.sender._id}` : '/feed';
    }

    if ((notification.type === 'like' || notification.type === 'comment') && notification.post?._id) {
        const commentId = notification.commentId || notification.comment;
        return commentId ? `/post/${notification.post._id}?commentId=${commentId}` : `/post/${notification.post._id}`;
    }

    return '/feed';
};