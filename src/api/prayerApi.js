import axiosClient from "./axiosClient";

// GET (search + pagination)
export const getPrayers = (params) => {
  return axiosClient.get("/prayers/all", { params });
};

// GET by ID
export const getPrayerById = (id) => {
  return axiosClient.get(`/prayers/${id}`);
};
