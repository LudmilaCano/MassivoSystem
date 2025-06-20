import React, { useState } from "react";
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
  InputAdornment
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { setSearchName, setSearchDate, filterEventsThunk } from "../redux/SearchSlice"; // Importa las acciones de búsqueda

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/AuthSlice";
import Colors from "./Colors.jsx";
import logo from "../Images/logo.png";

const HeaderPerfil = () => {
  const { fullName, role, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

   // Obtener el estado de búsqueda de Redux
    const { searchName, searchDate } = useSelector(state => state.search);
    
    // Determinar si estamos en la página de inicio
    const isHomePage = location.pathname === '/';
  

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
    setDrawerOpen(false);
  };

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

      <div style={{ display: "flex", alignItems: "center", gap: "140px" }}>
        {/* Mostrar el buscador solo en la página de inicio */}
        {isHomePage && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            backgroundColor: "white", 
            borderRadius: "20px", 
            padding: "0 10px",
            marginRight: "10px"
          }}>
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
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ width: "130px" }}
            />
            <Button 
              onClick={handleSearch}
              sx={{ 
                minWidth: "40px", 
                color: Colors.azul,
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              Ir
            </Button>
          </Box>
        )}
        {token && <Button
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
        </Button>}
      </div>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <List sx={{ width: 250, paddingTop: 2 }}>
          {!token && (
            <>
              <ListItem button onClick={() => handleNavigate("/login")}>
                <ListItemText primary="Login" />
              </ListItem>
              <ListItem button onClick={() => handleNavigate("/register")}>
                <ListItemText primary="Registro" />
              </ListItem>
            </>
          )}

          {token && (
            <>
              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItem>

              <ListItem button onClick={handleLogout}>
                <ListItemText primary="Nosotros" />
              </ListItem>

               <ListItem button onClick={handleLogout}>
                <ListItemText primary="Contacto" />
              </ListItem>

              {role === "Admin" && (
                <ListItem button onClick={() => handleNavigate("/admin-dashboard")}>
                  <ListItemText primary="Panel Admin" />
                </ListItem>
              )}

              {role === "Prestador" && (
                <ListItem button onClick={() => handleNavigate("/add-vehicle")}>
                  <ListItemText primary="Agregar Vehículo" />
                </ListItem>
              )}

              <ListItem button onClick={() => handleNavigate("/profile")}>
                <ListItemText primary="Perfil" />
              </ListItem>
            </>
          )}

          <Divider />

          <ListItem button onClick={() => handleNavigate("/")}>
            <ListItemText primary="Inicio" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default HeaderPerfil;