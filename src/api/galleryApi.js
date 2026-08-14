import axiosClient from "./axiosClient";

export const getGalleryImages = async () => {
  const response = await axiosClient.get("/gallery/images");
  return response;
};
