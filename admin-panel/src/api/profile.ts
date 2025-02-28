import { instance as axios } from "./axios";

export const createPay = async () => {
    const answer = {url: '', ok: false}
    const { data } = await axios.get("/admins/me");

    if (!data.id) {
        return answer;
    }

    const response = await axios.get(`/pay/init?user_id=${data.id}`);
    return response.data
};

export const checkPay = async () => {
    const answer = {currentStatus: '', ok: false}
    const { data } = await axios.get("/admins/me");

    if (!data.id) {
        return answer;
    }

    const response = await axios.get(`/pay/check?user_id=${data.id}`);
    return response.data
};