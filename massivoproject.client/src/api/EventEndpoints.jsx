import api from './AxiosBaseConnection';

export const getAllEvents = async () => {
    const response = await api.get('/Event');
    return response.data;
};

export const getEventById = async (eventId) => {
    const response = await api.get(`/Event/${eventId}`);
    return response.data;
};

export const createEvent = async (eventData) => {
    const response = await api.post('/Event', eventData);
    return response.data;
};

export const updateEvent = async (eventId, eventData) => {
    const response = await api.put(`/Event/${eventId}`, eventData);
    return response.data;
};

export const deleteEvent = async (eventId) => {
    const response = await api.delete(`/Event/${eventId}`);
    return response.data;
};

export const addVehicleToEvent = async (eventVehicleData) => {
    const response = await api.post('/Event/add-vehicle', eventVehicleData);
    return response.data;
};

export const removeVehicleFromEvent = async (eventId, licensePlate) => {
    const response = await api.delete(`/Event/remove-vehicle/${eventId}/${licensePlate}`);
    return response.data;
};