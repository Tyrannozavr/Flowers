import React from "react";
import { useParams } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";
import { useCart } from "../context/CartContext";

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Получение ID из параметров маршрута
    const product = mockProducts.find(
        (item) => id && item.id === parseInt(id, 10)
    );

    const { cart, addToCart } = useCart();

    if (!product) {
        return (
            <div className="text-center mt-10">
                <h1 className="text-2xl font-bold text-gray-800">
                    Букет не найден
                </h1>
                <p className="text-gray-600 mt-2">
                    Вернитесь на главную страницу и попробуйте снова.
                </p>
            </div>
        );
    }

    const isInCart = cart.some((item) => item.product.id === product.id); // Проверка, есть ли товар в корзине

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Изображение букета */}
                <div className="w-full md:w-1/2">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full rounded-lg shadow-lg object-contain"
                    />
                </div>

                {/* Описание букета */}
                <div className="w-full md:w-1/2">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        {product.name}
                    </h1>
                    <p className="text-xl font-semibold text-gray-700 mb-4">
                        {product.price.toLocaleString("ru-RU")} ₽
                    </p>
                    <p className="text-gray-600 text-lg mb-4 leading-6">
                        {product.description}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Состав:
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                        {product.composition.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    {/* Кнопка "Добавить в корзину" */}
                    {!isInCart ? (
                        <button
                            className="w-full mt-4 px-6 py-3 text-lg font-semibold text-white bg-accent rounded-lg shadow-md transition-all hover:bg-opacity-90"
                            onClick={() => {
                                addToCart({ product, quantity: 1 });
                                alert("Товар добавлен в корзину!"); // Уведомление
                            }}
                        >
                            Добавить в корзину
                        </button>
                    ) : (
                        <div className="w-full mt-4 px-6 py-3 text-lg font-semibold text-center text-gray-500 bg-gray-200 rounded-lg">
                            Товар уже в корзине
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
