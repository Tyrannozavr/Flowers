import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ accentColor: "#175355", logoUrl: "" });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState({ accentColor: "#175355", logoUrl: "" });

    useEffect(() => {
        setTimeout(() => {
            setTheme({
                accentColor: "#175342",
                logoUrl: "/logo.png",
            });
        }, 500);
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
