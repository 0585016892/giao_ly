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
} from "antd";
import {
  ArrowLeftOutlined,
  ShareAltOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { newsData } from "../api/newdata";
import AOS from "aos";
import "aos/dist/aos.css";

const { Title, Text, Paragraph } = Typography;

const colors = {
  primary: "#1a1a1a",
  accent: "#b89e6c",
  bg: "#fcfaf7", // Màu kem nhẹ giúp đọc văn bản lâu không mỏi mắt
};

const NewsPageDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mỗi khi slug thay đổi, bật loading
    setLoading(true);
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setLoading(false);
      AOS.refresh(); // Làm mới hiệu ứng khi data đã hiện ra
    }, 1000); // Đợi 1 giây

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
      <div
        style={{
          padding: "100px",
          textAlign: "center",
          background: colors.bg,
          minHeight: "100vh",
        }}
      >
        <Title level={2} style={{ fontFamily: "serif" }}>
          Thông tin không tồn tại
        </Title>
        <Paragraph>
          Bài viết có thể đã được gỡ bỏ hoặc đường dẫn không chính xác.
        </Paragraph>
        <Button
          onClick={() => navigate("/bang-tin")}
          style={{ borderRadius: 0, border: "1px solid #1a1a1a" }}
        >
          Quay lại trang tin tức
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {/* 1. TOP PROGRESS BAR (Optional) & BACK NAV */}
      <div
        style={{
          sticky: "top",
          padding: "20px 0",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="custom-container">
          <Row justify="space-between" align="middle">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ fontWeight: 500 }}
            >
              QUAY LẠI
            </Button>
            <Space>
              <Button type="text" icon={<ShareAltOutlined />} />
              <Button type="text" icon={<PrinterOutlined />} />
            </Space>
          </Row>
        </div>
      </div>

      <article className="custom-container" style={{ marginTop: "60px" }}>
        {/* 2. ARTICLE HEADER */}
        <div
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 40px",
          }}
          data-aos="fade-up"
        >
          <Tag
            color="gold"
            style={{ borderRadius: 0, padding: "0 12px", marginBottom: "20px" }}
          >
            {article.category?.toUpperCase()}
          </Tag>
          <Title
            level={1}
            style={{
              fontFamily: "serif",
              fontSize: "clamp(32px, 5vw, 48px)", // Responsive font size
              lineHeight: "1.2",
              marginBottom: "24px",
            }}
          >
            {article.title}
          </Title>

          <Space split={<Divider type="vertical" />} style={{ color: "#888" }}>
            <Text type="secondary">{article.date}</Text>
            <Text type="secondary">Tác giả: Ban Truyền Thông</Text>
          </Space>
        </div>

        {/* 3. FEATURED IMAGE (Full width within container) */}
        <div style={{ marginBottom: "60px" }} data-aos="zoom-in">
          <img
            src={article.image}
            alt={article.title}
            style={{
              width: "100%",
              height: "auto",
              maxHeight: "600px",
              objectFit: "cover",
              boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
            }}
          />
        </div>

        {/* 4. CONTENT BODY */}
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          {/* Tóm tắt bài viết - Lead Paragraph */}
          <Paragraph
            style={{
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "1.6",
              color: colors.primary,
              marginBottom: "40px",
              fontStyle: "italic",
              borderLeft: `4px solid ${colors.accent}`,
              paddingLeft: "20px",
            }}
          >
            {article.summary}
          </Paragraph>

          <div
            className="article-rich-text"
            style={{
              fontSize: "18px",
              lineHeight: "1.8",
              color: "#333",
              fontFamily: "'Inter', sans-serif",
            }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <Divider style={{ margin: "80px 0 40px" }} />

          {/* 5. AUTHOR BIO & TAGS */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "60px",
            }}
          >
            <Avatar size={64} style={{ backgroundColor: colors.accent }}>
              G
            </Avatar>
            <div style={{ marginLeft: "16px" }}>
              <Text strong style={{ fontSize: "16px" }}>
                Ban Truyền Thông Giáo Xứ
              </Text>
              <br />
              <Text type="secondary">
                Cập nhật những tin tức và sứ điệp từ giáo xứ hằng ngày.
              </Text>
            </div>
          </div>
        </div>

        {/* 6. RELATED ARTICLES SECTION */}
        <div
          style={{
            marginTop: "100px",
            background: "rgba(0,0,0,0.02)",
            padding: "60px 20px",
          }}
        >
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <Title
              level={3}
              style={{
                fontFamily: "serif",
                marginBottom: "40px",
                textAlign: "center",
              }}
            >
              Có thể bạn quan tâm
            </Title>
            <Row gutter={[32, 32]}>
              {relatedNews.map((item) => (
                <Col xs={24} md={8} key={item.id}>
                  <div
                    className="related-item"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/bang-tin/${item.slug}`)}
                  >
                    <div style={{ overflow: "hidden", marginBottom: "15px" }}>
                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          transition: "transform 0.5s",
                        }}
                        className="hover-scale"
                      />
                    </div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {item.date}
                    </Text>
                    <br />
                    <Title
                      level={5}
                      style={{ marginTop: "8px", fontFamily: "serif" }}
                    >
                      {item.title}
                    </Title>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </article>

      <style>{`
        .custom-container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
        
        .article-rich-text p {
          margin-bottom: 24px;
        }

        .article-rich-text img {
          max-width: 100%;
          height: auto;
          margin: 20px 0;
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .related-item:hover h5 {
          color: ${colors.accent};
        }

        @media (max-width: 768px) {
          .custom-container { padding: 0 15px; }
        }
      `}</style>
    </div>
  );
};

export default NewsPageDetail;
