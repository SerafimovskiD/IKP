import { useState, useEffect, useCallback } from "react";
import vidPredmet from "../api/vidPredmet.js";

const useVidPredmetIspratena = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [vidPredmetI, setVidPredmetI] = useState([]);

    const fetchVidPredmet = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await vidPredmet.getAllvidPredmetIspratena();
            setVidPredmetI(response);
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

    return { vidPredmetI, loading, error, refetch: fetchVidPredmet};
};

export default useVidPredmetIspratena;