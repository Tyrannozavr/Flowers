import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    IOrder,
    clearOrderError,
    setErrors,
    setFormData,
    toggleSelfPickup,
} from "../../redux/order/slice";
import CustomPhoneInput from "../CustomPhoneInput";

const ContactStep: React.FC = () => {
    const dispatch = useDispatch();
    const formData = useSelector(
        (state: { order: { formData: IOrder } }) => state.order.formData
    );
    const errors = useSelector(
        (state: { order: { errors: { [key: string]: string } } }) =>
            state.order.errors
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
        dispatch(clearOrderError(name));

        if (name === "fullName" && value.trim() === "") {
            dispatch(
                setErrors({
                    field: "fullName",
                    error: "ФИО не может быть пустым",
                })
            );
        }
        if (name === "phoneNumber" && value.trim() === "") {
            dispatch(
                setErrors({
                    field: "phoneNumber",
                    error: "Номер телефона обязателен",
                })
            );
        }
    };

    const handleToggleChange = () => {
        dispatch(toggleSelfPickup());
        dispatch(clearOrderError("recipientName"));
        dispatch(clearOrderError("recipientPhone"));
    };

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
                        onChange={handleInputChange}
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
                <div className="w-full">
                    <div className="col-span-2 w-full">
                        <label className="block text-gray-700 font-medium mb-2">
                            Номер телефона*
                        </label>
                        <CustomPhoneInput
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            name="phoneNumber"
                            error={errors.phoneNumber}
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
                                onChange={handleToggleChange}
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
                                value={formData.recipientName || ""}
                                onChange={handleInputChange}
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
                        <div className="w-full">
                            <div className="col-span-2 w-full">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Номер телефона получателя*
                                </label>
                                <CustomPhoneInput
                                    value={formData.recipientPhone || ""}
                                    onChange={handleInputChange}
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
