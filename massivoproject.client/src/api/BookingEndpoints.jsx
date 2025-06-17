import api from "./AxiosBaseConnection";

// Obtener una reserva por ID
export const getBookingById = async (id) => {
  const response = await api.get(`/Booking/${id}`);
  return response.data;
};

// Obtener todas las reservas de un usuario por ID
export const getBookingsByUserId = async (userId) => {
  const response = await api.get(`/Booking/user/${userId}`);
  return response.data;
};

// Eliminar una reserva por ID
export const deleteBooking = async (bookingId) => {
  const response = await api.delete(`/Booking/${bookingId}`);
  return response.data;
};

export const getAllBookings = async () => {
  const response = await api.get("/Booking");
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await api.post("/Booking", bookingData);
  return response;
};

export const getBookingByUser = async (userId) => {
  const response = await api.get(`/Booking/user/${userId}`);
  return response.data;
};

export const sendUpcomingBookingNotifications = async () => {
  const response = await api.post("/Booking/notificar-reservas-proximas");
  return response.data;
};
