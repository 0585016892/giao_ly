// src/api/slideApi.js
import axios from "./axiosClient";

// ================= GET ALL =================
export const getSlides = async () => {
  const res = await axios.get("/slides");
  return res.data;
};

// ================= GET ACTIVE =================
export const getActiveSlides = async () => {
  const res = await axios.get(`/slides/active`);
  return res.data;
};
