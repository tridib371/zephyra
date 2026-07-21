import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto p-4 sm:p-6"
        >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img
                        src={user?.profilePicture || 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'}
                        alt="Profile"
                        className="w-28 h-28 rounded-full border-4 border-purple-500 object-cover"
                    />
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user?.name}</h1>
                        <p className="text-gray-500 dark:text-gray-400">@{user?.username}</p>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">{user?.bio || 'No bio yet.'}</p>
                        <div className="flex justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
                            <span><strong className="text-gray-900 dark:text-white">0</strong> Following</span>
                            <span><strong className="text-gray-900 dark:text-white">0</strong> Followers</span>
                            <span><strong className="text-gray-900 dark:text-white">0</strong> Posts</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        🏗️ Profile page is under construction. More features coming soon!
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;