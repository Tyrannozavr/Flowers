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
        <div className="flex justify-between items-center w-full border-b border-gray-300 mb-2">
            {steps.map((step) => (
                <div
                    key={step.id}
                    className={`text-center flex flex-col items-center w-1/4 cursor-pointer ${
                        currentStep === step.id
                            ? "text-accent font-bold"
                            : "text-gray-600"
                    }`}
                    onClick={() => handleStepChange(step.id)}
                >
                    <span className="text-sm">Шаг {step.id}</span>
                    <span className="text-base">{step.label}</span>
                    {currentStep === step.id && (
                        <div className="h-1 mt-1 w-full bg-accent"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ProgressBar;
