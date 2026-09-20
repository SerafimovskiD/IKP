import api from "./api.js";

const isprakjacApi = {
    getAllIsprakjac: async () => {
        const res = await api.get("/isprakjaci");
        return res.data;
    }
};

export default isprakjacApi;