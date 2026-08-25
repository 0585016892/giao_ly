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
  Spin,
  Alert,
  Modal,
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
  LoadingOutlined,
  StarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Bảng màu thiết kế Sang trọng - Hiện đại (Giáo xứ Đồng Quan)
  const themeColors = {
    primaryNavy: "#0F172A",
    deepRoyal: "#1E293B",
    accentGold: "#D4A017",
    goldHover: "#B8860B",
    softBg: "#F8FAFC",
    cardBg: "#FFFFFF",
    textDark: "#0F172A",
    textMuted: "#64748B",
    borderLight: "#E2E8F0",
  };

  // Variants Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  useEffect(() => {
    document.title = "Liên Hệ & Trợ Giúp | Giáo xứ Đồng Quan";
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    setSubmitStatus(null);
    try {
      const API_BASE = process.env.REACT_APP_API_URL || "";
      const res = await axios.post(`${API_BASE}/api/contact`, values);

      if (res.data?.success || res.status === 200) {
        setSubmitStatus({
          type: "success",
          message:
            res.data?.message ||
            "Gửi lời nhắn thành công! Ban Mục vụ sẽ hồi đáp sớm nhất.",
        });
        form.resetFields();
      } else {
        throw new Error(res.data?.message || "Không thể gửi tin nhắn");
      }
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      setSubmitStatus({
        type: "error",
        message:
          error.response?.data?.message ||
          "Gửi thất bại. Vui lòng kiểm tra lại kết nối mạng!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý khi xác nhận gọi điện thoại
  const handleMakeCall = () => {
    window.location.href = "tel:0336041807";
    setIsPhoneModalOpen(false);
  };

  const customLoadingIcon = (
    <LoadingOutlined
      style={{ fontSize: 32, color: themeColors.accentGold }}
      spin
    />
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColors.accentGold,
          borderRadius: 12,
          colorBgLayout: themeColors.softBg,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <Layout className="pcv3-layout-root">
        {/* Lớp phủ trang trí nền background */}
        <div className="pcv3-bg-glow pcv3-glow-top" />
        <div className="pcv3-bg-glow pcv3-glow-bottom" />

        <Content className="pcv3-page-wrapper">
          <motion.div
            className="pcv3-content-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* HEADER SECTION */}
            <motion.div variants={fadeInUp} className="pcv3-header-box">
              <div className="pcv3-status-badge">
                <CompassOutlined className="badge-icon" />
                <span>LIÊN HỆ & TRỢ GIÚP MỤC VỤ</span>
              </div>
              <Title level={1} className="pcv3-main-heading">
                Gắn Kết <span>& Sẻ Chia</span>
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="pcv3-lead-text">
                Mọi thắc mắc về các khóa học Giáo lý, thủ tục Hôn phối hoặc xin
                ý cầu nguyện, xin đừng ngần ngại liên hệ. Ban Mục vụ Giáo xứ
                luôn sẵn sàng đồng hành cùng Quý cộng đoàn.
              </Paragraph>
            </motion.div>

            <Row gutter={[32, 32]} className="pcv3-main-row">
              {/* CỘT TRÁI: THÔNG TIN CHI TIẾT & BẢN ĐỒ */}
              <Col xs={24} lg={10}>
                <motion.div variants={fadeInUp} className="pcv3-sidebar-info">
                  <div className="pcv3-info-list">
                    <ContactDetailItem
                      icon={<EnvironmentOutlined />}
                      label="Địa chỉ Văn phòng"
                      value="Ban Hành Giáo Giáo xứ Đồng Quan, Xã Vũ Quý, Tỉnh Hưng Yên"
                      href="https://maps.google.com"
                    />
                    {/* Mục Hotline mở Modal gọi điện */}
                    <ContactDetailItem
                      icon={<PhoneOutlined />}
                      label="Hotline Trực Văn Phòng"
                      value="033 604 1807 (Admin)"
                      onClick={() => setIsPhoneModalOpen(true)}
                    />
                    <ContactDetailItem
                      icon={<MailOutlined />}
                      label="Hòm Thư Điện Tử"
                      value="giaoxudongquan@gmail.com"
                      href="mailto:giaoxudongquan@gmail.com"
                    />
                  </div>

                  {/* THỜI GIAN LÀM VIỆC */}
                  <Card className="pcv3-hours-card" bordered={false}>
                    <div className="pcv3-card-header">
                      <ClockCircleOutlined className="hours-icon" />
                      <Title level={5} className="pcv3-card-title">
                        Giờ Lễ & Văn Phòng Trực
                      </Title>
                    </div>
                    <div className="pcv3-hour-row">
                      <span>Thứ 2 — Thứ 7:</span>
                      <strong>08:00 - 11:30 | 14:00 - 17:00</strong>
                    </div>
                    <div className="pcv3-hour-row">
                      <span>Chúa Nhật:</span>
                      <strong style={{ color: themeColors.accentGold }}>
                        Các Thánh lễ Phụng vụ
                      </strong>
                    </div>
                  </Card>

                  {/* BẢN ĐỒ INTERACTIVE */}
                  <div className="pcv3-map-box">
                    <iframe
                      title="Bản đồ Giáo xứ Đồng Quan"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.693892308696!2d105.84117!3d21.00508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAwJzE4LjMiTiAxMDXCsDUwJzI4LjIiRQ!5e0!3m2!1svi!2s!4v1620000000000!5m2!1svi!2s"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>

                  {/* KẾT NỐI MẠNG XÃ HỘI */}
                  <div className="pcv3-social-section">
                    <Divider
                      plain
                      style={{ borderColor: "#E2E8F0", margin: "20px 0 16px" }}
                    >
                      <Text className="social-divider-text">
                        KẾT NỐI TRUYỀN THÔNG
                      </Text>
                    </Divider>
                    <Space size={16} className="pcv3-social-icons">
                      <a
                        href="https://www.facebook.com/profile.php?id=100077253045004"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          shape="circle"
                          icon={<FacebookFilled />}
                          className="pcv3-social-btn pcv3-fb"
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
                          className="pcv3-social-btn pcv3-yt"
                        />
                      </a>
                    </Space>
                  </div>
                </motion.div>
              </Col>

              {/* CỘT PHẢI: FORM GỬI TIN NHẮN VỚI OVERLAY LOADING */}
              <Col xs={24} lg={14}>
                <motion.div variants={fadeInUp}>
                  <Card bordered={false} className="pcv3-form-card">
                    {/* Spin Overlay cho toàn bộ Form khi Submit */}
                    <Spin
                      spinning={loading}
                      indicator={customLoadingIcon}
                      tip={
                        <div className="loading-tip-wrapper">
                          <Text strong className="loading-tip-title">
                            Đang chuyển lời nhắn...
                          </Text>
                          <Text type="secondary" className="loading-tip-sub">
                            Xin vui lòng đợi trong giây lát
                          </Text>
                        </div>
                      }
                    >
                      <div className="pcv3-form-header">
                        <div className="form-header-badge">
                          <StarOutlined />
                          <span>TRỰC TUYẾN 24/7</span>
                        </div>
                        <Title level={3} className="form-header-title">
                          Gửi Lời Nhắn Đến Ban Mục Vụ
                        </Title>
                        <Text className="form-header-sub">
                          Hãy để lại tâm thư hoặc thắc mắc, Ban Mục vụ sẽ phản
                          hồi chính xác qua Email/Số điện thoại của bạn.
                        </Text>
                      </div>

                      {/* Hiển thị Thông báo Kết quả (Success/Error) */}
                      <AnimatePresence>
                        {submitStatus && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{
                              opacity: 1,
                              height: "auto",
                              marginBottom: 20,
                            }}
                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                          >
                            <Alert
                              message={
                                submitStatus.type === "success"
                                  ? "Gửi Thành Công!"
                                  : "Không Thể Gửi"
                              }
                              description={submitStatus.message}
                              type={submitStatus.type}
                              showIcon
                              closable
                              onClose={() => setSubmitStatus(null)}
                              style={{ borderRadius: 10 }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

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
                                  message: "Vui lòng nhập họ tên của bạn",
                                },
                              ]}
                            >
                              <Input
                                className="pcv3-input"
                                placeholder="VD: Joseph Nguyễn Văn A"
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
                                {
                                  type: "email",
                                  message: "Email không đúng định dạng",
                                },
                              ]}
                            >
                              <Input
                                className="pcv3-input"
                                placeholder="tenban@example.com"
                              />
                            </Form.Item>
                          </Col>
                        </Row>

                        <Form.Item
                          label={
                            <span className="form-label-text">
                              Chủ đề cần hỗ trợ
                            </span>
                          }
                          name="subject"
                        >
                          <Input
                            className="pcv3-input"
                            placeholder="VD: Tìm hiểu Giáo lý Hôn phối, thủ tục Rửa tội..."
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="form-label-text">
                              Nội dung lời nhắn *
                            </span>
                          }
                          name="message"
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng nhập nội dung chi tiết",
                            },
                          ]}
                        >
                          <TextArea
                            rows={5}
                            className="pcv3-input"
                            placeholder="Nhập chi tiết ý kiến, câu hỏi hoặc nguyện vọng của bạn tại đây..."
                          />
                        </Form.Item>

                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={!loading && <SendOutlined />}
                          block
                          className="pcv3-btn-submit"
                          disabled={loading}
                        >
                          {loading
                            ? "ĐANG TIẾN HÀNH GỬI..."
                            : "GỬI LỜI NHẮN NGAY"}
                        </Button>
                      </Form>

                      <div className="form-footer-note">
                        <SafetyCertificateOutlined
                          style={{
                            color: "#52c41a",
                            marginRight: 8,
                            fontSize: 16,
                          }}
                        />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Thông tin cá nhân được bảo mật theo định hướng Mục vụ
                          Giáo xứ.
                        </Text>
                      </div>
                    </Spin>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>

          {/* MODAL XÁC NHẬN GỌI ĐIỆN THOẠI */}
          <Modal
            title={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  color: themeColors.primaryNavy,
                }}
              >
                <PhoneOutlined
                  style={{ color: themeColors.accentGold, fontSize: 20 }}
                />
                <span>Xác nhận cuộc gọi</span>
              </div>
            }
            open={isPhoneModalOpen}
            onOk={handleMakeCall}
            onCancel={() => setIsPhoneModalOpen(false)}
            okText="Gọi ngay"
            cancelText="Hủy"
            okButtonProps={{
              style: {
                background: themeColors.accentGold,
                borderColor: themeColors.accentGold,
              },
            }}
            centered
          >
            <div style={{ padding: "16px 0", textAlign: "center" }}>
              <p
                style={{
                  fontSize: 15,
                  color: themeColors.textMuted,
                  marginBottom: 8,
                }}
              >
                Bạn có muốn thực hiện cuộc gọi đến Ban Mục vụ Giáo xứ?
              </p>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: themeColors.primaryNavy,
                }}
              >
                033 604 1807
              </div>
              <span style={{ fontSize: 13, color: themeColors.textMuted }}>
                (Admin trực văn phòng)
              </span>
            </div>
          </Modal>
        </Content>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          /* LAYOUT BASE */
          .pcv3-layout-root { 
            background: ${themeColors.softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${themeColors.textDark};
            position: relative;
            overflow: hidden;
          }

          /* GLOW BACKGROUND EFFECT */
          .pcv3-bg-glow {
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            filter: blur(120px);
            pointer-events: none;
            z-index: 0;
            opacity: 0.4;
          }
          .pcv3-glow-top {
            top: -200px;
            left: -100px;
            background: radial-gradient(circle, rgba(214, 160, 23, 0.25) 0%, rgba(255,255,255,0) 70%);
          }
          .pcv3-glow-bottom {
            bottom: -200px;
            right: -100px;
            background: radial-gradient(circle, rgba(15, 23, 42, 0.15) 0%, rgba(255,255,255,0) 70%);
          }

          .pcv3-page-wrapper { 
            padding: 60px 20px 90px 20px; 
            position: relative;
            z-index: 1;
          }

          .pcv3-content-container { 
            max-width: 1160px; 
            margin: 0 auto; 
          }

          /* HEADER BOX */
          .pcv3-header-box { 
            text-align: center; 
            margin-bottom: 48px; 
          }

          .pcv3-status-badge { 
            display: inline-flex; 
            align-items: center; 
            gap: 8px;
            background: rgba(212, 160, 23, 0.12); 
            color: ${themeColors.primaryNavy}; 
            padding: 6px 18px;
            border-radius: 30px; 
            font-size: 11px; 
            font-weight: 700;
            border: 1px solid rgba(212, 160, 23, 0.3); 
            letter-spacing: 1.5px;
            box-shadow: 0 2px 10px rgba(212, 160, 23, 0.08);
          }

          .badge-icon {
            color: ${themeColors.accentGold};
            font-size: 14px;
          }

          .pcv3-main-heading { 
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(32px, 5vw, 46px) !important; 
            font-weight: 800 !important; 
            color: ${themeColors.primaryNavy} !important; 
            margin: 14px 0 0 0 !important; 
            line-height: 1.2 !important;
          }

          .pcv3-main-heading span {
            color: ${themeColors.accentGold};
            font-style: italic;
            font-weight: 400;
          }

          .gold-accent-divider {
            width: 64px;
            height: 3px;
            background: linear-gradient(90deg, ${themeColors.accentGold}, #F3E5AB);
            margin: 16px auto;
            border-radius: 4px;
          }

          .pcv3-lead-text { 
            font-size: 15px; 
            color: ${themeColors.textMuted}; 
            max-width: 680px; 
            margin: 0 auto !important; 
            line-height: 1.7;
          }

          /* SIDEBAR & DETAIL ITEMS */
          .pcv3-info-list { 
            display: flex; 
            flex-direction: column; 
            gap: 14px; 
            margin-bottom: 24px; 
          }

          .pcv3-detail-card { 
            background: ${themeColors.cardBg}; 
            padding: 16px 20px; 
            border-radius: 14px;
            display: flex; 
            align-items: center; 
            gap: 16px;
            border: 1px solid ${themeColors.borderLight}; 
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.03);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            text-decoration: none;
          }

          .pcv3-detail-card:hover { 
            transform: translateY(-3px); 
            border-color: ${themeColors.accentGold}; 
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
          }

          .pcv3-icon-wrap { 
            width: 46px; 
            height: 46px; 
            background: ${themeColors.primaryNavy}; 
            color: ${themeColors.accentGold};
            display: flex; 
            align-items: center; 
            justify-content: center;
            border-radius: 12px; 
            font-size: 20px;
            border: 1px solid rgba(212, 160, 23, 0.3);
            flex-shrink: 0;
            transition: transform 0.3s ease;
          }

          .pcv3-detail-card:hover .pcv3-icon-wrap {
            transform: scale(1.05);
            background: ${themeColors.accentGold};
            color: #FFFFFF;
          }

          .item-label {
            font-size: 11px;
            color: #94A3B8;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 0.5px;
          }

          .item-value {
            font-size: 14px;
            font-weight: 700;
            color: ${themeColors.primaryNavy};
            margin-top: 2px;
            line-height: 1.4;
          }

          /* HOURS CARD */
          .pcv3-hours-card { 
            background: #FFFFFF !important; 
            border: 1px dashed ${themeColors.accentGold} !important; 
            border-radius: 14px !important; 
            padding: 18px 20px;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.02) !important;
            margin-bottom: 24px;
          }

          .pcv3-card-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
          }

          .hours-icon {
            color: ${themeColors.accentGold};
            font-size: 18px;
          }

          .pcv3-card-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${themeColors.primaryNavy} !important; 
            margin: 0 !important; 
            font-weight: 700 !important;
          }

          .pcv3-hour-row { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px; 
            font-size: 13px;
            color: ${themeColors.textMuted};
          }

          .pcv3-hour-row:last-child {
            margin-bottom: 0;
          }

          .pcv3-map-box {
            border: 1px solid ${themeColors.borderLight};
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
          }

          /* FORM CARD & LOADING OVERLAY */
          .pcv3-form-card { 
            background: #FFFFFF !important; 
            border-radius: 20px !important; 
            padding: 32px;
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05) !important;
            border: 1px solid ${themeColors.borderLight} !important;
            position: relative;
          }

          .loading-tip-wrapper {
            margin-top: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .loading-tip-title {
            color: ${themeColors.primaryNavy} !important;
            font-size: 15px;
            font-weight: 700;
          }

          .loading-tip-sub {
            font-size: 13px;
            color: ${themeColors.textMuted};
          }

          /* Blur Form Content khi đang Spin */
          .ant-spin-nested-loading .ant-spin-blur {
            opacity: 0.4;
            filter: blur(4px);
          }

          .pcv3-form-header { 
            margin-bottom: 24px; 
          }

          .form-header-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            font-weight: 800;
            color: ${themeColors.accentGold};
            letter-spacing: 1px;
            margin-bottom: 6px;
          }

          .form-header-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${themeColors.primaryNavy} !important;
            margin: 0 0 6px 0 !important;
            font-weight: 800 !important;
          }

          .form-header-sub {
            color: ${themeColors.textMuted};
            font-size: 13px;
            line-height: 1.5;
          }

          .form-label-text {
            font-size: 13px;
            color: ${themeColors.primaryNavy};
            font-weight: 700;
          }

          .pcv3-input { 
            border-radius: 10px !important; 
            background: ${themeColors.softBg} !important; 
            border-color: ${themeColors.borderLight} !important;
            font-size: 14px !important;
            padding: 10px 14px !important;
            transition: all 0.2s ease !important;
          }

          .pcv3-input:focus, .pcv3-input:hover { 
            background: #FFFFFF !important; 
            border-color: ${themeColors.accentGold} !important; 
            box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.15) !important;
          }

          .pcv3-btn-submit { 
            height: 52px !important; 
            font-weight: 700 !important;
            background: linear-gradient(135deg, ${themeColors.accentGold}, ${themeColors.goldHover}) !important;
            border: none !important;
            color: #FFFFFF !important;
            box-shadow: 0 8px 20px rgba(212, 160, 23, 0.35) !important;
            margin-top: 10px; 
            border-radius: 10px !important;
            font-size: 14px !important;
            letter-spacing: 0.8px;
            transition: all 0.3s ease !important;
          }

          .pcv3-btn-submit:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 25px rgba(212, 160, 23, 0.45) !important;
            background: linear-gradient(135deg, ${themeColors.goldHover}, #A0720A) !important;
          }

          .form-footer-note {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 20px;
            padding-top: 16px;
            border-top: 1px solid #F1F5F9;
          }

          /* SOCIAL SECTION */
          .pcv3-social-section { 
            margin-top: 20px; 
            text-align: center; 
          }

          .social-divider-text {
            font-size: 10px;
            color: #94A3B8;
            letter-spacing: 1.5px;
            font-weight: 700;
          }

          .pcv3-social-btn { 
            font-size: 20px; 
            width: 44px; 
            height: 44px; 
            border: 1px solid ${themeColors.borderLight} !important; 
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04); 
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .pcv3-social-btn:hover {
            transform: translateY(-3px) scale(1.05);
            border-color: ${themeColors.accentGold} !important;
          }

          .pcv3-fb { color: #1877F2 !important; }
          .pcv3-yt { color: #FF0000 !important; }

          @media (max-width: 768px) {
            .pcv3-page-wrapper { padding: 36px 16px 60px 16px; }
            .pcv3-form-card { padding: 20px; border-radius: 16px !important; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

// Component thẻ hiển thị thông tin liên hệ
const ContactDetailItem = ({ icon, label, value, href, onClick }) => {
  if (onClick) {
    return (
      <div
        className="pcv3-detail-card"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div className="pcv3-icon-wrap">{icon}</div>
        <div>
          <div className="item-label">{label}</div>
          <div className="item-value">{value}</div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={href || "#!"}
      target={href && href.startsWith("http") ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="pcv3-detail-card"
    >
      <div className="pcv3-icon-wrap">{icon}</div>
      <div>
        <div className="item-label">{label}</div>
        <div className="item-value">{value}</div>
      </div>
    </a>
  );
};

export default ContactPage;
