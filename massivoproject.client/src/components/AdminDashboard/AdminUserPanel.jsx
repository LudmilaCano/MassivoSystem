// AdminUserPanel.jsx
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from "@mui/material";
import { adminUpdateUser } from "../../api/UserEndpoints";
import { getAllProvince } from "../../api/ProvinceEndpoints";
import { getCitiesByProvince } from "../../api/CityEndpoints";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { toggleUserStatus } from "../../api/UserEndpoints";

const AdminUserPanel = ({
  users,
  onRefresh,
  showSuccessAlert,
  showErrorAlert,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState({});
  const [sortedProvinces, setSortedProvinces] = useState([]);
  const [sortedCities, setSortedCities] = useState([]);

  const { userId } = useSelector((state) => state.auth);

  console.log(users);

  // Cargar provincias al montar el componente
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getAllProvince();
        //console.log("Respuesta de getAllProvince:", data);
        setProvinces(data);
      } catch (error) {
        console.error("Error al obtener provincias:", error);
        showErrorAlert("Error al cargar las provincias");
      }
    };
    fetchProvinces();
  }, []);

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      showSuccessAlert("Estado del usuario actualizado correctamente");
      onRefresh(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error toggling user status:", error);
      showErrorAlert("Error al actualizar el estado del usuario");
    }
  };

  // Ordenar provincias alfabéticamente
  useEffect(() => {
    setSortedProvinces(() =>
      [...provinces].sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [provinces]);

  // Ordenar ciudades alfabéticamente
  useEffect(() => {
    setSortedCities(() =>
      [...cities].sort((a, b) => a.name.localeCompare(b.name))
    );
  }, [cities]);

  // Cargar ciudades cuando cambia la provincia seleccionada
  useEffect(() => {
    const fetchCities = async () => {
      if (selectedUser?.provinceId) {
        try {
          const data = await getCitiesByProvince(selectedUser.provinceId);
          setCities(data);
        } catch (error) {
          console.error("Error al obtener ciudades:", error);
          showErrorAlert("Error al cargar las ciudades");
        }
      } else {
        setCities([]);
        if (selectedUser) {
          setSelectedUser((prev) => ({
            ...prev,
            cityId: null,
          }));
        }
      }
    };

    if (selectedUser) {
      fetchCities();
    }
  }, [selectedUser?.provinceId]);

  const handleEditUser = (user) => {
    console.log(user);
    console.log(userId);
    if (user.userId == userId) {
      showErrorAlert(
        "No puedes editar tu propio usuario desde el panel de administración"
      );
      return;
    }

    setSelectedUser({ ...user });
    setErrors({});
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prev) => ({ ...prev, [name]: value }));

    // Si cambia la provincia, resetear la ciudad
    if (name === "provinceId") {
      setSelectedUser((prev) => ({ ...prev, cityId: null }));
    }

    // Limpiar error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedUser.firstName)
      newErrors.firstName = "El nombre es obligatorio";
    if (!selectedUser.lastName)
      newErrors.lastName = "El apellido es obligatorio";
    if (!selectedUser.email) newErrors.email = "El email es obligatorio";
    if (!selectedUser.identificationNumber)
      newErrors.identificationNumber = "El DNI es obligatorio";
    if (!selectedUser.birthDate)
      newErrors.birthDate = "La fecha de nacimiento es obligatoria";
    if (!selectedUser.provinceId)
      newErrors.provinceId = "La provincia es obligatoria";
    if (!selectedUser.cityId) newErrors.cityId = "La ciudad es obligatoria";
    if (!selectedUser.role) newErrors.role = "El rol es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveUser = async () => {
    if (!validateForm()) {
      showErrorAlert("Por favor complete todos los campos obligatorios");
      return;
    }

    try {
      // Crear objeto sin incluir la contraseña
      const userData = {
        userId: selectedUser.userId,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        identificationNumber: selectedUser.identificationNumber,
        birthDate: selectedUser.birthDate,
        cityId: parseInt(selectedUser.cityId),
        provinceId: parseInt(selectedUser.provinceId),
        role: selectedUser.role,
      };

      await adminUpdateUser(selectedUser.userId, userData);
      showSuccessAlert("Usuario actualizado correctamente");
      onRefresh();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating user:", error);
      showErrorAlert(`Error al actualizar usuario: ${error.message}`);
    }
  };

  const handleViewUserDetails = (user) => {
    const content = `
      <div>
        <p><strong>ID:</strong> ${user.userId}</p>
        <p><strong>Nombre:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>DNI:</strong> ${user.identificationNumber}</p>
        <p><strong>Rol:</strong> ${user.role}</p>
        <p><strong>Ciudad:</strong> ${user.city || "No especificada"}</p>
        <p><strong>Provincia:</strong> ${user.province || "No especificada"}</p>
      </div>
    `;

    Swal.fire({
      title: "Detalles de Usuario",
      html: content,
      confirmButtonText: "Cerrar",
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setErrors({});
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
                  {user.userId === userId ? (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled
                      sx={{ mr: 1 }}
                      title="No puedes editar tu propio usuario"
                    >
                      Editar
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditUser(user)}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                  )}
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
                    variant="contained"
                    color={user.isActive === "Active" ? "error" : "success"}
                    onClick={() => handleToggleStatus(user.userId)}
                  >
                    {user.isActive === 0 ? "Desactivar" : "Activar"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Editar Usuario</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
            >
              <TextField
                label="Nombre *"
                name="firstName"
                value={selectedUser.firstName || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
              <TextField
                label="Apellido *"
                name="lastName"
                value={selectedUser.lastName || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
              <TextField
                label="Email *"
                name="email"
                value={selectedUser.email || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="DNI *"
                name="identificationNumber"
                value={selectedUser.identificationNumber || ""}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.identificationNumber}
                helperText={errors.identificationNumber}
              />
              <TextField
                label="Fecha de Nacimiento *"
                name="birthDate"
                type="date"
                value={
                  selectedUser.birthDate
                    ? selectedUser.birthDate.split("T")[0]
                    : ""
                }
                onChange={handleInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                required
                error={!!errors.birthDate}
                helperText={errors.birthDate}
              />

              <FormControl fullWidth required error={!!errors.provinceId}>
                <InputLabel>Provincia *</InputLabel>
                <Select
                  name="provinceId"
                  value={selectedUser.provinceId || ""}
                  onChange={handleInputChange}
                  label="Provincia *"
                >
                  {sortedProvinces.map((province) => (
                    <MenuItem key={province.id} value={province.id}>
                      {province.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.provinceId && (
                  <FormHelperText>{errors.provinceId}</FormHelperText>
                )}
              </FormControl>

              <FormControl
                fullWidth
                required
                error={!!errors.cityId}
                disabled={!selectedUser.provinceId}
              >
                <InputLabel>Ciudad *</InputLabel>
                <Select
                  name="cityId"
                  value={selectedUser.cityId || ""}
                  onChange={handleInputChange}
                  label="Ciudad *"
                  disabled={!selectedUser.provinceId}
                >
                  {sortedCities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.cityId && (
                  <FormHelperText>{errors.cityId}</FormHelperText>
                )}
                {!selectedUser.provinceId && (
                  <FormHelperText>
                    Seleccione una provincia primero
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth required error={!!errors.role}>
                <InputLabel>Rol *</InputLabel>
                <Select
                  name="role"
                  value={selectedUser.role || ""}
                  onChange={handleInputChange}
                  label="Rol *"
                >
                  <MenuItem value="User">Usuario</MenuItem>
                  <MenuItem value="Admin">Administrador</MenuItem>
                  <MenuItem value="Prestador">Prestador</MenuItem>
                </Select>
                {errors.role && <FormHelperText>{errors.role}</FormHelperText>}
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
