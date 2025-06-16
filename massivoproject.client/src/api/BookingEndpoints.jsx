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

export const getBookingById = async (bookingId) => {
    const response = await api.get(`/Booking/${bookingId}`);
    return response.data;
};

export const deleteBooking = async (bookingId) => {
    const response = await api.delete(`/Booking/${bookingId}`);
    return response.data;
};

export const updateBooking = async (bookingId, bookingData) => {
    const response = await api.put(`/Booking/${bookingId}`, bookingData);
    return response.data;
};