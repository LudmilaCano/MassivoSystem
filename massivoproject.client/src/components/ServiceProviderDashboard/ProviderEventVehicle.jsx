import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { getEventVehiclesByUserId } from '../api/EventEndpoints';
import useSwalAlert from '../hooks/useSwalAlert';
import Colors from '../layout/Colors';

const ProviderEventVehicle = ({ userId }) => {
  const [eventVehicles, setEventVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventVehicle, setSelectedEventVehicle] = useState(null);
  const { showAlert } = useSwalAlert();
  const [formData, setFormData] = useState({
    id: null,
    price: '',
    departureTime: '',
    departureLocation: '',
    arrivalLocation: '',
    availableSeats: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEventVehicles();
  }, [userId]);

  const fetchEventVehicles = async () => {
    try {
      setLoading(true);
      const data = await getEventVehiclesByUserId(userId);
      setEventVehicles(data);
    } catch (error) {
      console.error('Error fetching event vehicles:', error);
      showAlert('Error al cargar los viajes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (eventVehicle) => {
    setSelectedEventVehicle(eventVehicle);
    setFormData({
      id: eventVehicle.id,
      price: eventVehicle.price,
      departureTime: formatDateTimeForInput(eventVehicle.departureTime) || '',
      departureLocation: eventVehicle.departureLocation || '',
      arrivalLocation: eventVehicle.arrivalLocation || '',
      availableSeats: eventVehicle.availableSeats,
    });
    setOpenDialog(true);
  };

  const formatDateTimeForInput = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.price) {
      newErrors.price = 'El precio es requerido';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'El precio debe ser un número mayor a 0';
    }

    if (!formData.departureTime) {
      newErrors.departureTime = 'La fecha y hora de salida son requeridas';
    }

    if (!formData.departureLocation?.trim()) {
      newErrors.departureLocation = 'La ubicación de salida es requerida';
    }

    if (!formData.arrivalLocation?.trim()) {
      newErrors.arrivalLocation = 'La ubicación de llegada es requerida';
    }

    if (!formData.availableSeats) {
      newErrors.availableSeats = 'Los asientos disponibles son requeridos';
    } else if (isNaN(formData.availableSeats) || Number(formData.availableSeats) < 0) {
      newErrors.availableSeats = 'Los asientos disponibles deben ser un número mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          id: formData.id,
          price: Number(formData.price),
          departureTime: formData.departureTime,
          departureLocation: formData.departureLocation,
          arrivalLocation: formData.arrivalLocation,
          availableSeats: Number(formData.availableSeats),
        };

        // Aquí deberías tener un endpoint para actualizar el EventVehicle
        // await updateEventVehicle(payload.id, payload);
        showAlert('Viaje actualizado correctamente', 'success');
        setOpenDialog(false);
        fetchEventVehicles();
      } catch (error) {
        console.error('Error updating event vehicle:', error);
        showAlert('Error al actualizar el viaje', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEventVehicle(null);
  };

  if (loading) {
    return <Typography>Cargando viajes...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mis Viajes
      </Typography>

      {eventVehicles.length === 0 ? (
        <Typography>No tienes viajes registrados.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: Colors.grisClaro }}>
                <TableCell>Evento</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Fecha y Hora de Salida</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Destino</TableCell>
                <TableCell>Asientos Disponibles</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventVehicles.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell>{ev.event?.name}</TableCell>
                  <TableCell>{ev.vehicle?.licensePlate}</TableCell>
                  <TableCell>${ev.price}</TableCell>
                  <TableCell>{new Date(ev.departureTime).toLocaleString()}</TableCell>
                  <TableCell>{ev.departureLocation}</TableCell>
                  <TableCell>{ev.arrivalLocation}</TableCell>
                  <TableCell>{ev.availableSeats}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Edit />}
                      size="small"
                      onClick={() => handleEditClick(ev)}
                      sx={{ color: Colors.azul }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Editar Viaje</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="price"
                label="Precio"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleChange}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="availableSeats"
                label="Asientos Disponibles"
                type="number"
                fullWidth
                value={formData.availableSeats}
                onChange={handleChange}
                error={!!errors.availableSeats}
                helperText={errors.availableSeats}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="departureTime"
                label="Fecha y Hora de Salida"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.departureTime}
                onChange={handleChange}
                error={!!errors.departureTime}
                helperText={errors.departureTime}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="departureLocation"
                label="Ubicación de Salida"
                fullWidth
                value={formData.departureLocation}
                onChange={handleChange}
                error={!!errors.departureLocation}
                helperText={errors.departureLocation}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="arrivalLocation"
                label="Ubicación de Llegada"
                fullWidth
                value={formData.arrivalLocation}
                onChange={handleChange}
                error={!!errors.arrivalLocation}
                helperText={errors.arrivalLocation}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: Colors.azul, '&:hover': { bgcolor: Colors.azulOscuro } }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderEventVehicle;
