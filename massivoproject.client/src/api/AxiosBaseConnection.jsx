import axios from 'axios';

// conexion base con Axios

const api = axios.create({
    baseURL: 'https://localhost:7089/api',
    headers: {
        'Content-Type': 'application/json',

    }
});

//se agrega el JWT a cada solicitud para no repetir esto manualmente en todas las solicitudes (Si es que hay un token en el local storage )

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;