import React from "react";
import InputMask from "react-input-mask";

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, error }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <InputMask
            mask="+7 (999) 999-99-99"
            value={value}
            onChange={handleChange}
        >
            {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
                <input
                    {...inputProps}
                    className={`w-full px-4 py-2 border rounded-lg ${
                        error ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    type="tel"
                />
            )}
        </InputMask>
    );
};

export default PhoneInput;
