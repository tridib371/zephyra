import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTrash, HiOutlineExclamationTriangle, HiOutlineArrowPath } from 'react-icons/hi2';

const ConfirmDialog = ({
    isOpen,
    onClose,
    onCancel,
    onConfirm,
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    iconType = 'trash',
}) => {
    if (!isOpen) return null;
    const handleClose = onClose || onCancel;

    const renderIcon = () => {
        if (iconType === 'reload' || iconType === 'clear') {
            return <HiOutlineArrowPath className="text-2xl text-amber-600 dark:text-amber-400" />;
        }
        if (iconType === 'warning') {
            return <HiOutlineExclamationTriangle className="text-2xl text-rose-600 dark:text-rose-400" />;
        }
        return <HiOutlineTrash className="text-2xl text-rose-600 dark:text-rose-400" />;
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[999] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 15 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-[#12151C] rounded-3xl shadow-2xl border border-gray-200/80 dark:border-[#1F232C] p-6 sm:p-8 max-w-md w-full font-[Manrope]"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 flex items-center justify-center">
                            {renderIcon()}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-['Fraunces'] italic text-xl sm:text-2xl text-center text-gray-900 dark:text-[#EDEBE6] mb-2 font-bold">
                        {title}
                    </h3>

                    {/* Message */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-[#9DA3B4] text-center mb-6 leading-relaxed">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 border border-gray-300 dark:border-[#2E3544] text-gray-700 dark:text-[#E7E6E3] font-bold rounded-full hover:bg-gray-50 dark:hover:bg-[#181C26] transition-all text-xs sm:text-sm order-2 sm:order-1 cursor-pointer"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 via-[#D97B4F] to-[#FF8F6B] text-white font-extrabold rounded-full hover:brightness-105 hover:scale-105 transition-all text-xs sm:text-sm shadow-md order-1 sm:order-2 cursor-pointer"
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