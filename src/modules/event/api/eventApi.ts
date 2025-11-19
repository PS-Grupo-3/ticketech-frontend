import { getApiClient } from "../../../core/apiClient";
const api = getApiClient("event");

interface EventCategory {
  categoryId: number;
  name: string;
}

interface CategoryType {
  typeId: number;
  name: string;
  eventCategory: string;
}

interface EventStatus {
  statusId: number;
  name: string;
}

interface CreateEventRequest {
  venueId: string;
  categoryId: number;
  typeId?: number | null;
  statusId: number;
  name: string;
  description: string;
  time: string; 
  address: string;
  bannerImageUrl?: string | null;
  thumbnailUrl?: string | null;
  themeColor?: string | null;
}

interface UpdateEventRequest {
  eventId: string;
  statusId?: number | null;
  name?: string | null;
  description?: string | null;
  time?: string | null;
  categoryId?: number | null;
  typeId?: number | null;
  bannerImageUrl?: string | null;
  thumbnailUrl?: string | null;
  themeColor?: string | null;
}

interface CreateEventSectorRequest {
  eventId: string;
  sectorId: string;
  capacity: number;
  price: number;
  available: boolean;
}

interface UpdateEventSectorRequest {
  eventSectorId: string;
  capacity?: number | null;
  price?: number | null;
  available?: boolean | null;
}



function logReq(label: string, url: string, payload?: unknown) {
  console.groupCollapsed(`[API] ${label}: ${url}`);
  if (payload !== undefined) console.log("payload:", payload);
  console.groupEnd();
}
function logRes(label: string, url: string, ms: number, res: unknown) {
  console.groupCollapsed(`[API] ${label} OK: ${url} (${ms.toFixed(1)} ms)`);
  console.log("response:", res);
  console.groupEnd();
}
function logErr(label: string, url: string, ms: number, err: any) {
  console.groupCollapsed(`[API] ${label} FAIL: ${url} (${ms.toFixed(1)} ms)`);
  console.error(err);
  if (err?.response) {
    console.log("status:", err.response.status);
    console.log("data:", err.response.data);
  }
  console.groupEnd();
}

//Endpoints de EventCategory

export const getEventCategories = async () => {
  const url = "/EventCategory"; 
  logReq("GET EventCategories", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get<EventCategory[]>(url);
    logRes("GET EventCategories", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET EventCategories", url, performance.now() - t0, err);
    throw err;
  }
};

export const getEventCategoryById = async (id: number) => {
  const url = `/EventCategory/${id}`;
  logReq("GET EventCategory", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get<EventCategory>(url);
    logRes("GET EventCategory", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET EventCategory", url, performance.now() - t0, err);
    throw err;
  }
};

//Endpoints de CategoryType

export const getCategoryTypes = async () => {
  const url = "/CategoryType";
  logReq("GET CategoryTypes", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get<CategoryType[]>(url);
    logRes("GET CategoryTypes", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET CategoryTypes", url, performance.now() - t0, err);
    throw err;
  }
};

export const getCategoryTypeById = async (id: number) => {
  const url = `/CategoryType/${id}`;
  logReq("GET CategoryType", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get<CategoryType>(url);
    logRes("GET CategoryType", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET CategoryType", url, performance.now() - t0, err);
    throw err;
  }
};


export const getEventTypesForCategory = async (categoryId: number) => {
  const url = `/EventCategory/${categoryId}/eventtypes`;
  logReq("GET Types for Category", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get<CategoryType[]>(url);
    logRes("GET Types for Category", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET Types for Category", url, performance.now() - t0, err);
    throw err;
  }
};

//Endpoints de EventStatus

export const getEventStatuses = async () => {
  const url = "/EventStatus";
  logReq("GET EventStatuses", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get<EventStatus[]>(url);
    logRes("GET EventStatuses", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET EventStatuses", url, performance.now() - t0, err);
    throw err;
  }
};

export const getEventStatusById = async (id: number) => {
  const url = `/EventStatus/${id}`;
  logReq("GET EventStatus", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get<EventStatus>(url);
    logRes("GET EventStatus", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET EventStatus", url, performance.now() - t0, err);
    throw err;
  }
};

//Endpoints de Event

export const getEvents = async (params?: { categoryId?: number; statusId?: number; from?: string; to?: string }) => {
  const url = "/Event";
  logReq("GET Events", url, params);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url, { params });
    logRes("GET Events", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET Events", url, performance.now() - t0, err);
    throw err;
  }
};

export const getEventById = async (id: string) => {
  const url = `/Event/${id}`;
  logReq("GET Event", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET Event", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET Event", url, performance.now() - t0, err);
    throw err;
  }
};

export const createEvent = async (payload: CreateEventRequest) => {
  const url = "/Event";
  logReq("POST Event", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.post(url, payload);
    logRes("POST Event", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("POST Event", url, performance.now() - t0, err);
    throw err;
  }
};

export const updateEvent = async (payload: UpdateEventRequest) => {
  const url = "/Event"; 
  logReq("PUT Event", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.put(url, payload);
    logRes("PUT Event", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PUT Event", url, performance.now() - t0, err);
    throw err;
  }
};

export const deleteEvent = async (id: string) => {
  const url = `/Event/${id}`;
  logReq("DELETE Event", url);
  const t0 = performance.now();
  try {
    const { data } = await api.delete(url);
    logRes("DELETE Event", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("DELETE Event", url, performance.now() - t0, err);
    throw err;
  }
};

export const updateEventStatus = async (id: string, statusId: number) => {
  const url = `/Event/${id}/status/${statusId}`;
  logReq("PATCH Event Status", url);
  const t0 = performance.now();
  try {
    const { data } = await api.patch(url);
    logRes("PATCH Event Status", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PATCH Event Status", url, performance.now() - t0, err);
    throw err;
  }
};

//Endpoints de EventSector

export const getEventSectors = async (id: string) => {
  const url = `/Event/${id}/sectors`;
  logReq("GET EventSectors", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET EventSectors", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET EventSectors", url, performance.now() - t0, err);
    throw err;
  }
};

export const getEventSectorById = async (id: string) => {
  const url = `/EventSector/${id}`;
  logReq("GET EventSector", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET EventSector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET EventSector", url, performance.now() - t0, err);
    throw err;
  }
};

export const createEventSector = async (payload: CreateEventSectorRequest) => {
  const url = "/EventSector";
  logReq("POST EventSector", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.post(url, payload);
    logRes("POST EventSector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("POST EventSector", url, performance.now() - t0, err);
    throw err;
  }
};

export const updateEventSector = async (payload: UpdateEventSectorRequest) => {
  const url = "/EventSector"; 
  logReq("PUT EventSector", url, payload);
  const t0 = performance.now();
  try {
    const { data } = await api.put(url, payload);
    logRes("PUT EventSector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PUT EventSector", url, performance.now() - t0, err);
    throw err;
  }
};

export const deleteEventSector = async (id: string) => {
  const url = `/EventSector/${id}`;
  logReq("DELETE EventSector", url);
  const t0 = performance.now();
  try {
    const { data } = await api.delete(url);
    logRes("DELETE EventSector", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("DELETE EventSector", url, performance.now() - t0, err);
    throw err;
  }
};

export const updateEventSectorAvailability = async (id: string, availability: boolean) => {
  const url = `/EventSector/${id}/availability`;
  logReq("PATCH EventSector Availability", url, availability);
  const t0 = performance.now();
  try {
    const { data } = await api.patch(url, availability);
    logRes("PATCH EventSector Availability", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PATCH EventSector Availability", url, performance.now() - t0, err);
    throw err;
  }
};





// Del adapter
export const getEventFull = async (id: string) => {
  const url = `/Event/${id}/full`;
  logReq("GET Event Full", url);
  const t0 = performance.now();
  try {
    const { data } = await api.get(url);
    logRes("GET Event Full", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("GET Event Full", url, performance.now() - t0, err);
    throw err;
  }
};


export const updateSeatStatus = async (eventId: string, seatId: string, payload: { available: boolean }) => {
  const url = `/Event/${eventId}/seats/${seatId}`;
  logReq("PATCH SeatStatus", url, payload);
  const t0 = performance.now();

  try {
    const { data } = await api.patch(url, payload);
    logRes("PATCH SeatStatus", url, performance.now() - t0, data);
    return data;
  } catch (err) {
    logErr("PATCH SeatStatus", url, performance.now() - t0, err);
    throw err;
  }
};
