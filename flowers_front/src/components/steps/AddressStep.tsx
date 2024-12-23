import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AddressStepProps {
    formData: {
        city?: string;
        street?: string;
        house?: string;
        building?: string;
        apartment?: string;
        deliveryDate?: string;
        deliveryTime?: string;
    };
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onDateChange: (date: string) => void;
    onTimeChange: (time: string) => void;
    errors: { [key: string]: string };
}

const AddressStep: React.FC<AddressStepProps> = ({
    formData,
    onChange,
    onDateChange,
    onTimeChange,
    errors,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const currentDate = new Date();
    const currentHour = currentDate.getHours();

    const isTimeAvailable = (timeRange: string): boolean => {
        if (formData.deliveryDate === "Сегодня") {
            const [startHour] = timeRange.split(" — ")[0].split(":").map(Number);
            return startHour > currentHour;
        }
        return true;
    };

    const handleCustomDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date) {
            onDateChange(date.toISOString().split("T")[0]); // Форматируем дату
        }
    };

    return (
        <div>
            <h2 className="text-lg font-semibold mb-4">Доставка</h2>

            {/* Поля для адреса */}
            <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Город*</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city || ""}
                        onChange={onChange}
                        className={`w-full p-3 border rounded-lg ${
                            errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Введите город"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-2">Улица*</label>
                    <input
                        type="text"
                        name="street"
                        value={formData.street || ""}
                        onChange={onChange}
                        className={`w-full p-3 border rounded-lg ${
                            errors.street ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="Введите улицу"
                    />
                    {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Дом*</label>
                        <input
                            type="text"
                            name="house"
                            value={formData.house || ""}
                            onChange={onChange}
                            className={`w-full p-3 border rounded-lg ${
                                errors.house ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Дом"
                        />
                        {errors.house && <p className="text-red-500 text-sm mt-1">{errors.house}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Корпус</label>
                        <input
                            type="text"
                            name="building"
                            value={formData.building || ""}
                            onChange={onChange}
                            className="w-full p-3 border rounded-lg border-gray-300"
                            placeholder="Корпус"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Квартира*</label>
                        <input
                            type="text"
                            name="apartment"
                            value={formData.apartment || ""}
                            onChange={onChange}
                            className={`w-full p-3 border rounded-lg ${
                                errors.apartment ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="Квартира"
                        />
                        {errors.apartment && (
                            <p className="text-red-500 text-sm mt-1">{errors.apartment}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Дата доставки */}
            <h2 className="text-lg font-semibold mb-4">Дата доставки</h2>
            <div className="space-y-2 mb-6">
                {["Сегодня", "Завтра", "Послезавтра", "Другая дата"].map((date) => (
                    <label key={date} className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="radio"
                            name="deliveryDate"
                            value={date}
                            checked={formData.deliveryDate === date}
                            onChange={(e) => onDateChange(e.target.value)}
                            className="h-5 w-5 text-accent focus:ring-accent"
                        />
                        <span className="text-gray-700">
                            {date === "Другая дата" ? (
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleCustomDateChange}
                                    className="ml-2 text-accent underline cursor-pointer"
                                    placeholderText="Выберите дату"
                                    minDate={new Date()}
                                />
                            ) : (
                                date
                            )}
                        </span>
                    </label>
                ))}
                {errors.deliveryDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.deliveryDate}</p>
                )}
            </div>

            {/* Время доставки */}
            <h2 className="text-lg font-semibold mb-4">Желаемое время доставки</h2>
            <div className="grid grid-cols-2 gap-4">
                {[
                    "08:00 — 10:00",
                    "10:00 — 12:00",
                    "12:00 — 14:00",
                    "14:00 — 16:00",
                    "16:00 — 18:00",
                    "18:00 — 20:00",
                ].map((time) => (
                    <button
                        key={time}
                        type="button"
                        className={`p-3 border rounded-lg ${
                            formData.deliveryTime === time
                                ? "bg-accent text-white"
                                : "bg-white text-gray-700"
                        } ${isTimeAvailable(time) ? "" : "opacity-50 cursor-not-allowed"}`}
                        onClick={() => isTimeAvailable(time) && onTimeChange(time)}
                        disabled={!isTimeAvailable(time)}
                    >
                        {time}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AddressStep;
