import React, { useRef, useState } from "react";
import { Button, Carousel, Spin } from "antd";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const primaryNavy = "#0F2342";
const accentGold = "#D4AF37";

const HeroBanner = ({ slides = [], loading = false, apiUrl = "" }) => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  const handleButtonClick = (link) => {
    if (!link) {
      navigate("/gioi-thieu");
      return;
    }

    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
      return;
    }

    navigate(link);
  };

  return (
    <section className="gx-hero-banner">
      {loading ? (
        <div className="gx-hero-loading">
          <Spin size="large" tip="Đang tải hình ảnh Giáo xứ..." />
        </div>
      ) : (
        <div className="gx-carousel-wrapper">
          {/* CUSTOM PREV / NEXT ARROWS */}
          <button
            className="gx-carousel-arrow gx-arrow-prev"
            onClick={() => carouselRef.current?.prev()}
            aria-label="Previous Slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="gx-carousel-arrow gx-arrow-next"
            onClick={() => carouselRef.current?.next()}
            aria-label="Next Slide"
          >
            <ChevronRight size={22} />
          </button>

          <Carousel
            ref={carouselRef}
            autoplay
            effect="fade"
            autoplaySpeed={6000}
            pauseOnHover={false}
            dots={{ className: "gx-hero-dots" }}
            beforeChange={(_, next) => setActiveSlideIdx(next)}
          >
            {slides.map((slide, idx) => {
              const imageUrl = slide.image?.startsWith("http")
                ? slide.image
                : `${apiUrl}${slide.image}`;

              return (
                <div key={slide.id || idx}>
                  <div className="gx-hero-slide">
                    {/* BACKGROUND IMAGE */}
                    <img
                      src={imageUrl}
                      alt={slide.title || "Giáo xứ Đồng Quan"}
                      className="gx-hero-image"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />

                    {/* DARK OVERLAY */}
                    <div className="gx-hero-overlay" />

                    {/* CONTENT */}
                    <div className="gx-hero-content">
                      <div className="gx-container">
                        <AnimatePresence mode="wait">
                          {activeSlideIdx === idx && (
                            <motion.div
                              key={slide.id || idx}
                              className="gx-hero-text"
                              initial={{ opacity: 0, y: 30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                              <span className="gx-hero-welcome">
                                Chào mừng đến với
                              </span>

                              <h1>{slide.title || "GIÁO XỨ ĐỒNG QUAN"}</h1>

                              <p>
                                {slide.subtitle ||
                                  "Nơi quy tụ cộng đoàn dân Chúa trong đức tin, tình yêu và sự phục vụ."}
                              </p>

                              <div className="gx-hero-actions">
                                <Button
                                  className="gx-hero-primary-btn"
                                  onClick={() => navigate("/lich-phung-vu")}
                                >
                                  XEM LỊCH LỄ
                                </Button>

                                <Button
                                  className="gx-hero-secondary-btn"
                                  onClick={() => handleButtonClick(slide.link)}
                                >
                                  KHÁM PHÁ GIÁO XỨ
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      )}

      {/* WAVE BOTTOM SHAPE WITH GOLDEN ACCENT */}
      <div className="gx-wave-bottom">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Sóng viền vàng */}
          <path
            d="M0,32 C360,110 1080,-40 1440,32 L1440,120 L0,120 Z"
            fill="none"
            stroke={accentGold}
            strokeWidth="3"
          />
          {/* Sóng màu trắng che nền dưới */}
          <path
            d="M0,35 C360,113 1080,-37 1440,35 L1440,120 L0,120 Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>

      <style>{`
        .gx-hero-banner {
          position: relative;
          width: 100%;
          height: min(780px, calc(100vh - 80px));
          min-height: 600px;
          overflow: hidden;
          background: ${primaryNavy};
        }

        .gx-carousel-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .gx-hero-loading {
          width: 100%;
          height: 100%;
          min-height: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${primaryNavy};
        }

        .gx-hero-loading .ant-spin-text {
          color: white !important;
        }

        .gx-hero-banner .ant-carousel,
        .gx-hero-banner .slick-slider,
        .gx-hero-banner .slick-list,
        .gx-hero-banner .slick-track {
          height: 100%;
        }

        .gx-hero-slide {
          position: relative;
          width: 100%;
          height: min(780px, calc(100vh - 80px));
          min-height: 600px;
          overflow: hidden;
        }

        /* IMAGE */
        .gx-hero-image {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        /* OVERLAY GRADIENT */
        .gx-hero-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(
            circle at 70% 50%,
            rgba(15, 35, 66, 0.4) 0%,
            rgba(15, 35, 66, 0.88) 75%,
            rgba(15, 35, 66, 0.96) 100%
          );
        }

        /* CONTENT */
        .gx-hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          padding-bottom: 80px;
        }

        .gx-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 40px;
          width: 100%;
        }

        .gx-hero-text {
          max-width: 650px;
          text-align: center;
          margin: 0 auto;
        }

        /* WELCOME TEXT */
        .gx-hero-welcome {
          display: block;
          color: #ffffff;
          font-family: "Playfair Display", Georgia, serif;
          font-style: italic;
          font-size: clamp(20px, 2.5vw, 30px);
          font-weight: 400;
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        /* TITLE */
        .gx-hero-text h1 {
          margin: 0 0 16px;
          color: #ffffff;
          font-family: "Playfair Display", Georgia, serif;
          font-size: clamp(36px, 4.5vw, 64px);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .gx-hero-text p {
          max-width: 540px;
          margin: 0 auto 32px;
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          line-height: 1.6;
          font-weight: 400;
        }

        /* BUTTONS */
        .gx-hero-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .gx-hero-primary-btn {
          height: 48px !important;
          padding: 0 30px !important;
          border-radius: 6px !important;
          background: ${accentGold} !important;
          border: 1px solid ${accentGold} !important;
          color: ${primaryNavy} !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .gx-hero-primary-btn:hover {
          background: #c59f2e !important;
          border-color: #c59f2e !important;
          transform: translateY(-2px);
        }

        .gx-hero-secondary-btn {
          height: 48px !important;
          padding: 0 30px !important;
          border-radius: 6px !important;
          border: 1.5px solid rgba(255, 255, 255, 0.8) !important;
          background: rgba(15, 35, 66, 0.4) !important;
          color: #ffffff !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          letter-spacing: 0.5px;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease !important;
        }

        .gx-hero-secondary-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          border-color: #ffffff !important;
          color: #ffffff !important;
          transform: translateY(-2px);
        }

        /* ARROWS */
        .gx-carousel-arrow {
          position: absolute;
          top: 48%;
          transform: translateY(-50%);
          z-index: 10;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }

        .gx-carousel-arrow:hover {
          background: ${accentGold};
          color: ${primaryNavy};
          border-color: ${accentGold};
        }

        .gx-arrow-prev { left: 30px; }
        .gx-arrow-next { right: 30px; }

        /* DOTS */
        .gx-hero-dots {
          position: absolute !important;
          bottom: 75px !important;
          z-index: 5;
        }

        .gx-hero-dots li {
          width: 10px !important;
          height: 10px !important;
          margin: 0 4px !important;
        }

        .gx-hero-dots li button {
          width: 10px !important;
          height: 10px !important;
          border-radius: 50% !important;
          background: rgba(255, 255, 255, 0.4) !important;
          opacity: 1 !important;
        }

        .gx-hero-dots li.slick-active button {
          background: ${accentGold} !important;
          width: 24px !important;
          border-radius: 10px !important;
        }

        /* WAVE BOTTOM CONTAINER */
        .gx-wave-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          line-height: 0;
          z-index: 4;
          pointer-events: none;
        }

        .gx-wave-bottom svg {
          position: relative;
          display: block;
          width: 100%;
          height: 75px;
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .gx-hero-banner,
          .gx-hero-slide {
            height: 540px;
            min-height: 500px;
          }

          .gx-container {
            padding: 0 20px;
          }

          .gx-hero-content {
            padding-bottom: 60px;
          }

          .gx-hero-text p {
            font-size: 14px;
            margin-bottom: 24px;
          }

          .gx-hero-actions {
            flex-direction: column;
            width: 100%;
            gap: 10px;
          }

          .gx-hero-primary-btn,
          .gx-hero-secondary-btn {
            width: 100%;
            max-width: 280px;
            height: 44px !important;
          }

          .gx-carousel-arrow {
            width: 36px;
            height: 36px;
          }

          .gx-arrow-prev { left: 10px; }
          .gx-arrow-next { right: 10px; }

          .gx-wave-bottom svg {
            height: 45px;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
