import React from "react";
import { Layout, ConfigProvider } from "antd";
import HeaderBar from "./HeaderBar";
import FooterBar from "./FooterBar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

function MainLayout() {
  // Bảng màu Truyền Thống & Tôn Nghiêm (Option 1)
  const primaryColor = "#1B365D"; // Xanh Đêm Navy (Chủ đạo / Trang trọng)
  const accentGold = "#D4AF37"; // Vàng Đồng (Điểm nhấn / Linh thiêng)
  const textColor = "#1E293B"; // Xám xanh đen (Nổi bật trên nền sáng)
  const bgColor = "#FAFAFA"; // Trắng xám nhẹ (Dịu mắt)
  const subtleGlow = "rgba(27, 54, 93, 0.04)";

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

        {/* Nội dung chính */}
        <Content className="glhn-content-wrapper">
          <div className="glhn-container">
            <div className="glhn-page-render">
              <Outlet />
            </div>
          </div>
        </Content>

        {/* Footer */}
        <FooterBar />

        {/* Custom Styling */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* Import Google Fonts trực tiếp */
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          body {
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
            background-color: ${bgColor} !important;
            background-image: 
              radial-gradient(at 0% 0%, ${subtleGlow} 0px, transparent 50%),
              radial-gradient(at 100% 0%, ${subtleGlow} 0px, transparent 50%);
            display: flex;
            flex-direction: column;
          }

          .glhn-content-wrapper {
            flex: 1;
            margin-top: 24px;
          }

          .glhn-container {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
          }

          .glhn-page-render {
            min-height: 70vh;
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
            .glhn-content-wrapper { margin-top: 12px; }
            .glhn-container { padding: 0 16px; }
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
