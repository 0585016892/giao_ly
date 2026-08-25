import React from "react";
import { motion } from "framer-motion";
import { FacebookFilled, YoutubeFilled } from "@ant-design/icons";
import { Mail, Cross } from "lucide-react";

const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  youtube: "https://youtube.com",
};

const FloatingSocialBar = ({ onShare }) => {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = (e) => {
    e.preventDefault();
    if (onShare) onShare();
  };

  return (
    <>
      <motion.div
        className="gx-social-float-glass"
        initial={{ opacity: 0, x: 40 }}
        animate={{
          opacity: 1,
          x: 0,
          y: ["-50%", "-54%", "-50%"],
        }}
        transition={{
          x: { duration: 0.8, delay: 0.6 },
          opacity: { duration: 0.8, delay: 0.6 },
          y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
        }}
      >
        <motion.a
          href="#top"
          className="social-icon cross-btn"
          onClick={scrollToTop}
          title="Lên đầu trang"
          whileHover={{ scale: 1.18, x: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <Cross size={18} />
        </motion.a>

        <motion.a
          href={SOCIAL_LINKS.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon fb-btn"
          title="Facebook Giáo xứ"
          whileHover={{ scale: 1.18, x: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <FacebookFilled style={{ fontSize: 18 }} />
        </motion.a>

        <motion.a
          href={SOCIAL_LINKS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon yt-btn"
          title="Youtube Giáo xứ"
          whileHover={{ scale: 1.18, x: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <YoutubeFilled style={{ fontSize: 18 }} />
        </motion.a>

        <motion.a
          href="#share"
          onClick={handleShare}
          className="social-icon share-btn"
          title="Chia sẻ"
          whileHover={{ scale: 1.18, x: -4 }}
          whileTap={{ scale: 0.92 }}
        >
          <Mail size={18} />
        </motion.a>
      </motion.div>

      <style>{`
        .gx-social-float-glass {
  /* Cố định theo khung hình trình duyệt */
  position: fixed !important;
  right: 16px !important;
  
  /* Căn chính giữa theo chiều dọc */
  top: 50% !important;
  transform: translateY(-50%) !important;
  
  /* Đảm bảo luôn đè lên trên các phần tử khác */
  z-index: 9999 !important;
  
  /* Layout hiển thị các nút */
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  /* Styling bo tròn & hiệu ứng */
  background: rgba(11, 25, 44, 0.9);
  padding: 10px 8px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

        .gx-social-float-glass .social-icon {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        .gx-social-float-glass .cross-btn:hover {
          background: #C59B27;
          border-color: #C59B27;
          color: #ffffff;
        }

        .gx-social-float-glass .fb-btn:hover {
          background: #1877f2;
          border-color: #1877f2;
          color: #ffffff;
        }

        .gx-social-float-glass .yt-btn:hover {
          background: #ff0000;
          border-color: #ff0000;
          color: #ffffff;
        }

        .gx-social-float-glass .share-btn:hover {
          background: #0D9488;
          border-color: #0D9488;
          color: #ffffff;
        }

        @media (max-width: 768px) {
          .gx-social-float-glass {
            right: 10px;
            padding: 8px 6px;
            gap: 10px;
          }
          .gx-social-float-glass .social-icon {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingSocialBar;
