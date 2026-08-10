import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Divider,
  Space,
  Tag,
  Breadcrumb,
  Empty,
  ConfigProvider,
  Skeleton,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  FlagOutlined,
  MailOutlined,
  CompassOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { getGroupDetail } from "../api/groupApi";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const GroupDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  // Bảng màu chuẩn Giáo xứ Đồng Quan
  const primaryNavy = "#1B365D";
  const accentGold = "#D4AF37";
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true });
  }, [slug]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getGroupDetail(slug);
        const detailData = res.data?.data || res.data || res;
        setGroup(detailData);
        if (detailData?.name) {
          document.title = `${detailData.name} | Giáo xứ Đồng Quan`;
        }
      } catch (err) {
        console.error("FETCH GROUP DETAIL ERROR:", err);
        setGroup(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchDetail();
    }
  }, [slug]);

  // TRẠNG THÁI LOADING ĐẦY ĐỦ (SKELETON SCREEN)
  if (loading) {
    return (
      <ConfigProvider theme={{ token: { colorPrimary: primaryNavy } }}>
        <Layout className="group-detail-editorial-layout">
          <Content className="detail-main-content">
            <div style={{ marginBottom: 24 }}>
              <Skeleton.Input active size="small" style={{ width: 200 }} />
            </div>
            <Row gutter={[36, 36]}>
              <Col xs={24} lg={9}>
                <Skeleton.Button
                  active
                  block
                  style={{ height: 420, borderRadius: 20 }}
                />
                <div style={{ marginTop: 24 }}>
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              </Col>
              <Col xs={24} lg={15}>
                <Skeleton active paragraph={{ rows: 10 }} />
              </Col>
            </Row>
          </Content>
        </Layout>
      </ConfigProvider>
    );
  }

  // TRẠNG THÁI KHÔNG TÌM THẤY DỮ LIỆU
  if (!group) {
    return (
      <Content className="empty-detail-wrapper">
        <Empty description="Không tìm thấy dữ liệu chi tiết của hội đoàn này hoặc trang không tồn tại." />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/hoi-doan")}
          className="back-list-btn"
        >
          Quay lại danh sách hội đoàn
        </Button>
      </Content>
    );
  }

  const themeColor = group.color || primaryNavy;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColor,
          borderRadius: 14,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="group-detail-editorial-layout">
        {/* BREADCRUMB NAVIGATION */}
        <div className="breadcrumb-wrapper">
          <Breadcrumb
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/hoi-doan">Hội đoàn</Link> },
              {
                title: (
                  <Text strong style={{ color: primaryNavy }}>
                    {group.name}
                  </Text>
                ),
              },
            ]}
          />
        </div>

        <Content className="detail-main-content">
          <Row gutter={[36, 36]}>
            {/* CỘT TRÁI: POSTER BÌA & SIDEBAR ĐĂNG KÝ */}
            <Col xs={24} lg={9} data-aos="fade-right">
              <div className="sticky-sidebar-container">
                {/* POSTER ẢNH BÌA EDITORIAL */}
                <div
                  className="editorial-poster"
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_API_URL || ""}${group.image})`,
                  }}
                >
                  <div className="poster-gradient-shading" />
                  <div className="poster-floating-tags">
                    {group.founding_year && (
                      <Tag className="glass-tag">
                        <CompassOutlined /> Năm lập: {group.founding_year}
                      </Tag>
                    )}
                    <Tag className="glass-tag">
                      <TeamOutlined /> {group.members_count || 0} Thành viên
                    </Tag>
                  </div>
                </div>

                {/* CARD ĐĂNG KÝ THAM GIA */}
                <Card bordered={false} className="registration-sidebar-card">
                  <Title level={4} className="sidebar-card-title">
                    Hành Trình Gắn Kết
                  </Title>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    <div className="sidebar-info-row">
                      <div className="info-icon-box">
                        <EnvironmentOutlined />
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Địa điểm sinh hoạt
                        </Text>
                        <br />
                        <Text
                          strong
                          style={{ color: primaryNavy, fontSize: 14 }}
                        >
                          Nhà mục vụ Giáo xứ
                        </Text>
                      </div>
                    </div>

                    <div className="sidebar-info-row">
                      <div className="info-icon-box">
                        <MailOutlined />
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Hòm thư điều hành
                        </Text>
                        <br />
                        <Text
                          strong
                          style={{ color: primaryNavy, fontSize: 14 }}
                        >
                          dongquan.groups@gmail.com
                        </Text>
                      </div>
                    </div>

                    <Divider
                      style={{
                        margin: "12px 0",
                        borderColor: "rgba(212, 175, 55, 0.2)",
                      }}
                    />

                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<SendOutlined />}
                      className="submit-registration-btn"
                      onClick={() =>
                        message.info(
                          "Chức năng đăng ký gia nhập đang được mở trực tiếp tại Văn phòng Giáo xứ!",
                        )
                      }
                    >
                      ĐĂNG KÝ THAM GIA NGAY
                    </Button>

                    <Button
                      block
                      type="text"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => navigate("/hoi-doan")}
                      className="back-btn-text"
                    >
                      Quay về danh sách
                    </Button>
                  </Space>
                </Card>
              </div>
            </Col>

            {/* CỘT PHẢI: TYPOGRAPHY NỘI DUNG VÀ TIMELINE */}
            <Col xs={24} lg={15} data-aos="fade-up">
              <div className="editorial-article-body">
                {/* HEADER TIÊU ĐỀ HỘI ĐOÀN */}
                <div className="article-header">
                  {group.patron && (
                    <span className="patron-sub-title">
                      <SafetyCertificateOutlined style={{ marginRight: 6 }} />
                      Hội Đoàn Bổn Mạng: {group.patron}
                    </span>
                  )}
                  <Title level={1} className="article-main-title">
                    {group.name}
                  </Title>
                  <div className="gold-accent-divider" />
                </div>

                {/* GIỚI THIỆU MÔ TẢ CHI TIẾT */}
                <div className="article-content-segment">
                  <Paragraph className="paragraph-rich-text">
                    {group.description || group.desc}
                  </Paragraph>
                </div>

                {/* MỤC TIÊU & SỨ MẠNG */}
                {group.missions && group.missions.length > 0 && (
                  <>
                    <Divider
                      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                    />
                    <div className="article-content-segment">
                      <Title level={3} className="segment-section-title">
                        <FlagOutlined
                          style={{ color: accentGold, marginRight: 10 }}
                        />{" "}
                        Mục Tiêu & Sứ Mạng
                      </Title>
                      <ul className="custom-editorial-list">
                        {group.missions.map((mission, index) => (
                          <li key={index}>
                            <Text style={{ fontSize: 15, color: textDark }}>
                              {mission}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* DẤU ẤN HÀNH TRÌNH TIMELINE */}
                {group.timeline && group.timeline.length > 0 && (
                  <>
                    <Divider
                      style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
                    />
                    <div className="article-content-segment">
                      <Title level={3} className="segment-section-title">
                        <CalendarOutlined
                          style={{ color: accentGold, marginRight: 10 }}
                        />{" "}
                        Dấu Ấn Hành Trình
                      </Title>

                      <div className="modern-cards-timeline">
                        {group.timeline.map((item, idx) => (
                          <div className="timeline-card-node" key={idx}>
                            <div className="node-badge-year">{item.year}</div>
                            <div className="node-card-body">
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: textDark,
                                  lineHeight: "1.6",
                                }}
                              >
                                {item.event}
                              </Text>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* LỜI TRÍCH KINH THÁNH FOOTER */}
                <div className="editorial-scripture-footer">
                  <Text
                    italic
                    style={{
                      color: "#64748b",
                      fontSize: 14,
                      display: "block",
                      fontFamily: "'Playfair Display', Georgia, serif",
                    }}
                  >
                    "Lúa chín đầy đồng, mà thợ gặt lại ít. Vậy anh em hãy xin
                    chủ mùa gặt sai thợ ra gặt lúa về." (Mt 9,37-38)
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Content>

        {/* STYLES SCOPED EDITORIAL */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .group-detail-editorial-layout { 
            background: ${softBg}; 
            min-height: 100vh; 
            padding-bottom: 80px; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .empty-detail-wrapper {
            padding: 120px 20px;
            text-align: center;
            background: ${softBg};
            min-height: 100vh;
          }

          .back-list-btn {
            margin-top: 24px;
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 700;
            border-radius: 8px;
            height: 42px;
          }

          /* TẠO MARGIN TOP 5% CHO BREADCRUMB */
          .breadcrumb-wrapper { 
            max-width: 1200px; 
            margin: 3% auto 0 auto; 
            padding: 20px 20px 16px 20px; 
          }

          .detail-main-content { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 0 20px; 
          }

          /* Sticky Sidebar */
          .sticky-sidebar-container { 
            position: sticky; 
            top: 24px; 
          }

          .editorial-poster {
            height: 420px;
            background-size: cover;
            background-position: center;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            margin-bottom: 24px;
            border: 1px solid rgba(212, 175, 55, 0.25);
            box-shadow: 0 12px 32px rgba(27, 54, 93, 0.12);
          }

          .poster-gradient-shading {
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(15, 31, 56, 0.85) 100%);
          }

          .poster-floating-tags { 
            position: absolute; 
            bottom: 20px; 
            left: 20px; 
            right: 20px; 
            display: flex; 
            gap: 10px; 
            flex-wrap: wrap; 
          }

          .glass-tag { 
            background: rgba(15, 31, 56, 0.8) !important; 
            backdrop-filter: blur(8px); 
            border: 1px solid ${accentGold} !important; 
            color: ${accentGold} !important; 
            font-weight: 600; 
            padding: 4px 12px; 
            border-radius: 20px; 
            font-size: 12px;
          }

          .registration-sidebar-card { 
            background: #ffffff !important; 
            border: 1px solid rgba(212, 175, 55, 0.25) !important; 
            border-radius: 20px !important;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.04) !important; 
            padding: 8px;
          }

          .sidebar-card-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            margin-bottom: 20px !important;
          }

          .sidebar-info-row { display: flex; align-items: center; gap: 14px; }

          .info-icon-box { 
            width: 40px; 
            height: 40px; 
            border-radius: 12px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 18px; 
            background: rgba(212, 175, 55, 0.15);
            color: ${primaryNavy};
            border: 1px solid rgba(212, 175, 55, 0.3);
            flex-shrink: 0;
          }

          .submit-registration-btn { 
            font-weight: 700 !important; 
            height: 46px !important; 
            border-radius: 10px !important;
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
          }

          .submit-registration-btn:hover {
            background: ${accentGold} !important;
            border-color: ${accentGold} !important;
            color: ${primaryNavy} !important;
          }

          .back-btn-text {
            color: #64748b !important;
          }

          /* Editorial Article Right */
          .editorial-article-body { 
            background: #ffffff; 
            border: 1px solid rgba(212, 175, 55, 0.25); 
            border-radius: 20px; 
            padding: 36px; 
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.05); 
          }

          .article-header { margin-bottom: 24px; }

          .patron-sub-title { 
            font-size: 12px; 
            text-transform: uppercase; 
            letter-spacing: 1.5px; 
            display: inline-block; 
            margin-bottom: 8px; 
            color: ${accentGold};
            font-weight: 700;
          }

          .article-main-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important; 
            font-weight: 700 !important; 
            font-size: clamp(24px, 4vw, 36px) !important; 
            margin: 0 0 16px 0 !important; 
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            border-radius: 2px;
          }

          .paragraph-rich-text { 
            font-size: 15px; 
            line-height: 1.8; 
            color: ${textDark}; 
            text-align: justify; 
            white-space: pre-line; 
          }

          .segment-section-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            margin-bottom: 20px !important;
          }

          /* Custom List */
          .custom-editorial-list { list-style: none; padding-left: 0; margin: 0; }
          .custom-editorial-list li { position: relative; padding-left: 24px; margin-bottom: 12px; }
          .custom-editorial-list li::before { 
            content: '✦'; 
            position: absolute; 
            left: 0; 
            top: 0; 
            color: ${accentGold}; 
            font-size: 14px; 
          }

          /* Cards Timeline */
          .modern-cards-timeline { display: flex; flex-direction: column; gap: 14px; margin-top: 16px; }
          .timeline-card-node { display: flex; gap: 14px; align-items: flex-start; }

          .node-badge-year { 
            font-weight: 800; 
            font-size: 12px; 
            padding: 5px 12px; 
            border-radius: 20px; 
            min-width: 75px; 
            text-align: center; 
            background: rgba(212, 175, 55, 0.15);
            color: ${primaryNavy};
            border: 1px solid ${accentGold};
            flex-shrink: 0;
          }

          .node-card-body { 
            flex: 1; 
            background: ${softBg}; 
            padding: 12px 18px; 
            border-radius: 10px; 
            border: 1px solid rgba(27, 54, 93, 0.08); 
          }

          .editorial-scripture-footer { 
            background: ${softBg}; 
            padding: 18px 20px; 
            border-radius: 0 12px 12px 0; 
            border-left: 4px solid ${accentGold};
            margin-top: 36px; 
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .breadcrumb-wrapper { margin-top: 8%; padding-top: 10px; }
            .editorial-article-body { padding: 20px; border-radius: 16px; }
            .editorial-poster { height: 280px; }
            .timeline-card-node { flex-direction: column; gap: 6px; }
            .node-badge-year { align-self: flex-start; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default GroupDetail;
