import axios from "./core";

export interface ThemeData {
    accentColor: string;
    logoUrl: string;
}

export const fetchShop = async (): Promise<ThemeData> => {
    try {
        const response = await axios.get(`/shops/subdomain`);
        const data = response.data;

        return {
            accentColor: data.primary_color,
            logoUrl: data.logo_url,
        };
    } catch (error) {
        console.error("Ошибка при получении темы:", error);
        throw error;
    }
};
