import { useState, useEffect, useCallback } from "react";
import { predmetiApi } from "../api/predmeti.js";

const usePredmetDetails = (id) => {
    const [predmet, setPredmet] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPredmet = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.findById(id);
            setPredmet(response);
        } catch (err) {
            setError(err.response?.data?.message || "Грешка при вчитување на предмет");
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPredmet();
    }, [fetchPredmet]);

    return { predmet, loading, error, refetch: fetchPredmet };
};

export default usePredmetDetails;