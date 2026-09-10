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

    const createPosta = async (data, tipDelovnik, tipOdgovor = null, roditelBrAkt = null, roditelRedenBroj = null, roditelGodina = null, oldPodbroj = null) => {
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.createPosta(data, tipDelovnik, tipOdgovor, roditelBrAkt, roditelRedenBroj, roditelGodina, oldPodbroj);
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
    const editPosta = async (data, id, tipDelovnik) => {
        setLoading(true);
        setError(null);
        try {
            return await predmetiApi.editPosta(data, id, tipDelovnik);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при уредување на пошта";
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    const getPrethodniPredmeti = async (redenBroj, godina, brAkt) => {
        setLoading(true);
        setError(null);
        try {
            const response = await predmetiApi.getPrethodniPredmeti(redenBroj, godina, brAkt);
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
        fetchNextRedenBroj();
    }, [fetchNextRedenBroj]);

    return { predmeti,createPosta,editPosta, loading, error,nextRedenBroj, refetch: fetchPredmeti, refetchNextRedenBroj: fetchNextRedenBroj,getPrethodniPredmeti,getDoc };
};

export default usePredmeti;