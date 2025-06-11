import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { getVehiclesByUserId, updateVehicle } from '../api/VehicleEndpoints';
import useSwalAlert from '../hooks/useSwalAlert';
import Colors from '../layout/Colors';
import { VEHICLE_TYPE_ENUM, VEHICLE_TYPE_LABELS } from '../constants/vehicleType';

const ProviderVehicle = ({ userId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const { showAlert } = useSwalAlert();
  const [formData, setFormData] = useState({
    id: null,
    userId: null,
    licensePlate: '',
    name: '',
    description: '',
    imagePath: '',
    driverName: '',
    capacity: '',
    yearModel: '',
    type: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchVehicles();
  }, [userId]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehiclesByUserId(userId);
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      showAlert('Error al cargar los vehículos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormData({
      id: vehicle.id,
      userId: vehicle.userId,
      licensePlate: vehicle.licensePlate,
      name: vehicle.name || '',
      description: vehicle.description || '',
      imagePath: vehicle.imagePath || '',
      driverName: vehicle.driverName || '',
      capacity: vehicle.capacity,
      yearModel: vehicle.yearModel,
      type: vehicle.type,
    });
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'vehicleType') {
      setFormData((prev) => ({
        ...prev,
        type: VEHICLE_TYPE_ENUM[value],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    const plateRegex = /^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\s?\d{3})$/;
    const plate = formData.licensePlate?.trim();

    if (!plate) {
      newErrors.licensePlate = 'La patente es requerida';
    } else if (!plateRegex.test(plate)) {
      newErrors.licensePlate = 'La patente debe tener formato AA999AA o AAA 999';
    }

    if (!formData.yearModel) {
      newErrors.yearModel = 'El año del modelo es requerido';
    } else if (
      isNaN(formData.yearModel) ||
      formData.yearModel < 1998 ||
      formData.yearModel > currentYear
    ) {
      newErrors.yearModel = `El año debe estar entre 1998 y ${currentYear}`;
    }

    if (!formData.capacity) {
      newErrors.capacity = 'La capacidad es requerida';
    } else if (
      isNaN(formData.capacity) ||
      formData.capacity <= 3 ||
      formData.capacity >= 90
    ) {
      newErrors.capacity = 'La capacidad debe ser mayor a 3 y menor a 90';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          id: formData.id,
          userId: Number(userId),
          licensePlate: formData.licensePlate,
          name: formData.name,
          description: formData.description,
          imagePath: formData.imagePath || 'https://picsum.photos/200/300',
          driverName: formData.driverName,
          capacity: Number(formData.capacity),
          yearModel: Number(formData.yearModel),
          type: Number(formData.type),
        };

        await updateVehicle(payload.id, payload);
        showAlert('Vehículo actualizado correctamente', 'success');
        setOpenDialog(false);
        fetchVehicles();
      } catch (error) {
        console.error('Error updating vehicle:', error);
        showAlert('Error al actualizar el vehículo', 'error');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
  };

  if (loading) {
    return <Typography>Cargando vehículos...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Mis Vehículos
      </Typography>

      {vehicles.length === 0 ? (
        <Typography>No tienes vehículos registrados.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: Colors.grisClaro }}>
                <TableCell>Patente</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Conductor</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Año</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>{vehicle.licensePlate}</TableCell>
                  <TableCell>{vehicle.name}</TableCell>
                  <TableCell>{vehicle.driverName}</TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>{vehicle.yearModel}</TableCell>
                  <TableCell>
                    {VEHICLE_TYPE_LABELS[
                      Object.keys(VEHICLE_TYPE_ENUM).find(
                        (key) => VEHICLE_TYPE_ENUM[key] === vehicle.type
                      )
                    ] || 'Desconocido'}
                  </TableCell>
                  <TableCell>
                    <Button
                      startIcon={<Edit />}
                      size="small"
                      onClick={() => handleEditClick(vehicle)}
                      sx={{ color: Colors.azul }}
                    >
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Editar Vehículo</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="licensePlate"
                label="Patente"
                fullWidth
                value={formData.licensePlate}
                onChange={handleChange}
                error={!!errors.licensePlate}
                helperText={errors.licensePlate}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="name"
                label="Nombre del Vehículo"
                fullWidth
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="capacity"
                label="Capacidad"
                type="number"
                fullWidth
                value={formData.capacity}
                onChange={handleChange}
                error={!!errors.capacity}
                helperText={errors.capacity}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="yearModel"
                label="Año del Modelo"
                type="number"
                fullWidth
                value={formData.yearModel}
                onChange={handleChange}
                error={!!errors.yearModel}
                helperText={errors.yearModel}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="vehicleType"
                select
                label="Tipo de Vehículo"
                value={
                  Object.keys(VEHICLE_TYPE_ENUM).find(
                    (key) => VEHICLE_TYPE_ENUM[key] === formData.type
                  ) || ''
                }
                onChange={handleChange}
                fullWidth
              >
                {Object.keys(VEHICLE_TYPE_LABELS).map((type) => (
                  <MenuItem key={type} value={type}>
                    {VEHICLE_TYPE_LABELS[type]}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="driverName"
                label="Nombre del Conductor"
                fullWidth
                value={formData.driverName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ bgcolor: Colors.azul, '&:hover': { bgcolor: Colors.azulOscuro } }}
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProviderVehicle;