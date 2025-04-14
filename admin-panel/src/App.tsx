import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Admins from "./pages/Admins";
import ProductForm from "./pages/ProductForm";
import ShopDetails from "./pages/ShopDetails";
import ShopForm from "./pages/ShopForm";
import AssortmentPage from './pages/AssortmentPage';
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./pages/AdminLayout";
import AuthPage from './pages/AuthPage';
import { handleLogout } from "./api/axios";
import PolicyPage from './components/PolicyPage';
import OfferPage from './components/OfferPage'
import StoresPage from "./pages/StoresPage.tsx";

const queryClient = new QueryClient();

const App: React.FC = () => {

//     const handleAuthAction = () => {
//         handleLogout();
//         setIsAuthenticated(!isAuthenticated);
//     };

    return (
        <QueryClientProvider client={queryClient}>
            <ToastContainer position="bottom-right" autoClose={3000} />
            <Routes>

                {/* Login route */}
                <Route
                    path="/login"
                    element={
                        <AuthPage />
                    }
                />

                <Route
                    path="/"
                    element={
                        <AdminLayout
                            onAuthAction={handleLogout}
                        />
                    }
                >
                    {/* shops */}
                    <Route
                        path="shops"
                        element={
                            <ProtectedRoute>
                                <StoresPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="shops/:id"
                        element={
                            <ProtectedRoute>
                                <ShopDetails />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="shops/new"
                        element={
                            <ProtectedRoute>
                                <ShopForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="shops/:id/edit"
                        element={
                            <ProtectedRoute>
                                <ShopForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="shops/:id/products/new"
                        element={
                            <ProtectedRoute>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="shops/:id/products/:productId"
                        element={
                            <ProtectedRoute>
                                <ProductForm />
                            </ProtectedRoute>
                        }
                    />
                    {/* profile */}
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    {/* admins */}
                    <Route
                        path="admins"
                        element={
                            <ProtectedRoute>
                                <Admins />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="assortment"
                        element={
                            <ProtectedRoute>
                                <AssortmentPage />
                            </ProtectedRoute>
                        }
                    />
                    {/* index */}
                    <Route
                        index
                        element={
                            <div>Welcome to Admin Dashboard</div>
                        }
                    />
                </Route>

                <Route path="/policy" element={<PolicyPage />} />
                <Route path="/offer" element={<OfferPage />} />

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </QueryClientProvider>
    );
};

export default App;
