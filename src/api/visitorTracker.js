import axios from "./axiosClient";
import { socket } from "../socket/socket";

const generateSessionId = () => {
  if (window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }

  return Date.now() + "-" + Math.random().toString(36).substring(2);
};

export const trackVisitor = async (pathname, deviceInfo) => {
  let sessionId = localStorage.getItem("session_id");

  if (!sessionId) {
    sessionId = generateSessionId();

    localStorage.setItem("session_id", sessionId);
  }

  try {
    const res = await axios.post("/stats/track", {
      sessionId,

      pageUrl: pathname,

      ...deviceInfo,
    });

    console.log("TRACK SUCCESS", res.data);

    // socket online

    if (socket.connected) {
      socket.emit("join-visitor", sessionId);
    }

    return res;
  } catch (err) {
    console.log("TRACK ERROR", err);

    throw err;
  }
};
