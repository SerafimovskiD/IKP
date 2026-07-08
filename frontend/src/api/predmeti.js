import api from "./api.js";

export const predmetiApi = {

    createDobienaPosta: async (data) => {
        const res = await api.post("/predmet/dobiena", data);
        return res.data;
    },

    createIspratena: async (data) => {
        const res = await api.post("/predmet/ispratena", data);
        return res.data;
    },

    odgovorDobienaPosta: async (predmetSoRedBr, godina, data) => {
        const res = await api.put("/predmet/odgovorDobienaPosta", data, {
            params: { predmetSoRedBr, godina }
        });
        return res.data;
    },

    changeStatus: async (id, status) => {
        const res = await api.put(`/predmet/${id}/status`, { status });
        return res.data;
    },

    uploadDokument: async (predmetId, file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await api.post(`/predmet/${predmetId}/skenirani-dokumenti/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return res.data;
    },
};