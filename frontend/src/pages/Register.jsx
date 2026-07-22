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

    const isPasswordValid = Object.values(passwordChecks).every(Boolean);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 bg-gray-50 dark:bg-[#0E1116] transition-colors duration-300 font-[Manrope]"
        >
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md sm:max-w-lg bg-white dark:bg-[#12151C] rounded-2xl shadow-xl p-5 sm:p-8 md:p-10 border border-gray-200 dark:border-[#1F232C] transition-colors duration-300"
            >
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <h2
                        className="font-['Fraunces'] italic text-3xl sm:text-4xl bg-gradient-to-r from-[#D97B4F] via-[#C6822E] to-[#D97B4F] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent pb-1"
                        style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}
                    >
                        Join Zephyra
                    </h2>
                    <p className="text-sm sm:text-base text-gray-500 dark:text-[#8A8F9C] mt-1 font-[Manrope]">
                        Create your account and start sharing
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 p-2.5 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-xl text-sm text-center font-[Manrope]"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-[#0E1116] border border-gray-300 dark:border-[#3A3F4B] rounded-xl text-gray-900 dark:text-[#E7E6E3] placeholder:text-gray-400 dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-[#0E1116] border border-gray-300 dark:border-[#3A3F4B] rounded-xl text-gray-900 dark:text-[#E7E6E3] placeholder:text-gray-400 dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm"
                            placeholder="johndoe"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-gray-50/50 dark:bg-[#0E1116] border border-gray-300 dark:border-[#3A3F4B] rounded-xl text-gray-900 dark:text-[#E7E6E3] placeholder:text-gray-400 dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 bg-gray-50/50 dark:bg-[#0E1116] border rounded-xl text-gray-900 dark:text-[#E7E6E3] placeholder:text-gray-400 dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm ${formData.password.length > 0 && !isPasswordValid
                                ? 'border-red-500 dark:border-red-500'
                                : formData.password.length > 0 && isPasswordValid
                                    ? 'border-green-500 dark:border-green-500'
                                    : 'border-gray-300 dark:border-[#3A3F4B]'
                                }`}
                            placeholder="Enter a strong password"
                        />

                        {/* Password Strength Checklist */}
                        {formData.password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-1.5 text-xs space-y-0.5 font-[Manrope]"
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
                        className="w-full py-2.5 bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-semibold rounded-full hover:brightness-105 hover:shadow-[0_0_30px_-6px_rgba(255,143,107,0.55)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed font-[Manrope] text-sm mt-1"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-[#1A140D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

                {/* Divider */}
                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-[#1F232C]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white dark:bg-[#12151C] text-gray-500 dark:text-[#6E7280] font-[Manrope]">
                            or continue with
                        </span>
                    </div>
                </div>

                <GoogleButton />

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 dark:text-[#8A8F9C] mt-4 font-[Manrope]">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-[#D97B4F] dark:text-[#F5C36B] font-semibold hover:underline transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;