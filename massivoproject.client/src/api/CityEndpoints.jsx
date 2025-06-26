import api from "./AxiosBaseConnection";

export const getCitiesByProvince = async (provinceId) => {
  const response = await api.get(`/City/GetCitiesByProvince/${provinceId}`);
  return response.data;
};

export const getCityById = async (cityId) => {
  const response = await api.get(`/City/${cityId}`);
  return response.data;
};

export const getAllCities = async () => {
  const response = await api.get("/City");
  return response.data;
};
