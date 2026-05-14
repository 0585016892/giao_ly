import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Button,
  Image,
  Divider,
  Space,
  Empty,
  ConfigProvider,
} from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  ExpandOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { eventData } from "../api/events";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Paragraph, Text } = Typography;

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const event = eventData.find((item) => item.slug === slug);

  const primaryGold = "#D4AF37";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
    window.scrollTo(0, 0);
  }, [slug]);
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
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Đã copy link sự kiện!");
      } catch {
        alert("Không thể chia sẻ link.");
      }
    }
  };

  if (!event)
    return (
      <div className="not-found">
        <Empty description="Không tìm thấy sự kiện" />
      </div>
    );

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="story-wrapper">
        {/* 1. CINEMATIC HERO */}
        <section className="story-hero">
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${event.images[0]})` }}
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
                {event.category} • {event.date}
              </Text>
              <Title className="main-title-cinematic">{event.title}</Title>
              <div className="title-line" />
            </div>

            <div className="glass-info-bar">
              <div className="info-node">
                <CalendarOutlined />
                <span>{event.date}</span>
              </div>
              <div className="info-divider" />
              <div className="info-node">
                <ClockCircleOutlined />
                <span>{event.time || "08:00 AM"}</span>
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
              <Paragraph className="dropcap-text">
                {event.fullContent || event.desc}
              </Paragraph>
            </div>

            <div className="mid-quote" data-aos="fade-right">
              <div className="quote-line" />
              <Title level={3}>
                "Sự hiện diện của cộng đoàn là minh chứng cho tình hiệp nhất và
                hồng ân Thiên Chúa."
              </Title>
            </div>

            {/* 3. ARTISTIC GALLERY */}
            <div className="gallery-section">
              <div className="gallery-header">
                <Title level={2}>KHOẢNH KHẮC GHI LẠI</Title>
                <Text italic>Nhấp vào ảnh để xem chi tiết</Text>
              </div>

              <Image.PreviewGroup>
                <Row gutter={[12, 12]} className="masonry-grid">
                  {event.images.map((img, idx) => (
                    <Col
                      xs={24}
                      sm={idx % 3 === 0 ? 24 : 12}
                      lg={idx === 0 ? 16 : idx === 1 ? 8 : 8}
                      key={idx}
                      data-aos="fade-up"
                    >
                      <div className="art-img-wrapper">
                        <Image
                          src={img}
                          preview={{ mask: <ExpandOutlined /> }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </Image.PreviewGroup>
            </div>

            <div className="story-footer">
              <Divider />
              <Space size="large">
                <Button
                  type="primary"
                  shape="round"
                  icon={<ShareAltOutlined />}
                  size="large"
                  onClick={handleShare}
                >
                  CHIA SẺ
                </Button>
                <Text type="secondary">Cập nhật lúc: 14/05/2026</Text>
              </Space>
            </div>
          </div>
        </section>

        <style
          dangerouslySetInnerHTML={{
            __html: `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=Montserrat:wght@300;600&display=swap');

    .story-wrapper { background: #fff; }
    
    /* Hero Section - Optimized Height */
    .story-hero { 
      height: 60vh; 
      min-height: 400px;
      position: relative; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      overflow: hidden;
    }
    .hero-bg { 
      position: absolute; inset: 0; 
      background-size: cover; 
      background-position: center;
      filter: brightness(0.6);
      transition: transform 2s ease;
    }
    .story-hero:hover .hero-bg { transform: scale(1.05); }

    .hero-overlay { 
      position: absolute; inset: 0; 
      background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.8)); 
    }

    .hero-content { 
      position: relative; z-index: 10; 
      text-align: center; width: 100%; 
      max-width: 900px; padding: 0 20px; 
    }

    /* Back Button - Better Mobile Position */
    .glass-back-btn {
      position: absolute; top: 30px; left: 20px;
      background: rgba(255,255,255,0.15) !important; color: #fff !important;
      border: 1px solid rgba(255,255,255,0.3) !important; 
      backdrop-filter: blur(10px);
      border-radius: 100px;
      z-index: 20;
      font-size: 12px;
      letter-spacing: 1px;
    }

    .sur-title { 
      color: ${primaryGold}; 
      letter-spacing: 3px; 
      font-weight: 600; 
      text-transform: uppercase; 
      font-size: 12px;
      display: block;
      margin-bottom: 10px;
    }

    .main-title-cinematic { 
      color: #fff !important; 
      font-size: clamp(32px, 6vw, 70px) !important; 
      font-family: 'Cormorant Garamond', serif !important; 
      margin: 10px 0 20px !important;
      line-height: 1.1 !important; 
      text-shadow: 0 5px 20px rgba(0,0,0,0.5);
    }

    .title-line { width: 60px; height: 2px; background: ${primaryGold}; margin: 0 auto 30px; }

    /* Info Bar - Responsive Grid */
    .glass-info-bar {
      display: inline-flex; flex-wrap: wrap; justify-content: center;
      gap: 20px; background: rgba(255,255,255,0.1); 
      backdrop-filter: blur(15px);
      padding: 15px 30px; border-radius: 50px; 
      border: 1px solid rgba(255,255,255,0.2);
      color: #fff;
    }
    .info-node { display: flex; align-items: center; gap: 8px; font-size: 14px; white-space: nowrap; }
    .info-divider { width: 1px; height: 15px; background: rgba(255,255,255,0.3); }

    /* Body Section */
    .story-body { 
      background: #fff; position: relative; z-index: 20; 
      margin-top: -40px; border-radius: 40px 40px 0 0; 
      padding: 60px 0; 
    }
    .reading-container { max-width: 800px; margin: 0 auto; padding: 0 25px; }

    .dropcap-text { 
      font-size: clamp(17px, 2vw, 20px); 
      line-height: 1.8; color: #444; 
      font-family: 'Cormorant Garamond', serif; 
      text-align: justify;
    }
    .dropcap-text::first-letter {
      float: left; font-size: 70px; line-height: 0.8;
      padding: 5px 12px 0 0; color: ${primaryGold}; 
      font-family: 'Cormorant Garamond';
    }

    .mid-quote { 
      margin: 60px 0; padding: 20px 30px; 
      position: relative; background: #fdfaf3;
      border-left: 3px solid ${primaryGold}; 
    }
    .mid-quote h3 { 
      font-style: italic; color: #5d4037 !important; 
      font-weight: 400; font-size: clamp(18px, 3vw, 24px); 
      margin: 0 !important; font-family: 'Cormorant Garamond';
    }

    /* Gallery Section */
    .gallery-section { margin-top: 80px; }
    .gallery-header { text-align: center; margin-bottom: 40px; }
    .gallery-header h2 { font-family: 'Cormorant Garamond'; letter-spacing: 2px; margin-bottom: 0; }

    /* Fixed Aspect Ratio Gallery */
    .art-img-wrapper { 
      height: 280px; border-radius: 12px; overflow: hidden; 
      box-shadow: 0 8px 25px rgba(0,0,0,0.08); 
    }
    .ant-col-lg-16 .art-img-wrapper { height: 400px; } /* Ảnh lớn trong lưới */
    
    .art-img-wrapper .ant-image { width: 100%; height: 100%; }
    .art-img-wrapper img { width: 100%; height: 100% !important; object-fit: cover; transition: all 0.6s ease; }
    .art-img-wrapper:hover img { transform: scale(1.08); }

    .story-footer { margin-top: 80px; text-align: center; }

    /* MOBILE RESPONSIVE TWEAKS */
    @media (max-width: 768px) {
      .story-hero { height: 50vh; min-height: 350px; }
      .glass-back-btn { top: 20px; left: 15px; padding: 4px 12px; }
      
      .glass-info-bar { 
        padding: 12px 20px; gap: 10px; 
        border-radius: 20px; width: 100%;
        max-width: 320px;
      }
      .info-divider { display: none; }
      .info-node { font-size: 12px; width: 100%; justify-content: center; }

      .story-body { padding: 40px 0; margin-top: -30px; }
      .mid-quote { padding: 15px 20px; }
      
      .art-img-wrapper, .ant-col-lg-16 .art-img-wrapper { height: 220px !important; }
      
      .gallery-section { margin-top: 50px; }
    }
  `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventDetail;
