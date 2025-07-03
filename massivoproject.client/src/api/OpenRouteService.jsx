import axios from 'axios';
import api from './AxiosBaseConnection';

export const fetchRoute = async (from, to) => {
    const response = await api.post('/route', {
        from: { lat: from[0], lng: from[1] },
        to: { lat: to[0], lng: to[1] },
    });

    const data = response.data;
    return data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
};

export const calculateRouteInfo = async (originCoords, destinationCoords) => {
    try {
        const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${originCoords[0]},${originCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?overview=full&geometries=geojson`
        );

        const data = response.data;

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error('No se pudo calcular la ruta');
        }

        const route = data.routes[0];

        const durationSeconds = route.duration;
        const hours = Math.floor(durationSeconds / 3600);
        const minutes = Math.floor((durationSeconds % 3600) / 60);
        const distanceKm = (route.distance / 1000).toFixed(2);

        return {
            duration: {
                hours,
                minutes,
                text: hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
            },
            distance: {
                km: distanceKm,
                text: `${distanceKm} km`
            },
            geometry: route.geometry
        };
    } catch (error) {
        console.error('Error calculando la ruta:', error);
        return null;
    }
};