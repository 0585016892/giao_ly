import React, { useEffect } from "react";
import { Layout, Typography, Card, Row, Col, Divider } from "antd";
import {
  UserAddOutlined,
  BookOutlined,
  CalendarOutlined,
  FileDoneOutlined,
  MessageOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const steps = [
  {
    icon: <UserAddOutlined />,
    title: "Đăng ký tài khoản",
    description:
      "Học viên điền đầy đủ thông tin cá nhân theo hướng dẫn của giáo xứ.",
  },
  {
    icon: <BookOutlined />,
    title: "Tham gia khóa học",
    description: "Đọc các bài học và tài liệu được cung cấp trong hệ thống.",
  },
  {
    icon: <CalendarOutlined />,
    title: "Theo dõi lịch học",
    description:
      "Kiểm tra thời gian học, lịch kiểm tra và các thông báo mới nhất.",
  },
  {
    icon: <FileDoneOutlined />,
    title: "Hoàn thành bài kiểm tra",
    description: "Trả lời đầy đủ các câu hỏi theo quy định của khóa học.",
  },
  {
    icon: <MessageOutlined />,
    title: "Liên hệ hỗ trợ",
    description:
      "Trao đổi với ban giáo lý nếu gặp khó khăn trong quá trình học tập.",
  },
  {
    icon: <CheckCircleOutlined />,
    title: "Hoàn tất khóa học",
    description: "Hoàn thành chương trình học và nhận xác nhận từ giáo xứ.",
  },
];

const GuidePage = () => {
  useEffect(() => {
    document.title = "Hướng dẫn học | Giáo xứ Đồng Quan";
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <Content
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "50px 16px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 50 }}>
          <Title
            style={{
              color: "#1B365D",
              marginBottom: 10,
            }}
          >
            Hướng dẫn học tập
          </Title>

          <Paragraph
            style={{
              maxWidth: 700,
              margin: "0 auto",
              color: "#64748b",
            }}
          >
            Chào mừng bạn đến với chương trình Giáo lý Hôn nhân của Giáo xứ Đồng
            Quan. Hãy thực hiện lần lượt các bước dưới đây để hoàn thành khóa
            học.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {steps.map((item, index) => (
            <Col xs={24} md={12} lg={8} key={index}>
              <Card
                bordered={false}
                style={{
                  borderRadius: 18,
                  height: "100%",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                }}
              >
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: "#1B365D",
                    color: "#D4AF37",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    marginBottom: 20,
                  }}
                >
                  {item.icon}
                </div>

                <Text
                  strong
                  style={{
                    color: "#D4AF37",
                  }}
                >
                  BƯỚC {index + 1}
                </Text>

                <Title
                  level={4}
                  style={{
                    marginTop: 10,
                    color: "#1B365D",
                  }}
                >
                  {item.title}
                </Title>

                <Paragraph
                  style={{
                    color: "#64748b",
                    marginBottom: 0,
                  }}
                >
                  {item.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>

        <Divider />

        <Card
          bordered={false}
          style={{
            marginTop: 30,
            borderRadius: 18,
            background: "#ffffff",
          }}
        >
          <Title level={3}>Lưu ý quan trọng</Title>

          <ul
            style={{
              color: "#475569",
              lineHeight: 2,
            }}
          >
            <li>Thường xuyên kiểm tra thông báo mới nhất.</li>
            <li>Tham dự đầy đủ các buổi học theo quy định.</li>
            <li>Giữ thái độ nghiêm túc và tôn trọng mọi người.</li>
            <li>Không chia sẻ tài khoản cho người khác.</li>
            <li>Liên hệ giáo xứ khi cần được hỗ trợ.</li>
          </ul>
        </Card>
      </Content>
    </Layout>
  );
};

export default GuidePage;
