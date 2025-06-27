import React, { useEffect, useState } from 'react'
import {
    Box, Grid, Typography, Paper, Button, TextField, Chip,
    FormControl, InputLabel, Select, MenuItem, Checkbox,
    Fab, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Alert, Collapse
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useParams } from 'react-router-dom';
import { getEventById, getVehiclesByEvent } from '../api/EventEndpoints';
import { getEventTypeLabel, getEventTypeIcon } from '../constants/eventCategories';
import { getVehicleTypeImage } from '../constants/vehicleType';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Icons
import ShareIcon from '@mui/icons-material/Share';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import MapIcon from '@mui/icons-material/Map';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagIcon from '@mui/icons-material/Flag';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const VehicleList = () => {
    const [search, setSearch] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [sortBy, setSortBy] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [compareOpen, setCompareOpen] = useState(false);

    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loadingEvent, setLoadingEvent] = useState(true);
    const itemsPerPage = 10;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchEvent = async () => {
            setLoadingEvent(true);
            try {
                const data = await getEventById(eventId);
                setEvent(data);
            } catch (error) {
                setEvent(null);
                console.error("Error: ", error);
            }
            setLoadingEvent(false);
        };
        fetchEvent();
    }, [eventId]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            let filtered = vehicles.filter(vehicle =>
                (vehicle.from || '').toLowerCase().includes(search.toLowerCase())
            );

            // Aplicar filtro de precio
            if (maxPrice) {
                filtered = filtered.filter(vehicle => vehicle.price <= parseInt(maxPrice));
            }

            // Aplicar ordenamiento
            if (sortBy === 'price') {
                filtered.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'time') {
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (sortBy === 'available') {
                filtered.sort((a, b) => b.vehicle.available - a.vehicle.available);
            }

            setFilteredVehicles(filtered);
            setCurrentPage(1);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [search, vehicles, maxPrice, sortBy]);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const data = await getVehiclesByEvent(eventId);
                setVehicles(data);
                setFilteredVehicles(data);
            } catch (error) {
                console.error("Error: ", error)
                setVehicles([]);
                setFilteredVehicles([]);
            }
        };
        if (eventId) fetchVehicles();
    }, [eventId]);

    const handleSelectVehicle = (vehicleId) => {
        setSelectedVehicles(prev => {
            if (prev.includes(vehicleId)) {
                return prev.filter(id => id !== vehicleId);
            } else {
                return [...prev, vehicleId];
            }
        });
    };

    const handleShareEvent = () => {
        const message = `
        Hola! Estoy viendo en Massivo con qué vehículos podemos ir a "${event.name}".

        Fecha: ${new Date(event.eventDate).toLocaleDateString()}
        Lugar: ${event.location}

        Te paso el link para que lo veas y me digas qué te parece: ${window.location.href}
            `;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const getSelectedVehiclesData = () => {
        return vehicles.filter(v => selectedVehicles.includes(v.eventVehicleId));
    };

    const clearFilters = () => {
        setSortBy('');
        setMaxPrice('');
        setSearch('');
    };

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
                    src={event.image}
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
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
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

                        {(auth?.role === "Prestador" || auth?.role === "Admin") && (
                            <Button
                                startIcon={<DirectionsCarIcon />}
                                onClick={() => navigate(`/add-vehicle-event/${eventId}`, {
                                    state: { description: event.name }
                                })}
                                variant="contained"
                                color="warning"
                                size="small"
                                sx={{ borderRadius: 3 }}
                            >
                                Agregar Vehículo
                            </Button>
                        )}

                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Button
                                startIcon={<ShareIcon />}
                                variant="outlined"
                                onClick={handleShareEvent}
                                size="small"
                                sx={{ borderRadius: 3 }}
                            >
                                Compartir por WhatsApp
                            </Button>

                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Filtros*/}
            <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                        Encontrar el vehículo perfecto
                    </Typography>
                    <Button
                        startIcon={<FilterListIcon />}
                        onClick={() => setShowFilters(!showFilters)}
                        variant="outlined"
                        sx={{ borderRadius: 3 }}
                    >
                        Filtros
                    </Button>
                </Box>

                <TextField
                    label="Buscar lugar de salida"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    fullWidth
                    sx={{
                        mb: 2,
                        '& label.Mui-focused': { color: '#139AA0' },
                        '& .MuiOutlinedInput-root': {
                            '&.Mui-focused fieldset': { borderColor: '#139AA0' },
                            borderRadius: 2
                        }
                    }}
                />

                <Collapse in={showFilters}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Ordenar</InputLabel>
                            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <MenuItem value="">Sin orden</MenuItem>
                                <MenuItem value="price">Precio (menor a mayor)</MenuItem>
                                <MenuItem value="time">Horario de salida</MenuItem>
                                <MenuItem value="available">Más disponibilidad</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Precio</InputLabel>
                            <Select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="5000">Hasta $5.000</MenuItem>
                                <MenuItem value="10000">Hasta $10.000</MenuItem>
                                <MenuItem value="15000">Hasta $15.000</MenuItem>
                                <MenuItem value="20000">Hasta $20.000</MenuItem>
                            </Select>
                        </FormControl>

                        {(sortBy || maxPrice || search) && (
                            <Button
                                onClick={clearFilters}
                                variant="text"
                                startIcon={<CloseIcon />}
                                size="small"
                            >
                                Limpiar filtros
                            </Button>
                        )}
                    </Box>
                </Collapse>
            </Paper>

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

            {/* Lista */}
            <Box sx={{
                maxHeight: '60vh',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                {currentItems.length !== 0 ? (
                    currentItems.map((item, index) => {
                        const lugaresDisponibles = item.capacity - item.occupation;

                        return (
                            <Paper
                                key={index}
                                elevation={selectedVehicles.includes(item.eventVehicleId) ? 8 : 3}
                                sx={{
                                    p: 2,
                                    borderRadius: 3,
                                    border: selectedVehicles.includes(item.eventVehicleId) ? '2px solid #139AA0' : 'none',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        elevation: 6,
                                        transform: 'translateY(-2px)'
                                    }
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    width: '100%'
                                }}>
                                    <Tooltip title="Seleccionar para comparar">
                                        <Checkbox
                                            checked={selectedVehicles.includes(item.eventVehicleId)}
                                            onChange={() => handleSelectVehicle(item.eventVehicleId)}
                                            sx={{
                                                color: '#139AA0',
                                                '&.Mui-checked': {
                                                    color: '#139AA0',
                                                },
                                                '& .MuiSvgIcon-root': { fontSize: 28 }
                                            }}
                                        />
                                    </Tooltip>

                                    {/* Imagen */}
                                    <Box sx={{ flexShrink: 0 }}>
                                        <img
                                            src={item.vehicle?.imagePath || getVehicleTypeImage(item.vehicleType)}
                                            alt={item.vehicle?.name}
                                            style={{
                                                width: 120,
                                                height: 80,
                                                objectFit: 'cover',
                                                borderRadius: 8
                                            }}
                                        />
                                    </Box>

                                    {/* Info */}
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            {item.vehicle.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                            <Typography variant="body2" color="text.secondary">
                                                👥 {item.capacity} personas máximo
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <LocationOnIcon fontSize="small" color="action" />
                                            <Typography variant="body2">
                                                <strong>{item.from}</strong>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                                            <AccessTimeIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(item.date).toLocaleDateString()} - {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{
                                        textAlign: 'right',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: 1,
                                        flexShrink: 0
                                    }}>
                                        <Chip
                                            label={
                                                lugaresDisponibles <= 0
                                                    ? "Sin disponibilidad"
                                                    : lugaresDisponibles < 2
                                                        ? `${lugaresDisponibles} lugar disponible`
                                                        : `${lugaresDisponibles} lugares disponibles`
                                            }
                                            color={
                                                lugaresDisponibles <= 0
                                                    ? "error"
                                                    : lugaresDisponibles < 2
                                                        ? "warning"
                                                        : "success"
                                            }
                                            size="small"
                                        />
                                        <Typography variant="h5" color="primary" fontWeight="bold">
                                            ${item.price.toLocaleString()}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            por persona
                                        </Typography>
                                        <Button
                                            onClick={() => navigate(`/trip-detail/${item.eventVehicleId}`, {
                                                state: { destination: event.location }
                                            })}
                                            variant="contained"
                                            color="warning"
                                            size="small"
                                            sx={{ borderRadius: 3 }}
                                        >
                                            Ver detalles
                                        </Button>
                                    </Box>
                                </Box>
                            </Paper>
                        );
                    })
                ) : (
                    <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                            No hay vehículos que coincidan con la búsqueda
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Intenta ajustar los filtros o buscar otro lugar de salida
                        </Typography>
                    </Paper>
                )}
            </Box>

            {/* comparar */}
            {selectedVehicles.length > 0 && (
                <Tooltip title={`Comparar ${selectedVehicles.length} vehículos`}>
                    <Fab
                        color="primary"
                        sx={{
                            position: 'fixed',
                            bottom: 20,
                            right: 20,
                            backgroundColor: '#139AA0',
                            '&:hover': { backgroundColor: '#0f7f85' }
                        }}
                        onClick={() => setCompareOpen(true)}
                    >
                        <CompareArrowsIcon />
                    </Fab>
                </Tooltip>
            )}


            {/* Modal*/}
            <Dialog
                open={compareOpen}
                onClose={() => setCompareOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Comparar Vehículos Seleccionados
                        <IconButton onClick={() => setCompareOpen(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Vehículo</strong></TableCell>
                                    <TableCell><strong>Precio</strong></TableCell>
                                    <TableCell><strong>Salida</strong></TableCell>
                                    <TableCell><strong>Horario</strong></TableCell>
                                    <TableCell><strong>Disponibilidad</strong></TableCell>
                                    <TableCell><strong>Acción</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getSelectedVehiclesData().map((vehicle) => (
                                    <TableRow key={vehicle.eventVehicleId}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <img
                                                    src={vehicle.vehicle?.imagePath || getVehicleTypeImage(vehicle.vehicleType)}
                                                    alt={vehicle.vehicle?.name}
                                                    style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 4 }}
                                                />
                                                {vehicle.vehicle.name}
                                            </Box>
                                        </TableCell>
                                        <TableCell>${vehicle.price.toLocaleString()}</TableCell>
                                        <TableCell>{vehicle.from}</TableCell>
                                        <TableCell>
                                            {new Date(vehicle.date).toLocaleDateString()} - {new Date(vehicle.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={`${vehicle.vehicle.available} lugares`}
                                                color={vehicle.vehicle.available < 2 ? "warning" : "success"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => {
                                                    setCompareOpen(false);
                                                    navigate(`/trip-detail/${vehicle.eventVehicleId}`, {
                                                        state: { destination: event.location }
                                                    });
                                                }}
                                            >
                                                Elegir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSelectedVehicles([])}>
                        Limpiar selección
                    </Button>
                    <Button onClick={() => setCompareOpen(false)} variant="contained">
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default VehicleList