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

interface AddressValidationRequest {
    city: string;
    street: string;
    house: string;
    building?: string;
    apartment?: string;
}

interface AddressValidationResponse {
    isValid: boolean;
    message: string;
}

export const validateAddress = async (address: AddressValidationRequest): Promise<AddressValidationResponse> => {
    try {
        const { data } = await axios.post<AddressValidationResponse>("/orders/validate-address", address);
        return data;
    } catch (error) {
        console.error("Error validating address:", error);
        return {
            isValid: false,
            message: "Ошибка при проверке адреса. Пожалуйста, попробуйте снова."
        };
    }
};

export const getDeliveryCost = async (
    shopId: number,
    address: { city: string; street: string; house: string; building?: string; apartment?: string }
) => {
    console.log(shopId, address);
    const { data } = await axios.post<{ cost: number }>(
        '/orders/delivery-cost',
        { shop_id: shopId, address }
    );
    return data.cost;
};

