import React from 'react';
import { Result, Button, Typography, ConfigProvider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CompassOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const NotFound = () => {
  const navigate = useNavigate();
  const primaryGold = "#8c734b";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryGold,
        },
      }}
    >
      <div className="glhn-404-wrapper">
        <Result
          status="404"
          icon={
            <div className="glhn-404-icon">
              <CompassOutlined spin style={{ fontSize: '100px', color: primaryGold }} />
            </div>
          }
          title={
            <Title level={1} style={{ color: '#5d4037', marginBottom: 0 }}>
              404
            </Title>
          }
          subTitle={
            <div style={{ marginTop: '15px' }}>
              <Title level={4} style={{ color: '#8c734b', fontWeight: 400 }}>
                Dường như bạn đã lạc mất lối đi?
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển dời. <br />
                Đừng lo lắng, hãy để chúng tôi dẫn bạn quay lại hành trình.
              </Text>
            </div>
          }
          extra={[
            <Button 
              type="primary" 
              key="home" 
              size="large"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
              style={{ height: '50px', padding: '0 30px', borderRadius: '25px', fontWeight: 600 }}
            >
              QUAY VỀ TRANG CHỦ
            </Button>
          ]}
        />

        <style dangerouslySetInnerHTML={{ __html: `
          .glhn-404-wrapper {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #fcfaf2;
            padding: 20px;
            text-align: center;
          }
          .glhn-404-icon {
            margin-bottom: 24px;
            animation: float 3s ease-in-out infinite;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .ant-result-title { line-height: 1 !important; }
        `}} />
      </div>
    </ConfigProvider>
  );
};

export default NotFound;