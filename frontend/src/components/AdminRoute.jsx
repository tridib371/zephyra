import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0E1116]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D97B4F]"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user.role === 'admin';

    return isAdmin ? <Outlet /> : <Navigate to="/feed" replace />;
};

export default AdminRoute;
