import React, { useState } from "react";
import ContactStep from "../components/steps/ContactStep";
import AddressStep from "../components/steps/AddressStep";

export interface IOrder {
    fullName: string;
    phoneNumber: string;
    isSelfPickup: boolean;
    recipientName?: string;
    recipientPhone?: string;
    city?: string;
    street?: string;
    house?: string;
    building?: string;
    apartment?: string;
    deliveryMethod?: string;
    deliveryTime?: string;
    deliveryDate?: string;
}

const Order: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(2);
    const [formData, setFormData] = useState<IOrder>({
        fullName: "",
        phoneNumber: "",
        isSelfPickup: true,
        recipientName: "",
        recipientPhone: "",
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const onToggleChange = () => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            isSelfPickup: !prevFormData.isSelfPickup,
            ...(prevFormData.isSelfPickup
                ? { recipientName: "", recipientPhone: "" }
                : {}),
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            recipientName: "",
            recipientPhone: "",
        }));
    };

    const validateStep = () => {
        const newErrors: { [key: string]: string } = {};
        if (currentStep === 1) {
            if (!formData.fullName.trim()) {
                newErrors.fullName = "Введите ваше имя.";
            }
            if (!formData.phoneNumber) {
                newErrors.phoneNumber = "Введите корректный номер телефона.";
            }
            if (!formData.isSelfPickup) {
                if (!formData.recipientName?.trim()) {
                    newErrors.recipientName = "Введите имя получателя.";
                }
                if (!formData.recipientPhone) {
                    newErrors.recipientPhone =
                        "Введите корректный номер получателя.";
                }
            }
        }
        if (currentStep === 2) {
            if (!formData.city?.trim()) {
                newErrors.city = "Введите город.";
            }
            if (!formData.street?.trim()) {
                newErrors.street = "Введите улицу.";
            }
            if (!formData.house?.trim()) {
                newErrors.street = "Введите дом.";
            }
            if (!formData.deliveryMethod) {
                newErrors.deliveryMethod = "Выберите способ доставки.";
            }
            if (!formData.deliveryDate) {
                newErrors.deliveryDate = "Выберите дату доставки.";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleStepChange = (step: number) => {
        if (step > currentStep && !validateStep()) {
            return;
        }
        setCurrentStep(step);
    };

    const handleDeliveryMethodChange = (method: string) => {
        setFormData({ ...formData, deliveryMethod: method });
    };

    const handleDeliveryDateChange = (date: string) => {
        setFormData({ ...formData, deliveryDate: date });
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center my-10">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Оформление заказа
                </h1>

                {/* Шаги */}
                <div className="flex justify-between mb-8">
                    {["Контакты", "Доставка", "Оплата", "Подтверждение"].map(
                        (step, index) => (
                            <div
                                key={index}
                                onClick={() => handleStepChange(index + 1)}
                                className={`text-center flex-1 cursor-pointer ${
                                    currentStep === index + 1
                                        ? "text-accent font-semibold"
                                        : "text-gray-500"
                                }`}
                            >
                                Шаг {index + 1} <br />
                                {step}
                            </div>
                        )
                    )}
                </div>

                {/* Контент шагов */}
                <div>
                    {currentStep === 1 && (
                        <ContactStep
                            formData={formData}
                            onChange={handleInputChange}
                            onToggleChange={onToggleChange}
                            errors={errors}
                        />
                    )}
                    {currentStep === 2 && (
                        <AddressStep
                            formData={formData}
                            onChange={handleInputChange}
                            onMethodChange={handleDeliveryMethodChange}
                            onDateChange={handleDeliveryDateChange}
                            errors={errors}
                        />
                    )}
                </div>

                {/* Навигация */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => handleStepChange(currentStep - 1)}
                        disabled={currentStep === 1}
                        className={`p-3 bg-gray-300 rounded-lg ${
                            currentStep === 1 ? "cursor-not-allowed" : ""
                        }`}
                    >
                        Назад
                    </button>
                    {currentStep < 4 ? (
                        <button
                            onClick={() => handleStepChange(currentStep + 1)}
                            className="p-3 bg-accent text-white rounded-lg"
                        >
                            Далее
                        </button>
                    ) : (
                        <button
                            onClick={validateStep}
                            className="p-3 bg-green-500 text-white rounded-lg"
                        >
                            Подтвердить заказ
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;
