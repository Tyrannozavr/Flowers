export interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderResponse {
    id: number;
    fullName?: string;
    phoneNumber?: string;
    recipientName?: string;
    recipientPhone?: string;
    city?: string;
    street?: string;
    house?: string;
    building?: string;
    apartment?: string;
    deliveryMethod?: string;
    deliveryDate?: string;
    deliveryTime?: string;
    wishes?: string;
    cardText?: string;
    isSelfPickup?: boolean;
    status?: string;
    isSent?: boolean;
    items: OrderItem[];
    shop_id?: number;
} 