const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex space-x-4 mb-2 sm:mb-0">
                        <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition">About</a>
                        <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Privacy</a>
                        <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Terms</a>
                        <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400 transition">Support</a>
                    </div>
                    <p className="text-center sm:text-right">
                        © {new Date().getFullYear()} Zephyra. All rights reserved. 🌬️
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;