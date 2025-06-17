import React, { useState, useEffect } from 'react';
import {
  Container, Box, Typography, TextField, Button, Paper,
  Grid, Avatar, CircularProgress, Alert, Divider, Dialog,
  DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { useSelector } from 'react-redux';
import { getUserById, updateUser, cambiarRolAPrestador } from '../../api/UserEndpoints';
import FileUploader from '../FileUploader/FileUploader';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import Colors from '../../layout/Colors';
import Swal from 'sweetalert2';
import useSwalAlert from '../../hooks/useSwalAlert';

const CustomerProfile = () => {
  const { userId } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { showAlert } = useSwalAlert();

  // Cargar perfil del usuario
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserById(userId);
        setProfile(data);
        setEditData({
          userId: data.userId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          identificationNumber: data.identificationNumber,
          profileImage: data.profileImage
        });
      } catch (error) {
        setError('No se pudo cargar el perfil del usuario');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
  try {
    setSaving(true);

    let profileImageUrl = editData.profileImage;

    // Si hay un archivo seleccionado, súbelo primero
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('https://localhost:7089/api/File/upload/user', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al subir la imagen');
      }

      const data = await response.json();
      profileImageUrl = data.url;
    }

    // Asegúrate de incluir todos los campos necesarios, especialmente las claves foráneas
    const userData = {
      UserId: editData.userId,
      FirstName: editData.firstName,
      LastName: editData.lastName,
      Email: editData.email,
      DniNumber: editData.identificationNumber,
      profileImage: profileImageUrl,
    };

    await updateUser(editData.userId, userData);
    
    // Actualiza el perfil local con los nuevos datos
    setProfile({
      ...profile,
      firstName: editData.firstName,
      lastName: editData.lastName,
      email: editData.email,
      identificationNumber: editData.identificationNumber,
      profileImage: profileImageUrl
    });

    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Perfil actualizado correctamente',
      timer: 2000,
      showConfirmButton: false
    });

    setOpenDialog(false);
    setSelectedFile(null); // Limpiar el archivo seleccionado
  } catch (err) {
  
    showAlert('error', 'Error al actualizar el perfil: ' + (err.message || 'Error desconocido'));
  } finally {
    setSaving(false);
  }
};

  const handleChangeRol = async () => {
    try {
      await cambiarRolAPrestador(userId);
      const updatedProfile = await getUserById(userId);
      setProfile(updatedProfile);
      showAlert('success', 'Rol actualizado a Prestador correctamente');
    } catch (error) {
     
      showAlert('error', 'Error al cambiar el rol: ' + (error.message || 'Error desconocido'));
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">Mi Perfil</Typography>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              backgroundColor: Colors.celeste,
              '&:hover': { backgroundColor: '#0ea5e9' }
            }}
          >
            Editar Perfil
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            {(editData.profileImage || selectedFile) && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Avatar
                  src={selectedFile ? URL.createObjectURL(selectedFile) : editData.profileImage}
                  sx={{ width: 150, height: 150, margin: 'auto' }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography><strong>Nombre:</strong> {profile?.firstName}</Typography>
              <Typography><strong>Apellido:</strong> {profile?.lastName}</Typography>
              <Typography><strong>Email:</strong> {profile?.email}</Typography>
              <Typography><strong>DNI:</strong> {profile?.identificationNumber}</Typography>
              <Typography><strong>Rol:</strong> {profile?.role}</Typography>

              {profile?.role !== "Prestador" && (
                <Button
                  variant="outlined"
                  onClick={handleChangeRol}
                  sx={{
                    mt: 2,
                    borderRadius: 3,
                    borderColor: Colors.celeste,
                    color: Colors.celeste,
                    "&:hover": {
                      backgroundColor: "#e0f7ff",
                      borderColor: Colors.celeste,
                    },
                  }}
                >
                  Cambiar a Prestador
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Diálogo de edición */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Editar Perfil</DialogTitle>
        <DialogContent>
          {editData && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {/* <FileUploader
                onFileUploaded={handleFileUploaded}
                initialImage={editData.profileImage}
                entityType="user"
              /> */}
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setSelectedFile(file);
                  }
                }}
              />
              <label htmlFor="contained-button-file">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                >
                  Seleccionar Imagen
                </Button>
              </label>

              <TextField
                label="Nombre"
                name="firstName"
                value={editData.firstName}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                label="Apellido"
                name="lastName"
                value={editData.lastName}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                fullWidth
              />

              <TextField
                label="DNI"
                name="identificationNumber"
                value={editData.identificationNumber}
                onChange={handleInputChange}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerProfile;
