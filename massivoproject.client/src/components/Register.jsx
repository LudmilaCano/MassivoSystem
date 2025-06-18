import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Paper, Link, InputAdornment, IconButton, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Colors from '../layout/Colors';
import loginIllustration from '../images/register.svg';
import Logo2 from '../images/logo2.png';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router';
import { createUser } from '../api/UserEndpoints';

import useSwalAlert from '../hooks/useSwalAlert';

import { getAllProvince } from '../api/ProvinceEndpoints';
import { getCitiesByProvince } from '../api/CityEndpoints';
import { uploadFile } from '../api/FileEndpoints';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';



const Register = () => {
    // Estados
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        dni: '',
        email: '',
        password: '',
        repeatPassword: '',
        provincia: null,
        ciudad: null,
        dob: null,
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const { showAlert } = useSwalAlert();


    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    const [sortedProvinces, setSortedProvinces] = useState([]);
    const [sortedCities, setSortedCities] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await getAllProvince();
                setProvinces(data.result);
            } catch (error) {
                console.error("Error al obtener provincias:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        setSortedProvinces(() => [...provinces].sort((a, b) => a.name.localeCompare(b.name)));
    }, [provinces])

    useEffect(() => {
        setSortedCities(() => [...cities].sort((a, b) => a.name.localeCompare(b.name)));
    }, [cities])

    useEffect(() => {
        const fetchCities = async () => {
            if (formData.provincia) {
                try {
                    const data = await getCitiesByProvince(formData.provincia);
                    setCities(data);
                } catch (error) {
                    console.error("Error al obtener ciudades:", error);
                }
            } else {
                setCities([]);
                setFormData((prev) => ({
                    ...prev,
                    ciudad: null,
                }));
            }
        };
        fetchCities();
    }, [formData.provincia, provinces]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        const nameSurnameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;


        if (!nameSurnameRegex.test(formData.nombre) && formData.nombre) {
            newErrors.nombre = 'El nombre solo puede contener letras, espacios y acentos';
        }
        if (!nameSurnameRegex.test(formData.apellido) && formData.apellido) {
            newErrors.apellido = 'El apellido solo puede contener letras, espacios y acentos';
        }

        if (!formData.nombre) {
            newErrors.nombre = 'El nombre es obligatorio';
        }

        if (!formData.apellido) {
            newErrors.apellido = 'El apellido es obligatorio';
        }


        // Validación de DNI
        if (!formData.dni) {
            newErrors.dni = 'El DNI es obligatorio';
        }
        if (formData.dni.length < 8 || formData.dni.length > 8) {
            newErrors.dni = 'El DNI debe tener 8 dígitos';
        }

        // Validación de email
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }

        // Validación de contraseñas
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) { // Suponiendo que la contraseña debe tener al menos 6 caracteres
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // Validación de repetir contraseña

        if (formData.password !== formData.repeatPassword) {
            newErrors.repeatPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.provincia) {
            newErrors.provincia = 'La provincia es obligatoria';
        }

        if (formData.provincia && !formData.ciudad) {
            newErrors.ciudad = 'La ciudad es obligatoria';
        }

        // Validación de fecha de nacimiento (mayoría de edad)
        if (!formData.dob || formData.dob === null) {
            newErrors.dob = 'La fecha de nacimiento es obligatoria';
        } else {
            const today = new Date();
            const birthDate = new Date(formData.dob);
            const age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (age < 18 || (age === 18 && m < 0)) {
                newErrors.dob = 'Debes ser mayor de 18 años';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.match('image.*')) {
            setError('Por favor selecciona una imagen válida');
            return;
        }

        setError(null);
        setSelectedFile(file);

        // Crear preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    const handleSubmit = async () => {

        let profileImageUrl = null;

        // Si hay un archivo seleccionado, súbelo primero
        if (selectedFile) {
            const data = await uploadFile(selectedFile, 'user');
            profileImageUrl = data.url;
        }
        if (validateForm()) {
            const formattedData = {
                firstName: formData.nombre,
                lastName: formData.apellido,
                dniNumber: formData.dni,
                email: formData.email,
                password: formData.password,
                province: formData.provincia,
                city: formData.ciudad,
                birthDate: formData.dob.toISOString().split('T')[0],
                profileImage: profileImageUrl
            };

            console.log(formattedData)
            try {
                await createUser(formattedData);

                showAlert('¡Registro Exitoso!', 'success')
                setFormData({
                    nombre: '',
                    apellido: '',
                    dni: '',
                    email: '',
                    password: '',
                    repeatPassword: '',
                    provincia: null,
                    ciudad: null,
                    dob: null,
                    profileImage: null
                });

                navigate('/');

            } catch (err) {
                let message = 'Ocurrió un error al registrar el usuario.';

                if (err.response?.data?.message) {
                    message = err.response.data.message;
                }
                showAlert(message, 'error');
            }
        }

    };

    return (
        <div style={{ backgroundColor: Colors.azul, width: '100%', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Grid container sx={{ maxHeight: '90vh', maxWidth: '70vw' }}>
                <Grid
                    onClick={() => navigate('/')}
                    item
                    xs={false}
                    md={5}
                    sx={{
                        // Corregido: `url(${variable})` para URLs de imagen
                        backgroundImage: `url(${loginIllustration})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} md={7} component={Paper} elevation={6} square>
                    <Box sx={{ mt: 4, mb: 4, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box component="img" src={Logo2} alt="Logo" sx={{ width: { xs: '30vw', md: '10vw' }, mb: '3vh' }} />
                        <Typography variant="h4" gutterBottom>Registrarme</Typography>

                        {/* Nombre y Apellido */}
                        <Box sx={{ display: 'flex', gap: 2, width: '95%' }}>
                            <TextField name="nombre" label="Nombre" size="small" fullWidth sx={textFieldStyle} value={formData.nombre} onChange={handleChange} error={!!errors.nombre} helperText={errors.nombre} />
                            <TextField name="apellido" label="Apellido" size="small" fullWidth sx={textFieldStyle} value={formData.apellido} onChange={handleChange} error={!!errors.apellido} helperText={errors.apellido} />
                        </Box>

                        {/* DNI y Email */}
                        <Box sx={{ display: 'flex', gap: 2, width: '95%', mt: 2 }}>
                            <TextField
                                name="dni"
                                label="DNI"
                                type="number"
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.dni}
                                onChange={handleChange}
                                error={!!errors.dni}
                                helperText={errors.dni}
                            />
                            <TextField
                                name="email"
                                label="Email"
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Box>

                        {/* Contraseñas */}
                        <Box sx={{ display: 'flex', gap: 2, width: '95%', mt: 2 }}>
                            <TextField
                                name="password"
                                label="Contraseña"
                                type={showPassword ? 'text' : 'password'}
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                name="repeatPassword"
                                label="Repetir Contraseña"
                                type={showRepeatPassword ? 'text' : 'password'}
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                value={formData.repeatPassword}
                                onChange={handleChange}
                                error={!!errors.repeatPassword}
                                helperText={errors.repeatPassword}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowRepeatPassword(!showRepeatPassword)} edge="end">
                                                {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>

                        {/* Provincia y Ciudad */}
                        <Box sx={{ display: 'flex', gap: 2, width: '95%', mt: 2 }}>
                            <TextField
                                name="provincia"
                                select
                                label="Provincia"
                                // --- CAMBIO CLAVE 6: El valor del TextField ahora es el ID ---
                                value={formData.provincia || ''} // Usamos '' para que el select no muestre "null"
                                // -------------------------------------------------------------
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                error={!!errors.provincia}
                                helperText={errors.provincia}
                                sx={textFieldStyle}
                            >
                                {/* --- CAMBIO CLAVE 7: El valor de MenuItem ahora es el ID --- */}
                                {sortedProvinces.map((provincia) => (
                                    <MenuItem key={provincia.id} value={provincia.id}> {/* Usamos provincia.id como valor */}
                                        {provincia.name}
                                    </MenuItem>
                                ))}
                                {/* ------------------------------------------------------------ */}
                            </TextField>

                            <TextField
                                name="ciudad"
                                select
                                label="Ciudad"
                                value={formData.ciudad || ''}
                                onChange={handleChange}
                                disabled={!formData.provincia}
                                size="small"
                                fullWidth
                                sx={textFieldStyle}
                                error={!!errors.ciudad}
                                helperText={errors.ciudad}
                            >
                                {sortedCities.map((city) => (
                                    <MenuItem key={city.id} value={city.id}>
                                        {city.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Grid item xs={12}>
                            <Typography variant="subtitle1">Foto de Perfil</Typography>
                            {preview && (
                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            objectFit: 'contain',
                                            borderRadius: '4px'
                                        }}
                                    />
                                </Box>
                            )}
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="contained-button-file"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="contained-button-file">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<CloudUploadIcon />}
                                    fullWidth
                                >
                                    Seleccionar Imagen
                                </Button>
                            </label>
                        </Grid>

                        {/* Fecha de nacimiento */}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                label="Fecha de Nacimiento"
                                value={formData.dob}
                                onChange={(newValue) => setFormData((prev) => ({ ...prev, dob: newValue }))}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        margin: 'normal',
                                        sx: textFieldStyle,
                                        error: !!errors.dob,
                                        helperText: errors.dob
                                    }
                                }}
                            />
                        </LocalizationProvider>

                        {/* Botón */}
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                mt: 3,
                                mb: 2,
                                width: '95%',
                                backgroundColor: '#139AA0',
                            }}
                        >
                            CONTINUAR
                        </Button>

                        <Typography variant="body2" sx={{ mt: 1 }}>
                            ¿Ya tenés una cuenta? <Link href="/login" sx={{ color: '#139AA0' }}>INICIAR SESIÓN</Link>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </div>
    );
};

const textFieldStyle = {
    '& label.Mui-focused': { color: '#139AA0' },
    '& .MuiOutlinedInput-root': {
        '&.Mui-focused fieldset': { borderColor: '#139AA0' },
    },
    width: { xs: '50vw', md: '20vw' },
};

export default Register;