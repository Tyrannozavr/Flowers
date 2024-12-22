import React, { createContext, useContext, useState } from "react";

export interface CartItem {
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
}

interface CartContextProps {
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
}

export const CartContext = createContext<CartContextProps | undefined>(
    undefined
);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const initialCart = (): CartItem[] => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    };

    const [cart, setCart] = useState<CartItem[]>(initialCart);

    const saveCartToLocalStorage = (cart: CartItem[]) => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (cartItem) => cartItem.product.id === item.product.id
            );
            const updatedCart = existingItem
                ? prevCart.map((cartItem) =>
                      cartItem.product.id === item.product.id
                          ? {
                                ...cartItem,
                                quantity: cartItem.quantity + item.quantity,
                            }
                          : cartItem
                  )
                : [...prevCart, item];

            saveCartToLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.filter(
                (item) => item.product.id !== id
            );
            saveCartToLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem("cart");
    };

    const increaseQuantity = (id: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.product.id === id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            saveCartToLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    const decreaseQuantity = (id: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart
                .map((item) =>
                    item.product.id === id && item.quantity > 1
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0); // Удаляем товары с количеством 0

            saveCartToLocalStorage(updatedCart);
            return updatedCart;
        });
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                clearCart,
                increaseQuantity,
                decreaseQuantity,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
