import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Col,
  Empty,
  ConfigProvider,
  Spin,
  Carousel,
  Button,
  Card,
  List,
  message, // Thêm message để thông báo cho người dùng
} from "antd";
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  RightOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  StarOutlined, // Icon chưa lưu
  StarFilled, // Icon đã lưu
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { getEvents } from "../api/eventApi";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState([]); // 👈 State lưu trữ danh sách sự kiện từ localStorage
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const navigate = useNavigate();

  const accentGold = "#b39164";
  const deepBrown = "#5d4037";

  // 1. ĐỌC DỮ LIỆU TỪ LOCALSTORAGE KHI TẢI TRANG
  useEffect(() => {
    const stored = localStorage.getItem("glhn_saved_events");
    if (stored) {
      setSavedEvents(JSON.parse(stored));
    }
  }, []);

  // 2. HÀM XỬ LÝ LƯU / HỦY LƯU SỰ KIỆN
  const handleToggleSave = (e, item) => {
    e.stopPropagation(); // Ngăn chặn sự kiện click thẻ Card (không bị nhảy vào trang chi tiết)

    const isSaved = savedEvents.some((saved) => saved.id === item.id);
    let updatedList = [];

    if (isSaved) {
      // Nếu đã lưu thì xóa khỏi danh sách
      updatedList = savedEvents.filter((saved) => saved.id !== item.id);
      message.success("Đã xóa sự kiện khỏi danh sách lưu trữ");
    } else {
      // Nếu chưa lưu thì thêm vào danh sách
      updatedList = [...savedEvents, item];
      message.success("Đã thêm sự kiện vào danh sách lưu trữ");
    }

    setSavedEvents(updatedList);
    localStorage.setItem("glhn_saved_events", JSON.stringify(updatedList)); // Lưu vào localStorage
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      const data = res?.data?.data || res?.data || [];
      setEvents(data);
    } catch (err) {
      console.error("Lỗi lấy danh sách sự kiện:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Sự kiện & Tin tức";
    AOS.init({ duration: 1000, once: true });
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="glhn-loading-full">
        <Spin size="large" tip="Đang tải tin tức & sự kiện..." />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-loading-full { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 60vh; }
          .glhn-loading-full .ant-spin-dot-item { background-color: ${accentGold} !important; }
          .glhn-loading-full .ant-spin-text { color: ${deepBrown}; font-weight: 600; margin-top: 12px; }
        `,
          }}
        />
      </div>
    );
  }

  // Chia danh mục dữ liệu từ API cho MỚI NHẤT
  const featuredEvents = events.slice(0, 4);
  const mainNews = events[4] || null;
  const subNews = events.slice(5, 8);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: accentGold } }}>
      <div className="magazine-page-wrapper">
        <div className="magazine-container">
          {/* SECTION 1: SPLIT HEADER & HERO CAROUSEL */}
          <section className="magazine-hero-section" data-aos="fade-up">
            <Row gutter={[40, 24]} align="middle">
              <Col xs={24} lg={9} className="hero-text-side">
                <Text className="sub-brand-tag">CỘNG ĐỒNG ĐỒNG QUAN —</Text>
                <Title className="magazine-headline">
                  SỰ KIỆN <span>& TIN TỨC</span>
                </Title>
                <div className="headline-divider" />
                <Text className="magazine-sub-info">
                  GIÁO XỨ ĐỒNG QUAN — 2026
                </Text>
                <Paragraph className="magazine-lead-paragraph">
                  Lưu giữ những nhịp đập tâm linh và đời sống cộng đoàn qua từng
                  khung hình.
                </Paragraph>

                {/* Tabs điều hướng danh mục */}
                <div className="custom-magazine-tabs">
                  <Button
                    className={`tab-btn ${activeTab === "1" ? "active" : ""}`}
                    onClick={() => setActiveTab("1")}
                  >
                    MỚI NHẤT
                  </Button>
                  <Button
                    className={`tab-btn ${activeTab === "2" ? "active" : ""}`}
                    onClick={() => setActiveTab("2")}
                  >
                    LƯU TRỮ ({savedEvents.length})
                  </Button>
                </div>
              </Col>

              <Col xs={24} lg={15}>
                <div className="hero-carousel-wrapper">
                  <Carousel autoplay effect="fade" speed={800}>
                    {featuredEvents.length > 0 ? (
                      featuredEvents.map((slide) => (
                        <div key={slide.id}>
                          <div
                            className="carousel-img-card"
                            style={{
                              backgroundImage: slide.images?.[0]
                                ? `url(${process.env.REACT_APP_API_URL}${slide.images[0]})`
                                : "url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000')",
                            }}
                          />
                        </div>
                      ))
                    ) : (
                      <div>
                        <div
                          className="carousel-img-card"
                          style={{
                            backgroundImage:
                              "url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000')",
                          }}
                        />
                      </div>
                    )}
                  </Carousel>
                </div>
              </Col>
            </Row>
          </section>

          {/* TAB 1: MỚI NHẤT */}
          {activeTab === "1" ? (
            <>
              <section className="magazine-section" data-aos="fade-up">
                <div className="section-title-bar">
                  <Title level={4} className="section-main-title">
                    SỰ KIỆN NỔI BẬT
                  </Title>
                  <Button
                    type="text"
                    className="btn-see-more"
                    onClick={() => navigate("/su-kien")}
                  >
                    Xem tất cả →
                  </Button>
                </div>

                <Row gutter={[20, 24]}>
                  {featuredEvents.map((item, idx) => {
                    const eventDate = dayjs(item.event_date || item.created_at);
                    const imgUrl = item.images?.[0]
                      ? `${process.env.REACT_APP_API_URL}${item.images[0]}`
                      : "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=400";

                    // Kiểm tra xem phần tử hiện tại đã nằm trong localStorage chưa
                    const isItemSaved = savedEvents.some(
                      (saved) => saved.id === item.id,
                    );

                    return (
                      <Col xs={12} sm={12} md={6} key={item.id || idx}>
                        <Card
                          hoverable
                          className="event-grid-card"
                          onClick={() => navigate(`/su-kien/${item.slug}`)}
                          cover={
                            <div className="card-image-container">
                              <div
                                className="card-cover-bg"
                                style={{ backgroundImage: `url(${imgUrl})` }}
                              />

                              {/* 👈 NÚT BẤM LƯU TRỮ ĐÈ TRÊN ẢNH CARD */}
                              <div
                                className="card-bookmark-icon"
                                onClick={(e) => handleToggleSave(e, item)}
                              >
                                {isItemSaved ? (
                                  <StarFilled style={{ color: accentGold }} />
                                ) : (
                                  <StarOutlined />
                                )}
                              </div>

                              <div className="event-date-badge">
                                <span className="badge-day">
                                  {eventDate.format("DD")}
                                </span>
                                <span className="badge-month">
                                  THÁNG {eventDate.format("MM")}
                                </span>
                              </div>
                            </div>
                          }
                        >
                          <Title level={5} className="event-card-title">
                            {item.title}
                          </Title>
                          <div className="event-card-meta">
                            <span className="meta-item">
                              <ClockCircleOutlined />{" "}
                              {item.event_time
                                ? item.event_time.slice(0, 5)
                                : "09:00"}
                            </span>
                            <span className="meta-item text-ellipsis">
                              <EnvironmentOutlined />{" "}
                              {item.location || "Giáo xứ Đồng Quan"}
                            </span>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              </section>

              <section className="magazine-section" data-aos="fade-up">
                <Row gutter={[40, 24]}>
                  <Col xs={24} md={16}>
                    <Title
                      level={4}
                      className="section-main-title border-bottom-title"
                    >
                      TIN TỨC MỚI NHẤT
                    </Title>

                    {mainNews && (
                      <div
                        className="main-news-block"
                        onClick={() => navigate(`/su-kien/${mainNews.slug}`)}
                      >
                        <Row gutter={[24, 16]} align="top">
                          <Col xs={24} sm={10}>
                            <div
                              className="main-news-img"
                              style={{
                                backgroundImage: mainNews.images?.[0]
                                  ? `url(${process.env.REACT_APP_API_URL}${mainNews.images[0]})`
                                  : "url('https://images.unsplash.com/photo-1438032005730-c779502df39b?q=80&w=400')",
                              }}
                            />
                          </Col>
                          <Col xs={24} sm={14}>
                            <Title level={4} className="main-news-title">
                              {mainNews.title}
                            </Title>
                            <Paragraph className="main-news-excerpt">
                              {mainNews.meta_desc || mainNews.description}
                            </Paragraph>
                            <div className="main-news-time">
                              {dayjs(
                                mainNews.event_date || mainNews.created_at,
                              ).format("DD/MM/YYYY")}{" "}
                              •{" "}
                              <span style={{ color: accentGold }}>
                                {mainNews.category || "Tin Tức"}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}

                    <div
                      className="sub-news-list-wrapper"
                      style={{ marginTop: "24px" }}
                    >
                      {subNews.map((news) => (
                        <div
                          key={news.id}
                          className="sub-news-inline-item"
                          onClick={() => navigate(`/su-kien/${news.slug}`)}
                        >
                          <div
                            className="sub-news-thumb"
                            style={{
                              backgroundImage: news.images?.[0]
                                ? `url(${process.env.REACT_APP_API_URL}${news.images[0]})`
                                : "url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=200')",
                            }}
                          />
                          <div className="sub-news-body">
                            <Title level={5} className="sub-news-title">
                              {news.title}
                            </Title>
                            <Text className="sub-news-date">
                              {dayjs(news.created_at).format("DD/MM/YYYY")} •{" "}
                              {news.category || "Thông báo"}
                            </Text>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>

                  <Col xs={24} md={8}>
                    <Title
                      level={4}
                      className="section-main-title border-bottom-title"
                    >
                      THÔNG BÁO
                    </Title>
                    <List
                      className="quick-links-list"
                      dataSource={[
                        {
                          title: "Lịch Thánh Lễ",
                          desc: "Xem giờ lễ hằng ngày và Chúa Nhật",
                          icon: <CalendarOutlined />,
                          path: "/lich-le",
                        },
                        {
                          title: "Giáo Lý hôn nhân",
                          desc: "Đăng ký học giáo lý, lãnh nhận bí tích",
                          icon: <FileTextOutlined />,
                          path: "/giao-ly/hon-nhan",
                        },
                        {
                          title: "Các Nhóm & Hội Đoàn",
                          desc: "Thông tin sinh hoạt các nhóm trong giáo xứ",
                          icon: <TeamOutlined />,
                          path: "/hoi-doan",
                        },
                      ]}
                      renderItem={(link) => (
                        <List.Item
                          className="quick-link-item"
                          onClick={() => navigate(link.path)}
                        >
                          <div className="link-icon-box">{link.icon}</div>
                          <div className="link-text-box">
                            <Text className="link-title">{link.title}</Text>
                            <Text className="link-desc">{link.desc}</Text>
                          </div>
                          <RightOutlined className="link-arrow-icon" />
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>
              </section>
            </>
          ) : (
            // 👈 TAB 2: ĐỔ DỮ LIỆU ĐÃ LƯU TỪ LOCALSTORAGE RA GIAO DIỆN FULL WIDTH
            <section className="magazine-section" data-aos="fade-up">
              <div className="section-title-bar">
                <Title level={4} className="section-main-title">
                  TÀI LIỆU & SỰ KIỆN ĐÃ LƯU TRỮ
                </Title>
              </div>

              {savedEvents.length > 0 ? (
                <Row gutter={[20, 24]}>
                  {savedEvents.map((item, idx) => {
                    const eventDate = dayjs(item.event_date || item.created_at);
                    const imgUrl = item.images?.[0]
                      ? `${process.env.REACT_APP_API_URL}${item.images[0]}`
                      : "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=400";

                    return (
                      <Col
                        xs={12}
                        sm={12}
                        md={6}
                        key={`saved-${item.id || idx}`}
                      >
                        <Card
                          hoverable
                          className="event-grid-card"
                          onClick={() => navigate(`/su-kien/${item.slug}`)}
                          cover={
                            <div className="card-image-container">
                              <div
                                className="card-cover-bg"
                                style={{ backgroundImage: `url(${imgUrl})` }}
                              />

                              {/* Nút xóa bỏ khỏi lưu trữ nhanh tại chỗ */}
                              <div
                                className="card-bookmark-icon"
                                onClick={(e) => handleToggleSave(e, item)}
                              >
                                <StarFilled style={{ color: accentGold }} />
                              </div>

                              <div className="event-date-badge">
                                <span className="badge-day">
                                  {eventDate.format("DD")}
                                </span>
                                <span className="badge-month">
                                  THÁNG {eventDate.format("MM")}
                                </span>
                              </div>
                            </div>
                          }
                        >
                          <Title level={5} className="event-card-title">
                            {item.title}
                          </Title>
                          <div className="event-card-meta">
                            <span className="meta-item">
                              <ClockCircleOutlined />{" "}
                              {item.event_time
                                ? item.event_time.slice(0, 5)
                                : "09:00"}
                            </span>
                            <span className="meta-item text-ellipsis">
                              <EnvironmentOutlined />{" "}
                              {item.location || "Giáo xứ Đồng Quan"}
                            </span>
                          </div>
                        </Card>
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <Empty
                  description="Bạn chưa lưu trữ bất kỳ sự kiện hay tài liệu nào."
                  style={{ padding: "60px 0" }}
                />
              )}
            </section>
          )}
        </div>

        {/* TOÀN BỘ CSS ĐÃ ĐƯỢC TỐI ƯU HÓA HOÀN TOÀN */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .magazine-page-wrapper { background: #ffffff; min-height: 100vh; padding-bottom: 80px; color: #121212; width: 100%; }
          .magazine-container { width: 100%; padding: 0 40px; margin: 0 auto; }
          .magazine-section { padding: 40px 0 10px; }

          /* Header Editorial Layout */
          .magazine-hero-section { padding: 60px 0 40px; border-bottom: 1px solid #eaeaea; width: 100%; }
          .sub-brand-tag { font-size: 11px; font-weight: 700; color: ${accentGold}; letter-spacing: 1.5px; text-transform: uppercase; }
          .magazine-headline { font-size: 38px !important; font-weight: 800 !important; color: ${deepBrown} !important; margin: 8px 0 16px 0 !important; letter-spacing: -0.5px; }
          .magazine-headline span { font-weight: 400; font-style: italic; color: transparent; -webkit-text-stroke: 1px ${deepBrown}; }
          .headline-divider { width: 100%; height: 1px; background: #e8e8e8; margin-bottom: 16px; }
          .magazine-sub-info { font-size: 12px; font-weight: 700; color: ${accentGold}; letter-spacing: 0.5px; }
          .magazine-lead-paragraph { font-size: 14px; color: #555; margin-top: 10px !important; line-height: 1.6; max-width: 500px; }

          /* Tab Buttons Style */
          .custom-magazine-tabs { display: flex; gap: 12px; margin-top: 28px; }
          .custom-magazine-tabs .tab-btn { border-radius: 20px; font-size: 12px; font-weight: 700; padding: 6px 24px; height: 36px; color: #444; border: 1px solid #ccc; background: #fff; box-shadow: none; transition: all 0.3s ease; cursor: pointer; }
          .custom-magazine-tabs .tab-btn.active { background: #111111; color: #fff; border-color: #111111; }

          /* Right Slider Banner */
          .hero-carousel-wrapper { border-radius: 20px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.05); }
          .carousel-img-card { height: 350px; background-size: cover; background-position: center; background-repeat: no-repeat; }

          /* Title layout bars */
          .section-title-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-left: 4px solid ${accentGold}; padding-left: 12px; }
          .section-main-title { font-size: 16px !important; font-weight: 700 !important; color: #111 !important; margin: 0 !important; text-transform: uppercase; letter-spacing: 0.5px; }
          .border-bottom-title { border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 24px !important; }
          .btn-see-more { font-size: 12px; color: #777; padding: 0; height: auto; font-weight: 600; }

          /* Event Card Grid Styles */
          .event-grid-card { border-radius: 14px; overflow: hidden; border: 1px solid #eee; height: 100%; box-shadow: 0 4px 20px rgba(0,0,0,0.01); transition: all 0.3s ease; }
          .event-grid-card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(93,64,55,0.08); border-color: ${accentGold}; }
          .event-grid-card .ant-card-body { padding: 14px !important; }
          .card-image-container { position: relative; height: 150px; overflow: hidden; }
          .card-cover-bg { width: 100%; height: 100%; background-size: cover; background-position: center; transition: transform 0.6s ease; }
          
          /* Custom Bookmark Icon */
          .card-bookmark-icon { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 20; font-size: 16px; color: #555; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: all 0.2s ease; }
          .card-bookmark-icon:hover { transform: scale(1.1); background: #ffffff; }

          /* Floating Date Badge overlay */
          .event-date-badge { position: absolute; left: 12px; bottom: 12px; background: #ffffff; border-radius: 8px; padding: 4px 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.12); min-width: 46px; line-height: 1.1; z-index: 10; }
          .badge-day { font-size: 18px; font-weight: 800; color: ${deepBrown}; }
          .badge-month { font-size: 8px; font-weight: 700; color: #777; white-space: nowrap; margin-top: 1px; }

          .event-card-title { font-size: 14px !important; font-weight: 700 !important; line-height: 1.4 !important; margin: 0 0 10px 0 !important; height: 38px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; color: #222; }
          .event-card-meta { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: #777; }
          .meta-item { display: flex; align-items: center; gap: 6px; }

          /* News Text layout */
          .main-news-block { cursor: pointer; padding: 12px 0; border-bottom: 1px dashed #e0e0e0; margin-bottom: 20px; }
          .main-news-img { height: 180px; background-size: cover; background-position: center; border-radius: 12px; }
          .main-news-title { font-size: 17px !important; font-weight: 700 !important; color: #111 !important; margin: 0 0 8px 0 !important; line-height: 1.4; }
          .main-news-excerpt { font-size: 13px; color: #555; line-height: 1.6; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
          .main-news-time { font-size: 12px; color: #999; font-weight: 500; }

          .sub-news-inline-item { display: flex; gap: 16px; align-items: center; cursor: pointer; padding: 12px 0; border-bottom: 1px solid #f5f5f5; }
          .sub-news-thumb { width: 60px; height: 60px; background-size: cover; background-position: center; border-radius: 8px; flex-shrink: 0; }
          .sub-news-title { font-size: 13px !important; font-weight: 600 !important; margin: 0 0 4px 0 !important; color: #333 !important; line-height: 1.4; }
          .sub-news-date { font-size: 11px; color: #999; }

          /* Right block items link */
          .quick-links-list { border: none !important; }
          .quick-link-item { display: flex; align-items: center; padding: 14px 16px !important; background: #fdfbfa; border-radius: 12px !important; margin-bottom: 12px; border: 1px solid #f5ebe6 !important; cursor: pointer; transition: all 0.3s ease; }
          .quick-link-item:hover { background: #fff; border-color: ${accentGold} !important; transform: translateX(6px); }
          .link-icon-box { width: 40px; height: 40px; border-radius: 8px; background: #fff; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; font-size: 18px; color: ${accentGold}; flex-shrink: 0; }
          .link-text-box { display: flex; flex-direction: column; margin-left: 14px; flex: 1; line-height: 1.4; }
          .link-title { font-size: 14px; font-weight: 700; color: ${deepBrown}; }
          .link-desc { font-size: 12px; color: #777; margin-top: 1px; }
          .link-arrow-icon { font-size: 11px; color: #bbb; }

          @media (max-width: 768px) {
            .magazine-container { padding: 0 16px; }
            .magazine-hero-section { padding: 35px 0 20px; }
            .magazine-headline { font-size: 28px !important; }
            .carousel-img-card { height: 220px; }
            .main-news-img { height: 140px; margin-bottom: 10px; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventPage;
