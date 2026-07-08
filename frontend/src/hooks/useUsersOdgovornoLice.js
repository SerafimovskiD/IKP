import { useState, useEffect, useCallback } from "react";
import {authApi} from "../api/auth.js";

const useUsersOdgovornoLice = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [odgovornoLice, setOdgovornoLice] = useState([]);

    const fetchOdgovornoLice= useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await authApi.getUsersOdgovornoLice();
            setOdgovornoLice(response);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на одговорно лице";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOdgovornoLice();
    }, [fetchOdgovornoLice]);

    return { odgovornoLice, loading, error, refetch: fetchOdgovornoLice };
};

export default useUsersOdgovornoLice;