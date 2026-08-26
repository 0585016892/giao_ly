import React from "react";
import { Button } from "antd";
import {
  ReloadOutlined,
  HomeOutlined,
  WarningFilled,
  HeartFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import logo from "../../assets/images/logo.jpg";
import backgroundPC from "../../assets/images/anh1.png";
import backgroundMobile from "../../assets/images/anh2.png";

const colors = {
  primary: "#183b63",
  primaryDark: "#102c4b",
  gold: "#b88a2d",
  goldLight: "#d7b66b",
  text: "#334155",
  danger: "#c95149",
};

// Motion Variants Definition
const cardVariants = {
  hidden: { opacity: 0, x: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const logoVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

const ApiError = ({
  title = "Không thể kết nối đến máy chủ",
  subTitle = "Hệ thống của Giáo xứ hiện đang gặp sự cố hoặc đang được bảo trì. Xin vui lòng thử lại sau ít phút.",
  onRetry,
}) => {
  const navigate = useNavigate();

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .api-error-page {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end; 
          position: relative;
          overflow: hidden;
          padding: 40px 8%;
          background-color: #f0f2f5;
        }

        /* RESPONSIVE BACKGROUND IMAGE */
        .api-error-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .api-error-bg img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* CONTAINER CARD */
        .api-error-card {
          position: relative;
          z-index: 10;
          max-width: 580px;
          width: 100%;
          padding: 45px 35px;
          border-radius: 28px;
          text-align: center;
          display: flex;
          gap: 16px;
          flex-direction: column;
          gap:25px;
          align-items: center;
        }

        /* BRAND & LOGO */
        .api-error-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 10px;
        }

        .api-error-logo {
          width: 76px;
          height: 76px;
          object-fit: contain;
          border-radius: 50%;
          margin-bottom: 40px;
          box-shadow: 0 8px 20px rgba(24, 59, 99, 0.18);
        }

        .api-error-parish-name {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          color: ${colors.primary};
          font-size: clamp(28px, 2.5vw, 38px);
          font-weight: 700;
          letter-spacing: 1px;
          line-height: 1;
        }

        .api-error-tagline {
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          color: ${colors.gold};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .api-error-tagline::before,
        .api-error-tagline::after {
          content: "";
          width: 30px;
          height: 1px;
          background: ${colors.gold};
          opacity: 0.7;
        }

        .api-error-small-cross {
          color: ${colors.gold};
          font-size: 20px;
          margin-bottom: 8px;
        }

        /* ALERT TAG */
        .api-error-alert {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 16px;
          margin-bottom: 8px;
          border-radius: 100px;
          background: #fdf0ee;
          color: ${colors.danger};
          font-size: 13px;
          font-weight: 600;
          border: 1px solid rgba(201, 81, 73, 0.15);
        }

        /* TITLES */
        .api-error-title {
          margin: 0;
          color: ${colors.primaryDark};
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(24px, 2.2vw, 32px);
          line-height: 1.3;
          font-weight: 700;
        }

        .api-error-subtitle {
          max-width: 480px;
          margin: 4px auto 16px;
          color: ${colors.text};
          font-size: 14px;
          line-height: 1.65;
        }

        /* BUTTONS */
        .api-error-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 16px;
          width: 100%;
        }

        .api-error-btn {
          height: 46px !important;
          min-width: 160px;
          padding: 0 22px !important;
          border-radius: 100px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .api-error-btn-retry {
          color: white !important;
          background: ${colors.primary} !important;
          border-color: ${colors.primary} !important;
          box-shadow: 0 8px 20px rgba(24, 59, 99, 0.2);
        }

        .api-error-btn-home {
          color: ${colors.primary} !important;
          border: 1px solid rgba(24, 59, 99, 0.25) !important;
          background: rgba(255, 255, 255, 0.85) !important;
        }

        /* BIBLE VERSE */
        .api-error-verse {
          width: 100%;
          padding-top: 18px;
          border-top: 1px solid rgba(24, 59, 99, 0.12);
          position: relative;
        }

        .api-error-verse-cross {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0 10px;
          background: rgba(255, 255, 255, 0.96);
          color: ${colors.gold};
          font-size: 18px;
        }

        .api-error-verse p {
          margin: 0 0 4px;
          color: ${colors.primary};
          font-family: Georgia, "Times New Roman", serif;
          font-size: 14px;
          font-style: italic;
        }

        .api-error-verse span {
          color: #64748b;
          font-size: 12px;
        }

        .api-error-heart {
          margin-left: 6px;
          color: ${colors.gold};
          font-size: 11px;
          display: inline-block;
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 992px) {
          .api-error-page {
            justify-content: center;
            padding: 30px 20px;
          }
        }

        @media (max-width: 600px) {
          .api-error-page {
            padding: 20px 15px;
          }
 .api-error-card {
                  gap: 9px;
          background: rgb(255 255 255 / 61%);
          box-shadow: 
            -15px 25px 60px rgba(16, 44, 75, 0.18),
            0 4px 15px rgba(0, 0, 0, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
        }
          .api-error-actions {
            align-items: center;
            gap: 10px;
          }

          .api-error-btn {
            width: 100%;
            max-width: 280px;
          }
          .api-error-parish-name{
          margin: 10px 0;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0;
          }
    .api-error-title{
    font-size: 20px;
    }
        }
      `}</style>

      <div className="api-error-page">
        {/* Background Zoom-in Animation */}
        <motion.picture
          className="api-error-bg"
          initial={{ scale: 1.1, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <source media="(max-width: 768px)" srcSet={backgroundMobile} />
          <img src={backgroundPC} alt="Nhà thờ Giáo xứ Background" />
        </motion.picture>

        {/* Main Card Component */}
        <motion.main
          className="api-error-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="api-error-brand" variants={itemVariants}>
            <motion.img
              src={logo}
              alt="Logo Giáo xứ"
              className="api-error-logo"
              variants={logoVariants}
              whileHover={{ scale: 1.08, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <h2 className="api-error-parish-name">GIÁO XỨ ĐỒNG QUAN</h2>
            <div className="api-error-tagline">
              SỐNG ĐỨC TIN
              <span>•</span>
              HIỆP NHẤT
              <span>•</span>
              YÊU THƯƠNG
            </div>
          </motion.div>

          <motion.div
            className="api-error-small-cross"
            variants={itemVariants}
            whileHover={{ scale: 1.25, rotate: 10 }}
          >
            ✝
          </motion.div>

          {/* Alert Tag với hiệu ứng Y-bounce nhẹ */}
          <motion.div
            className="api-error-alert"
            variants={itemVariants}
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <WarningFilled />
            <span>Rất tiếc, đã xảy ra sự cố!</span>
          </motion.div>

          <motion.h1 className="api-error-title" variants={itemVariants}>
            {title}
          </motion.h1>

          <motion.p className="api-error-subtitle" variants={itemVariants}>
            {subTitle}
          </motion.p>

          <motion.div className="api-error-actions" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={handleRetry}
                className="api-error-btn api-error-btn-retry"
              >
                Thử lại
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
                className="api-error-btn api-error-btn-home"
              >
                Về trang chủ
              </Button>
            </motion.div>
          </motion.div>

          <motion.div className="api-error-verse" variants={itemVariants}>
            <div className="api-error-verse-cross">✝</div>
            <p>
              “Hãy vững tâm, Thầy đã thắng thế gian.”
              <motion.span
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 1, 0.8] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block" }}
              >
                <HeartFilled className="api-error-heart" />
              </motion.span>
            </p>
            <span>Ga 16,33</span>
          </motion.div>
        </motion.main>
      </div>
    </>
  );
};

export default ApiError;
