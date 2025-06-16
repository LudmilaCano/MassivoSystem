export const fetchRoute = async (from, to) => {
    const response = await fetch('https://localhost:7089/api/route', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: { lat: from[0], lng: from[1] },
            to: { lat: to[0], lng: to[1] },
        }),
    });

    if (!response.ok) {
        throw new Error('No se pudo obtener la ruta');
    }

    const data = await response.json();
    const routeCoords = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    return routeCoords;
};


export const calculateRouteInfo = async (originCoords, destinationCoords) => {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${originCoords[0]},${originCoords[1]};${destinationCoords[0]},${destinationCoords[1]}?overview=full&geometries=geojson`
    );
    
    const data = await response.json();
    
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error('No se pudo calcular la ruta');
    }
    
    const route = data.routes[0];
    
    // Duración en segundos, convertir a horas y minutos
    const durationSeconds = route.duration;
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    
    // Distancia en metros, convertir a kilómetros
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
      geometry: route.geometry // Por si quieres mostrar la ruta en un mapa
    };
  } catch (error) {
    console.error('Error calculando la ruta:', error);
    return null;
  }
};
