import { instance as axios } from "./axios";

interface RadiusCost {
  "1": number;
  "5": number;
  "10": number;
  "20": number;
}

export interface DeliveryCostData {
  type: string;
  fixed_cost: number;
  radius_cost: RadiusCost;
  is_yandex_geo: boolean;
}

export const getDeliveryCost = async (): Promise<DeliveryCostData> => {
  const response = await axios.get('/shops/delivery/cost');
  return response.data;
};

export const createDeliveryCost = async (data: DeliveryCostData): Promise<DeliveryCostData> => {
  const response = await axios.post('/shops/delivery/cost', data);
  return response.data;
};

export const updateDeliveryCost = async (data: DeliveryCostData): Promise<DeliveryCostData> => {
  const response = await axios.put('/shops/delivery/cost', data);
  return response.data;
};