import React, { useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../context/CartContext";

interface ProductModalProps {
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    } | null;
    onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const { accentColor } = useTheme();
    const { cart, addToCart } = useCart();

    if (!product) return null;

    // Проверка, есть ли товар в корзине
    const isInCart = cart.some((item) => item.product.id === product.id);

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full transform transition-all"
                style={{
                    animation: "fadeIn 0.3s ease-in-out",
                }}
            >
                <div className="w-full aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-6">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain"
                    />
                </div>
                <h2 className="text-xl font-bold mb-2 text-center">
                    {product.name}
                </h2>
                <p className="text-lg text-gray-600 mb-4 text-center">
                    {product.price} ₽
                </p>

                <QuantitySelector
                    quantity={quantity}
                    accentColor={accentColor}
                    onQuantityChange={setQuantity}
                />

                {/* Кнопка "Добавить в корзину" */}
                {!isInCart ? (
                    <button
                        className="w-full mb-4 px-4 py-3 text-lg font-semibold text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                        style={{
                            backgroundColor: accentColor,
                        }}
                        onClick={() => {
                            addToCart({product, quantity});
                            onClose();
                        }}
                    >
                        Добавить в корзину
                    </button>
                ) : (
                    <div className="w-full mb-4 px-4 py-3 text-lg font-semibold text-center text-gray-500 bg-gray-200 rounded-lg">
                        Товар уже в корзине
                    </div>
                )}

                <button
                    className="w-full px-4 py-3 text-lg font-semibold text-gray-600 bg-gray-200 rounded-lg transition-all hover:bg-gray-300"
                    onClick={onClose}
                >
                    Закрыть
                </button>
            </div>

            <style>
                {`
					@keyframes fadeIn {
						from {
							opacity: 0;
							transform: scale(0.9);
						}
						to {
							opacity: 1;
							transform: scale(1);
						}
					}
				`}
            </style>
        </div>
    );
};

export default ProductModal;
