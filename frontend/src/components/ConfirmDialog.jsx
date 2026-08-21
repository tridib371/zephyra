import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ isOpen, onClose, onCancel, onConfirm, title, message, confirmText = 'Delete', cancelText = 'Cancel' }) => {
    if (!isOpen) return null;
    const handleClose = onClose || onCancel;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-[#12151C] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#1F232C] p-6 sm:p-8 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-3xl">
                            🗑️
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-['Fraunces'] italic text-xl sm:text-2xl text-center text-gray-900 dark:text-[#EDEBE6] mb-2">
                        {title || 'Are you sure?'}
                    </h3>

                    {/* Message */}
                    <p className="text-sm sm:text-base text-gray-600 dark:text-[#8A8F9C] text-center font-[Manrope] mb-6">
                        {message || 'This action cannot be undone.'}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 dark:border-[#3A3F4B] text-gray-700 dark:text-[#E7E6E3] font-semibold rounded-full hover:bg-gray-50 dark:hover:bg-[#1A1E27] transition-all duration-200 font-[Manrope] text-sm sm:text-base order-2 sm:order-1"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_20px_-6px_rgba(239,68,68,0.5)] transition-all duration-200 font-[Manrope] text-sm sm:text-base order-1 sm:order-2"
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmDialog;