import axios from "./axiosClient";

export const createEvent = (data) =>
  axios.post("/contact", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
