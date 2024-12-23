import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface PhoneInputProps {
    value: string;
    name: string;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void;
    error?: string;
    required?: boolean; // Добавляем поддержку обязательного поля
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({
    value,
    name,
    onChange,
    error,
    required = false, // По умолчанию поле не обязательно
}) => {
    const handlePhoneChange = (phoneValue: string) => {
        const event = {
            target: {
                name,
                value: phoneValue,
            },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
    };

    console.log(name, value, required, error);

    return (
        <div>
            <PhoneInput
                country={"ru"}
                value={value}
                onChange={handlePhoneChange}
                inputProps={{
                    name,
                }}
                inputStyle={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "8px",
                    border: `1px solid ${error ? "#F56565" : "#E2E8F0"}`,
                    paddingLeft: "48px",
                }}
                buttonStyle={{
                    borderColor: error ? "#F56565" : "#E2E8F0",
                    borderRadius: "8px 0 0 8px",
                }}
                placeholder="Введите номер телефона"
            />
            {required && !value && (
                <p className="text-red-500 text-sm mt-1">
                    Поле обязательно для заполнения
                </p>
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default CustomPhoneInput;
