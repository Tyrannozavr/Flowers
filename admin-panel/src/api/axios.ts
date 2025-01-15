import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_DEV,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
    },
});

export default instance;
