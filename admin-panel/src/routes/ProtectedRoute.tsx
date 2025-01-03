import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!isAuthenticated) return <div>Загрузка...</div>;

    return <>{children}</>;
};

export default ProtectedRoute;
