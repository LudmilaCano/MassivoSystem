import api from './AxiosBaseConnection';

export const getAllVehicles = async () => {
    const response = await api.get('/Vehicle');
    return response.data;
};

export const getVehicleByLicensePlate = async (licensePlate) => {
    const response = await api.get(`/Vehicle/${licensePlate}`);
    return response.data;
};

export const getVehiclesByUserId = async (userId) => {
    const response = await api.get(`/Vehicle/user/${userId}`);
    return response.data;
};

export const createVehicle = async (vehicleData) => {
    const response = await api.post('/Vehicle', vehicleData);
    return response.data;
};

export const updateVehicle = async (licensePlate, vehicleData) => {
    const response = await api.put(`/Vehicle/${licensePlate}`, vehicleData);
    return response.data;
};

export const adminUpdateVehicle = async (licensePlate, vehicleData) => {
  const response = await api.put(`Vehicle/admin/${licensePlate}`, vehicleData);
  return response.data;
};

export const deactivateVehicle = async (licensePlate) => {
    const response = await api.put(`/Vehicle/${licensePlate}/deactivate`);
    return response.data;
};

export const deleteVehicle = async (licensePlate) => {
    const response = await api.delete(`/Vehicle/${licensePlate}`);
    return response.data;
};