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
