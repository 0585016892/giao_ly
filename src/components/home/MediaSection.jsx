import React, { useState } from "react";
import { Col, Row, Tag, Skeleton, Modal } from "antd";
import { motion } from "framer-motion";
import { Sparkles, Clock, Play, Eye } from "lucide-react";

const MediaSection = ({ loading = false, mediaData = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const defaultMediaList = [
    {
      id: 1,
      title: "Khám phá Nhà Thờ Giáo Xứ Đồng Quan",
      views: "400",
      time: "Hôm qua",
      type: "Khám phá",
      videoUrl: "https://www.youtube.com/embed/pQa2MalveRk?si=eXjoM1ypuEli-i4B", // Thay link embed thật của bạn vào đây
      desc: "Khám phá Nhà Thờ Giáo Xứ Đồng Quan - Giáo Phận Thái Bình | The History of Dong Quan Parish",
    },
    {
      id: 2,
      title:
        "Thánh lễ Mừng kính Chân phước Anrê Phú Yên Quan thầy xứ Đoàn TNTT giáo xứ Đồng Quan",
      views: "3.4K",
      time: "3 ngày trước",
      type: "Thánh lễ",
      videoUrl: "https://www.youtube.com/embed/JZ-dEW11a0I?si=MKqNr3SI3-n4w6RP",
      desc: "Thánh lễ Mừng kính Chân phước Anrê Phú Yên Quan thầy xứ Đoàn TNTT giáo xứ Đồng Quan",
    },
    {
      id: 3,
      title:
        "GIÁO XỨ ĐỒNG QUAN GIÁO PHẬN THÁI BÌNH Thánh lễ Chính tiệc tuần chầu lượt thay mặt Giáo phận năm 2026",
      views: "850",
      time: "1 tuần trước",
      type: "Sự kiện",
      videoUrl: "https://www.youtube.com/embed/0VptJagIoxU?si=F1T6mT329EnpYL7a",
      desc: "GIÁO XỨ ĐỒNG QUAN GIÁO PHẬN THÁI BÌNH Thánh lễ Chính tiệc tuần chầu lượt thay mặt Giáo phận năm 2026",
    },
  ];

  const listToDisplay = mediaData.length > 0 ? mediaData : defaultMediaList;

  const handleOpenModal = (item) => {
    setSelectedVideo(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <Col xs={24} lg={24} style={{ width: "100%", maxWidth: "100%" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .gx-media-section-wrapper {
              font-family: 'Be Vietnam Pro', sans-serif;
              width: 100%;
              max-width: 100%;
              padding: 10px 0;
              box-sizing: border-box;
            }

            .gx-media-section-wrapper *, .gx-media-section-wrapper *::before, .gx-media-section-wrapper *::after {
              box-sizing: border-box;
            }

            .gx-media-section-wrapper .ant-row {
              margin-left: 0 !important;
              margin-right: 0 !important;
              width: 100% !important;
            }

            .gx-media-header {
              margin-bottom: 24px;
            }

            .gx-media-subtitle {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1.5px;
              color: #d4af37;
              text-transform: uppercase;
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .gx-media-subtitle::before, .gx-media-subtitle::after {
              content: "";
              display: inline-block;
              width: 24px;
              height: 1px;
              background-color: #d4af37;
              opacity: 0.6;
            }

            .gx-media-title {
              font-family: 'Playfair Display', serif, sans-serif;
              font-size: clamp(26px, 3.5vw, 36px);
              font-weight: 700;
              color: #0f172a;
              margin: 0 0 6px 0;
              line-height: 1.2;
            }

            .gx-media-desc {
              font-size: 14px;
              color: #64748b;
              margin: 0;
            }

            /* Card thiết kế mới sang trọng, sáng sủa */
            .gx-media-card-item {
              background: #ffffff;
              border-radius: 18px;
              overflow: hidden;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
              display: flex;
              flex-direction: column;
              height: 100%;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
              width: 100%;
            }

            .gx-media-card-item:hover {
              border-color: #d4af37;
              box-shadow: 0 12px 32px rgba(212, 175, 55, 0.15);
              transform: translateY(-5px);
            }

            .gx-media-thumbnail {
              width: 100%;
              height: 190px;
              background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
            }

            /* Hiệu ứng ánh sáng sang trọng khi hover */
            .gx-media-thumbnail::after {
              content: "";
              position: absolute;
              inset: 0;
              background: linear-gradient(to top, rgba(15, 23, 42, 0.6), transparent);
            }

            .gx-play-btn-overlay {
              width: 52px;
              height: 52px;
              background: #d4af37;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #0f172a;
              box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
              transition: all 0.3s ease;
              z-index: 3;
            }

            .gx-media-card-item:hover .gx-play-btn-overlay {
              transform: scale(1.12);
              background: #ffffff;
            }

            .gx-media-tag-float {
              position: absolute;
              top: 14px;
              left: 14px;
              background: rgba(255, 255, 255, 0.9) !important;
              backdrop-filter: blur(4px);
              color: #0f172a !important;
              border: none !important;
              font-size: 11px !important;
              font-weight: 700 !important;
              border-radius: 20px !important;
              padding: 3px 12px !important;
              margin: 0 !important;
              z-index: 3;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .gx-media-info-box {
              padding: 22px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              flex: 1;
            }

            .gx-media-item-title {
              font-size: 16px;
              font-weight: 700;
              color: #0f172a;
              margin: 0 0 14px 0;
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              word-break: break-word;
              transition: color 0.2s;
            }

            .gx-media-card-item:hover .gx-media-item-title {
              color: #d4af37;
            }

            .gx-media-meta-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 12.5px;
              color: #64748b;
              border-top: 1px dashed #e2e8f0;
              padding-top: 14px;
              margin-top: auto;
            }

            .gx-media-time-info {
              display: flex;
              align-items: center;
              gap: 5px;
            }

            /* Custom Modal Styling */
            .gx-custom-video-modal .ant-modal-content {
              background: #0f172a;
              border-radius: 20px;
              padding: 24px;
              color: #ffffff;
              border: 1px solid rgba(212, 175, 55, 0.3);
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            }

            .gx-custom-video-modal .ant-modal-close {
              color: #94a3b8;
            }
            .gx-custom-video-modal .ant-modal-close:hover {
              color: #d4af37;
            }
          `,
        }}
      />

      <div className="gx-media-section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="gx-media-header">
            <span className="gx-media-subtitle">
              <Sparkles size={14} /> Truyền thông & Thánh ca
            </span>
            <h2 className="gx-media-title">Góc tâm tình & Video</h2>
            <p className="gx-media-desc">
              Cập nhật các Thánh lễ trực tuyến, tuyển tập thánh ca và sự kiện
              giáo xứ.
            </p>
          </div>

          {loading ? (
            <Row gutter={[24, 24]}>
              {[1, 2, 3].map((_, idx) => (
                <Col xs={24} md={8} key={idx} style={{ padding: "12px" }}>
                  <div
                    style={{
                      background: "#fff",
                      padding: 20,
                      borderRadius: 18,
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <Skeleton.Image
                      active
                      style={{
                        width: "100%",
                        height: 190,
                        borderRadius: 12,
                        marginBottom: 16,
                      }}
                    />
                    <Skeleton
                      active
                      paragraph={{ rows: 2 }}
                      title={{ width: "80%" }}
                    />
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Row gutter={[24, 24]}>
              {listToDisplay.map((item, idx) => (
                <Col
                  xs={24}
                  md={8}
                  key={item.id || idx}
                  style={{ padding: "12px" }}
                >
                  <motion.div
                    className="gx-media-card-item"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    onClick={() => handleOpenModal(item)}
                  >
                    <div className="gx-media-thumbnail">
                      <Tag className="gx-media-tag-float">{item.type}</Tag>
                      <div className="gx-play-btn-overlay">
                        <Play
                          size={22}
                          fill="#0f172a"
                          style={{ marginLeft: 2 }}
                        />
                      </div>
                    </div>
                    <div className="gx-media-info-box">
                      <h4 className="gx-media-item-title">{item.title}</h4>
                      <div className="gx-media-meta-row">
                        <span className="gx-media-time-info">
                          <Clock size={13} /> {item.time}
                        </span>
                        <span>
                          <Eye
                            size={13}
                            style={{ display: "inline", marginRight: 4 }}
                          />{" "}
                          {item.views} lượt xem
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          )}
        </motion.div>
      </div>

      {/* MODAL XEM VIDEO */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={750}
        className="gx-custom-video-modal"
        destroyOnClose
      >
        {selectedVideo && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {/* Khung chứa Video (Iframe hoặc Video Player) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                paddingBottom: "56.25%", // Tỉ lệ 16:9 chuẩn
                borderRadius: "12px",
                overflow: "hidden",
                background: "#000",
              }}
            >
              <iframe
                src={
                  selectedVideo.videoUrl ||
                  "https://www.youtube.com/embed/dQw4w9WgXcQ"
                }
                title={selectedVideo.title}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Thông tin chi tiết trong Modal */}
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "8px",
                }}
              >
                <Tag color="gold" style={{ fontWeight: 700, borderRadius: 10 }}>
                  {selectedVideo.type}
                </Tag>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  <Clock
                    size={12}
                    style={{ display: "inline", marginRight: 4 }}
                  />{" "}
                  {selectedVideo.time} · {selectedVideo.views} lượt xem
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "20px",
                  fontWeight: 700,
                  color: "#ffffff",
                  margin: "0 0 8px 0",
                }}
              >
                {selectedVideo.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#cbd5e1",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {selectedVideo.desc ||
                  "Thưởng thức video trực tuyến và các thánh ca đặc sắc từ cộng đoàn giáo xứ."}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </Col>
  );
};

export default MediaSection;
