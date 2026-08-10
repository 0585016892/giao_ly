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
} from "@ant-design/icons";
import Logo from "../../assets/images/logo.jpg";

const { Text, Title } = Typography;

const FooterBar = () => {
  const [onlineUsers, setOnlineUsers] = useState(0);

  // Bảng màu thiết kế chuẩn theo hệ thống
  const goldColor = "#D4A017";
  const darkNavy = "#0B192C";
  const bgLight = "#F8FAFC";

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
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Be Vietnam Pro', sans-serif",
        },
      }}
    >
      <footer className="gx-footer-container">
        <div className="gx-footer-content">
          <Row gutter={[24, 32]}>
            {/* CỘT 1: THƯƠNG HIỆU & GIỚI THIỆU */}
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
                  Giáo xứ Đồng Quan là mái ấm thiêng liêng, nơi mọi người gặp gỡ
                  Chúa Kitô, hiệp nhất trong tình yêu và phục vụ.
                </p>
                <div className="brand-socials">
                  <a
                    href="https://www.facebook.com/profile.php?id=100077253045004"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                  >
                    <FacebookFilled />
                  </a>
                  <a
                    href="https://www.youtube.com/@xuanthuongstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Youtube"
                  >
                    <YoutubeFilled />
                  </a>
                  <a href="mailto:giaoxudongquan@gmail.com" aria-label="Email">
                    <MailFilled />
                  </a>
                </div>
              </div>
            </Col>

            {/* CỘT 2: LIÊN KẾT NHANH */}
            <Col xs={24} sm={12} md={5}>
              <Title level={5} className="footer-title">
                LIÊN KẾT NHANH
              </Title>
              <ul className="footer-links">
                <li>
                  <a href="/">• Trang chủ</a>
                </li>
                <li>
                  <a href="/gioi-thieu">• Giới thiệu</a>
                </li>
                <li>
                  <a href="/su-kien">• Sự kiện</a>
                </li>
                <li>
                  <a href="/lich-phung-vu">• Lịch phụng vụ</a>
                </li>
                <li>
                  <a href="/hoi-doan">• Các hội đoàn</a>
                </li>
                <li>
                  <a href="/contact">• Liên hệ</a>
                </li>
              </ul>
            </Col>

            {/* CỘT 3: THÔNG TIN LIÊN HỆ & TRACKER */}
            <Col xs={24} sm={12} md={7}>
              <Title level={5} className="footer-title">
                THÔNG TIN LIÊN HỆ
              </Title>
              <ul className="footer-contact-info">
                <li>
                  <EnvironmentOutlined className="contact-icon" />
                  <span>
                    Giáo xứ Đồng Quan
                    <br />
                    Xã Vũ Quý, Tỉnh Hưng Yên
                  </span>
                </li>
                <li>
                  <PhoneOutlined className="contact-icon" />
                  <span>033 604 1807</span>
                </li>
                <li>
                  <MailFilled className="contact-icon" />
                  <span>giaoxudongquan@gmail.com</span>
                </li>
                <li>
                  <GlobalOutlined className="contact-icon" />
                  <span>www.giaoxudongquan.site</span>
                </li>
              </ul>

              {/* Online Tracker Pill */}
              <div className="online-tracker-pill">
                <span className="pulse-dot" />
                <Text className="tracker-text">
                  <strong>{onlineUsers}</strong> người đang truy cập
                </Text>
              </div>
            </Col>

            {/* CỘT 4: BẢN ĐỒ */}
            <Col xs={24} sm={12} md={6}>
              <Title level={5} className="footer-title">
                BẢN ĐỒ
              </Title>
              <div className="footer-map-box">
                <iframe
                  title="Bản đồ Giáo xứ Đồng Quan"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.9286361938503!2d106.4010962751596!3d20.42041368108102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135fb75aaaaaaab%3A0xfb0f0731b568e408!2zTmjDoCBUaOG7nSBHacOhbyBY4bupIMSQ4buTbmcgUXVhbg!5e1!3m2!1svi!2s!4v1786346934985!5m2!1svi!2s"
                  width="100%"
                  height="160"
                  style={{ border: 0, borderRadius: 12 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </Col>
          </Row>

          {/* THANH BẢO QUYỀN Ở ĐÁY */}
          <div className="footer-bottom">
            <div className="copyright-text">
              © 2026 GIÁO XỨ ĐỒNG QUAN. All rights reserved.
            </div>
            <div className="author-text">
              Thiết kế với <span className="heart-icon">♥</span> bởi HT DEV
            </div>
          </div>
        </div>

        {/* STYLESHEET TỐI ƯU HIGH-RESPONSIVE */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .gx-footer-container {
            background-color: ${bgLight};
            padding: 48px 0 24px 0;
            border-top: 1px solid #e2e8f0;
            color: #475569;
            width: 100%;
          }

          .gx-footer-content {
            max-width: 1180px;
            margin: 0 auto;
            padding: 0 20px;
          }

          /* Logo Footer Styling */
          .brand-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 14px;
          }

          .footer-logo-img-wrapper {
            width: 40px;
            height: 40px;
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
            line-height: 1.15;
          }

          .brand-title-group strong {
            font-size: 15px;
            color: ${darkNavy};
            letter-spacing: 1px;
          }

          .brand-title-group span {
            font-size: 13px;
            color: ${goldColor};
            font-weight: 700;
          }

          .brand-desc {
            font-size: 13px;
            line-height: 1.6;
            color: #64748b;
            margin-bottom: 18px;
          }

          .brand-socials {
            display: flex;
            gap: 10px;
          }

          .brand-socials a {
            width: 36px;
            height: 36px;
            background: #ffffff;
            color: ${darkNavy};
            border: 1px solid #e2e8f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-size: 15px;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          }

          .brand-socials a:hover {
            background: ${goldColor};
            border-color: ${goldColor};
            color: #ffffff;
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(212, 160, 23, 0.35);
          }

          /* Tiêu đề các mục */
          .footer-title {
            font-size: 13px !important;
            font-weight: 800 !important;
            color: ${darkNavy} !important;
            margin-bottom: 16px !important;
            letter-spacing: 1px;
            text-transform: uppercase;
            position: relative;
            display: inline-block;
          }

          .footer-title::after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            width: 24px;
            height: 2px;
            background: ${goldColor};
            border-radius: 1px;
          }

          /* Cột danh sách liên kết */
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
            font-size: 13px;
            transition: all 0.2s ease;
            display: inline-block;
          }

          .footer-links a:hover {
            color: ${goldColor};
            transform: translateX(4px);
          }

          /* Cột thông tin liên hệ */
          .footer-contact-info {
            list-style: none;
            padding: 0;
            margin: 0 0 18px 0;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-size: 13px;
          }

          .footer-contact-info li {
            display: flex;
            gap: 10px;
            align-items: flex-start;
            color: #475569;
          }

          .contact-icon {
            color: ${goldColor};
            font-size: 15px;
            margin-top: 3px;
            flex-shrink: 0;
          }

          /* Tracker Pill */
          .online-tracker-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          }

          .pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #52c41a;
            border-radius: 50%;
            box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
            animation: pulseDot 1.8s infinite;
          }

          @keyframes pulseDot {
            0% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7); }
            70% { box-shadow: 0 0 0 6px rgba(82, 196, 26, 0); }
            100% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0); }
          }

          .tracker-text {
            color: #475569 !important;
            font-size: 12px;
          }

          .footer-map-box {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          }

          /* Đáy Footer */
          .footer-bottom {
            margin-top: 36px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #94a3b8;
          }

          .heart-icon {
            color: #e11d48;
            font-size: 13px;
          }

          /* RESPONSIVE TRÊN DI ĐỘNG & MÁY TÍNH BẢNG */
          @media (max-width: 768px) {
            .gx-footer-container {
              padding: 36px 0 20px 0;
            }

            .footer-links {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 10px 16px;
            }

            .footer-bottom {
              flex-direction: column-reverse;
              gap: 10px;
              text-align: center;
            }
          }

          @media (max-width: 480px) {
            .gx-footer-content {
              padding: 0 16px;
            }

            .brand-desc {
              font-size: 12px;
            }

            .footer-title {
              margin-bottom: 14px !important;
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
