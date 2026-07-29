import React, { useState } from "react";
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Button,
  Drawer,
  ConfigProvider,
} from "antd";
import {
  HomeOutlined,
  ReadOutlined,
  CloudDownloadOutlined,
  MessageOutlined,
  MenuOutlined,
  BankOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.jpg";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // Bảng màu Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B"; // Xám xanh đen

  // CẤU TRÚC MENU DẪN LINK & SUBMENU
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "TRANG CHỦ",
    },
    {
      key: "courses-group",
      icon: <ReadOutlined />,
      label: "CHƯƠNG TRÌNH GIÁO LÝ",
      children: [
        { key: "/giao-ly/hon-nhan", label: "Giáo lý Hôn nhân" },
        { key: "/giao-ly/du-tong", label: "Giáo lý Dự tòng" },
        { key: "/courses/thieu-nhi", label: "Giáo lý Thiếu nhi" },
        { key: "/exam", label: "Thi trắc nghiệm giáo lý dự tòng" },
      ],
    },
    {
      key: "/docs",
      icon: <CloudDownloadOutlined />,
      label: "KHO TÀI LIỆU",
      children: [
        { key: "/prayers", label: "Kinh đọc hằng ngày" },
        { key: "/exam-prayer", label: "Khảo kinh (dành cho tân tòng)" },
        { key: "/exam-search", label: "Tra cứu kết quả kiểm tra" },
        { key: "/tai-lieu", label: "Tài liệu" },
        { key: "/prayers/thanh-ca", label: "Thánh ca học tập" },
      ],
    },
    {
      key: "/giao-xu",
      icon: <BankOutlined />,
      label: "THÔNG TIN GIÁO XỨ",
    },
  ];

  const handleMenuClick = (e) => {
    if (e.key.startsWith("/")) {
      navigate(e.key);
      setOpenMobileMenu(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 8,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
        components: {
          Menu: {
            horizontalItemSelectedColor: primaryNavy,
            horizontalItemHoverColor: accentGold,
            itemHoverColor: accentGold,
            itemSelectedColor: primaryNavy,
            itemHoverBg: "rgba(212, 175, 55, 0.08)",
            popupBg: "#ffffff",
          },
          Button: {
            colorPrimary: primaryNavy,
            colorPrimaryHover: "#132744",
          },
        },
      }}
    >
      <div className="glhn-header-wrapper">
        <Header className="glhn-custom-header">
          {/* LEFT: LOGO */}
          <div className="glhn-logo-section" onClick={() => navigate("/")}>
            <Avatar
              size={{ xs: 38, sm: 40, md: 46 }}
              src={Logo}
              className="glhn-logo-avatar"
            />
            <div className="glhn-logo-text">
              <Text className="glhn-main-title">
                GIÁO XỨ <span style={{ color: accentGold }}>ĐỒNG QUAN</span>
              </Text>
              <Text className="glhn-sub-title">GIÁO LÝ HÔN NHÂN</Text>
            </div>
          </div>

          {/* CENTER: DESKTOP MENU */}
          <div className="glhn-desktop-menu-container">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              className="glhn-header-menu"
              expandIcon={
                <DownOutlined style={{ fontSize: "10px", color: accentGold }} />
              }
            />
          </div>

          {/* RIGHT: ACTION BUTTON & MOBILE TOGGLE */}
          <div className="glhn-action-section">
            <Button
              type="primary"
              shape="round"
              icon={<MessageOutlined style={{ color: accentGold }} />}
              className="glhn-contact-btn"
              onClick={() => navigate("/contact")}
            >
              <span className="glhn-btn-text">LIÊN HỆ</span>
            </Button>

            <Button
              type="text"
              icon={
                <MenuOutlined
                  style={{ fontSize: "20px", color: primaryNavy }}
                />
              }
              className="glhn-mobile-menu-btn"
              onClick={() => setOpenMobileMenu(true)}
            />
          </div>
        </Header>

        {/* MOBILE DRAWER */}
        <Drawer
          title={
            <span
              style={{
                color: primaryNavy,
                fontWeight: 700,
                fontFamily: "'Playfair Display', serif",
              }}
            >
              DANH MỤC GIÁO XỨ
            </span>
          }
          placement="right"
          onClose={() => setOpenMobileMenu(false)}
          open={openMobileMenu}
          width={290}
          className="glhn-mobile-drawer"
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: "none" }}
          />
        </Drawer>

        {/* STYLES */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-header-wrapper {
            position: sticky;
            top: 12px;
            z-index: 1000;
            display: flex;
            justify-content: center;
            padding: 0 16px;
            width: 100%;
          }

          .glhn-custom-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.92);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            padding: 0 24px;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.08);
            height: 66px;
            width: 100%;
            max-width: 1200px;
            border-radius: 16px;
            border: 1px solid rgba(212, 175, 55, 0.25);
            transition: all 0.3s ease;
          }

          /* Logo section */
          .glhn-logo-section { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            cursor: pointer; 
            flex-shrink: 0; 
          }

          .glhn-logo-avatar {
            border: 2px solid ${accentGold};
            box-shadow: 0 4px 10px rgba(27, 54, 93, 0.15);
          }

          .glhn-logo-text { 
            display: flex; 
            flex-direction: column; 
            line-height: 1.15; 
          }

          .glhn-main-title { 
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 15px; 
            font-weight: 700; 
            color: ${primaryNavy}; 
            white-space: nowrap; 
            letter-spacing: 0.3px;
          }

          .glhn-sub-title { 
            font-size: 9px; 
            color: #64748b; 
            font-weight: 600; 
            letter-spacing: 1px; 
            text-transform: uppercase;
          }

          /* Menu desktop */
          .glhn-desktop-menu-container { 
            flex: 1; 
            display: flex; 
            justify-content: center; 
            padding: 0 16px;
          }

          .glhn-header-menu { 
            border-bottom: none !important; 
            background: transparent !important; 
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 13px;
            font-weight: 600;
            color: ${textDark};
          }

          .glhn-header-menu .ant-menu-item-selected {
            color: ${primaryNavy} !important;
            border-bottom: 2px solid ${accentGold} !important;
          }

          /* Custom Submenu Popup */
          .ant-menu-submenu-popup .ant-menu {
            border-radius: 12px !important;
            padding: 8px !important;
            box-shadow: 0 12px 32px rgba(27, 54, 93, 0.12) !important;
            border: 1px solid rgba(212, 175, 55, 0.2);
          }

          .ant-menu-submenu-popup .ant-menu-item {
            border-radius: 6px !important;
            font-weight: 500;
          }

          /* Action Buttons */
          .glhn-action-section { 
            display: flex; 
            align-items: center; 
            gap: 10px; 
          }

          .glhn-contact-btn {
            background-color: ${primaryNavy} !important;
            border: 1px solid ${accentGold} !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
            font-weight: 600;
            font-size: 12px;
            letter-spacing: 0.5px;
            height: 38px;
            padding: 0 18px;
          }

          .glhn-contact-btn:hover {
            background-color: #132744 !important;
            box-shadow: 0 6px 16px rgba(212, 175, 55, 0.3);
            transform: translateY(-1px);
          }

          .glhn-mobile-menu-btn { display: none; }

          /* Responsive Breakpoints */
          @media (max-width: 1024px) {
            .glhn-desktop-menu-container { display: none; }
            .glhn-mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
            .glhn-btn-text { display: none; }
            .glhn-contact-btn { padding: 0 12px; }
          }

          @media (max-width: 576px) {
            .glhn-custom-header { padding: 0 14px; height: 58px; }
            .glhn-main-title { font-size: 13px; }
            .glhn-sub-title { display: none; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default HeaderBar;
