import axios from "./core";

export interface ThemeData {
    accentColor: string;
    logoUrl: string;
    phone: string;
    inn: string;
}

interface IShop {
    primary_color: string;
    logo_url: string;
    phone: string;
    inn: string;
}

export const fetchShop = async (): Promise<ThemeData> => {
    try {
        const response = await axios.get<IShop>(`/shops/subdomain`);
        const data= response.data;

        return {
            accentColor: data.primary_color,
            logoUrl: data.logo_url,
            phone: data.phone,
            inn: data.inn,
        };
    } catch (error) {
        console.error("Ошибка при получении темы:", error);
        throw error;
    }
};
