import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './layout/Theme.jsx';

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <MainLayout>
          
        </MainLayout>
      ),
    },
    {
      path: "/login",
      element: (
        <Login>

        </Login>
      ),
    },
    {
        path: "/register",
        element: (
          <Register>
  
          </Register>
        ),
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
