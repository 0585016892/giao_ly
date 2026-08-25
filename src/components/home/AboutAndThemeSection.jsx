import React from "react";
import { Row, Col, Button } from "antd";
import {
  ArrowRight,
  Image as ImageIcon,
  Users,
  Calendar,
  BookOpen,
  Landmark,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import anhNT from "../../assets/images/logonhatho.jpeg";
import anhLgPv from "../../assets/images/logopv.jpg";
const primaryNavy = "#0B1D3A";
const accentGold = "#C59B27";

const STATS_DATA = [
  { icon: <Landmark size={20} />, value: "1965", label: "Năm thành lập" },
  { icon: <Users size={20} />, value: "2.560+", label: "Giáo dân" },
  { icon: <Calendar size={20} />, value: "12+", label: "Đoàn thể" },
  { icon: <BookOpen size={20} />, value: "08", label: "Lớp giáo lý" },
];

const AboutAndThemeSection = () => {
  const navigate = useNavigate();

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="gx-about-theme-section">
      {/* BỌC CONTAINER ĐỂ GIỚI HẠN KHUNG TRANG CHUẨN */}
      <div className="gx-container">
        <Row gutter={[24, 24]} align="stretch">
          {/* CỘT TRÁI: VỀ GIÁO XỨ CHÚNG TÔI */}
          <Col xs={24} lg={12}>
            <motion.div
              className="gx-card gx-about-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <Row gutter={[20, 20]} align="middle" style={{ height: "100%" }}>
                <Col xs={24} sm={10}>
                  <div className="gx-about-img-container">
                    <div className="gx-about-img-frame">
                      <img
                        src={anhNT}
                        alt="Nhà thờ Giáo xứ"
                        className="gx-about-img"
                      />
                      <div className="gx-img-overlay" />
                    </div>
                    <div className="gx-badge-est">
                      <Sparkles size={14} color={accentGold} />
                      <span>Đức Tin & Yêu Thương</span>
                    </div>
                  </div>
                </Col>

                <Col xs={24} sm={14}>
                  <div className="gx-about-content">
                    <span className="gx-section-tag">GIỚI THIỆU CHUNG</span>
                    <h2>VỀ GIÁO XỨ CHÚNG TÔI</h2>
                    <p>
                      Giáo xứ Thánh Giuse được thành lập với sứ mạng loan báo
                      Tin Mừng, xây dựng cộng đoàn hiệp nhất, yêu thương và
                      phụng sự.
                    </p>

                    <motion.div
                      className="gx-stats-grid"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {STATS_DATA.map((item, idx) => (
                        <motion.div
                          className="stat-item"
                          key={idx}
                          variants={itemFadeIn}
                          whileHover={{ y: -3 }}
                        >
                          <div className="stat-icon-wrapper">{item.icon}</div>
                          <strong>{item.value}</strong>
                          <span>{item.label}</span>
                        </motion.div>
                      ))}
                    </motion.div>

                    <Button
                      className="gx-btn-navy"
                      onClick={() => navigate("/gioi-thieu")}
                    >
                      <span>TÌM HIỂU THÊM</span>
                      <ChevronRight size={15} />
                    </Button>
                  </div>
                </Col>
              </Row>
            </motion.div>
          </Col>

          {/* CỘT PHẢI: LOGO PHỤC VỤ CỦA NĂM */}
          <Col xs={24} lg={12}>
            <motion.div
              className="gx-card gx-theme-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
            >
              <div className="theme-card-header">
                <Sparkles size={16} className="header-icon" />
                <span>LOGO PHỤC VỤ CỦA NĂM 2026</span>
                <Sparkles size={16} className="header-icon" />
              </div>

              <div className="theme-card-body">
                {/* VÙNG LOGO HIỆU ỨNG PHÁT SÁNG */}
                <div className="theme-logo-glow-ring">
                  <div className="theme-logo-wrapper">
                    {anhLgPv ? (
                      <img
                        src={anhLgPv}
                        alt="Logo Phục Vụ 2026"
                        className="theme-logo-img"
                      />
                    ) : (
                      <div className="theme-logo-placeholder">
                        <ImageIcon size={36} color={accentGold} />
                        <span>Thêm ảnh Logo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* NỘI DUNG CHỦ ĐỀ */}
                <div className="theme-text-info">
                  <span className="theme-sub-tag">CHỦ ĐỀ MỤC VỤ 2026</span>
                  <h3>Hiệp Hành Trong Đức Tin – Phục Vụ Trong Yêu Thương</h3>
                  <p>
                    Cùng nhau bước đi trong đức tin, lắng nghe – phân định –
                    hành động, để trở nên cộng đoàn hiệp hành, yêu thương và
                    phục vụ.
                  </p>

                  <Button
                    className="gx-btn-gold"
                    onClick={() => navigate("/gioi-thieu")}
                  >
                    <span>KHÁM PHÁ Ý NGHĨA LOGO</span>
                    <ArrowRight size={15} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </div>

      <style>{`
        /* SECTION & CONTAINER WRAPPER */
        .gx-about-theme-section {
          width: 100%;
          padding: 40px 0;
          font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
        }

        .gx-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          width: 100%;
        }

        /* COMMON CARD STYLES */
        .gx-card {
          border-radius: 20px;
          height: 100%;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* 1. CARD VỀ GIÁO XỨ */
        .gx-about-card {
          background: #ffffff;
          padding: 28px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 30px rgba(11, 29, 58, 0.04);
          display: flex;
          align-items: center;
        }

        .gx-about-card:hover {
          box-shadow: 0 20px 40px rgba(11, 29, 58, 0.08);
          border-color: rgba(197, 155, 39, 0.3);
        }

        .gx-about-img-container {
          position: relative;
          width: 100%;
        }

        .gx-about-img-frame {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          padding: 3px;
          background: linear-gradient(135deg, ${accentGold} 0%, #F3E5AB 50%, ${accentGold} 100%);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
        }

        .gx-about-img {
          width: 100%;
          height: 220px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
          transition: transform 0.6s ease;
        }

        .gx-about-card:hover .gx-about-img {
          transform: scale(1.05);
        }

        .gx-badge-est {
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffffff;
          border: 1px solid rgba(197, 155, 39, 0.4);
          padding: 4px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          white-space: nowrap;
        }

        .gx-badge-est span {
          font-size: 11px;
          font-weight: 700;
          color: ${primaryNavy};
          letter-spacing: 0.3px;
        }

        .gx-about-content {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
        }

        .gx-section-tag {
          font-size: 11px;
          font-weight: 800;
          color: ${accentGold};
          letter-spacing: 1.5px;
          margin-bottom: 4px;
        }

        .gx-about-content h2 {
          font-size: 20px;
          font-weight: 800;
          color: ${primaryNavy};
          margin-bottom: 8px;
          letter-spacing: -0.2px;
        }

        .gx-about-content p {
          font-size: 13px;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        /* GRID THỐNG KÊ */
        .gx-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin-bottom: 20px;
          background: #f8fafc;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
        }

        .stat-item {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 6px 2px;
          border-radius: 8px;
          background: #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;
        }

        .stat-icon-wrapper {
          color: ${accentGold};
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-item strong {
          font-size: 14px;
          color: ${primaryNavy};
          font-weight: 800;
          line-height: 1.2;
        }

        .stat-item span {
          font-size: 10px;
          color: #94a3b8;
          font-weight: 600;
          margin-top: 2px;
          white-space: nowrap;
        }

        .gx-btn-navy {
          background: ${primaryNavy} !important;
          color: #ffffff !important;
          border: none !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          height: 42px !important;
          padding: 0 22px !important;
          border-radius: 10px !important;
          letter-spacing: 0.5px;
          box-shadow: 0 6px 16px rgba(11, 29, 58, 0.25);
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          align-self: flex-start;
          transition: all 0.3s ease !important;
        }

        .gx-btn-navy:hover {
          background: #163668 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(11, 29, 58, 0.35);
        }

        /* 2. CARD LOGO PHỤC VỤ SANG TRỌNG */
        .gx-theme-card {
          background: linear-gradient(145deg, #0B1D3A 0%, #051021 100%);
          color: #ffffff;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(197, 155, 39, 0.35);
          box-shadow: 0 12px 35px rgba(11, 29, 58, 0.3);
          position: relative;
        }

        .gx-theme-card:hover {
          border-color: ${accentGold};
          box-shadow: 0 16px 40px rgba(197, 155, 39, 0.15);
        }

        .theme-card-header {
          text-align: center;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: ${accentGold};
          padding: 14px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .header-icon {
          opacity: 0.8;
        }

        .theme-card-body {
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 28px;
          flex: 1;
        }

        .theme-logo-glow-ring {
          position: relative;
          padding: 6px;
          border-radius: 50%;
          background: linear-gradient(135deg, ${accentGold} 0%, rgba(197, 155, 39, 0.2) 100%);
          box-shadow: 0 0 25px rgba(197, 155, 39, 0.3);
          flex-shrink: 0;
        }

        .theme-logo-wrapper {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 3px solid #ffffff;
          box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .theme-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gx-theme-card:hover .theme-logo-img {
          transform: scale(1.08);
        }

        .theme-logo-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #64748b;
        }

        .theme-logo-placeholder span {
          font-size: 11px;
          font-weight: 700;
          color: ${primaryNavy};
        }

        .theme-text-info {
          flex: 1;
        }

        .theme-sub-tag {
          font-size: 11px;
          color: ${accentGold};
          font-weight: 800;
          letter-spacing: 1px;
          display: block;
          margin-bottom: 4px;
        }

        .theme-text-info h3 {
          color: #ffffff;
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 10px 0;
          line-height: 1.35;
          letter-spacing: -0.2px;
        }

        .theme-text-info p {
          font-size: 13px;
          color: rgba(248, 250, 252, 0.8);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .gx-btn-gold {
          background: ${accentGold} !important;
          color: #ffffff !important;
          border: none !important;
          font-weight: 700 !important;
          font-size: 11.5px !important;
          height: 42px !important;
          padding: 0 20px !important;
          border-radius: 10px !important;
          display: inline-flex !important;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 18px rgba(197, 155, 39, 0.35);
          transition: all 0.3s ease !important;
          letter-spacing: 0.3px;
        }

        .gx-btn-gold:hover {
          background: #d6a92e !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(197, 155, 39, 0.5);
        }

        /* RESPONSIVE DESIGN */
        @media (max-width: 992px) {
          .gx-container {
            padding: 0 16px;
          }

          .theme-card-body {
            flex-direction: column;
            text-align: center;
            padding: 24px 20px;
          }
          
          .theme-text-info {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .gx-about-card {
            padding: 20px;
          }

          .gx-about-content {
            text-align: center;
            align-items: center;
            margin-top: 15px;
          }

          .gx-btn-navy {
            align-self: center;
          }

          .gx-stats-grid {
            width: 100%;
          }
        }

        @media (max-width: 576px) {
          .gx-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          
          .gx-about-img {
            height: 180px;
          }

          .theme-logo-wrapper {
            width: 120px;
            height: 120px;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutAndThemeSection;
