import React from 'react';
import { 
  Layout, Typography, Card, Form, Input, Button, 
  Space, Row, Col, ConfigProvider, Divider, message 
} from 'antd';
import { 
  MailOutlined, PhoneOutlined, EnvironmentOutlined, 
  SendOutlined, FacebookFilled, YoutubeFilled,
   CustomerServiceOutlined
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Thông tin gửi đi:', values);
    message.success('Cảm ơn bạn! Tin nhắn đã được gửi thành công.');
    form.resetFields();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8c734b',
          borderRadius: 16,
        },
      }}
    >
      {/* Sửa từ <div> thành <Layout> ở đây để khớp với thẻ đóng */}
      <Layout className="pcv2-layout-root">
        <Content className="pcv2-page-wrapper">
          <div className="pcv2-content-container">
            
            {/* HEADER SECTION */}
            <div className="pcv2-header-box">
              <div className="pcv2-status-badge">
                <CustomerServiceOutlined /> LIÊN HỆ & TRỢ GIÚP
              </div>
              <Title level={1} className="pcv2-main-heading">
                Gắn Kết & Sẻ Chia
              </Title>
              <Paragraph className="pcv2-lead-text">
                Mọi thắc mắc về khóa học hoặc cần hỗ trợ kỹ thuật, xin đừng ngần ngại để lại lời nhắn. 
                Ban hành giáo sẽ phản hồi bạn sớm nhất qua email.
              </Paragraph>
            </div>

            <Row gutter={[32, 32]} className="pcv2-main-row">
              {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
              <Col xs={24} lg={9}>
                <div className="pcv2-sidebar-info">
                  <div className="pcv2-info-list">
                    <ContactDetailItem 
                      icon={<EnvironmentOutlined />} 
                      label="Văn phòng" 
                      value="Ban hành giáo Giáo xứ" 
                    />
                    <ContactDetailItem 
                      icon={<PhoneOutlined />} 
                      label="Hotline" 
                      value="093 384 84 83" 
                    />
                    <ContactDetailItem 
                      icon={<MailOutlined />} 
                      label="Email" 
                      value="dongquan@thaibinhdiocese.org" 
                    />
                  </div>

                  <Card className="pcv2-hours-card" bordered={false}>
                    <Title level={5} className="pcv2-card-title">Giờ tiếp chuyện</Title>
                    <div className="pcv2-hour-row">
                      <span>Thứ 2 - Thứ 7:</span> <strong>08:00 - 17:00</strong>
                    </div>
                    <div className="pcv2-hour-row">
                      <span>Chúa Nhật:</span> <strong>Nghỉ lễ</strong>
                    </div>
                  </Card>

                  <div className="pcv2-social-section">
                    <Divider plain><Text type="secondary" style={{ fontSize: 11 }}>KẾT NỐI MẠNG XÃ HỘI</Text></Divider>
                    <Space size={15} className="pcv2-social-icons">
                      {/* Nút Facebook */}
                      <a 
                        href="https://www.facebook.com/profile.php?id=100077253045004" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button 
                          shape="circle" 
                          icon={<FacebookFilled />} 
                          className="pcv2-social-btn pcv2-fb" 
                        />
                      </a>

                      {/* Nút Youtube */}
                      <a 
                        href="https://www.youtube.com/@xuanthuongstudio" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button 
                          shape="circle" 
                          icon={<YoutubeFilled />} 
                          className="pcv2-social-btn pcv2-yt" 
                        />
                      </a>
                    </Space>
                  </div>
                </div>
              </Col>

              {/* CỘT PHẢI: FORM GỬI TIN */}
              <Col xs={24} lg={15}>
                <Card bordered={false} className="pcv2-form-glass">
                  <div className="pcv2-form-header">
                    <Title level={3} style={{ margin: 0 }}>Gửi lời nhắn</Title>
                    <Text type="secondary">Vui lòng điền đầy đủ các thông tin bên dưới</Text>
                  </div>
                  
                  <Form 
                    form={form}
                    layout="vertical" 
                    onFinish={onFinish} 
                    requiredMark={false}
                    size="large"
                  >
                    <Row gutter={16}>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          label="Họ và tên" 
                          name="name"
                          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        >
                          <Input className="pcv2-input" placeholder="Nguyễn Văn A" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          label="Email" 
                          name="email"
                          rules={[
                            { required: true, message: 'Vui lòng nhập Email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                          ]}
                        >
                          <Input className="pcv2-input" placeholder="email@example.com" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="Chủ đề bạn quan tâm" name="subject">
                      <Input className="pcv2-input" placeholder="Góp ý bài học, kỹ thuật..." />
                    </Form.Item>

                    <Form.Item 
                      label="Nội dung" 
                      name="message"
                      rules={[{ required: true, message: 'Vui lòng nhập lời nhắn' }]}
                    >
                      <TextArea rows={5} className="pcv2-input" placeholder="Viết tin nhắn của bạn tại đây..." />
                    </Form.Item>

                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      icon={<SendOutlined />} 
                      block 
                      className="pcv2-btn-submit"
                    >
                      GỬI TIN NHẮN NGAY
                    </Button>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        <style dangerouslySetInnerHTML={{ __html: `
          .pcv2-layout-root { background: #fdfbf7; min-height: 100vh; }
          .pcv2-page-wrapper { padding: 70px 24px; }
          .pcv2-content-container { max-width: 1100px; margin: 0 auto; }
          .pcv2-header-box { text-align: center; margin-bottom: 50px; }
          .pcv2-status-badge { 
            display: inline-flex; align-items: center; gap: 8px;
            background: #fdfaf3; color: #8c734b; padding: 6px 18px;
            border-radius: 100px; font-size: 11px; font-weight: 700;
            border: 1px solid #eaddca; letter-spacing: 1px;
          }
          .pcv2-main-heading { font-size: 42px !important; font-weight: 850 !important; color: #262626 !important; margin: 12px 0 !important; }
          .pcv2-lead-text { font-size: 16px; color: #7a7a7a; max-width: 650px; margin: 0 auto !important; }
          .pcv2-info-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
          .pcv2-detail-card { 
            background: #fff; padding: 18px; border-radius: 16px;
            display: flex; align-items: center; gap: 16px;
            border: 1px solid #f0f0f0; transition: 0.3s;
          }
          .pcv2-detail-card:hover { transform: translateX(5px); border-color: #8c734b; }
          .pcv2-icon-wrap { 
            width: 48px; height: 48px; background: #8c734b; color: #fff;
            display: flex; align-items: center; justify-content: center;
            border-radius: 12px; font-size: 20px;
          }
          .pcv2-hours-card { background: #fdfcf9; border: 1px dashed #d9c8a9 !important; border-radius: 16px; }
          .pcv2-card-title { color: #8c734b !important; margin-bottom: 12px !important; }
          .pcv2-hour-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
          .pcv2-form-glass { 
            background: #fff; border-radius: 24px; padding: 30px;
            box-shadow: 0 15px 35px rgba(140, 115, 75, 0.06);
            border: 1px solid #f0f0f0;
          }
          .pcv2-form-header { margin-bottom: 30px; }
          .pcv2-input { border-radius: 10px !important; background: #fafafa !important; }
          .pcv2-input:focus { background: #fff !important; border-color: #8c734b !important; }
          .pcv2-btn-submit { 
            height: 55px !important; font-weight: 700 !important;
            box-shadow: 0 10px 20px rgba(140, 115, 75, 0.2) !important;
            margin-top: 10px; border-radius: 12px !important;
          }
          .pcv2-social-section { margin-top: 30px; text-align: center; }
          .pcv2-social-btn { font-size: 20px; width: 45px; height: 45px; border: none !important; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          .pcv2-fb { color: #1877f2 !important; }
          .pcv2-yt { color: #ff0000 !important; }
          @media (max-width: 768px) {
            .pcv2-page-wrapper { padding: 40px 16px; }
            .pcv2-main-heading { font-size: 32px !important; }
          }
        `}} />
      </Layout>
    </ConfigProvider>
  );
};

const ContactDetailItem = ({ icon, label, value }) => (
  <div className="pcv2-detail-card">
    <div className="pcv2-icon-wrap">{icon}</div>
    <div>
      <div style={{ fontSize: '11px', color: '#999', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '15px', fontWeight: 600 }}>{value}</div>
    </div>
  </div>
);

export default ContactPage;