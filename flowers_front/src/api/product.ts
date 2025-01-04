import axios from "./core";

export interface IProduct {
    id: number;
    name: string;
    description: string | null;
    price: number;
    ingredients: string;
    photoUrl: string;
}

export interface ProductPageResponse {
    total: number;
    page: number;
    perPage: number;
    products: IProduct[];
}

export const fetchProducts = async (
    page: number = 1,
    perPage: number = 30,
    categoryId?: number | null
): Promise<ProductPageResponse> => {
    try {
        const params: Record<string, any> = { page, per_page: perPage };
        if (categoryId) {
            params.category_id = categoryId;
        }

        const response = await axios.get<ProductPageResponse>("/products/", {
            params,
        });
        return {
            ...response.data,
            products: response.data.products.map((el) => ({
                ...el,
                photoUrl: el.photo_url,
            })),
        };
    } catch (error) {
        console.error("Ошибка при загрузке продуктов:", error);
        throw error;
    }
};

export const fetchProductById = async (
    productId: number
): Promise<IProduct> => {
    try {
        const response = await axios.get<IProduct>(`/products/${productId}`);
        return { ...response.data, photoUrl: response.data.photo_url };
    } catch (error) {
        console.error("Ошибка при загрузке продукта:", error);
        throw error;
    }
};
