import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Login from './components/Login.jsx'

import CustomerProfile from './components/Customer_profile/CustomerProfile.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import Register from './components/Register.jsx'
import Home from './components/Home.jsx'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './layout/Theme.jsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './redux/AuthSlice';
import VehicleList from './components/VehicleList.jsx'
import AddVehicle from './components/AddVehicle.jsx'
import TripDetail from './components/TripDetail.jsx'
import AddEvent from './components/AddEvent.jsx';
import AddVehicleEvent from './components/AddEventVehicle.jsx';
import Booking from './components/Booking.jsx';
import { useSelector } from 'react-redux';
import AboutUs from './components/AboutUs.jsx'


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
        <ProtectedRoute allowedRoles={["Admin", "Prestador"]}>
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
        <AddVehicle />
      )

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
    }
    ,
    {
      path: "/booking",
      element: (
        <ProtectedRoute allowedRoles={["Admin", "Prestador"]}>
          <MainLayout>
            <Booking />
          </MainLayout>
        </ProtectedRoute>
      )

    },
    {
      path: "/about-us",
      element: (
        <MainLayout>
          <AboutUs />
        </MainLayout>
      )
    }
  ])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  )
}

export default App
