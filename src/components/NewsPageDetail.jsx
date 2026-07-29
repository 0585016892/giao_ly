import React, { useMemo, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Tag,
  Button,
  Row,
  Col,
  Divider,
  Space,
  Avatar,
  Card,
  Spin,
  ConfigProvider,
} from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  CalendarOutlined,
  UserOutlined,
  CompassOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { newsData } from "../api/newdata";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text, Paragraph } = Typography;

const NewsPageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Navy Đậm
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setLoading(false);
      AOS.refresh();
    }, 600);

    return () => clearTimeout(timer);
  }, [slug]);

  const article = useMemo(
    () => newsData.find((item) => item.slug === slug),
    [slug],
  );

  const relatedNews = useMemo(
    () => newsData.filter((item) => item.slug !== slug).slice(0, 3),
    [slug],
  );

  if (!loading && !article) {
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: primaryNavy,
            fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
          },
        }}
      >
        <div className="not-found-wrapper">
          <Title level={2} className="not-found-title">
            Thông tin không tồn tại
          </Title>
          <Paragraph className="not-found-desc">
            Bài viết có thể đã được gỡ bỏ hoặc đường dẫn không chính xác.
          </Paragraph>
          <Button
            type="primary"
            onClick={() => navigate("/bang-tin")}
            className="back-news-btn"
          >
            QUAY LẠI BẢNG TIN
          </Button>
        </div>
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 12,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <div className="news-detail-editorial-layout">
        {/* 1. TOP STICKY BAR */}
        <div className="detail-top-nav">
          <div className="custom-container">
            <Row justify="space-between" align="middle">
              <Button
                type="text"
                icon={<ArrowLeftOutlined style={{ color: primaryNavy }} />}
                onClick={() => navigate(-1)}
                className="top-nav-btn"
              >
                QUAY LẠI
              </Button>
              <Space>
                <Button
                  type="text"
                  icon={<ShareAltOutlined style={{ color: primaryNavy }} />}
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Đã sao chép liên kết bài viết!");
                  }}
                  className="top-action-icon"
                />
                <Button
                  type="text"
                  icon={<PrinterOutlined style={{ color: primaryNavy }} />}
                  onClick={() => window.print()}
                  className="top-action-icon"
                />
              </Space>
            </Row>
          </div>
        </div>

        {loading ? (
          <div className="news-loading-box">
            <Spin size="large" />
          </div>
        ) : (
          <article className="custom-container" style={{ marginTop: "40px" }}>
            {/* 2. HEADER BÀI VIẾT */}
            <div className="article-header" data-aos="fade-up">
              <span className="article-category-badge">
                <CompassOutlined />{" "}
                {article.category?.toUpperCase() || "TIN TỨC PHỤNG VỤ"}
              </span>

              <Title level={1} className="article-main-title">
                {article.title}
              </Title>

              <div className="article-meta-bar">
                <Space
                  split={
                    <Divider
                      type="vertical"
                      style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
                    />
                  }
                >
                  <Text className="meta-text">
                    <CalendarOutlined
                      style={{ color: accentGold, marginRight: 6 }}
                    />
                    {article.date}
                  </Text>
                  <Text className="meta-text">
                    <UserOutlined
                      style={{ color: accentGold, marginRight: 6 }}
                    />
                    Tác giả: Ban Truyền Thông Giáo Xứ
                  </Text>
                </Space>
              </div>
            </div>

            {/* 3. ANH NỔI BẬT FEATURED IMAGE */}
            <div className="article-featured-image-box" data-aos="zoom-in">
              <img
                src={article.image}
                alt={article.title}
                className="article-featured-img"
              />
              <div className="image-caption">
                Thánh Đường Giáo Xứ Đồng Quan — Hình ảnh sinh hoạt cộng đoàn
              </div>
            </div>

            {/* 4. NỘI DUNG CHÍNH (READING BODY) */}
            <div className="article-reading-body">
              {/* Lead Paragraph */}
              <Paragraph className="article-lead-summary">
                {article.summary}
              </Paragraph>

              {/* Rich Text HTML Content */}
              <div
                className="article-rich-text"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <Divider
                style={{
                  margin: "60px 0 40px",
                  borderColor: "rgba(212, 175, 55, 0.25)",
                }}
              />

              {/* 5. THÔNG TIN TÁC GIẢ */}
              <div className="author-profile-card">
                <Avatar
                  size={56}
                  style={{
                    backgroundColor: primaryNavy,
                    color: accentGold,
                    border: `2px solid ${accentGold}`,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  G
                </Avatar>
                <div style={{ marginLeft: "16px" }}>
                  <Text strong className="author-name">
                    Ban Truyền Thông Giáo Xứ Đồng Quan
                  </Text>
                  <br />
                  <Text className="author-bio">
                    Cập nhật chính xác những tin tức, thông báo phụng vụ và sứ
                    điệp Mùa Thánh từ Giáo xứ hằng ngày.
                  </Text>
                </div>
              </div>
            </div>

            {/* 6. BÀI VIẾT QUAN TÂM / BÀI LIÊN QUAN */}
            <div className="related-section-wrapper" data-aos="fade-up">
              <div className="related-inner">
                <div style={{ textAlign: "center", marginBottom: "36px" }}>
                  <span className="related-subhead">BÀI VIẾT KHÁC</span>
                  <Title level={3} className="related-main-title">
                    Có Thể Bạn Quan Tâm
                  </Title>
                  <div className="gold-accent-divider" />
                </div>

                <Row gutter={[24, 24]}>
                  {relatedNews.map((item) => (
                    <Col xs={24} md={8} key={item.id || item.slug}>
                      <Card
                        hoverable
                        className="related-item-card"
                        onClick={() => navigate(`/bang-tin/${item.slug}`)}
                      >
                        <div className="related-media-box">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="related-img-hover"
                          />
                          <Tag className="related-category-pill">
                            {item.category || "TIN TỨC"}
                          </Tag>
                        </div>
                        <div className="related-content-box">
                          <Text className="related-date-text">
                            <CalendarOutlined style={{ color: accentGold }} />{" "}
                            {item.date}
                          </Text>
                          <Title level={5} className="related-title-text">
                            {item.title}
                          </Title>
                          <div className="related-read-more">
                            XEM BÀI VIẾT <ArrowRightOutlined />
                          </div>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </article>
        )}

        {/* STYLES SCOPED */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .news-detail-editorial-layout { 
            background: ${softBg}; 
            min-height: 100vh; 
            padding-bottom: 80px; 
            color: ${textDark};
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .custom-container { 
            max-width: 1000px; 
            margin: 0 auto; 
            padding: 0 20px; 
          }

          .not-found-wrapper {
            padding: 100px 20px;
            text-align: center;
            background: ${softBg};
            min-height: 100vh;
          }

          .not-found-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
          }

          .not-found-desc {
            color: #64748b;
            margin-bottom: 24px;
          }

          .back-news-btn {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 700;
            border-radius: 8px;
            height: 44px;
            padding: 0 28px;
          }

          /* Top Bar Nav */
          .detail-top-nav {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            padding: 14px 0;
            border-bottom: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04);
          }

          .top-nav-btn {
            font-weight: 700 !important;
            color: ${primaryNavy} !important;
            letter-spacing: 0.5px;
          }

          .top-action-icon {
            border-radius: 50% !important;
          }

          .news-loading-box {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 120px 0;
          }

          /* Header Bài viết */
          .article-header {
            text-align: center;
            max-width: 820px;
            margin: 0 auto 36px;
          }

          .article-category-badge {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            padding: 6px 18px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
          }

          .article-main-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(28px, 4.5vw, 44px) !important;
            line-height: 1.25 !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            margin-bottom: 20px !important;
          }

          .article-meta-bar {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .meta-text {
            color: #64748b;
            font-size: 13px;
            font-weight: 500;
          }

          /* Featured Image */
          .article-featured-image-box {
            margin-bottom: 48px;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow: 0 12px 36px rgba(27, 54, 93, 0.08);
          }

          .article-featured-img {
            width: 100%;
            height: auto;
            max-height: 540px;
            object-fit: cover;
            display: block;
          }

          .image-caption {
            background: #ffffff;
            padding: 10px 16px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            font-style: italic;
            border-top: 1px solid rgba(212, 175, 55, 0.2);
          }

          /* Reading Body */
          .article-reading-body {
            max-width: 760px;
            margin: 0 auto;
          }

          .article-lead-summary {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 19px !important;
            font-weight: 600;
            line-height: 1.7;
            color: ${primaryNavy} !important;
            margin-bottom: 36px !important;
            font-style: italic;
            border-left: 4px solid ${accentGold};
            padding-left: 20px;
            background: rgba(212, 175, 55, 0.06);
            padding-top: 14px;
            padding-bottom: 14px;
            border-radius: 0 12px 12px 0;
          }

          /* Rich Text HTML Body Formatting */
          .article-rich-text {
            font-size: 17px;
            line-height: 1.85;
            color: ${textDark};
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .article-rich-text p {
            margin-bottom: 24px;
            text-align: justify;
          }

          .article-rich-text h2, .article-rich-text h3 {
            font-family: 'Playfair Display', Georgia, serif;
            color: ${primaryNavy};
            margin-top: 36px;
            margin-bottom: 16px;
            font-weight: 700;
          }

          .article-rich-text h2 {
            font-size: 24px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.3);
            padding-bottom: 8px;
          }

          .article-rich-text h3 {
            font-size: 20px;
          }

          .article-rich-text img {
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 24px 0;
            box-shadow: 0 8px 24px rgba(27, 54, 93, 0.08);
          }

          .article-rich-text blockquote {
            border-left: 4px solid ${accentGold};
            background: #ffffff;
            padding: 16px 24px;
            margin: 28px 0;
            font-style: italic;
            color: #475569;
            border-radius: 0 12px 12px 0;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04);
          }

          /* Author Profile Card */
          .author-profile-card {
            display: flex;
            align-items: center;
            background: #ffffff;
            padding: 20px 24px;
            border-radius: 16px;
            border: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04);
          }

          .author-name {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 17px;
            color: ${primaryNavy};
          }

          .author-bio {
            color: #64748b;
            font-size: 13px;
          }

          /* Related Section */
          .related-section-wrapper {
            margin-top: 80px;
            background: #ffffff;
            border-radius: 24px;
            padding: 48px 28px;
            border: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.05);
          }

          .related-subhead {
            font-size: 11px;
            letter-spacing: 2px;
            color: ${accentGold};
            font-weight: 700;
            text-transform: uppercase;
          }

          .related-main-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 4px 0 0 0 !important;
            font-weight: 700 !important;
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin: 12px auto 0;
            border-radius: 2px;
          }

          .related-item-card {
            border-radius: 16px !important;
            overflow: hidden;
            border: 1px solid rgba(27, 54, 93, 0.1) !important;
            background: ${softBg} !important;
            transition: all 0.35s ease !important;
            height: 100%;
          }

          .related-item-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 12px 28px rgba(27, 54, 93, 0.12) !important;
            border-color: ${accentGold} !important;
          }

          .related-media-box {
            position: relative;
            height: 170px;
            overflow: hidden;
          }

          .related-img-hover {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }

          .related-item-card:hover .related-img-hover {
            transform: scale(1.08);
          }

          .related-category-pill {
            position: absolute;
            top: 12px;
            left: 12px;
            background: rgba(15, 31, 56, 0.85) !important;
            border: 1px solid ${accentGold} !important;
            color: ${accentGold} !important;
            font-weight: 700;
            font-size: 10px;
            padding: 2px 10px;
            border-radius: 14px;
          }

          .related-content-box {
            padding: 16px;
            display: flex;
            flex-direction: column;
          }

          .related-date-text {
            font-size: 11px;
            color: #64748b;
            font-weight: 600;
          }

          .related-title-text {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 6px 0 12px 0 !important;
            font-weight: 700 !important;
            line-height: 1.35 !important;
          }

          .related-read-more {
            font-size: 11px;
            font-weight: 700;
            color: ${primaryNavy};
            display: flex;
            align-items: center;
            gap: 4px;
            letter-spacing: 0.5px;
            margin-top: auto;
          }

          .related-item-card:hover .related-read-more {
            color: ${accentGold};
          }

          @media (max-width: 768px) {
            .custom-container { padding: 0 14px; }
            .article-lead-summary { font-size: 16px !important; }
            .article-rich-text { font-size: 15px; line-height: 1.7; }
            .related-section-wrapper { padding: 32px 16px; }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
};

export default NewsPageDetail;
