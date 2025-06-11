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

export const adminUpdateEvent = async (eventId, eventData) => {
  const response = await api.put(`Event/admin/${eventId}`, eventData);
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

export const getRandomEvents = async () => {
    const response = await api.get(`/Event/random-events`);
    return response.data;
};

export const filterEvents = async (name, date) => {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    if (date) params.append('date', date); // date debe estar en formato 'YYYY-MM-DD'

    const response = await api.get(`/Event/filter?${params.toString()}`);
    return response.data;
};

export const getEventVehicleById = async (eventVehicleId) => {
    const response = await api.get(`/EventVehicle/${eventVehicleId}`);
    return response.data;
};

export const getVehiclesByEvent = async (eventId) => {
    const response = await api.get(`/EventVehicle/GetVehiclesByEvent/${eventId}`);
    return response.data;
};


export const getCoordinatesByCityName = async (cityName) => {
    const response = await api.get(`/City/GetCoordinatesByName/${cityName}`);
    return response.data;
};

export const getCoordinatesByCityId = async (cityId) => {
    const response = await api.get(`/City/GetCoordinatesById/${cityId}`);
    return response.data;
};