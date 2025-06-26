import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Grid,
  Stack,
  IconButton,
  Pagination,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getRandomEvents, getAllEvents } from "../api/EventEndpoints";
import { getEventTypeLabel } from "../constants/eventCategories";
import { useBusyDialog } from "../hooks/useBusyDialog";
import { setShowInNavbar, setEvents } from "../redux/SearchSlice";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";

const infoSlides = [
  {
    image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg",
    title: "Hacete prestador",
    subtitle: "Ofrecé tu vehículo para eventos y generá ingresos.",
    buttonText: "Quiero ser prestador",
    buttonAction: (navigate, auth) => () =>
      navigate(auth.isAuthenticated ? "/profile" : "/login"),
    key: "info-1",
  },
  {
    image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg",
    title: "Pagá fácil y seguro",
    subtitle: "Usá Mercado Pago para tus reservas sin complicaciones.",
    buttonText: "Reservá ahora",
    buttonAction: (navigate, auth) => () =>
      navigate(auth.isAuthenticated ? "/events" : "/login"),
    key: "info-2",
  },
  {
    image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg",
    title: "Seguridad ante todo",
    subtitle: "Validamos cada viaje con QR único.",
    buttonText: "Cómo funciona",
    buttonAction: (navigate) => () => navigate("/instructivo"),
    key: "info-3",
  },
  {
    image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg",
    title: "Gestioná todo desde tu perfil",
    subtitle: "Eventos, vehículos, reservas y más en un solo lugar.",
    buttonText: "Ir al perfil",
    buttonAction: (navigate, auth) => () =>
      navigate(auth.isAuthenticated ? "/profile" : "/login"),
    key: "info-4",
  },
];

const Home = () => {
  const events = useSelector((state) => state.search.events || []);
  const searchActive = useSelector(
    (state) => state.search.searchName || state.search.searchDate
  );
  const [busy, setBusy, BusyDialog] = useBusyDialog();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [page, setPage] = useState(1);
  const [eventsPerPage] = useState(3);
  const [randomEvents, setRandomEvents] = useState([]);

  useEffect(() => {
    dispatch(setShowInNavbar(true));
    return () => dispatch(setShowInNavbar(false));
  }, [dispatch]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(events.length / eventsPerPage);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  useEffect(() => {
    const fetchEvents = async () => {
      setBusy(true);
      try {
        const data = await getAllEvents();
        dispatch(setEvents(data));
        const randomEventsData = await getRandomEvents(4);
        setRandomEvents(randomEventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setBusy(false);
    };
    fetchEvents();
  }, [dispatch, auth.token, navigate]);

  const carouselSlides = [
    ...infoSlides.map((slide) => ({
      ...slide,
      buttonAction: slide.buttonAction(navigate, auth),
      isEvent: false,
      key: slide.key,
    })),
    ...randomEvents.map((event) => ({
      image:
        event.image ||
        "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg",
      title: event.name || "Evento destacado",
      subtitle: event.description || "Únete a este increíble evento",
      buttonText: "Ver detalles",
      buttonAction: () => navigate(`/vehicle-list/${event.eventId}`),
      isEvent: true,
      eventId: event.eventId,
      eventDate: event.eventDate,
      location: event.location,
      key: `event-${event.eventId}`,
    })),
  ];

  return (
    <>
      {BusyDialog}
      <Box sx={{ px: { xs: 2, md: 8 }, py: 4, maxWidth: "1400px", mx: "auto" }}>
        {!searchActive && (
          <div style={{ marginBottom: "2rem" }}>
            <Carousel>
              {carouselSlides.map((item) => (
                <Carousel.Item key={item.key}>
                  <div
                    style={{
                      height: isMobile ? "300px" : "450px",
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)), url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      textAlign: "center",
                      borderRadius: "1.5rem",
                      padding: "2rem",
                    }}
                  >
                    {item.isEvent && (
                      <Chip
                        label="Evento destacado"
                        color="primary"
                        sx={{
                          position: "absolute",
                          top: 16,
                          right: 16,
                          backgroundColor: "#ff9800",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                    <Typography
                      variant={isMobile ? "h4" : "h2"}
                      component="h2"
                      sx={{ mb: 2, fontWeight: "bold" }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant={isMobile ? "body1" : "h6"}
                      sx={{ mb: 4 }}
                    >
                      {item.subtitle}
                    </Typography>
                    {item.isEvent && (
                      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                        <Chip
                          icon={<CalendarTodayIcon />}
                          label={
                            formatDate(
                              randomEvents.find(
                                (e) => e.eventId === item.eventId
                              )?.eventDate
                            ) || "Fecha próxima"
                          }
                          sx={{
                            color: "white",
                            backgroundColor: "rgba(255,255,255,0.2)",
                          }}
                        />
                        <Chip
                          icon={<LocationOnIcon />}
                          label={
                            randomEvents.find((e) => e.eventId === item.eventId)
                              ?.location || "Ver ubicación"
                          }
                          sx={{
                            color: "white",
                            backgroundColor: "rgba(255,255,255,0.2)",
                          }}
                        />
                      </Box>
                    )}
                    <Button
                      variant="contained"
                      size="large"
                      onClick={item.buttonAction}
                      sx={{
                        backgroundColor: item.isEvent ? "#ff9800" : "#139AA0",
                        "&:hover": {
                          backgroundColor: item.isEvent ? "#f57c00" : "#0d7e82",
                        },
                        px: 4,
                        py: 1.5,
                        borderRadius: 8,
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.buttonText}
                    </Button>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        )}

        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: 4,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -10,
              left: 0,
              width: 80,
              height: 4,
              backgroundColor: "#139AA0",
              borderRadius: 2,
            },
          }}
        >
          {searchActive && "Resultados de búsqueda"}
        </Typography>

        <Stack spacing={3}>
          {currentEvents.map((event, index) => (
            <Card
              key={index}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                overflow: "hidden",
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
                },
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "100%", md: 300 },
                  height: { xs: 200, md: 300 },
                  objectFit: "cover",
                }}
                image={event.image || "https://picsum.photos/800/600"}
                alt={event.name}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  p: 3,
                }}
              >
                <CardContent sx={{ flex: "1 0 auto", pb: 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                      {event.name}
                    </Typography>
                    <Chip
                      label={getEventTypeLabel(event.type)}
                      color="primary"
                      sx={{
                        backgroundColor: "#139AA0",
                        fontWeight: "bold",
                      }}
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {event.description ||
                      "Únete a este increíble evento y disfruta de una experiencia inolvidable con transporte seguro y cómodo."}
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <CalendarTodayIcon color="primary" />
                        <Typography variant="body2">
                          {formatDate(event.eventDate)}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationOnIcon color="primary" />
                        <Typography variant="body2">
                          {event.location || "Ubicación no especificada"}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {event.isActive === 0 && "No Disponible"}
                  </Typography>
                </CardContent>
                <Divider sx={{ my: 1 }} />
                <CardActions
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small">
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small">
                      <ShareIcon fontSize="small" />
                    </IconButton>
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#139AA0",
                        "&:hover": { backgroundColor: "#0d7e82" },
                        borderRadius: 8,
                        textTransform: "none",
                      }}
                      disabled={!event.isActive}
                      onClick={() => navigate(`/vehicle-list/${event.eventId}`)}
                    >
                      Buscar vehículo
                    </Button>
                  </Box>
                </CardActions>
              </Box>
            </Card>
          ))}
        </Stack>

        {events.length === 0 && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No se encontraron eventos que coincidan con tu búsqueda.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#139AA0" }}
              onClick={() => dispatch(setEvents([]))}
            >
              Ver todos los eventos
            </Button>
          </Box>
        )}
      </Box>
      {events.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#139AA0",
              },
              "& .Mui-selected": {
                backgroundColor: "#139AA0 !important",
                color: "white",
              },
            }}
          />
        </Box>
      )}
      {events.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 1 }}
        >
          Mostrando {indexOfFirstEvent + 1}-
          {Math.min(indexOfLastEvent, events.length)} de {events.length} eventos
        </Typography>
      )}
    </>
  );
};

export default Home;
