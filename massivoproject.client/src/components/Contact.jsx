import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import SendIcon from "@mui/icons-material/Send";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { sendContactMessage } from "../api/ContactEndpoints";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error cuando el usuario escribe
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "El asunto es obligatorio";
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio";
    }

    if (!formData.reason) {
      newErrors.reason = "Por favor selecciona un motivo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await sendContactMessage(formData);

        setSnackbar({
          open: true,
          message:
            "¡Mensaje enviado correctamente! Te responderemos a la brevedad.",
          severity: "success",
        });

        // Limpiar formulario
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          reason: "",
        });
      } catch (error) {
        console.error("Error al enviar el mensaje de contacto:", error);
        setSnackbar({
          open: true,
          message:
            "Ocurrió un error al enviar tu mensaje. Por favor intentá nuevamente más tarde.",
          severity: "error",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: "Por favor completá todos los campos requeridos",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const contactReasons = [
    "Consulta general",
    "Problema con una reserva",
    "Quiero ser prestador",
    "Sugerencia",
    "Otro",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              sx={{
                mb: 2,
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  bottom: -10,
                  left: 0,
                  width: 80,
                  height: 4,
                  backgroundColor: "#139AA0",
                  borderRadius: 2,
                },
              }}
            >
              Contactanos
            </Typography>
            <Typography
              variant="body1"
              sx={{ mt: 4, mb: 4, color: "text.secondary" }}
            >
              ¿Tenés alguna pregunta o sugerencia? Estamos aquí para ayudarte.
              Completá el formulario y te responderemos a la brevedad.
            </Typography>

            <Box sx={{ mt: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <LocationOnIcon
                  sx={{ color: "#139AA0", mr: 2, fontSize: 28 }}
                />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Dirección
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Av. Siempreviva 742, Springfield
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <EmailIcon sx={{ color: "#139AA0", mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    contacto@massivoapp.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <PhoneIcon sx={{ color: "#139AA0", mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Teléfono
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +54 11 1234-5678
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <WhatsAppIcon sx={{ color: "#139AA0", mr: 2, fontSize: 28 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    WhatsApp
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +54 9 11 1234-5678
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            }}
          >
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Nombre completo"
                    fullWidth
                    required
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="reason"
                    select
                    label="Motivo de contacto"
                    fullWidth
                    required
                    value={formData.reason}
                    onChange={handleChange}
                    error={!!errors.reason}
                    helperText={errors.reason}
                  >
                    {contactReasons.map((reason) => (
                      <MenuItem key={reason} value={reason}>
                        {reason}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="subject"
                    label="Asunto"
                    fullWidth
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    name="message"
                    label="Mensaje"
                    multiline
                    rows={5}
                    fullWidth
                    required
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<SendIcon />}
                    sx={{
                      backgroundColor: "#139AA0",
                      "&:hover": { backgroundColor: "#0d7e82" },
                      py: 1.5,
                      borderRadius: 8,
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "1.1rem",
                    }}
                  >
                    Enviar mensaje
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact;
