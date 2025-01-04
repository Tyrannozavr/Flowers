import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_DEV,
});

instance.interceptors.request.use(
    async (config) => config,
    async (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default instance;
