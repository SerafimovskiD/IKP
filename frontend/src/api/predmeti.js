import api from "./api.js";
export const predmetiApi = {

    createDobienaPosta: async (data) => {
        const res = await api.post("/predmet/dobiena", data);
        return res.data;
    },
    getAllPredmeti: async () => {
        const res = await api.get("/predmet");
        console.log("PRED", res.data);
        return res.data;
    },
    getNextRedenBroj: async () => {
        const res = await api.get("/predmet/next-reden-broj");
        return res.data;
    }
};