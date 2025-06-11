import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
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
import { getEventsByUserId, updateEvent } from '../api/EventEndpoints';
import useSwalAlert from '../hooks/useSwalAlert';
import Colors from '../layout/Colors';
import { EVENT_CATEGORIES } from '../constants/eventCategories';

const ProviderEventPanel = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { showAlert } = useSwalAlert();
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    category: '',
    imagePath: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEventsByUserId(userId);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      showAlert('Error al cargar los eventos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setFormData({
      id: event.id,
      name: event.name || '',
      description: event.description || '',
      startDate: formatDateForInput(event.startDate) || '',
      endDate: formatDateForInput(event.endDate) || '',
      location: event.location || '',
      category: event.category,
      imagePath: event.imagePath || '',
    });
    setOpenDialog(true);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
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

    if (!formData.name?.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de fin es requerida';
    } else if (new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    if (!formData.location?.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          id: formData.id,
          userId: Number(userId),
          name: formData.name,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          location: formData.location,
          category: Number(formData.category),
          imagePath: formData.imagePath || 'https://picsum.photos/200/300',
        };

        await updateEvent(payload.id, payload);
        showAlert('Evento actualizado correctamente', 'success');
        setOpenDialog(false);
        fetchEvents();
      } catch (error) {
        console.error('Error updating event:', error);
        showAlert('Error al actualizar el evento', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return <Typography>Cargando eventos...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mis Eventos
      </Typography>

      {events.length === 0 ? (
        <Typography>No tienes eventos registrados.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: Colors.grisClaro }}>
                <TableCell>Nombre</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Fecha Inicio</TableCell>
                <TableCell>Fecha Fin</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.location}</TableCell>
                  <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(event.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {EVENT_CATEGORIES.find((cat) => cat.value === event.category)?.label || 'Desconocida'}
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Edit />}
                      size="small"
                      onClick={() => handleEditClick(event)}
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
        <DialogTitle>Editar Evento</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nombre del Evento"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="location"
                label="Ubicación"
                fullWidth
                value={formData.location}
                onChange={handleChange}
                error={!!errors.location}
                helperText={errors.location}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="startDate"
                label="Fecha de Inicio"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="endDate"
                label="Fecha de Fin"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="category"
                select
                label="Categoría"
                fullWidth
                value={formData.category}
                onChange={handleChange}
              >
                {EVENT_CATEGORIES.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
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

export default ProviderEventPanel;
