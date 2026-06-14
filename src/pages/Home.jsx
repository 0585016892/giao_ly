import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Carousel,
  Badge,
  ConfigProvider,
  Spin,
} from "antd";
import { FireOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getSlides } from "../api/slideApi";
import dayjs from "dayjs";
import { getWeekSchedule } from "../api/scheduleApi";
import { getEvents } from "../api/eventApi"; // 👈 THÊM ĐƯỜNG DẪN GỌI API SỰ KIỆN

const { Title, Paragraph, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [newsEvents, setNewsEvents] = useState([]); // 👈 THAY THẾ CHO MOCK DATA CŨ
  const [pageLoading, setPageLoading] = useState(true);

  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const softCream = "#fcfaf2";

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setPageLoading(true);
        const weekStart = dayjs()
          .startOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD");

        // 👈 GỌI SONG SONG CẢ 3 API CÙNG MỘT LÚC ĐỂ ĐỒNG BỘ TOÀN TRANG
        const [slideRes, scheduleRes, eventRes] = await Promise.all([
          getSlides({ is_active: 1, sort: "sort_order" }),
          getWeekSchedule({ start_date: weekStart }),
          getEvents({ is_active: 1, limit: 4 }), // Lấy 4 sự kiện mới nhất để hiển thị ra trang chủ
        ]);

        // 1. Xử lý dữ liệu Slides
        const slideData = (slideRes || slideRes?.data || []).sort(
          (a, b) => a.sort_order - b.sort_order,
        );
        setSlides(slideData);

        // 2. Xử lý dữ liệu Lịch lễ
        const events = scheduleRes?.data?.data || [];
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

        // 3. Xử lý dữ liệu Sự kiện thật từ API (Lọc lấy tối đa 4 phần tử)
        const activeEvents = eventRes?.data?.data || eventRes?.data || [];
        setNewsEvents(activeEvents.slice(0, 4));
      } catch (err) {
        console.error("LỖI TẢI DỮ LIỆU TRANG CHỦ:", err);
      } finally {
        setPageLoading(false);
        setTimeout(() => {
          AOS.refresh();
        }, 100);
      }
    };

    fetchAllData();
  }, []);

  const activeSlides = slides.filter((slide) => slide.is_active === 1);
  console.log(weeklySchedule);

  if (pageLoading) {
    return (
      <div className="glhn-full-page-loading">
        <Spin size="large" tip="Đang tải dữ liệu giáo xứ..." />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-full-page-loading { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 100vh; background: #fcfaf2; }
          .glhn-full-page-loading .ant-spin-text { color: #5d4037; font-weight: 600; margin-top: 16px; }
          .glhn-full-page-loading .ant-spin-dot-item { background-color: #b39164 !important; }
        `,
          }}
        />
      </div>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="glhn-home-container">
        {/* 1. HERO - SLIDES */}
        <section className="glhn-hero">
          <Carousel autoplay effect="fade" speed={1200}>
            {activeSlides.length > 0 ? (
              activeSlides.map((slide) => (
                <div key={slide.id}>
                  <div
                    className="glhn-hero-slide"
                    style={{
                      backgroundImage: slide.image
                        ? `url(${process.env.REACT_APP_API_URL}${slide.image})`
                        : "none",
                    }}
                  >
                    <div className="glhn-overlay" />
                    <div className="glhn-hero-content">
                      <Badge
                        count={new Date(slide.created_at).toLocaleDateString(
                          "vi-VN",
                        )}
                        className="glhn-badge"
                        style={{ backgroundColor: "#b39164" }}
                      />
                      <Title className="glhn-hero-title">{slide.title}</Title>
                      <Paragraph className="glhn-hero-sub">
                        {slide.subtitle}
                      </Paragraph>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className="glhn-hero-slide">
                  <div className="glhn-overlay" />
                  <div className="glhn-hero-content">
                    <Title className="glhn-hero-title">
                      Không có slide hiển thị
                    </Title>
                  </div>
                </div>
              </div>
            )}
          </Carousel>
        </section>

        {/* 2. NHỊP SỐNG GIÁO XỨ - 4 CỘT MINIMAL */}
        <section className="glhn-section glhn-features" data-aos="fade-up">
          <div className="glhn-container">
            <div
              className="glhn-header-center"
              style={{ textAlign: "center", marginBottom: "50px" }}
            >
              <Text className="glhn-sup-title">• CỘNG ĐỒNG ĐỒNG QUAN •</Text>
              <Title
                level={2}
                style={{ color: deepBrown, marginTop: 8, fontWeight: 700 }}
              >
                Nhịp Sống Giáo Xứ
              </Title>
              <Paragraph
                style={{
                  marginTop: 15,
                  fontSize: 15,
                  color: "#7a7a7a",
                  maxWidth: 600,
                  margin: "15px auto 0",
                }}
              >
                Nơi kết nối tình huynh đệ, sẻ chia hồng ân và cùng nhau thăng
                tiến trong Đức Tin
              </Paragraph>
            </div>

            <Row gutter={[20, 20]}>
              {[
                {
                  icon: "🔥",
                  title: "Cầu Nguyện",
                  desc: "Cùng nhau hiệp dâng lời cầu nguyện mỗi ngày.",
                  bg: "#fffaf4",
                  iconColor: "#ff9933",
                  path: "/cau-nguyen", // 👈 Thêm link tương ứng
                },
                {
                  icon: "❤️",
                  title: "Yêu Thương",
                  desc: "Sẻ chia, bác ái và phục vụ anh chị em.",
                  bg: "#fff5f5",
                  iconColor: "#ff4d4d",
                  path: "/charity", // 👈 Thêm link tương ứng (hoặc /yeu-thuong)
                },
                {
                  icon: "👥",
                  title: "Hiệp Nhất",
                  desc: "Hiệp nhất trong Đức Kitô, và giữa các thành viên.",
                  bg: "#f4faff",
                  iconColor: "#3399ff",
                  path: "/hoi-doan", // 👈 Thêm link tương ứng (hoặc /hiep-nhat)
                },
                {
                  icon: "📖",
                  title: "Học Hỏi",
                  desc: "Cùng nhau học hỏi và sống Lời Chúa.",
                  bg: "#f9f5ff",
                  iconColor: "#9933ff",
                  path: "/giao-ly", // 👈 Thêm link tương ứng (hoặc /hoc-hoi)
                },
              ].map((item, i) => (
                <Col
                  xs={12}
                  sm={12}
                  md={6}
                  key={i}
                  data-aos="zoom-in"
                  data-aos-delay={i * 100}
                >
                  <Card
                    hoverable
                    className="glhn-minimal-card"
                    onClick={() => navigate(item.path)} // 👈 Thêm sự kiện click để chuyển trang
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="glhn-mini-icon"
                      style={{ backgroundColor: item.bg }}
                    >
                      <span style={{ fontSize: "24px" }}>{item.icon}</span>
                    </div>
                    <Title
                      level={4}
                      style={{
                        margin: "14px 0 6px",
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#222",
                      }}
                    >
                      {item.title}
                    </Title>
                    <Paragraph
                      type="secondary"
                      style={{
                        fontSize: "12px",
                        marginBottom: 14,
                        height: "36px",
                        overflow: "hidden",
                      }}
                    >
                      {item.desc}
                    </Paragraph>
                    <div className="glhn-card-action">
                      <Text style={{ fontSize: "12px", color: "#8c8c8c" }}>
                        Xem thêm{" "}
                        <ArrowRightOutlined style={{ fontSize: "10px" }} />
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* 3. SECTION TIN TỨC & SINH HOẠT - ĐÃ ĐỔ DỮ LIỆU TỪ API THẬT */}
        <section className="glhn-section glhn-news-grid" data-aos="fade-up">
          <div className="glhn-container">
            <div
              className="glhn-news-header"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <Title
                level={3}
                style={{
                  color: deepBrown,
                  fontSize: "18px",
                  fontWeight: 700,
                  margin: 0,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Tin tức & Sinh hoạt
              </Title>
              <Button
                type="default"
                size="small"
                className="glhn-btn-viewall"
                onClick={() => navigate("/su-kien")} // Chuyển sang trang danh sách sự kiện chung
              >
                Xem tất cả →
              </Button>
            </div>

            <Row gutter={[20, 20]}>
              {newsEvents.length > 0 ? (
                newsEvents.map((news, idx) => (
                  <Col xs={12} sm={12} md={6} key={news.id || idx}>
                    <Card
                      hoverable
                      className="glhn-news-card"
                      cover={
                        <div
                          className="glhn-news-cover"
                          style={{
                            backgroundImage: news.images
                              ? `url(${process.env.REACT_APP_API_URL}${news.images[0]})`
                              : `url('https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=600')`, // Ảnh mặc định dự phòng
                          }}
                        />
                      }
                      // Điều hướng đến trang chi tiết theo slug từ cơ sở dữ liệu
                      onClick={() => navigate(`/su-kien/${news.slug}`)}
                    >
                      <Title level={5} className="news-title-link">
                        {news.title}
                      </Title>
                      <Text className="news-date-text">
                        {news.event_date
                          ? dayjs(news.event_date).format("DD/MM/YYYY")
                          : dayjs(news.created_at).format("DD/MM/YYYY")}
                      </Text>
                    </Card>
                  </Col>
                ))
              ) : (
                <Col
                  span={24}
                  style={{ textAlign: "center", padding: "20px 0" }}
                >
                  <Text type="secondary">
                    Chưa có tin tức hay hoạt động nào mới cập nhật.
                  </Text>
                </Col>
              )}
            </Row>
          </div>
        </section>

        {/* 4. LỊCH LỄ TRONG TUẦN */}
        <section className="glhn-section glhn-schedule-v2" data-aos="fade-up">
          <div className="glhn-container">
            <div
              className="glhn-header-center"
              style={{ textAlign: "center", marginBottom: "50px" }}
            >
              <Text strong style={{ color: primaryGold, letterSpacing: 2 }}>
                LỊCH PHỤNG VỤ
              </Text>
              <Title level={2} style={{ color: deepBrown, marginTop: 8 }}>
                Thông Tin Giờ Lễ
              </Title>
              <div className="glhn-divider" style={{ margin: "0 auto" }} />
            </div>

            <Row gutter={[32, 32]}>
              <Col xs={24} lg={10}>
                <div className="schedule-highlight-box" data-aos="zoom-in">
                  <div className="highlight-header">
                    <FireOutlined />
                    <span>NGÀY CHÚA NHẬT</span>
                  </div>
                  <div className="highlight-content">
                    {weeklySchedule
                      .filter((day) => dayjs(day.date).day() === 0)
                      .map((day) => (
                        <div key={day.date}>
                          <Title
                            level={3}
                            style={{ color: "#fff", marginBottom: 20 }}
                          >
                            Ngày {dayjs(day.date).format("DD [tháng] MM")}
                          </Title>
                          {day.items.map((item, i) => (
                            <div className="highlight-item" key={i}>
                              <div className="h-time">
                                {item.event_time.slice(0, 5)}
                              </div>
                              <div className="h-info">
                                <div className="h-title">{item.title}</div>
                                <div className="h-loc">
                                  {item.church_name || "Nhà thờ Chính"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    {weeklySchedule.filter((day) => dayjs(day.date).day() === 0)
                      .length === 0 && (
                      <Text style={{ color: "#fff" }}>
                        Không có lịch lễ Chúa Nhật tuần này.
                      </Text>
                    )}
                  </div>
                </div>
              </Col>

              <Col xs={24} lg={14}>
                <div className="schedule-list-container">
                  {weeklySchedule
                    .filter((day) => dayjs(day.date).day() !== 0)
                    .map((day, idx) => (
                      <div
                        className="schedule-row"
                        key={idx}
                        data-aos="fade-left"
                        data-aos-delay={idx * 100}
                      >
                        <div className="row-date">
                          <div className="d-name">
                            {dayjs(day.date).format("dddd")}
                          </div>
                          <div className="d-day">
                            {dayjs(day.date).format("DD/MM")}
                          </div>
                        </div>
                        <div className="row-events">
                          {day.items.map((item, i) => (
                            <div className="event-pill" key={i}>
                              <span className="p-time">
                                {item.event_time.slice(0, 5)}
                              </span>
                              <span className="p-name">{item.title}</span>
                              {item.is_priority === 1 && (
                                <Badge status="warning" text="Lễ Trọng" />
                              )}
                              <div className="h-loc">
                                {item.church_name || "Nhà thờ Chính"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  {weeklySchedule.filter((day) => dayjs(day.date).day() !== 0)
                    .length === 0 && (
                    <Text style={{ color: "#8c8c8c" }}>
                      Không có lịch lễ ngày thường.
                    </Text>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* 6. VIDEO GIỚI THIỆU */}
        <section className="glhn-section glhn-video" data-aos="fade-up">
          <div className="glhn-container">
            <div
              className="glhn-header-center"
              style={{ textAlign: "center", marginBottom: "40px" }}
            >
              <Title level={2} style={{ color: deepBrown }}>
                Giới thiệu giáo xứ
              </Title>
              <Paragraph>
                Cùng nhìn lại những hình ảnh thân thương tại Giáo xứ Đồng Quan
              </Paragraph>
              <div className="glhn-divider" style={{ margin: "0 auto" }} />
            </div>
            <Row justify="center">
              <Col xs={24} lg={20}>
                <div className="glhn-video-wrapper">
                  <iframe
                    src="https://www.youtube.com/embed/ekdpUMlAA9M"
                    title="Giới thiệu Giáo xứ"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* 7. QUOTE */}
        <section className="glhn-quote-section" data-aos="zoom-out">
          <div className="glhn-quote-inner">
            <Title level={1}>
              “Người làm chồng, hãy yêu thương vợ, như chính Đức Ki-tô yêu
              thương Hội Thánh và hiến mình vì Hội Thánh” (Ep 5,25)
            </Title>
            <Paragraph>
              Hãy chuẩn bị tâm hồn thật tốt cho ngày trọng đại nhất cuộc đời.
            </Paragraph>
            <Button
              size="large"
              className="glhn-white-btn"
              onClick={() => navigate("/contact")}
            >
              GHI DANH NGAY
            </Button>
          </div>
        </section>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-home-container { background: ${softCream}; }
          .glhn-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .glhn-section { padding: 60px 0; overflow: hidden; }
          
          /* Titles */
          .glhn-sup-title { color: ${primaryGold}; font-weight: 700; letter-spacing: 1px; font-size: 13px; }
          .glhn-divider { width: 50px; height: 3px; background: ${primaryGold}; border-radius: 2px; }

          /* Hero */
          .glhn-hero-slide { height: 600px; background: center/cover no-repeat; display: flex; align-items: center; position: relative; }
          .glhn-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); }
          .glhn-hero-content { position: relative; z-index: 10; padding: 0 10%; color: white; max-width: 900px; }
          .glhn-hero-title { color: white !important; font-size: 48px !important; font-weight: 800 !important; margin-bottom: 20px !important; }
          .glhn-hero-sub { color: #f0f0f0 !important; font-size: 18px !important; }

          /* 4 Minimal Features Cards */
          .glhn-minimal-card { text-align: center; border-radius: 16px; border: none; box-shadow: 0 4px 20px rgba(0,0,0,0.02); height: 100%; padding: 12px 8px; transition: all 0.3s ease; }
          .glhn-minimal-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(93, 64, 55, 0.06); }
          .glhn-mini-icon { width: 54px; height: 54px; margin: 0 auto; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
          .glhn-card-action { border-top: 1px solid #f9f9f9; padding-top: 10px; margin-top: 5px; }

          /* News Grid Sections */
          .glhn-news-header { display: flex; justify-content: space-between; align-items: center; border-left: 4px solid ${primaryGold}; padding-left: 12px; }
          .glhn-btn-viewall { border-radius: 20px; font-size: 12px; color: #777; border-color: #ddd; }
          .glhn-news-card { border-radius: 12px; overflow: hidden; border: 1px solid #f0f0f0; height: 100%; }
          .glhn-news-card .ant-card-body { padding: 12px !important; }
          .glhn-news-cover { height: 140px; background-size: cover; background-position: center; transition: transform 0.5s ease; }
          .glhn-news-card:hover .glhn-news-cover { transform: scale(1.06); }
          .news-title-link { font-size: 13px !important; font-weight: 600 !important; line-height: 1.4 !important; height: 38px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; margin-bottom: 8px !important; color: #333; }
          .news-date-text { font-size: 11px; color: #aaa; }

          /* Intro & Video & Quote */
          .glhn-img-frame img { width: 100%; border-radius: 24px; box-shadow: 15px 15px 0px ${primaryGold}; }
          .glhn-list-item { margin-bottom: 15px; font-size: 15px; display: flex; align-items: center; gap: 10px; color: ${deepBrown}; font-weight: 500; }
          .glhn-quote-section { padding: 100px 20px; background: linear-gradient(rgba(179, 145, 100, 0.9), rgba(93, 64, 55, 0.9)), url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070') center/cover; text-align: center; color: white; }
          .glhn-quote-section h1 { color: white !important; font-family: 'Playfair Display', serif; font-style: italic; }
          .glhn-white-btn { height: 46px; padding: 0 35px; border-radius: 23px; background: white; border: none; color: ${deepBrown}; font-weight: bold; }
          .glhn-white-btn:hover { color: ${primaryGold} !important; }
          .glhn-video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.15); background: #000; }
          .glhn-video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

          /* Schedule Custom V2 */
          .glhn-schedule-v2 { background: #fff; }
          .schedule-highlight-box { background: linear-gradient(135deg, ${deepBrown} 0%, #8d6e63 100%); border-radius: 24px; padding: 35px; color: white; box-shadow: 0 15px 35px rgba(93, 64, 55, 0.15); height: 100%; position: relative; overflow: hidden; }
          .highlight-header { display: flex; align-items: center; gap: 10px; font-weight: bold; letter-spacing: 2px; margin-bottom: 25px; color: ${primaryGold}; }
          .highlight-item { display: flex; gap: 20px; margin-bottom: 25px; align-items: center; }
          .h-time { font-size: 24px; font-weight: 800; color: ${primaryGold}; border-right: 1px solid rgba(255,255,255,0.2); padding-right: 20px; }
          .h-title { font-weight: 600; font-size: 15px; }
          .h-loc { font-size: 12px; opacity: 0.8; }
          .schedule-list-container { display: flex; flex-direction: column; gap: 12px; }
          .schedule-row { display: flex; align-items: center; padding: 18px; background: ${softCream}; border-radius: 16px; transition: all 0.3s ease; border: 1px solid transparent; }
          .schedule-row:hover { background: #fff; border-color: ${primaryGold}; transform: translateX(8px); box-shadow: 0 8px 25px rgba(0,0,0,0.04); }
          .row-date { min-width: 110px; border-right: 2px solid ${primaryGold}40; }
          .d-name { font-weight: 800; color: ${deepBrown}; text-transform: capitalize; }
          .d-day { font-size: 12px; color: #8c8c8c; }
          .row-events { padding-left: 20px; display: flex; flex-wrap: wrap; gap: 12px; }
          .event-pill { background: white; padding: 6px 14px; border-radius: 50px; display: flex; align-items: center; gap: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.03); border: 1px solid #f5f5f5; }
          .p-time { color: ${primaryGold}; font-weight: bold; }
          .p-name { font-weight: 500; color: ${deepBrown}; }

          /* Mobile Optimization */
          @media (max-width: 768px) {
            .glhn-hero-slide { margin-top:15px; height: 22vh !important; min-height: 220px; background-position: center center; }
            .glhn-hero-content { padding: 0 15px; text-align: center; width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; }
            .glhn-hero-title { font-size: 18px !important; margin-bottom: 4px !important; line-height: 1.2 !important; font-weight: 700 !important; }
            .glhn-hero-sub { font-size: 12px !important; margin-bottom: 12px !important; line-height: 1.4 !important; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
            .glhn-section { padding: 30px 0; }
            .schedule-highlight-box { padding: 25px; }
            .schedule-row { flex-direction: column; align-items: flex-start; gap: 15px; }
            .row-date { border-right: none; border-bottom: 1px solid ${primaryGold}40; width: 100%; padding-bottom: 10px; }
            .row-events { padding-left: 0; }
            .h-time { font-size: 20px; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
}

export default Home;
