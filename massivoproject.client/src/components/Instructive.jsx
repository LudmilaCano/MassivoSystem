import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Divider,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Instructive = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);
  
  // Secciones de instrucciones
  const sections = [
    {
      title: "Reservar un viaje",
      icon: <BookOnlineIcon fontSize="large" sx={{ color: '#139AA0' }} />,
      description: "Aprende cómo reservar un viaje para un evento",
      steps: [
        {
          label: "Buscar un evento",
          description: "Navega a la página principal y utiliza el buscador para encontrar el evento al que deseas asistir. También puedes ver los eventos destacados en el carrusel.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Seleccionar un vehículo",
          description: "Una vez que encuentres el evento, haz clic en 'Buscar vehículo' para ver todos los vehículos disponibles para ese evento. Puedes filtrar por capacidad, tipo de vehículo y más.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Completar la reserva",
          description: "Selecciona el vehículo que prefieras y completa el formulario de reserva. Indica cuántos asientos necesitas y proporciona la información requerida.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Confirmar y pagar",
          description: "Revisa los detalles de tu reserva, confirma y realiza el pago a través de Mercado Pago. Recibirás un correo electrónico con la confirmación y un código QR para el día del evento.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        }
      ]
    },
    {
      title: "Convertirse en prestador",
      icon: <PersonIcon fontSize="large" sx={{ color: '#139AA0' }} />,
      description: "Aprende cómo ofrecer tus vehículos y generar ingresos",
      steps: [
        {
          label: "Cambiar tu rol a prestador",
          description: "Accede a tu perfil y haz clic en el botón 'Cambiar a Prestador'. Esto te dará acceso a las funcionalidades para ofrecer vehículos.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Registrar tu vehículo",
          description: "Completa el formulario con los datos de tu vehículo: marca, modelo, capacidad, año, etc. También puedes subir fotos para que los usuarios puedan ver tu vehículo.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Asociar tu vehículo a eventos",
          description: "Busca eventos disponibles y asocia tu vehículo a ellos, indicando el precio por asiento y la cantidad de asientos disponibles.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Gestionar reservas",
          description: "Desde tu panel de prestador, podrás ver y gestionar todas las reservas que los usuarios hagan para tus vehículos.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        }
      ]
    },
    {
      title: "Crear un evento",
      icon: <EventIcon fontSize="large" sx={{ color: '#139AA0' }} />,
      description: "Aprende cómo crear y gestionar eventos",
      steps: [
        {
          label: "Acceder a la sección de eventos",
          description: "Si eres administrador o prestador, puedes acceder a la opción 'Agregar Evento' desde el menú lateral.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Completar información del evento",
          description: "Ingresa todos los detalles del evento: nombre, descripción, fecha, ubicación, tipo de evento, etc. También puedes subir una imagen representativa.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Publicar el evento",
          description: "Una vez completada la información, haz clic en 'Agregar Evento' para publicarlo. El evento estará disponible para que los prestadores asocien sus vehículos.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        },
        {
          label: "Gestionar el evento",
          description: "Desde tu panel, podrás ver y editar los eventos que has creado, así como ver las estadísticas de reservas.",
          image: "https://qawerk.es/wp-content/uploads/2019/11/iOS_App_Testing.svg"
        }
      ]
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="bold"
          sx={{ mb: 2 }}
        >
          ¿Cómo funciona MassivoApp?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
          Descubre todas las funcionalidades de nuestra plataforma y aprende a sacarle el máximo provecho
        </Typography>
        <Divider sx={{ mt: 4, mb: 6, width: '80px', mx: 'auto', borderWidth: 3, borderColor: '#139AA0' }} />
      </Box>

      {/* Características principales */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 4,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <BookOnlineIcon sx={{ fontSize: 60, color: '#139AA0', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Reserva tu viaje
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Encuentra vehículos disponibles para el evento que deseas asistir y reserva tu lugar de manera rápida y segura.
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ 
                  mt: 3, 
                  borderColor: '#139AA0', 
                  color: '#139AA0',
                  '&:hover': { borderColor: '#0d7e82', backgroundColor: 'rgba(19, 154, 160, 0.1)' }
                }}
                onClick={() => navigate('/')}
              >
                Explorar eventos
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 4,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <DirectionsCarIcon sx={{ fontSize: 60, color: '#139AA0', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ofrece tu vehículo
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Conviértete en prestador, registra tus vehículos y genera ingresos ofreciéndolos para eventos.
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ 
                  mt: 3, 
                  borderColor: '#139AA0', 
                  color: '#139AA0',
                  '&:hover': { borderColor: '#0d7e82', backgroundColor: 'rgba(19, 154, 160, 0.1)' }
                }}
                onClick={() => navigate('/profile')}
              >
                Ser prestador
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 4,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.18)'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: 60, color: '#139AA0', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Crea eventos
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Si eres administrador o prestador, puedes crear y gestionar eventos para que otros usuarios reserven vehículos.
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ 
                  mt: 3, 
                  borderColor: '#139AA0', 
                  color: '#139AA0',
                  '&:hover': { borderColor: '#0d7e82', backgroundColor: 'rgba(19, 154, 160, 0.1)' }
                }}
                onClick={() => navigate(auth.role === 'Admin' || auth.role === 'Prestador' ? '/add-event' : '/login')}
              >
                Crear evento
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Instrucciones detalladas */}
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: 10 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            {section.icon}
            <Typography variant="h4" fontWeight="bold" sx={{ ml: 2 }}>
              {section.title}
            </Typography>
          </Box>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            {section.description}
          </Typography>
          
          <Stepper orientation="vertical" sx={{ mt: 4 }}>
            {section.steps.map((step, stepIndex) => (
              <Step key={stepIndex} active={true}>
                <StepLabel>
                  <Typography variant="h6" fontWeight="bold">
                    {step.label}
                  </Typography>
                </StepLabel>
                <StepContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                  
                  <Card sx={{ maxWidth: 600, mb: 3, borderRadius: 2, overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={step.image}
                      alt={step.label}
                    />
                  </Card>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      ))}

      {/* Beneficios */}
      <Box sx={{ mt: 8, mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, textAlign: 'center' }}>
          Beneficios de usar MassivoApp
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#139AA0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Viajes seguros y confiables" 
                  secondary="Todos los prestadores son verificados y los viajes cuentan con seguimiento en tiempo real."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#139AA0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Ahorro económico" 
                  secondary="Compartir el viaje con otros asistentes reduce significativamente el costo de transporte."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#139AA0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Reducción de la huella de carbono" 
                  secondary="Al compartir vehículos, contribuyes a reducir las emisiones de CO2."
                />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#139AA0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Pagos seguros" 
                  secondary="Utilizamos Mercado Pago para garantizar transacciones seguras y transparentes."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#139AA0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Generación de ingresos extra" 
                  secondary="Si tienes un vehículo, puedes convertirte en prestador y generar ingresos adicionales."
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon sx={{ color: '#139AA0' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Experiencia social" 
                  secondary="Conoce a otras personas que asisten al mismo evento y comparte la experiencia del viaje."
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Box>

      {/* Call to Action */}
      <Box 
        sx={{ 
          mt: 8, 
          p: 6, 
          borderRadius: 4, 
          backgroundColor: '#139AA0',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ¿Listo para comenzar?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
          Ya sea que quieras reservar un viaje, ofrecer tu vehículo o crear un evento, MassivoApp te ofrece todas las herramientas que necesitas.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate(auth.token ? '/profile' : '/register')}
          sx={{ 
            backgroundColor: 'white', 
            color: '#139AA0',
            '&:hover': { backgroundColor: '#f5f5f5' },
            px: 4,
            py: 1.5,
            borderRadius: 8,
            fontWeight: 'bold',
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          {auth.token ? 'Ir a mi perfil' : 'Registrarme ahora'}
        </Button>
      </Box>
    </Container>
  );
};

export default Instructive;
