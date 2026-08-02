import axios from "./axiosClient";
import { socket } from "../socket/socket";

export const trackVisitor = async (pathname, deviceInfo) => {
  let sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("session_id", sessionId);
  }

  // Gửi dữ liệu lên API
  await axios.post("/stats/track", {
    sessionId,
    pageUrl: pathname,
    ...deviceInfo,
  });

  // Gửi dữ liệu qua socket
  socket.emit("join-visitor", sessionId);
};
