import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography, Paper, Button, TextField, Chip } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useParams } from 'react-router-dom';
import { getEventById,getVehiclesByEvent, } from '../api/EventEndpoints';
import { getEventTypeLabel,getEventTypeIcon } from '../constants/eventCategories';
import { getVehicleTypeImage } from '../constants/vehicleType';


const VehicleList = () => {

    const [search, setSearch] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);

    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoadingEvent(true);
            try {
                const data = await getEventById(eventId);
                setEvent(data);
            } catch (error) {
                setEvent(null);
            }
            setLoadingEvent(false);
        };
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
    const delayDebounce = setTimeout(() => {
        const filtered = vehicles.filter(vehicle =>
            (vehicle.from || '').toLowerCase().includes(search.toLowerCase())
        );
        setFilteredVehicles(filtered);
        setCurrentPage(1);
    }, 500);

    return () => clearTimeout(delayDebounce);
}, [search, vehicles]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await getVehiclesByEvent(eventId);
                setVehicles(data);
                setFilteredVehicles(data); // si quieres filtrar sobre estos datos
            } catch (error) {
                setVehicles([]);
                setFilteredVehicles([]);
            }
        };
        if (eventId) fetchVehicles();
    }, [eventId]);

    console.log(vehicles)

    if (loadingEvent) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6">Cargando evento...</Typography>
            </Box>
        );
    }

    if (!event) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">No se encontró el evento.</Typography>
            </Box>
        );
    }

    return (
    <Box sx={{ width: '100%', minHeight: '90vh', backgroundColor: '#F5F5F5', p: 4, paddingRight: '5vw', paddingLeft: '5vw' }}>
        <Paper
            elevation={8}
            sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'stretch',
                mb: 5,
                p: 0,
                borderRadius: 4,
                background: '#fff',
                boxShadow: '0 8px 32px 0 rgba(19,154,160,0.18)',
                overflow: 'hidden',
                minHeight: { xs: 340, md: 340 }
            }}
        >
            <Box
                component="img"
                src={"https://i.scdn.co/image/ab6761610000e5eb6ff0cd5ef2ecf733804984bb"}
                alt={event.name}
                sx={{
                    width: { xs: '100%', md: 420 },
                    height: { xs: 260, md: 340 },
                    objectFit: 'cover',
                    borderRadius: 0,
                    boxShadow: '0 4px 24px 0 rgba(19,154,160,0.10)'
                }}
            />
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    p: { xs: 3, md: 5 },
                    background: 'rgba(255,255,255,0.97)',
                    borderTopRightRadius: { xs: 0, md: 32 },
                    borderBottomRightRadius: { xs: 0, md: 32 },
                }}
            >
                <Box>
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        color="#139AA0"
                        sx={{
                            textShadow: '0 2px 8px rgba(19,154,160,0.10)',
                            mb: 1
                        }}
                    >
                        {event.name}
                    </Typography>
                    <Chip
                        label={getEventTypeLabel(event.type)}
                        icon={<span role="img" aria-label={event.type}>{getEventTypeIcon(event.type)}</span>}
                        color="success"
                        sx={{
                            backgroundColor: '#43A047',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            px: 2,
                            py: 1,
                            mb: 2,
                            boxShadow: '0 2px 8px 0 rgba(67,160,71,0.18)'
                        }}
                    />
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        mb={3}
                        sx={{
                            fontWeight: 500,
                            lineHeight: 1.6
                        }}
                    >
                        {event.description}
                    </Typography>
                </Box>
                <Box>
                    <Chip
                        label={event.location}
                        color="primary"
                        sx={{
                            backgroundColor: '#139AA0',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '1.15rem',
                            px: 2.5,
                            py: 1.5,
                            boxShadow: '0 2px 8px 0 rgba(19,154,160,0.18)'
                        }}
                        icon={<span role="img" aria-label="location">📍</span>}
                    />
                </Box>
            </Box>
        </Paper>

        <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
            <TextField
                margin="normal"
                label="Buscar lugar de salida"
                sx={{
                    height: '8vh',
                    width: { md: '90vw' },
                    '& label.Mui-focused': { color: '#139AA0' },
                    '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#139AA0' }
                    }
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </Box>

        <Box mt={1} mb={2} display="flex" justifyContent="center">
            <Pagination
                variant="outlined"
                shape="rounded"
                count={totalPages}
                page={currentPage}
                onChange={(event, value) => setCurrentPage(value)}
                color="primary"
            />
        </Box>

        <Box sx={{
            maxHeight: '50vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            {currentItems.length !== 0 ? (
                currentItems.map((item, index) => (
                    <Paper key={index} elevation={3} sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                        <Button onClick={() => console.log("Seleccionado: ", item.licensePlate)} sx={{ width: '100%' }} color='black'>
                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                <img
                                    src={getVehicleTypeImage(item.vehicleType)}
                                    alt={item.vehicleType}
                                    style={{ width: 60, height: 40, objectFit: 'contain', borderRadius: 8 }}
                                />
                            </Box>

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {item.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                                <Typography variant="body2" mt={1}>
                                    👥 {item.capacity} Personas máximo
                                </Typography>
                            </Box>

                            <Box sx={{
                                textAlign: 'right',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 1
                            }}>
                                <Chip label={item.available < 2 ? `${item.available} lugar disponible` : `${item.available} lugares disponibles`} color={item.available < 2 ? "error" : "success"} size="small" />
                                <Typography variant="body2">
                                    Salida: <strong>{item.from}</strong><br />
                                    14/05/25 - 16:30hs
                                </Typography>
                                <Typography variant="h6" color="primary">
                                    $999
                                </Typography>
                                <Button variant="contained" color="warning" size="small">
                                    Ver más detalles
                                </Button>
                            </Box>
                        </Button>
                    </Paper>
                ))
            ) : (
                <Typography variant="h5" fontWeight="bold" mb={3}>
                    No hay vehículos que coincidan con la búsqueda
                </Typography>
            )}
        </Box>
    </Box>
);
}

export default VehicleList