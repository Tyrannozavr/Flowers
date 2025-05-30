import { instance as axios } from "./axios";

export const createPay = async (user_id: number, user_email: string, back_url: string) => {
    const response = await axios.get(`/pay/init?user_id=${user_id}&user_email=${user_email}&back_url=${back_url}`);
    return response.data
};

export const checkPay = async (user_id: number) => {
    const response = await axios.get(`/pay/check?user_id=${user_id}`);
    return response.data
};

export const cancelSubscription = async (user_id: number) => {
    const response = await axios.get(`/pay/cancel?user_id=${user_id}`);
    return response.data
};