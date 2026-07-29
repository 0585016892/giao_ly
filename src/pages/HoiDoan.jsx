import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ConfigProvider,
  Avatar,
  Space,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  ArrowRightOutlined,
  HeartFilled,
  ClockCircleOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groupApi";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const HoiDoan = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm Phá Cách
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Navy Đậm
  const accentGold = "#D4AF37"; // Vàng Đồng
  const softBg = "#FAFAFA"; // Trắng xám dịu mắt
  const textDark = "#1E293B";

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await getGroups();
        const data = res.data?.data || res.data || [];
        setGroups(data);
      } catch (err) {
        console.log("GET GROUPS ERROR:", err);
      }
      setLoading(false);
    };

    fetchGroups();
    AOS.init({ duration: 900, once: true });
  }, []);

  if (loading) {
    return (
      <div className="hoidoan-loading-wrapper">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 16,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="hoidoan-editorial-layout">
        {/* HERO HEADER EDITORIAL */}

        <Content
          className="modern-content-wrapper"
          style={{ paddingTop: "20px" }}
        >
          {/* TIÊU ĐỀ PHÂN ĐOẠN DANH SÁCH */}
          <div className="section-intro-block" data-aos="fade-up">
            <span className="section-subhead">HỘI ĐOÀN & ĐOÀN THỂ</span>
            <Title level={2} className="section-title-main">
              CỘNG ĐỒNG ĐỒNG QUAN
            </Title>
            <Paragraph className="section-desc">
              “Vì ở đâu có hai ba người họp lại nhân danh Thầy, thì có Thầy ở
              đấy, giữa họ.”
            </Paragraph>
            <span className="quote-source">(Mt 18,20)</span>
          </div>

          {/* BENTO GRID LAYOUT */}
          <Row gutter={[24, 24]} className="bento-grid-container">
            {groups.map((group, index) => {
              const isLargeCard = index % 3 === 0;
              const cardAccentColor = group.color || accentGold;

              return (
                <Col
                  xs={24}
                  sm={24}
                  md={isLargeCard ? 24 : 12}
                  lg={isLargeCard ? 16 : 8}
                  key={group.id || index}
                  data-aos="fade-up"
                  data-aos-delay={index * 60}
                >
                  <Card
                    hoverable
                    className={`bento-card ${isLargeCard ? "card-wide" : "card-standard"}`}
                    onClick={() => navigate(`/hoi-doan/${group.slug}`)}
                    bodyStyle={{
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {/* Card Top */}
                      <div className="bento-card-top">
                        <Space size={12}>
                          <Avatar
                            size={46}
                            className="bento-avatar"
                            style={{
                              backgroundColor: `${cardAccentColor}18`,
                              color: cardAccentColor,
                              border: `1px solid ${cardAccentColor}40`,
                            }}
                            icon={<HeartFilled />}
                          />
                          <div>
                            <Title level={4} className="bento-group-title">
                              {group.name}
                            </Title>
                            {group.patron && (
                              <Text className="bento-patron-text">
                                Bổn mạng: {group.patron}
                              </Text>
                            )}
                          </div>
                        </Space>

                        <Badge
                          count={`${group.members_count || 0} thành viên`}
                          className="bento-badge-member"
                        />
                      </div>

                      {/* Khung Ảnh */}
                      <div
                        className="bento-image-wrapper"
                        style={{
                          backgroundImage: `url(${process.env.REACT_APP_API_URL || ""}${group.image})`,
                          borderLeft: `4px solid ${cardAccentColor}`,
                        }}
                      />

                      {/* Đoạn Mô Tả */}
                      <Paragraph className="bento-description">
                        {group.description || group.desc}
                      </Paragraph>
                    </div>

                    {/* Card Footer */}
                    <div className="bento-card-footer">
                      <div className="meta-founding">
                        <CompassOutlined style={{ color: accentGold }} />
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, marginLeft: 6 }}
                        >
                          Thành lập: {group.founding_year || "---"}
                        </Text>
                      </div>
                      <Button
                        type="link"
                        icon={<ArrowRightOutlined />}
                        className="bento-action-link"
                      >
                        Khám phá chi tiết
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* KHU VỰC LỊCH SINH HOẠT TỐI GIẢN */}
          <div className="modern-schedule-block" data-aos="fade-up">
            <Row gutter={[32, 32]} align="middle">
              <Col xs={24} lg={10}>
                <div className="schedule-sticky-left">
                  <div className="icon-badge-box">
                    <CalendarOutlined
                      style={{ fontSize: 26, color: primaryNavy }}
                    />
                  </div>
                  <span className="schedule-subhead">02 / THỜI GIAN BIỂU</span>
                  <Title level={3} className="schedule-title-main">
                    Nhịp Sống & Lịch Sinh Hoạt
                  </Title>
                  <Text className="schedule-desc-text">
                    Các hội đoàn quy tụ gặp gỡ, học hỏi giáo lý và tập hát định
                    kỳ hằng tuần sau các Thánh lễ để duy trì ngọn lửa phục vụ.
                  </Text>
                  <Button
                    type="primary"
                    size="large"
                    className="schedule-btn-navy"
                  >
                    TẢI TOÀN BỘ LỊCH PHỤNG VỤ
                  </Button>
                </div>
              </Col>

              <Col xs={24} lg={14}>
                <div className="schedule-timeline-wrapper">
                  {[
                    {
                      day: "Thứ Bảy",
                      title: "Tập hát Ca đoàn Tổng hợp",
                      sub: "Chuẩn bị phụng vụ cho ngày Chúa Nhật",
                      time: "19:30",
                    },
                    {
                      day: "Chúa Nhật",
                      title: "Sinh hoạt Ban Thanh Niên",
                      sub: "Học hỏi Lời Chúa & Rèn luyện kỹ năng sống",
                      time: "15:00",
                    },
                    {
                      day: "Hàng Tháng",
                      title: "Thánh Lễ Bổn Mạng Huynh Đoàn",
                      sub: "Kính nhớ các Thánh bảo trợ đoàn thể",
                      time: "18:00",
                    },
                  ].map((item, idx) => (
                    <div className="timeline-row-item" key={idx}>
                      <div className="timeline-badge-day">{item.day}</div>
                      <div className="timeline-body-content">
                        <Text strong className="timeline-item-title">
                          {item.title}
                        </Text>
                        <Text type="secondary" className="timeline-item-sub">
                          {item.sub}
                        </Text>
                      </div>
                      <div className="timeline-time-tag">
                        <ClockCircleOutlined
                          style={{
                            marginRight: 6,
                            fontSize: 13,
                            color: accentGold,
                          }}
                        />
                        {item.time}
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </div>

          {/* KHỐI GIA NHẬP (CTA) BANNER */}
          <div className="modern-cta-banner" data-aos="zoom-in">
            <div className="cta-inner-content">
              <Title level={3} className="cta-title">
                Bạn Đang Tìm Kiếm Một Môi Trường Sinh Hoạt?
              </Title>
              <Paragraph className="cta-desc">
                Hãy cùng Ban Thanh Niên và các đoàn thể dấn thân trong hành
                trình phục vụ, chia sẻ yêu thương và làm chứng cho Tin Mừng.
              </Paragraph>
              <Button size="large" className="cta-button-gold">
                GỬI PHIẾU ĐĂNG KÝ GIA NHẬP
              </Button>
            </div>
          </div>
        </Content>

        {/* CSS SCOPED DEDICATED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .hoidoan-loading-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: ${softBg};
          }

          .hoidoan-editorial-layout { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .modern-content-wrapper { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px 80px 20px; 
          }
          
          /* Hero Section */
          .modern-hero-section {
            height: 380px;
            background-image: url('https://images.unsplash.com/photo-1438232992991-995b7058633e?auto=format&fit=crop&q=80&w=2000');
            background-position: center 35%;
            background-size: cover;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            margin-bottom: 60px;
          }

          .hero-blur-backdrop {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(15, 31, 56, 0.88) 0%, rgba(250, 250, 250, 1) 100%);
          }

          .hero-core-content { 
            position: relative; 
            z-index: 2; 
            padding: 0 20px; 
            max-width: 800px;
          }

          .hero-tag-sacred {
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid ${accentGold};
            color: ${accentGold};
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .hero-title-main { 
            color: #ffffff !important; 
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(30px, 4.5vw, 44px) !important; 
            font-weight: 700 !important; 
            letter-spacing: -0.5px; 
            margin: 14px 0 0 0 !important; 
          }

          .hero-accent-line { 
            width: 60px; 
            height: 3px; 
            background: ${accentGold}; 
            margin: 16px auto; 
            border-radius: 2px; 
          }

          .hero-quote-script { 
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 16px; 
            font-style: italic; 
            color: rgba(255, 255, 255, 0.9); 
            line-height: 1.6; 
          }

          .quote-source {
            color: ${accentGold};
            font-weight: 600;
            font-style: normal;
          }
          
          /* Section Intro */
          .section-intro-block { 
            text-align: center; 
            margin-bottom: 48px; 
          }

          .section-subhead {
            font-size: 11px;
            letter-spacing: 2px;
            color: ${accentGold};
            font-weight: 700;
            text-transform: uppercase;
            display: block;
            margin-bottom: 6px;
          }

          .section-title-main {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            margin: 0 !important;
          }

          .section-desc {
            color: #64748b;
            font-size: 15px;
            max-width: 650px;
            margin: 12px auto 0 auto;
            line-height: 1.6;
          }

          /* Bento Grid Cards System */
          .bento-grid-container { margin-bottom: 64px; }

          .bento-card {
            background: #ffffff;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.04);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .bento-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 36px rgba(27, 54, 93, 0.12);
            border-color: ${accentGold};
          }

          .bento-card-top { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 20px; 
            width: 100%; 
          }

          .bento-group-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            margin: 0 !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
          }

          .bento-patron-text {
            font-size: 12px;
            color: ${accentGold};
            font-weight: 600;
            display: block;
          }

          .bento-badge-member .ant-badge-count {
            background-color: #f1f5f9 !important;
            color: ${primaryNavy} !important;
            border: 1px solid rgba(27, 54, 93, 0.15);
            font-weight: 600;
          }

          .bento-image-wrapper {
            height: 160px;
            background-size: cover;
            background-position: center;
            border-radius: 12px;
            margin-bottom: 20px;
            background-color: #f8fafc;
          }

          .card-wide .bento-image-wrapper { height: 210px; }

          .bento-description {
            color: #475569;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
            text-align: justify;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .card-wide .bento-description { -webkit-line-clamp: 5; }

          .bento-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            border-top: 1px dashed rgba(212, 175, 55, 0.25);
            margin-top: auto;
          }

          .meta-founding { display: flex; align-items: center; }

          .bento-action-link { 
            font-weight: 700; 
            padding: 0; 
            display: flex; 
            align-items: center; 
            gap: 4px; 
            color: ${primaryNavy} !important;
          }

          .bento-action-link:hover {
            color: ${accentGold} !important;
          }

          /* Schedule Block Design */
          .modern-schedule-block {
            background: #ffffff;
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 64px;
            box-shadow: 0 8px 30px rgba(27, 54, 93, 0.05);
          }

          .icon-badge-box { 
            background: rgba(212, 175, 55, 0.15); 
            width: 52px; 
            height: 52px; 
            border-radius: 14px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            border: 1px solid ${accentGold};
            margin-bottom: 16px;
          }

          .schedule-subhead {
            font-size: 11px;
            letter-spacing: 2px;
            color: ${accentGold};
            font-weight: 700;
            text-transform: uppercase;
          }

          .schedule-title-main {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            margin-top: 6px !important;
          }

          .schedule-desc-text {
            color: #64748b;
            display: block;
            margin-bottom: 24px;
            font-size: 14px;
            line-height: 1.6;
          }

          .schedule-btn-navy {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            color: #ffffff !important;
            font-weight: 600;
            border-radius: 8px;
            height: 44px;
          }

          .schedule-btn-navy:hover {
            background: #132744 !important;
          }

          .schedule-timeline-wrapper { display: flex; flex-direction: column; gap: 14px; }

          .timeline-row-item {
            display: flex;
            align-items: center;
            padding: 18px 20px;
            background: ${softBg};
            border-radius: 14px;
            border: 1px solid rgba(27, 54, 93, 0.08);
            transition: all 0.25s ease;
          }

          .timeline-row-item:hover { 
            background: #ffffff; 
            border-color: ${accentGold};
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.06);
            transform: translateX(4px);
          }

          .timeline-badge-day { 
            min-width: 110px; 
            font-weight: 700; 
            color: ${primaryNavy}; 
            font-size: 15px; 
          }

          .timeline-body-content { flex: 1; padding-right: 16px; }

          .timeline-item-title { font-size: 15px; color: ${textDark}; }

          .timeline-item-sub { display: block; font-size: 12px; margin-top: 2px; color: #64748b; }

          .timeline-time-tag { 
            background: #ffffff; 
            padding: 6px 14px; 
            border-radius: 20px; 
            font-size: 13px; 
            font-weight: 700; 
            color: ${primaryNavy}; 
            display: flex; 
            align-items: center; 
            border: 1px solid rgba(212, 175, 55, 0.3); 
          }

          /* Call To Action Banner */
          .modern-cta-banner {
            background: linear-gradient(135deg, ${primaryNavy} 0%, ${deepNavy} 100%);
            padding: 50px 40px;
            border-radius: 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
            border: 1px solid ${accentGold};
            box-shadow: 0 16px 36px rgba(27, 54, 93, 0.2);
          }

          .cta-inner-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }

          .cta-title {
            color: ${accentGold} !important;
            font-family: 'Playfair Display', Georgia, serif !important;
            font-weight: 700 !important;
            margin: 0 !important;
          }

          .cta-desc {
            color: rgba(255, 255, 255, 0.85);
            font-size: 15px;
            margin: 12px 0 28px 0;
            max-width: 620px;
            line-height: 1.6;
          }

          .cta-button-gold {
            background: ${accentGold} !important;
            border: none !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            height: 48px;
            padding: 0 36px;
            border-radius: 24px;
            transition: transform 0.2s, background 0.2s;
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35);
          }

          .cta-button-gold:hover {
            transform: scale(1.03);
            background: #ffffff !important;
            color: ${primaryNavy} !important;
          }

          /* Responsive Breakpoints */
          @media (max-width: 768px) {
            .modern-hero-section { height: 320px; margin-bottom: 40px; }
            .modern-schedule-block { padding: 24px; }
            .timeline-row-item { flex-direction: column; align-items: flex-start; gap: 8px; }
            .timeline-badge-day { min-width: auto; }
            .modern-cta-banner { padding: 36px 20px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default HoiDoan;
