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

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleAdminPanel = () => {
    navigate("/admin");
  };

  const handleAboutUs = () => {
    navigate("/about-us");
  };

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
          {!logueado && !enPerfil && (
            <>
              <Button  onClick={handleAboutUs} variant="text" sx={{ color: "white", marginX: 1 }}>
                Nosotros
              </Button>
              <Button
                variant="text"
                sx={{ color: "white", marginX: 1 }}
                onClick={handleContacto}
              >
                Contacto
              </Button>
              <Button
                variant="contained"
                onClick={handleLogin}
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
                onClick={handleRegister}
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
          )}

          {logueado && !enPerfil && (
            <>
              <Button
                onClick={handleProfile}
                variant="outlined"
                sx={{
                  borderRadius: 15,
                  color: Colors.naranjaOscuro,
                  borderColor: Colors.naranjaOscuro,
                  fontWeight: "600",
                  marginX: 1,
                }}
              >
                Profile
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
                    marginX: 1,
                  }}
                >
                  Agregar Vehículo
                </Button>
              )}

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
            </>
          )}

          {logueado && enPerfil && (
            <>
              <Typography
                variant="body1"
                style={{
                  color: "white",
                  fontWeight: "bold",
                  marginRight: 10,
                  alignSelf: "center",
                }}
              >
                {fullName} - {role}
              </Typography>

              {role === "Admin" && (
                <Button
                  variant="outlined"
                  onClick={handleAdminPanel}
                  sx={{
                    borderRadius: 15,
                    color: Colors.naranjaOscuro,
                    borderColor: Colors.naranjaOscuro,
                    fontWeight: "600",
                    marginX: 1,
                  }}
                >
                  Panel Admin
                </Button>
              )}
              {role === "Prestador" && (
                <Button
                  onClick={() => navigate("/add-vehicle")}
                  variant="contained"
                  sx={{
                    borderRadius: 15,
                    backgroundColor: Colors.naranjaOscuro,
                    color: Colors.azul,
                    fontWeight: "600",
                    marginX: 1,
                  }}
                >
                  Agregar Vehículo
                </Button>
              )}

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
              <Button
                onClick={handleHome}
                variant="outlined"
                sx={{
                  borderRadius: 15,
                  color: Colors.naranjaOscuro,
                  borderColor: Colors.naranjaOscuro,
                  fontWeight: "600",
                  marginX: 1,
                }}
              >
                Home
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
