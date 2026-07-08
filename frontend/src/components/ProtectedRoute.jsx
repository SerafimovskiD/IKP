import { Navigate } from "react-router-dom";
import {useAuth} from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children, roles }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Се вчитува...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    //Roles check

    if (roles && roles.length > 0) {
        const hasRequiredRole = roles.includes(user.uloga);
        if (!hasRequiredRole) {
            return <Navigate to="/forbidden" replace />;
        }
    }

    return children;
}