import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, MenuItem, Grid } from '@mui/material';
import { createEvent } from '../api/EventEndpoints';
import { EVENT_TYPE_LABELS } from '../constants/eventCategories';

const AddEvent = () => {
    const [form, setForm] = useState({
        name: '',
        location: '',
        eventDate: '',
        type: '',
        price: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            await createEvent(form);
            alert('Evento creado correctamente');
            setForm({ name: '', location: '', eventDate: '', type: '', price: '', description: '' });
        } catch (err) {
            alert('Error al crear evento');
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
                                label="Lugar"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                            />
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
                                {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                                    <MenuItem key={key} value={key}>{label}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Precio"
                                name="price"
                                type="number"
                                value={form.price}
                                onChange={handleChange}
                                fullWidth
                                required
                                variant="outlined"
                                inputProps={{ min: 0 }}
                            />
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