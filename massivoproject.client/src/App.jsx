import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import Login from "./components/Login.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import ResetPasswordWithCode from "./components/ResetPassword.jsx";
import CustomerProfile from "./components/Customer_profile/CustomerProfile.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import ProviderDashboard from "./components/ServiceProviderDashboard/ProviderDashboard.jsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./layout/Theme.jsx";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "./redux/AuthSlice";
import VehicleList from "./components/VehicleList.jsx";
import AddVehicle from "./components/AddVehicle.jsx";
import TripDetail from "./components/TripDetail.jsx";
import AddEvent from "./components/AddEvent.jsx";
import AddVehicleEvent from "./components/AddEventVehicle.jsx";
import Booking from "./components/Booking.jsx";
import { useSelector } from "react-redux";
import AboutUs from "./components/AboutUs.jsx";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import ActivateAccount from "./components/ActivateAccount.jsx";
import BookingList from "./components/BookingList.jsx";
import BookingDetail from "./components/BookingDetail.jsx";
import NotFound from "./layout/NotFound.jsx";
import Contact from "./components/Contact.jsx";
import Instructive from "./components/Instructive.jsx";
import ReviewList from "./components/ReviewList.jsx";
import ReviewListByUser from "./components/ReviewListByUser.jsx";
import ChangePassword from "./components/ChangePassword.jsx";

function App() {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.auth);
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(initializeAuth());
    }, []);

    if (auth.loading) {
        return <div>Cargando...</div>;
    }

    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <div style={{ flex: 1, width: "100%", height: "100%" }}>
                    <Routes>
                        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
                        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
                        <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute allowedRoles={["Admin", "Prestador", "User"]}>
                                    <MainLayout><CustomerProfile /></MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/vehicle-list/:eventId" element={<MainLayout><VehicleList /></MainLayout>} />
                        <Route path="/trip-detail/:tripId" element={<MainLayout><TripDetail /></MainLayout>} />
                        <Route
                            path="/add-vehicle"
                            element={
                                <ProtectedRoute allowedRoles={["Admin", "Prestador", "User"]}>
                                    <MainLayout><AddVehicle /></MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/add-event"
                            element={
                                <ProtectedRoute allowedRoles={["Admin", "Prestador"]}>
                                    <MainLayout><AddEvent /></MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/add-vehicle-event/:eventId"
                            element={
                                <ProtectedRoute allowedRoles={["Admin", "Prestador"]}>
                                    <MainLayout><AddVehicleEvent /></MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/booking"
                            element={
                                <ProtectedRoute allowedRoles={["Admin", "User"]}>
                                    <MainLayout><Booking /></MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
                        <Route path="/reset-password" element={<MainLayout><ResetPasswordWithCode /></MainLayout>} />
                        <Route path="/change-password" element={<MainLayout><ChangePassword /></MainLayout>} />
                        <Route path="/activate-account" element={<MainLayout><ActivateAccount /></MainLayout>} />
                        <Route path="/about-us" element={<MainLayout><AboutUs /></MainLayout>} />
                        <Route
                            path="/admin-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={["Admin"]}>
                                    <MainLayout><AdminDashboard /></MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/provider-dashboard"
                            element={
                                <ProtectedRoute allowedRoles={["Prestador", "Admin"]}>
                                    <MainLayout><ProviderDashboard /></MainLayout>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/booking-list" element={<MainLayout><BookingList /></MainLayout>} />
                        <Route path="/review-list" element={<MainLayout><ReviewList /></MainLayout>} />
                        <Route path="/review-list-user" element={<MainLayout><ReviewListByUser /></MainLayout>} />
                        <Route path="/booking/:bookingId" element={<MainLayout><BookingDetail /></MainLayout>} />
                        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
                        <Route path="/instructivo" element={<MainLayout><Instructive /></MainLayout>} />
                        <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
                    </Routes>
                </div>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;