// src/store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
    product: {
        id: number;
        name: string;
        price: number;
        images: string[];
    };
    quantity: number;
}

interface CartState {
    cart: CartItem[];
}

const initialState: CartState = {
    cart: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action: PayloadAction<CartItem>) {
            const existingItem = state.cart.find(
                (item) => item.product.id === action.payload.product.id
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.cart.push(action.payload);
            }
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        removeFromCart(state, action: PayloadAction<number>) {
            console.log(state.cart, action.payload);
            state.cart = state.cart.filter(
                (item) => item.product.id !== action.payload
            );
            localStorage.setItem("cart", JSON.stringify(state.cart));
        },
        clearCart(state) {
            state.cart = [];
            localStorage.removeItem("cart");
        },
        increaseQuantity(state, action: PayloadAction<number>) {
            const item = state.cart.find(
                (item) => item.product.id === action.payload
            );
            if (item) {
                item.quantity += 1;
                localStorage.setItem("cart", JSON.stringify(state.cart));
            }
        },
        decreaseQuantity(state, action: PayloadAction<number>) {
            const item = state.cart.find(
                (item) => item.product.id === action.payload
            );
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                localStorage.setItem("cart", JSON.stringify(state.cart));
            }
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
