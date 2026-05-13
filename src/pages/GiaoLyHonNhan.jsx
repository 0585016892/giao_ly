import React, { useState, useMemo } from "react";
import {
  Layout, Menu, Typography, Button, 
  Space, ConfigProvider, Divider, Drawer, theme, Grid, Card
} from "antd";
import {
  MenuOutlined, ReadOutlined, BookOutlined,
  LeftOutlined, RightOutlined
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import lessonsHonnhan from '../api/lessionhonnhan';

const { Content, Sider, Header } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

export default function GiaoLyPremium() {
  const [selectedKey, setSelectedKey] = useState("1");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  const currentLesson = useMemo(
    () => lessonsHonnhan.find((l) => l.id.toString() === selectedKey),
    [selectedKey]
  );

  const handleChangeLesson = (id) => {
    setSelectedKey(id.toString());
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Menu items tối giản chỉ gồm Icon và Tiêu đề
  const menuItems = lessonsHonnhan.map((lesson) => ({
    key: lesson.id.toString(),
    icon: <BookOutlined />,
    label: (
      <Text strong={selectedKey === lesson.id.toString()} style={{ fontSize: '14px' }}>
        {lesson.id}. {lesson.title}
      </Text>
    ),
    onClick: () => handleChangeLesson(lesson.id),
  }));

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#8c734b",
          borderRadius: 8,
          colorBgLayout: "#fdfbf7", // Màu nền hơi ngả vàng giấy cho sang
        }
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        
        {/* SIDEBAR - CHỈ LÀ MỤC LỤC */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          width={300}
          theme="light"
          style={{
            height: '100vh',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: screens.lg ? 'block' : 'none',
            borderRight: '1px solid #eaddca',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header Sidebar: Chỉ để tiêu đề */}
            <div style={{ padding: "40px 24px 20px" }}>
              <Title level={4} style={{ margin: 0, color: '#8c734b', letterSpacing: '1px' }}>
                MỤC LỤC
              </Title>
              <Text type="secondary" style={{ fontSize: 12 }}>{lessonsHonnhan.length} bài học giáo lý</Text>
              <Divider style={{ margin: '20px 0 0 0' }} />
            </div>
            
            {/* Danh sách bài học cuộn độc lập */}
            <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
              <Menu 
                mode="inline" 
                selectedKeys={[selectedKey]} 
                items={menuItems} 
                style={{ borderRight: 0 }} 
              />
            </div>

            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 11, opacity: 0.6 }}>Giáo xứ Đồng Quan</Text>
            </div>
          </div>
        </Sider>

        <Layout>
          {/* MOBILE HEADER */}
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
              borderBottom: '1px solid #eaddca'
            }}>
              <Space>
                <ReadOutlined style={{ color: '#8c734b' }} />
                <Text strong>BÀI {selectedKey}</Text>
              </Space>
              <Button icon={<MenuOutlined />} type="text" onClick={() => setIsDrawerOpen(true)} />
            </Header>
          )}

          <Content style={{ 
            padding: screens.xs ? "30px 15px" : "50px 40px", 
            maxWidth: 850, 
            margin: "0 auto", 
            width: "100%" 
          }}>
            {currentLesson && (
              <div className="fade-in-up">
                <div style={{ marginBottom: 40, textAlign: 'center' }}>
                  <Text style={{ color: '#8c734b', fontWeight: 600, letterSpacing: 2 }}>BÀI HỌC {currentLesson.id}</Text>
                  <Title level={screens.xs ? 2 : 1} style={{ marginTop: 8, color: '#262626' }}>
                    {currentLesson.title}
                  </Title>
                  <Divider style={{ width: 60, minWidth: 60, margin: '20px auto', borderTop: '3px solid #8c734b' }} />
                </div>

                <Card bordered={false} className="main-content-card">
                  <div className="lesson-body">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>

                  <Divider style={{ margin: "60px 0 30px" }} />

                  {/* Điều hướng đơn giản */}
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button
                      type="link"
                      icon={<LeftOutlined />}
                      onClick={() => handleChangeLesson(parseInt(selectedKey) - 1)}
                      disabled={selectedKey === "1"}
                      style={{ color: '#8c734b' }}
                    >
                      Bài trước
                    </Button>
                    
                    <Button
                      type="link"
                      onClick={() => handleChangeLesson(parseInt(selectedKey) + 1)}
                      disabled={parseInt(selectedKey) === lessonsHonnhan.length}
                      style={{ color: '#8c734b' }}
                    >
                      Bài tiếp theo <RightOutlined />
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </Content>
        </Layout>

        {/* DRAWER MOBILE */}
        <Drawer
          title="DANH MỤC BÀI HỌC"
          placement="left"
          onClose={() => setIsDrawerOpen(false)}
          open={isDrawerOpen}
          width={280}
        >
          <Menu mode="inline" selectedKeys={[selectedKey]} items={menuItems} style={{ border: 'none' }} />
        </Drawer>
      </Layout>

      <style dangerouslySetInnerHTML={{ __html: `
        .fade-in-up { animation: fadeInUp 0.6s ease-out; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .main-content-card { 
          border-radius: 16px; 
          box-shadow: 0 4px 20px rgba(140, 115, 75, 0.05);
          padding: ${screens.xs ? '5px' : '20px'};
        }

        .lesson-body { font-size: 18px; line-height: 1.8; color: #434343; }
        .lesson-body h2 { color: #8c734b; margin-top: 40px; border-bottom: 1px solid #f0eada; padding-bottom: 10px; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eaddca; border-radius: 10px; }

        .ant-menu-item-selected {
          background-color: #fdfaf3 !important;
          color: #8c734b !important;
          border-radius: 8px !important;
        }
      `}} />
    </ConfigProvider>
  );
}