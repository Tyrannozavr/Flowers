import axios from "./core";

export interface IAddress {
    address: string;
    phone: string;
}

export interface ThemeData {
    accentColor: string;
    logoUrl: string;
    phone: string;
    inn: string;
    addresses: IAddress[];
    name: string;
    shopId: number;
    tg: string;
    whatsapp: string;
}

interface IShop {
    primary_color: string;
    logo_url: string;
    phone: string;
    inn: string;
    addresses: IAddress[];
    subdomain: string;
    id: number;
    tg: string;
    whatsapp: string;
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
            addresses: data.addresses,
            name: data.subdomain,
            shopId: data.id,
            tg: data.tg,
            whatsapp: data.whatsapp,
        };
    } catch (error) {
        console.error("Ошибка при получении темы:", error);
        throw error;
    }
};
