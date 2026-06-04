import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Progress,
  Divider,
  Tag,
  Select,
  Alert,
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
  CheckOutlined,
  AudioOutlined,
  AudioMutedOutlined,
} from "@ant-design/icons";
import { getPrayers } from "../api/prayerApi";

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const Prayers = () => {
  const screens = useBreakpoint();
  const [prayerData, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(16); // Giảm font mặc định một chút cho mobile cân đối
  const [selectedKey, setSelectedKey] = useState("1");
  const [openKeys, setOpenKeys] = useState(["sub1"]);
  const [testMode, setTestMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [searchText, setSearchText] = useState("");
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState("easy");

  // Hệ thống AI Khảo bài giọng nói
  const [dictationMode, setDictationMode] = useState(false);
  const [dictationText, setDictationText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [score, setScore] = useState(null);
  const recognitionRef = useRef(null);

  const [learnedKeys, setLearnedKeys] = useState(() => {
    const saved = localStorage.getItem("learned_prayers");
    return saved ? JSON.parse(saved) : [];
  });

  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const softCream = "#fdfbf7";

  const mandatoryKeys = useMemo(
    () => [
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
    ],
    [],
  );
  useEffect(() => {
    document.title = "Kinh học mỗi ngày";
  }, []);
  useEffect(() => {
    fetchPrayers();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "vi-VN";

      rec.onresult = (event) => {
        let resultText = "";
        for (let i = 0; i < event.results.length; i++) {
          resultText += event.results[i][0].transcript + " ";
        }
        setDictationText(resultText);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (e) => {
        console.error("Speech Recognition Error: ", e);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
    };
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
    setDictationText("");
    setScore(null);
    stopListening();
  }, [selectedKey, testMode, isFlashcardMode, dictationMode]);

  const currentPrayer = useMemo(
    () => prayerData.find((item) => item.id === selectedKey),
    [prayerData, selectedKey],
  );

  const progressPercent = useMemo(() => {
    const learnedMandatory = learnedKeys.filter((k) =>
      mandatoryKeys.includes(k),
    ).length;
    return Math.round((learnedMandatory / mandatoryKeys.length) * 100);
  }, [learnedKeys, mandatoryKeys]);

  const handleInputChange = (index, value) => {
    setUserAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const toggleLearned = (key) => {
    setLearnedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const shouldHideWord = (word, index) => {
    if (word.length <= 2) return false;

    switch (difficulty) {
      case "easy":
        return index % 3 === 0;
      case "medium":
        return index % 2 === 0;
      case "hard":
        return index % 2 === 0 || word.length > 5;
      case "expert":
        return word.length > 2;
      default:
        return false;
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Trình duyệt di động này cần sử dụng Google Chrome hoặc Safari để kích hoạt Micro nhận diện giọng nói.",
      );
      return;
    }
    setDictationText("");
    setScore(null);
    setIsListening(true);
    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log(e);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const cleanWord = (w) =>
    w
      ? w
          .toLowerCase()
          .replace(/[.,!?;:()""\n]/g, "")
          .trim()
      : "";

  const calculateScore = () => {
    if (!currentPrayer?.content || !dictationText.trim()) {
      setScore(0);
      return;
    }

    const normalize = (text) =>
      text
        .toLowerCase()
        .replace(/[.,!?;:()""\n]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const originalWords = normalize(currentPrayer.content).split(" ");
    const userWords = normalize(dictationText).split(" ");

    let correct = 0;
    originalWords.forEach((word, index) => {
      if (userWords[index] === word) {
        correct++;
      }
    });

    const percent = Math.round((correct / originalWords.length) * 100);
    setScore(Math.min(100, Math.max(0, percent)));
  };

  const renderContent = (text) => {
    if (isFlashcardMode) {
      return (
        <div
          style={{ perspective: "1000px", cursor: "pointer", height: "280px" }}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              transition: "transform 0.5s",
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "none",
            }}
          >
            <Card
              styles={{ body: { padding: "16px" } }}
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
              <div style={{ textAlign: "center" }}>
                <BookOutlined
                  style={{ fontSize: 32, marginBottom: 10, opacity: 0.3 }}
                />
                <Title
                  level={4}
                  style={{
                    color: deepBrown,
                    margin: "5px 0",
                    fontSize: "16px",
                  }}
                >
                  Bài: "{currentPrayer?.title}"
                </Title>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  Chạm để lật xem nội dung
                </Text>
              </div>
            </Card>
            <Card
              styles={{ body: { padding: "16px" } }}
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
              <Text
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.7,
                  whiteSpace: "pre-line",
                  display: "block",
                  color: "#333",
                }}
              >
                {text}
              </Text>
            </Card>
          </div>
        </div>
      );
    }

    if (!testMode)
      return (
        <Paragraph
          style={{
            fontSize: `${fontSize}px`,
            whiteSpace: "pre-line",
            lineHeight: 1.8,
            color: "#333",
            padding: "0 4px",
          }}
        >
          {text}
        </Paragraph>
      );

    return text.split("\n").map((line, lIdx) => (
      <div
        key={lIdx}
        style={{ marginBottom: 12, lineHeight: "3.2", padding: "0 4px" }}
      >
        {line.split(" ").map((word, wIdx) => {
          const gIdx = `${lIdx}-${wIdx}`;
          if (shouldHideWord(word, wIdx)) {
            const isCorrect =
              cleanWord(userAnswers[gIdx] || "") === cleanWord(word);
            return (
              <Input
                key={wIdx}
                value={userAnswers[gIdx] || ""}
                onChange={(e) => handleInputChange(gIdx, e.target.value)}
                style={{
                  width: `${word.length + 1.2}ch`,
                  minWidth: "48px",
                  fontSize: `${fontSize}px`,
                  margin: "0 3px",
                  borderBottom: `2px solid ${userAnswers[gIdx] ? (isCorrect ? "#52c41a" : "#ff4d4f") : primaryGold}`,
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 0,
                  textAlign: "center",
                  background: "transparent",
                  padding: 0,
                  height: "26px",
                }}
              />
            );
          }
          return (
            <span
              key={wIdx}
              style={{ fontSize: `${fontSize}px`, marginRight: "3px" }}
            >
              {word}
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
      <div style={{ padding: "20px" }}>
        <Title level={4} style={{ color: deepBrown, margin: 0 }}>
          KINH NGUYỆN
        </Title>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Giáo lý hôn nhân
        </Text>
        <div style={{ marginTop: 15 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text strong style={{ fontSize: 12 }}>
              Tiến độ thuộc lòng
            </Text>
            <Text strong style={{ color: primaryGold, fontSize: 12 }}>
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
          style={{ marginTop: 12, borderRadius: 20 }}
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
      theme={{ token: { colorPrimary: primaryGold, borderRadius: 10 } }}
    >
      <Layout style={{ minHeight: "100vh", background: "#F8F5EC" }}>
        {screens.lg && (
          <Sider
            width={300}
            theme="light"
            style={{
              background: "#fff",
              height: "100vh",
              position: "sticky",
              top: 0,
              left: "10%",
              boxShadow: "4px 0 15px rgba(0,0,0,0.02)",
              zIndex: 10,
            }}
          >
            {SidebarContent}
          </Sider>
        )}

        <Drawer
          placement="left"
          onClose={() => setIsMobileMenuOpen(false)}
          open={isMobileMenuOpen}
          width={280}
          styles={{ body: { padding: 0 } }}
        >
          {SidebarContent}
        </Drawer>

        <Layout style={{ background: "transparent" }}>
          {!screens.lg && (
            <div
              style={{
                padding: "0 14px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 100,
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                height: "50px",
              }}
            >
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ fontSize: "18px" }}
              />
              <Title
                level={5}
                style={{
                  margin: "0 0 0 8px",
                  flex: 1,
                  fontSize: "15px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
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
              padding: screens.xs ? "8px" : "24px",
              maxWidth: "800px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {loading ? (
              <Spin
                size="large"
                className="loading-prayer"
                style={{
                  display: "flex",
                  margin: "80px auto",
                  justifyContent: "center",
                }}
              />
            ) : currentPrayer ? (
              <Card
                bordered={false}
                className="mobile-prayer-card"
                styles={{ body: { padding: screens.xs ? "12px" : "24px" } }}
                style={{
                  boxShadow: "0 4px 20px rgba(93, 64, 55, 0.02)",
                  borderRadius: "16px",
                }}
              >
                {/* TIÊU ĐỀ & TAGS TRÊN MOBILE */}
                <div style={{ marginBottom: 12 }}>
                  <Space align="center" style={{ flexWrap: "wrap", rowGap: 2 }}>
                    <Title
                      level={3}
                      style={{
                        color: deepBrown,
                        margin: 0,
                        fontSize: screens.xs ? "18px" : "22px",
                        lineHeight: 1.3,
                      }}
                    >
                      {currentPrayer.title}
                    </Title>
                    {learnedKeys.includes(currentPrayer.id) && (
                      <CheckCircleFilled
                        style={{ color: "#52c41a", fontSize: "16px" }}
                      />
                    )}
                  </Space>
                  <div style={{ marginTop: 4 }}>
                    <Tag
                      color="gold"
                      style={{ fontSize: "11px", padding: "0 6px" }}
                    >
                      Mã: {currentPrayer.id}
                    </Tag>
                    {mandatoryKeys.includes(currentPrayer.id) && (
                      <Tag
                        color="volcano"
                        style={{ fontSize: "11px", padding: "0 6px" }}
                      >
                        Bắt buộc
                      </Tag>
                    )}
                  </div>
                </div>

                {/* THANH ĐIỀU KHIỂN CHẾ ĐỘ CUỘN NGANG (SCROLLABLE TOOLBAR) TRÊN MOBILE */}
                <div className="mobile-action-scroll-wrapper">
                  <div className="mobile-action-scroll-content">
                    <Button
                      type={isFlashcardMode ? "primary" : "default"}
                      size="small"
                      icon={<SwapOutlined />}
                      onClick={() => {
                        setIsFlashcardMode(!isFlashcardMode);
                        setDictationMode(false);
                      }}
                      style={{ borderRadius: "14px" }}
                    >
                      Thẻ ghi nhớ
                    </Button>

                    <Button
                      type={dictationMode ? "primary" : "default"}
                      size="small"
                      icon={<AudioOutlined />}
                      onClick={() => {
                        setDictationMode(!dictationMode);
                        setIsFlashcardMode(false);
                        setTestMode(false);
                      }}
                      style={{ borderRadius: "14px" }}
                    >
                      AI Khảo bài (Giọng nói)
                    </Button>

                    <Button
                      type={
                        learnedKeys.includes(selectedKey)
                          ? "primary"
                          : "default"
                      }
                      size="small"
                      onClick={() => toggleLearned(selectedKey)}
                      icon={<StarFilled />}
                      style={{ borderRadius: "14px" }}
                    >
                      {learnedKeys.includes(selectedKey)
                        ? "Đã thuộc"
                        : "Đánh dấu thuộc"}
                    </Button>
                  </div>
                </div>

                {/* CÀI ĐẶT ĐỘ KHÓ & CỠ CHỮ PHỤ */}
                <div className="mobile-sub-control-panel">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Text style={{ fontSize: "12px" }} type="secondary">
                      Điền từ:
                    </Text>
                    <Switch
                      size="small"
                      checked={testMode}
                      onChange={(val) => {
                        setTestMode(val);
                        if (val) setDictationMode(false);
                      }}
                      disabled={isFlashcardMode || dictationMode}
                    />
                    {testMode && (
                      <Select
                        value={difficulty}
                        size="small"
                        bordered={false}
                        style={{
                          width: 75,
                          fontSize: "12px",
                          color: primaryGold,
                        }}
                        onChange={setDifficulty}
                      >
                        <Option value="easy">Dễ</Option>
                        <Option value="medium">Vừa</Option>
                        <Option value="hard">Khó</Option>
                      </Select>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Button
                      size="small"
                      type="text"
                      icon={<MinusCircleOutlined />}
                      onClick={() => setFontSize((f) => Math.max(14, f - 1))}
                    />
                    <Text
                      style={{
                        fontSize: "12px",
                        minWidth: "30px",
                        textAlign: "center",
                      }}
                    >
                      {fontSize}px
                    </Text>
                    <Button
                      size="small"
                      type="text"
                      icon={<PlusCircleOutlined />}
                      onClick={() => setFontSize((f) => Math.min(26, f + 1))}
                    />
                    <Divider type="vertical" style={{ margin: "0 2px" }} />
                    <Button
                      size="small"
                      type="text"
                      icon={<ReloadOutlined style={{ fontSize: "12px" }} />}
                      onClick={() => {
                        setUserAnswers({});
                        setIsFlipped(false);
                        setDictationText("");
                        setScore(null);
                        stopListening();
                      }}
                    />
                  </div>
                </div>

                {/* KHU VỰC HIỂN THỊ CHÍNH / KHẢO BÀI */}
                <div style={{ minHeight: "260px", paddingTop: "6px" }}>
                  {dictationMode ? (
                    <div style={{ animation: "fadeIn 0.3s ease" }}>
                      <Card
                        style={{
                          background: "#fdfbf7",
                          border: `1px solid #f2edd5`,
                          borderRadius: "10px",
                        }}
                        styles={{ body: { padding: "12px" } }}
                      >
                        {/* THIẾT KẾ LẠI NÚT MICRO TO, DỄ CHẠM TRÊN MOBILE */}
                        <div
                          style={{ textAlign: "center", padding: "8px 0 16px" }}
                        >
                          <Button
                            type={isListening ? "primary" : "default"}
                            danger={isListening}
                            shape="circle"
                            icon={
                              isListening ? (
                                <AudioMutedOutlined style={{ fontSize: 24 }} />
                              ) : (
                                <AudioOutlined style={{ fontSize: 24 }} />
                              )
                            }
                            onClick={
                              isListening ? stopListening : startListening
                            }
                            style={{
                              width: 64,
                              height: 64,
                              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                            className={isListening ? "pulse-button" : ""}
                          />
                          <div style={{ marginTop: 8 }}>
                            <Text
                              strong
                              style={{
                                fontSize: "13px",
                                color: isListening ? "#ff4d4f" : deepBrown,
                              }}
                            >
                              {isListening
                                ? "AI ĐANG NGHE... MỜI BẠN ĐỌC KINH"
                                : "BẤM VÀO MICRO ĐỂ ĐỌC KHẢO BÀI"}
                            </Text>
                          </div>
                        </div>

                        {/* INPUT TỰ CO GIÃN THEO TEXT TRÊN PHONE */}
                        <Input.TextArea
                          autoSize={{ minRows: 4, maxRows: 10 }}
                          value={dictationText}
                          readOnly
                          placeholder="Chữ bạn đọc (abc) sẽ tự động xuất hiện tại đây..."
                          style={{
                            fontSize: "15px",
                            borderRadius: "8px",
                            background: isListening ? "#fafafa" : "#fff",
                            lineHeight: "1.5",
                            padding: "10px",
                            border: `1px solid ${isListening ? primaryGold : "#d9d9d9"}`,
                          }}
                        />

                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          style={{
                            marginTop: 12,
                            width: "100%",
                            height: "40px",
                            borderRadius: "8px",
                          }}
                          onClick={() => {
                            stopListening();
                            calculateScore();
                          }}
                          disabled={!dictationText.trim()}
                        >
                          Chấm điểm giọng đọc
                        </Button>
                      </Card>

                      {/* BẢNG ĐỐI CHIẾU THÔNG MINH KHÔNG VỠ CHỮ TRÊN ĐIỆN THOẠI */}
                      {score !== null && (
                        <div
                          style={{
                            paddingTop: "12px",
                            animation: "fadeInUp 0.3s ease",
                          }}
                        >
                          <Alert
                            type={
                              score >= 80
                                ? "success"
                                : score >= 50
                                  ? "warning"
                                  : "error"
                            }
                            message={
                              <div style={{ padding: "2px 0" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 4,
                                  }}
                                >
                                  <Text strong style={{ fontSize: "14px" }}>
                                    Độ chính xác:
                                  </Text>
                                  <Text strong style={{ fontSize: "14px" }}>
                                    {score}%
                                  </Text>
                                </div>
                                <Progress
                                  percent={score}
                                  size="small"
                                  status={
                                    score >= 80
                                      ? "success"
                                      : score >= 50
                                        ? "active"
                                        : "exception"
                                  }
                                  strokeColor={
                                    score >= 80
                                      ? "#52c41a"
                                      : score >= 50
                                        ? primaryGold
                                        : "#ff4d4f"
                                  }
                                />

                                <Divider style={{ margin: "12px 0 8px" }} />

                                <div style={{ marginBottom: "10px" }}>
                                  <Text
                                    strong
                                    style={{
                                      display: "block",
                                      marginBottom: "6px",
                                      fontSize: "12px",
                                    }}
                                  >
                                    🔍 Chi tiết lỗi sai (Đỏ gạch ngang là đọc
                                    thiếu/sai):
                                  </Text>

                                  {/* Tách từ dạng Tag giúp hiển thị hoàn hảo trên Mobile, tự xuống dòng đẹp mắt */}
                                  <div
                                    style={{
                                      background: "#fff",
                                      padding: "10px",
                                      borderRadius: "8px",
                                      border: "1px solid #e8e8e8",
                                      maxHeight: "180px",
                                      overflowY: "auto",
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: "6px 4px",
                                    }}
                                  >
                                    {currentPrayer.content
                                      .split(/\s+/)
                                      .map((origWord, idx) => {
                                        const userWordsArr = dictationText
                                          .trim()
                                          .split(/\s+/);
                                        const isCorrect =
                                          cleanWord(origWord) ===
                                          cleanWord(userWordsArr[idx]);

                                        return isCorrect ? (
                                          <span
                                            key={idx}
                                            style={{
                                              color: "#52c41a",
                                              fontSize: "14px",
                                              fontWeight: "500",
                                              padding: "2px 4px",
                                            }}
                                          >
                                            {origWord}
                                          </span>
                                        ) : (
                                          <span
                                            key={idx}
                                            style={{
                                              background: "#fff0f6",
                                              border: "1px solid #ffadd2",
                                              borderRadius: "4px",
                                              padding: "1px 4px",
                                              display: "inline-flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                              lineHeight: "1.1",
                                            }}
                                          >
                                            <span
                                              style={{
                                                textDecoration: "line-through",
                                                color: "#ff4d4f",
                                                fontSize: "12px",
                                              }}
                                            >
                                              {userWordsArr[idx] || "___"}
                                            </span>
                                            <span
                                              style={{
                                                color: deepBrown,
                                                fontSize: "11px",
                                                fontWeight: "bold",
                                              }}
                                            >
                                              {origWord}
                                            </span>
                                          </span>
                                        );
                                      })}
                                  </div>
                                </div>

                                <Text
                                  italic
                                  style={{
                                    display: "block",
                                    textAlign: "center",
                                    fontSize: "12px",
                                    marginTop: 8,
                                    color: deepBrown,
                                  }}
                                >
                                  {score >= 90
                                    ? "🌟 Tuyệt vời! Bạn đọc chuẩn xác, đã thuộc lòng!"
                                    : score >= 60
                                      ? "👍 Khá tốt, hãy luyện lại các từ bị đỏ nhé."
                                      : "📖 Bạn cần xem kỹ lại mặt chữ và thử lại!"}
                                </Text>
                              </div>
                            }
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    renderContent(currentPrayer.content)
                  )}
                </div>

                <Divider style={{ margin: "20px 0 10px" }} />
                <div style={{ textAlign: "center", opacity: 0.5 }}>
                  <Text italic style={{ fontSize: "11px" }}>
                    "Lạy Chúa, xin mở môi con, cho con vang lời ca tụng Chúa."
                  </Text>
                </div>
              </Card>
            ) : (
              <Empty
                description="Chọn một bài kinh để bắt đầu"
                style={{ marginTop: 80 }}
              />
            )}
          </Content>

          <footer
            style={{
              textAlign: "center",
              padding: "16px",
              opacity: 0.4,
              fontSize: "11px",
            }}
          >
            © 2026 Giáo xứ Đồng Quan
          </footer>
        </Layout>
      </Layout>

      {/* 📱 CSS ENGINE TỐI ƯU HÓA TRẢI NGHIỆM VUỐT VÀ CHẠM TRÊN ĐIỆN THOẠI */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Khung cuộn ngang mượt mà cho thanh công cụ trên Mobile */
        .mobile-action-scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-bottom: 10px;
          padding: 4px 0;
        }
        
        .mobile-action-scroll-wrapper::-webkit-scrollbar {
          display: none; /* Ẩn thanh cuộn xấu xí trên di động */
        }

        .mobile-action-scroll-content {
          display: flex;
          gap: 8px;
          white-space: nowrap;
          width: max-content;
        }

        /* Bảng điều khiển phụ nhỏ gọn */
        .mobile-sub-control-panel {
          background: #fcfaf2;
          padding: 6px 10px;
          border-radius: 8px;
          margin-bottom: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #f2edd5;
        }

        /* Đèn hiệu ứng vòng tròn Micro */
        .pulse-button {
          animation: pulseMobile 1.4s infinite;
        }

        @keyframes pulseMobile {
          0% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.5); }
          70% { box-shadow: 0 0 0 12px rgba(255, 77, 79, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        /* Ép tối ưu hóa lề khi chạy thực tế trên màn hình cực nhỏ (iPhone SE,...) */
        @media (max-width: 480px) {
          .mobile-prayer-card .ant-card-body {
            padding: 10px 8px !important;
          }
          .ant-tabs-nav {
            margin-bottom: 8px !important;
          }
        }
      `,
        }}
      />
    </ConfigProvider>
  );
};

export default Prayers;
