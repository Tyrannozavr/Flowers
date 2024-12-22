import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhoneInput from "./PhoneInput";

interface OrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalAmount: number;
    onSubmitOrder: (name: string, phone: string) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
    isOpen,
    onClose,
    totalAmount,
    onSubmitOrder,
}) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState({ name: false, phone: false });

    const handleSubmit = () => {
        const hasNameError = !name.trim();
        const hasPhoneError = phone.replace(/\D/g, "").length !== 11;

        setErrors({ name: hasNameError, phone: hasPhoneError });

        if (!hasNameError && !hasPhoneError) {
            onSubmitOrder(name, phone);
            toast.success("Заказ успешно оформлен!");
            onClose();
        } else {
            toast.error("Пожалуйста, заполните все поля корректно.");
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-center">
                    Оформление заказа
                </h2>
                <p className="mb-4 text-center">
                    Общая сумма:{" "}
                    <span className="font-bold">{totalAmount} ₽</span>
                </p>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Имя
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg ${
                            errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Введите ваше имя"
                    />
                    {errors.name && (
                        <p className="text-red-500 text-sm">
                            Имя обязательно для заполнения.
                        </p>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Телефон
                    </label>
                    <PhoneInput
                        value={phone}
                        onChange={setPhone}
                        error={errors.phone}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">
                            Введите корректный номер телефона.
                        </p>
                    )}
                </div>
                <div className="flex justify-between items-center">
                    <button
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={onClose}
                    >
                        Отмена
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={handleSubmit}
                    >
                        Заказать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderModal;
