import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    IconButton,
    Tooltip,
    MenuItem,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { addVehicleToEvent } from "../api/EventVehicleEndpoints";
import { useNavigate, useLocation } from "react-router-dom";
import { getVehiclesByUserId } from "../api/VehicleEndpoints";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getEventById } from "../api/EventEndpoints";
import Swal from "sweetalert2";
import useSwalAlert from "../hooks/useSwalAlert";

const AddVehicleEvent = () => {
    const location = useLocation();
    const [form, setForm] = useState({
        eventId: "",
        licensePlate: "",
        lugarPartida: "",
        fechaSalida: "",
        horaPartida: "",
        destino: "",
        horaRegreso: "",
        lugarRegreso: "",
        precioPorPasajero: 0,
        telefono: "", // viene precargado del backend
        observaciones: "",
        description: "", // este se genera dinámicamente
    });
    const [loading, setLoading] = useState(false);
    const [eventDate, setEventDate] = useState(null);
    const nameEvent = location.state?.description;
    const [vehicles, setVehicles] = useState([]);
    const auth = useSelector((state) => state.auth);
    const { eventId } = useParams();
    const { showAlert } = useSwalAlert();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const updated = { ...prev, [name]: value };

            // Generar mensaje dinámico cada vez que cambia algo
            updated.description =
                `📍 Lugar de partida: ${updated.lugarPartida}\n` +
                `🧭 Fecha de salida: ${updated.fechaSalida}\n` +
                `🕒 Hora salida: ${updated.horaPartida}\n` +
                `📍 Destino: ${updated.destino}\n` +
                `🕗 Hora regreso: ${updated.horaRegreso}\n` +
                `📍 Lugar Regrso: ${updated.lugarRegreso}\n` +
                `📞 Teléfono: ${updated.telefono}\n` +
                `📝 Observaciones: ${updated.observaciones}`;

            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Validaciones de campos obligatorios
        const requiredFields = [
            "licensePlate",
            "lugarPartida",
            "fechaSalida",
            "horaPartida",
            "destino",
            "horaRegreso",
            "lugarRegreso",
            "telefono",
            "precioPorPasajero",
        ];

        const phoneRegex = /^[0-9\s\-()+]{10,15}$/;
        if (!phoneRegex.test(form.telefono)) {
            showAlert(
                "Por favor ingrese un teléfono válido antes de enviar",
                "error"
            );
            return;
        }

        for (let field of requiredFields) {
            if (!form[field] || form[field].toString().trim() === "") {
                showAlert("El campo " + { field } + "  es obligatorio.", "error");
                setLoading(false);
                return;
            }
        }

        // 2. Validar precio mayor a 10.000
        if (parseInt(form.precioPorPasajero) <= 5000) {
            showAlert("El precio por pasajero debe ser mayor a $5000", "error");

            setLoading(false);
            return;
        }

        // 3. Validar que la fecha de salida no sea posterior al evento
        if (eventDate) {
            const salida = new Date(form.fechaSalida);
            const evento = new Date(eventDate);
            if (salida > evento) {
                showAlert(
                    "La fecha de salida no puede ser posterior a la fecha del evento.",
                    "error"
                );
                setLoading(false);
                return;
            }
        }

        // 4. Confirmación con SweetAlert
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Deseás agregar este vehículo al evento con los datos cargados?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Sí, confirmar",
            cancelButtonText: "No, cancelar",
        });

        if (!result.isConfirmed) {
            setLoading(false);
            return;
        }

        // 5. Enviar al backend si todo está bien
        const payload = {
            eventId: eventId,
            licensePlate: form.licensePlate,
            date: form.fechaSalida,
            price: parseInt(form.precioPorPasajero),
            description: form.description,
        };

        try {
            await addVehicleToEvent(payload);

            showAlert("Vehículo agregado al evento correctamente", "success");
            setForm({
                eventId: "",
                licensePlate: "",
                lugarPartida: "",
                fechaSalida: "",
                horaPartida: "",
                destino: "",
                horaRegreso: "",
                lugarRegreso: "",
                precioPorPasajero: 0,
                telefono: "",
                observaciones: "",
                description: "",
            });
            navigate("/");
        } catch (err) {
            showAlert("Error al agregar vehículo al evento", "error");
            console.error("Error: ", err);
            throw err;
        }

        setLoading(false);
    };
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const userId = auth.userId; // o desde contexto si lo tenés
                const data = await getVehiclesByUserId(userId);
                setVehicles(data);
                if (data.length === 1) {
                    setForm((prev) => ({ ...prev, licensePlate: data[0].licensePlate }));
                }
            } catch (err) {
                console.error("Error al obtener vehículos", err);
                throw err;
            }
        };
        fetchVehicles();
    }, [auth.userId]);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const event = await getEventById(eventId);
                setEventDate(event.eventDate);
            } catch (err) {
                console.error("Error al obtener el evento", err);
                throw err;
            }
        };
        if (!(/^\d+$/.test(eventId ?? ""))) {
            navigate('/not-found');
        }
        fetchEvent();
    }, [eventId]);

    const maxDate = eventDate ? eventDate.split("T")[0] : "";

    return (
        <Box
            sx={{
                backgroundColor: "#F5F5F5",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Paper
                elevation={6}
                sx={{ p: 4, borderRadius: 4, width: { xs: "95vw", md: 500 } }}
            >
                <Typography variant="h5" fontWeight="bold" mb={2} color="#139AA0">
                    Agregar Vehículo a Evento
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre del evento"
                                name="eventId"
                                value={nameEvent}
                                fullWidth
                                required
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            {vehicles.length === 1 ? (
                                <TextField
                                    label="Vehículo"
                                    value={vehicles[0].licensePlate}
                                    fullWidth
                                    disabled
                                />
                            ) : (
                                <TextField
                                    select
                                    label="Selecciona patente de un vehículo"
                                    name="licensePlate"
                                    value={form.licensePlate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                >
                                    {vehicles.map((veh) => (
                                        <MenuItem key={veh.licensePlate} value={veh.licensePlate}>
                                            {veh.licensePlate}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Fecha de salida"
                                type="date"
                                name="fechaSalida"
                                value={form.fechaSalida}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ max: maxDate }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    label="Lugar de partida"
                                    name="lugarPartida"
                                    value={form.lugarPartida}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <Tooltip title="Ejemplo: 'Calle y altura o intersección donde se recogerán los pasajeros'">
                                    <IconButton sx={{ ml: 1 }}>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Hora de partida"
                                type="time"
                                name="horaPartida"
                                value={form.horaPartida}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    label="Destino"
                                    name="destino"
                                    value={form.destino}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                                <Tooltip title="Ejemplo: 'Nombre del lugar donde se realizará el evento'">
                                    <IconButton sx={{ ml: 1 }}>
                                        <HelpOutlineIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Hora de regreso"
                                type="time"
                                name="horaRegreso"
                                value={form.horaRegreso}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Lugar de regreso"
                                name="lugarRegreso"
                                value={form.lugarRegreso}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Teléfono"
                                name="telefono"
                                value={form.telefono}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Precio por pasajero"
                                type="number"
                                name="precioPorPasajero"
                                value={form.precioPorPasajero}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Observaciones"
                                name="observaciones"
                                value={form.observaciones}
                                onChange={handleChange}
                                fullWidth
                                multiline
                                minRows={3}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                            sx={{
                                mt: 2,
                                backgroundColor: "#139AA0",
                                ":hover": { backgroundColor: "#11787c" },
                            }}
                        >
                            Agregar Vehiculo al evento
                        </Button>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddVehicleEvent;
