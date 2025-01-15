import axios from "./axios";

export const fetchAdmins = async () => {
    const { data } = await axios.get("/admins/");
    return data;
};

export const deactivateAdmin = async (adminId: number) => {
    const { data } = await axios.put(`/admins/${adminId}/deactivate`);
    return data;
};

export const activateAdmin = async (adminId: number) => {
    const { data } = await axios.put(`/admins/${adminId}/activate`);
    return data;
};

export const fetchCurrentAdmin = async () => {
    const { data } = await axios.get("/admins/me");
    return data;
};

export const createAdmin = async (data: {
    username: string;
    password: string;
}) => {
    const response = await axios.post(`/admins?username=${data.username}&password=${data.password}`);
    return response.data;
};

export const addTelegramId = async (telegramId: string) => {
    const response = await axios.post("/admins/telegram/add", {
        telegram_id: telegramId,
    });
    return response.data;
};

export const removeTelegramId = async (telegramId: string) => {
    const response = await axios.delete("/admins/telegram/remove", {
        data: { telegram_id: telegramId },
    });
    return response.data;
};
