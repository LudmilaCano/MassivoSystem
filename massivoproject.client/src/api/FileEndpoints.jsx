import api from './AxiosBaseConnection';

export const uploadFile = async (file, entityType) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post(`/File/upload/${entityType}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};