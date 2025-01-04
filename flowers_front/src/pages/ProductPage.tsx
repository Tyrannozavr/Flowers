import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { IProduct, fetchProductById } from "../api/product";
import { addToCart } from "../redux/cart/slice";
import { RootState } from "../redux/store";

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct>();
    const dispatch = useDispatch();
    const cart = useSelector((state: RootState) => state.cart.cart);

    // Загружаем данные продукта
    useEffect(() => {
        const loadProduct = async () => {
            if (id) {
                const data = await fetchProductById(Number(id));
                setProduct(data);
            }
        };
        loadProduct();
    }, [id]);

    // Скроллим вверх при каждом монтировании компонента
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

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

    const isInCart = cart.some((item) => item.product.id === product.id);

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Изображение букета */}
                <div className="w-full md:w-1/2">
                    <img
                        src={product.photoUrl}
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
                        {product.ingredients.split(",").map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    {/* Кнопка "Добавить в корзину" */}
                    {!isInCart ? (
                        <button
                            className="w-full mt-4 px-6 py-3 text-lg font-semibold text-white bg-accent rounded-lg shadow-md transition-all hover:bg-opacity-90"
                            onClick={() => {
                                dispatch(addToCart({ product, quantity: 1 }));
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
