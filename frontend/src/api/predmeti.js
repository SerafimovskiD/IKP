import api from './api';
const predmetiApi = {
    createDobienaPosta: async (data) => {
        const res = await api.post("/predmeti/dobiena", data);
        return res.data;
    },
}
export default predmetiApi;