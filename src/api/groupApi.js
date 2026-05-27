import axios from "./axiosClient";

export const getGroups = (params) => axios.get("/groups", { params });

export const getGroupDetail = (slug) => axios.get(`/groups/${slug}`);
