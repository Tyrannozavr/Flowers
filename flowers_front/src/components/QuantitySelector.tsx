import React from "react";

interface QuantitySelectorProps {
    quantity: number;
    accentColor: string;
    onQuantityChange: (newQuantity: number) => void;
}

const darkenColor = (hex: string, amount: number): string => {
    let [r, g, b] = hex
        .replace("#", "")
        .match(/.{2}/g)!
        .map((c) => parseInt(c, 16));
    r = Math.max(0, r - amount);
    g = Math.max(0, g - amount);
    b = Math.max(0, b - amount);
    return `rgb(${r}, ${g}, ${b})`;
};

const lightenColor = (hex: string, amount: number): string => {
    let [r, g, b] = hex
        .replace("#", "")
        .match(/.{2}/g)!
        .map((c) => parseInt(c, 16));
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    return `rgb(${r}, ${g}, ${b})`;
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
    quantity,
    accentColor,
    onQuantityChange,
}) => {
    const isMinusDisabled = quantity <= 1;
    const isPlusDisabled = quantity >= 1000; // Добавлена проверка для кнопки "+"

    const lightAccentColor = lightenColor(accentColor, 80);

    const handleInputChange = (value: number) => {
        if (value < 1) onQuantityChange(1);
        else if (value > 1000) onQuantityChange(1000);
        else onQuantityChange(value);
    };

    return (
        <div className="flex items-center justify-center mb-6 h-10">
            <button
                className="px-4 py-2 rounded-l-full transition-all"
                style={{
                    backgroundColor: isMinusDisabled
                        ? lightAccentColor
                        : accentColor,
                    color: "white",
                    cursor: isMinusDisabled ? "not-allowed" : "pointer",
                }}
                onClick={() =>
                    !isMinusDisabled && onQuantityChange(quantity - 1)
                }
                onMouseEnter={(e) =>
                    !isMinusDisabled &&
                    (e.currentTarget.style.backgroundColor = darkenColor(
                        accentColor,
                        80
                    ))
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = isMinusDisabled
                        ? lightAccentColor
                        : accentColor)
                }
                disabled={isMinusDisabled}
            >
                -
            </button>
            <input
                type="number"
                value={quantity}
                onChange={(e) => handleInputChange(Number(e.target.value))}
                className="w-16 h-full text-center border border-gray-300 outline-none"
                min={1}
                max={1000}
            />
            <button
                className="px-4 py-2 rounded-r-full transition-all"
                style={{
                    backgroundColor: isPlusDisabled
                        ? lightAccentColor
                        : accentColor,
                    color: "white",
                    cursor: isPlusDisabled ? "not-allowed" : "pointer",
                }}
                onClick={() =>
                    !isPlusDisabled && onQuantityChange(quantity + 1)
                }
                onMouseEnter={(e) =>
                    !isPlusDisabled &&
                    (e.currentTarget.style.backgroundColor = darkenColor(
                        accentColor,
                        80
                    ))
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = isPlusDisabled
                        ? lightAccentColor
                        : accentColor)
                }
                disabled={isPlusDisabled}
            >
                +
            </button>
        </div>
    );
};

export default QuantitySelector;
