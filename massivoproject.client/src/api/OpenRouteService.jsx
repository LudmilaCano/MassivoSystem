const fetchRoute = async (from, to) => {
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

export default fetchRoute;
