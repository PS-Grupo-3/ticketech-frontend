import { getApiClient } from "../../../core/apiClient";
const api = getApiClient("event");
export const getEventCategories = async () => {
    const { data } = await api.get("/EventCategory");
    return data;
};
