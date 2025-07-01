import api from './AxiosBaseConnection';

export const addVehicleToEvent = async (eventVehicleData) => {
    const response = await api.post('/EventVehicle', eventVehicleData);
    return response.data;
};

export const getEventVehiclesByUserId = async (userId) => {
    const response = await api.get(`/EventVehicle/user/${userId}`);
    return response.data;
}