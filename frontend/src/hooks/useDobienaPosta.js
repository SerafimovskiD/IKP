import {useState} from "react";
import predmetiApi from "../api/predmeti.js";

const useDobienaPosta=()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data,setData] = useState(null);


    const createDobienaPosta = async (formData) => {
        setLoading(true);
        setError(null);
        try{
            const response = await predmetiApi.createDobienaPosta(formData);
            setData(response);
            return response;
        }catch (err){
            const message = err.response?.data?.message || "Грешка при внесување на пошта";
            setError(message);
            throw err;
        }finally {
            setLoading(false);
        }
    };
    const reset = ()=>{
        setData(null);
        setError(null);
    };
    return { createDobienaPosta, loading, error, data, reset };
}
export default useDobienaPosta;