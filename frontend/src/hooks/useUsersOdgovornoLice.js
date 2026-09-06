import { useState, useEffect, useCallback } from "react";
import {authApi} from "../api/auth.js";

// Го превзема целиот список на корисници (endpoint-от /auth/odgovorno-lice веќе
// враќа сите корисници заедно со нивната улога - uloga) и ги дели во два списока:
// - odgovornoLice: само корисници со улога NACALNIK (за полето "Одговорно лице")
// - dodelenoNa: сите корисници КОИ НЕ се NACALNIK (за полето "Доделено на")
const useUsersOdgovornoLice = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.getUsersOdgovornoLice();
            setUsers(response);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на корисници";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const odgovornoLice = users.filter(u => u.uloga === 'NACALNIK');
    const dodelenoNa = users.filter(u => u.uloga !== 'NACALNIK');

    return { odgovornoLice, dodelenoNa, users, loading, error, refetch: fetchUsers };
};

export default useUsersOdgovornoLice;
