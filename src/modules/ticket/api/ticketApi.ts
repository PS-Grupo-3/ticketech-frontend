import { getApiClient } from "../../../core/apiClient";
const api = getApiClient("ticket");

// obtiene todos los estados de los tickets
export const getTicketStatuses = async () => {
    const { data } = await api.get("/TicketStatus");
    return data;
};
