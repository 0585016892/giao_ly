import axios from "./axiosClient";

export const trackVisitor = async (pathname, deviceInfo) => {
  let sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();

    localStorage.setItem("session_id", sessionId);
  }

  return axios.post("/stats/track", {
    sessionId,

    pageUrl: pathname,

    ...deviceInfo,
  });
};
