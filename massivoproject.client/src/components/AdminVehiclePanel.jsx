// AdminVehiclePanel.jsx
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { adminUpdateVehicle } from '../api/VehicleEndpoints';
import Swal from 'sweetalert2';

const AdminVehiclePanel = ({ vehicles, onRefresh, showSuccessAlert, showErrorAlert }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle({...vehicle});
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedVehicle(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveVehicle = async () => {
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
        imagePath: selectedVehicle.imagePath,
        available: parseInt(selectedVehicle.available || 0)
      };

      await adminUpdateVehicle(selectedVehicle.licensePlate, vehicleData);
      showSuccessAlert("Vehículo actualizado correctamente");
      onRefresh();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      showErrorAlert(`Error al actualizar vehículo: ${error.message}`);
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
        <p><strong>Disponible:</strong> ${vehicle.available ? 'Sí' : 'No'}</p>
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
                label="Nombre"
                name="name"
                value={selectedVehicle.name || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Descripción"
                name="description"
                value={selectedVehicle.description || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={2}
              />
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="type"
                  value={selectedVehicle.type || 0}
                  onChange={handleInputChange}
                  label="Tipo"
                >
                  <MenuItem value={0}>Combi</MenuItem>
                  <MenuItem value={1}>MiniBus</MenuItem>
                  <MenuItem value={2}>Auto</MenuItem>
                  <MenuItem value={3}>Colectivo</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Capacidad"
                name="capacity"
                type="number"
                value={selectedVehicle.capacity || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Conductor"
                name="driverName"
                value={selectedVehicle.driverName || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Año del modelo"
                name="yearModel"
                type="number"
                value={selectedVehicle.yearModel || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="URL de imagen"
                name="imagePath"
                value={selectedVehicle.imagePath || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Disponible</InputLabel>
                <Select
                  name="available"
                  value={selectedVehicle.available || 0}
                  onChange={handleInputChange}
                  label="Disponible"
                >
                  <MenuItem value={1}>Sí</MenuItem>
                  <MenuItem value={0}>No</MenuItem>
                </Select>
              </FormControl>
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

export default AdminVehiclePanel;
