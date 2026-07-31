import { socket } from "../../socket/socket";
import { useEffect, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  Button,
  ConfigProvider,
} from "antd";
import {
  FacebookFilled,
  YoutubeFilled,
  MailOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  HeartFilled,
} from "@ant-design/icons";

const { Footer } = Layout;
const { Text, Title } = Typography;

const FooterBar = () => {
  // Bảng màu Truyền Thống & Tôn Nghiêm (Option 1)
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Xanh Đêm Đậm (Nền Footer)
  const accentGold = "#D4AF37"; // Vàng Đồng (Điểm nhấn)
  const lightGold = "#E6C665";
  const [onlineUsers, setOnlineUsers] = useState(0);
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
          colorPrimary: primaryNavy,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Footer className="glhn-footer-container">
        <div className="glhn-footer-content">
          <Row gutter={[32, 40]}>
            {/* CỘT 1: GIỚI THIỆU */}
            <Col xs={24} md={9} lg={10}>
              <Space align="center" className="glhn-footer-brand">
                <div className="glhn-footer-logo-box">
                  <HeartFilled
                    style={{ color: primaryNavy, fontSize: "18px" }}
                  />
                </div>
                <Title level={4} className="glhn-brand-title">
                  GIÁO XỨ ĐỒNG QUAN
                </Title>
              </Space>
              <div style={{ marginTop: "20px" }}>
                <Text className="glhn-footer-quote">
                  "Sự gì Thiên Chúa đã phối hợp, loài người không được phân ly."
                  (Mt 19,6)
                </Text>
                <Text className="glhn-footer-desc">
                  Chương trình được biên soạn nhằm đồng hành cùng các bạn trẻ
                  chuẩn bị bước vào đời sống hôn nhân với nền tảng đức tin vững
                  vàng và tình yêu Kitô giáo.
                </Text>
              </div>
            </Col>

            {/* CỘT 2: LIÊN HỆ */}
            <Col xs={24} sm={12} md={8} lg={7}>
              <Title level={5} className="glhn-footer-section-title">
                Văn phòng Giáo xứ
              </Title>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <div className="glhn-contact-item">
                  <EnvironmentOutlined className="glhn-icon" />
                  <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    Giáo xứ Đồng Quan, Xã Vũ Quý, Kiến Xương, Thái Bình
                  </Text>
                </div>
                <div className="glhn-contact-item">
                  <PhoneOutlined className="glhn-icon" />
                  <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    033.604.1807 (Admin)
                  </Text>
                </div>
                <div className="glhn-contact-item">
                  <MailOutlined className="glhn-icon" />
                  <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                    tranhung6829@gmail.com
                  </Text>
                </div>
              </Space>
            </Col>

            {/* CỘT 3: KẾT NỐI */}
            <Col xs={24} sm={12} md={7} lg={7} className="glhn-social-col">
              <Title level={5} className="glhn-footer-section-title">
                Kết nối cộng đoàn
              </Title>
              <Space size="middle">
                <Button
                  className="glhn-social-btn"
                  icon={<FacebookFilled />}
                  shape="circle"
                  size="large"
                />
                <Button
                  className="glhn-social-btn"
                  icon={<YoutubeFilled />}
                  shape="circle"
                  size="large"
                />
              </Space>
              <div style={{ marginTop: "25px" }}>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.45)",
                    fontSize: "12px",
                    display: "block",
                  }}
                >
                  Website chính thức thuộc <br /> Giáo xứ Đồng Quan
                </Text>
                <div className="online-tracker-pill">
                  <span className="pulse-dot" />
                  <Text className="tracker-text">
                    <strong>{onlineUsers}</strong> đang trực tuyến
                  </Text>
                </div>
              </div>
            </Col>
          </Row>

          <Divider
            style={{
              borderColor: "rgba(212, 175, 55, 0.2)",
              margin: "40px 0 25px",
            }}
          />

          <div className="glhn-footer-bottom">
            <Text className="glhn-copyright">
              © 2026 GIÁO XỨ ĐỒNG QUAN - Ban Mục vụ
            </Text>
            <Space
              className="glhn-footer-links"
              split={
                <Divider
                  type="vertical"
                  style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
                />
              }
            >
              <a href="terms" className="glhn-footer-link">
                Điều khoản
              </a>
              <a href="guide" className="glhn-footer-link">
                Hướng dẫn học
              </a>
            </Space>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-footer-container {
            background-color: ${deepNavy} !important;
            padding: 60px 20px 30px !important;
            margin-top: 60px;
            border-top: 3px solid ${accentGold};
          }

          .glhn-footer-content {
            max-width: 1200px;
            margin: 0 auto;
          }

          .glhn-brand-title {
            color: #ffffff !important;
            margin: 0 !important;
            letter-spacing: 1px;
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: 18px !important;
          }

          .glhn-footer-logo-box {
            background: ${accentGold};
            padding: 8px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
          }

          .glhn-footer-quote {
            color: ${lightGold};
            font-style: italic;
            font-family: 'Playfair Display', Georgia, serif;
            display: block;
            margin-bottom: 12px;
            font-size: 15px;
            line-height: 1.5;
          }

          .glhn-footer-desc {
            color: rgba(255, 255, 255, 0.6);
            font-size: 13px;
            line-height: 1.6;
            display: block;
          }

          .glhn-footer-section-title {
            color: ${accentGold} !important;
            margin-bottom: 24px !important;
            text-transform: uppercase;
            font-size: 14px !important;
            letter-spacing: 1px;
            font-weight: 700 !important;
          }

          .glhn-contact-item {
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }

          .glhn-icon {
            color: ${accentGold};
            margin-top: 4px;
            font-size: 16px;
          }

          .glhn-social-btn {
            background: rgba(255, 255, 255, 0.08) !important;
            border: 1px solid rgba(212, 175, 55, 0.3) !important;
            color: ${accentGold} !important;
            transition: all 0.3s ease !important;
          }

          .glhn-social-btn:hover {
            background: ${accentGold} !important;
            color: ${primaryNavy} !important;
            border-color: ${accentGold} !important;
            transform: translateY(-3px);
            box-shadow: 0 6px 16px rgba(212, 175, 55, 0.3);
          }

          .glhn-footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
          }

          .glhn-copyright {
            color: rgba(255, 255, 255, 0.5);
            font-size: 13px;
          }

          .glhn-footer-link {
            color: rgba(255, 255, 255, 0.6);
            font-size: 12px;
            transition: color 0.2s ease;
          }

          .glhn-footer-link:hover {
            color: ${accentGold};
          }
 /* Online Tracker Pill */
          .online-tracker-pill {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 8px 16px;
            border-radius: 30px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
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
            70% { box-shadow: 0 0 0 8px rgba(82, 196, 26, 0); }
            100% { box-shadow: 0 0 0 0 rgba(82, 196, 26, 0); }
          }

          .tracker-text {
            color: rgba(255, 255, 255, 0.85) !important;
            font-size: 12px;
          }

          /* RESPONSIVE */
          @media (max-width: 768px) {
            .glhn-footer-container { padding: 40px 16px 20px !important; }
            .glhn-footer-brand { justify-content: center; }
            .glhn-footer-quote, .glhn-footer-desc { text-align: center; }
            .glhn-social-col { text-align: center; }
            .glhn-footer-section-title { text-align: center; }
            .glhn-footer-bottom { justify-content: center; text-align: center; flex-direction: column-reverse; }
            .glhn-contact-item { justify-content: flex-start; }
          }
        `,
          }}
        />
      </Footer>
    </ConfigProvider>
  );
};

export default FooterBar;
