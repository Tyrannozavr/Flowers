import React from "react";
import { IOrder } from "../../pages/Order";
import CustomPhoneInput from "../CustomPhoneInput";

interface ContactStepProps {
    formData: IOrder;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    onToggleChange: () => void;
    errors: { [key: string]: string };
}

const ContactStep: React.FC<ContactStepProps> = ({
    formData,
    onChange,
    onToggleChange,
    errors,
}) => {
    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Как с вами связаться</h2>
            <form className="space-y-4">
                {/* Поле ФИО */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        ФИО*
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={onChange}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.fullName
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300 focus:ring-accent"
                        }`}
                        placeholder="Ваше имя"
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.fullName}
                        </p>
                    )}
                </div>

                {/* Поля для ввода телефона */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">
                            Номер телефона*
                        </label>
                        <CustomPhoneInput
                            required={true}
                            value={formData.phoneNumber}
                            onChange={onChange}
                            name="phoneNumber"
                            error={errors.phone}
                        />
                    </div>
                </div>

                {/* Переключатель самовывоза */}
                <div className="flex items-center space-x-3">
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                id="selfPickupToggle"
                                checked={formData.isSelfPickup}
                                onChange={onToggleChange}
                                className="sr-only"
                            />
                            <div
                                className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner transition-all ${
                                    formData.isSelfPickup
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                }`}
                            ></div>
                            <div
                                className={`absolute w-4 h-4 top-1 bg-white rounded-full shadow transition-transform ${
                                    formData.isSelfPickup
                                        ? "translate-x-5"
                                        : "translate-x-1"
                                }`}
                            ></div>
                        </div>
                        <span className="ml-3 font-medium text-gray-700">
                            Я получу заказ сам
                        </span>
                    </label>
                </div>

                {/* Поля для получателя (если не самовывоз) */}
                {!formData.isSelfPickup && (
                    <>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Имя получателя*
                            </label>
                            <input
                                type="text"
                                name="recipientName"
                                value={formData.recipientName}
                                onChange={onChange}
                                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                                    errors.recipientName
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-accent"
                                }`}
                                placeholder="Имя получателя"
                            />
                            {errors.recipientName && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.recipientName}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Номер телефона получателя*
                                </label>
                                <CustomPhoneInput
                                    required={!formData.isSelfPickup}
                                    value={
                                        !formData.isSelfPickup &&
                                        formData.recipientPhone
                                            ? formData.recipientPhone
                                            : ""
                                    }
                                    onChange={onChange}
                                    name="recipientPhone"
                                    error={errors.recipientPhone}
                                />
                            </div>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default ContactStep;
