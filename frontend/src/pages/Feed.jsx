import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Feed = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6"
        >
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name}! 🌬️
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Your feed is coming soon. This is where all the posts will appear.
                    </p>
                    <button
                        onClick={() => {
                            localStorage.removeItem('zephyra_token');
                            window.location.reload();
                        }}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                    >
                        Logout (temporary)
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Feed;