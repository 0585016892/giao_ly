import React, { useState, useMemo, useEffect } from "react";
import {
  Layout,
  Menu,
  Typography,
  Button,
  Space,
  ConfigProvider,
  Drawer,
  Grid,
  Card,
  Progress,
} from "antd";
import {
  MenuOutlined,
  ReadOutlined,
  BookOutlined,
  LeftOutlined,
  RightOutlined,
  CompassOutlined,
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

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B"; // Xám xanh đen
  const softBg = "#FAFAFA";

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

  const menuItems = lessonsHonnhan.map((lesson) => ({
    key: lesson.id.toString(),
    icon: (
      <BookOutlined
        style={{
          color: selectedKey === lesson.id.toString() ? accentGold : "#64748b",
        }}
      />
    ),
    label: (
      <Text
        strong={selectedKey === lesson.id.toString()}
        className="menu-item-text"
      >
        Bài {lesson.id}. {lesson.title}
      </Text>
    ),
    onClick: () => handleChangeLesson(lesson.id),
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 12,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
        components: {
          Menu: {
            itemSelectedBg: "rgba(27, 54, 93, 0.08)",
            itemSelectedColor: primaryNavy,
            itemHoverBg: "rgba(212, 175, 55, 0.08)",
          },
        },
      }}
    >
      <Layout style={{ minHeight: "100vh", background: softBg }}>
        {/* SIDEBAR MỤC LỤC BÀI HỌC */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={320}
          theme="light"
          className="glhn-sider-custom"
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 100,
            display: screens.lg ? "block" : "none",
            borderRight: "1px solid rgba(212, 175, 55, 0.2)",
            background: "#ffffff",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ padding: "32px 24px 16px" }}>
              <span className="sider-subhead">
                <CompassOutlined /> CHƯƠNG TRÌNH HỌC
              </span>
              <Title level={4} className="sider-title">
                MỤC LỤC GIÁO LÝ
              </Title>
              <div className="sider-progress-box">
                <Text style={{ fontSize: 12, color: "#64748b" }}>
                  Tiến trình: {selectedKey}/{lessonsHonnhan.length} bài
                </Text>
                <Progress
                  percent={progressPercent}
                  size="small"
                  strokeColor={accentGold}
                  trailColor="rgba(27, 54, 93, 0.1)"
                />
              </div>
            </div>

            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              style={{ borderRight: 0, flex: 1, overflowY: "auto" }}
            />

            <div
              style={{
                padding: "20px",
                textAlign: "center",
                borderTop: "1px dashed rgba(212, 175, 55, 0.2)",
              }}
            >
              <Text style={{ fontSize: 11, color: "#64748b" }}>
                GIÁO XỨ ĐỒNG QUAN — Ban Mục vụ Gia đình
              </Text>
            </div>
          </div>
        </Sider>

        <Layout style={{ background: softBg }}>
          {/* MOBILE HEADER STICKY */}
          {!screens.lg && (
            <Header className="glhn-mobile-header">
              <Space>
                <ReadOutlined style={{ color: accentGold, fontSize: 18 }} />
                <Text strong style={{ color: primaryNavy }}>
                  BÀI {selectedKey}: {currentLesson?.title}
                </Text>
              </Space>

              <Button
                icon={
                  <MenuOutlined style={{ fontSize: 18, color: primaryNavy }} />
                }
                type="text"
                onClick={() => setIsDrawerOpen(true)}
              />
            </Header>
          )}

          <Content
            style={{
              padding: screens.xs ? "24px 12px" : "48px 32px",
              maxWidth: 900,
              margin: "0 auto",
              width: "100%",
            }}
          >
            {currentLesson && (
              <div className="fade-in-up">
                {/* HEADLINE BÀI HỌC */}
                <div style={{ marginBottom: 36, textAlign: "center" }}>
                  <span className="lesson-badge-tag">
                    BÀI HỌC {currentLesson.id} / {lessonsHonnhan.length}
                  </span>

                  <Title
                    level={screens.xs ? 3 : 1}
                    className="lesson-main-title"
                  >
                    {currentLesson.title}
                  </Title>
                  <div className="gold-accent-divider" />
                </div>

                {/* THẺ NỘI DUNG CHÍNH DẠNG EDITORIAL */}
                <Card bordered={false} className="lesson-content-card">
                  <div className="lesson-body-markdown">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>

                  {/* NÚT ĐIỀU HƯỚNG BÀI VIẾT */}
                  <div className="lesson-navigation-footer">
                    <Button
                      type="default"
                      icon={<LeftOutlined />}
                      onClick={() =>
                        handleChangeLesson(parseInt(selectedKey) - 1)
                      }
                      disabled={selectedKey === "1"}
                      className="nav-btn-prev"
                    >
                      Bài trước
                    </Button>

                    <Button
                      type="primary"
                      onClick={() =>
                        handleChangeLesson(parseInt(selectedKey) + 1)
                      }
                      disabled={parseInt(selectedKey) === lessonsHonnhan.length}
                      className="nav-btn-next"
                    >
                      Bài tiếp theo <RightOutlined />
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </Content>
        </Layout>

        {/* DRAWER CHO THIẾT BỊ DI ĐỘNG */}
        <Drawer
          title={
            <span
              style={{
                color: primaryNavy,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
              }}
            >
              DANH MỤC BÀI HỌC
            </span>
          }
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={290}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ border: "none" }}
          />
        </Drawer>
      </Layout>

      {/* CUSTOM CSS SCOPED */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

        .fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Sidebar Custom Styling */
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
          margin: 6px 0 12px 0 !important;
          font-weight: 700 !important;
        }

        .sider-progress-box {
          margin-bottom: 12px;
        }

        .menu-item-text {
          font-size: 13px;
          color: ${textDark};
        }

        /* Mobile Header */
        .glhn-mobile-header {
          background: #ffffff;
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          box-shadow: 0 4px 12px rgba(27, 54, 93, 0.05);
        }

        /* Content Styling */
        .lesson-badge-tag {
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid ${accentGold};
          color: ${primaryNavy};
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          display: inline-block;
          margin-bottom: 12px;
        }

        .lesson-main-title {
          font-family: 'Playfair Display', Georgia, serif !important;
          color: ${primaryNavy} !important;
          margin: 0 0 12px 0 !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
        }

        .gold-accent-divider {
          width: 60px;
          height: 3px;
          background: ${accentGold};
          margin: 0 auto;
          border-radius: 2px;
        }

        /* Content Card */
        .lesson-content-card {
          border-radius: 20px !important;
          box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          padding: ${screens.xs ? "12px" : "28px"};
          background: #ffffff !important;
        }

        /* Markdown Body Formatting */
        .lesson-body-markdown {
          font-size: 17px;
          line-height: 1.85;
          color: ${textDark};
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .lesson-body-markdown h2 {
          font-family: 'Playfair Display', Georgia, serif;
          color: ${primaryNavy};
          margin-top: 36px;
          border-bottom: 1px solid rgba(212, 175, 55, 0.3);
          padding-bottom: 8px;
          font-size: 22px;
          font-weight: 700;
        }

        .lesson-body-markdown h3 {
          color: ${primaryNavy};
          font-size: 18px;
          margin-top: 24px;
        }

        .lesson-body-markdown p {
          margin-bottom: 18px;
          text-align: justify;
        }

        .lesson-body-markdown blockquote {
          border-left: 4px solid ${accentGold};
          background: ${softBg};
          margin: 20px 0;
          padding: 12px 20px;
          font-style: italic;
          color: #475569;
          border-radius: 0 8px 8px 0;
        }

        /* Navigation Footer */
        .lesson-navigation-footer {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px dashed rgba(212, 175, 55, 0.3);
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .nav-btn-prev {
          border-color: rgba(27, 54, 93, 0.2) !important;
          color: ${primaryNavy} !important;
          font-weight: 600;
          height: 42px;
          padding: 0 20px;
          border-radius: 8px;
        }

        .nav-btn-next {
          background: ${primaryNavy} !important;
          color: #ffffff !important;
          font-weight: 600;
          height: 42px;
          padding: 0 24px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
        }

        .nav-btn-next:hover {
          background: #132744 !important;
        }

        /* Responsive Mobile Styling */
        @media (max-width: 768px) {
          .lesson-body-markdown {
            font-size: 15px;
            line-height: 1.7;
          }
          
          .lesson-body-markdown h2 {
            font-size: 18px;
            margin-top: 24px; 
            padding-bottom: 6px;
          }

          .lesson-navigation-footer {
            flex-direction: column;
          }

          .nav-btn-prev, .nav-btn-next {
            width: 100%;
          }
        }
      `}</style>
    </ConfigProvider>
  );
}
