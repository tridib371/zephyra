import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { useAuth } from '../context/AuthContext';

const GoogleButton = ({ text = 'Continue with Google' }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Step 1: Sign in with Google using Firebase
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Step 2: Get the ID token
            const idToken = await user.getIdToken();

            // Step 3: Authenticate with backend via AuthContext
            const authResult = await googleLogin(idToken);

            if (authResult.success) {
                navigate('/feed');
            } else {
                setError(authResult.message || 'Google sign-in failed.');
            }
        } catch (err) {
            console.error('Google sign-in error:', err);
            setError(err.message || 'Google sign-in failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#EAECF0] dark:border-[#3A3F4B] rounded-2xl bg-white dark:bg-[#181C26] hover:bg-[#F8F9FA] dark:hover:bg-[#202532] text-[#101828] dark:text-[#EDEBE6] font-semibold text-sm transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer font-[Manrope] shadow-xs"
            >
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.87 7.35 2.56 10.56l7.97-5.97z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
                {isLoading ? 'Signing in...' : text}
            </button>
            {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 text-center font-[Manrope]">
                    {error}
                </p>
            )}
        </div>
    );
};

export default GoogleButton;