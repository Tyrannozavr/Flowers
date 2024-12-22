export interface ThemeData {
    accentColor: string;
    logoUrl: string;
}

export const fetchThemeFromDB = async (): Promise<ThemeData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                accentColor: "#4111B4",
                logoUrl: "public/logo.png",
            });
        }, 500);
    });
};
