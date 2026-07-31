import axios from "axios";
import dayjs from "dayjs";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {"Content-Type": "application/json"},
});

// Помошна функција — дали токенот истекол
const isTokenExpired = (token) => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return dayjs.unix(payload.exp).isBefore(dayjs());
    } catch {
        return true;
    }
};

const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};

// REQUEST interceptor — провери пред секој повик
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            // Провери дали е истечен пред да го пратиш
            if (isTokenExpired(token)) {
                logout();
                return Promise.reject(new Error("Token expired"));
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE interceptor — фати 401 од backend
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            logout();
        }
        if (error.response?.status === 403) {
            window.location.href = "/forbidden";
        }
        return Promise.reject(error);
    }
);

export default api;