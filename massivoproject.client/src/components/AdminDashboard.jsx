import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import MainLayout from '../layout/MainLayout';
import { getAllUsers, updateUser } from '../api/UserEndpoints';
import { getAllVehicles } from '../api/VehicleEndpoints';
import { getAllEvents } from '../api/EventEndpoints';
import Swal from 'sweetalert2';
import useSwalAlert from '../hooks/useSwalAlert';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogType, setDialogType] = useState(''); // 'user', 'vehicle', 'event'
  const { showSuccessAlert, showErrorAlert } = useSwalAlert();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersData = await getAllUsers();
      const vehiclesData = await getAllVehicles();
      const eventsData = await getAllEvents();
      
      setUsers(usersData);
      setVehicles(vehiclesData);
      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      showErrorAlert("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handlers for opening edit dialogs
  const handleEditUser = (user) => {
    setSelectedUser({...user});
    setDialogType('user');
    setOpenDialog(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle({...vehicle});
    setDialogType('vehicle');
    setOpenDialog(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent({...event});
    setDialogType('event');
    setOpenDialog(true);
  };

  // Handler for viewing details with SweetAlert
  const handleViewDetails = (item, type) => {
    let content = '';
    
    if (type === 'user') {
      content = `
        <div>
          <p><strong>ID:</strong> ${item.userId}</p>
          <p><strong>Nombre:</strong> ${item.firstName} ${item.lastName}</p>
          <p><strong>Email:</strong> ${item.email}</p>
          <p><strong>Rol:</strong> ${item.role}</p>
          <p><strong>Ciudad:</strong> ${item.city || 'No especificada'}</p>
          <p><strong>Provincia:</strong> ${item.province || 'No especificada'}</p>
        </div>
      `;
    } else if (type === 'vehicle') {
      content = `
        <div>
          <p><strong>Matrícula:</strong> ${item.licensePlate}</p>
          <p><strong>Marca:</strong> ${item.brand}</p>
          <p><strong>Modelo:</strong> ${item.model}</p>
          <p><strong>Tipo:</strong> ${item.type}</p>
          <p><strong>Propietario ID:</strong> ${item.userId}</p>
          <p><strong>Capacidad:</strong> ${item.capacity}</p>
        </div>
      `;
    } else if (type === 'event') {
      content = `
        <div>
          <p><strong>ID:</strong> ${item.eventId}</p>
          <p><strong>Nombre:</strong> ${item.name}</p>
          <p><strong>Descripción:</strong> ${item.description || 'Sin descripción'}</p>
          <p><strong>Ubicación:</strong> ${item.location}</p>
          <p><strong>Fecha:</strong> ${new Date(item.eventDate).toLocaleDateString()}</p>
          <p><strong>Tipo:</strong> ${item.type}</p>
        </div>
      `;
    }
    
    Swal.fire({
      title: `Detalles de ${type === 'user' ? 'Usuario' : type === 'vehicle' ? 'Vehículo' : 'Evento'}`,
      html: content,
      confirmButtonText: 'Cerrar'
    });
  };

  // Handler for closing dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setSelectedVehicle(null);
    setSelectedEvent(null);
    setDialogType('');
  };

  // Handler for saving changes
  const handleSaveChanges = async () => {
    try {
      if (dialogType === 'user' && selectedUser) {
        await updateUser(selectedUser.userId, selectedUser);
        showSuccessAlert("Usuario actualizado correctamente");
        fetchData(); // Refresh data
      } else if (dialogType === 'vehicle' && selectedVehicle) {
        // Implement vehicle update logic
        showSuccessAlert("Vehículo actualizado correctamente");
        fetchData();
      } else if (dialogType === 'event' && selectedEvent) {
        // Implement event update logic
        showSuccessAlert("Evento actualizado correctamente");
        fetchData();
      }
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating:", error);
      showErrorAlert("Error al guardar los cambios");
    }
  };

  // Handler for input changes in dialogs
  const handleInputChange = (e, type) => {
    const { name, value } = e.target;
    
    if (type === 'user') {
      setSelectedUser(prev => ({ ...prev, [name]: value }));
    } else if (type === 'vehicle') {
      setSelectedVehicle(prev => ({ ...prev, [name]: value }));
    } else if (type === 'event') {
      setSelectedEvent(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Administración
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{users.length}</Typography>
                <Typography variant="body2" color="text.secondary">Usuarios</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <DirectionsCarIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{vehicles.length}</Typography>
                <Typography variant="body2" color="text.secondary">Vehículos</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5">{events.length}</Typography>
                <Typography variant="body2" color="text.secondary">Eventos</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Usuarios" />
          <Tab label="Vehículos" />
          <Tab label="Eventos" />
        </Tabs>

        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.userId}>
                    <TableCell>{user.userId}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        onClick={() => handleEditUser(user)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="info"
                        onClick={() => handleViewDetails(user, 'user')}
                      >
                        Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Vehicles Tab */}
        <TabPanel value={tabValue} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Matrícula</TableCell>
                  <TableCell>Marca</TableCell>
                  <TableCell>Modelo</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Propietario</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.licensePlate}>
                    <TableCell>{vehicle.licensePlate}</TableCell>
                    <TableCell>{vehicle.brand}</TableCell>
                    <TableCell>{vehicle.model}</TableCell>
                    <TableCell>{vehicle.type}</TableCell>
                    <TableCell>{vehicle.userId}</TableCell>
                    <TableCell>
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleEditVehicle(vehicle)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="info"
                        onClick={() => handleViewDetails(vehicle, 'vehicle')}
                      >
                        Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Events Tab */}
        <TabPanel value={tabValue} index={2}>
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
                    <TableCell>{event.type}</TableCell>
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
                        onClick={() => handleViewDetails(event, 'event')}
                      >
                        Detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'user' ? 'Editar Usuario' : 
           dialogType === 'vehicle' ? 'Editar Vehículo' : 
           'Editar Evento'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'user' && selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombre"
                name="firstName"
                value={selectedUser.firstName}
                onChange={(e) => handleInputChange(e, 'user')}
                fullWidth
              />
              <TextField
                label="Apellido"
                name="lastName"
                value={selectedUser.lastName}
                onChange={(e) => handleInputChange(e, 'user')}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={selectedUser.email}
                onChange={(e) => handleInputChange(e, 'user')}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={selectedUser.role}
                  onChange={(e) => handleInputChange(e, 'user')}
                  label="Rol"
                >
                  <MenuItem value="User">Usuario</MenuItem>
                  <MenuItem value="Admin">Administrador</MenuItem>
                  <MenuItem value="Prestador">Prestador</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {dialogType === 'vehicle' && selectedVehicle && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Marca"
                name="brand"
                value={selectedVehicle.brand}
                onChange={(e) => handleInputChange(e, 'vehicle')}
                fullWidth
              />
              <TextField
                label="Modelo"
                name="model"
                value={selectedVehicle.model}
                onChange={(e) => handleInputChange(e, 'vehicle')}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="type"
                  value={selectedVehicle.type}
                  onChange={(e) => handleInputChange(e, 'vehicle')}
                  label="Tipo"
                >
                  <MenuItem value="Car">Auto</MenuItem>
                  <MenuItem value="Van">Combi</MenuItem>
                  <MenuItem value="Bus">Colectivo</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Capacidad"
                name="capacity"
                type="number"
                value={selectedVehicle.capacity}
                onChange={(e) => handleInputChange(e, 'vehicle')}
                fullWidth
              />
            </Box>
          )}

          {dialogType === 'event' && selectedEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombre"
                name="name"
                value={selectedEvent.name}
                onChange={(e) => handleInputChange(e, 'event')}
                fullWidth
              />
              <TextField
                label="Descripción"
                name="description"
                value={selectedEvent.description || ''}
                onChange={(e) => handleInputChange(e, 'event')}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Fecha"
                name="eventDate"
                type="date"
                value={selectedEvent.eventDate ? selectedEvent.eventDate.split('T')[0] : ''}
                onChange={(e) => handleInputChange(e, 'event')}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="type"
                  value={selectedEvent.type}
                  onChange={(e) => handleInputChange(e, 'event')}
                  label="Tipo"
                >
                  <MenuItem value="Concert">Concierto</MenuItem>
                  <MenuItem value="Sports">Deportes</MenuItem>
                  <MenuItem value="Festival">Festival</MenuItem>
                  <MenuItem value="Conference">Conferencia</MenuItem>
                  <MenuItem value="Other">Otro</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveChanges} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
