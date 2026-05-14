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
  DownOutlined, // Thêm icon mũi tên xuống
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.jpg";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const primaryColor = "#b39164";
  const textColor = "#5d4037";

  // CẤU TRÚC MENU MỚI VỚI CHILDREN
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "TRANG CHỦ",
    },
    {
      key: "courses-group", // Key cha không cần dẫn link nếu chỉ để xổ menu
      icon: <ReadOutlined />,
      label: "CHƯƠNG TRÌNH GIÁO LÝ",
      children: [
        { key: "/giao-ly/hon-nhan", label: "Giáo lý Hôn nhân" },
        { key: "/giao-ly/du-tong", label: "Giáo lý Dự tòng" },
        { key: "/courses/thieu-nhi", label: "Giáo lý Thiếu nhi" },
      ],
    },
    {
      key: "/docs",
      icon: <CloudDownloadOutlined />,
      label: "KHO TÀI LIỆU",
      children: [
        { key: "/prayers", label: "Kinh đọc hằng ngày" },
        { key: "/tai-lieu", label: "Tài liệu" },
        { key: "/prayers/thanh-ca", label: "Thanh ca học tập" },
      ],
    },
    {
      key: "/giao-xu",
      icon: <BankOutlined />,
      label: "THÔNG TIN GIÁO XỨ",
    },
  ];

  const handleMenuClick = (e) => {
    // Chỉ điều hướng nếu key bắt đầu bằng dấu "/" (tránh điều hướng khi bấm vào menu cha có con)
    if (e.key.startsWith("/")) {
      navigate(e.key);
      setOpenMobileMenu(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          borderRadius: 8,
        },
        components: {
          Menu: {
            horizontalItemSelectedColor: primaryColor,
            itemHoverColor: primaryColor,
          },
        },
      }}
    >
      <div className="glhn-header-wrapper">
        <Header className="glhn-custom-header">
          {/* LEFT: LOGO */}
          <div className="glhn-logo-section" onClick={() => navigate("/")}>
            <Avatar
              size={{ xs: 40, sm: 40, md: 48 }}
              src={Logo}
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
            />
            <div className="glhn-logo-text">
              <Text className="glhn-main-title">
                GIÁO XỨ <span style={{ color: primaryColor }}>ĐỒNG QUAN</span>
              </Text>
              <Text className="glhn-sub-title">GIÁO LÝ HÔN NHÂN</Text>
            </div>
          </div>

          {/* CENTER: DESKTOP MENU (Hỗ trợ Submenu tự động từ Antd) */}
          <div className="glhn-desktop-menu-container">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              className="glhn-header-menu"
              // Tùy chỉnh icon mũi tên xổ xuống cho sang hơn
              expandIcon={<DownOutlined style={{ fontSize: "10px" }} />}
            />
          </div>

          {/* RIGHT: ACTION BUTTON & MOBILE TOGGLE */}
          <div className="glhn-action-section">
            <Button
              type="primary"
              shape="round"
              icon={<MessageOutlined />}
              className="glhn-contact-btn"
              onClick={() => navigate("/contact")}
            >
              <span className="glhn-btn-text">LIÊN HỆ</span>
            </Button>

            <Button
              type="text"
              icon={<MenuOutlined style={{ fontSize: "20px" }} />}
              className="glhn-mobile-menu-btn"
              onClick={() => setOpenMobileMenu(true)}
            />
          </div>
        </Header>

        {/* MOBILE DRAWER */}
        <Drawer
          title={
            <span style={{ color: textColor, fontWeight: 700 }}>DANH MỤC</span>
          }
          placement="right"
          onClose={() => setOpenMobileMenu(false)}
          open={openMobileMenu}
          width={280}
        >
          <Menu
            mode="inline" // Chế độ inline phù hợp hơn cho Drawer (xổ dọc)
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: "none" }}
          />
        </Drawer>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-header-wrapper {
            position: sticky;
            top: 10px;
            z-index: 1000;
            display: flex;
            justify-content: center;
            padding: 0 12px;
            width: 100%;
          }

          .glhn-custom-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            padding: 0 20px;
            box-shadow: 0 8px 32px rgba(93, 64, 55, 0.08);
            height: 64px;
            width: 100%;
            max-width: 1200px;
            border-radius: 16px;
            border: 1px solid rgba(179, 145, 100, 0.2);
          }

          .glhn-logo-section { display: flex; align-items: center; gap: 10px; cursor: pointer; flex-shrink: 0; }
          .glhn-logo-text { display: flex; flex-direction: column; line-height: 1.2; }
          .glhn-main-title { font-size: 14px; font-weight: 800; color: ${textColor}; white-space: nowrap; }
          .glhn-sub-title { font-size: 9px; color: #8c7b6e; font-weight: 600; letter-spacing: 0.5px; }

          .glhn-desktop-menu-container { flex: 1; display: flex; justify-content: center; }
          .glhn-header-menu { 
            border-bottom: none !important; 
            background: transparent !important; 
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 13px;
            font-weight: 600;
          }

          /* Tùy chỉnh Submenu đổ xuống */
          .ant-menu-submenu-popup .ant-menu {
            border-radius: 12px !important;
            padding: 8px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
          }

          .glhn-action-section { display: flex; align-items: center; gap: 8px; }
          .glhn-mobile-menu-btn { display: none; }

          @media (max-width: 1024px) {
            .glhn-desktop-menu-container { display: none; }
            .glhn-mobile-menu-btn { display: flex; }
            .glhn-btn-text { display: none; }
          }

          @media (max-width: 576px) {
            .glhn-custom-header { padding: 0 12px; height: 56px; }
            .glhn-main-title { font-size: 12px; }
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
