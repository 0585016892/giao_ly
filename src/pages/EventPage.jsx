import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Tag,
  Tabs,
  Empty,
  ConfigProvider,
  Skeleton,
  Button,
  Pagination,
} from "antd";
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FireFilled,
  CompassOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { getEvents } from "../api/eventApi";

const { Title, Text, Paragraph } = Typography;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // State Phân Trang (Pagination)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7); // 1 Hero Event + 6 bài grid
  const [totalEvents, setTotalEvents] = useState(0);

  const navigate = useNavigate();

  // Bảng màu chuẩn Giáo xứ Đồng Quan
  const goldColor = "#D4A017";
  const darkNavy = "#0B192C";
  const bgLight = "#FAFAFA";

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    document.title = "Sự kiện & Tin tức | Giáo xứ Đồng Quan";

    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await getEvents({
          page: currentPage,
          limit: pageSize,
          is_active: 1,
          sort: "created_at",
          order: "desc",
        });

        const eventData = res?.data?.data || res?.data || res || [];
        const total = res?.data?.total || res?.total || eventData.length;

        setEvents(eventData);
        setTotalEvents(total);
      } catch (err) {
        console.error("Lỗi lấy danh sách sự kiện:", err);
        setEvents([]);
        setTotalEvents(0);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, pageSize]);
  // Xử lý khi bấm chuyển trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Tách sự kiện nổi bật đầu tiên (chỉ ở trang 1)
  const heroEvent = currentPage === 1 && events.length > 0 ? events[0] : null;
  const otherEvents =
    currentPage === 1 && events.length > 1 ? events.slice(1) : events;

  const getImageUrl = (imagePath) => {
    console.log("imagePath:", imagePath);
    if (!imagePath)
      return "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1200";
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.REACT_APP_API_URL || ""}${imagePath}`;
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: goldColor,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <div className="gx-events-page">
        {/* HEADER TẠP CHÍ SANG TRỌNG */}
        <header className="gx-events-header">
          <div className="gx-container">
            <div className="header-top-tag">
              <CompassOutlined /> CỘNG ĐỒNG & MỤC VỤ GIÁO XỨ
            </div>
            <Title className="gx-headline">
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

        <main className="gx-container gx-events-content">
          {loading ? (
            <div className="events-skeleton-box">
              <Skeleton active avatar paragraph={{ rows: 4 }} />
              <div style={{ marginTop: 30 }}>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12} lg={8}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Col>
                  <Col xs={24} md={12} lg={8}>
                    <Skeleton active paragraph={{ rows: 3 }} />
                  </Col>
                </Row>
              </div>
            </div>
          ) : (
            <Tabs
              defaultActiveKey="1"
              className="gx-custom-tabs"
              items={[
                {
                  key: "1",
                  label: "TẤT CẢ SỰ KIỆN & MỚI NHẤT",
                  children: (
                    <>
                      {/* 1. SỰ KIỆN HERO NỔI BẬT LỚN (Chỉ hiện ở Trang 1) */}
                      {heroEvent && (
                        <motion.div
                          initial="hidden"
                          animate="visible"
                          variants={fadeInUp}
                          className="gx-hero-event-showcase"
                          onClick={() =>
                            navigate(
                              heroEvent.slug
                                ? `/su-kien/${heroEvent.slug}`
                                : `/tin-tuc/${heroEvent.id}`,
                            )
                          }
                        >
                          <div
                            className="hero-event-bg"
                            style={{
                              backgroundImage: `url('${getImageUrl(
                                heroEvent.images?.[0],
                              )}')`,
                            }}
                          >
                            <div className="hero-event-overlay" />
                          </div>

                          <div className="hero-event-content">
                            <div className="hero-tag-bar">
                              <Tag className="hero-category-tag">
                                <FireFilled style={{ color: goldColor }} />{" "}
                                {heroEvent.category || "TIN NỔI BẬT"}
                              </Tag>
                              <Text className="hero-event-date">
                                <CalendarOutlined />{" "}
                                {dayjs(
                                  heroEvent.event_date || heroEvent.created_at,
                                ).format("DD/MM/YYYY")}
                              </Text>
                            </div>

                            <div className="hero-event-body">
                              <Title level={2} className="hero-event-title">
                                {heroEvent.title}
                              </Title>
                              <Paragraph className="hero-event-desc">
                                {heroEvent.meta_desc ||
                                  heroEvent.description ||
                                  heroEvent.full_content
                                    ?.replace(/<[^>]+>/g, "")
                                    .slice(0, 160) + "..."}
                              </Paragraph>

                              <div className="hero-event-footer">
                                <span className="hero-event-location">
                                  <EnvironmentOutlined />{" "}
                                  {heroEvent.location || "Giáo xứ Đồng Quan"}
                                </span>
                                <Button shape="round" className="hero-read-btn">
                                  XEM CHI TIẾT <ArrowRightOutlined />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* 2. DANH SÁCH LƯỚI BÀI VIẾT */}
                      <Row gutter={[24, 24]} className="gx-events-grid">
                        {otherEvents.map((item, index) => (
                          <Col xs={24} sm={12} lg={8} key={item.id || index}>
                            <motion.div
                              initial="hidden"
                              whileInView="visible"
                              viewport={{ once: true }}
                              variants={fadeInUp}
                              whileHover={{ y: -6 }}
                              className="gx-event-card"
                              onClick={() =>
                                navigate(
                                  item.slug
                                    ? `/su-kien/${item.slug}`
                                    : `/tin-tuc/${item.id}`,
                                )
                              }
                            >
                              <div className="card-media-box">
                                <img
                                  src={getImageUrl(item.images?.[0])}
                                  alt={item.title}
                                  loading="lazy"
                                />
                                <div className="card-media-overlay" />
                                <Tag className="card-category-pill">
                                  {item.category || "SỰ KIỆN"}
                                </Tag>
                              </div>

                              <div className="card-details-box">
                                <div className="card-date-meta">
                                  <CalendarOutlined
                                    style={{ color: goldColor }}
                                  />{" "}
                                  {dayjs(
                                    item.event_date || item.created_at,
                                  ).format("DD/MM/YYYY")}
                                </div>
                                <Title level={4} className="card-title-text">
                                  {item.title}
                                </Title>
                                <Paragraph className="card-desc-text">
                                  {item.meta_desc ||
                                    item.description ||
                                    item.full_content
                                      ?.replace(/<[^>]+>/g, "")
                                      .slice(0, 100) + "..."}
                                </Paragraph>

                                <div className="card-footer-meta">
                                  <span className="card-loc-text">
                                    <EnvironmentOutlined />{" "}
                                    {item.location || "Giáo xứ Đồng Quan"}
                                  </span>
                                  <div className="card-arrow-icon">
                                    <RightOutlined />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Col>
                        ))}
                      </Row>

                      {/* 3. BỘ PHÂN TRANG (PAGINATION) */}
                      {totalEvents > 0 && (
                        <div className="gx-pagination-wrapper">
                          <Pagination
                            current={currentPage}
                            pageSize={pageSize}
                            total={totalEvents}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                          />
                        </div>
                      )}
                    </>
                  ),
                },
                {
                  key: "2",
                  label: "KHO LƯU TRỮ PHỤNG VỤ",
                  children: (
                    <div className="empty-archive-box">
                      <Empty description="Dữ liệu tư liệu các năm trước đang được Ban Mục Vụ số hóa..." />
                    </div>
                  ),
                },
              ]}
            />
          )}
        </main>

        {/* STYLESHEET SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .gx-events-page {
            background-color: ${bgLight};
            min-height: 100vh;
            padding-bottom: 80px;
            color: #333333;
            font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
          }

          .gx-container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 0 20px;
            width: 100%;
          }

          .events-skeleton-box { padding: 40px 0; }

          /* HEADER TẠP CHÍ */
          .gx-events-header {
            padding: 60px 0 30px;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 30px;
          }

          .header-top-tag {
            font-size: 11px;
            letter-spacing: 2px;
            color: ${goldColor};
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-transform: uppercase;
            margin-bottom: 12px;
          }

          .gx-headline {
            font-size: clamp(30px, 5vw, 48px) !important;
            font-weight: 800 !important;
            color: ${darkNavy} !important;
            margin: 0 !important;
            line-height: 1.15 !important;
            letter-spacing: -0.5px;
          }

          .gx-headline span {
            color: ${goldColor};
            font-style: italic;
            font-weight: 400;
          }

          .header-sub-meta {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-top: 2px solid ${goldColor};
            padding-top: 16px;
            gap: 20px;
          }

          .meta-year {
            font-weight: 800;
            letter-spacing: 1.5px;
            font-size: 13px;
            color: ${darkNavy};
            white-space: nowrap;
          }

          .meta-desc {
            max-width: 550px;
            margin: 0;
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          }

          /* TABS STYLING */
          .gx-custom-tabs { margin-bottom: 30px; }
          .gx-custom-tabs .ant-tabs-nav::before { border-bottom: 1px solid #e5e7eb; }

          .gx-custom-tabs .ant-tabs-tab {
            font-weight: 700 !important;
            font-size: 12px !important;
            letter-spacing: 0.5px !important;
            padding: 10px 20px !important;
            border-radius: 20px !important;
            border: 1px solid #e5e7eb !important;
            background: #ffffff !important;
            transition: all 0.3s ease !important;
          }

          .gx-custom-tabs .ant-tabs-tab-active {
            background: ${darkNavy} !important;
            border-color: ${darkNavy} !important;
          }

          .gx-custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
            color: ${goldColor} !important;
          }

          .gx-custom-tabs .ant-tabs-ink-bar { display: none; }

          /* HERO SHOWCASE EVENT */
          .gx-hero-event-showcase {
            position: relative;
            min-height: 420px;
            border-radius: 16px;
            overflow: hidden;
            margin-bottom: 36px;
            cursor: pointer;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            display: flex;
            align-items: flex-end;
          }

          .hero-event-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            transition: transform 0.6s ease;
          }

          .gx-hero-event-showcase:hover .hero-event-bg {
            transform: scale(1.03);
          }

          .hero-event-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(11, 25, 44, 0.2) 0%, rgba(11, 25, 44, 0.9) 100%);
          }

          .hero-event-content {
            position: relative;
            z-index: 10;
            width: 100%;
            padding: 32px;
            color: #ffffff;
          }

          .hero-tag-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .hero-category-tag {
            background: rgba(11, 25, 44, 0.8) !important;
            border: 1px solid ${goldColor} !important;
            color: ${goldColor} !important;
            font-weight: 700;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 11px;
          }

          .hero-event-date {
            color: rgba(255, 255, 255, 0.85);
            font-weight: 600;
            font-size: 13px;
          }

          .hero-event-title {
            color: #ffffff !important;
            font-size: 26px !important;
            margin-bottom: 10px !important;
            font-weight: 800 !important;
            line-height: 1.3 !important;
          }

          .hero-event-desc {
            color: #e5e7eb !important;
            font-size: 14px !important;
            max-width: 750px;
            margin-bottom: 20px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .hero-event-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            padding-top: 16px;
          }

          .hero-event-location {
            color: ${goldColor};
            font-weight: 600;
            font-size: 13px;
          }

          .hero-read-btn {
            background: ${goldColor} !important;
            color: #ffffff !important;
            border: none !important;
            font-weight: 700;
            padding: 0 20px;
            height: 38px;
          }

          /* CARDS GRID SYSTEM */
          .gx-event-card {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
          }

          .gx-event-card:hover {
            box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
            border-color: ${goldColor};
          }

          .card-media-box {
            position: relative;
            height: 190px;
            overflow: hidden;
          }

          .card-media-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .gx-event-card:hover .card-media-box img {
            transform: scale(1.06);
          }

          .card-media-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(11, 25, 44, 0.4) 100%);
          }

          .card-category-pill {
            position: absolute;
            top: 12px;
            left: 12px;
            background: rgba(11, 25, 44, 0.85) !important;
            border: 1px solid ${goldColor} !important;
            color: ${goldColor} !important;
            font-weight: 700;
            font-size: 10px;
            padding: 2px 10px;
            border-radius: 12px;
          }

          .card-details-box {
            padding: 18px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .card-date-meta {
            font-size: 11px;
            color: #9ca3af;
            font-weight: 600;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .card-title-text {
            color: ${darkNavy} !important;
            font-size: 16px !important;
            margin: 0 0 8px 0 !important;
            font-weight: 700 !important;
            line-height: 1.35 !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .card-desc-text {
            color: #6b7280;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 16px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .card-footer-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f3f4f6;
            padding-top: 12px;
            margin-top: auto;
          }

          .card-loc-text {
            font-size: 11px;
            color: ${darkNavy};
            font-weight: 600;
          }

          .card-arrow-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #f3f4f6;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${darkNavy};
            font-size: 11px;
            transition: all 0.2s ease;
          }

          .gx-event-card:hover .card-arrow-icon {
            background: ${goldColor};
            color: #ffffff;
            transform: translateX(3px);
          }

          /* PAGINATION STYLING */
          .gx-pagination-wrapper {
            display: flex;
            justify-content: center;
            margin-top: 40px;
          }

          .gx-pagination-wrapper .ant-pagination-item-active {
            background-color: ${darkNavy} !important;
            border-color: ${darkNavy} !important;
          }

          .gx-pagination-wrapper .ant-pagination-item-active a {
            color: ${goldColor} !important;
          }

          .empty-archive-box {
            padding: 60px 0;
            text-align: center;
          }

          /* RESPONSIVE MOBILE */
          @media (max-width: 768px) {
            .gx-events-header { padding: 30px 0 20px;  }
            .header-sub-meta { flex-direction: column; align-items: flex-start; gap: 8px; }
            .gx-hero-event-showcase { min-height: 360px; }
            .hero-event-content { padding: 20px; }
            .hero-event-title { font-size: 20px !important; }
            .hero-event-desc { display: none; }
            .hero-read-btn { height: 32px; font-size: 12px; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventPage;
