import React, { useEffect } from "react";
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
} from "@ant-design/icons";

import Logo1 from "../assets/images/anhnhatho.jpg";

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const GiaoXuDongQuanFull = () => {
  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Navy Đậm
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    document.title = "Thông Tin Giáo Xứ | Giáo xứ Đồng Quan";
  }, []);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedHo, setSelectedHo] = React.useState(null);

  const showModal = (ho) => {
    setSelectedHo(ho);
    setIsModalOpen(true);
  };

  // DỮ LIỆU CƠ BẢN GIÁO XỨ
  const parishData = {
    name: "GIÁO XỨ ĐỒNG QUAN",
    diocese: "Thái Bình",
    deanery: "Kiến Xương",
    established: "1911",
    patron: "Đức Mẹ Hồn Xác Lên Trời (15/08)",
    priest: "Cha Jos. Vũ Văn Chiều",
    address: "Thôn Đồng Tâm, xã Vũ Quý, tỉnh Hưng Yên",
    population: "1.304 (Toàn xứ)",
    phone: "093 384 84 83",
    subParishes: [
      {
        name: "Họ Kinh Nhuế",
        members: 125,
        patron: "Thánh Phaolô trở lại (25/01) & Thánh Antôn (13/6)",
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

  // CẤU TRÚC BẢNG GIỜ LỄ
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
      title: "Ngày",
      dataIndex: "days",
      key: "days",
      width: "15%",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <Space>
          <BankOutlined style={{ color: accentGold }} />
          <Text style={{ fontWeight: 600 }}>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Giờ lễ",
      dataIndex: "time",
      key: "time",
      width: "15%",
      render: (t) => <Tag className="mass-time-tag">{t}</Tag>,
    },
    {
      title: "Ghi chú",
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
      days: "25/2",
      day: "Thứ 2",
      location: "Nhà thờ Đồng Quan",
      time: "05:00",
      note: "Lễ sáng",
    },
    {
      key: "2",
      days: "25/2",
      day: "Thứ 3",
      location: "Họ Kinh Nhuế",
      time: "18:00",
      note: "Cha xứ dâng lễ",
    },
    {
      key: "3",
      days: "25/2",
      day: "Thứ 4",
      location: "Nhà thờ Đồng Quan",
      time: "05:00",
      note: "Lễ sáng",
    },
    {
      key: "4",
      days: "25/2",
      day: "Thứ 5",
      location: "Họ Phụng Thượng",
      time: "18:00",
      note: "Lễ chiều",
    },
    {
      key: "5",
      days: "25/2",
      day: "Thứ 6",
      location: "Nhà thờ Đồng Quan",
      time: "18:30",
      note: "Kính Lòng Chúa Thương Xót",
    },
    {
      key: "6",
      days: "25/2",
      day: "Thứ 7",
      location: "Họ Việt Hưng",
      time: "17:30",
      note: "Lễ thay Chúa Nhật",
    },
    {
      key: "7",
      days: "25/2",
      day: "Chúa Nhật",
      location: "Nhà thờ Đồng Quan",
      time: "05:30",
      note: "Lễ sáng - Thiếu nhi",
    },
    {
      key: "8",
      days: "25/2",
      day: "Chúa Nhật",
      location: "Nhà thờ Đồng Quan",
      time: "08:00",
      note: "Lễ Đại Triều",
    },
    {
      key: "9",
      days: "25/2",
      day: "Chúa Nhật",
      location: "Nhà thờ Đồng Quan",
      time: "16:30",
      note: "Lễ chiều",
    },
  ];

  const columnsLM = [
    {
      title: "Linh mục",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Text
          strong
          style={{ color: record.isCurrent ? primaryNavy : textDark }}
        >
          {text}{" "}
          {record.isCurrent && (
            <Tag className="current-priest-tag">Hiện tại</Tag>
          )}
        </Text>
      ),
    },
    {
      title: "Nhiệm kỳ",
      dataIndex: "period",
      key: "period",
      align: "right",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
  ];

  const dataLM = [
    { key: "1", name: "Cha Giuse Toàn", period: "-" },
    { key: "2", name: "Cha Đaminh Thức", period: "1925" },
    { key: "3", name: "Cha Đaminh Phạm Hữu Quang", period: "-" },
    { key: "4", name: "Cha Gioan B. Trần Du Đồng", period: "-" },
    { key: "5", name: "Cha Đaminh Mưu", period: "-" },
    { key: "6", name: "Cha Giuse Phạm Kim Bảng", period: "-" },
    { key: "7", name: "Cha Micae Tung", period: "-" },
    { key: "8", name: "Cha Vinhsơn Thái", period: "-" },
    { key: "9", name: "Cha Đaminh An", period: "-" },
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
    { key: "18", name: "Cha Đaminh Trương Văn Thụy", period: "-" },
    { key: "19", name: "Cha Giuse Hà Đăng Oánh", period: "-" },
    {
      key: "20",
      name: "Cha Jos. Vũ Văn Chiều",
      period: "Hiện nay",
      isCurrent: true,
    },
  ];

  const tabItems = [
    {
      key: "intro",
      label: (
        <span>
          <InfoCircleOutlined /> GIỚI THIỆU
        </span>
      ),
      children: (
        <div style={{ padding: "10px 0" }}>
          <Title level={4} className="tab-section-title">
            <EnvironmentOutlined style={{ color: accentGold }} /> I. VỊ TRÍ ĐỊA
            LÝ
          </Title>
          <Paragraph className="tab-content-text">
            Giáo xứ Đồng Quan nằm cách <b>Toà Giám Mục Thái Bình khoảng 7km</b>{" "}
            về phía Đông Nam; phía Tây Bắc giáp với làng Đồng Sách. Con sông
            Hoàng Giang chia cắt 2 cánh đồng của làng Đồng Quan với làng Luật
            Trung và làng Luật Nội.
          </Paragraph>

          <Divider style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

          <Title level={4} className="tab-section-title">
            <HistoryOutlined style={{ color: accentGold }} /> II. HÌNH THÀNH &
            PHÁT TRIỂN
          </Title>
          <Timeline
            mode="left"
            className="glhn-timeline"
            items={[
              {
                label: (
                  <Text strong className="tl-year">
                    1745
                  </Text>
                ),
                children:
                  "Hạt giống Đức Tin nảy mầm qua hai cụ Tuần Lương và Huyện Kiêm.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    1752
                  </Text>
                ),
                children: "Ngôi nhà thờ đầu tiên được tiền nhân xây dựng.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    1888
                  </Text>
                ),
                children:
                  "Giáo xứ Thân Thượng được thành lập, họ Đồng Quan được cắt về giáo xứ mới này.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    1889
                  </Text>
                ),
                children:
                  "Số giáo dân ngày một đông nên nhà thờ được xây dựng lại.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    1911
                  </Text>
                ),
                children:
                  "Đức cha Phêrô Munagorri Trung chính thức nâng lên hàng giáo xứ.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    1997
                  </Text>
                ),
                children:
                  "Đức cha Phanxicô Xaviê Nguyễn Văn Sang đã cho phép xây dựng nhà thờ mới rộng rãi và bề thế hơn, được cắt băng khánh thành ngày 21/11/2000.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    2003
                  </Text>
                ),
                children:
                  "Khởi công xây dựng ngôi nhà xứ mới, rộng 350m2. Năm 2011, Giáo xứ xây dựng và hoàn thiện 4 đài xung quanh nhà thờ.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    2006
                  </Text>
                ),
                children:
                  "Hồi sinh: Đón Cha Gioan B. Nguyễn Sơn Hải trực tiếp coi sóc sau 50 năm trống tòa.",
              },
              {
                label: (
                  <Text strong className="tl-year">
                    2012
                  </Text>
                ),
                children: "Đại lễ tạ ơn kỷ niệm 100 năm thành lập Giáo xứ.",
              },
              {
                label: (
                  <Text strong className="tl-year">
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
          <ClockCircleOutlined /> GIỜ LỄ PHỤNG VỤ
        </span>
      ),
      children: (
        <div style={{ padding: "10px 0" }}>
          <Alert
            message="Lưu ý: Giờ lễ có thể thay đổi vào các dịp Đại Lễ hoặc theo thông báo của Cha xứ."
            type="info"
            showIcon
            style={{
              marginBottom: 16,
              borderRadius: 12,
              background: "#ffffff",
              borderColor: "rgba(212, 175, 55, 0.3)",
            }}
          />
          <Table
            columns={massColumns}
            dataSource={massData}
            pagination={false}
            bordered
            size="small"
            className="custom-table"
          />
        </div>
      ),
    },
    {
      key: "org",
      label: (
        <span>
          <TeamOutlined /> TỔ CHỨC & ƠN GỌI
        </span>
      ),
      children: (
        <div style={{ padding: "10px 0" }}>
          <Title
            level={5}
            style={{
              color: primaryNavy,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            ƠN GỌI TIÊU BIỂU:
          </Title>
          <Paragraph
            className="tab-content-text"
            style={{
              padding: 16,
              background: softBg,
              borderRadius: 12,
              borderLeft: `4px solid ${accentGold}`,
            }}
          >
            Đồng Quan là quê hương của <b>Cha bề trên Đaminh Trần Đình Thủ</b>{" "}
            (1906 - 2007) - Người sáng lập Dòng Đồng Công. Ngoài ra còn có các
            cha và tu sĩ khác đã và đang phục vụ khắp mọi nơi.
          </Paragraph>
          <Divider
            orientation="left"
            style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              LINH MỤC QUA CÁC THỜI KỲ
            </Text>
          </Divider>
          <Table
            columns={columnsLM}
            dataSource={dataLM}
            pagination={{ pageSize: 8, hideOnSinglePage: true }}
            size="middle"
            className="custom-table"
          />
        </div>
      ),
    },
    {
      key: "hoxu",
      label: (
        <span>
          <BankOutlined /> CÁC GIÁO HỌ
        </span>
      ),
      children: (
        <Row gutter={[16, 16]} style={{ padding: "10px 0" }}>
          {parishData.subParishes.map((ho, idx) => (
            <Col xs={24} sm={12} key={idx}>
              <Card
                hoverable
                className="subparish-card"
                onClick={() => showModal(ho)}
              >
                <Title level={5} className="ho-card-title">
                  {ho.name.toUpperCase()}
                </Title>
                <Space direction="vertical" size={4} style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    <EnvironmentOutlined style={{ color: accentGold }} />{" "}
                    {ho.address}
                  </Text>
                  <Text strong style={{ fontSize: 12, color: primaryNavy }}>
                    <StarOutlined style={{ color: accentGold }} /> Bổn mạng:{" "}
                    {ho.patron}
                  </Text>
                </Space>
                <div
                  style={{
                    marginTop: 14,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Tag className="ho-members-tag">{ho.members} giáo dân</Tag>
                  <Button
                    type="link"
                    size="small"
                    icon={<ArrowRightOutlined />}
                    className="ho-detail-btn"
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
          borderRadius: 14,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="parish-editorial-root">
        {/* HERO BANNER */}
        <div
          className="hero-banner"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(15, 31, 56, 0.4) 0%, rgba(15, 31, 56, 0.85) 100%), url(${Logo1})`,
          }}
        >
          <div className="hero-content">
            <Space direction="vertical" size={8}>
              <span className="hero-diocese-tag">
                <CompassOutlined /> GIÁO PHẬN THÁI BÌNH
              </span>
              <Title level={1} className="hero-title">
                {parishData.name}
              </Title>
              <div className="hero-subtitle">
                <EnvironmentOutlined style={{ color: accentGold }} />{" "}
                {parishData.address}
              </div>
            </Space>
          </div>
        </div>

        {/* CONTENT CONTAINER */}
        <Content className="content-container">
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={16}>
              <Card bordered={false} className="main-info-card">
                <Tabs
                  defaultActiveKey="intro"
                  items={tabItems}
                  size="large"
                  className="custom-tabs"
                />
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: "100%" }} size={24}>
                {/* PRIEST PROFILE CARD */}
                <Card bordered={false} className="priest-card">
                  <div className="priest-header">
                    <Avatar
                      size={96}
                      icon={<UserOutlined />}
                      className="priest-avatar"
                    />
                    <Title level={4} className="priest-name">
                      {parishData.priest}
                    </Title>
                    <Text className="priest-title">Linh mục chánh xứ</Text>
                  </div>
                  <Divider
                    style={{
                      margin: "16px 0",
                      borderColor: "rgba(212, 175, 55, 0.2)",
                    }}
                  />
                  <List size="small" className="quick-info-list">
                    <List.Item>
                      <Space>
                        <TeamOutlined style={{ color: accentGold }} />{" "}
                        <Text strong>Hạt:</Text> {parishData.deanery}
                      </Space>
                    </List.Item>
                    <List.Item>
                      <Space>
                        <StarOutlined style={{ color: accentGold }} />{" "}
                        <Text strong>Bổn mạng:</Text> {parishData.patron}
                      </Space>
                    </List.Item>
                    <List.Item>
                      <Space>
                        <TeamOutlined style={{ color: accentGold }} />{" "}
                        <Text strong>Giáo dân:</Text> {parishData.population}
                      </Space>
                    </List.Item>
                    <List.Item>
                      <Space>
                        <PhoneOutlined style={{ color: accentGold }} />{" "}
                        <Text strong>Điện thoại:</Text> {parishData.phone}
                      </Space>
                    </List.Item>
                  </List>
                </Card>

                {/* CONTACT CARD */}
                <Card bordered={false} className="contact-card">
                  <Title
                    level={5}
                    style={{
                      color: "#ffffff",
                      fontFamily: "'Playfair Display', serif",
                      marginBottom: 16,
                    }}
                  >
                    <PhoneOutlined
                      style={{ color: accentGold, marginRight: 8 }}
                    />{" "}
                    LIÊN HỆ & PHỤNG VỤ
                  </Title>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div className="contact-item">
                      <MailOutlined
                        style={{ color: accentGold, marginRight: 8 }}
                      />
                      <Text
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: 13,
                        }}
                      >
                        dongquan@thaibinhdiocese.org
                      </Text>
                    </div>
                    <Button type="primary" block className="action-button">
                      GỬI Ý LỄ TRỰC TUYẾN
                    </Button>
                  </Space>
                </Card>

                {/* MAP CARD */}
                <Card
                  bordered={false}
                  className="map-card"
                  bodyStyle={{ padding: 0 }}
                >
                  <div className="map-container">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.9286361938503!2d106.4010962751596!3d20.42041368108102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135fb75aaaaaaab%3A0xfb0f0731b568e408!2zTmjDoCBUaOG7nSBHacOhbyBY4bupIMSQ4buTbmcgUXVhbg!5e1!3m2!1svi!2s!4v1778647717285!5m2!1svi!2s"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      title="Bản đồ giáo xứ"
                    />
                  </div>
                  <div className="map-footer">
                    <EnvironmentOutlined style={{ color: accentGold }} />{" "}
                    <Text strong style={{ fontSize: 12, color: primaryNavy }}>
                      Vị trí Giáo xứ trên Google Maps
                    </Text>
                  </div>
                </Card>
              </Space>
            </Col>
          </Row>
        </Content>

        <Footer className="main-footer">
          <Text className="footer-name">{parishData.name}</Text>
          <div className="footer-info">
            Trực thuộc Giáo phận Thái Bình | Thành lập năm{" "}
            {parishData.established}
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            © 2026 Trang thông tin điện tử Giáo xứ. Developed with HT.
          </Text>
        </Footer>

        {/* MODAL CHI TIẾT GIÁO HỌ */}
        <Modal
          title={
            <span
              style={{
                color: primaryNavy,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
              }}
            >
              THÔNG TIN CHI TIẾT GIÁO HỌ
            </span>
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          width={720}
          centered
          className="custom-modal"
        >
          {selectedHo && (
            <div className="modal-scroll-area">
              <div className="modal-header">
                <Title
                  level={3}
                  style={{
                    color: primaryNavy,
                    fontFamily: "'Playfair Display', serif",
                    margin: 0,
                  }}
                >
                  {selectedHo.name}
                </Title>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  <EnvironmentOutlined style={{ color: accentGold }} />{" "}
                  {selectedHo.address}
                </Text>
                <div className="modal-tags" style={{ marginTop: 10 }}>
                  <Tag
                    style={{
                      background: "rgba(212, 175, 55, 0.15)",
                      borderColor: accentGold,
                      color: primaryNavy,
                      fontWeight: 600,
                    }}
                  >
                    <StarOutlined /> Bổn mạng: {selectedHo.patron}
                  </Tag>
                  <Tag
                    style={{
                      background: "rgba(27, 54, 93, 0.1)",
                      borderColor: primaryNavy,
                      color: primaryNavy,
                      fontWeight: 600,
                    }}
                  >
                    <TeamOutlined /> {selectedHo.members} giáo dân
                  </Tag>
                </div>
              </div>

              <Tabs
                defaultActiveKey="1"
                className="custom-tabs"
                items={[
                  {
                    key: "1",
                    label: "HÀNH TRÌNH LỊCH SỬ",
                    children: (
                      <Timeline
                        mode="left"
                        className="modal-timeline"
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
                      <div className="modal-info-grid">
                        <div className="info-item">
                          <Title level={5} style={{ color: primaryNavy }}>
                            <TeamOutlined style={{ color: accentGold }} /> Tổ
                            chức đoàn thể
                          </Title>
                          <Paragraph style={{ color: textDark }}>
                            {selectedHo.organization}
                          </Paragraph>
                        </div>
                        <Divider
                          style={{
                            margin: "12px 0",
                            borderColor: "rgba(212, 175, 55, 0.2)",
                          }}
                        />
                        <Row gutter={16}>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Vị trí địa lý:
                            </Text>
                            <Paragraph strong style={{ color: primaryNavy }}>
                              {selectedHo.distance}
                            </Paragraph>
                          </Col>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Năm đón Tin Mừng:
                            </Text>
                            <Paragraph strong style={{ color: primaryNavy }}>
                              {selectedHo.evangelized}
                            </Paragraph>
                          </Col>
                          <Col span={24}>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Nhà thờ hiện tại:
                            </Text>
                            <Paragraph strong style={{ color: primaryNavy }}>
                              Xây dựng năm {selectedHo.currentChurch}
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

          .parish-editorial-root { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          /* Hero Banner */
          .hero-banner { 
            height: 480px; 
            background-position: center 30%; 
            background-size: cover;
            display: flex; 
            align-items: flex-end; 
            padding-bottom: 100px; 
            position: relative;
          }

          .hero-content { 
            max-width: 1200px; 
            margin: 0 auto; 
            width: 100%; 
            padding: 0 24px; 
            position: relative; 
            z-index: 2; 
          }

          .hero-diocese-tag {
            background: rgba(212, 175, 55, 0.25);
            border: 1px solid ${accentGold};
            color: ${accentGold};
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .hero-title { 
            color: #ffffff !important; 
            margin: 8px 0 !important; 
            font-size: clamp(32px, 5vw, 52px) !important; 
            font-family: 'Playfair Display', Georgia, serif;
            font-weight: 700 !important;
            letter-spacing: 0.5px; 
          }

          .hero-subtitle { 
            color: rgba(255,255,255,0.9); 
            font-size: 16px; 
            display: flex; 
            align-items: center; 
            gap: 8px;
          }

          /* Main Content Container */
          .content-container { 
            max-width: 1200px; 
            margin: -60px auto 0; 
            width: 100%; 
            padding: 0 20px 80px; 
            position: relative; 
            z-index: 10; 
          }

          .main-info-card { 
            border-radius: 20px !important; 
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important; 
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            padding: 8px;
          }

          /* Custom Tabs */
          .custom-tabs .ant-tabs-nav { 
            padding: 0 16px; 
            margin-bottom: 20px; 
            border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          }

          .custom-tabs .ant-tabs-tab-btn { 
            font-weight: 700 !important; 
            font-size: 13px !important; 
            letter-spacing: 0.5px;
            color: ${textDark};
          }

          .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn { 
            color: ${primaryNavy} !important; 
          }

          .custom-tabs .ant-tabs-ink-bar { 
            background: ${accentGold} !important; 
            height: 3px !important; 
          }

          .tab-section-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important; 
            margin-bottom: 20px !important; 
            font-weight: 700 !important;
          }

          .tab-content-text { 
            font-size: 15px; 
            line-height: 1.85; 
            color: #475569; 
            text-align: justify;
          }

          /* Timeline */
          .glhn-timeline .ant-timeline-item-label { font-weight: 700; color: ${primaryNavy} !important; }
          .glhn-timeline .ant-timeline-item-head { border-color: ${accentGold} !important; background: ${accentGold}; }
          .tl-year { color: ${primaryNavy}; }

          /* Priest Profile Card */
          .priest-card { 
            border-radius: 20px !important; 
            text-align: center; 
            box-shadow: 0 8px 24px rgba(27, 54, 93, 0.05) !important; 
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
          }

          .priest-avatar { 
            border: 3px solid ${accentGold}; 
            box-shadow: 0 8px 20px rgba(27, 54, 93, 0.15); 
            background: rgba(27, 54, 93, 0.05);
          }

          .priest-name {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 12px 0 2px 0 !important;
            font-weight: 700 !important;
          }

          .priest-title { 
            color: ${accentGold}; 
            font-weight: 700; 
            letter-spacing: 1.5px; 
            font-size: 11px;
            text-transform: uppercase;
          }

          .quick-info-list .ant-list-item { 
            border-bottom: 1px dashed rgba(212, 175, 55, 0.2); 
            padding: 10px 0; 
            font-size: 13px;
          }

          /* Contact Card */
          .contact-card { 
            background: linear-gradient(135deg, ${primaryNavy} 0%, ${deepNavy} 100%) !important; 
            border-radius: 20px !important; 
            border: 1px solid ${accentGold} !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.2) !important;
            padding: 8px;
          }

          .action-button { 
            background: ${accentGold} !important; 
            border: none !important; 
            height: 44px; 
            font-weight: 700; 
            border-radius: 10px;
            color: ${primaryNavy} !important;
            box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
            margin-top: 12px;
          }

          .action-button:hover { 
            background: #ffffff !important; 
            color: ${primaryNavy} !important; 
            transform: translateY(-2px);
          }

          /* Subparish Cards */
          .subparish-card { 
            border-radius: 16px !important; 
            border: 1px solid rgba(212, 175, 55, 0.2) !important; 
            transition: all 0.35s ease !important; 
            background: #ffffff !important;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
          }

          .subparish-card:hover { 
            transform: translateY(-6px); 
            box-shadow: 0 16px 36px rgba(27, 54, 93, 0.12) !important; 
            border-color: ${accentGold} !important; 
          }

          .ho-card-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-weight: 700 !important;
          }

          .ho-members-tag {
            background: rgba(212, 175, 55, 0.15) !important;
            border: 1px solid ${accentGold} !important;
            color: ${primaryNavy} !important;
            font-weight: 600;
            border-radius: 12px;
            font-size: 11px;
          }

          .ho-detail-btn {
            color: ${primaryNavy} !important;
            font-weight: 700;
            padding: 0;
          }

          /* Table Custom */
          .custom-table .ant-table { background: transparent; }
          .custom-table .ant-table-thead > tr > th { 
            background: ${softBg} !important; 
            color: ${primaryNavy} !important; 
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
            font-weight: 700;
          }

          .mass-time-tag {
            background: rgba(212, 175, 55, 0.15) !important;
            border: 1px solid ${accentGold} !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            border-radius: 12px;
          }

          .current-priest-tag {
            background: ${accentGold} !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            border-radius: 10px;
            margin-left: 8px;
            border: none;
          }

          /* Map Card */
          .map-card { 
            border-radius: 20px !important; 
            overflow: hidden; 
            box-shadow: 0 8px 24px rgba(27, 54, 93, 0.05) !important; 
            border: 1px solid rgba(212, 175, 55, 0.2) !important;
          }

          .map-footer {
            padding: 12px 16px;
            background: #ffffff;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          /* Footer */
          .main-footer { 
            text-align: center; 
            background: ${deepNavy}; 
            color: rgba(255, 255, 255, 0.6);
            padding: 60px 20px 40px 20px; 
            border-top: 3px solid ${accentGold}; 
          }

          .footer-name { 
            color: ${accentGold}; 
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 22px; 
            font-weight: 700; 
            display: block;
            margin-bottom: 6px;
          }

          .footer-info {
            font-size: 13px;
            margin-bottom: 12px;
            color: rgba(255, 255, 255, 0.8);
          }

          /* Modal */
          .custom-modal .ant-modal-content { border-radius: 20px; padding: 24px; }
          .modal-scroll-area { padding: 10px 0; }

          @media (max-width: 768px) {
            .hero-banner { height: 380px; padding-bottom: 70px; }
            .hero-content { padding: 0 16px; }
            .content-container { margin-top: -40px; padding: 0 14px 60px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default GiaoXuDongQuanFull;
