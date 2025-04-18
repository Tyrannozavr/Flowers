import { instance as axios } from "./axios";

export const fetchCategories = async () => {
    const response = await axios.get(`/categories/`);
    return response.data;
};


export const createCategory = async (data: {
    name: string;
    value: string;
    image: File | { url: string, name: string } | null;
}) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('value', data.value);
    
    if (data.image) {
        if (data.image instanceof File) {
            // If it's a File object, append it directly
            formData.append('image', data.image);
        } else if (typeof data.image === 'object' && 'url' in data.image) {
            // If it's an object with url, we need to fetch the image and create a Blob
            try {
                const response = await fetch(data.image.url);
                const blob = await response.blob();
                formData.append('image', blob, data.image.name);
            } catch (error) {
                console.error('Error fetching image:', error);
                // Handle the error appropriately
            }
        }
    }

    const response = await axios.post(`/categories/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};