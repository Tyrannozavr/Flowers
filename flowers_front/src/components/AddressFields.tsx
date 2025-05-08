// src/components/AddressFields.tsx

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    IOrder,
    clearOrderError,
    setFormData,
} from "../redux/order/slice";
import { validateAddress } from "../api/order";

interface AddressFieldsProps {
    onValidation?: (isValid: boolean) => void;
}

export interface AddressFieldsRef {
    validateAddress: () => Promise<boolean>;
}

const AddressFields = forwardRef<AddressFieldsRef, AddressFieldsProps>(({ onValidation }, ref) => {
    const dispatch = useDispatch();
    const formData = useSelector(
        (state: { order: { formData: IOrder } }) => state.order.formData
    );
    const [addressValidating, setAddressValidating] = useState(false);
    const [addressValidated, setAddressValidated] = useState(false);
    const [addressError, setAddressError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});

    const validateFields = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!formData.city || formData.city.trim() === "") {
            newErrors.city = "Город обязателен для заполнения";
        }
        
        if (!formData.street || formData.street.trim() === "") {
            newErrors.street = "Улица обязательна для заполнения";
        }
        
        if (!formData.house || formData.house.trim() === "") {
            newErrors.house = "Номер дома обязателен для заполнения";
        }
        
        setFieldErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
        dispatch(clearOrderError(name));
        
        // Сбрасываем ошибку для текущего поля
        setFieldErrors(prev => ({
            ...prev,
            [name]: ""
        }));
        
        // Сбрасываем статус валидации адреса при изменении любого поля адреса
        setAddressValidated(false);
        setAddressError("");
    };

    // Функция для проверки адреса
    const checkAddress = async (): Promise<boolean> => {
        // Сначала проверяем заполнение полей
        const fieldsValid = validateFields();
        if (!fieldsValid) {
            return false;
        }

        try {
            setAddressValidating(true);
            setAddressError("");

            const response = await validateAddress({
                city: formData.city || "",
                street: formData.street || "",
                house: formData.house || "",
                building: formData.building || "",
                apartment: formData.apartment || ""
            });

            setAddressValidated(true);
            
            if (!response.isValid) {
                setAddressError(response.message);
                if (onValidation) onValidation(false);
                return false;
            }
            
            if (onValidation) onValidation(true);
            return true;
        } catch (err) {
            console.error("Ошибка при проверке адреса:", err);
            setAddressError("Произошла ошибка при проверке адреса");
            if (onValidation) onValidation(false);
            return false;
        } finally {
            setAddressValidating(false);
        }
    };

    // Экспортируем функцию проверки адреса
    useImperativeHandle(ref, () => ({
        validateAddress: checkAddress
    }));

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
                        fieldErrors.city || addressError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Введите город"
                />
                {fieldErrors.city && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.city}</p>
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
                        fieldErrors.street || addressError ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Введите улицу"
                />
                {fieldErrors.street && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.street}</p>
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
                            fieldErrors.house || addressError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Дом"
                    />
                    {fieldErrors.house && (
                        <p className="text-red-500 text-sm mt-1">
                            {fieldErrors.house}
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
                        className={`w-full p-3 border rounded-lg ${
                            addressError ? "border-red-500" : "border-gray-300"
                        }`}
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
                            addressError ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Квартира"
                    />
                </div>
            </div>
            
            {addressValidating && (
                <div className="mt-2 text-blue-600">
                    Проверка адреса...
                </div>
            )}
            
            {addressError && (
                <div className="mt-2 text-red-500">
                    {addressError}
                </div>
            )}
            
            {addressValidated && !addressError && (
                <div className="mt-2 text-green-600">
                    Адрес проверен и существует
                </div>
            )}
        </div>
    );
});

export default AddressFields;
