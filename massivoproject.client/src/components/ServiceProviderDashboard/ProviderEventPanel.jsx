// src/components/ServiceProviderDashboard/ProviderEventPanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Autocomplete, Grid, CircularProgress
} from '@mui/material';
 
import { adminUpdateEvent } from '../../api/EventEndpoints';
import { getAllCities, getCityById } from '../../api/CityEndpoints';
import { getEventsByUserId } from '../../api/EventEndpoints';
import Swal from 'sweetalert2';
import useSwalAlert from '../../hooks/useSwalAlert';
import { getAllProvince } from '../../api/ProvinceEndpoints';
import { getCitiesByProvince } from '../../api/CityEndpoints';

const ProviderEventPanel = ({ userId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [citiesByProvince, setCitiesByProvince] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const { showAlert } = useSwalAlert();

  useEffect(() => {
    fetchEvents();
    fetchProvinces();
  }, [userId]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEventsByUserId(userId);
      setEvents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching events:', error);
      showAlert('Error al cargar los eventos', 'error');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const provincesData = await getAllProvince();
      // Asegurarse de que provincesData.result sea un array
      setProvinces(provincesData?.result || []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      showAlert("Error al cargar las provincias", "error");
      setProvinces([]);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const citiesData = await getAllCities();
        setCities(Array.isArray(citiesData) ? citiesData : []);
      } catch (error) {
        console.error("Error fetching cities:", error);
        showAlert("Error al cargar las ciudades", "error");
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  useEffect(() => {
    const fetchCitiesByProvince = async () => {
      if (selectedProvince) {
        try {
          const citiesData = await getCitiesByProvince(selectedProvince);
          const citiesArray = Array.isArray(citiesData) ? citiesData : [];
          setCitiesByProvince(citiesArray);
          
          // Si hay una ciudad seleccionada y pertenece a esta provincia, mantenerla
          if (selectedCity && selectedCity.provinceId === selectedProvince) {
            // Verificar si la ciudad ya está en la lista
            const cityExists = citiesArray.some(city => city.id === selectedCity.id);
            if (!cityExists) {
              // Si no está, añadirla
              setCitiesByProvince([...citiesArray, selectedCity]);
            }
          }
        } catch (error) {
          console.error("Error fetching cities by province:", error);
          showAlert("Error al cargar las ciudades de la provincia", "error");
          setCitiesByProvince([]);
        }
      } else {
        setCitiesByProvince([]);
      }
    };

    fetchCitiesByProvince();
  }, [selectedProvince, selectedCity]);

  const handleEditEvent = async (event) => {
    setDialogLoading(true);
    setSelectedEvent({...event});
    setErrors({});
    
    try {
      // Primero, abrir el diálogo para mostrar que está cargando
      setOpenDialog(true);
      
      // Si el evento tiene una ciudad, buscar sus detalles
      if (event.locationId) {
        // Obtener detalles de la ciudad
        const cityData = await getCityById(event.locationId);
        console.log("Ciudad obtenida:", cityData);
        
        if (cityData) {
          // Guardar la ciudad seleccionada
          setSelectedCity(cityData);
          
          // Si la ciudad tiene provincia, establecerla
          if (cityData.provinceId) {
            setSelectedProvince(cityData.provinceId);
            
            // Cargar las ciudades de esa provincia
            const citiesData = await getCitiesByProvince(cityData.provinceId);
            const citiesArray = Array.isArray(citiesData) ? citiesData : [];
            
            // Verificar si la ciudad actual está en la lista
            const cityExists = citiesArray.some(city => city.id === cityData.id);
            
            // Si la ciudad no está en la lista, añadirla
            if (!cityExists) {
              setCitiesByProvince([...citiesArray, cityData]);
            } else {
              setCitiesByProvince(citiesArray);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al preparar el formulario:", error);
      showAlert("Error al cargar los datos del evento", "error");
    } finally {
      setDialogLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario modifica el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleProvinceChange = async (event) => {
    const provinceId = event.target.value;
    setSelectedProvince(provinceId);
    
    // Resetear la ciudad seleccionada cuando cambia la provincia
    setSelectedCity(null);
    setSelectedEvent(prev => ({
      ...prev,
      locationId: null,
      location: null
    }));
    
    try {
      const citiesData = await getCitiesByProvince(provinceId);
      setCitiesByProvince(Array.isArray(citiesData) ? citiesData : []);
    } catch (error) {
      console.error("Error fetching cities by province:", error);
      showAlert("Error al cargar las ciudades de la provincia", "error");
      setCitiesByProvince([]);
    }
  };

  const handleCityChange = (event, newValue) => {
    setSelectedCity(newValue);
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
    if (!selectedProvince) newErrors.provinceId = "La provincia es obligatoria";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEvent = async () => {
    if (!validateForm()) {
      showAlert("Por favor complete todos los campos obligatorios", "error");
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
      showAlert("Evento actualizado correctamente", "success");
    
      fetchEvents();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating event:", error);
      showAlert("Error al actualizar el evento", "error");
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
    setSelectedProvince(null);
    setSelectedCity(null);
    setCitiesByProvince([]);
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
          {dialogLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedEvent && (
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
                  value={selectedEvent.type !== undefined ? selectedEvent.type : ''}
                  onChange={handleInputChange}
                  label="Tipo *"
                >
                  <MenuItem value={0}>Concierto</MenuItem>
                  <MenuItem value={1}>Deportivo</MenuItem>
                  <MenuItem value={2}>Festival</MenuItem>
                  <MenuItem value={3}>Conferencia</MenuItem>
                  <MenuItem value={4}>Otro</MenuItem>
                </Select>
                {errors.type && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.type}</Box>}
              </FormControl>

              {/* Provincia y Ciudad */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.provinceId}>
                    <InputLabel>Provincia *</InputLabel>
                    <Select
                      value={selectedProvince || ''}
                      onChange={handleProvinceChange}
                      label="Provincia *"
                    >
                      {Array.isArray(provinces) && provinces.map((province) => (
                        <MenuItem key={province.id} value={province.id}>
                          {province.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.provinceId && <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 0.5 }}>{errors.provinceId}</Box>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={citiesByProvince}
                    getOptionLabel={(option) => option.name || ''}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedProvince}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ciudad *"
                        required
                        error={!!errors.locationId}
                        helperText={errors.locationId}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <TextField
                label="URL de Imagen *"
                name="image"
                value={selectedEvent.image || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.image}
                helperText={errors.image}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSaveEvent} 
            variant="contained" 
            color="primary"
            disabled={dialogLoading}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProviderEventPanel;
