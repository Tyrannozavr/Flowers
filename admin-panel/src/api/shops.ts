import { instance as axios } from "./axios";

export const fetchShops = async () => {
    try {
        const response = await axios.get("/shops/");
        return response.data;
    } catch (error) {
        console.error('Error fetching shops:', error);
        throw error;
    }
};

export const fetchShop = async (id: number) => {
    const response = await axios.get(`/shops/${id}`);
    return response.data;
};

export const createShop = async (formData: FormData) => {
    try {
        const response = await axios.post("/shops/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error creating shop:', error);
        throw error;
    }
};

export const updateShop = async (shopId: number, formData: FormData) => {
    try {
        const response = await axios.put(`/shops/${shopId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating shop:', error);
        throw error;
    }
};

export const deleteShop = async (id: number) => {
    try {
        const response = await axios.delete(`/shops/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting shop:', error);
        throw error;
    }
};

export const getShopCategories = async (shopId: number) => {
    const response = await axios.get(`/shops/${shopId}/categories`);
    return response.data;
}

export const addCategory = async (shopId: number, categoryId: number) => {
    const response = await axios.post(`/shops/${shopId}/categories/${categoryId}`);
    return response.data;
}

interface AddressValidationResponse {
    isValid: boolean;
    message: string;
}

export const validateAddress = async (address: string): Promise<AddressValidationResponse> => {
    try {
        const response = await axios.post('/shops/validate-address', { address });
        return response.data;
    } catch (error) {
        console.error('Error validating address:', error);
        return {
            isValid: false,
            message: "Ошибка при проверке адреса. Пожалуйста, попробуйте снова."
        };
    }
};