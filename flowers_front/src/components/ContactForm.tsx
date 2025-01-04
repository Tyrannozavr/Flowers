import React, { useState, useEffect } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { createConsultation } from "../api/consultation";

const lightenColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
        "#" +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
};

const ContactForm: React.FC = () => {
    const { accentColor } = useTheme();
    const [formBackgroundColor, setFormBackgroundColor] = useState("#ffffff");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const [errors, setErrors] = useState({
        name: false,
        phone: false,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormBackgroundColor(lightenColor(accentColor, -10));
    }, [accentColor]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const hasErrors = {
            name: !name.trim(),
            phone: !phone.trim(),
        };

        setErrors(hasErrors);

        if (!hasErrors.name && !hasErrors.phone) {
            setLoading(true);
            try {
                // Отправляем данные на сервер
                await createConsultation({
                    full_name: name,
                    phone_number: phone,
                });

                alert("Форма успешно отправлена!");
                setName("");
                setPhone("");
            } catch (error) {
                alert("Ошибка при отправке формы. Попробуйте снова.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <section
            className="w-full py-10"
            style={{ backgroundColor: formBackgroundColor }}
        >
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
                    Не нашли, что искали?
                </h2>
                <p className="text-sm sm:text-base text-white mb-6">
                    Соберем букет под ваш запрос
                </p>

                <form
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
                    onSubmit={handleSubmit}
                >
                    <input
                        type="text"
                        placeholder="Имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full sm:w-auto flex-grow p-3 border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 ${
                            errors.name
                                ? "focus:ring-red-500"
                                : "focus:ring-accent"
                        }`}
                    />
                    <input
                        type="tel"
                        placeholder="Телефон"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full sm:w-auto flex-grow p-3 border ${
                            errors.phone ? "border-red-500" : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 ${
                            errors.phone
                                ? "focus:ring-red-500"
                                : "focus:ring-accent"
                        }`}
                    />
                    <button
                        type="submit"
                        className="p-3 bg-accent text-white rounded-lg font-semibold hover:bg-opacity-90 shadow-md transition-all duration-200"
                        disabled={loading}
                    >
                        {loading ? "Отправка..." : "Получить"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ContactForm;
