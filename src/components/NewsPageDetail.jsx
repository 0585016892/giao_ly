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
  PlayCircleOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getEventBySlug } from "../api/eventApi";

dayjs.locale("vi");

const { Title, Text, Paragraph } = Typography;

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Đồng bộ mã màu thiết kế theo hệ thống Giáo Xứ
  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await getEventBySlug(slug);

        // Cập nhật cấu trúc đọc data từ API chuẩn của bạn
        const data = res?.data?.data || res?.data || null;
        setEvent(data);

        if (data?.title) {
          document.title = `${data.title} | Giáo xứ Đồng Quan`;
        }
      } catch (err) {
        console.error("LỖI TẢI CHI TIẾT SỰ KIỆN:", err);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchDetail();
  }, [slug]);

  const getImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${API_URL}${path}`;
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
    const shareData = { url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Hủy chia sẻ");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success("Đã copy đường dẫn sự kiện!");
    }
  };

  if (loading) {
    return (
      <div className="glhn-loading-wrapper">
        <Spin size="large" tip="Đang tải khoảnh khắc mục vụ..." />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .glhn-loading-wrapper { height: 100vh; display: flex; flex-direction: column; justifyContent: center; align-items: center; background: #fcfaf2; }
          .glhn-loading-wrapper .ant-spin-dot-item { background-color: ${primaryGold} !important; }
          .glhn-loading-wrapper .ant-spin-text { color: ${deepBrown}; font-weight: 600; margin-top: 14px; }
        `,
          }}
        />
      </div>
    );
  }

  if (!event) {
    return (
      <div
        className="not-found"
        style={{
          padding: "120px 0",
          textAlign: "center",
          background: "#fcfaf2",
          minHeight: "100vh",
        }}
      >
        <Empty description="Không tìm thấy nội dung sự kiện yêu cầu" />
        <div style={{ marginTop: 24 }}>
          <Button
            type="primary"
            shape="round"
            onClick={() => navigate("/su-kien")}
            style={{ backgroundColor: deepBrown, borderColor: deepBrown }}
          >
            Quay lại mục Sự Kiện
          </Button>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(event.youtube_url);
  // Khối render nội dung: Ưu tiên full_content (HTML), nếu không có dùng description
  const textBodyContent = event.full_content || event.description || "";

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="story-wrapper">
        {/* 1. CINEMATIC HERO */}
        <section className="story-hero">
          <div
            className="hero-bg"
            style={{
              backgroundImage: event.images?.[0]
                ? `url(${getImageUrl(event.images[0])})`
                : "url('https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1400')",
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
                {event.category || "HOẠT ĐỘNG GIÁO XỨ"} •{" "}
                {dayjs(event.event_date).format("YYYY")}
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
                    : "05:00"}
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
            {/* Đọc trích dẫn giới thiệu ngắn nếu có meta_desc */}
            {event.meta_desc && (
              <Paragraph className="article-meta-lead" data-aos="fade-up">
                {event.meta_desc}
              </Paragraph>
            )}

            {/* Đọc mã HTML hoặc text từ database */}
            <div className="article-main-text" data-aos="fade-up">
              {textBodyContent.startsWith("<") ? (
                <div
                  className="dropcap-text content-rich-text"
                  dangerouslySetInnerHTML={{ __html: textBodyContent }}
                />
              ) : (
                <div className="dropcap-text plain-text-wrapper">
                  {textBodyContent.split("\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              )}
            </div>

            <div className="mid-quote" data-aos="fade-right">
              <Title level={3}>
                "Sự hiện diện của cộng đoàn là minh chứng cho tình hiệp nhất và
                hồng ân Thiên Chúa."
              </Title>
              <Text italic style={{ color: primaryGold, fontWeight: 600 }}>
                — Ban Truyền Thông Giáo Xứ Đồng Quan
              </Text>
            </div>

            {/* 3. SECTION VIDEO YOUTUBE (TỰ ĐỘNG CHÈN TỪ DATABASE) */}
            {youtubeEmbedUrl && (
              <div className="video-section" data-aos="fade-up">
                <div className="gallery-header">
                  <Title level={2} style={{ color: deepBrown }}>
                    <PlayCircleOutlined
                      style={{ marginRight: 12, color: primaryGold }}
                    />
                    VIDEO SỰ KIỆN
                  </Title>
                  <Text italic type="secondary">
                    Nhìn lại những khoảnh khắc sống động của ngày lễ
                  </Text>
                </div>
                <div className="video-responsive-wrapper">
                  <iframe
                    src={youtubeEmbedUrl}
                    title={event.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {/* 4. ARTISTIC GALLERY MASONRY */}
            {event.images && event.images.length > 0 && (
              <div className="gallery-section">
                <div className="gallery-header">
                  <Title level={2} style={{ color: deepBrown }}>
                    KHOẢNH KHẮC GHI LẠI
                  </Title>
                  <Text italic type="secondary">
                    Cảm nhận vẻ đẹp thánh thiêng qua từng khung hình
                  </Text>
                </div>

                <Image.PreviewGroup>
                  <Row gutter={[16, 16]} className="masonry-grid">
                    {event.images.map((img, idx) => (
                      <Col
                        xs={24}
                        sm={idx % 3 === 0 ? 24 : 12}
                        lg={idx === 0 ? 16 : 8}
                        key={idx}
                        data-aos="fade-up"
                        data-aos-delay={idx * 50}
                      >
                        <div className="art-img-wrapper">
                          <Image
                            src={getImageUrl(img)}
                            preview={{
                              mask: (
                                <div className="custom-image-mask">
                                  <ExpandOutlined /> <span>Xem ảnh lớn</span>
                                </div>
                              ),
                            }}
                            alt={`${event.title} - ảnh ${idx + 1}`}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              </div>
            )}

            {/* 5. FOOTER CHIA SẺ & METADATA */}
            <div className="story-footer">
              <Divider />
              <div className="footer-action-row">
                <Button
                  type="primary"
                  shape="round"
                  icon={<ShareAltOutlined />}
                  size="large"
                  className="glhn-share-btn"
                  onClick={handleShare}
                >
                  CHIA SẺ TIN MỪNG
                </Button>
                <div className="footer-meta-right">
                  <Text
                    type="secondary"
                    style={{ display: "block", fontSize: "12px" }}
                  >
                    Cập nhật mới nhất:{" "}
                    {dayjs(event.updated_at || event.created_at).format(
                      "DD/MM/YYYY",
                    )}
                  </Text>
                  <Text
                    strong
                    style={{
                      color: primaryGold,
                      fontSize: "14px",
                      textTransform: "uppercase",
                    }}
                  >
                    {event.location || "Giáo xứ Đồng Quan"}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TOÀN BỘ HỆ THỐNG CSS PHONG CÁCH TẠP CHÍ TỐI GIẢN */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');

          .story-wrapper { background: #fff; font-family: 'Plus Jakarta Sans', sans-serif; }
          
          .story-hero { 
            height: 65vh; min-height: 480px;
            position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden;
          }
          .hero-bg { 
            position: absolute; inset: 0; background-size: cover; background-position: center;
            filter: brightness(0.65); transition: transform 3s cubic-bezier(0.1, 1, 0.1, 1);
          }
          .story-hero:hover .hero-bg { transform: scale(1.04); }
          .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.65)); }

          .hero-content { position: relative; z-index: 10; text-align: center; max-width: 900px; padding: 0 24px; }

          .glass-back-btn {
            position: absolute; top: 30px; left: 40px;
            background: rgba(255,255,255,0.08) !important; color: #fff !important;
            border: 1px solid rgba(255,255,255,0.25) !important; backdrop-filter: blur(12px);
            border-radius: 100px; z-index: 20; font-weight: 600; font-size: 12px; letter-spacing: 0.5px;
          }
          .glass-back-btn:hover { border-color: ${primaryGold} !important; color: ${primaryGold} !important; }

          .sur-title { color: ${primaryGold}; letter-spacing: 3px; font-weight: 700; text-transform: uppercase; font-size: 12px; margin-bottom: 12px; display: block; }
          .main-title-cinematic { 
            color: #fff !important; font-size: clamp(28px, 5.5vw, 60px) !important; 
            font-family: 'Cormorant Garamond', serif !important; margin: 10px 0 !important;
            font-weight: 700 !important; line-height: 1.15 !important; text-shadow: 0 4px 20px rgba(0,0,0,0.4);
          }
          .title-line { width: 60px; height: 3px; background: ${primaryGold}; margin: 20px auto 30px; border-radius: 2px; }

          .glass-info-bar {
            display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 20px;
            background: rgba(255,255,255,0.12); backdrop-filter: blur(16px);
            padding: 12px 30px; border-radius: 100px; border: 1px solid rgba(255,255,255,0.18); color: #fff;
          }
          .info-node { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
          .info-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.25); align-self: center; }

          .story-body { background: #fff; position: relative; z-index: 20; margin-top: -40px; border-radius: 40px 40px 0 0; padding: 60px 0; }
          .reading-container { max-width: 800px; margin: 0 auto; padding: 0 20px; }

          .article-meta-lead { font-size: 16px; line-height: 1.6; color: #555; font-style: italic; margin-bottom: 30px; border-left: 3px solid ${primaryGold}; padding-left: 15px; }

          /* Rich Text & Dropcap Styling Styling */
          .dropcap-text { font-size: 18px; line-height: 1.85; color: #2c2c2c; font-family: 'Cormorant Garamond', serif; }
          .dropcap-text p { margin-bottom: 20px; text-align: justify; }
          .dropcap-text h2 { font-family: 'Plus Jakarta Sans', sans-serif !important; font-size: 20px !important; color: ${deepBrown}; font-weight: 700; margin: 35px 0 15px 0; }
          .dropcap-text strong { font-family: 'Plus Jakarta Sans', sans-serif !important; font-size: 15px; color: #111; }
          
          .dropcap-text p:first-of-type::first-letter {
            float: left; font-size: 70px; line-height: 0.75; padding: 6px 12px 0 0;
            color: ${primaryGold}; font-family: 'Cormorant Garamond'; font-weight: 700;
          }

          .mid-quote { margin: 50px 0; padding: 30px 20px; text-align: center; border-top: 1px solid #eee; border-bottom: 1px solid #eee; }
          .mid-quote h3 { font-style: italic; color: #3b3b3b !important; font-size: 24px; font-family: 'Cormorant Garamond'; margin-bottom: 12px !important; line-height: 1.4; }

          /* Video Responsive Panel */
          .video-section { margin: 60px 0; }
          .video-responsive-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 16px; box-shadow: 0 12px 30px rgba(0,0,0,0.08); background: #000; }
          .video-responsive-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }

          /* Photo Gallery Panel */
          .gallery-section { margin-top: 60px; }
          .gallery-header { text-align: center; margin-bottom: 40px; border-bottom: 1px solid #f0f0f0; padding-bottom: 15px; }
          .gallery-header h2 { font-family: 'Cormorant Garamond'; font-size: 32px; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px !important; }

          .art-img-wrapper { height: 240px; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.04); border: 1px solid #eee; }
          .ant-col-lg-16 .art-img-wrapper { height: 380px; }
          .art-img-wrapper .ant-image { width: 100%; height: 100%; }
          .art-img-wrapper img { width: 100%; height: 100% !important; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
          .art-img-wrapper:hover img { transform: scale(1.04); }
          .custom-image-mask { display: flex; flex-direction: column; gap: 8px; align-items: center; font-size: 15px; font-weight: 600; }

          /* Footer Layout Layout */
          .story-footer { margin-top: 50px; }
          .footer-action-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
          .glhn-share-btn { background-color: ${deepBrown} !important; border-color: ${deepBrown} !important; font-size: 13px; font-weight: 600; height: 42px; padding: 0 24px; }
          .glhn-share-btn:hover { background-color: ${primaryGold} !important; border-color: ${primaryGold} !important; }
          .footer-meta-right { text-align: right; line-height: 1.4; }

          @media (max-width: 768px) {
            .story-hero { height: 50vh; min-height: 400px; }
            .glass-back-btn { top: 20px; left: 20px; padding: 0 16px; }
            .glass-info-bar { border-radius: 16px; padding: 10px 16px; width: 100%; gap: 6px; }
            .info-divider { display: none; }
            .info-node { width: 100%; justify-content: center; font-size: 12px; }
            .main-title-cinematic { font-size: 32px !important; }
            .story-body { padding: 40px 0; border-radius: 24px 24px 0 0; margin-top: -30px; }
            .art-img-wrapper, .ant-col-lg-16 .art-img-wrapper { height: 180px !important; }
            .footer-action-row { flex-direction: column; text-align: center; }
            .footer-meta-right { text-align: center; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventDetail;
