import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import Logo2 from '../images/logo2.png';

const NotFound = () => {
  return (
    <div style={{
      backgroundColor: '#F5F5F5',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Grid container sx={{ maxWidth: '70vw', maxHeight: '80vh' }}>
        <Grid item xs={12} component={Paper} elevation={6} square>
          <Box sx={{
            mt: 4,
            mb: 4,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <Box
              component="img"
              src={Logo2}
              alt="Logo"
              sx={{ width: { xs: '40vw', md: '12vw' }, mb: 2 }}
            />
            <Typography variant="h4" gutterBottom>¡Lo sentimos!</Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              No encontramos la página que estás buscando.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Si el problema persiste, escribinos a <a href="mailto:massivoapp@gmail.com">massivoapp@gmail.com</a>.
            </Typography>
            <Link to="/" style={{ textDecoration: 'none', width: '100%' }}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#139AA0',
                  '&:hover': {
                    backgroundColor: '#0f7f85',
                  },
                  maxWidth: '300px',
                }}
              >
                Ir al inicio
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default NotFound;
