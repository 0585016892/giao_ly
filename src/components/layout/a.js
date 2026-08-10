import React from "react";
import { Layout, ConfigProvider } from "antd";
import HeaderBar from "./Header/HeaderBar";
import FooterBar from "./FooterBar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

function MainLayout() {
  // Bảng màu Truyền Thống & Tôn Nghiêm
  const primaryColor = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textColor = "#1E293B"; // Xám xanh đen
  const bgColor = "#FAFAFA"; // Nền trắng xám dịu mắt

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          colorLink: primaryColor,
          colorText: textColor,
          colorTextHeading: primaryColor,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
          borderRadius: 8,
        },
        components: {
          Button: {
            colorPrimary: primaryColor,
            colorPrimaryHover: "#132744",
            colorPrimaryActive: "#0D1B30",
          },
        },
      }}
    >
      <Layout className="glhn-main-layout">
        {/* Header Bar */}
        <HeaderBar />

        {/* Nội dung chính - Tràn viền Full Screen */}
        <Content className="glhn-content-wrapper">
          <div className="glhn-page-render">
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <FooterBar />

        {/* Custom Styling */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Import Google Fonts */
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          * {
            box-sizing: border-box;
          }

          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
            color: ${textColor};
            font-family: 'Be Vietnam Pro', sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          /* Style Tiêu đề mang phong cách Kinh tế - Tôn giáo sang trọng */
          h1, h2, h3, .glhn-heading {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryColor};
          }

          .glhn-main-layout {
            min-height: 100vh;
            width: 100%;
            background-color: ${bgColor} !important;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
          }

          .glhn-content-wrapper {
            flex: 1;
            width: 100%;
            margin-top: 0 !important; /* Loại bỏ margin-top để Hero Banner tràn sát Header */
            padding: 0 !important;   /* Loại bỏ padding mặc định */
          }

          .glhn-page-render {
            width: 100%;
            min-height: 80vh;
          }

          /* Floating Button (Nút thập giá / Back to top) */
          .glhn-floating-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 48px;
            height: 48px;
            background-color: ${primaryColor};
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: ${accentGold};
            font-size: 20px;
            box-shadow: 0 8px 24px rgba(27, 54, 93, 0.25);
            cursor: pointer;
            z-index: 999;
            border: 2px solid ${accentGold};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .glhn-floating-btn:hover {
            transform: translateY(-4px);
            background-color: ${accentGold};
            color: ${primaryColor};
            box-shadow: 0 12px 28px rgba(212, 175, 55, 0.4);
          }

          /* RESPONSIVE LOGIC */
          @media (max-width: 768px) {
            .glhn-floating-btn {
              bottom: 20px;
              right: 20px;
              width: 42px;
              height: 42px;
              font-size: 18px;
            }
          }

          @media (max-width: 480px) {
            .glhn-page-render { min-height: 60vh; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
}

export default MainLayout;
