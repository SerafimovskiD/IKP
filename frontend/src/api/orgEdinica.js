import api from "./api.js";

const orgEdinica ={
    getAll: async ()=>{
        const res = await api.get("/orgEdinica");
        return res.data;
    },
    getById: async (id) =>{
        const res = await api.get(`/orgEdinica/${id}`);
        return res.data;
    }
};

export default orgEdinica;