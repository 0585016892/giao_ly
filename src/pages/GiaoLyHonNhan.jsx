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
} from "antd";
import {
  MenuOutlined,
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  CompassOutlined,
  CheckCircleFilled,
  ShareAltOutlined,
  ReadOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import lessonsHonnhan from "../api/lessionhonnhan";

const { Content, Sider, Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function GiaoLyPremium() {
  const [selectedKey, setSelectedKey] = useState("1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const screens = useBreakpoint();

  // Bảng màu Tôn Nghiêm & Sang Trọng
  const primaryNavy = "#0B192C"; // Navy Đậm
  const accentGold = "#D4A017"; // Vàng Kim
  const softBg = "#F8FAFC"; // Trắng Xám Mờ
  const textDark = "#1E293B";

  useEffect(() => {
    document.title = "Giáo Lý Hôn Nhân | Giáo xứ Đồng Quan";
  }, []);

  const currentLesson = useMemo(
    () => lessonsHonnhan.find((l) => l.id.toString() === selectedKey),
    [selectedKey],
  );

  const handleChangeLesson = (id) => {
    setSelectedKey(id.toString());
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const progressPercent = Math.round(
    (parseInt(selectedKey) / lessonsHonnhan.length) * 100,
  );

  // Menu items cho Sidebar & Mobile Drawer
  const menuItems = lessonsHonnhan.map((lesson) => {
    const isSelected = selectedKey === lesson.id.toString();
    return {
      key: lesson.id.toString(),
      icon: isSelected ? (
        <CheckCircleFilled style={{ color: accentGold }} />
      ) : (
        <BookOutlined style={{ color: "#94a3b8" }} />
      ),
      label: (
        <div className="menu-item-row">
          <Text className={`menu-item-title ${isSelected ? "is-active" : ""}`}>
            Bài {lesson.id}: {lesson.title}
          </Text>
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
          borderRadius: 12,
          colorBgLayout: softBg,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        },
        components: {
          Menu: {
            itemSelectedBg: "rgba(212, 160, 23, 0.12)",
            itemSelectedColor: primaryNavy,
            itemHoverBg: "rgba(212, 160, 23, 0.08)",
            itemMarginInline: 8,
            itemBorderRadius: 8,
          },
        },
      }}
    >
      <Layout className="glhn-premium-layout">
        {/* SIDEBAR MỤC LỤC BÀI HỌC (DESKTOP) */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={340}
          theme="light"
          className="glhn-sider-custom"
          style={{
            height: "100vh",
            position: "sticky",
            top: "10px",
            left: 0,
            zIndex: 100,
            display: screens.lg ? "block" : "none",
            borderRight: "1px solid #e2e8f0",
            background: "#ffffff",
          }}
        >
          <div className="sider-flex-container">
            {/* Header Sidebar */}
            <div className="sider-header-box">
              <span className="sider-subhead">
                <CompassOutlined /> CHƯƠNG TRÌNH HỌC
              </span>
              <Title level={4} className="sider-title">
                GIÁO LÝ HÔN NHÂN
              </Title>

              <div className="sider-progress-card">
                <div className="progress-info-row">
                  <Text className="progress-text">
                    Tiến trình: <strong>{selectedKey}</strong> /{" "}
                    {lessonsHonnhan.length} bài
                  </Text>
                  <Text className="progress-percent">{progressPercent}%</Text>
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
            <div className="sider-menu-wrapper">
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                style={{ borderRight: 0 }}
              />
            </div>

            {/* Footer Sidebar */}
            <div className="sider-footer-box">
              <Text className="sider-footer-text">
                GIÁO XỨ ĐỒNG QUAN — BAN MỤC VỤ GIA ĐÌNH
              </Text>
            </div>
          </div>
        </Sider>

        {/* NỘI DUNG CHÍNH */}
        <Layout className="glhn-main-layout">
          {/* MOBILE HEADER STICKY */}
          {!screens.lg && (
            <Header className="glhn-mobile-header">
              <div className="mobile-header-left">
                <ReadOutlined style={{ color: accentGold, fontSize: 18 }} />
                <Text id="mobile-title" ellipsis strong>
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

          {/* TOP READING CONTROL BAR */}
          <div className="glhn-top-bar">
            <div className="top-bar-container">
              <div className="top-bar-left">
                <span className="lesson-badge">
                  BÀI HỌC {selectedKey} / {lessonsHonnhan.length}
                </span>
              </div>

              <div className="top-bar-right">
                <Tooltip title="In bài học">
                  <Button
                    icon={<PrinterOutlined />}
                    type="text"
                    onClick={() => window.print()}
                  />
                </Tooltip>
                <Tooltip title="Chia sẻ bài học">
                  <Button
                    icon={<ShareAltOutlined />}
                    type="text"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                    }}
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          {/* CONTAINER BÀI VIẾT */}
          <Content className="glhn-content-container">
            {currentLesson && (
              <div className="glhn-lesson-article fade-in-up">
                {/* HEADLINE BÀI HỌC */}
                <header className="article-header">
                  <span className="article-tag">
                    KHÓA HỌC CHUẨN BỊ HÔN NHÂN
                  </span>
                  <Title level={1} className="article-title">
                    {currentLesson.title}
                  </Title>
                  <div className="gold-accent-line" />
                </header>

                {/* THẺ NỘI DUNG CHÍNH */}
                <Card bordered={false} className="article-card">
                  <div className="markdown-body-custom">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>

                  {/* CHÂN BÀI HỌC & NÚT ĐIỀU HƯỚNG */}
                  <div className="article-footer-nav">
                    <Button
                      type="default"
                      icon={<LeftOutlined />}
                      onClick={() =>
                        handleChangeLesson(parseInt(selectedKey) - 1)
                      }
                      disabled={selectedKey === "1"}
                      className="nav-btn btn-prev"
                    >
                      Bài trước
                    </Button>

                    <div className="nav-page-indicator">
                      {selectedKey} / {lessonsHonnhan.length}
                    </div>

                    <Button
                      type="primary"
                      onClick={() =>
                        handleChangeLesson(parseInt(selectedKey) + 1)
                      }
                      disabled={parseInt(selectedKey) === lessonsHonnhan.length}
                      className="nav-btn btn-next"
                    >
                      Bài tiếp theo <RightOutlined />
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </Content>
        </Layout>

        {/* DRAWER MỤC LỤC MOBILE */}
        <Drawer
          title={
            <div className="drawer-header-title">
              <CompassOutlined style={{ color: accentGold }} />
              <span>DANH MỤC GIÁO LÝ</span>
            </div>
          }
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={310}
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

      {/* STYLESHEET CHUYÊN BIỆT EDITORIAL */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

        .glhn-premium-layout {
          min-height: 100vh;
          padding-top:20px;
          background-color: ${softBg};
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        /* ANIMATION */
        .fade-in-up {
          animation: fadeInUp 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* SIDEBAR DESKTOP */
        .sider-flex-container {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .sider-header-box {
          padding: 28px 20px 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }

        .sider-subhead {
          font-size: 11px;
          letter-spacing: 2px;
          color: ${accentGold};
          font-weight: 700;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sider-title {
          font-family: 'Playfair Display', Georgia, serif !important;
          color: ${primaryNavy} !important;
          margin: 6px 0 16px 0 !important;
          font-weight: 700 !important;
          font-size: 20px !important;
        }

        .sider-progress-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 12px 14px;
          border-radius: 10px;
        }

        .progress-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .progress-text { font-size: 12px; color: #64748b; }
        .progress-percent { font-size: 12px; font-weight: 700; color: ${accentGold}; }

        .sider-menu-wrapper {
          flex: 1;
          overflow-y: auto;
          padding: 12px 0;
        }

        .menu-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .menu-item-title {
          font-size: 13px;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .menu-item-title.is-active {
          font-weight: 700;
          color: ${primaryNavy};
        }

        .sider-footer-box {
          padding: 16px;
          text-align: center;
          border-top: 1px dashed #e2e8f0;
        }

        .sider-footer-text {
          font-size: 10px;
          color: #94a3b8;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        /* MOBILE HEADER */
        .glhn-mobile-header {
          background: #ffffff;
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid #e2e8f0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
          height: 56px;
        }

        .mobile-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 80%;
        }

        #mobile-title {
          font-size: 13px;
          color: ${primaryNavy};
        }

        /* TOP READING CONTROL BAR */
        .glhn-top-bar {
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 12px 0;
        }

        .top-bar-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .lesson-badge {
          background: rgba(212, 160, 23, 0.12);
          border: 1px solid ${accentGold};
          color: ${primaryNavy};
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .top-bar-right {
          display: flex;
          gap: 8px;
        }

        /* CONTENT CONTAINER */
        .glhn-content-container {
          max-width: 860px;
          margin: 0 auto;
          padding: 36px 24px 80px 24px;
          width: 100%;
        }

        .article-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .article-tag {
          font-size: 11px;
          letter-spacing: 2px;
          color: ${accentGold};
          font-weight: 700;
          text-transform: uppercase;
          display: block;
          margin-bottom: 8px;
        }

        .article-title {
          font-family: 'Playfair Display', Georgia, serif !important;
          color: ${primaryNavy} !important;
          font-weight: 700 !important;
          font-size: clamp(24px, 4vw, 36px) !important;
          margin: 0 0 16px 0 !important;
          line-height: 1.3 !important;
        }

        .gold-accent-line {
          width: 60px;
          height: 3px;
          background: ${accentGold};
          margin: 0 auto;
          border-radius: 2px;
        }

        /* ARTICLE CARD & MARKDOWN */
        .article-card {
          border-radius: 20px !important;
          box-shadow: 0 8px 30px rgba(11, 25, 44, 0.05) !important;
          border: 1px solid #e2e8f0 !important;
          padding: 12px;
          background: #ffffff !important;
        }

        .markdown-body-custom {
          font-size: 16px;
          line-height: 1.85;
          color: ${textDark};
        }

        .markdown-body-custom h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: ${primaryNavy};
          margin-top: 36px;
          margin-bottom: 16px;
          border-bottom: 1.5px solid rgba(212, 160, 23, 0.3);
          padding-bottom: 8px;
          font-size: 22px;
          font-weight: 700;
        }

        .markdown-body-custom h3 {
          color: ${primaryNavy};
          font-size: 18px;
          margin-top: 24px;
          margin-bottom: 12px;
          font-weight: 700;
        }

        .markdown-body-custom p {
          margin-bottom: 18px;
          text-align: justify;
        }

        .markdown-body-custom ul, .markdown-body-custom ol {
          padding-left: 20px;
          margin-bottom: 18px;
        }

        .markdown-body-custom li {
          margin-bottom: 6px;
        }

        .markdown-body-custom blockquote {
          border-left: 4px solid ${accentGold};
          background: #f8fafc;
          margin: 24px 0;
          padding: 16px 20px;
          font-style: italic;
          color: #475569;
          border-radius: 0 10px 10px 0;
        }

        /* FOOTER NAVIGATION */
        .article-footer-nav {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .nav-btn {
          height: 44px;
          border-radius: 8px;
          font-weight: 600;
          padding: 0 20px;
        }

        .btn-prev {
          border-color: #cbd5e1 !important;
          color: ${primaryNavy} !important;
        }

        .btn-next {
          background: ${accentGold} !important;
          border-color: ${accentGold} !important;
          color: #ffffff !important;
          box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3);
        }

        .btn-next:hover {
          background: #b8860b !important;
          border-color: #b8860b !important;
        }

        .nav-page-indicator {
          font-size: 13px;
          font-weight: 700;
          color: #64748b;
        }

        .drawer-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          color: ${primaryNavy};
          font-size: 15px;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .glhn-premium-layout { margin-top: 0; }
          .glhn-content-container { padding: 20px 16px 60px 16px; }
          .article-card { border-radius: 12px !important; }
          .markdown-body-custom { font-size: 15px; line-height: 1.75; }
          .markdown-body-custom h2 { font-size: 19px; }
          .article-footer-nav { flex-direction: column; gap: 12px; }
          .nav-btn { width: 100%; }
          .nav-page-indicator { display: none; }
        }

        @media print {
          .glhn-sider-custom, .glhn-top-bar, .article-footer-nav, .glhn-mobile-header {
            display: none !important;
          }
          .glhn-content-container { padding: 0 !important; max-width: 100% !important; }
          .article-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>
    </ConfigProvider>
  );
}
