// ProviderVehicle.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { getVehiclesByUserId } from '../../api/VehicleEndpoints';
import { adminUpdateVehicle } from '../../api/VehicleEndpoints';
import Swal from 'sweetalert2';
import useSwalAlert from '../../hooks/useSwalAlert';

const ProviderVehicle = ({ userId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [errors, setErrors] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useSwalAlert();
  

  useEffect(() => {
    fetchVehicles();
  }, [userId]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehiclesByUserId(userId);
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching  vehicles:', error);
      showAlert('Error al cargar los vehiculos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle({...vehicle});
    setErrors({});
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedVehicle(prev => ({ ...prev, [name]: value }));
    // Limpiar error cuando el usuario modifica el campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedVehicle.name) newErrors.name = "El nombre es obligatorio";
    if (!selectedVehicle.description) newErrors.description = "La descripción es obligatoria";
    if (!selectedVehicle.capacity) newErrors.capacity = "La capacidad es obligatoria";
    if (selectedVehicle.type === undefined || selectedVehicle.type === null) newErrors.type = "El tipo es obligatorio";
    if (!selectedVehicle.driverName) newErrors.driverName = "El nombre del conductor es obligatorio";
    if (!selectedVehicle.yearModel) newErrors.yearModel = "El año del modelo es obligatorio";
    if (!selectedVehicle.imagePath) newErrors.imagePath = "La URL de imagen es obligatoria";
    if (selectedVehicle.available === undefined || selectedVehicle.available === null) newErrors.available = "La disponibilidad es obligatoria";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveVehicle = async () => {
    if (!validateForm()) {
      showAlert("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    try {
      // Crear objeto con la estructura esperada por el backend
      const vehicleData = {
        licensePlate: selectedVehicle.licensePlate,
        name: selectedVehicle.name,
        description: selectedVehicle.description,
        capacity: parseInt(selectedVehicle.capacity),
        type: parseInt(selectedVehicle.type),
        driverName: selectedVehicle.driverName,
        yearModel: parseInt(selectedVehicle.yearModel),
        imagePath: selectedVehicle.imagePath
      };

      await adminUpdateVehicle(selectedVehicle.licensePlate, vehicleData);
      //showSuccessAlert("Vehículo actualizado correctamente");
      showAlert("Vehículo actualizado correctamente", "success");
      fetchVehicles(); // Refrescar la lista de vehículos
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      showAlert(`Error al actualizar vehículo: ${error.message}`, "error");
    }
  };

  const handleViewVehicleDetails = (vehicle) => {
    const content = `
      <div>
        <p><strong>Matrícula:</strong> ${vehicle.licensePlate}</p>
        <p><strong>Nombre:</strong> ${vehicle.name || ''}</p>
        <p><strong>Descripción:</strong> ${vehicle.description || ''}</p>
        <p><strong>Tipo:</strong> ${getVehicleTypeName(vehicle.type)}</p>
        <p><strong>Capacidad:</strong> ${vehicle.capacity}</p>
        <p><strong>Conductor:</strong> ${vehicle.driverName || ''}</p>
        <p><strong>Año:</strong> ${vehicle.yearModel || ''}</p>        
      </div>
    `;
    
    Swal.fire({
      title: 'Detalles de Vehículo',
      html: content,
      confirmButtonText: 'Cerrar'
    });
  };

  const getVehicleTypeName = (type) => {
    switch (parseInt(type)) {
      case 0: return 'Combi';
      case 1: return 'MiniBus';
      case 2: return 'Auto';
      case 3: return 'Colectivo';
      default: return 'Desconocido';
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedVehicle(null);
    setErrors({});
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Matrícula</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Conductor</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((vehicle) => (
              <TableRow key={vehicle.licensePlate}>
                <TableCell>{vehicle.licensePlate}</TableCell>
                <TableCell>{vehicle.name}</TableCell>
                <TableCell>{getVehicleTypeName(vehicle.type)}</TableCell>
                <TableCell>{vehicle.capacity}</TableCell>
                <TableCell>{vehicle.driverName}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleEditVehicle(vehicle)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="info"
                    onClick={() => handleViewVehicleDetails(vehicle)}
                  >
                    Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Vehículo</DialogTitle>
        <DialogContent>
          {selectedVehicle && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombre *"
                name="name"
                value={selectedVehicle.name || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
              />
              <TextField
                label="Descripción *"
                name="description"
                value={selectedVehicle.description || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
                required
                error={!!errors.description}
                helperText={errors.description}
              />
              <FormControl fullWidth required error={!!errors.type}>
                <InputLabel>Tipo *</InputLabel>
                <Select
                  name="type"
                  value={selectedVehicle.type || ''}
                  onChange={handleInputChange}
                  label="Tipo *"
                >
                  <MenuItem value={0}>Combi</MenuItem>
                  <MenuItem value={1}>MiniBus</MenuItem>
                  <MenuItem value={2}>Auto</MenuItem>
                  <MenuItem value={3}>Colectivo</MenuItem>
                </Select>
                {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
              </FormControl>
              <TextField
                label="Capacidad *"
                name="capacity"
                type="number"
                value={selectedVehicle.capacity || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.capacity}
                helperText={errors.capacity}
              />
              <TextField
                label="Conductor *"
                name="driverName"
                value={selectedVehicle.driverName || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.driverName}
                helperText={errors.driverName}
              />
              <TextField
                label="Año del modelo *"
                name="yearModel"
                type="number"
                value={selectedVehicle.yearModel || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.yearModel}
                helperText={errors.yearModel}
              />
              <TextField
                label="URL de imagen *"
                name="imagePath"
                value={selectedVehicle.imagePath || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.imagePath}
                helperText={errors.imagePath}
              />
              {/* <FormControl fullWidth required error={!!errors.available}>
                <InputLabel>Disponible *</InputLabel>
                <Select
                  name="available"
                  value={selectedVehicle.available || ''}
                  onChange={handleInputChange}
                  label="Disponible *"
                >
                  <MenuItem value={1}>Sí</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </Select>
                {errors.available && <FormHelperText>{errors.available}</FormHelperText>}
              </FormControl> */}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveVehicle} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProviderVehicle;