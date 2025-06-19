import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Container, Grid, Card, CardContent,
  Tabs, Tab,Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventIcon from '@mui/icons-material/Event';
import { getAllUsers } from '../../api/UserEndpoints';
import { getAllVehicles } from '../../api/VehicleEndpoints';
import { getAllEvents } from '../../api/EventEndpoints';
import AdminUserPanel from './AdminUserPanel';
import AdminVehiclePanel from './AdminVehiclePanel';
import AdminEventPanel from './AdminEventPanel';
import AdminCreatePanel from './AdminCreatePanel';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openCreatePanel, setOpenCreatePanel] = useState(false);
  const navigate = useNavigate();
  
  // Alert functions
  const showSuccessAlert = (message) => {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: message
    });
  };

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
      console.log(vehiclesData);
      console.log(eventsData)
      setEvents(eventsData);
    } catch (error) {
      showErrorAlert("Error al cargar los datos");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Panel de Administración
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreatePanel(true)}
          
        >
          Crear Nuevo
        </Button>
      </Box>

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

        <TabPanel value={tabValue} index={0}>
          <AdminUserPanel 
            users={users} 
            onRefresh={fetchData} 
            showSuccessAlert={showSuccessAlert}
            showErrorAlert={showErrorAlert}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AdminVehiclePanel 
            vehicles={vehicles} 
            onRefresh={fetchData}
            showSuccessAlert={showSuccessAlert}
            showErrorAlert={showErrorAlert}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <AdminEventPanel 
            events={events} 
            onRefresh={fetchData}
            showSuccessAlert={showSuccessAlert}
            showErrorAlert={showErrorAlert}
          />
        </TabPanel>
      </Paper>
<AdminCreatePanel
        open={openCreatePanel}
        onClose={() => setOpenCreatePanel(false)}
        onSuccess={fetchData}
      />
    </Container>
  );
};

export default AdminDashboard;
