import React, { useEffect } from "react";
import {
  Layout,
  Typography,
  Card,
  Row,
  Col,
  Button,
  Tag,
  Space,
  ConfigProvider,
} from "antd";
import {
  FilePdfOutlined,
  FileWordOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  SolutionOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";

// --- PHẦN IMPORT TÀI LIỆU ---
import DonXinHoc from "../assets/docs/DON-XIN-HOC-GIAO-LY-HON-NHAN.docx";
import ToKhaiHonPhoi from "../assets/docs/to-khai-hon-phoi.docx";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const DocumentsPage = () => {
  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  useEffect(() => {
    document.title = "Thủ Tục & Giấy Tờ | Giáo xứ Đồng Quan";
  }, []);

  const documentCategories = [
    {
      title: "Thủ tục Hành chính & Hôn phối",
      icon: <SolutionOutlined style={{ color: accentGold }} />,
      description:
        "Các mẫu đơn và danh mục giấy tờ cần thiết để chuẩn bị hồ sơ hôn phối theo quy định Giáo luật.",
      items: [
        {
          name: "Đơn xin học lớp Giáo lý Hôn nhân",
          type: "DOCX",
          size: "450 KB",
          format: "doc",
          fileSource: DonXinHoc,
        },
        {
          name: "Tờ khai đăng ký kết hôn Công Giáo",
          type: "DOCX",
          size: "1.2 MB",
          format: "doc",
          fileSource: ToKhaiHonPhoi,
        },
      ],
    },
  ];

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
      <Layout className="docs-editorial-root">
        <Content className="docs-editorial-wrapper">
          <div className="docs-editorial-container">
            {/* HEADER TÀI NGUYÊN */}
            <div className="docs-editorial-header">
              <span className="docs-tag-sacred">
                <CloudDownloadOutlined /> TRUNG TÂM TÀI LIỆU & BIỂU MẪU
              </span>
              <Title level={1} className="docs-editorial-title">
                Tài Nguyên & Biểu Mẫu
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="docs-editorial-subtitle">
                Tải xuống các tài liệu hướng dẫn, đơn từ và mẫu khai hồ sơ hôn
                phối từ hệ thống lưu trữ Giáo xứ.
              </Paragraph>
            </div>

            {/* DANH SÁCH TÀI LIỆU THEO DANH MỤC */}
            {documentCategories.map((category, idx) => (
              <div key={idx} className="docs-section-block">
                <div className="docs-section-header">
                  <div className="docs-section-icon">{category.icon}</div>
                  <div className="docs-section-text">
                    <span className="docs-section-subhead">
                      01 / DÀNH CHO TÂN TÒNG & HÔN PHỐI
                    </span>
                    <Title level={3} className="docs-section-title">
                      {category.title}
                    </Title>
                    <Text className="docs-section-desc">
                      {category.description}
                    </Text>
                  </div>
                </div>

                <Row gutter={[24, 24]}>
                  {category.items.map((item, itemIdx) => (
                    <Col xs={24} md={12} lg={8} key={itemIdx}>
                      <Card bordered={false} className="glhn-doc-card">
                        <div className="doc-card-body">
                          <div className="doc-file-icon">
                            {item.format === "pdf" ? (
                              <FilePdfOutlined className="icon-pdf" />
                            ) : (
                              <FileWordOutlined className="icon-word" />
                            )}
                          </div>
                          <div className="doc-file-info">
                            <Text strong className="doc-file-name">
                              {item.name}
                            </Text>
                            <Space size={6} className="doc-meta-space">
                              <Tag
                                bordered={false}
                                className={
                                  item.format === "pdf" ? "tag-pdf" : "tag-word"
                                }
                              >
                                {item.type}
                              </Tag>
                              <Text className="doc-file-size">{item.size}</Text>
                            </Space>
                          </div>
                        </div>

                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          block
                          className="doc-download-btn"
                          href={item.fileSource}
                          download={item.name}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Tải xuống ngay
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}

            {/* LƯU Ý DÀNH CHO ĐÔI BẠN */}
            <Card className="docs-footer-info-card" bordered={false}>
              <Space align="start" size={16}>
                <div className="info-icon-box">
                  <InfoCircleOutlined
                    style={{ color: primaryNavy, fontSize: 24 }}
                  />
                </div>
                <div>
                  <Title level={5} className="info-title">
                    Lưu ý dành cho đôi bạn & học viên
                  </Title>
                  <Text className="info-desc">
                    Mọi thắc mắc về quy trình điền đơn hoặc nếu đường link tải
                    file gặp sự cố, vui lòng liên hệ Văn phòng Ban Mục vụ Gia
                    đình Giáo xứ Đồng Quan để được hỗ trợ kịp thời.
                  </Text>
                </div>
              </Space>
            </Card>
          </div>
        </Content>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .docs-editorial-root { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .docs-editorial-wrapper { 
            padding: 60px 20px 80px 20px; 
          }

          .docs-editorial-container { 
            max-width: 1200px; 
            margin: 0 auto; 
          }

          /* Header Styling */
          .docs-editorial-header { 
            text-align: center; 
            margin-bottom: 50px; 
          }

          .docs-tag-sacred {
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
            margin-bottom: 16px;
          }

          .docs-editorial-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(32px, 5vw, 44px) !important; 
            font-weight: 700 !important; 
            color: ${primaryNavy} !important; 
            margin: 0 !important;
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin: 16px auto;
            border-radius: 2px;
          }

          .docs-editorial-subtitle { 
            font-size: 16px; 
            color: #64748b; 
            max-width: 650px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* Section Styling */
          .docs-section-block { 
            margin-bottom: 48px; 
          }

          .docs-section-header { 
            display: flex; 
            align-items: flex-start; 
            gap: 16px; 
            margin-bottom: 24px; 
          }

          .docs-section-icon { 
            font-size: 28px; 
            line-height: 1;
            margin-top: 4px;
          }

          .docs-section-subhead {
            font-size: 10px;
            letter-spacing: 2px;
            color: ${accentGold};
            font-weight: 700;
            text-transform: uppercase;
            display: block;
            margin-bottom: 4px;
          }

          .docs-section-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-weight: 700 !important;
          }

          .docs-section-desc {
            color: #64748b;
            font-size: 14px;
          }

          /* Document Card Styling */
          .glhn-doc-card { 
            border-radius: 20px !important; 
            border: 1px solid rgba(212, 175, 55, 0.25) !important; 
            background: #ffffff !important;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.04) !important;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important; 
            padding: 8px;
          }

          .glhn-doc-card:hover { 
            transform: translateY(-6px); 
            box-shadow: 0 16px 36px rgba(27, 54, 93, 0.12) !important; 
            border-color: ${accentGold} !important;
          }

          .doc-card-body { 
            display: flex; 
            gap: 16px; 
            margin-bottom: 20px; 
            min-height: 64px; 
            align-items: center;
          }

          .doc-file-icon { 
            font-size: 38px; 
            line-height: 1;
          }

          .icon-pdf { color: #7A1C1C; }
          .icon-word { color: ${primaryNavy}; }

          .doc-file-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .doc-file-name { 
            font-size: 15px; 
            color: ${primaryNavy}; 
            display: block; 
            line-height: 1.35;
            font-weight: 700;
          }

          .doc-meta-space {
            margin-top: 4px;
          }

          .tag-pdf {
            background: rgba(122, 28, 28, 0.1) !important;
            color: #7A1C1C !important;
            font-weight: 700;
            border-radius: 12px;
            font-size: 10px;
          }

          .tag-word {
            background: rgba(27, 54, 93, 0.1) !important;
            color: ${primaryNavy} !important;
            font-weight: 700;
            border-radius: 12px;
            font-size: 10px;
          }

          .doc-file-size {
            font-size: 12px;
            color: #64748b;
          }

          .doc-download-btn { 
            height: 44px !important; 
            border-radius: 10px !important; 
            font-weight: 700 !important; 
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
            transition: all 0.3s ease !important;
          }

          .doc-download-btn:hover {
            background: ${accentGold} !important;
            border-color: ${accentGold} !important;
            color: ${primaryNavy} !important;
          }

          /* Footer Info Card */
          .docs-footer-info-card { 
            background: #ffffff !important; 
            border-radius: 20px !important; 
            margin-top: 48px; 
            border: 1px solid rgba(212, 175, 55, 0.3) !important;
            box-shadow: 0 8px 24px rgba(27, 54, 93, 0.05) !important;
            padding: 8px;
          }

          .info-icon-box {
            background: rgba(212, 175, 55, 0.15);
            padding: 10px;
            border-radius: 12px;
            border: 1px solid ${accentGold};
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .info-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 0 4px 0 !important;
            font-weight: 700 !important;
          }

          .info-desc {
            color: #64748b;
            font-size: 14px;
            line-height: 1.6;
          }

          @media (max-width: 576px) {
            .docs-editorial-wrapper { padding: 40px 14px; }
            .doc-card-body { flex-direction: column; align-items: flex-start; gap: 8px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default DocumentsPage;
