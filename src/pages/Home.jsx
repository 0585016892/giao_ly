import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  ConfigProvider,
  Skeleton,
  Spin,
  Carousel,
  Tag,
  Card,
} from "antd";
import {
  ChevronRight,
  Calendar,
  Heart,
  Users,
  Church,
  Bell,
  ArrowRight,
  Mail,
  Share2,
  Clock,
  MapPin,
  User,
  Sparkles,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { motion, AnimatePresence } from "framer-motion";
import { getSlides } from "../api/slideApi";
import { getWeekSchedule } from "../api/scheduleApi";
import { getEvents } from "../api/eventApi";

dayjs.locale("vi");

// Mock Data tin tức dự phòng khi API chưa có dữ liệu
const MOCK_NEWS_FEATURED = {
  id: 1,
  slug: "thu-muc-vu-thang-5",
  date: "25",
  month: "THG 05",
  title: "Thư Mục Vụ Tháng 5: Sống Đức Tin Giữa Đời Thường",
  excerpt:
    "Cha xứ chia sẻ thông điệp mục vụ tháng 5 với chủ đề: “Sống Đức Tin Giữa Đời Thường”...",
  image:
    "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800",
};

const MOCK_NEWS_LIST = [
  {
    id: 2,
    slug: "thong-bao-lich-thanh-le",
    date: "20/05/2026",
    title: "Thông báo: Lịch Thánh Lễ Chúa Nhật và ngày thường",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 3,
    slug: "mung-kinh-duc-me-fatima",
    date: "15/05/2026",
    title: "Mừng Kính Đức Mẹ Fatima tại Giáo xứ",
    image:
      "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=300",
  },
  {
    id: 4,
    slug: "khoa-huan-luyen-ban-le-sinh",
    date: "10/05/2026",
    title: "Khóa Huấn Luyện Ban Lễ Sinh Hè 2026",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=300",
  },
];

const MOCK_STATS = [
  { icon: <Users size={32} />, count: "3.250+", label: "Giáo dân" },
  { icon: <Users size={32} />, count: "12", label: "Hội đoàn" },
  { icon: <Church size={32} />, count: "25+", label: "Năm hình thành" },
  { icon: <Heart size={32} />, count: "150+", label: "Hoạt động bác ái" },
];

function Home() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // State cho Sự kiện / Tin tức
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const goldColor = "#D4A017";
  const darkNavy = "#0B192C";

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  useEffect(() => {
    document.title = "Giáo Xứ Đồng Quan | Giáo Phận Thái Bình";
  }, []);

  // 1. Lấy danh sách Slide
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
        console.error("Lỗi lấy slide:", err);
        setSlides([]);
      } finally {
        setLoadingSlides(false);
      }
    };
    fetchSlides();
  }, []);

  // 2. Lấy Lịch phụng vụ tuần
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoadingSchedule(true);
        const weekStart = dayjs()
          .startOf("week")
          .add(0, "day")
          .format("YYYY-MM-DD");
        const res = await getWeekSchedule({ start_date: weekStart });
        const eventList = res?.data?.data || res?.data || [];

        setWeeklySchedule(Array.isArray(eventList) ? eventList : []);
      } catch (err) {
        console.error("Lỗi gọi API lịch lễ:", err);
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchScheduleData();
  }, []);

  // 3. Lấy danh sách Sự kiện / Tin tức MỚI NHẤT
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoadingEvents(true);
        const res = await getEvents({
          is_active: 1,
          limit: 4,
          sort: "created_at",
          order: "desc",
        });

        const data = res?.data?.data || res?.data || res || [];

        const formattedEvents = data.map((item) => {
          let imgUrl =
            "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800";
          if (item.images && item.images.length > 0) {
            imgUrl = item.images[0].startsWith("http")
              ? item.images[0]
              : `${process.env.REACT_APP_API_URL || ""}${item.images[0]}`;
          }

          const dateObj = dayjs(item.event_date || item.created_at);

          return {
            id: item.id,
            slug: item.slug,
            title: item.title,
            excerpt: item.meta_desc || item.description || "",
            image: imgUrl,
            day: dateObj.format("DD"),
            month: `THG ${dateObj.format("MM")}`,
            fullDate: dateObj.format("DD/MM/YYYY"),
          };
        });

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Lỗi gọi API tin tức/sự kiện:", err);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEventData();
  }, []);

  const displaySlides =
    slides.length > 0
      ? slides
      : [
          {
            id: 1,
            title: "Giáo xứ Đồng Quan",
            subtitle: "Thiếu nhi Thánh thể Việt Nam",
            image:
              "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1600",
            link: "https://giaoxudongquan.vercel.app/",
          },
          {
            id: 2,
            title: "Đồng hành cùng Giáo xứ Đồng Quan",
            subtitle: "Nơi kết nối yêu thương và nhận lãnh hồng ân.",
            image:
              "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600",
            link: "https://giaoxudongquan.vercel.app/",
          },
        ];

  const featuredEvent = events.length > 0 ? events[0] : MOCK_NEWS_FEATURED;
  const listEvents = events.length > 1 ? events.slice(1, 4) : MOCK_NEWS_LIST;

  // Dữ liệu Lịch Phụng Vụ (Lấy từ API hoặc dùng dữ liệu bạn cung cấp)
  const scheduleList =
    weeklySchedule.length > 0
      ? weeklySchedule
      : [
          {
            event_id: 23,
            title: "Lễ thường",
            event_date: "2026-08-09T17:00:00.000Z",
            event_time: "19:00:00",
            type: "THUONG",
            priest: "Cha Chiều",
            note: null,
            is_priority: 0,
            schedule_id: 19,
            week_start: "2026-08-09T17:00:00.000Z",
            week_end: "2026-08-15T17:00:00.000Z",
            church_id: 4,
            church_name: "Giáo họ Việt Hưng",
            address:
              "Đường tỉnh 458, Hòa Bình, Xã Quang Lịch, Tỉnh Hưng Yên, Việt Nam",
            district: null,
            ward: "Xã Quang Lịch",
            latitude: "20.39930100",
            longitude: "106.41294733",
          },
          {
            event_id: 24,
            title: "Lễ Thường",
            event_date: "2026-08-09T17:00:00.000Z",
            event_time: "20:00:00",
            type: "THUONG",
            priest: "Cha Chiều",
            note: "Lễ tối tại Giáo xứ",
            is_priority: 0,
            schedule_id: 20,
            week_start: "2026-08-09T17:00:00.000Z",
            week_end: "2026-08-15T17:00:00.000Z",
            church_id: 1,
            church_name: "Giáo xứ Đồng Quan",
            address: "Xã Vũ Quý, Tỉnh Hưng Yên, Việt Nam",
            district: null,
            ward: "Xã Vũ Quý",
            latitude: "20.42037691",
            longitude: "106.40376585",
          },
        ];

  const openGoogleMaps = (lat, lng, address, churchName) => {
    if (lat && lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        "_blank",
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          address || churchName,
        )}`,
        "_blank",
      );
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: goldColor,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <div className="gx-home-page">
        {/* 1. HERO CAROUSEL BANNER */}
        <section className="gx-hero-carousel-wrapper">
          {loadingSlides ? (
            <div className="gx-hero-loading">
              <Spin size="large" tip="Đang tải hình ảnh Giáo xứ..." />
            </div>
          ) : (
            <Carousel
              autoplay
              effect="fade"
              autoplaySpeed={5000}
              speed={1000}
              dots={{ className: "gx-custom-dots" }}
              beforeChange={(_, next) => setActiveSlideIdx(next)}
            >
              {displaySlides.map((slide, idx) => {
                const imageUrl = slide.image?.startsWith("http")
                  ? slide.image
                  : `${process.env.REACT_APP_API_URL || ""}${slide.image}`;

                return (
                  <div key={slide.id || idx}>
                    <div
                      className="gx-hero-slide-item"
                      style={{
                        backgroundImage: `url('${imageUrl}')`,
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={slide.title}
                        style={{ display: "none" }}
                      />

                      <div className="gx-hero-overlay" />

                      <div className="gx-container gx-hero-content">
                        <AnimatePresence mode="wait">
                          {activeSlideIdx === idx && (
                            <motion.div
                              key={slide.id || idx}
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.7, ease: "easeOut" }}
                              className="gx-hero-text"
                            >
                              <span className="gx-hero-subhead">
                                HIỆP NHẤT YÊU THƯƠNG
                              </span>
                              <h1 className="gx-hero-title">{slide.title}</h1>
                              <p className="gx-hero-quote">{slide.subtitle}</p>

                              <div className="gx-hero-buttons">
                                <Button
                                  type="primary"
                                  size="large"
                                  className="gx-btn-gold"
                                  onClick={() => {
                                    if (slide.link?.startsWith("http")) {
                                      window.open(slide.link, "_blank");
                                    } else {
                                      navigate(slide.link || "/gioi-thieu");
                                    }
                                  }}
                                >
                                  Khám phá ngay <ChevronRight size={18} />
                                </Button>
                                <Button
                                  size="large"
                                  className="gx-btn-outline"
                                  onClick={() => navigate("/lich-phung-vu")}
                                >
                                  Lịch Thánh Lễ
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          )}

          {/* Social Floating Bar */}
          <div className="gx-social-float">
            <a href="#cross" className="social-icon">
              †
            </a>
            <a href="#facebook" className="social-icon">
              <Share2 size={18} />
            </a>
            <a href="#youtube" className="social-icon">
              <Share2 size={18} />
            </a>
            <a href="#mail" className="social-icon">
              <Mail size={18} />
            </a>
          </div>
        </section>

        {/* 2. OVERLAPPING FEATURE CARDS */}
        <section className="gx-features-section">
          <div className="gx-container">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="gx-feature-grid"
            >
              {[
                {
                  icon: <Church size={34} />,
                  title: "VỀ GIÁO XỨ",
                  desc: "Tìm hiểu lịch sử hình thành, đức tin và sứ mạng của Giáo xứ.",
                  link: "/gioi-thieu",
                },
                {
                  icon: <Calendar size={34} />,
                  title: "LỊCH PHỤNG VỤ",
                  desc: "Cập nhật lịch Thánh Lễ, các bí tích và các sự kiện trong tháng.",
                  link: "/lich-phung-vu",
                },
                {
                  icon: <Users size={34} />,
                  title: "CÁC HỘI ĐOÀN",
                  desc: "Các hội đoàn, phong trào và hoạt động mục vụ của giáo xứ.",
                  link: "/hoi-doan",
                },
                {
                  icon: <Heart size={34} />,
                  title: "BÁC ÁI - CARITAS",
                  desc: "Chung tay yêu thương, chia sẻ với những người nghèo khó.",
                  link: "/caritas",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  className="gx-feature-card"
                  onClick={() => navigate(item.link)}
                >
                  <div className="feature-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <span className="feature-link">
                    Xem thêm <ChevronRight size={16} />
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 3. TIN TỨC & BẢNG LỊCH PHỤNG VỤ HIỂN THỊ ĐẦY ĐỦ */}
        <section className="gx-section gx-news-section">
          <div className="gx-container">
            <h2 className="gx-section-title">TIN TỨC & SỰ KIỆN</h2>

            {loadingEvents ? (
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </Col>
                <Col xs={24} lg={8}>
                  <Skeleton active paragraph={{ rows: 6 }} />
                </Col>
              </Row>
            ) : (
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                  <Row gutter={[20, 20]}>
                    {/* Bài tin nổi bật Lớn */}
                    <Col xs={24} md={12}>
                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                        className="gx-news-featured-card"
                        onClick={() =>
                          navigate(
                            featuredEvent.slug
                              ? `/su-kien/${featuredEvent.slug}`
                              : `/tin-tuc/${featuredEvent.id}`,
                          )
                        }
                      >
                        <div className="news-img-holder">
                          <img
                            src={featuredEvent.image}
                            alt={featuredEvent.title}
                            loading="lazy"
                          />
                          <div className="news-date-badge">
                            <span className="day">
                              {featuredEvent.day || "01"}
                            </span>
                            <span className="month">
                              {featuredEvent.month || "THG 08"}
                            </span>
                          </div>
                        </div>
                        <div className="news-content">
                          <h3 title={featuredEvent.title}>
                            {featuredEvent.title}
                          </h3>
                          <p>{featuredEvent.excerpt}</p>
                          <span className="news-more-btn">
                            Đọc thêm <ArrowRight size={16} />
                          </span>
                        </div>
                      </motion.div>
                    </Col>

                    {/* Danh sách 3 tin nhỏ */}
                    <Col xs={24} md={12}>
                      <div className="gx-news-list">
                        {listEvents.map((item) => (
                          <motion.div
                            key={item.id}
                            whileHover={{ x: 4 }}
                            className="gx-news-item"
                            onClick={() =>
                              navigate(
                                item.slug
                                  ? `/su-kien/${item.slug}`
                                  : `/tin-tuc/${item.id}`,
                              )
                            }
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="news-item-img"
                              loading="lazy"
                            />
                            <div className="news-item-info">
                              <span className="news-item-date">
                                {item.fullDate || item.date}
                              </span>
                              <h4 title={item.title}>{item.title}</h4>
                              <span className="news-item-more">
                                Đọc thêm <ChevronRight size={14} />
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </Col>
                  </Row>
                </Col>

                {/* Cột Phải: HIỂN THỊ ĐẦY ĐỦ TẤT CẢ LỊCH THÁNH LỄ */}
                <Col xs={24} lg={8}>
                  <Card bordered={false} className="gx-schedule-sidebar-card">
                    <div className="sidebar-card-header">
                      <div className="header-title-box">
                        <Bell size={20} className="header-icon" />
                        <span>LỊCH THÁNH LỄ TRONG TUẦN</span>
                      </div>
                      <Tag className="tag-week-badge">
                        {dayjs(scheduleList[0]?.event_date || dayjs()).format(
                          "DD/MM",
                        )}{" "}
                        -{" "}
                        {dayjs(scheduleList[0]?.event_date || dayjs())
                          .add(6, "day")
                          .format("DD/MM")}
                      </Tag>
                    </div>

                    {loadingSchedule ? (
                      <div style={{ padding: "20px 0", textAlign: "center" }}>
                        <Spin size="medium" />
                        <Skeleton active paragraph={{ rows: 5 }} />
                      </div>
                    ) : (
                      <div className="schedule-items-wrapper">
                        {scheduleList.map((item, idx) => {
                          const timeStr = item.event_time
                            ? item.event_time.slice(0, 5)
                            : "19:00";
                          const dateObj = dayjs(item.event_date);
                          const dayName = dateObj.format("dddd");
                          const dateFormatted = dateObj.format("DD/MM");

                          return (
                            <div
                              className="schedule-item-node"
                              key={item.event_id || idx}
                            >
                              {/* Header Nhỏ của Item */}
                              <div className="item-node-header">
                                <div className="time-badge">
                                  <Clock size={14} />
                                  <span>{timeStr}</span>
                                </div>
                                <Tag className="tag-item-type">
                                  <Sparkles size={11} />{" "}
                                  {item.title || "LỄ THƯỜNG"}
                                </Tag>
                              </div>

                              {/* Tên Giáo họ / Giáo xứ & Ngày cử hành */}
                              <div className="item-node-body">
                                <div className="item-date-text">
                                  <Calendar size={13} />
                                  <span>
                                    {dayName}, {dateFormatted}
                                  </span>
                                </div>

                                <h4 className="item-church-name">
                                  {item.church_name}
                                </h4>

                                {item.priest && (
                                  <div className="item-meta-priest">
                                    <User size={13} />
                                    <span>
                                      Chủ tế: <strong>{item.priest}</strong>
                                    </span>
                                  </div>
                                )}

                                <div className="item-meta-address">
                                  <MapPin size={13} className="pin-icon" />
                                  <span
                                    className="address-text"
                                    title={item.address}
                                  >
                                    {item.address}
                                  </span>
                                </div>
                              </div>

                              {/* Nút chỉ đường cho từng Giáo họ */}
                              <div className="item-node-footer">
                                <Button
                                  type="text"
                                  size="small"
                                  className="btn-maps-link"
                                  onClick={() =>
                                    openGoogleMaps(
                                      item.latitude,
                                      item.longitude,
                                      item.address,
                                      item.church_name,
                                    )
                                  }
                                >
                                  <Compass size={13} />
                                  <span>Chỉ đường Maps</span>
                                  <ChevronRight size={13} />
                                </Button>
                              </div>
                            </div>
                          );
                        })}

                        <Button
                          type="primary"
                          block
                          className="btn-view-all-schedules"
                          onClick={() => navigate("/lich-phung-vu")}
                        >
                          XEM TOÀN BỘ LỊCH PHỤNG VỤ
                        </Button>
                      </div>
                    )}
                  </Card>
                </Col>
              </Row>
            )}
          </div>
        </section>

        {/* 4. CON SỐ ẤN TƯỢNG */}
        <section className="gx-stats-section">
          <div className="gx-container">
            <Row gutter={[24, 32]} align="middle">
              <Col xs={24} lg={8}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="stats-quote-box"
                >
                  <p className="stats-quote">
                    "Hãy đến cùng Thầy, tất cả những ai khó nhọc và gánh nặng
                    nề, Thầy sẽ cho nghỉ ngơi bồi dưỡng."
                  </p>
                  <span className="stats-author">(Mt 11,28)</span>
                </motion.div>
              </Col>

              <Col xs={24} lg={16}>
                <Row gutter={[16, 16]}>
                  {MOCK_STATS.map((stat, idx) => (
                    <Col xs={12} sm={6} key={idx}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="stat-card"
                      >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-number">{stat.count}</div>
                        <div className="stat-label">{stat.label}</div>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </section>

        {/* CSS STYLESHEET DEDICATED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .gx-home-page {
            background-color: #ffffff;
            color: #333333;
            font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
            overflow-x: hidden;
          }

          .gx-container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 0 20px;
            width: 100%;
          }

          /* HERO CAROUSEL BANNER */
          .gx-hero-carousel-wrapper {
            position: relative;
            width: 100%;
            overflow: hidden;
            background-color: ${darkNavy};
          }

          .gx-hero-loading {
            height: 540px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${darkNavy};
            color: #fff;
          }

          .gx-hero-slide-item {
            position: relative;
            height: 560px;
            background-size: cover;
            background-position: center center;
            background-repeat: no-repeat;
            display: flex !important;
            align-items: center;
            color: #ffffff;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            transform: translateZ(0);
            backface-visibility: hidden;
          }

          .gx-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(
              180deg, 
              rgba(11, 25, 44, 0.45) 0%, 
              rgba(11, 25, 44, 0.78) 100%
            );
            z-index: 1;
          }

          .gx-hero-content {
            position: relative;
            z-index: 2;
          }

          .gx-hero-text {
            max-width: 650px;
          }

          .gx-hero-subhead {
            font-size: 13px;
            letter-spacing: 2.5px;
            text-transform: uppercase;
            color: ${goldColor};
            font-weight: 700;
            display: block;
            margin-bottom: 12px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          }

          .gx-hero-title {
            font-size: 42px;
            font-weight: 800;
            color: #ffffff;
            margin: 0 0 16px 0;
            line-height: 1.25;
            text-shadow: 0 3px 10px rgba(0, 0, 0, 0.7);
          }

          .gx-hero-quote {
            font-size: 17px;
            line-height: 1.6;
            color: #f3f4f6;
            margin-bottom: 32px;
            text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
          }

          .gx-hero-buttons {
            display: flex;
            gap: 16px;
          }

          .gx-btn-gold {
            background-color: ${goldColor} !important;
            border-color: ${goldColor} !important;
            color: #ffffff !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
            height: 46px !important;
            padding: 0 24px !important;
            box-shadow: 0 4px 15px rgba(212, 160, 23, 0.4);
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .gx-btn-gold:hover {
            background-color: #b8860b !important;
            border-color: #b8860b !important;
          }

          .gx-btn-outline {
            background: rgba(0, 0, 0, 0.2) !important;
            border: 1.5px solid #ffffff !important;
            color: #ffffff !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
            height: 46px !important;
            padding: 0 28px !important;
            backdrop-filter: blur(4px);
          }

          .gx-btn-outline:hover {
            background: rgba(255, 255, 255, 0.25) !important;
          }

          /* Dots Indicator Antd Carousel */
          .gx-custom-dots {
            bottom: 24px !important;
            z-index: 10 !important;
          }

          .gx-custom-dots li button {
            background: rgba(255, 255, 255, 0.4) !important;
            height: 4px !important;
            border-radius: 2px !important;
          }

          .gx-custom-dots li.slick-active button {
            background: ${goldColor} !important;
            width: 28px !important;
          }

          /* Floating Social Bar */
          .gx-social-float {
            position: absolute;
            right: 24px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 10;
          }

          .social-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.9);
            color: ${darkNavy};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            transition: all 0.2s ease;
          }

          .social-icon:hover {
            background: ${goldColor};
            color: #ffffff;
            transform: scale(1.1);
          }

          /* OVERLAPPING FEATURES */
          .gx-features-section {
            margin-top: -60px;
            position: relative;
            z-index: 5;
            margin-bottom: 60px;
          }

          .gx-feature-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            background: #ffffff;
            border-radius: 12px;
            padding: 28px 24px;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
          }

          .gx-feature-card {
            text-align: center;
            padding: 16px;
            border-right: 1px solid #f0f0f0;
            cursor: pointer;
          }

          .gx-feature-card:last-child { border-right: none; }

          .feature-icon {
            color: ${goldColor};
            margin-bottom: 12px;
            display: flex;
            justify-content: center;
          }

          .gx-feature-card h3 {
            font-size: 15px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
          }

          .gx-feature-card p {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.5;
            margin-bottom: 16px;
          }

          .feature-link {
            font-size: 13px;
            color: ${goldColor};
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          /* TIN TỨC & THÔNG BÁO */
          .gx-section { padding: 40px 0 70px 0; }

          .gx-section-title {
            font-size: 24px;
            font-weight: 800;
            color: ${darkNavy};
            margin-bottom: 30px;
            letter-spacing: 0.5px;
          }

          .gx-news-featured-card {
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
            border: 1px solid #f0f0f0;
            cursor: pointer;
            height: 100%;
          }

          .news-img-holder { position: relative; height: 210px; overflow: hidden; }
          .news-img-holder img { width: 100%; height: 100%; object-fit: cover; }

          .news-date-badge {
            position: absolute;
            top: 12px;
            left: 12px;
            background: rgba(11, 25, 44, 0.85);
            color: #ffffff;
            padding: 6px 12px;
            border-radius: 6px;
            text-align: center;
            line-height: 1.2;
            backdrop-filter: blur(4px);
          }

          .news-date-badge .day { font-size: 18px; font-weight: bold; display: block; color: ${goldColor}; }
          .news-date-badge .month { font-size: 10px; text-transform: uppercase; }

          .news-content { padding: 20px; }
          .news-content h3 {
            font-size: 16px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 10px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .news-content p {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 16px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .news-more-btn { font-size: 13px; color: ${goldColor}; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; }

          .gx-news-list { display: flex; flex-direction: column; gap: 16px; }

          .gx-news-item {
            display: flex;
            gap: 14px;
            background: #ffffff;
            padding: 12px;
            border-radius: 8px;
            border: 1px solid #f0f0f0;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          }

          .news-item-img { width: 90px; height: 75px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
          .news-item-info { display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
          .news-item-date { font-size: 11px; color: #9ca3af; margin-bottom: 4px; }
          .news-item-info h4 {
            font-size: 13px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 6px 0;
            line-height: 1.3;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .news-item-more { font-size: 12px; color: ${goldColor}; font-weight: 600; display: inline-flex; align-items: center; gap: 4px; }

          /* CARD SIDEBAR LỊCH PHỤNG VỤ HIỂN THỊ ĐẦY ĐỦ */
          .gx-schedule-sidebar-card {
            background: linear-gradient(135deg, #ffffff 0%, #fdfbf7 100%) !important;
            border-radius: 16px !important;
            border: 1px solid rgba(212, 160, 23, 0.35) !important;
            box-shadow: 0 10px 28px rgba(11, 25, 44, 0.08) !important;
            padding: 20px !important;
          }

          .sidebar-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(212, 160, 23, 0.2);
          }

          .header-title-box {
            display: flex;
            align-items: center;
            gap: 8px;
            color: ${goldColor};
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 0.5px;
          }

          .header-icon {
            color: ${goldColor};
          }

          .tag-week-badge {
            background: rgba(11, 25, 44, 0.85) !important;
            color: ${goldColor} !important;
            border: 1px solid ${goldColor} !important;
            font-weight: 700 !important;
            border-radius: 12px !important;
            font-size: 11px !important;
          }

          .schedule-items-wrapper {
            display: flex;
            flex-direction: column;
            gap: 14px;
          }

          .schedule-item-node {
            background: #ffffff;
            border: 1px solid #f1f5f9;
            border-left: 4px solid ${goldColor};
            border-radius: 10px;
            padding: 12px 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
            transition: all 0.2s ease;
          }

          .schedule-item-node:hover {
            box-shadow: 0 4px 16px rgba(11, 25, 44, 0.08);
            transform: translateY(-2px);
          }

          .item-node-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .time-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: ${darkNavy};
            color: ${goldColor};
            padding: 3px 10px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 13px;
          }

          .tag-item-type {
            background: rgba(212, 160, 23, 0.1) !important;
            border: 1px solid ${goldColor} !important;
            color: ${darkNavy} !important;
            font-weight: 700 !important;
            font-size: 10px !important;
            border-radius: 8px !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 3px !important;
          }

          .item-node-body {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-bottom: 10px;
          }

          .item-date-text {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
          }

          .item-church-name {
            font-size: 15px !important;
            font-weight: 800 !important;
            color: ${darkNavy} !important;
            margin: 2px 0 !important;
          }

          .item-meta-priest {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: #475569;
          }

          .item-meta-address {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            font-size: 11px;
            color: #64748b;
          }

          .pin-icon {
            color: ${goldColor};
            margin-top: 2px;
            flex-shrink: 0;
          }

          .address-text {
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .item-node-footer {
            display: flex;
            justify-content: flex-end;
            border-top: 1px dashed #f1f5f9;
            padding-top: 6px;
          }

          .btn-maps-link {
            color: ${goldColor} !important;
            font-weight: 700 !important;
            font-size: 11px !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 4px !important;
            padding: 0 !important;
            height: auto !important;
          }

          .btn-maps-link:hover {
            color: #b8860b !important;
          }

          .btn-view-all-schedules {
            background-color: ${goldColor} !important;
            border-color: ${goldColor} !important;
            color: #ffffff !important;
            font-weight: 700 !important;
            height: 40px !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(212, 160, 23, 0.3) !important;
            margin-top: 6px;
            font-size: 12px !important;
            letter-spacing: 0.5px;
          }

          .btn-view-all-schedules:hover {
            background-color: #b8860b !important;
            border-color: #b8860b !important;
          }

          /* CON SỐ ẤN TƯỢNG */
          .gx-stats-section {
            background: ${darkNavy};
            color: #ffffff;
            padding: 60px 0;
          }

          .stats-quote-box { border-left: 3px solid ${goldColor}; padding-left: 20px; }
          .stats-quote { font-size: 16px; line-height: 1.6; color: #e5e7eb; margin-bottom: 8px; font-style: italic; }
          .stats-author { font-size: 13px; color: #9ca3af; }

          .stat-card { text-align: center; }
          .stat-icon { color: ${goldColor}; margin-bottom: 8px; display: flex; justify-content: center; }
          .stat-number { font-size: 28px; font-weight: 800; color: ${goldColor}; line-height: 1.2; }
          .stat-label { font-size: 13px; color: #d1d5db; margin-top: 4px; }

          /* RESPONSIVE */
          @media (max-width: 992px) {
            .gx-feature-grid { grid-template-columns: repeat(2, 1fr); }
            .gx-feature-card { border-right: none; border-bottom: 1px solid #f0f0f0; }
            .gx-social-float { display: none; }
          }

          @media (max-width: 768px) {
            .gx-hero-slide-item { height: 460px; }
            .gx-hero-title { font-size: 30px; }
          }

          @media (max-width: 576px) {
            .gx-feature-grid { grid-template-columns: 1fr; }
            .gx-hero-title { font-size: 28px; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
}

export default Home;
