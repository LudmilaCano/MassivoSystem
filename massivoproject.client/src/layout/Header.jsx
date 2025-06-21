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
import { setSearchName, setSearchDate, filterEventsThunk } from "../redux/SearchSlice"; // Importa las acciones de búsqueda
import Colors from "./Colors.jsx";
import logo from "../Images/logo2.png";
import useChangeRol from "../hooks/useChangeRol.jsx";
import { sendUpcomingBookingNotifications } from "../api/BookingEndpoints.jsx";

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
  const { searchName, searchDate } = useSelector(state => state.search);
  
  // Determinar si estamos en la página de inicio
  const isHomePage = location.pathname === '/';

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
        {/* El contenido del drawer no cambia */}
        <div style={{ width: 250 }} role="presentation">
          {/* ... resto del código del drawer ... */}
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
