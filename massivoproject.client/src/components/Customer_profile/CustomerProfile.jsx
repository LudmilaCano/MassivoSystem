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

// ...imports (sin cambios)

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
        console.log("Usuario traído del backend:", data);
        setUserData({
          ...data,
          dniNumber: data.identificationNumber || "", // 👈 TAMBIÉN ACÁ
        });
        setEditData({
          userId: data.userId,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          dniNumber: data.identificationNumber || "", // ✅ cambiamos a dniNumber
          profilePic: data.profilePic || "",
          password: "",
          birthDate: data.birthDate || "",
          phone: data.phone || "",
          province: data.province || "",
          city: data.city || "",
          role: data.role || "User",
          isActive: data.isActive ?? 1,
        });
        

        if (data.profilePic) {
          setProfilePic(data.profilePic);
        }
      } catch (error) {
        console.error("Error cargando datos del usuario:", error);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      const payload = {
        UserId: userId,
        FirstName: editData.firstName,
        LastName: editData.lastName,
        DniNumber: editData.dniNumber, // ✅ este campo con mayúsculas exactas
        Email: editData.email,
        Password: editData.password || null,
        City: editData.city || "",
        Province: editData.province || ""
      };

      console.log("Payload a enviar:", payload);
      await updateUser(userId, payload);

      setUserData({
        ...userData,
        firstName: editData.firstName,
        lastName: editData.lastName,
        dniNumber: editData.dniNumber,
        email: editData.email,
        city: editData.city,
        province: editData.province,
        profilePic: editData.profilePic || userData.profilePic
      });

      setOpen(false);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 1500);
    } catch (error) {
      if (error.response) {
        console.error("Error al actualizar usuario:", error.response.data);
      } else {
        console.error("Error al actualizar usuario:", error.message);
      }
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
          <input type="text" value={userData.dniNumber} disabled /> {/* ✅ */}
        </div>
        <div className="form-group">
          <label>Mail</label>
          <input type="email" value={userData.email} disabled />
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
            value={editData.firstName}
            onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Apellido"
            value={editData.lastName}
            onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
            fullWidth
          />
          <TextField
            label="DNI"
            value={editData.dniNumber} // ✅ corregido aquí
            onChange={(e) => setEditData({ ...editData, dniNumber: e.target.value })}
            fullWidth
          />
          <TextField
            label="Email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
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
