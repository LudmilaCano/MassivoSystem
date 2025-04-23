import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  Paper,
  Link,
  InputAdornment,
  IconButton,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Colors from '../layout/Colors';
import loginIllustration from '../images/register.svg';
import Logo2 from '../images/logo2.png';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const states = ['Buenos Aires', 'Córdoba', 'Mendoza', 'Santa Fe']; // Example states
const citiesByState = {
  'Buenos Aires': ['La Plata', 'Mar del Plata', 'Tigre'],
  'Córdoba': ['Córdoba', 'Villa Carlos Paz'],
  'Mendoza': ['Mendoza', 'San Rafael'],
  'Santa Fe': ['Rosario', 'Santa Fe Capital'],
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [dob, setDob] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const handlePasswordVisibility = () => setShowPassword(!showPassword);
  const handleRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);

  return (
    <div style={{ backgroundColor: Colors.azul, width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container sx={{ maxHeight: '90vh', maxWidth: '70vw' }}>
        <Grid
          item
          xs={false}
          md={5}
          sx={{
            backgroundImage: `url(${loginIllustration})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} md={7} component={Paper} elevation={6} square>
          <Box
            sx={{
              mt: 4,
              mb: 4,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={Logo2}
              alt="Logo"
              sx={{ width: { xs: '30vw', md: '10vw' }, mb: '3vh' }}
            />

            <Typography variant="h4" gutterBottom>Registrarme</Typography>

            {/* Name row */}
            <Box sx={{ display: 'flex', gap: 2, width: '95%' }}>
              <TextField
                label="Nombre"
                size="small"
                fullWidth
                sx={textFieldStyle}
              />
              <TextField
                label="Apellido"
                size="small"
                fullWidth
                sx={textFieldStyle}
              />
            </Box>

            {/* DNI and Email */}
            <Box sx={{ display: 'flex', gap: 2, width: '95%', mt: 2 }}>
              <TextField
                label="DNI"
                size="small"
                fullWidth
                sx={textFieldStyle}
              />
              <TextField
                label="Email"
                size="small"
                fullWidth
                autoComplete="email"
                sx={textFieldStyle}
              />
            </Box>

            {/* Password */}
            <Box sx={{ display: 'flex', gap: 2, width: '95%', mt: 2 }}>
              <TextField
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                size="small"
                fullWidth
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePasswordVisibility} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Repetir Contraseña"
                type={showRepeatPassword ? 'text' : 'password'}
                size="small"
                fullWidth
                sx={textFieldStyle}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleRepeatPasswordVisibility} edge="end">
                        {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Dropdowns row */}
            <Box sx={{ display: 'flex', gap: 2, width: '95%', mt: 2 }}>
              <TextField
                select
                label="Provincia"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedCity('');
                }}
                size="small"
                fullWidth
                sx={textFieldStyle}
              >
                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    {state}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Ciudad"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedState}
                size="small"
                fullWidth
                sx={textFieldStyle}
              >
                {(citiesByState[selectedState] || []).map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Date picker */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                sx={{mt: 2}}
                label="Fecha de Nacimiento"
                value={dob}
                onChange={(newValue) => setDob(newValue)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" size="small" sx={textFieldStyle} />
                )}
              />
            </LocalizationProvider>

            {/* Submit button */}
            <Button
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                width: '95%',
                backgroundColor: '#139AA0',
              }}
            >
              CONTINUAR
            </Button>

            <Typography variant="body2" sx={{ mt: 1 }}>
              ¿Ya tenés una cuenta? <Link href="/login" sx={{ color: '#139AA0' }}>INICIAR SESIÓN</Link>
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

const textFieldStyle = {
  '& label.Mui-focused': { color: '#139AA0' },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': { borderColor: '#139AA0' },
  },
  width: { xs: '50vw', md: '20vw' },
};

export default Register;
