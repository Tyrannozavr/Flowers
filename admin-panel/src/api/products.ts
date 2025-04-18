import { instance as axios } from "./axios";

export const fetchProducts = async () => {
    try {
        const response = await axios.get(`/shops/products`);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            console.log("Продукты не найдены, возвращаем пустой список.");
            return [];
        }
        throw error;
    }
};

export const fetchProduct = async (shopId: number, productId: number) => {
    const response = await axios.get(`/shops/${shopId}/products/${productId}`);
    return response.data;
};

export const createProduct = async ({
    shopId,
    formData,
}: {
    shopId?: number;
    formData: FormData;
}) => {
    const url = shopId ? `/shops/${shopId}/products` : `/shops/products`;
    const response = await axios.post(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const updateProduct = async ({
    shopId,
    productId,
    formData
}: {
    shopId?: number;
    productId: number;
    formData: FormData;
}) => {
    const url = shopId ? `/shops/${shopId}/products/${productId}` : `/shops/products/${productId}`;
    const response = await axios.put(
        url,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
};

export const deleteProduct = async ({ shopId, productId }: { shopId?: number; productId: number }) => {
    const url = shopId ? `/shops/${shopId}/products/${productId}` : `/shops/products/${productId}`;
    const response = await axios.delete(url);
    return response.data;
};

export const fetchAvailabilityOptions = async () => {
    const response = await axios.get(`/products/availability-options`);
    return response.data;
};
