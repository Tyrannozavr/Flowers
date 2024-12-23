import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Cart from "./pages/Cart";
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
                            </>
                        }
                    />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
