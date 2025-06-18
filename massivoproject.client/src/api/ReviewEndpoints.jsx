


import api from './AxiosBaseConnection';


export const createReview = async (reviewData) => {
  const response = await api.post('/Review', reviewData);
  return response.data;
};

export const getReviewById = async (reviewId) => {
    const response = await api.get(`/Review/${reviewId}`);
    return response.data;
};

export const  getReviewsByUser = async (userId)=> {
    const response = await api.get(`/Review/user/${userId}`);
    return response.data;
};

export  const getReviewsByEventVehicle = async (eventVehicleId) => {
    const response = await api.get(`/Review/event-vehicle/${eventVehicleId}`);
    return response.data;
};

export const  updateReview = async (reviewId, reviewData) =>{
    const response = await api.put(`/Review/${reviewId}`, reviewData);
    return response.data;
};

export const  deleteReview = async (reviewId) => {
    const response = await api.delete(`/Review/${reviewId}`);
    return response.data;
};
