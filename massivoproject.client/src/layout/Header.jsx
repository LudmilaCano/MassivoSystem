import React, { useState } from "react";
import {
  Button,
  Typography,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/AuthSlice";
import Colors from "./Colors.jsx";
import logo from "../Images/logo2.png";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector((state) => state.auth.fullName);
  const role = useSelector((state) => state.auth.role);

  const logueado = !!token;
  const enPerfil = location.pathname === "/profile";

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleNavigate = (path) => {
    navigate(path);
    setDrawerOpen(false);
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
      <div>
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
        <div
          style={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
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

            <ListItem button onClick={() => handleNavigate("about-us")}>
              <ListItemText primary="Nosotros" />
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
            {role === "Prestador" && (
              <ListItem button onClick={() => handleNavigate("/add-event")}>
                <ListItemText primary="Agregar Evento" />
              </ListItem>
            )}
            {role === "Prestador" && (
              <ListItem button onClick={() => handleNavigate("/")}>
                <ListItemText primary="Agregar Vehículo a Evento" />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Header;
