import api from "./api.js";
export const predmetiApi = {

    // createPosta: async (data, tipDelovnik) => {
    //     const res = await api.post(`/predmet/create?tipDelovnik=${tipDelovnik}`, data);
    //     return res.data;
    // },
    createPosta: async (data, tipDelovnik, tipOdgovor = null, roditelBrAkt = null, roditelRedenBroj = null, roditelGodina = null, oldPodbroj = null, id=null) => {
        const params = new URLSearchParams();
        params.append('tipDelovnik', tipDelovnik);
        if (tipOdgovor) params.append('tipOdgovor', tipOdgovor);
        if (roditelBrAkt) params.append('roditelBrAkt', roditelBrAkt);
        if (roditelRedenBroj) params.append('roditelRedenBroj', roditelRedenBroj);
        if (roditelGodina) params.append('roditelGodina', roditelGodina);
        if (oldPodbroj) params.append('oldPodbroj', oldPodbroj);
        if (id) params.append('id', id);

        const res = await api.post(`/predmet/create?${params.toString()}`, data);
        return res.data;
    },
    editPosta: async (data, id, tipDelovnik) => {
        const params = new URLSearchParams();
        params.append('tipDelovnik', tipDelovnik);
        const res = await api.put(`/predmet/edit/${id}?${params.toString()}`, data);
        return res.data;
    },
    getAll: async (params = {}) => {
        const res = await api.get('/predmet', { params });
        return res.data;
    },
    getNextRedenBroj: async () => {
        const res = await api.get("/predmet/next-reden-broj");
        return res.data;
    },
    findById: async (id) => {
        const res = await api.get(`/predmet/getPostaByID?id=${id}`);
        return res.data;
    },
    getPrethodniPredmeti: async (redenBroj, godina, brAkt) => {
        const res = await api.get(`/predmet/prethodni?brAkt=${encodeURIComponent(brAkt)}&redenBroj=${redenBroj}&godina=${godina}`);
        return res.data;
    },

    uploadDok: async (predmetId, file) => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post(`/predmet/${predmetId}/dokumenti`, formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        });
        return res.data;
    },

    getAllDok: async (predmetId) => {
        const res = await api.get(`/predmet/${predmetId}/dokumenti`);
        return res.data;
    },

    downloadDok: async (dokId, ime) => {
        const res = await api.get(`/predmet/dokumenti/${dokId}`, {
            responseType: 'blob'  // ← blob response
        });
        // Направи download линк
        const url = URL.createObjectURL(res.data);
        const a = document.createElement('a');
        a.href = url;
        a.download = ime;
        a.click();
        URL.revokeObjectURL(url);
    },

    // Го презема документот како blob, без веднаш да го преземе (за preview во UI-от).
    getDokBlob: async (dokId) => {
        const res = await api.get(`/predmet/dokumenti/${dokId}`, {
            responseType: 'blob'
        });
        return res.data;
    },

    deleteDok: async (dokId) => {
        await api.delete(`/predmet/dokumenti/${dokId}`);
    }
};