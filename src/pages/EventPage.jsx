import React, { useEffect } from "react";
import { Typography, Row, Col, Tag, Tabs, Empty, ConfigProvider } from "antd";
import { ArrowUpOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { eventData } from "../api/events";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text, Paragraph } = Typography;

const EventPage = () => {
  const navigate = useNavigate();
  const accentColor = "#D4AF37"; // Metallic Gold
  const surfaceColor = "#121212"; // Dark Mode Surface

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const renderBentoCard = (item, index) => {
    // Tạo sự khác biệt về kích thước cột để có kiểu Bento (cái to cái nhỏ)
    const isLarge = index === 0 || index === 5;

    return (
      <Col xs={24} md={isLarge ? 16 : 8} key={item.id} data-aos="fade-up">
        <div
          className={`bento-item ${isLarge ? "bento-large" : ""}`}
          onClick={() => navigate(`/su-kien/${item.slug}`)}
        >
          <div className="bento-img-container">
            <img src={item.images[0]} alt={item.title} />
            <div className="bento-overlay" />
          </div>

          <div className="bento-content">
            <div className="bento-top">
              <Tag className="bento-tag">{item.category}</Tag>
              <Text className="bento-date">{item.date}</Text>
            </div>

            <div className="bento-bottom">
              <Title level={isLarge ? 2 : 4} className="bento-title">
                {item.title}
              </Title>
              {isLarge && (
                <Paragraph className="bento-desc">{item.desc}</Paragraph>
              )}
              <div className="bento-action">
                <span className="bento-location">
                  <EnvironmentOutlined /> {item.location}
                </span>
                <div className="bento-circle-btn">
                  <ArrowUpOutlined rotate={45} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    );
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: accentColor } }}>
      <div className="bento-page">
        {/* Section Header cực tối giản */}
        <header className="magazine-header">
          <div className="header-inner">
            <div className="line-decoration" />
            <Title className="main-headline">
              SỰ KIỆN<span>& TIN TỨC</span>
            </Title>
            <div className="header-meta">
              <Text>GIÁO XỨ ĐỒNG QUAN — 2026</Text>
              <Paragraph>
                Lưu giữ những nhịp đập tâm linh và đời sống cộng đoàn qua từng
                khung hình.
              </Paragraph>
            </div>
          </div>
        </header>

        <main className="bento-container">
          <Tabs
            defaultActiveKey="1"
            className="magazine-tabs"
            items={[
              {
                key: "1",
                label: "MỚI NHẤT",
                children: (
                  <Row gutter={[20, 20]}>
                    {eventData.map((item, index) =>
                      renderBentoCard(item, index),
                    )}
                  </Row>
                ),
              },
              {
                key: "2",
                label: "LƯU TRỮ",
                children: (
                  <Empty description="Dữ liệu cũ đang được số hóa..." />
                ),
              },
            ]}
          />
        </main>

        <style
          dangerouslySetInnerHTML={{
            __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

    .bento-page { 
      background: #ffffff; 
      min-height: 100vh; 
      padding-bottom: 80px; 
      color: #121212; 
      font-family: 'Plus Jakarta Sans', sans-serif; 
    }
    .bento-container { max-width: 1400px; margin: 0 auto; padding: 0 24px; }

    /* MAGAZINE HEADER - Editorial Look */
    .magazine-header { padding: 100px 24px 60px; max-width: 1400px; margin: 0 auto; }
    .line-decoration { width: 60px; height: 3px; background: #000; margin-bottom: 24px; }
    
    .main-headline { 
      font-size: clamp(40px, 8vw, 60px) !important; 
      line-height: 0.85 !important; 
      font-weight: 800 !important; 
      letter-spacing: -0.04em; 
      margin: 0 !important; 
      text-transform: uppercase;
    }
    .main-headline span { 
      color: transparent; 
      -webkit-text-stroke: 1.5px #000; 
      font-style: italic;
      font-weight: 400;
    }
    
    .header-meta { 
      margin-top: 40px; 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-end; 
      border-top: 2px solid #121212; 
      padding-top: 24px; 
    }
    .header-meta span { font-weight: 800; letter-spacing: 0.1em; font-size: 14px; }
    .header-meta p { max-width: 450px; margin: 0; color: #444; font-size: 18px; line-height: 1.4; }

    /* TABS OPTIMIZATION */
    .magazine-tabs { margin-bottom: 40px; }
    .magazine-tabs .ant-tabs-nav::before { display: none; }
    .magazine-tabs .ant-tabs-tab { 
      transition: all 0.4s ease !important;
      background: transparent !important;
      border: 1.5px solid #eee !important;
      border-radius: 100px !important;
      padding: 10px 30px !important;
      margin-right: 12px !important;
    }
    .magazine-tabs .ant-tabs-tab-active { 
      background: #121212 !important; 
      border-color: #121212 !important; 
    }
    .magazine-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color: #fff !important; }
    .magazine-tabs .ant-tabs-tab:hover:not(.ant-tabs-tab-active) { border-color: ${accentColor} !important; color: ${accentColor} !important; }
    .magazine-tabs .ant-tabs-ink-bar { display: none; }

    /* BENTO GRID SYSTEM */
    .bento-item { 
      position: relative; 
      height: 480px; 
      border-radius: 32px; 
      overflow: hidden; 
      background: #f5f5f5; 
      cursor: pointer; 
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05);
    }
    .bento-large { height: 600px; }
    
    .bento-img-container { position: absolute; inset: 0; z-index: 0; }
    .bento-img-container img { 
      width: 100%; height: 100%; 
      object-fit: cover; 
      transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); 
    }
    .bento-overlay { 
      position: absolute; inset: 0; 
      background: linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.9) 100%); 
      transition: opacity 0.4s ease;
    }
    
    /* HOVER STATES */
    .bento-item:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -12px rgba(0,0,0,0.25); }
    .bento-item:hover img { transform: scale(1.1); }
    .bento-item:hover .bento-circle-btn { background: ${accentColor}; color: #000; transform: rotate(45deg) scale(1.1); }

    /* CONTENT LAYOUT */
    .bento-content { 
      position: absolute; inset: 0; padding: 40px; 
      display: flex; flex-direction: column; justify-content: space-between; 
      z-index: 2;
    }
    
    .bento-tag { 
      background: rgba(255,255,255,0.15); 
      backdrop-filter: blur(12px); 
      color: #fff; border: 1px solid rgba(255,255,255,0.2); 
      border-radius: 100px; padding: 6px 20px;
      font-weight: 600; text-transform: uppercase; font-size: 11px;
    }
    .bento-date { color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 500; }

    .bento-title { 
      color: white !important; 
      margin: 0 0 12px 0 !important; 
      font-weight: 700 !important;
      line-height: 1.2 !important;
    }
    .bento-desc { 
      color: rgba(255,255,255,0.6); 
      margin-bottom: 24px; font-size: 16px; 
      line-height: 1.5;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    
    .bento-action { 
      display: flex; justify-content: space-between; align-items: center; 
      border-top: 1px solid rgba(255,255,255,0.15); 
      padding-top: 24px; 
    }
    .bento-location { color: white; font-size: 15px; font-weight: 500; display: flex; align-items: center; gap: 8px; }
    
    .bento-circle-btn { 
      width: 56px; height: 56px; border-radius: 50%; background: #fff; 
      display: flex; align-items: center; justify-content: center; 
      font-size: 22px; color: #000;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* RESPONSIVE */
    @media (max-width: 992px) {
      .bento-item, .bento-large { height: 450px; }
      .header-meta { flex-direction: column; align-items: flex-start; gap: 20px; }
    }
    @media (max-width: 768px) {
      .magazine-header { padding: 60px 20px 30px; }
      .main-headline { font-size: 30px !important; }
      .bento-content { padding: 24px; }
      .bento-item { border-radius: 24px; }
    }
  `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default EventPage;
