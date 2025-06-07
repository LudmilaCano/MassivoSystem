import React from 'react';
import { Box, Typography, Paper, Container, Grid, Divider } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlagIcon from '@mui/icons-material/Flag';

const AboutUs = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold" color="primary">
          Nosotros
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <DirectionsCarIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        </Box>
        
        <Typography variant="body1" paragraph align="center">
          Somos una plataforma que conecta a personas que viajan al mismo destino, 
          permitiendo compartir vehículos y reducir costos de transporte.
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <VisibilityIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                Visión
              </Typography>
              <Typography variant="body1" paragraph align="center">
                Ser la plataforma líder en movilidad compartida, creando una comunidad 
                de viajeros que optimizan recursos, reducen la huella de carbono y 
                generan conexiones significativas durante sus trayectos.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
              <FlagIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                Misión
              </Typography>
              <Typography variant="body1" paragraph align="center">
                Facilitar la movilidad entre ciudades mediante una plataforma segura y 
                confiable que permite a los usuarios compartir vehículos, reducir costos 
                de viaje y contribuir a un transporte más sostenible y eficiente.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AboutUs;