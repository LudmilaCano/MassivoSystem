import React, { useState } from 'react';
import { Box, Container, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import ProviderEventPanel from './ProviderEventPanel';
import ProviderVehicle from './ProviderVehicle';
import ProviderEventVehicle from './ProviderEventVehicle';
import Colors from '../../layout/Colors';

const ProviderDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const { userId } = useSelector((state) => state.auth);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" gutterBottom component="div" sx={{ color: Colors.azul }}>
              Panel de Proveedor
            </Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab label="Mis Vehículos" />
                <Tab label="Mis Eventos" />
                <Tab label="Mis Viajes" />
              </Tabs>
            </Box>
            {tabValue === 0 && <ProviderVehicle userId={userId} />}
            {tabValue === 1 && <ProviderEventPanel userId={userId} />}
            {tabValue === 2 && <ProviderEventVehicle userId={userId} />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProviderDashboard;
