import api from "./api.js";

export const authApi = {
    login: async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        return res.data;
    },

    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    },
    register: async (data) => {
        const res = await api.post("/auth/register", data);
        return res.data;
    },

    getUsersOdgovornoLice: async () => {
        const res = await api.get("/auth/odgovorno-lice");
        console.log("ODG",res)
        return res.data;
    }

};