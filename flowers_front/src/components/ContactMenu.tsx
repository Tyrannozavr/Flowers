import { FC } from "react";
import { BsTelegram, BsWhatsapp } from "react-icons/bs";

type Props = {
    isMobile: boolean;
};

const ContactMenu: FC<Props> = ({ isMobile }) => {
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
        </div>
    );
};

export default ContactMenu;
