import React, { useEffect, useState } from "react";
import "./CustomerProfile.css";
import loginIllustration from "../../images/login.svg";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {
  Button,
  Typography,
  TextField,
  Avatar,
  Modal,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Colors from "../../layout/Colors";
import { useSelector } from "react-redux";
import {
  cambiarRolAPrestador,
  getUserById,
  updateUser,
} from "../../api/UserEndpoints";
import { useNavigate } from "react-router";
import useSwalAlert from "../../hooks/useSwalAlert";

import { getVehiclesByUserId } from "../../api/VehicleEndpoints";
import useChangeRol from "../../hooks/useChangeRol";

import useProvinceCitySelector from "../../hooks/useProvinceCitySelector";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90vw",
  maxWidth: 400,
  maxHeight: "90vw",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const CustomerProfile = () => {
  const { userId } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState({});
  const [profilePic, setProfilePic] = useState(null);
  const [open, setOpen] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useSwalAlert();
  const { handleChangeRol } = useChangeRol(setUserData);
  const userIdFromState = useSelector((state) => state.auth.userId);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    provinces,
    cities,
    loadingProvinces,
    loadingCities,
    handleProvinceChange,
  } = useProvinceCitySelector();

  // Control para setear ciudad inicial solo una vez cuando cargan las ciudades
  const [initialCitySet, setInitialCitySet] = useState(false);

  const handleCambiarRol = async () => {
    try {
      await cambiarRolAPrestador();
      showAlert("¡Tu rol ha sido actualizado a Prestador!", "success");
      const updatedUser = await getUserById(userId);
      setUserData(updatedUser);
      navigate("/add-vehicle");
    } catch (error) {
      console.error("Error al cambiar el rol:", error);
      showAlert("Ocurrió un error al cambiar el rol.", "error");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserById(userId);
        console.log(data);
        const provinceId = data.province?.toString() || "";
        const cityId = data.city?.toString() || "";

        setUserData({
          ...data,
          dniNumber: data.identificationNumber || "",
        });

        console.log("Datos del usuario:", data);

        setEditData({
          userId: data.userId,
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          dniNumber: data.identificationNumber || "",
          profilePic: data.profilePic || "",
          password: "",
          birthDate: data.birthDate || "",
          phone: data.phone || "",
          province: data.provinceId,
          city: data.cityId,
          role: data.role || "User",
          isActive: data.isActive ?? 1,
        });

        if (provinceId) {
          await handleProvinceChange(provinceId); // 👈 Esto carga las ciudades correspondientes
        }

        if (data.profilePic) setProfilePic(data.profilePic);
      } catch (error) {
        console.error("Error cargando datos del usuario:", error);
      }
    };

    if (userId) fetchUser();
  }, [userId]);
  // Cuando abrís el modal y editData.province tiene valor, cargamos ciudades y reseteamos el flag
  useEffect(() => {
    if (open && editData.province) {
      handleProvinceChange(editData.province);
    }
  }, [open, editData.province]);

  // Cuando cambian las ciudades y no setearon la ciudad inicial, la seteamos
  useEffect(() => {
    if (open && cities.length > 0 && editData.city && !initialCitySet) {
      // Confirmamos que la ciudad esté en la lista actual
      const cityExists = cities.find((c) => c.id === editData.city);
      if (cityExists) {
        setEditData((prev) => ({ ...prev, city: cityExists.id }));
      } else {
        // Si no está, la reseteamos
        setEditData((prev) => ({ ...prev, city: "" }));
      }
      setInitialCitySet(true);
    }
  }, [cities, open, editData.city, initialCitySet]);

  const handleSave = async () => {
    try {
      let profileImageUrl = editData.profilePic;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await fetch(
          "/api/File/upload/user",
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Error al subir la imagen");
        }

        const data = await response.json();
        profileImageUrl = data.url;
      }
      const payload = {
        UserId: userId,
        FirstName: editData.firstName,
        LastName: editData.lastName,
        DniNumber: editData.dniNumber,
        Email: editData.email,
        Password: editData.password || null,
        City: parseInt(editData.city),
        Province: parseInt(editData.province),
        ProfileImage: profileImageUrl,
      };

      await updateUser(userId, payload);

      setUserData({
        ...userData,
        firstName: editData.firstName,
        lastName: editData.lastName,
        dniNumber: editData.dniNumber,
        email: editData.email,
        city: editData.city,
        province: editData.province,
        profilePic: editData.profilePic || userData.profilePic,
      });

      setOpen(false);
      showAlert("¡Datos guardados correctamente!", "success"); // Aquí la alerta SweetAlert
      navigate("/"); // Redirigir al perfil o a la página deseada
    } catch (error) {
      showAlert("Error al guardar los datos", "error"); // Alerta error
      if (error.response) {
        console.error("Error al actualizar usuario:", error.response.data);
      } else {
        console.error("Error al actualizar usuario:", error.message);
      }
    }
  };

  const handleFileUploaded = (fileUrl) => {
    setProfilePic(fileUrl);
    setEditData({ ...editData, profilePic: fileUrl });
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
    <div
      style={{
        backgroundColor: Colors.azul,
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container sx={{ maxHeight: "80vh", maxWidth: "60vw" }}>
        <Grid
          item
          xs={false}
          md={5}
          sx={{
            backgroundImage: `url(${loginIllustration})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[200]
                : theme.palette.grey[900],
          }}
        />
        <Grid item xs={12} md={7} component={Paper} elevation={6} square>
          <Box
            sx={{
              mt: 1,
              mb: 2,
              mx: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={userData.profileImage || "/path/to/default-avatar.png"}
              sx={{ width: 120, height: 120, mb: 2 }}
            >
              {!userData.profileImage &&
                `${userData.firstName?.[0] || ""}${
                  userData.lastName?.[0] || ""
                }`}
            </Avatar>

            <Typography variant="h5" gutterBottom>
              Datos personales
            </Typography>

            <Box sx={{ width: "100%", maxWidth: 400, mt: 3 }}>
              <TextField
                label="Nombre"
                value={userData.firstName}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                label="Apellido"
                value={userData.lastName}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                label="DNI"
                value={userData.dniNumber}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
              <TextField
                label="Email"
                value={userData.email}
                fullWidth
                disabled
                sx={{ mb: 2 }}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: Colors.celeste,
                color: "white",
                borderRadius: 3,
                mt: 1,
                "&:hover": { backgroundColor: "#0ea5e9" },
              }}
            >
              Editar perfil
            </Button>

            {userData.role === "User" && (
              <Button
                variant="outlined"
                onClick={handleCambiarRol}
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

            {/* MODAL GUARDADO */}
            <Modal open={guardado} onClose={() => setGuardado(false)}>
              <Box
                sx={{
                  position: "absolute",
                  top: "30%",
                  left: "50%",
                  transform: "translate(-50%, -30%)",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 3,
                  borderRadius: 2,
                  minWidth: 300,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                <Alert
                  severity="success"
                  sx={{ width: "100%", textAlign: "center" }}
                >
                  ¡Datos guardados correctamente!
                </Alert>
              </Box>
            </Modal>

            {/* MODAL EDICIÓN */}
            <Modal open={open} onClose={() => setOpen(false)}>
              <Box sx={modalStyle}>
                <Typography variant="h6" mb={1}>
                  Editar perfil
                </Typography>

                <Avatar
                  src={
                    selectedFile
                      ? URL.createObjectURL(selectedFile)
                      : profilePic || userData.profileImage
                  }
                  sx={{ width: 80, height: 80, alignSelf: "center", mb: 2 }}
                >
                  {!profilePic &&
                    !selectedFile &&
                    `${editData.firstName?.[0] || ""}${
                      editData.lastName?.[0] || ""
                    }`}
                </Avatar>

                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="profile-image-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setSelectedFile(file);
                  }}
                />
                <label htmlFor="profile-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Seleccionar Imagen
                  </Button>
                </label>

                <TextField
                  label="Nombre"
                  value={editData.firstName}
                  onChange={(e) =>
                    setEditData({ ...editData, firstName: e.target.value })
                  }
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Apellido"
                  value={editData.lastName}
                  onChange={(e) =>
                    setEditData({ ...editData, lastName: e.target.value })
                  }
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="DNI"
                  value={editData.dniNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, dniNumber: e.target.value })
                  }
                  fullWidth
                  sx={{ mb: 1 }}
                />
                <TextField
                  label="Email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  fullWidth
                  sx={{ mb: 1 }}
                />

                <FormControl fullWidth sx={{ mb: 1 }}>
                  <InputLabel>Provincia</InputLabel>
                  <Select
                    value={editData.province}
                    onChange={(e) => {
                      const provinceId = e.target.value;
                      setEditData({
                        ...editData,
                        province: provinceId,
                        city: "",
                      });
                      handleProvinceChange(provinceId);
                      setInitialCitySet(true);
                    }}
                  >
                    {provinces.map((prov) => (
                      <MenuItem key={prov.id} value={prov.id}>
                        {prov.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 1 }}>
                  <InputLabel>Ciudad</InputLabel>
                  <Select
                    value={editData.city}
                    onChange={(e) =>
                      setEditData({ ...editData, city: e.target.value })
                    }
                    disabled={!editData.province || loadingCities}
                  >
                    {cities.map((city) => (
                      <MenuItem key={city.id} value={city.id}>
                        {city.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    backgroundColor: Colors.celeste,
                    color: "white",
                    borderRadius: 3,
                    mt: 2,
                    "&:hover": { backgroundColor: "#0ea5e9" },
                  }}
                >
                  Guardar cambios
                </Button>
              </Box>
            </Modal>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerProfile;
