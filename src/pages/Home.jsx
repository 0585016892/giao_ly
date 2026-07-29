import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Button,
  Carousel,
  Badge,
  ConfigProvider,
  Spin,
} from "antd";
import {
  HeartFilled,
  MailFilled,
  CheckCircleOutlined,
  FireFilled,
  ArrowRightOutlined,
  CalendarOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getSlides } from "../api/slideApi";
import dayjs from "dayjs";
import { getWeekSchedule } from "../api/scheduleApi";

const { Title, Paragraph, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Bảng màu Option 1: Truyền Thống Phá Cách (Navy Đậm, Gold Ánh Kim, Nền Trắng Ngọc Bích Mờ)
  const primaryNavy = "#0F1F38"; // Deep Cathedral Navy
  const accentGold = "#D4AF37"; // Gold Metallic
  const softBg = "#F8F9FA"; // Warm Porcelain White
  const textDark = "#0F172A";

  useEffect(() => {
    AOS.init({ duration: 900, once: false, offset: 80 });
  }, []);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoadingSlides(true);
        const res = await getSlides({ is_active: 1, sort: "sort_order" });
        const data = (res || res.data || []).sort(
          (a, b) => a.sort_order - b.sort_order,
        );
        setSlides(data);
      } catch (err) {
        setSlides([]);
      } finally {
        setLoadingSlides(false);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoadingSchedule(true);
        const weekStart = dayjs()
          .startOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD");
        const res = await getWeekSchedule({ start_date: weekStart });
        const events = res?.data?.data || [];

        const grouped = events.reduce((acc, curr) => {
          const date = curr.event_date;
          if (!acc[date]) acc[date] = [];
          acc[date].push(curr);
          return acc;
        }, {});

        const sortedDays = Object.keys(grouped)
          .sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
          .map((date) => ({
            date,
            items: grouped[date].sort((a, b) =>
              a.event_time.localeCompare(b.event_time),
            ),
          }));

        setWeeklySchedule(sortedDays);
      } catch (err) {
        console.error("Lỗi gọi API lịch lễ:", err);
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchScheduleData();
  }, []);

  const activeSlides = slides.filter((slide) => slide.is_active === 1);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentGold,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <div className="glhn-editorial-home">
        {/* 1. HERO PHÁ CÁCH - BỐ CỤC BẤT ĐỐI XỨNG & GLASS CARDS */}
        <section className="glhn-hero-editorial">
          {loadingSlides ? (
            <div style={{ textAlign: "center", padding: 120 }}>
              <Spin size="large" />
            </div>
          ) : (
            <div className="glhn-hero-wrapper">
              <Carousel
                autoplay
                effect="fade"
                speed={1000}
                dots={{ className: "glhn-dots-custom" }}
              >
                {(activeSlides.length > 0
                  ? activeSlides
                  : [
                      {
                        id: "default",
                        title: "Giáo Xứ Đồng Quan",
                        subtitle:
                          "Đồng hành cùng gia đình trẻ bước vào hành trình Hôn Nhân & Đức Tin",
                        created_at: new Date(),
                      },
                    ]
                ).map((slide) => (
                  <div key={slide.id}>
                    <div
                      className="glhn-hero-backdrop"
                      style={{
                        backgroundImage: slide.image
                          ? `url(${process.env.REACT_APP_API_URL}${slide.image})`
                          : "url('https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1600')",
                      }}
                    >
                      <div className="glhn-hero-gradient-overlay" />
                      <div className="glhn-hero-editorial-container">
                        {/* Khối chữ bên trái */}
                        <div
                          className="glhn-hero-text-box"
                          data-aos="fade-right"
                        >
                          <span className="glhn-tag-sacred">
                            <CalendarOutlined /> PHỤNG VỤ & GIÁO LÝ
                          </span>
                          <Title className="glhn-editorial-title">
                            {slide.title}
                          </Title>
                          <Paragraph className="glhn-editorial-sub">
                            {slide.subtitle}
                          </Paragraph>

                          <div className="glhn-hero-actions">
                            <Button
                              type="primary"
                              size="large"
                              className="glhn-editorial-btn-gold"
                              onClick={() => navigate("/giao-ly/hon-nhan")}
                            >
                              KHÁM PHÁ KHÓA HỌC <ArrowRightOutlined />
                            </Button>
                          </div>
                        </div>

                        {/* Thẻ Glassmorphism Floating bên phải */}
                        <div
                          className="glhn-hero-floating-card"
                          data-aos="fade-left"
                        >
                          <div className="glhn-glass-inner">
                            <FireFilled className="glhn-glass-icon" />
                            <Text className="glhn-glass-caption">
                              CÂU LỜI CHÚA HẰNG NGÀY
                            </Text>
                            <Paragraph className="glhn-glass-quote">
                              “Sự gì Thiên Chúa đã phối hợp, loài người không
                              được phân ly.”
                            </Paragraph>
                            <Text className="glhn-glass-author">
                              — Ma-thêu 19, 6
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          )}
        </section>

        {/* 2. CHỨC NĂNG - MASONRY GRID BẤT QUY TẮC */}
        <section className="glhn-section-editorial" data-aos="fade-up">
          <div className="glhn-container">
            <div className="glhn-section-header-left">
              <span className="glhn-subhead">01 / CỘNG ĐỒNG</span>
              <Title level={2} className="glhn-head-title">
                Nhịp Sống Giáo Xứ
              </Title>
              <div className="glhn-gold-line" />
            </div>

            <Row gutter={[28, 28]} className="glhn-masonry-grid">
              {/* Thẻ 1: Sự kiện (Lớn) */}
              <Col xs={24} md={12} lg={14} data-aos="zoom-in-right">
                <div
                  className="glhn-feature-card card-large"
                  onClick={() => navigate("/su-kien")}
                >
                  <div className="card-bg-glow glow-gold" />
                  <div className="card-content">
                    <span className="card-badge">SỰ KIỆN NỔI BẬT</span>
                    <Title level={3} className="card-title">
                      Lịch Phụng Vụ & Lễ Trọng
                    </Title>
                    <Paragraph className="card-desc">
                      Cập nhật liên tục các ngày lễ lớn, lễ quan thầy và các
                      hoạt động cộng đoàn tại Thánh Đường.
                    </Paragraph>
                    <span className="card-link">
                      XEM LỊCH SỰ KIỆN <ArrowRightOutlined />
                    </span>
                  </div>
                  <FireFilled className="card-watermark-icon" />
                </div>
              </Col>

              {/* Thẻ 2: Bác ái */}
              <Col xs={24} sm={12} lg={10} data-aos="zoom-in-left">
                <div
                  className="glhn-feature-card card-medium"
                  onClick={() => navigate("/hoi-doan")}
                >
                  <div className="card-content">
                    <HeartFilled
                      className="card-icon-small"
                      style={{ color: "#E11D48" }}
                    />
                    <Title level={4} className="card-title">
                      Hội Đoàn
                    </Title>
                    <Paragraph className="card-desc">
                      Nâng đỡ các gia đình khó khăn, lan tỏa tình yêu Thương
                      Nhau như Chúa đã yêu thương.
                    </Paragraph>
                    <span className="card-link">
                      TÌM HIỂU THÊM <ArrowRightOutlined />
                    </span>
                  </div>
                </div>
              </Col>

              {/* Thẻ 3: Hội đoàn */}
              <Col xs={24} sm={12} lg={24} data-aos="fade-up">
                <div
                  className="glhn-feature-card card-banner"
                  onClick={() => navigate("/hoi-doan")}
                >
                  <div className="card-banner-inner">
                    <MailFilled className="card-banner-icon" />
                    <div>
                      <Title
                        level={4}
                        className="card-title"
                        style={{ color: "#fff", margin: 0 }}
                      >
                        Sinh Hoạt Các Hội Đoàn & Ca Đoàn
                      </Title>
                      <Paragraph
                        style={{
                          color: "rgba(255,255,255,0.7)",
                          margin: "4px 0 0",
                        }}
                      >
                        Nơi người trẻ và các gia đình cùng cất tiếng hát tôn
                        vinh Cha trên trời.
                      </Paragraph>
                    </div>
                    <Button shape="round" className="glhn-white-pill-btn">
                      THAM GIA NGAY
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* 3. LỊCH PHỤNG VỤ - BẢNG TIN INTERACTIVE DECK */}
        <section
          className="glhn-section-editorial glhn-bg-navy"
          data-aos="fade-up"
        >
          <div className="glhn-container">
            <div className="glhn-section-header-center">
              <span className="glhn-subhead-gold">02 / THỜI GIAN BIỂU</span>
              <Title level={2} className="glhn-head-title-white">
                Lịch Phụng Vụ Trong Tuần
              </Title>
              <p className="glhn-subtext-white">
                Thánh lễ là nguồn gốc và đỉnh cao của đời sống Kitô hữu
              </p>
            </div>

            {loadingSchedule ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <Spin size="large" />
              </div>
            ) : (
              <div className="glhn-deck-grid">
                {weeklySchedule.map((day, idx) => {
                  const isSunday = dayjs(day.date).day() === 0;
                  return (
                    <div
                      key={idx}
                      className={`glhn-deck-card ${isSunday ? "is-sunday-deck" : ""}`}
                      data-aos="flip-up"
                      data-aos-delay={idx * 80}
                    >
                      <div className="deck-header">
                        <span className="deck-day-name">
                          {dayjs(day.date).format("dddd")}
                        </span>
                        <span className="deck-date">
                          {dayjs(day.date).format("DD/MM")}
                        </span>
                      </div>

                      <div className="deck-body">
                        {day.items.map((item, i) => (
                          <div key={i} className="deck-event-item">
                            <span className="deck-time">
                              {item.event_time.slice(0, 5)}
                            </span>
                            <div className="deck-info">
                              <Text className="deck-event-title">
                                {item.title}
                              </Text>
                              <Text className="deck-event-loc">
                                {item.church_name || "Nhà thờ Chính"}
                              </Text>
                            </div>
                            {item.is_priority === 1 && (
                              <Badge
                                count="Lễ Trọng"
                                style={{
                                  backgroundColor: accentGold,
                                  color: primaryNavy,
                                  fontWeight: "bold",
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 4. GIỚI THIỆU - KHUNG HÌNH VÒM CỔ ĐIỂN ARCHED */}
        <section className="glhn-section-editorial" data-aos="fade-up">
          <div className="glhn-container">
            <Row gutter={[60, 40]} align="middle">
              <Col xs={24} md={11} data-aos="zoom-in">
                <div className="glhn-cathedral-arch-frame">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000"
                    alt="Giáo lý Hôn nhân"
                  />
                  <div className="arch-border-accent" />
                </div>
              </Col>

              <Col xs={24} md={13} data-aos="fade-left">
                <span className="glhn-subhead">03 / ĐỨC TIN & HÔN NHÂN</span>
                <Title level={2} className="glhn-head-title">
                  Sứ Mạng & Nền Tảng
                </Title>
                <Paragraph className="glhn-paragraph-editorial">
                  Xây dựng một gia đình Công giáo hạnh phúc bắt nguồn từ việc
                  chuẩn bị vững vàng về mặt Đức Tin, Tâm Lý và Giáo Lý Hôn Nhân.
                </Paragraph>

                <div className="glhn-checklist-editorial">
                  <div className="checklist-item">
                    <CheckCircleOutlined className="check-icon" />
                    <div>
                      <Text strong className="check-title">
                        Thánh Hóa Tình Yêu
                      </Text>
                      <p className="check-desc">
                        Được sự chúc lành của Thiên Chúa qua Bí Tích Hôn Phối.
                      </p>
                    </div>
                  </div>

                  <div className="checklist-item">
                    <CheckCircleOutlined className="check-icon" />
                    <div>
                      <Text strong className="check-title">
                        Đồng Hành & Chia Sẻ
                      </Text>
                      <p className="check-desc">
                        Kỹ năng giải quyết xung đột và gìn giữ sự chung thủy
                        suốt đời.
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* 5. VIDEO KHUNG VÒM THÁNH ĐƯỜNG */}
        <section
          className="glhn-section-editorial glhn-bg-soft"
          data-aos="fade-up"
        >
          <div className="glhn-container">
            <div className="glhn-section-header-center">
              <span className="glhn-subhead">04 / PHIM TƯ LIỆU</span>
              <Title level={2} className="glhn-head-title">
                Thánh Đường Đồng Quan
              </Title>
            </div>

            <div className="glhn-arch-video-container">
              <div className="glhn-arch-video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/ekdpUMlAA9M"
                  title="Giới thiệu Giáo xứ"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CALL TO ACTION - EDITORIAL QUOTE */}
        <section className="glhn-quote-banner-editorial">
          <div className="glhn-container text-center">
            <div className="quote-badge">
              <PlayCircleFilled /> HỌC TẬP TRỰC TUYẾN
            </div>
            <Title level={2} className="editorial-quote-text">
              “Sự gì Thiên Chúa đã phối hợp, loài người không được phân ly.”
            </Title>
            <Paragraph className="editorial-quote-sub">
              Hãy chuẩn bị tâm hồn thật chu đáo trước khi bước lên Bàn Thờ
              Thánh.
            </Paragraph>
            <Button
              size="large"
              className="glhn-editorial-btn-gold"
              style={{ marginTop: 20 }}
              onClick={() => navigate("/contact")}
            >
              GHI DANH LỚP HỌC NGAY
            </Button>
          </div>
        </section>

        {/* STYLESHEET CHUYÊN BIỆT */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,400&display=swap');

          .glhn-editorial-home {
            background-color: ${softBg};
            color: ${textDark};
            font-family: 'Be Vietnam Pro', sans-serif;
            overflow-x: hidden;
          }

          .glhn-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
          }

          .glhn-section-editorial {
            padding: 90px 0;
          }

          .glhn-bg-navy { background-color: ${primaryNavy}; color: #fff; }
          .glhn-bg-soft { background-color: #F1F5F9; }

          /* Typography Section Headers */
          .glhn-subhead {
            font-size: 12px;
            letter-spacing: 3px;
            color: ${accentGold};
            font-weight: 700;
            text-transform: uppercase;
            display: block;
            margin-bottom: 8px;
          }

          .glhn-subhead-gold {
            font-size: 12px;
            letter-spacing: 3px;
            color: ${accentGold};
            font-weight: 700;
            text-transform: uppercase;
            display: block;
            margin-bottom: 8px;
          }

          .glhn-head-title {
            font-family: 'Playfair Display', serif !important;
            font-size: 38px !important;
            font-weight: 700 !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
          }

          .glhn-head-title-white {
            font-family: 'Playfair Display', serif !important;
            font-size: 38px !important;
            font-weight: 700 !important;
            color: #ffffff !important;
            margin: 0 !important;
          }

          .glhn-subtext-white { color: rgba(255,255,255,0.7); margin-top: 10px; font-size: 16px; }

          .glhn-section-header-left { margin-bottom: 40px; }
          .glhn-section-header-center { text-align: center; margin-bottom: 50px; }

          .glhn-gold-line {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin-top: 16px;
          }

          /* HERO EDITORIAL */
          .glhn-hero-wrapper {
            position: relative;
          }

          .glhn-hero-backdrop {
            height: 640px;
            background-size: cover;
            background-position: center;
            position: relative;
            display: flex;
            align-items: center;
          }

          .glhn-hero-gradient-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(15, 31, 56, 0.92) 0%, rgba(15, 31, 56, 0.5) 60%, rgba(15, 31, 56, 0.8) 100%);
          }

          .glhn-hero-editorial-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            width: 100%;
            position: relative;
            z-index: 10;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 40px;
          }

          .glhn-hero-text-box { max-width: 620px; }

          .glhn-tag-sacred {
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid ${accentGold};
            color: ${accentGold};
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
          }

          .glhn-editorial-title {
            font-family: 'Playfair Display', serif !important;
            font-size: 52px !important;
            color: #ffffff !important;
            font-weight: 800 !important;
            margin-top: 20px !important;
            margin-bottom: 16px !important;
            line-height: 1.15 !important;
          }

          .glhn-editorial-sub {
            color: rgba(255,255,255,0.85) !important;
            font-size: 17px !important;
            line-height: 1.6 !important;
            margin-bottom: 30px !important;
          }

          .glhn-editorial-btn-gold {
            background: ${accentGold} !important;
            color: ${primaryNavy} !important;
            border: none !important;
            font-weight: 700 !important;
            height: 50px !important;
            padding: 0 32px !important;
            border-radius: 8px !important;
            letter-spacing: 0.5px;
            box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
          }

          .glhn-editorial-btn-gold:hover {
            background: #ffffff !important;
            color: ${primaryNavy} !important;
          }

          /* Floating Glass Card */
          .glhn-hero-floating-card {
            width: 340px;
            flex-shrink: 0;
          }

          .glhn-glass-inner {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 20px;
            padding: 30px;
            color: #fff;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          }

          .glhn-glass-icon { font-size: 28px; color: ${accentGold}; margin-bottom: 12px; }
          .glhn-glass-caption { font-size: 10px; letter-spacing: 2px; color: ${accentGold}; font-weight: 700; display: block; }
          .glhn-glass-quote { font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; margin: 12px 0 !important; color: #fff; }
          .glhn-glass-author { font-size: 12px; color: rgba(255,255,255,0.6); display: block; text-align: right; }

          /* MASONRY GRID */
          .glhn-feature-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 32px;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(15, 31, 56, 0.08);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            height: 100%;
          }

          .glhn-feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(15, 31, 56, 0.1);
            border-color: ${accentGold};
          }

          .card-large { min-height: 260px; background: linear-gradient(135deg, #ffffff 0%, #F8FAFC 100%); }
          .card-medium { min-height: 260px; }

          .card-badge {
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
            color: ${accentGold};
            text-transform: uppercase;
          }

          .card-title {
            font-family: 'Playfair Display', serif !important;
            color: ${primaryNavy} !important;
            margin: 10px 0 !important;
          }

          .card-desc { color: #64748b; font-size: 14px; line-height: 1.6; }
          .card-link { font-size: 12px; font-weight: 700; color: ${primaryNavy}; margin-top: 16px; display: inline-flex; align-items: center; gap: 6px; }

          .card-watermark-icon {
            position: absolute;
            right: -20px;
            bottom: -20px;
            font-size: 160px;
            color: rgba(212, 175, 55, 0.05);
          }

          .card-icon-small { font-size: 28px; margin-bottom: 12px; }

          .card-banner {
            background: ${primaryNavy};
            padding: 24px 36px;
            border-radius: 16px;
          }

          .card-banner-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
          }

          .card-banner-icon { font-size: 32px; color: ${accentGold}; }
          .glhn-white-pill-btn { background: #fff; color: ${primaryNavy}; font-weight: 700; border: none; }

          /* INTERACTIVE DECK GRID */
          .glhn-deck-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 16px;
            margin-top: 40px;
          }

          .glhn-deck-card {
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 16px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .glhn-deck-card:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: ${accentGold};
            transform: translateY(-5px);
          }

          .is-sunday-deck {
            background: linear-gradient(180deg, rgba(212, 175, 55, 0.2) 0%, rgba(15, 31, 56, 0.4) 100%);
            border: 1.5px solid ${accentGold};
          }

          .deck-header {
            display: flex;
            flex-direction: column;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
            padding-bottom: 10px;
            margin-bottom: 12px;
          }

          .deck-day-name { font-weight: 700; color: ${accentGold}; font-size: 14px; text-transform: capitalize; }
          .deck-date { font-size: 11px; color: rgba(255,255,255,0.5); }

          .deck-event-item { margin-bottom: 10px; }
          .deck-time { font-size: 13px; font-weight: 800; color: #fff; display: block; }
          .deck-event-title { font-size: 12px; color: rgba(255,255,255,0.85); display: block; }
          .deck-event-loc { font-size: 10px; color: rgba(255,255,255,0.4); display: block; }

          /* CATHEDRAL ARCHED FRAME */
          .glhn-cathedral-arch-frame {
            position: relative;
            width: 100%;
            max-width: 420px;
            margin: 0 auto;
          }

          .glhn-cathedral-arch-frame img {
            width: 100%;
            height: 480px;
            object-fit: cover;
            border-top-left-radius: 200px;
            border-top-right-radius: 200px;
            border-bottom-left-radius: 24px;
            border-bottom-right-radius: 24px;
            box-shadow: 0 20px 40px rgba(15, 31, 56, 0.15);
          }

          .arch-border-accent {
            position: absolute;
            inset: -10px;
            border: 2px solid ${accentGold};
            border-top-left-radius: 210px;
            border-top-right-radius: 210px;
            border-bottom-left-radius: 30px;
            border-bottom-right-radius: 30px;
            z-index: -1;
            opacity: 0.5;
          }

          .glhn-paragraph-editorial {
            font-size: 16px;
            line-height: 1.8;
            color: #475569;
            margin: 20px 0 30px;
          }

          .glhn-checklist-editorial { display: flex; flex-direction: column; gap: 20px; }
          .checklist-item { display: flex; gap: 16px; align-items: flex-start; }
          .check-icon { font-size: 22px; color: ${accentGold}; margin-top: 2px; }
          .check-title { font-size: 16px; color: ${primaryNavy}; display: block; }
          .check-desc { color: #64748b; font-size: 13px; margin: 2px 0 0; }

          /* ARCHED VIDEO */
          .glhn-arch-video-container { max-width: 900px; margin: 0 auto; }
          .glhn-arch-video-wrapper {
            position: relative;
            padding-bottom: 50%;
            height: 0;
            overflow: hidden;
            border-radius: 24px;
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 20px 50px rgba(0,0,0,0.1);
            background: #000;
          }

          .glhn-arch-video-wrapper iframe {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
          }

          /* EDITORIAL QUOTE BANNER */
          .glhn-quote-banner-editorial {
            background: linear-gradient(180deg, ${primaryNavy} 0%, #08111F 100%);
            padding: 100px 20px;
            color: #fff;
          }

          .quote-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: ${accentGold};
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 20px;
          }

          .editorial-quote-text {
            font-family: 'Playfair Display', serif !important;
            font-style: italic;
            color: #ffffff !important;
            font-size: 36px !important;
            max-width: 800px;
            margin: 0 auto !important;
            line-height: 1.3 !important;
          }

          .editorial-quote-sub {
            color: rgba(255,255,255,0.7) !important;
            font-size: 16px !important;
            margin-top: 16px !important;
          }

          /* RESPONSIVE MOBILE */
          @media (max-width: 992px) {
            .glhn-hero-editorial-container { flex-direction: column; align-items: flex-start; }
            .glhn-hero-floating-card { width: 100%; }
            .glhn-editorial-title { font-size: 36px !important; }
            .glhn-deck-grid { grid-template-columns: repeat(2, 1fr); }
            .card-banner-inner { flex-direction: column; text-align: center; }
          }

          @media (max-width: 576px) {
            .glhn-head-title, .glhn-head-title-white { font-size: 28px !important; }
            .glhn-editorial-title { font-size: 28px !important; }
            .glhn-deck-grid { grid-template-columns: 1fr; }
            .editorial-quote-text { font-size: 22px !important; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
}

export default Home;
