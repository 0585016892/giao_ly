import React, { useEffect } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Divider,
  Badge,
  ConfigProvider,
} from "antd";
import {
  TeamOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  StarFilled,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

const HoiDoan = () => {
  const navigate = useNavigate();
  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const groups = [
    {
      name: "Giới Trẻ",
      slug: "gioi-tre", // Thêm slug
      members: "80+",
      desc: "Nơi hội tụ sức trẻ, lòng nhiệt huyết và tinh thần phục vụ Tin Mừng qua các hoạt động thiện nguyện, sinh hoạt vòng tròn.",
      icon: <ThunderboltOutlined />,
      color: "#e67e22",
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Ca Đoàn",
      slug: "ca-doan", // Thêm slug
      members: "45+",
      desc: "Dùng lời ca tiếng hát để tôn vinh Thiên Chúa và giúp cộng đoàn sốt sắng hơn trong các thánh lễ hằng ngày.",
      icon: <StarFilled />,
      color: "#2980b9",
      image:
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Huynh Đoàn Đaminh",
      slug: "huynh-doan-da-minh", // Thêm slug
      members: "120+",
      desc: "Sống linh đạo Đaminh qua việc cầu nguyện, học hỏi lời Chúa và thực thi các việc đạo đức, bác ái.",
      icon: <HeartOutlined />,
      color: "#2c3e50",
      image:
        "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Hội Con Đức Mẹ",
      slug: "hoi-con-duc-me", // Thêm slug
      members: "60+",
      desc: "Noi gương Mẹ Maria trong sự khiêm nhường, vâng phục và siêng năng lần hạt Mân Côi cầu nguyện cho Giáo xứ.",
      icon: <TeamOutlined />,
      color: "#e74c3c",
      image:
        "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <Layout className="hoidoan-layout">
        {/* HERO SECTION */}
        <div className="hoidoan-hero">
          <div className="hoidoan-overlay" />
          <div className="hoidoan-hero-content" data-aos="zoom-in">
            <Title className="hoidoan-main-title">HỘI ĐOÀN & ĐOÀN THỂ</Title>
            <div className="hoidoan-divider" />
            <Paragraph className="hoidoan-hero-sub">
              "Vì ở đâu có hai ba người họp lại nhân danh Thầy, thì có Thầy ở
              đấy, giữa họ." (Mt 18,20)
            </Paragraph>
          </div>
        </div>

        <Content className="hoidoan-container">
          {/* GIỚI THIỆU CHUNG */}
          <section className="hoidoan-intro" data-aos="fade-up">
            <Row
              justify="center"
              style={{ textAlign: "center", marginBottom: 60 }}
            >
              <Col xs={24} md={16}>
                <Badge status="warning" text="HIỆP THÔNG & PHỤC VỤ" />
                <Title level={2} style={{ color: deepBrown, marginTop: 10 }}>
                  Sức Mạnh Từ Sự Hiệp Nhất
                </Title>
                <Paragraph style={{ fontSize: 16, color: "#666" }}>
                  Các hội đoàn tại Giáo xứ Đồng Quan không chỉ là nơi sinh hoạt
                  tôn giáo, mà còn là gia đình thứ hai để mỗi tín hữu cùng nhau
                  trưởng thành trong Đức tin và lan tỏa tình yêu thương.
                </Paragraph>
              </Col>
            </Row>
          </section>

          {/* DANH SÁCH HỘI ĐOÀN */}
          <Row gutter={[32, 32]}>
            {groups.map((group, index) => (
              <Col
                xs={24}
                md={12}
                lg={6}
                key={index}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Card
                  hoverable
                  className="group-card"
                  onClick={() => navigate(`/hoi-doan/${group.slug}`)}
                  cover={
                    <div
                      className="group-card-img"
                      style={{ backgroundImage: `url(${group.image})` }}
                    >
                      <div className="group-tag">
                        {group.icon} {group.name}
                      </div>
                    </div>
                  }
                >
                  <div className="group-stats">
                    <Text type="secondary">
                      <UsergroupAddOutlined /> {group.members} Thành viên
                    </Text>
                  </div>
                  <Paragraph className="group-desc">{group.desc}</Paragraph>
                  <Divider style={{ margin: "12px 0" }} />
                  <Button
                    type="link"
                    block
                    icon={<ArrowRightOutlined />}
                    className="group-btn"
                  >
                    TÌM HIỂU THÊM
                  </Button>
                </Card>
              </Col>
            ))}
          </Row>

          {/* LỊCH SINH HOẠT */}
          <section className="hoidoan-schedule" data-aos="fade-up">
            <Card className="schedule-card">
              <Row align="middle" gutter={[40, 20]}>
                <Col xs={24} md={8}>
                  <div className="schedule-info">
                    <CalendarOutlined
                      style={{ fontSize: 40, color: primaryGold }}
                    />
                    <Title
                      level={3}
                      style={{ color: deepBrown, margin: "15px 0" }}
                    >
                      Lịch Sinh Hoạt Chung
                    </Title>
                    <Text>
                      Các hội đoàn thường xuyên có các buổi gặp gỡ, học hỏi vào
                      cuối tuần sau Thánh lễ chiều.
                    </Text>
                    <br />
                    <Button
                      type="primary"
                      size="large"
                      style={{ marginTop: 20 }}
                    >
                      XEM LỊCH CHI TIẾT
                    </Button>
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  <div className="schedule-list">
                    {[
                      { day: "Thứ 7", event: "Tập hát Ca đoàn", time: "19:30" },
                      {
                        day: "Chúa Nhật",
                        event: "Sinh hoạt Giới trẻ",
                        time: "15:00",
                      },
                      {
                        day: "Mùng 5 hàng tháng",
                        event: "Lễ bổn mạng Huynh đoàn",
                        time: "18:00",
                      },
                    ].map((item, i) => (
                      <div className="schedule-item" key={i}>
                        <div className="item-day">{item.day}</div>
                        <div className="item-content">
                          <Text strong>{item.event}</Text>
                          <br />
                          <Text type="secondary">{item.time}</Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          </section>

          {/* CALL TO ACTION */}
          <div className="hoidoan-cta" data-aos="zoom-in">
            <Title level={2} style={{ color: "#fff" }}>
              Bạn muốn trở thành một phần của Giáo xứ?
            </Title>
            <Paragraph style={{ color: "rgba(255,255,255,0.8)", fontSize: 18 }}>
              Đừng ngần ngại đăng ký tham gia các hội đoàn để cùng nhau phục vụ
              Chúa và tha nhân.
            </Paragraph>
            <Button size="large" className="cta-btn">
              GIA NHẬP NGAY
            </Button>
          </div>
        </Content>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          .hoidoan-layout { background: #fdfaf5; }
          .hoidoan-container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
          
          /* Hero Section */
          .hoidoan-hero {
            height: 400px;
            background: url('https://images.unsplash.com/photo-1438232992991-995b7058633e?auto=format&fit=crop&q=80&w=2000') center/cover;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            text-align: center;
          }
          .hoidoan-overlay {
            position: absolute;
            inset: 0;
            background: rgba(0,0,0,0.5);
          }
          .hoidoan-hero-content { position: relative; z-index: 1; color: white; padding: 0 20px; }
          .hoidoan-main-title { 
            color: white !important; 
            font-size: clamp(32px, 5vw, 48px) !important; 
            font-weight: 800 !important;
            letter-spacing: 2px;
          }
          .hoidoan-divider {
            width: 80px;
            height: 4px;
            background: ${primaryGold};
            margin: 20px auto;
          }
          .hoidoan-hero-sub { font-size: 18px; font-style: italic; opacity: 0.9; }

          /* Group Cards */
          .group-card {
            border-radius: 16px;
            overflow: hidden;
            height: 100%;
            border: none;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          .group-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(179,145,100,0.15); }
          .group-card-img {
            height: 180px;
            background-size: cover;
            background-position: center;
            position: relative;
          }
          .group-tag {
            position: absolute;
            bottom: 15px;
            left: 15px;
            background: #fff;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: 700;
            color: ${deepBrown};
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .group-desc { height: 72px; overflow: hidden; margin-top: 15px; color: #666; }
          .group-btn { color: ${primaryGold} !important; font-weight: 700; }

          /* Schedule Section */
          .hoidoan-schedule { margin: 80px 0; }
          .schedule-card { border-radius: 24px; padding: 20px; border: 1px solid #f0ece2; }
          .schedule-list { display: flex; flex-direction: column; gap: 15px; }
          .schedule-item {
            display: flex;
            align-items: center;
            padding: 15px;
            background: #fdfaf5;
            border-radius: 12px;
            border-left: 5px solid ${primaryGold};
          }
          .item-day {
            min-width: 100px;
            font-weight: 800;
            color: ${primaryGold};
            font-size: 16px;
          }

          /* CTA Section */
          .hoidoan-cta {
            background: linear-gradient(135deg, ${primaryGold}, ${deepBrown});
            padding: 60px 40px;
            border-radius: 30px;
            text-align: center;
            color: white;
          }
          .cta-btn {
            background: white !important;
            border: none !important;
            color: ${deepBrown} !important;
            font-weight: 700;
            height: 50px;
            padding: 0 40px;
            border-radius: 25px;
            margin-top: 20px;
          }
          .cta-btn:hover { transform: scale(1.05); color: ${primaryGold} !important; }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .hoidoan-hero { height: 300px; }
            .hoidoan-cta { padding: 40px 20px; border-radius: 20px; }
            .group-card-img { height: 150px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default HoiDoan;
