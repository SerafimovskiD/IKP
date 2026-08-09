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
            const response = await predmetiApi.getAll();
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

    const createPosta = async (data, tipDelovnik, tipOdgovor = null, roditelRedenBroj = null, roditelGodina = null, oldPodbroj = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.createPosta(data, tipDelovnik, tipOdgovor, roditelRedenBroj, roditelGodina, oldPodbroj);
            await fetchNextRedenBroj();
            return response;
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при внесување на пошта";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    const getPrethodniPredmeti = async (redenBroj, godina) => {
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.getPrethodniPredmeti(redenBroj, godina);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на претходни предмети";
            setError(message);
        } finally {
            setLoading(false);
        }
    };
    const getDoc = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.getAllDok(id);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на документи";
            setError(message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPredmeti();
        fetchNextRedenBroj();
    }, [fetchPredmeti,fetchNextRedenBroj]);

    return { predmeti,createPosta, loading, error,nextRedenBroj, refetch: fetchPredmeti, refetchNextRedenBroj: fetchNextRedenBroj,getPrethodniPredmeti,getDoc };
};

export default usePredmeti;