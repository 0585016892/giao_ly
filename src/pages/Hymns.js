import React, { useState } from 'react';
import { Layout, List, Card, Typography, Button, Tag, Space, Divider, Empty } from 'antd';
import { PlayCircleFilled, PauseCircleFilled, CustomerServiceOutlined, DownloadOutlined } from '@ant-design/icons';
import { hymns } from '../api/hymns';

const { Title, Text, Paragraph } = Typography;
const Hymns = () => {
  const [playingId, setPlayingId] = useState(null);
  const [selectedHymn, setSelectedHymn] = useState(null);

 

  return (
    <Layout style={{ background: '#fcfaf2', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
        <Space direction="vertical" size={32} style={{ width: '100%' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center' }}>
            <CustomerServiceOutlined style={{ fontSize: 40, color: '#8c734b' }} />
            <Title level={2} style={{ color: '#5d4037', marginTop: 10 }}>THÁNH CA HÔN NHÂN</Title>
            <Text type="secondary">Giai điệu thánh thiêng cho ngày trọng đại</Text>
          </div>

          <div style={{ display: 'flex', gap: '24px', flexDirection: window.innerWidth < 768 ? 'column' : 'row' }}>
            
            {/* List Bài Hát */}
            <div style={{ flex: 1 }}>
              <Card title="Danh sách bài hát" bordered={false} style={{ borderRadius: 20 }}>
                <List
                  itemLayout="horizontal"
                  dataSource={hymns}
                  renderItem={(item) => (
                    <List.Item 
                      actions={[
                        <Button 
                          type="text" 
                          icon={playingId === item.id ? <PauseCircleFilled /> : <PlayCircleFilled />} 
                          onClick={() => {
                            setPlayingId(playingId === item.id ? null : item.id);
                            setSelectedHymn(item);
                          }}
                          style={{ color: '#8c734b', fontSize: 20 }}
                        />
                      ]}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedHymn(item)}
                    >
                      <List.Item.Meta
                        title={<Text strong>{item.title}</Text>}
                        description={<Text type="secondary" style={{fontSize: 12}}>{item.composer} • <Tag color="gold">{item.tag}</Tag></Text>}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </div>

            {/* Chi tiết & Lời bài hát */}
            <div style={{ flex: 1.5 }}>
              <Card bordered={false} style={{ borderRadius: 20, minHeight: 400, position: 'sticky', top: 20 }}>
                {selectedHymn ? (
                  <div className="fade-in">
                    <Title level={3}>{selectedHymn.title}</Title>
                    <Text italic color="secondary">Sáng tác: {selectedHymn.composer}</Text>
                    
                    <div style={{ margin: '24px 0', padding: '15px', background: '#f8f9fa', borderRadius: 12, textAlign: 'center' }}>
                        <Text strong>TRÌNH PHÁT NHẠC (AUDIO)</Text>
                        <audio controls style={{ width: '100%', marginTop: 10 }}>
                           <source src="your-audio-link.mp3" type="audio/mpeg" />
                        </audio>
                    </div>

                    <Divider orientation="left" style={{ fontSize: 12 }}>LỜI BÀI HÁT</Divider>
                    <div style={{ maxHeight: 300, overflowY: 'auto', paddingRight: 10, whiteSpace: 'pre-line' }}>
                      <Paragraph style={{ fontSize: 16, lineHeight: 2, color: '#444' }}>
                        {selectedHymn.lyrics}
                      </Paragraph>
                    </div>
                    
                    <Button block icon={<DownloadOutlined />} style={{ marginTop: 20 }}>Tải Sheet nhạc (PDF)</Button>
                  </div>
                ) : (
                  <Empty description="Chọn một bài hát để xem lời và nghe nhạc" style={{ marginTop: 100 }} />
                )}
              </Card>
            </div>
          </div>
        </Space>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .fade-in { animation: fadeIn 0.5s ease-in; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .ant-list-item:hover { background: #fdfaf5; transition: 0.3s; }
      `}} />
    </Layout>
  );
};

export default Hymns;