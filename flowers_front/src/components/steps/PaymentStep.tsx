import React from "react";
import { useSelector } from "react-redux";
import { IOrder } from "../../redux/order/slice";
import { createOrder } from "../../api/order";

const PaymentStep: React.FC = () => {
    const formData = useSelector(
        (state: { order: { formData: IOrder } }) => state.order.formData
    );

    const handleSubmit = async (type: "apply" | "pay") => {
        if (type === "apply") {
            console.log(formData);
            await createOrder(formData);
        } else if (type === "pay") {
            console.log("Оплатить по СБП");
        }
    };

    return (
        <div className="space-y-8">
            {/* Заголовок */}
            <h2 className="text-2xl font-bold text-gray-800 text-center">
                Выберите способ оплаты
            </h2>

            {/* Кнопки */}
            <div className="flex flex-col space-y-6">
                {/* Кнопка "Оставить заявку" */}
                <button
                    onClick={() => handleSubmit("apply")}
                    className="w-full py-4 px-6 bg-gray-200 font-semibold text-lg rounded-lg shadow-md hover:shadow-lg hover:from-gray-600 hover:to-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
                >
                    Оставить заявку
                </button>

                {/* Кнопка "Оплатить по СБП" */}
                <button
                    onClick={() => handleSubmit("pay")}
                    className="w-full py-4 px-6 bg-accent text-white font-semibold text-lg rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                >
                    Оплатить по СБП
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;
