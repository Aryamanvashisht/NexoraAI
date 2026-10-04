import api from "../../utils/axios.js";

export const getMessages = async (id) => {
  try {
    const { data } = await api.get(`/chat/get-messages/${id}`);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default getMessages;
