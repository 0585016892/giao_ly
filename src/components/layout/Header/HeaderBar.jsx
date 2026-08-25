import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Drawer,
  Badge,
  ConfigProvider,
  Tooltip,
  Modal,
  Input,
  Popover,
  List,
  Typography,
  message,
} from "antd";
import {
  MenuOutlined,
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
  BellOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../../assets/images/logo.jpg";

const { Header } = Layout;
const { Text } = Typography;

// Dữ liệu mẫu thông báo
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Lịch Thánh Lễ Tuần Mới",
    time: "10 phút trước",
    unread: true,
    link: "/lich-phung-vu",
  },
  {
    id: 2,
    title: "Thông báo về Khóa Giáo Lý Hôn Nhân Hè 2026",
    time: "2 giờ trước",
    unread: true,
    link: "/giao-ly/hon-nhan",
  },
  {
    id: 3,
    title: "Thư Mục Vụ Tháng 5 của Cha Xứ",
    time: "1 ngày trước",
    unread: false,
    link: "/su-kien",
  },
];

const HeaderBar = ({ transparent = true }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // States cho tính năng Tìm kiếm & Thông báo
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const primaryNavy = "#0F2342";
  const accentGold = "#D4AF37";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { key: "/", label: "TRANG CHỦ" },
    {
      key: "about-group",
      label: "GIỚI THIỆU",
      children: [
        { key: "/gioi-thieu", label: "Giáo xứ Đồng Quan" },
        { key: "/giao-ho", label: "Các Giáo họ trực thuộc" },
      ],
    },
    {
      key: "events-group",
      label: "TIN TỨC & SỰ KIỆN",
      children: [
        { key: "/su-kien", label: "Tin tức & Sự kiện nổi bật" },
        { key: "/lich-phung-vu", label: "Lịch Phụng vụ & Thánh lễ" },
      ],
    },
    { key: "/hoi-doan", label: "CÁC ĐOÀN THỂ" },
    {
      key: "catechism-docs-group",
      label: "GIÁO LÝ",
      children: [
        { key: "/giao-ly/hon-nhan", label: "Giáo lý Hôn nhân" },
        { key: "/giao-ly/du-tong", label: "Giáo lý Dự tòng" },
        { key: "/prayers", label: "Kinh Thánh & Kinh đọc" },
        { key: "/exam", label: "Thi trắc nghiệm Dự tòng" },
        { key: "/exam-prayer", label: "Khảo kinh Dự tòng" },
        { key: "/exam-search", label: "Tra cứu kết quả học tập" },
      ],
    },
    {
      key: "thu-vien-group",
      label: "THƯ VIỆN",
      children: [
        { key: "/thu-vien", label: "Kho kỷ niệm Giáo xứ" },
        { key: "/thanh-ca", label: "Thánh ca Phụng vụ" },
        { key: "/tai-lieu", label: "Kho Tài liệu & Chế bản" },
      ],
    },
    { key: "/contact", label: "LIÊN HỆ" },
  ];

  const handleMenuClick = ({ key }) => {
    if (key && key.startsWith("/")) {
      navigate(key);
      setOpenMobileMenu(false);
    }
  };

  // Xử lý Tìm kiếm
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      // navigate(`/su-kien?q=${encodeURIComponent(searchQuery.trim())}`);
      message.success("Tính năng đang được phát triển chờ thêm nhé!");
      setSearchQuery("");
    }
  };

  // Đánh dấu tất cả thông báo là đã đọc
  const handleMarkAllRead = () => {
    setNotifications(notifications.map((item) => ({ ...item, unread: false })));
  };

  const unreadCount = notifications.filter((item) => item.unread).length;

  // Giao diện Popup Thông báo
  const notificationContent = (
    <div className="gx-noti-popover">
      <div className="gx-noti-header">
        <span>Thông báo mới ({unreadCount})</span>
        {unreadCount > 0 && (
          <Button type="link" size="small" onClick={handleMarkAllRead}>
            Đánh dấu đã đọc
          </Button>
        )}
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            className={`gx-noti-item ${item.unread ? "unread" : ""}`}
            onClick={() => {
              navigate(item.link);
            }}
          >
            <div className="gx-noti-body">
              <div className="gx-noti-title">{item.title}</div>
              <div className="gx-noti-time">
                <ClockCircleOutlined style={{ marginRight: 4 }} />
                {item.time}
              </div>
            </div>
          </List.Item>
        )}
      />
      <div className="gx-noti-footer">
        <Button type="link" block onClick={() => navigate("/su-kien")}>
          Xem tất cả thông báo <RightOutlined style={{ fontSize: 10 }} />
        </Button>
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentGold,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <header
        className={`gx-header-wrapper ${
          transparent && !isScrolled
            ? "gx-header-transparent"
            : "gx-header-solid"
        }`}
      >
        <Header className="gx-custom-header">
          <div className="gx-header-container">
            {/* LOGO CHÍNH (GÓC TRÁI) */}
            <div className="gx-logo-section" onClick={() => navigate("/")}>
              <div className="gx-logo-wrapper">
                <img
                  src={Logo}
                  alt="Logo Giáo xứ Đồng Quan"
                  className="gx-logo-image"
                />
              </div>

              <div className="gx-logo-text">
                <span className="gx-logo-subtitle">GIÁO XỨ</span>
                <span className="gx-logo-title">ĐỒNG QUAN</span>
              </div>
            </div>

            {/* DESKTOP MENU */}
            <nav className="gx-desktop-menu">
              <Menu
                mode="horizontal"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={handleMenuClick}
                className="gx-header-menu"
                disabledOverflow
                expandIcon={
                  <DownOutlined style={{ fontSize: 10, marginLeft: 4 }} />
                }
              />
            </nav>

            {/* ACTIONS & SECONDARY LOGO BADGE */}
            <div className="gx-header-actions">
              {/* TÌM KIẾM */}
              <Tooltip title="Tìm kiếm">
                <Button
                  type="text"
                  className="gx-icon-btn"
                  icon={<SearchOutlined />}
                  onClick={() => setIsSearchOpen(true)}
                />
              </Tooltip>

              {/* THÔNG BÁO */}
              <Popover
                content={notificationContent}
                trigger="click"
                placement="bottomRight"
                overlayClassName="gx-noti-popover-wrapper"
              >
                <Tooltip title="Thông báo mới">
                  <Badge count={unreadCount} overflowCount={9} offset={[-2, 6]}>
                    <Button
                      type="text"
                      className="gx-icon-btn"
                      icon={<BellOutlined />}
                    />
                  </Badge>
                </Tooltip>
              </Popover>

              {/* LOGO HUY HIỆU (THAY THẾ NÚT ĐÓNG GÓP) */}

              <Button
                type="text"
                className="gx-mobile-menu-btn"
                icon={<MenuOutlined />}
                onClick={() => setOpenMobileMenu(true)}
              />
            </div>
          </div>
        </Header>
      </header>

      {/* MODAL TÌM KIẾM NÂNG CAO */}
      <Modal
        open={isSearchOpen}
        footer={null}
        onCancel={() => setIsSearchOpen(false)}
        centered
        width={550}
        className="gx-search-modal"
      >
        <div className="gx-search-modal-inner">
          <Input
            size="large"
            placeholder="Nhập nội dung tìm kiếm (Thánh lễ, Thông báo, Bài viết...)"
            prefix={
              <SearchOutlined style={{ color: accentGold, fontSize: 20 }} />
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearchSubmit}
            autoFocus
          />
          <div className="gx-search-suggestions">
            <Text type="secondary" style={{ fontSize: 12 }}>
              Gợi ý từ khóa:
            </Text>
            <div className="gx-tag-group">
              <span onClick={() => navigate("/lich-phung-vu")}>
                Lịch Phụng vụ
              </span>
              <span onClick={() => navigate("/giao-ly/hon-nhan")}>
                Giáo lý Hôn nhân
              </span>
              <span onClick={() => navigate("/su-kien")}>Thư Mục vụ</span>
            </div>
          </div>
        </div>
      </Modal>

      {/* MOBILE DRAWER */}
      <Drawer
        placement="right"
        open={openMobileMenu}
        onClose={() => setOpenMobileMenu(false)}
        width={300}
        className="gx-mobile-drawer"
        closeIcon={<CloseOutlined style={{ color: "#ffffff", fontSize: 18 }} />}
        title={
          <div className="gx-drawer-logo">
            <img src={Logo} alt="Logo" className="gx-drawer-logo-img" />
            <div>
              <div className="gx-drawer-logo-sub">GIÁO XỨ</div>
              <div className="gx-drawer-logo-title">ĐỒNG QUAN</div>
            </div>
          </div>
        }
      >
        <div className="gx-drawer-content">
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            className="gx-drawer-menu"
            expandIcon={
              <DownOutlined style={{ fontSize: 11, color: "#ffffff" }} />
            }
          />

          <div className="gx-drawer-footer">
            <div className="gx-drawer-info">
              <ClockCircleOutlined style={{ color: accentGold }} />
              <span>
                Lịch Lễ: <strong>05:00 & 16:00</strong>
              </span>
            </div>
            <div className="gx-drawer-info">
              <PhoneOutlined style={{ color: accentGold }} />
              <span>Văn phòng Giáo xứ: 033 604 1807</span>
            </div>
          </div>
        </div>
      </Drawer>

      <style>{`
        /* KHUNG HEADER CHÍNH DESKTOP */
        .gx-header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          width: 100%;
          z-index: 1000;
          transition: background 0.3s ease, box-shadow 0.3s ease;
        }

        .gx-header-transparent {
          background: rgba(15, 35, 66, 0.9);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .gx-header-solid {
          background: ${primaryNavy};
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
        }

        .gx-custom-header {
          height: 80px !important;
          line-height: normal !important;
          padding: 0 !important;
          background: transparent !important;
        }

        .gx-header-container {
          max-width: 1440px;
          height: 80px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* LOGO CHÍNH */
        .gx-logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .gx-logo-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid ${accentGold};
          overflow: hidden;
          background: #ffffff;
        }

        .gx-logo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gx-logo-text {
          display: flex;
          flex-direction: column;
        }

        .gx-logo-subtitle {
          color: ${accentGold};
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .gx-logo-title {
          color: #FFFFFF;
          font-size: 21px;
          font-family: Georgia, serif;
          font-weight: 800;
          letter-spacing: 1px;
          line-height: 1.1;
        }

        /* MENU DESKTOP */
        .gx-desktop-menu {
          flex: 1;
          display: flex;
          justify-content: center;
          margin: 0 16px;
        }

        .gx-header-menu {
          background: transparent !important;
          border-bottom: none !important;
        }

        .gx-header-menu.ant-menu-horizontal {
          line-height: 80px;
        }

        .gx-header-menu .ant-menu-item::after,
        .gx-header-menu .ant-menu-submenu::after {
          display: none !important;
        }

        .gx-header-menu .ant-menu-item,
        .gx-header-menu .ant-menu-submenu-title {
          color: #FFFFFF !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px;
          padding-inline: 14px !important;
          transition: color 0.2s ease !important;
        }

        .gx-header-menu .ant-menu-item:hover,
        .gx-header-menu .ant-menu-submenu:hover .ant-menu-submenu-title,
        .gx-header-menu .ant-menu-item-selected,
        .gx-header-menu .ant-menu-submenu-selected .ant-menu-submenu-title {
          color: ${accentGold} !important;
        }

        /* ACTION BUTTONS & SECONDARY LOGO BADGE */
        .gx-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .gx-icon-btn {
          width: 40px !important;
          height: 40px !important;
          color: #FFFFFF !important;
          font-size: 18px !important;
          border-radius: 8px !important;
        }

        .gx-icon-btn:hover {
          color: ${accentGold} !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        /* LOGO HUY HIỆU BÊN PHẢI (THAY THẾ NÚT ĐÓNG GÓP) */
       
        /* POPOVER THÔNG BÁO */
        .gx-noti-popover-wrapper .ant-popover-inner {
          padding: 0 !important;
          border-radius: 12px !important;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
        }

        .gx-noti-popover {
          width: 310px;
        }

        .gx-noti-header {
          padding: 12px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: ${primaryNavy};
          font-size: 13px;
        }

        .gx-noti-item {
          padding: 12px 16px !important;
          cursor: pointer;
          transition: background 0.2s ease;
          border-bottom: 1px solid #f1f5f9;
        }

        .gx-noti-item:hover {
          background: #f8fafc;
        }

        .gx-noti-item.unread {
          background: rgba(212, 175, 55, 0.08);
        }

        .gx-noti-title {
          font-size: 13px;
          color: #1e293b;
          font-weight: 600;
          margin-bottom: 4px;
          line-height: 1.4;
        }

        .gx-noti-time {
          font-size: 11px;
          color: #94a3b8;
        }

        .gx-noti-footer {
          padding: 6px;
          text-align: center;
          background: #ffffff;
        }

        /* SEARCH MODAL STYLES */
        .gx-search-modal-inner {
          padding: 12px 0;
        }

        .gx-search-suggestions {
          margin-top: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .gx-tag-group {
          display: flex;
          gap: 8px;
        }

        .gx-tag-group span {
          background: #f1f5f9;
          color: ${primaryNavy};
          padding: 4px 10px;
          border-radius: 14px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .gx-tag-group span:hover {
          background: ${accentGold};
          color: #ffffff;
        }

        .gx-mobile-menu-btn {
          display: none !important;
          color: #FFFFFF !important;
          font-size: 22px !important;
        }

        /* MOBILE DRAWER STYLES */
        .gx-mobile-drawer .ant-drawer-wrapper-body,
        .gx-mobile-drawer .ant-drawer-content,
        .gx-mobile-drawer .ant-drawer-body,
        .gx-mobile-drawer .ant-drawer-header {
          background-color: ${primaryNavy} !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        .gx-drawer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gx-drawer-logo-img {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid ${accentGold};
        }

        .gx-drawer-logo-sub {
          color: ${accentGold};
          font-size: 10px;
          font-weight: 700;
        }

        .gx-drawer-logo-title {
          color: #FFFFFF;
          font-size: 17px;
          font-family: Georgia, serif;
          font-weight: 700;
        }

        .gx-drawer-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .gx-drawer-menu {
          background: transparent !important;
          border-right: none !important;
        }

        .gx-drawer-menu .ant-menu-item,
        .gx-drawer-menu .ant-menu-submenu-title {
          color: #FFFFFF !important;
          font-size: 15px !important;
          font-weight: 600 !important;
          height: 48px !important;
          line-height: 48px !important;
        }

        .gx-drawer-menu .ant-menu-sub {
          background: rgba(0, 0, 0, 0.25) !important;
          border-radius: 8px;
        }

        .gx-drawer-menu .ant-menu-sub .ant-menu-item {
          color: rgba(255, 255, 255, 0.85) !important;
          font-size: 14px !important;
          font-weight: 400 !important;
          padding-left: 24px !important;
        }

        .gx-drawer-menu .ant-menu-item-selected {
          background: rgba(212, 175, 55, 0.2) !important;
          color: ${accentGold} !important;
        }

        .gx-drawer-footer {
          padding: 20px 16px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          background: ${primaryNavy};
        }

        .gx-drawer-info {
          display: flex;
          align-items: center;
          gap: 10px;
          color: rgba(255, 255, 255, 0.85);
          font-size: 13px;
          margin-bottom: 8px;
        }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .gx-desktop-menu,
          .gx-secondary-logo-badge {
            display: none !important;
          }

          .gx-mobile-menu-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </ConfigProvider>
  );
};

export default HeaderBar;
