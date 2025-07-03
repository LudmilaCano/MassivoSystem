// src/components/ServiceProviderDashboard/ProviderEventPanel.jsx
import React, { useState, useEffect } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, FormControl, InputLabel, Select, MenuItem, Box,
    Autocomplete, Grid, CircularProgress, Typography
} from '@mui/material';

import { adminUpdateEvent } from '../../api/EventEndpoints';
import { getAllCities, getCityById } from '../../api/CityEndpoints';
import { getEventsByUserId } from '../../api/EventEndpoints';
import Swal from 'sweetalert2';
import useSwalAlert from '../../hooks/useSwalAlert';
import { getAllProvince } from '../../api/ProvinceEndpoints';
import { getCitiesByProvince } from '../../api/CityEndpoints';

const ProviderEventPanel = ({ userId }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [events, setEvents] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedProvinceName, setSelectedProvinceName] = useState('');
    const [citiesByProvince, setCitiesByProvince] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [eventSelectedFile, setEventSelectedFile] = useState(null);
    const { showAlert } = useSwalAlert();

    useEffect(() => {
        fetchEvents();
        fetchProvinces();
    }, [userId]);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const data = await getEventsByUserId(userId);
            console.log(data);
            setEvents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching events:', error);
            showAlert('Error al cargar los eventos', 'error');
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchProvinces = async () => {
        try {
            const provincesData = await getAllProvince();
            setProvinces(Array.isArray(provincesData) ? provincesData : []);
        } catch (error) {
            console.error("Error fetching provinces:", error);
            showAlert("Error al cargar las provincias", "error");
            setProvinces([]);
        }
    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoading(true);
                const citiesData = await getAllCities();
                setCities(Array.isArray(citiesData) ? citiesData : []);
            } catch (error) {
                console.error("Error fetching cities:", error);
                showAlert("Error al cargar las ciudades", "error");
                setCities([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        const fetchCitiesByProvince = async () => {
            if (selectedProvince) {
                try {
                    const citiesData = await getCitiesByProvince(selectedProvince);
                    const citiesArray = Array.isArray(citiesData) ? citiesData : [];
                    setCitiesByProvince(citiesArray);

                    // Si hay una ciudad seleccionada y pertenece a esta provincia, mantenerla
                    if (selectedCity && selectedCity.provinceId === selectedProvince) {
                        // Verificar si la ciudad ya está en la lista
                        const cityExists = citiesArray.some(city => city.id === selectedCity.id);
                        if (!cityExists) {
                            // Si no está, añadirla
                            setCitiesByProvince([...citiesArray, selectedCity]);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching cities by province:", error);
                    showAlert("Error al cargar las ciudades de la provincia", "error");
                    setCitiesByProvince([]);
                }
            } else {
                setCitiesByProvince([]);
            }
        };

        fetchCitiesByProvince();
    }, [selectedProvince, selectedCity]);

    const handleEditEvent = async (event) => {
        setDialogLoading(true);
        setSelectedEvent({ ...event });
        setErrors({});

        try {
            // 1. Cargar provincias si no están
            let provinceList = provinces;
            if (!provinceList || provinceList.length === 0) {
                const provincesData = await getAllProvince();
                provinceList = Array.isArray(provincesData) ? provincesData : [];
                setProvinces(provinceList);
            }

            // 2. Obtener ciudad y setear provincia seleccionada
            let provinceIdToSelect = '';
            if (event.locationId) {
                const cityData = await getCityById(event.locationId);
                setSelectedCity(cityData);

                if (cityData && cityData.provinceId) {
                    provinceIdToSelect = String(cityData.provinceId);
                    setSelectedProvince(provinceIdToSelect);

                    const citiesData = await getCitiesByProvince(cityData.provinceId);
                    const citiesArray = Array.isArray(citiesData) ? citiesData : [];
                    const cityExists = citiesArray.some(city => city.id === cityData.id);
                    if (!cityExists) {
                        setCitiesByProvince([...citiesArray, cityData]);
                    } else {
                        setCitiesByProvince(citiesArray);
                    }
                }
            }
            // Si no hay locationId, no selecciona provincia
            setOpenDialog(true);
        } catch (error) {
            console.error("Error al preparar el formulario:", error);
        } finally {
            setDialogLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEvent(prev => ({ ...prev, [name]: value }));
        // Limpiar error cuando el usuario modifica el campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleProvinceChange = async (event) => {
        const provinceId = event.target.value;
        setSelectedProvince(provinceId);

        // Resetear la ciudad seleccionada cuando cambia la provincia
        setSelectedCity(null);
        setSelectedEvent(prev => ({
            ...prev,
            locationId: null,
            location: null
        }));

        try {
            const citiesData = await getCitiesByProvince(provinceId);
            setCitiesByProvince(Array.isArray(citiesData) ? citiesData : []);
        } catch (error) {
            console.error("Error fetching cities by province:", error);
            showAlert("Error al cargar las ciudades de la provincia", "error");
            setCitiesByProvince([]);
        }
    };

    const handleCityChange = (event, newValue) => {
        setSelectedCity(newValue);
        setSelectedEvent(prev => ({
            ...prev,
            locationId: newValue ? newValue.id : null,
            location: newValue ? newValue.name : null
        }));
        // Limpiar error cuando el usuario selecciona una ciudad
        if (errors.locationId) {
            setErrors(prev => ({ ...prev, locationId: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!selectedEvent.name) newErrors.name = "El nombre es obligatorio";
        if (!selectedEvent.description) newErrors.description = "La descripción es obligatoria";
        if (!selectedEvent.eventDate) newErrors.eventDate = "La fecha es obligatoria";
        if (selectedEvent.type === undefined || selectedEvent.type === null) newErrors.type = "El tipo es obligatorio";
        if (!selectedEvent.locationId) newErrors.locationId = "La ciudad es obligatoria";
        if (!selectedEvent.image) newErrors.image = "La imagen es obligatoria";
        if (!selectedProvince) newErrors.provinceId = "La provincia es obligatoria";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveEvent = async () => {
        if (!validateForm()) {
            showAlert("Por favor complete todos los campos obligatorios", "error");
            return;
        }

        try {
            let imageUrl = selectedEvent.image;

            if (eventSelectedFile) {
                try {
                    // Intentar usar la función de endpoints si está disponible
                    const { uploadFile } = await import('../../api/FileEndpoints');
                    const { url } = await uploadFile(eventSelectedFile, 'event');
                    imageUrl = url;
                } catch (importError) {
                    // Fallback al método directo si no se puede importar
                    const formData = new FormData();
                    formData.append('file', eventSelectedFile);

                    const response = await fetch('/api/File/upload/event', {
                        method: 'POST',
                        body: formData
                    });

                    if (!response.ok) {
                        throw new Error('Error al subir la imagen');
                    }

                    const data = await response.json();
                    imageUrl = data.url;
                }
            }

            const eventData = {
                eventId: selectedEvent.eventId,
                name: selectedEvent.name,
                description: selectedEvent.description,
                eventDate: selectedEvent.eventDate,
                type: parseInt(selectedEvent.type),
                image: imageUrl,
                locationId: selectedEvent.locationId,
                userId: selectedEvent.userId
            };

            await adminUpdateEvent(selectedEvent.eventId, eventData);
            showAlert("Evento actualizado correctamente", "success");

            fetchEvents();
            handleCloseDialog();
        } catch (error) {
            console.error("Error updating event:", error);
            showAlert("Error al actualizar el evento", "error");
        }
    };

    const handleViewEventDetails = (event) => {
        const content = `
      <div>
        <p><strong>ID:</strong> ${event.eventId}</p>
        <p><strong>Nombre:</strong> ${event.name}</p>
        <p><strong>Descripción:</strong> ${event.description || 'Sin descripción'}</p>
        <p><strong>Ubicación:</strong> ${event.location || 'No especificada'}</p>
        <p><strong>Fecha:</strong> ${new Date(event.eventDate).toLocaleDateString()}</p>
        <p><strong>Tipo:</strong> ${getEventTypeName(event.type)}</p>
        <p><strong>Usuario ID:</strong> ${event.userId}</p>
        <p><strong>Imagen:</strong> ${event.image ? 'Sí' : 'No'}</p>
      </div>
    `;

        Swal.fire({
            title: 'Detalles de Evento',
            html: content,
            confirmButtonText: 'Cerrar'
        });
    };

    const getEventTypeName = (type) => {
        switch (parseInt(type)) {
            case 0: return 'Música';
            case 1: return 'Entretenimiento';
            case 2: return 'Deporte';
            case 3: return 'Negocios';
            case 4: return 'Convención';
            case 5: return 'Festival';
            case 6: return 'Gastronomía';
            case 7: return 'Gaming';
            case 8: return 'Aire libre';
            case 9: return 'Bienestar';
            case 10: return 'Cultural';
            case 11: return 'Tecnología';
            default: return 'Desconocido';
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedEvent(null);
        setSelectedProvince(null);
        setSelectedCity(null);
        setCitiesByProvince([]);
        setErrors({});
    };

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Ubicación</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) :
                            events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        <Typography color="textSecondary" align="center" sx={{ mt: 2 }}>
                                            No tienes eventos disponibles
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                events.map((event) => (
                                    <TableRow key={event.eventId}>
                                        <TableCell>{event.eventId}</TableCell>
                                        <TableCell>{event.name}</TableCell>
                                        <TableCell>{cities.find(city => city.id === event.locationId)?.name || 'No especificada'}</TableCell>
                                        <TableCell>{new Date(event.eventDate).toLocaleDateString()}</TableCell>
                                        <TableCell>{getEventTypeName(event.type)}</TableCell>
                                        <TableCell>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleEditEvent(event)}
                                                sx={{ mr: 1 }}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="info"
                                                onClick={() => handleViewEventDetails(event)}
                                            >
                                                Detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Editar Evento</DialogTitle>
                <DialogContent>
                    {dialogLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : selectedEvent && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                            <TextField
                                label="Nombre *"
                                name="name"
                                value={selectedEvent.name || ''}
                                onChange={handleInputChange}
                                fullWidth
                                required
                                error={!!errors.name}
                                helperText={errors.name}
                            />
                            <TextField
                                label="Descripción *"
                                name="description"
                                value={selectedEvent.description || ''}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={3}
                                required
                                error={!!errors.description}
                                helperText={errors.description}
                            />
                            <TextField
                                label="Fecha *"
                                name="eventDate"
                                type="datetime-local"
                                value={selectedEvent.eventDate ? selectedEvent.eventDate.split('.')[0] : ''}
                                onChange={handleInputChange}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                required
                                error={!!errors.eventDate}
                                helperText={errors.eventDate}
                            />
                            <FormControl fullWidth required error={!!errors.type}>
                                <InputLabel>Tipo *</InputLabel>
                                <Select
                                    name="type"
                                    value={selectedEvent.type !== undefined ? selectedEvent.type : ''}
                                    onChange={handleInputChange}
                                    label="Tipo *"
                                >
                                    <MenuItem value={0}>Música</MenuItem>
                                    <MenuItem value={1}>Entretenimiento</MenuItem>
                                    <MenuItem value={2}>Deporte</MenuItem>
                                    <MenuItem value={3}>Negocios</MenuItem>
                                    <MenuItem value={4}>Convención</MenuItem>
                                    <MenuItem value={5}>Festival</MenuItem>
                                    <MenuItem value={6}>Gastronomía</MenuItem>
                                    <MenuItem value={7}>Gaming</MenuItem>
                                    <MenuItem value={8}>Aire libre</MenuItem>
                                    <MenuItem value={9}>Bienestar</MenuItem>
                                    <MenuItem value={10}>Cultural</MenuItem>
                                    <MenuItem value={11}>Tecnología</MenuItem>
                                </Select>
                                {errors.type && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.type}</Box>}
                            </FormControl>

                            {/* Provincia y Ciudad */}
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth required error={!!errors.provinceId}>
                                        <InputLabel>Provincia *</InputLabel>
                                        <Select
                                            value={selectedProvince || ''}
                                            onChange={handleProvinceChange}
                                            label="Provincia *"
                                        >
                                            {Array.isArray(provinces) && provinces.map((province) => (
                                                <MenuItem key={String(province.id)} value={String(province.id)}>
                                                    {province.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.provinceId && (
                                            <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>
                                                {errors.provinceId}
                                            </Box>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        options={citiesByProvince}
                                        getOptionLabel={(option) => option.name || ''}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        disabled={!selectedProvince}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Ciudad *"
                                                required
                                                error={!!errors.locationId}
                                                helperText={errors.locationId}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Foto de evento</Typography>

                                {/* Vista previa de la imagen */}
                                {eventSelectedFile && (
                                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                                        <img
                                            src={URL.createObjectURL(eventSelectedFile)}
                                            alt="Vista previa"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                objectFit: 'contain',
                                                borderRadius: '4px'
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Selector de archivo */}
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="event-image-upload"
                                    type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setEventSelectedFile(file);
                                        }
                                    }}
                                />
                                <label htmlFor="event-image-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        fullWidth
                                    >
                                        Seleccionar Imagen de Evento
                                    </Button>
                                </label>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSaveEvent}
                        variant="contained"
                        color="primary"
                        disabled={dialogLoading}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ProviderEventPanel;