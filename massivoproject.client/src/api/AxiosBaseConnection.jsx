import axios from 'axios';
import { store } from '../redux/Store';
import { logout } from '../redux/AuthSlice'; // revisar
import Swal from 'sweetalert2';

const api = axios.create({
    baseURL: '/api',
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
            Swal.fire({
                icon: 'error',
                title: 'Error de conexi�n',
                text: 'No se pudo conectar con el servidor.'
            });
            return Promise.reject(error);
        }

        const { status, data } = response;
        const mensaje = data?.error || 'Ocurri� un error inesperado.';

        switch (status) {
            case 400:
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: mensaje
                });
                break;
            case 401:
                if (response.config.url.includes('/authentication/Authenticate')) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de autenticaci�n',
                        text: 'Credenciales inv�lidas.'
                    });
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesi�n expirada',
                        text: 'Por favor, inici� sesi�n nuevamente.'
                    });
                    store.dispatch(logout());
                    window.location.href = '/login';
                }
                break;
            case 403:
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso denegado',
                    text: 'No ten�s permisos para acceder a este recurso.'
                });
                break;
            case 404:
                Swal.fire({
                    icon: 'error',
                    title: 'No encontrado',
                    text: 'Recurso no encontrado.'
                });
                break;
            case 408:
                Swal.fire({
                    icon: 'error',
                    title: 'Tiempo agotado',
                    text: 'Tiempo de espera agotado. Intentalo nuevamente.'
                });
                break;
            case 409:
                Swal.fire({
                    icon: 'warning',
                    title: 'Conflicto',
                    text: 'Conflicto en la operaci�n.'
                });
                break;
            case 500:
                Swal.fire({
                    icon: 'error',
                    title: 'Error del servidor',
                    text: 'Error interno del servidor.'
                });
                break;
            case 501:
                Swal.fire({
                    icon: 'error',
                    title: 'No implementado',
                    text: 'Funcionalidad no implementada.'
                });
                break;
            default:
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: mensaje
                });
                break;
        }

        return Promise.reject(error);
    }
);

export default api;