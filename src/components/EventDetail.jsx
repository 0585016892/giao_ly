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
  Skeleton,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  ExpandOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  PlayCircleOutlined,
  DownOutlined,
  UpOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getEventBySlug } from "../api/eventApi";

dayjs.locale("vi");

const { Title, Text } = Typography;

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // State điều khiển việc Mở rộng / Thu gọn danh sách ảnh
  const [showAllImages, setShowAllImages] = useState(false);

  const primaryGold = "#D4AF37";
  const darkNavy = "#0B192C";

  useEffect(() => {
    AOS.init({ duration: 900, once: true });
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getEventBySlug(slug);
        const data = res?.data?.data || res?.data || res;

        // Xử lý an toàn nếu trường images trả về chuỗi đại diện JSON
        if (data && typeof data.images === "string") {
          try {
            data.images = JSON.parse(data.images);
          } catch (e) {
            data.images = [];
          }
        }

        setEvent(data);
        if (data?.title) {
          document.title = `${data.title} | Giáo xứ Đồng Quan`;
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

  // HÀM XỬ LÝ ĐƯỜNG DẪN ẢNH CHUẨN XÁC
  const getImageUrl = (path) => {
    if (!path)
      return "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1200";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    const baseUrl = process.env.REACT_APP_API_URL || "";
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
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
      message.success("Đã copy đường dẫn sự kiện!");
    }
  };

  if (loading) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
        <div className="story-wrapper loading-state">
          <div className="story-body">
            <div className="reading-container">
              <Skeleton active paragraph={{ rows: 6 }} />
              <div style={{ margin: "40px 0" }}>
                <Skeleton.Input active block style={{ height: 120 }} />
              </div>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={16}>
                  <Skeleton.Button active block style={{ height: 260 }} />
                </Col>
                <Col xs={24} md={8}>
                  <Skeleton.Button active block style={{ height: 260 }} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </ConfigProvider>
    );
  }

  if (!event) {
    return (
      <div
        className="not-found-wrapper"
        style={{ padding: "120px 20px", textAlign: "center" }}
      >
        <Empty description="Không tìm thấy bài viết hoặc sự kiện đã bị gỡ bỏ." />
        <div style={{ marginTop: 24 }}>
          <Button type="primary" shape="round" onClick={() => navigate("/")}>
            Về Trang Chủ
          </Button>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(event.youtube_url);
  const eventImages = Array.isArray(event.images) ? event.images : [];

  // Tách ra 4 ảnh hiển thị ban đầu
  const displayedImages = showAllImages ? eventImages : eventImages.slice(0, 4);
  const remainingImagesCount = eventImages.length - 4;

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="story-wrapper">
        {/* 1. CINEMATIC HERO */}
        <section className="story-hero">
          <div
            className="hero-bg"
            style={{
              backgroundImage: `url('${getImageUrl(eventImages[0])}')`,
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
                {event.category || "SỰ KIỆN GIÁO XỨ"} •{" "}
                {dayjs(event.event_date || event.created_at).format("YYYY")}
              </Text>
              <Title className="main-title-cinematic">{event.title}</Title>
              <div className="title-line" />
            </div>

            <div className="glass-info-bar">
              <div className="info-node">
                <CalendarOutlined />
                <span>
                  {dayjs(event.event_date || event.created_at).format(
                    "DD/MM/YYYY",
                  )}
                </span>
              </div>
              <div className="info-divider" />
              <div className="info-node">
                <ClockCircleOutlined />
                <span>
                  {event.event_time
                    ? dayjs(`2000-01-01 ${event.event_time}`).format("HH:mm")
                    : "Đang cập nhật..."}
                </span>
              </div>
              <div className="info-divider" />
              <div className="info-node">
                <EnvironmentOutlined />
                <span>{event.location || "Giáo xứ Đồng Quan"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. NARRATIVE BODY */}
        <section className="story-body">
          <div className="reading-container">
            <div className="article-intro" data-aos="fade-up">
              <div
                className="dropcap-text content-rich-text"
                dangerouslySetInnerHTML={{
                  __html: event.full_content || event.description || "",
                }}
              />
            </div>

            <div className="mid-quote" data-aos="fade-right">
              <Title level={3}>
                "Sự hiện diện của cộng đoàn là minh chứng cho tình hiệp nhất và
                hồng ân Thiên Chúa."
              </Title>
              <Text italic style={{ color: primaryGold }}>
                — Ban Truyền Thông Giáo Xứ Đồng Quan
              </Text>
            </div>

            {/* VIDEO SECTION */}
            {youtubeEmbedUrl && (
              <div className="video-section" data-aos="fade-up">
                <div className="gallery-header">
                  <Title level={2}>
                    <PlayCircleOutlined
                      style={{ marginRight: 12, color: primaryGold }}
                    />
                    VIDEO SỰ KIỆN
                  </Title>
                  <Text italic type="secondary">
                    Nhìn lại những khoảnh khắc sống động
                  </Text>
                </div>
                <div className="video-responsive-wrapper">
                  <iframe
                    src={youtubeEmbedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* ARTISTIC GALLERY (GIỚI HẠN 4 ẢNH & NÚT XEM THÊM) */}
            {eventImages.length > 0 && (
              <div className="gallery-section">
                <div className="gallery-header">
                  <Title level={2}>KHOẢNH KHẮC GHI LẠI</Title>
                  <Text italic type="secondary">
                    Cảm nhận vẻ đẹp qua từng khung hình ({eventImages.length}{" "}
                    ảnh)
                  </Text>
                </div>

                <Image.PreviewGroup>
                  <Row gutter={[16, 16]} className="masonry-grid">
                    {displayedImages.map((img, idx) => (
                      <Col
                        xs={24}
                        sm={idx === 0 ? 24 : 12}
                        lg={idx === 0 ? 24 : 8}
                        key={idx}
                        data-aos="fade-up"
                        data-aos-delay={idx * 60}
                      >
                        <div className="art-img-wrapper">
                          <Image
                            src={getImageUrl(img)}
                            preview={{
                              cover: (
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

                {/* NÚT BẤM MỞ RỘNG / THU GỌN BÀI ẢNH */}
                {eventImages.length > 4 && (
                  <div className="toggle-images-action">
                    <Button
                      type="default"
                      size="large"
                      shape="round"
                      className="btn-toggle-images"
                      icon={showAllImages ? <UpOutlined /> : <DownOutlined />}
                      onClick={() => setShowAllImages(!showAllImages)}
                    >
                      {showAllImages
                        ? "THU GỌN ẢNH"
                        : `XEM THÊM ${remainingImagesCount} BỨC ẢNH`}
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="story-footer">
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
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
                    {event.location || "Giáo xứ Đồng Quan"}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STYLESHEET */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Be+Vietnam+Pro:wght@300;400;600;700&display=swap');

          .story-wrapper { background: #fff; font-family: 'Be Vietnam Pro', sans-serif; }
          
          /* LOADING SKELETON HERO */
          .hero-skeleton-box {
            height: 60vh;
            min-height: 400px;
            background: ${darkNavy};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            padding: 0 20px;
          }

          .hero-skeleton-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            width: 100%;
          }

          .hero-skeleton-box .ant-spin-text {
            color: #ffffff !important;
            margin-top: 12px;
          }

          /* CINEMATIC HERO */
          .story-hero { 
            height: 70vh; min-height: 500px;
            position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;
          }
          .hero-bg { 
            position: absolute; inset: 0; background-size: cover; background-position: center;
            filter: brightness(0.68); transition: transform 3s ease;
          }
          .story-hero:hover .hero-bg { transform: scale(1.05); }
          .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(11,25,44,0.2), rgba(11,25,44,0.85)); }

          .hero-content { position: relative; z-index: 10; text-align: center; max-width: 1000px; padding: 0 20px; }

          .glass-back-btn {
            position: absolute; top: 90px; left: 30px;
            background: rgba(255,255,255,0.15) !important; color: #fff !important;
            border: 1px solid rgba(255,255,255,0.3) !important; backdrop-filter: blur(10px);
            border-radius: 100px; z-index: 20; font-weight: 600; font-size: 12px;
          }

          .sur-title { color: ${primaryGold}; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; font-size: 12px; margin-bottom: 12px; display: block; }
          .main-title-cinematic { 
            color: #fff !important; font-size: clamp(32px, 6vw, 64px) !important; 
            font-family: 'Cormorant Garamond', serif !important; margin: 12px 0 !important;
            line-height: 1.15 !important; text-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          .title-line { width: 80px; height: 3px; background: ${primaryGold}; margin: 20px auto 30px; }

          .glass-info-bar {
            display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 20px;
            background: rgba(255,255,255,0.15); backdrop-filter: blur(20px);
            padding: 14px 32px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.2); color: #fff;
          }
          .info-node { display: flex; align-items: center; gap: 8px; font-size: 14px; }
          .info-divider { width: 1px; height: 18px; background: rgba(255,255,255,0.3); }

          .story-body { background: #fff; position: relative; z-index: 20; margin-top: -40px; border-radius: 40px 40px 0 0; padding: 60px 0; }
          .reading-container { max-width: 850px; margin: 0 auto; padding: 0 20px; }

          .dropcap-text { font-size: 18px; line-height: 1.8; color: #333; }
          .dropcap-text p { margin-bottom: 20px; }
          .dropcap-text img { max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0; }

          .mid-quote { margin: 50px 0; padding: 30px; text-align: center; border-top: 1px solid #eee; border-bottom: 1px solid #eee; position: relative; }
          .mid-quote h3 { font-style: italic; color: #444 !important; font-size: 24px; font-family: 'Cormorant Garamond', serif; margin-bottom: 12px !important; }

          /* VIDEO YOUTUBE */
          .video-section { margin-bottom: 60px; }
          .video-responsive-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            overflow: hidden;
            border-radius: 16px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
          }
          .video-responsive-wrapper iframe {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;
          }

          /* GALLERY */
          .gallery-section { margin-top: 60px; }
          .gallery-header { text-align: center; margin-bottom: 32px; }
          .gallery-header h2 { font-family: 'Cormorant Garamond', serif; font-size: 36px; letter-spacing: 1px; }

          .art-img-wrapper { height: 260px; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.06); }
          .ant-col-lg-24 .art-img-wrapper { height: 380px; }
          .art-img-wrapper .ant-image { width: 100%; height: 100%; }
          .art-img-wrapper img { width: 100%; height: 100% !important; object-fit: cover; transition: transform 0.6s ease; }
          .art-img-wrapper:hover img { transform: scale(1.06); }

          /* ACTION BUTTONS TOGGLE IMAGES */
          .toggle-images-action {
            text-align: center;
            margin-top: 32px;
          }

          .btn-toggle-images {
            height: 44px;
            padding: 0 28px;
            font-weight: 700;
            border-color: ${primaryGold} !important;
            color: ${darkNavy} !important;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);
            transition: all 0.3s ease;
          }

          .btn-toggle-images:hover {
            background-color: ${primaryGold} !important;
            color: #ffffff !important;
          }

          @media (max-width: 768px) {
            .story-hero { height: 55vh; }
            .glass-back-btn { top: 16px; left: 16px; padding: 0 14px; height: 32px; }
            .glass-info-bar { border-radius: 20px; padding: 12px 16px; width: 100%; gap: 8px; }
            .info-divider { display: none; }
            .info-node { width: 100%; justify-content: center; font-size: 12px; }
            .main-title-cinematic { font-size: 32px !important; }
            .story-body { padding: 40px 0; border-radius: 24px 24px 0 0; }
            .art-img-wrapper, .ant-col-lg-24 .art-img-wrapper { height: 220px !important; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventDetail;
