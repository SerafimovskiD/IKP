import api from "./api.js";

const vidPredmetDobieno ={
    getAllVidPredmet: async () => {
        const res = await api.get("/vid-predmet-dobiena");
        return res.data;
    }
};

export default vidPredmetDobieno;