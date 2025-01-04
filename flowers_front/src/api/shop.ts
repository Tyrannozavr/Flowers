import axios from "./core";

export interface ThemeData {
    accentColor: string;
    logoUrl: string;
}

interface IShop {
    primary_color: string;
    logo_url: string;
}

export const fetchShop = async (): Promise<ThemeData> => {
    try {
        const response = await axios.get<IShop>(`/shops/subdomain`);
        const data= response.data;

        return {
            accentColor: data.primary_color,
            logoUrl: data.logo_url,
        };
    } catch (error) {
        console.error("Ошибка при получении темы:", error);
        throw error;
    }
};
