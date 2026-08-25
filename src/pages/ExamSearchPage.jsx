import React, { useState } from "react";
import {
  Layout,
  Card,
  Input,
  Button,
  Typography,
  Space,
  Tag,
  Descriptions,
  Progress,
  Alert,
  Row,
  Col,
  Statistic,
  Empty,
  Spin,
  message,
  Divider,
  ConfigProvider,
} from "antd";
import {
  SearchOutlined,
  KeyOutlined,
  CheckCircleFilled,
  ReloadOutlined,
  CompassOutlined,
  CloseCircleFilled,
  ReadOutlined,
  UserOutlined,
  CalendarOutlined,
  BankOutlined,
  BookOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { getExamResultByCode } from "../api/examResultApi";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const getParsedDetails = (record) => {
  if (!record) return [];
  if (Array.isArray(record.details)) return record.details;

  const rawContent = record.details || record.user_content;
  if (typeof rawContent === "string") {
    try {
      const parsed = JSON.parse(rawContent);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }
  return [];
};

const ExamSearchPage = () => {
  const [searchCode, setSearchCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [searched, setSearched] = useState(false);

  const primaryNavy = "#1B365D";
  const accentGold = "#D4AF37";
  const textDark = "#0F172A";
  const softBg = "#F8FAFC";

  const handleSearch = async () => {
    const code = searchCode.trim().toUpperCase();
    if (!code) {
      message.warning("Vui lòng nhập mã tra cứu!");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const res = await getExamResultByCode(code);

      const data = res?.data?.data || res?.data || res;
      if (data && data.id) {
        setResultData(data);
        message.success("Tra cứu kết quả thành công!");
      } else {
        setResultData(null);
        message.error("Không tìm thấy kết quả phù hợp!");
      }
    } catch (error) {
      console.error("Lỗi tra cứu:", error);
      setResultData(null);
      message.error(
        error?.response?.data?.message ||
          "Không tìm thấy kết quả cho mã tra cứu này!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSearchCode("");
    setResultData(null);
    setSearched(false);
  };

  const detailsList = getParsedDetails(resultData);

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
      <Layout className="exam-search-redesign-layout">
        <Content className="exam-search-wrapper">
          <div className="exam-search-container">
            {/* HEADER TRA CỨU */}
            <div className="exam-search-header-hero">
              <span className="search-badge-sacred">
                <CompassOutlined /> HỆ THỐNG KHẢO KINH GIÁO XỨ
              </span>
              <Title level={2} className="search-main-title">
                TRA CỨU KẾT QUẢ KIỂM TRA KINH
              </Title>
              <div className="accent-bar-divider" />
              <Paragraph className="search-sub-title">
                Nhập mã tra cứu cá nhân (VD: <strong>EXAM-A1B2C3</strong>) để
                xem chi tiết kết quả khảo kinh và nhận xét của Ban Giám Khảo.
              </Paragraph>
            </div>

            {/* CARD NHẬP MÃ TRA CỨU */}
            <Card bordered={false} className="search-box-card">
              <Row gutter={[12, 12]} justify="center" align="middle">
                <Col xs={24} sm={16}>
                  <Input
                    size="large"
                    prefix={
                      <KeyOutlined
                        style={{ color: accentGold, fontSize: 18 }}
                      />
                    }
                    placeholder="Nhập mã tra cứu (VD: EXAM-XXXXXX)"
                    value={searchCode}
                    onChange={(e) =>
                      setSearchCode(e.target.value.toUpperCase())
                    }
                    onPressEnter={handleSearch}
                    allowClear
                    className="custom-search-input"
                  />
                </Col>
                <Col xs={24} sm={8}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<SearchOutlined />}
                    loading={loading}
                    onClick={handleSearch}
                    className="custom-search-btn"
                  >
                    Tra Cứu Ngay
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* LOADING SPINNER */}
            {loading && (
              <div className="search-loading-wrapper">
                <Spin size="large" />
                <Text className="loading-text">
                  Đang truy xuất và đối chiếu dữ liệu khảo kinh...
                </Text>
              </div>
            )}

            {/* KẾT QUẢ TÌM THẤY */}
            {!loading && resultData && (
              <div className="result-content-container fade-in-up">
                {/* 1. KẾT QUẢ TỔNG QUAN HỌC VIÊN */}
                <Card bordered={false} className="result-hero-card">
                  <div className="result-status-banner">
                    <Tag
                      className={`status-chip ${
                        resultData.score >= 50 ? "is-passed" : "is-failed"
                      }`}
                    >
                      {resultData.score >= 50 ? (
                        <CheckCircleFilled />
                      ) : (
                        <CloseCircleFilled />
                      )}
                      <span>
                        {resultData.score >= 50 ? "ĐẠT YÊU CẦU" : "CHƯA ĐẠT"}
                      </span>
                    </Tag>
                  </div>

                  <Title level={3} className="student-name">
                    <UserOutlined
                      style={{ marginRight: 8, color: primaryNavy }}
                    />
                    {resultData.full_name}
                  </Title>

                  <div className="exam-code-badge">
                    MÃ TRA CỨU: <span>{resultData.exam_code}</span>
                  </div>

                  <Row
                    gutter={[16, 16]}
                    style={{ marginTop: 24, marginBottom: 12 }}
                  >
                    <Col xs={24} md={10}>
                      <div className="score-summary-box">
                        <Statistic
                          title="Điểm Tổng Kết"
                          value={resultData.score}
                          suffix="/ 100"
                          valueStyle={{
                            color:
                              resultData.score >= 50 ? "#10B981" : "#EF4444",
                            fontWeight: "800",
                            fontSize: "36px",
                          }}
                        />
                        <Progress
                          percent={resultData.score}
                          strokeColor={
                            resultData.score >= 50 ? "#10B981" : "#EF4444"
                          }
                          trailColor="rgba(27, 54, 93, 0.08)"
                          showInfo={false}
                          style={{ marginTop: 8 }}
                        />
                      </div>
                    </Col>

                    <Col xs={24} md={14}>
                      <Descriptions
                        bordered
                        size="small"
                        column={1}
                        className="info-descriptions"
                      >
                        <Descriptions.Item
                          label={
                            <>
                              <BookOutlined /> Đợt khảo kinh
                            </>
                          }
                        >
                          <Tag color="gold" className="session-tag-chip">
                            {resultData.exam_session ||
                              resultData.exam_session_name ||
                              "—"}
                          </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <>
                              <ReadOutlined /> Lớp học
                            </>
                          }
                        >
                          <strong>{resultData.class_name || "—"}</strong>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <>
                              <BankOutlined /> Giáo xứ
                            </>
                          }
                        >
                          <strong>
                            {resultData.parish || "Giáo xứ Đồng Quan"}
                          </strong>
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={
                            <>
                              <CalendarOutlined /> Thời gian nộp
                            </>
                          }
                        >
                          {resultData.submitted_at
                            ? dayjs(resultData.submitted_at).format(
                                "HH:mm:ss — DD/MM/YYYY",
                              )
                            : "—"}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                  </Row>

                  {resultData.feedback && (
                    <Alert
                      type="info"
                      showIcon
                      message="Nhận xét từ Ban Giám Khảo / Giáo lý viên"
                      description={resultData.feedback}
                      className="feedback-alert-box"
                    />
                  )}
                </Card>

                {/* 2. CHI TIẾT TỪNG BÀI KINH */}
                <Card bordered={false} className="prayers-list-card">
                  <div className="prayers-list-header">
                    <Title
                      level={4}
                      style={{ margin: 0, color: primaryNavy, fontWeight: 700 }}
                    >
                      <ReadOutlined
                        style={{ marginRight: 8, color: accentGold }}
                      />
                      Chi tiết từng bài kinh ({detailsList.length} bài)
                    </Title>
                  </div>

                  <Divider style={{ margin: "16px 0 24px" }} />

                  <Space
                    direction="vertical"
                    style={{ width: "100%" }}
                    size={16}
                  >
                    {detailsList.length > 0 ? (
                      detailsList.map((item, idx) => (
                        <div key={idx} className="prayer-item-container">
                          <div className="prayer-item-top">
                            <span className="prayer-item-title">
                              {idx + 1}. {item.prayerTitle}
                            </span>
                            <Tag
                              className={`prayer-score-tag ${
                                item.score >= 50 ? "pass" : "fail"
                              }`}
                            >
                              {item.score} / 100 điểm
                            </Tag>
                          </div>

                          <div className="prayer-stats-row">
                            <span>
                              Từ đúng:{" "}
                              <strong style={{ color: "#10B981" }}>
                                {item.correctAnswers}
                              </strong>
                            </span>
                            <span>
                              Tổng bài gốc:{" "}
                              <strong>{item.totalQuestions} từ</strong>
                            </span>
                            <span>
                              Sai / thiếu:{" "}
                              <strong style={{ color: "#EF4444" }}>
                                {item.wrongAnswers}
                              </strong>
                            </span>
                          </div>

                          <div className="user-answer-box">
                            <div className="quote-label">
                              Bài làm của học viên:
                            </div>
                            {item.userContent || (
                              <span
                                style={{
                                  fontStyle: "italic",
                                  color: "#94A3B8",
                                }}
                              >
                                (Thí sinh bỏ trống không nhập bài kinh này)
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <Paragraph
                        type="secondary"
                        style={{
                          fontStyle: "italic",
                          textAlign: "center",
                          padding: "20px 0",
                        }}
                      >
                        Không có thông tin chi tiết bài làm cho đợt kiểm tra
                        này.
                      </Paragraph>
                    )}
                  </Space>

                  <div style={{ textAlign: "center", marginTop: 32 }}>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={handleReset}
                      className="reset-btn"
                    >
                      Tra cứu mã khác
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {/* KHÔNG TÌM THẤY KẾT QUẢ */}
            {!loading && searched && !resultData && (
              <Card bordered={false} className="empty-state-card">
                <Empty
                  description={
                    <span style={{ color: "#64748B", fontSize: 15 }}>
                      Không tìm thấy kết quả kiểm tra cho mã:{" "}
                      <strong>{searchCode}</strong>
                    </span>
                  }
                />
                <Button
                  type="primary"
                  onClick={handleReset}
                  className="reset-btn"
                  style={{ marginTop: 20 }}
                >
                  Thử lại với mã khác
                </Button>
              </Card>
            )}
          </div>
        </Content>

        {/* CSS STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .exam-search-redesign-layout {
            background: ${softBg};
            min-height: 100vh;
            color: ${textDark};
          }

          .exam-search-wrapper {
            padding: 48px 16px 80px;
          }

          .exam-search-container {
            max-width: 820px;
            margin: 0 auto;
          }

          /* HERO HEADER */
          .exam-search-header-hero {
            text-align: center;
            margin-bottom: 32px;
          }

          .search-badge-sacred {
            background: rgba(212, 175, 55, 0.12);
            border: 1px solid rgba(212, 175, 55, 0.4);
            color: ${primaryNavy};
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.2px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 12px;
          }

          .search-main-title {
            color: ${primaryNavy} !important;
            font-weight: 800 !important;
            font-size: clamp(24px, 4vw, 34px) !important;
            margin: 0 !important;
            letter-spacing: -0.5px;
          }

          .accent-bar-divider {
            width: 50px;
            height: 3px;
            background: ${accentGold};
            margin: 12px auto 16px;
            border-radius: 2px;
          }

          .search-sub-title {
            color: #64748B;
            font-size: 14.5px;
            max-width: 580px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* INPUT CARD */
          .search-box-card {
            border-radius: 20px !important;
            background: #ffffff !important;
            box-shadow: 0 10px 25px -5px rgba(27, 54, 93, 0.06) !important;
            border: 1px solid #E2E8F0 !important;
            padding: 8px;
            margin-bottom: 28px;
          }

          .custom-search-input {
            border-radius: 10px !important;
            height: 46px;
            font-weight: 600;
          }

          .custom-search-btn {
            background-color: ${primaryNavy} !important;
            border-radius: 10px !important;
            height: 46px !important;
            font-weight: 700 !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
          }

          .search-loading-wrapper {
            text-align: center;
            padding: 60px 0;
          }

          .loading-text {
            display: block;
            margin-top: 14px;
            color: #64748B;
            font-weight: 500;
          }

          /* FADE IN ANIMATION */
          .fade-in-up {
            animation: fadeInUp 0.4s ease-out;
          }

          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* RESULT HERO CARD */
          .result-hero-card {
            border-radius: 20px !important;
            background: #ffffff !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05) !important;
            border: 1px solid #E2E8F0 !important;
            padding: 12px;
            margin-bottom: 24px;
          }

          .result-status-banner {
            display: flex;
            justify-content: center;
            margin-bottom: 12px;
          }

          .status-chip {
            border-radius: 20px !important;
            padding: 6px 18px !important;
            font-weight: 800 !important;
            font-size: 12.5px !important;
            display: flex;
            align-items: center;
            gap: 6px;
            letter-spacing: 0.5px;
          }

          .status-chip.is-passed {
            background: #ECFDF5 !important;
            border-color: #A7F3D0 !important;
            color: #059669 !important;
          }

          .status-chip.is-failed {
            background: #FEF2F2 !important;
            border-color: #FECACA !important;
            color: #DC2626 !important;
          }

          .student-name {
            text-align: center;
            color: ${primaryNavy} !important;
            font-weight: 800 !important;
            margin: 4px 0 !important;
          }

          .exam-code-badge {
            text-align: center;
            font-size: 13px;
            color: #64748B;
          }

          .exam-code-badge span {
            font-weight: 700;
            color: ${accentGold};
            letter-spacing: 0.5px;
          }

          .score-summary-box {
            background: #F8FAFC;
            border-radius: 14px;
            padding: 16px;
            border: 1px solid #E2E8F0;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }

          .info-descriptions {
            background: #FFFFFF;
            border-radius: 12px;
            overflow: hidden;
          }

          .session-tag-chip {
            border-radius: 6px !important;
            font-weight: 700 !important;
          }

          .feedback-alert-box {
            border-radius: 12px !important;
            margin-top: 16px;
            border: 1px solid #BAE6FD !important;
            background: #F0F9FF !important;
          }

          /* PRAYERS LIST CARD */
          .prayers-list-card {
            border-radius: 20px !important;
            background: #ffffff !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05) !important;
            border: 1px solid #E2E8F0 !important;
            padding: 12px;
          }

          .prayer-item-container {
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 14px;
            padding: 16px;
          }

          .prayer-item-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
          }

          .prayer-item-title {
            font-weight: 700;
            font-size: 15px;
            color: ${primaryNavy};
          }

          .prayer-score-tag {
            border-radius: 8px !important;
            font-weight: 700 !important;
            padding: 2px 10px !important;
          }

          .prayer-score-tag.pass {
            background: #ECFDF5 !important;
            color: #059669 !important;
            border-color: #A7F3D0 !important;
          }

          .prayer-score-tag.fail {
            background: #FEF2F2 !important;
            color: #DC2626 !important;
            border-color: #FECACA !important;
          }

          .prayer-stats-row {
            display: flex;
            gap: 16px;
            font-size: 13px;
            color: #64748B;
            margin-bottom: 12px;
          }

          .user-answer-box {
            background: #FFFFFF;
            border-radius: 10px;
            padding: 12px 14px;
            border-left: 3px solid ${accentGold};
            border-top: 1px solid #F1F5F9;
            border-right: 1px solid #F1F5F9;
            border-bottom: 1px solid #F1F5F9;
            font-size: 14px;
            line-height: 1.6;
            color: ${textDark};
            white-space: pre-wrap;
          }

          .quote-label {
            font-size: 11px;
            font-weight: 700;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
          }

          .reset-btn {
            background-color: ${primaryNavy} !important;
            color: #FFFFFF !important;
            border-radius: 10px !important;
            font-weight: 700 !important;
            height: 42px;
            padding: 0 24px;
            border: none !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.15);
          }

          .reset-btn:hover {
            background-color: #132744 !important;
          }

          .empty-state-card {
            border-radius: 20px !important;
            background: #ffffff !important;
            border: 1px solid #E2E8F0 !important;
            text-align: center;
            padding: 40px 20px;
          }

          @media (max-width: 576px) {
            .exam-search-wrapper { padding: 24px 12px; }
            .prayer-item-top { flex-direction: column; align-items: flex-start; gap: 6px; }
            .prayer-stats-row { flex-direction: column; gap: 4px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default ExamSearchPage;
