import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import ProductForm from "./pages/ProductForm";
import ShopDetails from "./pages/ShopDetails";
import Shops from "./pages/Shops";
import ProtectedRoute from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                {/* Login route */}
                <Route path="/login" element={<Login />} />

                {/* Shops route */}
                <Route
                    path="/shops"
                    element={
                        <ProtectedRoute>
                            <Shops />
                        </ProtectedRoute>
                    }
                />

                {/* Shop details route */}
                <Route
                    path="/shops/:id"
                    element={
                        <ProtectedRoute>
                            <ShopDetails />
                        </ProtectedRoute>
                    }
                />

                {/* Product creation route */}
                <Route
                    path="/shops/:id/products/new"
                    element={
                        <ProtectedRoute>
                            <ProductForm />
                        </ProtectedRoute>
                    }
                />

                {/* Product editing route */}
                <Route
                    path="/shops/:id/products/:productId"
                    element={
                        <ProtectedRoute>
                            <ProductForm />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </QueryClientProvider>
    );
};

export default App;
