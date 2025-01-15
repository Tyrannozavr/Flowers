import { instance as axios } from "./axios";

export const fetchProducts = async (shopId: number) => {
    const response = await axios.get(`/shops/${shopId}/products`);
    return response.data;
};

export const fetchProduct = async (shopId: number, productId: number) => {
    const response = await axios.get(`/shops/${shopId}/products/${productId}`);
    return response.data;
};

export const createProduct = async ({
    shopId,
    formData,
}: {
    shopId: number;
    formData: FormData;
}) => {
    const response = await axios.post(`/shops/${shopId}/products`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const updateProduct = async ({
    shopId,
    productId,
    formData,
}: {
    shopId: number;
    productId: number;
    formData: FormData;
}) => {
    const response = await axios.put(
        `/shops/${shopId}/products/${productId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deleteProduct = async (shopId: number, productId: number) => {
    const response = await axios.delete(
        `/shops/${shopId}/products/${productId}`
    );
    return response.data;
};
