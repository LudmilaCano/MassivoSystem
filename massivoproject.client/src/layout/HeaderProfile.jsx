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
