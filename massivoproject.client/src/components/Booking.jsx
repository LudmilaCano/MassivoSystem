import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, MenuItem, Grid
} from '@mui/material';
import Logo2 from '../images/logo2.png';
import bookingIllustration from '../images/booking.svg';
import Colors from '../layout/Colors';
import { useNavigate, useLocation } from 'react-router';
import useSwalAlert from '../hooks/useSwalAlert';
import { createBooking } from '../api/BookingEndpoints';
import { PAYMENT_TYPE_ENUM, PAYMENT_TYPE_LABELS, PAYMENT_TYPE_ICONS } from '../constants/paymentsTypes'
import { BOOKING_TYPE, BOOKING_LABEL } from '../constants/bookingStatus'
import { useSelector } from 'react-redux';

const Booking = () => {
  const [errors, setErrors] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentSelected, setPaymentSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const { showAlert } = useSwalAlert();
  const navigate = useNavigate();
  const location = useLocation();
  const { eventVehicle, destination } = location.state;
  const userId = useSelector((state) => state.auth.userId);

  const [formData, setFormData] = useState({
    travelers: '',
    paymentMethod: {},
  });

  useEffect(() => {
    setPaymentMethods(Object.keys(PAYMENT_TYPE_ENUM).map((key) => ({
      value: PAYMENT_TYPE_ENUM[key],
      label: PAYMENT_TYPE_LABELS[key],
      icon: PAYMENT_TYPE_ICONS[key],
    })))
  }, [])

  useEffect(() => {
    if (paymentMethods.length > 0) {
      setPaymentSelected(paymentMethods[0].value);
      setFormData(prev => ({ ...prev, paymentMethod: paymentMethods[0].value }));
    }
  }, [paymentMethods]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    console.log("payment change: ", e.target);
  };

  const validateForm = () => {
    const newErrors = {};
    const { travelers, paymentMethod } = formData;

    if (!travelers) {
      newErrors.travelers = 'Debe indicar cuántas personas viajan.';
    } else if (isNaN(travelers) || travelers < 1) { //|| travelers > vehicle.seats
      newErrors.travelers = `No puede excederse la capacidad máxima.`;
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {

      setLoading(true);
      try {
        const payload = {
          userId: Number(userId),
          eventId: Number(eventVehicle.eventId),
          licensePlate: eventVehicle.licensePlate,
          payment: {paymentMethod: Number(formData.paymentMethod), amount: Number(eventVehicle.price) * Number(formData.travelers)},
          seatNumber: Number(formData.travelers),
        };

        console.log("payload: ", payload);

        await createBooking(payload);
        showAlert('Reserva creada con éxito', 'success');
        navigate('/');

      } catch (err) {
        console.log("Error: ", err);
        showAlert('Error al crear la reserva', 'error');
      }
      setLoading(false);

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
              <Typography variant="subtitle1"><strong>Evento:</strong> {eventVehicle.description}</Typography>
              <Typography variant="subtitle1"><strong>Fecha:</strong> {new Date(eventVehicle.date).toLocaleDateString('es-ES')}</Typography>
              <Typography variant="subtitle1"><strong>Lugar:</strong> {eventVehicle.from}</Typography>
            </Box>

            {/* Info del vehículo */}
            <Box sx={{ width: '95%', mb: 2 }}>
              <Typography variant="subtitle1"><strong>Vehículo:</strong> {eventVehicle.vehicleType}</Typography>
              {eventVehicle.available && <Typography variant="subtitle1"><strong>Capacidad máxima:</strong> {eventVehicle.available} {eventVehicle.available == 1 ? "persona" : "personas"}</Typography>}
            </Box>

            {/* Formulario */}
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
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
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
              disabled={loading}
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
