import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { setErrors, setFormData } from "../redux/order/slice";

const DeliveryDateSelector: React.FC = () => {
    const dispatch = useDispatch();
    const formData = useSelector(
        (state: { order: { formData: { deliveryDate: string } } }) =>
            state.order.formData
    );
    const errors = useSelector(
        (state: { order: { errors: { [key: string]: string } } }) =>
            state.order.errors
    );

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (!formData.deliveryDate) {
            const today = new Date();
            setSelectedDate(today);
            dispatch(
                setFormData({ deliveryDate: today.toISOString().split("T")[0] })
            );
        } else {
            setSelectedDate(new Date(formData.deliveryDate));
        }
    }, [formData.deliveryDate, dispatch]);

    const handleDateChange = (date: Date | null) => {
        if (date) {
            dispatch(
                setFormData({ deliveryDate: date.toISOString().split("T")[0] })
            );
            dispatch(setErrors({ field: "deliveryDate", error: "" })); // сбрасываем ошибку
        } else {
            dispatch(setFormData({ deliveryDate: "" }));
            dispatch(
                setErrors({ field: "deliveryDate", error: "Дата обязательна!" })
            ); // ошибка если не выбрана дата
        }
        setSelectedDate(date);
    };

    return (
        <div className="space-y-4 mb-6">
            <div className="flex flex-col space-y-3">
                <label className="text-lg font-semibold">
                    <span>Выберите дату доставки*</span>
                </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    className="mt-2 text-accent border border-gray-300 p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholderText="Выберите дату"
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                />
            </div>

            {errors.deliveryDate && (
                <div className="text-red-500 text-sm mt-2">
                    {errors.deliveryDate}
                </div>
            )}
        </div>
    );
};

export default DeliveryDateSelector;
