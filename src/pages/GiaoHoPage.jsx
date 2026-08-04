import React, { useEffect, useState } from "react";
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
} from "@ant-design/icons";

import { getChurches, getChurchById, searchChurchMap } from "../api/churchApi";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const GiaoHoPage = () => {
  // Bảng màu Truyền Thống & Tôn Nghiêm (Sacred Editorial)
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const accentGold = "#D4AF37"; // Vàng Đồng Ánh Kim
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

  // States UI Micro-Interactions
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.title = "Các Giáo Họ Trực Thuộc | Giáo Xứ Đồng Quan";
    fetchGiaoHo();
  }, []);

  // 1. LẤY DANH SÁCH MẶC ĐỊNH
  const fetchGiaoHo = async () => {
    try {
      setLoading(true);
      setIsSearchingNearby(false);

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

  // 4. COPY THÔNG TIN CHIA SẺ (MICRO-INTERACTION)
  const handleShareChurch = () => {
    if (!selectedChurch) return;
    const textToCopy = `[${selectedChurch.name}] - Trực thuộc Giáo xứ Đồng Quan. Địa chỉ: ${selectedChurch.address || "Chưa cập nhật"}. LM Phụ trách: ${selectedChurch.pastor_name || "Chưa cập nhật"}.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    message.success("Đã sao chép thông tin Giáo họ vào bộ nhớ tạm!");
    setTimeout(() => setCopied(false), 2500);
  };

  // Helper chuẩn hóa đường dẫn ảnh
  const getImageUrl = (imagePath) => {
    if (!imagePath || imagePath.trim() === "") return null;
    if (imagePath.startsWith("http")) return imagePath;

    const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
    return `${baseUrl}${cleanPath}`;
  };

  // Mở Google Maps
  const handleOpenMap = (lat, lng) => {
    if (!lat || !lng) return;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  console.log(churches);

  // Render Skeleton Loading UI khi đang tải
  const renderSkeletons = () => (
    <Row gutter={[12, 12]}>
      {[1, 2, 3, 4, 5, 6].map((key) => (
        <Col key={key} xs={12} sm={12} md={8} lg={8}>
          <Card bordered={false} className="giaoho-card-skeleton">
            <Skeleton.Node
              active
              style={{ width: "100%", height: 180, borderRadius: 12 }}
            />
            <div style={{ padding: "12px 0 0 0" }}>
              <Skeleton active paragraph={{ rows: 3 }} size="small" />
            </div>
          </Card>
        </Col>
      ))}
    </Row>
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

            {/* BẢN ĐỒ TÌM KIẾM ACTION BAR */}
            <Card bordered={false} className="search-map-bar-card glow-card">
              <Row gutter={[12, 12]} align="middle" justify="space-between">
                <Col xs={24} md={16}>
                  <Space wrap size={8}>
                    <RadarChartOutlined
                      className="radar-icon-animated"
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

                <Col xs={24} md={8} style={{ textAlign: "right" }}>
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
                      Hiển thị tất cả danh sách
                    </Button>
                  )}
                </Col>
              </Row>
            </Card>

            {/* DANH SÁCH GIÁO HỌ HOẶC SKELETON LOADING */}
            {loading ? (
              renderSkeletons()
            ) : churches.length === 0 ? (
              <Card className="giaoho-empty-card" bordered={false}>
                <Empty
                  description={
                    isSearchingNearby
                      ? `Không thấy Giáo họ nào trong bán kính ${radiusKm}km.`
                      : "Hiện chưa có dữ liệu Giáo họ trực thuộc."
                  }
                />
              </Card>
            ) : (
              <Row gutter={[12, 12]}>
                {churches.map((item) => {
                  const imgUrl = getImageUrl(item.image);

                  return (
                    <Col key={item.id} xs={12} sm={12} md={8} lg={8}>
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
                          {/* TIÊU ĐỀ & TAG */}
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

                          {/* MÔ TẢ GIÁO HỌ */}
                          {item.description && (
                            <Paragraph
                              className="giaoho-desc-paragraph"
                              ellipsis={{ rows: 2, expandable: false }}
                            >
                              {item.description}
                            </Paragraph>
                          )}

                          {/* NHÓM NÚT THAO TÁC */}
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

            {/* MODAL CHI TIẾT CÓ CHỨC NĂNG PHÓNG TO TOÀN MÀN HÌNH & CHIA SẺ */}
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

                  {/* NÚT PHÓNG TO / THU NHỎ MODAL (UI MICRO-INTERACTION) */}
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
                      {/* CỘT TRÁI: KHO HÌNH ẢNH CỠ LỚN */}
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

                        {/* THẺ TÓM TẮT DƯỚI ẢNH */}
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

                        {/* NÚT GOOGLE MAPS */}
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

                      {/* CỘT PHẢI: BẢNG CHI TIẾT VĂN BẢN THOÁNG MẮT */}
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

                        {/* BẢNG ĐÃ LOẠI BỎ TỌA ĐỘ GPS */}
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

                        {/* MÔ TẢ NỘI DUNG GIỚI THIỆU */}
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

                        {/* NHÓM NÚT BOTTOM ACTION (COPY & ĐÓNG) */}
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

        {/* STYLES SCOPED HOÀN CHỈNH - UI MICRO-INTERACTION EFFECTS */}
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

          .giaoho-editorial-wrapper { 
            padding: 40px 16px 60px 16px; 
          }

          .giaoho-editorial-container { 
            max-width: 1200px; 
            margin: 0 auto; 
          }

          /* Header */
          .giaoho-editorial-header { 
            text-align: center; 
            margin-bottom: 24px; 
          }

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
            transition: all 0.3s ease;
          }

          .pulse-badge:hover {
            transform: scale(1.04);
            box-shadow: 0 0 12px rgba(212, 175, 55, 0.3);
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
            font-size: 14px; 
            color: #64748b; 
            max-width: 620px;
            margin: 0 auto;
            line-height: 1.5;
          }

          /* Search Map Bar Glow Effect */
          .search-map-bar-card {
            border-radius: 14px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
            margin-bottom: 20px;
            padding: 2px;
            transition: all 0.3s ease;
          }

          .glow-card:hover {
            box-shadow: 0 6px 20px rgba(212, 175, 55, 0.15) !important;
            border-color: ${accentGold} !important;
          }

          .find-nearby-btn {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
          }

          /* Micro-Interaction Button Animations */
          .micro-bounce:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(27, 54, 93, 0.2);
          }

          .micro-push:active {
            transform: scale(0.97);
          }

          /* Interactive Card */
          .giaoho-card-skeleton {
            border-radius: 16px !important;
            background: #ffffff !important;
            padding: 12px;
            height: 100%;
          }

          .interactive-card { 
            border-radius: 16px !important; 
            border: 1px solid rgba(212, 175, 55, 0.25) !important; 
            background: #ffffff !important;
            box-shadow: 0 4px 16px rgba(27, 54, 93, 0.04) !important;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important; 
            overflow: hidden;
            height: 100%;
          }

          .interactive-card:hover { 
            transform: translateY(-6px) scale(1.01); 
            box-shadow: 0 16px 36px rgba(27, 54, 93, 0.12) !important; 
            border-color: ${accentGold} !important;
          }

          .giaoho-card .ant-card-body {
            padding: 14px !important;
          }

          .giaoho-img-wrapper {
            height: 180px;
            overflow: hidden;
            position: relative;
          }

          .giaoho-card-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .interactive-card:hover .giaoho-card-img {
            transform: scale(1.08);
          }

          .giaoho-placeholder-img {
            height: 180px;
            background: linear-gradient(135deg, ${softBg} 0%, rgba(212, 175, 55, 0.08) 100%);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 6px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          }

          .placeholder-icon {
            font-size: 32px;
            color: ${accentGold};
          }

          .placeholder-text {
            font-size: 12px;
            color: #94a3b8;
          }

          .card-top-bar {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 6px;
            margin-bottom: 2px;
          }

          .giaoho-card-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 0 !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            line-height: 1.3 !important;
          }

          .giaoho-tag-type {
            background: rgba(212, 175, 55, 0.15) !important;
            color: ${primaryNavy} !important;
            border: 1px solid ${accentGold} !important;
            font-weight: 700;
            border-radius: 10px;
            font-size: 10px;
            margin-right: 0 !important;
            flex-shrink: 0;
            transition: transform 0.3s ease;
          }

          .interactive-card:hover .giaoho-tag-type {
            transform: translateX(-2px);
          }

          .info-subtext {
            font-size: 11px;
            color: #64748b;
          }

          .giaoho-desc-paragraph {
            color: #64748b;
            font-size: 12px;
            margin-top: 2px !important;
            margin-bottom: 2px !important;
            line-height: 1.4;
          }

          .giaoho-detail-btn {
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            height: 34px !important;
            font-size: 12px !important;
            transition: all 0.3s ease !important;
          }

          .giaoho-map-btn {
            border-radius: 8px !important;
            font-weight: 600 !important;
            color: ${primaryNavy} !important;
            border-color: rgba(27, 54, 93, 0.2) !important;
            height: 34px !important;
            font-size: 12px !important;
            transition: all 0.3s ease !important;
          }

          .giaoho-map-btn:hover {
            border-color: ${accentGold} !important;
            color: ${accentGold} !important;
          }

          /* Fullscreen Modal Override */
          .fullscreen-modal .ant-modal-content {
            border-radius: 0 !important;
            min-height: 100vh;
          }

          .modal-large-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: ${primaryNavy};
            font-weight: 700;
            font-size: 17px;
            letter-spacing: 0.5px;
          }

          .modal-large-body {
            padding: 12px 0 0 0;
          }

          .modal-huge-banner {
            height: 320px;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(27, 54, 93, 0.1);
            border: 1px solid rgba(212, 175, 55, 0.3);
          }

          .modal-banner-img-huge {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .modal-huge-placeholder {
            height: 280px;
            background: linear-gradient(135deg, ${softBg} 0%, rgba(212, 175, 55, 0.1) 100%);
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px dashed ${accentGold};
          }

          .modal-summary-card {
            background: ${softBg} !important;
            border-radius: 12px !important;
            margin-top: 14px;
            border: 1px solid rgba(27, 54, 93, 0.08) !important;
            padding: 4px;
          }

          .modal-large-descriptions .ant-descriptions-item-label {
            background: #f8fafc !important;
            font-weight: 600;
            width: 180px;
          }

          .desc-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: ${primaryNavy};
          }

          .modal-large-desc-box {
            background: #f8fafc;
            padding: 18px 20px;
            border-radius: 12px;
            border-left: 4px solid ${accentGold};
            border-top: 1px solid #f1f5f9;
            border-right: 1px solid #f1f5f9;
            border-bottom: 1px solid #f1f5f9;
          }

          /* MOBILE STYLES */
          @media (max-width: 576px) {
            .giaoho-editorial-wrapper {
              padding: 20px 8px !important;
            }

            .giaoho-img-wrapper,
            .giaoho-placeholder-img {
              height: 125px !important;
            }

            .placeholder-icon {
              font-size: 24px !important;
            }

            .placeholder-text {
              font-size: 11px !important;
            }

            .giaoho-card .ant-card-body {
              padding: 10px 8px !important;
            }

            .card-top-bar {
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 2px !important;
            }

            .giaoho-card-title {
              font-size: 13px !important;
              line-height: 1.25 !important;
            }

            .giaoho-tag-type {
              font-size: 9px !important;
              padding: 0 4px !important;
            }

            .giaoho-desc-paragraph {
              font-size: 11px !important;
            }

            .giaoho-detail-btn,
            .giaoho-map-btn {
              height: 30px !important;
              font-size: 11px !important;
              padding: 0 2px !important;
            }

            .modal-huge-banner {
              height: 200px;
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
