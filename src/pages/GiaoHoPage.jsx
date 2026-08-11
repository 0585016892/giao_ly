import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Empty,
  Typography,
  Tag,
  Space,
  ConfigProvider,
  Button,
  Layout,
  Modal,
  InputNumber,
  message,
  Divider,
  Descriptions,
  Image,
  Skeleton,
  Tooltip,
  Spin,
} from "antd";
import {
  EnvironmentOutlined,
  CompassOutlined,
  HomeOutlined,
  NodeIndexOutlined,
  EyeOutlined,
  RadarChartOutlined,
  AimOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  PictureOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ShareAltOutlined,
  CheckOutlined,
  AppstoreOutlined,
  GlobalOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getChurches, getChurchById, searchChurchMap } from "../api/churchApi";

// Fix icon mặc định của Leaflet trong React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const GiaoHoPage = () => {
  const primaryNavy = "#1B365D";
  const accentGold = "#D4AF37";
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(false);

  // States Tìm kiếm gần đây & Modal chi tiết
  const [radiusKm, setRadiusKm] = useState(10);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // States UI Micro-Interactions & Tính năng mới
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // "grid" hoặc "map"
  const [selectedRegion, setSelectedRegion] = useState("ALL"); // Bộ lọc nhanh khu vực

  useEffect(() => {
    document.title = "Các Giáo Họ Trực Thuộc | Giáo Xứ Đồng Quan";
    fetchGiaoHo();
  }, []);

  // 1. LẤY DANH SÁCH MẶC ĐỊNH
  const fetchGiaoHo = async () => {
    try {
      setLoading(true);
      setIsSearchingNearby(false);
      setSelectedRegion("ALL");

      const res = await getChurches({
        type: "GIAO_HO",
        is_active: 1,
      });

      const listData = res?.data || res || [];
      setChurches(Array.isArray(listData) ? listData : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách Giáo họ:", err);
      message.error("Không thể tải danh sách Giáo họ!");
    } finally {
      setLoading(false);
    }
  };

  // Danh sách khu vực mẫu để lọc nhanh (có thể tùy chỉnh theo dữ liệu thực tế từ API như ward/region)
  const regionFilters = [
    { key: "ALL", label: "Tất cả các họ" },
    { key: "Khu vực Bắc", label: "Khu vực Bắc" },
    { key: "Khu vực Nam", label: "Khu vực Nam" },
    { key: "Gần sông", label: "Gần sông / Đê" },
  ];

  // Lọc danh sách giáo họ theo khu vực được chọn
  const filteredChurchesByRegion = useMemo(() => {
    if (selectedRegion === "ALL") return churches;
    return churches.filter((item) => {
      // Kiểm tra khớp qua trường ward hoặc description/address
      const target =
        `${item.ward || ""} ${item.address || ""} ${item.description || ""}`.toLowerCase();
      return target.includes(selectedRegion.toLowerCase());
    });
  }, [churches, selectedRegion]);

  // 2. TÌM KIẾM THEO BÁN KÍNH GPS (SEARCH MAP)
  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt không hỗ trợ vị trí GPS!");
      return;
    }

    message.loading({ content: "Đang xác định vị trí của bạn...", key: "geo" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          setLoading(true);
          message.loading({
            content: `Đang quét Giáo họ trong bán kính ${radiusKm}km...`,
            key: "geo",
          });

          const res = await searchChurchMap({
            lat,
            lng,
            radius: radiusKm,
            type: "GIAO_HO",
          });

          const listData = res?.data || res || [];
          setChurches(Array.isArray(listData) ? listData : []);
          setIsSearchingNearby(true);

          if (listData.length === 0) {
            message.info({
              content: `Không thấy Giáo họ nào trong bán kính ${radiusKm}km quanh bạn.`,
              key: "geo",
            });
          } else {
            message.success({
              content: `Tìm thấy ${listData.length} Giáo họ gần bạn!`,
              key: "geo",
            });
          }
        } catch (err) {
          console.error("Lỗi tìm kiếm vị trí:", err);
          message.error({ content: "Lỗi tra cứu vị trí gần đây!", key: "geo" });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Lỗi GPS:", error);
        message.error({
          content: "Không thể lấy vị trí hiện tại. Vui lòng bật GPS!",
          key: "geo",
        });
      },
    );
  };

  // 3. XEM CHI TIẾT THEO ID
  const handleViewDetail = async (id) => {
    try {
      setDetailLoading(true);
      setIsDetailModalOpen(true);
      setIsFullscreenModal(false);
      setCopied(false);

      const res = await getChurchById(id);
      const detail = res?.data || res || null;
      setSelectedChurch(detail);
    } catch (err) {
      console.error("Lỗi xem chi tiết:", err);
      message.error("Không thể tải thông tin chi tiết!");
    } finally {
      setDetailLoading(false);
    }
  };

  // 4. CHIA SẺ THÔNG TIN
  const handleShareChurch = () => {
    if (!selectedChurch) return;
    const textToCopy = `[${selectedChurch.name}] - Trực thuộc Giáo xứ Đồng Quan. Địa chỉ: ${selectedChurch.address || "Chưa cập nhật"}. LM Phụ trách: ${selectedChurch.pastor_name || "Chưa cập nhật"}.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    message.success("Đã sao chép thông tin Giáo họ vào bộ nhớ tạm!");
    setTimeout(() => setCopied(false), 2500);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") return null;
    if (imagePath.startsWith("http")) return imagePath;

    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
  };

  const handleOpenMap = (lat, lng) => {
    if (!lat || !lng) return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const renderSkeletons = () => (
    <div className="skeleton-container-wrapper">
      <div className="skeleton-loading-banner">
        <Spin size="large" />
        <Text style={{ color: primaryNavy, fontWeight: 600, fontSize: 14 }}>
          Đang tải danh sách các Giáo họ trực thuộc...
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {[1, 2, 3, 4, 5, 6].map((key) => (
          <Col key={key} xs={24} sm={12} md={8} lg={8}>
            <Card bordered={false} className="giaoho-card-skeleton">
              <Skeleton.Node
                active
                style={{ width: "100%", height: 180, borderRadius: 12 }}
              />
              <div style={{ padding: "16px 4px 4px 4px" }}>
                <Skeleton
                  active
                  paragraph={{ rows: 3, width: ["100%", "80%", "60%"] }}
                  title={{ width: "70%" }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 16,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="giaoho-editorial-root">
        <Content className="giaoho-editorial-wrapper">
          <div className="giaoho-editorial-container">
            {/* HEADER */}
            <div className="giaoho-editorial-header">
              <span className="giaoho-tag-sacred pulse-badge">
                <HomeOutlined /> CỘNG ĐOÀN DÂN CHÚA
              </span>
              <Title level={1} className="giaoho-editorial-title">
                Các Giáo Họ Trực Thuộc
              </Title>
              <div className="gold-accent-divider" />
              <Paragraph className="giaoho-editorial-subtitle">
                Danh sách các Giáo họ thuộc Giáo xứ Đồng Quan, nơi cộng đoàn
                cùng sinh hoạt phụng vụ và đơm hoa đời sống đức tin.
              </Paragraph>
            </div>

            {/* ACTION BAR: TÌM BÁN KÍNH & CHUYỂN ĐỔI CHẾ ĐỘ XEM (GRID vs MAP) */}
            <Card bordered={false} className="search-map-bar-card glow-card">
              <Row gutter={[12, 12]} align="middle" justify="space-between">
                <Col xs={24} md={14}>
                  <Space wrap size={8}>
                    <RadarChartOutlined
                      style={{ color: accentGold, fontSize: 20 }}
                    />
                    <Text strong style={{ color: primaryNavy, fontSize: 13 }}>
                      Bán kính tìm:
                    </Text>
                    <InputNumber
                      min={1}
                      max={100}
                      value={radiusKm}
                      onChange={(val) => setRadiusKm(val || 10)}
                      addonAfter="km"
                      style={{ width: 110 }}
                      size="small"
                    />
                    <Button
                      type="primary"
                      icon={<AimOutlined />}
                      onClick={handleFindNearby}
                      className="find-nearby-btn micro-bounce"
                      size="small"
                    >
                      Định vị gần đây
                    </Button>
                  </Space>
                </Col>

                {/* TÍNH NĂNG 2: CHUYỂN ĐỔI GIAO DIỆN LƯỚI / BẢN ĐỒ */}
                <Col xs={24} md={10} style={{ textAlign: "right" }}>
                  <Space size={8}>
                    {isSearchingNearby && (
                      <Button
                        type="link"
                        onClick={fetchGiaoHo}
                        style={{
                          color: primaryNavy,
                          fontWeight: 600,
                          padding: 0,
                        }}
                        size="small"
                      >
                        Tất cả danh sách
                      </Button>
                    )}
                    <Button
                      type={viewMode === "grid" ? "primary" : "default"}
                      icon={<AppstoreOutlined />}
                      onClick={() => setViewMode("grid")}
                      size="small"
                      style={
                        viewMode === "grid" ? { background: primaryNavy } : {}
                      }
                    >
                      Lưới thẻ
                    </Button>
                    <Button
                      type={viewMode === "map" ? "primary" : "default"}
                      icon={<GlobalOutlined />}
                      onClick={() => setViewMode("map")}
                      size="small"
                      style={
                        viewMode === "map" ? { background: primaryNavy } : {}
                      }
                    >
                      Bản đồ trực quan
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>

            {/* TÍNH NĂNG 1: BỘ LỌC NHANH KHU VỰC (QUICK FILTER PILLS) */}
            <div className="quick-filter-scroll-wrap">
              <div className="quick-filter-pills-bar">
                <span className="filter-label-text">
                  <FilterOutlined style={{ color: accentGold }} /> Khu vực:
                </span>
                {regionFilters.map((rf) => (
                  <button
                    key={rf.key}
                    className={`filter-pill-btn ${selectedRegion === rf.key ? "active" : ""}`}
                    onClick={() => setSelectedRegion(rf.key)}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* HIỂN THỊ NỘI DUNG THEO CHẾ ĐỘ XEM (GRID HOẶC MAP) */}
            {loading ? (
              renderSkeletons()
            ) : viewMode === "map" ? (
              /* --- TÍNH NĂNG 2: GIAO DIỆN BẢN ĐỒ LEAFLET --- */
              <Card bordered={false} className="map-view-card-container">
                <div
                  style={{
                    height: "550px",
                    width: "100%",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <MapContainer
                    center={[20.35, 106.45]} // Tọa độ trung tâm mẫu, có thể đổi theo vị trí thực tế
                    zoom={12}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredChurchesByRegion
                      .filter((item) => item.latitude && item.longitude)
                      .map((item) => (
                        <Marker
                          key={item.id}
                          position={[
                            parseFloat(item.latitude),
                            parseFloat(item.longitude),
                          ]}
                        >
                          <Popup>
                            <div style={{ minWidth: 180 }}>
                              <strong
                                style={{ color: primaryNavy, fontSize: 14 }}
                              >
                                {item.name}
                              </strong>
                              <p
                                style={{
                                  margin: "4px 0 8px 0",
                                  fontSize: 12,
                                  color: "#475569",
                                }}
                              >
                                {item.address || "Chưa cập nhật địa chỉ"}
                              </p>
                              <Button
                                type="primary"
                                size="small"
                                style={{
                                  background: primaryNavy,
                                  fontSize: 11,
                                }}
                                onClick={() => handleViewDetail(item.id)}
                              >
                                Xem chi tiết
                              </Button>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                  </MapContainer>
                </div>
              </Card>
            ) : filteredChurchesByRegion.length === 0 ? (
              <Card className="giaoho-empty-card" bordered={false}>
                <Empty
                  description={
                    isSearchingNearby
                      ? `Không thấy Giáo họ nào trong bán kính ${radiusKm}km.`
                      : `Không tìm thấy Giáo họ nào thuộc khu vực "${selectedRegion}".`
                  }
                />
              </Card>
            ) : (
              /* --- GIAO DIỆN LƯỚI THẺ (GRID VIEW) --- */
              <Row gutter={[16, 16]}>
                {filteredChurchesByRegion.map((item) => {
                  const imgUrl = getImageUrl(item.image);

                  return (
                    <Col key={item.id} xs={24} sm={12} md={8} lg={8}>
                      <Card
                        hoverable
                        bordered={false}
                        className="giaoho-card interactive-card"
                        cover={
                          imgUrl ? (
                            <div className="giaoho-img-wrapper">
                              <img
                                src={imgUrl}
                                alt={item.name}
                                className="giaoho-card-img"
                              />
                            </div>
                          ) : (
                            <div className="giaoho-placeholder-img">
                              <HomeOutlined className="placeholder-icon" />
                              <Text className="placeholder-text">Hình ảnh</Text>
                            </div>
                          )
                        }
                      >
                        <Space
                          direction="vertical"
                          size={6}
                          style={{ width: "100%" }}
                        >
                          <div>
                            <div className="card-top-bar">
                              <Title
                                level={4}
                                className="giaoho-card-title"
                                ellipsis={{ rows: 2 }}
                              >
                                {item.name}
                              </Title>
                              <Tag color="gold" className="giaoho-tag-type">
                                GIÁO HỌ
                              </Tag>
                            </div>

                            {item.code && (
                              <Text type="secondary" className="info-subtext">
                                <NodeIndexOutlined style={{ marginRight: 2 }} />
                                Mã: <strong>{item.code}</strong>
                              </Text>
                            )}
                          </div>

                          {item.description && (
                            <Paragraph
                              className="giaoho-desc-paragraph"
                              ellipsis={{ rows: 2, expandable: false }}
                            >
                              {item.description}
                            </Paragraph>
                          )}

                          <Space
                            style={{ width: "100%", marginTop: 6 }}
                            direction="vertical"
                            size={6}
                          >
                            <Button
                              type="primary"
                              icon={<EyeOutlined />}
                              block
                              className="giaoho-detail-btn micro-push"
                              onClick={() => handleViewDetail(item.id)}
                            >
                              Chi tiết
                            </Button>

                            {item.latitude && item.longitude && (
                              <Button
                                type="default"
                                icon={<CompassOutlined />}
                                block
                                className="giaoho-map-btn micro-push"
                                onClick={() =>
                                  handleOpenMap(item.latitude, item.longitude)
                                }
                              >
                                Bản đồ
                              </Button>
                            )}
                          </Space>
                        </Space>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}

            {/* MODAL CHI TIẾT */}
            <Modal
              open={isDetailModalOpen}
              footer={null}
              onCancel={() => {
                setIsDetailModalOpen(false);
                setSelectedChurch(null);
              }}
              width={isFullscreenModal ? "100vw" : 1080}
              style={{
                top: isFullscreenModal ? 0 : 20,
                maxWidth: isFullscreenModal ? "100vw" : "95vw",
                paddingBottom: 0,
              }}
              className={isFullscreenModal ? "fullscreen-modal" : ""}
              centered={!isFullscreenModal}
              title={
                <div className="modal-large-header">
                  <Space align="center" style={{ flexGrow: 1 }}>
                    <HomeOutlined style={{ color: accentGold, fontSize: 22 }} />
                    <span>HỒ SƠ THÔNG TIN & HÌNH ẢNH MỤC VỤ GIÁO HỌ</span>
                  </Space>
                  <Space style={{ marginRight: 24 }}>
                    <Tooltip
                      title={
                        isFullscreenModal ? "Thu nhỏ" : "Phóng to toàn màn hình"
                      }
                    >
                      <Button
                        type="text"
                        icon={
                          isFullscreenModal ? (
                            <FullscreenExitOutlined />
                          ) : (
                            <FullscreenOutlined />
                          )
                        }
                        onClick={() => setIsFullscreenModal(!isFullscreenModal)}
                        style={{ color: primaryNavy }}
                      />
                    </Tooltip>
                  </Space>
                </div>
              }
            >
              {detailLoading ? (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <Spin size="large" tip="Đang tải dữ liệu chi tiết..." />
                </div>
              ) : (
                selectedChurch && (
                  <div className="modal-large-body">
                    <Row gutter={[28, 28]}>
                      <Col xs={24} lg={11}>
                        <div className="gallery-section">
                          <Text
                            strong
                            style={{
                              color: primaryNavy,
                              display: "block",
                              marginBottom: 8,
                              fontSize: 14,
                            }}
                          >
                            <PictureOutlined
                              style={{ color: accentGold, marginRight: 6 }}
                            />
                            Hình ảnh Giáo họ:
                          </Text>

                          {getImageUrl(selectedChurch.image) ? (
                            <Image.PreviewGroup>
                              <div className="modal-huge-banner">
                                <Image
                                  src={getImageUrl(selectedChurch.image)}
                                  alt={selectedChurch.name}
                                  className="modal-banner-img-huge"
                                  style={{
                                    objectFit: "cover",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                />
                              </div>
                            </Image.PreviewGroup>
                          ) : (
                            <div className="modal-huge-placeholder">
                              <HomeOutlined
                                style={{ fontSize: 56, color: accentGold }}
                              />
                              <Text
                                type="secondary"
                                style={{ marginTop: 12, fontSize: 13 }}
                              >
                                Hiện chưa cập nhật bộ sưu tập ảnh.
                              </Text>
                            </div>
                          )}
                        </div>

                        <Card
                          size="small"
                          bordered={false}
                          className="modal-summary-card"
                        >
                          <Space
                            direction="vertical"
                            size={10}
                            style={{ width: "100%" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Tag
                                color="gold"
                                style={{
                                  fontWeight: 700,
                                  borderRadius: 12,
                                  padding: "2px 10px",
                                }}
                              >
                                GIÁO HỌ TRỰC THUỘC
                              </Tag>
                              {selectedChurch.code && (
                                <Text
                                  strong
                                  style={{ color: primaryNavy, fontSize: 13 }}
                                >
                                  Mã:{" "}
                                  <span style={{ color: accentGold }}>
                                    {selectedChurch.code}
                                  </span>
                                </Text>
                              )}
                            </div>

                            {selectedChurch.ward && (
                              <Text type="secondary" style={{ fontSize: 13 }}>
                                <EnvironmentOutlined
                                  style={{ marginRight: 6, color: accentGold }}
                                />
                                Địa giới: <strong>{selectedChurch.ward}</strong>
                              </Text>
                            )}
                          </Space>
                        </Card>

                        <div
                          className="modal-action-box"
                          style={{ marginTop: 16 }}
                        >
                          {selectedChurch.latitude &&
                            selectedChurch.longitude && (
                              <Button
                                type="primary"
                                icon={<CompassOutlined />}
                                block
                                size="large"
                                className="micro-push"
                                style={{
                                  background: primaryNavy,
                                  borderRadius: 10,
                                  fontWeight: 700,
                                  height: 44,
                                }}
                                onClick={() =>
                                  handleOpenMap(
                                    selectedChurch.latitude,
                                    selectedChurch.longitude,
                                  )
                                }
                              >
                                Định vị & Chỉ đường Google Maps
                              </Button>
                            )}
                        </div>
                      </Col>

                      <Col xs={24} lg={13}>
                        <div>
                          <Title
                            level={2}
                            style={{
                              color: primaryNavy,
                              margin: 0,
                              fontFamily: "'Playfair Display', serif",
                            }}
                          >
                            {selectedChurch.name}
                          </Title>
                          <Text type="secondary" style={{ fontSize: 14 }}>
                            Thuộc Giáo xứ Đồng Quan • Hạt Tiền Hải • Giáo phận
                            Thái Bình
                          </Text>
                        </div>

                        <Divider style={{ margin: "16px 0" }} />

                        <Descriptions
                          column={1}
                          bordered
                          size="middle"
                          className="modal-large-descriptions"
                        >
                          <Descriptions.Item
                            label={
                              <span className="desc-label">
                                <UserOutlined style={{ color: accentGold }} />{" "}
                                Linh mục phụ trách
                              </span>
                            }
                          >
                            <strong
                              style={{ fontSize: 15, color: primaryNavy }}
                            >
                              {selectedChurch.pastor_name || "Chưa cập nhật"}
                            </strong>
                          </Descriptions.Item>

                          <Descriptions.Item
                            label={
                              <span className="desc-label">
                                <PhoneOutlined style={{ color: accentGold }} />{" "}
                                Số điện thoại
                              </span>
                            }
                          >
                            {selectedChurch.phone ? (
                              <a
                                href={`tel:${selectedChurch.phone}`}
                                style={{
                                  color: primaryNavy,
                                  fontWeight: 700,
                                  fontSize: 14,
                                }}
                              >
                                {selectedChurch.phone}
                              </a>
                            ) : (
                              <Text type="secondary" italic>
                                Chưa có dữ liệu
                              </Text>
                            )}
                          </Descriptions.Item>

                          <Descriptions.Item
                            label={
                              <span className="desc-label">
                                <MailOutlined style={{ color: accentGold }} />{" "}
                                Email liên hệ
                              </span>
                            }
                          >
                            {selectedChurch.email || (
                              <Text type="secondary" italic>
                                Chưa có dữ liệu
                              </Text>
                            )}
                          </Descriptions.Item>

                          <Descriptions.Item
                            label={
                              <span className="desc-label">
                                <EnvironmentOutlined
                                  style={{ color: accentGold }}
                                />{" "}
                                Địa chỉ chi tiết
                              </span>
                            }
                          >
                            <Text strong style={{ color: textDark }}>
                              {selectedChurch.address || "Chưa cập nhật"}
                            </Text>
                          </Descriptions.Item>
                          <Descriptions.Item
                            label={
                              <span className="desc-label">
                                <EnvironmentOutlined
                                  style={{ color: accentGold }}
                                />{" "}
                                Số giáo dân
                              </span>
                            }
                          >
                            <Text strong style={{ color: textDark }}>
                              {selectedChurch.total_parishioners ||
                                "Chưa cập nhật"}
                            </Text>
                          </Descriptions.Item>
                        </Descriptions>

                        {selectedChurch.description && (
                          <div style={{ marginTop: 20 }}>
                            <Title
                              level={5}
                              style={{ color: primaryNavy, marginBottom: 8 }}
                            >
                              Thông Tin Giới Thiệu & Lịch Sử:
                            </Title>
                            <div className="modal-large-desc-box">
                              <Paragraph
                                style={{
                                  margin: 0,
                                  color: textDark,
                                  lineHeight: 1.7,
                                  fontSize: 14,
                                }}
                              >
                                {selectedChurch.description}
                              </Paragraph>
                            </div>
                          </div>
                        )}

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 28,
                          }}
                        >
                          <Button
                            icon={
                              copied ? (
                                <CheckOutlined style={{ color: "#52c41a" }} />
                              ) : (
                                <ShareAltOutlined />
                              )
                            }
                            onClick={handleShareChurch}
                            style={{ borderRadius: 10, fontWeight: 600 }}
                          >
                            {copied ? "Đã sao chép!" : "Chia sẻ thông tin"}
                          </Button>

                          <Button
                            size="large"
                            onClick={() => setIsDetailModalOpen(false)}
                            style={{
                              borderRadius: 10,
                              minWidth: 110,
                              fontWeight: 600,
                            }}
                          >
                            Đóng
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )
              )}
            </Modal>
          </div>
        </Content>

        {/* STYLES CSS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .giaoho-editorial-root { 
            background: ${softBg}; 
            min-height: 100vh; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .giaoho-editorial-wrapper { padding: 40px 16px 60px 16px; }
          .giaoho-editorial-container { max-width: 1200px; margin: 0 auto; }

          .giaoho-editorial-header { text-align: center; margin-bottom: 24px; }
          .giaoho-tag-sacred {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            padding: 4px 14px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 12px;
          }

          .giaoho-editorial-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            font-size: clamp(26px, 4vw, 38px) !important; 
            font-weight: 700 !important; 
            color: ${primaryNavy} !important; 
            margin: 0 !important;
          }

          .gold-accent-divider {
            width: 50px;
            height: 3px;
            background: ${accentGold};
            margin: 12px auto;
            border-radius: 2px;
          }

          .giaoho-editorial-subtitle {
            color: #64748b;
            font-size: 15px;
            max-width: 650px;
            margin: 0 auto !important;
          }

          .search-map-bar-card {
            background: #ffffff !important;
            border-radius: 16px !important;
            border: 1px solid rgba(212, 175, 55, 0.3) !important;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.05) !important;
            margin-bottom: 16px;
            padding: 14px 20px !important;
          }

          .find-nearby-btn {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 600;
            border-radius: 8px;
          }

          /* Quick Filter Pills Styles */
          .quick-filter-scroll-wrap {
            width: 100%;
            overflow-x: auto;
            margin-bottom: 24px;
            padding-bottom: 4px;
          }

          .quick-filter-pills-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            white-space: nowrap;
          }

          .filter-label-text {
            font-size: 13px;
            font-weight: 700;
            color: ${primaryNavy};
            margin-right: 4px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          .filter-pill-btn {
            background: #ffffff;
            border: 1px solid rgba(27, 54, 93, 0.15);
            color: ${primaryNavy};
            padding: 6px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.25s ease;
            box-shadow: 0 2px 6px rgba(0,0,0,0.02);
          }

          .filter-pill-btn:hover { border-color: ${accentGold}; }

          .filter-pill-btn.active {
            background: ${primaryNavy};
            color: #ffffff;
            border-color: ${primaryNavy};
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.25);
          }

          /* Map Container View */
          .map-view-card-container {
            border-radius: 16px !important;
            box-shadow: 0 6px 20px rgba(0,0,0,0.04) !important;
            border: 1px solid #e2e8f0 !important;
            padding: 12px !important;
          }

          /* Skeleton & Grid Styles */
          .skeleton-container-wrapper { width: 100%; }
          .skeleton-loading-banner {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            padding: 30px;
            background: #ffffff;
            border-radius: 16px;
            border: 1px dashed rgba(212, 175, 55, 0.4);
            margin-bottom: 20px;
          }

          .giaoho-card-skeleton {
            background: #ffffff !important;
            border-radius: 16px !important;
            border: 1px solid #f1f5f9 !important;
            padding: 16px !important;
          }

          .giaoho-card {
            border-radius: 16px !important;
            overflow: hidden;
            border: 1px solid #e2e8f0 !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.03) !important;
            background: #ffffff !important;
            transition: all 0.3s ease;
          }

          .giaoho-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(27, 54, 93, 0.1) !important;
            border-color: ${accentGold} !important;
          }

          .giaoho-img-wrapper { height: 180px; width: 100%; overflow: hidden; background: #f1f5f9; }
          .giaoho-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
          .giaoho-card:hover .giaoho-card-img { transform: scale(1.06); }

          .giaoho-placeholder-img {
            height: 180px;
            background: linear-gradient(135deg, #f8fafc, #e2e8f0);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
          }

          .placeholder-icon { font-size: 36px; color: ${accentGold}; margin-bottom: 6px; }

          .card-top-bar { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px; }
          .giaoho-card-title {
            font-family: 'Playfair Display', serif !important;
            color: ${primaryNavy} !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            margin: 0 !important;
            line-height: 1.35 !important;
          }

          .giaoho-tag-type {
            font-size: 10px;
            font-weight: 700;
            border-radius: 8px;
            margin: 0;
            padding: 1px 6px;
            background: #fffbe6 !important;
            border-color: ${accentGold} !important;
            color: ${primaryNavy} !important;
          }

          .info-subtext { font-size: 12px; color: #64748b; }
          .giaoho-desc-paragraph { color: #475569 !important; font-size: 13px !important; margin: 6px 0 0 0 !important; line-height: 1.5 !important; }

          .giaoho-detail-btn { background: ${primaryNavy} !important; border-color: ${primaryNavy} !important; font-weight: 600; border-radius: 10px; }
          .giaoho-map-btn { border-color: rgba(212, 175, 55, 0.5) !important; color: ${primaryNavy} !important; font-weight: 600; border-radius: 10px; }

          .giaoho-empty-card { border-radius: 16px; padding: 40px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }

          /* Modal Styling */
          .modal-large-header { font-weight: 700; color: ${primaryNavy}; font-size: 16px; }
          .modal-large-body { padding: 12px 4px; }
          .modal-huge-banner { height: 320px; border-radius: 12px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
          .modal-huge-placeholder {
            height: 320px;
            background: #f8fafc;
            border-radius: 12px;
            border: 2px dashed #cbd5e1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          .modal-summary-card { margin-top: 16px; border-radius: 12px !important; background: #f8fafc !important; border: 1px solid #e2e8f0 !important; }
          .modal-large-descriptions .ant-descriptions-item-label { background: #f8fafc !important; font-weight: 600; color: #475569; }
          .modal-large-desc-box {
            background: #f8fafc;
            padding: 16px;
            border-radius: 12px;
            border-left: 4px solid ${accentGold};
            border-top: 1px solid #e2e8f0;
            border-right: 1px solid #e2e8f0;
            border-bottom: 1px solid #e2e8f0;
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default GiaoHoPage;
