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
  ChevronDown,
  Sparkles,
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
import PrayerWallSection from "../components/home/PrayerWallSection";
dayjs.locale("vi");

const MOCK_SLIDES_DATA = [
  {
    id: 1,
    title: "Giáo xứ Đồng Quan",
    subtitle:
      "Nơi vun đắp đức tin, lan tỏa yêu thương và nhận lãnh hồng ân Thiên Chúa.",
    image: "/uploads/slides/c54b5171-cd1a-4fb9-b799-4052b2d44f7a.png",
    link: "https://giaoxudongquan.vercel.app/",
    is_active: 1,
    sort_order: 1,
  },
  {
    id: 2,
    title: "Hiệp Nhất & Loan Báo Tin Mừng",
    subtitle: "Cùng nhau bước đi trong ánh sáng Đức Kitô và phục vụ cộng đoàn.",
    image: "/uploads/slides/d7176211-2577-4f14-b8bc-25accadc91d5.png",
    link: "https://giaoxudongquan.vercel.app/",
    is_active: 1,
    sort_order: 2,
  },
];

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
    icon: <Users size={28} />,
    count: 3250,
    suffix: "+",
    label: "Giáo dân",
    useSeparator: true,
  },
  {
    icon: <Church size={28} />,
    count: 12,
    suffix: "",
    label: "Hội đoàn",
    useSeparator: false,
  },
  {
    icon: <Sparkles size={28} />,
    count: 115,
    suffix: "+",
    label: "Năm thành lập",
    useSeparator: false,
  },
  {
    icon: <Heart size={28} />,
    count: 150,
    suffix: "+",
    label: "Hoạt động bác ái",
    useSeparator: false,
  },
];

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
  const API_URL = process.env.REACT_APP_API_URL || "";

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

  const scrollToNextSection = () => {
    const nextEl = document.getElementById("main-features-section");
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  // Fetch Slides
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

  // Fetch Schedule (Chuẩn thứ 2 đầu tuần)
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoadingSchedule(true);
        const now = dayjs();
        const dayOfWeek = now.day();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const weekStart = now.add(mondayOffset, "day").format("YYYY-MM-DD");

        const res = await getWeekSchedule({ week_start: weekStart });
        const eventList = res?.data?.events || res?.data || [];
        setWeeklySchedule(Array.isArray(eventList) ? eventList : []);
      } catch (err) {
        console.error("Lỗi lấy lịch phụng vụ:", err);
      } finally {
        setLoadingSchedule(false);
      }
    };
    fetchScheduleData();
  }, []);

  // Fetch Events
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
        console.error("Lỗi gọi API tin tức:", err);
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
            church_name: "Giáo xứ Đồng Quan",
            address: "Xã Quang Lịch, Huyện Kiến Xương, Tỉnh Thái Bình",
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
        {/* 1. HERO BANNER DECK RESPONSIVE TỐI ƯU MOBILE */}
        <section className="gx-hero-169-wrapper">
          {loadingSlides ? (
            <div className="gx-hero-loading">
              <Spin size="large" tip="Đang tải hình ảnh Giáo xứ..." />
            </div>
          ) : (
            <Carousel
              autoplay
              effect="fade"
              autoplaySpeed={5000}
              dots={{ className: "gx-custom-dots-169" }}
              beforeChange={(_, next) => setActiveSlideIdx(next)}
            >
              {displaySlides.map((slide, idx) => {
                const imageUrl = slide.image?.startsWith("http")
                  ? slide.image
                  : `${API_URL}${slide.image}`;

                return (
                  <div key={slide.id || idx}>
                    <div className="gx-hero-169-slide">
                      <img
                        src={imageUrl}
                        alt={slide.title || "Hình ảnh Giáo xứ"}
                        className="gx-hero-169-img"
                        loading={idx === 0 ? "eager" : "lazy"}
                      />

                      <div className="gx-hero-169-content-overlay">
                        <div className="gx-container">
                          <AnimatePresence mode="wait">
                            {activeSlideIdx === idx && (
                              <motion.div
                                key={slide.id || idx}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6 }}
                                className="gx-hero-169-text"
                              >
                                <span className="gx-badge-sharp">
                                  GIÁO PHẬN THÁI BÌNH
                                </span>
                                <h1 className="gx-title-sharp">
                                  {slide.title}
                                </h1>
                                <p className="gx-sub-sharp">{slide.subtitle}</p>

                                <div className="gx-hero-buttons">
                                  <Button
                                    type="primary"
                                    size="large"
                                    className="gx-btn-gold-lg"
                                    onClick={() => {
                                      if (slide.link?.startsWith("http")) {
                                        window.open(slide.link, "_blank");
                                      } else {
                                        navigate(slide.link || "/gioi-thieu");
                                      }
                                    }}
                                  >
                                    Khám Phá Giáo Xứ <ChevronRight size={18} />
                                  </Button>
                                  <Button
                                    size="large"
                                    className="gx-btn-outline-crisp"
                                    onClick={() => navigate("/lich-phung-vu")}
                                  >
                                    Xem Lịch Thánh Lễ
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          )}

          <motion.div
            className="gx-scroll-down-btn"
            onClick={scrollToNextSection}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          >
            <span>Cuộn xuống</span>
            <ChevronDown size={18} />
          </motion.div>
        </section>

        {/* FLOATING SOCIAL BAR */}
        <motion.div
          className="gx-social-float-glass"
          initial={{ opacity: 0, x: 40 }}
          animate={{
            opacity: 1,
            x: 0,
            y: ["-50%", "-54%", "-50%"],
          }}
          transition={{
            x: { duration: 0.8, delay: 0.6 },
            opacity: { duration: 0.8, delay: 0.6 },
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
          }}
        >
          <motion.a
            href="#top"
            className="social-icon cross-btn"
            onClick={scrollToTop}
            title="Lên đầu trang"
            whileHover={{ scale: 1.2, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            †
          </motion.a>
          <motion.a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon fb-btn"
            title="Facebook Giáo xứ"
            whileHover={{ scale: 1.2, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <FacebookFilled style={{ fontSize: 18 }} />
          </motion.a>
          <motion.a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon yt-btn"
            title="Youtube Giáo xứ"
            whileHover={{ scale: 1.2, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <YoutubeFilled style={{ fontSize: 18 }} />
          </motion.a>
          <motion.a
            href="#share"
            onClick={handleShareOrEmail}
            className="social-icon share-btn"
            title="Chia sẻ"
            whileHover={{ scale: 1.2, x: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <Mail size={18} />
          </motion.a>
        </motion.div>

        {/* 2. OVERLAPPING FLOATING STATS BAR (4 CỘT TRÊN MOBILE) */}
        <div className="gx-floating-stats-wrapper">
          <div className="gx-container">
            <motion.div
              className="gx-stats-floating-card"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Row
                gutter={[
                  { xs: 4, sm: 16 },
                  { xs: 8, sm: 24 },
                ]}
                align="middle"
              >
                {MOCK_STATS.map((stat, idx) => (
                  <Col xs={6} sm={6} key={idx}>
                    <div className="stat-item-modern">
                      <div className="stat-icon-badge">{stat.icon}</div>
                      <div className="stat-info">
                        <div className="stat-value">
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
                        <div className="stat-name">{stat.label}</div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          </div>
        </div>

        {/* 3. FEATURE CARDS SECTION */}
        <section className="gx-features-section-v2" id="main-features-section">
          <div className="gx-container">
            <div className="gx-section-header text-start">
              <span className="gx-news-subtitle-tag">- DANH MỤC CHÍNH -</span>
              <h2 className="gx-news-main-title">Đồng Hành Cùng Giáo Xứ</h2>
              <div className="gx-header-divider" />
            </div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="gx-feature-grid-v2"
            >
              {[
                {
                  icon: <Church size={36} />,
                  title: "VỀ GIÁO XỨ",
                  desc: "Tìm hiểu lịch sử hình thành, đức tin và sứ mạng của Giáo xứ Đồng Quan.",
                  link: "/gioi-thieu",
                  bgNum: "01",
                },
                {
                  icon: <Calendar size={36} />,
                  title: "LỊCH PHỤNG VỤ",
                  desc: "Cập nhật chi tiết giờ Thánh Lễ, các bí tích và sự kiện trong tuần.",
                  link: "/lich-phung-vu",
                  bgNum: "02",
                },
                {
                  icon: <Users size={36} />,
                  title: "CÁC HỘI ĐOÀN",
                  desc: "Sinh hoạt tôn giáo, đoàn thể và phong trào thi đua nhân ái.",
                  link: "/hoi-doan",
                  bgNum: "03",
                },
                {
                  icon: <Heart size={36} />,
                  title: "BÁC ÁI CARITAS",
                  desc: "Chung tay san sẻ tình thương, giúp đỡ những gia đình hoàn cảnh khó khăn.",
                  link: "/caritas",
                  bgNum: "04",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="gx-feature-card-v2"
                  onClick={() => navigate(item.link)}
                >
                  <span className="card-bg-number">{item.bgNum}</span>
                  <div className="feature-icon-v2">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="feature-action-link">
                    <span>Khám phá</span>
                    <ChevronRight size={16} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* 4. TIN TỨC & LỊCH PHỤNG VỤ */}
        <section className="gx-section gx-news-schedule-wrapper">
          <div className="gx-container">
            {loadingEvents ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <>
                <Row gutter={[32, 32]}>
                  <NewsSection
                    loadingEvents={loadingEvents}
                    featuredEvent={featuredEvent}
                    listEvents={listEvents}
                    navigate={navigate}
                    staggerContainer={staggerContainer}
                    fadeInUp={fadeInUp}
                  />
                </Row>
                <Row gutter={[32, 32]} style={{ marginTop: "50px" }}>
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

        {/* 5. MEDIA GALLERY SECTION */}
        <section className="gx-section gx-media-bg">
          <div className="gx-container">
            <MediaSection />
          </div>
        </section>

        {/* 6. PRAYER WALL */}
        <PrayerWallSection />

        {/* TỔNG HỢP CSS ĐẦY ĐỦ VÀ TỐI ƯU MOBILE */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            .gx-home-page {
              background-color: #f8fafc;
              padding-top: 99px;
              color: #1e293b;
              font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
              overflow-x: hidden;
            }

            .gx-container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 24px;
              width: 100%;
            }

            .gx-section {
              padding: 80px 0;
            }

            /* 1. HERO BANNER STYLE */
            .gx-hero-169-wrapper {
              position: relative;
              width: 100%;
              background-color: #0b192c;
              overflow: hidden;
            }

            .gx-hero-loading {
              height: 450px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
            }

            .gx-hero-169-slide {
              position: relative;
              width: 100%;
              aspect-ratio: 16 / 9;
              max-height: 85vh;
              display: flex !important;
              align-items: flex-end;
            }

            .gx-hero-169-img {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              object-position: center center;
              image-rendering: -webkit-optimize-contrast;
              z-index: 1;
            }

            .gx-hero-169-content-overlay {
              position: relative;
              z-index: 2;
              width: 100%;
              padding-bottom: 50px;
              padding-top: 80px;
              background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0) 0%,
                rgba(11, 25, 44, 0.4) 40%,
                rgba(11, 25, 44, 0.85) 100%
              );
            }

            .gx-hero-169-text {
              max-width: 720px;
            }

            .gx-badge-sharp {
              display: inline-block;
              font-size: 13px;
              font-weight: 700;
              color: #d4a017;
              letter-spacing: 2px;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
            }

            .gx-title-sharp {
              font-size: 42px;
              font-weight: 800;
              color: #ffffff;
              line-height: 1.2;
              margin-bottom: 12px;
              text-shadow: 0 3px 12px rgba(0, 0, 0, 0.9);
            }

            .gx-sub-sharp {
              font-size: 16px;
              color: #f8fafc;
              margin-bottom: 24px;
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
            }

            .gx-hero-buttons {
              display: flex;
              gap: 16px;
              flex-wrap: wrap;
            }

            .gx-btn-gold-lg {
              background: #d4a017 !important;
              border-color: #d4a017 !important;
              color: #0b192c !important;
              font-weight: 700 !important;
              height: 48px !important;
              padding: 0 28px !important;
              border-radius: 8px !important;
              display: inline-flex;
              align-items: center;
              gap: 8px;
            }

            .gx-btn-outline-crisp {
              background: rgba(0, 0, 0, 0.3) !important;
              border: 1.5px solid #ffffff !important;
              color: #ffffff !important;
              font-weight: 600 !important;
              border-radius: 8px !important;
              height: 48px !important;
              padding: 0 28px !important;
              backdrop-filter: blur(4px);
            }

            .gx-btn-outline-crisp:hover {
              background: rgba(255, 255, 255, 0.2) !important;
            }

            .gx-custom-dots-169 {
              bottom: 20px !important;
              z-index: 10 !important;
            }

            .gx-scroll-down-btn {
              position: absolute;
              bottom: 60px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 10;
              display: flex;
              flex-direction: column;
              align-items: center;
              color: rgba(255, 255, 255, 0.7);
              font-size: 11px;
              cursor: pointer;
              letter-spacing: 1px;
              text-transform: uppercase;
            }

            /* FLOATING SOCIAL BAR */
            .gx-social-float-glass {
              position: fixed;
              right: 20px;
              top: 50%;
              transform: translateY(-50%);
              z-index: 999;
              display: flex;
              flex-direction: column;
              gap: 12px;
              background: rgba(11, 25, 44, 0.65);
              padding: 12px 8px;
              border-radius: 30px;
              border: 1px solid rgba(255, 255, 255, 0.2);
              backdrop-filter: blur(12px);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
            }

            .social-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              background: rgba(255, 255, 255, 0.08);
              transition: all 0.3s ease;
              text-decoration: none;
            }

            .social-icon:hover {
              background: #d4a017;
              color: #0b192c;
            }

            .cross-btn {
              font-weight: bold;
              font-size: 20px;
            }

            /* FLOATING STATS CARD */
            .gx-floating-stats-wrapper {
              position: relative;
              z-index: 5;
              margin-top: -40px;
            }

            .gx-stats-floating-card {
              background: #ffffff;
              border-radius: 16px;
              padding: 24px 32px;
              box-shadow: 0 15px 35px rgba(11, 25, 44, 0.08);
              border: 1px solid rgba(226, 232, 240, 0.8);
            }

            .stat-item-modern {
              display: flex;
              align-items: center;
              gap: 16px;
            }

            .stat-icon-badge {
              width: 52px;
              height: 52px;
              border-radius: 14px;
              background: rgba(212, 160, 23, 0.12);
              color: #d4a017;
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            .stat-value {
              font-size: 24px;
              font-weight: 800;
              color: #0b192c;
              line-height: 1.2;
            }

            .stat-name {
              font-size: 13px;
              color: #64748b;
              font-weight: 500;
            }

            /* SECTION TITLES */
            .text-center {
              text-align: center;
            }

            .gx-subhead-gold {
              font-size: 13px;
              font-weight: 700;
              color: #d4a017;
              letter-spacing: 2px;
              text-transform: uppercase;
              display: block;
              margin-bottom: 6px;
            }

   
            .gx-header-divider {
              margin: 20px auto 40px auto;
              border: 1px solid #e2e8f0;
            }

            /* FEATURE CARDS GRID */
            .gx-features-section-v2 {
              padding: 80px 0 50px 0;
            }

            .gx-feature-grid-v2 {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 24px;
            }

            .gx-feature-card-v2 {
              position: relative;
              background: #ffffff;
              padding: 32px 24px;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
              cursor: pointer;
              transition: all 0.3s ease;
              overflow: hidden;
            }

            .gx-feature-card-v2:hover {
              box-shadow: 0 12px 30px rgba(11, 25, 44, 0.1);
              border-color: rgba(212, 160, 23, 0.4);
            }

            .card-bg-number {
              position: absolute;
              top: 10px;
              right: 15px;
              font-size: 48px;
              font-weight: 900;
              color: rgba(226, 232, 240, 0.5);
              user-select: none;
            }

            .feature-icon-v2 {
              color: #d4a017;
              margin-bottom: 20px;
            }

            .gx-feature-card-v2 h3 {
              font-size: 18px;
              font-weight: 700;
              color: #0b192c;
              margin-bottom: 10px;
            }

            .gx-feature-card-v2 p {
              font-size: 14px;
              color: #64748b;
              line-height: 1.6;
              margin-bottom: 20px;
            }

            .feature-action-link {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 14px;
              font-weight: 600;
              color: #d4a017;
            }

            /* NEWS & SCHEDULE SECTION */
            .gx-news-schedule-wrapper {
              background: #f1f5f9;
            }

            /* ==========================================
               OPTIMIZED RESPONSIVE CSS FOR MOBILE
               ========================================== */
            @media (max-width: 768px) {
              .gx-container {
                padding: 0 16px;
              }

              /* Hero Banner Mobile */
              .gx-hero-169-wrapper {
                padding-top: 0px !important;
              }

              .gx-hero-169-slide {
                aspect-ratio: unset !important;
                min-height: 80px !important;
                max-height: 600px !important;
              }

              .gx-hero-169-content-overlay {
                padding-bottom: 70px !important;
                padding-top: 40px !important;
                background: linear-gradient(
                  180deg,
                  rgba(11, 25, 44, 0.1) 0%,
                  rgba(11, 25, 44, 0.7) 50%,
                  rgba(11, 25, 44, 0.95) 100%
                ) !important;
              }

              .gx-hero-169-text {
                text-align: center;
                margin: 0 auto;
              }

              .gx-badge-sharp {
                font-size: 11px !important;
                letter-spacing: 1.5px !important;
                margin-bottom: 6px !important;
              }

              .gx-title-sharp {
                font-size: 26px !important;
                line-height: 1.25 !important;
                margin-bottom: 10px !important;
              }

              .gx-sub-sharp {
                font-size: 13.5px !important;
                line-height: 1.5 !important;
                margin-bottom: 20px !important;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }

              .gx-hero-buttons {
                flex-direction: column !important;
                gap: 10px !important;
                width: 100%;
              }

              .gx-btn-gold-lg,
              .gx-btn-outline-crisp {
                width: 100% !important;
                height: 44px !important;
                font-size: 14px !important;
                justify-content: center !important;
              }

              .gx-custom-dots-169 {
                bottom: 40px !important;
              }

              .gx-scroll-down-btn {
                bottom: 10px !important;
                font-size: 10px !important;
              }

              .gx-scroll-down-btn svg {
                width: 15px !important;
                height: 15px !important;
              }

              /* Floating Social Bar */
              .gx-social-float-glass {
                right: 10px;
                padding: 8px 6px;
                gap: 8px;
              }

              .social-icon {
                width: 32px;
                height: 32px;
              }
            }

            @media (max-width: 575px) {
              /* Floating Stats Mobile (4 cột) */
              .gx-floating-stats-wrapper {
                margin-top: -30px;
              }

              .gx-stats-floating-card {
                padding: 12px 8px !important;
                border-radius: 12px !important;
              }

              .stat-item-modern {
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 6px !important;
              }

              .stat-icon-badge {
                width: 36px !important;
                height: 36px !important;
                border-radius: 8px !important;
              }

              .stat-icon-badge svg {
                width: 18px !important;
                height: 18px !important;
              }

              .stat-value {
                font-size: 15px !important;
                line-height: 1.1 !important;
              }

              .stat-name {
                font-size: 10px !important;
                line-height: 1.2 !important;
                white-space: nowrap;
              }
            }

            @media (max-width: 380px) {
              .gx-title-sharp {
                font-size: 22px !important;
              }
              .gx-sub-sharp {
                font-size: 12px !important;
              }
            }
              /* ==========================================
   TỐI ƯU FEATURE CARDS GRID CHO MOBILE
   ========================================== */

/* Thiết lập grid 2 cột cho mobile */
@media (max-width: 768px) {
  .gx-features-section-v2 {
    padding: 40px 0 30px 0 !important;
  }

  .gx-feature-grid-v2 {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important; /* Hiển thị chính xác 2 cột */
    gap: 12px !important; /* Khoảng cách giữa các card nhỏ gọn */
  }

  .gx-feature-card-v2 {
    padding: 16px 12px !important;
    border-radius: 12px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .card-bg-number {
    font-size: 28px !important;
    top: 6px !important;
    right: 8px !important;
    opacity: 0.4;
  }

  .feature-icon-v2 {
    margin-bottom: 10px !important;
  }

  .feature-icon-v2 svg {
    width: 26px !important;
    height: 26px !important;
  }

  .gx-feature-card-v2 h3 {
    font-size: 13px !important;
    font-weight: 700 !important;
    margin-bottom: 6px !important;
    line-height: 1.3 !important;
  }

  .gx-feature-card-v2 p {
    font-size: 11.5px !important;
    line-height: 1.4 !important;
    margin-bottom: 12px !important;
    /* Giới hạn 2 dòng để 4 card cân bằng chiều cao */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .feature-action-link {
    font-size: 12px !important;
    gap: 2px !important;
  }

  .feature-action-link svg {
    width: 14px !important;
    height: 14px !important;
  }
}

/* Tối ưu header section trên mobile */
@media (max-width: 575px) {
  .gx-subhead-gold {
    font-size: 11px !important;
    letter-spacing: 1.5px !important;
  }


  .gx-header-divider {
    width: 40px !important;
    height: 2px !important;
    margin-bottom: 24px !important;
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
