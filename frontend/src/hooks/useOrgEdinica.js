import { useState, useEffect, useCallback } from "react";
import orgEdinica from "../api/orgEdinica.js";

const useOrgEdinica = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [organizaciskaEdinica, setOrganizaciskaEdinica] = useState([]);

    const fetchOrgEdinica = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await orgEdinica.getAll();
            setOrganizaciskaEdinica(response);
        } catch (err) {
            const message = err.response?.data?.message || "Грешка при вчитување на организациска единица";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const getOrgEdinicaById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await orgEdinica.getById(id);
            return response;
        } catch (err) {
            const message = err.response?.data?.message || "Не постои организациска единица со id: " + id;
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrgEdinica();
    }, [fetchOrgEdinica]);

    return { organizaciskaEdinica, getOrgEdinicaById, loading, error, refetch: fetchOrgEdinica };
};

export default useOrgEdinica;