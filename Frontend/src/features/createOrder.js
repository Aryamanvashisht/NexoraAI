import api from "../../utils/axios.js";

export const createOrder = async (plan) => {
  try {
      const {data}=await api.post("/billing/create",{plan});
      console.log(data);
      return data;
  } catch (error) {
      console.log(error);
      return []
  }
};

export default createOrder;
