import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Box,
  InputAdornment,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../redux/AuthSlice";
import {
  setSearchName,
  setSearchDate,
  filterEventsThunk,
} from "../redux/SearchSlice";
import Colors from "./Colors.jsx";
import logo from "../Images/logo2.png";
import useChangeRol from "../hooks/useChangeRol.jsx";
import { sendUpcomingBookingNotifications } from "../api/BookingEndpoints.jsx";

const HeaderPerfil = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openActividad, setOpenActividad] = useState(false);
  const [openOpciones, setOpenOpciones] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { fullName, role, token } = useSelector((state) => state.auth);
  const { searchName, searchDate } = useSelector((state) => state.search);
  const isHomePage = location.pathname === "/";
  const logueado = !!token;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDrawerOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleSearch = () => {
    dispatch(filterEventsThunk());
  };

  const handleChangeRol = useChangeRol();

  const handleSendReminders = async () => {
    try {
      const mensaje = await sendUpcomingBookingNotifications();
      console.log(mensaje);
    } catch (error) {
      console.error("Error al enviar recordatorios:", error);
      alert("Hubo un error al intentar enviar los recordatorios.");
    }
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const toggleOpciones = () => setOpenOpciones(!openOpciones);
  const toggleActividad = () => setOpenActividad(!openActividad);

  return (
    <div
      style={{
        backgroundColor: Colors.azul,
        width: "100%",
        padding: "10px 20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={toggleDrawer(true)} sx={{ color: "white" }}>
          <MenuIcon />
        </IconButton>
        <img
          src={logo}
          alt="Logo"
          style={{ width: "auto", height: "7vh", marginLeft: 10 }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "140px" }}>
        {isHomePage && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "0 10px",
              marginRight: "10px",
            }}
          >
            <TextField
              placeholder="Buscar evento..."
              variant="standard"
              value={searchName}
              onChange={(e) => dispatch(setSearchName(e.target.value))}
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "200px" }}
            />
            <TextField
              type="date"
              variant="standard"
              value={searchDate}
              onChange={(e) => dispatch(setSearchDate(e.target.value))}
              InputProps={{ disableUnderline: true }}
              sx={{ width: "130px" }}
            />
            <Button
              onClick={handleSearch}
              sx={{
                minWidth: "40px",
                color: Colors.azul,
                "&:hover": { backgroundColor: "transparent" },
              }}
            >
              Ir
            </Button>
          </Box>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!logueado ? (
            <>
              <Button
                onClick={() => navigate("/login")}
                variant="contained"
                sx={{
                  borderRadius: 15,
                  color: Colors.azul,
                  backgroundColor: Colors.naranjaOscuro,
                  marginX: 1,
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/register")}
                variant="outlined"
                sx={{
                  borderRadius: 15,
                  color: Colors.naranjaOscuro,
                  borderColor: Colors.naranjaOscuro,
                  fontWeight: "600",
                  marginX: 1,
                }}
              >
                Registro
              </Button>
            </>
          ) : (
            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                borderRadius: 15,
                color: Colors.naranjaOscuro,
                borderColor: Colors.naranjaOscuro,
                fontWeight: "600",
                marginX: 1,
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </div>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250, paddingTop: 2 }}>
          <ListItem>
            <Typography variant="h6">
              {logueado ? `${fullName} - ${role}` : "Menú"}
            </Typography>
          </ListItem>
          <Divider />

          <ListItem button onClick={() => handleNavigate("/")}>
            <ListItemText primary="Inicio" />
          </ListItem>
          <Divider />

          {logueado && (
            <>
              <ListItem button onClick={toggleOpciones}>
                <ListItemText primary="Perfil" />
                {openOpciones ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openOpciones} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    onClick={() => handleNavigate("/profile")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Mis Datos" />
                  </ListItem>

                  <ListItem
                    button
                    onClick={() => handleNavigate("/change-password")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Cambiar Mi Contraseña" />
                  </ListItem>
                </List>
              </Collapse>
            </>
          )}

          {role === "Admin" && (
            <ListItem button onClick={() => handleNavigate("/admin-dashboard")}>
              <ListItemText primary="Dashboard" />
            </ListItem>
          )}
          {role === "Prestador" && (
            <ListItem
              button
              onClick={() => handleNavigate("/provider-dashboard")}
            >
              <ListItemText primary="Dashboard" />
            </ListItem>
          )}
          {role === "User" && (
            <>
              <ListItem button onClick={toggleActividad}>
                <ListItemText primary="Mi Actividad" />
                {openActividad ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openActividad} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItem
                    button
                    onClick={() => handleNavigate("/booking-list")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Mis Reservas" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => handleNavigate("/review-list-user")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Mis Reseñas" />
                  </ListItem>
                </List>
              </Collapse>{" "}
            </>
          )}
          <ListItem button onClick={toggleOpciones}>
            <ListItemText primary="Opciones" />
            {openOpciones ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openOpciones} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {role === "User" && (
                <ListItem button onClick={handleChangeRol} sx={{ pl: 4 }}>
                  <ListItemText primary="Quiero ser Prestador" />
                </ListItem>
              )}
              {role === "Admin" && (
                <ListItem button onClick={handleSendReminders} sx={{ pl: 4 }}>
                  <ListItemText primary="Enviar recordatorios de eventos" />
                </ListItem>
              )}
              {role === "Prestador" && (
                <>
                  <ListItem
                    button
                    onClick={() => handleNavigate("/add-vehicle")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Agregar Vehículo" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => handleNavigate("/add-event")}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary="Agregar Evento" />
                  </ListItem>
                </>
              )}
            </List>
          </Collapse>

          <ListItem button onClick={() => handleNavigate("/about-us")}>
            <ListItemText primary="Nosotros" />
          </ListItem>

          <ListItem button onClick={() => handleNavigate("/contact")}>
            <ListItemText primary="Contacto" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default HeaderPerfil;
