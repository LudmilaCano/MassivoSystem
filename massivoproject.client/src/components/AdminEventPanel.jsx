// src/components/AdminEventPanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Autocomplete
} from '@mui/material';
import { adminUpdateEvent } from '../api/EventEndpoints';
import { getAllCities } from '../api/CityEndpoints';
import Swal from 'sweetalert2';

const AdminEventPanel = ({ events, onRefresh, showSuccessAlert, showErrorAlert }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const citiesData = await getAllCities();
        setCities(citiesData);
      } catch (error) {
        console.error("Error fetching cities:", error);
        showErrorAlert("Error al cargar las ciudades");
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  const handleEditEvent = (event) => {
    setSelectedEvent({...event});
    setErrors({});
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario modifica el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCityChange = (event, newValue) => {
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEvent = async () => {
    if (!validateForm()) {
      showErrorAlert("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      const eventData = {
        eventId: selectedEvent.eventId,
        name: selectedEvent.name,
        description: selectedEvent.description,
        eventDate: selectedEvent.eventDate,
        type: parseInt(selectedEvent.type),
        image: selectedEvent.image,
        locationId: selectedEvent.locationId,
        userId: selectedEvent.userId
      };

      await adminUpdateEvent(selectedEvent.eventId, eventData);
      showSuccessAlert("Evento actualizado correctamente");
      onRefresh();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating event:", error);
      showErrorAlert(`Error al actualizar evento: ${error.message}`);
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
      case 0: return 'Concierto';
      case 1: return 'Deportivo';
      case 2: return 'Festival';
      case 3: return 'Conferencia';
      case 4: return 'Otro';
      default: return 'Desconocido';
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
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
            {events.map((event) => (
              <TableRow key={event.eventId}>
                <TableCell>{event.eventId}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.location}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Evento</DialogTitle>
        <DialogContent>
          {selectedEvent && (
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
                  value={selectedEvent.type || ''}
                  onChange={handleInputChange}
                  label="Tipo *"
                >
                  <MenuItem value={0}>Concierto</MenuItem>
                  <MenuItem value={1}>Deportivo</MenuItem>
                  <MenuItem value={2}>Festival</MenuItem>
                  <MenuItem value={3}>Conferencia</MenuItem>
                  <MenuItem value={4}>Otro</MenuItem>
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>
              <TextField
                label="URL de imagen *"
                name="image"
                value={selectedEvent.image || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.image}
                helperText={errors.image}
              />
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.name || ''}
                value={cities.find(city => city.id === selectedEvent.locationId) || null}
                onChange={handleCityChange}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ciudad *"
                    fullWidth
                    required
                    error={!!errors.locationId}
                    helperText={errors.locationId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveEvent} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminEventPanel;
