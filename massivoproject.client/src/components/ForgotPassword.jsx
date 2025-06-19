import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import Colors from "../layout/Colors";
import Logo2 from "../images/logo2.png";
import loginIllustration from "../images/login.svg";
import useSwalAlert from "../hooks/useSwalAlert";
import { ForgotPasswordService } from "../api/AuthenticationEndPoints";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { showAlert } = useSwalAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    await ForgotPasswordService(email);

    showAlert(
      "Si el correo está registrado, se enviará un email.",
      "success"
    );
    setEmail("");
  } catch (error) {
    showAlert("Error al procesar la solicitud de recuperación.", "error");
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
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[900],
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
              Recuperar Contraseña
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column", width: "95%", mt: 2 }}
            >
              <TextField
                type="email"
                label="Email"
                size="small"
                fullWidth
                required
                sx={textFieldStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ mt: 3, mb: 2, backgroundColor: "#139AA0" }}
              >
                ENVIAR
              </Button>
               <Box
    sx={{
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
      mt: 1,
    }}
  >
    <Typography variant="body2">
      <a href="/reset-password" style={{ color: "#139AA0", textDecoration: "none" }}>
        Ingresar Código de Recuperación
      </a>
    </Typography>
  </Box>
              
            </Box>
            
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
  width: "100%",
};

export default ForgotPassword;
