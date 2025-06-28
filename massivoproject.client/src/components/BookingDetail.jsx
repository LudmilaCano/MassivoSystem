import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Chip, Button, Backdrop, CircularProgress,
    Divider, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PaymentsIcon from '@mui/icons-material/Payments';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, deleteBooking } from '../api/BookingEndpoints';
import { PAYMENT_TYPE_ENUM, PAYMENT_TYPE_LABELS, PAYMENT_TYPE_ICONS } from '../constants/paymentsTypes';
import { BOOKING_TYPE, BOOKING_LABEL } from '../constants/bookingStatus';
import Swal from 'sweetalert2';


const BookingDetail = () => {
    const { bookingId } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openPaymentDetails, setOpenPaymentDetails] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [bookingStatusList, setBookingStatusList] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await getBookingById(bookingId);
                setBooking(data);
            } catch (error) {
                setBooking(null);
                console.error("Error: ", error)
                throw error;
            }
            setLoading(false);
        };
        if (!(/^\d+$/.test(bookingId ?? ""))) {
            navigate('/not-found');
        }
        fetchBooking();
    }, [bookingId]);

    useEffect(() => {
        setPaymentMethods(
            Object.keys(PAYMENT_TYPE_ENUM).map((key) => ({
                value: PAYMENT_TYPE_ENUM[key],
                label: PAYMENT_TYPE_LABELS[key],
                icon: PAYMENT_TYPE_ICONS[key],
            }))
        );
        setBookingStatusList(
            Object.keys(BOOKING_TYPE).map((key) => ({
                value: BOOKING_TYPE[key],
                label: BOOKING_LABEL[key],
            }))
        );
    }, []);


    const handleCancelBooking = async () => {
        const result = await Swal.fire({
            title: '¿Cancelar reserva?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'No'
        });

        if (result.isConfirmed) {
            try {
                await deleteBooking(bookingId);
                Swal.fire({
                    icon: 'success',
                    title: 'Reserva cancelada',
                    showConfirmButton: false,
                    timer: 1500
                });

                window.location.reload();
            } catch (error) {
                console.error("Error: ", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al cancelar',
                    text: 'Intenta nuevamente más tarde.'
                });
            }
        }
    };

    if (loading) {
        return (
            <Backdrop open={true} sx={{ color: '#fff', zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    if (!booking) return <Typography>No se encontró la reserva.</Typography>;

    const { event, vehicle, payment, seatNumber, bookingStatus } = booking;

    const paymentInfo = paymentMethods.find(p => p.value === payment.paymentMethod);
    const bookingStatusInfo = bookingStatusList.find(b => b.value === bookingStatus);

    return (
        <Box sx={{
            width: '100%',
            minHeight: '90vh',
            backgroundColor: '#F5F5F5',
            p: { xs: 1, sm: 2, md: 4 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <Paper elevation={6} sx={{
                maxWidth: 800,
                width: '100%',
                p: { xs: 2, sm: 3 },
                borderRadius: 4,
            }}>

                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    Detalles de la Reserva
                </Typography>

                <Divider textAlign="center" sx={{ mb: 3 }}>
                    <EventIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Evento
                </Divider>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                    <Typography><strong>Nombre:</strong> {event?.name || 'N/A'}</Typography>
                    <Typography><strong>Fecha del evento:</strong> {new Date(event?.eventDate).toLocaleDateString()}</Typography>
                </Box>

                <Divider textAlign="center" sx={{ mb: 3 }}>
                    <DriveEtaIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Vehículo
                </Divider>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                    <Typography><strong>Nombre:</strong> {vehicle?.name}</Typography>
                    <Typography><strong>Patente:</strong> {vehicle?.licensePlate}</Typography>
                    <Typography><strong>Conductor:</strong> {vehicle?.driverName}</Typography>
                </Box>

                <Divider textAlign="center" sx={{ mb: 3 }}>
                    <PaymentsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Pago
                </Divider>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                    {paymentInfo && (
                        <Typography sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <span style={{ marginRight: 8 }}>{paymentInfo.icon}</span>
                            <strong>Método:</strong> {paymentInfo.label}
                        </Typography>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography><strong>Monto:</strong> ${payment.amount}</Typography>
                        <Button variant="text" onClick={() => setOpenPaymentDetails(true)}>
                            Ver detalles del pago
                        </Button>
                    </Box>
                </Box>


                <Divider textAlign="center" sx={{ mb: 3 }}>
                    <ConfirmationNumberIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Reserva
                </Divider>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                    <Typography><strong>Número de asientos:</strong> {seatNumber}</Typography>
                    <Typography>
                        <strong>Estado:</strong>{' '}
                        {bookingStatusInfo
                            ? <Chip
                                label={bookingStatusInfo.label}
                                color={bookingStatus === BOOKING_TYPE.Cancelled ? "error" : "success"}
                                size="small"
                            />
                            : "Desconocido"}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleCancelBooking}
                        disabled={bookingStatus != BOOKING_TYPE.Confirmed}
                    >
                        Cancelar Reserva
                    </Button>
                </Box>
            </Paper>

            <Dialog
                open={openPaymentDetails}
                onClose={() => setOpenPaymentDetails(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Detalles del Pago</DialogTitle>
                <DialogContent>
                    <Typography>{payment.details}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenPaymentDetails(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BookingDetail;
