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
  FileDoneOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { getPrayers } from "../api/prayerApi";
import { useNavigate } from "react-router-dom";

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { useBreakpoint } = Grid;

const Prayers = () => {
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [prayerData, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState(16);
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

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

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
    document.title = "Kinh Học Mỗi Ngày | Giáo xứ Đồng Quan";
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
          style={{ perspective: "1000px", cursor: "pointer", height: "290px" }}
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
              styles={{ body: { padding: "20px" } }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `2px dashed ${accentGold}`,
                background: "#ffffff",
                borderRadius: "16px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <BookOutlined
                  style={{
                    fontSize: 36,
                    color: accentGold,
                    marginBottom: 12,
                    opacity: 0.6,
                  }}
                />
                <Title
                  level={4}
                  style={{
                    color: primaryNavy,
                    fontFamily: "'Playfair Display', serif",
                    margin: "5px 0",
                    fontSize: "18px",
                  }}
                >
                  Bài: "{currentPrayer?.title}"
                </Title>
                <Text
                  type="secondary"
                  style={{ fontSize: "12px", color: "#64748b" }}
                >
                  Chạm để lật xem nội dung kinh nguyện
                </Text>
              </div>
            </Card>
            <Card
              styles={{ body: { padding: "20px" } }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                overflowY: "auto",
                background: "#ffffff",
                borderRadius: "16px",
                border: `1px solid rgba(212, 175, 55, 0.3)`,
              }}
            >
              <Text
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                  display: "block",
                  color: textDark,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
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
            lineHeight: 1.85,
            color: textDark,
            padding: "0 4px",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          {text}
        </Paragraph>
      );

    return text.split("\n").map((line, lIdx) => (
      <div
        key={lIdx}
        style={{ marginBottom: 14, lineHeight: "3.2", padding: "0 4px" }}
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
                  borderBottom: `2px solid ${userAnswers[gIdx] ? (isCorrect ? "#52c41a" : "#ff4d4f") : accentGold}`,
                  borderTop: "none",
                  borderLeft: "none",
                  borderRight: "none",
                  borderRadius: 0,
                  textAlign: "center",
                  background: "transparent",
                  padding: 0,
                  height: "26px",
                  color: primaryNavy,
                  fontWeight: "600",
                }}
              />
            );
          }
          return (
            <span
              key={wIdx}
              style={{
                fontSize: `${fontSize}px`,
                marginRight: "3px",
                color: textDark,
              }}
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
              fontSize: "13px",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {item.title}
          </span>
          {learnedKeys.includes(item.id) && (
            <CheckCircleFilled style={{ color: accentGold, marginLeft: 8 }} />
          )}
        </div>
      ),
    });

    return [
      {
        key: "sub1",
        label: (
          <b style={{ color: primaryNavy, fontSize: 13 }}>I. KINH SÁNG & TỐI</b>
        ),
        icon: <BookOutlined style={{ color: accentGold }} />,
        children: filter(prayerData.filter((p) => Number(p.id) <= 26)).map(
          renderItem,
        ),
      },
      {
        key: "sub2",
        label: (
          <b style={{ color: primaryNavy, fontSize: 13 }}>II. KINH CHÚA NHẬT</b>
        ),
        icon: <SafetyCertificateOutlined style={{ color: accentGold }} />,
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
        background: "#ffffff",
      }}
    >
      <div style={{ padding: "24px 20px 16px" }}>
        <span className="sider-tag-sub">
          <CompassOutlined /> KINHỌC MỖI NGÀY
        </span>
        <Title
          level={4}
          style={{
            color: primaryNavy,
            fontFamily: "'Playfair Display', serif",
            margin: "4px 0 0 0",
          }}
        >
          DANH MỤC KINH NGUYỆN
        </Title>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
              Tiến độ thuộc lòng
            </Text>
            <Text strong style={{ color: primaryNavy, fontSize: 12 }}>
              {progressPercent}%
            </Text>
          </div>
          <Progress
            percent={progressPercent}
            strokeColor={accentGold}
            trailColor="rgba(27, 54, 93, 0.1)"
            size="small"
            showInfo={false}
          />
        </div>
        <Input
          prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
          placeholder="Tìm tên kinh..."
          style={{
            marginTop: 14,
            borderRadius: 20,
            borderColor: "rgba(212, 175, 55, 0.3)",
          }}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      </div>
      <Divider style={{ margin: 0, borderColor: "rgba(212, 175, 55, 0.15)" }} />
      <div
        style={{ flex: 1, overflowY: "auto", paddingBottom: 20 }}
        className="custom-scrollbar"
      >
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
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 12,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
        components: {
          Menu: {
            itemSelectedBg: "rgba(27, 54, 93, 0.08)",
            itemSelectedColor: primaryNavy,
            itemHoverBg: "rgba(212, 175, 55, 0.08)",
          },
        },
      }}
    >
      <Layout
        style={{ minHeight: "100vh", background: softBg, paddingTop: "20px" }}
      >
        {screens.lg && (
          <Sider
            width={320}
            theme="light"
            style={{
              background: "#ffffff",
              height: "100vh",
              position: "sticky",
              top: 0,
              left: 0,
              boxShadow: "4px 0 20px rgba(27, 54, 93, 0.04)",
              zIndex: 10,
              borderRight: "1px solid rgba(212, 175, 55, 0.25)",
            }}
          >
            {SidebarContent}
          </Sider>
        )}

        <Drawer
          placement="left"
          onClose={() => setIsMobileMenuOpen(false)}
          open={isMobileMenuOpen}
          width={290}
          styles={{ body: { padding: 0 } }}
        >
          {SidebarContent}
        </Drawer>

        <Layout style={{ background: "transparent" }}>
          {!screens.lg && (
            <div
              style={{
                padding: "0 16px",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                position: "sticky",
                top: 0,
                zIndex: 100,
                borderBottom: "1px solid rgba(212, 175, 55, 0.25)",
                boxShadow: "0 4px 12px rgba(27, 54, 93, 0.05)",
                height: "54px",
              }}
            >
              <Button
                type="text"
                icon={
                  <MenuOutlined style={{ color: primaryNavy, fontSize: 18 }} />
                }
                onClick={() => setIsMobileMenuOpen(true)}
              />
              <Title
                level={5}
                style={{
                  margin: "0 0 0 8px",
                  flex: 1,
                  fontSize: "15px",
                  color: primaryNavy,
                  fontFamily: "'Playfair Display', serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {currentPrayer?.title}
              </Title>
              <Badge
                count={`${progressPercent}%`}
                style={{
                  backgroundColor: accentGold,
                  color: primaryNavy,
                  fontWeight: "bold",
                }}
              />
            </div>
          )}

          <Content
            style={{
              padding: screens.xs ? "16px 12px" : "36px 32px",
              maxWidth: "850px",
              margin: "0 auto",
              width: "100%",
            }}
          >
            {loading ? (
              <Spin
                size="large"
                style={{
                  display: "flex",
                  margin: "100px auto",
                  justifyContent: "center",
                }}
              />
            ) : currentPrayer ? (
              <Card
                bordered={false}
                className="glhn-prayer-card"
                styles={{ body: { padding: screens.xs ? "16px" : "32px" } }}
              >
                {/* TIÊU ĐỀ & TAGS TRÊN KHUNG KINHN */}
                <div style={{ marginBottom: 16 }}>
                  <Space align="center" style={{ flexWrap: "wrap", rowGap: 4 }}>
                    <Title
                      level={3}
                      style={{
                        color: primaryNavy,
                        fontFamily: "'Playfair Display', Georgia, serif",
                        margin: 0,
                        fontSize: screens.xs ? "20px" : "26px",
                        lineHeight: 1.3,
                        fontWeight: 700,
                      }}
                    >
                      {currentPrayer.title}
                    </Title>
                    {learnedKeys.includes(currentPrayer.id) && (
                      <CheckCircleFilled
                        style={{ color: accentGold, fontSize: "18px" }}
                      />
                    )}
                  </Space>
                  <div style={{ marginTop: 8 }}>
                    <Tag
                      style={{
                        background: "rgba(212, 175, 55, 0.15)",
                        borderColor: accentGold,
                        color: primaryNavy,
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "2px 10px",
                        borderRadius: "12px",
                      }}
                    >
                      Bài {currentPrayer.id}
                    </Tag>
                    {mandatoryKeys.includes(currentPrayer.id) && (
                      <Tag
                        style={{
                          background: "rgba(122, 28, 28, 0.1)",
                          borderColor: "#7A1C1C",
                          color: "#7A1C1C",
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "2px 10px",
                          borderRadius: "12px",
                        }}
                      >
                        Kinh Bắt Buộc
                      </Tag>
                    )}
                  </div>
                </div>

                {/* THANH ĐIỀU KHIỂN CHẾ ĐỘ THÔNG MINH */}
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
                      className="glhn-action-btn"
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
                      className="glhn-action-btn"
                    >
                      AI Khảo bài (Giọng nói)
                    </Button>
                    <Button
                      type="default"
                      size="small"
                      icon={<FileDoneOutlined />}
                      onClick={() => navigate("/exam-prayer")}
                      className="glhn-action-btn"
                    >
                      Kiểm tra kinh
                    </Button>
                    <Button
                      type={
                        learnedKeys.includes(selectedKey)
                          ? "primary"
                          : "default"
                      }
                      size="small"
                      onClick={() => toggleLearned(selectedKey)}
                      icon={
                        <StarFilled
                          style={{
                            color: learnedKeys.includes(selectedKey)
                              ? accentGold
                              : undefined,
                          }}
                        />
                      }
                      className="glhn-action-btn"
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
                      gap: "8px",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        fontWeight: 600,
                      }}
                    >
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
                          width: 80,
                          fontSize: "12px",
                          color: primaryNavy,
                          fontWeight: "600",
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
                      icon={
                        <MinusCircleOutlined style={{ color: primaryNavy }} />
                      }
                      onClick={() => setFontSize((f) => Math.max(14, f - 1))}
                    />
                    <Text
                      style={{
                        fontSize: "12px",
                        minWidth: "32px",
                        textAlign: "center",
                        fontWeight: "600",
                        color: primaryNavy,
                      }}
                    >
                      {fontSize}px
                    </Text>
                    <Button
                      size="small"
                      type="text"
                      icon={
                        <PlusCircleOutlined style={{ color: primaryNavy }} />
                      }
                      onClick={() => setFontSize((f) => Math.min(26, f + 1))}
                    />
                    <Divider
                      type="vertical"
                      style={{
                        margin: "0 2px",
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      }}
                    />
                    <Button
                      size="small"
                      type="text"
                      icon={
                        <ReloadOutlined
                          style={{ fontSize: "12px", color: primaryNavy }}
                        />
                      }
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

                {/* KHU VỰC HIỂN THỊ CHÍNH / AI KHẢO BÀI GIỌNG NÓI */}
                <div style={{ minHeight: "280px", paddingTop: "8px" }}>
                  {dictationMode ? (
                    <div style={{ animation: "fadeIn 0.3s ease" }}>
                      <Card
                        style={{
                          background: softBg,
                          border: `1px solid rgba(212, 175, 55, 0.3)`,
                          borderRadius: "14px",
                        }}
                        styles={{ body: { padding: "16px" } }}
                      >
                        {/* NÚT MICRO AI KHẢO BÀI */}
                        <div
                          style={{
                            textAlign: "center",
                            padding: "12px 0 20px",
                          }}
                        >
                          <Button
                            type={isListening ? "primary" : "default"}
                            danger={isListening}
                            shape="circle"
                            icon={
                              isListening ? (
                                <AudioMutedOutlined style={{ fontSize: 26 }} />
                              ) : (
                                <AudioOutlined
                                  style={{ fontSize: 26, color: accentGold }}
                                />
                              )
                            }
                            onClick={
                              isListening ? stopListening : startListening
                            }
                            style={{
                              width: 70,
                              height: 70,
                              boxShadow: "0 6px 20px rgba(27, 54, 93, 0.15)",
                              backgroundColor: isListening
                                ? undefined
                                : primaryNavy,
                              borderColor: accentGold,
                            }}
                            className={isListening ? "pulse-button" : ""}
                          />
                          <div style={{ marginTop: 12 }}>
                            <Text
                              strong
                              style={{
                                fontSize: "13px",
                                color: isListening ? "#ff4d4f" : primaryNavy,
                              }}
                            >
                              {isListening
                                ? "AI ĐANG NGHE... MỜI BẠN ĐỌC KINH"
                                : "BẤM VÀO MICRO ĐỂ BẮT ĐẦU ĐỌC KHẢO BÀI"}
                            </Text>
                          </div>
                        </div>

                        {/* HIỂN THỊ TEXT NHẬN DẠNG */}
                        <Input.TextArea
                          autoSize={{ minRows: 4, maxRows: 10 }}
                          value={dictationText}
                          readOnly
                          placeholder="Lời kinh bạn đọc (âm thanh) sẽ hiển thị trực tiếp tại đây..."
                          style={{
                            fontSize: "15px",
                            borderRadius: "10px",
                            background: isListening ? "#ffffff" : "#ffffff",
                            lineHeight: "1.6",
                            padding: "12px",
                            border: `1px solid ${isListening ? accentGold : "rgba(27, 54, 93, 0.15)"}`,
                            color: textDark,
                          }}
                        />

                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          style={{
                            marginTop: 16,
                            width: "100%",
                            height: "44px",
                            borderRadius: "10px",
                            fontWeight: "700",
                            backgroundColor: primaryNavy,
                          }}
                          onClick={() => {
                            stopListening();
                            calculateScore();
                          }}
                          disabled={!dictationText.trim()}
                        >
                          CHẤM ĐIỂM GIỌNG ĐỌC AI
                        </Button>
                      </Card>

                      {/* BẢNG ĐỐI CHIẾU THÔNG MINH */}
                      {score !== null && (
                        <div
                          style={{
                            paddingTop: "16px",
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
                              <div style={{ padding: "4px 0" }}>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: 6,
                                  }}
                                >
                                  <Text
                                    strong
                                    style={{
                                      fontSize: "14px",
                                      color: primaryNavy,
                                    }}
                                  >
                                    Kết quả độ chính xác:
                                  </Text>
                                  <Text
                                    strong
                                    style={{
                                      fontSize: "15px",
                                      color: primaryNavy,
                                    }}
                                  >
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
                                        ? accentGold
                                        : "#ff4d4f"
                                  }
                                />

                                <Divider
                                  style={{
                                    margin: "14px 0 10px",
                                    borderColor: "rgba(212, 175, 55, 0.2)",
                                  }}
                                />

                                <div style={{ marginBottom: "10px" }}>
                                  <Text
                                    strong
                                    style={{
                                      display: "block",
                                      marginBottom: "8px",
                                      fontSize: "12px",
                                      color: primaryNavy,
                                    }}
                                  >
                                    🔍 Chi tiết đối chiếu (Từ đọc chưa chuẩn sẽ
                                    có gạch ngang đỏ):
                                  </Text>

                                  <div
                                    style={{
                                      background: "#ffffff",
                                      padding: "12px",
                                      borderRadius: "10px",
                                      border:
                                        "1px solid rgba(27, 54, 93, 0.12)",
                                      maxHeight: "200px",
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
                                              fontWeight: "600",
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
                                              padding: "2px 6px",
                                              display: "inline-flex",
                                              flexDirection: "column",
                                              alignItems: "center",
                                              lineHeight: "1.2",
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
                                                color: primaryNavy,
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
                                    marginTop: 10,
                                    color: primaryNavy,
                                  }}
                                >
                                  {score >= 90
                                    ? "🌟 Rất tuyệt vời! Bạn đọc thuộc lòng chuẩn xác từng câu kinh!"
                                    : score >= 60
                                      ? "👍 Rất tốt, hãy xem lại các từ màu đỏ để đọc trôi chảy hơn nhé."
                                      : "📖 Hãy dành thêm chút thời gian xem kỹ lại mặt chữ và thử lại!"}
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

                <Divider
                  style={{
                    margin: "24px 0 12px",
                    borderColor: "rgba(212, 175, 55, 0.2)",
                  }}
                />
                <div style={{ textAlign: "center", opacity: 0.7 }}>
                  <Text
                    italic
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    "Lạy Chúa, xin mở môi con, cho con vang lời ca tụng Chúa."
                  </Text>
                </div>
              </Card>
            ) : (
              <Empty
                description="Chọn một bài kinh từ danh mục để bắt đầu học"
                style={{ marginTop: 100 }}
              />
            )}
          </Content>

          <footer
            style={{
              textAlign: "center",
              padding: "20px",
              opacity: 0.6,
              fontSize: "11px",
              color: "#64748b",
            }}
          >
            © 2026 GIÁO XỨ ĐỒNG QUAN — Ban Mục vụ Gia đình & Tân Tòng
          </footer>
        </Layout>
      </Layout>

      {/* STYLES SCOPED */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

        .sider-tag-sub {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: ${accentGold};
          font-weight: 700;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .glhn-prayer-card {
          border-radius: 20px !important;
          box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
          border: 1px solid rgba(212, 175, 55, 0.25) !important;
          background: #ffffff !important;
        }

        .mobile-action-scroll-wrapper {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          margin-bottom: 12px;
          padding: 4px 0;
        }

        .mobile-action-scroll-wrapper::-webkit-scrollbar { display: none; }

        .mobile-action-scroll-content {
          display: flex;
          gap: 8px;
          white-space: nowrap;
          width: max-content;
        }

        .glhn-action-btn {
          border-radius: 20px !important;
          font-weight: 600 !important;
          font-size: 12px !important;
          height: 32px !important;
        }

        .mobile-sub-control-panel {
          background: ${softBg};
          padding: 8px 12px;
          border-radius: 10px;
          margin-bottom: 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .pulse-button {
          animation: pulseMobile 1.4s infinite;
        }

        @keyframes pulseMobile {
          0% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.5); }
          70% { box-shadow: 0 0 0 14px rgba(255, 77, 79, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(212, 175, 55, 0.3); 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${accentGold}; }

        @media (max-width: 480px) {
          .glhn-prayer-card .ant-card-body { padding: 14px 10px !important; }
        }
      `,
        }}
      />
    </ConfigProvider>
  );
};

export default Prayers;
