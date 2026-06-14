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
  Spin,
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

  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true });
  }, [slug]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getGroupDetail(slug);
        const detailData = res.data?.data || res.data;
        setGroup(detailData);
      } catch (err) {
        console.error("FETCH GROUP DETAIL ERROR:", err);
      }
      setLoading(false);
    };

    if (slug) {
      fetchDetail();
    }
  }, [slug]);

  // ================= ĐÃ LÀM LẠI: LOADING CĂN GIỮA TUYỆT ĐỐI TOÀN MÀN HÌNH =================
  if (loading) {
    return (
      <div className="detail-loading-screen">
        <Spin size="large" tip="Đang tải dữ liệu cộng đoàn..." />
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .detail-loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100vh;
            background: #fbf9f5;
          }
          .detail-loading-screen .ant-spin-text {
            color: #5d4037;
            font-weight: 600;
            margin-top: 16px;
            font-size: 14px;
          }
          .detail-loading-screen .ant-spin-dot-item {
            background-color: #b39164 !important;
          }
        `,
          }}
        />
      </div>
    );
  }

  if (!group) {
    return (
      <Content
        style={{
          padding: "120px 20px",
          textAlign: "center",
          background: "#fbf9f5",
          minHeight: "100vh",
        }}
      >
        <Empty description="Không tìm thấy dữ liệu chi tiết của hội đoàn này hoặc trang không tồn tại." />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/hoi-doan")}
          style={{
            marginTop: 24,
            background: primaryGold,
            borderColor: primaryGold,
          }}
        >
          Quay lại danh sách hội đoàn
        </Button>
      </Content>
    );
  }

  const themeColor = group.color || primaryGold;

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: themeColor, borderRadius: 16 } }}
    >
      <Layout className="modern-detail-layout">
        {/* THANH ĐIỀU HƯỚNG BREADCRUMB TINH TẾ */}
        <div className="breadcrumb-wrapper">
          <Breadcrumb
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/hoi-doan">Hội đoàn</Link> },
              {
                title: (
                  <Text strong style={{ color: themeColor }}>
                    {group.name}
                  </Text>
                ),
              },
            ]}
          />
        </div>

        <Content className="detail-main-content">
          <Row gutter={[40, 40]}>
            {/* CỘT TRÁI: BỘ KHUNG COVER ĐỨNG & SIDEBAR THÔNG TIN ĐĂNG KÝ */}
            <Col xs={24} lg={9} data-aos="fade-right">
              <div className="sticky-sidebar-container">
                {/* ẢNH COVER ĐỨNG PHONG CÁCH TẠP CHÍ */}
                <div
                  className="editorial-poster"
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_API_URL || ""}${group.image})`,
                    boxShadow: `0 20px 40px ${themeColor}15`,
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

                {/* THÈ ĐĂNG KÝ THAM GIA */}
                <Card bordered={false} className="registration-sidebar-card">
                  <Title
                    level={4}
                    style={{
                      color: deepBrown,
                      fontWeight: 700,
                      marginBottom: 20,
                    }}
                  >
                    Hành Trình Gắn Kết
                  </Title>
                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size="middle"
                  >
                    <div className="sidebar-info-row">
                      <div
                        className="info-icon-box"
                        style={{
                          background: `${themeColor}10`,
                          color: themeColor,
                        }}
                      >
                        <EnvironmentOutlined />
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Địa điểm sinh hoạt
                        </Text>
                        <br />
                        <Text strong style={{ color: "#2c2213" }}>
                          Nhà mục vụ Giáo xứ
                        </Text>
                      </div>
                    </div>

                    <div className="sidebar-info-row">
                      <div
                        className="info-icon-box"
                        style={{
                          background: `${themeColor}10`,
                          color: themeColor,
                        }}
                      >
                        <MailOutlined />
                      </div>
                      <div>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Hòm thư điều hành
                        </Text>
                        <br />
                        <Text strong style={{ color: "#2c2213" }}>
                          dongquan.groups@gmail.com
                        </Text>
                      </div>
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    <Button
                      type="primary"
                      block
                      size="large"
                      icon={<SendOutlined />}
                      className="submit-registration-btn"
                      style={{
                        background: themeColor,
                        borderColor: themeColor,
                      }}
                    >
                      ĐĂNG KÝ THAM GIA NGAY
                    </Button>

                    <Button
                      block
                      type="text"
                      icon={<ArrowLeftOutlined />}
                      onClick={() => navigate("/hoi-doan")}
                      style={{ color: "#8c765c" }}
                    >
                      Quay về danh sách
                    </Button>
                  </Space>
                </Card>
              </div>
            </Col>

            {/* CỘT PHẢI: KHÔNG GIAN NỘI DUNG TYPOGRAPHY & TIMELINE CHI TIẾT */}
            <Col xs={24} lg={15} data-aos="fade-up">
              <div className="editorial-article-body">
                {/* KHỐI TIÊU ĐỀ CHÍNH */}
                <div className="article-header">
                  {group.patron && (
                    <span
                      className="patron-sub-title"
                      style={{ color: themeColor }}
                    >
                      <SafetyCertificateOutlined style={{ marginRight: 6 }} />
                      Hội Đoàn Bổn Mạng: {group.patron}
                    </span>
                  )}
                  <Title level={1} className="article-main-title">
                    {group.name}
                  </Title>
                  <div
                    className="article-title-bar"
                    style={{ backgroundColor: themeColor }}
                  />
                </div>

                {/* GIỚI THIỆU CHI TIẾT */}
                <div className="article-content-segment">
                  {/* Hỗ trợ hiển thị rich text sinh động nếu dữ liệu chứa HTML */}
                  {group.description && group.description.startsWith("<") ? (
                    <div
                      className="paragraph-rich-text html-content"
                      dangerouslySetInnerHTML={{ __html: group.description }}
                    />
                  ) : (
                    <Paragraph className="paragraph-rich-text">
                      {group.description || group.desc}
                    </Paragraph>
                  )}
                </div>

                {/* MỤC TIÊU SỨ MẠNG */}
                {group.missions && group.missions.length > 0 && (
                  <>
                    <Divider style={{ borderColor: "#ebdcb9" }} />
                    <div className="article-content-segment">
                      <Title
                        level={3}
                        style={{
                          color: deepBrown,
                          fontWeight: 700,
                          marginBottom: 20,
                        }}
                      >
                        <FlagOutlined
                          style={{ color: themeColor, marginRight: 10 }}
                        />{" "}
                        Mục Tiêu & Sứ Mạng
                      </Title>
                      <ul className="custom-editorial-list">
                        {group.missions.map((mission, index) => (
                          <li
                            key={index}
                            style={{ "--bullet-color": themeColor }}
                          >
                            <Text style={{ fontSize: 16, color: "#444" }}>
                              {mission}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {/* HÀNH TRÌNH PHÁT TRIỂN DẠNG CARD TIMELINE */}
                {group.timeline && group.timeline.length > 0 && (
                  <>
                    <Divider style={{ borderColor: "#ebdcb9" }} />
                    <div className="article-content-segment">
                      <Title
                        level={3}
                        style={{
                          color: deepBrown,
                          fontWeight: 700,
                          marginBottom: 24,
                        }}
                      >
                        <CalendarOutlined
                          style={{ color: themeColor, marginRight: 10 }}
                        />{" "}
                        Dấu Ấn Hành Trình
                      </Title>

                      <div className="modern-cards-timeline">
                        {group.timeline.map((item, idx) => (
                          <div className="timeline-card-node" key={idx}>
                            <div
                              className="node-badge-year"
                              style={{
                                background: `${themeColor}15`,
                                color: themeColor,
                              }}
                            >
                              {item.year}
                            </div>
                            <div className="node-card-body">
                              <Text
                                style={{
                                  fontSize: 15,
                                  color: "#3a2a18",
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

                {/* ĐOẠN KẾT - LỜI TRÍCH KINH THÁNH */}
                <div
                  className="editorial-scripture-footer"
                  style={{ borderLeft: `4px solid ${themeColor}` }}
                >
                  <Text
                    italic
                    style={{ color: "#7a6a53", fontSize: 15, display: "block" }}
                  >
                    "Lúa chín đầy đồng, mà thợ gặt lại ít. Vậy anh em hãy xin
                    chủ mùa gặt sai thợ ra gặt lúa về." (Mt 9,37-38)
                  </Text>
                </div>
              </div>
            </Col>
          </Row>
        </Content>

        {/* CSS SCOPED PHONG CÁCH TẠP CHÍ SANG TRỌNG */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .modern-detail-layout { background: #fbf9f5; min-height: 100vh; padding-bottom: 80px; }
          
          .breadcrumb-wrapper { max-width: 1240px; margin: 0 auto; padding: 24px 24px 12px 24px; }
          .detail-main-content { max-width: 1240px; margin: 0 auto; padding: 0 24px; }

          /* Sticky Sidebar Left */
          .sticky-sidebar-container { position: sticky; top: 24px; }
          
          .editorial-poster {
            height: 480px;
            background-size: cover;
            background-position: center;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            margin-bottom: 24px;
            background-color: #f5f2eb;
          }
          .poster-gradient-shading {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(44,34,19,0.7) 100%);
          }
          .poster-floating-tags { position: absolute; bottom: 20px; left: 20px; right: 20px; display: flex; gap: 10px; flex-wrap: wrap; }
          .glass-tag { background: rgba(255, 255, 255, 0.2) !important; backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.3) !important; color: #ffffff !important; font-weight: 600; padding: 4px 12px; border-radius: 8px; }

          .registration-sidebar-card { background: #ffffff; border: 1px solid #ebdcb9; box-shadow: 0 4px 24px rgba(93,64,55,0.02); }
          .sidebar-info-row { display: flex; align-items: center; gap: 14px; }
          .info-icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
          .submit-registration-btn { font-weight: 700; height: 46px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

          /* Editorial Article Right */
          .editorial-article-body { background: #ffffff; border: 1px solid #ebdcb9; border-radius: 24px; padding: 48px; box-shadow: 0 4px 30px rgba(93,64,55,0.02); }
          
          .article-header { margin-bottom: 32px; }
          .patron-sub-title { font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
          .article-main-title { color: #2c2213 !important; font-weight: 800 !important; font-size: clamp(24px, 4.5vw, 36px) !important; margin: 0 0 16px 0 !important; letter-spacing: -0.5px; }
          .article-title-bar { width: 50px; height: 4px; border-radius: 2px; }

          .paragraph-rich-text { font-size: 16px; line-height: 1.85; color: #444444; text-align: justify; white-space: pre-line; }
          .paragraph-rich-text p { margin-bottom: 16px; }

          /* Custom List */
          .custom-editorial-list { list-style: none; padding-left: 0; margin: 0; }
          .custom-editorial-list li { position: relative; padding-left: 28px; margin-bottom: 16px; }
          .custom-editorial-list li::before { content: '✦'; position: absolute; left: 0; top: 0; color: var(--bullet-color); font-size: 16px; }

          /* Modern Cards Timeline */
          .modern-cards-timeline { display: flex; flex-direction: column; gap: 16px; margin-top: 20px; }
          .timeline-card-node { display: flex; gap: 16px; align-items: flex-start; }
          .node-badge-year { font-weight: 800; font-size: 14px; padding: 6px 14px; border-radius: 10px; min-width: 75px; text-align: center; }
          .node-card-body { flex: 1; background: #fbf9f5; padding: 14px 20px; border-radius: 12px; border: 1px solid #f0ece2; }

          .editorial-scripture-footer { background: #faf7f2; padding: 20px 24px; border-radius: 0 12px 12px 0; margin-top: 40px; }

          /* Mobile Responsive */
          @media (max-width: 1024px) {
            .sticky-sidebar-container { position: relative; top: 0; }
          }
          @media (max-width: 768px) {
            .editorial-article-body { padding: 24px; border-radius: 16px; }
            .editorial-poster { height: 300px; }
            .timeline-card-node { flex-direction: column; gap: 8px; }
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
