import api from "./api.js";
export const predmetiApi = {

    createPosta: async (data, tipDelovnik) => {
        const res = await api.post(`/predmet/create?tipDelovnik=${tipDelovnik}`, data);
        return res.data;
    },
    getAllPredmeti: async () => {
        const res = await api.get("/predmet");
        return res.data;
    },
    getNextRedenBroj: async () => {
        const res = await api.get("/predmet/next-reden-broj");
        return res.data;
    },
    findById: async (id) => {
        const res = await api.get(`/predmet/getPostaByID?id=${id}`);
        console.log(res.data);
        return res.data;
    }
};