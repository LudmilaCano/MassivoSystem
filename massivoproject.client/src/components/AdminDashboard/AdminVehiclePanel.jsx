// AdminVehiclePanel.jsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, CircularProgress
} from '@mui/material';
import { adminUpdateVehicle, toggleVehicleStatus } from '../../api/VehicleEndpoints';
import Swal from 'sweetalert2';

const AdminVehiclePanel = ({ vehicles, onRefresh, showSuccessAlert, showErrorAlert }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle({ ...vehicle });
    setErrors({});
    setOpenDialog(true);
  };
  console.log(vehicles)
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

  /*   const handleSaveVehicle = async () => {
      if (!validateForm()) {
        showErrorAlert("Por favor complete todos los campos obligatorios");
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
        showSuccessAlert("Vehículo actualizado correctamente");
        onRefresh();
        handleCloseDialog();
      } catch (error) {
        console.error("Error updating vehicle:", error);
        showErrorAlert(`Error al actualizar vehículo: ${error.message}`);
      }
    }; */
  const handleSaveVehicle = async () => {
    if (!validateForm()) {
      showErrorAlert("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = selectedVehicle.imagePath;

      // Si hay un archivo seleccionado, súbelo primero
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('/api/File/upload/vehicle', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Error al subir la imagen');
        }

        const data = await response.json();
        imageUrl = data.url;
      }

      // Crear objeto con todos los datos, incluyendo la URL de la imagen
      const vehicleData = {
        licensePlate: selectedVehicle.licensePlate,
        name: selectedVehicle.name,
        description: selectedVehicle.description,
        capacity: parseInt(selectedVehicle.capacity),
        type: parseInt(selectedVehicle.type),
        driverName: selectedVehicle.driverName,
        yearModel: parseInt(selectedVehicle.yearModel),
        imagePath: imageUrl
      };

      await adminUpdateVehicle(selectedVehicle.licensePlate, vehicleData);
      showSuccessAlert("Vehículo actualizado correctamente");
      onRefresh();
      handleCloseDialog();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      showErrorAlert(`Error al actualizar vehículo: ${error.message}`);
    } finally {
      setLoading(false);
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

  const handleToggleStatus = async (licensePlate) => {
    try {
      await toggleVehicleStatus(licensePlate);
      showSuccessAlert("Estado del vehículo actualizado correctamente");
      onRefresh();
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      showErrorAlert(`Error al actualizar estado del vehículo: ${error.message}`);
    }
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
                  <Button
                    variant='contained'
                    size="small"
                    onClick={() => handleToggleStatus(vehicle.licensePlate)}
                    sx={{ mr: 1, ml: 1 }}
                  >
                    {vehicle.isActive == 0 ? " Desactivar" : "Activar"}
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
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Imagen del Vehículo</Typography>

                {/* Vista previa de la imagen */}
                {(selectedVehicle.imagePath || selectedFile) && (
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <img
                      src={selectedFile ? URL.createObjectURL(selectedFile) : selectedVehicle.imagePath}
                      alt="Vista previa"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                    />
                  </Box>
                )}

                {/* Selector de archivo */}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="vehicle-image-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setSelectedFile(file);
                    }
                  }}
                />
                <label htmlFor="vehicle-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                  >
                    Seleccionar Imagen
                  </Button>
                </label>
              </Box>
              {/*   <TextField
                label="URL de imagen *"
                name="imagePath"
                value={selectedVehicle.imagePath || ''}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.imagePath}
                helperText={errors.imagePath}
              /> */}
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

export default AdminVehiclePanel;