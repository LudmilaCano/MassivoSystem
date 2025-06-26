import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Componente para el panel de pestañas
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Instructive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Contenido de las pestañas
  const tabContents = [
    {
      title: "Reservar un viaje",
      icon: <BookOnlineIcon fontSize="large" sx={{ color: "#139AA0" }} />,
      content: (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cómo reservar un viaje
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Busca un evento"
                  secondary="Usa el buscador en la página principal o explora los eventos destacados."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Selecciona un vehículo"
                  secondary="Compara opciones, precios y capacidad para elegir el que mejor se adapte a tus necesidades."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Completa la reserva"
                  secondary="Indica cuántos asientos necesitas y proporciona la información requerida."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Confirma y paga"
                  secondary="Revisa los detalles, confirma y paga a través de Mercado Pago. Recibirás un código QR para el día del evento."
                />
              </ListItem>
            </List>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#139AA0",
                "&:hover": { backgroundColor: "#0d7e82" },
              }}
              onClick={() => navigate("/")}
            >
              Explorar eventos
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="250"
                image="https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
                alt="Reservar viaje"
              />
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      title: "Ser prestador",
      icon: <PersonIcon fontSize="large" sx={{ color: "#139AA0" }} />,
      content: (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cómo convertirse en prestador
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Cambia tu rol"
                  secondary="Accede a tu perfil y haz clic en 'Cambiar a Prestador'."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Registra tu vehículo"
                  secondary="Completa el formulario con los datos de tu vehículo y sube fotos."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Asocia tu vehículo a eventos"
                  secondary="Busca eventos disponibles y asocia tu vehículo, indicando precio y asientos disponibles."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Gestiona reservas"
                  secondary="Desde tu panel, podrás ver y gestionar todas las reservas para tus vehículos."
                />
              </ListItem>
            </List>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#139AA0",
                "&:hover": { backgroundColor: "#0d7e82" },
              }}
              onClick={() =>
                navigate(
                  auth.role === "Admin" ||
                    auth.role === "Prestador" ||
                    auth.role === "User"
                    ? "/profile"
                    : "/login"
                )
              }
            >
              Ser prestador
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="250"
                image="https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
                alt="Ser prestador"
              />
            </Card>
          </Grid>
        </Grid>
      ),
    },
    {
      title: "Crear eventos",
      icon: <EventIcon fontSize="large" sx={{ color: "#139AA0" }} />,
      content: (
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Cómo crear y gestionar eventos
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Accede a la sección de eventos"
                  secondary="Si eres administrador o prestador, usa la opción 'Agregar Evento' del menú."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Completa la información"
                  secondary="Ingresa nombre, descripción, fecha, ubicación, tipo de evento y sube una imagen."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Publica el evento"
                  secondary="Haz clic en 'Agregar Evento' para publicarlo y hacerlo disponible."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: "#139AA0" }} />
                </ListItemIcon>
                <ListItemText
                  primary="Gestiona el evento"
                  secondary="Desde tu panel, podrás editar eventos y ver estadísticas de reservas."
                />
              </ListItem>
            </List>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: "#139AA0",
                "&:hover": { backgroundColor: "#0d7e82" },
              }}
              onClick={() =>
                navigate(
                  auth.role === "Admin" || auth.role === "Prestador"
                    ? "/add-event"
                    : "/login"
                )
              }
            >
              Crear evento
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="250"
                image="https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
                alt="Crear eventos"
              />
            </Card>
          </Grid>
        </Grid>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography
          variant="h3"
          component="h1"
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          ¿Cómo funciona MassivoApp?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: "800px", mx: "auto" }}
        >
          Descubre todas las funcionalidades de nuestra plataforma y aprende a
          sacarle el máximo provecho
        </Typography>
        <Divider
          sx={{
            mt: 3,
            mb: 4,
            width: "80px",
            mx: "auto",
            borderWidth: 3,
            borderColor: "#139AA0",
          }}
        />
      </Box>

      {/* Características principales */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 4,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <BookOnlineIcon sx={{ fontSize: 50, color: "#139AA0", mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Reserva tu viaje
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Encuentra vehículos disponibles para el evento que deseas
                asistir.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 4,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <DirectionsCarIcon
                sx={{ fontSize: 50, color: "#139AA0", mb: 2 }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ofrece tu vehículo
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Conviértete en prestador y genera ingresos con tus vehículos.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              height: "100%",
              borderRadius: 4,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <EventIcon sx={{ fontSize: 50, color: "#139AA0", mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Crea eventos
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Crea y gestiona eventos para que otros usuarios reserven
                vehículos.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Pestañas con instrucciones */}
      <Paper elevation={2} sx={{ borderRadius: 2, mb: 6 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontWeight: "bold",
              py: 2,
            },
            "& .Mui-selected": {
              color: "#139AA0",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#139AA0",
            },
          }}
        >
          {tabContents.map((tab, index) => (
            <Tab
              key={index}
              label={tab.title}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {tabContents.map((tab, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            {tab.content}
          </TabPanel>
        ))}
      </Paper>

      {/* Call to Action */}
      <Box
        sx={{
          p: 4,
          borderRadius: 4,
          backgroundColor: "#139AA0",
          color: "white",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          ¿Listo para comenzar?
        </Typography>
        <Typography
          variant="body2"
          sx={{ mb: 3, maxWidth: "600px", mx: "auto" }}
        >
          Ya sea que quieras reservar un viaje, ofrecer tu vehículo o crear un
          evento, MassivoApp te ofrece todas las herramientas que necesitas.
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(auth.token ? "/profile" : "/register")}
          sx={{
            backgroundColor: "white",
            color: "#139AA0",
            "&:hover": { backgroundColor: "#f5f5f5" },
            px: 3,
            py: 1,
            borderRadius: 8,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          {auth.token ? "Ir a mi perfil" : "Registrarme ahora"}
        </Button>
      </Box>
    </Container>
  );
};

export default Instructive;
