import { useState, useEffect, useCallback } from "react";
import isprakjacApi from "../api/isprakjac.js";

const useIsprakjac = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isprakjaci, setIsprakjaci] = useState([]);

    const fetchIsprakjaci = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await isprakjacApi.getAllIsprakjac();
            setIsprakjaci(response);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на испраќачи";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIsprakjaci();
    }, [fetchIsprakjaci]);

    return { isprakjaci, loading, error, refetch: fetchIsprakjaci };
};

export default useIsprakjac;