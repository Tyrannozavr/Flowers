// src/components/AddressStep.tsx

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IOrder, clearOrderError, setFormData } from "../../redux/order/slice";
import AddressFields from "../AddressFields";
import DeliveryDateSelector from "../DeliveryDateSelector";
import TimeSlotSelector from "../TimeSlotSelector";
import { useTheme } from "../../theme/ThemeProvider"

const AddressStep: React.FC = () => {
    interface Address {
        address: string;
    }

    const dispatch = useDispatch();
    const formData = useSelector(
        (state: { order: { formData: IOrder } }) => state.order.formData
    );

    const theme = useTheme() as { addresses: Address[] };

    const changeAddress = (value: string) => {
        dispatch(setFormData({ street: value }));
    };

    // Обработчик изменения выбора метода доставки
    const handleDeliveryMethodChange = (method: "DELIVERY" | "PICKUP") => {
        dispatch(setFormData({ deliveryMethod: method }));
        dispatch(clearOrderError("deliveryMethod"));

        if (method === "DELIVERY") {
            dispatch(
                setFormData({
                    city: "",
                    // street: "",
                    house: "",
                    apartment: "",
                    building: "",
                })
            );
        }
    };

    if (!formData.street && theme.addresses.length > 0) {
        changeAddress(theme.addresses[0].address);
    }

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
                theme.addresses.length > 0 ? (
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            <div>
                                <select
                                    name="street"
                                    defaultValue={formData.street || theme.addresses[0].address}
                                    onChange={(e) => changeAddress(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:outline-none border-gray-300"
                                >
                                    {theme.addresses.map((slot, i) => (
                                        <option key={i} value={slot.address}>
                                            {slot.address}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </label>
                    </div>
                ) : null
            ) : (
                <AddressFields />
            )}

            <DeliveryDateSelector />
            <TimeSlotSelector />
        </div>
    );
};

export default AddressStep;
