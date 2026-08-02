import axiosClient from "./axiosClient";

export const getDocuments = () => {
  return axiosClient.get("/documents");
};

export const getDocumentById = (id) => {
  return axiosClient.get(`/documents/${id}`);
};

export const downloadDocument = (id) => {
  return axiosClient.post(`/documents/${id}/download`);
};
