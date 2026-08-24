import axiosClient from "./axiosClient";

// Random đề thi theo đợt
export const generateExam = (batch, limit = 20) =>
  axiosClient.get("/questions/exam", {
    params: {
      batch,
      limit,
    },
  });

// Nộp bài thi
export const submitExam = (data) =>
  axiosClient.post("/questions/submit-exam", data);

// Lấy danh sách câu hỏi
export const getQuestions = (params) =>
  axiosClient.get("/questions", { params });
