import React, { useEffect } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Badge,
  ConfigProvider,
  Avatar,
  Space,
  Spin,
} from "antd";
import {
  ArrowRightOutlined,
  HeartOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import { getGroups } from "../api/groupApi";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const HoiDoan = () => {
  const navigate = useNavigate();
  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const [groups, setGroups] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      try {
        const res = await getGroups();
        console.log("res:::", res);

        // Cấu trúc dữ liệu dự phòng linh hoạt theo API của bạn
        const data = res.data?.data || res.data || [];
        setGroups(data);
      } catch (err) {
        console.log("GET GROUPS ERROR:", err);
      }
      setLoading(false);
    };

    fetchGroups();
    AOS.init({ duration: 1000, once: true });
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#fbf9f5",
        }}
      >
        <Spin style={{ fontSize: 42, color: primaryGold }} spin />
      </div>
    );
  }
  console.log(groups);

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: primaryGold, borderRadius: 16 } }}
    >
      <Layout className="hoidoan-modern-layout">
        {/* HERO HEADER MỚI: ĐỒNG BỘ PHONG CÁCH SANG TRỌNG */}
        <div className="modern-hero-section">
          <div className="hero-blur-backdrop" />
          <div className="hero-core-content" data-aos="fade-down">
            <Badge
              status="warning"
              text={
                <Text
                  style={{
                    color: primaryGold,
                    fontWeight: 700,
                    letterSpacing: "1.5px",
                  }}
                >
                  CỘNG ĐOÀN ĐỒNG QUAN
                </Text>
              }
              className="hero-badge"
            />
            <Title className="hero-title-main">HỘI ĐOÀN & ĐOÀN THỂ</Title>
            <div className="hero-accent-line" />
            <Paragraph className="hero-quote-script">
              "Vì ở đâu có hai ba người họp lại nhân danh Thầy, thì có Thầy ở
              đấy, giữa họ." <br />
              <span style={{ color: primaryGold, fontWeight: 600 }}>
                (Mt 18,20)
              </span>
            </Paragraph>
          </div>
        </div>

        <Content className="modern-content-wrapper">
          {/* TIÊU ĐỀ PHÂN ĐOẠN DANH SÁCH */}
          <div className="section-intro-block" data-aos="fade-up">
            <Title
              level={2}
              style={{ color: deepBrown, fontWeight: 800, margin: 0 }}
            >
              Thành Viên Trong Thân Thể Nhiệm Mầu
            </Title>
            <Paragraph
              type="secondary"
              style={{
                fontSize: 15,
                maxWidth: 650,
                margin: "12px auto 0 auto",
              }}
            >
              Mỗi đoàn thể mang một linh đạo và sứ mạng riêng biệt, tạo nên bức
              tranh đức tin sinh động, phong phú và tràn đầy sức sống Tin Mừng
              tại Giáo xứ.
            </Paragraph>
          </div>

          {/* BENTO GRID LAYOUT: ĐAN XÊN KÍCH THƯỚC LINH HOẠT THEO CHỈ SỐ INDEX */}
          <Row gutter={[24, 24]} className="bento-grid-container">
            {groups.map((group, index) => {
              // Biến đổi kích thước ô ngẫu nhiên xen kẽ tạo hiệu ứng Bento hiện đại
              // Ô đầu tiên hoặc ô chia hết cho 3 chiếm không gian rộng hơn (khắc phục lỗi cắt chữ đoạn mô tả dài)
              const isLargeCard = index % 3 === 0;
              const cardAccentColor = group.color || primaryGold;

              return (
                <Col
                  xs={24}
                  sm={24}
                  md={isLargeCard ? 24 : 12}
                  lg={isLargeCard ? 16 : 8}
                  key={group.id || index}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <Card
                    hoverable
                    className={`bento-card ${isLargeCard ? "card-wide" : "card-standard"}`}
                    onClick={() => navigate(`/hoi-doan/${group.slug}`)}
                    bodyStyle={{
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      {/* Thẻ Header thu nhỏ bên trong Card */}
                      <div className="bento-card-top">
                        <Space size={12}>
                          <Avatar
                            size={44}
                            style={{
                              backgroundColor: `${cardAccentColor}15`,
                              color: cardAccentColor,
                              border: `1px solid ${cardAccentColor}30`,
                            }}
                            icon={<HeartOutlined />}
                          />
                          <div>
                            <Title
                              level={4}
                              style={{
                                margin: 0,
                                color: "#2c2213",
                                fontWeight: 700,
                              }}
                            >
                              {group.name}
                            </Title>
                            {group.patron && (
                              <Text
                                type="secondary"
                                style={{
                                  fontSize: 12,
                                  color: cardAccentColor,
                                  fontWeight: 600,
                                }}
                              >
                                Bổn mạng: {group.patron}
                              </Text>
                            )}
                          </div>
                        </Space>

                        <Badge
                          count={`${group.members_count || 0} thành viên`}
                          style={{
                            backgroundColor: "#fdf8ee",
                            color: "#8c765c",
                            border: "1px solid #eedec5",
                            fontWeight: 600,
                          }}
                        />
                      </div>

                      {/* Khu vực ảnh bọc trong khung bo viền */}
                      <div
                        className="bento-image-wrapper"
                        style={{
                          backgroundImage: `url(${process.env.REACT_APP_API_URL || ""}${group.image})`,
                          borderLeft: `4px solid ${cardAccentColor}`,
                        }}
                      />

                      {/* Đoạn văn mô tả: Tự động co dãn dòng, hiển thị nhiều nội dung hơn */}
                      <Paragraph className="bento-description">
                        {group.description || group.desc}
                      </Paragraph>
                    </div>

                    <div className="bento-card-footer">
                      <div className="meta-founding">
                        <CompassOutlined style={{ color: "#a68f6f" }} />
                        <Text
                          type="secondary"
                          style={{ fontSize: 12, marginLeft: 6 }}
                        >
                          Thành lập: {group.founding_year || "---"}
                        </Text>
                      </div>
                      <Button
                        type="link"
                        icon={<ArrowRightOutlined />}
                        className="bento-action-link"
                        style={{ color: cardAccentColor }}
                      >
                        Khám phá chi tiết
                      </Button>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* KHỐI GIA NHẬP (CTA) TINH TẾ */}
          <div className="modern-cta-banner" data-aos="zoom-in">
            <div className="cta-inner-content">
              <Title
                level={3}
                style={{ color: "#ffffff", fontWeight: 700, margin: 0 }}
              >
                Bạn Đang Tìm Kiếm Một Môi Trường Sinh Hoạt?
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.85)",
                  fontSize: 15,
                  margin: "8px 0 24px 0",
                  maxWidth: 600,
                }}
              >
                Hãy cùng Ban Thanh Niên và các đoàn thể dấn thân hành trình phục
                vụ, chia sẻ yêu thương và làm chứng cho Tin Mừng.
              </Paragraph>
              <Button size="large" className="cta-button-light">
                GỬI PHIẾU ĐĂNG KÝ GIA NHẬP
              </Button>
            </div>
          </div>
        </Content>

        {/* PHÂN VÙNG CSS SCOPED HIỆN ĐẠI */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .hoidoan-modern-layout { background: #fbf9f5; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .modern-content-wrapper { max-width: 1300px; margin: 0 auto; padding: 0 24px 80px 24px; }
          
          /* Hero Section Style */
          .modern-hero-section {
            height: 380px;
            background-image: url('https://images.unsplash.com/photo-1438232992991-995b7058633e?auto=format&fit=crop&q=80&w=2000');
            background-position: center 35%;
            background-size: cover;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            margin-bottom: 60px;
          }
          .hero-blur-backdrop {
            position: absolute;
            inset: 0;
            background: linear-gradient(to bottom, rgba(44,34,19,0.7) 0%, rgba(251,249,245,1) 100%);
          }
          .hero-core-content { position: relative; z-index: 2; padding: 0 20px; }
          .hero-title-main { color: #2c2213 !important; font-size: clamp(28px, 4.5vw, 42px) !important; font-weight: 900 !important; letter-spacing: -0.5px; margin: 8px 0 0 0 !important; }
          .hero-accent-line { width: 60px; height: 3px; background: ${primaryGold}; margin: 16px auto; border-radius: 2px; }
          .hero-quote-script { font-size: 16px; font-style: italic; color: #5d4037; line-height: 1.6; }
          
          /* Section Intro */
          .section-intro-block { text-align: center; margin-bottom: 48px; }

          /* Bento Grid Cards System */
          .bento-grid-container { margin-bottom: 64px; }
          .bento-card {
            background: #ffffff;
            border: 1px solid #ebdcb9;
            box-shadow: 0 4px 20px rgba(93,64,55,0.02);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .bento-card:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 36px rgba(93,64,55,0.08);
            border-color: ${primaryGold};
          }
          .bento-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; width: 100%; }
          
          .bento-image-wrapper {
            height: 160px;
            background-size: cover;
            background-position: center;
            border-radius: 12px;
            margin-bottom: 20px;
            background-color: #f7f4ed;
          }
          .card-wide .bento-image-wrapper { height: 200px; } /* Ô lớn có ảnh cao rộng nhìn thoáng đãng hơn */

          .bento-description {
            color: #555555;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 24px;
            text-align: justify;
            display: -webkit-box;
            -webkit-line-clamp: 5; /* Cho phép hiển thị tới 5 dòng mô tả thay vì bị cắt quá cụt */
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .card-wide .bento-description { -webkit-line-clamp: 6; }

          .bento-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 16px;
            border-top: 1px dashed #f0ece2;
            margin-top: auto;
          }
          .meta-founding { display: flex; alignItems: center; }
          .bento-action-link { font-weight: 700; padding: 0; display: flex; align-items: center; gap: 4px; }

          /* Schedule Block Design */
          .modern-schedule-block {
            background: #ffffff;
            border: 1px solid #ebdcb9;
            border-radius: 24px;
            padding: 40px;
            margin-bottom: 64px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.01);
          }
          .icon-badge-box { background: ${primaryGold}; width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; boxShadow: 0 6px 16px rgba(179,145,100,0.3); }
          .schedule-timeline-wrapper { display: flex; flex-direction: column; gap: 14px; }
          
          .timeline-row-item {
            display: flex;
            align-items: center;
            padding: 18px 20px;
            background: #fbf9f5;
            border-radius: 14px;
            transition: background 0.2s ease;
          }
          .timeline-row-item:hover { background: #fdf5e8; }
          .timeline-badge-day { min-width: 110px; font-weight: 800; color: ${primaryGold}; font-size: 15px; }
          .timeline-body-content { flex: 1; padding-right: 16px; }
          .timeline-time-tag { background: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; color: #5d4037; display: flex; align-items: center; border: 1px solid #ebdcb9; }

          /* Call To Action Banner */
          .modern-cta-banner {
            background: linear-gradient(135deg, #3a2a18 0%, #5d4037 100%);
            padding: 50px 40px;
            border-radius: 24px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .modern-cta-banner::before {
            content: ''; position: absolute; top: -50%; left: -20%; width: 60%; height: 200%; background: rgba(179,145,100,0.1); transform: rotate(30deg); pointer-events: none;
          }
          .cta-inner-content { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; }
          .cta-button-light { background: #ffffff !important; border: none !important; color: #3a2a18 !important; font-weight: 700; height: 46px; padding: 0 32px; border-radius: 24px; transition: transform 0.2s; }
          .cta-button-light:hover { transform: scale(1.03); color: ${primaryGold} !important; }

          /* Responsive Breakpoints */
          @media (max-width: 768px) {
            .modern-hero-section { height: 320px; margin-bottom: 40px; }
            .modern-schedule-block { padding: 24px; }
            .timeline-row-item { flex-direction: column; align-items: flex-start; gap: 8px; }
            .timeline-badge-day { min-width: auto; }
            .modern-cta-banner { padding: 36px 20px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default HoiDoan;
