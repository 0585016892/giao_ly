import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
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
  Input,
  Segmented,
  Spin,
} from "antd";
import {
  EnvironmentOutlined,
  CompassOutlined,
  HomeOutlined,
  EyeOutlined,
  AimOutlined,
  UserOutlined,
  PictureOutlined,
  ShareAltOutlined,
  CheckOutlined,
  SearchOutlined,
  GlobalOutlined,
  UnorderedListOutlined,
  FilterOutlined,
  RightOutlined,
} from "@ant-design/icons";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getChurches, getChurchById, searchChurchMap } from "../api/churchApi";

// Fix icon mặc định Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const MapRecenter = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 14, { duration: 1.2 });
    }
  }, [lat, lng, map]);
  return null;
};

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const GiaoHoPage = () => {
  const themeColors = {
    primary: "#1B365D",
    accent: "#D4AF37",
    bgBody: "#F8FAFC",
    cardBg: "#FFFFFF",
    textDark: "#0F172A",
    textMuted: "#64748B",
    border: "#E2E8F0",
  };

  const [churches, setChurches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Bộ lọc & Tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [radiusKm, setRadiusKm] = useState(10);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("ALL");
  const [activeChurchId, setActiveChurchId] = useState(null);

  // Modal / Drawer Chi tiết
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Chế độ xem Mobile ("list" | "map")
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    document.title = "Các Giáo Họ Trực Thuộc | Giáo Xứ Đồng Quan";
    fetchGiaoHo();
  }, []);

  const fetchGiaoHo = async () => {
    try {
      setLoading(true);
      setIsSearchingNearby(false);
      setSelectedRegion("ALL");

      const res = await getChurches({ type: "GIAO_HO", is_active: 1 });
      const listData = res?.data || res || [];
      const validData = Array.isArray(listData) ? listData : [];
      setChurches(validData);
      if (validData.length > 0) setActiveChurchId(validData[0].id);
    } catch (err) {
      console.error("Lỗi lấy danh sách Giáo họ:", err);
      message.error("Không thể tải danh sách Giáo họ!");
    } finally {
      setLoading(false);
    }
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      message.error("Trình duyệt không hỗ trợ GPS!");
      return;
    }

    message.loading({ content: "Đang lấy vị trí GPS...", key: "geo" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords;

        try {
          setLoading(true);
          message.loading({
            content: `Đang quét trong bán kính ${radiusKm}km...`,
            key: "geo",
          });

          const res = await searchChurchMap({
            lat,
            lng,
            radius: radiusKm,
            type: "GIAO_HO",
          });

          const listData = res?.data || res || [];
          const validData = Array.isArray(listData) ? listData : [];
          setChurches(validData);
          setIsSearchingNearby(true);
          if (validData.length > 0) setActiveChurchId(validData[0].id);

          if (validData.length === 0) {
            message.info({
              content: `Không thấy Giáo họ trong bán kính ${radiusKm}km.`,
              key: "geo",
            });
          } else {
            message.success({
              content: `Tìm thấy ${validData.length} Giáo họ gần bạn!`,
              key: "geo",
            });
          }
        } catch (err) {
          console.error(err);
          message.error({ content: "Lỗi tra cứu vị trí!", key: "geo" });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        message.error({ content: "Hãy bật quyền truy cập GPS!", key: "geo" });
      },
    );
  };

  const handleViewDetail = async (id) => {
    try {
      setDetailLoading(true);
      setIsDetailModalOpen(true);
      setIsFullscreenModal(false);
      setCopied(false);

      const res = await getChurchById(id);
      setSelectedChurch(res?.data || res || null);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải chi tiết!");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleShareChurch = () => {
    if (!selectedChurch) return;
    const textToCopy = `[${selectedChurch.name}] - Trực thuộc Giáo xứ Đồng Quan. Địa chỉ: ${
      selectedChurch.address || "Chưa cập nhật"
    }. LM: ${selectedChurch.pastor_name || "Chưa cập nhật"}.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    message.success("Đã sao chép thông tin!");
    setTimeout(() => setCopied(false), 2500);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") return null;
    if (imagePath.startsWith("http")) return imagePath;
    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    return `${baseUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  };

  const handleOpenMap = (lat, lng) => {
    if (!lat || !lng) return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
    );
  };

  const filteredChurches = useMemo(() => {
    return churches.filter((item) => {
      const matchSearch =
        !searchQuery ||
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRegion =
        selectedRegion === "ALL" ||
        `${item.ward || ""} ${item.address || ""} ${item.description || ""}`
          .toLowerCase()
          .includes(selectedRegion.toLowerCase());

      return matchSearch && matchRegion;
    });
  }, [churches, searchQuery, selectedRegion]);

  const activeChurch = useMemo(() => {
    return (
      churches.find((c) => c.id === activeChurchId) ||
      filteredChurches[0] ||
      null
    );
  }, [churches, activeChurchId, filteredChurches]);

  const regionFilters = [
    { key: "ALL", label: "Tất cả" },
    { key: "Khu vực Bắc", label: "Khu Bắc" },
    { key: "Khu vực Nam", label: "Khu Nam" },
    { key: "Gần sông", label: "Ven Sông / Đê" },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColors.primary,
          borderRadius: 12,
          colorBgLayout: themeColors.bgBody,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="giaoho-mobile-root">
        <Content className="giaoho-mobile-wrapper">
          <div className="giaoho-mobile-container">
            {/* HERO SECTION COMPACT */}
            <div className="mobile-hero">
              <div className="hero-top-row">
                <Tag className="hero-badge">
                  <HomeOutlined /> CỘNG ĐOÀN DÂN CHÚA
                </Tag>
                <span className="stats-badge">
                  {filteredChurches.length} Giáo họ
                </span>
              </div>
              <Title level={3} className="hero-title-text">
                Các Giáo Họ Trực Thuộc
              </Title>
              <Text className="hero-subtext">
                Giáo xứ Đồng Quan • Giáo phận Thái Bình
              </Text>
            </div>

            {/* THANH TÌM KIẾM & CHỌN BÁN KÍNH */}
            <Card bordered={false} className="mobile-control-card">
              <Input
                placeholder="Tìm tên giáo họ, địa chỉ..."
                prefix={<SearchOutlined style={{ color: "#94A3B8" }} />}
                allowClear
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mobile-search-input"
              />

              <div className="nearby-control-row">
                <div className="radius-input-group">
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Bán kính:
                  </Text>
                  <InputNumber
                    min={1}
                    max={100}
                    value={radiusKm}
                    onChange={(val) => setRadiusKm(val || 10)}
                    addonAfter="km"
                    style={{ width: 100 }}
                    size="middle"
                  />
                </div>
                <Button
                  type="primary"
                  icon={<AimOutlined />}
                  onClick={handleFindNearby}
                  className="btn-find-nearby"
                >
                  Định vị
                </Button>
                {isSearchingNearby && (
                  <Button
                    type="link"
                    onClick={fetchGiaoHo}
                    style={{ padding: "0 4px" }}
                  >
                    Xóa lọc
                  </Button>
                )}
              </div>

              {/* KHU VỰC - HOẠT ĐỘNG CHUẨN TOUCH SWIPE */}
              <div className="horizontal-scroll-chips">
                <span className="chip-label">
                  <FilterOutlined /> Lọc:
                </span>
                {regionFilters.map((rf) => (
                  <button
                    key={rf.key}
                    className={`mobile-chip ${selectedRegion === rf.key ? "active" : ""}`}
                    onClick={() => setSelectedRegion(rf.key)}
                  >
                    {rf.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* CỤM NÚT CHUYỂN CHẾ ĐỘ XEM (SWITCH DI ĐỘNG) */}
            <div className="mobile-view-toggle">
              <Segmented
                block
                size="large"
                options={[
                  {
                    value: "list",
                    label: "Danh sách",
                    icon: <UnorderedListOutlined />,
                  },
                  { value: "map", label: "Bản đồ", icon: <GlobalOutlined /> },
                ]}
                value={viewMode}
                onChange={(val) => setViewMode(val)}
              />
            </div>

            {/* CHẾ ĐỘ 1: DANH SÁCH GIÁO HỌ */}
            {viewMode === "list" && (
              <div className="mobile-church-list">
                {loading ? (
                  <div className="loading-state">
                    <Spin size="large" />
                    <Text
                      type="secondary"
                      style={{ marginTop: 10, display: "block" }}
                    >
                      Đang tải danh sách...
                    </Text>
                  </div>
                ) : filteredChurches.length === 0 ? (
                  <Card
                    bordered={false}
                    style={{ borderRadius: 12, marginTop: 12 }}
                  >
                    <Empty description="Không tìm thấy Giáo họ phù hợp." />
                  </Card>
                ) : (
                  filteredChurches.map((item) => {
                    const imgUrl = getImageUrl(item.image);
                    const isActive = activeChurchId === item.id;

                    return (
                      <div
                        key={item.id}
                        className={`mobile-church-card ${isActive ? "active" : ""}`}
                        onClick={() => {
                          setActiveChurchId(item.id);
                          handleViewDetail(item.id);
                        }}
                      >
                        <div className="card-thumb">
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.name} />
                          ) : (
                            <div className="thumb-placeholder">
                              <HomeOutlined
                                style={{
                                  fontSize: 24,
                                  color: themeColors.accent,
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="card-content">
                          <div className="card-header">
                            <Text strong className="church-title" ellipsis>
                              {item.name}
                            </Text>
                            <RightOutlined
                              style={{ fontSize: 12, color: "#94A3B8" }}
                            />
                          </div>

                          <Text
                            type="secondary"
                            className="church-subtext"
                            ellipsis
                          >
                            <EnvironmentOutlined style={{ marginRight: 4 }} />
                            {item.address ||
                              item.ward ||
                              "Chưa cập nhật địa chỉ"}
                          </Text>

                          {item.pastor_name && (
                            <Text
                              type="secondary"
                              className="church-subtext"
                              ellipsis
                            >
                              <UserOutlined style={{ marginRight: 4 }} />
                              LM: <strong>{item.pastor_name}</strong>
                            </Text>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* CHẾ ĐỘ 2: BẢN ĐỒ INTERACTIVE DI ĐỘNG */}
            {viewMode === "map" && (
              <div className="mobile-map-wrapper">
                <Card bordered={false} className="mobile-map-card">
                  <div className="mobile-leaflet-container">
                    <MapContainer
                      center={[20.35, 106.45]}
                      zoom={12}
                      zoomControl={false}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {activeChurch?.latitude && activeChurch?.longitude && (
                        <MapRecenter
                          lat={parseFloat(activeChurch.latitude)}
                          lng={parseFloat(activeChurch.longitude)}
                        />
                      )}

                      {filteredChurches
                        .filter((item) => item.latitude && item.longitude)
                        .map((item) => (
                          <Marker
                            key={item.id}
                            position={[
                              parseFloat(item.latitude),
                              parseFloat(item.longitude),
                            ]}
                            eventHandlers={{
                              click: () => setActiveChurchId(item.id),
                            }}
                          />
                        ))}
                    </MapContainer>
                  </div>

                  {/* BOTTOM FLOATING CARD KHI BẬT MAP */}
                  {activeChurch && (
                    <div className="map-bottom-sheet">
                      <div className="sheet-header">
                        <div>
                          <Text strong className="sheet-title">
                            {activeChurch.name}
                          </Text>
                          <Text
                            type="secondary"
                            className="sheet-subtitle"
                            ellipsis
                          >
                            {activeChurch.address || "Giáo xứ Đồng Quan"}
                          </Text>
                        </div>
                        <Button
                          type="primary"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handleViewDetail(activeChurch.id)}
                          style={{ backgroundColor: themeColors.primary }}
                        >
                          Xem
                        </Button>
                      </div>

                      {activeChurch.latitude && activeChurch.longitude && (
                        <Button
                          type="default"
                          block
                          icon={<CompassOutlined />}
                          onClick={() =>
                            handleOpenMap(
                              activeChurch.latitude,
                              activeChurch.longitude,
                            )
                          }
                          style={{ marginTop: 8 }}
                        >
                          Chỉ đường Google Maps
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* MODAL / DRAWER CHI TIẾT DÙNG CHUNG MOBI / DESKTOP */}
            <Modal
              open={isDetailModalOpen}
              footer={null}
              onCancel={() => {
                setIsDetailModalOpen(false);
                setSelectedChurch(null);
              }}
              width={isFullscreenModal ? "100vw" : 700}
              style={{ top: isFullscreenModal ? 0 : 20, paddingBottom: 0 }}
              className={`mobile-detail-modal ${isFullscreenModal ? "fullscreen" : ""}`}
              centered={!isFullscreenModal}
              title={
                <div className="modal-header-mobile">
                  <Space align="center" ellipsis style={{ flex: 1 }}>
                    <HomeOutlined style={{ color: themeColors.accent }} />
                    <span
                      style={{
                        color: themeColors.primary,
                        fontWeight: 700,
                        fontSize: 15,
                      }}
                    >
                      CHI TIẾT GIÁO HỌ
                    </span>
                  </Space>
                  <Space>
                    <Button
                      type="text"
                      icon={
                        copied ? (
                          <CheckOutlined style={{ color: "#16A34A" }} />
                        ) : (
                          <ShareAltOutlined />
                        )
                      }
                      onClick={handleShareChurch}
                    />
                  </Space>
                </div>
              }
            >
              {detailLoading ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <Spin size="large" />
                </div>
              ) : (
                selectedChurch && (
                  <div className="modal-mobile-body">
                    <div className="modal-banner-box">
                      {getImageUrl(selectedChurch.image) ? (
                        <Image
                          src={getImageUrl(selectedChurch.image)}
                          alt={selectedChurch.name}
                          style={{
                            width: "100%",
                            borderRadius: 10,
                            maxHeight: 220,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div className="modal-banner-placeholder">
                          <PictureOutlined
                            style={{ fontSize: 36, color: "#94A3B8" }}
                          />
                          <Text
                            type="secondary"
                            style={{ fontSize: 12, marginTop: 4 }}
                          >
                            Chưa có hình ảnh
                          </Text>
                        </div>
                      )}
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <Tag color="gold" style={{ fontWeight: 700 }}>
                        GIÁO HỌ TRỰC THUỘC
                      </Tag>
                      <Title
                        level={4}
                        style={{
                          color: themeColors.primary,
                          margin: "6px 0 2px 0",
                        }}
                      >
                        {selectedChurch.name}
                      </Title>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Giáo xứ Đồng Quan • Hạt Tiền Hải
                      </Text>
                    </div>

                    <Divider style={{ margin: "12px 0" }} />

                    <Descriptions
                      column={1}
                      size="small"
                      bordered
                      className="modal-mobile-desc"
                    >
                      <Descriptions.Item label="LM Phụ trách">
                        <strong>
                          {selectedChurch.pastor_name || "Chưa cập nhật"}
                        </strong>
                      </Descriptions.Item>
                      <Descriptions.Item label="Địa chỉ">
                        {selectedChurch.address ||
                          selectedChurch.ward ||
                          "Chưa cập nhật"}
                      </Descriptions.Item>
                      <Descriptions.Item label="Điện thoại">
                        {selectedChurch.phone ? (
                          <a href={`tel:${selectedChurch.phone}`}>
                            {selectedChurch.phone}
                          </a>
                        ) : (
                          "Chưa cập nhật"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Email">
                        {selectedChurch.email || "Chưa cập nhật"}
                      </Descriptions.Item>
                    </Descriptions>

                    {selectedChurch.description && (
                      <div style={{ marginTop: 12 }}>
                        <Text
                          strong
                          style={{ fontSize: 13, color: themeColors.primary }}
                        >
                          Mô tả:
                        </Text>
                        <Paragraph
                          type="secondary"
                          style={{ fontSize: 13, marginTop: 2 }}
                        >
                          {selectedChurch.description}
                        </Paragraph>
                      </div>
                    )}

                    {selectedChurch.latitude && selectedChurch.longitude && (
                      <Button
                        type="primary"
                        icon={<CompassOutlined />}
                        block
                        size="large"
                        style={{
                          marginTop: 16,
                          backgroundColor: themeColors.primary,
                          fontWeight: 600,
                          borderRadius: 10,
                        }}
                        onClick={() =>
                          handleOpenMap(
                            selectedChurch.latitude,
                            selectedChurch.longitude,
                          )
                        }
                      >
                        Chỉ đường qua Google Maps
                      </Button>
                    )}
                  </div>
                )
              )}
            </Modal>
          </div>
        </Content>

        {/* STYLES RESPONSIVE MOBILE FIRST */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .giaoho-mobile-root {
            background: ${themeColors.bgBody};
            min-height: 100vh;
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .giaoho-mobile-wrapper {
            padding: 12px 12px 32px 12px;
          }

          .giaoho-mobile-container {
            max-width: 1000px;
            margin: 0 auto;
          }

          /* HERO MOBILE */
          .mobile-hero {
            background: linear-gradient(135deg, ${themeColors.primary} 0%, #0D1B2A 100%);
            border-radius: 14px;
            padding: 16px;
            color: #FFFFFF;
            margin-bottom: 12px;
          }

          .hero-top-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          }

          .hero-badge {
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid ${themeColors.accent};
            color: ${themeColors.accent};
            font-size: 10px;
            font-weight: 700;
            border-radius: 12px;
            margin-right: 0;
          }

          .stats-badge {
            font-size: 11px;
            color: ${themeColors.accent};
            font-weight: 600;
          }

          .hero-title-text {
            color: #FFFFFF !important;
            margin: 0 !important;
            font-size: 20px !important;
            font-weight: 700 !important;
          }

          .hero-subtext {
            color: #94A3B8;
            font-size: 12px;
          }

          /* CONTROL CARD MOBILE */
          .mobile-control-card {
            border-radius: 12px !important;
            border: 1px solid ${themeColors.border} !important;
            padding: 12px !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03) !important;
          }

          .mobile-control-card .ant-card-body {
            padding: 0 !important;
          }

          .mobile-search-input {
            border-radius: 8px;
            margin-bottom: 10px;
          }

          .nearby-control-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;
            flex-wrap: wrap;
          }

          .radius-input-group {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .btn-find-nearby {
            background-color: ${themeColors.primary};
            font-weight: 600;
            flex: 1;
          }

          .horizontal-scroll-chips {
            display: flex;
            align-items: center;
            gap: 6px;
            overflow-x: auto;
            padding-top: 8px;
            border-top: 1px dashed ${themeColors.border};
            -webkit-overflow-scrolling: touch;
          }

          .horizontal-scroll-chips::-webkit-scrollbar {
            display: none;
          }

          .chip-label {
            font-size: 11px;
            color: #64748B;
            white-space: nowrap;
          }

          .mobile-chip {
            background: #F1F5F9;
            border: 1px solid transparent;
            color: ${themeColors.textDark};
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            white-space: nowrap;
            flex-shrink: 0;
            cursor: pointer;
          }

          .mobile-chip.active {
            background: rgba(212, 175, 55, 0.18);
            border-color: ${themeColors.accent};
            color: ${themeColors.primary};
            font-weight: 700;
          }

          /* VIEW SWITCH MOBILE */
          .mobile-view-toggle {
            margin: 12px 0;
          }

          .mobile-view-toggle .ant-segmented {
            background: #E2E8F0;
            padding: 3px;
            border-radius: 10px;
          }

          /* MOBILE LIST */
          .mobile-church-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .mobile-church-card {
            background: #FFFFFF;
            border: 1px solid ${themeColors.border};
            border-radius: 12px;
            padding: 10px;
            display: flex;
            gap: 12px;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
            transition: all 0.2s;
          }

          .mobile-church-card:active {
            scale: 0.98;
            background: #FAF3E0;
          }

          .mobile-church-card.active {
            border-color: ${themeColors.accent};
            background: #FFFDF5;
          }

          .card-thumb {
            width: 64px;
            height: 64px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;
            background: #F1F5F9;
          }

          .card-thumb img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .thumb-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .card-content {
            flex: 1;
            overflow: hidden;
          }

          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .church-title {
            font-size: 14px;
            color: ${themeColors.primary};
          }

          .church-subtext {
            font-size: 11px;
            display: block;
            margin-top: 2px;
          }

          /* MOBILE MAP */
          .mobile-map-card {
            border-radius: 12px !important;
            overflow: hidden;
            border: 1px solid ${themeColors.border} !important;
            padding: 0 !important;
            position: relative;
          }

          .mobile-map-card .ant-card-body {
            padding: 0 !important;
          }

          .mobile-leaflet-container {
            height: 68vh;
            width: 100%;
          }

          .map-bottom-sheet {
            position: absolute;
            bottom: 10px;
            left: 10px;
            right: 10px;
            z-index: 1000;
            background: rgba(255, 255, 255, 0.96);
            backdrop-filter: blur(8px);
            border-radius: 12px;
            padding: 12px;
            border: 1px solid ${themeColors.border};
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          }

          .sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 8px;
          }

          .sheet-title {
            font-size: 14px;
            color: ${themeColors.primary};
            display: block;
          }

          .sheet-subtitle {
            font-size: 11px;
            display: block;
          }

          /* MODAL RESPONSIVE */
          .modal-header-mobile {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          }

          .modal-banner-placeholder {
            height: 140px;
            background: #F1F5F9;
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .modal-mobile-desc .ant-descriptions-item-label {
            width: 110px;
            font-size: 12px;
            background: #F8FAFC;
          }

          .modal-mobile-desc .ant-descriptions-item-content {
            font-size: 12px;
          }

          .loading-state {
            text-align: center;
            padding: 40px 0;
          }

          /* MEDIA QUERY DESKTOP ENHANCEMENT */
          @media (min-width: 768px) {
            .giaoho-mobile-wrapper {
              padding: 24px 20px;
            }
            .mobile-hero {
              padding: 24px;
            }
            .hero-title-text {
              font-size: 24px !important;
            }
            .mobile-leaflet-container {
              height: 520px;
            }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default GiaoHoPage;
