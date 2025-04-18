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
    name,
    price,
    category_id,
    availability,
    description,
    ingredients,
    images,
}: {
    shopId: number;
    name: string;
    price: string;
    category_id: number;
    availability?: string;
    description?: string;
    ingredients?: string;
    images?: File[];
}) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category_id', category_id.toString());
    
    if (availability) formData.append('availability', availability);
    if (description) formData.append('description', description);
    if (ingredients) formData.append('ingredients', ingredients);
    
    if (images && images.length > 0) {
        images.forEach((image, index) => {
            formData.append(`images`, image);
        });
    }

    const response = await axios.post(`/shops/products`, formData, {
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

export const fetchAvailabilityOptions = async () => {
    const response = await axios.get(`/products/availability-options`);
    return response.data;
};