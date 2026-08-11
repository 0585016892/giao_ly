import React, { useEffect, useState } from "react";
import axios from "axios";
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
  ClockCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Bảng màu thiết kế chuẩn Giáo xứ Đồng Quan
  const primaryNavy = "#0B192C";
  const accentGold = "#D4A017";
  const textDark = "#1E293B";
  const softBg = "#F8FAFC";

  // Framer Motion Animation
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    document.title = "Liên Hệ & Trợ Giúp | Giáo xứ Đồng Quan";
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const API_BASE = process.env.REACT_APP_API_URL;
      const res = await axios.post(`${API_BASE}/api/contact`, values);

      if (res.data?.success || res.status === 200) {
        message.success(res.data?.message || "Gửi lời nhắn thành công!");
        form.resetFields();
      }
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      message.error("Gửi thất bại. Vui lòng kiểm tra lại kết nối!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentGold,
          borderRadius: 12,
          colorBgLayout: softBg,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <Layout className="pcv2-layout-root">
        <Content className="pcv2-page-wrapper">
          <div className="pcv2-content-container">
            {/* HEADER SECTION */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="pcv2-header-box"
            >
              <span className="pcv2-status-badge">
                <CompassOutlined /> LIÊN HỆ & TRỢ GIÚP
              </span>
              <Title level={1} className="pcv2-main-heading">
                Gắn Kết <span>& Sẻ Chia</span>
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="pcv2-lead-text">
                Mọi thắc mắc về các khóa học Giáo lý, thủ tục hôn phối hoặc cần
                hỗ trợ thông tin, xin đừng ngần ngại gửi lời nhắn. Ban Hành Giáo
                sẽ phản hồi quý cộng đoàn trong thời gian sớm nhất.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="pcv2-main-row">
              {/* CỘT TRÁI: THÔNG TIN CHI TIẾT & BẢN ĐỒ */}
              <Col xs={24} lg={10}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="pcv2-sidebar-info"
                >
                  <div className="pcv2-info-list">
                    <ContactDetailItem
                      icon={<EnvironmentOutlined />}
                      label="Địa chỉ Văn phòng"
                      value="Ban Hành Giáo Giáo xứ Đồng Quan, Xã Vũ Quý, Tỉnh Hưng Yên"
                    />
                    <ContactDetailItem
                      icon={<PhoneOutlined />}
                      label="Hotline Liên Hệ"
                      value="033 604 1807 (Admin)"
                    />
                    <ContactDetailItem
                      icon={<MailOutlined />}
                      label="Hòm Thư Email"
                      value="giaoxudongquan@gmail.com"
                    />
                  </div>

                  {/* THỜI GIAN LÀM VIỆC */}
                  <Card className="pcv2-hours-card" bordered={false}>
                    <div className="pcv2-card-header">
                      <ClockCircleOutlined className="hours-icon" />
                      <Title level={5} className="pcv2-card-title">
                        Giờ Tiếp Chuyện & Làm Việc
                      </Title>
                    </div>
                    <div className="pcv2-hour-row">
                      <span>Thứ 2 — Thứ 7:</span> <strong>08:00 - 17:00</strong>
                    </div>
                    <div className="pcv2-hour-row">
                      <span>Chúa Nhật:</span>{" "}
                      <strong>Phụng vụ & Nghỉ lễ</strong>
                    </div>
                  </Card>

                  {/* KHUNG BẢN ĐỒ BẢN ĐỊA */}
                  <div className="pcv2-map-box">
                    <iframe
                      title="Bản đồ Giáo xứ Đồng Quan"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.693892308696!2d105.84117!3d21.00508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAwJzE4LjMiTiAxMDXCsDUwJzI4LjIiRQ!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
                      width="100%"
                      height="180"
                      style={{ border: 0, borderRadius: 12 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>

                  {/* KẾT NỐI MẠNG XÃ HỘI */}
                  <div className="pcv2-social-section">
                    <Divider
                      plain
                      style={{ borderColor: "#e2e8f0", margin: "16px 0" }}
                    >
                      <Text className="social-divider-text">
                        KẾT NỐI CỘNG ĐỒNG
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
                </motion.div>
              </Col>

              {/* CỘT PHẢI: FORM GỬI TIN NHẮN */}
              <Col xs={24} lg={14}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                >
                  <Card bordered={false} className="pcv2-form-glass">
                    <div className="pcv2-form-header">
                      <Title level={3} className="form-header-title">
                        Gửi Lời Nhắn Trực Tuyến
                      </Title>
                      <Text className="form-header-sub">
                        Vui lòng điền đầy đủ thông tin để Ban Mục vụ có thể hồi
                        đáp chính xác.
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
                              <span className="form-label-text">
                                Họ và tên *
                              </span>
                            }
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Vui lòng nhập họ và tên của bạn",
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
                              {
                                required: true,
                                message: "Vui lòng nhập Email",
                              },
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
                          placeholder="Nhập nội dung lời nhắn của bạn tại đây..."
                        />
                      </Form.Item>

                      <Button
                        type="primary"
                        htmlType="submit"
                        icon={<SendOutlined />}
                        block
                        className="pcv2-btn-submit"
                        loading={loading}
                      >
                        GỬI TIN NHẮN NGAY
                      </Button>
                    </Form>

                    <div className="form-footer-note">
                      <CheckCircleFilled
                        style={{ color: "#52c41a", marginRight: 6 }}
                      />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Thông tin của bạn luôn được bảo mật tuyệt đối.
                      </Text>
                    </div>
                  </Card>
                </motion.div>
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
            padding: 50px 20px 80px 20px; 
          }

          .pcv2-content-container { 
            max-width: 1140px; 
            margin: 0 auto; 
          }

          /* HEADER BOX */
          .pcv2-header-box { 
            text-align: center; 
            margin-bottom: 40px; 
          }

          .pcv2-status-badge { 
            display: inline-flex; 
            align-items: center; 
            gap: 8px;
            background: rgba(212, 160, 23, 0.12); 
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
            font-size: clamp(30px, 5vw, 44px) !important; 
            font-weight: 800 !important; 
            color: ${primaryNavy} !important; 
            margin: 12px 0 0 0 !important; 
            line-height: 1.2 !important;
          }

          .pcv2-main-heading span {
            color: ${accentGold};
            font-style: italic;
            font-weight: 400;
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin: 14px auto;
            border-radius: 2px;
          }

          .pcv2-lead-text { 
            font-size: 14px; 
            color: #64748b; 
            max-width: 650px; 
            margin: 0 auto !important; 
            line-height: 1.6;
          }

          /* SIDEBAR & DETAIL ITEMS */
          .pcv2-info-list { 
            display: flex; 
            flex-direction: column; 
            gap: 12px; 
            margin-bottom: 20px; 
          }

          .pcv2-detail-card { 
            background: #ffffff; 
            padding: 16px; 
            border-radius: 12px;
            display: flex; 
            align-items: center; 
            gap: 14px;
            border: 1px solid #e2e8f0; 
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
            transition: all 0.3s ease;
          }

          .pcv2-detail-card:hover { 
            transform: translateX(4px); 
            border-color: ${accentGold}; 
            box-shadow: 0 8px 24px rgba(11, 25, 44, 0.06);
          }

          .pcv2-icon-wrap { 
            width: 44px; 
            height: 44px; 
            background: ${primaryNavy}; 
            color: ${accentGold};
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 10px; 
            font-size: 18px;
            border: 1px solid ${accentGold};
            flex-shrink: 0;
          }

          .item-label {
            font-size: 11px;
            color: #94a3b8;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .item-value {
            font-size: 13px;
            font-weight: 700;
            color: ${primaryNavy};
            margin-top: 2px;
            line-height: 1.4;
          }

          /* HOURS CARD */
          .pcv2-hours-card { 
            background: #ffffff !important; 
            border: 1px dashed ${accentGold} !important; 
            border-radius: 12px !important; 
            padding: 16px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02) !important;
            margin-bottom: 20px;
          }

          .pcv2-card-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .hours-icon {
            color: ${accentGold};
            font-size: 16px;
          }

          .pcv2-card-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important; 
            margin: 0 !important; 
            font-weight: 700 !important;
          }

          .pcv2-hour-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 6px; 
            font-size: 12px;
            color: #475569;
          }

          .pcv2-hour-row:last-child {
            margin-bottom: 0;
          }

          .pcv2-map-box {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          }

          /* FORM GLASS CARD */
          .pcv2-form-glass { 
            background: #ffffff !important; 
            border-radius: 16px !important; 
            padding: 28px;
            box-shadow: 0 10px 30px rgba(11, 25, 44, 0.05) !important;
            border: 1px solid #e2e8f0 !important;
          }

          .pcv2-form-header { 
            margin-bottom: 24px; 
          }

          .form-header-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 0 6px 0 !important;
            font-weight: 800 !important;
          }

          .form-header-sub {
            color: #64748b;
            font-size: 13px;
          }

          .form-label-text {
            font-size: 12px;
            color: ${primaryNavy};
            font-weight: 700;
          }

          .pcv2-input { 
            border-radius: 8px !important; 
            background: ${softBg} !important; 
            border-color: #e2e8f0 !important;
            font-size: 13px !important;
          }

          .pcv2-input:focus { 
            background: #ffffff !important; 
            border-color: ${accentGold} !important; 
          }

          .pcv2-btn-submit { 
            height: 48px !important; 
            font-weight: 700 !important;
            background: ${accentGold} !important;
            border-color: ${accentGold} !important;
            color: #ffffff !important;
            box-shadow: 0 4px 15px rgba(212, 160, 23, 0.35) !important;
            margin-top: 8px; 
            border-radius: 8px !important;
            font-size: 13px !important;
            letter-spacing: 0.5px;
          }

          .pcv2-btn-submit:hover {
            background: #b8860b !important;
            border-color: #b8860b !important;
          }

          .form-footer-note {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 16px;
          }

          /* SOCIAL SECTION */
          .pcv2-social-section { 
            margin-top: 20px; 
            text-align: center; 
          }

          .social-divider-text {
            font-size: 10px;
            color: #94a3b8;
            letter-spacing: 1.5px;
            font-weight: 700;
          }

          .pcv2-social-btn { 
            font-size: 18px; 
            width: 40px; 
            height: 40px; 
            border: 1px solid #e2e8f0 !important; 
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04); 
            transition: all 0.2s ease;
          }

          .pcv2-social-btn:hover {
            transform: translateY(-2px);
          }

          .pcv2-fb { color: #1877f2 !important; }
          .pcv2-yt { color: #ff0000 !important; }

          @media (max-width: 768px) {
            .pcv2-page-wrapper { padding: 30px 16px 60px 16px; }
            .pcv2-form-glass { padding: 18px; }
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
      <div className="item-label">{label}</div>
      <div className="item-value">{value}</div>
    </div>
  </div>
);

export default ContactPage;
