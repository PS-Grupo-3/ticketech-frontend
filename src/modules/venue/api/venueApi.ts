import { getApiClient } from "../../../core/apiClient";
const api = getApiClient("venue");
export const getVenueTypes = async () => {
    const { data } = await api.get("/VenueType");
    return data;
};
