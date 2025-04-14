import { Route, Routes } from "react-router-dom";
import FloatingCartButton from "./components/FloatingCart";
import Header from "./components/Header";
import Order from "./pages/Order";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
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
                path="/products/:id"
                element={
                <>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-grow bg-slate-100">
                            <ProductPage />
                            <FloatingCartButton />
                        </main>
                    </div>
                </>
                }
            />
        </Routes>
    );
};

export default App;
