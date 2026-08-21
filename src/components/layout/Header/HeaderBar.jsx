import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, Drawer, ConfigProvider } from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  DownOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../assets/images/logo.jpg";

const { Header } = Layout;

const HeaderBar = ({ transparent = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Bảng màu chuẩn Tôn Nghiêm - Sang Trọng
  const accentGold = "#ffc941";
  const darkNavy = "#0e2443";
  const deepNavy = "#08172c";

  // Lắng nghe sự kiện cuộn trang để đổi background mượt mà
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    {
      key: "/",
      label: "TRANG CHỦ",
    },
    {
      key: "about-group",
      label: "GIỚI THIỆU",
      children: [
        { key: "/gioi-thieu", label: "Giáo xứ Đồng Quan" },
        { key: "/giao-ho", label: "Các Giáo họ" },
      ],
    },
    {
      key: "events-group",
      label: "SỰ KIỆN & MỤC VỤ",
      children: [
        { key: "/su-kien", label: "Tin tức & Sự kiện" },
        { key: "/lich-phung-vu", label: "Lịch Phụng vụ & Thánh Lễ" },
      ],
    },
    {
      key: "/hoi-doan",
      label: "HỘI ĐOÀN",
    },
    {
      key: "catechism-docs-group",
      label: "GIÁO LÝ",
      children: [
        { key: "/giao-ly/hon-nhan", label: "Giáo lý Hôn nhân" },
        { key: "/giao-ly/du-tong", label: "Giáo lý Dự tòng" },
        { key: "/prayers", label: "Kinh thánh & Kinh đọc" },
        { key: "/exam", label: "Thi trắc nghiệm Dự tòng" },
        { key: "/exam-prayer", label: "Khảo kinh Dự tòng" },
        { key: "/exam-search", label: "Tra cứu kết quả" },
      ],
    },
    {
      key: "thu-vien-group",
      label: "THƯ VIỆN",
      children: [
        { key: "/thu-vien", label: "Kho kỉ niệm giáo xứ" },
        { key: "/thanh-ca", label: "Thánh ca phụng vụ" },
        { key: "/tai-lieu", label: "Kho Tài liệu" },
      ],
    },
    {
      key: "/contact",
      label: "LIÊN HỆ",
    },
  ];

  const handleMenuClick = ({ key }) => {
    if (key.startsWith("/")) {
      navigate(key);
      setOpenMobileMenu(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentGold,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
        components: {
          Menu: {
            horizontalItemSelectedColor: accentGold,
            horizontalItemHoverColor: accentGold,
            itemHoverColor: accentGold,
            itemSelectedColor: accentGold,
            popupBg: "rgba(14, 36, 67, 0.98)",
            colorText: "rgba(255, 255, 255, 0.9)",
            darkItemColor: "rgba(255, 255, 255, 0.85)",
            darkItemSelectedBg: "rgba(255, 201, 65, 0.15)",
            darkSubMenuItemBg: "rgba(8, 23, 44, 0.95)",
          },
        },
      }}
    >
      <header
        className={`gx-header-wrapper ${
          transparent && !isScrolled ? "is-transparent" : "is-solid"
        }`}
      >
        {/* =========================
            1. TOP BAR THÔNG TIN MỎNG
        ========================= */}
        <div className="gx-top-bar">
          <div className="gx-top-bar-container">
            <div className="top-bar-left">
              <span className="bible-quote">
                <BookOutlined className="top-icon" /> Bổn mạng : Đức Mẹ Hồn Xác
                Lên Trời (15/08)
              </span>
            </div>
            <div className="top-bar-right">
              <span className="mass-schedule-tag">
                <ClockCircleOutlined className="top-icon" /> Lễ Chúa Nhật: 05:00
                & 16:00
              </span>
              <span className="top-bar-divider">|</span>
              <a href="tel:0123456789" className="top-contact">
                <PhoneOutlined className="top-icon" /> Văn Phòng GX
              </a>
            </div>
          </div>
        </div>

        {/* =========================
            2. MAIN HEADER BAR
        ========================= */}
        <Header className="gx-custom-header">
          <div className="gx-header-container">
            {/* LOGO GIÁO XỨ */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gx-logo-section"
              onClick={() => navigate("/")}
            >
              <div className="gx-logo-img-wrapper">
                <img
                  src={Logo}
                  alt="Logo Giáo Xứ Đồng Quan"
                  className="gx-logo-image"
                />
              </div>
              <div className="gx-logo-text">
                <span className="gx-sub-logo">GIÁO XỨ</span>
                <span className="gx-main-logo">ĐỒNG QUAN</span>
              </div>
            </motion.div>

            {/* DESKTOP MENU */}
            <div className="gx-desktop-menu-container">
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className="gx-header-menu"
                disabledOverflow
                expandIcon={
                  <DownOutlined
                    style={{ fontSize: "10px", color: accentGold }}
                  />
                }
              />
            </div>

            {/* ACTION SECTION */}
            <div className="gx-action-section">
              <Button
                type="primary"
                className="gx-quick-pray-btn"
                onClick={() => navigate("/contact")}
              >
                Xin Lễ
              </Button>

              <Button
                type="text"
                icon={
                  <MenuOutlined style={{ color: "#fff", fontSize: "22px" }} />
                }
                className="gx-mobile-menu-btn"
                onClick={() => setOpenMobileMenu(true)}
              />
            </div>
          </div>
        </Header>

        {/* =========================
            3. MOBILE DRAWER
        ========================= */}
        <AnimatePresence>
          <Drawer
            title={
              <div className="gx-drawer-header-title">
                <div className="drawer-logo-wrap">
                  <img src={Logo} alt="Logo" className="drawer-logo-img" />
                  <div>
                    <span className="drawer-sub">GIÁO XỨ</span>
                    <span className="drawer-main">ĐỒNG QUAN</span>
                  </div>
                </div>
              </div>
            }
            closeIcon={
              <CloseOutlined style={{ color: "#ffffff", fontSize: "18px" }} />
            }
            placement="right"
            onClose={() => setOpenMobileMenu(false)}
            open={openMobileMenu}
            width={300}
            className="gx-mobile-drawer"
          >
            <div className="drawer-inner-content">
              <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className="gx-drawer-menu"
              />

              <div className="drawer-footer-info">
                <div className="drawer-schedule">
                  <ClockCircleOutlined style={{ color: accentGold }} />
                  <span>Thánh Lễ: 05:00 & 16:00 (CN)</span>
                </div>
                <span className="footer-church-tag">
                  Hiệp Nhất • Yêu Thương • Phục Vụ
                </span>
              </div>
            </div>
          </Drawer>
        </AnimatePresence>

        {/* =========================
            STYLESHEET DEDICATED
        ========================= */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          /* WRAPPER CONFIG */
          .gx-header-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            width: 100%;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .gx-header-wrapper.is-transparent {
            background: linear-gradient(180deg, rgba(8, 23, 44, 0.9) 0%, rgba(8, 23, 44, 0.4) 70%, rgba(8, 23, 44, 0) 100%);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
          }

          .gx-header-wrapper.is-solid {
            background-color: ${darkNavy};
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
            border-bottom: 1px solid rgba(255, 201, 65, 0.15);
          }

          /* 1. TOP BAR */
          .gx-top-bar {
            background-color: ${deepNavy};
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            height: 34px;
            line-height: 34px;
          }

          .gx-top-bar-container {
            max-width: 1240px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .top-icon {
            color: ${accentGold};
            margin-right: 6px;
          }

          .bible-quote {
            font-style: italic;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.9);
          }

          .top-bar-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .top-bar-divider {
            color: rgba(255, 255, 255, 0.2);
          }

          .top-contact {
            color: rgba(255, 255, 255, 0.85);
            transition: color 0.2s ease;
            text-decoration: none;
          }

          .top-contact:hover {
            color: ${accentGold};
          }

          /* 2. MAIN HEADER */
          .gx-custom-header {
            background: transparent !important;
            height: 68px;
            line-height: 68px;
            padding: 0 24px;
          }

          .gx-header-container {
            max-width: 1240px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
          }

          /* LOGO DESIGN */
          .gx-logo-section {
            display: flex;
            align-items: center;
            gap: 12px;
            cursor: pointer;
            user-select: none;
          }

          .gx-logo-img-wrapper {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid ${accentGold};
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            box-shadow: 0 0 15px rgba(255, 201, 65, 0.25);
            flex-shrink: 0;
          }

          .gx-logo-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .gx-logo-text {
            display: flex;
            flex-direction: column;
            line-height: 1.15;
          }

          .gx-sub-logo {
            font-size: 10px;
            letter-spacing: 2px;
            color: ${accentGold};
            font-weight: 700;
          }

          .gx-main-logo {
            font-size: 17px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 1px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.4);
          }

          /* DESKTOP MENU */
          .gx-desktop-menu-container {
            flex: 1;
            display: flex;
            justify-content: center;
            margin: 0 20px;
          }

          .gx-header-menu {
            background: transparent !important;
            border-bottom: none !important;
            color: #ffffff;
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.5px;
          }

          .gx-header-menu .ant-menu-item,
          .gx-header-menu .ant-menu-submenu-title {
            color: rgba(255, 255, 255, 0.9) !important;
            padding: 0 16px !important;
            transition: all 0.25s ease !important;
          }

          .gx-header-menu .ant-menu-item:hover,
          .gx-header-menu .ant-menu-submenu-title:hover,
          .gx-header-menu .ant-menu-item-selected,
          .gx-header-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
            color: ${accentGold} !important;
          }

          /* Dropdown popup styling */
          .ant-menu-submenu-popup .ant-menu {
            border-radius: 12px !important;
            padding: 8px !important;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.45) !important;
            border: 1px solid rgba(255, 201, 65, 0.2) !important;
          }

          .ant-menu-submenu-popup .ant-menu-item {
            border-radius: 8px !important;
            margin: 3px 0 !important;
            font-size: 13px !important;
          }

          .ant-menu-submenu-popup .ant-menu-item:hover {
            background: rgba(255, 201, 65, 0.12) !important;
            color: ${accentGold} !important;
          }

          /* ACTION BUTTONS */
          .gx-action-section {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .gx-quick-pray-btn {
            background: linear-gradient(135deg, ${accentGold} 0%, #e5b128 100%) !important;
            border: none !important;
            color: ${deepNavy} !important;
            font-weight: 700 !important;
            height: 36px !important;
            padding: 0 20px !important;
            border-radius: 20px !important;
            box-shadow: 0 4px 15px rgba(255, 201, 65, 0.3);
            font-size: 12px !important;
            letter-spacing: 0.5px;
            transition: all 0.3s ease !important;
          }

          .gx-quick-pray-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(255, 201, 65, 0.5) !important;
            background: linear-gradient(135deg, #ffd359 0%, #f0bb32 100%) !important;
          }

          .gx-mobile-menu-btn {
            display: none;
            padding: 0;
            height: 38px;
            width: 38px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
          }

          /* MOBILE DRAWER STYLING */
          .gx-mobile-drawer .ant-drawer-header {
            background-color: ${deepNavy};
            border-bottom: 1px solid rgba(255, 201, 65, 0.2);
            padding: 16px 20px;
          }

          .drawer-logo-wrap {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .drawer-logo-img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 1px solid ${accentGold};
          }

          .drawer-sub {
            display: block;
            font-size: 8px;
            color: ${accentGold};
            letter-spacing: 1.5px;
            font-weight: 700;
            line-height: 1;
          }

          .drawer-main {
            display: block;
            font-size: 14px;
            color: #ffffff;
            font-weight: 800;
            letter-spacing: 0.5px;
            line-height: 1.2;
          }

          .gx-mobile-drawer .ant-drawer-body {
            background-color: ${darkNavy};
            padding: 12px 0 24px 0;
          }

          .drawer-inner-content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
          }

          .gx-drawer-menu {
            background: transparent !important;
            border-right: none !important;
          }

          .gx-drawer-menu .ant-menu-item,
          .gx-drawer-menu .ant-menu-submenu-title {
            font-weight: 600;
            font-size: 14px;
            margin: 4px 12px !important;
            width: calc(100% - 24px) !important;
            border-radius: 8px !important;
          }

          .drawer-footer-info {
            padding: 16px 20px 8px 20px;
            text-align: center;
            border-top: 1px dashed rgba(255, 255, 255, 0.12);
            margin-top: 20px;
          }

          .drawer-schedule {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-bottom: 10px;
          }

          .footer-church-tag {
            font-size: 10px;
            color: ${accentGold};
            letter-spacing: 1.5px;
            font-weight: 600;
            text-transform: uppercase;
          }

          /* RESPONSIVE BREAKPOINTS */
          @media (max-width: 1024px) {
            .gx-desktop-menu-container {
              display: none;
            }
            .gx-mobile-menu-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
          }

          @media (max-width: 768px) {
            .bible-quote {
              display: none;
            }
            .gx-top-bar-container {
              justify-content: center;
            }
          }

          @media (max-width: 576px) {
            .gx-top-bar {
              font-size: 11px;
              height: 30px;
              line-height: 30px;
            }
            .gx-custom-header {
              height: 60px;
              line-height: 60px;
              padding: 0 16px;
            }
            .gx-logo-img-wrapper {
              width: 36px;
              height: 36px;
            }
            .gx-main-logo {
              font-size: 14px;
            }
            .gx-sub-logo {
              font-size: 8px;
            }
            .gx-quick-pray-btn {
              height: 32px !important;
              padding: 0 14px !important;
              font-size: 11px !important;
            }
          }
        `,
          }}
        />
      </header>
    </ConfigProvider>
  );
};

export default HeaderBar;
