import { instance as axios } from "./axios";

interface RadiusCost {
  "1": number;
  "5": number;
  "10": number;
  "20": number;
}

// Base interface with common properties
interface BaseDeliveryCostData {
  is_yandex_geo?: boolean;
}

// Interface for fixed cost delivery
interface FixedDeliveryCostData extends BaseDeliveryCostData {
  type: 'fixed';
  fixed_cost: number;
}

// Interface for radius cost delivery
interface RadiusDeliveryCostData extends BaseDeliveryCostData {
  type: 'radius';
  radius_cost: RadiusCost;
}

// Interface for Yandex GO delivery
interface YandexGeoDeliveryCostData extends BaseDeliveryCostData {
  is_yandex_geo: true;
}

// Union type for all possible delivery cost data types
export type DeliveryCostData = FixedDeliveryCostData | RadiusDeliveryCostData | YandexGeoDeliveryCostData;

// Response type from the API
export interface DeliveryCostResponse {
  type: string;
  fixed_cost: number;
  radius_cost: RadiusCost;
  is_yandex_geo: boolean;
}

export const getDeliveryCost = async (): Promise<DeliveryCostResponse> => {
  const response = await axios.get('/shops/delivery/cost');
  return response.data;
};

export const createDeliveryCost = async (data: DeliveryCostData): Promise<DeliveryCostResponse> => {
  console.log("Data is ", data)
  const response = await axios.post('/shops/delivery/cost', data);
  return response.data;
};

export const updateDeliveryCost = async (data: DeliveryCostData): Promise<DeliveryCostResponse> => {
  const response = await axios.put('/shops/delivery/cost', data);
  return response.data;
};