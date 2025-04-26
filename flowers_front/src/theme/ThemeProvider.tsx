import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchShop } from "../api/shop";

const ThemeContext = createContext({
    accentColor: "#175355",
    logoUrl: "",
    phone: "",
    inn: "",
    addresses: [],
    name: "",
    shopId: 0,
    tg: "",
    whatsapp: "",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState({
        accentColor: "#175355",
        logoUrl: "",
        phone: "",
        inn: "",
        addresses: [],
        name: "",
        shopId: 0,
        tg: "",
        whatsapp: "",
    });

    useEffect(() => {
        (async () => {
            const data: any = await fetchShop();
            setTheme(data);
        })();
    }, []);

    useEffect(() => {
        document.documentElement.style.setProperty(
            "--accent-color",
            theme.accentColor
        );
    }, [theme.accentColor]);

    return (
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
