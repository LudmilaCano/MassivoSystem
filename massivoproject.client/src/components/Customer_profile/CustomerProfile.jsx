import React, { useEffect, useState } from "react";
import './CustomerProfile.css';
import {
  Button,
  Typography,
  TextField,
  Avatar,
  Modal,
  Box,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Colors from "../../layout/Colors";
import { useSelector } from "react-redux";
import { getUserById, updateUser } from "../../api/UserEndpoints";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

const CustomerProfile = () => {
  const { userId } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [open, setOpen] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        setUserData(data);
        setEditData(data);
        if (data.profilePic) {
          setProfilePic(data.profilePic); // solo si usás imagenes base64 o URL
        }
      } catch (error) {
        console.error("Error cargando datos del usuario:", error);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      await updateUser(userId, editData);
      setUserData(editData);
      setOpen(false);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 1500);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        setEditData({ ...editData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!userData) return <div>Cargando datos del perfil...</div>;

  return (
    <div className="container">
      <div className="profile-section">
        <div className="profile-pic-placeholder">
          <Avatar src={profilePic} sx={{ width: 120, height: 120 }} />
        </div>

        <h2>Datos personales</h2>

        <div className="form-group">
          <label>Nombre</label>
          <input type="text" value={userData.firstName} disabled />
        </div>
        <div className="form-group">
          <label>Apellido</label>
          <input type="text" value={userData.lastName} disabled />
        </div>
        <div className="form-group">
          <label>DNI</label>
          <input type="text" value={userData.identificationNumber} disabled />
        </div>
        <div className="form-group">
          <label>Mail</label>
          <input type="email" value={userData.email} disabled />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="text" value={userData.phone} disabled />
        </div>

        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: Colors.celeste,
            color: 'white',
            borderRadius: 3,
            mt: 1,
            '&:hover': {
              backgroundColor: '#0ea5e9'
            }
          }}
        >
          Editar perfil
        </Button>

        <Modal open={guardado} onClose={() => setGuardado(false)}>
          <Box sx={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -30%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
            <Alert severity="success" sx={{ width: '100%', textAlign: 'center' }}>
              ¡Datos guardados correctamente!
            </Alert>
          </Box>
        </Modal>
      </div>

      {/* MODAL EDICIÓN */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={1}>Editar perfil</Typography>

          <Avatar src={profilePic} sx={{ width: 80, height: 80, alignSelf: 'center' }} />
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <TextField
            label="Nombre"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            fullWidth
          />
          <TextField
            label="Apellido"
            value={editData.lastname}
            onChange={(e) => setEditData({ ...editData, lastname: e.target.value })}
            fullWidth
          />
          <TextField
            label="DNI"
            value={editData.dni}
            onChange={(e) => setEditData({ ...editData, dni: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            fullWidth
          />

          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: Colors.celeste,
              color: 'white',
              borderRadius: 3,
              mt: 1,
              '&:hover': {
                backgroundColor: '#0ea5e9'
              }
            }}
          >
            Guardar cambios
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CustomerProfile;
