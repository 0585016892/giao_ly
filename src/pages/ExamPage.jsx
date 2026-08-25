import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Button,
  Radio,
  Typography,
  Spin,
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
  Badge,
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
  ExclamationCircleFilled,
  SaveOutlined,
  BookOutlined,
  TrophyOutlined,
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

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [examStarted, setExamStarted] = useState(false);
  const [filterMode, setFilterMode] = useState("all");

  const primaryNavy = "#1B365D";
  const accentGold = "#D4AF37";
  const textDark = "#0F172A";
  const softBg = "#F1F5F9";

  const getStorageKey = useCallback(
    (batch) => `${LOCAL_STORAGE_PREFIX}_batch_${batch}`,
    [],
  );

  const clearAllExamCache = useCallback(() => {
    Object.keys(EXAM_BATCHES).forEach((batchKey) => {
      localStorage.removeItem(getStorageKey(batchKey));
    });
  }, [getStorageKey]);

  useEffect(() => {
    document.title = "Ôn Thi Giáo Lý Dự Tòng | Giáo xứ Đồng Quan";
  }, []);

  // Cảnh báo F5 / Rời trang
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examStarted && !submitted) {
        clearAllExamCache();
        e.preventDefault();
        e.returnValue =
          "Bạn có chắc chắn muốn rời khỏi bài thi? Tiến độ bài làm sẽ bị xóa!";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [examStarted, submitted, clearAllExamCache]);

  // Cảnh báo Nút Back / Forward trình duyệt
  useEffect(() => {
    const handlePopState = () => {
      if (examStarted && !submitted) {
        // 1. Khóa ngay trình duyệt không cho quay lại
        window.history.pushState(null, "", window.location.href);

        // 2. Bật Modal đẹp chuẩn Ant Design
        Modal.confirm({
          title: "Cảnh báo thoát bài thi!",
          icon: <ExclamationCircleFilled style={{ color: "#EF4444" }} />,
          content:
            "Bạn đang làm bài thi. Nếu rời khỏi trang, toàn bộ tiến độ làm bài sẽ bị xóa hoàn toàn. Bạn có chắc chắn muốn thoát?",
          okText: "Thoát và xóa tiến độ",
          okType: "danger",
          cancelText: "Tiếp tục làm bài",
          centered: true,
          maskClosable: false,
          okButtonProps: {
            style: { borderRadius: 8, height: 38, fontWeight: 600 },
          },
          cancelButtonProps: {
            style: { borderRadius: 8, height: 38 },
          },
          onOk() {
            clearAllExamCache();
            setExamStarted(false);
            // Quay lại trang trước đó thực sự (nếu muốn)
            window.history.back();
          },
          onCancel() {
            // Người dùng ở lại, không cần làm gì thêm vì đã pushState chặn từ đầu
          },
        });
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [examStarted, submitted, clearAllExamCache]);
  const loadExam = useCallback(
    async (batch, isRetry = false) => {
      if (!batch) return;

      try {
        setLoading(true);
        const storageKey = getStorageKey(batch);

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

        const res = await generateExam(batch, 30);
        const examQuestions = res?.data?.questions || [];

        if (examQuestions.length === 0) {
          message.warning("Không tìm thấy câu hỏi cho đợt thi này.");
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
        message.error(err?.response?.data?.message || "Không tải được đề thi.");
      } finally {
        setLoading(false);
      }
    },
    [getStorageKey],
  );

  const handleSelectBatch = async (batch) => {
    setSelectedBatch(batch);
    await loadExam(batch);
  };

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

      clearAllExamCache();

      setResult(res.data);
      setSubmitted(true);
      setExamStarted(false);

      setAnswers({});
      setFlaggedQuestions({});

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Submit exam error:", error);
      message.error(error?.response?.data?.message || "Nộp bài thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResetToSelectBatch = () => {
    clearAllExamCache();
    setExamStarted(false);
    setSubmitted(false);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setSelectedBatch(null);
    setFilterMode("all");
  };

  if (loading) {
    return (
      <div
        className="glhn-loading-screen"
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
        <Text
          style={{
            color: primaryNavy,
            fontWeight: 600,
            fontSize: 16,
            marginTop: 16,
          }}
        >
          Đang chuẩn bị đề thi...
        </Text>
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

  const filteredResults = result?.results?.filter((item) => {
    if (filterMode === "wrong") return !item.isCorrect;
    if (filterMode === "correct") return item.isCorrect;
    return true;
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 12,
          colorBgLayout: softBg,
          fontFamily: "'Inter', -apple-system, sans-serif",
        },
      }}
    >
      <div className="glhn-exam-page">
        <div className="glhn-exam-container">
          {/* 1. MÀN HÌNH CHỌN ĐỢT THI */}
          {!examStarted && !submitted && (
            <div className="batch-selection-wrapper">
              <div className="batch-header-hero">
                <Badge.Ribbon text="Hệ thống Trắc nghiệm" color={accentGold}>
                  <Card bordered={false} className="batch-hero-card">
                    <Title level={2} className="batch-hero-title">
                      Ôn Thi Giáo Lý Dự Tòng
                    </Title>
                    <Paragraph className="batch-hero-desc">
                      Giáo xứ Đồng Quan • Hệ thống tự động khởi tạo đề thi ngẫu
                      nhiên theo khung chuẩn bài học
                    </Paragraph>
                  </Card>
                </Badge.Ribbon>
              </div>

              <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
                {Object.entries(EXAM_BATCHES).map(([batchKey, batch]) => (
                  <Col xs={24} sm={12} key={batchKey}>
                    <div
                      className="batch-option-card"
                      onClick={() => handleSelectBatch(Number(batchKey))}
                    >
                      <div className="batch-card-top">
                        <Tag color="gold" className="batch-badge">
                          {batch.title.toUpperCase()}
                        </Tag>
                        <BookOutlined className="batch-icon" />
                      </div>

                      <Title level={4} className="batch-card-title">
                        {batch.description}
                      </Title>

                      <Text type="secondary" className="batch-card-subtitle">
                        Gồm <strong>30 câu trắc nghiệm ngẫu nhiên</strong> từ
                        bài {batch.start} đến bài {batch.end}.
                      </Text>

                      <Button
                        type="primary"
                        block
                        size="large"
                        className="batch-start-btn"
                      >
                        Bắt đầu thi ngay
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* 2. MÀN HÌNH LÀM BÀI */}
          {examStarted && !submitted && (
            <>
              <div className="exam-top-sticky-header">
                <div className="header-left">
                  <Button
                    icon={<MenuOutlined />}
                    onClick={() => setDrawerOpen(true)}
                    className="drawer-toggle-btn"
                  >
                    <span>Danh sách</span>
                    <Badge
                      count={`${answeredCount}/${questions.length}`}
                      style={{ backgroundColor: primaryNavy, marginLeft: 6 }}
                    />
                  </Button>

                  <Button
                    icon={<SaveOutlined />}
                    onClick={handleManualSave}
                    title="Lưu tiến độ"
                    className="save-btn"
                  />
                </div>

                <div className="header-center">
                  <Text className="batch-tag-label">
                    {EXAM_BATCHES[selectedBatch]?.title}
                  </Text>
                  <Progress
                    percent={progressPercent}
                    strokeColor={accentGold}
                    trailColor="rgba(27, 54, 93, 0.12)"
                    strokeWidth={8}
                    showInfo={false}
                    style={{ width: 140 }}
                  />
                </div>

                <Button
                  type="primary"
                  danger
                  icon={<CheckOutlined />}
                  onClick={handlePreSubmit}
                  className="submit-top-btn"
                >
                  Nộp Bài
                </Button>
              </div>

              {currentQuestion && (
                <Card bordered={false} className="question-main-card">
                  <div className="question-card-header">
                    <span className="q-counter-tag">
                      CÂU HỎI {currentIndex + 1} / {questions.length}
                    </span>

                    <Button
                      type={isCurrentFlagged ? "primary" : "default"}
                      danger={isCurrentFlagged}
                      icon={
                        isCurrentFlagged ? <FlagFilled /> : <FlagOutlined />
                      }
                      onClick={() => toggleFlagQuestion(currentQuestion.id)}
                      className="flag-toggle-btn"
                    >
                      {isCurrentFlagged ? "Đã đánh dấu" : "Đánh dấu xem lại"}
                    </Button>
                  </div>

                  <Title level={4} className="question-text">
                    {currentQuestion.question}
                  </Title>

                  <Radio.Group
                    value={answers[currentQuestion.id]}
                    onChange={(e) =>
                      handleChangeAnswer(currentQuestion.id, e.target.value)
                    }
                    style={{ width: "100%", marginTop: 20 }}
                  >
                    <Space
                      direction="vertical"
                      style={{ width: "100%" }}
                      size="medium"
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
                            className={`quiz-option-wrapper ${isSelected ? "is-selected" : ""}`}
                          >
                            <Radio value={opt.key} style={{ width: "100%" }}>
                              <div className="option-inner">
                                <span className="option-letter">{opt.key}</span>
                                <span className="option-content">
                                  {opt.val}
                                </span>
                              </div>
                            </Radio>
                          </div>
                        );
                      })}
                    </Space>
                  </Radio.Group>

                  <div className="question-footer-nav">
                    <Button
                      size="large"
                      icon={<LeftOutlined />}
                      disabled={currentIndex === 0}
                      onClick={() => {
                        setCurrentIndex((prev) => prev - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="nav-btn"
                    >
                      Câu trước
                    </Button>

                    <Button
                      type="primary"
                      size="large"
                      disabled={currentIndex === questions.length - 1}
                      onClick={() => {
                        setCurrentIndex((prev) => prev + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="nav-btn primary"
                    >
                      Câu tiếp <RightOutlined />
                    </Button>
                  </div>
                </Card>
              )}

              <Drawer
                title={<span className="drawer-title">DANH SÁCH CÂU HỎI</span>}
                placement="left"
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                width={330}
              >
                <div className="drawer-grid-list">
                  {questions.map((q, idx) => {
                    const isFlagged = !!flaggedQuestions[q.id];
                    const isDone = !!answers[q.id];
                    const isCurrent = idx === currentIndex;

                    let btnClass = "drawer-q-btn";
                    if (isCurrent) btnClass += " active";
                    else if (isDone) btnClass += " done";

                    return (
                      <div
                        key={q.id}
                        className={btnClass}
                        onClick={() => {
                          setCurrentIndex(idx);
                          setDrawerOpen(false);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {idx + 1}
                        {isFlagged && (
                          <FlagFilled className="flag-icon-corner" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <Divider orientation="left">Chú thích</Divider>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >
                  <Text>
                    <span className="legend-box done"></span> Đã trả lời
                  </Text>
                  <Text>
                    <span className="legend-box flagged"></span> Đánh dấu xem
                    lại
                  </Text>
                  <Text>
                    <span className="legend-box current"></span> Câu hiện tại
                  </Text>
                  <Text>
                    <span className="legend-box normal"></span> Chưa trả lời
                  </Text>
                </Space>

                <Button
                  type="primary"
                  danger
                  block
                  size="large"
                  className="drawer-submit-btn"
                  onClick={handlePreSubmit}
                >
                  Nộp bài thi ngay
                </Button>
              </Drawer>
            </>
          )}

          {/* 3. MÀN HÌNH BÁO CÁO KẾT QUẢ */}
          {submitted && (
            <div className="glhn-result-wrapper">
              <Card bordered={false} className="result-hero-card">
                <Row gutter={[24, 24]} align="middle">
                  <Col xs={24} md={10} style={{ textAlign: "center" }}>
                    <div className="score-circle-wrapper">
                      <Progress
                        type="dashboard"
                        percent={result?.score || 0}
                        width={170}
                        strokeWidth={10}
                        strokeColor={
                          result?.score >= 50 ? "#10B981" : "#F59E0B"
                        }
                        format={(percent) => (
                          <div className="score-inner">
                            <span className="score-number">{percent}</span>
                            <span className="score-unit">ĐIỂM</span>
                          </div>
                        )}
                      />
                    </div>
                    <Title
                      level={4}
                      style={{
                        color: primaryNavy,
                        marginTop: 14,
                        marginBottom: 4,
                      }}
                    >
                      {result?.score >= 80
                        ? "Xuất Sắc! 🎉"
                        : result?.score >= 50
                          ? "Đạt Yêu Cầu! 👍"
                          : "Cần Ôn Tập Thêm 📖"}
                    </Title>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Đợt thi: {EXAM_BATCHES[selectedBatch]?.title} (Bài{" "}
                      {EXAM_BATCHES[selectedBatch]?.start} -{" "}
                      {EXAM_BATCHES[selectedBatch]?.end})
                    </Text>
                  </Col>

                  <Col xs={24} md={14}>
                    <div className="stats-grid">
                      <div className="stat-box success">
                        <CheckCircleFilled className="stat-icon" />
                        <div className="stat-data">
                          <span className="stat-value">
                            {result?.correctCount || 0}
                          </span>
                          <span className="stat-label">Câu đúng</span>
                        </div>
                      </div>

                      <div className="stat-box error">
                        <CloseCircleFilled className="stat-icon" />
                        <div className="stat-data">
                          <span className="stat-value">
                            {(result?.total || 0) - (result?.correctCount || 0)}
                          </span>
                          <span className="stat-label">Câu sai</span>
                        </div>
                      </div>

                      <div className="stat-box total">
                        <TrophyOutlined
                          className="stat-icon"
                          style={{ color: primaryNavy }}
                        />
                        <div className="stat-data">
                          <span className="stat-value">
                            {result?.total || 0}
                          </span>
                          <span className="stat-label">Tổng số câu</span>
                        </div>
                      </div>
                    </div>

                    <Space
                      wrap
                      style={{
                        marginTop: 24,
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <Button
                        type="primary"
                        size="large"
                        icon={<ReloadOutlined />}
                        onClick={handleResetToSelectBatch}
                        className="action-btn primary"
                      >
                        Chọn đợt thi khác
                      </Button>

                      <Button
                        size="large"
                        onClick={() => {
                          setFilterMode("all");
                          loadExam(selectedBatch, true);
                        }}
                        className="action-btn outline"
                      >
                        Làm lại đợt này
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>

              <div className="result-filter-bar">
                <Title level={4} style={{ color: primaryNavy, margin: 0 }}>
                  Chi Tiết Bài Làm
                </Title>

                <Radio.Group
                  value={filterMode}
                  buttonStyle="solid"
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="filter-radio-group"
                >
                  <Radio.Button value="all">
                    Tất cả ({result?.results?.length})
                  </Radio.Button>
                  <Radio.Button value="wrong">
                    Câu sai (
                    {(result?.total || 0) - (result?.correctCount || 0)})
                  </Radio.Button>
                  <Radio.Button value="correct">
                    Câu đúng ({result?.correctCount})
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div className="result-cards-container">
                {filteredResults?.map((item, index) => {
                  const isCorrect = item.isCorrect;

                  return (
                    <Card
                      key={item.question_id || index}
                      bordered={false}
                      className={`result-card-item ${isCorrect ? "is-correct" : "is-wrong"}`}
                    >
                      <div className="card-question-header">
                        <div className="question-badge">
                          <span className="q-number">Câu {index + 1}</span>
                          <Tag
                            color={isCorrect ? "success" : "error"}
                            className="status-tag"
                          >
                            {isCorrect ? (
                              <CheckCircleFilled />
                            ) : (
                              <CloseCircleFilled />
                            )}
                            {isCorrect ? " Đúng" : " Sai"}
                          </Tag>
                        </div>
                      </div>

                      <Paragraph className="card-question-title">
                        {item.question}
                      </Paragraph>

                      <Divider style={{ margin: "14px 0" }} />

                      <Row gutter={[12, 12]}>
                        {[
                          { key: "A", text: item.answer_a },
                          { key: "B", text: item.answer_b },
                          { key: "C", text: item.answer_c },
                          { key: "D", text: item.answer_d },
                        ].map((ans) => {
                          const isUserSelected = ans.key === item.selected;
                          const isCorrectAns = ans.key === item.correct_answer;

                          let stateClass = "option-normal";
                          if (isCorrectAns)
                            stateClass = "option-correct-target";
                          if (isUserSelected && !isCorrectAns)
                            stateClass = "option-wrong-target";

                          return (
                            <Col xs={24} sm={12} key={ans.key}>
                              <div
                                className={`result-option-box ${stateClass}`}
                              >
                                <div className="opt-left">
                                  <span className="opt-key">{ans.key}</span>
                                  <span className="opt-text">{ans.text}</span>
                                </div>

                                <div className="opt-badges">
                                  {isUserSelected && !isCorrectAns && (
                                    <Tag color="red" className="opt-badge">
                                      Bạn chọn
                                    </Tag>
                                  )}
                                  {isCorrectAns && (
                                    <Tag color="green" className="opt-badge">
                                      Đáp án đúng
                                    </Tag>
                                  )}
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* MODAL XÁC NHẬN NỘP BÀI */}
        <Modal
          title={<span className="modal-title">Xác nhận nộp bài thi</span>}
          open={confirmModal}
          onOk={executeSubmit}
          onCancel={() => setConfirmModal(false)}
          centered
          okText="Nộp bài ngay"
          cancelText="Làm tiếp"
          okButtonProps={{
            style: {
              backgroundColor: primaryNavy,
              borderRadius: 8,
              height: 40,
              fontWeight: 600,
            },
          }}
          cancelButtonProps={{
            style: { borderRadius: 8, height: 40 },
          }}
        >
          <p style={{ color: textDark, fontSize: 15, margin: "12px 0 6px" }}>
            Bạn còn <strong>{questions.length - answeredCount}</strong> câu chưa
            hoàn thành.
          </p>
          <p style={{ color: "#64748B" }}>
            Bạn có chắc chắn muốn kết thúc bài thi ngay bây giờ?
          </p>
        </Modal>

        {/* BỘ STYLES CSS CAO CẤP */}
        <style>{`
          .glhn-loading-screen {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: ${softBg};
          }

          .glhn-exam-page {
            background-color: ${softBg};
            min-height: 100vh;
            padding: 51px 16px 60px;
            color: ${textDark};
          }

          .glhn-exam-container {
            max-width: 860px;
            margin: 0 auto;
          }

          /* HERO CARD CHỌN ĐỢT THI */
          .batch-hero-card {
            border-radius: 20px !important;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
            box-shadow: 0 10px 30px -5px rgba(27, 54, 93, 0.08) !important;
            text-align: center;
            padding: 24px 16px;
            border: 1px solid rgba(226, 232, 240, 0.8) !important;
          }

          .batch-hero-title {
            color: ${primaryNavy} !important;
            font-weight: 800 !important;
            margin-bottom: 8px !important;
            letter-spacing: -0.5px;
          }

          .batch-hero-desc {
            color: #64748B !important;
            font-size: 14px;
            margin-bottom: 0 !important;
          }

          .batch-option-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 24px;
            border: 1px solid #E2E8F0;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
            transition: all 0.25s ease;
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .batch-option-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -4px rgba(27, 54, 93, 0.12);
            border-color: ${primaryNavy};
          }

          .batch-card-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .batch-badge {
            border-radius: 20px !important;
            padding: 2px 12px !important;
            font-weight: 700;
          }

          .batch-icon {
            font-size: 24px;
            color: ${accentGold};
          }

          .batch-card-title {
            color: ${primaryNavy} !important;
            margin: 8px 0 !important;
            font-weight: 700 !important;
          }

          .batch-card-subtitle {
            font-size: 13.5px;
            margin-bottom: 24px;
            display: block;
            flex-grow: 1;
            line-height: 1.5;
          }

          .batch-start-btn {
            background-color: ${primaryNavy} !important;
            border-radius: 10px !important;
            height: 44px !important;
            font-weight: 600 !important;
          }

          /* STICKY HEADER LÀM BÀI */
          .exam-top-sticky-header {
            position: sticky;
            top: 12px;
            z-index: 100;
            background: rgba(255, 255, 255, 0.88);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.6);
            border-radius: 16px;
            padding: 10px 16px;
            margin-bottom: 20px;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .header-left {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .drawer-toggle-btn {
            border-radius: 8px !important;
            font-weight: 600;
          }

          .save-btn {
            border-radius: 8px !important;
          }

          .header-center {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .batch-tag-label {
            font-weight: 700;
            color: ${primaryNavy};
            font-size: 13px;
          }

          .submit-top-btn {
            border-radius: 8px !important;
            font-weight: 600;
            height: 36px;
          }

          /* CARD CÂU HỎI MAIN */
          .question-main-card {
            border-radius: 20px !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05) !important;
            padding: 12px;
            background: #ffffff !important;
          }

          .question-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }

          .q-counter-tag {
            font-size: 12px;
            font-weight: 800;
            color: ${accentGold};
            letter-spacing: 0.8px;
            background: #FFFBEB;
            padding: 4px 10px;
            border-radius: 6px;
            border: 1px solid #FDE68A;
          }

          .flag-toggle-btn {
            border-radius: 8px !important;
            font-weight: 600;
          }

          .question-text {
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;
            font-size: 18px !important;
            margin-bottom: 20px !important;
          }

          /* QUIZ OPTION ITEM */
          .quiz-option-wrapper {
            background: #F8FAFC;
            border: 1.5px solid #E2E8F0;
            border-radius: 12px;
            padding: 14px 16px;
            transition: all 0.2s ease;
            cursor: pointer;
          }

          .quiz-option-wrapper:hover {
            border-color: #94A3B8;
            background: #F1F5F9;
          }

          .quiz-option-wrapper.is-selected {
            border-color: ${primaryNavy};
            background: #F0F4F8;
            box-shadow: 0 0 0 1px ${primaryNavy};
          }

          .option-inner {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            width: 100%;
          }

          .option-letter {
            font-weight: 800;
            color: ${primaryNavy};
            min-width: 20px;
          }

          .option-content {
            font-size: 15px;
            color: ${textDark};
            line-height: 1.45;
          }

          .question-footer-nav {
            display: flex;
            justify-content: space-between;
            margin-top: 28px;
            padding-top: 16px;
            border-top: 1px solid #F1F5F9;
          }

          .nav-btn {
            border-radius: 10px !important;
            font-weight: 600 !important;
            height: 44px !important;
            padding: 0 24px !important;
          }

          .nav-btn.primary {
            background-color: ${primaryNavy} !important;
          }

          /* DRAWER DANH SÁCH CÂU HỎI */
          .drawer-title {
            color: ${primaryNavy};
            font-weight: 800;
            letter-spacing: 0.5px;
          }

          .drawer-grid-list {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 8px;
            margin-bottom: 20px;
          }

          .drawer-q-btn {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #F1F5F9;
            border: 1px solid #CBD5E1;
            font-weight: 700;
            font-size: 13px;
            cursor: pointer;
            position: relative;
            transition: all 0.2s ease;
          }

          .drawer-q-btn.done {
            background: #E0E7FF;
            color: ${primaryNavy};
            border-color: #818CF8;
          }

          .drawer-q-btn.active {
            border: 2px solid ${accentGold};
            box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.3);
          }

          .flag-icon-corner {
            position: absolute;
            top: 2px;
            right: 2px;
            font-size: 9px;
            color: #EF4444;
          }

          .legend-box {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 3px;
            margin-right: 8px;
          }

          .legend-box.done { background: #E0E7FF; border: 1px solid #818CF8; }
          .legend-box.flagged { background: #FEE2E2; border: 1px solid #EF4444; }
          .legend-box.current { background: #FFFFFF; border: 2px solid ${accentGold}; }
          .legend-box.normal { background: #F1F5F9; border: 1px solid #CBD5E1; }

          .drawer-submit-btn {
            margin-top: 24px;
            border-radius: 10px !important;
            font-weight: 700 !important;
            height: 44px !important;
          }

          /* MÀN HÌNH BÁO CÁO KẾT QUẢ */
          .glhn-result-wrapper {
            animation: fadeIn 0.4s ease;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .result-hero-card {
            border-radius: 20px !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.06) !important;
            padding: 16px;
            background: #ffffff !important;
          }

          .score-circle-wrapper {
            margin: 0 auto;
          }

          .score-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .score-number {
            font-size: 36px;
            font-weight: 800;
            color: ${primaryNavy};
            line-height: 1;
          }

          .score-unit {
            font-size: 11px;
            font-weight: 700;
            color: #64748B;
            margin-top: 4px;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }

          .stat-box {
            padding: 14px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .stat-box.success { background: #ECFDF5; border: 1px solid #A7F3D0; }
          .stat-box.error { background: #FEF2F2; border: 1px solid #FECACA; }
          .stat-box.total { background: #F0F4F8; border: 1px solid #BAE6FD; }

          .stat-icon { font-size: 20px; }
          .stat-box.success .stat-icon { color: #10B981; }
          .stat-box.error .stat-icon { color: #EF4444; }

          .stat-data { display: flex; flex-direction: column; }
          .stat-value { font-weight: 800; font-size: 16px; color: ${textDark}; }
          .stat-label { font-size: 11px; color: #64748B; }

          .action-btn {
            border-radius: 10px !important;
            font-weight: 600 !important;
            height: 42px !important;
            padding: 0 20px !important;
          }

          .action-btn.primary { background-color: ${primaryNavy} !important; }
          .action-btn.outline { border-color: ${primaryNavy} !important; color: ${primaryNavy} !important; }

          .result-filter-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 28px 0 16px;
          }

          .filter-radio-group .ant-radio-button-wrapper-checked {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
          }

          .result-card-item {
            border-radius: 16px !important;
            margin-bottom: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
            border: 1px solid #E2E8F0 !important;
          }

          .result-card-item.is-correct { border-left: 5px solid #10B981 !important; }
          .result-card-item.is-wrong { border-left: 5px solid #EF4444 !important; }

          .card-question-header { display: flex; justify-content: space-between; }
          .question-badge { display: flex; align-items: center; gap: 8px; }
          .q-number { font-weight: 800; font-size: 13px; color: ${primaryNavy}; }
          .status-tag { border-radius: 6px !important; font-weight: 600; }

          .card-question-title {
            font-size: 15px;
            font-weight: 600;
            color: ${textDark};
            margin-top: 8px;
            margin-bottom: 0 !important;
          }

          .result-option-box {
            padding: 10px 14px;
            border-radius: 10px;
            border: 1px solid #E2E8F0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            min-height: 44px;
          }

          .option-normal { background: #FFFFFF; }
          .option-correct-target { background: #ECFDF5; border-color: #6EE7B7; }
          .option-wrong-target { background: #FEF2F2; border-color: #FCA5A5; }

          .opt-left { display: flex; gap: 8px; align-items: baseline; }
          .opt-key { font-weight: 800; color: ${primaryNavy}; }
          .opt-text { font-size: 13.5px; }
          .opt-badge { border-radius: 6px !important; margin: 0 !important; font-size: 11px; }

          .modal-title { color: ${primaryNavy}; font-weight: 800; }

          /* MOBILE RESPONSIVE TỐI ƯU */
          @media (max-width: 640px) {
            .glhn-exam-page { padding: 12px 8px 40px; }
            .exam-top-sticky-header { padding: 8px 10px; }
            .header-center { display: none; }
            .stats-grid { grid-template-columns: repeat(1, 1fr); }
            .result-filter-bar { flex-direction: column; align-items: flex-start; gap: 10px; }
          }
        `}</style>
      </div>
    </ConfigProvider>
  );
}
