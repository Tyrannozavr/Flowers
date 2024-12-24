import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ProgressBar from "../components/ProgressBar";
import AddressStep from "../components/steps/AddressStep";
import ContactStep from "../components/steps/ContactStep";
import PaymentStep from "../components/steps/PaymentStep";
import WishStep from "../components/steps/WishStep";
import { setStep } from "../redux/order/slice";
import { RootState } from "../redux/store";
import validateStep from "../utils/ValidatorChecker";

const Order: React.FC = () => {
    const dispatch = useDispatch();
    const { currentStep, formData } = useSelector(
        (state: RootState) => state.order
    );

    const handleStepChange = (step: number) => {
        if (
            step > currentStep &&
            !validateStep(currentStep, formData, dispatch)
        ) {
            return;
        }
        dispatch(setStep(step));
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center my-10">
            <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                    Оформление заказа
                </h1>

                {/* Прогресс-бар */}
                <ProgressBar handleStepChange={handleStepChange} />

                {/* Контент шагов */}
                <div>
                    {currentStep === 1 && <ContactStep />}
                    {currentStep === 2 && <AddressStep />}
                    {currentStep === 3 && <WishStep />}
                    {currentStep === 4 && <PaymentStep />}
                </div>

                {/* Навигация */}
                <div className="flex justify-between mt-6">
                    {currentStep < 4 && (
                        <>
                            <button
                                onClick={() =>
                                    handleStepChange(currentStep - 1)
                                }
                                disabled={currentStep === 1}
                                className={`px-4 py-2 bg-gray-300 rounded-lg ${
                                    currentStep === 1
                                        ? "cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                Назад
                            </button>
                            <button
                                onClick={() =>
                                    handleStepChange(currentStep + 1)
                                }
                                className="px-4 py-2 bg-accent text-white rounded-lg"
                            >
                                Далее
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Order;
