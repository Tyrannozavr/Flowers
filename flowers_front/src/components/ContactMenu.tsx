import { FC } from "react";
import { BsCart3, BsTelegram, BsWhatsapp } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

type Props = {
    isMobile: boolean;
};

const ContactMenu: FC<Props> = ({ isMobile }) => {
    const { cart } = useCart();
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <div
            className={`text-sm ${
                isMobile
                    ? "flex-col space-y-4 p-4"
                    : "flex items-center justify-between space-x-6"
            } flex`}
        >
            {/* Контактная информация */}
            <div
                className={`flex items-center ${
                    isMobile ? "justify-center" : ""
                }`}
            >
                <span className="mr-2">Свяжитесь с нами:</span>
                <a href="tel:+71234567890" className="font-bold">
                    +7 (123) 456-78-90
                </a>
            </div>

            {/* Ссылки на мессенджеры */}
            <div
                className={`flex items-center space-x-4 ${
                    isMobile ? "justify-center" : ""
                }`}
            >
                <a
                    href="https://wa.me/71234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center space-x-2"
                >
                    <BsWhatsapp className="text-2xl" />
                </a>
                <a
                    href="https://t.me/flowershop"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center space-x-2"
                >
                    <BsTelegram className="text-2xl" />
                </a>
            </div>

            {/* Иконка корзины с бейджем */}
            <div
                className={`relative flex items-center ${
                    isMobile ? "justify-center" : ""
                }`}
            >
                <Link to="/cart" className="relative">
                    <BsCart3 className="text-3xl" />
                    {totalItems > 0 && (
                        <span
                            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg"
                        >
                            {totalItems}
                        </span>
                    )}
                </Link>
            </div>
        </div>
    );
};

export default ContactMenu;
