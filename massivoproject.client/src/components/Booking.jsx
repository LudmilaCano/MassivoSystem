import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, MenuItem, Grid
} from '@mui/material';
import Logo2 from '../images/logo2.png';
import bookingIllustration from '../images/booking.svg';
import Colors from '../layout/Colors';
import { useNavigate } from 'react-router';
import useSwalAlert from '../hooks/useSwalAlert';

const paymentMethods = ['Tarjeta de Crédito', 'Mercado Pago', 'Efectivo'];

const Booking = () => {
  const event = {
    name: 'Recital Los Piojos',
    eventDate: '2025-08-15',
    location: 'Buenos Aires',
  };

  const vehicle = {
    type: 'Mercedes Sprinter',
    seats: 15,
  };

  const [formData, setFormData] = useState({
    travelers: '',
    paymentMethod: '',
  });

  const [errors, setErrors] = useState({});
  const { showAlert } = useSwalAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { travelers, paymentMethod } = formData;

    if (!travelers) {
      newErrors.travelers = 'Debe indicar cuántas personas viajan.';
    } else if (isNaN(travelers) || travelers < 1 || travelers > vehicle.seats) {
      newErrors.travelers = `No puede excederse la capacidad máxima.`;
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = 'Debe seleccionar un método de pago.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const bookingData = {
        ...formData,
        event,
        vehicle,
      };

      console.log("Datos de la reserva:", bookingData);
      showAlert('¡Reserva realizada con éxito!', 'success');
      navigate('/');
    }
  };

  return (
    <div style={{ backgroundColor: Colors.azul, width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container sx={{ maxHeight: '90vh', maxWidth: '70vw' }}>
        <Grid
          item
          xs={false}
          md={5}
          sx={{
            backgroundImage: `url(${bookingIllustration})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} md={7} component={Paper} elevation={6} square>
          <Box sx={{ mt: 4, mb: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box component="img" src={Logo2} alt="Logo" sx={{ width: { xs: '30vw', md: '10vw' }, mb: '3vh' }} />
            <Typography variant="h4" gutterBottom>Completar Reserva</Typography>

            {/* Info del evento */}
            <Box sx={{ width: '95%', mb: 2 }}>
              <Typography variant="subtitle1"><strong>Evento:</strong> {event.name}</Typography>
              <Typography variant="subtitle1"><strong>Fecha:</strong> {event.eventDate}</Typography>
              <Typography variant="subtitle1"><strong>Lugar:</strong> {event.location}</Typography>
            </Box>

            <Box sx={{ width: '95%', mb: 2 }}>
              <Typography variant="subtitle1"><strong>Vehículo:</strong> {vehicle.type}</Typography>
              <Typography variant="subtitle1"><strong>Capacidad máxima:</strong> {vehicle.seats} personas</Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, width: '95%' }}>
              <TextField
                name="travelers"
                label="Cantidad de pasajeros"
                type="number"
                size="small"
                fullWidth
                sx={textFieldStyle}
                value={formData.travelers}
                onChange={handleChange}
                error={!!errors.travelers}
                helperText={errors.travelers}
              />

              <TextField
                name="paymentMethod"
                select
                label="Método de pago"
                size="small"
                fullWidth
                value={formData.paymentMethod}
                onChange={handleChange}
                error={!!errors.paymentMethod}
                helperText={errors.paymentMethod}
                sx={textFieldStyle}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                mt: 3,
                mb: 2,
                width: '95%',
                backgroundColor: '#139AA0',
              }}
            >
              CONFIRMAR RESERVA
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

const textFieldStyle = {
  '& label.Mui-focused': { color: '#139AA0' },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': { borderColor: '#139AA0' },
  },
  width: { xs: '50vw', md: '20vw' },
};

export default Booking;
