// src/components/AdminEventPanel.jsx
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Autocomplete, Typography, CircularProgress
} from '@mui/material';
import { adminUpdateEvent, toggleEventStatus } from '../../api/EventEndpoints';
import { getAllCities } from '../../api/CityEndpoints';
import Swal from 'sweetalert2';
import { uploadFile } from '../../api/FileEndpoints'


const AdminEventPanel = ({ events, onRefresh, showSuccessAlert, showErrorAlert }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

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

  /* const handleEditEvent = (event) => {
    setSelectedEvent({ ...event });
    setErrors({});
    setOpenDialog(true);
  }; */

  const handleEditEvent = async (event) => {
    if (cities.length === 0) {
      setLoading(true);
      const citiesData = await getAllCities();
      setCities(citiesData);
      setLoading(false);
    }

    // Buscar el id de la ciudad por el nombre (location)
    let locationId = event.locationId;
    if (!locationId && event.location && Array.isArray(cities)) {
      const city = cities.find(c => c.name === event.location);
      locationId = city ? city.id : '';
    }

    setSelectedEvent({ ...event, locationId });
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

  /* const handleSaveEvent = async () => {
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
  }; */

  const handleSaveEvent = async () => {
    if (!validateForm()) {
      showErrorAlert("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = selectedEvent.image;

      if (selectedFile) {
        const { url } = await uploadFile(selectedFile, 'event');
        imageUrl = url;
      }

      const eventData = {
        eventId: selectedEvent.eventId,
        name: selectedEvent.name,
        description: selectedEvent.description,
        eventDate: selectedEvent.eventDate,
        type: parseInt(selectedEvent.type),
        locationId: parseInt(selectedEvent.locationId),
        image: imageUrl,
        userId: selectedEvent.userId
      };

      await adminUpdateEvent(selectedEvent.eventId, eventData);
      showSuccessAlert("Evento actualizado correctamente");
      onRefresh();
      handleCloseDialog();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating event:", error);
      showErrorAlert(`Error al actualizar evento: ${error.message}`);
    } finally {
      setLoading(false);
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
    setErrors({});
  };

  const handleToggleStatus = async (eventId) => {
    try {
      await toggleEventStatus(eventId);
      showSuccessAlert("Estado del evento actualizado correctamente");
      onRefresh();
    } catch (error) {
      console.error("Error updating event status:", error);
      showErrorAlert(`Error al actualizar estado del evento: ${error.message}`);
    }
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
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleToggleStatus(event.eventId)}
                    sx={{ mr: 1, ml: 1 }}
                  >
                    {event.isActive == 0 ? "Desactivar" : "Activar"}
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
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Imagen del Evento</Typography>

                {/* Vista previa de la imagen */}
                {(selectedEvent.image || selectedFile) && (
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img
                      src={selectedFile ? URL.createObjectURL(selectedFile) : selectedEvent.image}
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
                      setSelectedFile(file);
                    }
                  }}
                />
                <label htmlFor="event-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                  >
                    Seleccionar Imagen
                  </Button>
                </label>
              </Box>
              {/*  <TextField
                label="URL de imagen *"
                name="image"
                value={selectedEvent.image || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.image}
                helperText={errors.image}
              /> */}
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.name || ''}
                value={
                  cities.find(
                    city => String(city.id) === String(selectedEvent.locationId)
                  ) || null
                }
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
