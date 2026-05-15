import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Button,
  Image,
  Divider,
  Empty,
  ConfigProvider,
  Spin,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  ExpandOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import ngôn ngữ tiếng Việt
import { getEventBySlug } from "../api/eventApi";

// Thiết lập locale cho dayjs
dayjs.locale("vi");

const { Title, Text } = Typography;

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const primaryGold = "#D4AF37";
  const API_URL = process.env.REACT_APP_API_URL; // Thay đổi theo config của bạn

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getEventBySlug(slug);
        setEvent(res.data);
        // Cập nhật title trình duyệt
        if (res.data?.title) {
          document.title = `${res.data.title} | Giáo xứ Đồng Quan`;
        }
      } catch (err) {
        console.error("GET DETAIL ERROR:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [slug]);

  // Hàm helper format ngày
  const formatFullDate = (date) => {
    if (!date) return "";
    return dayjs(date).format("dddd, [ngày] DD [tháng] MM, YYYY");
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_URL}${path}`;
  };

  const handleShare = async () => {
    const shareData = {
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success("Đã copy link sự kiện!");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" tip="Đang tải khoảnh khắc..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="not-found" style={{ padding: "100px 0" }}>
        <Empty description="Không tìm thấy sự kiện này" />
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button onClick={() => navigate("/")}>Về trang chủ</Button>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="story-wrapper">
        {/* 1. CINEMATIC HERO */}
        <section className="story-hero">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url(${getImageUrl(event.images?.[0])})`,
            }}
          />
          <div className="hero-overlay" />

          <Button
            icon={<ArrowLeftOutlined />}
            className="glass-back-btn"
            onClick={() => navigate(-1)}
          >
            QUAY LẠI
          </Button>

          <div className="hero-content" data-aos="zoom-out-up">
            <div className="title-block">
              <Text className="sur-title">
                {event.category} • {dayjs(event.event_date).format("YYYY")}
              </Text>
              <Title className="main-title-cinematic">{event.title}</Title>
              <div className="title-line" />
            </div>

            <div className="glass-info-bar">
              <div className="info-node">
                <CalendarOutlined />
                <span>{dayjs(event.event_date).format("DD/MM/YYYY")}</span>
              </div>
              <div className="info-divider" />
              <div className="info-node">
                <ClockCircleOutlined />
                <span>
                  {event.event_time
                    ? dayjs(`2000-01-01 ${event.event_time}`).format("HH:mm")
                    : "17:00"}
                </span>
              </div>
              <div className="info-divider" />
              <div className="info-node">
                <EnvironmentOutlined />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. NARRATIVE BODY */}
        <section className="story-body">
          <div className="reading-container">
            <div className="article-intro" data-aos="fade-up">
              {/* Nội dung bài viết */}
              <div
                className="dropcap-text content-rich-text"
                dangerouslySetInnerHTML={{
                  __html: event.full_content || event.description,
                }}
              />
            </div>

            {/* Trích dẫn ý nghĩa */}
            <div className="mid-quote" data-aos="fade-right">
              <Title level={3}>
                "Sự hiện diện của cộng đoàn là minh chứng cho tình hiệp nhất và
                hồng ân Thiên Chúa."
              </Title>
              <Text italic style={{ color: primaryGold }}>
                — Ban Truyền Thông Giáo Xứ
              </Text>
            </div>

            {/* 3. ARTISTIC GALLERY */}
            {event.images && event.images.length > 0 && (
              <div className="gallery-section">
                <div className="gallery-header">
                  <Title level={2}>KHOẢNH KHẮC GHI LẠI</Title>
                  <Text italic type="secondary">
                    Cảm nhận vẻ đẹp qua từng khung hình
                  </Text>
                </div>

                <Image.PreviewGroup>
                  <Row gutter={[16, 16]} className="masonry-grid">
                    {event.images.map((img, idx) => (
                      <Col
                        xs={24}
                        sm={idx % 3 === 0 ? 24 : 12}
                        lg={idx === 0 ? 16 : idx === 1 ? 8 : 8}
                        key={idx}
                        data-aos="fade-up"
                        data-aos-delay={idx * 100}
                      >
                        <div className="art-img-wrapper">
                          <Image
                            src={getImageUrl(img)}
                            preview={{
                              mask: (
                                <>
                                  <ExpandOutlined /> Xem ảnh
                                </>
                              ),
                            }}
                            alt={`${event.title} - ${idx}`}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              </div>
            )}

            <div className="story-footer">
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "20px",
                }}
              >
                <Button
                  type="primary"
                  shape="round"
                  icon={<ShareAltOutlined />}
                  size="large"
                  onClick={handleShare}
                >
                  CHIA SẺ CẢM HỨNG
                </Button>
                <div style={{ textAlign: "right" }}>
                  <Text type="secondary" style={{ display: "block" }}>
                    Ngày đăng: {dayjs(event.created_at).format("DD/MM/YYYY")}
                  </Text>
                  <Text strong style={{ color: primaryGold }}>
                    {event.location}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CSS Scoped */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Montserrat:wght@300;400;600&display=swap');

          .story-wrapper { background: #fff; font-family: 'Montserrat', sans-serif; }
          
          .story-hero { 
            height: 70vh; min-height: 500px;
            position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;
          }
          .hero-bg { 
            position: absolute; inset: 0; background-size: cover; background-position: center;
            filter: brightness(0.7); transition: transform 3s ease;
          }
          .story-hero:hover .hero-bg { transform: scale(1.1); }
          .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7)); }

          .hero-content { position: relative; z-index: 10; text-align: center; max-width: 1000px; padding: 0 20px; }

          .glass-back-btn {
            position: absolute; top: 40px; left: 40px;
            background: rgba(255,255,255,0.1) !important; color: #fff !important;
            border: 1px solid rgba(255,255,255,0.3) !important; backdrop-filter: blur(10px);
            border-radius: 100px; z-index: 20; font-weight: 600;
          }

          .sur-title { color: ${primaryGold}; letter-spacing: 4px; font-weight: 600; text-transform: uppercase; font-size: 13px; margin-bottom: 15px; display: block; }
          .main-title-cinematic { 
            color: #fff !important; font-size: clamp(35px, 7vw, 75px) !important; 
            font-family: 'Cormorant Garamond', serif !important; margin: 15px 0 !important;
            line-height: 1.1 !important; text-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .title-line { width: 80px; height: 3px; background: ${primaryGold}; margin: 20px auto 40px; }

          .glass-info-bar {
            display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 25px;
            background: rgba(255,255,255,0.15); backdrop-filter: blur(20px);
            padding: 18px 40px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.2); color: #fff;
          }
          .info-node { display: flex; align-items: center; gap: 10px; font-size: 15px; }
          .info-divider { width: 1px; height: 20px; background: rgba(255,255,255,0.3); }

          .story-body { background: #fff; position: relative; z-index: 20; margin-top: -50px; border-radius: 50px 50px 0 0; padding: 80px 0; }
          .reading-container { max-width: 850px; margin: 0 auto; padding: 0 25px; }

          .dropcap-text { font-size: 20px; line-height: 1.9; color: #333; font-family: 'Cormorant Garamond', serif; }
          .dropcap-text p { margin-bottom: 25px; }
          .dropcap-text::first-letter {
            float: left; font-size: 85px; line-height: 0.7; padding: 8px 15px 0 0;
            color: ${primaryGold}; font-family: 'Cormorant Garamond'; font-weight: 600;
          }

          .mid-quote { margin: 70px 0; padding: 40px; text-align: center; border-top: 1px solid #eee; border-bottom: 1px solid #eee; position: relative; }
          .mid-quote h3 { font-style: italic; color: #444 !important; font-size: 28px; font-family: 'Cormorant Garamond'; margin-bottom: 15px !important; }

          .gallery-section { margin-top: 100px; }
          .gallery-header { text-align: center; margin-bottom: 50px; }
          .gallery-header h2 { font-family: 'Cormorant Garamond'; font-size: 40px; letter-spacing: 2px; }

          .art-img-wrapper { height: 320px; border-radius: 15px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
          .ant-col-lg-16 .art-img-wrapper { height: 450px; }
          .art-img-wrapper .ant-image { width: 100%; height: 100%; }
          .art-img-wrapper img { width: 100%; height: 100% !important; object-fit: cover; transition: transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
          .art-img-wrapper:hover img { transform: scale(1.1); }

          @media (max-width: 768px) {
            .story-hero { height: 60vh; }
            .glass-back-btn { top: 20px; left: 20px; }
            .glass-info-bar { border-radius: 25px; padding: 15px; width: 100%; gap: 10px; }
            .info-divider { display: none; }
            .info-node { width: 100%; justify-content: center; font-size: 13px; }
            .main-title-cinematic { font-size: 40px !important; }
            .story-body { padding: 50px 0; border-radius: 30px 30px 0 0; }
            .art-img-wrapper, .ant-col-lg-16 .art-img-wrapper { height: 250px !important; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventDetail;
