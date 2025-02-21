import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchShop } from "../api/shop";

const ThemeContext = createContext({ accentColor: "#175355", logoUrl: "", phone: "", inn: "" });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState({ accentColor: "#175355", logoUrl: "", phone: "", inn: "" });

    useEffect(() => {
        (async () => {
            const data = await fetchShop();
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
