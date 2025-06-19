// conexion a los endpoints de UserController.cs

import api from './AxiosBaseConnection';

export const createUser = async (userSignupRequest) => {
    const response = await api.post('Users/Signup', userSignupRequest);
    return response.data;
};

export const getAllUsers = async () => {
    const response = await api.get('Users');
    return response.data;
};

export const getUserById = async (id) => {
    const response = await api.get(`Users/${id}`);
    return response.data;
};

export const updateUser = async (id, updatedUserData) => {
    const response = await api.put(`Users/${id}`, updatedUserData);
    return response.data;
};

export const updateMyOwnProfile = async (profileData) => {
    const response = await api.put('Users/me', profileData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`Use/${id}`);
    return response.data;
};

export const updateUserRole = async (id, roleUpdateRequest) => {
    const response = await api.put(`Users/${id}/role`, roleUpdateRequest);
    return response.data;
};

export const adminUpdateUser = async (userId, userData) => {
    const response = await api.put(`Users/admin/${userId}`, userData);
    return response.data;
};

export const hardDeleteUser = async (id) => {
    const response = await api.delete(`Users/${id}/hard`);
    return response.data;
};

export const cambiarRolAPrestador = async () => {
    const response = await api.patch('Users/cambiar-prestador');
    return response.data;
};


export const toggleUserStatus = async (userId) => {
    const response = await api.put(`/Users/toggle-status/${userId}`);
    return response.data;
};