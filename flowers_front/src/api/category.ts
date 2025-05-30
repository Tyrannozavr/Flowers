import axios from "./core";

export interface CategoryResponse {
  id: number;
  name: string;
  imageUrl: string;
}

export const fetchCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await axios.get<CategoryResponse[]>("/categories/");
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении категорий:", error);
    throw error;
  }
};

export const getShopCategories = async (shopId: number) => {
  const response = await axios.get(`/shops/${shopId}/categories`);
  return response.data;
}