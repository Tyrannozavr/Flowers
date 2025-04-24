import { Route, Routes } from "react-router-dom";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ConfirmationPage from './pages/ConfirmationPage';
import ErrorBoundary from "./utils/errorBoundary/ErrorBoundary";

const App: React.FC = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ErrorBoundary>
                        <HomePage />
                    </ErrorBoundary>
                }
            />
            <Route
                path="/cart"
                element={
                    <ErrorBoundary>
                        <CartPage />
                    </ErrorBoundary>
                }
            />
            <Route
                path="/product/:id"
                element={
                    <ErrorBoundary>
                        <ProductDetailPage />
                    </ErrorBoundary>
                }
            />
            <Route
                path="/order"
                element={
                    <ErrorBoundary>
                        <CheckoutPage />
                    </ErrorBoundary>
                }
            />
            <Route
                path="/confirmation"
                element={
                    <ErrorBoundary>
                        <ConfirmationPage />
                    </ErrorBoundary>
                }
            />
        </Routes>
    );
};

export default App;
