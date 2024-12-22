import React, { useEffect, useState } from "react";
import { FaCartPlus, FaCheck } from "react-icons/fa";
import { CartItem, useCart } from "../context/CartContext";
import { useTheme } from "../theme/ThemeProvider";

interface ProductProps {
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    };
    onAddToCart: (item: CartItem) => void;
    onOpenModal: (productId: number) => void;
}

const Product: React.FC<ProductProps> = ({
    product,
    onAddToCart,
    onOpenModal,
}) => {
    const { id, name, price, imageUrl } = product;
    const { accentColor } = useTheme();
    const [isAdded, setIsAdded] = useState(false);
    const { cart } = useCart();

    useEffect(() => {
        const isInCart = cart.some((item) => item.product.id === product.id);
        setIsAdded(isInCart);
    }, [cart]);

    const formatPrice = (value: number) => value.toLocaleString("ru-RU");

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAdded) {
            onAddToCart({ product, quantity: 1 });
            setIsAdded(true);
        }
    };

    return (
        <div
            className="max-w-72 flex flex-col bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:shadow-lg h-full"
            onClick={() => onOpenModal(id)}
        >
            {/* Контейнер изображения */}
            <div className="aspect-w-3 aspect-h-4 bg-gray-100">
                <img
                    src={imageUrl}
                    alt={name}
                    className="object-cover w-full h-full"
                />
            </div>
            {/* Информация */}
            <div className="p-4 bg-gray-50 flex flex-col justify-between items-start w-full">
                {/* Название */}
                <h3 className="text-sm font-bold text-gray-800 text-center truncate mb-2">
                    {name}
                </h3>
                {/* Цена и кнопка */}
                <div className="flex items-center justify-between mt-2 w-full">
                    <p className="text-base font-bold text-gray-900">
                        {formatPrice(price)} ₽
                    </p>
                    <button
                        className={`p-2 rounded-full text-white ${
                            isAdded ? "bg-green-500 cursor-not-allowed" : ""
                        }`}
                        style={{
                            backgroundColor: isAdded ? "#4CAF50" : accentColor,
                        }}
                        onClick={handleAddToCart}
                        disabled={isAdded}
                    >
                        {isAdded ? <FaCheck /> : <FaCartPlus />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;
