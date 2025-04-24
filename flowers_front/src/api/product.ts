import axios from "./core";

export interface IProduct {
    id: number;
    name: string;
    description: string | null;
    price: number;
    ingredients: string;
    images: string[];
    availability: string;
    categoryId: number;
}

export interface IProductBack {
    id: number;
    name: string;
    description: string | null;
    price: number;
    ingredients: string;
    images: string[];
    availability: string;
    categoryId: number;
}


export interface ProductPageResponse {
    total: number;
    page: number;
    perPage: number;
    products: IProduct[];
}

export interface IProductPageResponse {
    total: number;
    page: number;
    perPage: number;
    products: IProductBack[];
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

        const response = await axios.get<IProductPageResponse>("/products/", {
            params,
        });
        return {
            ...response.data,
            products: response.data.products.map((el) => ({
                ...el
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
        const response = await axios.get<IProductBack>(`/products/${productId}`);
        return { ...response.data};
    } catch (error) {
        console.error("Ошибка при загрузке продукта:", error);
        throw error;
    }
};
