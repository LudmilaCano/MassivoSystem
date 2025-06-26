import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Backdrop,
  CircularProgress,
  Rating,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FlagIcon from "@mui/icons-material/Flag";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import "leaflet/dist/leaflet.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getEventVehicleById,
  getCoordinatesByCityName,
} from "../api/EventEndpoints";
import ReviewList from "./ReviewList";
import { useSelector } from "react-redux";
import { fetchRoute } from "../api/OpenRouteService";
import { getVehicleTypeImage } from '../constants/vehicleType';

const TripDetail = () => {
  const { tripId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const destination = location.state?.destination;
  const userId = useSelector((state) => state.auth.userId);

  const [eventVehicle, setEventVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coordsFrom, setCoordsFrom] = useState(null);
  const [coordsTo, setCoordsTo] = useState(null);
  const [coordsLoading, setCoordsLoading] = useState(true);
  const [openDescription, setOpenDescription] = useState(false);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const fetchEventVehicle = async () => {
      try {
        const data = await getEventVehicleById(tripId);
        setEventVehicle(data);
      } catch (error) {
        setEventVehicle(null);
        console.error("Error: ", error);
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
        let from = null,
          to = null;
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

  useEffect(() => {
    const getCachedRouteKey = (from, to) =>
      `route_${from.join(",")}_${to.join(",")}`;

    const getRouteWithCache = async (from, to) => {
      const key = getCachedRouteKey(from, to);
      const cached = sessionStorage.getItem(key);
      if (cached) {
        setRoute(JSON.parse(cached));
      } else {
        const data = await fetchRoute(from, to);
        setRoute(data);
        sessionStorage.setItem(key, JSON.stringify(data));
      }
    };

    if (coordsFrom && coordsTo) {
      getRouteWithCache(coordsFrom, coordsTo);
    }
  }, [coordsFrom, coordsTo]);

  const handleReservar = () => {
    if (!userId) {
      navigate("/login", {
        state: {
          redirectAfterLogin: {
            pathname: "/booking",
            state: { eventVehicle, destination },
          },
        },
      });
    } else {
      navigate("/booking", { state: { eventVehicle, destination } });
    }
  };

  if (loading || coordsLoading || !coordsFrom || !coordsTo) {
    return (
      <Backdrop open={true} sx={{ color: "#fff", zIndex: 9999 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!eventVehicle) return <Typography>No se encontró el viaje.</Typography>;

  const bounds = [coordsFrom, coordsTo];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "90vh",
        backgroundColor: "#F5F5F5",
        p: { xs: 1, sm: 2, md: 4 },
      }}
    >
      <Grid container spacing={3} sx={{ maxWidth: 1400, mx: "auto" }}>
        <Grid item xs={12}>
          <Paper
            elevation={6}
            sx={{
              p: 3,
              borderRadius: 4,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              alignItems: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              sx={{
                minWidth: { xs: "100%", md: 200 },
                maxWidth: { xs: "100%", md: 200 },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={
                  eventVehicle.vehicle?.imagePath ||
                  getVehicleTypeImage(eventVehicle.vehicleType)
                }
                alt={eventVehicle.vehicle?.name || eventVehicle.name}
                style={{
                  width: 120,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
                loading="lazy"
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: "bold", textAlign: "center", mb: 1 }}
              >
                {eventVehicle.name}
              </Typography>
              <Chip
                label={
                  eventVehicle.available < 2
                    ? `${eventVehicle.available} lugar disponible`
                    : `${eventVehicle.vehicle.available} lugares disponibles`
                }
                color={eventVehicle.available < 2 ? "error" : "success"}
                sx={{ mb: 2 }}
              />
            </Box>

            <Box sx={{ flex: 1, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  flexWrap: "wrap",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <Chip
                    label={eventVehicle.vehicleType}
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  />
                  <Chip
                    label={`Capacidad máxima: ${eventVehicle.vehicle.capacity} personas`}
                    color="default"
                  />
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setOpenDescription(true)}
                  sx={{ textTransform: "none" }}
                >
                  Ver Descripción
                </Button>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
                  gap: { xs: 2, sm: 3 },
                  mb: 3,
                  p: 2.5,
                  bgcolor: "grey.50",
                  borderRadius: 2,
                  alignItems: "start",
                }}
              >
                <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      justifyContent: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <LocationOnIcon
                      sx={{ color: "#1976d2", mr: 1 }}
                      fontSize="small"
                    />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      SALIDA
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}
                  >
                    {eventVehicle.from}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ color: "#757575", mr: 0.5 }}
                      fontSize="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      {new Date(eventVehicle.date).toLocaleDateString("es-ES")}{" "}
                      -{" "}
                      {new Date(eventVehicle.date).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    minHeight: 80,
                  }}
                >
                  <Box
                    sx={{
                      width: 2,
                      height: "60%",
                      bgcolor: "grey.300",
                      borderRadius: 1,
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      justifyContent: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <FlagIcon
                      sx={{ color: "#d32f2f", mr: 1 }}
                      fontSize="small"
                    />
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: "bold" }}
                    >
                      LLEGADA
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1, color: "text.primary" }}
                  >
                    {destination || "Destino"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: { xs: "flex-start", sm: "center" },
                    }}
                  >
                    <DriveEtaIcon
                      sx={{ color: "#388e3c", mr: 0.5 }}
                      fontSize="small"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Patente: {eventVehicle.licensePlate}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  p: 2.5,
                  bgcolor: "rgba(25, 118, 210, 0.04)",
                  borderRadius: 2,
                }}
              >
                <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    variant="h3"
                    color="primary.main"
                    sx={{ fontWeight: "bold", lineHeight: 1 }}
                  >
                    ${eventVehicle.price || 999}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    por persona
                  </Typography>
                </Box>
                <Button
                  onClick={handleReservar}
                  variant="contained"
                  color="warning"
                  size="large"
                  sx={{
                    minWidth: 180,
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    textTransform: "none",
                  }}
                >
                  Reservar Ya
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Recorrido
            </Typography>
            <Box sx={{ height: 400, borderRadius: 2, overflow: "hidden" }}>
              <MapContainer
                bounds={bounds}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={coordsFrom}>
                  <Popup>Salida: {eventVehicle.from}</Popup>
                </Marker>
                <Marker position={coordsTo}>
                  <Popup>Llegada: {destination || "Destino"}</Popup>
                </Marker>
                {route.length > 0 && (
                  <Polyline positions={route} color="blue" />
                )}
              </MapContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={4} sx={{ borderRadius: 4, height: "fit-content" }}>
            <ReviewList eventVehicleId={tripId} />
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDescription}
        onClose={() => setOpenDescription(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Descripción del Viaje</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            sx={{ whiteSpace: "pre-line" }}
            color="text.secondary"
          >
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
