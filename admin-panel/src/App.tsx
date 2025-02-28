import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Admins from "./pages/Admins";
import Login from "./pages/Login";
import Main from "./pages/Main";
import ProductForm from "./pages/ProductForm";
import ShopDetails from "./pages/ShopDetails";
import ShopForm from "./pages/ShopForm";
import Shops from "./pages/Shops";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Routes>
                {/* Login route */}
                <Route path="/login" element={<Login />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Main />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admins"
                    element={
                        <ProtectedRoute>
                            <Admins />
                        </ProtectedRoute>
                    }
                />

                {/* Shops route */}
                <Route
                    path="/shops"
                    element={
                        <ProtectedRoute>
                            <Shops />
                        </ProtectedRoute>
                    }
                />

                {/* Shops route */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
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

                <Route
                    path="/shops/new"
                    element={
                        <ProtectedRoute>
                            <ShopForm />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/shops/:id/edit"
                    element={
                        <ProtectedRoute>
                            <ShopForm />
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

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </QueryClientProvider>
    );
};

export default App;
