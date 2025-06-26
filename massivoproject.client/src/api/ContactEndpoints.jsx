import api from "./AxiosBaseConnection";

export const sendContactMessage = async (contactData) => {
  const response = await api.post("/Contact/send", contactData);
  return response.data;
};
