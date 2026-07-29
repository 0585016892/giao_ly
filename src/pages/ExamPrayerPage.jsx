import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  Layout,
  Card,
  Typography,
  Input,
  Button,
  Select,
  Space,
  Tag,
  Progress,
  Alert,
  Result,
  Divider,
  message,
  Row,
  Col,
  Statistic,
  Modal,
  Tooltip,
  Popconfirm,
  ConfigProvider,
} from "antd";

import {
  CheckCircleFilled,
  FileDoneOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
  CopyOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  ClockCircleOutlined,
  SoundOutlined,
  AudioOutlined,
  EyeOutlined,
  SaveOutlined,
  CompassOutlined,
} from "@ant-design/icons";

import { getPrayers } from "../api/prayerApi";
import { submitExamResult } from "../api/examResultApi";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ExamPrayerPage = () => {
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Step: info | exam | result
  const [step, setStep] = useState("info");

  const [examInfo, setExamInfo] = useState({
    fullName: "",
    className: "",
    parish: "",
  });

  const [selectedBatch, setSelectedBatch] = useState(null);

  // MÃ TRA CỨU
  const [examCode, setExamCode] = useState("");
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Lưu nội dung tự luận { [prayerId]: "Nội dung" }
  const [userEssays, setUserEssays] = useState({});

  // State cho Đọc giọng nói (Speech-to-Text)
  const [listeningPrayerId, setListeningPrayerId] = useState(null);
  const recognitionRef = useRef(null);

  // Timer
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Modal Đối chiếu
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  // Hàm chuyển các con số lẻ & số nguyên thành chữ tiếng Việt
  const convertNumbersToWords = (text) => {
    if (!text) return "";
    const numberMap = {
      0: "không",
      1: "một",
      2: "hai",
      3: "ba",
      4: "bốn",
      5: "năm",
      6: "sáu",
      7: "bảy",
      8: "tám",
      9: "chín",
      10: "mười",
    };

    return text.replace(
      /\b(10|[0-9])\b/g,
      (match) => numberMap[match] || match,
    );
  };

  const generateExamCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomStr = "";
    for (let i = 0; i < 6; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `EXAM-${randomStr}`;
  };

  useEffect(() => {
    document.title = "Khảo Kinh Theo Đợt | Giáo xứ Đồng Quan";
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
    } catch (error) {
      console.error("Lỗi lấy danh sách kinh:", error);
      message.error("Không thể tải danh sách bài kinh");
    } finally {
      setLoading(false);
    }
  };

  const batchOptions = useMemo(() => {
    const batches = Array.from(
      new Set(prayers.map((item) => item.exam_session || "Không có đợt nào")),
    );
    return batches.map((b) => ({ value: b, label: `Đợt kiểm tra: ${b}` }));
  }, [prayers]);

  const batchPrayers = useMemo(() => {
    if (!selectedBatch) return [];
    return prayers.filter(
      (item) => (item.exam_session || "Đợt 1") === selectedBatch,
    );
  }, [prayers, selectedBatch]);

  // AUTO SAVE DRAFT
  const handleEssayChange = (prayerId, text) => {
    const convertedText = convertNumbersToWords(text);
    const updated = { ...userEssays, [prayerId]: convertedText };
    setUserEssays(updated);

    if (selectedBatch) {
      const draftKey = `exam_draft_${selectedBatch}_${examInfo.fullName.trim()}`;
      localStorage.setItem(draftKey, JSON.stringify(updated));
    }
  };

  const clearDraft = useCallback(() => {
    if (selectedBatch) {
      const draftKey = `exam_draft_${selectedBatch}_${examInfo.fullName.trim()}`;
      localStorage.removeItem(draftKey);
    }
  }, [selectedBatch, examInfo.fullName]);

  // SPEECH TO TEXT
  const toggleListening = (prayerId) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      message.error(
        "Trình duyệt của bạn không hỗ trợ nhận diện giọng nói! Vui lòng dùng Google Chrome hoặc Safari.",
      );
      return;
    }

    if (listeningPrayerId === prayerId) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setListeningPrayerId(null);
      message.info("Đã tắt nhận diện giọng nói.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListeningPrayerId(prayerId);
      message.success("Đã bật Micro! Hãy đọc thuộc lòng bài kinh...");
    };

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      const convertedTranscript = convertNumbersToWords(transcript);

      setUserEssays((prev) => {
        const currentText = prev[prayerId] || "";
        const newText = currentText
          ? `${currentText} ${convertedTranscript}`
          : convertedTranscript;

        if (selectedBatch) {
          const draftKey = `exam_draft_${selectedBatch}_${examInfo.fullName.trim()}`;
          localStorage.setItem(
            draftKey,
            JSON.stringify({ ...prev, [prayerId]: newText }),
          );
        }

        return { ...prev, [prayerId]: newText };
      });
    };

    recognition.onerror = (event) => {
      console.error("Lỗi Micro:", event.error);
      if (event.error !== "no-speech") {
        message.error("Lỗi nhận diện giọng nói: " + event.error);
        setListeningPrayerId(null);
      }
    };

    recognition.onend = () => {
      setListeningPrayerId(null);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const completedCount = useMemo(() => {
    return Object.values(userEssays).filter(
      (val) => val && val.trim().length > 0,
    ).length;
  }, [userEssays]);

  const startExam = () => {
    if (!examInfo.fullName.trim()) {
      message.warning("Vui lòng nhập họ và tên");
      return;
    }

    if (!selectedBatch) {
      message.warning("Vui lòng chọn đợt kiểm tra");
      return;
    }

    const newCode = generateExamCode();
    setExamCode(newCode);

    const draftKey = `exam_draft_${selectedBatch}_${examInfo.fullName.trim()}`;
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setUserEssays(parsed);
        message.success("Đã tự động khôi phục bản nháp bài làm gần nhất!");
      } catch (e) {
        setUserEssays({});
      }
    } else {
      setUserEssays({});
    }

    setResult(null);
    setIsCodeModalOpen(true);
  };

  const handleConfirmStart = () => {
    setIsCodeModalOpen(false);
    setStep("exam");

    const totalSeconds = Math.max(batchPrayers.length * 300, 300);
    setTimeLeft(totalSeconds);
  };

  // NỘP BÀI THI
  const submitExam = useCallback(async () => {
    if (batchPrayers.length === 0) return;

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setListeningPrayerId(null);
    }

    clearInterval(timerRef.current);

    const payload = {
      fullName: examInfo.fullName,
      className: examInfo.className,
      parish: examInfo.parish,
      batch: selectedBatch,
      exam_session: selectedBatch,
      exam_code: examCode,
      answers: batchPrayers.map((prayer) => ({
        prayerId: isNaN(Number(prayer.id)) ? prayer.id : Number(prayer.id),
        prayerTitle: prayer.title,
        originalContent: prayer.content || "",
        userContent: userEssays[prayer.id] || "",
      })),
    };

    try {
      setSubmitting(true);
      const res = await submitExamResult(payload);
      const backendData = res?.data?.data || res?.data || res;

      const resultData = {
        fullName: backendData?.fullName || examInfo.fullName,
        batch: backendData?.batch || backendData?.batch_name || selectedBatch,
        exam_code: backendData?.exam_code || examCode,
        score: Number(backendData?.score ?? 0),
        feedback: backendData?.feedback || "",
        details: backendData?.details || payload.answers,
      };

      setResult(resultData);
      setStep("result");

      clearDraft();
      message.success("Nộp bài kiểm tra thành công");
    } catch (error) {
      console.error("Submit exam error:", error);
      message.error(error?.response?.data?.message || "Không thể gửi kết quả");
    } finally {
      setSubmitting(false);
    }
  }, [batchPrayers, examInfo, selectedBatch, examCode, userEssays, clearDraft]);

  // Luôn lưu submitExam mới nhất vào Ref để Timer sử dụng an toàn không bị re-trigger useEffect
  const submitExamRef = useRef(submitExam);
  useEffect(() => {
    submitExamRef.current = submitExam;
  }, [submitExam]);

  // TIMER EFFECT
  useEffect(() => {
    if (step === "exam" && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            message.error("Hết giờ làm bài! Tự động nộp bài làm.");
            submitExamRef.current(); // Gọi qua Ref an toàn
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      message.warning("Trình duyệt không hỗ trợ đọc bài kinh mẫu");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
    message.info("Đang đọc mẫu bài kinh...");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    message.success("Đã sao chép mã!");
  };

  const resetExam = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    clearInterval(timerRef.current);
    setStep("info");
    setExamInfo({ fullName: "", className: "", parish: "" });
    setSelectedBatch(null);
    setUserEssays({});
    setExamCode("");
    setResult(null);
  };

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
      <Layout className="exam-prayer-editorial-layout">
        <Content className="exam-prayer-wrapper">
          <div className="exam-prayer-container">
            {/* HEADER KHẢO KINH */}
            <div className="exam-prayer-header">
              <span className="exam-tag-sacred">
                <CompassOutlined /> HỆ THỐNG KIỂM TRA MỤC VỤ
              </span>
              <Title level={2} className="exam-main-title">
                KIỂM TRA KINH THEO ĐỢT
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="exam-sub-title">
                Chương trình kiểm tra đọc thuộc lòng kinh nguyện dành cho học
                viên Giáo lý Hôn nhân & Dự tòng.
              </Paragraph>
            </div>

            {/* BƯỚC 1: THÔNG TIN THÍ SÍNH */}
            {step === "info" && (
              <Card bordered={false} className="exam-info-card">
                <Title level={3} className="card-section-title">
                  Thông tin người kiểm tra
                </Title>
                <Paragraph className="card-section-desc">
                  Vui lòng điền đầy đủ họ tên và chọn đúng Đợt kiểm tra quy định
                  trước khi mở đề.
                </Paragraph>
                <Divider style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Text strong className="field-label">
                      Họ và tên thí sinh *
                    </Text>
                    <Input
                      size="large"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={examInfo.fullName}
                      onChange={(e) =>
                        setExamInfo((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className="glhn-input-box"
                    />
                  </Col>

                  <Col xs={24} md={12}>
                    <Text strong className="field-label">
                      Lớp Giáo lý
                    </Text>
                    <Input
                      size="large"
                      placeholder="Ví dụ: Lớp Hôn nhân Khóa 01"
                      value={examInfo.className}
                      onChange={(e) =>
                        setExamInfo((prev) => ({
                          ...prev,
                          className: e.target.value,
                        }))
                      }
                      className="glhn-input-box"
                    />
                  </Col>

                  <Col xs={24}>
                    <Text strong className="field-label">
                      Giáo xứ trực thuộc
                    </Text>
                    <Input
                      size="large"
                      placeholder="Ví dụ: Giáo xứ Đồng Quan"
                      value={examInfo.parish}
                      onChange={(e) =>
                        setExamInfo((prev) => ({
                          ...prev,
                          parish: e.target.value,
                        }))
                      }
                      className="glhn-input-box"
                    />
                  </Col>

                  <Col xs={24}>
                    <Text strong className="field-label">
                      Chọn Đợt Kiểm Tra *
                    </Text>
                    <Select
                      size="large"
                      loading={loading}
                      placeholder="Chọn đợt kiểm tra"
                      value={selectedBatch}
                      onChange={setSelectedBatch}
                      options={batchOptions}
                      style={{ width: "100%", marginTop: 6 }}
                    />
                  </Col>
                </Row>

                {selectedBatch && (
                  <Alert
                    type="info"
                    showIcon
                    style={{
                      marginTop: 24,
                      borderRadius: 12,
                      border: "1px solid rgba(212, 175, 55, 0.3)",
                    }}
                    message={
                      <Text strong style={{ color: primaryNavy }}>
                        Đã chọn: {selectedBatch} ({batchPrayers.length} bài kinh
                        cần kiểm tra)
                      </Text>
                    }
                    description={
                      <div style={{ marginTop: 6 }}>
                        <Text style={{ fontSize: 13, color: "#64748b" }}>
                          Danh sách các bài kinh trong đợt:
                        </Text>
                        <ul
                          style={{
                            marginTop: 6,
                            paddingLeft: 20,
                            color: textDark,
                          }}
                        >
                          {batchPrayers.map((p) => (
                            <li key={p.id}>
                              <strong>{p.title}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    }
                  />
                )}

                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<FileDoneOutlined />}
                  onClick={startExam}
                  className="start-exam-btn"
                >
                  BẮT ĐẦU LÀM BÀI
                </Button>
              </Card>
            )}

            {/* BƯỚC 2: LÀM BÀI KHẢO KINH */}
            {step === "exam" && (
              <Card bordered={false} className="exam-doing-card">
                <Space
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <Title level={3} className="exam-doing-title">
                      {selectedBatch}
                    </Title>
                    <Text style={{ color: "#64748b", fontSize: 13 }}>
                      Thí sinh: <strong>{examInfo.fullName}</strong>
                    </Text>
                  </div>

                  <Space size="middle">
                    <Tag className="timer-tag">
                      <ClockCircleOutlined /> Thời gian:{" "}
                      <strong>{formatTime(timeLeft)}</strong>
                    </Tag>

                    <Tag className="code-tag">
                      <KeyOutlined /> Mã: <strong>{examCode}</strong>
                    </Tag>
                  </Space>
                </Space>

                {/* PROGRESS BAR & DRAFT */}
                <div style={{ marginBottom: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#52c41a",
                        fontWeight: 600,
                      }}
                    >
                      <SaveOutlined /> Bản nháp được tự động lưu
                    </Text>
                    <Text strong style={{ color: primaryNavy, fontSize: 13 }}>
                      {completedCount} / {batchPrayers.length} bài đã làm
                    </Text>
                  </div>
                  <Progress
                    percent={Math.round(
                      (completedCount / (batchPrayers.length || 1)) * 100,
                    )}
                    strokeColor={accentGold}
                    trailColor="rgba(27, 54, 93, 0.1)"
                  />
                </div>

                {/* CÁC BÀI KINH CẦN ĐỌC/NHẬP */}
                <Space direction="vertical" style={{ width: "100%" }} size={24}>
                  {batchPrayers.map((prayer, index) => {
                    const isDone =
                      userEssays[prayer.id] &&
                      userEssays[prayer.id].trim().length > 0;
                    const isListening = listeningPrayerId === prayer.id;

                    return (
                      <Card
                        key={prayer.id}
                        size="small"
                        bordered={false}
                        className={`doing-prayer-item-card ${isListening ? "is-recording" : ""}`}
                        title={
                          <div className="doing-prayer-header">
                            <Text strong className="doing-prayer-title">
                              {index + 1}. {prayer.title}
                            </Text>

                            <Space>
                              <Tooltip
                                title={
                                  isListening
                                    ? "Tắt micro"
                                    : "Bấm vào micro và đọc thuộc lòng bài kinh"
                                }
                              >
                                <Button
                                  type={isListening ? "primary" : "default"}
                                  danger={isListening}
                                  icon={
                                    isListening ? (
                                      <AudioOutlined spin />
                                    ) : (
                                      <AudioOutlined
                                        style={{ color: primaryNavy }}
                                      />
                                    )
                                  }
                                  onClick={() => toggleListening(prayer.id)}
                                  className="mic-btn"
                                >
                                  {isListening
                                    ? "Đang lắng nghe..."
                                    : "Đọc bằng giọng nói"}
                                </Button>
                              </Tooltip>

                              {isDone ? (
                                <Tag className="tag-status-done">
                                  <CheckCircleFilled /> Đã viết
                                </Tag>
                              ) : (
                                <Tag className="tag-status-pending">
                                  Chưa viết
                                </Tag>
                              )}
                            </Space>
                          </div>
                        }
                      >
                        {isListening && (
                          <Alert
                            type="error"
                            showIcon
                            message="Micro đang thu âm bài kinh"
                            description="Hãy đọc thuộc lòng rõ ràng. Chữ sẽ tự động nhập vào ô bên dưới."
                            style={{ marginBottom: 14, borderRadius: 10 }}
                          />
                        )}

                        <TextArea
                          rows={6}
                          placeholder={`Gõ hoặc bấm "Đọc bằng giọng nói" để nhập bài kinh: ${prayer.title}...`}
                          value={userEssays[prayer.id] || ""}
                          onChange={(e) =>
                            handleEssayChange(prayer.id, e.target.value)
                          }
                          className="essay-textarea"
                        />
                      </Card>
                    );
                  })}
                </Space>

                <Divider style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                <Space
                  style={{ width: "100%", justifyContent: "space-between" }}
                >
                  <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => setStep("info")}
                    className="back-btn"
                  >
                    Quay lại
                  </Button>

                  <Popconfirm
                    title="Xác nhận nộp bài thi?"
                    description="Bạn có chắc chắn muốn nộp toàn bộ bài kiểm tra này không?"
                    onConfirm={submitExam}
                    okText="Nộp bài"
                    cancelText="Hủy"
                    okButtonProps={{ style: { backgroundColor: primaryNavy } }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<CheckCircleFilled />}
                      loading={submitting}
                      className="submit-final-btn"
                    >
                      NỘP BÀI KIỂM TRA
                    </Button>
                  </Popconfirm>
                </Space>
              </Card>
            )}

            {/* BƯỚC 3: KẾT QUẢ KIỂM TRA */}
            {step === "result" && result && (
              <Card bordered={false} className="exam-result-card">
                <Result
                  status={
                    result.score >= 80
                      ? "success"
                      : result.score >= 50
                        ? "warning"
                        : "error"
                  }
                  title={
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: primaryNavy,
                        fontWeight: 700,
                      }}
                    >
                      {result.score >= 50
                        ? "Chúc Mừng! Bạn Đã Hoàn Thành Bài Kiểm Tra"
                        : "Bài Làm Chưa Đạt Yêu Cầu"}
                    </span>
                  }
                  subTitle={`Đợt kiểm tra: ${result.batch}`}
                />

                <div className="exam-code-display-box">
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    Mã tra cứu kết quả của bạn:
                  </Text>
                  <div style={{ marginTop: 6 }}>
                    <Text
                      copyable={{
                        text: result.exam_code,
                        tooltips: ["Sao chép", "Đã sao chép"],
                      }}
                      className="code-big-text"
                    >
                      {result.exam_code}
                    </Text>
                  </div>
                </div>

                <Row gutter={[16, 16]} justify="center">
                  <Col xs={24} sm={12} md={10}>
                    <Card bordered={false} className="score-stat-box">
                      <Statistic
                        title="Điểm Đạt Được Đợt Kiểm Tra"
                        value={result.score}
                        suffix="/ 100"
                        valueStyle={{
                          color: result.score >= 50 ? "#52c41a" : "#7A1C1C",
                          fontWeight: "bold",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Progress
                  percent={result.score}
                  strokeColor={result.score >= 50 ? "#52c41a" : "#7A1C1C"}
                  trailColor="rgba(27, 54, 93, 0.1)"
                  style={{ marginTop: 20 }}
                />

                {result.feedback && (
                  <Alert
                    type="info"
                    style={{ marginTop: 20, borderRadius: 12 }}
                    message="Nhận xét tổng quan từ Giáo lý viên"
                    description={result.feedback}
                  />
                )}

                <div style={{ textAlign: "center", marginTop: 24 }}>
                  <Button
                    type="default"
                    icon={<EyeOutlined />}
                    onClick={() => setIsCompareModalOpen(true)}
                    className="view-compare-btn"
                  >
                    Xem Đối Chiếu Bài Làm & Kinh Gốc
                  </Button>
                </div>

                <Divider style={{ borderColor: "rgba(212, 175, 55, 0.2)" }} />

                <div style={{ textAlign: "center" }}>
                  <Text style={{ fontSize: 14, color: textDark }}>
                    Thí sinh: <strong>{result.fullName}</strong> — Đợt:{" "}
                    <strong>{result.batch}</strong>
                  </Text>

                  <div style={{ marginTop: 24 }}>
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={resetExam}
                      className="reset-exam-btn"
                    >
                      Kiểm tra đợt khác
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* MODAL MÃ TRA CỨU */}
            <Modal
              open={isCodeModalOpen}
              footer={null}
              closable={false}
              centered
              width={420}
            >
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <SafetyCertificateOutlined
                  style={{ fontSize: 52, color: accentGold }}
                />
                <Title
                  level={3}
                  style={{
                    marginTop: 12,
                    color: primaryNavy,
                    fontFamily: "'Playfair Display', serif",
                  }}
                >
                  Mã Tra Cứu Bài Kiểm Tra
                </Title>
                <Paragraph style={{ color: "#64748b", fontSize: 13 }}>
                  Vui lòng sao chép lại mã bên dưới để tra cứu chi tiết điểm số
                  sau này.
                </Paragraph>

                <div className="modal-code-box">
                  <Text className="code-text-highlight">{examCode}</Text>

                  <Tooltip title="Sao chép mã">
                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => copyToClipboard(examCode)}
                    />
                  </Tooltip>
                </div>

                <Button
                  type="primary"
                  size="large"
                  block
                  onClick={handleConfirmStart}
                  className="confirm-code-btn"
                >
                  Tôi Đã Lưu Mã — Bắt Đầu Kiểm Tra
                </Button>
              </div>
            </Modal>

            {/* MODAL ĐỐI CHIẾU CHI TIẾT */}
            <Modal
              title={
                <span
                  style={{
                    color: primaryNavy,
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                  }}
                >
                  Đối Chiếu Bài Làm & Văn Bản Kinh Gốc
                </span>
              }
              open={isCompareModalOpen}
              onCancel={() => setIsCompareModalOpen(false)}
              footer={[
                <Button
                  key="close"
                  type="primary"
                  onClick={() => setIsCompareModalOpen(false)}
                  style={{ backgroundColor: primaryNavy }}
                >
                  Đóng
                </Button>,
              ]}
              width={850}
            >
              {result && result.details && (
                <Space direction="vertical" style={{ width: "100%" }} size={20}>
                  {result.details.map((item, idx) => {
                    const origPrayer = prayers.find(
                      (p) => Number(p.id) === item.prayerId,
                    );
                    return (
                      <Card
                        key={idx}
                        type="inner"
                        size="small"
                        bordered={false}
                        className="compare-detail-card"
                        title={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ color: primaryNavy }}>
                              <strong>
                                {idx + 1}. {item.prayerTitle}
                              </strong>
                            </span>
                            <Space>
                              <Tag color={item.score >= 50 ? "green" : "red"}>
                                Điểm: {item.score} / 100
                              </Tag>
                              <Tooltip title="Nghe giọng đọc mẫu">
                                <Button
                                  shape="circle"
                                  size="small"
                                  icon={<SoundOutlined />}
                                  onClick={() =>
                                    speakText(
                                      origPrayer?.content || item.prayerTitle,
                                    )
                                  }
                                />
                              </Tooltip>
                            </Space>
                          </div>
                        }
                      >
                        <Row gutter={[12, 12]}>
                          <Col xs={24} md={12}>
                            <Text
                              type="secondary"
                              strong
                              style={{ fontSize: 12 }}
                            >
                              Bài thí sinh đã gõ/đọc:
                            </Text>
                            <div className="user-quote-box">
                              {item.userContent || "(Thí sinh bỏ trống)"}
                            </div>
                          </Col>

                          <Col xs={24} md={12}>
                            <Text
                              type="secondary"
                              strong
                              style={{ fontSize: 12 }}
                            >
                              Văn bản kinh gốc:
                            </Text>
                            <div className="orig-quote-box">
                              {origPrayer?.content ||
                                item.originalContent ||
                                "Văn bản gốc không có sẵn"}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}
                </Space>
              )}
            </Modal>
          </div>
        </Content>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .exam-prayer-editorial-layout { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .exam-prayer-wrapper { 
            padding: 60px 16px 80px 16px; 
          }

          .exam-prayer-container { 
            max-width: 880px; 
            margin: 0 auto; 
          }

          /* Header Styling */
          .exam-prayer-header { 
            text-align: center; 
            margin-bottom: 32px; 
          }

          .exam-tag-sacred {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            padding: 6px 18px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .exam-main-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(28px, 4.5vw, 38px) !important; 
            font-weight: 700 !important; 
            color: ${primaryNavy} !important; 
            margin: 0 !important;
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin: 12px auto;
            border-radius: 2px;
          }

          .exam-sub-title { 
            font-size: 15px; 
            color: #64748b; 
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* Step 1 Info Card */
          .exam-info-card {
            border-radius: 20px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.05) !important;
            padding: 12px;
          }

          .card-section-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin-bottom: 4px !important;
            font-weight: 700 !important;
          }

          .card-section-desc {
            color: #64748b;
            font-size: 14px;
          }

          .field-label {
            font-size: 13px;
            color: ${primaryNavy};
            display: block;
            margin-bottom: 4px;
          }

          .glhn-input-box {
            border-radius: 10px !important;
            margin-top: 4px;
          }

          .start-exam-btn {
            margin-top: 28px;
            height: 48px !important;
            border-radius: 12px !important;
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 700 !important;
            box-shadow: 0 6px 20px rgba(27, 54, 93, 0.2);
          }

          /* Step 2 Exam Card */
          .exam-doing-card {
            border-radius: 20px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
            padding: 12px;
          }

          .exam-doing-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-weight: 700 !important;
          }

          .timer-tag {
            background: rgba(212, 175, 55, 0.15) !important;
            border: 1px solid ${accentGold} !important;
            color: ${primaryNavy} !important;
            font-size: 14px;
            padding: 6px 14px;
            border-radius: 20px;
          }

          .code-tag {
            background: rgba(27, 54, 93, 0.1) !important;
            border: 1px solid ${primaryNavy} !important;
            color: ${primaryNavy} !important;
            font-size: 14px;
            padding: 6px 14px;
            border-radius: 20px;
          }

          .doing-prayer-item-card {
            border-radius: 14px !important;
            border: 1px solid rgba(27, 54, 93, 0.1) !important;
            background: #ffffff !important;
            transition: all 0.3s ease;
          }

          .doing-prayer-item-card.is-recording {
            border-color: #ff4d4f !important;
            box-shadow: 0 4px 16px rgba(255, 77, 79, 0.15) !important;
          }

          .doing-prayer-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .doing-prayer-title {
            font-size: 15px;
            color: ${primaryNavy};
          }

          .mic-btn {
            border-radius: 20px !important;
            font-weight: 600;
          }

          .tag-status-done {
            background: #f6ffed !important;
            border-color: #b7eb8f !important;
            color: #237804 !important;
            border-radius: 12px;
          }

          .tag-status-pending {
            border-radius: 12px;
          }

          .essay-textarea {
            font-size: 15px;
            line-height: 1.8;
            border-radius: 10px;
            border-color: rgba(212, 175, 55, 0.3) !important;
            padding: 12px;
          }

          .back-btn {
            border-radius: 10px !important;
            border-color: rgba(27, 54, 93, 0.2) !important;
            color: ${primaryNavy} !important;
            font-weight: 600;
          }

          .submit-final-btn {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 700 !important;
            border-radius: 10px !important;
            height: 44px;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.2);
          }

          /* Step 3 Result Card */
          .exam-result-card {
            border-radius: 20px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
            padding: 12px;
          }

          .exam-code-display-box {
            background: ${softBg};
            border: 1px dashed ${accentGold};
            border-radius: 14px;
            padding: 16px;
            text-align: center;
            margin-bottom: 24px;
          }

          .code-big-text {
            font-size: 26px;
            font-weight: bold;
            color: ${primaryNavy};
            letter-spacing: 2px;
          }

          .score-stat-box {
            background: ${softBg} !important;
            border: 1px solid rgba(212, 175, 55, 0.3) !important;
            border-radius: 14px !important;
            text-align: center;
          }

          .view-compare-btn {
            border-radius: 20px !important;
            font-weight: 600;
            border-color: ${primaryNavy} !important;
            color: ${primaryNavy} !important;
          }

          .reset-exam-btn {
            background: ${primaryNavy} !important;
            color: #ffffff !important;
            font-weight: 700;
            border-radius: 20px;
            height: 42px;
            padding: 0 28px;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
          }

          /* Modal Code Box */
          .modal-code-box {
            background: ${softBg};
            padding: 12px 20px;
            border-radius: 12px;
            margin: 20px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid rgba(212, 175, 55, 0.3);
          }

          .code-text-highlight {
            font-size: 22px;
            font-weight: bold;
            color: ${primaryNavy};
            letter-spacing: 2px;
          }

          .confirm-code-btn {
            border-radius: 10px !important;
            height: 44px !important;
            background: ${primaryNavy} !important;
            font-weight: 700;
          }

          .compare-detail-card {
            border-radius: 12px !important;
            border: 1px solid rgba(27, 54, 93, 0.1) !important;
          }

          .user-quote-box {
            background: ${softBg};
            padding: 10px;
            border-radius: 8px;
            margin-top: 6px;
            min-height: 80px;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            border-left: 3px solid ${accentGold};
          }

          .orig-quote-box {
            background: rgba(27, 54, 93, 0.05);
            padding: 10px;
            border-radius: 8px;
            margin-top: 6px;
            min-height: 80px;
            font-size: 14px;
            line-height: 1.6;
            white-space: pre-wrap;
            color: ${primaryNavy};
          }

          @media (max-width: 576px) {
            .exam-prayer-wrapper { padding: 40px 12px; }
            .doing-prayer-header { flex-direction: column; align-items: flex-start; gap: 8px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default ExamPrayerPage;
