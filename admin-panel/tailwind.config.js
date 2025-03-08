/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                accent: "var(--accent-color)",
            },
        },
    },
    plugins: [require("@tailwindcss/aspect-ratio")],
};
