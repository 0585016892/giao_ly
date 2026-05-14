import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Tag,
  List,
  Input,
  Space,
  Divider,
  Button,
} from "antd";
import {
  SearchOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

import { newsData } from "../api/newdata";

const { Title, Text, Paragraph } = Typography;

const colors = {
  primary: "#1a1a1a",
  accent: "#b89e6c",
  bg: "#fcfaf7",
};

const NewsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const filteredNews = useMemo(() => {
    const keyword = searchTerm.toLowerCase().trim();
    if (!keyword) return newsData;
    return newsData.filter(
      (item) =>
        item.title?.toLowerCase().includes(keyword) ||
        item.category?.toLowerCase().includes(keyword),
    );
  }, [searchTerm]);

  const featured = filteredNews[0];
  const listNews = filteredNews.slice(1, 5);
  const olderNews = filteredNews.slice(5, 11);

  return (
    <div
      style={{
        background: colors.bg,
        minHeight: "100vh",
        paddingBottom: "80px",
      }}
    >
      {/* 1. HEADER */}
      <div style={{ padding: "40px 0", borderBottom: `1px solid #eee` }}>
        <div className="custom-container">
          <Row justify="space-between" align="bottom" gutter={[20, 20]}>
            <Col xs={24} md={16}>
              <Title
                level={1}
                style={{ margin: 0, fontFamily: "serif", fontSize: "48px" }}
              >
                Bản Tin <span style={{ color: colors.accent }}>Phụng Sự</span>
              </Title>
              <Text
                type="secondary"
                style={{ textTransform: "uppercase", letterSpacing: "2px" }}
              >
                Tin tức & Sự kiện Giáo xứ |{" "}
                {new Date().toLocaleDateString("vi-VN")}
              </Text>
            </Col>
            <Col xs={24} md={8}>
              <Input
                size="large"
                placeholder="Tìm kiếm..."
                prefix={<SearchOutlined style={{ color: colors.accent }} />}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  borderRadius: "0px",
                  border: "none",
                  borderBottom: `2px solid ${colors.primary}`,
                  background: "transparent",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>

      <div className="custom-container" style={{ marginTop: "40px" }}>
        <Row gutter={[48, 48]}>
          {/* 2. TIN TIÊU ĐIỂM */}
          <Col xs={24} lg={16}>
            {featured && (
              <div className="main-story" data-aos="fade-up">
                <div
                  style={{ overflow: "hidden", cursor: "pointer" }}
                  onClick={() => navigate(`/bang-tin/${featured.slug}`)}
                >
                  <img
                    src={featured.image}
                    alt="featured"
                    style={{
                      width: "100%",
                      height: "450px",
                      objectFit: "cover",
                    }}
                    className="hover-zoom"
                  />
                </div>
                <div style={{ marginTop: "24px" }}>
                  <Tag color="black" style={{ borderRadius: 0 }}>
                    {featured.category}
                  </Tag>
                  <Title
                    level={2}
                    className="clickable-title"
                    onClick={() => navigate(`/bang-tin/${featured.slug}`)}
                    style={{
                      fontSize: "32px",
                      marginTop: "16px",
                      fontFamily: "serif",
                      cursor: "pointer",
                    }}
                  >
                    {featured.title}
                  </Title>
                  <Paragraph
                    style={{
                      fontSize: "16px",
                      color: "#555",
                      lineHeight: "1.8",
                    }}
                  >
                    {featured.summary}
                  </Paragraph>
                  <Button
                    type="link"
                    style={{
                      color: colors.accent,
                      padding: 0,
                      fontWeight: "bold",
                    }}
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(`/bang-tin/${featured.slug}`)}
                  >
                    XEM CHI TIẾT
                  </Button>
                </div>
              </div>
            )}
          </Col>

          {/* 3. DANH SÁCH MỚI NHẤT */}
          <Col xs={24} lg={8}>
            <Title
              level={4}
              style={{
                borderBottom: "2px solid #1a1a1a",
                display: "inline-block",
                marginBottom: "24px",
              }}
            >
              MỚI NHẤT
            </Title>
            <List
              itemLayout="vertical"
              dataSource={listNews}
              renderItem={(item) => (
                <List.Item
                  style={{
                    padding: "16px 0",
                    borderBottom: "1px solid #e8e8e8",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/bang-tin/${item.slug}`)}
                >
                  <Space direction="vertical" size={4}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      <ClockCircleOutlined /> {item.date}
                    </Text>
                    <Title
                      level={5}
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        transition: "0.3s",
                      }}
                      className="list-item-hover"
                    >
                      {item.title}
                    </Title>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
        </Row>

        <Divider style={{ margin: "60px 0" }} />

        {/* 4. TIN CŨ HƠN (Sửa lỗi slug tại đây) */}
        <Row gutter={[32, 48]}>
          {olderNews.map((news, index) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              key={news.id || index}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <div
                className="news-card-minimal"
                onClick={() => navigate(`/bang-tin/${news.slug}`)} // Sửa: Dùng news.slug thay vì featured.slug
              >
                <div style={{ overflow: "hidden", marginBottom: "16px" }}>
                  <img
                    src={news.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                    }}
                    className="hover-zoom"
                  />
                </div>
                <Text
                  style={{
                    color: colors.accent,
                    fontWeight: 600,
                    fontSize: "11px",
                    letterSpacing: "1px",
                  }}
                >
                  {news.category?.toUpperCase()}
                </Text>
                <Title
                  level={4}
                  style={{
                    marginTop: "8px",
                    fontSize: "18px",
                    lineHeight: "1.4",
                    fontFamily: "serif",
                  }}
                >
                  {news.title}
                </Title>
                <Text type="secondary" style={{ fontSize: "13px" }}>
                  {news.date}
                </Text>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      <style>{`
        .custom-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        .hover-zoom { transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .hover-zoom:hover { transform: scale(1.05); }
        .news-card-minimal { cursor: pointer; }
        .clickable-title:hover { color: ${colors.accent} !important; }
        .list-item-hover:hover { color: ${colors.accent} !important; }
        .custom-dark-input .ant-input { background: transparent !important; color: white !important; border-color: #444 !important; }
        .ant-input-search-button { background: ${colors.accent} !important; border-color: ${colors.accent} !important; }
      `}</style>
    </div>
  );
};

export default NewsPage;
