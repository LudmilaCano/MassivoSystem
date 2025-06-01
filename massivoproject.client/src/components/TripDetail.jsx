import React from 'react';
import { Box, Typography, Paper, Chip, Button, Rating, Divider } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagIcon from '@mui/icons-material/Flag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import 'leaflet/dist/leaflet.css';

const vehicle = {
  name: 'Audi A4',
  description: 'Vehículo gama alta, ideal para viajes largos y cómodos.',
  image: '/sedan.jpg',
  capacity: 4,
  available: 1,
  from: "Rosario",
  to: "Ushuaia",
  licensePlate: 'AA000AA',
  price: 999,
  date: '14/05/25 - 16:30hs',
  coordsFrom: [-32.9442, -60.6505], // Rosario
  coordsTo: [-28.1, -68.3029]   // Ushuaia
};

const bounds = [vehicle.coordsFrom, vehicle.coordsTo];

const TripDetail = () => (
  <Box sx={{
    width: '100%',
    minHeight: '90vh',
    backgroundColor: '#F5F5F5',
    p: { xs: 1, sm: 2, md: 4 },
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
  }}>
    <Paper elevation={6} sx={{
      maxWidth: 900,
      width: '100%',
      p: { xs: 1, sm: 2, md: 3 },
      borderRadius: 4,
      boxSizing: 'border-box'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 3 },
        alignItems: { xs: 'center', sm: 'flex-start' }
      }}>
        {/* Imagen del vehículo */}
        <Box sx={{
          minWidth: { xs: '100%', sm: 160 },
          maxWidth: { xs: '100%', sm: 160 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <img
            src={vehicle.image}
            alt={vehicle.name}
            style={{
              width: '100%',
              maxWidth: 150,
              height: 110,
              objectFit: 'cover',
              borderRadius: 8,
              marginBottom: 8
            }}
          />
          <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', textAlign: 'center' }}>{vehicle.name}</Typography>
          <Rating name="read-only" value={5} readOnly size="small" sx={{ mt: 1 }} />
          <Chip
            label={vehicle.available < 2 ? `${vehicle.available} lugar disponible` : `${vehicle.available} lugares disponibles`}
            color={vehicle.available < 2 ? "error" : "success"}
            sx={{ mt: 1 }}
          />
        </Box>
        {/* Detalles a la derecha */}
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          width: '100%'
        }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'flex-start' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{vehicle.description}</Typography>
              <Chip label="Sedán" color="primary" sx={{ mb: 1 }} />
              <Chip label={`Capacidad: ${vehicle.capacity}`} color="info" sx={{ ml: 1, mb: 1 }} />
            </Box>
            <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, width: { xs: '100%', sm: 'auto' } }}>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>${vehicle.price}</Typography>
              <Typography variant="caption" color="text.secondary">por persona</Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2">
                <LocationOnIcon sx={{ verticalAlign: 'middle', color: '#1976d2', mr: 0.5 }} fontSize="small" />
                
                <b>Salida:</b> {vehicle.from} - <AccessTimeIcon sx={{ verticalAlign: 'middle', color: '#757575', mx: 0.5 }} fontSize="small" /><b>Horario:</b> {vehicle.date}</Typography>
            <Typography variant="body2">
                <FlagIcon sx={{ verticalAlign: 'middle', color: '#d32f2f', mr: 0.5 }} fontSize="small" />
                <b>Llegada:</b> {vehicle.to}</Typography>
            <Typography variant="body2">
                <DriveEtaIcon sx={{ verticalAlign: 'middle', color: '#388e3c', mr: 0.5 }} fontSize="small" />   
                <b>Patente:</b> {vehicle.licensePlate}</Typography>
          </Box>
          <Button
            variant="contained"
            color="warning"
            sx={{
              mt: 2,
              alignSelf: { xs: 'center', sm: 'flex-end' },
              width: { xs: '100%', sm: 180 }
            }}
          >
            Reservar Ya
          </Button>
        </Box>
      </Box>
      {/* Mapa debajo de la card */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Recorrido</Typography>
        <MapContainer bounds={bounds} style={{ height: 300, width: '100%', borderRadius: 8 }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={vehicle.coordsFrom}>
            <Popup>
              Salida: {vehicle.from}
            </Popup>
          </Marker>
          <Marker position={vehicle.coordsTo}>
            <Popup>
              Llegada: {vehicle.to}
            </Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Paper>
  </Box>
);

export default TripDetail;