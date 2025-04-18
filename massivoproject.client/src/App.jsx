import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router'
import MainLayout from './layout/MainLayout.jsx'
import Login from './components/Login.jsx'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from './redux/AuthSlice';

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

                </MainLayout>
            ),
        },
        {
            path: "/login",
            element: (
                <Login>

                </Login>
            ),
        }
    ])

    return (
        <div style={{ flex: 1, width: '100%', height: '100%' }}>
            {<RouterProvider router={router} />}
        </div>
    )
}

export default App
