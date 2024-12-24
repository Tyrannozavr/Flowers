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

    const [mode, setMode] = useState<"range" | "exact">("range");

    const handleModeChange = (newMode: "range" | "exact") => {
        setMode(newMode);
        dispatch(setFormData({ deliveryTime: "" }));
        dispatch(setErrors({ ...errors, deliveryTime: "" }));
    };

    const handleExactTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedTime = e.target.value;
        const now = new Date();
        const localTime = new Date(now.getTime());
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const [selectedHour, selectedMinute] = selectedTime
            .split(":")
            .map(Number);
        console.log(
            formData.deliveryDate === localTime.toISOString().split("T")[0] &&
                selectedHour >= currentHour &&
                selectedMinute > currentMinute
        );
        if (
            !(
                formData.deliveryDate ===
                    localTime.toISOString().split("T")[0] &&
                selectedHour >= currentHour &&
                selectedMinute > currentMinute
            )
        ) {
            dispatch(
                setErrors({
                    ...errors,
                    deliveryTime: "Выберите время в будущем",
                })
            );
        } else {
            dispatch(setFormData({ deliveryTime: selectedTime }));
            dispatch(setErrors({ ...errors, deliveryTime: "" })); // Очистить ошибку при корректном выборе времени
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">
                Желаемое время доставки
            </h3>
            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => handleModeChange("range")}
                    className={`px-4 py-2 rounded ${
                        mode === "range"
                            ? "bg-accent text-white"
                            : "bg-gray-200 text-gray-800"
                    }`}
                >
                    Диапазон
                </button>
                <button
                    onClick={() => handleModeChange("exact")}
                    className={`px-4 py-2 rounded ${
                        mode === "exact"
                            ? "bg-accent text-white"
                            : "bg-gray-200 text-gray-800"
                    }`}
                >
                    Ко времени
                </button>
            </div>

            {mode === "range" && (
                <div>
                    <select
                        value={formData.deliveryTime || ""}
                        onChange={(e) => handleTimeSlotChange(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:outline-none ${
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
            )}

            {mode === "exact" && (
                <div>
                    <input
                        type="time"
                        value={formData.deliveryTime || ""}
                        onChange={handleExactTimeChange}
                        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-accent focus:outline-none ${
                            errors.deliveryTime
                                ? "border-red-500 focus:ring-red-500"
                                : "border-gray-300"
                        }`}
                    />
                    {errors.deliveryTime && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.deliveryTime}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimeSelector;
