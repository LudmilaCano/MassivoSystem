import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Autocomplete,
  Tabs,
  Tab
} from '@mui/material';
import { createEvent } from '../../api/EventEndpoints';
import { createUser } from '../../api/UserEndpoints';
import { getAllProvince } from '../../api/ProvinceEndpoints';
import { getCitiesByProvince } from '../../api/CityEndpoints';
import useSwalAlert from '../../hooks/useSwalAlert';
import Colors from '../../layout/Colors';

// TabPanel component for switching between user and event creation forms
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const AdminCreatePanel = ({ open, onClose, onSuccess }) => {
  const [tabValue, setTabValue] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useSwalAlert();

  // User form state
  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    identificationNumber: '',
    birthDate: '',
    cityId: null,
    provinceId: null,
    role: ''
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    eventDate: '',
    type: '',
    locationId: null,
    image: 'https://picsum.photos/200/300',
    userId: 1 // Default admin user ID
  });

  // Form errors
  const [userErrors, setUserErrors] = useState({});
  const [eventErrors, setEventErrors] = useState({});

  // Selected province for each form
  const [userProvince, setUserProvince] = useState(null);
  const [eventProvince, setEventProvince] = useState(null);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const provincesData = await getAllProvince();
      setProvinces(provincesData?.result || []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
      showAlert("Error al cargar las provincias", "error");
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // User form handlers
  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
    
    if (userErrors[name]) {
      setUserErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleUserProvinceChange = async (event) => {
    const provinceId = event.target.value;
    setUserProvince(provinceId);
    setUserForm(prev => ({ ...prev, provinceId, cityId: null }));
    
    try {
      const citiesData = await getCitiesByProvince(provinceId);
      setCities(Array.isArray(citiesData) ? citiesData : []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      showAlert("Error al cargar las ciudades", "error");
      setCities([]);
    }
    
    if (userErrors.provinceId) {
      setUserErrors(prev => ({ ...prev, provinceId: null }));
    }
  };

  const handleUserCityChange = (event) => {
    const cityId = event.target.value;
    setUserForm(prev => ({ ...prev, cityId }));
    
    if (userErrors.cityId) {
      setUserErrors(prev => ({ ...prev, cityId: null }));
    }
  };

  const validateUserForm = () => {
    const newErrors = {};
    
    if (!userForm.firstName) newErrors.firstName = "El nombre es obligatorio";
    if (!userForm.lastName) newErrors.lastName = "El apellido es obligatorio";
    if (!userForm.email) newErrors.email = "El email es obligatorio";
    if (!userForm.password) newErrors.password = "La contraseña es obligatoria";
    if (!userForm.identificationNumber) newErrors.identificationNumber = "El DNI es obligatorio";
    if (!userForm.birthDate) newErrors.birthDate = "La fecha de nacimiento es obligatoria";
    if (!userForm.provinceId) newErrors.provinceId = "La provincia es obligatoria";
    if (!userForm.cityId) newErrors.cityId = "La ciudad es obligatoria";
    if (!userForm.role) newErrors.role = "El rol es obligatorio";
    
    // Validación de email
    if (userForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      newErrors.email = "El formato del email no es válido";
    }
    
    // Validación de contraseña
    if (userForm.password && userForm.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setUserErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateUserForm()) {
      showAlert("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    try {
      setLoading(true);
      const userData = {
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        email: userForm.email,
        password: userForm.password,
        identificationNumber: userForm.identificationNumber,
        birthDate: userForm.birthDate,
        cityId: parseInt(userForm.cityId),
        provinceId: parseInt(userForm.provinceId),
        role: userForm.role
      };

      await createUser(userData);
      showAlert("Usuario creado correctamente", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating user:", error);
      showAlert("Error al crear el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  // Event form handlers
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventForm(prev => ({ ...prev, [name]: value }));
    
    if (eventErrors[name]) {
      setEventErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleEventProvinceChange = async (event) => {
    const provinceId = event.target.value;
    setEventProvince(provinceId);
    setEventForm(prev => ({ ...prev, locationId: null }));
    
    try {
      const citiesData = await getCitiesByProvince(provinceId);
      setCities(Array.isArray(citiesData) ? citiesData : []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      showAlert("Error al cargar las ciudades", "error");
      setCities([]);
    }
  };

  const handleEventCityChange = (event, newValue) => {
    setEventForm(prev => ({
      ...prev,
      locationId: newValue ? newValue.id : null
    }));
    
    if (eventErrors.locationId) {
      setEventErrors(prev => ({ ...prev, locationId: null }));
    }
  };

  const validateEventForm = () => {
    const newErrors = {};
    
    if (!eventForm.name) newErrors.name = "El nombre es obligatorio";
    if (!eventForm.description) newErrors.description = "La descripción es obligatoria";
    if (!eventForm.eventDate) newErrors.eventDate = "La fecha es obligatoria";
    if (eventForm.type === undefined || eventForm.type === '') newErrors.type = "El tipo es obligatorio";
    if (!eventForm.locationId) newErrors.locationId = "La ciudad es obligatoria";
    if (!eventProvince) newErrors.provinceId = "La provincia es obligatoria";
    
    setEventErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateEvent = async () => {
    if (!validateEventForm()) {
      showAlert("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    try {
      setLoading(true);
      await createEvent(eventForm);
      showAlert("Evento creado correctamente", "success");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
      showAlert("Error al crear el evento", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Crear Nuevo</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Usuario" />
            <Tab label="Evento" />
          </Tabs>
        </Box>
        
        {/* User Creation Form */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre *"
                name="firstName"
                value={userForm.firstName}
                onChange={handleUserInputChange}
                fullWidth
                required
                error={!!userErrors.firstName}
                helperText={userErrors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Apellido *"
                name="lastName"
                value={userForm.lastName}
                onChange={handleUserInputChange}
                fullWidth
                required
                error={!!userErrors.lastName}
                helperText={userErrors.lastName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email *"
                name="email"
                type="email"
                value={userForm.email}
                onChange={handleUserInputChange}
                fullWidth
                required
                error={!!userErrors.email}
                helperText={userErrors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Contraseña *"
                name="password"
                type="password"
                value={userForm.password}
                onChange={handleUserInputChange}
                fullWidth
                required
                error={!!userErrors.password}
                helperText={userErrors.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="DNI *"
                name="identificationNumber"
                value={userForm.identificationNumber}
                onChange={handleUserInputChange}
                fullWidth
                required
                error={!!userErrors.identificationNumber}
                helperText={userErrors.identificationNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha de Nacimiento *"
                name="birthDate"
                type="date"
                value={userForm.birthDate}
                onChange={handleUserInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                error={!!userErrors.birthDate}
                helperText={userErrors.birthDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!userErrors.provinceId}>
                <InputLabel>Provincia *</InputLabel>
                <Select
                  name="provinceId"
                  value={userForm.provinceId || ''}
                  onChange={handleUserProvinceChange}
                  label="Provincia *"
                >
                  {Array.isArray(provinces) && provinces.map((province) => (
                    <MenuItem key={province.id} value={province.id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
                {userErrors.provinceId && <Typography color="error" variant="caption">{userErrors.provinceId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!userErrors.cityId} disabled={!userForm.provinceId}>
                <InputLabel>Ciudad *</InputLabel>
                <Select
                  name="cityId"
                  value={userForm.cityId || ''}
                  onChange={handleUserCityChange}
                  label="Ciudad *"
                >
                  {Array.isArray(cities) && cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {userErrors.cityId && <Typography color="error" variant="caption">{userErrors.cityId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!userErrors.role}>
                <InputLabel>Rol *</InputLabel>
                <Select
                  name="role"
                  value={userForm.role}
                  onChange={handleUserInputChange}
                  label="Rol *"
                >
                  <MenuItem value="Admin">Administrador</MenuItem>
                  <MenuItem value="Customer">Cliente</MenuItem>
                  <MenuItem value="ServiceProvider">Proveedor de Servicios</MenuItem>
                </Select>
                {userErrors.role && <Typography color="error" variant="caption">{userErrors.role}</Typography>}
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCreateUser} 
              variant="contained" 
              color="primary"
              disabled={loading}
              sx={{ bgcolor: Colors.azul, '&:hover': { bgcolor: Colors.azulOscuro } }}
            >
              Crear Usuario
            </Button>
          </Box>
        </TabPanel>
        
        {/* Event Creation Form */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nombre *"
                name="name"
                value={eventForm.name}
                onChange={handleEventInputChange}
                fullWidth
                required
                error={!!eventErrors.name}
                helperText={eventErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Fecha *"
                name="eventDate"
                type="datetime-local"
                value={eventForm.eventDate}
                onChange={handleEventInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                error={!!eventErrors.eventDate}
                helperText={eventErrors.eventDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!eventErrors.type}>
                <InputLabel>Tipo *</InputLabel>
                <Select
                  name="type"
                  value={eventForm.type}
                  onChange={handleEventInputChange}
                  label="Tipo *"
                >
                  <MenuItem value={0}>Concierto</MenuItem>
                  <MenuItem value={1}>Deportivo</MenuItem>
                  <MenuItem value={2}>Festival</MenuItem>
                  <MenuItem value={3}>Conferencia</MenuItem>
                  <MenuItem value={4}>Otro</MenuItem>
                </Select>
                {eventErrors.type && <Typography color="error" variant="caption">{eventErrors.type}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="URL de Imagen"
                name="image"
                value={eventForm.image}
                onChange={handleEventInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!eventErrors.provinceId}>
                <InputLabel>Provincia *</InputLabel>
                <Select
                  value={eventProvince || ''}
                  onChange={handleEventProvinceChange}
                  label="Provincia *"
                >
                  {Array.isArray(provinces) && provinces.map((province) => (
                    <MenuItem key={province.id} value={province.id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
                {eventErrors.provinceId && <Typography color="error" variant="caption">{eventErrors.provinceId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={cities}
                getOptionLabel={(option) => option.name || ''}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={cities.find(city => city.id === eventForm.locationId) || null}
                onChange={handleEventCityChange}
                disabled={!eventProvince}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ciudad *"
                    required
                    error={!!eventErrors.locationId}
                    helperText={eventErrors.locationId}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción *"
                name="description"
                value={eventForm.description}
                onChange={handleEventInputChange}
                fullWidth
                multiline
                rows={3}
                required
                error={!!eventErrors.description}
                helperText={eventErrors.description}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleCreateEvent} 
              variant="contained" 
              color="primary"
              disabled={loading}
              sx={{ bgcolor: Colors.azul, '&:hover': { bgcolor: Colors.azulOscuro } }}
            >
              Crear Evento
            </Button>
          </Box>
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCreatePanel;
