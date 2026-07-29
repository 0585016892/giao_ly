import React, { useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  ConfigProvider,
  Divider,
  message,
} from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  SendOutlined,
  FacebookFilled,
  YoutubeFilled,
  CompassOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Navy Đậm
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    document.title = "Liên Hệ & Trợ Giúp | Giáo xứ Đồng Quan";
  }, []);

  const onFinish = (values) => {
    console.log("Thông tin gửi đi:", values);
    message.success(
      "Cảm ơn bạn! Lời nhắn đã được gửi thành công đến Ban Hành Giáo.",
    );
    form.resetFields();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 14,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="pcv2-layout-root">
        <Content className="pcv2-page-wrapper">
          <div className="pcv2-content-container">
            {/* HEADER SECTION */}
            <div className="pcv2-header-box">
              <span className="pcv2-status-badge">
                <CompassOutlined /> LIÊN HỆ & TRỢ GIÚP
              </span>
              <Title level={1} className="pcv2-main-heading">
                Gắn Kết & Sẻ Chia
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="pcv2-lead-text">
                Mọi thắc mắc về các khóa học Giáo lý, thủ tục hôn phối hoặc cần
                hỗ trợ kỹ thuật, xin đừng ngần ngại gửi lời nhắn. Ban Hành Giáo
                sẽ phản hồi bạn trong thời gian sớm nhất.
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
                      value="Ban Hành Giáo Giáo xứ Đồng Quan"
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
                    <Title level={5} className="pcv2-card-title">
                      Giờ Tiếp Chuyện & Làm Việc
                    </Title>
                    <div className="pcv2-hour-row">
                      <span>Thứ 2 — Thứ 7:</span> <strong>08:00 - 17:00</strong>
                    </div>
                    <div className="pcv2-hour-row">
                      <span>Chúa Nhật:</span>{" "}
                      <strong>Phụng vụ & Nghỉ lễ</strong>
                    </div>
                  </Card>

                  <div className="pcv2-social-section">
                    <Divider
                      plain
                      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#64748b",
                          letterSpacing: 1.5,
                          fontWeight: 700,
                        }}
                      >
                        KẾT NỐI MẠNG XÃ HỘI
                      </Text>
                    </Divider>
                    <Space size={16} className="pcv2-social-icons">
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

              {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
              <Col xs={24} lg={15}>
                <Card bordered={false} className="pcv2-form-glass">
                  <div className="pcv2-form-header">
                    <Title level={3} className="form-header-title">
                      Gửi Lời Nhắn
                    </Title>
                    <Text className="form-header-sub">
                      Vui lòng điền đầy đủ các thông tin bên dưới để Ban Mục vụ
                      tiếp nhận.
                    </Text>
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
                          label={
                            <span className="form-label-text">Họ và tên *</span>
                          }
                          name="name"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập họ và tên",
                            },
                          ]}
                        >
                          <Input
                            className="pcv2-input"
                            placeholder="Ví dụ: Nguyễn Văn A"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label={
                            <span className="form-label-text">
                              Địa chỉ Email *
                            </span>
                          }
                          name="email"
                          rules={[
                            { required: true, message: "Vui lòng nhập Email" },
                            { type: "email", message: "Email không hợp lệ" },
                          ]}
                        >
                          <Input
                            className="pcv2-input"
                            placeholder="email@example.com"
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      label={
                        <span className="form-label-text">
                          Chủ đề bạn quan tâm
                        </span>
                      }
                      name="subject"
                    >
                      <Input
                        className="pcv2-input"
                        placeholder="Ví dụ: Đăng ký học giáo lý, góp ý ý kiến..."
                      />
                    </Form.Item>

                    <Form.Item
                      label={
                        <span className="form-label-text">
                          Nội dung tin nhắn *
                        </span>
                      }
                      name="message"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập nội dung lời nhắn",
                        },
                      ]}
                    >
                      <TextArea
                        rows={5}
                        className="pcv2-input"
                        placeholder="Viết tin nhắn của bạn tại đây..."
                      />
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

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .pcv2-layout-root { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .pcv2-page-wrapper { 
            padding: 60px 20px 80px 20px; 
          }

          .pcv2-content-container { 
            max-width: 1100px; 
            margin: 0 auto; 
          }

          .pcv2-header-box { 
            text-align: center; 
            margin-bottom: 48px; 
          }

          .pcv2-status-badge { 
            display: inline-flex; 
            align-items: center; 
            gap: 8px;
            background: rgba(212, 175, 55, 0.15); 
            color: ${primaryNavy}; 
            padding: 6px 18px;
            border-radius: 30px; 
            font-size: 11px; 
            font-weight: 700;
            border: 1px solid ${accentGold}; 
            letter-spacing: 1.5px;
          }

          .pcv2-main-heading { 
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(32px, 5vw, 44px) !important; 
            font-weight: 700 !important; 
            color: ${primaryNavy} !important; 
            margin: 12px 0 0 0 !important; 
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin: 14px auto;
            border-radius: 2px;
          }

          .pcv2-lead-text { 
            font-size: 15px; 
            color: #64748b; 
            max-width: 620px; 
            margin: 0 auto !important; 
            line-height: 1.6;
          }

          .pcv2-info-list { 
            display: flex; 
            flex-direction: column; 
            gap: 12px; 
            margin-bottom: 24px; 
          }

          .pcv2-detail-card { 
            background: #ffffff; 
            padding: 18px; 
            border-radius: 16px;
            display: flex; 
            align-items: center; 
            gap: 16px;
            border: 1px solid rgba(212, 175, 55, 0.25); 
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04);
            transition: all 0.3s ease;
          }

          .pcv2-detail-card:hover { 
            transform: translateX(4px); 
            border-color: ${accentGold}; 
            box-shadow: 0 8px 24px rgba(27, 54, 93, 0.08);
          }

          .pcv2-icon-wrap { 
            width: 48px; 
            height: 48px; 
            background: ${primaryNavy}; 
            color: ${accentGold};
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 12px; 
            font-size: 20px;
            border: 1px solid ${accentGold};
            flex-shrink: 0;
          }

          .pcv2-hours-card { 
            background: #ffffff !important; 
            border: 1px dashed ${accentGold} !important; 
            border-radius: 16px !important; 
            padding: 4px;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
          }

          .pcv2-card-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important; 
            margin-bottom: 12px !important; 
            font-weight: 700 !important;
          }

          .pcv2-hour-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px; 
            font-size: 13px;
            color: #475569;
          }

          .pcv2-form-glass { 
            background: #ffffff !important; 
            border-radius: 20px !important; 
            padding: 24px;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
          }

          .pcv2-form-header { 
            margin-bottom: 24px; 
          }

          .form-header-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-weight: 700 !important;
          }

          .form-header-sub {
            color: #64748b;
            font-size: 13px;
          }

          .form-label-text {
            font-size: 13px;
            color: ${primaryNavy};
            font-weight: 600;
          }

          .pcv2-input { 
            border-radius: 10px !important; 
            background: ${softBg} !important; 
            border-color: rgba(212, 175, 55, 0.25) !important;
          }

          .pcv2-input:focus { 
            background: #ffffff !important; 
            border-color: ${accentGold} !important; 
          }

          .pcv2-btn-submit { 
            height: 52px !important; 
            font-weight: 700 !important;
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            box-shadow: 0 6px 20px rgba(27, 54, 93, 0.2) !important;
            margin-top: 10px; 
            border-radius: 12px !important;
          }

          .pcv2-btn-submit:hover {
            background: #132744 !important;
          }

          .pcv2-social-section { 
            margin-top: 28px; 
            text-align: center; 
          }

          .pcv2-social-btn { 
            font-size: 20px; 
            width: 44px; 
            height: 44px; 
            border: 1px solid rgba(212, 175, 55, 0.3) !important; 
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.06); 
          }

          .pcv2-fb { color: #1877f2 !important; }
          .pcv2-yt { color: #ff0000 !important; }

          @media (max-width: 768px) {
            .pcv2-page-wrapper { padding: 40px 14px; }
            .pcv2-form-glass { padding: 12px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

const ContactDetailItem = ({ icon, label, value }) => (
  <div className="pcv2-detail-card">
    <div className="pcv2-icon-wrap">{icon}</div>
    <div>
      <div
        style={{
          fontSize: "11px",
          color: "#64748b",
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#1E293B",
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

export default ContactPage;
