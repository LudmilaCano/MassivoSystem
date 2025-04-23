import React, { useState } from "react";
import './CustomerProfile.css';
import {
  Button,
  Typography,
  TextField,
  Avatar,
  Modal,
  Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Colors from "../../layout/Colors";


import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';


import Check from '@mui/icons-material/Check';
import Close from '@mui/icons-material/Close';


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
  const [mail, setMail] = useState("augusto.poratti1@gmail.com");
  const [phone, setPhone] = useState("3416742357");
  const [name, setName] = useState("Augusto");
  const [lastname, setLastname] = useState("Poratti");
  const [dni, setDni] = useState("45414516");
  const [guardado, setGuardado] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setOpen(false);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 1500);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <div className="profile-section">
        <div className="profile-pic-placeholder" >

          <Avatar src={profilePic} sx={{ width: 120, height: 120 }} />

        </div>

        <h2>Datos personales</h2>
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" value={name} disabled />
        </div>
        <div className="form-group">
          <label>Apellido</label>
          <input type="text" value={lastname} disabled />
        </div>
        <div className="form-group">
          <label>DNI</label>
          <input type="text" value={dni} disabled />
        </div>
        <div className="form-group">
          <label>Mail</label>
          <input type="email" value={mail} disabled />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input type="text" value={phone} disabled />
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
              backgroundColor: '#0ea5e9' // un celeste un poco más oscuro para el hover
            }
          }}
        >
          Editar perfil
        </Button>

        <Modal open={guardado} onClose={() => setGuardado(false)}>
          <Box
            sx={{
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
            }}
          >
            <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
            <Alert severity="success" sx={{ width: '100%', textAlign: 'center' }}>
              ¡Datos guardados correctamente!
            </Alert>
          </Box>
        </Modal>



      </div>

      <div className="event-section">
        <div className="event-card">
          <div className="event-header">
            <div className="event-title">Argentina VS Brasil</div>
          </div>
          <div className="form-group">
            <label>Fecha</label>
            <input type="text" />
          </div>
          <div className="form-group">
            <label>Vehículo</label>
            <input type="text" />
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" mb={1}>Editar perfil</Typography>

          <Avatar src={profilePic} sx={{ width: 80, height: 80, alignSelf: 'center' }} />

          <input type="file" accept="image/*" onChange={handleImageChange} />
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Lastname"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            fullWidth
          />
          <TextField
            label="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mail"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
                backgroundColor: '#0ea5e9' // un celeste un poco más oscuro para el hover
              }
            }}>
            Guardar cambios
          </Button>

        </Box>
      </Modal>
    </div>
  );
};

export default CustomerProfile;
