import React, { useState, useEffect, useMemo } from "react";
import {
  Layout, Menu, Typography, Button, Progress, 
  Space, Tag, ConfigProvider, Divider, Drawer, theme, Grid, Card, Avatar
} from "antd";
import {
  CheckCircleFilled, LockFilled, LeftOutlined, 
  RightOutlined, SafetyCertificateFilled, MenuOutlined,
  ReadOutlined, BookOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import lessons from '../api/lession'; // Đảm bảo đường dẫn này đúng với project của bạn

const { Content, Sider, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function GiaoLyPremium() {
  const [selectedKey, setSelectedKey] = useState("1");
  const [completed, setCompleted] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  useEffect(() => {
    const saved = localStorage.getItem("giaoly_progress");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const progressPercent = Math.round((completed.length / lessons.length) * 100);

  const currentLesson = useMemo(
    () => lessons.find((l) => l.id.toString() === selectedKey),
    [selectedKey]
  );

  const isCurrentLessonCompleted = completed.includes(currentLesson?.id);

  const handleChangeLesson = (id) => {
    const targetIndex = lessons.findIndex(l => l.id === id);
    if (targetIndex > 0) {
      const previousLessonId = lessons[targetIndex - 1].id;
      if (!completed.includes(previousLessonId)) return; 
    }
    setSelectedKey(id.toString());
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkComplete = () => {
    if (!completed.includes(currentLesson.id)) {
      const newCompleted = [...completed, currentLesson.id];
      setCompleted(newCompleted);
      localStorage.setItem("giaoly_progress", JSON.stringify(newCompleted));
    }
  };

  const menuItems = lessons.map((lesson, index) => {
    const isLocked = index > 0 && !completed.includes(lessons[index - 1].id);
    const isSelected = selectedKey === lesson.id.toString();
    
    return {
      key: lesson.id.toString(),
      disabled: isLocked,
      icon: completed.includes(lesson.id) ? (
        <CheckCircleFilled style={{ color: token.colorSuccess }} />
      ) : isLocked ? (
        <LockFilled style={{ opacity: 0.4 }} />
      ) : <BookOutlined />,
      label: (
        <div style={{ padding: '4px 0' }}>
          <Text strong={isSelected} delete={completed.includes(lesson.id) && !isSelected} 
                style={{ fontSize: '13px', color: isLocked ? '#bfbfbf' : 'inherit' }}>
            {lesson.title}
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
          colorPrimary: "#8c734b",
          borderRadius: 12,
          colorBgLayout: "#f8f9fa",
        }
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        
        {/* SIDEBAR DESKTOP - FIX CUỘN ĐỘC LẬP */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={320}
          theme="light"
          style={{
            height: '100vh',
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 100,
            display: screens.lg ? 'block' : 'none',
            borderRight: '1px solid #f2eee8',
            backgroundColor: '#fff'
          }}
        >
          {/* Container dùng Flexbox để chia phần Header và Menu */}
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* 1. Phần Header Sidebar: Cố định ở trên */}
            <div style={{ padding: "32px 24px 16px", flexShrink: 0 }}>
              <Space size={12} style={{ marginBottom: 24 }}>
                <Avatar shape="square" icon={<SafetyCertificateFilled />} style={{ backgroundColor: '#8c734b' }} />
                <Title level={5} style={{ margin: 0, letterSpacing: '-0.5px' }}>GIÁO LÝ HÔN NHÂN</Title>
              </Space>

              <Card size="small" style={{ background: '#fdfcfb', borderRadius: 12, border: '1px solid #f0e6cc' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>TIẾN ĐỘ HOÀN THÀNH</Text>
                  <Text strong style={{ color: '#8c734b', fontSize: 11 }}>{progressPercent}%</Text>
                </div>
                <Progress percent={progressPercent} strokeColor="#8c734b" size="small" showInfo={false} />
              </Card>
              <Divider style={{ margin: '20px 0 0 0' }} />
            </div>
            
            {/* 2. Phần Menu: Cuộn độc lập khi quá dài */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              <Menu 
                mode="inline" 
                selectedKeys={[selectedKey]} 
                items={menuItems} 
                style={{ borderRight: 0 }} 
              />
            </div>

            {/* 3. Phần Footer Sidebar (Tùy chọn) */}
            <div style={{ padding: '15px', textAlign: 'center', borderTop: '1px solid #f2eee8' }}>
                <Text type="secondary" style={{ fontSize: 10 }}>© 2026 Giáo xứ Đồng Quan</Text>
            </div>
          </div>
        </Sider>

        <Layout>
          {/* HEADER MOBILE */}
          {!screens.lg && (
            <Header style={{ 
              background: "#fff", 
              padding: '0 20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              position: 'sticky', 
              top: 0, 
              zIndex: 1000, 
              borderBottom: '1px solid #f2eee8',
              height: '64px'
            }}>
              <Space>
                <ReadOutlined style={{ color: '#8c734b' }} />
                <Title level={5} style={{ margin: 0 }}>BÀI {selectedKey}</Title>
              </Space>
              <Button icon={<MenuOutlined />} type="text" onClick={() => setIsDrawerOpen(true)} />
            </Header>
          )}

          <Content style={{ 
            padding: screens.xs ? "24px 16px" : "40px 60px", 
            maxWidth: 900, 
            margin: "0 auto", 
            width: "100%",
            backgroundColor: '#f8f9fa' 
          }}>
            {currentLesson && (
              <div className="fade-in-up">
                <div style={{ marginBottom: 32 }}>
                  <Tag color="gold" style={{ padding: '2px 12px', borderRadius: 20 }}>{currentLesson.tag}</Tag>
                  <Title level={screens.xs ? 3 : 1} style={{ marginTop: 16, color: '#4a3728' }}>
                    {currentLesson.id}. {currentLesson.title}
                  </Title>
                  <Paragraph style={{ fontSize: 16, color: '#7a7a7a' }}>{currentLesson.desc}</Paragraph>
                </div>

                <Card bordered={false} className="main-content-card" style={{ padding: screens.xs ? '10px' : '30px' }}>
                  <div className="lesson-body">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>

                  <Divider style={{ margin: "50px 0" }} />

                  {/* NÚT HOÀN THÀNH */}
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={isCurrentLessonCompleted ? <CheckCircleFilled /> : null}
                    disabled={isCurrentLessonCompleted}
                    onClick={handleMarkComplete}
                    style={{ 
                      height: 60, 
                      borderRadius: 15, 
                      fontWeight: 700, 
                      fontSize: 16,
                      boxShadow: isCurrentLessonCompleted ? 'none' : '0 8px 20px rgba(140, 115, 75, 0.2)'
                    }}
                  >
                    {isCurrentLessonCompleted ? "BẠN ĐÃ HOÀN THÀNH BÀI NÀY" : "XÁC NHẬN HOÀN THÀNH BÀI HỌC"}
                  </Button>

                  {/* ĐIỀU HƯỚNG DƯỚI */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
                    <Button
                      size="large"
                      icon={<LeftOutlined />}
                      onClick={() => handleChangeLesson(currentLesson.id - 1)}
                      disabled={currentLesson.id === 1}
                      style={{ borderRadius: 10 }}
                    >
                      Bài trước
                    </Button>
                    
                    <Button
                      size="large"
                      type="primary"
                      ghost
                      disabled={!isCurrentLessonCompleted || currentLesson.id === lessons.length}
                      onClick={() => handleChangeLesson(currentLesson.id + 1)}
                      style={{ borderRadius: 10 }}
                    >
                      Bài tiếp theo <RightOutlined />
                    </Button>
                  </div>

                  {!isCurrentLessonCompleted && currentLesson.id !== lessons.length && (
                    <div style={{ textAlign: 'center', marginTop: 20 }}>
                      <Text type="danger" style={{ fontSize: 13 }}>
                        <LockFilled style={{ marginRight: 6 }} /> 
                        Bạn cần nhấn "Xác nhận hoàn thành" để mở khóa bài tiếp theo.
                      </Text>
                    </div>
                  )}
                </Card>
              </div>
            )}
          </Content>
        </Layout>

        {/* DRAWER MOBILE */}
        <Drawer
          title={<Title level={5} style={{ margin: 0 }}>DANH MỤC BÀI HỌC</Title>}
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={300}
          bodyStyle={{ padding: '10px' }}
        >
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 10px 20px' }}>
                <Text size="small" type="secondary">Tiến độ: {progressPercent}%</Text>
                <Progress percent={progressPercent} strokeColor="#8c734b" status="active" />
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <Menu mode="inline" selectedKeys={[selectedKey]} items={menuItems} style={{ border: 'none' }} />
            </div>
          </div>
        </Drawer>
      </Layout>

      <style dangerouslySetInnerHTML={{ __html: `
        /* Hiệu ứng xuất hiện */
        .fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Card nội dung chính */
        .main-content-card { 
          border-radius: 24px; 
          box-shadow: 0 10px 40px rgba(0,0,0,0.04);
          border: 1px solid #f0f0f0;
        }

        /* Định dạng văn bản Markdown */
        .lesson-body { font-size: 17px; line-height: 1.9; color: #3c3c3c; }
        .lesson-body h1, .lesson-body h2, .lesson-body h3 { color: #8c734b; margin-top: 32px; font-weight: 700; }
        .lesson-body p { margin-bottom: 20px; }
        .lesson-body blockquote { 
          border-left: 4px solid #8c734b; 
          padding-left: 20px; 
          font-style: italic; 
          color: #666;
          margin: 30px 0;
        }
        
        /* Tối ưu thanh cuộn Sidebar */
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e0d7c6; 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #8c734b; }

        /* Chỉnh Menu Ant Design cho sang hơn */
        .ant-menu-item-selected {
          background-color: #f9f6f0 !important;
          color: #8c734b !important;
        }
        .ant-menu-item:active { background-color: #f0eada; }
      `}} />
    </ConfigProvider>
  );
}