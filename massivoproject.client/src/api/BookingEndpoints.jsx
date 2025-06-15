import api from "./AxiosBaseConnection";

// Obtener todas las reservas
export const getAllBookings = async () => {
  const response = await api.get("/Booking");
  return response.data;
};

// Crear una nueva reserva
export const createBooking = async (bookingData) => {
  const response = await api.post("/Booking", bookingData);
  return response.data;
};

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
