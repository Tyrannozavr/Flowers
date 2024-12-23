import { Route, Routes } from "react-router-dom";
import FloatingCartButton from "./components/FloatingCart";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Cart from "./pages/Cart";
import Order from "./pages/Order";
import ProductPage from "./pages/ProductPage";
import ProductSection from "./pages/ProductSection";

const App: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-slate-100">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <ProductSection />
                                <FloatingCartButton />
                            </>
                        }
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/order" element={<Order />} />
                    <Route
                        path="/products/:id"
                        element={
                            <>
                                <ProductPage />
                                <FloatingCartButton />
                            </>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
