import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackVisitor } from "../api/visitorTracker";

const VisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackVisitor(location.pathname);

    const timer = setInterval(() => {
      trackVisitor(location.pathname);
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, [location.pathname]);

  return null;
};

export default VisitorTracker;
