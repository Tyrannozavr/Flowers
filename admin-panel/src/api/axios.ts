import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_DEV,
    headers: {
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

const handleLogout = () => {
    localStorage.removeItem("token");

    instance.defaults.headers["Authorization"] = "";

    window.location.reload();
};

export { instance, handleLogout };
