import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useTheme } from "../theme/ThemeProvider";
import ContactMenu from "./ContactMenu";
import { Link } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 768 });
    const { logoUrl } = useTheme();

    return (
        <header className="bg-accent text-white p-4 h-20 relative z-10">
            <div className="flex justify-between items-center h-full">
                <div className="flex-shrink-0 h-full flex items-center">
                    <Link to="/" className="h-full">
                        {logoUrl ? (
                            <img
                                src={logoUrl}
                                alt="Logo"
                                className="h-full object-contain"
                            />
                        ) : (
                            <div className="animate-pulse w-24 h-12 bg-gray-300 rounded"></div>
                        )}
                    </Link>
                </div>

                {isMobile && (
                    <button
                        className="relative w-8 h-8 flex flex-col justify-center items-center group"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {/* Верхняя линия */}
                        <span
                            className={`absolute block w-8 h-1 bg-white rounded transition-transform duration-300 ease-in-out ${
                                isMenuOpen
                                    ? "rotate-45 translate-y-0"
                                    : "-translate-y-2"
                            }`}
                        ></span>
                        {/* Нижняя линия */}
                        <span
                            className={`absolute block w-8 h-1 bg-white rounded transition-transform duration-300 ease-in-out ${
                                isMenuOpen
                                    ? "-rotate-45 translate-y-0"
                                    : "translate-y-2"
                            }`}
                        ></span>
                        {/* Скрытый слой */}
                        <span
                            className={`absolute block w-8 h-1 bg-white rounded transition-opacity duration-300 ease-in-out ${
                                isMenuOpen ? "opacity-0" : "opacity-100"
                            }`}
                        ></span>
                    </button>
                )}
                {!isMobile && <ContactMenu isMobile={false} />}
            </div>

            {isMobile && (
                <div
                    className={`absolute top-full left-0 w-full bg-accent text-white overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen
                            ? "opacity-100 scale-y-100 pointer-events-auto"
                            : "opacity-0 scale-y-0 pointer-events-none"
                    }`}
                    style={{
                        transformOrigin: "top",
                    }}
                >
                    <ContactMenu isMobile={true} />
                </div>
            )}
        </header>
    );
};

export default Header;
