import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  Input,
  Card,
  Pagination,
  ConfigProvider,
  Skeleton,
  Empty,
} from "antd";
import {
  SearchOutlined,
  CheckCircleFilled,
  QuestionCircleFilled,
  CompassOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { getQuestions } from "../api/questionApi"; // Import API của bạn

const { Title, Text, Paragraph } = Typography;

const ExamSearchPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // State quản lý Tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");

  // State Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Bảng màu thiết kế chuẩn Giáo xứ Đồng Quan
  const primaryNavy = "#0B192C";
  const accentGold = "#D4A017";
  const bgLight = "#F8FAFC";

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  // Hàm gọi API lấy danh sách câu hỏi
  const fetchQuestions = useCallback(
    async (page = 1, limit = pageSize, keyword = searchKeyword) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit,
          ...(keyword && { search: keyword, q: keyword }),
        };

        const res = await getQuestions(params);
        const dataList = res?.data?.data || res?.data || res || [];
        const total =
          res?.data?.pagination?.total ||
          res?.pagination?.total ||
          res?.total ||
          dataList.length;

        setQuestions(dataList);
        setTotalItems(total);
      } catch (err) {
        console.error("Lỗi lấy danh sách câu hỏi:", err);
        setQuestions([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, searchKeyword],
  );

  useEffect(() => {
    document.title = "Tra cứu Câu hỏi & Đáp án Giáo lý | Giáo xứ Đồng Quan";
    fetchQuestions(currentPage, pageSize, searchKeyword);
  }, [currentPage, pageSize, searchKeyword, fetchQuestions]);

  // Xử lý khi gõ vào ô tìm kiếm
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchKeyword(val);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  // Xử lý chuyển trang
  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Hàm lấy nội dung của đáp án đúng dựa vào đáp án (A, B, C, D)
  const getCorrectAnswerText = (item) => {
    const key = item.correct_answer ? item.correct_answer.toUpperCase() : "";
    switch (key) {
      case "A":
        return item.answer_a;
      case "B":
        return item.answer_b;
      case "C":
        return item.answer_c;
      case "D":
        return item.answer_d;
      default:
        return item.answer_b || item.answer_a || "Chưa cập nhật đáp án";
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentGold,
          borderRadius: 12,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        },
      }}
    >
      <div className="gx-search-page">
        {/* HEADER TRANG TÌM KIẾM */}
        <header className="gx-search-header">
          <div className="gx-container">
            <div className="header-top-tag">
              <CompassOutlined /> HỆ THỐNG TRA CỨU GIÁO LÝ
            </div>
            <Title className="gx-headline">
              TÌM CÂU HỎI <span>& ĐÁP ÁN</span>
            </Title>
            <Paragraph className="header-desc">
              Tra cứu nhanh câu hỏi trắc nghiệm và hiển thị trực tiếp đáp án
              chuẩn xác phục vụ ôn tập kiểm tra.
            </Paragraph>

            {/* THANH TÌM KIẾM TRUNG TÂM */}
            <div className="search-bar-box">
              <Input
                size="large"
                placeholder="Nhập từ khóa câu hỏi cần tra cứu..."
                prefix={
                  <SearchOutlined
                    style={{ color: accentGold, fontSize: 20, marginRight: 8 }}
                  />
                }
                value={searchKeyword}
                onChange={handleSearchChange}
                allowClear
                className="custom-search-input"
              />
            </div>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH */}
        <main className="gx-container gx-search-content">
          {/* MÔ TẢ SỐ LƯỢNG KẾT QUẢ */}
          <div className="search-meta-bar">
            <Text type="secondary">
              Tìm thấy{" "}
              <strong style={{ color: primaryNavy }}>{totalItems}</strong> câu
              hỏi
              {searchKeyword && (
                <span>
                  {" "}
                  cho từ khóa "
                  <span style={{ color: accentGold }}>{searchKeyword}</span>"
                </span>
              )}
            </Text>
          </div>

          {/* DANH SÁCH CÂU HỎI */}
          {loading ? (
            <div className="search-skeleton-list">
              {[1, 2, 3].map((n) => (
                <Card key={n} style={{ marginBottom: 16, borderRadius: 16 }}>
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="empty-search-box">
              <Empty
                description={
                  <Text type="secondary">
                    Không tìm thấy câu hỏi phù hợp với từ khóa "
                    <strong>{searchKeyword}</strong>"
                  </Text>
                }
              />
            </div>
          ) : (
            <div className="questions-list">
              {questions.map((item, index) => {
                const correctText = getCorrectAnswerText(item);
                const correctKey = item.correct_answer
                  ? item.correct_answer.toUpperCase()
                  : "ĐÚNG";

                return (
                  <motion.div
                    key={item.id || index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeInUp}
                    className="question-card-wrapper"
                  >
                    <Card bordered={false} className="question-item-card">
                      {/* CỘT META TRÊN BÀI HỌC */}
                      <div className="card-top-meta">
                        <span className="question-id-badge">
                          #Câu {item.id}
                        </span>
                      </div>

                      {/* TÊN CÂU HỎI */}
                      <div className="question-title-box">
                        <QuestionCircleFilled className="question-icon" />
                        <Title level={4} className="question-text">
                          {item.question}
                        </Title>
                      </div>

                      {/* HIỂN THỊ DUY NHẤT 1 KHUNG ĐÁP ÁN ĐÚNG NỔI BẬT */}
                      <div className="single-correct-answer-box">
                        <div className="answer-badge-header">
                          <CheckCircleFilled className="badge-icon" />
                          <span>ĐÁP ÁN ĐÚNG ({correctKey})</span>
                        </div>
                        <div className="answer-body-text">
                          <CheckOutlined className="check-text-icon" />
                          <Text className="correct-text-content">
                            {correctText}
                          </Text>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* BỘ PHÂN TRANG */}
          {totalItems > 0 && (
            <div className="gx-pagination-wrapper">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          )}
        </main>

        {/* STYLESHEET SCOPED DEDICATED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .gx-search-page {
            background-color: ${bgLight};
            min-height: 100vh;
            padding-bottom: 80px;
            font-family: 'Be Vietnam Pro', -apple-system, sans-serif;
            color: #333333;
          }

          .gx-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
            width: 100%;
          }

          /* HEADER SEARCH */
          .gx-search-header {
            padding: 50px 0 30px;
            text-align: center;
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 28px;
          }

          .header-top-tag {
            font-size: 11px;
            letter-spacing: 2px;
            color: ${accentGold};
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-transform: uppercase;
            margin-bottom: 10px;
          }

          .gx-headline {
            font-size: clamp(26px, 4vw, 38px) !important;
            font-weight: 800 !important;
            color: ${primaryNavy} !important;
            margin: 0 0 12px 0 !important;
            line-height: 1.2 !important;
          }

          .gx-headline span {
            color: ${accentGold};
            font-style: italic;
            font-weight: 400;
          }

          .header-desc {
            color: #64748b;
            font-size: 14px;
            max-width: 580px;
            margin: 0 auto 24px auto !important;
            line-height: 1.6;
          }

          .search-bar-box {
            max-width: 650px;
            margin: 0 auto;
          }

          .custom-search-input {
            border-radius: 30px !important;
            padding: 10px 24px !important;
            border: 2px solid rgba(212, 160, 23, 0.35) !important;
            box-shadow: 0 8px 24px rgba(11, 25, 44, 0.06) !important;
            font-size: 15px !important;
            transition: all 0.3s ease !important;
          }

          .custom-search-input:hover, .custom-search-input:focus-within {
            border-color: ${accentGold} !important;
            box-shadow: 0 12px 28px rgba(212, 160, 23, 0.2) !important;
          }

          /* META BAR */
          .search-meta-bar {
            margin-bottom: 16px;
            font-size: 13px;
          }

          /* QUESTION CARD ITEM */
          .question-card-wrapper {
            margin-bottom: 16px;
          }

          .question-item-card {
            background: #ffffff !important;
            border-radius: 16px !important;
            border: 1px solid #e2e8f0 !important;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02) !important;
            padding: 18px 20px !important;
            transition: all 0.3s ease !important;
          }

          .question-item-card:hover {
            box-shadow: 0 8px 24px rgba(11, 25, 44, 0.08) !important;
            border-color: rgba(212, 160, 23, 0.4) !important;
          }

          .card-top-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }

          .lesson-tag {
            background: rgba(11, 25, 44, 0.05) !important;
            border: 1px solid rgba(11, 25, 44, 0.12) !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 11px;
          }

          .question-id-badge {
            font-size: 12px;
            font-weight: 700;
            color: #94a3b8;
          }

          .question-title-box {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 16px;
          }

          .question-icon {
            color: ${accentGold};
            font-size: 20px;
            margin-top: 3px;
            flex-shrink: 0;
          }

          .question-text {
            color: ${primaryNavy} !important;
            font-size: 17px !important;
            font-weight: 700 !important;
            margin: 0 !important;
            line-height: 1.45 !important;
          }

          /* SINGLE CORRECT ANSWER BOX */
          .single-correct-answer-box {
            background: linear-gradient(135deg, rgba(212, 160, 23, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%);
            border: 1.5px solid ${accentGold};
            border-radius: 12px;
            padding: 14px 16px;
            box-shadow: 0 4px 12px rgba(212, 160, 23, 0.1);
          }

          .answer-badge-header {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: ${accentGold};
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 3px 10px;
            border-radius: 12px;
            letter-spacing: 0.8px;
            margin-bottom: 8px;
          }

          .badge-icon {
            font-size: 12px;
          }

          .answer-body-text {
            display: flex;
            align-items: flex-start;
            gap: 8px;
          }

          .check-text-icon {
            color: #52c41a;
            font-size: 16px;
            margin-top: 3px;
            flex-shrink: 0;
          }

          .correct-text-content {
            font-size: 15px !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            line-height: 1.5 !important;
          }

          /* PAGINATION */
          .gx-pagination-wrapper {
            display: flex;
            justify-content: center;
            margin-top: 32px;
          }

          .gx-pagination-wrapper .ant-pagination-item-active {
            background-color: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
          }

          .gx-pagination-wrapper .ant-pagination-item-active a {
            color: ${accentGold} !important;
          }

          .empty-search-box {
            padding: 60px 0;
            background: #ffffff;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
          }

          @media (max-width: 768px) {
            .gx-search-header { padding: 30px 0 20px; }
            .question-item-card { padding: 14px !important; }
            .question-text { font-size: 15px !important; }
            .correct-text-content { font-size: 14px !important; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default ExamSearchPage;
