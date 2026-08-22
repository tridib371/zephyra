import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import GoogleButton from '../components/GoogleButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);
        if (result.success) {
            navigate('/feed');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 bg-[#F8F9FA] dark:bg-[#0E1116] transition-colors duration-300 font-[Manrope]"
        >
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md sm:max-w-lg bg-white dark:bg-[#12151C] rounded-3xl shadow-xs p-6 sm:p-8 md:p-10 border border-[#EAECF0] dark:border-[#1F232C] transition-colors duration-300"
            >
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h2
                        className="font-['Fraunces'] italic text-3xl sm:text-4xl bg-gradient-to-r from-[#D97B4F] via-[#C6822E] to-[#D97B4F] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent font-bold"
                        style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}
                    >
                        Welcome Back
                    </h2>
                    <p className="text-xs sm:text-sm text-[#475467] dark:text-[#8A8F9C] mt-2 font-[Manrope] font-medium">
                        Sign in to continue your journey on Zephyra
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs text-center font-[Manrope]"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#344054] dark:text-[#E7E6E3] mb-1.5 font-[Manrope]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-[#0E1116] border border-[#EAECF0] dark:border-[#3A3F4B] rounded-2xl text-[#101828] dark:text-[#E7E6E3] placeholder:text-[#667085] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-medium"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#344054] dark:text-[#E7E6E3] mb-1.5 font-[Manrope]">
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F8F9FA] dark:bg-[#0E1116] border border-[#EAECF0] dark:border-[#3A3F4B] rounded-2xl text-[#101828] dark:text-[#E7E6E3] placeholder:text-[#667085] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold rounded-full hover:scale-[1.02] transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed font-[Manrope] text-sm cursor-pointer"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-[#1A140D]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#EAECF0] dark:border-[#1F232C]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white dark:bg-[#12151C] text-[#667085] dark:text-[#6E7280] font-[Manrope] font-medium">
                            or continue with
                        </span>
                    </div>
                </div>

                <GoogleButton />

                {/* Footer */}
                <p className="text-center text-sm text-[#475467] dark:text-[#8A8F9C] mt-6 font-[Manrope]">
                    Don't have an account?{' '}
                    <Link
                        to="/register"
                        className="text-[#D97B4F] dark:text-[#F5C36B] font-bold hover:underline transition-colors"
                    >
                        Create one
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Login;