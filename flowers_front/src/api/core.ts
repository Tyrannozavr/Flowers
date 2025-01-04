import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_DEV,
});

instance.interceptors.request.use(
    async (config) => {
        const subdomain = window.location.hostname.split(".")[0];
        config.headers["X-Subdomain"] = subdomain;
        return config;
    },
    async (error) => {
        return Promise.reject(error);
    }
);

export default instance;
