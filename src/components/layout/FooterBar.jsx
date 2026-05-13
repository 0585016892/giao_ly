import React from 'react';
import { Layout, Row, Col, Typography, Space, Divider, Button, ConfigProvider } from 'antd';
import { 
  FacebookFilled, 
  YoutubeFilled, 
  MailOutlined, 
  EnvironmentOutlined, 
  PhoneOutlined,
  HeartFilled
} from '@ant-design/icons';

const { Footer } = Layout;
const { Text, Title } = Typography;

const FooterBar = () => {
  const primaryColor = '#b39164'; 
  const deepBrown = '#3e2723';   

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryColor,
        },
      }}
    >
      <Footer className="glhn-footer-container">
        <div className="glhn-footer-content">
          <Row gutter={[32, 40]}>
            {/* CỘT 1: GIỚI THIỆU */}
            <Col xs={24} md={9} lg={10}>
              <Space align="center" className="glhn-footer-brand">
                <div className="glhn-footer-logo-box">
                  <HeartFilled style={{ color: deepBrown, fontSize: '18px' }} />
                </div>
                <Title level={4} style={{ color: '#fff', margin: 0, letterSpacing: '1px' }}>
                  GIÁO LÝ HÔN NHÂN
                </Title>
              </Space>
              <div style={{ marginTop: '20px' }}>
                <Text className="glhn-footer-quote">
                  "Sự gì Thiên Chúa đã phối hợp, loài người không được phân ly." (Mt 19,6)
                </Text>
                <Text className="glhn-footer-desc">
                  Chương trình được biên soạn nhằm đồng hành cùng các bạn trẻ chuẩn bị bước vào đời sống hôn nhân 
                  với nền tảng đức tin vững vàng và tình yêu Kitô giáo.
                </Text>
              </div>
            </Col>
            
            {/* CỘT 2: LIÊN HỆ */}
            <Col xs={24} sm={12} md={8} lg={7}>
              <Title level={5} className="glhn-footer-section-title">
                Văn phòng Giáo xứ
              </Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div className="glhn-contact-item">
                  <EnvironmentOutlined className="glhn-icon" />
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>Giáo xứ Đồng Quan, Xã Vũ Quý, Kiến Xương, Thái Bình</Text>
                </div>
                <div className="glhn-contact-item">
                  <PhoneOutlined className="glhn-icon" />
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>033.604.1807 (Admin)</Text>
                </div>
                <div className="glhn-contact-item">
                  <MailOutlined className="glhn-icon" />
                  <Text style={{ color: 'rgba(255,255,255,0.8)' }}>tranhung6829@gmail.com</Text>
                </div>
              </Space>
            </Col>

            {/* CỘT 3: KẾT NỐI */}
            <Col xs={24} sm={12} md={7} lg={7} className="glhn-social-col">
              <Title level={5} className="glhn-footer-section-title">
                Kết nối cộng đoàn
              </Title>
              <Space size="middle">
                <Button 
                  className="glhn-social-btn"
                  icon={<FacebookFilled />} 
                  shape="circle"
                  size="large"
                />
                <Button 
                  className="glhn-social-btn"
                  icon={<YoutubeFilled />} 
                  shape="circle"
                  size="large"
                />
              </Space>
              <div style={{ marginTop: '25px' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'block' }}>
                  Ứng dụng hỗ trợ học tập trực tuyến <br /> Giáo xứ Đồng Quan
                </Text>
              </div>
            </Col>
          </Row>

          <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '40px 0 25px' }} />
          
          <div className="glhn-footer-bottom">
            <Text className="glhn-copyright">
              © 2026 GIÁO XỨ ĐỒNG QUAN - Ban Mục vụ Gia đình
            </Text>
            <Space className="glhn-footer-links" split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.2)' }} />}>
              <a href="#terms" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Điều khoản</a>
              <a href="#guide" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Hướng dẫn học</a>
            </Space>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .glhn-footer-container {
            background-color: ${deepBrown} !important;
            padding: 60px 20px 30px !important;
            margin-top: 60px;
          }

          .glhn-footer-content {
            max-width: 1200px;
            margin: 0 auto;
          }

          .glhn-footer-logo-box {
            background: ${primaryColor};
            padding: 8px;
            border-radius: 8px;
            display: flex;
            align-items: center;
          }

          .glhn-footer-quote {
            color: rgba(255,255,255,0.7);
            font-style: italic;
            display: block;
            margin-bottom: 12px;
            font-size: 14px;
          }

          .glhn-footer-desc {
            color: rgba(255,255,255,0.5);
            font-size: 13px;
            line-height: 1.6;
            display: block;
          }

          .glhn-footer-section-title {
            color: ${primaryColor} !important;
            margin-bottom: 24px !important;
            text-transform: uppercase;
            font-size: 14px !important;
            letter-spacing: 1px;
          }

          .glhn-contact-item {
            display: flex;
            gap: 12px;
            align-items: flex-start;
          }

          .glhn-icon {
            color: ${primaryColor};
            margin-top: 4px;
          }

          .glhn-social-btn {
            background: rgba(255,255,255,0.1) !important;
            border: none !important;
            color: #fff !important;
            transition: all 0.3s ease !important;
          }

          .glhn-social-btn:hover {
            background: ${primaryColor} !important;
            color: ${deepBrown} !important;
            transform: translateY(-3px);
          }

          .glhn-footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 15px;
          }

          .glhn-copyright {
            color: rgba(255,255,255,0.4);
            font-size: 13px;
          }

          /* RESPONSIVE */
          @media (max-width: 768px) {
            .glhn-footer-container { padding: 40px 16px 20px !important; }
            .glhn-footer-brand { justify-content: center; }
            .glhn-footer-quote, .glhn-footer-desc { text-align: center; }
            .glhn-social-col { text-align: center; }
            .glhn-footer-section-title { text-align: center; }
            .glhn-footer-bottom { justify-content: center; text-align: center; flex-direction: column-reverse; }
            .glhn-contact-item { justify-content: flex-start; }
          }
        `}} />
      </Footer>
    </ConfigProvider>
  );
};

export default FooterBar;