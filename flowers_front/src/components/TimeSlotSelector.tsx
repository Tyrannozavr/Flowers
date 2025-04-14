import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IOrder, setErrors, setFormData } from "../redux/order/slice";

const timeData = [
    { label: "08:00 — 09:00", value: "08:00-09:00" },
    { label: "09:00 — 10:00", value: "09:00-10:00" },
    { label: "10:00 — 11:00", value: "10:00-11:00" },
    { label: "11:00 — 12:00", value: "11:00-12:00" },
    { label: "12:00 — 13:00", value: "12:00-13:00" },
    { label: "13:00 — 14:00", value: "13:00-14:00" },
    { label: "14:00 — 15:00", value: "14:00-15:00" },
    { label: "15:00 — 16:00", value: "15:00-16:00" },
    { label: "16:00 — 17:00", value: "16:00-17:00" },
    { label: "17:00 — 18:00", value: "17:00-18:00" },
    { label: "18:00 — 19:00", value: "18:00-19:00" },
    { label: "19:00 — 20:00", value: "19:00-20:00" },
    { label: "20:00 — 21:00", value: "20:00-21:00" },
    { label: "21:00 — 22:00", value: "21:00-22:00" },
];

const TimeSelector: React.FC = () => {
    const dispatch = useDispatch();
    const formData = useSelector(
        (state: {
            order: { formData: IOrder; errors: { [key: string]: string } };
        }) => state.order.formData
    );
    const errors = useSelector(
        (state: { order: { errors: { [key: string]: string } } }) =>
            state.order.errors
    );

    const [filteredTimeSlots, setFilteredTimeSlots] = useState(timeData);

    const handleTimeSlotChange = (value: string) => {
        dispatch(setFormData({ deliveryTime: value }));
        dispatch(setErrors({ ...errors, deliveryTime: "" }));
    };

    useEffect(() => {
        const now = new Date();
        const localTime = new Date();
        const currentHour = now.getHours();

        if (formData.deliveryDate === localTime.toISOString().split("T")[0]) {
            const availableSlots = filteredTimeSlots.filter((slot) => {
                const [start] = slot.value.split("-");
                const [startHour] = start.split(":").map(Number);

                return startHour > currentHour;
            });

            setFilteredTimeSlots(availableSlots);
        } else {
            setFilteredTimeSlots(timeData);
        }
    }, [formData.deliveryDate]);

    return (
        <div className="form-group time-select-wrapper">
            <select
                value={formData.deliveryTime || ""}
                onChange={(e) => handleTimeSlotChange(e.target.value)}
                className={`checkout-form-input time-select ${
                    errors.deliveryTime
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                }`}
            >
                <option value="" disabled>
                    Выберите диапазон времени
                </option>
                {filteredTimeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                        {slot.label}
                    </option>
                ))}
            </select>
            {errors.deliveryTime && (
                <p className="text-red-500 text-sm mt-2">
                    {errors.deliveryTime}
                </p>
            )}
        </div>
    );
};

export default TimeSelector;
