import React, { useEffect, useState } from "react";
import { CategoryResponse, fetchCategories } from "../api/category";
import { useTheme } from "../theme/ThemeProvider";
import { IAddress } from "../api/shop";

const Footer: React.FC = () => {
    const { logoUrl, inn, addresses } = useTheme();
    const [categories, setCategories] = useState<CategoryResponse[]>([]);

    useEffect(() => {
        (async () => {
            const data = await fetchCategories();
            setCategories(data);
        })();
    }, []);

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
                        {categories.map((category) => (
                            <li key={category.id}>
                                <a href="#" className="hover:underline">
                                    {category.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Контакты студий */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Контакты студий
                    </h2>
                    {addresses.map((item: IAddress) => (
                        <p className="text-sm">
                            <a
                                href={`tel:+${item.phone}`}
                                className="font-bold"
                            >
                                +{item.phone}
                            </a>
                            <br />
                            {item.address}
                        </p>
                    ))}
                    {/* <p className="text-sm">
                        <a href={`tel:+${phone}`} className="font-bold">
                            +{phone}
                        </a>
                        <br />
                        Санкт-Петербург, ул. Маяковского 23/6
                    </p>
                    <p className="text-sm mt-4">
                        <a href={`tel:+${phone}`} className="font-bold">
                            +{phone}
                        </a>
                        <br />
                        Санкт-Петербург, Меридианная 8
                    </p> */}
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
                <p className="text-sm">ИНН: {inn}</p>
            </div>
        </footer>
    );
};

export default Footer;
