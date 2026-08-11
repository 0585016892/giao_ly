import axiosClient from "./axiosClient";

export const generateExam = (limit = 20) =>
  axiosClient.get(`/questions/exam?limit=${limit}`);

export const submitExam = (data) =>
  axiosClient.post("/questions/submit-exam", data);
export const getQuestions = (params) =>
  axiosClient.get("/questions", { params });
