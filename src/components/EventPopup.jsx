import React, { useState, useEffect } from "react";
import { ConfigProvider, Button, Tag } from "antd";
import {
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  X,
  Compass,
  Loader2,
  Flame,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";

// Gọi API sự kiện
import { getEvents } from "../api/eventApi";

export default function EventPopup() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Bảng màu thiết kế Tôn Nghiêm
  const primaryNavy = "#0B192C";
  const accentGold = "#D4A017";

  useEffect(() => {
    let isMounted = true;

    const fetchEventPopup = async () => {
      try {
        setLoading(true);
        const res = await getEvents({ is_active: 1, limit: 5 });
        const events = res?.data?.data || res?.data || res || [];

        // Ưu tiên lấy sự kiện nổi bật (is_featured) hoặc lấy sự kiện mới nhất
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
          setTimeout(() => setLoading(false), 300);
        }
      }
    };

    fetchEventPopup();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleViewDetail = () => {
    handleClose();
    if (eventData?.slug) {
      navigate(`/su-kien/${eventData.slug}`);
    } else if (eventData?.id) {
      navigate(`/tin-tuc/${eventData.id}`);
    } else {
      navigate("/su-kien");
    }
  };

  if (!open) return null;

  // Lấy ảnh hiển thị
  const eventImages =
    eventData && Array.isArray(eventData.images) && eventData.images.length > 0
      ? eventData.images
      : [
          eventData?.banner ||
            eventData?.image ||
            eventData?.cover_url ||
            "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=1200",
        ];

  const imageUrl = eventImages[0]?.startsWith("http")
    ? eventImages[0]
    : `${API_URL}${eventImages[0]}`;

  // Framer Motion Variants
  const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const modalContainer = {
    hidden: { scale: 0.88, opacity: 0, y: 30 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: { type: "spring", damping: 25, stiffness: 300 },
    },
    exit: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } },
  };

  const staggerContent = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const fadeInUpItem = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: accentGold,
          fontFamily:
            "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <AnimatePresence>
        {open && (
          <div className="motion-popup-overlay">
            {/* BACKDROP MỜ */}
            <motion.div
              variants={modalBackdrop}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="motion-backdrop-bg"
              onClick={handleClose}
            />

            {/* MODAL THÂN CHÍNH */}
            <motion.div
              variants={modalContainer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="motion-modal-card"
            >
              {/* NÚT ĐÓNG NỔI BẬT */}
              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="motion-close-btn"
                onClick={handleClose}
                aria-label="Đóng thông báo"
              >
                <X size={20} />
              </motion.button>

              {loading ? (
                <div className="motion-loading-box">
                  <Loader2 className="spinner-icon" size={44} />
                  <span className="loading-badge">
                    <Compass size={14} /> GIÁO XỨ ĐỒNG QUAN
                  </span>
                  <p>Đang chuẩn bị thông tin mục vụ...</p>
                </div>
              ) : (
                <div className="motion-card-layout">
                  {/* CỘT TRÁI / BANNER ẢNH CINEMATIC */}
                  <div className="card-media-banner">
                    <motion.div
                      initial={{ scale: 1.15 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="banner-image-bg"
                      style={{ backgroundImage: `url('${imageUrl}')` }}
                    />
                    <div className="media-gradient-shading" />

                    <div className="floating-top-badge">
                      <Tag className="luxe-gold-badge">
                        <Flame size={12} className="flame-icon" /> TIN TỨC ĐẶC
                        BIỆT
                      </Tag>
                    </div>
                  </div>

                  {/* CỘT PHẢI / NỘI DUNG TYPOGRAPHY SANG TRỌNG */}
                  <motion.div
                    variants={staggerContent}
                    initial="hidden"
                    animate="visible"
                    className="card-content-body"
                  >
                    <motion.div
                      variants={fadeInUpItem}
                      className="meta-tag-bar"
                    >
                      <Tag className="sacred-category-pill">
                        <Sparkles size={12} />
                        {eventData?.category
                          ? eventData.category.toUpperCase()
                          : "SỰ KIỆN MỤC VỤ"}
                      </Tag>
                    </motion.div>

                    {/* TIÊU ĐỀ RÕ RÀNG */}
                    <motion.h2 variants={fadeInUpItem} className="luxe-title">
                      {eventData?.title ||
                        "Chúc Mừng Hoàn Thành Hội Thi Tin Mừng Matthêu"}
                    </motion.h2>

                    {/* DÒNG THỜI GIAN & ĐỊA ĐIỂM */}
                    <motion.div
                      variants={fadeInUpItem}
                      className="meta-info-pills"
                    >
                      {eventData?.event_date && (
                        <span className="pill-item">
                          <Calendar size={14} className="pill-icon" />
                          {dayjs(
                            eventData.event_date || eventData.created_at,
                          ).format("DD/MM/YYYY")}
                        </span>
                      )}
                      <span className="pill-item">
                        <MapPin size={14} className="pill-icon" />
                        {eventData?.location || "Giáo xứ Đồng Quan"}
                      </span>
                    </motion.div>

                    {/* MÔ TẢ DỄ ĐỌC */}
                    <motion.p variants={fadeInUpItem} className="luxe-desc">
                      {eventData?.meta_desc ||
                        eventData?.description ||
                        eventData?.summary ||
                        "Hân hoan kính mời quý cộng đoàn cùng hiệp thông và theo dõi chi tiết các chương trình mục vụ trọng đại trong không khí thiêng liêng và tràn ngập hồng ân."}
                    </motion.p>

                    {/* NÚT BẤM HÀNH ĐỘNG HẤP DẪN */}
                    <motion.div variants={fadeInUpItem} className="action-row">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ width: "100%" }}
                      >
                        <Button
                          type="primary"
                          size="large"
                          icon={<ArrowRight size={18} />}
                          onClick={handleViewDetail}
                          className="btn-luxe-primary"
                        >
                          ĐỌC CHI TIẾT SỰ KIỆN
                        </Button>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* STYLESHEET DEDICATED MOTION */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

        .motion-popup-overlay {
          position: fixed;
          inset: 0;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Be Vietnam Pro', sans-serif;
        }

        .motion-backdrop-bg {
          position: absolute;
          inset: 0;
          background: rgba(11, 25, 44, 0.78);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .motion-modal-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 860px;
          background: ${primaryNavy};
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(212, 160, 23, 0.4);
          box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
        }

        /* Nút đóng tròn mờ */
        .motion-close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 30;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(11, 25, 44, 0.85);
          border: 1.5px solid ${accentGold};
          color: ${accentGold};
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        /* Loading */
        .motion-loading-box {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          color: #ffffff;
        }

        .spinner-icon {
          color: ${accentGold};
          animation: spinSlow 1.5s linear infinite;
        }

        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-badge {
          background: rgba(212, 160, 23, 0.15);
          border: 1px solid ${accentGold};
          color: ${accentGold};
          padding: 4px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        /* Layout 2 cột Desktop */
        .motion-card-layout {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          min-height: 460px;
        }

        .card-media-banner {
          position: relative;
          overflow: hidden;
          min-height: 100%;
        }

        .banner-image-bg {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }

        .media-gradient-shading {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(11, 25, 44, 0) 60%, ${primaryNavy} 100%),
                      linear-gradient(180deg, rgba(11, 25, 44, 0.3) 0%, rgba(11, 25, 44, 0.8) 100%);
        }

        .floating-top-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 5;
        }

        .luxe-gold-badge {
          background: rgba(11, 25, 44, 0.8) !important;
          border: 1px solid ${accentGold} !important;
          color: ${accentGold} !important;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 10px;
          letter-spacing: 1px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          backdrop-filter: blur(8px);
        }

        .flame-icon {
          color: #f59e0b;
        }

        /* Cột nội dung */
        .card-content-body {
          padding: 40px 36px 36px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .meta-tag-bar {
          margin-bottom: 12px;
        }

        .sacred-category-pill {
          background: rgba(212, 160, 23, 0.15) !important;
          border: 1px solid ${accentGold} !important;
          color: ${accentGold} !important;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          letter-spacing: 0.5px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .luxe-title {
          font-family: 'Playfair Display', Georgia, serif;
          color: #ffffff;
          font-size: clamp(22px, 3.2vw, 28px);
          font-weight: 800;
          line-height: 1.3;
          margin: 0 0 14px 0;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        .meta-info-pills {
          display: flex;
          gap: 16px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .pill-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #94a3b8;
          font-size: 12.5px;
          font-weight: 600;
        }

        .pill-icon {
          color: ${accentGold};
        }

        .luxe-desc {
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.65;
          margin-bottom: 28px;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Nút bấm primary Vàng Kim */
        .btn-luxe-primary {
          background: ${accentGold} !important;
          border-color: ${accentGold} !important;
          color: ${primaryNavy} !important;
          height: 50px !important;
          border-radius: 25px !important;
          font-weight: 800 !important;
          font-size: 14px !important;
          letter-spacing: 0.5px;
          box-shadow: 0 8px 20px rgba(212, 160, 23, 0.35) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          width: 100%;
        }

        .btn-luxe-primary:hover {
          background: #f0be3d !important;
          border-color: #f0be3d !important;
        }

        /* Responsive Mobile */
        @media (max-width: 768px) {
          .motion-modal-card {
            max-width: 100%;
            border-radius: 20px;
          }

          .motion-card-layout {
            grid-template-columns: 1fr;
          }

          .card-media-banner {
            height: 200px;
          }

          .card-content-body {
            padding: 24px 20px 24px 20px;
          }

          .luxe-title {
            font-size: 20px;
          }

          .luxe-desc {
            font-size: 13px;
            -webkit-line-clamp: 3;
            margin-bottom: 20px;
          }

          .motion-close-btn {
            top: 12px;
            right: 12px;
            width: 36px;
            height: 36px;
          }
        }
      `,
        }}
      />
    </ConfigProvider>
  );
}
