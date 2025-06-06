import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem, Grid } from '@mui/material';
import { createEvent } from '../api/EventEndpoints';
import { EVENT_TYPE_ENUM, getEventTypeIcon, EVENT_TYPE_LABELS } from '../constants/eventCategories';
import useProvinceCitySelector from '../hooks/useProvinceCitySelector';
import { useSelector } from 'react-redux';


const AddEvent = () => {
    const userId = useSelector((state) => state.auth.userId);

    const {
        provinces,
        cities,
        loadingProvinces,
        loadingCities,
        handleProvinceChange
    } = useProvinceCitySelector();

    const [form, setForm] = useState({
        name: '',
        eventDate: '',
        type: '',
        description: '',
        provinceId: '',
        locationId: '',
        image: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleProvinceSelect = e => {
        const provinceId = e.target.value;
        setForm(prev => ({ ...prev, provinceId, locationId: '' }));
        handleProvinceChange(provinceId);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                userId: Number(userId),
                locationId: Number(form.locationId),
                name: form.name,
                description: form.description,
                eventDate: form.eventDate,
                type: Number(form.type),
                image: form.image || "https://picsum.photos/200/300" //esto es un placeholder, revisar dps como se van a manejar las imagenes.
            };
            console.log('payload que se manda al back:', payload);

            await createEvent(payload);
            alert('Evento creado correctamente');// esto hay que reemplazarlo dps por lo del swal.fire
            setForm({
                name: '',
                eventDate: '',
                type: '',
                description: '',
                provinceId: '',
                locationId: '',
                image: ''
            });
        } catch (err) {
            alert('Error al crear evento');// y esto tmb
            console.error('error: ', err.message);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ backgroundColor: '#F5F5F5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: { xs: '95vw', md: 500 } }}>
                <Typography variant="h5" fontWeight="bold" mb={2} color="#139AA0">Agregar Evento</Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre del evento"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Provincia"
                                name="provinceId"
                                value={form.provinceId}
                                onChange={handleProvinceSelect}
                                fullWidth
                                required
                                variant="outlined"
                                disabled={loadingProvinces}
                            >
                                {provinces.map(province => (
                                    <MenuItem key={province.id} value={province.id}>
                                        {province.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Ciudad"
                                name="locationId"
                                value={form.locationId}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                disabled={loadingCities || !form.provinceId}
                            >
                                {cities.map(city => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Fecha"
                                name="eventDate"
                                type="date"
                                value={form.eventDate}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                select
                                label="Categoría"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                            >
                                {EVENT_TYPE_ENUM.map((typeKey, index) => (
                                    <MenuItem key={typeKey} value={index}>
                                        {getEventTypeIcon(typeKey)} {EVENT_TYPE_LABELS[typeKey]}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                       
                        <Grid item xs={12}>
                            <TextField
                                label="Descripción"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                minRows={2}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ backgroundColor: '#139AA0', fontWeight: 'bold' }}
                                disabled={loading}
                            >
                                {loading ? 'Guardando...' : 'Agregar Evento'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddEvent;