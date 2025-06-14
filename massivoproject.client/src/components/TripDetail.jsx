import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, Button, Backdrop, CircularProgress, Rating, Divider, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup , Polyline } from 'react-leaflet';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlagIcon from '@mui/icons-material/Flag';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import 'leaflet/dist/leaflet.css';
import { useParams, useLocation } from 'react-router-dom';
import { getEventVehicleById } from '../api/EventEndpoints';
import { getCoordinatesByCityName, getCoordinatesByCityId } from '../api/EventEndpoints';

const TripDetail = () => {
  const { tripId } = useParams(); // tripId = eventVehicleId
  const location = useLocation();
  const destination = location.state?.destination;
  const [eventVehicle, setEventVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordsFrom, setCoordsFrom] = useState(null);
  const [coordsTo, setCoordsTo] = useState(null);
  const [coordsLoading, setCoordsLoading] = useState(true);
  const [openDescription, setOpenDescription] = useState(false);


  useEffect(() => {
    const fetchEventVehicle = async () => {
      try {
        const data = await getEventVehicleById(tripId);
        setEventVehicle(data);
      } catch (error) {
        setEventVehicle(null);
      }
      setLoading(false);
    };
    fetchEventVehicle();
  }, [tripId]);

  useEffect(() => {
    const fetchCoords = async () => {
      if (!eventVehicle) return;
      setCoordsLoading(true);
      try {
        let from = null, to = null;
        if (eventVehicle.from) {
          const dataFrom = await getCoordinatesByCityName(eventVehicle.from);
          from = [dataFrom.latitude, dataFrom.longitude];
        }
        if (destination) {
          const dataTo = await getCoordinatesByCityName(destination);
          to = [dataTo.latitude, dataTo.longitude];
        }
        setCoordsFrom(from);
        setCoordsTo(to);
      } catch {
        setCoordsFrom(null);
        setCoordsTo(null);
      }
      setCoordsLoading(false);
    };
    fetchCoords();
  }, [eventVehicle, destination]);

  // Loader mientras carga todo
  if (loading || coordsLoading || !coordsFrom || !coordsTo) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (loading) return <Typography>Cargando...</Typography>;
  if (!eventVehicle) return <Typography>No se encontró el viaje.</Typography>;


  const bounds = [coordsFrom, coordsTo];

  return (
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
              src={eventVehicle.image || '/sedan.jpg'}
              alt={eventVehicle.name}
              style={{
                width: '100%',
                maxWidth: 150,
                height: 110,
                objectFit: 'cover',
                borderRadius: 8,
                marginBottom: 8
              }}
            />
            <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold', textAlign: 'center' }}>{eventVehicle.name}</Typography>
            <Rating name="read-only" value={5} readOnly size="small" sx={{ mt: 1 }} />
            <Chip
              label={eventVehicle.available < 2 ? `${eventVehicle.available} lugar disponible` : `${eventVehicle.vehicle.available} lugares disponibles`}
              color={eventVehicle.available < 2 ? "error" : "success"}
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
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpenDescription(true)}
                  sx={{ mb: 1,ml:1 }}
                >
                  Ver Descripción
                </Button>
                <Chip label={eventVehicle.vehicleType} color="primary" sx={{ml: 2, mb: 1 }} />
                <Chip label={`Capacidad máxima: ${eventVehicle.vehicle.capacity}`} color="info" sx={{ ml: 1, mb: 1 }} />
              </Box>
              <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, width: { xs: '100%', sm: 'auto' } }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>${eventVehicle.price || 999}</Typography>
                <Typography variant="caption" color="text.secondary">por persona</Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2">
                <LocationOnIcon sx={{ verticalAlign: 'middle', color: '#1976d2', mr: 0.5 }} fontSize="small" />
                <b>Salida:</b> {eventVehicle.from} - <AccessTimeIcon sx={{ verticalAlign: 'middle', color: '#757575', mx: 0.5 }} fontSize="small" /><b>Horario:</b> {eventVehicle.date}
              </Typography>
              <Typography variant="body2">
                <FlagIcon sx={{ verticalAlign: 'middle', color: '#d32f2f', mr: 0.5 }} fontSize="small" />
                <b>Llegada:</b> {destination || 'Destino'}
              </Typography>
              <Typography variant="body2">
                <DriveEtaIcon sx={{ verticalAlign: 'middle', color: '#388e3c', mr: 0.5 }} fontSize="small" />
                <b>Patente:</b> {eventVehicle.licensePlate}
              </Typography>
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
            <Marker position={coordsFrom}>
              <Popup>
                Salida: {eventVehicle.from}
              </Popup>
            </Marker>
            <Marker position={coordsTo}>
              <Popup>
                Llegada: {destination || 'Destino'}
              </Popup>
            </Marker>
            <Polyline positions={[coordsFrom, coordsTo]} color="blue" />
          </MapContainer>
          
        </Box>
      </Paper>

      <Dialog
        open={openDescription}
        onClose={() => setOpenDescription(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Descripción del Viaje</DialogTitle>
        <DialogContent>
          <Typography variant="body" sx={{ whiteSpace: 'pre-line' }} color="text.secondary">
            {eventVehicle.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDescription(false)} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TripDetail;