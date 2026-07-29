import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Tag,
  Tabs,
  Empty,
  ConfigProvider,
  Spin,
  Button,
} from "antd";
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FireFilled,
  CompassOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getEvents } from "../api/eventApi";

const { Title, Text, Paragraph } = Typography;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Bảng màu Option 1: Phá cách Tôn Nghiêm (Xanh Đêm Navy Đậm, Vàng Đồng, Nền Đêm Sacred Navy)
  const primaryNavy = "#1B365D"; // Navy Xanh Đêm
  const deepNavy = "#0F1F38"; // Navy Đậm Nền Trang
  const accentGold = "#D4AF37"; // Vàng Đồng
  const lightBg = "#FAFAFA";

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      const data = res.data.data || res.data || [];
      setEvents(data);
    } catch (err) {
      console.log(err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Sự kiện & Tin tức | Giáo xứ Đồng Quan";
    fetchEvents();
    AOS.init({ duration: 900, once: true });
  }, []);

  // Tách sự kiện nổi bật đầu tiên (Hero Event)
  const heroEvent = events.length > 0 ? events[0] : null;
  const otherEvents = events.length > 1 ? events.slice(1) : events;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <div className="glhn-events-editorial-page">
        {/* HEADER TẠP CHÍ SANG TRỌNG */}
        <header className="glhn-events-header" data-aos="fade-down">
          <div className="header-inner-container">
            <div className="header-top-tag">
              <CompassOutlined /> CỘNG ĐỒNG & MỤC VỤ GIÁO XỨ
            </div>
            <Title className="glhn-editorial-headline">
              SỰ KIỆN <span>& TIN TỨC</span>
            </Title>
            <div className="header-sub-meta">
              <Text className="meta-year">GIÁO XỨ ĐỒNG QUAN — 2026</Text>
              <Paragraph className="meta-desc">
                Lưu giữ những nhịp đập đức tin, khoảnh khắc phụng vụ và đời sống
                cộng đoàn qua từng bài viết.
              </Paragraph>
            </div>
          </div>
        </header>

        <main className="glhn-events-container">
          {loading ? (
            <div className="events-loading-box">
              <Spin size="large" />
            </div>
          ) : (
            <Tabs
              defaultActiveKey="1"
              className="glhn-custom-tabs"
              items={[
                {
                  key: "1",
                  label: "TẤT CẢ TÍNH NĂNG & MỚI NHẤT",
                  children: (
                    <>
                      {/* SỰ KIỆN HERO NỔI BẬT LỚN (ĐẦU TRANG) */}
                      {heroEvent && (
                        <div
                          className="glhn-hero-event-showcase"
                          data-aos="zoom-in"
                          onClick={() => navigate(`/su-kien/${heroEvent.slug}`)}
                        >
                          <div
                            className="hero-event-bg"
                            style={{
                              backgroundImage: heroEvent.images?.[0]
                                ? `url(${process.env.REACT_APP_API_URL}${heroEvent.images[0]})`
                                : "url('https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1200')",
                            }}
                          >
                            <div className="hero-event-overlay" />
                          </div>

                          <div className="hero-event-content">
                            <div className="hero-tag-bar">
                              <Tag className="hero-category-tag">
                                <FireFilled style={{ color: accentGold }} />{" "}
                                {heroEvent.category || "TIN NỔI BẬT"}
                              </Tag>
                              <Text className="hero-event-date">
                                <CalendarOutlined /> {heroEvent.event_date}
                              </Text>
                            </div>

                            <div className="hero-event-body">
                              <Title level={2} className="hero-event-title">
                                {heroEvent.title}
                              </Title>
                              <Paragraph className="hero-event-desc">
                                {heroEvent.desc || heroEvent.summary}
                              </Paragraph>

                              <div className="hero-event-footer">
                                <span className="hero-event-location">
                                  <EnvironmentOutlined />{" "}
                                  {heroEvent.location || "Nhà thờ Giáo xứ"}
                                </span>
                                <Button shape="round" className="hero-read-btn">
                                  XEM CHI TIẾT <ArrowRightOutlined />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* DANH SÁCH BENTO GRID ASYMMETRIC CHO CÁC BÀI VIẾT KHÁC */}
                      <Row gutter={[24, 28]} className="glhn-events-grid">
                        {otherEvents.map((item, index) => {
                          const isWide = index % 4 === 0 || index % 4 === 3;
                          return (
                            <Col
                              xs={24}
                              md={isWide ? 14 : 10}
                              lg={isWide ? 14 : 10}
                              key={item.id || index}
                              data-aos="fade-up"
                              data-aos-delay={index * 80}
                            >
                              <div
                                className={`glhn-event-card ${isWide ? "card-wide" : "card-standard"}`}
                                onClick={() =>
                                  navigate(`/su-kien/${item.slug}`)
                                }
                              >
                                <div className="card-media-box">
                                  <img
                                    src={
                                      item.images?.[0]
                                        ? `${process.env.REACT_APP_API_URL}${item.images[0]}`
                                        : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
                                    }
                                    alt={item.title}
                                  />
                                  <div className="card-media-overlay" />
                                  <Tag className="card-category-pill">
                                    {item.category || "SỰ KIỆN"}
                                  </Tag>
                                </div>

                                <div className="card-details-box">
                                  <div className="card-date-meta">
                                    <CalendarOutlined
                                      style={{ color: accentGold }}
                                    />{" "}
                                    {item.event_date}
                                  </div>
                                  <Title level={4} className="card-title-text">
                                    {item.title}
                                  </Title>
                                  <Paragraph className="card-desc-text">
                                    {item.desc || item.summary}
                                  </Paragraph>

                                  <div className="card-footer-meta">
                                    <span className="card-loc-text">
                                      <EnvironmentOutlined />{" "}
                                      {item.location || "Giáo xứ Đồng Quan"}
                                    </span>
                                    <div className="card-arrow-icon">
                                      <ArrowRightOutlined />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </>
                  ),
                },
                {
                  key: "2",
                  label: "KHO LƯU TRỮ PHỤNG VỤ",
                  children: (
                    <div className="empty-archive-box">
                      <Empty description="Dữ liệu các năm trước đang được số hóa và cập nhật..." />
                    </div>
                  ),
                },
              ]}
            />
          )}
        </main>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .glhn-events-editorial-page {
            background-color: ${lightBg};
            min-height: 100vh;
            padding-bottom: 90px;
            color: #1E293B;
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .glhn-events-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .events-loading-box {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 100px 0;
          }

          /* MAGAZINE HEADER */
          .glhn-events-header {
            padding: 70px 20px 40px;
            max-width: 1200px;
            margin: 0 auto;
          }

          .header-top-tag {
            font-size: 11px;
            letter-spacing: 2px;
            color: ${accentGold};
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-transform: uppercase;
            margin-bottom: 12px;
          }

          .glhn-editorial-headline {
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(36px, 6vw, 56px) !important;
            font-weight: 800 !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            line-height: 1.15 !important;
            letter-spacing: -0.5px;
          }

          .glhn-editorial-headline span {
            color: transparent;
            -webkit-text-stroke: 1.5px ${primaryNavy};
            font-style: italic;
            font-weight: 400;
          }

          .header-sub-meta {
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 2px solid ${accentGold};
            padding-top: 20px;
            gap: 20px;
          }

          .meta-year {
            font-weight: 800;
            letter-spacing: 1.5px;
            font-size: 13px;
            color: ${primaryNavy};
            white-space: nowrap;
          }

          .meta-desc {
            max-width: 500px;
            margin: 0;
            color: #64748b;
            font-size: 15px;
            line-height: 1.6;
          }

          /* TABS STYLING */
          .glhn-custom-tabs { margin-bottom: 40px; }
          .glhn-custom-tabs .ant-tabs-nav::before { border-bottom: 1px solid rgba(27, 54, 93, 0.1); }

          .glhn-custom-tabs .ant-tabs-tab {
            font-weight: 700 !important;
            font-size: 12px !important;
            letter-spacing: 1px !important;
            padding: 12px 24px !important;
            border-radius: 30px !important;
            border: 1px solid rgba(27, 54, 93, 0.15) !important;
            transition: all 0.3s ease !important;
            background: #ffffff !important;
          }

          .glhn-custom-tabs .ant-tabs-tab-active {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
          }

          .glhn-custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: ${accentGold} !important;
          }

          .glhn-custom-tabs .ant-tabs-ink-bar { display: none; }

          /* HERO SHOWCASE EVENT */
          .glhn-hero-event-showcase {
            position: relative;
            height: 480px;
            border-radius: 24px;
            overflow: hidden;
            margin-bottom: 40px;
            cursor: pointer;
            border: 1px solid ${accentGold};
            box-shadow: 0 16px 40px rgba(27, 54, 93, 0.12);
            transition: transform 0.4s ease;
          }

          .glhn-hero-event-showcase:hover {
            transform: translateY(-4px);
          }

          .hero-event-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
          }

          .hero-event-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(15, 31, 56, 0.2) 0%, rgba(15, 31, 56, 0.92) 100%);
          }

          .hero-event-content {
            position: relative;
            z-index: 10;
            height: 100%;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #ffffff;
          }

          .hero-tag-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .hero-category-tag {
            background: rgba(212, 175, 55, 0.2) !important;
            border: 1px solid ${accentGold} !important;
            color: ${accentGold} !important;
            font-weight: 700;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 11px;
            letter-spacing: 1px;
          }

          .hero-event-date {
            color: rgba(255, 255, 255, 0.85);
            font-weight: 600;
            font-size: 13px;
          }

          .hero-event-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: #ffffff !important;
            font-size: 32px !important;
            margin-bottom: 12px !important;
            font-weight: 700 !important;
          }

          .hero-event-desc {
            color: rgba(255, 255, 255, 0.8) !important;
            font-size: 15px !important;
            max-width: 750px;
            margin-bottom: 24px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .hero-event-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(212, 175, 55, 0.3);
            padding-top: 20px;
          }

          .hero-event-location {
            color: ${accentGold};
            font-weight: 600;
            font-size: 14px;
          }

          .hero-read-btn {
            background: ${accentGold} !important;
            color: ${primaryNavy} !important;
            border: none !important;
            font-weight: 700;
            padding: 0 24px;
            height: 40px;
          }

          /* CARDS GRID SYSTEM */
          .glhn-event-card {
            background: #ffffff;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(27, 54, 93, 0.1);
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.04);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .glhn-event-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 36px rgba(27, 54, 93, 0.12);
            border-color: ${accentGold};
          }

          .card-media-box {
            position: relative;
            height: 220px;
            overflow: hidden;
          }

          .card-media-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s ease;
          }

          .glhn-event-card:hover .card-media-box img {
            transform: scale(1.08);
          }

          .card-media-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(15, 31, 56, 0.6) 100%);
          }

          .card-category-pill {
            position: absolute;
            top: 16px;
            left: 16px;
            background: rgba(15, 31, 56, 0.85) !important;
            border: 1px solid ${accentGold} !important;
            color: ${accentGold} !important;
            font-weight: 700;
            font-size: 10px;
            padding: 4px 12px;
            border-radius: 20px;
            letter-spacing: 0.5px;
          }

          .card-details-box {
            padding: 24px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .card-date-meta {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .card-title-text {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-size: 20px !important;
            margin: 0 0 10px 0 !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
          }

          .card-desc-text {
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .card-footer-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px dashed rgba(27, 54, 93, 0.12);
            padding-top: 16px;
            margin-top: auto;
          }

          .card-loc-text {
            font-size: 12px;
            color: ${primaryNavy};
            font-weight: 600;
          }

          .card-arrow-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(27, 54, 93, 0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${primaryNavy};
            transition: all 0.3s ease;
          }

          .glhn-event-card:hover .card-arrow-icon {
            background: ${accentGold};
            color: ${primaryNavy};
            transform: translateX(4px);
          }

          .empty-archive-box {
            padding: 80px 0;
            text-align: center;
          }

          /* RESPONSIVE */
          @media (max-width: 768px) {
            .glhn-events-header { padding: 40px 16px 20px; }
            .header-sub-meta { flex-direction: column; align-items: flex-start; }
            .glhn-hero-event-showcase { height: 420px; }
            .hero-event-content { padding: 24px; }
            .hero-event-title { font-size: 22px !important; }
            .hero-event-desc { display: none; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventPage;
