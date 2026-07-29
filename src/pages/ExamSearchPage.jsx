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
  CloseCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

import { getExamResultByCode } from "../api/examResultApi";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// Helper giải mã details an toàn
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

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Navy Đậm
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

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
        message.success("Tra cứu thành công!");
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
          borderRadius: 14,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="exam-search-editorial-layout">
        <Content className="exam-search-wrapper">
          <div className="exam-search-container">
            {/* HEADER TRA CỨU */}
            <div className="exam-search-header">
              <span className="search-tag-sacred">
                <CompassOutlined /> HỆ THỐNG KHẢO KINH GIÁO XỨ
              </span>
              <Title level={2} className="search-title">
                TRA CỨU KẾT QUẢ KIỂM TRA KINH
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="search-subtitle">
                Nhập mã tra cứu (VD: EXAM-XXXXXX) được cấp để xem chi tiết điểm
                số và bài làm.
              </Paragraph>
            </div>

            {/* CARD NHẬP MÃ TRA CỨU */}
            <Card bordered={false} className="search-input-card">
              <Row gutter={[12, 12]} justify="center" align="middle">
                <Col xs={24} sm={16}>
                  <Input
                    size="large"
                    prefix={<KeyOutlined style={{ color: accentGold }} />}
                    placeholder="Nhập mã tra cứu (VD: EXAM-A1B2C3)"
                    value={searchCode}
                    onChange={(e) =>
                      setSearchCode(e.target.value.toUpperCase())
                    }
                    onPressEnter={handleSearch}
                    allowClear
                    className="search-input-box"
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
                    className="search-btn-navy"
                  >
                    Tra Cứu Kết Quả
                  </Button>
                </Col>
              </Row>
            </Card>

            {/* LOADING SPINNER */}
            {loading && (
              <div className="search-loading-box">
                <Spin size="large" />
                <Text
                  style={{ marginTop: 12, color: "#64748b", display: "block" }}
                >
                  Đang đối chiếu dữ liệu với hệ thống Giáo xứ...
                </Text>
              </div>
            )}

            {/* KẾT QUẢ TÌM THẤY */}
            {!loading && resultData && (
              <Card bordered={false} className="result-detail-card fade-in">
                <div className="result-header-box">
                  <Tag
                    className={`result-status-tag ${
                      resultData.score >= 50 ? "status-pass" : "status-fail"
                    }`}
                  >
                    {resultData.score >= 50 ? (
                      <CheckCircleFilled />
                    ) : (
                      <CloseCircleOutlined />
                    )}{" "}
                    {resultData.score >= 50 ? "ĐẠT YÊU CẦU" : "CHƯA ĐẠT"}
                  </Tag>

                  <Title level={3} className="result-student-name">
                    {resultData.full_name}
                  </Title>
                  <Text className="result-code-text">
                    Mã tra cứu:{" "}
                    <strong style={{ color: accentGold }}>
                      {resultData.exam_code}
                    </strong>
                  </Text>
                </div>

                {/* BẢNG THÔNG TIN MỤC VỤ */}
                <Descriptions
                  bordered
                  size="small"
                  column={{ xs: 1, sm: 2 }}
                  className="result-descriptions"
                >
                  <Descriptions.Item label="Đợt kiểm tra">
                    <Tag className="session-tag">
                      {resultData.exam_session ||
                        resultData.exam_session_name ||
                        "N/A"}
                    </Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Lớp">
                    <strong>{resultData.class_name || "—"}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Giáo xứ">
                    <strong>{resultData.parish || "Giáo xứ Đồng Quan"}</strong>
                  </Descriptions.Item>
                  <Descriptions.Item label="Thời gian nộp">
                    {resultData.submitted_at
                      ? dayjs(resultData.submitted_at).format(
                          "HH:mm:ss — DD/MM/YYYY",
                        )
                      : "—"}
                  </Descriptions.Item>
                </Descriptions>

                {/* TỔNG QUAN ĐIỂM SỐ */}
                <Row
                  gutter={[16, 16]}
                  justify="center"
                  style={{ marginBottom: 20 }}
                >
                  <Col xs={24} sm={14}>
                    <Card
                      size="small"
                      bordered={false}
                      className="score-summary-card"
                    >
                      <Statistic
                        title="Điểm Đạt Được Đợt Kiểm Tra"
                        value={resultData.score}
                        suffix="/ 100"
                        valueStyle={{
                          color: resultData.score >= 50 ? "#52c41a" : "#7A1C1C",
                          fontWeight: "bold",
                          fontFamily: "'Playfair Display', serif",
                        }}
                      />
                    </Card>
                  </Col>
                </Row>

                <Progress
                  percent={resultData.score}
                  strokeColor={resultData.score >= 50 ? "#52c41a" : "#7A1C1C"}
                  trailColor="rgba(27, 54, 93, 0.1)"
                  style={{ marginBottom: 24 }}
                />

                {resultData.feedback && (
                  <Alert
                    type="info"
                    message="Nhận xét từ Ban Giám Khảo / Giáo lý viên"
                    description={resultData.feedback}
                    className="result-feedback-alert"
                  />
                )}

                <Divider
                  style={{
                    margin: "28px 0 20px",
                    borderColor: "rgba(212, 175, 55, 0.25)",
                  }}
                />

                {/* CHI TIẾT TỪNG BÀI KINH */}
                <Title level={4} className="detail-prayers-title">
                  Chi tiết từng bài kinh ({detailsList.length} bài)
                </Title>

                <Space direction="vertical" style={{ width: "100%" }} size={16}>
                  {detailsList.length > 0 ? (
                    detailsList.map((item, idx) => (
                      <Card
                        key={idx}
                        size="small"
                        bordered={false}
                        className="prayer-detail-item-card"
                        title={
                          <div className="prayer-item-header">
                            <span>
                              <strong>
                                {idx + 1}. {item.prayerTitle}
                              </strong>
                            </span>
                            <Tag
                              className={
                                item.score >= 50
                                  ? "prayer-score-pass"
                                  : "prayer-score-fail"
                              }
                            >
                              Điểm: {item.score} / 100
                            </Tag>
                          </div>
                        }
                      >
                        <Paragraph className="prayer-stats-meta">
                          Từ đúng: <strong>{item.correctAnswers}</strong> / Bài
                          gốc: <strong>{item.totalQuestions}</strong> từ
                          (Sai/thiếu: {item.wrongAnswers})
                        </Paragraph>

                        <div className="user-answer-quote">
                          {item.userContent ||
                            "(Thí sinh bỏ trống không đọc/nhập bài kinh này)"}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Paragraph
                      type="secondary"
                      style={{ fontStyle: "italic", textAlign: "center" }}
                    >
                      Không có thông tin chi tiết từng bài kinh.
                    </Paragraph>
                  )}
                </Space>

                <div style={{ textAlign: "center", marginTop: 32 }}>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={handleReset}
                    className="reset-search-btn"
                  >
                    Tra cứu mã khác
                  </Button>
                </div>
              </Card>
            )}

            {/* KHÔNG TÌM THẤY KẾT QUẢ */}
            {!loading && searched && !resultData && (
              <Card bordered={false} className="empty-result-card">
                <Empty
                  description={
                    <span style={{ color: "#64748b", fontSize: 15 }}>
                      Không tìm thấy dữ liệu kiểm tra cho mã{" "}
                      <strong>{searchCode}</strong>
                    </span>
                  }
                />
                <Button
                  type="primary"
                  onClick={handleReset}
                  className="reset-search-btn"
                  style={{ marginTop: 20 }}
                >
                  Thử lại mã khác
                </Button>
              </Card>
            )}
          </div>
        </Content>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .exam-search-editorial-layout { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .exam-search-wrapper { 
            padding: 60px 16px 80px 16px; 
          }

          .exam-search-container { 
            max-width: 820px; 
            margin: 0 auto; 
          }

          /* Header Styling */
          .exam-search-header { 
            text-align: center; 
            margin-bottom: 32px; 
          }

          .search-tag-sacred {
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
            margin-bottom: 14px;
          }

          .search-title { 
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
            margin: 14px auto;
            border-radius: 2px;
          }

          .search-subtitle { 
            font-size: 15px; 
            color: #64748b; 
            max-width: 600px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* Input Search Card */
          .search-input-card {
            border-radius: 20px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.04) !important;
            margin-bottom: 24px;
            padding: 6px;
          }

          .search-input-box {
            border-radius: 10px !important;
            font-weight: 600;
            height: 44px;
          }

          .search-btn-navy {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            color: #ffffff !important;
            font-weight: 700;
            border-radius: 10px !important;
            height: 44px !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
          }

          .search-btn-navy:hover {
            background: #132744 !important;
          }

          .search-loading-box {
            text-align: center;
            padding: 60px 0;
          }

          /* Result Card Styling */
          .result-detail-card {
            border-radius: 20px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.06) !important;
            padding: 12px;
          }

          .fade-in {
            animation: fadeIn 0.4s ease-in;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .result-header-box {
            text-align: center;
            margin-bottom: 24px;
          }

          .result-status-tag {
            font-size: 13px !important;
            padding: 6px 18px !important;
            border-radius: 20px !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
          }

          .status-pass {
            background: #f6ffed !important;
            border-color: #b7eb8f !important;
            color: #237804 !important;
          }

          .status-fail {
            background: #fff2f0 !important;
            border-color: #ffccc7 !important;
            color: #7A1C1C !important;
          }

          .result-student-name {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 8px 0 2px 0 !important;
            font-weight: 700 !important;
          }

          .result-code-text {
            color: #64748b;
            font-size: 13px;
          }

          .result-descriptions {
            margin-bottom: 20px;
            background: ${softBg};
            border-radius: 12px;
            overflow: hidden;
          }

          .session-tag {
            background: rgba(212, 175, 55, 0.15) !important;
            border: 1px solid ${accentGold} !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            border-radius: 10px;
          }

          .score-summary-card {
            background: ${softBg} !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            border-radius: 14px !important;
            text-align: center;
          }

          .result-feedback-alert {
            border-radius: 12px !important;
            border: 1px solid rgba(212, 175, 55, 0.3) !important;
            background: ${softBg} !important;
          }

          .detail-prayers-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin-bottom: 16px !important;
            font-weight: 700 !important;
          }

          .prayer-detail-item-card {
            border-radius: 14px !important;
            border: 1px solid rgba(27, 54, 93, 0.1) !important;
            background: #ffffff !important;
          }

          .prayer-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: ${primaryNavy};
          }

          .prayer-score-pass {
            background: #f6ffed !important;
            color: #237804 !important;
            border-color: #b7eb8f !important;
            font-weight: 700;
          }

          .prayer-score-fail {
            background: #fff2f0 !important;
            color: #7A1C1C !important;
            border-color: #ffccc7 !important;
            font-weight: 700;
          }

          .prayer-stats-meta {
            margin: 0 0 10px 0 !important;
            color: #64748b;
            font-size: 13px;
          }

          .user-answer-quote {
            background: ${softBg};
            padding: 12px 16px;
            border-radius: 10px;
            border-left: 4px solid ${accentGold};
            color: ${textDark};
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 1.6;
          }

          .reset-search-btn {
            background: ${primaryNavy} !important;
            color: #ffffff !important;
            font-weight: 700;
            border-radius: 20px;
            height: 42px;
            padding: 0 28px;
            border: none !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
          }

          .reset-search-btn:hover {
            background: ${accentGold} !important;
            color: ${primaryNavy} !important;
          }

          .empty-result-card {
            border-radius: 20px !important;
            text-align: center;
            padding: 40px 20px;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
          }

          @media (max-width: 576px) {
            .exam-search-wrapper { padding: 40px 12px; }
            .prayer-item-header { flex-direction: column; align-items: flex-start; gap: 6px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default ExamSearchPage;
