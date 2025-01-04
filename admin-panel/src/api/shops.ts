import axios from "./axios";

export const fetchShops = async () => {
    const response = await axios.get("/shops");
    return response.data;
};

export const fetchShop = async (id: number) => {
    const response = await axios.get(`/shops/${id}`);
    return response.data;
};

export const createShop = async (formData: FormData) => {
    console.log("Sending FormData:", [...formData.entries()]); // Лог для отладки
    const response = await axios.post("/shops", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateShop = async (shopId: number, formData: FormData) => {
    const response = await axios.put(`/shops/${shopId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteShop = async (id: number) => {
    const response = await axios.delete(`/shops/${id}`);
    return response.data;
};
