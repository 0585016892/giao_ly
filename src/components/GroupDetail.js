import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Timeline,
  Divider,
  Space,
  Tag,
  Breadcrumb,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  FlagOutlined,
  MailOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Mẫu dữ liệu chi tiết (Thực tế bạn có thể đưa vào file data riêng hoặc gọi API)
const groupDetails = {
  "gioi-tre": {
    name: "Giới Trẻ Giáo Xứ",
    patron: "Thánh Gioan Bosco (31/01)",
    members: "85 thành viên",
    founding: "Thành lập năm 2005",
    desc: "Giới trẻ Đồng Quan là nơi kết nối những tâm hồn trẻ nhiệt huyết, cùng nhau thăng tiến trong đức tin và dấn thân phục vụ cộng đoàn thông qua các hoạt động bác ái và phụng vụ.",
    missions: [
      "Xây dựng đời sống đức tin vững mạnh cho giới trẻ.",
      "Tổ chức các chương trình thiện nguyện, thăm viếng người nghèo.",
      "Phát triển kỹ năng sống và tinh thần làm việc nhóm.",
      "Tham gia các hoạt động văn hóa, văn nghệ của Giáo xứ.",
    ],
    timeline: [
      {
        year: "2005",
        event: "Chính thức thành lập với 20 thành viên đầu tiên.",
      },
      {
        year: "2012",
        event:
          "Đại hội Giới trẻ Giáo hạt - Lần đầu tiên tổ chức tại Đồng Quan.",
      },
      {
        year: "2020",
        event:
          "Ra mắt Quỹ Bác ái Giới trẻ, hỗ trợ các hoàn cảnh khó khăn trong xã.",
      },
      {
        year: "2026",
        event: "Đạt mốc 85 thành viên chính thức sinh hoạt thường xuyên.",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200",
    color: "#e67e22",
  },
  "ca-doan": {
    name: "Ca Đoàn Tổng Hợp",
    patron: "Thánh Cecilia (22/11)",
    members: "45 thành viên",
    founding: "Thành lập năm 1990",
    desc: "Ca đoàn là tiếng nói của cộng đoàn dâng lên Thiên Chúa qua lời ca tiếng hát. Chúng tôi quy tụ những anh chị em yêu thích âm nhạc thánh ca, không phân biệt độ tuổi.",
    missions: [
      "Phục vụ hát lễ hằng ngày và các dịp đại lễ.",
      "Tập hát và học hỏi về nhạc lý thánh ca.",
      "Gắn kết tình huynh đệ giữa các thành viên qua âm nhạc.",
    ],
    timeline: [
      {
        year: "1990",
        event: "Thành lập ca đoàn với tên gọi sơ khai là Đội hát Đồng Quan.",
      },
      {
        year: "2000",
        event: "Ra mắt bộ đồng phục truyền thống màu trắng vàng.",
      },
      {
        year: "2023",
        event: "Tổ chức đêm nhạc Thánh ca 'Hương Trầm Cảm Tạ' kỷ niệm 33 năm.",
      },
    ],
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1200",
    color: "#2980b9",
  },
};

const GroupDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = groupDetails[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800 });
  }, [slug]);

  if (!data) {
    return (
      <Content style={{ padding: "100px 20px", textAlign: "center" }}>
        <Empty description="Không tìm thấy thông tin hội đoàn này" />
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/hoi-doan")}
          style={{ marginTop: 20 }}
        >
          Quay lại danh sách
        </Button>
      </Content>
    );
  }

  return (
    <Layout className="detail-layout">
      {/* HEADER BANNER */}
      <div
        className="detail-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${data.image})`,
        }}
      >
        <div className="detail-hero-content">
          <Breadcrumb
            className="detail-breadcrumb"
            items={[
              { title: <Link to="/">Trang chủ</Link> },
              { title: <Link to="/hoi-doan">Hội đoàn</Link> },
              { title: data.name },
            ]}
          />
          <Title className="detail-title">{data.name.toUpperCase()}</Title>
          <Space size="middle" wrap>
            <Tag color={data.color} icon={<FlagOutlined />}>
              Bổn mạng: {data.patron}
            </Tag>
            <Tag color="gold" icon={<TeamOutlined />}>
              {data.members}
            </Tag>
          </Space>
        </div>
      </div>

      <Content className="detail-container">
        <Row gutter={[40, 40]}>
          {/* CỘT TRÁI - NỘI DUNG CHÍNH */}
          <Col xs={24} lg={16}>
            <section className="detail-section" data-aos="fade-up">
              <Title level={3}>
                <CheckCircleOutlined style={{ color: data.color }} /> Giới thiệu
                chung
              </Title>
              <Paragraph className="detail-text">{data.desc}</Paragraph>
            </section>

            <Divider />

            <section className="detail-section" data-aos="fade-up">
              <Title level={3}>
                <FlagOutlined style={{ color: data.color }} /> Mục tiêu & Sứ
                mạng
              </Title>
              <ul className="mission-list">
                {data.missions.map((m, i) => (
                  <li key={i}>
                    <Text className="detail-text">{m}</Text>
                  </li>
                ))}
              </ul>
            </section>

            <Divider />

            <section className="detail-section" data-aos="fade-up">
              <Title level={3}>
                <CalendarOutlined style={{ color: data.color }} /> Hành trình
                phát triển
              </Title>
              <Timeline
                className="detail-timeline"
                items={data.timeline.map((item) => ({
                  label: (
                    <Text strong style={{ color: data.color }}>
                      {item.year}
                    </Text>
                  ),
                  children: item.event,
                }))}
              />
            </section>
          </Col>

          {/* CỘT PHẢI - THÔNG TIN PHỤ */}
          <Col xs={24} lg={8}>
            <Card className="sidebar-card" data-aos="fade-left">
              <Title level={4} style={{ marginBottom: 20 }}>
                Thông tin đăng ký
              </Title>
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="large"
              >
                <div className="info-item">
                  <EnvironmentOutlined className="info-icon" />
                  <div>
                    <Text type="secondary">Địa điểm sinh hoạt</Text>
                    <br />
                    <Text strong>Nhà mục vụ Giáo xứ</Text>
                  </div>
                </div>
                <div className="info-item">
                  <MailOutlined className="info-icon" />
                  <div>
                    <Text type="secondary">Liên hệ Ban thiếu nhi</Text>
                    <br />
                    <Text strong>dongquan.groups@gmail.com</Text>
                  </div>
                </div>
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{ backgroundColor: data.color, border: "none" }}
                >
                  ĐĂNG KÝ THAM GIA
                </Button>
                <Button
                  block
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate("/hoi-doan")}
                >
                  Quay về danh sách
                </Button>
              </Space>
            </Card>

            <Card className="sidebar-ad-card" style={{ marginTop: 24 }}>
              <Text italic>
                "Lúa chín đầy đồng, mà thợ gặt lại ít. Vậy anh em hãy xin chủ
                mùa gặt sai thợ ra gặt lúa về."
              </Text>
            </Card>
          </Col>
        </Row>
      </Content>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .detail-layout { background: #fff; min-height: 100vh; }
        
        /* Hero */
        .detail-hero { 
          height: 450px; 
          background-size: cover; 
          background-position: center; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          text-align: center;
          color: white;
          padding: 0 20px;
        }
        .detail-hero-content { max-width: 800px; z-index: 10; }
        .detail-breadcrumb { margin-bottom: 20px; }
        .detail-breadcrumb .ant-breadcrumb-link, 
        .detail-breadcrumb .ant-breadcrumb-separator { color: rgba(255,255,255,0.8) !important; }
        .detail-breadcrumb a { color: rgba(255,255,255,0.8) !important; }
        .detail-breadcrumb a:hover { color: #fff !important; }
        .detail-title { color: white !important; font-size: clamp(28px, 4vw, 42px) !important; font-weight: 800 !important; margin-bottom: 20px !important; }

        /* Container */
        .detail-container { max-width: 1200px; margin: 0 auto; padding: 60px 20px; }
        .detail-text { font-size: 16px; line-height: 1.8; color: #444; }
        
        /* Mission List */
        .mission-list { list-style: none; padding-left: 0; }
        .mission-list li { position: relative; padding-left: 25px; margin-bottom: 12px; }
        .mission-list li::before {
          content: '✔';
          position: absolute;
          left: 0;
          color: ${data?.color || "#b39164"};
          font-weight: bold;
        }

        /* Sidebar */
        .sidebar-card { border-radius: 16px; border: 1px solid #f0f0f0; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .info-item { display: flex; gap: 15px; margin-bottom: 10px; }
        .info-icon { font-size: 20px; color: ${data?.color || "#b39164"}; margin-top: 5px; }
        .sidebar-ad-card { background: #fdfaf5; border: none; border-left: 4px solid #b39164; border-radius: 8px; }

        .detail-timeline { margin-top: 30px; }

        @media (max-width: 768px) {
          .detail-hero { height: 350px; }
          .detail-container { padding: 40px 20px; }
        }
      `,
        }}
      />
    </Layout>
  );
};

export default GroupDetail;
