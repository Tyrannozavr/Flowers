// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeProvider";
import store from "./redux/store";
import "./styles/global.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <Router>
                    <App />
                </Router>
            </ThemeProvider>
        </Provider>
    </StrictMode>
);
