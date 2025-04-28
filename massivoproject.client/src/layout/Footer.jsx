import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import Colors from './Colors';  // Asegúrate de importar tus colores desde el archivo de Colors

const Footer = () => {
  return (
    <div style={{ backgroundColor: Colors.azul, padding: '20px', marginTop: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          color: 'white',
        }}
      >
        {/* Sección de texto */}
        <Typography variant="body1" sx={{ flex: 1, textAlign: 'center', marginBottom: '10px' }}>
          © 2025 MassivoProject. Todos los derechos reservados.
        </Typography>

        {/* Enlaces de contacto */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Button
            variant="text"
            sx={{
              color: 'white',
              marginLeft: '10px',
              marginRight: '10px',
              '&:hover': {
                color: Colors.naranjaOscuro,  // Utiliza tu color personalizado
              },
            }}
          >
            Política de Privacidad
          </Button>
          <Button
            variant="text"
            sx={{
              color: 'white',
              marginLeft: '10px',
              marginRight: '10px',
              '&:hover': {
                color: Colors.naranjaOscuro,  // Utiliza tu color personalizado
              },
            }}
          >
            Términos y Condiciones
          </Button>
          <Button
            variant="text"
            sx={{
              color: 'white',
              marginLeft: '10px',
              marginRight: '10px',
              '&:hover': {
                color: Colors.naranjaOscuro,  // Utiliza tu color personalizado
              },
            }}
          >
            Contacto
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default Footer;
