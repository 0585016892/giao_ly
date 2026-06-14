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
import { MenuOutlined, HeartFilled, DownOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../assets/images/logo.jpg";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  const primaryColor = "#b39164"; // Màu nâu vàng chủ đạo
  const textColor = "#5d4037"; // Màu chữ chính
  // CẤU TRÚC MENU PHÂN CẤP ĐẦY ĐỦ CHO GIÁO XỨ & HỌC TẬP KIỂM TRA
  const menuItems = [
    {
      key: "/",
      label: "TRANG CHỦ",
    },
    {
      key: "/gioi-thieu",
      label: "GIỚI THIỆU",
    },
    {
      key: "giao-ly-group",
      label: "CHƯƠNG TRÌNH GIÁO LÝ",
      children: [
        { key: "/giao-ly/hon-nhan", label: "Giáo lý Hôn nhân" },
        { key: "/giao-ly/du-tong", label: "Giáo lý Dự tòng" },
        { key: "/giao-ly/thieu-nhi", label: "Giáo lý Thiếu nhi" },
        { key: "/giao-ly/trac-nghiem", label: "Thi trắc nghiệm Giáo lý" },
      ],
    },
    {
      key: "tai-lieu-group",
      label: "THƯ VIỆN",
      children: [
        { key: "/thu-vien/kinh-nguyen", label: "Kinh đọc hằng ngày" },
        { key: "/thu-vien/tai-lieu", label: "Kho tài liệu Giáo lý" },
        { key: "/thu-vien/thanh-ca", label: "Thánh ca học tập" },
      ],
    },
    {
      key: "/su-kien",
      label: "TIN TỨC",
    },
    {
      key: "/lien-he",
      label: "LIÊN HỆ",
    },
  ];

  const handleMenuClick = (e) => {
    // Chỉ điều hướng nếu key bắt đầu bằng dấu "/" (Tránh click trúng key nhóm cha không có tuyến đường)
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
            horizontalItemHoverColor: primaryColor,
            popupBg: "#ffffff",
          },
        },
      }}
    >
      <div className="glhn-header-wrapper">
        <Header className="glhn-custom-header">
          {/* TRÁI: LOGO & TÊN GIÁO XỨ */}
          <div className="glhn-logo-section" onClick={() => navigate("/")}>
            <Avatar size={{ xs: 36, sm: 40, md: 44 }} src={Logo} />
            <Text className="glhn-main-title">
              GIÁO XỨ <span style={{ color: primaryColor }}>ĐỒNG QUAN</span>
            </Text>
          </div>

          {/* GIỮA: DESKTOP MENU (Phẳng, Hỗ trợ menu phân cấp đổ xuống) */}
          <div className="glhn-desktop-menu-container">
            <Menu
              mode="horizontal"
              selectedKeys={[location.pathname]}
              items={menuItems}
              onClick={handleMenuClick}
              className="glhn-header-menu"
              // Tùy chỉnh icon mũi tên xổ xuống nhỏ gọn tinh tế
              expandIcon={
                <DownOutlined style={{ fontSize: "10px", marginLeft: "4px" }} />
              }
            />
          </div>

          {/* PHẢI: NÚT ĐÓNG GÓP & MOBILE TOGGLE */}
          <div className="glhn-action-section">
            <Button
              type="primary"
              shape="round"
              icon={<HeartFilled />}
              className="glhn-donate-btn"
              onClick={() => navigate("/dong-gop")}
            >
              ĐÓNG GÓP
            </Button>

            <Button
              type="text"
              icon={
                <MenuOutlined style={{ fontSize: "20px", color: textColor }} />
              }
              className="glhn-mobile-menu-btn"
              onClick={() => setOpenMobileMenu(true)}
            />
          </div>
        </Header>

        {/* MENU DI ĐỘNG (DRAWER XỔ DỌC INLINE) */}
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
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ borderRight: "none" }}
          />
        </Drawer>

        {/* CSS STYLE CUSTOM TOÀN DIỆN CHO HEADER & POPUP SUBMENU */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-header-wrapper {
            position: sticky;
            top: 0;
            left: 0;
            z-index: 1000;
            width: 100%;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(8px);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
            border-bottom: 1px solid rgba(179, 145, 100, 0.15);
          }

          .glhn-custom-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: transparent !important;
            padding: 0 40px;
            height: 70px;
            width: 100%;
          }

          .glhn-logo-section { 
            display: flex; 
            align-items: center; 
            gap: 12px; 
            cursor: pointer; 
            flex-shrink: 0; 
          }
          
          .glhn-main-title { 
            font-size: 16px; 
            font-weight: 700; 
            color: ${textColor}; 
            white-space: nowrap;
            letter-spacing: 0.5px;
          }

          .glhn-desktop-menu-container { 
            flex: 1; 
            display: flex; 
            justify-content: center; 
            padding: 0 20px;
          }
          
          .glhn-header-menu { 
            border-bottom: none !important; 
            background: transparent !important; 
            width: auto;
            min-width: 600px;
            display: flex;
            justify-content: center;
            font-size: 13px;
            font-weight: 600;
          }
          
          .glhn-header-menu .ant-menu-submenu-title {
            display: flex;
            align-items: center;
          }
          
          /* Đường gạch chân khi mục menu active */
          .glhn-header-menu .ant-menu-item-selected::after,
          .glhn-header-menu .ant-menu-submenu-selected::after {
            border-bottom-width: 3px !important;
            border-bottom-color: ${primaryColor} !important;
          }

          /* TÙY CHỈNH Ô THẢ XUỐNG (SUBMENU POPUP) SAO CHO SANG TRỌNG */
          .ant-menu-submenu-popup {
            z-index: 1050 !important;
          }
          .ant-menu-submenu-popup .ant-menu-sub {
            background: #ffffff !important;
            border-radius: 12px !important;
            padding: 8px !important;
            box-shadow: 0 10px 30px rgba(93, 64, 55, 0.12) !important;
            border: 1px solid rgba(179, 145, 100, 0.15) !important;
          }
          .ant-menu-submenu-popup .ant-menu-item {
            border-radius: 6px !important;
            margin: 4px 0 !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            color: #444 !important;
          }
          .ant-menu-submenu-popup .ant-menu-item-active {
            color: ${primaryColor} !important;
          }

          .glhn-action-section { 
            display: flex; 
            align-items: center; 
            flex-shrink: 0;
          }
          
          .glhn-donate-btn {
            background-color: ${textColor} !important;
            border-color: ${textColor} !important;
            font-weight: 600;
            font-size: 13px;
            padding: 0 20px;
            height: 38px;
          }
          .glhn-donate-btn:hover {
            background-color: ${primaryColor} !important;
            border-color: ${primaryColor} !important;
          }

          .glhn-mobile-menu-btn { display: none; }

          /* Responsive Layout */
          @media (max-width: 1140px) {
            .glhn-header-menu { min-width: auto; font-size: 12px; }
          }

          @media (max-width: 1024px) {
            .glhn-custom-header { padding: 0 20px; }
            .glhn-desktop-menu-container { display: none; }
            .glhn-mobile-menu-btn { display: flex; }
          }

          @media (max-width: 576px) {
            .glhn-custom-header { padding: 0 16px; height: 60px; }
            .glhn-main-title { font-size: 14px; }
            .glhn-donate-btn { display: none; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default HeaderBar;
