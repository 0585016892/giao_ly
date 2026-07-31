import axios from "./axiosClient";
import { socket } from "../scoket/socket";

let joined = false;

export const trackVisitor = async (pathname) => {
  try {
    let sessionId = localStorage.getItem("session_id");

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      localStorage.setItem("session_id", sessionId);
    }

    if (!joined) {
      socket.emit("join-visitor", sessionId);

      joined = true;
    }

    return await axios.post("/stats/track", {
      sessionId,
      pageUrl: pathname,
    });
  } catch (error) {
    console.log("Track visitor error:", error);
  }
};
