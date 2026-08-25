import React, { useState, useMemo, useEffect } from "react";
import {
  Layout,
  Menu,
  Typography,
  Button,
  ConfigProvider,
  Drawer,
  Grid,
  Card,
  Progress,
  Tooltip,
  Divider,
  Space,
  message,
} from "antd";
import {
  MenuOutlined,
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  CompassOutlined,
  CheckCircleFilled,
  ShareAltOutlined,
  PrinterOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import lessonsHonnhan from "../api/lessionhonnhan";

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function GiaoLyPremium() {
  const [selectedKey, setSelectedKey] = useState("1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Thêm tính năng tăng/giảm cỡ chữ
  const screens = useBreakpoint();

  // Bảng màu Editorial Tôn Nghiêm
  const primaryNavy = "#0B192C";
  const accentGold = "#D4A017";
  const softBg = "#F8FAFC";
  const textDark = "#0F172A";

  useEffect(() => {
    document.title = "Giáo Lý Hôn Nhân | Giáo xứ Đồng Quan";
  }, []);

  const currentLesson = useMemo(
    () => lessonsHonnhan.find((l) => l.id.toString() === selectedKey),
    [selectedKey],
  );

  const currentIndex = useMemo(
    () => lessonsHonnhan.findIndex((l) => l.id.toString() === selectedKey),
    [selectedKey],
  );

  const handleChangeLesson = (id) => {
    setSelectedKey(id.toString());
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progressPercent = Math.round(
    ((currentIndex + 1) / lessonsHonnhan.length) * 100,
  );

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    message.success("Đã chép liên kết bài học!");
  };

  // Menu items cho Sidebar & Drawer
  const menuItems = lessonsHonnhan.map((lesson) => {
    const isSelected = selectedKey === lesson.id.toString();
    return {
      key: lesson.id.toString(),
      icon: (
        <span className={`menu-lesson-num ${isSelected ? "is-selected" : ""}`}>
          {lesson.id}
        </span>
      ),
      label: (
        <div className="menu-item-row">
          <Text className={`menu-item-title ${isSelected ? "is-active" : ""}`}>
            {lesson.title}
          </Text>
          {isSelected && (
            <CheckCircleFilled style={{ color: accentGold, fontSize: 14 }} />
          )}
        </div>
      ),
      onClick: () => handleChangeLesson(lesson.id),
    };
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentGold,
          borderRadius: 10,
          colorBgLayout: softBg,
          fontFamily: "'Inter', -apple-system, sans-serif",
        },
        components: {
          Menu: {
            itemSelectedBg: "rgba(212, 160, 23, 0.12)",
            itemSelectedColor: primaryNavy,
            itemHoverBg: "rgba(212, 160, 23, 0.06)",
            itemMarginInline: 8,
            itemBorderRadius: 8,
          },
        },
      }}
    >
      <Layout className="glhn-redesign-layout">
        {/* SIDEBAR MỤC LỤC DESKTOP */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={340}
          theme="light"
          className="glhn-sider-desktop"
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 100,
            display: screens.lg ? "block" : "none",
            borderRight: "1px solid #E2E8F0",
            background: "#FFFFFF",
          }}
        >
          <div className="sider-inner-flex">
            {/* Header Sidebar */}
            <div className="sider-brand-header">
              <span className="sider-badge">
                <CompassOutlined /> KHÓA HỌC MỤC VỤ
              </span>
              <Title level={4} className="sider-main-title">
                GIÁO LÝ HÔN NHÂN
              </Title>

              <div className="sider-progress-box">
                <div className="progress-info-row">
                  <Text className="progress-label">Tiến trình bài học</Text>
                  <Text className="progress-val">
                    {currentIndex + 1}/{lessonsHonnhan.length} (
                    {progressPercent}%)
                  </Text>
                </div>
                <Progress
                  percent={progressPercent}
                  showInfo={false}
                  strokeColor={accentGold}
                  trailColor="rgba(212, 160, 23, 0.15)"
                  size="small"
                />
              </div>
            </div>

            {/* Menu Bài Học */}
            <div className="sider-menu-scroll">
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                style={{ borderRight: 0 }}
              />
            </div>

            {/* Footer Sidebar */}
            <div className="sider-footer-info">
              <Text className="footer-org">GIÁO XỨ ĐỒNG QUAN</Text>
              <Text className="footer-sub">Ban Mục Vụ Gia Đình</Text>
            </div>
          </div>
        </Sider>

        {/* NỘI DUNG CHÍNH */}
        <Layout className="glhn-main-wrapper">
          {/* MOBILE HEADER STICKY */}
          {!screens.lg && (
            <Header className="glhn-mobile-header">
              <div className="mobile-header-info">
                <BookOutlined style={{ color: accentGold, fontSize: 16 }} />
                <Text className="mobile-lesson-title" ellipsis strong>
                  BÀI {selectedKey}: {currentLesson?.title}
                </Text>
              </div>

              <Button
                icon={
                  <MenuOutlined style={{ fontSize: 18, color: primaryNavy }} />
                }
                type="text"
                onClick={() => setIsDrawerOpen(true)}
              />
            </Header>
          )}

          {/* TOP UTILITY BAR (Desktop & Tablet) */}
          <div className="glhn-top-toolbar">
            <div className="toolbar-container">
              <div className="toolbar-left">
                <span className="current-chapter-chip">
                  Bài học {currentIndex + 1} trên {lessonsHonnhan.length}
                </span>
              </div>

              <div className="toolbar-right">
                <Space size={6}>
                  <Tooltip title="Thu nhỏ chữ">
                    <Button
                      size="small"
                      disabled={fontSize <= 14}
                      onClick={() => setFontSize((f) => f - 1)}
                    >
                      A-
                    </Button>
                  </Tooltip>
                  <Tooltip title="Phóng to chữ">
                    <Button
                      size="small"
                      disabled={fontSize >= 22}
                      onClick={() => setFontSize((f) => f + 1)}
                    >
                      A+
                    </Button>
                  </Tooltip>
                  <Divider vertical style={{ borderColor: "#E2E8F0" }} />
                  <Tooltip title="In bài học này">
                    <Button
                      icon={<PrinterOutlined />}
                      type="text"
                      onClick={() => window.print()}
                    />
                  </Tooltip>
                  <Tooltip title="Sao chép liên kết">
                    <Button
                      icon={<ShareAltOutlined />}
                      type="text"
                      onClick={handleCopyLink}
                    />
                  </Tooltip>
                </Space>
              </div>
            </div>
          </div>

          {/* CONTAINER KHÔNG GIAN ĐỌC BÀI HỌC */}
          <Content className="glhn-reading-container">
            {currentLesson && (
              <div className="glhn-article-wrapper fade-in-up">
                {/* HEADLINE BÀI HỌC */}
                <header className="article-hero-header">
                  <span className="course-tag-label">
                    CHƯƠNG TRÌNH CHUẨN BỊ HÔN NHÂN
                  </span>
                  <Title level={1} className="hero-article-title">
                    Bài {currentLesson.id}: {currentLesson.title}
                  </Title>
                  <div className="gold-accent-line" />
                </header>

                {/* KHUNG VĂN BẢN CHÍNH */}
                <Card bordered={false} className="article-body-card">
                  <div
                    className="markdown-editorial-body"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>

                  {/* CHÂN BÀI HỌC & ĐIỀU HƯỚNG TRANG */}
                  <div className="article-footer-navigation">
                    <Button
                      type="default"
                      icon={<LeftOutlined />}
                      onClick={() => {
                        const prevLesson = lessonsHonnhan[currentIndex - 1];
                        if (prevLesson) handleChangeLesson(prevLesson.id);
                      }}
                      disabled={currentIndex === 0}
                      className="nav-action-btn btn-prev"
                    >
                      Bài trước
                    </Button>

                    <div className="nav-page-badge">
                      {currentIndex + 1} / {lessonsHonnhan.length}
                    </div>

                    <Button
                      type="primary"
                      onClick={() => {
                        const nextLesson = lessonsHonnhan[currentIndex + 1];
                        if (nextLesson) handleChangeLesson(nextLesson.id);
                      }}
                      disabled={currentIndex === lessonsHonnhan.length - 1}
                      className="nav-action-btn btn-next"
                    >
                      Bài tiếp <RightOutlined />
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </Content>

          {/* BUTTON CUỘN LÊN ĐẦU TRANG */}
          <div className="back-to-top-floating">
            <Tooltip title="Cuộn lên đầu trang">
              <Button
                shape="circle"
                type="primary"
                icon={<ArrowUpOutlined />}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                style={{
                  backgroundColor: primaryNavy,
                  boxShadow: "0 4px 14px rgba(11, 25, 44, 0.25)",
                }}
              />
            </Tooltip>
          </div>
        </Layout>

        {/* DRAWER MỤC LỤC MOBILE */}
        <Drawer
          title={
            <div className="drawer-header-brand">
              <CompassOutlined style={{ color: accentGold }} />
              <span>DANH SÁCH BÀI HỌC</span>
            </div>
          }
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={320}
          className="glhn-mobile-drawer"
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ border: "none" }}
          />
        </Drawer>
      </Layout>

      {/* STYLESHEET SCOPED EDITORIAL */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .glhn-redesign-layout {
          min-height: 100vh;
          padding-top:40px;
          background-color: ${softBg};
          font-family: 'Inter', -apple-system, sans-serif;
          color: ${textDark};
        }

        .fade-in-up {
          animation: fadeInUp 0.4s ease-out;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* SIDEBAR DESKTOP */
        .sider-inner-flex {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .sider-brand-header {
          padding: 24px 20px 16px;
          border-bottom: 1px solid #F1F5F9;
        }

        .sider-badge {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: ${accentGold};
          font-weight: 700;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sider-main-title {
          color: ${primaryNavy} !important;
          margin: 6px 0 14px 0 !important;
          font-weight: 800 !important;
          font-size: 20px !important;
          letter-spacing: -0.5px;
        }

        .sider-progress-box {
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 12px 14px;
          border-radius: 10px;
        }

        .progress-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .progress-label { font-size: 12px; color: #64748B; }
        .progress-val { font-size: 12px; font-weight: 700; color: ${primaryNavy}; }

        .sider-menu-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0;
        }

        .menu-lesson-num {
          font-size: 12px;
          font-weight: 700;
          color: #94A3B8;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #F1F5F9;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .menu-lesson-num.is-selected {
          background: ${accentGold};
          color: #FFFFFF;
        }

        .menu-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding-right: 4px;
        }

        .menu-item-title {
          font-size: 13.5px;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu-item-title.is-active {
          font-weight: 700;
          color: ${primaryNavy};
        }

        .sider-footer-info {
          padding: 16px;
          text-align: center;
          border-top: 1px dashed #E2E8F0;
          background: #FAFAFA;
        }

        .footer-org {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: ${primaryNavy};
          letter-spacing: 0.5px;
        }

        .footer-sub {
          display: block;
          font-size: 10.5px;
          color: #94A3B8;
        }

        /* MOBILE HEADER */
        .glhn-mobile-header {
          background: #FFFFFF;
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid #E2E8F0;
          height: 54px;
        }

        .mobile-header-info {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 80%;
        }

        .mobile-lesson-title {
          font-size: 13.5px;
          color: ${primaryNavy};
        }

        /* TOP TOOLBAR */
        .glhn-top-toolbar {
          background: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 10px 0;
        }

        .toolbar-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .current-chapter-chip {
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid rgba(212, 160, 23, 0.3);
          color: ${primaryNavy};
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11.5px;
          font-weight: 700;
        }

        /* READING CONTAINER */
        .glhn-reading-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 36px 20px 80px;
          width: 100%;
        }

        .article-hero-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .course-tag-label {
          font-size: 11px;
          letter-spacing: 1.5px;
          color: ${accentGold};
          font-weight: 700;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .hero-article-title {
          color: ${primaryNavy} !important;
          font-weight: 800 !important;
          font-size: clamp(24px, 4.5vw, 34px) !important;
          margin: 0 0 16px 0 !important;
          line-height: 1.3 !important;
          letter-spacing: -0.5px;
        }

        .gold-accent-line {
          width: 50px;
          height: 3px;
          background: ${accentGold};
          margin: 0 auto;
          border-radius: 2px;
        }

        /* CARD & MARKDOWN TYPOGRAPHY */
        .article-body-card {
          border-radius: 20px !important;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05) !important;
          border: 1px solid #E2E8F0 !important;
          padding: 16px;
          background: #FFFFFF !important;
        }

        .markdown-editorial-body {
          line-height: 1.85;
          color: ${textDark};
          max-width: 680px;
          margin: 0 auto;
          transition: font-size 0.15s ease;
        }

        .markdown-editorial-body h2 {
          color: ${primaryNavy};
          margin-top: 36px;
          margin-bottom: 16px;
          border-bottom: 2px solid rgba(212, 160, 23, 0.25);
          padding-bottom: 8px;
          font-size: 1.4em;
          font-weight: 700;
        }

        .markdown-editorial-body h3 {
          color: ${primaryNavy};
          font-size: 1.2em;
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .markdown-editorial-body p {
          margin-bottom: 20px;
          text-align: justify;
        }

        .markdown-editorial-body ul, .markdown-editorial-body ol {
          padding-left: 22px;
          margin-bottom: 20px;
        }

        .markdown-editorial-body li {
          margin-bottom: 8px;
        }

        .markdown-editorial-body blockquote {
          border-left: 4px solid ${accentGold};
          background: #F8FAFC;
          margin: 24px 0;
          padding: 16px 20px;
          font-style: italic;
          color: #475569;
          border-radius: 0 12px 12px 0;
        }

        /* FOOTER NAVIGATION */
        .article-footer-navigation {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px dashed #E2E8F0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .nav-action-btn {
          height: 44px;
          border-radius: 10px;
          font-weight: 600;
          padding: 0 20px;
        }

        .btn-prev {
          border-color: #CBD5E1 !important;
          color: ${primaryNavy} !important;
        }

        .btn-next {
          background-color: ${primaryNavy} !important;
          border-color: ${primaryNavy} !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 12px rgba(11, 25, 44, 0.2);
        }

        .btn-next:hover {
          background-color: #132744 !important;
        }

        .nav-page-badge {
          font-size: 13px;
          font-weight: 700;
          color: #64748B;
        }

        .back-to-top-floating {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 99;
        }

        .drawer-header-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: ${primaryNavy};
          font-size: 15px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .glhn-reading-container { padding: 20px 12px 60px; }
          .article-body-card { border-radius: 14px !important; padding: 4px; }
          .markdown-editorial-body { text-align: left; }
          .article-footer-navigation {
    display: flex;
    flex-direction: row; /* Xếp hàng ngang */
    flex-wrap: wrap;     /* Cho phép xuống dòng chứa badge nếu cần */
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .article-footer-navigation .nav-action-btn {
    flex: 1;             /* Chia đều 2 cột 50% - 50% */
    width: auto;         /* Ghi đè width 100% cũ */
    padding: 0 8px;      /* Tối ưu khoảng cách chữ trên màn hình nhỏ */
    font-size: 13px;
  }

  /* Badge hiển thị ở giữa hoặc giấu đi tùy nhu cầu */
  .nav-page-badge {
    display: block;      /* Hiện số trang ở giữa 2 nút */
    order: 0;            /* Nút prev (1), Badge (2), Nút next (3) */
    font-size: 12px;
    white-space: nowrap;
  }
  
  .btn-prev { order: 1; }
  .btn-next { order: 3; }
}
          .nav-action-btn { width: 100%; }
          .nav-page-badge { display: none; }
          .glhn-top-toolbar { display: none; }
        }

        @media print {
          .glhn-sider-desktop, .glhn-top-toolbar, .article-footer-navigation, .glhn-mobile-header, .back-to-top-floating {
            display: none !important;
          }
          .glhn-reading-container { padding: 0 !important; max-width: 100% !important; }
          .article-body-card { box-shadow: none !important; border: none !important; }
        }
      `,
        }}
      />
    </ConfigProvider>
  );
}
