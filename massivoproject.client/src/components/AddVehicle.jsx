import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Colors from "../layout/Colors";
import loginIllustration from "../images/add-vehicle.svg";
import Logo2 from "../images/logo2.png";
import { useNavigate } from "react-router";
import useSwalAlert from "../hooks/useSwalAlert";
import axios from "axios";
import { useSelector } from "react-redux";
import { getVehiclesByUserId } from "../api/VehicleEndpoints";

const typeOfVehicles = ["Combi", "Mini-Bus", "Auto", "Colectivo"];

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    patente: "",
    capacidad: "",
    modelo: "",
    tipoVehiculo: "",
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { showAlert } = useSwalAlert();
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    const verificarVehiculos = async () => {
      try {
        //const res = await axios.get(`/api/Vehicle/user/${userId}`);
        //const vehiculos = res.data;
        const vehiculos = await getVehiclesByUserId(userId);

        console.log("Response data de vehiculos", vehiculos);

        if (vehiculos.length > 0) {
          console.log("Tiene vehiculos paso por aca"); // a esto lo comenté pq me pateaba si iba a /add-vehicle
          //navigate("/"); // Si ya tiene vehículo, no necesita estar acá
        }
      } catch (err) {
        console.error("Error al verificar vehículos:", err);
      }
    };

    verificarVehiculos();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    const patenteRegex = /^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\s?\d{3})$/;
    const patente = formData.patente.trim();

    if (!patente) {
      newErrors.patente = "La patente es obligatoria.";
    } else if (!patenteRegex.test(patente)) {
      newErrors.patente = "La patente debe tener el formato AA999AA o AAA 999.";
    }

    if (!formData.modelo) {
      newErrors.modelo = "El modelo (año) es obligatorio.";
    } else if (
      isNaN(formData.modelo) ||
      formData.modelo < 1998 ||
      formData.modelo > currentYear
    ) {
      newErrors.modelo = `El modelo debe ser un año entre 1998 y ${currentYear}.`;
    }

    if (!formData.capacidad) {
      newErrors.capacidad = "La capacidad es obligatoria.";
    } else if (
      isNaN(formData.capacidad) ||
      formData.capacidad <= 3 ||
      formData.capacidad >= 90
    ) {
      newErrors.capacidad =
        "La capacidad debe ser un número mayor a 3 y menor a 90.";
    }

    if (!formData.tipoVehiculo) {
      newErrors.tipoVehiculo = "El tipo de vehículo es obligatorio.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const formattedData = {
        patente: formData.patente,
        capacidad: formData.capacidad,
        modelo: formData.modelo,
        tipoVehiculo: formData.tipoVehiculo,
      };

      try {
        // await axios.post('/api/vehiculos', formattedData); // Descomentar cuando tengas API real
        showAlert(
          "El Vehículo se ha registrado correctamente. Ahora te redirigiremos al inicio.",
          "success"
        );

        setFormData({
          patente: "",
          capacidad: "",
          modelo: "",
          tipoVehiculo: "",
        });

        navigate("/");
      } catch (err) {
        let message = "Ocurrió un error al registrar el vehículo.";
        if (err.response?.data?.message) {
          message = err.response.data.message;
        }
        showAlert(message, "error");
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: Colors.azul,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container sx={{ maxHeight: "90vh", maxWidth: "70vw" }}>
        <Grid
          item
          xs={false}
          md={5}
          sx={{
            backgroundImage: `url(${loginIllustration})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[900],
            backgroundSize: "contain",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} md={7} component={Paper} elevation={6} square>
          <Box
            sx={{
              mt: 4,
              mb: 4,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={Logo2}
              alt="Logo"
              sx={{ width: { xs: "30vw", md: "10vw" }, mb: "3vh" }}
            />
            <Typography variant="h4" gutterBottom>
              Registrar Vehículo
            </Typography>

            <Box sx={{ display: "flex", gap: 2, width: "95%" }}>
              <TextField
                name="patente"
                label="patente"
                size="small"
                fullWidth
                sx={textFieldStyle}
                value={formData.patente}
                onChange={handleChange}
                error={!!errors.patente}
                helperText={errors.patente}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^A-Za-z0-9]/g, "")
                    .toUpperCase();
                }}
              />
              <TextField
                name="capacidad"
                label="capacidad"
                size="small"
                fullWidth
                sx={textFieldStyle}
                value={formData.capacidad}
                onChange={handleChange}
                error={!!errors.capacidad}
                helperText={errors.capacidad}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, width: "95%", mt: 2 }}>
              <TextField
                name="modelo"
                label="modelo"
                type="number"
                size="small"
                fullWidth
                sx={textFieldStyle}
                value={formData.modelo}
                onChange={handleChange}
                error={!!errors.modelo}
                helperText={errors.modelo}
              />
              <TextField
                name="tipoVehiculo"
                select
                label="tipoVehiculo"
                value={formData.tipoVehiculo}
                onChange={handleChange}
                size="small"
                fullWidth
                error={!!errors.tipoVehiculo}
                helperText={errors.tipoVehiculo}
                sx={textFieldStyle}
              >
                {typeOfVehicles.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                mt: 3,
                mb: 2,
                width: "95%",
                backgroundColor: "#139AA0",
              }}
            >
              CONTINUAR
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

const textFieldStyle = {
  "& label.Mui-focused": { color: "#139AA0" },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": { borderColor: "#139AA0" },
  },
  width: { xs: "50vw", md: "20vw" },
};

export default AddVehicle;
