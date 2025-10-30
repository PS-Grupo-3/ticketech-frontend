import { getApiClient } from "../../../core/apiClient";
const api = getApiClient("order");
export const getPaymentStatuses = async () => {
    const { data } = await api.get("/PaymentStatus");
    return data;
};
