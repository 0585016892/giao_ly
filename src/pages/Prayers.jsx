import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Menu,
  Typography,
  Card,
  Button,
  Space,
  Empty,
  Badge,
  Switch,
  Input,
  Spin,
  Drawer,
  Grid,
  ConfigProvider,
  Tooltip,
  Progress,
  Divider,
  Tag,
} from "antd";
import {
  BookOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  MinusCircleOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  MenuOutlined,
  SearchOutlined,
  SwapOutlined,
  StarFilled,
} from "@ant-design/icons";
import { getPrayers } from "../api/prayerApi";

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const Prayers = () => {
  const screens = useBreakpoint();
  const [prayerData, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [selectedKey, setSelectedKey] = useState("1");
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [testMode, setTestMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const [learnedKeys, setLearnedKeys] = useState(() => {
    const saved = localStorage.getItem("learned_prayers");
    return saved ? JSON.parse(saved) : [];
  });

  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const softCream = "#fdfbf7";

  const mandatoryKeys = [
    "1",
    "4",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "18",
    "24",
    "25",
    "26",
  ];

  useEffect(() => {
    fetchPrayers();
  }, []);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const res = await getPrayers();
      const list = res?.data;
      if (list) {
        const mapped = Object.keys(list).map((key) => ({
          id: String(key),
          ...list[key],
        }));
        setPrayers(mapped);
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem("learned_prayers", JSON.stringify(learnedKeys));
  }, [learnedKeys]);
  useEffect(() => {
    setUserAnswers({});
    setIsFlipped(false);
  }, [selectedKey, testMode, isFlashcardMode]);

  const currentPrayer = useMemo(
    () => prayerData.find((item) => item.id === selectedKey),
    [prayerData, selectedKey],
  );

  const progressPercent = useMemo(() => {
    const learnedMandatory = learnedKeys.filter((k) =>
      mandatoryKeys.includes(k),
    ).length;
    return Math.round((learnedMandatory / mandatoryKeys.length) * 100);
  }, [learnedKeys]);

  const handleInputChange = (index, value) => {
    setUserAnswers((prev) => ({ ...prev, [index]: value }));
  };
  // Thêm đoạn này vào bên trong component Prayers, phía trên menuItems
  const toggleLearned = (key) => {
    setLearnedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };
  const renderContent = (text) => {
    if (isFlashcardMode) {
      return (
        <div
          style={{ perspective: "1000px", cursor: "pointer", height: "350px" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transition: "transform 0.6s",
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "none",
            }}
          >
            {/* Mặt trước */}
            <Card
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px dashed ${primaryGold}`,
                background: "#fcfaf2",
              }}
            >
              <Title
                level={3}
                style={{ color: deepBrown, textAlign: "center" }}
              >
                <BookOutlined
                  style={{
                    display: "block",
                    fontSize: 40,
                    marginBottom: 15,
                    opacity: 0.3,
                  }}
                />
                Nội dung bài <br /> "{currentPrayer?.title}"
              </Title>
              <Text type="secondary">Chạm để lật thẻ</Text>
            </Card>
            {/* Mặt sau */}
            <Card
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                overflowY: "auto",
                background: "#fff",
              }}
            >
              <Text style={{ fontSize: "17px", lineHeight: 1.8 }}>{text}</Text>
            </Card>
          </div>
        </div>
      );
    }

    if (!testMode)
      return (
        <Paragraph
          style={{ fontSize, whiteSpace: "pre-line", lineHeight: 1.8 }}
        >
          {text}
        </Paragraph>
      );

    return text.split("\n").map((line, lIdx) => (
      <div key={lIdx} style={{ marginBottom: 15, lineHeight: "2.8" }}>
        {line.split(" ").map((word, wIdx) => {
          const gIdx = `${lIdx}-${wIdx}`;
          if (word.length > 3 && wIdx % 3 === 0) {
            const clean = (w) =>
              w
                .replace(/[.,!?;:()]/g, "")
                .toLowerCase()
                .trim();
            const isCorrect = clean(userAnswers[gIdx] || "") === clean(word);
            return (
              <Input
                key={wIdx}
                value={userAnswers[gIdx] || ""}
                onChange={(e) => handleInputChange(gIdx, e.target.value)}
                style={{
                  width: `${word.length + 1.2}ch`,
                  minWidth: "50px",
                  fontSize,
                  margin: "0 4px",
                  borderBottom: `2px solid ${userAnswers[gIdx] ? (isCorrect ? "#52c41a" : "#ff4d4f") : primaryGold}`,
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 0,
                  textAlign: "center",
                  background: "transparent",
                }}
              />
            );
          }
          return (
            <span key={wIdx} style={{ fontSize }}>
              {word}{" "}
            </span>
          );
        })}
      </div>
    ));
  };

  const menuItems = useMemo(() => {
    const filter = (data) =>
      data.filter((p) =>
        p.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    const renderItem = (item) => ({
      key: item.id,
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.title}
          </span>
          {learnedKeys.includes(item.id) && (
            <CheckCircleFilled style={{ color: "#52c41a", marginLeft: 8 }} />
          )}
        </div>
      ),
    });

    return [
      {
        key: "sub1",
        label: <b>I. KINH SÁNG & TỐI</b>,
        icon: <BookOutlined />,
        children: filter(prayerData.filter((p) => Number(p.id) <= 26)).map(
          renderItem,
        ),
      },
      {
        key: "sub2",
        label: <b>II. KINH CHÚA NHẬT</b>,
        icon: <SafetyCertificateOutlined />,
        children: filter(prayerData.filter((p) => Number(p.id) >= 27)).map(
          renderItem,
        ),
      },
    ];
  }, [prayerData, learnedKeys, searchText]);

  const SidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fff",
      }}
    >
      <div style={{ padding: "24px 20px" }}>
        <Title level={4} style={{ color: deepBrown, margin: 0 }}>
          KINH NGUYỆN
        </Title>
        <Text type="secondary" size="small">
          Giáo lý hôn nhân
        </Text>
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text strong size="small">
              Tiến độ thuộc lòng
            </Text>
            <Text strong color={primaryGold}>
              {progressPercent}%
            </Text>
          </div>
          <Progress
            percent={progressPercent}
            strokeColor={primaryGold}
            size="small"
            showInfo={false}
          />
        </div>
        <Input
          prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
          placeholder="Tìm tên kinh..."
          style={{ marginTop: 15, borderRadius: 20 }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>
      <Divider style={{ margin: 0 }} />
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys.slice(-1))}
          onSelect={({ key }) => {
            setSelectedKey(key);
            if (!screens.lg) setIsMobileMenuOpen(false);
          }}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: primaryGold, borderRadius: 12 } }}
    >
      <Layout style={{ minHeight: "100vh", background: softCream }}>
        {/* Sidebar cho Desktop - Dùng Sticky để không đè Footer */}
        {screens.lg && (
          <Sider
            width={320}
            theme="light"
            style={{
              background: "#fff",
              height: "100vh",
              position: "sticky",
              top: 0,
              left: 0,
              boxShadow: "4px 0 15px rgba(0,0,0,0.03)",
              zIndex: 10,
            }}
          >
            {SidebarContent}
          </Sider>
        )}

        {/* Drawer cho Mobile */}
        <Drawer
          placement="left"
          onClose={() => setIsMobileMenuOpen(false)}
          open={isMobileMenuOpen}
          width={280}
          bodyStyle={{ padding: 0 }}
        >
          {SidebarContent}
        </Drawer>

        <Layout style={{ background: "transparent" }}>
          {/* Header Mobile */}
          {!screens.lg && (
            <div
              style={{
                padding: "12px 20px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 100,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setIsMobileMenuOpen(true)}
              />
              <Title level={5} style={{ margin: "0 0 0 15px", flex: 1 }}>
                {currentPrayer?.title}
              </Title>
              <Badge
                count={`${progressPercent}%`}
                style={{ backgroundColor: primaryGold }}
              />
            </div>
          )}

          <Content
            style={{
              padding: screens.xs ? "20px 15px" : "40px",
              maxWidth: "1000px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {loading ? (
              <Spin
                size="large"
                style={{ display: "block", margin: "100px auto" }}
              />
            ) : currentPrayer ? (
              <Card
                bordered={false}
                style={{
                  boxShadow: "0 15px 40px rgba(93, 64, 55, 0.06)",
                  borderRadius: "20px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 30,
                    flexWrap: "wrap",
                    gap: 15,
                  }}
                >
                  <Space direction="vertical" size={0}>
                    <Space align="center">
                      <Title level={2} style={{ color: deepBrown, margin: 0 }}>
                        {currentPrayer.title}
                      </Title>
                      {learnedKeys.includes(currentPrayer.id) && (
                        <CheckCircleFilled
                          style={{ color: "#52c41a", fontSize: 24 }}
                        />
                      )}
                    </Space>
                    <Space style={{ marginTop: 8 }}>
                      <Tag color="gold">Mã số: {currentPrayer.id}</Tag>
                      {mandatoryKeys.includes(currentPrayer.id) && (
                        <Tag color="volcano">Kinh bắt buộc</Tag>
                      )}
                    </Space>
                  </Space>
                  <Space>
                    <Tooltip title="Chế độ Thẻ ghi nhớ">
                      <Button
                        shape="circle"
                        type={isFlashcardMode ? "primary" : "default"}
                        icon={<SwapOutlined />}
                        onClick={() => setIsFlashcardMode(!isFlashcardMode)}
                      />
                    </Tooltip>
                    <Button
                      type={
                        learnedKeys.includes(selectedKey)
                          ? "primary"
                          : "default"
                      }
                      onClick={() => toggleLearned(selectedKey)}
                      icon={<StarFilled />}
                      style={{ borderRadius: 20 }}
                    >
                      {learnedKeys.includes(selectedKey)
                        ? "Đã thuộc"
                        : "Đánh dấu thuộc"}
                    </Button>
                  </Space>
                </div>

                <div
                  style={{
                    background: "#fcfaf2",
                    padding: "12px",
                    borderRadius: "16px",
                    marginBottom: 30,
                    display: "flex",
                    justifyContent: "center",
                    gap: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <Space split={<Divider type="vertical" />}>
                    <Space>
                      <Switch
                        size="small"
                        checked={testMode}
                        onChange={setTestMode}
                        disabled={isFlashcardMode}
                      />
                    </Space>
                    <Space>
                      <Button
                        size="small"
                        shape="circle"
                        icon={<MinusCircleOutlined />}
                        onClick={() => setFontSize((f) => Math.max(12, f - 2))}
                      />
                      <Text strong style={{ width: 40, textAlign: "center" }}>
                        {fontSize}px
                      </Text>
                      <Button
                        size="small"
                        shape="circle"
                        icon={<PlusCircleOutlined />}
                        onClick={() => setFontSize((f) => Math.min(32, f + 2))}
                      />
                    </Space>
                    <Button
                      size="small"
                      type="text"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        setUserAnswers({});
                        setIsFlipped(false);
                      }}
                    ></Button>
                  </Space>
                </div>

                <div style={{ minHeight: "400px" }}>
                  {renderContent(currentPrayer.content)}
                </div>

                <Divider style={{ margin: "40px 0 20px" }} />
                <div style={{ textAlign: "center", opacity: 0.6 }}>
                  <Text italic>
                    "Lạy Chúa, xin mở môi con, cho con vang lời ca tụng Chúa."
                  </Text>
                </div>
              </Card>
            ) : (
              <Empty
                description="Chọn một bài kinh để bắt đầu"
                style={{ marginTop: 100 }}
              />
            )}
          </Content>

          {/* Footer sẽ nằm dưới cùng của luồng Content, không bị Sidebar đè */}
          <footer
            style={{
              textAlign: "center",
              padding: "24px",
              opacity: 0.5,
              fontSize: "12px",
            }}
          >
            © 2026 Giáo xứ Đồng Quan - Ứng dụng hỗ trợ học tập
          </footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Prayers;
