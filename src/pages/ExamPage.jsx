import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Radio,
  Typography,
  Spin,
  Result,
  Divider,
  Tag,
  message,
  Row,
  Col,
  Progress,
  Modal,
  Drawer,
  Badge,
  Space,
} from "antd";

import {
  CheckCircleFilled,
  CloseCircleFilled,
  CheckOutlined,
  FileTextOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  LeftOutlined,
  RightOutlined,
  MenuOutlined,
  FlagOutlined,
  FlagFilled,
  SaveOutlined,
} from "@ant-design/icons";

import { generateExam, submitExam } from "../api/questionApi";

const { Title, Text, Paragraph } = Typography;

// Khóa định danh lưu trữ dữ liệu tạm thời trong trình duyệt
const LOCAL_STORAGE_KEY = "exam_cache_data";

export default function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  // Các trạng thái quản lý chức năng nâng cao mới thêm
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // Lưu trạng thái đánh dấu xem lại { questionId: true/false }
  const [shuffledOptions, setShuffledOptions] = useState({}); // Lưu cấu trúc thứ tự đáp án sau khi trộn của từng câu

  // Hàm helper xáo trộn mảng phương án (Thuật toán Fisher-Yates)
  const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  const loadExam = async (isRetry = false) => {
    try {
      setLoading(true);

      // Nếu không phải làm đề mới, thử tìm và khôi phục bài làm cũ từ bộ nhớ cache trình duyệt
      if (!isRetry) {
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setQuestions(parsed.questions || []);
          setAnswers(parsed.answers || {});
          setFlaggedQuestions(parsed.flaggedQuestions || {});
          setShuffledOptions(parsed.shuffledOptions || {});
          setCurrentIndex(parsed.currentIndex || 0);
          setSubmitted(false);
          setResult(null);
          message.success("Đã tự động khôi phục bài làm lưu tạm gần nhất!");
          setLoading(false);
          return;
        }
      }

      const res = await generateExam(20);
      const fetchedQuestions = res.data.questions || [];

      // Xử lý xáo trộn đáp án cho từng câu hỏi khi nhận đề thi mới về
      const initialShuffled = {};
      fetchedQuestions.forEach((q) => {
        const defaultOptions = [
          { key: "A", val: q.answer_a },
          { key: "B", val: q.answer_b },
          { key: "C", val: q.answer_c },
          { key: "D", val: q.answer_d },
        ];
        initialShuffled[q.id] = shuffleArray(defaultOptions);
      });

      setQuestions(fetchedQuestions);
      setShuffledOptions(initialShuffled);
      setAnswers({});
      setFlaggedQuestions({});
      setCurrentIndex(0);
      setSubmitted(false);
      setResult(null);

      // Xóa bỏ hoàn toàn cache cũ khi khởi tạo đề thi hoàn toàn mới
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error(err);
      message.error("Không tải được đề thi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExam();
  }, []);

  // Thực hiện đồng bộ lưu tạm liên tục vào localStorage mỗi khi có bất kỳ sự thay đổi dữ liệu nào
  useEffect(() => {
    if (questions.length > 0 && !submitted) {
      const cacheState = {
        questions,
        answers,
        flaggedQuestions,
        shuffledOptions,
        currentIndex,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cacheState));
    }
  }, [
    questions,
    answers,
    flaggedQuestions,
    shuffledOptions,
    currentIndex,
    submitted,
  ]);

  const handleChangeAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Hàm xử lý bật/tắt cờ đánh dấu cần xem lại
  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
    if (!flaggedQuestions[questionId]) {
      message.info("Đã đánh dấu câu hỏi này để xem lại sau.");
    }
  };

  // Hàm bấm lưu tạm thủ công (bổ sung cho nút bấm trực quan)
  const handleManualSave = () => {
    message.success("Hệ thống đã lưu trữ an toàn tiến độ bài làm của bạn.");
  };

  const handlePreSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      setConfirmModal(true);
    } else {
      executeSubmit();
    }
  };

  const executeSubmit = async () => {
    try {
      setConfirmModal(false);
      setDrawerOpen(false);
      const payload = {
        answers: questions.map((q) => ({
          question_id: q.id,
          selected: answers[q.id] || "",
        })),
      };

      const res = await submitExam(payload);
      setResult(res.data);
      setSubmitted(true);

      // Xóa bỏ bộ nhớ đệm cache sau khi đã nộp bài thành công lên hệ thống
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      message.error("Nộp bài thất bại");
    }
  };

  const getAnswerStyle = (item, key) => {
    const isSelected = item.selected === key;
    const isCorrect = key === item.correct_answer;

    if (isCorrect) {
      return {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
        color: "#237804",
      };
    }
    if (isSelected && !isCorrect) {
      return {
        background: "#fff2f0",
        border: "1px solid #ffccc7",
        color: "#a8071a",
      };
    }
    return {
      background: "#fff",
      border: "1px solid #f0f0f0",
      color: "#595959",
    };
  };

  const renderAnswer = (item, key, text) => {
    const isCorrect = key === item.correct_answer;
    const isSelected = key === item.selected;

    return (
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 10,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
          ...getAnswerStyle(item, key),
        }}
      >
        <span style={{ fontSize: 14 }}>
          {isSelected && (
            <span style={{ fontWeight: "bold", marginRight: 4 }}>
              [Bạn chọn]{" "}
            </span>
          )}
          <strong style={{ marginRight: 6 }}>{key}.</strong>
          {text}
        </span>
        {isCorrect && (
          <CheckCircleFilled
            style={{ color: "#52c41a", fontSize: 18, flexShrink: 0 }}
          />
        )}
        {isSelected && !isCorrect && (
          <CloseCircleFilled
            style={{ color: "#ff4d4f", fontSize: 18, flexShrink: 0 }}
          />
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "120px 0",
          background: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" tip="Đang chuẩn bị phòng thi và xáo trộn đề..." />
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const progressPercent =
    questions.length > 0
      ? Math.round((answeredCount / questions.length) * 100)
      : 0;
  const currentQuestion = questions[currentIndex];
  const isCurrentFlagged = currentQuestion
    ? !!flaggedQuestions[currentQuestion.id]
    : false;

  return (
    <div
      style={{ background: "#f4f6f9", minHeight: "100vh", padding: "16px 8px" }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {!submitted ? (
          <>
            {/* TOOLBAR TRÊN CÙNG */}
            <div
              style={{
                background: "#fff",
                padding: "16px 20px",
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Space>
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setDrawerOpen(true)}
                  style={{ borderRadius: 8, fontWeight: 500 }}
                >
                  Câu hỏi ({answeredCount}/{questions.length})
                </Button>
                <Button
                  icon={<SaveOutlined />}
                  onClick={handleManualSave}
                  style={{ borderRadius: 8 }}
                  title="Lưu tạm tiến độ"
                />
              </Space>

              <div style={{ flex: 1, maxWidth: 260, margin: "0 4px" }}>
                <Progress
                  percent={progressPercent}
                  strokeColor="#1890ff"
                  showInfo={false}
                  strokeWidth={10}
                />
              </div>

              <Button
                type="primary"
                danger
                icon={<CheckOutlined />}
                onClick={handlePreSubmit}
                style={{ borderRadius: 8, fontWeight: "bold" }}
              >
                Nộp Bài
              </Button>
            </div>

            {/* CARD HIỂN THỊ 1 CÂU HỎI */}
            {currentQuestion && (
              <Card
                bordered={false}
                style={{
                  borderRadius: 20,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                  padding: "12px 8px",
                  minHeight: 380,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    <Space>
                      <Tag
                        color="geekblue"
                        style={{
                          fontSize: 14,
                          padding: "4px 12px",
                          borderRadius: 6,
                          fontWeight: 600,
                        }}
                      >
                        Câu hỏi {currentIndex + 1} / {questions.length}
                      </Tag>
                      {answers[currentQuestion.id] ? (
                        <Tag color="success">Đã trả lời</Tag>
                      ) : (
                        <Tag color="warning">Chưa trả lời</Tag>
                      )}
                    </Space>

                    {/* NÚT ĐÁNH DẤU CẦU XEM LẠI */}
                    <Button
                      type={isCurrentFlagged ? "primary" : "default"}
                      danger={isCurrentFlagged}
                      icon={
                        isCurrentFlagged ? <FlagFilled /> : <FlagOutlined />
                      }
                      onClick={() => toggleFlagQuestion(currentQuestion.id)}
                      style={{
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {isCurrentFlagged ? "Đang đánh dấu" : "Xem lại sau"}
                    </Button>
                  </div>

                  <Paragraph
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#1e293b",
                      lineHeight: "1.6",
                      marginBottom: 28,
                    }}
                  >
                    {currentQuestion.question}
                  </Paragraph>

                  <Radio.Group
                    value={answers[currentQuestion.id]}
                    onChange={(e) =>
                      handleChangeAnswer(currentQuestion.id, e.target.value)
                    }
                    style={{ width: "100%" }}
                  >
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="large"
                    >
                      {/* Hiển thị danh sách đáp án đã được xáo trộn từ trước */}
                      {(shuffledOptions[currentQuestion.id] || []).map(
                        (opt) => {
                          const isSelected =
                            answers[currentQuestion.id] === opt.key;
                          return (
                            <div
                              key={opt.key}
                              onClick={() =>
                                handleChangeAnswer(currentQuestion.id, opt.key)
                              }
                              style={{
                                padding: "16px 20px",
                                borderRadius: 12,
                                border: isSelected
                                  ? "2px solid #1890ff"
                                  : "1px solid #e2e8f0",
                                background: isSelected ? "#f0f7ff" : "#fff",
                                cursor: "pointer",
                                boxShadow: isSelected
                                  ? "0 4px 12px rgba(24,144,255,0.1)"
                                  : "none",
                                transition: "all 0.2s",
                              }}
                            >
                              <Radio value={opt.key} style={{ width: "100%" }}>
                                <span
                                  style={{
                                    color: isSelected ? "#1890ff" : "#334155",
                                    fontSize: 15,
                                    fontWeight: isSelected ? 600 : 400,
                                  }}
                                >
                                  <strong style={{ marginRight: 6 }}>
                                    {opt.key}.
                                  </strong>
                                  {opt.val}
                                </span>
                              </Radio>
                            </div>
                          );
                        },
                      )}
                    </Space>
                  </Radio.Group>
                </div>
              </Card>
            )}

            {/* THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 24,
                gap: 16,
              }}
            >
              <Button
                size="large"
                icon={<LeftOutlined />}
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                style={{
                  borderRadius: 10,
                  width: "45%",
                  height: 48,
                  fontWeight: 500,
                }}
              >
                Câu trước
              </Button>

              <Button
                type="primary"
                size="large"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                style={{
                  borderRadius: 10,
                  width: "45%",
                  height: 48,
                  fontWeight: 500,
                }}
              >
                Câu tiếp theo <RightOutlined />
              </Button>
            </div>

            {/* NGĂN KÉO DRAWER BAN-DANH-SACH */}
            <Drawer
              title="Danh sách câu hỏi bài thi"
              placement="left"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              width={320}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 10,
                }}
              >
                {questions.map((q, idx) => {
                  const isDone = !!answers[q.id];
                  const isCurrent = idx === currentIndex;
                  const isFlagged = !!flaggedQuestions[q.id];

                  // Xác định màu sắc nút dựa trên độ ưu tiên: Đang chọn > Cần xem lại > Đã làm > Chưa làm
                  let btnType = "default";
                  let styleCustom = {
                    height: 45,
                    borderRadius: 8,
                    fontWeight: "bold",
                  };

                  if (isCurrent) {
                    styleCustom.border = "2px solid #1890ff";
                  } else if (isFlagged) {
                    styleCustom.backgroundColor = "#fff7e6";
                    styleCustom.color = "#d46b08";
                    styleCustom.border = "1px solid #ffd591";
                  } else if (isDone) {
                    btnType = "primary";
                  } else {
                    styleCustom.backgroundColor = "#f8fafc";
                  }

                  return (
                    <Button
                      key={q.id}
                      type={btnType}
                      style={styleCustom}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setDrawerOpen(false);
                      }}
                    >
                      <Space size={2} direction="vertical" style={{ gap: 0 }}>
                        {idx + 1}
                        {isFlagged && (
                          <FlagFilled
                            style={{
                              fontSize: 10,
                              color: "#fa8c16",
                              display: "block",
                              margin: "0 auto",
                            }}
                          />
                        )}
                      </Space>
                    </Button>
                  );
                })}
              </div>
              <Divider />
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <Badge color="blue" />{" "}
                  <Text type="secondary">Câu đã chọn đáp án</Text>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <Badge color="orange" />{" "}
                  <Text type="secondary">Câu đánh dấu xem lại sau</Text>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Badge color="default" />{" "}
                  <Text type="secondary">Câu chưa hoàn thành</Text>
                </div>
              </div>
              <Button
                type="primary"
                danger
                block
                size="large"
                onClick={handlePreSubmit}
                style={{ borderRadius: 8 }}
              >
                Nộp bài thi ngay
              </Button>
            </Drawer>
          </>
        ) : (
          /* =======================================================
              GIAO DIỆN SAU KHI NỘP BÀI (XEM LẠI TOÀN BỘ KẾT QUẢ)
             ======================================================= */
          <div style={{ paddingTop: 12 }}>
            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              <Result
                status={result?.score >= 50 ? "success" : "warning"}
                title={
                  <span
                    style={{ fontSize: 26, fontWeight: 800, color: "#1e293b" }}
                  >
                    Kết Quả Đạt: {result?.score}%
                  </span>
                }
                subTitle={
                  <div style={{ fontSize: 16, color: "#64748b", marginTop: 6 }}>
                    Chính xác{" "}
                    <strong style={{ color: "#52c41a" }}>
                      {result?.correctCount}
                    </strong>{" "}
                    trên tổng số {result?.total} câu.
                  </div>
                }
                extra={[
                  <Button
                    key="retry"
                    type="primary"
                    size="large"
                    icon={<ReloadOutlined />}
                    onClick={() => loadExam(true)}
                    style={{ borderRadius: 10, height: 46, fontWeight: "bold" }}
                  >
                    Làm Bài Thi Mới
                  </Button>,
                ]}
              />
            </Card>

            <Title
              level={4}
              style={{
                marginBottom: 16,
                fontSize: 17,
                color: "#475569",
                paddingLeft: 4,
              }}
            >
              <FileTextOutlined style={{ marginRight: 8 }} />
              Chi tiết bài chấm điểm hệ thống (Đáp án gốc hiển thị tại đây)
            </Title>

            {result?.results?.map((item, index) => {
              const khongTraLoi = !item.selected;
              return (
                <Card
                  key={item.question_id}
                  bordered={false}
                  style={{
                    marginBottom: 16,
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.01)",
                    borderLeft: item.isCorrect
                      ? "6px solid #52c41a"
                      : khongTraLoi
                        ? "6px solid #94a3b8"
                        : "6px solid #ef4444",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifycontent: "space-between",
                      alignItems: "center",
                      marginBottom: 14,
                    }}
                  >
                    <Space>
                      <Tag
                        color={
                          item.isCorrect
                            ? "success"
                            : khongTraLoi
                              ? "default"
                              : "error"
                        }
                        style={{ fontWeight: "bold", borderRadius: 4 }}
                      >
                        Câu {index + 1}
                      </Tag>
                      {khongTraLoi && (
                        <Badge status="default" text="Bỏ trống câu hỏi" />
                      )}
                    </Space>
                  </div>

                  <p
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#1e293b",
                      marginBottom: 18,
                    }}
                  >
                    {item.question}
                  </p>

                  <Row gutter={[12, 12]}>
                    <Col xs={24} sm={12}>
                      {renderAnswer(item, "A", item.answer_a)}
                    </Col>
                    <Col xs={24} sm={12}>
                      {renderAnswer(item, "B", item.answer_b)}
                    </Col>
                    <Col xs={24} sm={12}>
                      {renderAnswer(item, "C", item.answer_c)}
                    </Col>
                    <Col xs={24} sm={12}>
                      {renderAnswer(item, "D", item.answer_d)}
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL CẢNH BÁO CHƯA ĐIỀN ĐỦ CÂU HỎI */}
      <Modal
        title={
          <span>
            <ExclamationCircleOutlined
              style={{ color: "#faad14", marginRight: 8 }}
            />{" "}
            Cảnh báo nộp bài
          </span>
        }
        open={confirmModal}
        onOk={executeSubmit}
        onCancel={() => setConfirmModal(false)}
        okText="Vẫn nộp bài"
        cancelText="Quay lại làm tiếp"
        okButtonProps={{ danger: true }}
        centered
      >
        <p>
          Bạn mới chỉ tích đáp án cho{" "}
          <b>
            {answeredCount}/{questions.length}
          </b>{" "}
          câu hỏi.
        </p>
        <p>Bạn có chắc chắn muốn nộp bài thi ngay bây giờ không?</p>
      </Modal>
    </div>
  );
}
