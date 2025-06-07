import React from "react";
import { Button, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/AuthSlice";
import Colors from "./Colors.jsx";
import logo from "../Images/logo2.png";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const token = useSelector((state) => state.auth.token);
  const fullName = useSelector((state) => state.auth.fullName);
  const role = useSelector((state) => state.auth.role);

  const logueado = !!token;
  const enPerfil = location.pathname === "/profile";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleProfile = () => navigate("/profile");
  const handleHome = () => navigate("/");
  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handleAdminPanel = () => navigate("/admin");
  const handleAboutUs = () => navigate("/about-us");
  const handleContacto = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={handleHome} style={{ flex: 0.2 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ width: "auto", height: "7vh", objectFit: "contain" }}
          />
        </Button>

        <div
          style={{
            flex: 0.75,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            variant="text"
            onClick={handleAboutUs}
            sx={{ color: "white", mx: 1 }}
          >
            Nosotros
          </Button>
          <Button
            variant="text"
            onClick={handleContacto}
            sx={{ color: "white", mx: 1 }}
          >
            Contacto
          </Button>

          {!logueado && (
            <>
              <Button
                onClick={handleLogin}
                variant="contained"
                sx={{
                  borderRadius: 15,
                  color: Colors.azul,
                  backgroundColor: Colors.naranjaOscuro,
                  mx: 1,
                }}
              >
                Iniciar Sesión
              </Button>
              <Button
                onClick={handleRegister}
                variant="outlined"
                sx={{
                  borderRadius: 15,
                  color: Colors.naranjaOscuro,
                  borderColor: Colors.naranjaOscuro,
                  fontWeight: "600",
                  mx: 1,
                }}
              >
                Registro
              </Button>
            </>
          )}

          {logueado && (
            <>
              <Button
                onClick={handleProfile}
                variant="outlined"
                sx={{
                  borderRadius: 15,
                  color: Colors.naranjaOscuro,
                  borderColor: Colors.naranjaOscuro,
                  fontWeight: "600",
                  mx: 1,
                }}
              >
                Perfil
              </Button>

              {role === "Prestador" && (
                <Button
                  onClick={() => navigate("/add-vehicle")}
                  variant="contained"
                  sx={{
                    borderRadius: 15,
                    backgroundColor: Colors.naranjaOscuro,
                    color: Colors.azul,
                    fontWeight: "600",
                    mx: 1,
                  }}
                >
                  Agregar Vehículo
                </Button>
              )}

              {enPerfil && (
                <>
                  <Typography
                    variant="body1"
                    sx={{ color: "white", fontWeight: "bold", mr: 2 }}
                  >
                    {fullName} - {role}
                  </Typography>

                  {role === "Admin" && (
                    <Button
                      onClick={handleAdminPanel}
                      variant="outlined"
                      sx={{
                        borderRadius: 15,
                        color: Colors.naranjaOscuro,
                        borderColor: Colors.naranjaOscuro,
                        fontWeight: "600",
                        mx: 1,
                      }}
                    >
                      Panel Admin
                    </Button>
                  )}
                </>
              )}

              <Button
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  borderRadius: 15,
                  color: Colors.naranjaOscuro,
                  borderColor: Colors.naranjaOscuro,
                  fontWeight: "600",
                  mx: 1,
                }}
              >
                Cerrar Sesión
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
