import { useState, useEffect, useCallback } from "react";
import arhivaApi from "../api/arhiva.js";

const useArhiva = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [arhiva, setArhiva] = useState([]);

    const fetchArhiva = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await arhivaApi.getArhiva();
            setArhiva(response);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на архива";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchArhiva();
    }, [fetchArhiva]);

    return { arhiva, loading, error, refetch: fetchArhiva };
};

export default useArhiva;