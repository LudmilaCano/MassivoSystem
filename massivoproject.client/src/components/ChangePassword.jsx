import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import Colors from "../layout/Colors";
import Logo2 from "../images/logo2.png";
import useSwalAlert from "../hooks/useSwalAlert";
import { ChangePasswordService } from "../api/AuthenticationEndPoints"; // Lo vas a crear

const ChangePassword = () => {
  const { showAlert } = useSwalAlert();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showAlert("Las nuevas contraseñas no coinciden.", "error");
      return;
    }

    try {
      await ChangePasswordService(
        currentPassword,
        newPassword,
        confirmNewPassword
      );
      showAlert("Contraseña cambiada correctamente.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
        showAlert("Error al cambiar la contraseña.", "error");
      console.error('Error', err)
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
            backgroundImage: `url(${Logo2})`,
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
              Cambiar Contraseña
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "95%",
                mt: 2,
                gap: 2,
              }}
            >
              <TextField
                label="Contraseña Actual"
                type="password"
                size="small"
                fullWidth
                sx={textFieldStyle}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                label="Nueva Contraseña"
                type="password"
                size="small"
                fullWidth
                sx={textFieldStyle}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <TextField
                label="Confirmar Nueva Contraseña"
                type="password"
                size="small"
                fullWidth
                sx={textFieldStyle}
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 2,
                  backgroundColor: "#139AA0",
                }}
              >
                Actualizar Contraseña
              </Button>
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

export default ChangePassword;
