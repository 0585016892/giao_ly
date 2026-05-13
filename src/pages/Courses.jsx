import React, { useState, useMemo } from 'react';
import { 
  Layout, Menu, Typography,  Button, Progress, 
  Input, Space, Tag, ConfigProvider, Divider,
} from 'antd';
import { 
  CheckCircleFilled, LockFilled, SearchOutlined, 
  LeftOutlined, RightOutlined, SafetyCertificateFilled,
  MenuOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const lessons = [
  { 
    id: 1, 
    title: 'Loài người tìm kiếm Thiên Chúa', 
    tag: 'Chương I',
    content: '# 📖 LỜI CHÚA \n > "Từ một người, Thiên Chúa đã tạo thành toàn thể nhân loại..." \n\n # 🕊️ TRÌNH BÀY \n Con người luôn khao khát tìm gặp Thiên Chúa. \n\n # 💡 BÀI HỌC \n - Thiên Chúa là Đấng dựng nên trời đất. \n - Con người tìm kiếm Ngài qua thiên nhiên.' 
  },
  { 
    id: 2, 
    title: 'Thiên Chúa nói với loài người', 
    tag: 'Chương I',
    content: '# 📖 LỜI CHÚA \n > "Thiên Chúa cho ta được biết thiên ý nhiệm mầu..." \n\n # 🕊️ TRÌNH BÀY \n Thiên Chúa tỏ mình qua Thánh Kinh.' 
  },
];

const GiaoLyModern = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const [completed, setCompleted] = useState([1]);
  const [collapsed, setCollapsed] = useState(false);

  const currentLesson = useMemo(() => 
    lessons.find(l => l.id.toString() === selectedKey), 
  [selectedKey]);

  const progressPercent = Math.round((completed.length / lessons.length) * 100);

  const menuItems = lessons.map((lesson, index) => {
    const isLocked = index > 0 && !completed.includes(lessons[index-1].id);
    return {
      key: lesson.id.toString(),
      disabled: isLocked,
      label: (
        <div className="compact-menu-item">
          <Space size={10} align="start" style={{ width: '100%', padding: '4px 0' }}>
            {completed.includes(lesson.id) ? (
              <CheckCircleFilled style={{ color: '#52c41a', fontSize: 14, marginTop: 4 }} />
            ) : isLocked ? (
              <LockFilled style={{ opacity: 0.3, fontSize: 12, marginTop: 4 }} />
            ) : (
              <div style={{ width: 14 }} /> 
            )}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <span className="item-num">BÀI {lesson.id.toString().padStart(2, '0')}</span>
               <span className="item-title">{lesson.title}</span>
            </div>
          </Space>
        </div>
      ),
    };
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8c734b',
          borderRadius: 8,
          fontSize: 14,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#fdfdfb' }}>
        
        {/* Nút Menu cho Mobile */}
        <Button 
          className="mobile-menu-btn"
          icon={<MenuOutlined />} 
          onClick={() => setCollapsed(!collapsed)}
        />

        {/* SIDEBAR */}
        <Sider 
          width={300} 
          className="sidebar-clean" 
          theme="light" 
          breakpoint="lg" 
          collapsedWidth="0"
          trigger={null}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{
            height: '100vh',
            position: 'fixed',
            left: 0,
            zIndex: 1000,
          }}
        >
          <div className="sidebar-header">
            <Space align="center" style={{ marginBottom: 20 }}>
              <div className="brand-icon"><SafetyCertificateFilled /></div>
              <Title level={5} style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>GIÁO LÝ HÔN NHÂN</Title>
            </Space>
            
            <div className="progress-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text type="secondary" style={{ fontSize: 10, letterSpacing: '0.5px' }}>TIẾN ĐỘ CỦA BẠN</Text>
                <Text strong style={{ fontSize: 11 }}>{progressPercent}%</Text>
              </div>
              <Progress percent={progressPercent} size={[300, 4]} showInfo={false} strokeColor="#8c734b" />
            </div>

            <Input 
              className="search-box"
              placeholder="Tìm bài học..." 
              prefix={<SearchOutlined style={{ opacity: 0.4 }} />} 
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            onSelect={({ key }) => {
                setSelectedKey(key);
                if (window.innerWidth < 992) setCollapsed(true); // Tự động đóng menu trên mobile khi chọn bài
            }}
            items={menuItems}
            className="menu-flat custom-scrollbar"
            style={{ height: 'calc(100vh - 180px)', overflowY: 'auto', borderRight: 0 }}
          />
        </Sider>

        {/* CONTENT */}
        <Layout style={{ marginLeft: collapsed ? 0 : 300, transition: 'all 0.2s' }} className="content-layout">
          <Content className="main-content">
            <div className="reading-container">
              {currentLesson ? (
                <div className="lesson-body">
                  <div className="lesson-top-meta">
                    <Tag bordered={false} color="default" style={{ fontSize: 10, fontWeight: 700, padding: '0 8px' }}>{currentLesson.tag.toUpperCase()}</Tag>
                    <Title level={2} className="lesson-main-title">
                      {currentLesson.id}. {currentLesson.title}
                    </Title>
                  </div>

                  <div className="markdown-render">
                    <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                  </div>

                  <div className="footer-actions">
                    <Button 
                      type={completed.includes(currentLesson.id) ? "default" : "primary"}
                      icon={<CheckCircleFilled />}
                      block
                      onClick={() => {
                        if(!completed.includes(currentLesson.id)) setCompleted([...completed, currentLesson.id]);
                      }}
                      className="complete-btn"
                    >
                      {completed.includes(currentLesson.id) ? "Đã hoàn thành bài học" : "Đánh dấu hoàn thành"}
                    </Button>

                    <Divider style={{ margin: '32px 0' }} />

                    <div className="nav-buttons">
                      <Button 
                        type="text" 
                        icon={<LeftOutlined />} 
                        disabled={selectedKey === '1'}
                        onClick={() => setSelectedKey((parseInt(selectedKey)-1).toString())}
                      >
                        Trước
                      </Button>
                      <Button 
                        type="text" 
                        style={{ color: '#8c734b', fontWeight: 600 }}
                        disabled={parseInt(selectedKey) === lessons.length}
                        onClick={() => setSelectedKey((parseInt(selectedKey)+1).toString())}
                      >
                        Tiếp theo <RightOutlined />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </Content>
        </Layout>

        <style dangerouslySetInnerHTML={{ __html: `
          /* Mobile Button */
          .mobile-menu-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1001;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            background: #8c734b;
            color: white;
            border: none;
            box-shadow: 0 4px 12px rgba(140, 115, 75, 0.4);
            display: none;
          }

          /* Tinh chỉnh Menu */
          .ant-menu-title-content {
            overflow: visible !important;
            white-space: normal !important;
            line-height: 1.4 !important;
          }

          .ant-menu-item { 
            height: auto !important;
            padding: 12px !important;
            margin: 4px 12px !important;
            width: calc(100% - 24px) !important;
            border-radius: 8px !important;
          }

          .sidebar-clean { 
            box-shadow: 2px 0 8px rgba(0,0,0,0.02);
            border-right: 1px solid #f0f0f0;
          }
          .sidebar-header { padding: 24px 20px; }
          .brand-icon { background: #8c734b; color: #fff; width: 32px; height: 32px; display: flex; 
                        align-items: center; justify-content: center; border-radius: 8px; font-size: 18px; }
          .search-box { background: #f5f5f5; border: none; margin-top: 16px; border-radius: 8px; height: 36px; }
          
          .item-num { font-size: 9px; opacity: 0.5; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 2px; }
          .item-title { font-size: 13.5px; font-weight: 600; color: #262626; }

          .main-content { padding: 40px 20px; }
          .reading-container { max-width: 720px; margin: 0 auto; background: #fff; padding: 48px; 
                                border-radius: 16px; border: 1px solid #f0f0f0; }
          
          .lesson-main-title { margin-top: 12px; margin-bottom: 32px; font-size: 28px; fontWeight: 800; letter-spacing: -0.5px; }
          .markdown-render { font-size: 16px; line-height: 1.8; color: #333; }
          .markdown-render h1 { font-size: 18px; font-weight: 800; margin: 32px 0 16px; color: #8c734b; display: flex; align-items: center; }
          .markdown-render blockquote { margin: 24px 0; padding: 16px 24px; background: #fefaf2; border-left: 4px solid #8c734b; border-radius: 4px; font-style: italic; color: #555; }
          
          .complete-btn { height: 44px; font-weight: 600; font-size: 14px; margin-top: 20px; }
          .nav-buttons { display: flex; justify-content: space-between; }

          /* Scrollbar */
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #e8e8e8; border-radius: 10px; }

          /* RESPONSIVE QUERIES */
          @media (max-width: 992px) {
            .mobile-menu-btn { display: flex; align-items: center; justify-content: center; }
            .content-layout { margin-left: 0 !important; }
            .sidebar-clean { position: fixed; height: 100vh; }
            .main-content { padding: 20px 12px; }
            .reading-container { padding: 32px 20px; border-radius: 0; border: none; }
            .lesson-main-title { font-size: 24px; }
          }

          @media (max-width: 576px) {
            .reading-container { padding: 24px 16px; }
            .lesson-main-title { font-size: 22px; }
            .markdown-render { font-size: 15px; }
          }
        `}} />
      </Layout>
    </ConfigProvider>
  );
};

export default GiaoLyModern; 