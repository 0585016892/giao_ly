import React, { useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Carousel, Badge, ConfigProvider, Timeline, Statistic } from "antd";
import { BookOutlined, FileTextOutlined, HeartOutlined, MailOutlined, CheckCircleFilled, FireOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import file CSS của AOS
import Banner from '../assets/images/banner.png';

const { Title, Paragraph, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const softCream = "#fcfaf2";

  useEffect(() => {
    // Khởi tạo hiệu ứng AOS với cấu hình mượt
    AOS.init({
      duration: 1000,
      once: false, // Để hiệu ứng lặp lại khi cuộn lên/xuống
      mirror: true, // Ẩn đi khi cuộn quá
      offset: 100,
    });
  }, []);

  const slides = [
    { title: "Chuẩn bị bước vào đời sống Hôn nhân", sub: "Xây dựng nền móng gia đình trên đá tảng Đức Kitô.", img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2000" },
    { title: "Đồng hành cùng Giáo xứ Đồng Quan", sub: "Nơi kết nối yêu thương và nhận lãnh hồng ân.", img: Banner }
  ];

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="glhn-home-container">
        
        {/* 1. HERO - Giữ nguyên sự ổn định */}
        <section className="glhn-hero">
          <Carousel autoplay effect="fade" speed={1500}>
            {slides.map((slide, index) => (
              <div key={index}>
                <div className="glhn-hero-slide" style={{ backgroundImage: `url(${slide.img})` }}>
                  <div className="glhn-overlay" />
                  <div className="glhn-hero-content">
                    <Badge count="Niên khóa 2026" className="glhn-badge" />
                    <Title className="glhn-hero-title">{slide.title}</Title>
                    <Paragraph className="glhn-hero-sub">{slide.sub}</Paragraph>
                    <Button type="primary" size="large" onClick={() => navigate("/giao-ly/du-tong")} className="glhn-main-btn">BẮT ĐẦU NGAY</Button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        {/* 2. CHỨC NĂNG - Hiệu ứng trượt từ dưới lên */}
        <section className="glhn-section glhn-features" data-aos="fade-up">
          <div className="glhn-container">
            <div className="glhn-header-center">
              <Title level={2}>Công cụ học tập</Title>
              <div className="glhn-divider" />
            </div>
            <Row gutter={[24, 24]}>
              {[
                { icon: <BookOutlined />, title: "Lộ trình", path: "/courses", color: "#e67e22" },
                { icon: <HeartOutlined />, title: "Kinh nguyện", path: "/prayers", color: "#e74c3c" },
                { icon: <FileTextOutlined />, title: "Tài liệu", path: "/docs", color: "#27ae60" },
                { icon: <MailOutlined />, title: "Ghi danh", path: "/contact", color: "#2980b9" }
              ].map((item, i) => (
                <Col xs={12} md={6} key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
                  <Card hoverable className="glhn-card-modern" onClick={() => navigate(item.path)}>
                    <div className="glhn-icon-circle" style={{ color: item.color }}>{item.icon}</div>
                    <Title level={4}>{item.title}</Title>
                    <Text type="secondary">Khám phá →</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* 3. GIỚI THIỆU - Hiệu ứng hai bên đi vào */}
        <section className="glhn-section glhn-intro">
          <div className="glhn-container">
            <Row gutter={[60, 40]} align="middle">
              <Col xs={24} md={12} data-aos="fade-right">
                <div className="glhn-img-frame">
                  <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000" alt="intro" />
                </div>
              </Col>
              <Col xs={24} md={12} data-aos="fade-left">
                <Title level={2} style={{color: deepBrown}}>Ý nghĩa khóa học</Title>
                <Paragraph className="glhn-text-p">
                  Hôn nhân là một hành trình thánh thiêng. Chúng tôi cung cấp những kiến thức thực tế về tâm lý, 
                  pháp lý và đức tin để các bạn tự tin xây dựng tổ ấm.
                </Paragraph>
                <div className="glhn-list-item"><CheckCircleFilled /> Hiểu rõ Bí tích Hôn Phối</div>
                <div className="glhn-list-item"><CheckCircleFilled /> Kỹ năng xây dựng hạnh phúc</div>
                <div className="glhn-list-item"><CheckCircleFilled /> Giáo dục con cái theo Tin Mừng</div>
              </Col>
            </Row>
          </div>
        </section>

        {/* 4. THỐNG KÊ - Hiệu ứng hiện dần số */}
        <section className="glhn-section glhn-stats" style={{backgroundColor: '#fff'}}>
          <div className="glhn-container">
            <Row gutter={[32, 32]} justify="center">
              {[
                { label: 'Học viên', value: 1200, icon: <FireOutlined /> },
                { label: 'Bài học', value: 24, icon: <BookOutlined /> },
                { label: 'Giảng viên', value: 15, icon: <HeartOutlined /> }
              ].map((stat, i) => (
                <Col xs={12} md={6} key={i} data-aos="fade-up" data-aos-delay={i * 200}>
                  <div className="glhn-stat-box">
                    <Statistic title={stat.label} value={stat.value} prefix={stat.icon} />
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* 5. QUOTE - Parallax nhẹ nhàng */}
        <section className="glhn-quote-section" data-aos="zoom-out">
          <div className="glhn-quote-inner">
            <Title level={1}> “Người làm chồng, hãy yêu thương vợ, như chính Đức Ki-tô yêu thương Hội Thánh và hiến mình vì Hội Thánh” (Ep 5,25) </Title>
            <Paragraph>Hãy chuẩn bị tâm hồn thật tốt cho ngày trọng đại nhất cuộc đời.</Paragraph>
            <Button size="large" className="glhn-white-btn" onClick={() => navigate("/contact")}>GHI DANH NGAY</Button>
          </div>
        </section>

        <style dangerouslySetInnerHTML={{ __html: `
          .glhn-home-container { background: ${softCream}; }
          .glhn-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
          .glhn-section { padding: 80px 0; overflow: hidden; }
          
          /* Hero */
          .glhn-hero-slide { height: 700px; background: center/cover no-repeat; display: flex; align-items: center; position: relative; }
          .glhn-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.45); }
          .glhn-hero-content { position: relative; z-index: 10; padding: 0 10%; color: white; max-width: 900px; }
          .glhn-hero-title { color: white !important; font-size: 52px !important; font-weight: 800 !important; margin-bottom: 24px !important; }
          .glhn-hero-sub { color: #f0f0f0 !important; font-size: 20px !important; }
          .glhn-main-btn { height: 54px; padding: 0 40px; border-radius: 27px; font-weight: bold; font-size: 16px; border: none; }

          /* Cards */
          .glhn-card-modern { border-radius: 20px; text-align: center; border: none; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
          .glhn-card-modern:hover { transform: translateY(-12px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
          .glhn-icon-circle { font-size: 40px; margin-bottom: 15px; display: inline-block; padding: 20px; background: #fffcf5; border-radius: 50%; }

          /* Intro */
          .glhn-img-frame { position: relative; }
          .glhn-img-frame img { width: 100%; border-radius: 30px; box-shadow: 20px 20px 0px ${primaryGold}; }
          .glhn-list-item { margin-bottom: 15px; font-size: 16px; display: flex; align-items: center; gap: 10px; color: ${deepBrown}; font-weight: 500; }
          .anticon-check-circle-filled { color: ${primaryGold}; }

          /* Stats */
          .glhn-stat-box { background: white; padding: 30px; border-radius: 20px; text-align: center; }

          /* Quote Section */
          .glhn-quote-section { 
            padding: 120px 20px; 
            background: linear-gradient(rgba(179, 145, 100, 0.9), rgba(93, 64, 55, 0.9)), url('https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070') center/cover;
            text-align: center;
            color: white;
          }
          .glhn-quote-section h1 { color: white !important; font-family: 'Playfair Display', serif; font-style: italic; }
          .glhn-white-btn { height: 50px; padding: 0 40px; border-radius: 25px; background: white; border: none; color: ${deepBrown}; font-weight: bold; }
          .glhn-white-btn:hover { color: ${primaryGold} !important; }

          /* Mobile */
          @media (max-width: 768px) {
            .glhn-hero-title { font-size: 32px !important; }
            .glhn-section { padding: 50px 0; }
            .glhn-hero-slide { height: 500px; }
            .glhn-img-frame img { box-shadow: 10px 10px 0px ${primaryGold}; }
          }
        `}} />
      </div>
    </ConfigProvider>
  );
}

export default Home;