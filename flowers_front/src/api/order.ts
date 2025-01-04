import { IOrder } from "../redux/order/slice";
import axios from "./core";

export const createOrder = async (orderData: IOrder): Promise<void> => {
    try {
        const response = await axios.post("/orders", orderData);
        console.log("Order created successfully:", response.data);
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};