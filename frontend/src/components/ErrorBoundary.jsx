import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 grid place-items-center mb-4 text-2xl font-bold">
                        ⚠️
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Something went wrong loading this page
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
                        {this.state.error?.message || 'An unexpected rendering error occurred.'}
                    </p>
                    <button
                        onClick={() => {
                            this.setState({ hasError: false, error: null });
                            window.location.reload();
                        }}
                        className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#FF8F6B] to-[#F5C36B] text-[#1A140D] font-bold text-sm hover:brightness-105 transition-all shadow-md"
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
