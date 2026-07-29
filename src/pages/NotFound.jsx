import React from "react";
import { Result, Button, Typography, ConfigProvider } from "antd";
import { useNavigate } from "react-router-dom";
import { CompassOutlined, HomeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const NotFound = () => {
  const navigate = useNavigate();

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 14,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <div className="glhn-404-wrapper">
        <div className="glhn-404-card">
          <Result
            status="404"
            icon={
              <div className="glhn-404-icon-box">
                <CompassOutlined className="floating-compass" />
              </div>
            }
            title={
              <Title level={1} className="glhn-404-number">
                404
              </Title>
            }
            subTitle={
              <div style={{ marginTop: "12px" }}>
                <span className="glhn-404-tag">LỐI ĐI KHÔNG TÌM THẤY</span>
                <Title level={3} className="glhn-404-heading">
                  Dường Như Bạn Đã Lạc Mất Lối Đi?
                </Title>
                <div className="gold-accent-divider" />
                <Text className="glhn-404-desc">
                  Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển dời.{" "}
                  <br />
                  Đừng lo lắng, hãy để chúng tôi dẫn bạn quay lại hành trình Đức
                  Tin.
                </Text>
              </div>
            }
            extra={[
              <Button
                type="primary"
                key="home"
                size="large"
                icon={<HomeOutlined style={{ color: accentGold }} />}
                onClick={() => navigate("/")}
                className="glhn-home-btn"
              >
                QUAY VỀ TRANG CHỦ
              </Button>,
            ]}
          />
        </div>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .glhn-404-wrapper {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${softBg};
            padding: 20px;
            text-align: center;
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .glhn-404-card {
            background: #ffffff;
            border-radius: 24px;
            padding: 40px 32px;
            max-width: 680px;
            width: 100%;
            border: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow: 0 10px 36px rgba(27, 54, 93, 0.06);
          }

          .glhn-404-icon-box {
            margin-bottom: 8px;
            display: flex;
            justify-content: center;
          }

          .floating-compass {
            font-size: 88px;
            color: ${accentGold};
            animation: floatAndRotate 4s ease-in-out infinite;
          }

          @keyframes floatAndRotate {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-16px) rotate(15deg); }
            100% { transform: translateY(0px) rotate(0deg); }
          }

          .glhn-404-number {
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: 72px !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            line-height: 1 !important;
            font-weight: 800 !important;
            letter-spacing: -1px;
          }

          .glhn-404-tag {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            padding: 4px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            display: inline-block;
            margin-bottom: 12px;
          }

          .glhn-404-heading {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            margin: 0 0 8px 0 !important;
            font-size: 24px !important;
          }

          .gold-accent-divider {
            width: 50px;
            height: 3px;
            background: ${accentGold};
            margin: 12px auto;
            border-radius: 2px;
          }

          .glhn-404-desc {
            font-size: 15px;
            color: #64748b;
            line-height: 1.65;
            display: block;
            margin-bottom: 8px;
          }

          .glhn-home-btn {
            height: 48px !important;
            padding: 0 36px !important;
            border-radius: 24px !important;
            font-weight: 700 !important;
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            color: #ffffff !important;
            letter-spacing: 0.5px;
            box-shadow: 0 6px 20px rgba(27, 54, 93, 0.2);
            transition: all 0.3s ease !important;
          }

          .glhn-home-btn:hover {
            background: #132744 !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
          }

          @media (max-width: 576px) {
            .glhn-404-card { padding: 24px 16px; }
            .floating-compass { font-size: 64px; }
            .glhn-404-number { font-size: 56px !important; }
            .glhn-404-heading { font-size: 20px !important; }
            .glhn-404-desc { font-size: 14px; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default NotFound;
