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
  // Statistic,
} from "antd";
import {
  // BookOutlined,
  // FileTextOutlined,
  HeartOutlined,
  MailOutlined,
  CheckCircleFilled,
  FireOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css"; // Import file CSS của AOS
import { getSlides } from "../api/slideApi";
import dayjs from "dayjs";
import { getWeekSchedule } from "../api/scheduleApi"; // Thay đổi đường dẫn đúng với project của bạn
const { Title, Paragraph, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const softCream = "#fcfaf2";

  useEffect(() => {
    // Khởi tạo hiệu ứng AOS với cấu hình mượt
    AOS.init({
      duration: 1000,
      once: false, // Để hiệu ứng lặp lại khi cuộn lên/xuống
      mirror: true, // Ẩn đi khi cuộn quá
      offset: 100,
    });
  }, []);
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoadingSlides(true);

        const res = await getSlides({
          is_active: 1,
          sort: "sort_order",
        });

        // sort_order đảm bảo đúng thứ tự
        const data = (res || res.data || []).sort(
          (a, b) => a.sort_order - b.sort_order,
        );

        setSlides(data);
      } catch (err) {
        console.log("GET SLIDES ERROR:", err);
        setSlides([]);
      } finally {
        setLoadingSlides(false);
      }
    };

    fetchSlides();
  }, []);
  const activeSlides = slides.filter((slide) => slide.is_active === 1);
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoadingSchedule(true);
        // Lấy ngày đầu tuần (Thứ 2) của tuần hiện tại
        const weekStart = dayjs()
          .startOf("week")
          .add(1, "day")
          .format("YYYY-MM-DD");

        // Gọi trực tiếp API
        const res = await getWeekSchedule({
          start_date: weekStart,
        });
        console.log(res);

        const events = res?.data?.data || [];

        // Nhóm các sự kiện theo ngày
        const grouped = events.reduce((acc, curr) => {
          const date = curr.event_date;
          if (!acc[date]) acc[date] = [];
          acc[date].push(curr);
          return acc;
        }, {});

        // Chuyển thành mảng và sắp xếp từ Thứ 2 đến Chúa Nhật
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
  console.log(weeklySchedule);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="glhn-home-container">
        {/* 1. HERO - Giữ nguyên sự ổn định */}
        <section className="glhn-hero">
          {loadingSlides ? (
            <div style={{ textAlign: "center", padding: 80 }}>
              <Spin size="large" />
            </div>
          ) : (
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
          )}
        </section>

        {/* 2. CHỨC NĂNG - Hiệu ứng trượt từ dưới lên */}
        <section className="glhn-section glhn-features" data-aos="fade-up">
          <div className="glhn-container">
            <div
              className="glhn-header-center"
              style={{ textAlign: "center", marginBottom: "50px" }}
            >
              <Badge
                status="processing"
                color={primaryGold}
                text="CỘNG ĐỒNG ĐỒNG QUAN"
                style={{ marginBottom: 12 }}
              />
              <Title level={2} style={{ color: deepBrown, marginTop: 8 }}>
                Nhịp Sống Giáo Xứ
              </Title>
              <div className="glhn-divider" style={{ margin: "0 auto" }} />
              <Paragraph
                style={{ marginTop: 15, fontSize: 16, color: "#8c8c8c" }}
              >
                Nơi kết nối tình huynh đệ, sẻ chia hồng ân và cùng nhau thăng
                tiến trong Đức Tin
              </Paragraph>
            </div>

            <Row gutter={[24, 24]}>
              {[
                {
                  icon: <FireOutlined />,
                  title: "Sự kiện",
                  desc: "Lịch phụng vụ, lễ quan thầy và các ngày hội lớn.",
                  path: "/su-kien",
                  color: "#e67e22",
                },
                {
                  icon: <HeartOutlined />,
                  title: "Bác ái",
                  desc: "Hành trình yêu thương, giúp đỡ những hoàn cảnh khó khăn.",
                  path: "/charity",
                  color: "#e74c3c",
                },
                {
                  icon: <MailOutlined />,
                  title: "Hội đoàn",
                  desc: "Nơi sinh hoạt của Giới trẻ, Ca đoàn và các hội đoàn.",
                  path: "/hoi-doan",
                  color: "#2980b9",
                },
              ].map((item, i) => (
                <Col
                  xs={24} // Trên điện thoại nên để 1 cột hoặc 12 (2 cột) tùy ý bạn
                  sm={12}
                  md={8} // Chia 3 cột đều nhau (24/3 = 8)
                  key={i}
                  data-aos="zoom-in"
                  data-aos-delay={i * 150}
                >
                  <Card
                    hoverable
                    className="glhn-card-modern"
                    onClick={() => navigate(item.path)}
                  >
                    <div
                      className="glhn-icon-circle"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </div>
                    <Title level={4} style={{ margin: "16px 0 8px" }}>
                      {item.title}
                    </Title>
                    <Paragraph
                      type="secondary"
                      style={{
                        fontSize: "13px",
                        lineHeight: "1.6",
                        height: "40px",
                        overflow: "hidden",
                      }}
                    >
                      {item.desc}
                    </Paragraph>
                    <div className="glhn-card-footer">
                      <Text
                        strong
                        style={{ color: primaryGold, fontSize: "12px" }}
                      >
                        KHÁM PHÁ NGAY
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>
        {/* 1.5 SECTION LỊCH LỄ TRONG TUẦN */}
        {/* 1.5 SECTION LỊCH LỄ - PHONG CÁCH BẢNG TIN MỤC VỤ */}
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
            {loadingSchedule ? (
              <div style={{ textAlign: "center", padding: 40 }}>
                <Spin size="large" />
              </div>
            ) : (
              <Row gutter={[32, 32]}>
                {/* Cột trái: Lễ Chúa Nhật (Nổi bật) */}
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
                      {weeklySchedule.filter(
                        (day) => dayjs(day.date).day() === 0,
                      ).length === 0 && (
                        <Text style={{ color: "#fff" }}>Đang cập nhật...</Text>
                      )}
                    </div>
                  </div>
                </Col>

                {/* Cột phải: Các ngày trong tuần (Dạng Timeline) */}
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
                  </div>
                </Col>
              </Row>
            )}
          </div>
        </section>

        {/* 3. GIỚI THIỆU - Hiệu ứng hai bên đi vào */}
        <section className="glhn-section glhn-intro">
          <div className="glhn-container">
            <Row gutter={[60, 40]} align="middle">
              <Col xs={24} md={12} data-aos="fade-right">
                <div className="glhn-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000"
                    alt="intro"
                  />
                </div>
              </Col>
              <Col xs={24} md={12} data-aos="fade-left">
                <Title level={2} style={{ color: deepBrown }}>
                  Ý nghĩa khóa học
                </Title>
                <Paragraph className="glhn-text-p">
                  Hôn nhân là một hành trình thánh thiêng. Chúng tôi cung cấp
                  những kiến thức thực tế về tâm lý, pháp lý và đức tin để các
                  bạn tự tin xây dựng tổ ấm.
                </Paragraph>
                <div className="glhn-list-item">
                  <CheckCircleFilled /> Hiểu rõ Bí tích Hôn Phối
                </div>
                <div className="glhn-list-item">
                  <CheckCircleFilled /> Kỹ năng xây dựng hạnh phúc
                </div>
                <div className="glhn-list-item">
                  <CheckCircleFilled /> Giáo dục con cái theo Tin Mừng
                </div>
              </Col>
            </Row>
          </div>
        </section>

        {/* 4. THỐNG KÊ - Hiệu ứng hiện dần số */}
        {/* <section
          className="glhn-section glhn-stats"
          style={{ backgroundColor: "#fff" }}
        >
          <div className="glhn-container">
            <Row gutter={[32, 32]} justify="center">
              {[
                { label: "Học viên", value: 1200, icon: <FireOutlined /> },
                { label: "Bài học", value: 24, icon: <BookOutlined /> },
                { label: "Giảng viên", value: 15, icon: <HeartOutlined /> },
              ].map((stat, i) => (
                <Col
                  xs={12}
                  md={6}
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 200}
                >
                  <div className="glhn-stat-box">
                    <Statistic
                      title={stat.label}
                      value={stat.value}
                      prefix={stat.icon}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section> */}
        {/* 3.5 VIDEO GIỚI THIỆU - Mới thêm */}
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
                  {/* Thay 'VIDEO_ID' bằng ID video Youtube của bạn */}
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

        {/* 5. QUOTE - Parallax nhẹ nhàng */}
        <section className="glhn-quote-section" data-aos="zoom-out">
          <div className="glhn-quote-inner">
            <Title level={1}>
              {" "}
              “Người làm chồng, hãy yêu thương vợ, như chính Đức Ki-tô yêu
              thương Hội Thánh và hiến mình vì Hội Thánh” (Ep 5,25){" "}
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
          .glhn-section { padding: 80px 0; overflow: hidden; }
          
          /* Hero */
          .glhn-hero-slide { height: 700px; background: center/cover no-repeat; display: flex; align-items: center; position: relative; }
          .glhn-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); }
          .glhn-hero-content { position: relative; z-index: 10; padding: 0 10%; color: white; max-width: 900px; }
          .glhn-hero-title { color: white !important; font-size: 52px !important; font-weight: 800 !important; margin-bottom: 24px !important; }
          .glhn-hero-sub { color: #f0f0f0 !important; font-size: 20px !important; }
          .glhn-main-btn { height: 54px; padding: 0 40px; border-radius: 27px; font-weight: bold; font-size: 16px; border: none; }

          /* Cards */
          .glhn-card-modern {
              height: 100%;
              border-radius: 24px;
              padding: 10px;
              border: 1px solid #f0f0f0;
            }
.glhn-card-modern:hover .glhn-icon-circle {
  transform: scale(1.1) rotate(5deg);
  border-radius: 50%; /* Hiệu ứng chuyển hình dáng khi hover */
}
  .glhn-card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dashed #eee;
}

.glhn-divider {
  width: 60px;
  height: 4px;
  background: ${primaryGold};
  border-radius: 2px;
}
          .glhn-icon-circle {
            font-size: 32px;
              width: 70px;
              height: 70px;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto;
              border-radius: 20px; /* Bo góc kiểu hiện đại hơn hình tròn */
              transition: all 0.3s ease;
            }
          /* Intro */
          .glhn-img-frame { position: relative; }
          .glhn-img-frame img { width: 100%; border-radius: 30px; box-shadow: 20px 20px 0px ${primaryGold}; }
          .glhn-list-item { margin-bottom: 15px; font-size: 16px; display: flex; align-items: center; gap: 10px; color: ${deepBrown}; font-weight: 500; }
          .anticon-check-circle-filled { color: ${primaryGold}; }

          /* Stats */
          .glhn-stat-box { background: white; padding: 30px; border-radius: 20px; text-align: center; }

          /* Quote Section */
          .glhn-quote-section { 
            padding: 120px 20px; 
            background: linear-gradient(rgba(179, 145, 100, 0.9), rgba(93, 64, 55, 0.9)), url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070') center/cover;
            text-align: center;
            color: white;
          }
          .glhn-quote-section h1 { color: white !important; font-family: 'Playfair Display', serif; font-style: italic; }
          .glhn-white-btn { height: 50px; padding: 0 40px; border-radius: 25px; background: white; border: none; color: ${deepBrown}; font-weight: bold; }
          .glhn-white-btn:hover { color: ${primaryGold} !important; }
/* Video Section */
.glhn-video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* Tỉ lệ 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.15);
  background: #000;
}

.glhn-video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}

.glhn-header-center .glhn-divider {
  width: 80px;
  height: 4px;
  background: ${primaryGold};
  margin-top: 10px;
  border-radius: 2px;
}
  /* Schedule Section Styling */
.glhn-schedule-scroll {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 10px 5px 25px;
  -webkit-overflow-scrolling: touch;
}

.glhn-schedule-scroll::-webkit-scrollbar {
  height: 6px;
}

.glhn-schedule-scroll::-webkit-scrollbar-thumb {
  background: ${primaryGold}40;
  border-radius: 10px;
}

.glhn-day-card {
  min-width: 220px;
  flex: 1;
  background: #fff;
  border-radius: 16px;
  border: 1px solid #eee;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  display: flex;
  flex-direction: column;
}

.glhn-day-header {
  padding: 12px;
  text-align: center;
  background: #fdfdfd;
  border-bottom: 2px solid ${primaryGold}20;
}

.glhn-day-header.is-sunday {
  background: #fff1f0;
  border-bottom-color: #ffa39e;
}

.glhn-day-header.is-sunday .day-text {
  color: #cf1322;
}

.day-text {
  font-weight: 800;
  text-transform: uppercase;
  font-size: 13px;
  color: ${deepBrown};
}

.date-text {
  font-size: 12px;
  color: #999;
}

/* Schedule V2 - Modern List Style */
.glhn-schedule-v2 { background: #fff; }

/* Cột Chúa Nhật nổi bật */
.schedule-highlight-box {
  background: linear-gradient(135deg, ${deepBrown} 0%, #8d6e63 100%);
  border-radius: 30px;
  padding: 40px;
  color: white;
  box-shadow: 0 20px 40px rgba(93, 64, 55, 0.2);
  height: 100%;
  position: relative;
  overflow: hidden;
}

.schedule-highlight-box::after {
  content: "†";
  position: absolute;
  right: -20px;
  bottom: -40px;
  font-size: 200px;
  opacity: 0.05;
  color: #fff;
}

.highlight-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 30px;
  color: ${primaryGold};
}

.highlight-item {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
  align-items: center;
}

.h-time {
  font-size: 24px;
  font-weight: 800;
  color: ${primaryGold};
  border-right: 1px solid rgba(255,255,255,0.2);
  padding-right: 20px;
}

.h-title {
  font-weight: 600;
  font-size: 16px;
}

.h-loc {
  font-size: 13px;
  opacity: 0.8;
}

/* Danh sách ngày thường */
.schedule-list-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.schedule-row {
  display: flex;
  align-items: center;
  padding: 20px;
  background: ${softCream};
  border-radius: 20px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.schedule-row:hover {
  background: #fff;
  border-color: ${primaryGold};
  transform: translateX(10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.row-date {
  min-width: 120px;
  border-right: 2px solid ${primaryGold}40;
}

.d-name {
  font-weight: 800;
  color: ${deepBrown};
  text-transform: capitalize;
}

.d-day {
  font-size: 12px;
  color: #8c8c8c;
}

.row-events {
  padding-left: 25px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.event-pill {
  background: white;
  padding: 8px 16px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid #f0f0f0;
}

.p-time {
  color: ${primaryGold};
  font-weight: bold;
}

.p-name {
  font-weight: 500;
  color: ${deepBrown};
}

/* Mobile Responsive cho Schedule V2 */
@media (max-width: 768px) {
  .schedule-highlight-box { padding: 25px; }
  .schedule-row { flex-direction: column; align-items: flex-start; gap: 15px; }
  .row-date { border-right: none; border-bottom: 1px solid ${primaryGold}40; width: 100%; padding-bottom: 10px; }
  .row-events { padding-left: 0; }
  .h-time { font-size: 20px; }
}
          /* Mobile */
/* Mobile Optimization */
@media (max-width: 768px) {
  .glhn-hero-slide { 
  margin-top:15px;
    height: 22vh !important; 
    min-height: 220px; /* Tăng nhẹ lên 220px để đủ chỗ cho Button */
    background-position: center center;
  }

  .glhn-hero-content {
    padding: 0 15px;
    text-align: center; 
    width: 100%;
    /* Căn giữa nội dung theo chiều dọc trong không gian hẹp */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .glhn-hero-title { 
    font-size: 18px !important; /* Chữ nhỏ lại để không chiếm diện tích */
    margin-bottom: 4px !important;
    line-height: 1.2 !important;
    font-weight: 700 !important;
  }

  .glhn-hero-sub {
    font-size: 12px !important;
    margin-bottom: 12px !important;
    line-height: 1.4 !important;
    display: -webkit-box; /* Giới hạn dòng nếu sub quá dài */
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .glhn-main-btn {
    height: 36px !important; /* Nút bấm nhỏ lại */
    padding: 0 20px !important;
    font-size: 12px !important;
    border-radius: 18px !important;
    line-height: 36px;
  }

  .glhn-badge {
    margin-bottom: 4px !important;
    transform: scale(0.8); /* Thu nhỏ badge niên khóa */
  }

  /* Thu nhỏ padding của các section khác để tiết kiệm diện tích */
  .glhn-section { 
    padding: 30px 0; 
  }
}     
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
}

export default Home;
