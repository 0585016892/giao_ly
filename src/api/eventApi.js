import axios from "./axiosClient";

export const getEvents = (params) => axios.get("/events", { params });
export const getEventBySlug = (slug) => axios.get(`/events/${slug}`);
