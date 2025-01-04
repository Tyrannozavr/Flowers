import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_DEV,
});

instance.interceptors.request.use(
    async (config) => config,
    async (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
