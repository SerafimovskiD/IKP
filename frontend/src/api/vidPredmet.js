import api from "./api.js";

const vidPredmet ={
    getAllVidPredmetDobiena: async () => {
        const res = await api.get("/vid-predmet-dobiena");
        return res.data;
    },
    getAllvidPredmetIspratena: async () => {
        const res = await api.get("/vid-predmet-ispratena");
        return res.data;
    }
};

export default vidPredmet;