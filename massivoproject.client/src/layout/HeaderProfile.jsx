/*import React from "react";
import { Button, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Colors from "./Colors.jsx";
import logo from "../Images/logo.png";
import { logout } from "../redux/AuthSlice"; // Asegúrate de importar la acción logout de Redux

const HeaderPerfil = () => {
  const { fullName, role } = useSelector((state) => state.auth); // Usamos los datos del estado de Redux
  const dispatch = useDispatch(); // Para despachar la acción de logout
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/"); // Esto navegará a la ruta principal (Home)
  };

  const handleLogout = () => {
    dispatch(logout()); // Despachamos la acción de logout
    navigate("/"); // Redirigimos al usuario a la pantalla de login
  };

  return (
    <div
      style={{
        backgroundColor: Colors.azul,
        width: "100%",
        padding: "10px 20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
        }}
      >
        <div
          style={{
            flex: 0.2,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ width: "auto", height: "7vh", objectFit: "contain" }}
          />
        </div>

        <div
          style={{
            flex: 0.75,
            alignContent: "center",
            justifyContent: "flex-end",
            width: "100%",
            display: "flex",
          }}
        >
          <div
            style={{ alignContent: "center", marginLeft: 10, marginRight: 10 }}
          >
            <Typography
              variant="body1"
              style={{ color: "white", fontWeight: "bold" }}
            >
              {fullName} - {role}
            </Typography>
          </div>

          {role === "Admin" && (
            <div
              style={{
                alignContent: "center",
                marginLeft: 10,
                marginRight: 10,
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderRadius: 15,
                  justifyContent: "center",
                  alignContent: "center",
                  color: Colors.naranjaOscuro,
                  borderColor: Colors.naranjaOscuro,
                  borderWidth: 3,
                  fontWeight: "600",
                }}
                onClick={() => navigate("/admin")}
              >
                Panel Admin
              </Button>
            </div>
          )}

          <div
            style={{ alignContent: "center", marginLeft: 10, marginRight: 10 }}
          >
            <Button
              variant="outlined"
              sx={{
                borderRadius: 15,
                justifyContent: "center",
                alignContent: "center",
                color: Colors.naranjaOscuro,
                borderColor: Colors.naranjaOscuro,
                borderWidth: 3,
                fontWeight: "600",
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
          <div
            style={{ alignContent: "center", marginLeft: 10, marginRight: 10 }}
          >
            <Button
              variant="outlined"
              sx={{
                borderRadius: 15,
                justifyContent: "center",
                alignContent: "center",
                color: Colors.naranjaOscuro,
                borderColor: Colors.naranjaOscuro,
                borderWidth: 3,
                fontWeight: "600",
              }}
              onClick={handleBackToHome}
            >
              MENU
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderPerfil;*/

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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { logout } from "../redux/AuthSlice";
import Colors from "./Colors.jsx";
import logo from "../Images/logo.png";

const HeaderPerfil = () => {
  const { fullName, role, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: Colors.azul }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <img src={logo} alt="Logo" style={{ height: "40px" }} />

          <Typography sx={{ color: "white", fontWeight: "bold" }}>
            {fullName} - {role}
          </Typography>

          <IconButton color="inherit" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
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

              {role === "Admin" && (
                <ListItem button onClick={() => handleNavigate("/admin")}>
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
    </>
  );
};

export default HeaderPerfil;
