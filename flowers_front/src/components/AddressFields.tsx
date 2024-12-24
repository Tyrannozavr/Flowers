// src/components/AddressFields.tsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    IOrder,
    clearOrderError,
    setErrors,
    setFormData,
} from "../redux/order/slice";

const AddressFields: React.FC = () => {
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

        if (name === "city" && value.trim() === "") {
            dispatch(setErrors({ field: "city", error: "Город обязателен" }));
        }
        if (name === "street" && value.trim() === "") {
            dispatch(
                setErrors({ field: "street", error: "Улица обязательна" })
            );
        }
        if (name === "house" && value.trim() === "") {
            dispatch(setErrors({ field: "house", error: "Дом обязателен" }));
        }
    };

    return (
        <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Город*
                </label>
                <input
                    type="text"
                    name="city"
                    value={formData.city || ""}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${
                        errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Введите город"
                />
                {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                    Улица*
                </label>
                <input
                    type="text"
                    name="street"
                    value={formData.street || ""}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg ${
                        errors.street ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Введите улицу"
                />
                {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                )}
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Дом*
                    </label>
                    <input
                        type="text"
                        name="house"
                        value={formData.house || ""}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg ${
                            errors.house ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Дом"
                    />
                    {errors.house && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.house}
                        </p>
                    )}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Корпус
                    </label>
                    <input
                        type="text"
                        name="building"
                        value={formData.building || ""}
                        onChange={handleInputChange}
                        className="w-full p-3 border rounded-lg border-gray-300"
                        placeholder="Корпус"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Квартира
                    </label>
                    <input
                        type="text"
                        name="apartment"
                        value={formData.apartment || ""}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg ${
                            errors.apartment
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        placeholder="Квартира"
                    />
                    {errors.apartment && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.apartment}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddressFields;
