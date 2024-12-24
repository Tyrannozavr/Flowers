// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./order/slice";
import cartReducer from "./cart/slice";

const store = configureStore({
    reducer: {
		cart: cartReducer,
        order: orderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
