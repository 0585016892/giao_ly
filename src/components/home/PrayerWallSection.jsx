import React, { useState } from "react";
import { Button, Modal, Form, Input, Select, message, Tag } from "antd";
import {
  MessageSquare,
  MessageSquarePlus,
  Sparkles,
  ThumbsUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "./PrayerWallSection.css";

const { TextArea } = Input;

const initialFeedbacks = [
  {
    id: 1,
    author: "Giuse Nguyễn Văn A",
    content:
      "Kính mong Hội đồng Giáo xứ xem xét gia tăng thêm quạt mát ở khu vực nhà khách vào các Thánh Lễ mùa hè.",
    type: "Cơ Sở Vật Chất",
    likes: 18,
    time: "3 giờ trước",
  },
  {
    id: 2,
    author: "Một Giáo Dân",
    content:
      "Đề xuất mở rộng thêm giờ sinh hoạt Giáo lý cho thiếu nhi vào sáng Chủ Nhật để thuận tiện việc đưa đón.",
    type: "Mục Vụ & Giáo Lý",
    likes: 32,
    time: "1 ngày trước",
  },
  {
    id: 3,
    author: "Maria T.",
    content:
      "Hệ thống âm thanh khu vực cuối nhà thờ hiện tại hơi nhỏ, mong Ban Hành Giáo kiểm tra điều chỉnh lại.",
    type: "Đóng Góp Chung",
    likes: 15,
    time: "2 ngày trước",
  },
];

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likedIds, setLikedIds] = useState([]);
  const [form] = Form.useForm();

  const handleLike = (id) => {
    if (likedIds.includes(id)) return;
    setLikedIds([...likedIds, id]);
    setFeedbacks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + 1 } : item,
      ),
    );
    message.success("Cảm ơn bạn đã ghi nhận đóng góp này!");
  };

  const handleSubmit = (values) => {
    const newFeedback = {
      id: Date.now(),
      author: values.author || "Ẩn danh",
      content: values.content,
      type: values.type,
      likes: 1,
      time: "Vừa xong",
    };
    setFeedbacks([newFeedback, ...feedbacks]);
    message.success("Ý kiến đóng góp của bạn đã được gửi thành công!");
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <motion.section
      className="gx-feedback-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="gx-container">
        {/* Banner Chính - Nền Trắng / Text Xanh */}
        <div className="gx-feedback-box">
          <div className="feedback-header-content">
            <span className="gx-section-subhead">
              <MessageSquare size={14} className="inline-icon" /> XÂY DỰNG CỘNG
              ĐOÀN
            </span>
            <h2>Hòm Thư Đóng Góp Ý Kiến</h2>
            <p>
              “Mỗi người trong anh em hãy dùng ân huệ Thiên Chúa đã ban mà phục
              vụ người khác.”
            </p>
          </div>
          <div className="feedback-actions">
            <Button
              type="primary"
              size="large"
              className="gx-btn-gold-lg"
              icon={<MessageSquarePlus size={18} />}
              onClick={() => setIsModalOpen(true)}
            >
              <span>Gửi Ý Kiến Đóng Góp</span>
            </Button>
          </div>
        </div>

        {/* Danh Sách Ý Kiến Mới Nhất */}
        <div className="feedback-feed-wrapper">
          <div className="feedback-feed-header">
            <h3>
              <Sparkles size={18} className="gold-text" /> Ý Kiến Đóng Góp Mới
              Nhất
            </h3>
          </div>

          <div className="feedback-grid">
            <AnimatePresence>
              {feedbacks.slice(0, 3).map((item) => {
                const isLiked = likedIds.includes(item.id);
                return (
                  <motion.div
                    key={item.id}
                    className="feedback-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="feedback-card-header">
                      <Tag className="feedback-tag">{item.type}</Tag>
                      <span className="feedback-time">{item.time}</span>
                    </div>

                    <p className="feedback-content">"{item.content}"</p>

                    <div className="feedback-card-footer">
                      <span className="feedback-author">{item.author}</span>
                      <Button
                        type="text"
                        className={`btn-agree ${isLiked ? "liked" : ""}`}
                        icon={
                          <ThumbsUp
                            size={15}
                            fill={isLiked ? "#c99718" : "none"}
                          />
                        }
                        onClick={() => handleLike(item.id)}
                      >
                        Đồng ý ({item.likes})
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal Light Theme Form */}
      <Modal
        title="Gửi Ý Kiến Đóng Góp Xây Dựng Giáo Xứ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        className="gx-feedback-modal"
        rootClassName="gx-feedback-modal-root"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Họ & Tên" name="author">
            <Input placeholder="Nhập tên của bạn (để trống nếu muốn gửi ẩn danh)" />
          </Form.Item>

          <Form.Item
            label="Lĩnh Vực Đóng Góp"
            name="type"
            rules={[
              { required: true, message: "Vui lòng chọn lĩnh vực đóng góp!" },
            ]}
            initialValue="Cơ Sở Vật Chất"
          >
            <Select popupClassName="gx-feedback-select-dropdown">
              <Select.Option value="Cơ Sở Vật Chất">
                Cơ Sở Vật Chất / Bãi Xe
              </Select.Option>
              <Select.Option value="Mục Vụ & Giáo Lý">
                Mục Vụ & Giáo Lý
              </Select.Option>
              <Select.Option value="Phụng Vụ & Âm Nhạc">
                Phụng Vụ & Âm Nhạc
              </Select.Option>
              <Select.Option value="Sự Kiện & Môi Trường">
                Sự Kiện & Môi Trường
              </Select.Option>
              <Select.Option value="Đóng Góp Chung">
                Đóng Góp Chung
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Nội Dung Đóng Góp"
            name="content"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung góp ý!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập chi tiết ý kiến hoặc đề xuất của bạn..."
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="gx-btn-gold-lg"
            >
              Gửi Đóng Góp
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </motion.section>
  );
};

export default FeedbackSection;
