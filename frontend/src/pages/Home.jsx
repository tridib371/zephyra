import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
            {/* Logo */}
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
            >
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
                    🌬️ Zephyra
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mt-3 md:mt-4">
                    Share your world, beautifully.
                </p>
            </motion.div>

            {/* Buttons - Responsive stack on mobile, row on larger screens */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 md:mt-8 w-full sm:w-auto"
            >
                <Link
                    to="/login"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 hover:scale-105 transition-all duration-300 text-center shadow-lg shadow-purple-500/30"
                >
                    Sign In
                </Link>
                <Link
                    to="/register"
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-xl hover:bg-purple-50 hover:scale-105 transition-all duration-300 text-center dark:border-purple-400 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                    Create Account
                </Link>
            </motion.div>

            {/* Footer text - responsive */}
            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-8 md:mt-12 text-center">
                Join the Zephyra community ✨
            </p>
        </motion.div>
    );
};

export default Home;