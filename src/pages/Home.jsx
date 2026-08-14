import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Button,
  ConfigProvider,
  Skeleton,
  Spin,
  Carousel,
  message,
} from "antd";
import {
  ChevronRight,
  Calendar,
  Heart,
  Users,
  Church,
  Mail,
} from "lucide-react";
import { FacebookFilled, YoutubeFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { getSlides } from "../api/slideApi";
import { getWeekSchedule } from "../api/scheduleApi";
import { getEvents } from "../api/eventApi";
import NewsSection from "../components/home/NewsSection";
import MassScheduleSection from "../components/home/MassScheduleSection";
import MediaSection from "../components/home/MediaSection";
dayjs.locale("vi");

// Dữ liệu Slides chuẩn từ Database/API
const MOCK_SLIDES_DATA = [
  {
    id: 1,
    title: "Giáo xứ Đồng Quan",
    subtitle: "Thiếu nhi Thánh thể Việt Nam",
    image: "/uploads/slides/c54b5171-cd1a-4fb9-b799-4052b2d44f7a.png",
    link: "https://giaoxudongquan.vercel.app/",
    is_active: 1,
    sort_order: 1,
    created_at: "2026-05-14T10:26:49.000Z",
    updated_at: "2026-07-30T04:39:15.000Z",
  },
  {
    id: 2,
    title: "Đồng hành cùng Giáo xứ Đồng Quan",
    subtitle: "Nơi kết nối yêu thương và nhận lãnh hồng ân.",
    image: "/uploads/slides/d7176211-2577-4f14-b8bc-25accadc91d5.png",
    link: "https://giaoxudongquan.vercel.app/",
    is_active: 1,
    sort_order: 2,
    created_at: "2026-05-14T13:08:30.000Z",
    updated_at: "2026-06-03T04:43:34.000Z",
  },
];

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
  {
    icon: <Users size={32} />,
    count: 3250,
    suffix: "+",
    label: "Giáo dân",
    useSeparator: true,
  },
  {
    icon: <Users size={32} />,
    count: 12,
    suffix: "",
    label: "Hội đoàn",
    useSeparator: false,
  },
  {
    icon: <Church size={32} />,
    count: 25,
    suffix: "+",
    label: "Năm hình thành",
    useSeparator: false,
  },
  {
    icon: <Heart size={32} />,
    count: 150,
    suffix: "+",
    label: "Hoạt động bác ái",
    useSeparator: false,
  },
];

const PrayerWallSection = () => (
  <motion.section
    className="gx-section gx-prayer-section"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8 }}
  >
    <div className="gx-container">
      <div className="gx-prayer-box">
        <div className="prayer-header-content">
          <span className="gx-section-subhead">
            <Heart size={14} /> HIỆP Ý CẦU NGUYỆN
          </span>
          <h2>Gửi Ý Nguyện Cầu Nguyện</h2>
          <p>
            “Anh em hãy mang gánh nặng cho nhau, như vậy anh em sẽ chu toàn lề
            luật Chúa Kitô.”
          </p>
        </div>
        <div className="prayer-actions">
          <Button type="primary" size="large" className="gx-btn-gold">
            Gửi Ý Xin Lễ / Cầu Nguyện <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  </motion.section>
);
// Cấu hình link MXH của Giáo xứ
const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=100077253045004",
  youtube: "https://www.youtube.com/@xuanthuongstudio",
  email: "mailto:giaoxudongquan@gmail.com",
};

function Home() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const goldColor = "#D4A017";
  const darkNavy = "#0B192C";
  const API_URL = process.env.REACT_APP_API_URL || "";

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

  // Cuộn lên đầu trang
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Chia sẻ liên kết trang web hoặc sao chép URL
  const handleShareOrEmail = async (e) => {
    e.preventDefault();
    const shareData = {
      title: "Giáo Xứ Đồng Quan | Giáo Phận Thái Bình",
      text: "Ghé thăm trang thông tin chính thức của Giáo xứ Đồng Quan",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        message.info("Đã hủy chia sẻ");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        message.success("Đã sao chép liên kết trang web!");
      } catch (err) {
        window.location.href = SOCIAL_LINKS.email;
      }
    }
  };

  // 1. Lấy danh sách Slide
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoadingSlides(true);
        const res = await getSlides({ is_active: 1, sort: "sort_order" });
        const data = res?.data?.data || res?.data || res;

        if (Array.isArray(data) && data.length > 0) {
          const sorted = data.sort((a, b) => a.sort_order - b.sort_order);
          setSlides(sorted);
        } else {
          setSlides(MOCK_SLIDES_DATA);
        }
      } catch (err) {
        console.error("Lỗi lấy slide:", err);
        setSlides(MOCK_SLIDES_DATA);
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
        const res = await getWeekSchedule({ week_start: weekStart });
        const eventList = res?.data?.events || res?.data || [];

        setWeeklySchedule(Array.isArray(eventList) ? eventList : []);
      } catch (err) {
        console.error(
          "Lỗi 400 Bad Request:",
          err.response?.data || err.message,
        );
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchScheduleData();
  }, []);

  // 3. Lấy danh sách Sự kiện / Tin tức
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
              : `${API_URL}${item.images[0]}`;
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
  }, [API_URL]);

  const displaySlides = slides.length > 0 ? slides : MOCK_SLIDES_DATA;
  const featuredEvent = events.length > 0 ? events[0] : MOCK_NEWS_FEATURED;
  const listEvents = events.length > 1 ? events.slice(1, 4) : MOCK_NEWS_LIST;

  // Dữ liệu Lịch Phụng Vụ
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
            church_name: "Không có data",
            address:
              "Đường tỉnh 458, Hòa Bình, Xã Quang Lịch, Tỉnh Hưng Yên, Việt Nam",
            district: null,
            ward: "Xã Quang Lịch",
            latitude: "20.39930100",
            longitude: "106.41294733",
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
                  : `${API_URL}${slide.image}`;

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
                              {/* Subhead với hiệu ứng scale nhẹ */}
                              <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="gx-hero-subhead"
                              >
                                HIỆP NHẤT YÊU THƯƠNG
                              </motion.span>

                              <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="gx-hero-title"
                              >
                                {slide.title}
                              </motion.h1>

                              <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="gx-hero-quote"
                              >
                                {slide.subtitle}
                              </motion.p>

                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="gx-hero-buttons"
                              >
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
                              </motion.div>
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

          {/* Social Floating Bar với hiệu ứng Motion Hover */}
          <motion.div
            className="gx-social-float"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.a
              href="#top"
              className="social-icon cross-btn"
              onClick={scrollToTop}
              title="Lên đầu trang"
              aria-label="Lên đầu trang"
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              †
            </motion.a>

            <motion.a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon fb-btn"
              title="Fanpage Facebook Giáo xứ"
              aria-label="Facebook"
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <FacebookFilled style={{ fontSize: 18 }} />
            </motion.a>

            <motion.a
              href={SOCIAL_LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon yt-btn"
              title="Kênh Youtube Giáo xứ"
              aria-label="Youtube"
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <YoutubeFilled style={{ fontSize: 18 }} />
            </motion.a>

            <motion.a
              href="#share"
              onClick={handleShareOrEmail}
              className="social-icon share-btn"
              title="Chia sẻ trang web"
              aria-label="Chia sẻ"
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail size={18} />
            </motion.a>
          </motion.div>
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
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  whileTap={{ scale: 0.98 }}
                  className="gx-feature-card"
                  onClick={() => navigate(item.link)}
                >
                  <motion.div
                    className="feature-icon"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.icon}
                  </motion.div>
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
        {/* 3. TIN TỨC & BẢNG LỊCH PHỤNG VỤ CAO CẤP */}
        <section className="gx-section gx-news-section">
          <div className="gx-container">
            {/* Header Section... */}
            {loadingEvents ? (
              <Skeleton active />
            ) : (
              <>
                <Row gutter={[28, 28]}>
                  <NewsSection
                    loadingEvents={loadingEvents}
                    featuredEvent={featuredEvent}
                    listEvents={listEvents}
                    navigate={navigate}
                    staggerContainer={staggerContainer}
                    fadeInUp={fadeInUp}
                  />
                </Row>
                <Row gutter={[28, 28]} style={{ marginTop: "40px" }}>
                  <MassScheduleSection
                    loadingSchedule={loadingSchedule}
                    scheduleList={scheduleList}
                    openGoogleMaps={openGoogleMaps}
                    fadeInUp={fadeInUp}
                    navigate={navigate}
                  />
                </Row>
              </>
            )}
          </div>
        </section>
        <section className="gx-section gx-news-section">
          <div className="gx-container">
            <MediaSection />
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
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        className="stat-card"
                      >
                        <div className="stat-icon">{stat.icon}</div>

                        <div className="stat-number">
                          <CountUp
                            start={0}
                            end={stat.count}
                            duration={2.5}
                            separator={stat.useSeparator ? "." : ""}
                            suffix={stat.suffix}
                            enableScrollSpy={true}
                            scrollSpyOnce={true}
                          />
                        </div>

                        <div className="stat-label">{stat.label}</div>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </div>
        </section>
        <PrayerWallSection />
        {/* CSS STYLESHEET DEDICATED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            /* ==========================================
   1. MEDIA SECTION STYLING (GÓC TÂM TÌNH & VIDEO)
   ================================---------- */
.gx-media-section {
  padding: 60px 0;
  background-color: #fafbfc;
}

.gx-media-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #eaeaea;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.gx-media-card:hover {
  box-shadow: 0 12px 30px rgba(212, 160, 23, 0.15);
  border-color: rgba(212, 160, 23, 0.4);
}

.media-thumbnail {
  position: relative;
  width: 100%;
  height: 190px;
  background: linear-gradient(135deg, #0b192c, #1e3a5f);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.play-btn-overlay {
  width: 50px;
  height: 50px;
  background: rgba(212, 160, 23, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, background 0.3s ease;
}

.gx-media-card:hover .play-btn-overlay {
  transform: scale(1.1);
  background: #d4a017;
}

.play-icon {
  margin-left: 3px; /* Cân chỉnh icon play cho chuẩn thị giác */
  font-size: 16px;
}

.media-tag {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(11, 25, 44, 0.75) !important;
  backdrop-filter: blur(6px);
  color: #fff !important;
  border: none !important;
  font-weight: 500;
  border-radius: 6px;
  padding: 2px 10px;
}

.media-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}

.media-info h4 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0b192c;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.media-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #666;
}

.media-meta svg {
  color: #d4a017;
}


/* ==========================================
   2. PRAYER WALL SECTION STYLING (HIỆP Ý CẦU NGUYỆN)
   ================================---------- */
.gx-prayer-section {
  padding: 40px 0 70px 0;
  background-color: #fafbfc;
}

.gx-prayer-box {
  background: linear-gradient(135deg, #0b192c 0%, #162c4a 100%);
  border-radius: 24px;
  padding: 50px 40px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(11, 25, 44, 0.15);
  border: 1px solid rgba(212, 160, 23, 0.2);
}

/* Hiệu ứng nền trang trí mờ nhẹ */
.gx-prayer-box::before {
  content: "";
  position: absolute;
  top: -50px;
  right: -50px;
  width: 200px;
  height: 200px;
  background: rgba(212, 160, 23, 0.08);
  border-radius: 50%;
  pointer-events: none;
}

.prayer-header-content {
  max-width: 700px;
  margin: 0 auto 30px auto;
}

.gx-prayer-box .gx-section-subhead {
  color: #d4a017;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  background: rgba(212, 160, 23, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
}

.gx-prayer-box h2 {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 15px;
}

.gx-prayer-box p {
  color: #d0d7de;
  font-size: 1.05rem;
  line-height: 1.6;
  font-style: italic;
  margin: 0;
}

.prayer-actions {
  display: flex;
  justify-content: center;
}

.gx-btn-gold {
  background: #d4a017 !important;
  border-color: #d4a017 !important;
  color: #0b192c !important;
  font-weight: 700;
  height: 48px;
  padding: 0 28px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(212, 160, 23, 0.3);
  transition: all 0.3s ease;
}

.gx-btn-gold:hover {
  background: #e6b825 !important;
  border-color: #e6b825 !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212, 160, 23, 0.4);
}
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

          /* FLOATING SOCIAL BAR */
          .gx-social-float {
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            z-index: 999;
          }

          .social-icon {
            width: 44px;
            height: 44px;
            background: rgba(255, 255, 255, 0.92);
            color: #0B192C;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            font-weight: 700;
            font-size: 18px;
            border: 1px solid rgba(212, 160, 23, 0.35);
            box-shadow: 0 8px 20px rgba(11, 25, 44, 0.12);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }

          .social-icon svg {
            transition: transform 0.3s ease;
          }

          .social-icon.cross-btn:hover {
            background: #D4A017;
            color: #ffffff;
            border-color: #D4A017;
            transform: translateY(-4px) scale(1.08);
            box-shadow: 0 10px 24px rgba(212, 160, 23, 0.45);
          }

          .social-icon.fb-btn:hover {
            background: #1877F2;
            color: #ffffff;
            border-color: #1877F2;
            transform: translateY(-4px) scale(1.08);
            box-shadow: 0 10px 24px rgba(24, 119, 242, 0.4);
          }

          .social-icon.yt-btn:hover {
            background: #FF0000;
            color: #ffffff;
            border-color: #FF0000;
            transform: translateY(-4px) scale(1.08);
            box-shadow: 0 10px 24px rgba(255, 0, 0, 0.4);
          }

          .social-icon.share-btn:hover {
            background: #10B981;
            color: #ffffff;
            border-color: #10B981;
            transform: translateY(-4px) scale(1.08);
            box-shadow: 0 10px 24px rgba(16, 185, 129, 0.4);
          }

          .social-icon:hover svg {
            transform: scale(1.15);
          }

          .social-icon:active {
            transform: translateY(-1px) scale(0.96);
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

          /* NEWSPAPER & SCHEDULE SECTION STYLING */
          .gx-news-section {
            padding: 50px 0 80px 0;
            background-color: #f8fafc;
          }

          .gx-section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 28px;
          }

          .gx-section-subhead {
            font-size: 11px;
            letter-spacing: 2px;
            color: #D4A017;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 6px;
            text-transform: uppercase;
            margin-bottom: 4px;
          }

          .gx-section-title {
            font-size: 26px;
            font-weight: 800;
            color: #0B192C;
            margin: 0;
            letter-spacing: -0.5px;
          }

          .gx-link-more-desktop {
            color: #D4A017 !important;
            font-weight: 700;
            font-size: 14px;
            padding: 0;
          }

          .news-block-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .gx-news-hero-card {
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(11, 25, 44, 0.05);
            border: 1px solid #e2e8f0;
            cursor: pointer;
            display: flex;
            flex-direction: column;
          }

          .news-hero-img-box {
            position: relative;
            height: 240px;
            overflow: hidden;
          }

          .news-hero-img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .gx-news-hero-card:hover .news-hero-img-box img {
            transform: scale(1.05);
          }

          .news-hero-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(11, 25, 44, 0.7) 100%);
          }

          .news-hero-date-tag {
            position: absolute;
            bottom: 12px;
            left: 16px;
            background: rgba(11, 25, 44, 0.85);
            color: #ffffff;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
            backdrop-filter: blur(4px);
            border: 1px solid rgba(212, 160, 23, 0.4);
          }

          .news-hero-content {
            padding: 20px 24px;
          }

          .news-category-badge {
            font-size: 10px;
            font-weight: 800;
            color: #D4A017;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: block;
            margin-bottom: 6px;
          }

          .news-hero-title {
            font-size: 18px;
            font-weight: 800;
            color: #0B192C;
            margin: 0 0 8px 0;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .news-hero-excerpt {
            font-size: 13.5px;
            color: #64748b;
            line-height: 1.6;
            margin-bottom: 16px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .news-read-more-btn {
            font-size: 13px;
            color: #D4A017;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }

          .gx-sub-news-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .gx-sub-news-item {
            display: flex;
            gap: 14px;
            background: #ffffff;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
            transition: all 0.2s ease;
          }

          .sub-news-img-box {
            width: 90px;
            height: 70px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
          }

          .sub-news-img-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .sub-news-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
          }

          .sub-news-date {
            font-size: 11px;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 4px;
            margin-bottom: 4px;
          }

          .sub-news-title {
            font-size: 13.5px;
            font-weight: 700;
            color: #1e293b;
            margin: 0 0 4px 0;
            line-height: 1.35;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .sub-news-link {
            font-size: 11.5px;
            color: #D4A017;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 2px;
          }

          /* CỘT PHẢI: LỊCH PHỤNG VỤ LUXE SIDEBAR */
          .gx-schedule-luxe-card {
            background: #ffffff !important;
            border-radius: 20px !important;
            border: 1px solid rgba(212, 160, 23, 0.3) !important;
            box-shadow: 0 10px 30px rgba(11, 25, 44, 0.06) !important;
            padding: 20px !important;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .luxe-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
          }

          .luxe-header-title {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .bell-icon-wrap {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: rgba(212, 160, 23, 0.12);
            color: #D4A017;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .luxe-header-title h3 {
            font-size: 15px;
            font-weight: 800;
            color: #0B192C;
            margin: 0;
            line-height: 1.2;
          }

          .sub-header-text {
            font-size: 11px;
            color: #94a3b8;
          }

          .luxe-week-tag {
            background: #0B192C !important;
            color: #D4A017 !important;
            border: 1px solid #D4A017 !important;
            font-weight: 700 !important;
            border-radius: 12px !important;
            font-size: 11px !important;
          }

          .luxe-schedule-scroll-area {
            max-height: 410px;
            overflow-y: auto;
            padding-right: 4px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .luxe-schedule-scroll-area::-webkit-scrollbar {
            width: 4px;
          }
          .luxe-schedule-scroll-area::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }

          .luxe-schedule-node {
            display: flex;
            gap: 14px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 14px;
            transition: all 0.25s ease;
          }

          .luxe-schedule-node:hover {
            background: #ffffff;
            border-color: #D4A017;
            box-shadow: 0 4px 16px rgba(11, 25, 44, 0.08);
          }

          .node-time-col {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #0B192C;
            color: #D4A017;
            padding: 8px 10px;
            border-radius: 10px;
            min-width: 62px;
            flex-shrink: 0;
          }

          .node-time {
            font-size: 15px;
            font-weight: 800;
            line-height: 1;
          }

          .node-day {
            font-size: 10px;
            color: #ffffff;
            font-weight: 600;
            text-transform: capitalize;
            margin-top: 4px;
          }

          .node-info-col {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }

          .node-top-tags {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .node-date {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .pill-tag-normal {
            background: rgba(212, 160, 23, 0.12) !important;
            border: 1px solid rgba(212, 160, 23, 0.4) !important;
            color: #0B192C !important;
            font-size: 10px !important;
            font-weight: 700 !important;
            border-radius: 6px !important;
          }

          .pill-tag-priority {
            font-size: 10px !important;
            font-weight: 800 !important;
            border-radius: 6px !important;
          }

          .node-church-title {
            font-size: 14px;
            font-weight: 800;
            color: #0B192C;
            margin: 2px 0;
          }

          .node-meta-priest, .node-meta-address {
            font-size: 11.5px;
            color: #475569;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .gold-icon {
            color: #D4A017;
            flex-shrink: 0;
          }

          .node-meta-address span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 180px;
          }

          .node-action-bar {
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px dashed #e2e8f0;
          }

          .btn-maps-action {
            background: transparent;
            border: none;
            color: #D4A017;
            font-size: 11px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 0;
            cursor: pointer;
            transition: color 0.2s;
          }

          .btn-maps-action:hover {
            color: #b8860b;
          }

          .luxe-card-footer {
            margin-top: 14px;
          }

          .btn-full-schedule-nav {
            background-color: #D4A017 !important;
            border-color: #D4A017 !important;
            color: #ffffff !important;
            font-weight: 700 !important;
            height: 42px !important;
            border-radius: 10px !important;
            box-shadow: 0 4px 14px rgba(212, 160, 23, 0.3) !important;
            font-size: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
          }

          .btn-full-schedule-nav:hover {
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
            .gx-social-float { right: 12px; gap: 8px; }
            .social-icon { width: 38px; height: 38px; font-size: 16px; }
          }

          @media (max-width: 768px) {
            .gx-hero-slide-item { height: 460px; }
            .gx-hero-title { font-size: 30px; }
          }

          @media (max-width: 576px) {
            .gx-feature-grid { grid-template-columns: 1fr; }
            .gx-hero-title { font-size: 28px; }
            .gx-social-float { display: none; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
}

export default Home;
