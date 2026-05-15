import axios from "./axiosClient";

// ===== WEEK =====
export const getWeekSchedule = (params) =>
  axios.get(`/schedules/mass`, { params });
