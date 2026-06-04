import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  Radio,
  Typography,
  Spin,
  Result,
  Tag,
  message,
  Row,
  Col,
  Progress,
  Modal,
  Drawer,
  Space,
  Divider,
} from "antd";

import {
  CheckCircleFilled,
  CloseCircleFilled,
  CheckOutlined,
  ReloadOutlined,
  LeftOutlined,
  RightOutlined,
  MenuOutlined,
  FlagOutlined,
  FlagFilled,
  SaveOutlined,
} from "@ant-design/icons";

import { generateExam, submitExam } from "../api/questionApi";

const { Text, Paragraph } = Typography;

const LOCAL_STORAGE_KEY = "exam_cache_data";

export default function ExamPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  useEffect(() => {
    document.title = "Ôn thi dự tòng";
  }, []);
  const loadExam = useCallback(async (isRetry = false) => {
    try {
      setLoading(true);

      if (!isRetry) {
        const cachedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          setQuestions(parsed.questions || []);
          setAnswers(parsed.answers || {});
          setFlaggedQuestions(parsed.flaggedQuestions || {});
          setCurrentIndex(parsed.currentIndex || 0);
          setSubmitted(false);
          setResult(null);
          message.success("Đã khôi phục bài làm gần nhất!");
          setLoading(false);
          return;
        }
      }

      const res = await generateExam(20);
      setQuestions(res.data.questions || []);
      setAnswers({});
      setFlaggedQuestions({});
      setCurrentIndex(0);
      setSubmitted(false);
      setResult(null);

      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (err) {
      console.error(err);
      message.error("Không tải được đề thi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  useEffect(() => {
    if (questions.length > 0 && !submitted) {
      const cacheState = {
        questions,
        answers,
        flaggedQuestions,
        currentIndex,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cacheState));
    }
  }, [questions, answers, flaggedQuestions, currentIndex, submitted]);

  const handleChangeAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleFlagQuestion = (questionId) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

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
    if (isCorrect)
      return {
        background: "#f6ffed",
        border: "1px solid #b7eb8f",
        color: "#237804",
      };
    if (isSelected && !isCorrect)
      return {
        background: "#fff2f0",
        border: "1px solid #ffccc7",
        color: "#a8071a",
      };
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
          <CheckCircleFilled style={{ color: "#52c41a", fontSize: 18 }} />
        )}
        {isSelected && !isCorrect && (
          <CloseCircleFilled style={{ color: "#ff4d4f", fontSize: 18 }} />
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
        <Spin size="large" tip="Đang chuẩn bị đề thi..." />
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
      style={{ background: "#F8F5EC", minHeight: "100vh", padding: "16px 8px" }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {!submitted ? (
          <>
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
                gap: 12,
              }}
            >
              <Space>
                <Button
                  icon={<MenuOutlined />}
                  onClick={() => setDrawerOpen(true)}
                >
                  Câu hỏi ({answeredCount}/{questions.length})
                </Button>
                <Button icon={<SaveOutlined />} onClick={handleManualSave} />
              </Space>
              <div style={{ flex: 1, maxWidth: 260 }}>
                <Progress
                  percent={progressPercent}
                  strokeWidth={10}
                  showInfo={false}
                />
              </div>
              <Button
                type="primary"
                danger
                icon={<CheckOutlined />}
                onClick={handlePreSubmit}
              >
                Nộp Bài
              </Button>
            </div>

            {currentQuestion && (
              <Card
                bordered={false}
                style={{ borderRadius: 20, minHeight: 380 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <Tag color="geekblue">
                    Câu hỏi {currentIndex + 1} / {questions.length}
                  </Tag>
                  <Button
                    type={isCurrentFlagged ? "primary" : "default"}
                    danger={isCurrentFlagged}
                    icon={isCurrentFlagged ? <FlagFilled /> : <FlagOutlined />}
                    onClick={() => toggleFlagQuestion(currentQuestion.id)}
                  >
                    {isCurrentFlagged ? "Đang đánh dấu" : "Xem lại sau"}
                  </Button>
                </div>
                <Paragraph
                  style={{ fontSize: 18, fontWeight: 600, marginBottom: 28 }}
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
                    {[
                      { key: "A", val: currentQuestion.answer_a },
                      { key: "B", val: currentQuestion.answer_b },
                      { key: "C", val: currentQuestion.answer_c },
                      { key: "D", val: currentQuestion.answer_d },
                    ].map((opt) => {
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
                          }}
                        >
                          <Radio value={opt.key}>
                            <span
                              style={{
                                color: isSelected ? "#1890ff" : "#334155",
                              }}
                            >
                              <strong>{opt.key}.</strong> {opt.val}
                            </span>
                          </Radio>
                        </div>
                      );
                    })}
                  </Space>
                </Radio.Group>
              </Card>
            )}

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
              >
                Câu trước
              </Button>
              <Button
                type="primary"
                size="large"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                Câu tiếp theo <RightOutlined />
              </Button>
            </div>

            <Drawer
              title="Danh sách câu hỏi"
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
                  marginBottom: 20,
                }}
              >
                {questions.map((q, idx) => {
                  const isFlagged = !!flaggedQuestions[q.id];
                  const isDone = !!answers[q.id];
                  const isCurrent = idx === currentIndex;

                  return (
                    <Button
                      key={q.id}
                      type={isCurrent || isDone ? "primary" : "default"}
                      style={{
                        height: 45,
                        borderColor: isFlagged ? "#faad14" : undefined,
                        backgroundColor: isFlagged
                          ? "#fffbe6"
                          : isDone
                            ? undefined
                            : "#f8fafc",
                        color: isFlagged ? "#d46b08" : undefined,
                      }}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setDrawerOpen(false);
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        {idx + 1}
                        {isFlagged && (
                          <FlagFilled style={{ fontSize: 10, marginTop: -2 }} />
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* PHẦN GHI CHÚ BỔ SUNG */}
              <Divider orientation="left" style={{ fontSize: 14 }}>
                Chú thích
              </Divider>
              <Space direction="vertical" size="small">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: "#d46b08",
                    }}
                  />
                  <Text type="secondary">Đã hoàn thành</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: "#fffbe6",
                      border: "1px solid #faad14",
                    }}
                  />
                  <Text type="secondary">Đánh dấu xem lại</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      background: "#f8fafc",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                  <Text type="secondary">Chưa trả lời</Text>
                </div>
              </Space>

              <Button
                type="primary"
                danger
                block
                size="large"
                style={{ marginTop: 24 }}
                onClick={handlePreSubmit}
              >
                Nộp bài thi ngay
              </Button>
            </Drawer>
          </>
        ) : (
          <div>
            <Card
              bordered={false}
              style={{
                borderRadius: 20,
                textAlign: "center",
                marginBottom: 24,
              }}
            >
              <Result
                status={result?.score >= 50 ? "success" : "warning"}
                title={`Kết Quả: ${result?.score}%`}
                subTitle={`Chính xác ${result?.correctCount} / ${result?.total} câu.`}
                extra={
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={() => loadExam(true)}
                  >
                    Làm Mới
                  </Button>
                }
              />
            </Card>
            {result?.results?.map((item, index) => (
              <Card
                key={item.question_id}
                bordered={false}
                style={{
                  marginBottom: 16,
                  borderLeft: `6px solid ${item.isCorrect ? "#52c41a" : "#ef4444"}`,
                }}
              >
                <p style={{ fontWeight: 600 }}>
                  Câu {index + 1}: {item.question}
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
            ))}
          </div>
        )}
      </div>
      <Modal
        title="Xác nhận nộp bài"
        open={confirmModal}
        onOk={executeSubmit}
        onCancel={() => setConfirmModal(false)}
        centered
      >
        <p>Bạn chưa hoàn thành hết bài thi. Bạn có chắc chắn muốn nộp bài?</p>
      </Modal>
    </div>
  );
}
