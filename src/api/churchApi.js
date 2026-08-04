import axios from "./axiosClient";

// =========================
// GET ALL (SEARCH + FILTER + PAGINATION)
// =========================
export const getChurches = async (params) => {
  const res = await axios.get("/churches", { params });
  return res.data;
};

// =========================
// GET BY ID
// =========================
export const getChurchById = async (id) => {
  const res = await axios.get(`/churches/${id}`);
  return res.data;
};

// =========================
// SEARCH MAP (NEARBY)
// =========================
export const searchChurchMap = async (params) => {
  const res = await axios.get(`/churches/map/search`, { params });
  return res.data;
};
