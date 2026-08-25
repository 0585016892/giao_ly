import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import { Row, Col, Typography, ConfigProvider } from "antd";
import {
  FacebookFilled,
  YoutubeFilled,
  MailFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  GlobalOutlined,
  RightOutlined,
} from "@ant-design/icons";
import Logo from "../../assets/images/logo.jpg";

const { Text } = Typography;

const FooterBar = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Bảng màu thiết kế cao cấp
  const goldColor = "#D4A017";
  const darkNavy = "#0B192C";
  const bgWhite = "#FFFFFF";

  useEffect(() => {
    socket.on("onlineCount", (count) => {
      setOnlineUsers(count);
    });

    return () => {
      socket.off("onlineCount");
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: goldColor,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <footer className="gx-footer-container">
        {/* 1. HERO CTA BANNER LUXURY */}
        <div className="footer-cta-banner">
          <div className="gx-footer-content">
            <div className="cta-inner">
              <div className="cta-text">
                <span className="cta-badge">ĐỒNG HÀNH CÙNG GIÁO XỨ</span>
                <h3>HÃY CÙNG CHÚNG TÔI XÂY DỰNG CỘNG ĐOÀN</h3>
                <p>
                  Mỗi người là một phần của Giáo xứ. Cùng nhau sống đức tin, yêu
                  thương và phục vụ.
                </p>
              </div>
              <div className="cta-buttons">
                <a href="/hoi-doan" className="btn-gold-glow">
                  <span>THAM GIA CỘNG ĐOÀN</span>
                </a>
                <a href="/contact" className="btn-glass-border">
                  <span>LIÊN HỆ VỚI CHÚNG TÔI</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 2. MAIN FOOTER CONTENT (NỀN TRẮNG TINH TẾ) */}
        <div className="gx-footer-content main-body">
          <Row gutter={[32, 32]}>
            {/* CỘT 1: BRAND & MISSION STATEMENT */}
            <Col xs={24} sm={12} md={6}>
              <div className="footer-brand">
                <div className="brand-logo">
                  <div className="footer-logo-img-wrapper">
                    <img
                      src={Logo}
                      alt="Logo Giáo Xứ Đồng Quan"
                      className="footer-logo-image"
                    />
                  </div>
                  <div className="brand-title-group">
                    <strong>GIÁO XỨ</strong>
                    <span>ĐỒNG QUAN</span>
                  </div>
                </div>
                <p className="brand-desc">
                  Hiệp hành trong đức tin, phục vụ trong yêu thương. Mái ấm
                  thiêng liêng nơi gặp gỡ Chúa Kitô và lan tỏa tình người.
                </p>

                {/* Online Tracker Pill Luxury */}
                <div className="online-tracker-pill">
                  <span className="pulse-container">
                    <span className="pulse-dot" />
                    <span className="pulse-ring" />
                  </span>
                  <Text className="tracker-text">
                    Đang truy cập: <strong>{onlineUsers}</strong>
                  </Text>
                </div>
              </div>
            </Col>

            {/* CỘT 2: LIÊN KẾT NHANH */}
            <Col xs={24} sm={12} md={6}>
              <h5 className="footer-title">
                <span>LIÊN KẾT NHANH</span>
              </h5>
              <div className="footer-links-grid">
                <ul className="footer-links">
                  <li>
                    <a href="/">
                      <RightOutlined className="link-arrow" /> Trang chủ
                    </a>
                  </li>
                  <li>
                    <a href="/gioi-thieu">
                      <RightOutlined className="link-arrow" /> Giới thiệu
                    </a>
                  </li>
                  <li>
                    <a href="/su-kien">
                      <RightOutlined className="link-arrow" /> Sự kiện
                    </a>
                  </li>
                </ul>
                <ul className="footer-links">
                  <li>
                    <a href="/lich-phung-vu">
                      <RightOutlined className="link-arrow" /> Lịch lễ
                    </a>
                  </li>
                  <li>
                    <a href="/hoi-doan">
                      <RightOutlined className="link-arrow" /> Hội đoàn
                    </a>
                  </li>
                  <li>
                    <a href="/contact">
                      <RightOutlined className="link-arrow" /> Liên hệ
                    </a>
                  </li>
                </ul>
              </div>
            </Col>

            {/* CỘT 3: THÔNG TIN LIÊN HỆ */}
            <Col xs={24} sm={12} md={6}>
              <h5 className="footer-title">
                <span>THÔNG TIN LIÊN HỆ</span>
              </h5>
              <ul className="footer-contact-info">
                <li>
                  <div className="info-icon-box">
                    <EnvironmentOutlined />
                  </div>
                  <span>Giáo xứ Đồng Quan, Xã Vũ Quý, Tỉnh Hưng Yên</span>
                </li>
                <li>
                  <div className="info-icon-box">
                    <PhoneOutlined />
                  </div>
                  <span>033 604 1807</span>
                </li>
                <li>
                  <div className="info-icon-box">
                    <MailFilled />
                  </div>
                  <span>giaoxudongquan@gmail.com</span>
                </li>
                <li>
                  <div className="info-icon-box">
                    <GlobalOutlined />
                  </div>
                  <span>www.giaoxudongquan.site</span>
                </li>
              </ul>
            </Col>

            {/* CỘT 4: KẾT NỐI MẠNG XÃ HỘI & BẢN ĐỒ */}
            <Col xs={24} sm={12} md={6}>
              <h5 className="footer-title">
                <span>KẾT NỐI VỚI CHÚNG TÔI</span>
              </h5>
              <div className="brand-socials">
                <a
                  href="https://www.facebook.com/profile.php?id=100077253045004"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="social-btn fb"
                >
                  <FacebookFilled />
                </a>
                <a
                  href="https://www.youtube.com/@xuanthuongstudio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Youtube"
                  className="social-btn yt"
                >
                  <YoutubeFilled />
                </a>
                <a
                  href="mailto:giaoxudongquan@gmail.com"
                  aria-label="Email"
                  className="social-btn mail"
                >
                  <MailFilled />
                </a>
              </div>

              <div className="footer-map-box">
                <iframe
                  title="Bản đồ Giáo xứ Đồng Quan"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.9286361938503!2d106.4010962751596!3d20.42041368108102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135fb75aaaaaaab%3A0xfb0f0731b568e408!2zTmjDoCBUaOG7nSBHacOhbyBY4bupIMSQ4buTbmcgUXVhbg!5e1!3m2!1svi!2s!4v1786346934985!5m2!1svi!2s"
                  width="100%"
                  height="105"
                  style={{ border: 0, borderRadius: 10 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>

          {/* THANH COPYRIGHT & THÁNH GIÁ NGHỆ THUẬT */}
          <div className="footer-bottom">
            <div className="copyright-line-art">
              <span className="fade-line left"></span>
              <div className="cross-badge">✝</div>
              <span className="fade-line right"></span>
            </div>
            <div className="bottom-text">
              © 2026 <strong>GIÁO XỨ ĐỒNG QUAN</strong>. All rights reserved.
              <span className="author-tag">
                Thiết kế bởi <strong>HT DEV</strong>
              </span>
            </div>
          </div>
        </div>

        {/* STYLESHEET CAO CẤP */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .gx-footer-container {
            background-color: ${bgWhite};
            border-top: 1px solid #e2e8f0;
            color: #475569;
            width: 100%;
          }

          .gx-footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          /* 1. BANNER THIẾT KẾ LUXURY (DẢI MÀU SANG TRỌNG TRÊN NỀN) */
          .footer-cta-banner {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 24px 0;
            color: #ffffff;
            position: relative;
            border-bottom: 2px solid ${goldColor};
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }

          .cta-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 24px;
          }

          .cta-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 800;
            color: ${goldColor};
            letter-spacing: 2px;
            margin-bottom: 4px;
          }

          .cta-text h3 {
            color: #ffffff;
            font-size: 17px;
            font-weight: 800;
            letter-spacing: 0.5px;
            margin: 0 0 4px 0;
          }

          .cta-text p {
            margin: 0;
            font-size: 13px;
            color: #94a3b8;
          }

          .cta-buttons {
            display: flex;
            gap: 12px;
            flex-shrink: 0;
          }

          .btn-gold-glow {
            background: linear-gradient(135deg, #d4a017 0%, #b5820f 100%);
            color: #0b192c !important;
            padding: 10px 22px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 12px;
            letter-spacing: 0.5px;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 4px 15px rgba(212, 160, 23, 0.35);
          }

          .btn-gold-glow:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(212, 160, 23, 0.5);
          }

          .btn-glass-border {
            border: 1px solid rgba(255, 255, 255, 0.25);
            background: rgba(255, 255, 255, 0.05);
            color: #ffffff !important;
            padding: 10px 22px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 12px;
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .btn-glass-border:hover {
            border-color: ${goldColor};
            color: ${goldColor} !important;
            background: rgba(212, 160, 23, 0.1);
          }

          /* 2. NỘI DUNG FOOTER CHÍNH NỀN TRẮNG */
          .main-body {
            padding-top: 44px;
            padding-bottom: 24px;
          }

          .brand-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
          }

          .footer-logo-img-wrapper {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid ${goldColor};
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            box-shadow: 0 4px 10px rgba(212, 160, 23, 0.2);
            flex-shrink: 0;
          }

          .footer-logo-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .brand-title-group {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
          }

          .brand-title-group strong {
            font-size: 15px;
            color: ${darkNavy};
            letter-spacing: 1px;
          }

          .brand-title-group span {
            font-size: 12.5px;
            color: ${goldColor};
            font-weight: 700;
          }

          .brand-desc {
            font-size: 12.5px;
            line-height: 1.6;
            color: #64748b;
            margin-bottom: 16px;
          }

          /* Online Tracker Pill Luxury */
          .online-tracker-pill {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 6px 14px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          }

          .pulse-container {
            position: relative;
            width: 8px;
            height: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
          }

          .pulse-ring {
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: rgba(16, 185, 129, 0.4);
            animation: pulseRing 2s infinite ease-out;
          }

          @keyframes pulseRing {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(1.4); opacity: 0; }
          }

          .tracker-text {
            color: #475569 !important;
            font-size: 12px;
          }

          .tracker-text strong {
            color: #0f172a;
          }

          /* Title Mục */
          .footer-title {
            font-size: 13px;
            font-weight: 800;
            color: ${darkNavy};
            margin-bottom: 18px;
            letter-spacing: 0.8px;
            text-transform: uppercase;
            position: relative;
          }

          .footer-title span {
            position: relative;
            display: inline-block;
          }

          .footer-title span::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            width: 20px;
            height: 2px;
            background: ${goldColor};
            border-radius: 2px;
          }

          /* Links Grid & Items */
          .footer-links-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
          }

          .footer-links {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .footer-links a {
            color: #475569;
            text-decoration: none;
            font-size: 12.5px;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.25s ease;
          }

          .link-arrow {
            font-size: 9px;
            color: ${goldColor};
            transition: transform 0.25s ease;
          }

          .footer-links a:hover {
            color: ${goldColor};
            transform: translateX(3px);
          }

          .footer-links a:hover .link-arrow {
            transform: translateX(2px);
          }

          /* Contact Info List */
          .footer-contact-info {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 12.5px;
          }

          .footer-contact-info li {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            color: #475569;
          }

          .info-icon-box {
            width: 26px;
            height: 26px;
            border-radius: 6px;
            background: rgba(212, 160, 23, 0.1);
            color: ${goldColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            flex-shrink: 0;
          }

          /* Social Buttons Luxury */
          .brand-socials {
            display: flex;
            gap: 10px;
            margin-bottom: 14px;
          }

          .social-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff !important;
            font-size: 16px;
            text-decoration: none;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .social-btn:hover {
            transform: translateY(-3px);
          }

          .social-btn.fb { 
            background-color: #1877f2; 
            box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3);
          }
          .social-btn.yt { 
            background-color: #ff0000; 
            box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
          }
          .social-btn.mail { 
            background-color: ${goldColor}; 
            box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3);
          }

          .footer-map-box {
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          }

          /* 3. ARTISTIC BOTTOM BAR */
          .footer-bottom {
            margin-top: 36px;
            padding-top: 16px;
            text-align: center;
          }

          .copyright-line-art {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            margin-bottom: 14px;
          }

          .fade-line {
            height: 1px;
            flex-grow: 1;
            max-width: 200px;
          }

          .fade-line.left {
            background: linear-gradient(90deg, transparent 0%, #cbd5e1 100%);
          }

          .fade-line.right {
            background: linear-gradient(90deg, #cbd5e1 0%, transparent 100%);
          }

          .cross-badge {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(212, 160, 23, 0.12);
            color: ${goldColor};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            font-weight: bold;
          }

          .bottom-text {
            font-size: 12px;
            color: #94a3b8;
          }

          .bottom-text strong {
            color: #475569;
          }

          .author-tag {
            margin-left: 8px;
            padding-left: 8px;
            border-left: 1px solid #cbd5e1;
          }

          /* RESPONSIVE CSS */
          @media (max-width: 768px) {
            .cta-inner {
              flex-direction: column;
              text-align: center;
            }

            .cta-buttons {
              width: 100%;
              justify-content: center;
            }

            .fade-line {
              max-width: 80px;
            }

            .author-tag {
              display: block;
              margin-left: 0;
              padding-left: 0;
              border-left: none;
              margin-top: 4px;
            }
          }

          @media (max-width: 480px) {
            .cta-buttons {
              flex-direction: column;
            }
            .btn-gold-glow, .btn-glass-border {
              text-align: center;
            }
          }
        `,
          }}
        />
      </footer>
    </ConfigProvider>
  );
};

export default FooterBar;
