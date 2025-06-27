import api from './AxiosBaseConnection';

export const addVehicleToEvent = async (eventVehicleData) => {
    const response = await api.post('/EventVehicle', eventVehicleData);
    return response.data;
};