import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Home from './components/Home.jsx'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './layout/Theme.jsx';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './redux/AuthSlice';
import AddVehicle from './components/AddVehicle.jsx'

function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
  }, []);

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
        <Login />
      ),
    },
    {
      path: "/register",
      element: (
        <Register />
      ),
    },
    {
      path:"/add-vehicle",
      element:(
        <AddVehicle/>
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
