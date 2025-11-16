import axios from "axios";

const baseURLs = {
    auth: "http://localhost:5029/api",
    venue: "http://localhost:5136/api/v1",
    event: "http://localhost:5185/api/v1",
    ticket: "http://localhost:5113/api/v1",
    order: "http://localhost:5062/api/v1",
};

export const getApiClient = (service: keyof typeof baseURLs) => {
    const api = axios.create({
        baseURL: baseURLs[service],
        headers: { "Content-Type": "application/json" },
    });

    api.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    return api;
};
