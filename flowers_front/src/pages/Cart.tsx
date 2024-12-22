import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import OrderModal from "../components/OrderModal";
import { useCart } from "../context/CartContext";

const Cart = () => {
    const {
        cart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
    } = useCart();

    const [isOrderModalOpen, setOrderModalOpen] = useState(false);

    const calculateTotal = () => {
        return cart.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    };

    const formatPrice = (value: number) => {
        return value.toLocaleString("ru-RU");
    };

    const handleOrderSubmit = (name: string, phone: string) => {
        toast.success(
            `Спасибо за заказ, ${name}! Мы свяжемся с вами по номеру ${phone}.`
        );
        clearCart();
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-md w-full h-full m-6">
            <h1 className="text-2xl font-bold mb-6">Корзина</h1>
            {cart.length > 0 ? (
                <>
                    <ul className="space-y-6">
                        {cart.map(({ product, quantity }) => (
                            <li
                                key={product.id}
                                className="flex items-center space-x-4 border-b pb-4"
                            >
                                <div className="w-20 h-20 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                    <img
                                        src={
                                            product.imageUrl ||
                                            "/placeholder.jpg"
                                        }
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h2 className="text-lg font-bold">
                                        {product.name}
                                    </h2>
                                    <p className="text-gray-500">
                                        {formatPrice(product.price)} ₽ ×{" "}
                                        {quantity}
                                    </p>
                                    <p className="text-gray-700">
                                        Итого:{" "}
                                        {formatPrice(product.price * quantity)}{" "}
                                        ₽
                                    </p>
                                    <div className="flex items-center space-x-2 mt-2">
                                        <button
                                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                            onClick={() =>
                                                decreaseQuantity(product.id)
                                            }
                                        >
                                            -
                                        </button>
                                        <span className="px-3 py-1 border rounded">
                                            {quantity}
                                        </span>
                                        <button
                                            className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                                            onClick={() =>
                                                increaseQuantity(product.id)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={() => removeFromCart(product.id)}
                                >
                                    Удалить
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-6 border-t pt-4">
                        <p className="text-xl font-bold mb-4">
                            Общая сумма: {formatPrice(calculateTotal())} ₽
                        </p>
                        <div className="flex justify-between">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={clearCart}
                            >
                                Очистить корзину
                            </button>
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                onClick={() => setOrderModalOpen(true)}
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-gray-500">Ваша корзина пуста.</p>
            )}

            <OrderModal
                isOpen={isOrderModalOpen}
                onClose={() => setOrderModalOpen(false)}
                totalAmount={calculateTotal()}
                onSubmitOrder={handleOrderSubmit}
            />
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    );
};

export default Cart;
