// src/components/AdminEventPanel.jsx
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { adminUpdateEvent } from '../api/EventEndpoints';
import Swal from 'sweetalert2';

const AdminEventPanel = ({ events, onRefresh, showSuccessAlert, showErrorAlert }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEditEvent = (event) => {
    setSelectedEvent({...event});
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = async () => {
    try {
      // Crear objeto con la estructura esperada por el backend
      const eventData = {
        eventId: selectedEvent.eventId,
        name: selectedEvent.name,
        description: selectedEvent.description,
        eventDate: selectedEvent.eventDate,
        type: parseInt(selectedEvent.type),
        image: selectedEvent.image || "",
        locationId: selectedEvent.locationId,
        userId: selectedEvent.userId
      };

      await adminUpdateEvent(selectedEvent.eventId, eventData);
      showSuccessAlert("Evento actualizado correctamente");
      onRefresh();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating event:", error);
      showErrorAlert(`Error al actualizar evento: ${error.message}`);
    }
  };

  const handleViewEventDetails = (event) => {
    const content = `
      <div>
        <p><strong>ID:</strong> ${event.eventId}</p>
        <p><strong>Nombre:</strong> ${event.name}</p>
        <p><strong>Descripción:</strong> ${event.description || 'Sin descripción'}</p>
        <p><strong>Ubicación:</strong> ${event.location || 'No especificada'}</p>
        <p><strong>Fecha:</strong> ${new Date(event.eventDate).toLocaleDateString()}</p>
        <p><strong>Tipo:</strong> ${getEventTypeName(event.type)}</p>
        <p><strong>Usuario ID:</strong> ${event.userId}</p>
        <p><strong>Imagen:</strong> ${event.image ? 'Sí' : 'No'}</p>
      </div>
    `;
    
    Swal.fire({
      title: 'Detalles de Evento',
      html: content,
      confirmButtonText: 'Cerrar'
    });
  };

  const getEventTypeName = (type) => {
    switch (parseInt(type)) {
      case 0: return 'Concierto';
      case 1: return 'Deportivo';
      case 2: return 'Festival';
      case 3: return 'Conferencia';
      case 4: return 'Otro';
      default: return 'Desconocido';
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Ubicación</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.eventId}>
                <TableCell>{event.eventId}</TableCell>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{new Date(event.eventDate).toLocaleDateString()}</TableCell>
                <TableCell>{getEventTypeName(event.type)}</TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleEditEvent(event)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="info"
                    onClick={() => handleViewEventDetails(event)}
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
        <DialogTitle>Editar Evento</DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombre"
                name="name"
                value={selectedEvent.name || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Descripción"
                name="description"
                value={selectedEvent.description || ''}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Fecha"
                name="eventDate"
                type="datetime-local"
                value={selectedEvent.eventDate ? selectedEvent.eventDate.split('.')[0] : ''}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="type"
                  value={selectedEvent.type || 0}
                  onChange={handleInputChange}
                  label="Tipo"
                >
                  <MenuItem value={0}>Concierto</MenuItem>
                  <MenuItem value={1}>Deportivo</MenuItem>
                  <MenuItem value={2}>Festival</MenuItem>
                  <MenuItem value={3}>Conferencia</MenuItem>
                  <MenuItem value={4}>Otro</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="URL de imagen"
                name="image"
                value={selectedEvent.image || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="ID de ubicación"
                name="locationId"
                type="number"
                value={selectedEvent.locationId || ''}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveEvent} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminEventPanel;
