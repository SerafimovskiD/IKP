import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await authApi.login(email, password);
        localStorage.setItem("token", res.token);
        const userData = {
            id: res.id,
            ime: res.ime,
            prezime: res.prezime,
            email: res.email,
            uloga: res.uloga,
            orgEdiniciId: res.orgEdiniciId,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    const isRole = (role) => {
        if (!user) return false;
        if (Array.isArray(role)) return role.includes(user.uloga);
        return user.uloga === role;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth мора да е внатре во AuthProvider");
    return ctx;
}