import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Typography,
  ConfigProvider,
  Carousel,
  Spin,
} from "antd";
import {
  CompassOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Gọi API sự kiện
import { getEvents } from "../api/eventApi";

const { Title, Paragraph } = Typography;

// Bảng màu thiết kế Tôn Nghiêm (Editorial Sacred Palette)
const primaryNavy = "#1B365D"; // Xanh Đêm Navy
const accentGold = "#D4AF37"; // Vàng Đồng

// Icon Loading xoay nghệ thuật
const sacredSpinIcon = (
  <LoadingOutlined style={{ fontSize: 42, color: accentGold }} spin />
);

export default function EventPopup() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    let isMounted = true;

    const fetchEventPopup = async () => {
      try {
        setLoading(true);
        const res = await getEvents();
        console.log("Dữ liệu sự kiện từ API:", res.data);
        const events = res.data?.data || res.data || [];

        // Lấy sự kiện nổi bật (is_featured) hoặc lấy sự kiện mới nhất
        const featuredEvent =
          events.find((e) => e.is_featured || e.featured) || events[0];

        if (isMounted && featuredEvent) {
          setEventData(featuredEvent);
          setOpen(true);
        }
      } catch (error) {
        console.error("Lỗi khi tải sự kiện popup:", error);
      } finally {
        if (isMounted) {
          // Trễ nhẹ 300ms để hiệu ứng chuyển cảnh mượt mà
          setTimeout(() => setLoading(false), 300);
        }
      }
    };

    fetchEventPopup();

    return () => {
      isMounted = false;
    };
  }, []);

  // Đóng Popup đơn thuần
  const handleClose = () => {
    setOpen(false);
  };

  // Xem chi tiết sự kiện
  const handleViewDetail = () => {
    handleClose();
    if (eventData?.id || eventData?.slug) {
      navigate(`/su-kien/${eventData.slug || eventData.id}`);
    } else {
      navigate("/su-kien");
    }
  };

  if (!open) return null;

  // Lấy danh sách ảnh làm Slide (nếu có mảng images)
  const imageList =
    eventData && Array.isArray(eventData.images) && eventData.images.length > 0
      ? eventData.images
      : [
          eventData?.banner ||
            eventData?.image ||
            eventData?.cover_url ||
            "/images/event-banner.jpg",
        ];

  // Chuẩn hóa đường dẫn URL của ảnh
  const formattedImages = imageList.map((img) => {
    if (!img) return "/images/event-banner.jpg";
    return img.startsWith("http") ? img : `${API_URL}${img}`;
  });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 16,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Modal
        open={open}
        footer={null}
        closable={false}
        centered
        width={760}
        onCancel={handleClose}
        className="editorial-event-modal"
      >
        <div className="popup-card-wrapper">
          {/* NÚT ĐÓNG TỰ THIẾT KẾ SANG TRỌNG */}
          <button
            className="popup-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <CloseOutlined />
          </button>

          {/* MÀN HÌNH LOADING CHỜ TẢI DỮ LIỆU/HÌNH ẢNH */}
          {loading ? (
            <div className="popup-loading-container">
              <Spin indicator={sacredSpinIcon} />
              <div className="loading-badge">
                <CompassOutlined /> HỆ THỐNG MỤC VỤ GIÁO XỨ
              </div>
              <Paragraph className="loading-text">
                Đang tải thông tin sự kiện mới nhất...
              </Paragraph>
            </div>
          ) : (
            /* BACKGROUND SLIDER NỀN MƯỢT MÀ KHI ĐÃ CÓ DỮ LIỆU */
            <div className="popup-carousel-container">
              <Carousel
                autoplay
                autoplaySpeed={4000}
                effect="fade"
                dots={false}
              >
                {formattedImages.map((imgUrl, index) => (
                  <div key={index} className="slide-item">
                    <div
                      className="popup-banner-bg"
                      style={{ backgroundImage: `url(${imgUrl})` }}
                    />
                  </div>
                ))}
              </Carousel>

              {/* OVERLAY LỚP PHỦ NỘI DUNG */}
              <div className="popup-gradient-overlay">
                <div className="popup-content-inner">
                  {/* HUY HIỆU TÔN NGHIÊM & CATEGORY */}
                  <div style={{ textAlign: "center", marginBottom: 12 }}>
                    <span className="sacred-badge">
                      <CompassOutlined />{" "}
                      {eventData?.category
                        ? eventData.category.toUpperCase()
                        : "SỰ KIỆN MỤC VỤ GIÁO XỨ"}
                    </span>
                  </div>

                  {/* THỜI GIAN & ĐỊA ĐIỂM */}
                  <div className="event-meta-row">
                    {eventData?.event_date && (
                      <span className="event-meta-pill">
                        <CalendarOutlined style={{ color: accentGold }} />
                        {dayjs(eventData.event_date).format("DD/MM/YYYY")}
                      </span>
                    )}

                    {eventData?.location && (
                      <span className="event-meta-pill">
                        <EnvironmentOutlined style={{ color: accentGold }} />
                        {eventData.location}
                      </span>
                    )}
                  </div>

                  {/* TIÊU ĐỀ SỰ KIỆN */}
                  <Title level={2} className="popup-main-title">
                    {eventData?.title ||
                      "Chúc Mừng Xứ Đồng Quan Hoàn Thành Hội Thi Tin Mừng Matthêu"}
                  </Title>

                  {/* MÔ TẢ NGẮN */}
                  <Paragraph className="popup-description">
                    {eventData?.meta_desc ||
                      eventData?.description ||
                      eventData?.summary ||
                      "Trong niềm vui và tinh thần hiệp thông của cộng đoàn, các em thiếu nhi thuộc Liên Xứ Đồng Quan đã cùng nhau tham gia Hội Thi Tin Mừng Matthêu với tinh thần nhiệt thành và đầy lòng yêu mến Chúa."}
                  </Paragraph>

                  {/* HÀNH ĐỘNG */}
                  <div className="popup-action-group">
                    <Button
                      type="primary"
                      size="large"
                      icon={<ArrowRightOutlined />}
                      onClick={handleViewDetail}
                      className="btn-view-event"
                    >
                      Đọc Chi Tiết Sự Kiện
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CSS SCOPED PHONG CÁCH EDITORIAL SACRED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

            .editorial-event-modal .ant-modal-content {
              padding: 0 !important;
              border-radius: 24px !important;
              overflow: hidden !important;
              border: 1px solid rgba(212, 175, 55, 0.4) !important;
              box-shadow: 0 25px 50px rgba(27, 54, 93, 0.3) !important;
            }

            .popup-card-wrapper {
              position: relative;
              width: 100%;
              min-height: 500px;
              background: ${primaryNavy};
            }

            /* Container Loading */
            .popup-loading-container {
              min-height: 500px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 16px;
              background: linear-gradient(
                180deg,
                rgba(27, 54, 93, 0.95) 0%,
                #0f2342 100%
              );
              padding: 40px 24px;
            }

            .loading-badge {
              background: rgba(212, 175, 55, 0.15);
              border: 1px solid ${accentGold};
              color: ${accentGold};
              padding: 4px 16px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1.2px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              margin-top: 8px;
            }

            .loading-text {
              color: rgba(255, 255, 255, 0.85) !important;
              font-size: 14px !important;
              margin: 0 !important;
            }

            .popup-close-btn {
              position: absolute;
              top: 16px;
              right: 16px;
              z-index: 20;
              width: 38px;
              height: 38px;
              border-radius: 50%;
              background: rgba(0, 0, 0, 0.45);
              border: 1px solid rgba(255, 255, 255, 0.3);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.25s ease;
              backdrop-filter: blur(8px);
            }

            .popup-close-btn:hover {
              background: ${accentGold};
              color: ${primaryNavy};
              border-color: ${accentGold};
              transform: rotate(90deg);
            }

            .popup-carousel-container {
              position: relative;
              min-height: 500px;
              overflow: hidden;
            }

            .slide-item {
              height: 500px;
            }

            .popup-banner-bg {
              width: 100%;
              height: 500px;
              background-size: cover;
              background-position: center;
              transition: transform 6s ease-out;
            }

            .popup-gradient-overlay {
              position: absolute;
              inset: 0;
              z-index: 5;
              background: linear-gradient(
                180deg,
                rgba(27, 54, 93, 0.4) 0%,
                rgba(27, 54, 93, 0.95) 100%
              );
              display: flex;
              align-items: flex-end;
              justify-content: center;
              padding: 40px 28px;
            }

            .popup-content-inner {
              max-width: 620px;
              text-align: center;
              color: #ffffff;
            }

            .sacred-badge {
              background: rgba(212, 175, 55, 0.25);
              border: 1px solid ${accentGold};
              color: #ffffff;
              padding: 4px 16px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1.2px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              backdrop-filter: blur(6px);
            }

            .event-meta-row {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 16px;
              margin-bottom: 10px;
            }

            .event-meta-pill {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 13px;
              color: ${accentGold};
              font-weight: 600;
            }

            .popup-main-title {
              font-family: 'Playfair Display', Georgia, serif !important;
              color: #ffffff !important;
              margin: 0 0 12px 0 !important;
              font-weight: 700 !important;
              font-size: clamp(22px, 3.8vw, 30px) !important;
              line-height: 1.3 !important;
              text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
            }

            .popup-description {
              color: rgba(255, 255, 255, 0.88) !important;
              font-size: 14px !important;
              line-height: 1.6 !important;
              margin-bottom: 24px !important;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .btn-view-event {
              background: ${accentGold} !important;
              border-color: ${accentGold} !important;
              color: ${primaryNavy} !important;
              height: 48px !important;
              padding: 0 32px !important;
              border-radius: 12px !important;
              font-weight: 700 !important;
              font-size: 15px !important;
              box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35) !important;
              transition: all 0.3s ease !important;
            }

            .btn-view-event:hover {
              transform: translateY(-2px);
              background: #e5be42 !important;
              border-color: #e5be42 !important;
            }

            @media (max-width: 576px) {
              .popup-card-wrapper, .popup-carousel-container, .slide-item, .popup-banner-bg, .popup-loading-container {
                min-height: 440px;
                height: 440px;
              }
              .popup-gradient-overlay {
                padding: 24px 16px;
              }
            }
          `,
          }}
        />
      </Modal>
    </ConfigProvider>
  );
}
