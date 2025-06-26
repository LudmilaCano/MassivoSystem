import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem, Grid } from '@mui/material';
import { createEvent } from '../api/EventEndpoints';
import { EVENT_TYPE_ENUM, getEventTypeIcon, EVENT_TYPE_LABELS } from '../constants/eventCategories';
import useProvinceCitySelector from '../hooks/useProvinceCitySelector';
import { useSelector } from 'react-redux';
import useSwalAlert from '../hooks/useSwalAlert';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadFile } from '../api/FileEndpoints';



const AddEvent = () => {
    const userId = useSelector((state) => state.auth.userId);
    const { showAlert } = useSwalAlert();
    const {
        provinces,
        cities,
        loadingProvinces,
        loadingCities,
        handleProvinceChange
    } = useProvinceCitySelector();
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);


    const [form, setForm] = useState({
        name: '',
        eventDate: '',
        type: '',
        description: '',
        provinceId: '',
        locationId: '',
        image: ''
    });
    const [preview, setPreview] = useState(null);
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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.match('image.*')) {
            setError('Por favor selecciona una imagen válida');
            return;
        }

        setError(null);
        setSelectedFile(file);

        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async e => {
        e.preventDefault();

        setLoading(true);

        try {
            let eventImageUrl = null;

            if (selectedFile) {
                const data = await uploadFile(selectedFile, 'event');
                eventImageUrl = data.url;
            }

            const payload = {
                userId: Number(userId),
                locationId: Number(form.locationId),
                name: form.name,
                description: form.description,
                eventDate: form.eventDate,
                type: Number(form.type),
                image: eventImageUrl || "https://picsum.photos/200/300"
            };
            console.log('Payload de evento: (este mensaje es solo para probar y debe ser comentado luego)', payload)

            await createEvent(payload);

            showAlert('Evento creado correctamente!', 'success');

            setForm({
                name: '',
                eventDate: '',
                type: '',
                description: '',
                provinceId: '',
                locationId: '',
                image: ''
            });

            setSelectedFile(null);
            setPreview(null);

        } catch (err) {
            console.error('Error: ', err);
            showAlert('Hubo un problema al intentar crear el evento, por favor intentalo más tarde!', 'warning');

        } finally {
            setLoading(false);
        }
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
                                type="datetime-local"
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
                            <Typography variant="subtitle1">Foto de Evento</Typography>
                            {preview && (
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'contain',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </Box>
                            )}
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="contained-button-file"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="contained-button-file">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                >
                                    Seleccionar Imagen
                                </Button>
                            </label>
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