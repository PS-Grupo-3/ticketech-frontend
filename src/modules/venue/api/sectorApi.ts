import { getApiClient } from "../../../core/apiClient";
import { request } from "../api/apiRequest";

const api = getApiClient("venue");

export const getSectorsForVenue = (venueId: string) =>
  request(api, "get", `/venues/${venueId}/sectors`);

export const createSector = (venueId: string, payload: any) =>
  request(api, "post", `/venues/${venueId}/sectors`, payload);

export const getSectorById = (id: string) =>
  request(api, "get", `/Sector/${id}`);

export const updateSector = (id: string, payload: any) =>
  request(api, "put", `/Sector/${id}`, payload);

export const deleteSector = (id: string) =>
  request(api, "delete", `/Sector/${id}`);

export const updateSectorShape = (id: string, shape: any) =>
  request(api, "put", `/Sector/${id}/shape`, shape);

export const getSeatsForSector = (id: string) =>
  request(api, "get", `/Sector/${id}/seats`);
