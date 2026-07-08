// src/api/enums.js
import api from "./api.js";

export const enumsApi = {
    getPrioritet: async () => {
        const res = await api.get("/enum/prioritet");
        return res.data;
    },

    getTipPosta: async () => {
        const res = await api.get("/enum/tip-posta");
        return res.data;
    },

    getStatusPredmet: async () => {
        const res = await api.get("/enum/status-predmet");
        return res.data;
    },

    getTipOdgovor: async () => {
        const res = await api.get("/enum/tip-odgovor");
        return res.data;
    },
};