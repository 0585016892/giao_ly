import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Tag, Space, ConfigProvider, Divider, Empty } from 'antd';
import { 
  FilePdfOutlined, 
  FileWordOutlined, 
  DownloadOutlined, 
  BookOutlined, 
  InfoCircleOutlined,
  SolutionOutlined,
  CustomerServiceOutlined,
  CloudDownloadOutlined
} from '@ant-design/icons';

// --- PHẦN IMPORT TÀI LIỆU (Đảm bảo đúng đường dẫn trong assets/docs) ---
import DonXinHoc from '../assets/docs/DON-XIN-HOC-GIAO-LY-HON-NHAN.docx';
import ToKhaiHonPhoi from '../assets/docs/TỜ-KHAI-HÔN-PHỐI.docx';
// Bạn có thể import thêm các file khác tại đây
// import ToKhai from '../assets/docs/to-khai.pdf';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const DocumentsPage = () => {
  const documentCategories = [
    {
      title: "Thủ tục Hành chính",
      icon: <SolutionOutlined />,
      description: "Các mẫu đơn và danh mục giấy tờ cần thiết để chuẩn bị hồ sơ hôn phối.",
      items: [
        { 
          name: "Đơn xin học lớp Giáo lý Hôn nhân", 
          type: "DOCX", 
          size: "450 KB", 
          format: "doc", 
          fileSource: DonXinHoc 
        },
        { 
          name: "Tờ khai đăng ký kết hôn Công Giáo", 
          type: "PDF", 
          size: "1.2 MB", 
          format: "doc", 
          fileSource: ToKhaiHonPhoi // Thay bằng biến import khi có file thực tế
        },
        // { 
        //   name: "Hướng dẫn chuẩn bị giấy tờ", 
        //   type: "PDF", 
        //   size: "800 KB", 
        //   format: "pdf", 
        //   fileSource: "#" 
        // },
      ]
    },
   
    // {
    //   title: "Tài liệu Học tập",
    //   icon: <BookOutlined />,
    //   description: "Hệ thống kiến thức, thủ bản và các kinh nguyện quan trọng.",
    //   items: [
    //     { name: "Thủ bản Giáo lý Hôn nhân", type: "PDF", size: "12.5 MB", format: "pdf", fileSource: "#" },
    //     { name: "Sơ đồ tư duy 12 bài học", type: "PDF", size: "3.2 MB", format: "pdf", fileSource: "#" },
    //   ]
    // }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#8c734b',
          borderRadius: 14,
        },
      }}
    >
      <Layout className="docs-v2-root">
        <Content className="docs-v2-wrapper">
          <div className="docs-v2-container">
            
            {/* Header */}
            <div className="docs-v2-header">
              <Space className="docs-v2-badge">
                <CloudDownloadOutlined />
                <span>TRUNG TÂM TÀI LIỆU</span>
              </Space>
              <Title level={1} className="docs-v2-title">Tài Nguyên & Biểu Mẫu</Title>
              <div className="docs-v2-divider-center"></div>
              <Paragraph className="docs-v2-subtitle">
                Tải xuống các tài liệu hướng dẫn và biểu mẫu từ hệ thống thư viện Giáo lý.
              </Paragraph>
            </div>

            {/* Danh sách tài liệu */}
            {documentCategories.map((category, idx) => (
              <div key={idx} className="docs-v2-section">
                <div className="docs-v2-section-header">
                  <div className="docs-v2-section-icon">{category.icon}</div>
                  <div className="docs-v2-section-text">
                    <Title level={3} style={{ margin: 0, color: '#4a3728' }}>{category.title}</Title>
                    <Text type="secondary">{category.description}</Text>
                  </div>
                </div>
                
                <Row gutter={[24, 24]}>
                  {category.items.map((item, itemIdx) => (
                    <Col xs={24} md={12} lg={8} key={itemIdx}>
                      <Card bordered={false} className="docs-v2-card">
                        <div className="docs-v2-card-body">
                          <div className="docs-v2-file-type">
                            {item.format === 'pdf' ? 
                              <FilePdfOutlined className="icon-pdf" /> : 
                              <FileWordOutlined className="icon-word" />
                            }
                          </div>
                          <div className="docs-v2-file-content">
                            <Text strong className="docs-v2-file-name">{item.name}</Text>
                            <Space size={4} className="docs-v2-meta">
                              <Tag bordered={false} color={item.format === 'pdf' ? 'error' : 'processing'}>
                                {item.type}
                              </Tag>
                              <Text className="docs-v2-size">{item.size}</Text>
                            </Space>
                          </div>
                        </div>
                        
                        <Button 
                          type="primary" 
                          icon={<DownloadOutlined />} 
                          block 
                          className="docs-v2-download-btn"
                          href={item.fileSource} 
                          download={item.name}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Tải xuống ngay
                        </Button>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            ))}

            {/* Footer Note */}
            <Card className="docs-v2-footer-info">
              <Space align="start" size={16}>
                <div className="docs-v2-info-icon"><InfoCircleOutlined /></div>
                <div>
                  <Title level={5} style={{ margin: 0, color: '#8c734b' }}>Lưu ý dành cho đôi bạn</Title>
                  <Text type="secondary">
                    Nếu bạn không thể tải file hoặc link bị hỏng, vui lòng liên hệ Văn phòng Giáo xứ để được hỗ trợ.
                  </Text>
                </div>
              </Space>
            </Card>

          </div>
        </Content>

        <style dangerouslySetInnerHTML={{ __html: `
          .docs-v2-root { background: #fdfbf7; min-height: 100vh; }
          .docs-v2-wrapper { padding: 60px 20px; }
          .docs-v2-container { max-width: 1200px; margin: 0 auto; }
          .docs-v2-header { text-align: center; margin-bottom: 50px; }
          .docs-v2-badge { background: #fff; border: 1px solid #eaddca; color: #8c734b; padding: 6px 20px; border-radius: 50px; font-weight: 700; font-size: 12px; margin-bottom: 20px; }
          .docs-v2-title { font-size: 36px !important; font-weight: 800 !important; color: #262626 !important; }
          .docs-v2-divider-center { width: 50px; height: 3px; background: #8c734b; margin: 15px auto; }
          .docs-v2-subtitle { font-size: 16px; color: #777; }
          .docs-v2-section { margin-bottom: 40px; }
          .docs-v2-section-header { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
          .docs-v2-section-icon { font-size: 24px; color: #8c734b; }
          .docs-v2-card { border-radius: 16px !important; border: 1px solid #f6f1e8 !important; transition: all 0.3s; }
          .docs-v2-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(140, 115, 75, 0.1); }
          .docs-v2-card-body { display: flex; gap: 12px; margin-bottom: 20px; min-height: 60px; }
          .docs-v2-file-type { font-size: 35px; }
          .icon-pdf { color: #ff4d4f; }
          .icon-word { color: #1890ff; }
          .docs-v2-file-name { font-size: 15px; color: #262626; display: block; }
          .docs-v2-download-btn { height: 44px !important; border-radius: 10px !important; font-weight: 600 !important; }
          .docs-v2-footer-info { background: #fff !important; border-radius: 16px !important; margin-top: 40px; }
          .docs-v2-info-icon { font-size: 22px; color: #8c734b; }
        `}} />
      </Layout>
    </ConfigProvider>
  );
};

export default DocumentsPage;