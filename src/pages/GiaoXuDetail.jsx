import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Divider,
  Tag,
  Timeline,
  List,
  Avatar,
  Button,
  Tabs,
  Table,
  Alert,
  Modal,
  ConfigProvider,
} from "antd";
import {
  EnvironmentOutlined,
  HistoryOutlined,
  UserOutlined,
  TeamOutlined,
  StarOutlined,
  ClockCircleOutlined,
  BankOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowRightOutlined,
  CompassOutlined,
  SendOutlined,
  BookOutlined,
} from "@ant-design/icons";

import Logo1 from "../assets/images/anhnhatho.jpg";

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

// Bảng màu thiết kế Tôn Nghiêm (Editorial Sacred Palette)
const primaryNavy = "#1B365D"; // Xanh Đêm Navy
const accentGold = "#D4AF37"; // Vàng Đồng
const textDark = "#1E293B";
const softBg = "#FAFAFA";

const GiaoXuDongQuanFull = () => {
  useEffect(() => {
    document.title = "Thông Tin Giáo Xứ Đồng Quan | Giáo Phận Thái Bình";
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHo, setSelectedHo] = useState(null);

  const showModal = (ho) => {
    setSelectedHo(ho);
    setIsModalOpen(true);
  };

  // 1. DỮ LIỆU CƠ BẢN GIÁO XỨ
  const parishData = {
    name: "GIÁO XỨ ĐỒNG QUAN",
    diocese: "Thái Bình",
    deanery: "Kiến Xương",
    established: "1911",
    patron: "Đức Mẹ Hồn Xác Lên Trời (15/08)",
    priest: "Cha Jos Vũ Văn Chiều",
    address: "Thôn Đồng Tâm, xã Vũ Quý, tỉnh Hưng Yên",
    population: "1.304 tín hữu",
    phone: "093 384 84 83",
    email: "dongquan@thaibinhdiocese.org",
    subParishes: [
      {
        name: "Họ Kinh Nhuế",
        members: 125,
        patron: "Thánh Phaolô trở lại (25/01) & Thánh Antôn (13/06)",
        address: "Thôn Đoài, xã Hòa Bình, huyện Kiến Xương, Thái Bình",
        distance: "Cách nhà xứ 700m về hướng Đông Nam",
        established: "1923",
        evangelized: "Đầu thế kỷ XX",
        currentChurch: "2004",
        history: [
          {
            year: "1920",
            event:
              "3 gia đình đầu tiên được Rửa tội, nhận thánh Phaolô làm bổn mạng.",
          },
          {
            year: "1923",
            event: "Dựng nhà nguyện lợp rạ, tên gọi ban đầu là Giáo Tụ Lý Kế.",
          },
          {
            year: "1938",
            event: "Nhà thờ bị đốt cháy; thêm 4 gia đình xin theo đạo.",
          },
          {
            year: "Sau đó",
            event:
              "Hoàn thành nhà thờ lợp ngói 5 gian; đổi tên thành Kinh Nhuế.",
          },
          {
            year: "1960",
            event: "Sáp nhập 5 gia đình từ Giáo họ Cánh Sẻ vào Kinh Nhuế.",
          },
          {
            year: "2004",
            event:
              "Khởi công xây dựng nhà thờ mới diện tích 650m2 nhờ sự giúp đỡ của gia đình cụ Phaolô Lương Đức Thiện (Hoa Kỳ).",
          },
          {
            year: "2005",
            event:
              "Đức cha Phanxicô Xaviê Nguyễn Văn Sang cắt băng khánh thành nhà thờ (05/04).",
          },
        ],
        organization:
          "Ban Ca đoàn, hội con Đức Mẹ, hội Gia trưởng... đang nỗ lực hòa nhịp sinh hoạt cùng Giáo xứ.",
      },
      {
        name: "Họ Phụng Thượng",
        members: 23,
        patron: "Sinh Nhật Đức Mẹ (08/09)",
        address: "Xã Vũ An, huyện Kiến Xương, Thái Bình",
        distance: "Cách nhà xứ 1km về hướng Tây Bắc",
        established: "1802",
        evangelized: "Cuối thế kỷ XVIII",
        currentChurch: "2003",
        history: [
          { year: "1802", event: "Chính thức thành lập Giáo họ." },
          { year: "1836", event: "Xây dựng ngôi nhà thờ đầu tiên." },
          {
            year: "1906",
            event: "Trùng tu nhà thờ bằng gỗ lim diện tích 200m2.",
          },
          {
            year: "1986",
            event:
              "Cơn bão phá đổ hoàn toàn nhà thờ; giáo dân dựng lại nhà thờ tạm 3 gian.",
          },
          {
            year: "1992",
            event:
              "Giáo họ được tái lập thuộc giáo xứ Đồng Quan thời cha Tôma Trần Trung Hà.",
          },
          {
            year: "2003",
            event: "Khởi công xây dựng nhà thờ mới với tháp cao 25m.",
          },
          {
            year: "2011",
            event:
              "Đức Cha Phêrô Nguyễn Văn Đệ cắt băng khánh thành ngôi nhà thờ mới (08/09).",
          },
        ],
        organization:
          "Vì nhân danh ít nên ông trùm phụ trách chung; các hội đoàn sinh hoạt chung với họ Nhà Xứ.",
      },
      {
        name: "Họ Việt Hưng",
        members: 43,
        patron: "Thánh Vinhsơn (05/04)",
        address: "Thôn Đề Thái, xã Hòa Bình, huyện Kiến Xương, Thái Bình",
        distance: "Cách nhà xứ 1km về hướng Đông Nam",
        established: "1937",
        evangelized: "Đầu thế kỷ XX",
        currentChurch: "2000",
        history: [
          {
            year: "1937",
            event:
              "Thành lập giáo họ với tên gọi Bặt Trung (5 gia đình), chưa có nhà thờ.",
          },
          {
            year: "1940",
            event: "Xây dựng ngôi nhà thờ 5 gian bằng tre lợp lá.",
          },
          {
            year: "1954",
            event:
              "Biến cố chiến tranh, giáo họ chỉ còn 3 hộ gia đình với 11 tín hữu.",
          },
          {
            year: "1991",
            event:
              "Đổi tên thành Việt Hưng và chính thức nhập về xứ Đồng Quan.",
          },
          {
            year: "2000",
            event:
              "Khởi công xây dựng nhà thờ mới (dài 17,5m, rộng 7m, tháp cao 17m).",
          },
          { year: "2001", event: "Khánh thành nhà thờ vào ngày 03/10." },
          {
            year: "2013",
            event: "Đón Đức cha Phêrô thăm mục vụ hành trình Mùa Chay.",
          },
        ],
        organization:
          "Huynh đoàn Đaminh, ban Ca, hội Con Đức Mẹ hoạt động tích cực trong tinh thần hiệp thông.",
      },
    ],
  };

  // 2. GIỜ LỄ MỤC VỤ
  const massColumns = [
    {
      title: "Thứ",
      dataIndex: "day",
      key: "day",
      width: "15%",
      render: (text) => (
        <Text strong style={{ color: primaryNavy }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Địa điểm cử hành",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <Space>
          <BankOutlined style={{ color: accentGold }} />
          <span style={{ fontWeight: 600, color: textDark }}>{text}</span>
        </Space>
      ),
    },
    {
      title: "Giờ lễ",
      dataIndex: "time",
      key: "time",
      width: "15%",
      align: "center",
      render: (t) => (
        <Tag color="gold" className="gold-session-tag">
          {t}
        </Tag>
      ),
    },
    {
      title: "Ý lễ / Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (n) => (
        <Text type="secondary" italic style={{ fontSize: 13 }}>
          {n}
        </Text>
      ),
    },
  ];

  const massData = [
    {
      key: "1",
      day: "Thứ Hai",
      location: "Nhà thờ Đồng Quan",
      time: "05:00",
      note: "Lễ sáng thường nhật",
    },
    {
      key: "2",
      day: "Thứ Ba",
      location: "Họ Kinh Nhuế",
      time: "18:00",
      note: "Cha xứ dâng lễ mục vụ",
    },
    {
      key: "3",
      day: "Thứ Tư",
      location: "Nhà thờ Đồng Quan",
      time: "05:00",
      note: "Lễ sáng thường nhật",
    },
    {
      key: "4",
      day: "Thứ Năm",
      location: "Họ Phụng Thượng",
      time: "18:00",
      note: "Lễ chiều",
    },
    {
      key: "5",
      day: "Thứ Sáu",
      location: "Nhà thờ Đồng Quan",
      time: "18:30",
      note: "Kính Lòng Chúa Thương Xót",
    },
    {
      key: "6",
      day: "Thứ Bảy",
      location: "Họ Việt Hưng",
      time: "17:30",
      note: "Lễ thay Chúa Nhật",
    },
    {
      key: "7",
      day: "Chúa Nhật",
      location: "Nhà thờ Đồng Quan",
      time: "05:30",
      note: "Lễ sáng thiếu nhi",
    },
    {
      key: "8",
      day: "Chúa Nhật",
      location: "Nhà thờ Đồng Quan",
      time: "08:00",
      note: "Lễ Đại Triều toàn xứ",
    },
    {
      key: "9",
      day: "Chúa Nhật",
      location: "Nhà thờ Đồng Quan",
      time: "16:30",
      note: "Lễ chiều",
    },
  ];

  const columnsLM = [
    {
      title: "Linh mục quản xứ",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Space>
          <UserOutlined
            style={{ color: record.isCurrent ? accentGold : primaryNavy }}
          />
          <Text
            strong
            style={{
              color: record.isCurrent ? primaryNavy : textDark,
              fontSize: 14,
            }}
          >
            {text}
          </Text>
          {record.isCurrent && (
            <Tag color="red" style={{ fontWeight: 700, borderRadius: 10 }}>
              ĐANG ĐƯƠNG NHỆM
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Nhiệm kỳ mục vụ",
      dataIndex: "period",
      key: "period",
      align: "right",
      render: (text) => (
        <Text strong style={{ color: accentGold, fontFamily: "monospace" }}>
          {text}
        </Text>
      ),
    },
  ];

  const dataLM = [
    { key: "1", name: "Cha Giuse Toàn", period: "—" },
    { key: "2", name: "Cha Đaminh Thức", period: "1925" },
    { key: "3", name: "Cha Đaminh Phạm Hữu Quang", period: "—" },
    { key: "4", name: "Cha Gioan B. Trần Du Đồng", period: "—" },
    { key: "5", name: "Cha Đaminh Mưu", period: "—" },
    { key: "6", name: "Cha Giuse Phạm Kim Bảng", period: "—" },
    { key: "7", name: "Cha Micae Tung", period: "—" },
    { key: "8", name: "Cha Vinhsơn Thái", period: "—" },
    { key: "9", name: "Cha Đaminh An", period: "—" },
    { key: "10", name: "Cha Đaminh Đỉnh", period: "1955" },
    { key: "11", name: "Cha Giêrônimô Nguyễn Văn Đạo", period: "1973 - 1977" },
    { key: "12", name: "Cha Giuse Nguyễn Quang Phục", period: "1977 - 1991" },
    { key: "13", name: "Cha Tôma Aq. Trần Trung Hà", period: "1991 - 1994" },
    { key: "14", name: "Cha Giuse Nguyễn Thành Hiến", period: "1994 - 1996" },
    {
      key: "15",
      name: "Cha Phanxicô Ass. Nguyễn Tiến Tám",
      period: "1996 - 2006",
    },
    { key: "16", name: "Cha Gioan B. Nguyễn Sơn Hải", period: "2006 - 2010" },
    { key: "17", name: "Cha Giuse Đinh Xuân Ngọc", period: "2010 - 2014" },
    { key: "18", name: "Cha Đaminh Trương Văn Thụy", period: "—" },
    { key: "19", name: "Cha Giuse Hà Đăng Oánh", period: "—" },
    {
      key: "20",
      name: "Cha Giuse Vũ Văn Chiều",
      period: "Hiện nay",
      isCurrent: true,
    },
  ];

  const tabItems = [
    {
      key: "intro",
      label: (
        <span>
          <InfoCircleOutlined /> LỊCH SỬ & ĐỊA LÝ
        </span>
      ),
      children: (
        <div style={{ padding: "12px 0" }}>
          <Title level={4} className="tab-section-title">
            <EnvironmentOutlined
              style={{ color: accentGold, marginRight: 8 }}
            />
            I. VỊ TRÍ ĐỊA LÝ & DIỆN TÍCH MỤC VỤ
          </Title>
          <Paragraph className="tab-content-text">
            Giáo xứ Đồng Quan nằm cách <b>Tòa Giám Mục Thái Bình khoảng 7km</b>{" "}
            về phía Đông Nam, phía Tây Bắc giáp với làng Đồng Sách. Con sông
            Hoàng Giang hiền hòa chia cắt 2 cánh đồng của làng Đồng Quan với
            làng Luật Trung và làng Luật Nội.
          </Paragraph>

          <Divider />

          <Title level={4} className="tab-section-title">
            <HistoryOutlined style={{ color: accentGold, marginRight: 8 }} />
            II. HÀNH TRÌNH HÌNH THÀNH & PHÁT TRIỂN
          </Title>

          <Timeline
            mode="left"
            className="editorial-timeline"
            items={[
              {
                label: (
                  <Text strong className="timeline-year">
                    1745
                  </Text>
                ),
                children:
                  "Hạt giống Đức Tin nảy mầm qua hai cụ Tuần Lương và Huyện Kiêm.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    1752
                  </Text>
                ),
                children:
                  "Ngôi nhà thờ bằng gỗ lợp lá đầu tiên được tiền nhân kiến tạo.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    1888
                  </Text>
                ),
                children:
                  "Giáo xứ Thân Thượng thành lập, giáo họ Đồng Quan chuyển trực thuộc về xứ mới.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    1889
                  </Text>
                ),
                children:
                  "Số lượng tín hữu ngày một đông nên nhà thờ được đại trùng tu rộng rãi hơn.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    1911
                  </Text>
                ),
                children:
                  "Đức cha Phêrô Munagorri Trung chính thức nâng Giáo họ lên hàng GIÁO XỨ.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    1997
                  </Text>
                ),
                children:
                  "Đức cha Phanxicô Xaviê Nguyễn Văn Sang cho phép khởi công nhà thờ mới bề thế, khánh thành ngày 21/11/2000.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    2003
                  </Text>
                ),
                children:
                  "Khởi công xây dựng nhà xứ rộng 350m2. Đến năm 2011, hoàn thiện 4 đài ngắm xung quanh.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    2006
                  </Text>
                ),
                children:
                  "Thời kỳ hồi sinh: Đón Cha Gioan B. Nguyễn Sơn Hải về trực tiếp coi sóc sau 50 năm trống tòa.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    2012
                  </Text>
                ),
                children:
                  "Trọng thể cử hành Đại lễ Tạ Ơn Kỷ niệm 100 Năm Thành Lập Giáo Xứ.",
              },
              {
                label: (
                  <Text strong className="timeline-year">
                    2014
                  </Text>
                ),
                children:
                  "Giáo họ Luật Nội được chuyển từ xứ Đồng Quan về xứ Truyền Tin.",
              },
            ]}
          />
        </div>
      ),
    },
    {
      key: "mass",
      label: (
        <span>
          <ClockCircleOutlined /> LỊCH PHỤNG VỤ GIỜ LỄ
        </span>
      ),
      children: (
        <div style={{ padding: "12px 0" }}>
          <Alert
            message="Thông báo mục vụ:"
            description="Giờ lễ có thể thay đổi vào các dịp Đại Lễ Phụng Vụ hoặc theo thông báo trực tiếp từ Cha Quản xứ."
            type="info"
            showIcon
            style={{
              marginBottom: 16,
              borderRadius: 12,
              background: "#fffdf5",
              border: `1px solid ${accentGold}`,
            }}
          />
          <Table
            columns={massColumns}
            dataSource={massData}
            pagination={false}
            bordered={false}
            size="small"
            className="custom-admin-table"
          />
        </div>
      ),
    },
    {
      key: "org",
      label: (
        <span>
          <TeamOutlined /> ƠN GỌI & HÀNG GIÁO SĨ
        </span>
      ),
      children: (
        <div style={{ padding: "12px 0" }}>
          <div className="call-god-box">
            <Title
              level={5}
              style={{ color: primaryNavy, margin: 0, fontWeight: 700 }}
            >
              <BookOutlined style={{ color: accentGold, marginRight: 6 }} />
              ƠN GỌI TIÊU BIỂU CỦA GIÁO XỨ:
            </Title>
            <Paragraph
              style={{
                margin: "8px 0 0 0",
                color: textDark,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              Đồng Quan vinh dự là quê hương của{" "}
              <b>Cha Bề Trên Đaminh Trần Đình Thủ</b> (1906 – 2007) — Đấng Sáng
              Lập Dòng Đồng Công (nay là Dòng Mẹ Chúa Cứu Chuộc). Ngoài ra, Giáo
              xứ còn đóng góp nhiều Linh mục, Tu sĩ đang dâng hiến phục vụ Giáo
              hội khắp mọi nơi.
            </Paragraph>
          </div>

          <Divider orientation="left" style={{ borderColor: accentGold }}>
            <Text style={{ color: primaryNavy, fontWeight: 700, fontSize: 13 }}>
              CÁC LINH MỤC PHỤ TRÁCH QUA CÁC THỜI KỲ
            </Text>
          </Divider>

          <Table
            columns={columnsLM}
            dataSource={dataLM}
            pagination={{ pageSize: 8, hideOnSinglePage: true }}
            size="middle"
            className="custom-admin-table"
          />
        </div>
      ),
    },
    {
      key: "hoxu",
      label: (
        <span>
          <BankOutlined /> DANH MỤC GIÁO HỌ
        </span>
      ),
      children: (
        <Row gutter={[16, 16]} style={{ padding: "12px 0" }}>
          {parishData.subParishes.map((ho, idx) => (
            <Col xs={24} sm={12} key={idx}>
              <Card
                hoverable
                className="subparish-editorial-card"
                onClick={() => showModal(ho)}
              >
                <div className="subparish-header">
                  <Title
                    level={5}
                    style={{
                      margin: 0,
                      color: primaryNavy,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {ho.name.toUpperCase()}
                  </Title>
                  <Tag className="members-count-pill">{ho.members} tín hữu</Tag>
                </div>

                <Space
                  direction="vertical"
                  size={4}
                  style={{ width: "100%", marginTop: 10 }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <EnvironmentOutlined style={{ color: primaryNavy }} />{" "}
                    {ho.address}
                  </Text>
                  <Text strong style={{ color: primaryNavy, fontSize: 12 }}>
                    <StarOutlined style={{ color: accentGold }} /> Bổn mạng:{" "}
                    {ho.patron}
                  </Text>
                </Space>

                <div className="subparish-footer">
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Khánh thành: {ho.currentChurch}
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    icon={<ArrowRightOutlined />}
                    style={{ color: primaryNavy, fontWeight: 700 }}
                  >
                    Chi tiết
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ),
    },
  ];

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
      <Layout className="editorial-parish-layout">
        {/* HERO BANNER SECTION */}
        <div
          className="hero-editorial-banner"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(27, 54, 93, 0.4), rgba(27, 54, 93, 0.85)), url(${Logo1})`,
          }}
        >
          <div className="hero-editorial-container">
            <span className="sacred-hero-badge">
              <CompassOutlined /> GIÁO PHẬN {parishData.diocese.toUpperCase()} —
              HẠT {parishData.deanery.toUpperCase()}
            </span>

            <Title level={1} className="hero-parish-title">
              {parishData.name}
            </Title>

            <div className="hero-parish-subtitle">
              <EnvironmentOutlined style={{ color: accentGold }} />{" "}
              {parishData.address}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT CONTAINER */}
        <Content className="main-editorial-content">
          <Row gutter={[24, 24]}>
            {/* CỘT TRÁI: KHU VỰC TABS THÔNG TIN CHÍNH */}
            <Col xs={24} lg={16}>
              <Card bordered={false} className="editorial-main-card">
                <Tabs
                  defaultActiveKey="intro"
                  items={tabItems}
                  size="large"
                  className="editorial-custom-tabs"
                />
              </Card>
            </Col>

            {/* CỘT PHẢI: LINH MỤC, LIÊN HỆ & BẢN ĐỒ */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: "100%" }} size={24}>
                {/* LINH MỤC CHÁNH XỨ CARD */}
                <Card bordered={false} className="priest-profile-card">
                  <div className="priest-avatar-box">
                    <Avatar
                      size={96}
                      icon={<UserOutlined />}
                      className="priest-main-avatar"
                    />
                  </div>

                  <Title level={4} className="priest-name-title">
                    {parishData.priest}
                  </Title>
                  <Text className="priest-role-tag">LINH MỤC CHÁNH XỨ</Text>

                  <Divider style={{ margin: "16px 0" }} />

                  <List size="small" className="priest-info-list">
                    <List.Item>
                      <Space>
                        <BankOutlined style={{ color: primaryNavy }} />
                        <Text strong style={{ color: primaryNavy }}>
                          Giáo hạt:
                        </Text>
                        <span>{parishData.deanery}</span>
                      </Space>
                    </List.Item>

                    <List.Item>
                      <Space>
                        <StarOutlined style={{ color: accentGold }} />
                        <Text strong style={{ color: primaryNavy }}>
                          Quan thầy:
                        </Text>
                        <span>{parishData.patron}</span>
                      </Space>
                    </List.Item>

                    <List.Item>
                      <Space>
                        <TeamOutlined style={{ color: primaryNavy }} />
                        <Text strong style={{ color: primaryNavy }}>
                          Dân số:
                        </Text>
                        <span>{parishData.population}</span>
                      </Space>
                    </List.Item>

                    <List.Item>
                      <Space>
                        <PhoneOutlined style={{ color: primaryNavy }} />
                        <Text strong style={{ color: primaryNavy }}>
                          Điện thoại:
                        </Text>
                        <span>{parishData.phone}</span>
                      </Space>
                    </List.Item>
                  </List>
                </Card>

                {/* LIÊN HỆ & MỤC VỤ CARD */}
                <Card bordered={false} className="contact-action-card">
                  <Title
                    level={5}
                    style={{
                      color: "#ffffff",
                      margin: 0,
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    <MailOutlined
                      style={{ color: accentGold, marginRight: 8 }}
                    />
                    LIÊN HỆ MỤC VỤ & XIN Ý LỄ
                  </Title>

                  <Paragraph
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: 13,
                      margin: "10px 0 16px 0",
                    }}
                  >
                    Địa chỉ Email văn phòng Giáo xứ: <br />
                    <b style={{ color: accentGold }}>{parishData.email}</b>
                  </Paragraph>

                  <Button
                    type="primary"
                    block
                    icon={<SendOutlined />}
                    className="online-mass-btn"
                  >
                    GỬI Ý CẦU NGUYỆN / XIN Ý LỄ
                  </Button>
                </Card>

                {/* GOOGLE MAP CARD */}
                <Card
                  bordered={false}
                  className="map-editorial-card"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="map-frame-box">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.9286361938503!2d106.4010962751596!3d20.42041368108102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135fb75aaaaaaab%3A0xfb0f0731b568e408!2zTmjDoCBUaOG7nSBHacOhbyBY4bupIMSQ4buTbmcgUXVhbg!5e1!3m2!1svi!2s!4v1778647717285!5m2!1svi!2s"
                      width="100%"
                      height="220"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      title="Vị trí Nhà thờ Giáo xứ Đồng Quan"
                    />
                  </div>
                  <div className="map-caption">
                    <EnvironmentOutlined
                      style={{ color: primaryNavy, marginRight: 6 }}
                    />
                    <Text strong style={{ fontSize: 12, color: primaryNavy }}>
                      Vị trí Nhà thờ Giáo xứ Đồng Quan trên Google Maps
                    </Text>
                  </div>
                </Card>
              </Space>
            </Col>
          </Row>
        </Content>

        {/* FOOTER BÁO CHÍ SANG TRỌNG */}
        <Footer className="parish-editorial-footer">
          <div className="footer-container">
            <Title level={4} className="footer-parish-name">
              {parishData.name}
            </Title>
            <Text className="footer-sub-info">
              Trực thuộc Giáo phận Thái Bình • Năm thành lập:{" "}
              <b>{parishData.established}</b>
            </Text>
            <div style={{ marginTop: 12 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                © 2026 Trang thông tin điện tử Giáo xứ Đồng Quan. All rights
                reserved.
              </Text>
            </div>
          </div>
        </Footer>

        {/* MODAL CHI TIẾT GIÁO HỌ */}
        <Modal
          title={
            <div className="modal-custom-title">
              <BankOutlined style={{ color: accentGold }} />
              <span>THÔNG TIN CHI TIẾT GIÁO HỌ</span>
            </div>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={750}
          centered
        >
          {selectedHo && (
            <div style={{ paddingTop: 8 }}>
              <div className="modal-subparish-header">
                <Title
                  level={3}
                  style={{
                    color: primaryNavy,
                    margin: 0,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  {selectedHo.name}
                </Title>

                <Text type="secondary" style={{ fontSize: 13 }}>
                  <EnvironmentOutlined style={{ color: primaryNavy }} />{" "}
                  {selectedHo.address}
                </Text>

                <div style={{ marginTop: 10 }}>
                  <Tag className="gold-session-tag" style={{ marginRight: 8 }}>
                    <StarOutlined /> Bổn mạng: {selectedHo.patron}
                  </Tag>
                  <Tag className="members-count-pill">
                    <TeamOutlined /> {selectedHo.members} tín hữu
                  </Tag>
                </div>
              </div>

              <Tabs
                defaultActiveKey="1"
                items={[
                  {
                    key: "1",
                    label: "HÀNH TRÌNH LỊCH SỬ",
                    children: (
                      <Timeline
                        mode="left"
                        className="modal-editorial-timeline"
                        items={
                          selectedHo?.history?.map((item) => ({
                            label: (
                              <Text strong style={{ color: primaryNavy }}>
                                {item.year}
                              </Text>
                            ),
                            children: item.event,
                          })) || []
                        }
                      />
                    ),
                  },
                  {
                    key: "2",
                    label: "TỔ CHỨC & VỊ TRÍ",
                    children: (
                      <div className="modal-info-details">
                        <Title level={5} style={{ color: primaryNavy }}>
                          <TeamOutlined
                            style={{ color: accentGold, marginRight: 6 }}
                          />
                          Tổ chức & Hoạt động đoàn thể
                        </Title>
                        <Paragraph style={{ color: textDark, lineHeight: 1.7 }}>
                          {selectedHo.organization}
                        </Paragraph>

                        <Divider style={{ margin: "14px 0" }} />

                        <Row gutter={[16, 12]}>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Vị trí khoảng cách:
                            </Text>
                            <Paragraph
                              strong
                              style={{ margin: 0, color: primaryNavy }}
                            >
                              {selectedHo.distance}
                            </Paragraph>
                          </Col>

                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Năm đón nhận Tin Mừng:
                            </Text>
                            <Paragraph
                              strong
                              style={{ margin: 0, color: primaryNavy }}
                            >
                              {selectedHo.evangelized}
                            </Paragraph>
                          </Col>

                          <Col span={24}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Nhà thờ hiện tại:
                            </Text>
                            <Paragraph
                              strong
                              style={{ margin: 0, color: primaryNavy }}
                            >
                              Xây dựng & khánh thành năm{" "}
                              {selectedHo.currentChurch}
                            </Paragraph>
                          </Col>
                        </Row>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          )}
        </Modal>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

            .editorial-parish-layout {
              background: ${softBg};
              min-height: 100vh;
              font-family: 'Be Vietnam Pro', sans-serif;
              color: ${textDark};
            }

            /* Hero Banner */
            .hero-editorial-banner {
              height: 480px;
              background-position: center 30%;
              background-size: cover;
              display: flex;
              align-items: flex-end;
              padding-bottom: 90px;
              position: relative;
            }

            .hero-editorial-container {
              max-width: 1200px;
              margin: 0 auto;
              width: 100%;
              padding: 0 24px;
            }

            .sacred-hero-badge {
              background: rgba(212, 175, 55, 0.25);
              border: 1px solid ${accentGold};
              color: #ffffff;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1.5px;
              display: inline-flex;
              align-items: center;
              gap: 8px;
              margin-bottom: 12px;
            }

            .hero-parish-title {
              color: #ffffff !important;
              margin: 0 0 8px 0 !important;
              font-size: clamp(32px, 5vw, 54px) !important;
              font-family: 'Playfair Display', Georgia, serif !important;
              font-weight: 700 !important;
              text-shadow: 0 4px 15px rgba(0,0,0,0.6);
            }

            .hero-parish-subtitle {
              color: rgba(255, 255, 255, 0.9);
              font-size: 16px;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            /* Main Content Container */
            .main-editorial-content {
              max-width: 1200px;
              margin: -60px auto 0 auto;
              width: 100%;
              padding: 0 20px 80px 20px;
              position: relative;
              z-index: 10;
            }

            .editorial-main-card {
              border-radius: 20px !important;
              background: #ffffff !important;
              border: 1px solid rgba(212, 175, 55, 0.25) !important;
              box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
              overflow: hidden;
            }

            /* Custom Tabs */
            .editorial-custom-tabs .ant-tabs-nav {
              padding: 8px 20px 0 20px;
              margin-bottom: 0;
              background: ${softBg};
              border-bottom: 1px solid rgba(27, 54, 93, 0.08);
            }

            .editorial-custom-tabs .ant-tabs-tab-btn {
              font-family: 'Playfair Display', serif !important;
              font-weight: 700 !important;
              color: ${primaryNavy} !important;
              font-size: 14px;
            }

            .editorial-custom-tabs .ant-tabs-ink-bar {
              background: ${accentGold} !important;
              height: 3px !important;
            }

            .tab-section-title {
              color: ${primaryNavy} !important;
              font-family: 'Playfair Display', serif !important;
              margin-bottom: 16px !important;
              font-weight: 700 !important;
            }

            .tab-content-text {
              font-size: 15px;
              line-height: 1.8;
              color: ${textDark};
            }

            /* Timeline */
            .editorial-timeline {
              margin-top: 20px;
            }

            .timeline-year {
              color: ${primaryNavy};
              font-family: 'Playfair Display', serif;
              font-size: 15px;
            }

            .call-god-box {
              background: ${softBg};
              padding: 16px;
              border-radius: 14px;
              border-left: 4px solid ${accentGold};
              margin-bottom: 20px;
            }

            /* Subparish Cards */
            .subparish-editorial-card {
              border-radius: 16px !important;
              background: #ffffff !important;
              border: 1px solid rgba(27, 54, 93, 0.1) !important;
              transition: all 0.25s ease !important;
            }

            .subparish-editorial-card:hover {
              border-color: ${accentGold} !important;
              box-shadow: 0 8px 24px rgba(27, 54, 93, 0.08) !important;
              transform: translateY(-4px);
            }

            .subparish-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .members-count-pill {
              background: rgba(27, 54, 93, 0.06) !important;
              color: ${primaryNavy} !important;
              border: none !important;
              font-weight: 700;
              border-radius: 12px;
            }

            .subparish-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 14px;
              padding-top: 10px;
              border-top: 1px dashed rgba(27, 54, 93, 0.1);
            }

            /* Right Column Cards */
            .priest-profile-card {
              border-radius: 20px !important;
              background: #ffffff !important;
              border: 1px solid rgba(212, 175, 55, 0.3) !important;
              box-shadow: 0 10px 30px rgba(27, 54, 93, 0.05) !important;
              text-align: center;
              padding: 12px;
            }

            .priest-avatar-box {
              margin-top: -10px;
            }

            .priest-main-avatar {
              background: ${primaryNavy} !important;
              border: 3px solid ${accentGold};
              box-shadow: 0 8px 20px rgba(27, 54, 93, 0.15);
            }

            .priest-name-title {
              font-family: 'Playfair Display', serif !important;
              color: ${primaryNavy} !important;
              margin: 10px 0 2px 0 !important;
              font-weight: 700 !important;
            }

            .priest-role-tag {
              font-size: 10px;
              font-weight: 700;
              color: ${accentGold};
              letter-spacing: 1px;
            }

            .priest-info-list .ant-list-item {
              padding: 10px 0;
              border-bottom: 1px dashed rgba(27, 54, 93, 0.1);
            }

            .contact-action-card {
              border-radius: 20px !important;
              background: linear-gradient(135deg, ${primaryNavy} 0%, #0f2342 100%) !important;
              padding: 12px;
              border: 1px solid ${accentGold} !important;
            }

            .online-mass-btn {
              background: ${accentGold} !important;
              border-color: ${accentGold} !important;
              color: ${primaryNavy} !important;
              font-weight: 700 !important;
              height: 44px !important;
              border-radius: 10px !important;
              box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
            }

            .map-editorial-card {
              border-radius: 20px !important;
              overflow: hidden !important;
              border: 1px solid rgba(212, 175, 55, 0.3) !important;
            }

            .map-caption {
              padding: 12px;
              background: #ffffff;
              text-align: center;
            }

            /* Footer Style */
            .parish-editorial-footer {
              background: #ffffff !important;
              padding: 60px 20px !important;
              border-top: 1px solid rgba(212, 175, 55, 0.25) !important;
              text-align: center;
            }

            .footer-parish-name {
              font-family: 'Playfair Display', serif !important;
              color: ${primaryNavy} !important;
              margin: 0 !important;
              font-weight: 700 !important;
            }

            .footer-sub-info {
              color: #64748b;
              font-size: 13px;
              margin-top: 4px;
              display: block;
            }

            /* Modal Style */
            .modal-custom-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-family: 'Playfair Display', serif;
              color: ${primaryNavy};
              font-size: 18px;
              font-weight: 700;
            }

            .modal-subparish-header {
              background: ${softBg};
              padding: 16px;
              border-radius: 14px;
              border: 1px solid rgba(212, 175, 55, 0.3);
              margin-bottom: 16px;
            }

            .gold-session-tag {
              background: rgba(212, 175, 55, 0.15) !important;
              border: 1px solid ${accentGold} !important;
              color: ${primaryNavy} !important;
              border-radius: 8px;
              font-weight: 600;
            }

            .modal-info-details {
              padding: 12px 0;
            }

            .custom-admin-table .ant-table-thead > tr > th {
              background: ${softBg} !important;
              color: ${primaryNavy} !important;
              font-weight: 700 !important;
              border-bottom: 1px solid rgba(27, 54, 93, 0.1) !important;
            }
          `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default GiaoXuDongQuanFull;
