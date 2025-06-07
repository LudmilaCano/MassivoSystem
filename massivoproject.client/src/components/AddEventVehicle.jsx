import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Grid } from "@mui/material";
import { addVehicleToEvent } from "../api/EventEndpoints";

const AddVehicleEvent = () => {
  const [form, setForm] = useState({
    eventId: "",
    licensePlate: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addVehicleToEvent(form);
      alert("Vehículo agregado al evento correctamente");
      setForm({ eventId: "", licensePlate: "", date: "" });
    } catch (err) {
      alert("Error al agregar vehículo al evento");
    }
    setLoading(false);
  };

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
                label="ID del Evento"
                name="eventId"
                value={form.eventId}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Patente del Vehículo"
                name="licensePlate"
                value={form.licensePlate}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha de asignación"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: "#139AA0", fontWeight: "bold" }}
                disabled={loading}
              >
                {loading ? "Guardando..." : "Agregar Vehículo"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddVehicleEvent;
