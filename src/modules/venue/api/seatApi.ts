import { getApiClient } from "../../../core/apiClient";
import { request } from "../api/apiRequest";

const api = getApiClient("venue");

export const generateSeats = (sectorId: string) =>
  request(api, "post", `/strategy/generate/${sectorId}`);

export const getSeatsForSector = (sectorId: string) =>
  request(api, "get", `/Sector/${sectorId}/seats`);
