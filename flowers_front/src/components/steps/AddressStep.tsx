// src/components/AddressStep.tsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IOrder, clearOrderError, setFormData } from "../../redux/order/slice";
import AddressFields from "../AddressFields";
import DeliveryDateSelector from "../DeliveryDateSelector";
import TimeSlotSelector from "../TimeSlotSelector";

const AddressStep: React.FC = () => {
    const dispatch = useDispatch();
    const formData = useSelector(
        (state: { order: { formData: IOrder } }) => state.order.formData
    );

    // Обработчик изменения выбора метода доставки
    const handleDeliveryMethodChange = (method: "DELIVERY" | "PICKUP") => {
        dispatch(setFormData({ deliveryMethod: method }));
        dispatch(clearOrderError("deliveryMethod"));

        if (method === "DELIVERY") {
            dispatch(
                setFormData({
                    city: "",
                    street: "",
                    house: "",
                    apartment: "",
                    building: "",
                })
            );
        }
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Доставка</h2>

            <div className="flex space-x-6 mb-6">
                <button
                    type="button"
                    onClick={() => handleDeliveryMethodChange("PICKUP")}
                    className={`${
                        formData.deliveryMethod === "PICKUP"
                            ? "bg-accent text-white"
                            : "bg-gray-200"
                    } px-4 py-2 rounded-md w-full text-center`}
                >
                    Самовывоз
                </button>
                <button
                    type="button"
                    onClick={() => handleDeliveryMethodChange("DELIVERY")}
                    className={`${
                        formData.deliveryMethod === "DELIVERY"
                            ? "bg-accent text-white"
                            : "bg-gray-200"
                    } px-4 py-2 rounded-md w-full text-center`}
                >
                    Доставка
                </button>
            </div>

            {formData.deliveryMethod === "PICKUP" ? (
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        г.Санкт-Петербург, ул.Московский проспект, д.73
                    </label>
                </div>
            ) : (
                <AddressFields />
            )}

            <DeliveryDateSelector />
            <TimeSlotSelector />
        </div>
    );
};

export default AddressStep;
