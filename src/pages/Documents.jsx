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
  message,
  Pagination,
  Modal,
  Table,
  Tabs,
  Tooltip,
  Segmented,
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
  SearchOutlined,
  PhoneOutlined,
  StarFilled,
  FullscreenOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  FileTextOutlined,
  FolderOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

// Import API
import { getDocuments, downloadDocument } from "../api/documentApi";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const DocumentsPage = () => {
  // Bảng màu hiện đại, sạch sẽ & sang trọng
  const themeColors = {
    primary: "#1B365D",
    accent: "#D4AF37",
    accentBg: "rgba(212, 175, 55, 0.08)",
    bgBody: "#F8FAFC",
    cardBg: "#FFFFFF",
    textDark: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",
  };

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  // State Bộ lọc
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' hoặc 'grid'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

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

  // Tạo URL đầy đủ
  const getFullFileUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${cleanPath}`;
  };

  // 2. TẢI TÀI LIỆU
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
      message.success("Đang tiến hành tải xuống...");
    } catch (err) {
      console.error("Lỗi khi tải file:", err);
      message.error("Không thể tải tài liệu này!");
    } finally {
      setDownloadingId(null);
    }
  };

  // Format dung lượng
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Helper Icon & Tag
  const renderFileMeta = (fileType, fileName, fileUrl) => {
    const typeStr = (fileType || fileName || fileUrl || "").toLowerCase();

    if (typeStr.includes("pdf")) {
      return {
        icon: <FilePdfOutlined style={{ color: "#E11D48", fontSize: 24 }} />,
        tagColor: "error",
        label: "PDF",
      };
    }
    if (typeStr.includes("doc") || typeStr.includes("word")) {
      return {
        icon: <FileWordOutlined style={{ color: "#2563EB", fontSize: 24 }} />,
        tagColor: "processing",
        label: "DOCX",
      };
    }
    if (typeStr.includes("xls") || typeStr.includes("excel")) {
      return {
        icon: <FileExcelOutlined style={{ color: "#16A34A", fontSize: 24 }} />,
        tagColor: "success",
        label: "EXCEL",
      };
    }
    return {
      icon: <FileUnknownOutlined style={{ color: "#D4AF37", fontSize: 24 }} />,
      tagColor: "default",
      label: "FILE",
    };
  };

  // Lọc dữ liệu
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

  // Phân trang
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocuments.slice(start, start + pageSize);
  }, [filteredDocuments, currentPage, pageSize]);

  // Danh mục cho Tabs
  const categoriesList = useMemo(() => {
    const cats = [...new Set(documents.map((d) => d.category).filter(Boolean))];
    return [
      { key: "all", label: `Tất cả (${documents.length})` },
      ...cats.map((c) => ({
        key: c,
        label: `${c} (${documents.filter((d) => d.category === c).length})`,
      })),
    ];
  }, [documents]);

  // Thống kê nhanh
  const statsOverview = useMemo(() => {
    const totalDocs = documents.length;
    const totalDownloads = documents.reduce(
      (sum, item) => sum + (Number(item.download_count) || 0),
      0,
    );
    return { totalDocs, totalDownloads };
  }, [documents]);

  // Cấu hình Cột cho Bảng (List View)
  const columns = [
    {
      title: "Tên tài liệu",
      dataIndex: "title",
      key: "title",
      render: (text, record) => {
        const meta = renderFileMeta(
          record.file_type,
          record.file_name,
          record.file_url,
        );
        return (
          <Space align="start" size={12}>
            <div style={{ marginTop: 2 }}>{meta.icon}</div>
            <div>
              <Space size={6} wrap>
                <Text
                  strong
                  style={{ color: themeColors.primary, fontSize: 14 }}
                >
                  {text}
                </Text>
                {Boolean(record.is_featured) && (
                  <Tag color="gold" icon={<StarFilled />}>
                    Nổi bật
                  </Tag>
                )}
              </Space>
              {record.description && (
                <Text
                  type="secondary"
                  style={{
                    display: "block",
                    fontSize: 12,
                    marginTop: 2,
                    maxWidth: 320, // Giới hạn chiều rộng tối đa (điều chỉnh tùy ý)
                  }}
                  ellipsis={{ tooltip: record.description }}
                >
                  {record.description}
                </Text>
              )}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      width: 160,
      render: (cat) => (
        <Tag icon={<FolderOutlined />} style={{ borderRadius: 6 }}>
          {cat || "Tài liệu chung"}
        </Tag>
      ),
    },
    {
      title: "Dung lượng",
      dataIndex: "file_size",
      key: "file_size",
      width: 110,
      render: (size) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          {formatFileSize(size)}
        </Text>
      ),
    },
    {
      title: "Lượt tải",
      dataIndex: "download_count",
      key: "download_count",
      width: 100,
      render: (count) => (
        <Text type="secondary" style={{ fontSize: 13 }}>
          <CloudDownloadOutlined /> {count || 0}
        </Text>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 180,
      align: "right",
      render: (_, record) => (
        <Space size={8}>
          <Tooltip title="Xem trước">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => setPreviewDoc(record)}
            />
          </Tooltip>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="small"
            loading={downloadingId === record.id}
            onClick={() => handleDownload(record)}
            style={{
              backgroundColor: themeColors.primary,
              borderRadius: 6,
              fontWeight: 600,
            }}
          >
            Tải về
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColors.primary,
          borderRadius: 10,
          colorBgLayout: themeColors.bgBody,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="docs-app-root">
        <Content className="docs-app-wrapper">
          <div className="docs-app-container">
            {/* HERO BAR TRÊN CÙNG */}
            <div className="docs-hero-card">
              <Row align="middle" justify="space-between" gutter={[24, 16]}>
                <Col xs={24} md={16}>
                  <Space direction="vertical" size={4}>
                    <Tag className="hero-tag">
                      <FileTextOutlined /> TRUNG TÂM DỮ LIỆU
                    </Tag>
                    <Title level={2} className="hero-title">
                      Kho Tài Liệu & Biểu Mẫu Mục Vụ
                    </Title>
                    <Text className="hero-desc">
                      Tra cứu, xem trực tiếp và tải xuống các biểu mẫu hành
                      chính, hôn phối, giáo lý Giáo xứ Đồng Quan.
                    </Text>
                  </Space>
                </Col>
                <Col xs={24} md={8}>
                  <div className="hero-stats-box">
                    <div className="stat-item">
                      <span className="stat-num">
                        {statsOverview.totalDocs}
                      </span>
                      <span className="stat-text">Tài liệu</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                      <span className="stat-num">
                        {statsOverview.totalDownloads}
                      </span>
                      <span className="stat-text">Lượt tải</span>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            {/* BỐ CỤC CHÍNH 2 CỘT */}
            <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
              {/* CỘT CHÍNH TÀI LIỆU (18 COLS) */}
              <Col xs={24} lg={18}>
                <Card bordered={false} className="main-content-card">
                  {/* THANH CÔNG CỤ TÌM KIẾM & TABS */}
                  <div className="toolbar-header">
                    <Row
                      gutter={[12, 12]}
                      align="middle"
                      justify="space-between"
                    >
                      <Col xs={24} sm={14} md={16}>
                        <Input
                          placeholder="Nhập tên tài liệu, biểu mẫu cần tìm..."
                          prefix={
                            <SearchOutlined style={{ color: "#94A3B8" }} />
                          }
                          allowClear
                          size="large"
                          value={keyword}
                          onChange={(e) => {
                            setKeyword(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="search-input-modern"
                        />
                      </Col>
                      <Col
                        xs={24}
                        sm={10}
                        md={8}
                        style={{ textAlign: "right" }}
                      >
                        <Segmented
                          options={[
                            { value: "list", icon: <UnorderedListOutlined /> },
                            { value: "grid", icon: <AppstoreOutlined /> },
                          ]}
                          value={viewMode}
                          onChange={(val) => setViewMode(val)}
                          size="large"
                        />
                      </Col>
                    </Row>

                    {/* DANH MỤC DẠNG TABS */}
                    <div className="category-tabs-wrapper">
                      <Tabs
                        activeKey={selectedCategory}
                        onChange={(key) => {
                          setSelectedCategory(key);
                          setCurrentPage(1);
                        }}
                        items={categoriesList}
                      />
                    </div>
                  </div>

                  {/* DANH SÁCH TÀI LIỆU */}
                  <Spin spinning={loading}>
                    {filteredDocuments.length === 0 ? (
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="Không tìm thấy tài liệu phù hợp"
                        style={{ padding: "40px 0" }}
                      />
                    ) : viewMode === "list" ? (
                      /* CHẾ ĐỘ XEM DANH SÁCH (TABLE) */
                      <Table
                        columns={columns}
                        dataSource={paginatedDocuments}
                        rowKey="id"
                        pagination={false}
                        className="custom-table"
                      />
                    ) : (
                      /* CHẾ ĐỘ XEM LƯỚI (GRID) */
                      <Row gutter={[16, 16]}>
                        {paginatedDocuments.map((item) => {
                          const meta = renderFileMeta(
                            item.file_type,
                            item.file_name,
                            item.file_url,
                          );
                          return (
                            <Col xs={24} sm={12} key={item.id}>
                              <div className="grid-doc-card">
                                <div className="card-top">
                                  <div className="icon-wrapper">
                                    {meta.icon}
                                  </div>
                                  <div className="meta-wrapper">
                                    <Tag color={meta.tagColor}>
                                      {meta.label}
                                    </Tag>
                                    <Text
                                      type="secondary"
                                      style={{ fontSize: 12 }}
                                    >
                                      {formatFileSize(item.file_size)}
                                    </Text>
                                  </div>
                                </div>
                                <Text
                                  strong
                                  className="grid-card-title"
                                  ellipsis={{ tooltip: item.title }}
                                >
                                  {item.title}
                                </Text>
                                <Paragraph
                                  type="secondary"
                                  className="grid-card-desc"
                                  ellipsis={{ rows: 2 }}
                                >
                                  {item.description ||
                                    "Tài liệu chính thức Giáo xứ Đồng Quan."}
                                </Paragraph>
                                <div className="card-bottom-actions">
                                  <Button
                                    type="text"
                                    icon={<EyeOutlined />}
                                    size="small"
                                    onClick={() => setPreviewDoc(item)}
                                  >
                                    Xem
                                  </Button>
                                  <Button
                                    type="primary"
                                    icon={<DownloadOutlined />}
                                    size="small"
                                    loading={downloadingId === item.id}
                                    onClick={() => handleDownload(item)}
                                  >
                                    Tải về
                                  </Button>
                                </div>
                              </div>
                            </Col>
                          );
                        })}
                      </Row>
                    )}

                    {/* PHÂN TRANG */}
                    {filteredDocuments.length > pageSize && (
                      <div className="pagination-wrapper">
                        <Pagination
                          current={currentPage}
                          total={filteredDocuments.length}
                          pageSize={pageSize}
                          onChange={(page) => setCurrentPage(page)}
                          showSizeChanger={false}
                        />
                      </div>
                    )}
                  </Spin>
                </Card>
              </Col>

              {/* CỘT SIDEBAR THÔNG TIN HỖ TRỢ (6 COLS) */}
              <Col xs={24} lg={6}>
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  {/* WIDGET HƯỚNG DẪN */}
                  <Card bordered={false} className="sidebar-card">
                    <Space align="start" size={10}>
                      <InfoCircleOutlined
                        style={{
                          color: themeColors.primary,
                          fontSize: 18,
                          marginTop: 2,
                        }}
                      />
                      <div>
                        <Text
                          strong
                          style={{
                            color: themeColors.primary,
                            display: "block",
                          }}
                        >
                          Lưu ý thủ tục
                        </Text>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            display: "block",
                            marginTop: 4,
                          }}
                        >
                          In và điền đầy đủ thông tin trước khi nộp trực tiếp
                          tại Văn phòng Ban Mục vụ.
                        </Text>
                      </div>
                    </Space>
                  </Card>

                  {/* WIDGET QUY TRÌNH HÀNH CHÍNH */}
                  <Card bordered={false} className="sidebar-card">
                    <Text
                      strong
                      style={{
                        color: themeColors.primary,
                        display: "block",
                        marginBottom: 12,
                      }}
                    >
                      Quy trình xin xác nhận
                    </Text>
                    <div className="step-list">
                      <div className="step-item">
                        <CheckCircleOutlined className="step-icon" />
                        <Text style={{ fontSize: 12 }}>
                          1. Tải & in mẫu đơn tương ứng
                        </Text>
                      </div>
                      <div className="step-item">
                        <CheckCircleOutlined className="step-icon" />
                        <Text style={{ fontSize: 12 }}>
                          2. Điền chính xác thông tin
                        </Text>
                      </div>
                      <div className="step-item">
                        <CheckCircleOutlined className="step-icon" />
                        <Text style={{ fontSize: 12 }}>
                          3. Nộp tại VP Giáo xứ vào giờ làm việc
                        </Text>
                      </div>
                    </div>
                  </Card>

                  {/* WIDGET HOTLINE */}
                  <div className="contact-widget">
                    <Title level={5} style={{ color: "#FFF", margin: 0 }}>
                      Cần hỗ trợ trực tiếp?
                    </Title>
                    <Text
                      style={{
                        color: "rgba(255,255,255,0.8)",
                        fontSize: 12,
                        display: "block",
                        marginTop: 4,
                      }}
                    >
                      Liên hệ Văn phòng Giáo xứ để được giải đáp thắc mắc thủ
                      tục.
                    </Text>
                    <Button
                      type="link"
                      icon={<PhoneOutlined />}
                      style={{
                        color: themeColors.accent,
                        padding: 0,
                        marginTop: 8,
                        fontWeight: 700,
                      }}
                    >
                      Hotline: 033 604 1807
                    </Button>
                  </div>
                </Space>
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
                <Space justify="space-between" style={{ width: "95%" }}>
                  <Text ellipsis style={{ maxWidth: 500, fontWeight: 600 }}>
                    {previewDoc?.title}
                  </Text>
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
                    Mở tab mới
                  </Button>
                </Space>
              }
            >
              {previewDoc && (
                <div style={{ marginTop: 12 }}>
                  {previewDoc.description && (
                    <Paragraph
                      type="secondary"
                      style={{ marginBottom: 12, fontSize: 13 }}
                    >
                      {previewDoc.description}
                    </Paragraph>
                  )}

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
                          height="500px"
                          style={{
                            border: "1px solid #E2E8F0",
                            borderRadius: 8,
                          }}
                        />
                      );
                    }

                    // 2. File Word / Excel -> Nhúng Google Docs Viewer
                    if (typeStr.includes("doc") || typeStr.includes("xls")) {
                      const gDocsUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fullUrl)}&embedded=true`;
                      return (
                        <iframe
                          src={gDocsUrl}
                          title={previewDoc.title}
                          width="100%"
                          height="500px"
                          style={{
                            border: "1px solid #E2E8F0",
                            borderRadius: 8,
                          }}
                        />
                      );
                    }

                    // 3. File khác
                    return (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "40px 20px",
                          background: "#F8FAFC",
                          borderRadius: 8,
                        }}
                      >
                        <Paragraph>
                          Định dạng file này cần tải xuống để xem nội dung đầy
                          đủ.
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
          .docs-app-root {
            background: ${themeColors.bgBody};
            min-height: 100vh;
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .docs-app-wrapper {
            padding: 32px 16px 60px 16px;
          }

          .docs-app-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          /* Hero Card */
          .docs-hero-card {
            background: linear-gradient(135deg, ${themeColors.primary} 0%, #0D1B2A 100%);
            border-radius: 16px;
            padding: 28px 32px;
            color: #FFFFFF;
            box-shadow: 0 10px 25px rgba(27, 54, 93, 0.15);
          }

          .hero-tag {
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid ${themeColors.accent};
            color: ${themeColors.accent};
            font-size: 11px;
            font-weight: 700;
            border-radius: 20px;
            padding: 2px 12px;
          }

          .hero-title {
            color: #FFFFFF !important;
            margin: 4px 0 !important;
            font-weight: 700 !important;
          }

          .hero-desc {
            color: #94A3B8;
            font-size: 13px;
          }

          .hero-stats-box {
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 16px;
            display: flex;
            align-items: center;
            justify-content: space-around;
          }

          .stat-item {
            text-align: center;
          }

          .stat-num {
            display: block;
            font-size: 22px;
            font-weight: 700;
            color: ${themeColors.accent};
          }

          .stat-text {
            font-size: 11px;
            color: #94A3B8;
          }

          .stat-divider {
            width: 1px;
            height: 30px;
            background: rgba(255, 255, 255, 0.1);
          }

          /* Main Card & Toolbar */
          .main-content-card {
            border-radius: 16px !important;
            border: 1px solid ${themeColors.border} !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02) !important;
          }

          .search-input-modern .ant-input {
            border-radius: 8px;
          }

          .category-tabs-wrapper {
            margin-top: 12px;
            border-bottom: 1px solid ${themeColors.border};
          }

          .category-tabs-wrapper .ant-tabs-nav {
            margin-bottom: 0 !important;
          }

          /* Table Style */
          .custom-table .ant-table-thead > tr > th {
            background: #F8FAFC;
            color: ${themeColors.textMuted};
            font-size: 12px;
            font-weight: 600;
          }

          /* Grid Card Style */
          .grid-doc-card {
            background: #FFFFFF;
            border: 1px solid ${themeColors.border};
            border-radius: 12px;
            padding: 16px;
            display: flex;
            flex-direction: column;
            height: 100%;
            transition: all 0.2s;
          }

          .grid-doc-card:hover {
            border-color: ${themeColors.accent};
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          }

          .card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 12px;
          }

          .grid-card-title {
            color: ${themeColors.primary};
            font-size: 14px;
            display: block;
            margin-bottom: 4px;
          }

          .grid-card-desc {
            font-size: 12px;
            margin-bottom: 16px !important;
            flex: 1;
          }

          .card-bottom-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #F1F5F9;
            padding-top: 12px;
          }

          .pagination-wrapper {
            text-align: center;
            margin-top: 24px;
          }

          /* Sidebar Widgets */
          .sidebar-card {
            border-radius: 12px !important;
            border: 1px solid ${themeColors.border} !important;
            background: #FFFFFF !important;
          }

          .step-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .step-item {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .step-icon {
            color: ${themeColors.accent};
            font-size: 14px;
          }

          .contact-widget {
            background: ${themeColors.primary};
            border-radius: 12px;
            padding: 20px;
            color: #FFFFFF;
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default DocumentsPage;
