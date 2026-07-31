import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackVisitor } from "../api/visitorTracker";

const VisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const sendVisitor = () => {
      trackVisitor(location.pathname, {
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,

        language: navigator.language,

        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    };

    sendVisitor();

    const timer = setInterval(sendVisitor, 60000);

    return () => clearInterval(timer);
  }, [location.pathname]);

  return null;
};

export default VisitorTracker;
