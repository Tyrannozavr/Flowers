import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ProgressBarInterface {
    handleStepChange: (step: number) => void;
}

const ProgressBar: React.FC<ProgressBarInterface> = ({ handleStepChange }) => {
    const currentStep = useSelector(
        (state: RootState) => state.order.currentStep
    );

    const steps = [
        { id: 1, label: "Контакты" },
        { id: 2, label: "Получение" },
        { id: 3, label: "Пожелания" },
        { id: 4, label: "Оплата" },
    ];

    return (
        <div className="flex justify-between items-center w-full border-b space-x-2 border-gray-300 mb-2">
            {steps.map((step) => (
                <div
                    key={step.id}
                    className={`text-start flex flex-col items-start w-1/4 cursor-pointer relative ${
                        currentStep === step.id
                            ? "text-accent font-bold"
                            : "text-gray-600"
                    }`}
                    onClick={() => handleStepChange(step.id)}
                >
                    {/* Устанавливаем фиксированный размер шрифта */}
                    <span className="text-sm">Шаг {step.id}</span>
                    <span className="text-base mb-2">{step.label}</span>
                    {/* Линия под шагом */}
                    {currentStep === step.id && (
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-accent"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
