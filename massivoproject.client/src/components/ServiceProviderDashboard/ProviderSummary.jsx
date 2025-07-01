import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  DirectionsCar,
  EventSeat,
  AttachMoney,
  Cancel,
  Analytics,
  Refresh,
  Warning,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import ProviderEventPanel from './ProviderEventPanel';
import ProviderVehicle from './ProviderVehicle';
import ProviderEventVehicle from './ProviderEventVehicle';
import Colors from '../../layout/Colors';
import { getAllBookings } from '../../api/BookingEndpoints';
import { getEventVehiclesByUserId } from '../../api/EventVehicleEndpoints';
import { getVehiclesByUserId } from '../../api/VehicleEndpoints';

const MetricCard = ({ title, value, subtitle, icon, color = "#139AA0", trend = null, loading = false }) => (
  <Card 
    sx={{ 
      height: '100%', 
      position: 'relative',
      borderRadius: 3,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: "0 12px 32px rgba(0,0,0,0.16)"
      }
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: 'text.secondary', 
            fontSize: '0.95rem',
            fontWeight: 500
          }}
        >
          {title}
        </Typography>
        <Box 
          sx={{ 
            color: color, 
            opacity: 0.8,
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={32} sx={{ color: color }} />
        </Box>
      ) : (
        <>
          <Typography 
            variant="h3" 
            component="div" 
            sx={{ 
              color: color, 
              fontWeight: 'bold', 
              mb: 1,
              fontSize: { xs: '1.8rem', sm: '2.2rem' }
            }}
          >
            {value}
          </Typography>
          
          {subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary', 
                mb: 1,
                fontSize: '0.85rem'
              }}
            >
              {subtitle}
            </Typography>
          )}
          
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <TrendingUp 
                sx={{ 
                  fontSize: 18, 
                  color: trend > 0 ? '#4caf50' : '#f44336',
                  transform: trend > 0 ? 'none' : 'rotate(180deg)'
                }} 
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: trend > 0 ? '#4caf50' : '#f44336',
                  fontWeight: 600
                }}
              >
                {trend > 0 ? '+' : ''}{trend}% vs mes anterior
              </Typography>
            </Box>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const VehicleCapacityCard = ({ vehicles, loading = false }) => (
  <Card 
    sx={{ 
      height: '100%',
      borderRadius: 3,
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            color: '#139AA0',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}
        >
          Capacidad de Vehículos
        </Typography>
        <Box 
          sx={{ 
            color: '#139AA0',
            backgroundColor: '#139AA015',
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <DirectionsCar />
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={32} sx={{ color: '#139AA0' }} />
        </Box>
      ) : (
        <Box sx={{ maxHeight: 320, overflowY: 'auto' }}>
          {vehicles && vehicles.length > 0 ? (
            vehicles.map((vehicle, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3, 
                  p: 3, 
                  bgcolor: '#f8f9fa', 
                  borderRadius: 2,
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: '#f0f0f0',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
  <Box>
    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#333' }}>
      {vehicle.modelo}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: '#555' }}>
      {vehicle.nombreEvento}
    </Typography>
    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
      Salida: {vehicle.fechaSalida}
    </Typography>
  </Box>
  <Chip 
    label={`${vehicle.asientosOcupados}/${vehicle.capacidadTotal}`}
    color={vehicle.asientosDisponibles > 0 ? 'success' : 'error'}
    size="small"
    sx={{ fontWeight: 'bold' }}
  />
</Box>

                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    display: 'block',
                    mb: 1,
                    fontWeight: 500
                  }}
                >
                  Patente: {vehicle.patente}
                </Typography>
                
                <LinearProgress
                  variant="determinate"
                  value={(vehicle.asientosOcupados / vehicle.capacidadTotal) * 100}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: vehicle.asientosDisponibles > 0 ? '#139AA0' : '#f44336',
                      borderRadius: 5
                    }
                  }}
                />
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: vehicle.asientosDisponibles > 0 ? '#4caf50' : '#f44336',
                    mt: 1, 
                    display: 'block',
                    fontWeight: 600
                  }}
                >
                  {vehicle.asientosDisponibles} asientos disponibles
                </Typography>
              </Box>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <DirectionsCar sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No hay vehículos registrados
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </CardContent>
  </Card>
);

const ProviderSummary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  const [dashboardData, setDashboardData] = useState({
    totalIngresos: 0,
    ingresosEsteMes: 0,
    porcentajeCancelaciones: 0,
    viajesCompletados: 0,
    vehiculosActivos: 0,
    asientosTotales: 0,
    asientosOcupados: 0,
    vehicles: []
  });
  const [loading, setLoading] = useState(true);
  const { userId } = useSelector((state) => state.auth);
  // Función para cargar datos del dashboard
const loadDashboardData = async () => {
  setLoading(true);
  try {
    const [bookings, eventVehicles, vehicles] = await Promise.all([
      getAllBookings(),
      getEventVehiclesByUserId(userId),
      getVehiclesByUserId(userId)
    ]);

    const ahora = new Date();
    const mesActual = ahora.getMonth();
    const anioActual = ahora.getFullYear();

    const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
    const anioMesAnterior = mesActual === 0 ? anioActual - 1 : anioActual;

    // Filtrar bookings pagados
    const bookingsPagados = bookings.filter(b => b.payment?.paymentStatus === 0);

    // Filtrar bookings que pertenezcan a los vehículos del prestador (por patente)
    const patentesPrestador = vehicles.map(v => v.licensePlate);
    const bookingsDelPrestadorTotales = bookings.filter(b => 
      b.vehicle && patentesPrestador.includes(b.vehicle.licensePlate)
    );
    const bookingsDelPrestador = bookingsPagados.filter(b => 
      b.vehicle && patentesPrestador.includes(b.vehicle.licensePlate)
    );

    // Ingresos totales
    const ingresosTotales = bookingsDelPrestador.reduce(
      (acc, b) => acc + (b.payment?.amount || 0),
      0
    );

    // Ingresos este mes
    const ingresosEsteMes = bookingsDelPrestador.filter(b => {
      const d = new Date(b.date);
      return d.getMonth() === mesActual && d.getFullYear() === anioActual;
    }).reduce((acc, b) => acc + (b.payment?.amount || 0), 0);

    // Ingresos mes anterior
    const ingresosMesAnterior = bookingsDelPrestador.filter(b => {
      const d = new Date(b.date);
      return d.getMonth() === mesAnterior && d.getFullYear() === anioMesAnterior;
    }).reduce((acc, b) => acc + (b.payment?.amount || 0), 0);

    // Tendencia ingresos
    const tendenciasIngresos = ingresosMesAnterior > 0
      ? ((ingresosEsteMes - ingresosMesAnterior) / ingresosMesAnterior) * 100
      : 0;

    // Últimos 30 días
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);

    // Cancelaciones últimos 30 días para prestador
    const recientesPrestador = bookingsDelPrestadorTotales.filter(b => new Date(b.date) >= hace30Dias);
    const canceladasRecientes = bookingsDelPrestadorTotales.filter(b => b.bookingStatus === 1);
    
    const porcentajeCancelaciones = recientesPrestador.length > 0
      ? ((canceladasRecientes.length / recientesPrestador.length) * 100).toFixed(1)
      : 0;

    // Cancelaciones mes anterior para prestador
    const delMesAnteriorPrestador = bookingsDelPrestadorTotales.filter(b => {
      const d = new Date(b.date);
      return d.getMonth() === mesAnterior && d.getFullYear() === anioMesAnterior;
    });
    const canceladasMesAnterior = delMesAnteriorPrestador.filter(b => b.bookingStatus === 1);
    const porcentajeCancelacionesMesAnterior = delMesAnteriorPrestador.length > 0
      ? (canceladasMesAnterior.length / delMesAnteriorPrestador.length) * 100
      : 0;

    console.log("Cancelaciones % mes anterir: ", porcentajeCancelacionesMesAnterior);  

    // Tendencia cancelaciones
    const tendenciaCancelaciones = porcentajeCancelacionesMesAnterior === 0
      ? 0
      : (((porcentajeCancelaciones - porcentajeCancelacionesMesAnterior) / porcentajeCancelacionesMesAnterior) * 100).toFixed(1);

    // Viajes completados (status 3) para prestador
    const viajesCompletados = bookingsDelPrestador.filter(b => b.bookingStatus === 3).length;

    // Vehículos activos
    console.log("Vehi", vehicles);
    const vehiculosActivos = vehicles.filter(v => v.isActive === 0).length;
    console.log("Veh activos", vehiculosActivos);
    // Asientos totales y ocupados de eventVehicles (que son del usuario)
    // Ya que eventVehicles viene filtrado por userId, es correcto sumar ahí
    const asientosTotales = vehicles.reduce((acc, v) => acc + (v.capacity || 0), 0);
    const asientosOcupados = eventVehicles.reduce((acc, ev) => acc + (ev.occupation || 0), 0);
    const eventVehiclesMapped = eventVehicles
        .filter(ev => ev.event?.isActive === 1) // solo eventos activos
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // ordenar por fecha de salida asc
        .map(ev => ({
            modelo: ev.vehicle?.name || ev.description || "Sin modelo",
            patente: ev.licensePlate || ev.vehicle?.licensePlate || "N/A",
            capacidadTotal: (ev.capacity || 0) + (ev.occupation || 0),
            asientosOcupados: ev.occupation || 0,
            asientosDisponibles: (ev.capacity || 0),
            nombreEvento: ev.event?.name || "Evento sin nombre",
            fechaSalida: ev.date ? new Date(ev.date).toLocaleDateString() : "Sin fecha"
        }));
    console.log("array de vehiculos cargados",eventVehiclesMapped);


    setDashboardData({
      totalIngresos: ingresosTotales,
      ingresosEsteMes,
      tendenciasIngresos: tendenciasIngresos.toFixed(1),
      porcentajeCancelaciones,
      tendenciaCancelaciones,
      viajesCompletados,
      vehiculosActivos,
      asientosTotales,
      asientosOcupados,
     vehicles: eventVehiclesMapped
    });

  } catch (error) {
    console.error('Error loading dashboard data:', error);
    // showAlert o alguna forma de avisar error
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    loadDashboardData();
  }, [userId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  // Cálculo de métricas
  const ocupacionPromedio = dashboardData.asientosTotales > 0 
    ? ((dashboardData.asientosOcupados / dashboardData.asientosTotales) * 100).toFixed(1)
    : 0;

  const asientosDisponibles = dashboardData.asientosTotales - dashboardData.asientosOcupados;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Header mejorado */}
        <Grid item xs={12}>
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: '#139AA0',
                  position: 'relative',
                  fontSize: { xs: '1.8rem', sm: '2.5rem' },
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: 80,
                    height: 4,
                    backgroundColor: '#139AA0',
                    borderRadius: 2,
                  },
                }}
              >
                Dashboard - Prestador
              </Typography>
              <IconButton 
                onClick={handleRefresh} 
                sx={{ 
                  color: '#139AA0',
                  backgroundColor: '#139AA015',
                  '&:hover': {
                    backgroundColor: '#139AA025',
                    transform: 'rotate(180deg)'
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                <Refresh />
              </IconButton>
            </Box>
            <Typography
              variant="body1"
              sx={{ 
                mt: 3, 
                color: 'text.secondary',
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              Monitorea el rendimiento de tus servicios de transporte en tiempo real
            </Typography>
          </Box>
        </Grid>

        {/* Métricas principales con nuevo estilo */}
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ingresos Este Mes"
            value={`$${dashboardData.ingresosEsteMes.toLocaleString()}`}
            subtitle="Pesos argentinos"
            icon={<AttachMoney />}
            color="#4caf50"
            trend={dashboardData.tendenciasIngresos}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Asientos Disponibles"
            value={asientosDisponibles}
            subtitle={`de ${dashboardData.asientosTotales} totales`}
            icon={<EventSeat />}
            color={asientosDisponibles > 10 ? "#4caf50" : "#ff9800"}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="% Cancelaciones"
            value={`${dashboardData.porcentajeCancelaciones}%`}
            subtitle="Últimos 30 días"
            icon={<Cancel />}
            color={dashboardData.porcentajeCancelaciones < 10 ? "#4caf50" : "#f44336"}
            trend={dashboardData.tendenciaCancelaciones}
            loading={loading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Ocupación Promedio"
            value={`${ocupacionPromedio}%`}
            subtitle="Todos los vehículos"
            icon={<Analytics />}
            color={ocupacionPromedio > 70 ? "#4caf50" : "#ff9800"}
            loading={loading}
          />
        </Grid>

        {/* Alerta de capacidad mejorada */}
        {!loading && asientosDisponibles < 10 && (
          <Grid item xs={12}>
            <Alert 
              severity="warning" 
              icon={<Warning />}
              sx={{ 
                mb: 2,
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(255,152,0,0.15)"
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Atención: Capacidad limitada
              </Typography>
              <Typography variant="body2">
                Quedan solo {asientosDisponibles} asientos disponibles. 
                Considera agregar más vehículos o revisar la programación.
              </Typography>
            </Alert>
          </Grid>
        )}

        <Grid item xs={12} md={6}>
          <VehicleCapacityCard vehicles={dashboardData.vehicles} loading={loading} />
        </Grid>

        {/* Resumen de actividad mejorado */}
        <Grid item xs={12} md={6}>
          <Card 
            sx={{ 
              height: '100%',
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    color: '#139AA0',
                    fontWeight: 'bold',
                    fontSize: '1.1rem'
                  }}
                >
                  Resumen de Actividad
                </Typography>
                <Box 
                  sx={{ 
                    color: '#139AA0',
                    backgroundColor: '#139AA015',
                    borderRadius: '50%',
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <DashboardIcon />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Viajes Completados
                  </Typography>
                  <Chip 
                    label={dashboardData.viajesCompletados} 
                    color="success" 
                    sx={{ fontWeight: 'bold' }}
                  />
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Vehículos Activos
                  </Typography>
                  <Chip 
                    label={dashboardData.vehiculosActivos} 
                    sx={{ 
                      backgroundColor: '#139AA0',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    bgcolor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Ingresos Totales
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#139AA0', 
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}
                  >
                    ${dashboardData.totalIngresos.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProviderSummary;