import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { HiOutlineCheck, HiOutlineXMark } from 'react-icons/hi2';
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
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-20 bg-[#F6EFE6] dark:bg-[#0E1116] transition-colors duration-300 font-[Manrope]"
        >
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full max-w-md sm:max-w-lg bg-[#FFFDF9] dark:bg-[#12151C] rounded-3xl shadow-[0_8px_30px_-10px_rgba(217,123,79,0.12)] p-5 sm:p-8 md:p-10 border border-[#E2D4C3] dark:border-[#1F232C] transition-colors duration-300"
            >
                {/* Header */}
                <div className="text-center mb-4 sm:mb-6">
                    <h2
                        className="font-['Fraunces'] italic text-3xl sm:text-4xl bg-gradient-to-r from-[#D97B4F] via-[#C6822E] to-[#D97B4F] dark:from-[#FF8F6B] dark:via-[#F5C36B] dark:to-[#FF8F6B] bg-clip-text text-transparent pb-1 font-bold"
                        style={{ fontVariationSettings: '"opsz" 30, "wght" 500' }}
                    >
                        Join Zephyra
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5C4A3C] dark:text-[#8A8F9C] mt-1 font-[Manrope] font-medium">
                        Create your account and start sharing
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-3 p-2.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl text-xs text-center font-[Manrope]"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C4A3C] dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#F4ECE1] dark:bg-[#0E1116] border border-[#DECDBB] dark:border-[#3A3F4B] rounded-2xl text-[#1F1710] dark:text-[#E7E6E3] placeholder:text-[#877568] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-medium"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C4A3C] dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            required
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#F4ECE1] dark:bg-[#0E1116] border border-[#DECDBB] dark:border-[#3A3F4B] rounded-2xl text-[#1F1710] dark:text-[#E7E6E3] placeholder:text-[#877568] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-medium"
                            placeholder="johndoe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C4A3C] dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-[#F4ECE1] dark:bg-[#0E1116] border border-[#DECDBB] dark:border-[#3A3F4B] rounded-2xl text-[#1F1710] dark:text-[#E7E6E3] placeholder:text-[#877568] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-medium"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-[#5C4A3C] dark:text-[#E7E6E3] mb-1 font-[Manrope]">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 bg-[#F4ECE1] dark:bg-[#0E1116] border rounded-2xl text-[#1F1710] dark:text-[#E7E6E3] placeholder:text-[#877568] dark:placeholder:text-[#6E7280] focus:ring-2 focus:ring-[#D97B4F] dark:focus:ring-[#F5C36B] focus:border-transparent transition outline-none font-[Manrope] text-sm font-medium ${formData.password.length > 0 && !isPasswordValid
                                ? 'border-red-500 dark:border-red-500'
                                : formData.password.length > 0 && isPasswordValid
                                    ? 'border-emerald-500 dark:border-emerald-500'
                                    : 'border-[#DECDBB] dark:border-[#3A3F4B]'
                                }`}
                            placeholder="Enter a strong password"
                        />

                        {/* Password Strength Checklist */}
                        {formData.password.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-2 text-xs space-y-1 font-[Manrope] bg-[#FAF2E8] dark:bg-[#181C26]/80 p-3 rounded-2xl border border-[#DECDBB] dark:border-[#252A36]"
                            >
                                <p className={`flex items-center gap-1.5 ${passwordChecks.length ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-500'}`}>
                                    {passwordChecks.length ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                    <span>At least 8 characters</span>
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.uppercase ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-500'}`}>
                                    {passwordChecks.uppercase ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                    <span>At least 1 uppercase letter</span>
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.lowercase ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-500'}`}>
                                    {passwordChecks.lowercase ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                    <span>At least 1 lowercase letter</span>
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.number ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-500'}`}>
                                    {passwordChecks.number ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                    <span>At least 1 number</span>
                                </p>
                                <p className={`flex items-center gap-1.5 ${passwordChecks.special ? 'text-emerald-700 dark:text-emerald-400 font-bold' : 'text-rose-500'}`}>
                                    {passwordChecks.special ? <HiOutlineCheck className="text-sm shrink-0" /> : <HiOutlineXMark className="text-sm shrink-0" />}
                                    <span>At least 1 special character (@$!%*?&)</span>
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !isPasswordValid}
                        className="w-full py-3.5 bg-gradient-to-r from-[#FF8F6B] via-[#D97B4F] to-[#F5C36B] text-[#1A140D] font-extrabold rounded-full hover:scale-[1.02] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed font-[Manrope] text-sm cursor-pointer mt-2"
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
                        <div className="w-full border-t border-[#DECDBB] dark:border-[#1F232C]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-[#FFFDF9] dark:bg-[#12151C] text-[#877568] dark:text-[#6E7280] font-[Manrope] font-medium">
                            or continue with
                        </span>
                    </div>
                </div>

                <GoogleButton />

                {/* Footer */}
                <p className="text-center text-sm text-[#5C4A3C] dark:text-[#8A8F9C] mt-4 font-[Manrope]">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="text-[#D97B4F] dark:text-[#F5C36B] font-bold hover:underline transition-colors"
                    >
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Register;