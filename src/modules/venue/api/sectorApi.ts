import { getApiClient } from "../../../core/apiClient";
const api = getApiClient("venue");

export const createSector = async (venueId: string, payload: any) => {
    const { data } = await api.post(`/venues/${venueId}/sectors`, payload);
    return data;
};

export const generateSeats = async (sectorId: string) => {
    const { data } = await api.post(`/strategy/generate/${sectorId}`);
    return data;
};
