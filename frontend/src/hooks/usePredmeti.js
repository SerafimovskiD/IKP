import { useState, useEffect, useCallback } from "react";
import {predmetiApi} from "../api/predmeti.js";

const usePredmeti = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [predmeti, setPredmeti] = useState([]);
    const [nextRedenBroj, setNextRedenBroj] = useState(null);
    const fetchPredmeti = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.getAllPredmeti();
            setPredmeti(response);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на предмети";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);
    const fetchNextRedenBroj = useCallback(async () => {
        try {
            const res = await predmetiApi.getNextRedenBroj();
            setNextRedenBroj(res);
        } catch (err) {
            console.error("Грешка при земање реден број:", err);
        }
    }, []);

    const createDobienaPosta = async (data) =>{
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.createDobienaPosta(data);
            setPredmeti(response);
        }catch (err){
            const message = err.response?.data?.message || "Грешка при внесување на пошта";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }

    }
    useEffect(() => {
        fetchPredmeti();
        fetchNextRedenBroj();
    }, [fetchPredmeti,fetchNextRedenBroj]);

    return { predmeti,createDobienaPosta, loading, error,nextRedenBroj, refetch: fetchPredmeti, refetchNextRedenBroj: fetchNextRedenBroj };
};

export default usePredmeti;