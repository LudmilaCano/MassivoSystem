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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
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
import { sendUpcomingBookingNotifications } from "../api/BookingEndpoints.jsx";
import { cambiarRolAPrestador, getUserById } from "../api/UserEndpoints";
import useSwalAlert from "../hooks/useSwalAlert";

const HeaderPerfil = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openActividad, setOpenActividad] = useState(false);
  const [openOpciones, setOpenOpciones] = useState(false);
  const [openPerfil, setOpenPerfil] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  
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
    if (isMobile) setSearchOpen(false);
  };

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

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const toggleOpciones = () => setOpenOpciones(!openOpciones);
  const toggleActividad = () => setOpenActividad(!openActividad);
  const togglePerfil = () => setOpenPerfil(!openPerfil);
  const toggleSearch = () => setSearchOpen(!searchOpen);

  // Renderizar barra de búsqueda según el tamaño de pantalla
  const renderSearchBar = () => {
    if (!isHomePage) return null;

    if (isMobile) {
      return (
        <>
          <IconButton 
            onClick={toggleSearch} 
            sx={{ color: "white", display: { xs: 'block', md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>
          <Collapse in={searchOpen} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000 }}>
            <Box
              sx={{
                backgroundColor: Colors.azul,
                padding: 2,
                borderTop: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: 'column',
                  gap: 1,
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "10px",
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
                  fullWidth
                />
                <TextField
                  type="date"
                  variant="standard"
                  value={searchDate}
                  onChange={(e) => dispatch(setSearchDate(e.target.value))}
                  InputProps={{ disableUnderline: true }}
                  fullWidth
                />
                <Button
                  onClick={handleSearch}
                  variant="contained"
                  sx={{
                    backgroundColor: Colors.azul,
                    color: 'white',
                    "&:hover": { backgroundColor: Colors.azul },
                  }}
                  fullWidth
                >
                  Buscar
                </Button>
              </Box>
            </Box>
          </Collapse>
        </>
      );
    }

    return (
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "0 10px",
          marginRight: "10px",
          flexShrink: 0,
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
          sx={{ 
            width: isTablet ? "150px" : "200px",
            '& input': {
              fontSize: isTablet ? '0.875rem' : '1rem'
            }
          }}
        />
        <TextField
          type="date"
          variant="standard"
          value={searchDate}
          onChange={(e) => dispatch(setSearchDate(e.target.value))}
          InputProps={{ disableUnderline: true }}
          sx={{ 
            width: isTablet ? "110px" : "130px",
            '& input': {
              fontSize: isTablet ? '0.875rem' : '1rem'
            }
          }}
        />
        <Button
          onClick={handleSearch}
          sx={{
            minWidth: "40px",
            color: Colors.azul,
            "&:hover": { backgroundColor: "transparent" },
            fontSize: isTablet ? '0.875rem' : '1rem'
          }}
        >
          Ir
        </Button>
      </Box>
    );
  };

  return (
    <div
      style={{
        backgroundColor: Colors.azul,
        width: "100%",
        padding: isSmall ? "8px 12px" : "10px 20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: 'relative',
        minHeight: isSmall ? '56px' : '64px',
      }}
    >
      {/* Logo y menú hamburguesa */}
      <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <IconButton onClick={toggleDrawer(true)} sx={{ color: "white", p: isSmall ? 1 : 1.5 }}>
          <MenuIcon />
        </IconButton>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img
            src={logo}
            alt="Logo"
            style={{ 
              width: "auto", 
              height: isSmall ? "5vh" : "7vh", 
              marginLeft: isSmall ? 5 : 10,
              minHeight: '32px',
              maxHeight: isSmall ? '40px' : '56px'
            }}
          />
        </Link>
      </div>

      {/* Contenedor central con búsqueda */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        flex: 1,
        justifyContent: isMobile ? 'flex-end' : 'center',
        gap: isMobile ? "8px" : "20px",
        marginLeft: isMobile ? 0 : "20px",
        marginRight: isMobile ? 0 : "20px",
      }}>
        {renderSearchBar()}
      </div>

      {/* Botones de autenticación */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: isSmall ? "4px" : "8px",
        flexShrink: 0
      }}>
        {!logueado ? (
          <>
            <Button
              onClick={() => navigate("/login")}
              variant="contained"
              size={isSmall ? "small" : "medium"}
              sx={{
                borderRadius: 15,
                color: Colors.azul,
                backgroundColor: Colors.naranjaOscuro,
                fontSize: isSmall ? '0.75rem' : '0.875rem',
                padding: isSmall ? '4px 12px' : '6px 16px',
                minWidth: isSmall ? '60px' : 'auto',
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/register")}
              variant="outlined"
              size={isSmall ? "small" : "medium"}
              sx={{
                borderRadius: 15,
                color: Colors.naranjaOscuro,
                borderColor: Colors.naranjaOscuro,
                fontWeight: "600",
                fontSize: isSmall ? '0.75rem' : '0.875rem',
                padding: isSmall ? '4px 12px' : '6px 16px',
                minWidth: isSmall ? '70px' : 'auto',
              }}
            >
              {isSmall ? 'Reg.' : 'Registro'}
            </Button>
          </>
        ) : (
          <Button
            onClick={handleLogout}
            variant="outlined"
            size={isSmall ? "small" : "medium"}
            sx={{
              borderRadius: 15,
              color: Colors.naranjaOscuro,
              borderColor: Colors.naranjaOscuro,
              fontWeight: "600",
              fontSize: isSmall ? '0.75rem' : '0.875rem',
              padding: isSmall ? '4px 12px' : '6px 16px',
              minWidth: isSmall ? '60px' : 'auto',
            }}
          >
            Logout
          </Button>
        )}
      </div>

      {/* Drawer lateral */}
      <Drawer 
        anchor="left" 
        open={drawerOpen} 
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: isSmall ? '280px' : '300px',
            maxWidth: '85vw'
          }
        }}
      >
        <List sx={{ width: '100%', paddingTop: 2 }}>
          <ListItem>
            <Typography variant={isSmall ? "subtitle1" : "h6"} sx={{ 
              wordBreak: 'break-word',
              fontSize: isSmall ? '1rem' : '1.25rem'
            }}>
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
              <ListItem button onClick={togglePerfil}>
                <ListItemText primary="Perfil" />
                {openPerfil ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={openPerfil} timeout="auto" unmountOnExit>
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
            <>
              <ListItem
                button
                onClick={() => handleNavigate("/provider-summary")}
              >
                <ListItemText primary="Estadísticas" />
              </ListItem>
              <ListItem
                button
                onClick={() => handleNavigate("/provider-dashboard")}
              >
                <ListItemText primary="Panel de Gestión" />
              </ListItem>
            </>
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
              </Collapse>
            </>
          )}
          
          {logueado && (
            <>
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
                    <ListItem
                      button
                      onClick={handleSendReminders}
                      sx={{ pl: 4 }}
                    >
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
            </>
          )}
          
          <ListItem button onClick={() => handleNavigate("/about-us")}>
            <ListItemText primary="Nosotros" />
          </ListItem>

          <ListItem button onClick={() => handleNavigate("/contact")}>
            <ListItemText primary="Contacto" />
          </ListItem>

          <ListItem button onClick={() => handleNavigate("/instructivo")}>
            <ListItemText primary="Cómo funciona?" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default HeaderPerfil;