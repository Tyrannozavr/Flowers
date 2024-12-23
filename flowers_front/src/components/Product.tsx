import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartItem, useCart } from "../context/CartContext";

interface ProductProps {
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl: string;
    };
    onAddToCart: (item: CartItem) => void;
}

const Product: React.FC<ProductProps> = ({ product, onAddToCart }) => {
    const { name, price, imageUrl } = product;
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const { cart } = useCart();

    useEffect(() => {
        const isInCart = cart.some((item) => item.product.id === product.id);
        setIsAddedToCart(isInCart);
    }, [cart]);

    const formatPrice = (value: number) => value.toLocaleString("ru-RU");

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isAddedToCart) {
            onAddToCart({ product, quantity: 1 });
            setIsAddedToCart(true);
        }
    };

    return (
        <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:shadow-lg h-full">
            {/* Контейнер изображения */}
            <Link
                to={`/products/${product.id}`}
                className="aspect-w-3 aspect-h-4 bg-gray-100"
            >
                <img
                    src={imageUrl}
                    alt={name}
                    className="object-cover w-full h-full"
                />
            </Link>
            {/* Информация */}
            <div className="p-4 bg-gray-50 flex flex-col justify-between items-start">
                {/* Название */}
                <h3 className="text-center truncate mb-2 font-bold text-gray-800 text-[clamp(0.9rem, 2vw, 1.2rem)]">
                    {name}
                </h3>
                {/* Цена */}
                <p className="mb-4 font-bold text-gray-900 text-[clamp(1rem, 2.5vw, 1.4rem)]">
                    {formatPrice(price)} ₽
                </p>
                {/* Кнопки */}
                <div className="grid grid-cols-1 gap-2 w-full">
                    <button
                        className={`flex items-center justify-center w-full py-2 rounded-lg font-semibold transition-all ${
                            isAddedToCart
                                ? "bg-green-400 text-white cursor-not-allowed"
                                : "bg-accent text-white hover:bg-opacity-90"
                        } text-[clamp(0.9rem, 2vw, 1.2rem)]`}
                        onClick={handleAddToCart}
                        disabled={isAddedToCart}
                    >
                        {isAddedToCart ? "В корзине" : "В корзину"}
                    </button>
                    <button className="flex items-center justify-center w-full py-2 rounded-lg bg-white text-accent border-2 border-accent hover:bg-slate-100 transition-all text-[clamp(0.9rem, 2vw, 1.2rem)]">
                        <Link
                            to="/order"
                            className="w-full h-full flex items-center justify-center"
                        >
                            Купить сейчас
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;
