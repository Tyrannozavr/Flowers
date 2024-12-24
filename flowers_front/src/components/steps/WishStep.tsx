import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData } from "../../redux/order/slice";
import { RootState } from "../../redux/store";

const WishStep: React.FC = () => {
    const [addCard, setAddCard] = useState(false);

    const dispatch = useDispatch();
    const { wishes, cardText } = useSelector(
        (state: RootState) => state.order.formData
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        dispatch(setFormData({ [name]: value }));
    };

    return (
        <div className="space-y-6">
            {/* Заголовок */}
            <h2 className="text-lg font-bold text-gray-700">
                Пожелания и детали
            </h2>

            {/* Текстовое поле для пожеланий */}
            <div>
                <textarea
                    id="wishes"
                    rows={4}
                    maxLength={200}
                    value={wishes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                    placeholder="Введите ваши пожелания"
                />
                <span className="block text-right text-sm text-gray-500">
                    {200 - (wishes?.length || 0)} символов осталось
                </span>
            </div>

            {/* Переключатель для добавления открытки */}
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="addCard"
                    checked={addCard}
                    onChange={(e) => setAddCard(e.target.checked)}
                    className="w-5 h-5 text-accent focus:ring-accent border-gray-300 rounded"
                />
                <label
                    htmlFor="addCard"
                    className="ml-3 text-sm font-medium text-gray-700"
                >
                    Добавить открытку
                </label>
            </div>

            {/* Поле для текста на открытке (показывается, если открытка добавлена) */}
            {addCard && (
                <div>
                    <label
                        htmlFor="cardText"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Текст на открытке
                    </label>
                    <textarea
                        id="cardText"
                        rows={4}
                        maxLength={200}
                        value={cardText}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-accent focus:border-accent"
                        placeholder="Введите текст для открытки"
                    />
                    <span className="block text-right text-sm text-gray-500">
                        {200 - (cardText?.length || 0)} символов осталось
                    </span>
                </div>
            )}

            {/* Подсказка */}
            <p className="text-sm text-gray-500">
                Нажимая кнопку «Перейти к оплате», вы даете согласие на
                обработку персональных данных и получение рассылок.
            </p>
        </div>
    );
};

export default WishStep;
