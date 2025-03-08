export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    imageUrl: string;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface Address {
    street: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface DeliveryTime {
    date: string;
    timeSlot: string;
}

export interface Order {
    items: CartItem[];
    deliveryAddress: Address;
    deliveryTime: DeliveryTime;
    contactInfo: ContactInfo;
    totalAmount: number;
}

export interface ContactInfo {
    name: string;
    email: string;
    phone: string;
}

export interface Theme {
    primary: string;
    secondary: string;
    background: string;
    text: string;
}
