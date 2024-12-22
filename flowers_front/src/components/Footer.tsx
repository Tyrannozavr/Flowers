import React from "react";
import { useTheme } from "../theme/ThemeProvider";

const Footer: React.FC = () => {
    const { logoUrl } = useTheme();

    return (
        <footer className="w-full bg-accent text-white pt-20">
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {/* Логотип и компания */}
                <div>
                    <img
                        src={logoUrl}
                        alt="Logo"
                        className="h-20 object-contain"
                    />
                </div>

                {/* Категории */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Категории</h2>
                    <ul className="space-y-2">
                        <li>
                            <a href="#" className="hover:underline">
                                Популярное
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Витрина онлайн
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Авторские букеты
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Монобукеты
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:underline">
                                Декор
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Контакты студий */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Контакты студий
                    </h2>
                    <p className="text-sm">
                        <strong>+7 911 908 88 38</strong>
                        <br />
                        Санкт-Петербург, ул. Маяковского 23/6
                    </p>
                    <p className="text-sm mt-4">
                        <strong>+7 911 708 88 38</strong>
                        <br />
                        Санкт-Петербург, Меридианная 8
                    </p>
                    <p className="text-sm mt-4">
                        <a
                            href="mailto:flowers.more@yandex.ru"
                            className="hover:underline"
                        >
                            flowers.more@yandex.ru
                        </a>
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="text-2xl hover:opacity-80">
                            <i className="fab fa-instagram"></i>
                        </a>
                        <a href="#" className="text-2xl hover:opacity-80">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                        <a href="#" className="text-2xl hover:opacity-80">
                            <i className="fab fa-telegram"></i>
                        </a>
                        <a href="#" className="text-2xl hover:opacity-80">
                            <i className="fab fa-vk"></i>
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-white/20 pt-4 text-sm text-center flex flex-row justify-between p-4">
                <p className="text-sm">©2024. All Rights Reserved.</p>
                <p className="text-sm">ИНН: 753614632336</p>
            </div>
        </footer>
    );
};

export default Footer;
