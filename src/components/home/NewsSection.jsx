import React, { useState } from "react";
import { Col, Skeleton } from "antd";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Calendar,
  ArrowRight,
  Clock,
  ImageOff,
} from "lucide-react";

const NewsSection = ({
  loadingEvents,
  featuredEvent,
  listEvents,
  navigate,
  staggerContainer,
  fadeInUp,
}) => {
  // State quản lý lỗi load ảnh cho từng item
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <Col xs={24} lg={24}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .gx-news-section-wrapper {
              display: flex;
              flex-direction: column;
              gap: 24px;
              width: 100%;
              font-family: 'Be Vietnam Pro', sans-serif;
            }

            /* HEADER SECTION */
            .gx-news-header-flex {
              display: flex;
              flex-direction: column;
              gap: 12px;
              align-items: flex-start;
              justify-content: space-between;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 16px;
            }

            @media (min-width: 768px) {
              .gx-news-header-flex {
                flex-direction: row;
                align-items: flex-end;
              }
            }

            .gx-news-subtitle-tag {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1px;
              color: #d4af37;
              text-transform: uppercase;
              margin-bottom: 4px;
              display: block;
            }

            .gx-news-main-title {
              font-family: 'Playfair Display', serif, sans-serif;
              font-size: clamp(24px, 3vw, 32px);
              font-weight: 700;
              color: #1b365d;
              margin: 0 !important;
              line-height: 1.2;
            }

            .gx-news-view-all {
              font-size: 13px;
              font-weight: 600;
              color: #1b365d;
              background: transparent;
              border: none;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              padding: 0;
              transition: color 0.2s, gap 0.2s;
            }

            .gx-news-view-all:hover {
              color: #d4af37;
              gap: 8px;
            }

            /* GRID LAYOUT */
            .gx-news-content-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
            }

            @media (min-width: 992px) {
              .gx-news-content-grid {
                grid-template-columns: 1.3fr 1fr;
                align-items: start;
              }
            }

            /* FEATURED CARD (LEFT) */
            .gx-news-hero-card {
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
              box-shadow: 0 10px 30px -5px rgba(27, 54, 93, 0.05);
              cursor: pointer;
              display: flex;
              flex-direction: column;
              height: 100%;
              transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .gx-news-hero-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 16px 36px -8px rgba(27, 54, 93, 0.1);
              border-color: #cbd5e1;
            }

            .news-hero-img-box {
              position: relative;
              width: 100%;
              height: 300px;
              overflow: hidden;
              background: #f1f5f9;
            }

            @media (min-width: 768px) {
              .news-hero-img-box {
                height: 340px;
              }
            }

            .news-hero-img-box img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .gx-news-hero-card:hover .news-hero-img-box img {
              transform: scale(1.04);
            }

            .news-img-fallback {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              background: #f8fafc;
              color: #94a3b8;
              gap: 8px;
              font-size: 12px;
              font-weight: 500;
            }

            .news-hero-date-tag {
              position: absolute;
              top: 16px;
              left: 16px;
              background: rgba(27, 54, 93, 0.85);
              backdrop-filter: blur(8px);
              color: #ffffff;
              padding: 6px 12px;
              border-radius: 30px;
              font-size: 11px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 6px;
              border: 1px solid rgba(255, 255, 255, 0.15);
              z-index: 2;
            }

            .news-hero-content {
              padding: 24px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              flex: 1;
              background: #ffffff;
            }

            .news-category-badge {
              display: inline-flex;
              align-items: center;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              color: #d4af37;
              background: rgba(212, 175, 55, 0.1);
              padding: 4px 10px;
              border-radius: 6px;
              width: fit-content;
              margin-bottom: 12px;
              border: 1px solid rgba(212, 175, 55, 0.2);
            }

            .news-hero-title {
              font-family: 'Playfair Display', serif, sans-serif;
              font-size: clamp(18px, 2.2vw, 22px);
              font-weight: 700;
              color: #1b365d;
              line-height: 1.4;
              margin: 0 0 10px 0;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .news-hero-excerpt {
              font-size: 13px;
              color: #64748b;
              line-height: 1.6;
              margin: 0 0 20px 0;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              overflow: hidden;
            }

            .news-read-more-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              font-weight: 700;
              color: #1b365d;
              transition: gap 0.2s ease, color 0.2s ease;
            }

            .gx-news-hero-card:hover .news-read-more-btn {
              gap: 10px;
              color: #d4af37;
            }

            /* SUB NEWS LIST (RIGHT) */
            .gx-sub-news-list {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .gx-sub-news-item {
              background: #ffffff;
              border-radius: 16px;
              padding: 14px 16px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 16px;
              transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .gx-sub-news-item:hover {
              border-color: #cbd5e1;
              box-shadow: 0 8px 24px rgba(27, 54, 93, 0.06);
              transform: translateX(4px);
            }

            .sub-news-img-box {
              width: 90px;
              height: 80px;
              border-radius: 12px;
              overflow: hidden;
              flex-shrink: 0;
              background: #f1f5f9;
            }

            @media (min-width: 576px) {
              .sub-news-img-box {
                width: 100px;
                height: 85px;
              }
            }

            .sub-news-img-box img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.5s ease;
            }

            .gx-sub-news-item:hover .sub-news-img-box img {
              transform: scale(1.08);
            }

            .sub-news-info {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              min-width: 0;
            }

            .sub-news-date {
              font-size: 11px;
              font-weight: 600;
              color: #64748b;
              display: flex;
              align-items: center;
              gap: 4px;
              margin-bottom: 4px;
            }

            .sub-news-title {
              font-size: 13.5px;
              font-weight: 700;
              color: #1e293b;
              line-height: 1.4;
              margin: 0;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              transition: color 0.2s ease;
            }

            .gx-sub-news-item:hover .sub-news-title {
              color: #1b365d;
            }
          `,
        }}
      />

      <motion.div
        className="gx-news-section-wrapper"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        {/* Header Phân Mục */}
        <div className="gx-news-header-flex">
          <div>
            <span className="gx-news-subtitle-tag">— TIN TỨC & SỰ KIỆN —</span>
            <h2 className="gx-news-main-title">Tin tức & Sự kiện</h2>
          </div>
          <button
            type="button"
            className="gx-news-view-all"
            onClick={() => navigate("/tin-tuc")}
          >
            Xem tất cả tin tức <ChevronRight size={16} />
          </button>
        </div>

        {/* Bố cục lưới Chia Trái (Nổi bật) - Phải (Danh sách) */}
        <div className="gx-news-content-grid">
          {/* Cột Trái: Bài tin nổi bật */}
          {loadingEvents || !featuredEvent ? (
            <div
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 20,
                border: "1px solid #e2e8f0",
                height: "100%",
              }}
            >
              <Skeleton active avatar paragraph={{ rows: 5 }} />
            </div>
          ) : (
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="gx-news-hero-card"
              onClick={() =>
                navigate(
                  featuredEvent.slug
                    ? `/su-kien/${featuredEvent.slug}`
                    : `/tin-tuc/${featuredEvent.id}`,
                )
              }
            >
              <div className="news-hero-img-box">
                {imageErrors[`featured-${featuredEvent.id || "hero"}`] ? (
                  <div className="news-img-fallback">
                    <ImageOff size={24} />
                    <span>Không có ảnh</span>
                  </div>
                ) : (
                  <img
                    src={featuredEvent.image}
                    alt={featuredEvent.title}
                    loading="lazy"
                    onError={() =>
                      handleImageError(`featured-${featuredEvent.id || "hero"}`)
                    }
                  />
                )}
                <div className="news-hero-date-tag">
                  <Calendar size={13} />
                  <span>
                    {featuredEvent.fullDate ||
                      `${featuredEvent.day}/${featuredEvent.month}`}
                  </span>
                </div>
              </div>
              <div className="news-hero-content">
                <div>
                  <span className="news-category-badge">SỰ KIỆN MỚI</span>
                  <h3 className="news-hero-title" title={featuredEvent.title}>
                    {featuredEvent.title}
                  </h3>
                  <p className="news-hero-excerpt">{featuredEvent.excerpt}</p>
                </div>
                <span className="news-read-more-btn">
                  Đọc bài viết <ArrowRight size={16} />
                </span>
              </div>
            </motion.div>
          )}

          {/* Cột Phải: Danh sách tin nhỏ */}
          <div className="gx-sub-news-list">
            {loadingEvents ? (
              <>
                <div
                  style={{
                    background: "#fff",
                    padding: 14,
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </div>
                <div
                  style={{
                    background: "#fff",
                    padding: 14,
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </div>
                <div
                  style={{
                    background: "#fff",
                    padding: 14,
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Skeleton active avatar paragraph={{ rows: 2 }} />
                </div>
              </>
            ) : (
              listEvents.map((item) => (
                <motion.div
                  key={item.id}
                  variants={fadeInUp}
                  whileHover={{ x: 6 }}
                  className="gx-sub-news-item"
                  onClick={() =>
                    navigate(
                      item.slug
                        ? `/su-kien/${item.slug}`
                        : `/tin-tuc/${item.id}`,
                    )
                  }
                >
                  <div className="sub-news-img-box">
                    {imageErrors[`sub-${item.id}`] ? (
                      <div className="news-img-fallback">
                        <ImageOff size={18} />
                      </div>
                    ) : (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        onError={() => handleImageError(`sub-${item.id}`)}
                      />
                    )}
                  </div>
                  <div className="sub-news-info">
                    <span className="sub-news-date">
                      <Clock size={12} /> {item.fullDate || item.date}
                    </span>
                    <h4 className="sub-news-title" title={item.title}>
                      {item.title}
                    </h4>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </Col>
  );
};

export default NewsSection;
