import React from "react";

interface AcceptStepProps {
    formData: any;
    handleSubmit: () => void;
}

const AcceptStep: React.FC<AcceptStepProps> = ({ formData, handleSubmit }) => {
    return (
        <div>
            <h2 className="text-lg font-semibold">Подтверждение заказа</h2>
            <p>Проверьте данные:</p>
            <ul className="list-disc pl-6">
                <li>ФИО: {formData.fullName}</li>
                <li>
                    Телефон: {formData.phoneCode} {formData.phoneNumber}
                </li>
                <li>Адрес: {formData.deliveryAddress}</li>
            </ul>
            <button
                onClick={handleSubmit}
                className="mt-4 p-3 bg-green-500 text-white rounded-lg"
            >
                Отправить заказ
            </button>
        </div>
    );
};

export default AcceptStep;
