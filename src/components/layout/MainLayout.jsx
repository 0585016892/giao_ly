import React from "react";
import { Layout, ConfigProvider } from "antd";
import HeaderBar from "./HeaderBar";
import FooterBar from "./FooterBar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

function MainLayout() {
  const primaryColor = "#b39164"; 
  const bgColor = "#fcfaf2";      
  const accentColor = "rgba(179, 145, 100, 0.05)"; 


  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          fontFamily: "'Inter', -apple-system, sans-serif",
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
        
        {/* Nút Thập giá (Scroll to top / Support) */}
       

        <style dangerouslySetInnerHTML={{ __html: `
          .glhn-main-layout {
            min-height: 100vh;
            background-color: ${bgColor} !important;
            background-image: 
              radial-gradient(at 0% 0%, ${accentColor} 0px, transparent 50%),
              radial-gradient(at 100% 0%, ${accentColor} 0px, transparent 50%);
            display: flex;
            flex-direction: column;
          }

          .glhn-content-wrapper {
            flex: 1;
            margin-top: 20px; /* Khoảng cách dưới Header */
            padding-bottom: 40px;
          }

          .glhn-container {
            margin: 0 auto;
          }

          .glhn-page-render {
            min-height: 70vh;
          }

          /* Floating Button */
          .glhn-floating-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: ${primaryColor};
            border-radius: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 22px;
            box-shadow: 0 8px 20px rgba(93, 64, 55, 0.2);
            cursor: pointer;
            z-index: 999;
            border: 2px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .glhn-floating-btn:hover {
            transform: translateY(-5px);
            background-color: #3e2723;
            box-shadow: 0 12px 25px rgba(62, 39, 35, 0.4);
          }

          /* RESPONSIVE LOGIC */
          @media (max-width: 768px) {
            .glhn-content-wrapper { margin-top: 10px; }
            .glhn-container { padding: 0 16px; }
            .glhn-floating-btn {
              bottom: 20px;
              right: 20px;
              width: 42px;
              height: 42px;
              font-size: 18px;
              border-radius: 12px;
            }
          }

          @media (max-width: 480px) {
            .glhn-page-render { min-height: 60vh; }
          }

          /* Tối ưu hiển thị text */
          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}} />
      </Layout>
    </ConfigProvider>
  );
}

export default MainLayout;