
import api from './AxiosBaseConnection';

export const getAllProvince = async () => {
    const response = await api.get('/Province');
    return response.data;
};