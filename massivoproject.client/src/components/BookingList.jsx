import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Chip, Grid, Button, TextField, Pagination
} from '@mui/material';
// import { getUserBookings } from '../api/BookingEndpoints';
import { useNavigate } from 'react-router-dom';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {

  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      const filtered = bookings.filter(b =>
        b.event.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBookings(filtered);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search, bookings]);

  return (
    <Box sx={{ width: '100%', minHeight: '90vh', backgroundColor: '#F5F5F5', p: 4 }}>
      <Typography variant="h4" gutterBottom color="#139AA0">
        Mis Reservas
      </Typography>


      <Box mb={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          variant="outlined"
          shape="rounded"
          color="primary"
        />
      </Box>

      {currentItems.length ? (
        currentItems.map((booking, index) => (
          <Paper key={index} elevation={3} sx={{ mb: 2, p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6" fontWeight="bold">
                  {booking.event.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {booking.event.eventDate}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lugar: {booking.event.location}
                </Typography>
                <Typography variant="body2" mt={1}>
                  Vehículo: {booking.vehicle.type} - {booking.vehicle.seats} personas
                </Typography>
                <Typography variant="body2">
                  Pasajeros: {booking.travelers}
                </Typography>
                <Typography variant="body2">
                  Pago: {booking.paymentMethod}
                </Typography>
              </Grid>

              <Grid item xs={12} md={4} display="flex" justifyContent="flex-end" alignItems="center">
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate(`/booking-detail/${booking.id}`)}
                >
                  Ver Detalles
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))
      ) : (
        <Typography variant="h6" color="text.secondary">
          No tienes reservas realizadas.
        </Typography>
      )}
    </Box>
  );
};

export default BookingList;
