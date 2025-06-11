// AdminUserPanel.jsx
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Select, MenuItem, Box,
  Chip
} from '@mui/material';
//import { adminUpdateUser, toggleUserStatus } from '../api/UserEndpoints';
import { adminUpdateUser } from '../api/UserEndpoints';
import Swal from 'sweetalert2';

const AdminUserPanel = ({ users, onRefresh, showSuccessAlert, showErrorAlert }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEditUser = (user) => {
    setSelectedUser({...user});
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveUser = async () => {
    try {
      await adminUpdateUser(selectedUser.userId, selectedUser);
      showSuccessAlert("Usuario actualizado correctamente");
      onRefresh();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorAlert(`Error al actualizar usuario: ${error.message}`);
    }
  };

  const handleToggleStatus = async (userId, isActive) => {
    try {
      //await toggleUserStatus(userId, !isActive);
      showSuccessAlert(`Usuario ${!isActive ? 'activado' : 'desactivado'} correctamente`);
      onRefresh();
    } catch (error) {
      console.error("Error toggling user status:", error);
      showErrorAlert(`Error al cambiar estado del usuario: ${error.message}`);
    }
  };

  const handleViewUserDetails = (user) => {
    const content = `
      <div>
        <p><strong>ID:</strong> ${user.userId}</p>
        <p><strong>Nombre:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Rol:</strong> ${user.role}</p>
        <p><strong>Ciudad:</strong> ${user.city || 'No especificada'}</p>
        <p><strong>Provincia:</strong> ${user.province || 'No especificada'}</p>
        <p><strong>Estado:</strong> ${user.isActive ? 'Activo' : 'Inactivo'}</p>
      </div>
    `;
    
    Swal.fire({
      title: 'Detalles de Usuario',
      html: content,
      confirmButtonText: 'Cerrar'
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellido</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive ? "Activo" : "Inactivo"} 
                    color={user.isActive ? "success" : "error"} 
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button 
                    size="small" 
                    variant="outlined"
                    onClick={() => handleEditUser(user)}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color="info"
                    onClick={() => handleViewUserDetails(user)}
                    sx={{ mr: 1 }}
                  >
                    Detalles
                  </Button>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    color={user.isActive ? "error" : "success"}
                    onClick={() => handleToggleStatus(user.userId, user.isActive)}
                  >
                    {user.isActive ? "Desactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nombre"
                name="firstName"
                value={selectedUser.firstName || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Apellido"
                name="lastName"
                value={selectedUser.lastName || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={selectedUser.email || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="DNI"
                name="identificationNumber"
                value={selectedUser.identificationNumber || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Fecha de Nacimiento"
                name="birthDate"
                type="date"
                value={selectedUser.birthDate ? selectedUser.birthDate.split('T')[0] : ''}
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Ciudad ID"
                name="cityId"
                type="number"
                value={selectedUser.cityId || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Provincia ID"
                name="provinceId"
                type="number"
                value={selectedUser.provinceId || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Contraseña"
                name="password"
                type="password"
                value={selectedUser.password || ''}
                onChange={handleInputChange}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Rol</InputLabel>
                <Select
                  name="role"
                  value={selectedUser.role || ''}
                  onChange={handleInputChange}
                  label="Rol"
                >
                  <MenuItem value="User">Usuario</MenuItem>
                  <MenuItem value="Admin">Administrador</MenuItem>
                  <MenuItem value="Prestador">Prestador</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSaveUser} variant="contained" color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminUserPanel;
