import React, { useState } from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid,
    InputLabel, MenuItem, Select, TextField, Typography, Autocomplete, Tabs, Tab, Container, Avatar
} from '@mui/material';
import { createEvent } from '../../api/EventEndpoints';
import { createUser } from '../../api/UserEndpoints';
import { useSelector, useDispatch } from "react-redux";

import useSwalAlert from '../../hooks/useSwalAlert';
import Colors from '../../layout/Colors';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EventIcon from '@mui/icons-material/Event';
import useProvinceCitySelector from '../../hooks/useProvinceCitySelector';

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
    const [loading, setLoading] = useState(false);
    const [userSelectedFile, setUserSelectedFile] = useState(null);
    const [eventSelectedFile, setEventSelectedFile] = useState(null);
    const auth = useSelector((state) => state.auth);
    const { showAlert } = useSwalAlert();

    // User form state
    const [userForm, setUserForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        identificationNumber: '',
        birthDate: '',
        cityId: '',
        provinceId: '',
        role: 'Customer'
    });

    // Event form state
    const [eventForm, setEventForm] = useState({
        name: '',
        description: '',
        eventDate: '',
        type: '',
        locationId: '',
        provinceId: '',
        image: 'https://picsum.photos/200/300',
        userId: 1
    });

    const [userErrors, setUserErrors] = useState({});
    const [eventErrors, setEventErrors] = useState({});

    // Hooks para selects
    const userProvinceCity = useProvinceCitySelector();
    const eventProvinceCity = useProvinceCitySelector();

    const handleTabChange = (event, newValue) => setTabValue(newValue);

    // User form handlers
    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setUserForm(prev => ({ ...prev, [name]: value }));
        if (userErrors[name]) setUserErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleUserProvinceChange = (e) => {
        const provinceId = e.target.value;
        setUserForm(prev => ({ ...prev, provinceId, cityId: '' }));
        userProvinceCity.handleProvinceChange(provinceId);
        if (userErrors.provinceId) setUserErrors(prev => ({ ...prev, provinceId: null }));
    };

    const handleUserCityChange = (e) => {
        const cityId = e.target.value;
        setUserForm(prev => ({ ...prev, cityId }));
        if (userErrors.cityId) setUserErrors(prev => ({ ...prev, cityId: null }));
    };

    const validateUserForm = () => {
        const newErrors = {};
        if (!userForm.firstName) newErrors.firstName = "El nombre es obligatorio";
        if (!userForm.lastName) newErrors.lastName = "El apellido es obligatorio";
        if (!userForm.email) newErrors.email = "El email es obligatorio";
        if (!userForm.password) newErrors.password = "La contraseña es obligatoria";
        if (!userForm.confirmPassword) newErrors.confirmPassword = "Confirmar contraseña es obligatorio";
        if (userForm.password !== userForm.confirmPassword) newErrors.confirmPassword = "Las contraseñas no coinciden";
        if (!userForm.identificationNumber) newErrors.identificationNumber = "El DNI es obligatorio";
        if (!userForm.birthDate) newErrors.birthDate = "La fecha de nacimiento es obligatoria";
        if (!userForm.provinceId) newErrors.provinceId = "La provincia es obligatoria";
        if (!userForm.cityId) newErrors.cityId = "La ciudad es obligatoria";
        if (!userForm.role) newErrors.role = "El rol es obligatorio";
        if (userForm.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) newErrors.email = "El formato del email no es válido";
        if (userForm.password && userForm.password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres";
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
            let profileImageUrl = null;
            if (userSelectedFile) {
                const formData = new FormData();
                formData.append('file', userSelectedFile);
                const response = await fetch('https://localhost:7089/api/File/upload/user', { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Error al subir la imagen');
                const data = await response.json();
                profileImageUrl = data.url;
            }
            const userData = {
                firstName: userForm.firstName,
                lastName: userForm.lastName,
                email: userForm.email,
                password: userForm.password,
                dniNumber: userForm.identificationNumber,
                birthDate: userForm.birthDate.toString().split('T')[0],
                city: parseInt(userForm.cityId),
                province: parseInt(userForm.provinceId),
                profileImage: profileImageUrl
            };
            await createUser(userData);
            showAlert("Usuario creado correctamente", "success");
            onSuccess();
            setUserForm({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                identificationNumber: '',
                birthDate: '',
                cityId: '',
                provinceId: '',
                role: 'Customer'
            });
            userProvinceCity.handleProvinceChange('');
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
        if (eventErrors[name]) setEventErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleEventProvinceChange = (e) => {
        const provinceId = e.target.value;
        setEventForm(prev => ({ ...prev, provinceId, locationId: '' }));
        eventProvinceCity.handleProvinceChange(provinceId);
        if (eventErrors.provinceId) setEventErrors(prev => ({ ...prev, provinceId: null }));
    };

    const handleEventCityChange = (event, newValue) => {
        setEventForm(prev => ({
            ...prev,
            locationId: newValue ? newValue.id : ''
        }));
        if (eventErrors.locationId) setEventErrors(prev => ({ ...prev, locationId: null }));
    };

    const validateEventForm = () => {
        const newErrors = {};
        if (!eventForm.name) newErrors.name = "El nombre es obligatorio";
        if (!eventForm.description) newErrors.description = "La descripción es obligatoria";
        if (!eventForm.eventDate) newErrors.eventDate = "La fecha es obligatoria";
        if (eventForm.type === undefined || eventForm.type === '') newErrors.type = "El tipo es obligatorio";
        if (!eventForm.locationId) newErrors.locationId = "La ciudad es obligatoria";
        if (!eventForm.provinceId) newErrors.provinceId = "La provincia es obligatoria";
        setEventErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateEvent = async e => {
        e.preventDefault();
        if (!validateEventForm()) {
            showAlert("Por favor complete todos los campos obligatorios", "error");
            return;
        }
        try {
            setLoading(true);
            let imageUrl = eventForm.image;
            if (eventSelectedFile) {
                const formData = new FormData();
                formData.append('file', eventSelectedFile);
                const response = await fetch('https://localhost:7089/api/File/upload/event', { method: 'POST', body: formData });
                if (!response.ok) throw new Error('Error al subir la imagen');
                const data = await response.json();
                imageUrl = data.url;
            }
            const payload = {
                userId: auth.userId,
                locationId: Number(eventForm.locationId),
                name: eventForm.name,
                description: eventForm.description,
                eventDate: eventForm.eventDate,
                type: Number(eventForm.type),
                image: imageUrl
            };
            console.log(auth);
            await createEvent(payload);
            showAlert("Evento creado correctamente", "success");
            setEventForm({
                name: '',
                eventDate: '',
                type: '',
                description: '',
                provinceId: '',
                locationId: '',
                image: ''
            });
            eventProvinceCity.handleProvinceChange('');
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
                    <Container component="main" maxWidth="md">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ m: 1, bgcolor: Colors.azul }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Crear Usuario
                            </Typography>
                            <Box component="form" noValidate sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="firstName"
                                            required
                                            fullWidth
                                            id="firstName"
                                            label="Nombre"
                                            autoFocus
                                            value={userForm.firstName}
                                            onChange={handleUserInputChange}
                                            error={!!userErrors.firstName}
                                            helperText={userErrors.firstName}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="lastName"
                                            label="Apellido"
                                            name="lastName"
                                            autoComplete="family-name"
                                            value={userForm.lastName}
                                            onChange={handleUserInputChange}
                                            error={!!userErrors.lastName}
                                            helperText={userErrors.lastName}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email"
                                            name="email"
                                            autoComplete="email"
                                            value={userForm.email}
                                            onChange={handleUserInputChange}
                                            error={!!userErrors.email}
                                            helperText={userErrors.email}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="password"
                                            label="Contraseña"
                                            type="password"
                                            id="password"
                                            autoComplete="new-password"
                                            value={userForm.password}
                                            onChange={handleUserInputChange}
                                            error={!!userErrors.password}
                                            helperText={userErrors.password}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            name="confirmPassword"
                                            label="Confirmar Contraseña"
                                            type="password"
                                            id="confirmPassword"
                                            autoComplete="new-password"
                                            value={userForm.confirmPassword}
                                            onChange={handleUserInputChange}
                                            error={!!userErrors.confirmPassword}
                                            helperText={userErrors.confirmPassword}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="identificationNumber"
                                            label="DNI"
                                            name="identificationNumber"
                                            value={userForm.identificationNumber}
                                            onChange={handleUserInputChange}
                                            error={!!userErrors.identificationNumber}
                                            helperText={userErrors.identificationNumber}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="birthDate"
                                            label="Fecha de Nacimiento"
                                            name="birthDate"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={userForm.birthDate}
                                            onChange={handleUserInputChange}
                                            error={!!userErrors.birthDate}
                                            helperText={userErrors.birthDate}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required error={!!userErrors.provinceId}>
                                            <InputLabel>Provincia</InputLabel>
                                            <Select
                                                name="provinceId"
                                                value={userForm.provinceId || ''}
                                                onChange={handleUserProvinceChange}
                                                label="Provincia"
                                                disabled={userProvinceCity.loadingProvinces}
                                            >
                                                {Array.isArray(userProvinceCity.provinces) && userProvinceCity.provinces.map((province) => (
                                                    <MenuItem key={province.id} value={province.id}>
                                                        {province.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {userErrors.provinceId && <Typography color="error" variant="caption">{userErrors.provinceId}</Typography>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required error={!!userErrors.cityId} disabled={!userForm.provinceId || userProvinceCity.loadingCities}>
                                            <InputLabel>Ciudad</InputLabel>
                                            <Select
                                                name="cityId"
                                                value={userForm.cityId || ''}
                                                onChange={handleUserCityChange}
                                                label="Ciudad"
                                            >
                                                {Array.isArray(userProvinceCity.cities) && userProvinceCity.cities.map((city) => (
                                                    <MenuItem key={city.id} value={city.id}>
                                                        {city.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {userErrors.cityId && <Typography color="error" variant="caption">{userErrors.cityId}</Typography>}
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle1">Foto de Perfil</Typography>
                                        {userSelectedFile && (
                                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                <img
                                                    src={URL.createObjectURL(userSelectedFile)}
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
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="user-image-upload"
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) setUserSelectedFile(file);
                                            }}
                                        />
                                        <label htmlFor="user-image-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                fullWidth
                                            >
                                                Seleccionar Imagen de Perfil
                                            </Button>
                                        </label>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <FormControl fullWidth required error={!!userErrors.role}>
                                            <InputLabel>Rol</InputLabel>
                                            <Select
                                                name="role"
                                                value={userForm.role}
                                                onChange={handleUserInputChange}
                                                label="Rol"
                                            >
                                                <MenuItem value="Admin">Administrador</MenuItem>
                                                <MenuItem value="Customer">Cliente</MenuItem>
                                                <MenuItem value="ServiceProvider">Proveedor de Servicios</MenuItem>
                                            </Select>
                                            {userErrors.role && <Typography color="error" variant="caption">{userErrors.role}</Typography>}
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, bgcolor: Colors.azul, '&:hover': { bgcolor: Colors.azulOscuro } }}
                                    onClick={handleCreateUser}
                                    disabled={loading}
                                >
                                    Crear Usuario
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </TabPanel>

                {/* Event Creation Form */}
                <TabPanel value={tabValue} index={1}>
                    <Container component="main" maxWidth="md">
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar sx={{ m: 1, bgcolor: Colors.azul }}>
                                <EventIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Crear Evento
                            </Typography>
                            <Box component="form" noValidate sx={{ mt: 3, width: '100%' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="name"
                                            label="Nombre del Evento"
                                            name="name"
                                            value={eventForm.name}
                                            onChange={handleEventInputChange}
                                            error={!!eventErrors.name}
                                            helperText={eventErrors.name}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            multiline
                                            rows={4}
                                            id="description"
                                            label="Descripción"
                                            name="description"
                                            value={eventForm.description}
                                            onChange={handleEventInputChange}
                                            error={!!eventErrors.description}
                                            helperText={eventErrors.description}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            fullWidth
                                            id="eventDate"
                                            label="Fecha y Hora"
                                            name="eventDate"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={eventForm.eventDate}
                                            onChange={handleEventInputChange}
                                            error={!!eventErrors.eventDate}
                                            helperText={eventErrors.eventDate}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl fullWidth required error={!!eventErrors.type}>
                                            <InputLabel>Tipo de Evento</InputLabel>
                                            <Select
                                                name="type"
                                                value={eventForm.type}
                                                onChange={handleEventInputChange}
                                                label="Tipo de Evento"
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
                                        <FormControl fullWidth required error={!!eventErrors.provinceId}>
                                            <InputLabel>Provincia</InputLabel>
                                            <Select
                                                name="provinceId"
                                                value={eventForm.provinceId || ''}
                                                onChange={handleEventProvinceChange}
                                                label="Provincia"
                                                disabled={eventProvinceCity.loadingProvinces}
                                            >
                                                {Array.isArray(eventProvinceCity.provinces) && eventProvinceCity.provinces.map((province) => (
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
                                            options={eventProvinceCity.cities}
                                            getOptionLabel={(option) => option.name || ''}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={eventProvinceCity.cities.find(city => city.id === eventForm.locationId) || null}
                                            onChange={handleEventCityChange}
                                            disabled={!eventForm.provinceId || eventProvinceCity.loadingCities}
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
                                        <Typography variant="subtitle1">Imagen del Evento</Typography>
                                        {eventSelectedFile && (
                                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                                <img
                                                    src={URL.createObjectURL(eventSelectedFile)}
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
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="event-image-upload"
                                            type="file"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) setEventSelectedFile(file);
                                            }}
                                        />
                                        <label htmlFor="event-image-upload">
                                            <Button
                                                variant="outlined"
                                                component="span"
                                                fullWidth
                                            >
                                                Seleccionar Imagen del Evento
                                            </Button>
                                        </label>
                                    </Grid>
                                </Grid>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2, bgcolor: Colors.azul, '&:hover': { bgcolor: Colors.azulOscuro } }}
                                    onClick={handleCreateEvent}
                                    disabled={loading}
                                >
                                    Crear Evento
                                </Button>
                            </Box>
                        </Box>
                    </Container>
                </TabPanel>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminCreatePanel;