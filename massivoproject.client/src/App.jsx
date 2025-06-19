import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <MainLayout>
          <Login />
        </MainLayout>
      ),
    },
    {
      path: "/register",
      element: (
        <MainLayout>
          <Register />
        </MainLayout>
      ),
    },
    {
      path: "/profile",
      element: (
        <ProtectedRoute allowedRoles={["Admin", "Prestador", "User"]}>
        <MainLayout>
          <CustomerProfile />
        </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/vehicle-list/:eventId",
      element: (
        <MainLayout>
          <VehicleList />
        </MainLayout>
      ),
    },
    {
      path: "/trip-detail/:tripId",
      element: (
        <MainLayout>
          <TripDetail />
        </MainLayout>
      ),
    },
    {
      path: "/add-vehicle",
      element: (
        <ProtectedRoute allowedRoles={["Admin", "Prestador", "User"]}>
        <MainLayout>
          <AddVehicle />
        </MainLayout>
        </ProtectedRoute>
      ),
    },

    {
      path: "/add-event",
      element: (
        <ProtectedRoute allowedRoles={["Admin", "Prestador"]}>
          <MainLayout>
            <AddEvent />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/add-vehicle-event/:eventId",
      element: (
        <ProtectedRoute allowedRoles={["Admin", "Prestador"]}>
          <MainLayout>
            <AddVehicleEvent />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/booking",
      element: (
        <ProtectedRoute allowedRoles={["Admin", "User"]}>
          <MainLayout>
            <Booking />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <MainLayout>
          <ForgotPassword />
        </MainLayout>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <MainLayout>
          <ResetPasswordWithCode />
        </MainLayout>
      ),
    },
    {
      path: "/activate-account",
      element: (
        <MainLayout>
          <ActivateAccount />
        </MainLayout>
      ),
    },
    {
      path: "/about-us",
      element: (
        <MainLayout>
          <AboutUs />
        </MainLayout>
      ),
    },

    {
      path: "/admin-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["Admin"]}>
          <MainLayout>
            <AdminDashboard />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/provider-dashboard",
      element: (
        <ProtectedRoute allowedRoles={["Prestador","Admin"]}>
          <MainLayout>
            <ProviderDashboard />
          </MainLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/booking-list",
      element: (
        <MainLayout>
          <BookingList />
        </MainLayout>
      ),
    },
        {
      path: "/booking/:bookingId",
      element: (
        <MainLayout>
          <BookingDetail />
        </MainLayout>
      ),
    },

  ]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ flex: 1, width: "100%", height: "100%" }}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
