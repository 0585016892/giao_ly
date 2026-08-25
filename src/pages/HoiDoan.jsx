import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Button,
  ConfigProvider,
  Skeleton,
  Tag,
} from "antd";
import {
  ArrowRightOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  StarOutlined,
  ThunderboltOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groupApi";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const HoiDoan = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bảng màu Trắng & Navy / Vàng Kim
  const primaryNavy = "#1B365D";
  const accentGold = "#D4AF37";
  const pureWhite = "#FFFFFF";
  const softBg = "#F8FAFC";
  const borderLight = "#E2E8F0";

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
      <ConfigProvider theme={{ token: { colorPrimary: accentGold } }}>
        <div className="hoidoan-loading-white">
          <div className="loading-container">
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        </div>
      </ConfigProvider>
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
      <Layout className="hoidoan-white-layout">
        <Content className="editorial-content-wrapper">
          {/* HEADER TRẮNG SANG TRỌNG */}
          <div className="white-header-block" data-aos="fade-down">
            <div className="editorial-badge">
              <StarOutlined /> CỘNG ĐỒNG & PHỤC VỤ
            </div>
            <Title level={1} className="editorial-title-main">
              DANH SÁCH <span className="gold-accent-text">HỘI ĐOÀN</span>
            </Title>
            <div className="title-divider-line" />
            <Paragraph className="editorial-desc">
              “Vì ở đâu có hai ba người họp lại nhân danh Thầy, thì có Thầy ở
              đấy, giữa họ.”
              <span className="quote-source"> — Mt 18,20</span>
            </Paragraph>
          </div>

          {/* BỐ CỤC MỚI: DẠNG DANH SÁCH KHÔNG ĐỐI XỨNG LỚN (EDITORIAL LIST STAGGERED) */}
          <div className="timeline-groups-list">
            {groups.map((group, index) => {
              const isEven = index % 2 === 0;
              // const cardAccentColor = group.color || accentGold;

              return (
                <div
                  key={group.id || index}
                  className={`group-timeline-item ${
                    isEven ? "row-normal" : "row-reverse"
                  }`}
                  data-aos="fade-up"
                  data-aos-delay={index * 60}
                  onClick={() => navigate(`/hoi-doan/${group.slug}`)}
                >
                  {/* CỘT ẢNH LỚN BÊN TRÁI / PHẢI */}
                  <div className="group-image-col">
                    <div
                      className="group-cover-img"
                      style={{
                        backgroundImage: `url(${
                          group.image
                            ? group.image.startsWith("http")
                              ? group.image
                              : `${process.env.REACT_APP_API_URL || ""}${group.image}`
                            : "/fallback-img.jpg" // Ảnh mặc định nếu group.image bị undefined
                        })`,
                      }}
                    >
                      <span className="group-index-num">0{index + 1}</span>
                    </div>
                  </div>

                  {/* CỘT NỘI DUNG THÔNG TIN */}
                  <div className="group-info-col">
                    <div className="info-badge-row">
                      {group.patron && (
                        <Tag className="patron-pill-tag">
                          BỔN MẠNG: {group.patron.toUpperCase()}
                        </Tag>
                      )}
                      <span className="member-count-text">
                        <UsergroupAddOutlined
                          style={{ color: accentGold, marginRight: 4 }}
                        />
                        <strong>{group.members_count || 0}</strong> thành viên
                      </span>
                    </div>

                    <Title level={2} className="group-name-title">
                      {group.name}
                    </Title>

                    <Paragraph className="group-desc-editorial">
                      {group.description || group.desc}
                    </Paragraph>

                    <div className="group-card-footer">
                      <div className="founding-date">
                        <CompassOutlined style={{ color: primaryNavy }} />
                        <span>
                          Thành lập năm:{" "}
                          <strong>{group.founding_year || "---"}</strong>
                        </span>
                      </div>
                      <Button
                        type="link"
                        className="btn-discover-more"
                        icon={<ArrowRightOutlined />}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* KHU VỰC LỊCH SINH HOẠT THỜI TRANG NỀN TRẮNG */}
          <div className="white-schedule-section" data-aos="fade-up">
            <div className="schedule-header-flex">
              <div>
                <span className="section-sub-label">
                  <ThunderboltOutlined /> THỜI GIAN BIỂU
                </span>
                <Title level={2} className="schedule-title">
                  Lịch Sinh Hoạt Phụng Vụ
                </Title>
              </div>
              <Button type="primary" className="btn-navy-action" size="large">
                TẢI TOÀN BỘ LỊCH PHỤNG VỤ
              </Button>
            </div>

            <Row gutter={[20, 20]}>
              {[
                {
                  day: "Thứ Bảy",
                  title: "Tập Hát Ca Đoàn Tổng Hợp",
                  sub: "Chuẩn bị phụng vụ cho ngày Chúa Nhật",
                  time: "19:30",
                  tag: "Ca Đoàn",
                },
                {
                  day: "Chúa Nhật",
                  title: "Sinh Hoạt Ban Thanh Niên",
                  sub: "Học hỏi Lời Chúa & Rèn luyện kỹ năng sống",
                  time: "15:00",
                  tag: "Giới Trẻ",
                },
                {
                  day: "Hàng Tháng",
                  title: "Thánh Lễ Bổn Mạng Huynh Đoàn",
                  sub: "Kính nhớ các Thánh bảo trợ đoàn thể",
                  time: "18:00",
                  tag: "Huynh Đoàn",
                },
              ].map((item, idx) => (
                <Col xs={24} md={8} key={idx}>
                  <div className="schedule-white-card">
                    <span className="schedule-tag-pill">{item.tag}</span>
                    <div className="schedule-day-text">{item.day}</div>
                    <Title level={4} className="schedule-card-title">
                      {item.title}
                    </Title>
                    <Paragraph className="schedule-card-sub">
                      {item.sub}
                    </Paragraph>
                    <div className="schedule-time-box">
                      <ClockCircleOutlined style={{ color: primaryNavy }} />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>

          {/* BANNER ĐĂNG KÝ GIA NHẬP (CTA TRẮNG NỔI BẬT) */}
          <div className="white-cta-banner" data-aos="zoom-in">
            <div className="cta-content-wrap">
              <Title level={2} className="cta-white-title">
                Bạn Muốn Trở Thành Một Phần Của Giáo Xứ?
              </Title>
              <Paragraph className="cta-white-desc">
                Cùng các ban ngành & đoàn thể Giáo xứ dấn thân trong hành trình
                phục vụ và chia sẻ yêu thương.
              </Paragraph>
              <Button size="large" className="btn-gold-action">
                GỬI PHIẾU ĐĂNG KÝ GIA NHẬP
              </Button>
            </div>
          </div>
        </Content>

        {/* STYLESHEET SCOPED (WHITE THEME) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .hoidoan-loading-white {
            min-height: 100vh;
            background: ${pureWhite};
            padding: 100px 20px;
          }

          .hoidoan-white-layout {
            background-color: ${pureWhite};
            min-height: 100vh;
            font-family: 'Be Vietnam Pro', sans-serif;
            color: #1E293B;
          }

          .editorial-content-wrapper {
            max-width: 1200px;
            margin: 80px auto 0 auto;
            padding: 20px 20px 100px 20px;
          }

          /* HEADER STYLES */
          .white-header-block {
            text-align: center;
            margin-bottom: 70px;
          }

          .editorial-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #FEF08A;
            color: #854D0E;
            padding: 6px 18px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            margin-bottom: 16px;
          }

          .editorial-title-main {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-size: clamp(32px, 4.5vw, 50px) !important;
            font-weight: 700 !important;
            margin: 0 !important;
          }

          .gold-accent-text {
            color: ${accentGold};
          }

          .title-divider-line {
            width: 50px;
            height: 3px;
            background: ${accentGold};
            margin: 18px auto;
            border-radius: 2px;
          }

          .editorial-desc {
            color: #64748B;
            font-size: 16px;
            max-width: 650px;
            margin: 0 auto;
            line-height: 1.7;
            font-style: italic;
          }

          .quote-source {
            color: ${accentGold};
            font-weight: 600;
            font-style: normal;
          }

          /* BỐ CỤC DANH SÁCH THẺ NGANG THỜI TRANG (EDITORIAL STAGGERED LIST) */
          .timeline-groups-list {
            display: flex;
            flex-direction: column;
            gap: 40px;
            margin-bottom: 90px;
          }

          .group-timeline-item {
            display: flex;
            background: ${softBg};
            border: 1px solid ${borderLight};
            border-radius: 24px;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .group-timeline-item:hover {
            transform: translateY(-6px);
            box-shadow: 0 20px 40px rgba(27, 54, 93, 0.08);
            border-color: ${accentGold};
            background: ${pureWhite};
          }

          .row-normal { flex-direction: row; }
          .row-reverse { flex-direction: row-reverse; }

          .group-image-col {
            flex: 1;
            min-height: 320px;
            position: relative;
            overflow: hidden;
          }

          .group-cover-img {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            transition: transform 0.6s ease;
            position: relative;
          }

          .group-timeline-item:hover .group-cover-img {
            transform: scale(1.05);
          }

          .group-index-num {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(4px);
            color: ${primaryNavy};
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            font-size: 20px;
            width: 44px;
            height: 44px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }

          .group-info-col {
            flex: 1.2;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .info-badge-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
          }

          .patron-pill-tag {
            background: #FEF3C7 !important;
            color: #D97706 !important;
            border: none !important;
            font-weight: 700;
            border-radius: 20px;
            padding: 4px 12px;
            font-size: 11px;
          }

          .member-count-text {
            font-size: 13px;
            color: #64748B;
          }

          .group-name-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            margin: 0 0 14px 0 !important;
          }

          .group-desc-editorial {
            color: #475569;
            font-size: 15px;
            line-height: 1.7;
            margin-bottom: 24px;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .group-card-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 20px;
            border-top: 1px dashed ${borderLight};
          }

          .founding-date {
            font-size: 13px;
            color: #64748B;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .btn-discover-more {
            color: ${primaryNavy} !important;
            font-weight: 700;
            padding: 0;
          }

          .group-timeline-item:hover .btn-discover-more {
            color: ${accentGold} !important;
          }

          /* SCHEDULE BLOCK WHITE */
          .white-schedule-section {
            background: ${softBg};
            border: 1px solid ${borderLight};
            border-radius: 28px;
            padding: 40px;
            margin-bottom: 80px;
          }

          .schedule-header-flex {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 32px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .section-sub-label {
            color: ${accentGold};
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
          }

          .schedule-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 4px 0 0 0 !important;
            font-weight: 700 !important;
          }

          .btn-navy-action {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 600;
            height: 46px;
            border-radius: 10px;
          }

          .schedule-white-card {
            background: ${pureWhite};
            border: 1px solid ${borderLight};
            border-radius: 20px;
            padding: 24px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            transition: all 0.3s ease;
          }

          .schedule-white-card:hover {
            border-color: ${accentGold};
            box-shadow: 0 10px 24px rgba(27, 54, 93, 0.06);
            transform: translateY(-4px);
          }

          .schedule-tag-pill {
            position: absolute;
            top: 20px;
            right: 20px;
            font-size: 11px;
            font-weight: 700;
            color: #94A3B8;
            background: ${softBg};
            padding: 4px 10px;
            border-radius: 12px;
          }

          .schedule-day-text {
            color: ${accentGold};
            font-weight: 800;
            font-size: 14px;
            margin-bottom: 8px;
          }

          .schedule-card-title {
            color: ${primaryNavy} !important;
            font-size: 17px !important;
            margin: 0 0 8px 0 !important;
          }

          .schedule-card-sub {
            color: #64748B;
            font-size: 13px;
            margin-bottom: 20px;
          }

          .schedule-time-box {
            display: flex;
            align-items: center;
            gap: 8px;
            background: ${softBg};
            padding: 6px 14px;
            border-radius: 20px;
            width: fit-content;
            font-weight: 700;
            color: ${primaryNavy};
            font-size: 13px;
          }

          /* CTA BANNER WHITE */
          .white-cta-banner {
            background: linear-gradient(135deg, ${primaryNavy} 0%, #0F2342 100%);
            border-radius: 28px;
            padding: 60px 30px;
            text-align: center;
            color: ${pureWhite};
            box-shadow: 0 16px 36px rgba(27, 54, 93, 0.12);
          }

          .cta-content-wrap {
            max-width: 650px;
            margin: 0 auto;
          }

          .cta-white-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${accentGold} !important;
            font-weight: 700 !important;
            margin: 0 !important;
          }

          .cta-white-desc {
            color: rgba(255, 255, 255, 0.85);
            font-size: 15px;
            margin: 14px 0 32px 0;
            line-height: 1.6;
          }

          .btn-gold-action {
            background: ${accentGold} !important;
            border: none !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            height: 48px;
            padding: 0 36px;
            border-radius: 24px;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
          }

          .btn-gold-action:hover {
            transform: scale(1.04);
            background: ${pureWhite} !important;
          }

          /* RESPONSIVE */
          @media (max-width: 992px) {
            .group-timeline-item, .row-reverse {
              flex-direction: column !important;
            }
            .group-image-col { min-height: 240px; }
            .group-info-col { padding: 24px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default HoiDoan;
