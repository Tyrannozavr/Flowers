import { IOrder } from "../redux/order/slice";
import axios from "./core";

export const createOrder = async (orderData: IOrder): Promise<boolean> => {
    try {
        await axios.post("/orders", orderData);
        return true; // Успех
    } catch (error) {
        console.error("Error creating order:", error);
        return false; // Ошибка
    }
};