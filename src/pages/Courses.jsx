import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Menu,
  Typography,
  Button,
  Progress,
  Space,
  Tag,
  ConfigProvider,
  Divider,
  Drawer,
  Grid,
  Card,
  Avatar,
} from "antd";
import {
  CheckCircleFilled,
  LockFilled,
  LeftOutlined,
  RightOutlined,
  SafetyCertificateFilled,
  MenuOutlined,
  ReadOutlined,
  BookOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import lessons from "../api/lession";

const { Content, Sider, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function GiaoLyPremium() {
  const [selectedKey, setSelectedKey] = useState("1");
  const [completed, setCompleted] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const screens = useBreakpoint();

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    document.title = "Giáo Lý Dự Tòng | Giáo xứ Đồng Quan";
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("giaoly_progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const progressPercent = Math.round((completed.length / lessons.length) * 100);

  const currentLesson = useMemo(
    () => lessons.find((l) => l.id.toString() === selectedKey),
    [selectedKey],
  );

  const isCurrentLessonCompleted = completed.includes(currentLesson?.id);

  const handleChangeLesson = (id) => {
    const targetIndex = lessons.findIndex((l) => l.id === id);
    if (targetIndex > 0) {
      const previousLessonId = lessons[targetIndex - 1].id;
      if (!completed.includes(previousLessonId)) return;
    }
    setSelectedKey(id.toString());
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMarkComplete = () => {
    if (currentLesson && !completed.includes(currentLesson.id)) {
      const newCompleted = [...completed, currentLesson.id];
      setCompleted(newCompleted);
      localStorage.setItem("giaoly_progress", JSON.stringify(newCompleted));
    }
  };

  const menuItems = lessons.map((lesson, index) => {
    const isLocked = index > 0 && !completed.includes(lessons[index - 1].id);
    const isSelected = selectedKey === lesson.id.toString();
    const isDone = completed.includes(lesson.id);

    return {
      key: lesson.id.toString(),
      disabled: isLocked,
      icon: isDone ? (
        <CheckCircleFilled style={{ color: accentGold }} />
      ) : isLocked ? (
        <LockFilled style={{ color: "#94a3b8" }} />
      ) : (
        <BookOutlined style={{ color: isSelected ? primaryNavy : "#64748b" }} />
      ),
      label: (
        <div style={{ padding: "4px 0" }}>
          <Text
            strong={isSelected}
            delete={isDone && !isSelected}
            style={{
              fontSize: "13px",
              color: isLocked ? "#cbd5e1" : isSelected ? primaryNavy : textDark,
            }}
          >
            Bài {lesson.id}. {lesson.title}
          </Text>
        </div>
      ),
      onClick: () => !isLocked && handleChangeLesson(lesson.id),
    };
  });

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
        {/* SIDEBAR MỤC LỤC & TIẾN ĐỘ */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={320}
          theme="light"
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            left: 0,
            zIndex: 100,
            display: screens.lg ? "block" : "none",
            borderRight: "1px solid rgba(212, 175, 55, 0.25)",
            backgroundColor: "#ffffff",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
          >
            <div style={{ padding: "32px 24px 16px", flexShrink: 0 }}>
              <Space size={12} style={{ marginBottom: 20 }}>
                <Avatar
                  shape="square"
                  icon={<SafetyCertificateFilled />}
                  style={{ backgroundColor: primaryNavy, color: accentGold }}
                />
                <div>
                  <span className="sider-tag-sub">
                    <CompassOutlined /> HỌC TẬP TRỰC TUYẾN
                  </span>
                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      color: primaryNavy,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    GIÁO LÝ DỰ TÒNG
                  </Title>
                </div>
              </Space>

              <Card
                size="small"
                bordered={false}
                style={{
                  background: softBg,
                  borderRadius: 12,
                  border: "1px solid rgba(212, 175, 55, 0.3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}
                  >
                    TIẾN ĐỘ HOÀN THÀNH
                  </Text>
                  <Text strong style={{ color: primaryNavy, fontSize: 12 }}>
                    {progressPercent}%
                  </Text>
                </div>
                <Progress
                  percent={progressPercent}
                  strokeColor={accentGold}
                  trailColor="rgba(27, 54, 93, 0.1)"
                  size="small"
                  showInfo={false}
                />
              </Card>
              <Divider
                style={{
                  margin: "20px 0 0 0",
                  borderColor: "rgba(212, 175, 55, 0.15)",
                }}
              />
            </div>

            <div
              className="custom-scrollbar"
              style={{ flex: 1, overflowY: "auto", padding: "12px" }}
            >
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                style={{ borderRight: 0 }}
              />
            </div>

            <div
              style={{
                padding: "16px",
                textAlign: "center",
                borderTop: "1px dashed rgba(212, 175, 55, 0.2)",
              }}
            >
              <Text style={{ fontSize: 11, color: "#64748b" }}>
                GIÁO XỨ ĐỒNG QUAN — Ban Mục vụ Tân Tòng
              </Text>
            </div>
          </div>
        </Sider>

        <Layout style={{ background: softBg }}>
          {/* HEADER MOBILE */}
          {!screens.lg && (
            <Header className="glhn-mobile-header">
              <Space>
                <ReadOutlined style={{ color: accentGold, fontSize: 18 }} />
                <Title level={5} style={{ margin: 0, color: primaryNavy }}>
                  BÀI {selectedKey}: {currentLesson?.title}
                </Title>
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
                <div style={{ marginBottom: 32, textAlign: "center" }}>
                  <Tag className="lesson-badge-tag">
                    {currentLesson.tag || `BÀI HỌC ${currentLesson.id}`}
                  </Tag>

                  <Title
                    level={screens.xs ? 3 : 1}
                    className="lesson-main-title"
                  >
                    Bài {currentLesson.id}. {currentLesson.title}
                  </Title>

                  {currentLesson.desc && (
                    <Paragraph className="lesson-subtitle-desc">
                      {currentLesson.desc}
                    </Paragraph>
                  )}
                  <div className="gold-accent-divider" />
                </div>

                {/* KHU VỰC ĐỌC BÀI HỌC */}
                <Card bordered={false} className="lesson-content-card">
                  <div className="lesson-body-markdown">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>

                  <Divider
                    style={{
                      margin: screens.xs ? "30px 0" : "40px 0",
                      borderColor: "rgba(212, 175, 55, 0.2)",
                    }}
                  />

                  {/* NÚT XÁC NHẬN HOÀN THÀNH */}
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={
                      isCurrentLessonCompleted ? (
                        <CheckCircleFilled style={{ color: accentGold }} />
                      ) : null
                    }
                    disabled={isCurrentLessonCompleted}
                    onClick={handleMarkComplete}
                    className={`mark-complete-btn ${isCurrentLessonCompleted ? "is-completed" : ""}`}
                  >
                    {isCurrentLessonCompleted
                      ? "BẠN ĐÃ HOÀN THÀNH BÀI HỌC NÀY"
                      : "XÁC NHẬN HOÀN THÀNH BÀI HỌC"}
                  </Button>

                  {/* ĐIỀU HƯỚNG DƯỚI BÀI HỌC */}
                  <div className="lesson-navigation-footer">
                    <Button
                      size={screens.xs ? "default" : "large"}
                      icon={<LeftOutlined />}
                      onClick={() => handleChangeLesson(currentLesson.id - 1)}
                      disabled={currentLesson.id === 1}
                      className="nav-btn-prev"
                    >
                      Bài trước
                    </Button>

                    <Button
                      size={screens.xs ? "default" : "large"}
                      type="primary"
                      disabled={
                        !isCurrentLessonCompleted ||
                        currentLesson.id === lessons.length
                      }
                      onClick={() => handleChangeLesson(currentLesson.id + 1)}
                      className="nav-btn-next"
                    >
                      Bài tiếp theo <RightOutlined />
                    </Button>
                  </div>

                  {!isCurrentLessonCompleted &&
                    currentLesson.id !== lessons.length && (
                      <div style={{ textAlign: "center", marginTop: 18 }}>
                        <Text
                          type="secondary"
                          style={{ fontSize: 13, color: "#64748b" }}
                        >
                          <LockFilled
                            style={{ marginRight: 6, color: accentGold }}
                          />
                          Nhấn "Xác nhận hoàn thành" để mở khóa bài tiếp theo.
                        </Text>
                      </div>
                    )}
                </Card>
              </div>
            )}
          </Content>
        </Layout>

        {/* DRAWER CHO MOBILE */}
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
          width={300}
        >
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: "0 0 20px 0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text style={{ fontSize: 12, color: "#64748b" }}>
                  Tiến độ học tập
                </Text>
                <Text strong style={{ color: primaryNavy }}>
                  {progressPercent}%
                </Text>
              </div>
              <Progress
                percent={progressPercent}
                strokeColor={accentGold}
                showInfo={false}
              />
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              <Menu
                mode="inline"
                selectedKeys={[selectedKey]}
                items={menuItems}
                style={{ border: "none" }}
              />
            </div>
          </div>
        </Drawer>
      </Layout>

      {/* STYLES SCOPED */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

        .fade-in-up { animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .sider-tag-sub {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: ${accentGold};
          font-weight: 700;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .glhn-mobile-header {
          background: #ffffff;
          padding: 0 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(212, 175, 55, 0.25);
          box-shadow: 0 4px 12px rgba(27, 54, 93, 0.05);
        }

        .lesson-badge-tag {
          background: rgba(212, 175, 55, 0.15) !important;
          border: 1px solid ${accentGold} !important;
          color: ${primaryNavy} !important;
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
          margin: 0 0 10px 0 !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
        }

        .lesson-subtitle-desc {
          color: #64748b !important;
          font-size: 15px !important;
          max-width: 650px;
          margin: 0 auto 16px auto !important;
        }

        .gold-accent-divider {
          width: 60px;
          height: 3px;
          background: ${accentGold};
          margin: 0 auto;
          border-radius: 2px;
        }

        .lesson-content-card { 
          border-radius: 20px !important; 
          box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
          border: 1px solid rgba(212, 175, 55, 0.2) !important;
          background: #ffffff !important;
          padding: ${screens.xs ? "12px" : "28px"};
        }

        /* Markdown Formatting */
        .lesson-body-markdown { 
          font-size: 17px; 
          line-height: 1.85; 
          color: ${textDark}; 
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .lesson-body-markdown h1, .lesson-body-markdown h2, .lesson-body-markdown h3 { 
          font-family: 'Playfair Display', Georgia, serif;
          color: ${primaryNavy}; 
          margin-top: 32px; 
          font-weight: 700; 
        }

        .lesson-body-markdown h1 { font-size: 24px; border-bottom: 1px solid rgba(212, 175, 55, 0.3); padding-bottom: 8px; }
        .lesson-body-markdown h2 { font-size: 21px; border-bottom: 1px solid rgba(212, 175, 55, 0.3); padding-bottom: 6px; }
        .lesson-body-markdown h3 { font-size: 18px; }
        .lesson-body-markdown p { margin-bottom: 18px; text-align: justify; }

        .lesson-body-markdown blockquote { 
          border-left: 4px solid ${accentGold}; 
          background: ${softBg};
          padding: 12px 20px; 
          font-style: italic; 
          color: #475569;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }

        /* Nút hoàn thành */
        .mark-complete-btn {
          height: 52px !important;
          background: ${primaryNavy} !important;
          border-color: ${primaryNavy} !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          box-shadow: 0 6px 20px rgba(27, 54, 93, 0.2);
          transition: all 0.3s ease;
        }

        .mark-complete-btn:hover {
          background: #132744 !important;
        }

        .mark-complete-btn.is-completed {
          background: ${softBg} !important;
          border: 1px solid rgba(212, 175, 55, 0.3) !important;
          color: ${primaryNavy} !important;
          box-shadow: none !important;
        }

        /* Điều hướng bài học */
        .lesson-navigation-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          gap: 16px;
        }

        .nav-btn-prev {
          border-color: rgba(27, 54, 93, 0.2) !important;
          color: ${primaryNavy} !important;
          font-weight: 600;
          border-radius: 8px;
          height: 42px;
        }

        .nav-btn-next {
          background: ${primaryNavy} !important;
          color: #ffffff !important;
          font-weight: 600;
          border-radius: 8px;
          height: 42px;
        }

        .nav-btn-next:hover {
          background: #132744 !important;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(212, 175, 55, 0.3); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${accentGold}; }

        @media (max-width: 768px) {
          .lesson-body-markdown { font-size: 15px; line-height: 1.7; }
          .lesson-body-markdown h1 { font-size: 20px; }
          .lesson-body-markdown h2 { font-size: 18px; }
          .lesson-body-markdown h3 { font-size: 16px; }
          .lesson-navigation-footer { flex-direction: column; }
          .nav-btn-prev, .nav-btn-next { width: 100%; }
        }
      `,
        }}
      />
    </ConfigProvider>
  );
}
