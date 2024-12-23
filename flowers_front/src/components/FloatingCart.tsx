import React from "react";
import { BsCart3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FloatingCartButton: React.FC = () => {
    const { cart } = useCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div
            className="fixed bottom-4 border-4 border-accent right-4 w-20 h-20 bg-white text-accent rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-transform transform hover:scale-110"
            aria-label="Перейти в корзину"
        >
            <Link
                to="/cart"
                className="relative w-full h-full flex items-center justify-center rounded-full"
            >
                <BsCart3 className="text-4xl" />
                {totalItems > 0 && (
                    <span className="absolute -top-[-6px] -right-[-10px] bg-red-500 text-white text-sm font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                        {totalItems}
                    </span>
                )}
            </Link>
        </div>
    );
};

export default FloatingCartButton;
