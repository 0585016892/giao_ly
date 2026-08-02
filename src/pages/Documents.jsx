import React, { useEffect, useState, useMemo } from "react";
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
  Spin,
  Empty,
  Input,
  Select,
  message,
  Statistic,
  Divider,
  Pagination,
  Modal,
} from "antd";
import {
  FilePdfOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileUnknownOutlined,
  DownloadOutlined,
  InfoCircleOutlined,
  CloudDownloadOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  SearchOutlined,
  PhoneOutlined,
  StarFilled,
  FullscreenOutlined,
} from "@ant-design/icons";

// Import API
import { getDocuments, downloadDocument } from "../api/documentApi";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const DocumentsPage = () => {
  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // State bộ lọc & phân trang
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // State Modal Preview File
  const [previewDoc, setPreviewDoc] = useState(null);

  useEffect(() => {
    document.title = "Kho Tài Liệu & Biểu Mẫu | Giáo xứ Đồng Quan";
    fetchDocumentsList();
  }, []);

  // 1. GỌI API LẤY DANH SÁCH TÀI LIỆU
  const fetchDocumentsList = async () => {
    try {
      setLoading(true);
      const res = await getDocuments();
      const data = res?.data?.data || res?.data || [];
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách tài liệu:", err);
      message.error("Không thể tải danh sách tài liệu từ hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  // 2. GỌI API TẢI TÀI LIỆU
  const handleDownload = async (item) => {
    try {
      if (!item?.file_url) {
        message.error("Đường dẫn file không hợp lệ!");
        return;
      }

      setDownloadingId(item.id);
      await downloadDocument(item.id);

      // Cập nhật lượt tải local
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === item.id
            ? { ...doc, download_count: (doc.download_count || 0) + 1 }
            : doc,
        ),
      );

      window.open(getFullFileUrl(item.file_url), "_blank");
      message.success("Đang bắt đầu tải xuống...");
    } catch (err) {
      console.error("Lỗi khi tải file:", err);
      message.error("Không thể tải tài liệu này!");
    } finally {
      setDownloadingId(null);
    }
  };

  // 3. TÍNH TOÁN BỘ LỌC TÀI LIỆU
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchKeyword =
        !keyword ||
        doc.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        doc.description?.toLowerCase().includes(keyword.toLowerCase());

      const matchCategory =
        selectedCategory === "all" || doc.category === selectedCategory;

      return matchKeyword && matchCategory;
    });
  }, [documents, keyword, selectedCategory]);

  // 4. DANH SÁCH TÀI LIỆU SAU PHÂN TRANG
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, currentPage]);

  // 5. NHÓM TÀI LIỆU THEO DANH MỤC TỪ TRANG HIỆN TẠI
  const groupedCategories = useMemo(() => {
    const groups = {};
    paginatedDocuments.forEach((doc) => {
      const catName = doc.category || "Tài liệu chung";
      if (!groups[catName]) {
        groups[catName] = [];
      }
      groups[catName].push(doc);
    });

    return Object.keys(groups).map((catName) => ({
      title: catName,
      items: groups[catName],
    }));
  }, [paginatedDocuments]);

  // Lấy danh sách danh mục duy nhất cho Select
  const categoryOptions = useMemo(() => {
    const cats = [...new Set(documents.map((d) => d.category).filter(Boolean))];
    return [
      { label: "Tất cả danh mục", value: "all" },
      ...cats.map((c) => ({ label: c, value: c })),
    ];
  }, [documents]);

  // Thống kê nhanh
  const statsOverview = useMemo(() => {
    const totalDocs = documents.length;
    const totalDownloads = documents.reduce(
      (sum, item) => sum + (Number(item.download_count) || 0),
      0,
    );
    const totalViews = documents.reduce(
      (sum, item) => sum + (Number(item.view_count) || 0),
      0,
    );
    return { totalDocs, totalDownloads, totalViews };
  }, [documents]);

  // Format dung lượng Byte
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "Tài liệu";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper Icon & Tag
  const renderFileMeta = (fileType, fileName, fileUrl) => {
    const typeStr = (fileType || fileName || fileUrl || "").toLowerCase();

    if (typeStr.includes("pdf")) {
      return {
        icon: <FilePdfOutlined className="icon-pdf" />,
        tagClass: "tag-pdf",
        label: "PDF",
      };
    }
    if (
      typeStr.includes("doc") ||
      typeStr.includes("word") ||
      typeStr.includes("docx")
    ) {
      return {
        icon: <FileWordOutlined className="icon-word" />,
        tagClass: "tag-word",
        label: "DOCX",
      };
    }
    if (
      typeStr.includes("xls") ||
      typeStr.includes("sheet") ||
      typeStr.includes("excel")
    ) {
      return {
        icon: <FileExcelOutlined style={{ color: "#27ae60" }} />,
        tagClass: "tag-excel",
        label: "EXCEL",
      };
    }
    return {
      icon: <FileUnknownOutlined style={{ color: accentGold }} />,
      tagClass: "tag-word",
      label: "FILE",
    };
  };

  // Tạo URL đầy đủ xem file
  const getFullFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
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
      <Layout className="docs-editorial-root">
        <Content className="docs-editorial-wrapper">
          <div className="docs-editorial-container">
            {/* HEADER TÀI NGUYÊN */}
            <div className="docs-editorial-header">
              <span className="docs-tag-sacred">
                <CloudDownloadOutlined /> HỆ THỐNG LƯU TRỮ MỤC VỤ
              </span>
              <Title level={1} className="docs-editorial-title">
                Kho Tài Liệu & Biểu Mẫu
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="docs-editorial-subtitle">
                Tra cứu và tải xuống các biểu mẫu đơn từ, thủ tục hôn phối, giáo
                lý và văn bản chính thức từ Giáo xứ Đồng Quan.
              </Paragraph>
            </div>

            {/* BỐ CỤC CHÍNH 2 CỘT */}
            <Row gutter={[32, 32]}>
              {/* CỘT TRÁI: TÌM KIẾM & DANH SÁCH TÀI LIỆU (17 COLS) */}
              <Col xs={24} lg={17}>
                {/* THANH LỌC VÀ TÌM KIẾM */}
                <Card bordered={false} className="docs-filter-card">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={14}>
                      <Search
                        placeholder="Tìm kiếm tài liệu, tên file..."
                        allowClear
                        enterButton={<SearchOutlined />}
                        onChange={(e) => {
                          setKeyword(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </Col>
                    <Col xs={24} sm={10}>
                      <Select
                        style={{ width: "100%" }}
                        value={selectedCategory}
                        onChange={(val) => {
                          setSelectedCategory(val);
                          setCurrentPage(1);
                        }}
                        options={categoryOptions}
                      />
                    </Col>
                  </Row>
                </Card>

                {/* DANH SÁCH TÀI LIỆU */}
                {loading ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <Spin size="large" tip="Đang tải dữ liệu..." />
                  </div>
                ) : groupedCategories.length === 0 ? (
                  <Card
                    bordered={false}
                    className="glhn-doc-card"
                    style={{ padding: "40px 0" }}
                  >
                    <Empty description="Không tìm thấy tài liệu nào phù hợp." />
                  </Card>
                ) : (
                  <>
                    {groupedCategories.map((category, idx) => (
                      <div key={idx} className="docs-section-block">
                        <div className="docs-section-header">
                          <FolderOpenOutlined className="docs-section-icon" />
                          <Title level={4} className="docs-section-title">
                            {category.title}
                          </Title>
                        </div>

                        <Row gutter={[16, 16]}>
                          {category.items.map((item) => {
                            const meta = renderFileMeta(
                              item.file_type,
                              item.file_name,
                              item.file_url,
                            );

                            return (
                              <Col xs={24} sm={12} key={item.id}>
                                <Card
                                  bordered={false}
                                  className="glhn-doc-card"
                                >
                                  {Boolean(item.is_featured) && (
                                    <div className="featured-badge">
                                      <StarFilled /> Nổi bật
                                    </div>
                                  )}

                                  <div className="doc-card-body">
                                    <div className="doc-file-icon">
                                      {meta.icon}
                                    </div>
                                    <div className="doc-file-info">
                                      <Text
                                        strong
                                        className="doc-file-name"
                                        ellipsis={{ tooltip: item.title }}
                                      >
                                        {item.title}
                                      </Text>
                                      <Space
                                        size={6}
                                        className="doc-meta-space"
                                      >
                                        <Tag
                                          bordered={false}
                                          className={meta.tagClass}
                                        >
                                          {meta.label}
                                        </Tag>
                                        <Text className="doc-file-size">
                                          {formatFileSize(item.file_size)}
                                        </Text>
                                      </Space>
                                    </div>
                                  </div>

                                  <div className="doc-stats-bar">
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      <EyeOutlined /> {item.view_count || 0}{" "}
                                      lượt xem
                                    </Text>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      <DownloadOutlined />{" "}
                                      {item.download_count || 0} lượt tải
                                    </Text>
                                  </div>

                                  <Space
                                    style={{ width: "100%", marginTop: 8 }}
                                    direction="vertical"
                                  >
                                    <Button
                                      type="primary"
                                      icon={<DownloadOutlined />}
                                      block
                                      className="doc-download-btn"
                                      loading={downloadingId === item.id}
                                      onClick={() => handleDownload(item)}
                                    >
                                      Tải xuống
                                    </Button>
                                    <Button
                                      type="default"
                                      icon={<EyeOutlined />}
                                      block
                                      style={{ borderRadius: 10 }}
                                      onClick={() => setPreviewDoc(item)}
                                    >
                                      Xem trước
                                    </Button>
                                  </Space>
                                </Card>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    ))}

                    {/* PHÂN TRANG */}
                    {filteredDocuments.length > pageSize && (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: 24,
                          marginBottom: 24,
                        }}
                      >
                        <Pagination
                          current={currentPage}
                          total={filteredDocuments.length}
                          pageSize={pageSize}
                          onChange={(page) => setCurrentPage(page)}
                          showSizeChanger={false}
                        />
                      </div>
                    )}
                  </>
                )}
              </Col>

              {/* CỘT PHẢI: SIDEBAR THỐNG KÊ & LƯU Ý (7 COLS) */}
              <Col xs={24} lg={7}>
                <div className="docs-sidebar-sticky">
                  {/* CARD THỐNG KÊ NHANH */}
                  <Card bordered={false} className="sidebar-widget-card">
                    <Title level={5} className="widget-title">
                      KHO LƯU TRỮ TÀI LIỆU
                    </Title>
                    <Divider style={{ margin: "12px 0" }} />
                    <Row gutter={16}>
                      <Col span={12}>
                        <Statistic
                          title={<span className="stat-label">Tổng File</span>}
                          value={statsOverview.totalDocs}
                          valueStyle={{
                            color: primaryNavy,
                            fontWeight: "bold",
                          }}
                        />
                      </Col>
                      <Col span={12}>
                        <Statistic
                          title={<span className="stat-label">Lượt Tải</span>}
                          value={statsOverview.totalDownloads}
                          valueStyle={{ color: accentGold, fontWeight: "bold" }}
                        />
                      </Col>
                    </Row>
                  </Card>

                  {/* CARD HƯỚNG DẪN / LƯU Ý */}
                  <Card bordered={false} className="sidebar-widget-card">
                    <Space align="start" size={12}>
                      <div className="info-icon-box">
                        <InfoCircleOutlined
                          style={{ color: primaryNavy, fontSize: 20 }}
                        />
                      </div>
                      <div>
                        <Title level={5} className="info-title">
                          Hướng dẫn & Lưu ý
                        </Title>
                        <Paragraph className="info-desc">
                          Mọi biểu mẫu cần được điền đầy đủ thông tin trước khi
                          nộp trực tiếp tại Văn phòng Ban Mục vụ Giáo xứ.
                        </Paragraph>
                      </div>
                    </Space>
                  </Card>

                  {/* CARD LIÊN HỆ VĂN PHÒNG */}
                  <Card bordered={false} className="sidebar-contact-card">
                    <Title level={5} style={{ color: "#ffffff", margin: 0 }}>
                      Cần trợ giúp thủ tục?
                    </Title>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 13,
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      Liên hệ Văn phòng Giáo xứ Đồng Quan để được giải đáp thắc
                      mắc.
                    </Text>
                    <Button
                      type="link"
                      icon={<PhoneOutlined />}
                      style={{
                        color: accentGold,
                        paddingLeft: 0,
                        marginTop: 8,
                        fontWeight: 700,
                      }}
                    >
                      Hotline: 033 604 1807
                    </Button>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* MODAL XEM TRƯỚC FILE (PREVIEW MODAL) */}
            <Modal
              open={!!previewDoc}
              footer={null}
              width={820}
              onCancel={() => setPreviewDoc(null)}
              centered
              title={
                <Space>
                  <span>{previewDoc?.title}</span>
                  <Button
                    icon={<FullscreenOutlined />}
                    type="text"
                    size="small"
                    onClick={() =>
                      window.open(
                        getFullFileUrl(previewDoc?.file_url),
                        "_blank",
                      )
                    }
                  >
                    Toàn màn hình
                  </Button>
                </Space>
              }
            >
              {previewDoc && (
                <div>
                  <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                    {previewDoc.description ||
                      "Tài liệu chính thức từ Ban Mục vụ Giáo xứ."}
                  </Paragraph>

                  {(() => {
                    const fullUrl = getFullFileUrl(previewDoc.file_url);
                    const typeStr = (
                      previewDoc.file_type ||
                      previewDoc.file_name ||
                      ""
                    ).toLowerCase();

                    // 1. File PDF
                    if (typeStr.includes("pdf")) {
                      return (
                        <iframe
                          src={fullUrl}
                          title={previewDoc.title}
                          width="100%"
                          height="480px"
                          style={{ border: "none", borderRadius: 10 }}
                        />
                      );
                    }

                    // 2. File Word / Excel -> Nhúng Office Viewer
                    if (typeStr.includes("doc") || typeStr.includes("xls")) {
                      const msOfficeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fullUrl)}`;
                      return (
                        <iframe
                          src={msOfficeUrl}
                          title={previewDoc.title}
                          width="100%"
                          height="480px"
                          style={{ border: "none", borderRadius: 10 }}
                        />
                      );
                    }

                    // 3. File khác
                    return (
                      <div
                        style={{ textAlign: "center", padding: "40px 20px" }}
                      >
                        <Paragraph>
                          Định dạng file này chưa hỗ trợ xem trực tiếp. Vui lòng
                          tải xuống để xem nội dung.
                        </Paragraph>
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={() => handleDownload(previewDoc)}
                        >
                          Tải xuống ngay
                        </Button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </Modal>
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
            margin-bottom: 40px; 
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
            font-size: clamp(32px, 5vw, 42px) !important; 
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
            font-size: 15px; 
            color: #64748b; 
            max-width: 650px;
            margin: 0 auto;
            line-height: 1.6;
          }

          /* Filter Card */
          .docs-filter-card {
            border-radius: 16px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
            margin-bottom: 24px;
            padding: 4px;
          }

          /* Section Styling */
          .docs-section-block { 
            margin-bottom: 32px; 
          }

          .docs-section-header { 
            display: flex; 
            align-items: center; 
            gap: 10px; 
            margin-bottom: 16px; 
          }

          .docs-section-icon { 
            font-size: 22px; 
            color: ${accentGold};
          }

          .docs-section-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-weight: 700 !important;
          }

          /* Document Card Styling */
          .glhn-doc-card { 
            border-radius: 16px !important; 
            border: 1px solid rgba(212, 175, 55, 0.25) !important; 
            background: #ffffff !important;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important; 
            padding: 8px;
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .glhn-doc-card:hover { 
            transform: translateY(-4px); 
            box-shadow: 0 12px 28px rgba(27, 54, 93, 0.1) !important; 
            border-color: ${accentGold} !important;
          }

          .featured-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            font-size: 10px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 10px;
          }

          .doc-card-body { 
            display: flex; 
            gap: 12px; 
            margin-bottom: 12px; 
            min-height: 52px; 
            align-items: flex-start;
          }

          .doc-file-icon { 
            font-size: 34px; 
            line-height: 1;
          }

          .icon-pdf { color: #7A1C1C; }
          .icon-word { color: ${primaryNavy}; }

          .doc-file-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            width: 100%;
          }

          .doc-file-name { 
            font-size: 14px; 
            color: ${primaryNavy}; 
            display: block; 
            line-height: 1.35;
            font-weight: 700;
          }

          .doc-meta-space {
            margin-top: 2px;
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

          .tag-excel {
            background: rgba(39, 174, 96, 0.1) !important;
            color: #27ae60 !important;
            font-weight: 700;
            border-radius: 12px;
            font-size: 10px;
          }

          .doc-file-size {
            font-size: 11px;
            color: #64748b;
          }

          .doc-stats-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            padding: 4px 8px;
            background: ${softBg};
            border-radius: 6px;
          }

          .doc-download-btn { 
            height: 40px !important; 
            border-radius: 10px !important; 
            font-weight: 700 !important; 
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.15);
            transition: all 0.3s ease !important;
          }

          .doc-download-btn:hover {
            background: ${accentGold} !important;
            border-color: ${accentGold} !important;
            color: ${primaryNavy} !important;
          }

          /* Sidebar Widgets */
          .docs-sidebar-sticky {
            position: sticky;
            top: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }

          .sidebar-widget-card {
            background: #ffffff !important;
            border-radius: 16px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
            padding: 4px;
          }

          .widget-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-size: 14px !important;
            font-weight: 700 !important;
            letter-spacing: 1px;
          }

          .stat-label {
            font-size: 11px;
            color: #64748b;
          }

          .info-icon-box {
            background: rgba(212, 175, 55, 0.15);
            padding: 8px;
            border-radius: 10px;
            border: 1px solid ${accentGold};
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .info-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 0 2px 0 !important;
            font-weight: 700 !important;
          }

          .info-desc {
            color: #64748b;
            font-size: 13px;
            margin: 0 !important;
            line-height: 1.5;
          }

          .sidebar-contact-card {
            background: ${primaryNavy} !important;
            border-radius: 16px !important;
            padding: 8px;
            box-shadow: 0 6px 20px rgba(27, 54, 93, 0.2) !important;
          }

          @media (max-width: 576px) {
            .docs-editorial-wrapper { padding: 40px 14px; }
            .doc-card-body { flex-direction: row; align-items: flex-start; gap: 10px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default DocumentsPage;
