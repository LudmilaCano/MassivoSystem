import React, { useState, useEffect } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import {
  Button,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/AuthSlice";
import {
  setSearchName,
  setSearchDate,
  filterEventsThunk,
} from "../redux/SearchSlice"; // Importa las acciones de búsqueda
import Colors from "./Colors.jsx";
import logo from "../Images/logo2.png";
import { sendUpcomingBookingNotifications } from "../api/BookingEndpoints.jsx";
import { cambiarRolAPrestador, getUserById } from "../api/UserEndpoints";
import useSwalAlert from "../hooks/useSwalAlert";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [openOpciones, setOpenOpciones] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector((state) => state.auth.fullName);
  const role = useSelector((state) => state.auth.role);
  const logueado = !!token;

  // Obtener el estado de búsqueda de Redux
  const { searchName, searchDate } = useSelector((state) => state.search);

  // Determinar si estamos en la página de inicio
  const isHomePage = location.pathname === "/";

    const { showAlert } = useSwalAlert();
    const userId = useSelector((state) => state.auth.userId);

    const handleChangeRol = async () => {
        try {
            await cambiarRolAPrestador();
            showAlert("¡Tu rol ha sido actualizado a Prestador!", "success");
            navigate("/add-vehicle");
        } catch (error) {
            console.error("Error al cambiar el rol:", error);
            showAlert("Ocurrió un error al cambiar el rol.", "error");
        }
    };

  const handleSendReminders = async () => {
    try {
      const mensaje = await sendUpcomingBookingNotifications();
      console.log(mensaje);
    } catch (error) {
      console.error("Error al enviar recordatorios:", error);
      alert("Hubo un error al intentar enviar los recordatorios.");
    }
  };

  const toggleOpciones = () => setOpenOpciones(!openOpciones);
  const toggleDrawer = (open) => () => setDrawerOpen(open);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  // Manejar la búsqueda
  const handleSearch = () => {
    dispatch(filterEventsThunk());
  };

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

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <div style={{ width: 250 }} role="presentation">
          <List>
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
              <ListItem button onClick={() => handleNavigate("/profile")}>
                <ListItemText primary="Perfil" />
              </ListItem>
            )}

            <ListItem
              button
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                })
              }
            >
              <ListItemText primary="Contacto" />
            </ListItem>
            <Divider />

            <ListItem button onClick={() => handleNavigate("/about-us")}>
              <ListItemText primary="Nosotros" />
            </ListItem>
            <Divider />

            {role === "Admin" && (
              <ListItem button onClick={() => handleNavigate("/admin")}>
                <ListItemText primary="Panel Admin" />
              </ListItem>
            )}
            <Divider />

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
                    <ListItem
                      button
                      onClick={() => handleNavigate("/")}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary="Agregar Vehículo a Evento" />
                    </ListItem>
                  </>
                )}
              </List>
            </Collapse>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
