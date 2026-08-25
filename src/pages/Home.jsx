import React, { useEffect, useState } from "react";
import { Row, ConfigProvider, Skeleton } from "antd";
import { ChevronRight, Calendar, Heart, Users, Church } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { motion } from "framer-motion";

// API Services
import { getSlides } from "../api/slideApi";
import { getWeekSchedule } from "../api/scheduleApi";
import { getEvents } from "../api/eventApi";

// Sections Components
import NewsSection from "../components/home/NewsSection";
import MassScheduleSection from "../components/home/MassScheduleSection";
import MediaSection from "../components/home/MediaSection";
import PrayerWallSection from "../components/home/PrayerWallSection";
import HeroBanner from "../components/home/HeroBanner";
import FloatingSocialBar from "../components/home/FloatingSocialBar";
import AboutAndThemeSection from "../components/home/AboutAndThemeSection";

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

function Home() {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loadingSlides, setLoadingSlides] = useState(true);

  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(true);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const goldColor = "#D4A017";
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Optimized Animations (Sử dụng transition mượt & phần cứng gia tốc)
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  useEffect(() => {
    document.title = "Giáo Xứ Đồng Quan | Giáo Phận Thái Bình";
  }, []);

  // 1. Fetch Slides
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

  // 2. Fetch Schedule
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

  // 3. Fetch Events
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
        {/* FLOATING SOCIAL BAR */}
        <FloatingSocialBar />

        {/* 1. HERO BANNER */}
        {loadingSlides ? (
          <div className="gx-container" style={{ paddingTop: "20px" }}>
            <Skeleton.Button
              active
              style={{ width: "100%", height: 420, borderRadius: 16 }}
            />
          </div>
        ) : (
          <HeroBanner
            slides={displaySlides}
            loading={loadingSlides}
            apiUrl={API_URL}
          />
        )}

        {/* 2. ABOUT & THEME SECTION */}
        <section className="gx-section-sm" id="about-theme-section">
          <AboutAndThemeSection />
        </section>

        {/* 3. TIN TỨC & LỊCH PHỤNG VỤ */}
        <section className="gx-section gx-news-schedule-wrapper">
          <div className="gx-container">
            {loadingEvents || loadingSchedule ? (
              <div className="gx-skeleton-group">
                <Skeleton active paragraph={{ rows: 6 }} avatar />
                <div style={{ marginTop: 40 }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              </div>
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

        {/* 4. FEATURE CARDS SECTION */}
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
              viewport={{ once: true, margin: "-50px" }}
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
                  whileHover={{ y: -6 }}
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

        {/* 5. MEDIA GALLERY SECTION */}
        <section className="gx-section gx-media-bg">
          <div className="gx-container">
            <MediaSection />
          </div>
        </section>

        {/* 6. PRAYER WALL SECTION */}
        <PrayerWallSection />

        {/* CSS TỐI ƯU GIAO DIỆN & HIỆU NĂNG */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html {
              scroll-behavior: smooth;
            }

            .gx-home-page {
              background-color: #f8fafc;
              padding-top: 80px;
              color: #1e293b;
              font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
              overflow-x: hidden;
              transform: translateZ(0);
            }

            .gx-container {
              max-width: 1200px;
              margin: 0 auto;
              padding: 0 24px;
              width: 100%;
            }

            .gx-section {
              padding: 60px 0;
            }

            .gx-section-sm {
              padding: 30px 0 10px 0;
            }

            .gx-skeleton-group {
              background: #ffffff;
              padding: 32px;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
            }

            /* FLOATING SOCIAL BAR TỐI ƯU PERFORMANCE */
            .gx-social-float-glass {
              position: fixed;
              right: 16px;
              top: 50%;
              transform: translateY(-50%);
              z-index: 999;
              display: flex;
              flex-direction: column;
              gap: 10px;
              background: rgba(11, 25, 44, 0.88);
              padding: 10px 8px;
              border-radius: 30px;
              border: 1px solid rgba(255, 255, 255, 0.15);
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            }

            .social-icon {
              width: 38px;
              height: 38px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #ffffff;
              background: rgba(255, 255, 255, 0.1);
              transition: transform 0.2s ease, background 0.2s ease;
              text-decoration: none;
            }

            .social-icon:hover {
              background: #d4a017;
              color: #0b192c;
              transform: scale(1.08);
            }

            /* SECTION HEADER TYPOGRAPHY */
            .gx-section-header {
              margin-bottom: 28px;
            }

            .gx-news-subtitle-tag {
              display: block;
              font-size: 11px;
              font-weight: 800;
              color: #d4a017;
              letter-spacing: 2px;
              margin-bottom: 4px;
            }

            .gx-news-main-title {
              font-size: 24px;
              font-weight: 800;
              color: #0b192c;
              margin: 0 0 8px 0;
              letter-spacing: -0.3px;
            }

            .gx-header-divider {
              width: 40px;
              height: 3px;
              background: linear-gradient(90deg, #d4a017 0%, transparent 100%);
              border-radius: 2px;
            }

            /* FEATURE CARDS GRID TỐI ƯU */
            .gx-features-section-v2 {
              padding: 60px 0 40px 0;
            }

            .gx-feature-grid-v2 {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
              gap: 20px;
            }

            .gx-feature-card-v2 {
              position: relative;
              background: #ffffff;
              padding: 28px 20px;
              border-radius: 16px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
              cursor: pointer;
              transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
              will-change: transform;
              overflow: hidden;
            }

            .gx-feature-card-v2:hover {
              box-shadow: 0 10px 25px rgba(11, 25, 44, 0.08);
              border-color: rgba(212, 160, 23, 0.4);
            }

            .card-bg-number {
              position: absolute;
              top: 8px;
              right: 14px;
              font-size: 42px;
              font-weight: 900;
              color: rgba(226, 232, 240, 0.6);
              user-select: none;
            }

            .feature-icon-v2 {
              color: #d4a017;
              margin-bottom: 16px;
            }

            .gx-feature-card-v2 h3 {
              font-size: 16px;
              font-weight: 700;
              color: #0b192c;
              margin-bottom: 8px;
            }

            .gx-feature-card-v2 p {
              font-size: 13px;
              color: #64748b;
              line-height: 1.5;
              margin-bottom: 16px;
            }

            .feature-action-link {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 13px;
              font-weight: 600;
              color: #d4a017;
            }

            .gx-news-schedule-wrapper {
              background: #f1f5f9;
            }

            /* RESPONSIVE DESIGN */
            @media (max-width: 768px) {
              .gx-container {
                padding: 0 16px;
              }

              .gx-section {
                padding: 40px 0;
              }

              .gx-features-section-v2 {
                padding: 30px 0 !important;
              }

              .gx-feature-grid-v2 {
                display: grid !important;
                grid-template-columns: repeat(2, 1fr) !important;
                gap: 12px !important;
              }

              .gx-feature-card-v2 {
                padding: 16px 12px !important;
                border-radius: 12px !important;
              }

              .card-bg-number {
                font-size: 26px !important;
                top: 4px !important;
                right: 8px !important;
              }

              .feature-icon-v2 {
                margin-bottom: 8px !important;
              }

              .feature-icon-v2 svg {
                width: 24px !important;
                height: 24px !important;
              }

              .gx-feature-card-v2 h3 {
                font-size: 13px !important;
                margin-bottom: 4px !important;
              }

              .gx-feature-card-v2 p {
                font-size: 11px !important;
                line-height: 1.35 !important;
                margin-bottom: 10px !important;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
              }

              .social-icon {
                width: 34px;
                height: 34px;
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
