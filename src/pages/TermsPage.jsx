import React, { useEffect } from "react";
import { Layout, Typography, Card, Divider, ConfigProvider, Space } from "antd";
import {
  CompassOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const TermsPage = () => {
  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    document.title = "Điều Khoản Sử Dụng | Giáo xứ Đồng Quan";
  }, []);

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
      <Layout className="terms-editorial-layout">
        <Content className="terms-wrapper">
          <div className="terms-container">
            <Card bordered={false} className="terms-main-card">
              {/* HEADER SECTION */}
              <div className="terms-header-box">
                <span className="terms-tag-sacred">
                  <CompassOutlined /> QUY ĐỊNH & MỤC VỤ GIÁO XỨ
                </span>
                <Title level={1} className="terms-main-title">
                  Điều Khoản Sử Dụng
                </Title>
                <div className="gold-accent-divider" />
                <Paragraph className="terms-lead-desc">
                  Khi truy cập và sử dụng hệ thống thông tin & học tập Giáo lý
                  Hôn nhân của Giáo xứ Đồng Quan, bạn đồng ý tuân thủ các điều
                  khoản mục vụ dưới đây.
                </Paragraph>
              </div>

              <Divider style={{ borderColor: "rgba(212, 175, 55, 0.25)" }} />

              {/* BỐ CỤC NỘI DUNG ĐIỀU KHOẢN */}
              <div className="terms-body-content">
                {/* MỤC 1 */}
                <div className="terms-section">
                  <div className="section-title-box">
                    <span className="section-number-badge">01</span>
                    <Title level={3} className="terms-section-title">
                      Mục đích hoạt động
                    </Title>
                  </div>
                  <Paragraph className="terms-paragraph">
                    Website được xây dựng nhằm hỗ trợ công tác mục vụ, đào tạo
                    giáo lý hôn nhân, dự tòng, cung cấp thông tin, lịch học,
                    lịch thi và các thông báo chính thức từ Ban Hành Giáo Giáo
                    xứ Đồng Quan.
                  </Paragraph>
                </div>

                <Divider className="section-divider" />

                {/* MỤC 2 */}
                <div className="terms-section">
                  <div className="section-title-box">
                    <span className="section-number-badge">02</span>
                    <Title level={3} className="terms-section-title">
                      Quyền và trách nhiệm của học viên
                    </Title>
                  </div>
                  <Paragraph className="terms-paragraph">
                    Khi tham gia các khóa học và sử dụng dịch vụ trực tuyến, học
                    viên có trách nhiệm:
                  </Paragraph>
                  <ul className="custom-editorial-list">
                    <li>
                      Cung cấp thông tin cá nhân chính xác và trung thực khi
                      đăng ký khóa học.
                    </li>
                    <li>
                      Giữ bí mật thông tin tài khoản và mã tra cứu kết quả kiểm
                      tra.
                    </li>
                    <li>
                      Tuân thủ các quy định và hướng dẫn của Ban Mục vụ Giáo xứ.
                    </li>
                    <li>
                      Tôn trọng Quý Cha, Quý Giáo lý viên và các học viên khác
                      trong cộng đoàn.
                    </li>
                    <li>
                      Không đăng tải hoặc chia sẻ nội dung vi phạm pháp luật,
                      trái với Giáo luật và tinh thần Tin Mừng.
                    </li>
                  </ul>
                </div>

                <Divider className="section-divider" />

                {/* MỤC 3 */}
                <div className="terms-section">
                  <div className="section-title-box">
                    <span className="section-number-badge">03</span>
                    <Title level={3} className="terms-section-title">
                      Quy định về khóa học & khảo kinh
                    </Title>
                  </div>
                  <Paragraph className="terms-paragraph">
                    Học viên cần tham dự đầy đủ các bài học trực tuyến hoặc tại
                    lớp, đồng thời hoàn thành các bài kiểm tra khảo kinh theo
                    quy định của Ban Mục vụ.
                  </Paragraph>
                  <Paragraph className="terms-paragraph">
                    Ban Quản trị có quyền điều chỉnh nội dung bài giảng, chương
                    trình học hoặc lịch khảo kinh để phù hợp với định hướng mục
                    vụ của Giáo xứ.
                  </Paragraph>
                </div>

                <Divider className="section-divider" />

                {/* MỤC 4 */}
                <div className="terms-section">
                  <div className="section-title-box">
                    <span className="section-number-badge">04</span>
                    <Title level={3} className="terms-section-title">
                      Bảo mật thông tin cá nhân
                    </Title>
                  </div>
                  <Paragraph className="terms-paragraph">
                    Hệ thống chỉ thu thập các dữ liệu cần thiết phục vụ cho công
                    tác quản lý giáo lý:
                  </Paragraph>
                  <ul className="custom-editorial-list">
                    <li>Họ và tên, tên thánh, ngày tháng năm sinh.</li>
                    <li>Địa chỉ Email và số điện thoại liên lạc.</li>
                    <li>Giáo xứ trực thuộc và thông tin tiến trình học tập.</li>
                  </ul>
                  <Paragraph className="terms-paragraph">
                    Mọi dữ liệu cá nhân hoàn toàn được bảo mật và chỉ sử dụng
                    cho mục đích quản lý hồ sơ hôn phối và học tập trong phạm vi
                    Giáo xứ.
                  </Paragraph>
                </div>

                <Divider className="section-divider" />

                {/* MỤC 5 */}
                <div className="terms-section">
                  <div className="section-title-box">
                    <span className="section-number-badge">05</span>
                    <Title level={3} className="terms-section-title">
                      Giới hạn trách nhiệm
                    </Title>
                  </div>
                  <Paragraph className="terms-paragraph">
                    Ban Quản trị nỗ lực duy trì hệ thống hoạt động ổn định, tuy
                    nhiên không chịu trách nhiệm đối với các sự cố kỹ thuật gián
                    đoạn kết nối Internet từ phía thiết bị người dùng hoặc việc
                    sử dụng sai mục đích thông tin.
                  </Paragraph>
                </div>

                <Divider className="section-divider" />

                {/* MỤC 6 */}
                <div className="terms-section">
                  <div className="section-title-box">
                    <span className="section-number-badge">06</span>
                    <Title level={3} className="terms-section-title">
                      Thay đổi điều khoản
                    </Title>
                  </div>
                  <Paragraph className="terms-paragraph">
                    Các điều khoản này có thể được bổ sung hoặc cập nhật để phù
                    hợp hơn với thực tế hoạt động mục vụ của Giáo xứ trong từng
                    thời kỳ.
                  </Paragraph>
                </div>

                <Divider className="section-divider" />

                {/* MỤC 7: LIÊN HỆ */}
                <div className="terms-contact-card">
                  <div className="terms-contact-inner">
                    <Title level={4} className="contact-card-title">
                      Thông Tin Liên Hệ Ban Mục Vụ
                    </Title>
                    <Paragraph className="contact-card-text">
                      <Text strong style={{ color: primaryNavy, fontSize: 16 }}>
                        GIÁO XỨ ĐỒNG QUAN
                      </Text>
                      <br />
                      <Space style={{ marginTop: 8 }}>
                        <EnvironmentOutlined style={{ color: accentGold }} />
                        <span>Thôn Đồng Tâm, xã Vũ Quý, tỉnh Hưng Yên</span>
                      </Space>
                      <br />
                      <Space style={{ marginTop: 4 }}>
                        <PhoneOutlined style={{ color: accentGold }} />
                        <span>Điện thoại: 033 604 1807</span>
                      </Space>
                      <br />
                      <Space style={{ marginTop: 4 }}>
                        <MailOutlined style={{ color: accentGold }} />
                        <span>Email: giaoxudongquan@gmail.com</span>
                      </Space>
                    </Paragraph>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Content>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .terms-editorial-layout { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .terms-wrapper { 
            padding: 60px 16px 80px 16px; 
          }

          .terms-container { 
            max-width: 900px; 
            margin: 0 auto; 
          }

          .terms-main-card {
            border-radius: 20px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.05) !important;
            padding: 16px;
          }

          /* Header Styling */
          .terms-header-box { 
            text-align: center; 
            margin-bottom: 28px; 
          }

          .terms-tag-sacred {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            padding: 6px 18px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 14px;
          }

          .terms-main-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(28px, 4.5vw, 40px) !important; 
            font-weight: 700 !important; 
            color: ${primaryNavy} !important; 
            margin: 0 !important;
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin: 14px auto;
            border-radius: 2px;
          }

          .terms-lead-desc { 
            font-size: 15px; 
            color: #64748b; 
            max-width: 650px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* Section Body */
          .terms-body-content {
            padding: 10px 8px;
          }

          .terms-section {
            margin-bottom: 12px;
          }

          .section-title-box {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .section-number-badge {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            font-weight: 800;
            font-size: 13px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .terms-section-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-weight: 700 !important;
            font-size: 20px !important;
          }

          .terms-paragraph {
            font-size: 15px;
            line-height: 1.8;
            color: ${textDark};
            margin-bottom: 12px !important;
            text-align: justify;
          }

          /* Custom Editorial List */
          .custom-editorial-list { 
            list-style: none; 
            padding-left: 0; 
            margin: 0 0 16px 0; 
          }

          .custom-editorial-list li { 
            position: relative; 
            padding-left: 24px; 
            margin-bottom: 10px; 
            font-size: 15px;
            line-height: 1.7;
            color: ${textDark};
          }

          .custom-editorial-list li::before { 
            content: '✦'; 
            position: absolute; 
            left: 0; 
            top: 0; 
            color: ${accentGold}; 
            font-size: 14px; 
          }

          .section-divider {
            margin: 24px 0 !important;
            border-color: rgba(212, 175, 55, 0.15) !important;
          }

          /* Contact Card */
          .terms-contact-card {
            background: ${softBg};
            border-radius: 16px;
            border: 1px solid rgba(212, 175, 55, 0.3);
            padding: 20px 24px;
            margin-top: 24px;
          }

          .contact-card-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin-bottom: 12px !important;
            font-weight: 700 !important;
          }

          .contact-card-text {
            color: #64748b;
            font-size: 14px;
            line-height: 1.8;
            margin: 0 !important;
          }

          @media (max-width: 576px) {
            .terms-wrapper { padding: 40px 12px; }
            .terms-main-card { padding: 8px; }
            .terms-section-title { font-size: 18px !important; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default TermsPage;
