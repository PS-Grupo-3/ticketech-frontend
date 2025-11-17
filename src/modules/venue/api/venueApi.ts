import { getApiClient } from "../../../core/apiClient";
import { request } from "../api/apiRequest";

const api = getApiClient("venue");

export const getVenues = () =>
  request(api, "get", `/venues`);

export const createVenue = (payload: any) =>
  request(api, "post", `/venues`, payload);

export const getVenueById = (venueId: string) =>
  request(api, "get", `/venues/${venueId}`);

export const updateVenue = (venueId: string, payload: any) =>
  request(api, "put", `/venues/${venueId}`, payload);

export const getVenueTypes = () =>
  request(api, "get", `/VenueType`);
