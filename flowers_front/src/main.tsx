import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeProvider";
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <CartProvider>
                <Router>
                    <App />
                </Router>
            </CartProvider>
        </ThemeProvider>
    </StrictMode>
);
