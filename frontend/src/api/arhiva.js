import api from "./api.js";

const arhivaApi = {
    getArhiva: async () => {
        const res = await api.get("/arhivi");
        return res.data;
    }
};

export default arhivaApi;