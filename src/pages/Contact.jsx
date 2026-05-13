import React from 'react';
import { 
  Layout, Typography, Card, Form, Input, Button, 
  Space, Row, Col, ConfigProvider, Divider, message 
} from 'antd';
import { 
  MailOutlined, PhoneOutlined, EnvironmentOutlined, 
  SendOutlined, FacebookFilled, YoutubeFilled,
  MessageOutlined
} from '@ant-design/icons';

// Bóc tách các thành phần từ Layout và Typography một cách chính xác
const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Thông tin gửi đi:', values);
    message.success('Cảm ơn bạn! Tin nhắn đã được gửi thành công.');
    form.resetFields(); // Xóa sạch form sau khi gửi
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8c734b', // Màu vàng đồng chủ đạo của ứng dụng
          borderRadius: 10,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#fdfdfb' }}>
        <Content className="contact-wrapper">
          <div className="contact-container">
            
            {/* PHẦN ĐẦU TRANG */}
            <div className="contact-intro">
              <div className="contact-badge">
                <MessageOutlined /> CONTACT US
              </div>
              <Title level={1} className="contact-main-title">
                Liên Hệ & Góp Ý
              </Title>
              <Paragraph className="contact-subtitle">
                Chúng tôi luôn lắng nghe ý kiến từ bạn để hoàn thiện ứng dụng 
                và hỗ trợ cộng đoàn tốt hơn trong việc học Giáo lý.
              </Paragraph>
            </div>

            <Row gutter={[40, 40]} style={{ marginTop: 40 }}>
              {/* CỘT TRÁI: THÔNG TIN TRỰC TIẾP */}
              <Col xs={24} lg={10}>
                <div className="info-side">
                  <Space direction="vertical" size={24} style={{ width: '100%' }}>
                    
                    <Card bordered={false} className="contact-info-card">
                      <Space align="start" size={20}>
                        <div className="contact-icon-circle"><EnvironmentOutlined /></div>
                        <div>
                          <Title level={5} style={{ margin: 0 }}>Văn phòng Giáo lý</Title>
                          <Text type="secondary">Trung tâm Mục vụ Giáo phận</Text>
                        </div>
                      </Space>
                    </Card>

                    <Card bordered={false} className="contact-info-card">
                      <Space align="start" size={20}>
                        <div className="contact-icon-circle"><PhoneOutlined /></div>
                        <div>
                          <Title level={5} style={{ margin: 0 }}>Số điện thoại</Title>
                          <Text type="secondary">+84 123 456 789</Text>
                        </div>
                      </Space>
                    </Card>

                    <Card bordered={false} className="contact-info-card">
                      <Space align="start" size={20}>
                        <div className="contact-icon-circle"><MailOutlined /></div>
                        <div>
                          <Title level={5} style={{ margin: 0 }}>Email hỗ trợ</Title>
                          <Text type="secondary">support@giaolyhonnhan.com</Text>
                        </div>
                      </Space>
                    </Card>

                  </Space>

                  <div className="social-connect">
                    <Divider plain><Text type="secondary" style={{ fontSize: 12 }}>KẾT NỐI VỚI CHÚNG TÔI</Text></Divider>
                    <Space size={16} className="social-btns">
                      <Button shape="circle" icon={<FacebookFilled />} className="social-btn fb" />
                      <Button shape="circle" icon={<YoutubeFilled />} className="social-btn yt" />
                    </Space>
                  </div>
                </div>
              </Col>

              {/* CỘT PHẢI: FORM LIÊN HỆ */}
              <Col xs={24} lg={14}>
                <Card bordered={false} className="contact-form-wrapper">
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
                          rules={[{ required: true, message: 'Vui lòng cho biết tên bạn' }]}
                        >
                          <Input placeholder="Nguyễn Văn A" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item 
                          label="Địa chỉ Email" 
                          name="email"
                          rules={[
                            { required: true, message: 'Vui lòng nhập Email' },
                            { type: 'email', message: 'Email không đúng định dạng' }
                          ]}
                        >
                          <Input placeholder="email@example.com" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item label="Chủ đề bạn quan tâm" name="subject">
                      <Input placeholder="Góp ý nội dung bài học..." />
                    </Form.Item>

                    <Form.Item 
                      label="Nội dung chi tiết" 
                      name="message"
                      rules={[{ required: true, message: 'Vui lòng nhập lời nhắn' }]}
                    >
                      <TextArea rows={6} placeholder="Chia sẻ suy nghĩ hoặc thắc mắc của bạn tại đây..." />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        icon={<SendOutlined />} 
                        block 
                        className="btn-submit"
                      >
                        GỬI TIN NHẮN NGAY
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        <style dangerouslySetInnerHTML={{ __html: `
          .contact-wrapper { padding: 60px 20px; min-height: 100vh; }
          .contact-container { max-width: 1100px; margin: 0 auto; }
          
          /* Header */
          .contact-intro { text-align: center; margin-bottom: 50px; }
          .contact-badge { 
            display: inline-flex; align-items: center; gap: 8px;
            background: #fdfaf3; color: #8c734b; padding: 6px 16px;
            border-radius: 20px; font-size: 12px; font-weight: 700;
            margin-bottom: 16px; border: 1px solid #eaddca;
          }
          .contact-main-title { font-size: 42px !important; font-weight: 800 !important; color: #262626 !important; margin: 0 !important; }
          .contact-subtitle { font-size: 16px; color: #8c8c8c; max-width: 600px; margin: 16px auto 0 !important; }

          /* Info Cards */
          .contact-info-card { 
            background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.02); 
            border: 1px solid #f0f0f0; border-radius: 16px;
            transition: all 0.3s;
          }
          .contact-info-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(140, 115, 75, 0.1); }
          .contact-icon-circle { 
            width: 48px; height: 48px; background: #8c734b; color: #fff;
            display: flex; align-items: center; justify-content: center;
            border-radius: 12px; font-size: 20px;
          }

          /* Form Wrapper */
          .contact-form-wrapper { 
            padding: 30px; border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
          }
          .ant-form-item-label label { font-weight: 600 !important; color: #434343 !important; }
          .ant-input, .ant-input-affix-wrapper { background: #f9f9f9 !important; border: 1px solid #f0f0f0 !important; }
          .ant-input:focus, .ant-input-affix-wrapper-focused { background: #fff !important; border-color: #8c734b !important; }

          .btn-submit { 
            height: 54px !important; font-weight: 700 !important; letter-spacing: 1px;
            box-shadow: 0 10px 20px rgba(140, 115, 75, 0.25) !important;
            margin-top: 10px;
          }

          .social-connect { margin-top: 40px; text-align: center; }
          .social-btns { margin-top: 16px; }
          .social-btn { font-size: 20px; height: 45px; width: 45px; display: flex; align-items: center; justify-content: center; }
          .social-btn.fb { color: #1877f2; }
          .social-btn.yt { color: #ff0000; }

          @media (max-width: 768px) {
            .contact-wrapper { padding: 40px 15px; }
            .contact-main-title { font-size: 32px !important; }
            .contact-form-wrapper { padding: 20px; }
          }
        `}} />
      </Layout>
    </ConfigProvider>
  );
};

export default ContactPage;