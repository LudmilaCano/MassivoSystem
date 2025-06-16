// src/components/ServiceProviderDashboard/ProviderEventVehiclePanel.jsx
import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Box, Grid, CircularProgress, Typography
} from '@mui/material';
import { getEventVehiclesByUserId, getEventVehicleById, updateEventVehicle } from '../../api/EventEndpoints';
import Swal from 'sweetalert2';
import useSwalAlert from '../../hooks/useSwalAlert';

const ProviderEventVehicle = ({ userId }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEventVehicle, setSelectedEventVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [eventVehicles, setEventVehicles] = useState([]);
  const { showAlert } = useSwalAlert();

  useEffect(() => {
    fetchEventVehicles();
  }, [userId]);

  const fetchEventVehicles = async () => {
    try {
      setLoading(true);
      const data = await getEventVehiclesByUserId(userId);
      setEventVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching event vehicles:', error);
      showAlert('Error al cargar los viajes', 'error');
      setEventVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditEventVehicle = async (eventVehicleId) => {
    setDialogLoading(true);
    setErrors({});
    
    try {
      setOpenDialog(true);
      const eventVehicleData = await getEventVehicleById(eventVehicleId);
      setSelectedEventVehicle(eventVehicleData);
    } catch (error) {
      console.error("Error al preparar el formulario:", error);
      showAlert("Error al cargar los datos del viaje", "error");
      handleCloseDialog();
    } finally {
      setDialogLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEventVehicle(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedEventVehicle.price || selectedEventVehicle.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }
    
    if (!selectedEventVehicle.date) {
      newErrors.date = "La fecha es requerida";
    }
    
    if (!selectedEventVehicle.description) {
      newErrors.description = "La descripción es requerida";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEventVehicle = async () => {
    if (!validateForm()) {
      showAlert("Por favor complete todos los campos obligatorios", "error");
      return;
    }

    try {
      const eventVehicleData = {
        eventVehicleId: selectedEventVehicle.eventVehicleId,
        price: parseInt(selectedEventVehicle.price),
        date: selectedEventVehicle.date,
        description: selectedEventVehicle.description
      };

      await updateEventVehicle(selectedEventVehicle.eventVehicleId, eventVehicleData);
      showAlert("Viaje actualizado correctamente", "success");
      fetchEventVehicles();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating event vehicle:", error);
      showAlert("Error al actualizar el viaje", "error");
    }
  };

  const handleViewEventVehicleDetails = (eventVehicle) => {
    const content = `
      <div>
        <p><strong>ID:</strong> ${eventVehicle.eventVehicleId}</p>
        <p><strong>Evento:</strong> ${eventVehicle.eventId}</p>
        <p><strong>Vehículo:</strong> ${eventVehicle.licensePlate}</p>
        <p><strong>Precio:</strong> $${eventVehicle.price}</p>
        <p><strong>Fecha:</strong> ${new Date(eventVehicle.date).toLocaleDateString()}</p>
        <p><strong>Descripción:</strong> ${eventVehicle.description || 'Sin descripción'}</p>
      </div>
    `;
    
    Swal.fire({
      title: 'Detalles del Viaje',
      html: content,
      confirmButtonText: 'Cerrar'
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEventVehicle(null);
    setErrors({});
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Mis Viajes
      </Typography>

      {eventVehicles.length === 0 ? (
        <Typography>No tienes viajes registrados.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Evento</TableCell>
                <TableCell>Vehículo</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventVehicles.map((eventVehicle) => (
                <TableRow key={eventVehicle.eventVehicleId}>
                  <TableCell>{eventVehicle.eventId}</TableCell>
                  <TableCell>{eventVehicle.licensePlate}</TableCell>
                  <TableCell>${eventVehicle.price}</TableCell>
                  <TableCell>{new Date(eventVehicle.date).toLocaleDateString()}</TableCell>
                  <TableCell>{eventVehicle.description}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditEventVehicle(eventVehicle.eventVehicleId)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="info"
                      onClick={() => handleViewEventVehicleDetails(eventVehicle)}
                    >
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Viaje</DialogTitle>
        <DialogContent>
          {dialogLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : selectedEventVehicle && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Evento"
                    value={selectedEventVehicle.eventId || ''}
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Vehículo"
                    value={selectedEventVehicle.licensePlate || ''}
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Precio *"
                    name="price"
                    type="number"
                    value={selectedEventVehicle.price || ''}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: <span>$</span>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Fecha *"
                    name="date"
                    type="date"
                    value={selectedEventVehicle.date ? selectedEventVehicle.date.split('T')[0] : ''}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    required
                    error={!!errors.date}
                    helperText={errors.date}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Descripción *"
                    name="description"
                    value={selectedEventVehicle.description || ''}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={3}
                    required
                    error={!!errors.description}
                    helperText={errors.description}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleSaveEventVehicle} 
            variant="contained" 
            color="primary"
            disabled={dialogLoading}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProviderEventVehicle;