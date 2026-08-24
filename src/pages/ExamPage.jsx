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

const { Text, Paragraph, Title } = Typography;

const LOCAL_STORAGE_PREFIX = "exam_cache_data";

const EXAM_BATCHES = {
  1: {
    title: "Đợt 1",
    description: "Nội dung từ bài 1 đến bài 19",
    start: 1,
    end: 19,
  },
  2: {
    title: "Đợt 2",
    description: "Nội dung từ bài 20 đến bài 37",
    start: 20,
    end: 37,
  },
};

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

  // Chưa chọn đợt => hiện màn hình chọn đợt
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [examStarted, setExamStarted] = useState(false);

  // Bảng màu
  const primaryNavy = "#1B365D";
  const accentGold = "#D4AF37";
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  const getStorageKey = useCallback(
    (batch) => `${LOCAL_STORAGE_PREFIX}_batch_${batch}`,
    [],
  );

  useEffect(() => {
    document.title = "Ôn Thi Giáo Lý Dự Tòng | Giáo xứ Đồng Quan";
  }, []);

  /**
   * Load đề thi theo đợt
   *
   * batch = 1 => lesson_id từ 1 đến 19
   * batch = 2 => lesson_id từ 20 đến 37
   */
  const loadExam = useCallback(
    async (batch, isRetry = false) => {
      if (!batch) return;

      try {
        setLoading(true);

        const storageKey = getStorageKey(batch);

        // Khôi phục bài làm nếu có
        if (!isRetry) {
          const cachedData = localStorage.getItem(storageKey);

          if (cachedData) {
            const parsed = JSON.parse(cachedData);

            if (parsed.questions?.length > 0) {
              setQuestions(parsed.questions || []);
              setAnswers(parsed.answers || {});
              setFlaggedQuestions(parsed.flaggedQuestions || {});
              setCurrentIndex(parsed.currentIndex || 0);

              setSubmitted(false);
              setResult(null);
              setExamStarted(true);

              message.success(
                `Đã khôi phục bài làm ${EXAM_BATCHES[batch]?.title}!`,
              );

              return;
            }
          }
        }

        // Gọi API:
        // /questions/exam?batch=1&limit=20
        const res = await generateExam(batch, 20);

        const examQuestions = res?.data?.questions || [];

        if (examQuestions.length === 0) {
          message.warning(
            "Không tìm thấy câu hỏi cho đợt thi này. Vui lòng kiểm tra dữ liệu.",
          );
          return;
        }

        setQuestions(examQuestions);
        setAnswers({});
        setFlaggedQuestions({});
        setCurrentIndex(0);
        setSubmitted(false);
        setResult(null);
        setExamStarted(true);

        localStorage.removeItem(storageKey);
      } catch (err) {
        console.error("Load exam error:", err);

        message.error(
          err?.response?.data?.message ||
            "Không tải được đề thi. Vui lòng thử lại.",
        );
      } finally {
        setLoading(false);
      }
    },
    [getStorageKey],
  );

  /**
   * Chọn đợt và bắt đầu thi
   */
  const handleSelectBatch = async (batch) => {
    setSelectedBatch(batch);
    await loadExam(batch);
  };

  /**
   * Lưu tiến độ bài làm
   */
  useEffect(() => {
    if (questions.length > 0 && !submitted && examStarted && selectedBatch) {
      const storageKey = getStorageKey(selectedBatch);

      const cacheState = {
        batch: selectedBatch,
        questions,
        answers,
        flaggedQuestions,
        currentIndex,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(storageKey, JSON.stringify(cacheState));
    }
  }, [
    questions,
    answers,
    flaggedQuestions,
    currentIndex,
    submitted,
    examStarted,
    selectedBatch,
    getStorageKey,
  ]);

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
    if (!selectedBatch || questions.length === 0) {
      message.warning("Chưa có bài thi để lưu.");
      return;
    }

    const storageKey = getStorageKey(selectedBatch);

    const cacheState = {
      batch: selectedBatch,
      questions,
      answers,
      flaggedQuestions,
      currentIndex,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(storageKey, JSON.stringify(cacheState));

    message.success("Đã lưu tiến độ bài làm.");
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
      setLoading(true);

      const payload = {
        batch: selectedBatch,

        answers: questions.map((q, index) => ({
          question_id: q.id,
          question_index: index,
          selected: answers[q.id] || "",
        })),
      };

      const res = await submitExam(payload);

      setResult(res.data);
      setSubmitted(true);

      if (selectedBatch) {
        localStorage.removeItem(getStorageKey(selectedBatch));
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Submit exam error:", error);

      message.error(error?.response?.data?.message || "Nộp bài thất bại");
    } finally {
      setLoading(false);
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
            <span
              style={{
                fontWeight: "bold",
                marginRight: 4,
              }}
            >
              [Bạn chọn]
            </span>
          )}

          <strong style={{ marginRight: 6 }}>{key}.</strong>

          {text}
        </span>

        {isCorrect && (
          <CheckCircleFilled
            style={{
              color: "#52c41a",
              fontSize: 18,
            }}
          />
        )}

        {isSelected && !isCorrect && (
          <CloseCircleFilled
            style={{
              color: "#ff4d4f",
              fontSize: 18,
            }}
          />
        )}
      </div>
    );
  };
  // console.log("questions:::", questions);
  // console.log("an sơ:::", answers);
  // console.log("result:::", result);

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

        <div style={{ marginTop: 16 }}>
          <Text style={{ color: primaryNavy }}>Đang chuẩn bị đề thi...</Text>
        </div>
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
          {/* ============================
              MÀN HÌNH CHỌN ĐỢT THI
          ============================ */}

          {!examStarted && !submitted && (
            <div className="batch-selection-wrapper">
              <Card bordered={false} className="batch-selection-card">
                <Title
                  level={2}
                  style={{
                    color: primaryNavy,
                    fontFamily: "'Playfair Display', serif",
                    textAlign: "center",
                  }}
                >
                  Chọn Đợt Ôn Thi
                </Title>

                <Paragraph
                  style={{
                    textAlign: "center",
                    color: "#64748b",
                    marginBottom: 32,
                  }}
                >
                  Vui lòng chọn đợt thi để hệ thống tạo đề ngẫu nhiên phù hợp
                  với nội dung giáo lý.
                </Paragraph>

                <Row gutter={[20, 20]}>
                  {Object.entries(EXAM_BATCHES).map(([batchKey, batch]) => (
                    <Col xs={24} sm={12} key={batchKey}>
                      <Card
                        hoverable
                        className="batch-card"
                        onClick={() => handleSelectBatch(Number(batchKey))}
                      >
                        <Tag
                          style={{
                            background: "rgba(212, 175, 55, 0.15)",
                            borderColor: accentGold,
                            color: primaryNavy,
                            fontWeight: 700,
                            marginBottom: 12,
                          }}
                        >
                          {batch.title.toUpperCase()}
                        </Tag>

                        <Title
                          level={4}
                          style={{
                            color: primaryNavy,
                            marginTop: 0,
                          }}
                        >
                          {batch.description}
                        </Title>

                        <Paragraph
                          style={{
                            color: "#64748b",
                            minHeight: 45,
                          }}
                        >
                          Random câu hỏi từ bài <strong>{batch.start}</strong>{" "}
                          đến bài <strong>{batch.end}</strong>.
                        </Paragraph>

                        <Button type="primary" block size="large">
                          Bắt đầu làm bài
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            </div>
          )}

          {/* ============================
              TRANG LÀM BÀI
          ============================ */}

          {examStarted && !submitted && (
            <>
              {/* HEADER */}

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
                  Nộp Bài
                </Button>
              </div>

              {/* THÔNG TIN ĐỢT */}

              <div className="exam-batch-info">
                <Tag color="gold" style={{ fontWeight: 700 }}>
                  {EXAM_BATCHES[selectedBatch]?.title}
                </Tag>

                <Text type="secondary">
                  Bài {EXAM_BATCHES[selectedBatch]?.start}
                  {" - "}
                  {EXAM_BATCHES[selectedBatch]?.end}
                </Text>
              </div>

              {/* CÂU HỎI */}

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
                      className={`flag-btn ${
                        isCurrentFlagged ? "is-flagged" : ""
                      }`}
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
                        {
                          key: "A",
                          val: currentQuestion.answer_a,
                        },
                        {
                          key: "B",
                          val: currentQuestion.answer_b,
                        },
                        {
                          key: "C",
                          val: currentQuestion.answer_c,
                        },
                        {
                          key: "D",
                          val: currentQuestion.answer_d,
                        },
                      ].map((opt) => {
                        const isSelected =
                          answers[currentQuestion.id] === opt.key;

                        return (
                          <div
                            key={opt.key}
                            onClick={() =>
                              handleChangeAnswer(currentQuestion.id, opt.key)
                            }
                            className={`option-row-item ${
                              isSelected ? "is-selected" : ""
                            }`}
                          >
                            <Radio value={opt.key}>
                              <span
                                style={{
                                  color: isSelected ? primaryNavy : textDark,
                                  fontWeight: isSelected ? "700" : "500",
                                }}
                              >
                                <strong
                                  style={{
                                    color: primaryNavy,
                                    marginRight: 6,
                                  }}
                                >
                                  {opt.key}.
                                </strong>

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

              {/* ĐIỀU HƯỚNG */}

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

              {/* DRAWER */}

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
                              style={{
                                fontSize: 10,
                                color: accentGold,
                              }}
                            />
                          )}
                        </div>
                      </Button>
                    );
                  })}
                </div>

                <Divider orientation="left">Chú thích</Divider>

                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text>🔵 Đã trả lời</Text>

                  <Text>🟡 Đánh dấu xem lại</Text>

                  <Text>⚪ Chưa trả lời</Text>
                </Space>

                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  style={{
                    marginTop: 24,
                    borderRadius: 10,
                    fontWeight: 700,
                  }}
                  onClick={handlePreSubmit}
                >
                  Nộp bài thi ngay
                </Button>
              </Drawer>
            </>
          )}

          {/* ============================
              KẾT QUẢ
          ============================ */}

          {submitted && (
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
                      Kết Quả: {result?.score}%
                    </span>
                  }
                  subTitle={
                    <Text
                      style={{
                        fontSize: 16,
                        color: "#64748b",
                      }}
                    >
                      Chính xác{" "}
                      <strong
                        style={{
                          color: primaryNavy,
                        }}
                      >
                        {result?.correctCount}
                      </strong>{" "}
                      / {result?.total} câu.
                    </Text>
                  }
                  extra={
                    <Space wrap>
                      <Button
                        type="primary"
                        icon={<ReloadOutlined />}
                        onClick={() => {
                          setExamStarted(false);
                          setSubmitted(false);
                          setQuestions([]);
                          setAnswers({});
                          setResult(null);
                          setSelectedBatch(null);
                        }}
                        className="reload-exam-btn"
                      >
                        CHỌN ĐỢT THI MỚI
                      </Button>

                      <Button onClick={() => loadExam(selectedBatch, true)}>
                        LÀM ĐỀ KHÁC
                      </Button>
                    </Space>
                  }
                />
              </Card>

              {result?.results?.map((item, index) => (
                <Card
                  key={item.question_id}
                  bordered={false}
                  className="glhn-result-item-card"
                  style={{
                    borderLeft: `5px solid ${
                      item.isCorrect ? "#52c41a" : "#ff4d4f"
                    }`,
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

        {/* MODAL NỘP BÀI */}

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
          okText="Đồng ý nộp"
          cancelText="Làm tiếp"
          okButtonProps={{
            style: {
              backgroundColor: primaryNavy,
              borderRadius: 8,
            },
          }}
        >
          <p
            style={{
              color: textDark,
              fontSize: 15,
            }}
          >
            Bạn còn <strong>{questions.length - answeredCount}</strong> câu chưa
            trả lời.
          </p>

          <p>Bạn có chắc chắn muốn nộp bài ngay không?</p>
        </Modal>

        <style>{`
          .glhn-exam-page {
            background-color: ${softBg};
            min-height: 100vh;
            padding: 24px 12px 60px;
            font-family: "Be Vietnam Pro", sans-serif;
            color: ${textDark};
          }

          .glhn-exam-container {
            max-width: 820px;
            margin: 0 auto;
          }

          .batch-selection-card {
            border-radius: 20px !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06);
            padding: 20px;
          }

          .batch-card {
            height: 100%;
            border-radius: 16px !important;
            border: 1px solid rgba(212, 175, 55, 0.3) !important;
            transition: all 0.25s ease;
          }

          .batch-card:hover {
            transform: translateY(-4px);
            border-color: ${accentGold} !important;
          }

          .exam-action-header {
            background: #ffffff;
            padding: 16px 20px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.05);
            border: 1px solid rgba(212, 175, 55, 0.2);
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          }

          .exam-progress-box {
            flex: 1;
            max-width: 240px;
          }

          .exam-batch-info {
            display: flex;
            gap: 8px;
            align-items: center;
            margin-bottom: 16px;
          }

          .exam-menu-btn {
            font-weight: 600;
            color: ${primaryNavy} !important;
          }

          .exam-submit-btn {
            background: #7A1C1C !important;
            border-color: #7A1C1C !important;
            font-weight: 700;
          }

          .glhn-question-card {
            border-radius: 20px !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
            border: 1px solid rgba(212, 175, 55, 0.2) !important;
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
          }

          .question-title-text {
            color: ${primaryNavy} !important;
            font-size: 20px !important;
            font-weight: 700 !important;
            margin-bottom: 28px !important;
          }

          .option-row-item {
            padding: 16px 20px;
            border-radius: 12px;
            border: 1px solid rgba(27, 54, 93, 0.12);
            cursor: pointer;
          }

          .option-row-item.is-selected {
            border: 2px solid ${primaryNavy};
            background: rgba(27, 54, 93, 0.05);
          }

          .question-nav-bar {
            display: flex;
            justify-content: space-between;
            margin-top: 24px;
            gap: 16px;
          }

          .nav-btn-next {
            background: ${primaryNavy} !important;
            font-weight: 600;
          }

          .drawer-grid-list {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
          }

          .drawer-grid-btn {
            height: 44px;
          }

          .glhn-result-card,
          .glhn-result-item-card {
            border-radius: 20px !important;
            margin-bottom: 20px;
          }

          @media (max-width: 576px) {
            .exam-action-header {
              flex-wrap: wrap;
            }

            .exam-progress-box {
              order: 3;
              width: 100%;
              max-width: 100%;
            }

            .question-title-text {
              font-size: 17px !important;
            }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
