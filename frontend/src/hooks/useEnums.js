// src/hooks/useEnums.js
import { useState, useEffect } from "react";
import { enumsApi } from "../api/enums";

export function useEnums() {
    const [prioritet, setPrioritet] = useState([]);
    const [tipPosta, setTipPosta] = useState([]);
    const [tipOdgovor, setTipOdgovor] = useState([]);
    const [statusPredmet,setStatusPredmet] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEnums = async () => {
            setLoading(true);
            try {
                const [prioritetRes,
                    tipPostaRes,
                    tipOdgovorRes,
                    statusPredmetRes] = await Promise.all([
                    enumsApi.getPrioritet(),
                    enumsApi.getTipPosta(),
                    enumsApi.getTipOdgovor(),
                    enumsApi.getStatusPredmet(),
                ]);
                setPrioritet(prioritetRes);
                setTipPosta(tipPostaRes);
                setTipOdgovor(tipOdgovorRes);
                setStatusPredmet(statusPredmetRes);

            } catch (err) {
                console.error("Грешка при вчитување на енуми:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnums();
    }, []);

    return { prioritet, tipPosta, tipOdgovor,statusPredmet,loading };
}