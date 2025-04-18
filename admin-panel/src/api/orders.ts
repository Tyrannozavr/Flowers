import { instance as axios } from "./axios";
import { OrderResponse } from "../types/order";

export const getOrders = async (): Promise<OrderResponse[]> => {
    const response = await axios.get('/orders/shop');
    return response.data;
};

export const searchOrders = async (fio: string): Promise<OrderResponse[]> => {
    const response = await axios.get(`/orders/shop?search=${fio}`);
    return response.data;
};
