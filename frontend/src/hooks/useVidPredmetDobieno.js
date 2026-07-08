import { useState, useEffect, useCallback } from "react";
import vidPredmetDobieno from "../api/vidPredmetDobieno.js";

const useVidPredmetDobieno = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vidPredmetD, setVidPredmetD] = useState([]);

    const fetchVidPredmet = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vidPredmetDobieno.getAllVidPredmet();
            setVidPredmetD(response);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на Вид на Предмет";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchVidPredmet();
    }, [fetchVidPredmet]);

    return { vidPredmetD, loading, error, refetch: fetchVidPredmet};
};

export default useVidPredmetDobieno;