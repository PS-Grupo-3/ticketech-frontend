import { getApiClient } from "../../../core/apiClient";

const api = getApiClient("venue");

function logReq(label: string, url: string, payload?: unknown) {
  console.groupCollapsed(`[API] ${label}: ${url}`);
  if (payload !== undefined) console.log(payload);
  console.groupEnd();
}

function logRes(label: string, url: string, ms: number, res: unknown) {
  console.groupCollapsed(`[API] ${label} OK: ${url} (${ms.toFixed(1)} ms)`);
  console.log(res);
  console.groupEnd();
}

function logErr(label: string, url: string, ms: number, err: any) {
  console.groupCollapsed(`[API] ${label} FAIL: ${url} (${ms.toFixed(1)} ms)`);
  console.error(err);
  if (err?.response) {
    console.log(err.response.status);
    console.log(err.response.data);
  }
  console.groupEnd();
}

export const getSectorsForVenue = async (venueId: string) => {
  const url = `/venues/${venueId}/sectors`;
  logReq("GET sectors", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET sectors", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET sectors", url, performance.now() - t0, err);
    throw err;
  }
};

export const createSector = async (venueId: string, payload: any) => {
  const url = `/venues/${venueId}/sectors`;
  logReq("POST create sector", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.post(url, payload);
    logRes("POST create sector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("POST create sector", url, performance.now() - t0, err);
    throw err;
  }
};

export const getSectorById = async (sectorId: string) => {
  const url = `/Sector/${sectorId}`;
  logReq("GET sector", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET sector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET sector", url, performance.now() - t0, err);
    throw err;
  }
};

export const updateSector = async (sectorId: string, payload: any) => {
  const url = `/Sector/${sectorId}`;
  logReq("PUT update sector", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.put(url, payload);
    logRes("PUT update sector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PUT update sector", url, performance.now() - t0, err);
    throw err;
  }
};

export const deleteSector = async (sectorId: string) => {
  const url = `/Sector/${sectorId}`;
  logReq("DELETE sector", url);
  const t0 = performance.now();
  try {
    const { data } = await api.delete(url);
    logRes("DELETE sector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("DELETE sector", url, performance.now() - t0, err);
    throw err;
  }
};

export const updateSectorShape = async (sectorId: string, shape: any) => {
  const url = `/Sector/${sectorId}/shape`;
  logReq("PUT shape", url, shape);
  const t0 = performance.now();
  try {
    const { data } = await api.put(url, shape);
    logRes("PUT shape", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PUT shape", url, performance.now() - t0, err);
    throw err;
  }
};

export const generateSeats = async (sectorId: string) => {
  const url = `/strategy/generate/${sectorId}`;
  logReq("POST generate seats", url);
  const t0 = performance.now();
  try {
    const { data } = await api.post(url);
    logRes("POST generate seats", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("POST generate seats", url, performance.now() - t0, err);
    throw err;
  }
};

export const getSeatsForSector = async (sectorId: string) => {
  const url = `/Sector/${sectorId}/seats`;
  logReq("GET seats", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET seats", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET seats", url, performance.now() - t0, err);
    throw err;
  }
};

export const getVenues = async () => {
  const url = `/venues`;
  logReq("GET venues", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET venues", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET venues", url, performance.now() - t0, err);
    throw err;
  }
};

export const createVenue = async (payload: any) => {
  const url = `/venues`;
  logReq("POST create venue", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.post(url, payload);
    logRes("POST create venue", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("POST create venue", url, performance.now() - t0, err);
    throw err;
  }
};

export const getVenueById = async (venueId: string) => {
  const url = `/venues/${venueId}`;
  logReq("GET venue", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET venue", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET venue", url, performance.now() - t0, err);
    throw err;
  }
};

export const updateVenue = async (venueId: string, payload: any) => {
  const url = `/venues/${venueId}`;
  logReq("PUT update venue", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.put(url, payload);
    logRes("PUT update venue", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PUT update venue", url, performance.now() - t0, err);
    throw err;
  }
};

export const getVenueTypes = async () => {
  const url = `/VenueType`;
  logReq("GET venue types", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET venue types", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET venue types", url, performance.now() - t0, err);
    throw err;
  }
};
