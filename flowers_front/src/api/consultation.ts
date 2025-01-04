import axios from "./core";

export interface ConsultationData {
    full_name: string;
    phone_number: string;
}

export const createConsultation = async (
    data: ConsultationData
): Promise<void> => {
    try {
        const response = await axios.post("/consultations", data);
        console.log("Запрос успешен:", response.data);
    } catch (error) {
        console.error("Ошибка при создании консультации:", error);
        throw error;
    }
};
