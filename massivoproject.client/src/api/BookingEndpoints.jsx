import api from "./AxiosBaseConnection"

export const getAllBookings = async () => {
    const response = await api.get('/Booking');
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await api.post('/Booking', bookingData);
    return response.data;
};

export const getBookingByUser = async (userId) => {
    const response = await api.get(`/Booking/user/${userId}`);
    return response.data;
};