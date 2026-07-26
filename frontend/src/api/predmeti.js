import api from "./api.js";
export const predmetiApi = {

    // createPosta: async (data, tipDelovnik) => {
    //     const res = await api.post(`/predmet/create?tipDelovnik=${tipDelovnik}`, data);
    //     return res.data;
    // },
    createPosta: async (data, tipDelovnik, tipOdgovor = null, roditelRedenBroj = null, roditelGodina = null, oldPodbroj = null, id=null) => {
        const params = new URLSearchParams();
        params.append('tipDelovnik', tipDelovnik);
        if (tipOdgovor) params.append('tipOdgovor', tipOdgovor);
        if (roditelRedenBroj) params.append('roditelRedenBroj', roditelRedenBroj);
        if (roditelGodina) params.append('roditelGodina', roditelGodina);
        if (oldPodbroj) params.append('oldPodbroj', oldPodbroj);
        if (id) params.append('id', id);

        const res = await api.post(`/predmet/create?${params.toString()}`, data);
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