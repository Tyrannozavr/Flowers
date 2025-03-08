import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { instance as axios } from "../api/axios";

interface AuthContextType {
    isAuthenticated: boolean;
    isSuperadmin: boolean;
    userId: number;
    login: (token: string) => void;
    logout: () => void;

    checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSuperadmin, setSuperadmin] = useState<boolean>(false);
    const [userId, setUserId] = useState<number>(-1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated && location.pathname === "/login") {
            navigate("/");
        }
    }, [isAuthenticated, location.pathname, navigate]);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            navigate("/login");
            return;
        }

        try {
            const response = await axios.get("/admins/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setIsAuthenticated(true);
            setSuperadmin(response.data.is_superadmin);
            setUserId(response.data.id);

        } catch {
            setIsAuthenticated(false);
            navigate("/login");
        }
    };

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setSuperadmin(false);
        setUserId(-1);
        navigate("/login");
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, isSuperadmin, userId, login, logout, checkAuth }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
