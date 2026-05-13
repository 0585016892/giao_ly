import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Button, Drawer, ConfigProvider } from 'antd';
import { 
  HomeOutlined, 
  ReadOutlined, 
  CloudDownloadOutlined, 
  MessageOutlined,
  HeartOutlined,
  MenuOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobileMenu, setOpenMobileMenu] = useState(false);
  
  const primaryColor = '#b39164'; 
  const textColor = '#5d4037';   

  const menuItems = [
    { key: '/', icon: <HomeOutlined />, label: 'TRANG CHỦ' },
    { key: '/courses', icon: <ReadOutlined />, label: 'LỘ TRÌNH HỌC' },
    { key: '/prayers', icon: <HeartOutlined />, label: 'KINH NGUYỆN' },
    { key: '/docs', icon: <CloudDownloadOutlined />, label: 'KHO TÀI LIỆU' },
  ];

  const handleMenuClick = (e) => {
    navigate(e.key);
    setOpenMobileMenu(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
          borderRadius: 8,
        },
      }}
    >
      <div className="glhn-header-wrapper">
        <Header className="glhn-custom-header">
          
          {/* LEFT: LOGO */}
          <div 
            className="glhn-logo-section"
            onClick={() => navigate('/')}
          >
            <Avatar 
              size={{ xs: 32, sm: 36, md: 40 }} 
              className="glhn-logo-avatar"
            >
              †
            </Avatar>
            <div className="glhn-logo-text">
              <Text className="glhn-main-title">
                GIÁO XỨ <span style={{ color: primaryColor }}>ĐỒNG QUAN</span>
              </Text>
              <Text className="glhn-sub-title">
                GIÁO LÝ HÔN NHÂN
              </Text>
            </div>
          </div>

          {/* CENTER: DESKTOP MENU */}
          <div className="glhn-desktop-menu-container">
            <Menu 
              mode="horizontal" 
              selectedKeys={[location.pathname]} 
              items={menuItems} 
              onClick={handleMenuClick} 
              className="glhn-header-menu"
            />
          </div>

          {/* RIGHT: ACTION BUTTON & MOBILE TOGGLE */}
          <div className="glhn-action-section">
            <Button 
              type="primary" 
              shape="round" 
              icon={<MessageOutlined />} 
              className="glhn-contact-btn"
              onClick={() => navigate('/contact')}
            >
              <span className="glhn-btn-text">LIÊN HỆ</span>
            </Button>

            {/* Hamburger Button */}
            <Button 
              type="text" 
              icon={<MenuOutlined style={{ fontSize: '20px' }} />} 
              className="glhn-mobile-menu-btn"
              onClick={() => setOpenMobileMenu(true)}
            />
          </div>

        </Header>

        {/* MOBILE DRAWER */}
        <Drawer
          title={<span style={{ color: textColor, fontWeight: 700 }}>DANH MỤC</span>}
          placement="right"
          onClose={() => setOpenMobileMenu(false)}
          open={openMobileMenu}
          width={280}
          closeIcon={<MenuOutlined />}
        >
          <Menu 
            mode="vertical" 
            selectedKeys={[location.pathname]} 
            items={menuItems} 
            onClick={handleMenuClick}
            style={{ borderRight: 'none' }}
          />
          <div style={{ marginTop: 24, padding: '0 16px' }}>
             <Button 
              type="primary" 
              block 
              shape="round"
              size="large"
              icon={<MessageOutlined />}
              onClick={() => { navigate('/contact'); setOpenMobileMenu(false); }}
            >
              LIÊN HỆ NGAY
            </Button>
          </div>
        </Drawer>

        <style dangerouslySetInnerHTML={{ __html: `
          .glhn-header-wrapper {
            position: sticky;
            top: 10px;
            z-index: 1000;
            display: flex;
            justify-content: center;
            padding: 0 12px;
            width: 100%;
          }

          .glhn-custom-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 0 20px;
            box-shadow: 0 8px 32px rgba(93, 64, 55, 0.08);
            height: 64px;
            width: 100%;
            max-width: 1200px;
            border-radius: 16px;
            border: 1px solid rgba(179, 145, 100, 0.2);
            transition: all 0.3s ease;
          }

          .glhn-logo-section { 
            display: flex; 
            align-items: center; 
            gap: 10px; 
            cursor: pointer; 
            flex-shrink: 0;
          }
          
          .glhn-logo-avatar { 
            border: 2px solid ${primaryColor}; 
            background: #fff; 
            color: ${primaryColor}; 
            font-weight: bold; 
          }

          .glhn-logo-text { display: flex; flex-direction: column; line-height: 1.2; }
          .glhn-main-title { font-size: 14px; font-weight: 800; color: ${textColor}; white-space: nowrap; }
          .glhn-sub-title { font-size: 9px; color: #8c7b6e; font-weight: 600; letter-spacing: 0.5px; }

          .glhn-desktop-menu-container { 
            flex: 1; 
            display: flex; 
            justify-content: center; 
            padding: 0 20px;
          }

          .glhn-header-menu { 
            border-bottom: none !important; 
            background: transparent !important; 
            line-height: 64px;
            width: 100%;
            display: flex;
            justify-content: center;
            font-size: 13px;
            font-weight: 600;
          }

          .glhn-action-section { display: flex; align-items: center; gap: 8px; }
          .glhn-mobile-menu-btn { display: none; color: ${textColor}; }

          /* RESPONSIVE */
          @media (max-width: 1024px) {
            .glhn-desktop-menu-container { display: none; }
            .glhn-mobile-menu-btn { display: flex; }
            .glhn-btn-text { display: none; }
            .glhn-contact-btn { width: 40px; padding: 0; display: flex; justify-content: center; align-items: center; }
          }

          @media (max-width: 576px) {
            .glhn-custom-header { padding: 0 12px; height: 56px; border-radius: 12px; }
            .glhn-main-title { font-size: 12px; }
            .glhn-sub-title { display: none; }
            .glhn-logo-section { gap: 8px; }
          }

          /* Ant Design Overrides */
          .glhn-header-menu .ant-menu-item {
            padding: 0 15px !important;
          }
          .glhn-header-menu .ant-menu-item-selected {
            color: ${primaryColor} !important;
          }
          .glhn-header-menu .ant-menu-item-selected::after {
            border-bottom-width: 3px !important;
            border-bottom-color: ${primaryColor} !important;
          }
        `}} />
      </div>
    </ConfigProvider>
  );
};

export default HeaderBar;