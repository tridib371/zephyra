import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register, error } = useAuth();
    const navigate = useNavigate();

    // --- Password strength checks ---
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // If password field is being changed, update checks
        if (name === 'password') {
            setPasswordChecks({
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /[0-9]/.test(value),
                special: /[@$!%*?&]/.test(value),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final check before submission
        const allValid = Object.values(passwordChecks).every(Boolean);
        if (!allValid) {
            alert('Please meet all password requirements before submitting.');
            return;
        }

        setIsLoading(true);
        const { name, username, email, password } = formData;
        const result = await register(name, username, email, password);
        setIsLoading(false);
        if (result.success) {
            navigate('/feed');
        }
    };

    // Check if all requirements are met for styling
    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md sm:max-w-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 border border-white/20 dark:border-gray-700/50"
            >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Join Zephyra
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-2">
                        Create your account and start sharing
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-xl text-sm text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
                            placeholder="johndoe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition outline-none ${formData.password.length > 0 && !isPasswordValid
                                ? 'border-red-500 dark:border-red-500'
                                : formData.password.length > 0 && isPasswordValid
                                    ? 'border-green-500 dark:border-green-500'
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}
                            placeholder="Enter a strong password"
                        />

                        {/* Password Strength Checklist */}
                        {formData.password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 text-xs space-y-1"
                            >
                                <p className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordChecks.length ? '✅' : '❌'} At least 8 characters
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordChecks.uppercase ? '✅' : '❌'} At least 1 uppercase letter
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordChecks.lowercase ? '✅' : '❌'} At least 1 lowercase letter
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordChecks.number ? '✅' : '❌'} At least 1 number
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.special ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordChecks.special ? '✅' : '❌'} At least 1 special character (@, $, !, %, *, ?, &)
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating account...
                            </span>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                {/* Google Button */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400">
                            or continue with
                        </span>
                    </div>
                </div>

                <GoogleButton />

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;