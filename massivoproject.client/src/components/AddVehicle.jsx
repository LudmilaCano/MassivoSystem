import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Link,
    InputAdornment,
    IconButton,
    MenuItem,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Colors from "../layout/Colors";
import loginIllustration from "../images/add-vehicle.svg";
import Logo2 from "../images/logo2.png";
import { useNavigate } from "react-router-dom";
import useSwalAlert from "../hooks/useSwalAlert";
import { createVehicle } from "../api/VehicleEndpoints";
import {
    VEHICLE_TYPE_ENUM,
    VEHICLE_TYPE_LABELS,
} from "../constants/vehicleType";
import { useSelector } from "react-redux";

const AddVehicle = () => {
    const userId = useSelector((state) => state.auth.userId);
    const [formData, setFormData] = useState({
        userId: null,
        licensePlate: "",
        name: "",
        description: "",
        imagePath: "",
        driverName: "",
        capacity: "",
        yearModel: "",
        type: "",
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [vehicleSelectedFile, setVehicleSelectedFile] = useState(null);

    const { showAlert } = useSwalAlert();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "vehicleType") {
            setFormData((prev) => ({
                ...prev,
                type: VEHICLE_TYPE_ENUM[value],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const currentYear = new Date().getFullYear();

        const plateRegex = /^(?:[A-Z]{2}\d{3}[A-Z]{2}|[A-Z]{3}\s?\d{3})$/;
        const plate = formData.licensePlate?.trim();

        if (!plate) {
            newErrors.licensePlate = "License plate is required.";
        } else if (!plateRegex.test(plate)) {
            newErrors.licensePlate =
                "License plate must be in format AA999AA or AAA 999.";
        }

        if (!formData.yearModel) {
            newErrors.yearModel = "Year model is required.";
        } else if (
            isNaN(formData.yearModel) ||
            formData.yearModel < 1998 ||
            formData.yearModel > currentYear
        ) {
            newErrors.yearModel = `Year must be between 1998 and ${currentYear}.`;
        }

        if (!formData.capacity) {
            newErrors.capacity = "Capacity is required.";
        } else if (
            isNaN(formData.capacity) ||
            formData.capacity <= 3 ||
            formData.capacity >= 90
        ) {
            newErrors.capacity =
                "Capacity must be a number greater than 3 and less than 90.";
        }

        if (
            formData.type === "" ||
            formData.type === null ||
            isNaN(formData.type)
        ) {
            newErrors.vehicleType = "Vehicle type is required.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showAlert("Please fix the form errors.", "error");
        }

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        console.log("formdata: ", formData);

        if (validateForm()) {
            try {
                let imageUrl = null;

                // Si hay un archivo seleccionado, súbelo primero
                if (vehicleSelectedFile) {
                    try {
                        // Intentar usar la función de endpoints si está disponible
                        const { uploadFile } = await import('../api/FileEndpoints');
                        const { url } = await uploadFile(vehicleSelectedFile, 'vehicle');
                        imageUrl = url;
                    } catch (importError) {
                        // Fallback al método directo si no se puede importar
                        const formDataUpload = new FormData();
                        formDataUpload.append('file', vehicleSelectedFile);

                        const response = await fetch('/api/File/upload/vehicle', {
                            method: 'POST',
                            body: formDataUpload
                        });

                        if (!response.ok) {
                            throw new Error('Error al subir la imagen');
                        }

                        const data = await response.json();
                        imageUrl = data.url;
                    }
                }

                console.log("imageUrl: ", imageUrl);

                const payload = {
                    userId: Number(userId),
                    licensePlate: formData.licensePlate,
                    name: formData.name,
                    description: formData.description,
                    imagePath: imageUrl || "https://picsum.photos/200/300",
                    driverName: formData.driverName,
                    capacity: Number(formData.capacity),
                    yearModel: Number(formData.yearModel),
                    type: Number(formData.type),
                };

                console.log("payload content: ", payload);

                await createVehicle(payload);

                showAlert("El vehículo se registró correctamente!", "success");

                setFormData({
                    userId: null,
                    licensePlate: "",
                    name: "",
                    description: "",
                    imagePath: "",
                    driverName: "",
                    capacity: "",
                    yearModel: "",
                    type: "",
                });

                navigate("/");
            } catch (err) {
                console.error("Error: ", err.message);
                showAlert("Algo salió mal...no se puede registrar el vehículo, intentalo más tarde!", "warning");
            }
        }
    };

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
            <Grid container sx={{ maxHeight: "90vh", maxWidth: "70vw" }}>
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
                            mt: 4,
                            mb: 4,
                            mx: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src={Logo2}
                            alt="Logo"
                            sx={{ width: { xs: "30vw", md: "10vw" }, mb: "3vh" }}
                        />
                        <Typography variant="h4" gutterBottom>
                            Registrar vehículo
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2, width: "95%" }}>
                            <TextField
                                name="licensePlate"
                                label="License Plate"
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.licensePlate}
                                onChange={handleChange}
                                error={!!errors.licensePlate}
                                helperText={errors.licensePlate}
                                onInput={(e) => {
                                    e.target.value = e.target.value
                                        .replace(/[^A-Za-z0-9]/g, "")
                                        .toUpperCase();
                                }}
                            />
                            <TextField
                                name="capacity"
                                label="Capacity"
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.capacity}
                                onChange={handleChange}
                                error={!!errors.capacity}
                                helperText={errors.capacity}
                            />
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, width: "95%", mt: 2 }}>
                            <TextField
                                name="yearModel"
                                label="Year Model"
                                type="number"
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.yearModel}
                                onChange={handleChange}
                                error={!!errors.yearModel}
                                helperText={errors.yearModel}
                            />
                            <TextField
                                name="vehicleType"
                                select
                                label="Vehicle Type"
                                value={
                                    Object.keys(VEHICLE_TYPE_ENUM).find(
                                        (key) => VEHICLE_TYPE_ENUM[key] === formData.type
                                    ) || ""
                                }
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                error={!!errors.vehicleType}
                                helperText={errors.vehicleType}
                                sx={textFieldStyle}
                            >
                                {Object.keys(VEHICLE_TYPE_LABELS).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {VEHICLE_TYPE_LABELS[type]}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Box sx={{ display: "flex", gap: 2, width: "95%", mt: 2 }}>
                            <TextField
                                name="name"
                                label="Vehicle Name"
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <TextField
                                name="driverName"
                                label="Driver Name"
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.driverName}
                                onChange={handleChange}
                            />
                        </Box>

                        <Box sx={{ display: "flex", width: "95%", mt: 2 }}>
                            <TextField
                                name="description"
                                label="Description"
                                size="small"
                                fullWidth
                                multiline
                                minRows={2}
                                sx={textFieldStyle}
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </Box>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Foto de vehículo</Typography>

                            {/* Vista previa de la imagen */}
                            {vehicleSelectedFile && (
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <img
                                        src={URL.createObjectURL(vehicleSelectedFile)}
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
                                        setVehicleSelectedFile(file);
                                    }
                                }}
                            />
                            <label htmlFor="vehicle-image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    fullWidth
                                >
                                    Seleccionar Imagen de vehículo
                                </Button>
                            </label>
                        </Grid>

                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                mt: 3,
                                mb: 2,
                                width: "95%",
                                backgroundColor: "#139AA0",
                            }}
                        >
                            CONTINUE
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

const textFieldStyle = {
    "& label.Mui-focused": { color: "#139AA0" },
    "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": { borderColor: "#139AA0" },
    },
    width: { xs: "50vw", md: "20vw" },
};

export default AddVehicle;