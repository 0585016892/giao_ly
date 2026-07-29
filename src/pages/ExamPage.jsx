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
  ConfigProvider,
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

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Navy Đậm
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    document.title = "Ôn Thi Giáo Lý Dự Tòng | Giáo xứ Đồng Quan";
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
      background: "#ffffff",
      border: "1px solid rgba(27, 54, 93, 0.1)",
      color: "#475569",
    };
  };

  const renderAnswer = (item, key, text) => {
    const isCorrect = key === item.correct_answer;
    const isSelected = key === item.selected;
    return (
      <div
        style={{
          padding: "14px 16px",
          borderRadius: 12,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
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
          background: softBg,
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
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
      <div className="glhn-exam-page">
        <div className="glhn-exam-container">
          {!submitted ? (
            <>
              {/* HEADER THANH CÔNG CỤ THI */}
              <div className="exam-action-header">
                <Space>
                  <Button
                    icon={<MenuOutlined style={{ color: primaryNavy }} />}
                    onClick={() => setDrawerOpen(true)}
                    className="exam-menu-btn"
                  >
                    Câu hỏi ({answeredCount}/{questions.length})
                  </Button>
                  <Button
                    icon={<SaveOutlined style={{ color: primaryNavy }} />}
                    onClick={handleManualSave}
                    title="Lưu tiến độ làm bài"
                  />
                </Space>

                <div className="exam-progress-box">
                  <Progress
                    percent={progressPercent}
                    strokeColor={accentGold}
                    trailColor="rgba(27, 54, 93, 0.1)"
                    strokeWidth={8}
                    showInfo={false}
                  />
                </div>

                <Button
                  type="primary"
                  danger
                  icon={<CheckOutlined />}
                  onClick={handlePreSubmit}
                  className="exam-submit-btn"
                >
                  Nộp Bài Thi
                </Button>
              </div>

              {/* CARD CÂU HỎI TRẮC NGHIỆM */}
              {currentQuestion && (
                <Card bordered={false} className="glhn-question-card">
                  <div className="question-card-top">
                    <Tag className="question-number-tag">
                      CÂU HỎI {currentIndex + 1} / {questions.length}
                    </Tag>
                    <Button
                      type={isCurrentFlagged ? "primary" : "default"}
                      icon={
                        isCurrentFlagged ? <FlagFilled /> : <FlagOutlined />
                      }
                      onClick={() => toggleFlagQuestion(currentQuestion.id)}
                      className={`flag-btn ${isCurrentFlagged ? "is-flagged" : ""}`}
                    >
                      {isCurrentFlagged ? "Đang đánh dấu" : "Xem lại sau"}
                    </Button>
                  </div>

                  <Paragraph className="question-title-text">
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
                      size="middle"
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
                            className={`option-row-item ${isSelected ? "is-selected" : ""}`}
                          >
                            <Radio value={opt.key}>
                              <span
                                style={{
                                  color: isSelected ? primaryNavy : textDark,
                                  fontWeight: isSelected ? "700" : "500",
                                }}
                              >
                                <strong
                                  style={{ color: primaryNavy, marginRight: 6 }}
                                >
                                  {opt.key}.
                                </strong>{" "}
                                {opt.val}
                              </span>
                            </Radio>
                          </div>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                </Card>
              )}

              {/* ĐIỀU HƯỚNG CÂU HỎI TRƯỚC / SAU */}
              <div className="question-nav-bar">
                <Button
                  size="large"
                  icon={<LeftOutlined />}
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex((prev) => prev - 1)}
                  className="nav-btn-prev"
                >
                  Câu trước
                </Button>
                <Button
                  type="primary"
                  size="large"
                  disabled={currentIndex === questions.length - 1}
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="nav-btn-next"
                >
                  Câu tiếp theo <RightOutlined />
                </Button>
              </div>

              {/* DRAWER BẢNG BÀI THI */}
              <Drawer
                title={
                  <span
                    style={{
                      color: primaryNavy,
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                    }}
                  >
                    DANH SÁCH CÂU HỎI
                  </span>
                }
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                width={320}
              >
                <div className="drawer-grid-list">
                  {questions.map((q, idx) => {
                    const isFlagged = !!flaggedQuestions[q.id];
                    const isDone = !!answers[q.id];
                    const isCurrent = idx === currentIndex;

                    return (
                      <Button
                        key={q.id}
                        type={isCurrent || isDone ? "primary" : "default"}
                        className={`drawer-grid-btn ${
                          isCurrent ? "btn-current" : isDone ? "btn-done" : ""
                        } ${isFlagged ? "btn-flagged" : ""}`}
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
                            <FlagFilled
                              style={{ fontSize: 10, color: accentGold }}
                            />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>

                <Divider
                  orientation="left"
                  style={{
                    fontSize: 13,
                    borderColor: "rgba(212, 175, 55, 0.2)",
                  }}
                >
                  Chú thích
                </Divider>

                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        background: primaryNavy,
                      }}
                    />
                    <Text style={{ fontSize: 13, color: "#64748b" }}>
                      Đã trả lời
                    </Text>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        background: "rgba(212, 175, 55, 0.2)",
                        border: `1px solid ${accentGold}`,
                      }}
                    />
                    <Text style={{ fontSize: 13, color: "#64748b" }}>
                      Đánh dấu xem lại
                    </Text>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 4,
                        background: "#ffffff",
                        border: "1px solid rgba(27, 54, 93, 0.2)",
                      }}
                    />
                    <Text style={{ fontSize: 13, color: "#64748b" }}>
                      Chưa trả lời
                    </Text>
                  </div>
                </Space>

                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  style={{ marginTop: 24, borderRadius: 10, fontWeight: 700 }}
                  onClick={handlePreSubmit}
                >
                  Nộp bài thi ngay
                </Button>
              </Drawer>
            </>
          ) : (
            /* TRANG KẾT QUẢ VÀ ĐỐI CHIẾU CÂU HỎI */
            <div className="glhn-result-wrapper">
              <Card bordered={false} className="glhn-result-card">
                <Result
                  status={result?.score >= 50 ? "success" : "warning"}
                  title={
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: primaryNavy,
                        fontWeight: 700,
                      }}
                    >
                      Kết Quả Bài Thi: {result?.score}%
                    </span>
                  }
                  subTitle={
                    <Text style={{ fontSize: 16, color: "#64748b" }}>
                      Chính xác{" "}
                      <strong style={{ color: primaryNavy }}>
                        {result?.correctCount}
                      </strong>{" "}
                      / {result?.total} câu.
                    </Text>
                  }
                  extra={
                    <Button
                      type="primary"
                      icon={<ReloadOutlined />}
                      onClick={() => loadExam(true)}
                      className="reload-exam-btn"
                    >
                      LÀM ĐỀ THI MỚI
                    </Button>
                  }
                />
              </Card>

              {result?.results?.map((item, index) => (
                <Card
                  key={item.question_id}
                  bordered={false}
                  className="glhn-result-item-card"
                  style={{
                    borderLeft: `5px solid ${item.isCorrect ? "#52c41a" : "#ff4d4f"}`,
                  }}
                >
                  <Paragraph
                    style={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: primaryNavy,
                      marginBottom: 16,
                    }}
                  >
                    Câu {index + 1}: {item.question}
                  </Paragraph>
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

        {/* MODAL XÁC NHẬN NỘP BÀI */}
        <Modal
          title={
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                color: primaryNavy,
                fontWeight: 700,
              }}
            >
              Xác nhận nộp bài thi
            </span>
          }
          open={confirmModal}
          onOk={executeSubmit}
          onCancel={() => setConfirmModal(false)}
          centered
          okText="Đồng ý Nộp"
          cancelText="Làm tiếp"
          okButtonProps={{
            style: { backgroundColor: primaryNavy, borderRadius: 8 },
          }}
        >
          <p style={{ color: textDark, fontSize: 15 }}>
            Bạn còn <strong>{questions.length - answeredCount}</strong> câu chưa
            trả lời. Bạn có chắc chắn muốn nộp bài ngay không?
          </p>
        </Modal>

        {/* CSS SCOPED DEDICATED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .glhn-exam-page {
            background-color: ${softBg};
            min-height: 100vh;
            padding: 24px 12px 60px 12px;
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .glhn-exam-container {
            max-width: 820px;
            margin: 0 auto;
          }

          /* Action Header */
          .exam-action-header {
            background: #ffffff;
            padding: 16px 20px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .exam-menu-btn {
            font-weight: 600;
            color: ${primaryNavy} !important;
            border-color: rgba(27, 54, 93, 0.2) !important;
          }

          .exam-progress-box {
            flex: 1;
            max-width: 240px;
          }

          .exam-submit-btn {
            background: #7A1C1C !important;
            border-color: #7A1C1C !important;
            font-weight: 700;
            border-radius: 8px;
          }

          /* Question Card */
          .glhn-question-card {
            border-radius: 20px !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
            border: 1px solid rgba(212, 175, 55, 0.2) !important;
            background: #ffffff !important;
            padding: 12px;
            min-height: 380px;
          }

          .question-card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }

          .question-number-tag {
            background: rgba(212, 175, 55, 0.15) !important;
            border: 1px solid ${accentGold} !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            padding: 4px 14px;
            border-radius: 20px;
            font-size: 11px;
            letter-spacing: 1px;
          }

          .flag-btn {
            border-radius: 8px;
            font-weight: 600;
          }

          .flag-btn.is-flagged {
            background: ${accentGold} !important;
            border-color: ${accentGold} !important;
            color: ${primaryNavy} !important;
          }

          .question-title-text {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            font-size: 20px !important;
            font-weight: 700 !important;
            margin-bottom: 28px !important;
            line-height: 1.4 !important;
          }

          /* Option Item */
          .option-row-item {
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid rgba(27, 54, 93, 0.12);
            background: #ffffff;
            cursor: pointer;
            transition: all 0.25s ease;
          }

          .option-row-item:hover {
            border-color: ${accentGold};
            background: rgba(212, 175, 55, 0.05);
          }

          .option-row-item.is-selected {
            border: 2px solid ${primaryNavy};
            background: rgba(27, 54, 93, 0.05);
          }

          /* Nav Buttons */
          .question-nav-bar {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            gap: 16px;
          }

          .nav-btn-prev {
            border-color: rgba(27, 54, 93, 0.2) !important;
            color: ${primaryNavy} !important;
            font-weight: 600;
            border-radius: 8px;
          }

          .nav-btn-next {
            background: ${primaryNavy} !important;
            color: #ffffff !important;
            font-weight: 600;
            border-radius: 8px;
          }

          .nav-btn-next:hover {
            background: #132744 !important;
          }

          /* Drawer Grid */
          .drawer-grid-list {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 20px;
          }

          .drawer-grid-btn {
            height: 44px;
            border-radius: 8px;
            font-weight: 600;
          }

          .drawer-grid-btn.btn-done {
            background: ${primaryNavy} !important;
            color: #ffffff !important;
          }

          .drawer-grid-btn.btn-flagged {
            border-color: ${accentGold} !important;
            background: rgba(212, 175, 55, 0.15) !important;
            color: ${primaryNavy} !important;
          }

          /* Result Section */
          .glhn-result-card {
            border-radius: 20px !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            margin-bottom: 24px;
            text-align: center;
          }

          .reload-exam-btn {
            background: ${primaryNavy} !important;
            color: #ffffff !important;
            font-weight: 700;
            height: 44px;
            padding: 0 28px;
            border-radius: 22px;
            box-shadow: 0 4px 14px rgba(27, 54, 93, 0.25);
          }

          .glhn-result-item-card {
            border-radius: 16px !important;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
            background: #ffffff !important;
            margin-bottom: 16px;
          }

          @media (max-width: 576px) {
            .exam-action-header { flex-wrap: wrap; }
            .exam-progress-box { order: 3; width: 100%; max-width: 100%; margin-top: 8px; }
            .question-title-text { font-size: 17px !important; }
            .option-row-item { padding: 12px 14px; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
}
