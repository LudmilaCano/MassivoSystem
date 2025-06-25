import { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import { getBookingsByUserId, deleteBooking } from "../api/BookingEndpoints";

const STATUS_LABELS = {
  0: "Confirmada",
  1: "Cancelada",
  2: "Pendiente",
  3: "Completada",
};

const MyBookings = () => {
  const { userId } = useSelector((state) => state.auth);
  const [myBookings, setMyBookings] = useState([]);

  const fetchMyBookings = async () => {
    try {
      const bookings = await getBookingsByUserId(userId);
      setMyBookings(Array.isArray(bookings) ? bookings : []);
      console.log("Reservas recibidas:", bookings);
    } catch (error) {
      console.error("Error al obtener reservas del usuario:", error);
      setMyBookings([]);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchMyBookings();
    }
  }, [userId]);

  const handleDelete = async (booking) => {
    if (!confirm("¿Seguro que querés cancelar esta reserva?")) return;

    // Validar si puede cancelar (24hs antes del evento)
    const eventDate = new Date(booking.event.eventDate);
    const now = new Date();
    const diffMs = eventDate - now;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < 1) {
      alert("No se puede cancelar la reserva dentro de las 24 horas previas al evento.");
      return;
    }

    if (booking.bookingStatus !== 0) {
      alert("Solo se pueden cancelar reservas activas (Confirmadas).");
      return;
    }

    await deleteBooking(booking.id);
    fetchMyBookings();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Mis Reservas
      </Typography>

      {myBookings.length === 0 ? (
        <Typography>No tienes reservas aún.</Typography>
      ) : (
        myBookings.map((booking) => {
          const eventDate = new Date(booking.event.eventDate);
          const now = new Date();
          const isPastEvent = now > eventDate;

          const status = Number(booking.bookingStatus);

          let statusText = "";
          if (isPastEvent) {
            statusText = STATUS_LABELS[3]; // Completada
          } else if (status === 1) {
            statusText = STATUS_LABELS[1]; // Cancelada
          } else if (status === 2) {
            statusText = STATUS_LABELS[2]; // Pendiente
          } else if (status === 0) {
            statusText = STATUS_LABELS[0]; // Confirmada
          } else {
            statusText = "Estado desconocido";
          }

          // Solo permitir cancelar si está Confirmada y falta más de 24hs
          const canCancel =
            status === 0 && (eventDate - now) / (1000 * 60 * 60) > 24;

          return (
            <Box
              key={booking.id}
              sx={{
                mb: 2,
                p: 2,
                border: "1px solid #ccc",
                borderRadius: 1,
                position: "relative",
              }}
            >
              <Typography variant="h6">{booking.event.name}</Typography>
              <Typography>Fecha: {eventDate.toLocaleDateString()}</Typography>
              <Typography>Estado: {statusText}</Typography>
              <Typography>Vehículo: {booking.vehicle.name}</Typography>

              {canCancel && (
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mt: 1 }}
                  onClick={() => handleDelete(booking)}
                >
                  Cancelar reserva
                </Button>
              )}
            </Box>
          );
        })
      )}
    </Box>
  );
};

export default MyBookings;
