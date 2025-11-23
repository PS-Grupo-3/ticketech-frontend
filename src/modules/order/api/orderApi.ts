import { getApiClient } from "../../../core/apiClient";
const api = getApiClient("order");

export const createOrder = async (payload: any) => {  

  const token = localStorage.getItem("token");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const { data } = await api.post("/Order", payload, { headers });
  return data;
};


export const payOrder = async (orderId: string, payload: { currency: string; paymentType: number }) => {
  const res = await api.patch(`/Order/${orderId}`, payload);
  return res.data;
};

export const getOrder = async (orderId: string) => {
  const res = await api.get(`/Order/${orderId}`);
  return res.data;
};
