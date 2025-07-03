import axios from 'axios';
import { store } from '../redux/Store';
import { logout } from '../redux/AuthSlice'; // revisar
import { showAlert } from '../hooks/AlertHelper';
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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response } = error;

        if (!response) {
            showAlert('No se pudo conectar con el servidor.', 'error');
            return Promise.reject(error);
        }

        const { status, data } = response;
        const mensaje = data?.error || 'Ocurrió un error inesperado.';

        switch (status) {
            case 400:
                showAlert(mensaje, 'error');
                break;
            case 401:
                if (response.config.url.includes('/authentication/Authenticate')) {
                    showAlert('Credenciales inválidas.', 'error');
                } else {
                    showAlert('Sesión expirada. Por favor, iniciá sesión nuevamente.', 'warning');
                    store.dispatch(logout());
                    window.location.href = '/login';
                }
                break;
            case 403:
                showAlert('No tenés permisos para acceder a este recurso.', 'error');
                break;
            case 404: {
                const knownHandledUrls = [
                    "/EventVehicle/", 
                    "/Event/", 
                    "/Booking/",      
                ];

                const isKnownDetailRoute = knownHandledUrls.some(fragment =>
                    response.config.url.includes(fragment)
                );

                if (isKnownDetailRoute) {
                    window.location.href = "/notfound";
                } else {
                    showAlert("Recurso no encontrado.", "error");
                }
                break;
            }
            case 408:
                showAlert('Tiempo de espera agotado. Intentalo nuevamente.', 'error');
                break;
            case 409:
                showAlert('Conflicto en la operación.', 'warning');
                break;
            case 500:
                showAlert('Error interno del servidor.', 'error');
                break;
            case 501:
                showAlert('Funcionalidad no implementada.', 'error');
                break;
            default:
                showAlert(mensaje, 'error');
                break;
        }

        return Promise.reject(error);
    }
);


export default api;