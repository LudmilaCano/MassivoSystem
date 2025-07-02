import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Colors from "../layout/Colors";
import Logo2 from "../images/logo2.png";
import loginIllustration from "../images/register.svg";
import useSwalAlert from "../hooks/useSwalAlert";
import { ResetPasswordService } from "../api/AuthenticationEndPoints";

const ResetPasswordWithCode = () => {
  const { showAlert } = useSwalAlert();
  const [email, setEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRecoveryCode, setShowRecoveryCode] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
        await ResetPasswordService(email, recoveryCode, newPassword);
    
        showAlert(
          "Contraseña actualizada correctamente.",
          "success"
        );
        setEmail("");
      } catch (err) {
        showAlert("Error al cambiar la contraseña.", "error");
        console.error('Error: ', err)
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
              Restablecer Contraseña
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
                label="Email"
                type="email"
                size="small"
                fullWidth
                sx={textFieldStyle}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
  label="Clave Provisoria"
  type={showRecoveryCode ? "text" : "password"}
  size="small"
  fullWidth
  sx={textFieldStyle}
  required
  value={recoveryCode}
  onChange={(e) => setRecoveryCode(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowRecoveryCode(!showRecoveryCode)} edge="end">
          {showRecoveryCode ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

              <TextField
  label="Nueva Contraseña"
  type={showNewPassword ? "text" : "password"}
  size="small"
  fullWidth
  sx={textFieldStyle}
  required
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
          {showNewPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


              <Button
                variant="contained"
                type="submit"
                sx={{
                  mt: 2,
                  backgroundColor: "#139AA0",
                }}
              >
                Cambiar Contraseña
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

export default ResetPasswordWithCode;
