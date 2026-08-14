import React, { useState } from "react";
import { Layout, Menu, Button, Drawer, ConfigProvider } from "antd";
import { MenuOutlined, CloseOutlined, DownOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "../../../assets/images/logo.jpg";

const { Header } = Layout;

const HeaderBar = ({ transparent = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // Bảng màu chuẩn Tôn Nghiêm - Sang Trọng
  const accentGold = "#ffc941";
  const darkNavy = "#0e2443";

  // Cấu trúc Menu khoa học & hợp lý hơn
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
      label: "GIÁO LÝ ",
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
            popupBg: "rgba(11, 25, 44, 0.96)",
            colorText: "rgba(255, 255, 255, 0.88)",
            darkItemColor: "rgba(255, 255, 255, 0.85)",
            darkItemSelectedBg: "rgba(212, 160, 23, 0.18)",
            darkSubMenuItemBg: "rgba(7, 16, 28, 0.95)",
          },
        },
      }}
    >
      <div
        className={`gx-header-wrapper ${
          transparent ? "is-transparent" : "is-solid"
        }`}
      >
        <Header className="gx-custom-header">
          <div className="gx-header-container">
            {/* =========================
                1. LOGO GIÁO XỨ (MOTION)
            ========================= */}
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

            {/* =========================
                2. DESKTOP MENU
            ========================= */}
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

            {/* =========================
                3. ACTION BUTTONS
            ========================= */}
            <div className="gx-action-section">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              ></motion.div>

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
            4. MOBILE DRAWER WITH ANIMATION
        ========================= */}
        <AnimatePresence>
          <Drawer
            title={
              <div className="gx-drawer-header-title">
                <span
                  style={{
                    color: accentGold,
                    fontWeight: "800",
                    letterSpacing: "1px",
                  }}
                >
                  GIÁO XỨ ĐỒNG QUAN
                </span>
              </div>
            }
            closeIcon={
              <CloseOutlined style={{ color: "#ffffff", fontSize: "18px" }} />
            }
            placement="right"
            onClose={() => setOpenMobileMenu(false)}
            open={openMobileMenu}
            width={290}
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
          .gx-header-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            width: 100%;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .gx-header-wrapper.is-transparent {
            background: linear-gradient(180deg, rgba(11, 25, 44, 0.75) 0%, rgba(11, 25, 44, 0) 100%);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
          }

          .gx-header-wrapper.is-solid {
            background-color: ${darkNavy};
            position: relative;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          }

          .gx-custom-header {
            background: transparent !important;
            height: 72px;
            line-height: 72px;
            padding: 0 24px;
          }

          .gx-header-container {
            max-width: 1180px;
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
            width: 42px;
            height: 42px;
            border-radius: 50%;
            overflow: hidden;
            border: 2px solid ${accentGold};
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3);
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
            font-size: 9px;
            letter-spacing: 1.8px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 600;
          }

          .gx-main-logo {
            font-size: 16px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: 0.8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .gx-tag-logo {
            font-size: 8px;
            letter-spacing: 1px;
            color: ${accentGold};
            font-weight: 700;
            margin-top: 2px;
          }

          /* DESKTOP MENU */
          .gx-desktop-menu-container {
            flex: 1;
            display: flex;
            justify-content: center;
            margin: 0 16px;
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
            color: rgba(255, 255, 255, 0.85) !important;
            padding: 0 14px !important;
            transition: all 0.25s ease !important;
          }

          .gx-header-menu .ant-menu-item:hover,
          .gx-header-menu .ant-menu-submenu-title:hover,
          .gx-header-menu .ant-menu-item-selected,
          .gx-header-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
            color: ${accentGold} !important;
          }

          /* Submenu Popup Dropdown styling */
          .ant-menu-submenu-popup .ant-menu {
            border-radius: 12px !important;
            padding: 8px !important;
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35) !important;
            border: 1px solid rgba(212, 160, 23, 0.2) !important;
          }

          .ant-menu-submenu-popup .ant-menu-item {
            border-radius: 8px !important;
            margin: 2px 0 !important;
            font-size: 13px !important;
            transition: all 0.2s ease !important;
          }

          .ant-menu-submenu-popup .ant-menu-item:hover {
            background: rgba(212, 160, 23, 0.12) !important;
            color: ${accentGold} !important;
          }

          /* ACTION BUTTON */
          .gx-action-section {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .gx-contact-btn {
            background-color: ${accentGold} !important;
            border-color: ${accentGold} !important;
            color: #ffffff !important;
            font-weight: 700 !important;
            height: 38px !important;
            padding: 0 20px !important;
            border-radius: 20px !important;
            box-shadow: 0 4px 15px rgba(212, 160, 23, 0.35);
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px !important;
            letter-spacing: 0.5px;
            transition: all 0.3s ease !important;
          }

          .gx-contact-btn:hover {
            background-color: #b8860b !important;
            border-color: #b8860b !important;
            box-shadow: 0 6px 20px rgba(212, 160, 23, 0.5);
          }

          .gx-mobile-menu-btn {
            display: none;
            padding: 0;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
          }

          /* MOBILE DRAWER STYLING */
          .gx-mobile-drawer .ant-drawer-header {
            background-color: ${darkNavy};
            border-bottom: 1px solid rgba(212, 160, 23, 0.2);
            padding: 18px 20px;
          }

          .gx-mobile-drawer .ant-drawer-body {
            background-color: ${darkNavy};
            padding: 12px 0 24px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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

          .gx-drawer-menu .ant-menu-item-selected {
            color: ${accentGold} !important;
          }

          .drawer-footer-info {
            padding: 20px;
            text-align: center;
            border-top: 1px dashed rgba(255, 255, 255, 0.1);
            margin-top: 20px;
          }

          .footer-church-tag {
            font-size: 11px;
            color: ${accentGold};
            letter-spacing: 1px;
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

          @media (max-width: 576px) {
            .gx-custom-header {
              height: 64px;
              line-height: 64px;
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
            .gx-tag-logo {
              font-size: 7px;
            }
            .gx-contact-btn {
              height: 34px !important;
              padding: 0 14px !important;
              font-size: 11px !important;
            }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default HeaderBar;
