import axios from "./axiosClient";

/* =====================================================
   GET ALL MEDIA
===================================================== */

export const getMedia = async (params = {}) => {
  try {
    return await axios.get("/media", {
      params,
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách media:", error);
    throw error;
  }
};

/* =====================================================
   GET MEDIA DETAIL
===================================================== */

export const getMediaById = async (id) => {
  try {
    if (!id) {
      throw new Error("Thiếu ID media");
    }

    return await axios.get(`/media/${id}`);
  } catch (error) {
    console.error("Lỗi lấy chi tiết media:", error);
    throw error;
  }
};

/* =====================================================
   CREATE MEDIA
===================================================== */

export const createMedia = async (formData) => {
  try {
    return await axios.post("/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("Lỗi tạo media:", error);
    throw error;
  }
};

/* =====================================================
   INCREASE VIEW
===================================================== */

export const increaseMediaView = async (id) => {
  try {
    if (!id) {
      throw new Error("Thiếu ID media");
    }

    return await axios.post(`/media/${id}/view`);
  } catch (error) {
    console.error("Lỗi tăng lượt xem media:", error);
    throw error;
  }
};

/* =====================================================
   SEARCH MEDIA
===================================================== */

export const searchMedia = async (keyword, params = {}) => {
  try {
    return await axios.get("/media/search", {
      params: {
        ...params,
        keyword: keyword?.trim() || "",
      },
    });
  } catch (error) {
    console.error("Lỗi tìm kiếm media:", error);
    throw error;
  }
};

/* =====================================================
   GET AUDIO
===================================================== */

export const getAudios = async (params = {}) => {
  try {
    return await axios.get("/media", {
      params: {
        ...params,
        type: "audio",
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách audio:", error);
    throw error;
  }
};

/* =====================================================
   GET VIDEO
===================================================== */

export const getVideos = async (params = {}) => {
  try {
    return await axios.get("/media", {
      params: {
        ...params,
        type: "video",
      },
    });
  } catch (error) {
    console.error("Lỗi lấy danh sách video:", error);
    throw error;
  }
};

/* =====================================================
   GET MEDIA BY CATEGORY
===================================================== */

export const getMediaByCategory = async (category, params = {}) => {
  try {
    return await axios.get("/media/category", {
      params: {
        ...params,
        category,
      },
    });
  } catch (error) {
    console.error("Lỗi lấy media theo danh mục:", error);
    throw error;
  }
};

/* =====================================================
   DEFAULT API OBJECT
===================================================== */

const mediaApi = {
  getMedia,
  getMediaById,
  createMedia,
  increaseMediaView,
  searchMedia,
  getAudios,
  getVideos,
  getMediaByCategory,
};

export default mediaApi;
