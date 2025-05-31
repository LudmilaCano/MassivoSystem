import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
    Paper
} from '@mui/material';

import imagenEjemplo from '../images/logo2.png';
import { getRandomEvents, filterEvents } from '../api/EventEndpoints';
import { getEventTypeLabel } from '../constants/eventCategories';

const Home = () => {

    const [events, setEvents] = useState([]);
    const [people, setPeople] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const handlePeopleChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setPeople(value);
        }
    };

    const handleFilter = async () => {
        try {
            const data = await filterEvents(searchName, searchDate);
            setEvents(data);
        } catch (error) {
            console.error('Error filtrando eventos:', error);
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getRandomEvents(4);
                setEvents(data);
            } catch (error) {
                console.error('Error fetching random events:', error);
            }
        };
        fetchEvents();
    }, []);
    console.log(events);
    const features = [
        { icon: '✅🚗', label: 'Viajá seguro', shadowColor: 'rgba(255, 69, 0, 0.5)' },
        { icon: '💸', label: 'Viajá barato', shadowColor: 'rgba(30, 144, 255, 0.5)' },
        { icon: '📍🌍', label: 'Viajá donde sea', shadowColor: 'rgba(34, 139, 34, 0.5)' },
    ];

    return (
        <Box sx={{ px: 8, py: 2, maxHeight: '70vh', }}>
            {/* Header */}
            <Typography variant="h5" fontWeight="bold" textAlign="center">
                Compartí tu viaje, compartí la experiencia
            </Typography>

            {/* Search Bar */}
            <Paper
                elevation={3}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 3,
                    mx: 6,
                    p: 2,
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                <TextField
                    variant="standard"
                    placeholder="¿Qué evento buscas?"
                    fullWidth
                    onChange={e => setSearchName(e.target.value)}
                    sx={{ flex: 2, minWidth: 120, px: 2 }}
                />
                <TextField
                    variant="standard"
                    type="date"
                    fullWidth
                    onChange={e => setSearchDate(e.target.value)}
                    sx={{ flex: 1, px: 2 }}
                />
                {/* <TextField
                    label="Cantidad de personas"
                    type="text"
                    variant="standard"
                    value={people}
                    onChange={handlePeopleChange}
                    inputProps={{
                        inputMode: 'numeric',
                        pattern: '[0-9]*',
                        min: 1,
                    }}
                    sx={{ minWidth: 150 }}
                /> */}
                <Button
                    variant="contained"
                    sx={{ backgroundColor: '#139AA0', minWidth: 100, px: 2 }}
                    onClick={handleFilter}
                >
                    Buscar
                </Button>
            </Paper>

            <Grid container spacing={3} justifyContent="center" sx={{ my: 5, px: 8 }}>
                {features.map((item, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Paper
                            sx={{
                                width: '30vh',
                                height: '30vh',
                                borderRadius: '50%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mx: 'auto',
                                textAlign: 'center',
                                p: 2,
                                boxShadow: `0 0 20px ${item.shadowColor}`,
                            }}
                        >
                            <Typography fontSize={40}>{item.icon}</Typography>
                            <Typography fontWeight="bold">{item.label}</Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Event Cards */}
            <Grid container spacing={4} justifyContent="center">
                {events.map((event, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Paper elevation={4} sx={{p: 2, m: 2}}>
                            <Box
                                component="img"
                                src={imagenEjemplo} 
                                alt={event.title}
                                sx={{ width: '100%', height: 200, objectFit: 'contain', p: 2 }}
                            />
                            <Box sx={{ p: 2 }}>
                                <Typography variant="h6" fontWeight="bold">
                                    {event.name}
                                </Typography>
                                <Typography variant="body2">
                                  Fecha :   {formatDate(event.eventDate)}
                                </Typography>
                                <Typography variant="body2">Lugar : {event.location}</Typography>
                                <Typography sx={{ mt: 1 }}>
                                    <strong>{event.price}</strong> $999 por persona
                                </Typography>
                                <Typography variant="body2">
                                    Categoría : {getEventTypeLabel(event.type)}
                                </Typography>
                                <Typography variant="body2">{event.date}</Typography>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ mt: 2, backgroundColor: '#139AA0' }}
                                >
                                    Buscar vehículo
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Home;
