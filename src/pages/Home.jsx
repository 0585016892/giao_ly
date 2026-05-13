import React from 'react';
import { Row, Col, Card, Typography, Button, Carousel, Badge, ConfigProvider } from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  HeartOutlined,
  MailOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Paragraph ,Text} = Typography;

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
};

function Home() {
  const navigate = useNavigate();
  const primaryGold = "#b39164"; 
  const deepBrown = "#5d4037";
  const softCream = "#fcfaf2";

  const slides = [
    {
      title: "Chuẩn bị bước vào đời sống Hôn nhân Kitô giáo",
      sub: "Hành trình xây dựng nền móng vững chắc cho gia đình tương lai trên đá tảng là Đức Kitô.",
      img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2000",
    },
    {
      title: "Đồng hành cùng Giáo xứ Đồng Quan",
      sub: "Nơi kết nối yêu thương, sẻ chia đức tin và nhận lãnh hồng ân Thiên Chúa.",
      img: "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&q=80&w=2000",
    }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="glhn-home-wrapper">
        
        {/* 1. HERO SECTION */}
        <div className="glhn-hero-container">
          <Carousel autoplay effect="fade" speed={1500} dots={{ className: 'glhn-dots' }}>
            {slides.map((slide, index) => (
              <div key={index}>
                <div className="glhn-slide-item" style={{ backgroundImage: `url(${slide.img})` }}>
                  <div className="glhn-slide-overlay" />
                  
                  <motion.div 
                    initial="initial"
                    whileInView="animate"
                    variants={staggerContainer}
                    className="glhn-slide-content"
                  >
                    <motion.div variants={fadeInUp}>
                      <Badge 
                        count="Niên khóa 2026" 
                        style={{ backgroundColor: primaryGold, marginBottom: '16px', border: 'none' }} 
                      />
                    </motion.div>
                    
                    <motion.div variants={fadeInUp}>
                      <Title className="glhn-hero-title">
                        {slide.title}
                      </Title>
                    </motion.div>
                    
                    <motion.div variants={fadeInUp}>
                      <Paragraph className="glhn-hero-sub">
                        {slide.sub}
                      </Paragraph>
                    </motion.div>

                    <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="primary"
                        size="large"
                        className="glhn-hero-btn"
                        onClick={() => navigate("/courses")}
                      >
                        BẮT ĐẦU HÀNH TRÌNH
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* 2. CHỨC NĂNG CHÍNH */}
        <div className="glhn-features-section">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <Title level={2} className="glhn-section-title">Công cụ cho đôi bạn</Title>
            <div className="glhn-title-line" />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="glhn-max-width"
          >
            <Row gutter={[20, 20]}>
              {[
                { icon: <BookOutlined />, title: "Lộ trình học", path: "/courses" },
                { icon: <HeartOutlined />, title: "Kinh nguyện", path: "/prayers" },
                { icon: <FileTextOutlined />, title: "Thư viện số", path: "/docs" },
                { icon: <MailOutlined />, title: "Ghi danh", path: "/contact" }
              ].map((item, idx) => (
                <Col xs={24} sm={12} md={6} key={idx}>
                  <motion.div variants={fadeInUp} whileHover={{ y: -8 }}>
                    <Card
                      hoverable
                      className="glhn-feature-card"
                      onClick={() => navigate(item.path)}
                    >
                      <div className="glhn-feature-icon">{item.icon}</div>
                      <Title level={4} style={{ color: deepBrown, marginBottom: 8 }}>{item.title}</Title>
                      <Text style={{ color: primaryGold, fontWeight: 600 }}>Khám phá ngay →</Text>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </div>

        {/* 3. PARALLAX / QUOTE SECTION */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="glhn-quote-section"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="glhn-max-width"
            style={{ textAlign: 'center' }}
          >
            <Title level={2} className="glhn-quote-text">
              "Sự gì Thiên Chúa đã phối hợp, loài người không được phân ly." (Mt 19,6)
            </Title>
            <Paragraph className="glhn-quote-sub">
              Hãy để chúng tôi đồng hành cùng bạn trong những bước chân đầu tiên của đời sống hôn nhân.
            </Paragraph>
            <Button 
              type="primary" 
              size="large" 
              className="glhn-quote-btn"
              onClick={() => navigate("/contact")}
            >
              ĐĂNG KÝ GHI DANH
            </Button>
          </motion.div>
        </motion.div>

        <style dangerouslySetInnerHTML={{ __html: `
          .glhn-home-wrapper { background-color: ${softCream}; }
          .glhn-max-width { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          
          /* Hero Slider */
          .glhn-hero-container { padding: 10px; }
          .glhn-slide-item {
            height: 600px;
            position: relative;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 24px;
            display: flex;
            align-items: center;
          }
          .glhn-slide-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(to right, rgba(62, 39, 35, 0.9) 0%, rgba(62, 39, 35, 0.3) 100%);
            border-radius: 24px;
          }
          .glhn-slide-content { position: relative; z-index: 2; padding: 0 60px; max-width: 800px; }
          .glhn-hero-title { color: white !important; font-size: 48px !important; font-weight: 800 !important; margin-bottom: 20px !important; }
          .glhn-hero-sub { color: rgba(255,255,255,0.8) !important; font-size: 18px !important; margin-bottom: 32px !important; }
          .glhn-hero-btn { height: 50px; padding: 0 35px; border-radius: 12px; font-weight: 700; background: ${primaryGold}; border: none; }

          /* Features */
          .glhn-features-section { padding: 80px 0; }
          .glhn-section-title { color: ${deepBrown} !important; margin-bottom: 8px !important; }
          .glhn-title-line { width: 50px; height: 3px; background: ${primaryGold}; margin: 0 auto; border-radius: 2px; }
          .glhn-feature-card { border-radius: 20px; border: 1px solid rgba(179, 145, 100, 0.15); text-align: center; }
          .glhn-feature-icon { font-size: 40px; color: ${primaryGold}; margin-bottom: 16px; }

          /* Quote Section */
          .glhn-quote-section {
            margin: 40px 20px 80px;
            padding: 100px 20px;
            background: linear-gradient(rgba(62, 39, 35, 0.85), rgba(62, 39, 35, 0.85)), url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070') center/cover fixed;
            border-radius: 32px;
          }
          .glhn-quote-text { color: white !important; font-style: italic; font-size: 32px !important; margin-bottom: 16px !important; }
          .glhn-quote-sub { color: rgba(255,255,255,0.7) !important; font-size: 16px !important; margin-bottom: 30px !important; }
          .glhn-quote-btn { height: 50px; padding: 0 40px; border-radius: 25px; background: ${primaryGold}; border: none; font-weight: 700; }

          /* MOBILE RESPONSIVE */
          @media (max-width: 992px) {
            .glhn-hero-title { font-size: 36px !important; }
            .glhn-slide-item { height: 500px; }
          }

          @media (max-width: 768px) {
            .glhn-slide-content { padding: 0 30px; text-align: center; }
            .glhn-hero-title { font-size: 28px !important; }
            .glhn-hero-sub { font-size: 15px !important; }
            .glhn-quote-text { font-size: 22px !important; }
            .glhn-features-section { padding: 50px 0; }
            .glhn-quote-section { padding: 60px 20px; border-radius: 20px; margin: 20px 10px 40px; }
          }
          
          .ant-carousel .slick-dots.glhn-dots li button { background: #fff; opacity: 0.4; }
          .ant-carousel .slick-dots.glhn-dots li.slick-active button { background: ${primaryGold}; opacity: 1; }
        `}} />
      </div>
    </ConfigProvider>
  );
}

export default Home;