import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Paper,
    Chip,
    Grid,
    Button,
    TextField,
    Pagination,
    CircularProgress,
    Backdrop,
} from "@mui/material";
import { getBookingByUser } from "../api/BookingEndpoints";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    PAYMENT_TYPE_ENUM,
    PAYMENT_TYPE_LABELS,
    PAYMENT_TYPE_ICONS,
} from "../constants/paymentsTypes";

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredBookings.slice(
        indexOfFirstItem,
        indexOfLastItem
    );
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const navigate = useNavigate();
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        setLoading(true);
        const getUserId = async () => {
            const userId = auth.userId;
            const data = await getBookingByUser(userId);
            setBookings(data);
            console.log("Bookings: ", data);
            setLoading(false);
        };
        getUserId();
    }, [auth.userId]);

    useEffect(() => {
        setPaymentMethods(
            Object.keys(PAYMENT_TYPE_ENUM).map((key) => ({
                value: PAYMENT_TYPE_ENUM[key],
                label: PAYMENT_TYPE_LABELS[key],
                icon: PAYMENT_TYPE_ICONS[key],
            }))
        );
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            const filtered = bookings.filter((b) =>
                b.event.name.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredBookings(filtered);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(delay);
    }, [search, bookings]);

    return (
        loading ? (
            <Backdrop open={true} sx={{ color: '#fff', zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        ) : (
            <Box
                sx={{
                    width: "100%",
                    minHeight: "90vh",
                    backgroundColor: "#F5F5F5",
                    p: 4,
                }}
            >
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
                                        Fecha:{" "}
                                        {new Date(booking.event.eventDate).toLocaleDateString(
                                            "es-ES"
                                        )}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lugar: {booking.event.location}
                                    </Typography>
                                    <Typography variant="body2" mt={1}>
                                        Vehículo: {booking.vehicle.name} - Patente:{" "}
                                        {booking.vehicle.licensePlate}
                                    </Typography>
                                    <Typography variant="body2">
                                        Pasajeros: {booking.payment.seatNumber}
                                    </Typography>
                                    <Typography variant="body2">
                                        Pago: {paymentMethods[booking.payment.paymentMethod].label}
                                    </Typography>
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    md={4}
                                    display="flex"
                                    justifyContent="flex-end"
                                    alignItems="center"
                                >
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() =>
                                            console.log(navigate(`/booking/${booking.id}`))
                                        }
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
        )
    )

};

export default BookingList;
