

import api from './AxiosBaseConnection';

export const getCitiesByProvince = async (provinceId) => {
    const response = await api.get(`/City/GetCitiesByProvince/${provinceId}`);
    return response.data
};