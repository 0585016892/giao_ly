import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên đầu trang mỗi khi đường dẫn (pathname) thay đổi
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // "smooth" để cuộn mượt, "auto" để lên ngay lập tức
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;