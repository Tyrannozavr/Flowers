import { instance as axios } from "./axios";

export const fetchCategories = async () => {
    const response = await axios.get(`/categories/`);
    return response.data;
};


export const createCategory = async (data: { name: string; value: string; image: File | null }) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('value', data.value);
    if (data.image) {
        formData.append('image', data.image);
    }

    const response = await axios.post(`/categories/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};