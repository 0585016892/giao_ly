import React, { useEffect, useState, useMemo } from "react";
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
  Select,
  Input,
  Tooltip,
} from "antd";
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FireFilled,
  CompassOutlined,
  RightOutlined,
  SearchOutlined,
  FolderOpenOutlined,
  BookOutlined,
  HistoryOutlined,
  EyeOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { getEvents } from "../api/eventApi";

const { Title, Text, Paragraph } = Typography;

const EventPage = () => {
  // State dữ liệu sự kiện từ API
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Phân Trang Sự Kiện
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(7);
  const [totalEvents, setTotalEvents] = useState(0);

  // State Bộ lọc & Phân trang Kho lưu trữ Phụng vụ
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedSeason, setSelectedSeason] = useState("ALL");
  const [archiveSearch, setArchiveSearch] = useState("");
  const [archivePage, setArchivePage] = useState(1);
  const archivePageSize = 6;

  const navigate = useNavigate();

  // Bảng màu Giáo xứ Đồng Quan
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

        if (Array.isArray(eventData)) {
          setEvents(eventData);
          setTotalEvents(total);
        } else {
          setEvents([]);
          setTotalEvents(0);
        }
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

  // Hàm định dạng đường dẫn ảnh chuẩn
  const getImageUrl = (imagePath) => {
    if (!imagePath)
      return "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1200";
    if (imagePath.startsWith("http")) return imagePath;
    return `${process.env.REACT_APP_API_URL || ""}${imagePath}`;
  };

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Tách sự kiện Hero nổi bật đầu tiên
  const heroEvent = currentPage === 1 && events.length > 0 ? events[0] : null;
  const otherEvents =
    currentPage === 1 && events.length > 1 ? events.slice(1) : events;

  // Lọc dữ liệu kho lưu trữ trực tiếp từ state `events`
  const filteredArchives = useMemo(() => {
    if (!Array.isArray(events)) return [];

    return events.filter((item) => {
      // 1. Lấy năm từ event_date hoặc created_at
      const itemDate = item.event_date || item.created_at;
      const itemYear = itemDate ? dayjs(itemDate).year().toString() : "";

      const matchYear = selectedYear === "ALL" || itemYear === selectedYear;

      // 2. So sánh Mùa Phụng vụ / Hạng mục (category hoặc season)
      const matchSeason =
        selectedSeason === "ALL" ||
        item.category === selectedSeason ||
        item.season === selectedSeason;

      // 3. Tìm kiếm theo Từ khóa
      const query = archiveSearch.trim().toLowerCase();
      const matchSearch =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.meta_desc?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.location?.toLowerCase().includes(query);

      return matchYear && matchSeason && matchSearch;
    });
  }, [events, selectedYear, selectedSeason, archiveSearch]);

  const paginatedArchives = useMemo(() => {
    const start = (archivePage - 1) * archivePageSize;
    return filteredArchives.slice(start, start + archivePageSize);
  }, [filteredArchives, archivePage]);

  const handleResetArchiveFilter = () => {
    setSelectedYear("ALL");
    setSelectedSeason("ALL");
    setArchiveSearch("");
    setArchivePage(1);
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
        {/* HEADER TẠP CHÍ */}
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
                cộng đoàn.
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
                      {/* 1. SỰ KIỆN HERO NỔI BẬT LỚN */}
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
                                {heroEvent.category || "SỰ KIỆN MỤC VỤ"}
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

                      {/* 2. LƯỚI CÁC BÀI VIẾT KHÁC */}
                      {otherEvents.length > 0 ? (
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
                      ) : (
                        !heroEvent && (
                          <Empty description="Chưa có sự kiện nào được đăng tải." />
                        )
                      )}

                      {/* 3. PHÂN TRANG */}
                      {totalEvents > pageSize && (
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
                  label: (
                    <span>
                      <FolderOpenOutlined style={{ marginRight: 6 }} />
                      KHO LƯU TRỮ PHỤNG VỤ
                    </span>
                  ),
                  children: (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="gx-archive-section"
                    >
                      {/* INTRO BANNER */}
                      <div className="archive-intro-card">
                        <Row align="middle" gutter={[20, 20]}>
                          <Col xs={24} md={16}>
                            <Tag color="gold" className="archive-badge-tag">
                              <HistoryOutlined /> SỐ HÓA TƯ LIỆU GIÁO XỨ
                            </Tag>
                            <Title level={3} className="archive-intro-title">
                              Thư Viện Tư Liệu Phụng Vụ & Lịch Sử
                            </Title>
                            <Paragraph className="archive-intro-desc">
                              Tra cứu hình ảnh, bài viết, kỷ yếu và sự kiện
                              phụng vụ qua các năm của Giáo xứ Đồng Quan.
                            </Paragraph>
                          </Col>
                          <Col xs={24} md={8}>
                            <div className="archive-stats-box">
                              <div className="stat-item">
                                <Text className="stat-num">
                                  {events.length}
                                </Text>
                                <Text className="stat-label">
                                  Tư liệu đã lưu
                                </Text>
                              </div>
                              <div className="stat-divider" />
                              <div className="stat-item">
                                <Text className="stat-num">2023–2026</Text>
                                <Text className="stat-label">
                                  Giai đoạn số hóa
                                </Text>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>

                      {/* BỘ LỌC TÌM KIẾM TƯ LIỆU */}
                      <div className="archive-filter-bar">
                        <Row gutter={[16, 16]} align="middle">
                          <Col xs={24} sm={12} md={10}>
                            <Input
                              placeholder="Tìm tên sự kiện, từ khóa tư liệu..."
                              prefix={
                                <SearchOutlined style={{ color: goldColor }} />
                              }
                              value={archiveSearch}
                              onChange={(e) => {
                                setArchiveSearch(e.target.value);
                                setArchivePage(1);
                              }}
                              allowClear
                            />
                          </Col>
                          <Col xs={12} sm={6} md={5}>
                            <Select
                              value={selectedYear}
                              onChange={(val) => {
                                setSelectedYear(val);
                                setArchivePage(1);
                              }}
                              style={{ width: "100%" }}
                              options={[
                                { value: "ALL", label: "🗓️ Tất cả năm" },
                                { value: "2026", label: "Năm 2026" },
                                { value: "2025", label: "Năm 2025" },
                                { value: "2024", label: "Năm 2024" },
                              ]}
                            />
                          </Col>
                          <Col xs={12} sm={6} md={6}>
                            <Select
                              value={selectedSeason}
                              onChange={(val) => {
                                setSelectedSeason(val);
                                setArchivePage(1);
                              }}
                              style={{ width: "100%" }}
                              options={[
                                { value: "ALL", label: "🏷️ Mùa Phụng Vụ" },
                                {
                                  value: "Sự kiện mục vụ",
                                  label: "Sự kiện mục vụ",
                                },
                                {
                                  value: "Đại Lễ Bổn Mạng",
                                  label: "Đại Lễ Bổn Mạng",
                                },
                                {
                                  value: "Mùa Phục Sinh",
                                  label: "Mùa Phục Sinh",
                                },
                                {
                                  value: "Mùa Giáng Sinh",
                                  label: "Mùa Giáng Sinh",
                                },
                              ]}
                            />
                          </Col>
                          <Col xs={24} md={3}>
                            <Button
                              icon={<ReloadOutlined />}
                              onClick={handleResetArchiveFilter}
                              block
                            >
                              Đặt lại
                            </Button>
                          </Col>
                        </Row>
                      </div>

                      {/* DANH SÁCH LƯU TRỮ */}
                      {paginatedArchives.length > 0 ? (
                        <>
                          <Row gutter={[24, 24]}>
                            {paginatedArchives.map((item) => (
                              <Col xs={24} sm={12} lg={8} key={item.id}>
                                <div
                                  className="archive-card"
                                  onClick={() =>
                                    navigate(
                                      item.slug
                                        ? `/su-kien/${item.slug}`
                                        : `/tin-tuc/${item.id}`,
                                    )
                                  }
                                  style={{ cursor: "pointer" }}
                                >
                                  <div className="archive-card-thumb">
                                    <img
                                      src={getImageUrl(item.images?.[0])}
                                      alt={item.title}
                                    />
                                    <div className="archive-card-badge">
                                      <Tag
                                        color="gold"
                                        style={{ fontWeight: 700 }}
                                      >
                                        {dayjs(
                                          item.event_date || item.created_at,
                                        ).year()}
                                      </Tag>
                                    </div>
                                    <Tag className="archive-type-pill">
                                      <BookOutlined /> Tư liệu
                                    </Tag>
                                  </div>

                                  <div className="archive-card-body">
                                    <div className="archive-meta-head">
                                      <Tag color="blue">
                                        {item.category ||
                                          item.season ||
                                          "Mục vụ"}
                                      </Tag>
                                      <Text className="archive-date">
                                        <CalendarOutlined />{" "}
                                        {dayjs(
                                          item.event_date || item.created_at,
                                        ).format("DD/MM/YYYY")}
                                      </Text>
                                    </div>

                                    <Title level={4} className="archive-title">
                                      {item.title}
                                    </Title>

                                    <Paragraph className="archive-summary">
                                      {item.meta_desc ||
                                        item.description ||
                                        item.full_content
                                          ?.replace(/<[^>]+>/g, "")
                                          .slice(0, 100) + "..."}
                                    </Paragraph>

                                    <div className="archive-card-footer">
                                      <span className="archive-loc">
                                        <EnvironmentOutlined />{" "}
                                        {item.location || "Giáo xứ Đồng Quan"}
                                      </span>
                                      <Tooltip title="Lượt xem tư liệu">
                                        <span className="archive-views">
                                          <EyeOutlined /> {item.views || 0}
                                        </span>
                                      </Tooltip>
                                    </div>
                                  </div>
                                </div>
                              </Col>
                            ))}
                          </Row>

                          {filteredArchives.length > archivePageSize && (
                            <div className="gx-pagination-wrapper">
                              <Pagination
                                current={archivePage}
                                pageSize={archivePageSize}
                                total={filteredArchives.length}
                                onChange={(p) => setArchivePage(p)}
                                showSizeChanger={false}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="empty-archive-box">
                          <Empty description="Không tìm thấy tư liệu phù hợp" />
                        </div>
                      )}
                    </motion.div>
                  ),
                },
              ]}
            />
          )}
        </main>

        {/* STYLESHEET */}
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

          .gx-custom-tabs .ant-tabs-nav::before { border-bottom: 1px solid #e5e7eb; }

          .gx-custom-tabs .ant-tabs-tab {
            font-weight: 700 !important;
            font-size: 12px !important;
            padding: 10px 20px !important;
            border-radius: 20px !important;
            border: 1px solid #e5e7eb !important;
            background: #ffffff !important;
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
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }

          .hero-category-tag {
            background: rgba(255, 255, 255, 0.2) !important;
            backdrop-filter: blur(8px);
            border: none !important;
            color: #fff !important;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 20px;
          }

          .hero-event-date {
            color: rgba(255, 255, 255, 0.85);
            font-size: 13px;
          }

          .hero-event-title {
            color: #ffffff !important;
            font-size: clamp(20px, 3vw, 28px) !important;
            font-weight: 800 !important;
            margin-bottom: 8px !important;
          }

          .hero-event-desc {
            color: rgba(255, 255, 255, 0.8) !important;
            max-width: 750px;
            margin-bottom: 20px !important;
            font-size: 14px;
          }

          .hero-event-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 16px;
          }

          .hero-event-location {
            color: ${goldColor};
            font-weight: 600;
            font-size: 13px;
          }

          .hero-read-btn {
            background: ${goldColor} !important;
            border: none !important;
            color: ${darkNavy} !important;
            font-weight: 700;
          }

          /* EVENT CARD GRID */
          .gx-event-card {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
            border: 1px solid #f0f0f0;
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .card-media-box {
            position: relative;
            height: 180px;
            overflow: hidden;
          }

          .card-media-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.4s ease;
          }

          .gx-event-card:hover .card-media-box img {
            transform: scale(1.05);
          }

          .card-category-pill {
            position: absolute;
            top: 12px;
            left: 12px;
            background: rgba(11, 25, 44, 0.85) !important;
            color: #fff !important;
            border: none !important;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 600;
          }

          .card-details-box {
            padding: 18px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .card-date-meta {
            font-size: 12px;
            color: #8c8c8c;
            margin-bottom: 6px;
            font-weight: 600;
          }

          .card-title-text {
            font-size: 16px !important;
            font-weight: 700 !important;
            color: ${darkNavy} !important;
            margin-bottom: 8px !important;
            line-height: 1.4 !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .card-desc-text {
            font-size: 13px;
            color: #666;
            margin-bottom: 16px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex: 1;
          }

          .card-footer-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f0f0f0;
            padding-top: 12px;
          }

          .card-loc-text {
            font-size: 12px;
            color: #8c8c8c;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .card-arrow-icon {
            color: ${goldColor};
            font-weight: bold;
          }

          /* ARCHIVE SECTION */
          .archive-intro-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 24px;
            border: 1px solid #e5e7eb;
            margin-bottom: 24px;
          }

          .archive-badge-tag {
            font-weight: 700;
            margin-bottom: 8px;
          }

          .archive-intro-title {
            color: ${darkNavy} !important;
            margin-bottom: 8px !important;
            font-weight: 800 !important;
          }

          .archive-intro-desc {
            margin: 0;
            color: #666;
          }

          .archive-stats-box {
            display: flex;
            align-items: center;
            justify-content: space-around;
            background: #f9fafb;
            padding: 16px;
            border-radius: 12px;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .stat-num {
            font-size: 20px;
            font-weight: 800;
            color: ${goldColor};
          }

          .stat-label {
            font-size: 11px;
            color: #8c8c8c;
          }

          .stat-divider {
            width: 1px;
            height: 30px;
            background: #e5e7eb;
          }

          .archive-filter-bar {
            background: #ffffff;
            padding: 16px;
            border-radius: 12px;
            margin-bottom: 24px;
            border: 1px solid #e5e7eb;
          }

          .archive-card {
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e5e7eb;
            height: 100%;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .archive-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.06);
          }

          .archive-card-thumb {
            position: relative;
            height: 160px;
          }

          .archive-card-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .archive-card-badge {
            position: absolute;
            top: 10px;
            left: 10px;
          }

          .archive-type-pill {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.6) !important;
            color: #fff !important;
            border: none !important;
          }

          .archive-card-body {
            padding: 16px;
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .archive-meta-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .archive-date {
            font-size: 12px;
            color: #8c8c8c;
          }

          .archive-title {
            font-size: 15px !important;
            font-weight: 700 !important;
            color: ${darkNavy} !important;
            margin-bottom: 8px !important;
            line-height: 1.4 !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .archive-summary {
            font-size: 13px;
            color: #666;
            margin-bottom: 16px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            flex: 1;
          }

          .archive-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #f0f0f0;
            padding-top: 10px;
            font-size: 12px;
            color: #8c8c8c;
          }

          .gx-pagination-wrapper {
            margin-top: 36px;
            display: flex;
            justify-content: center;
          }

          .empty-archive-box {
            padding: 60px 0;
            background: #ffffff;
            border-radius: 12px;
            border: 1px dashed #d9d9d9;
          }
          `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventPage;
