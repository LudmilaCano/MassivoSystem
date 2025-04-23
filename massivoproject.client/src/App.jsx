import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Login from './components/Login.jsx'
import CustomerProfile from './components/Customer_profile/CustomerProfile.jsx'

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
      path: "/profile",
      element: (
        <CustomerProfile>

        </CustomerProfile>
      ),
    }
  ])

  return (
    <div style={{flex: 1, width: '100%', height: '100%'}}>
      {<RouterProvider router={router} />}
    </div>
  )
}

export default App
