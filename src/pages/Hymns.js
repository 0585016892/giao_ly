import React, { useState } from "react";
import {
  Layout,
  List,
  Card,
  Typography,
  Button,
  Tag,
  Space,
  Divider,
  Empty,
  ConfigProvider,
} from "antd";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  CustomerServiceOutlined,
  DownloadOutlined,
  CompassOutlined,
} from "@ant-design/icons";
import { hymns } from "../api/hymns";

const { Title, Text, Paragraph } = Typography;

const Hymns = () => {
  const [playingId, setPlayingId] = useState(null);
  const [selectedHymn, setSelectedHymn] = useState(null);

  // Bảng màu Option 1: Truyền Thống & Tôn Nghiêm
  const primaryNavy = "#1B365D"; // Xanh Đêm Navy
  const deepNavy = "#0F1F38"; // Navy Đậm
  const accentGold = "#D4AF37"; // Vàng Đồng
  const textDark = "#1E293B";
  const softBg = "#FAFAFA";

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 14,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="hymns-editorial-layout">
        <div className="hymns-container">
          <Space direction="vertical" size={32} style={{ width: "100%" }}>
            {/* HEADER CẦU NGUYỆN */}
            <div className="hymns-header">
              <span className="hymns-tag-sacred">
                <CompassOutlined /> GIAI ĐIỆU THÁNH THIÊNG
              </span>
              <Title level={2} className="hymns-title">
                THÁNH CA HÔN NHÂN
              </Title>
              <div className="gold-accent-divider" />
              <Text className="hymns-subtitle">
                Tuyển chọn những giai điệu phụng vụ thánh thiện cho ngày trọng
                đại của đôi bạn
              </Text>
            </div>

            <div className="hymns-grid-wrapper">
              {/* DANH SÁCH BÀI HÁT */}
              <div className="hymns-list-column">
                <Card
                  title={
                    <span className="card-header-title">
                      <CustomerServiceOutlined
                        style={{ color: accentGold, marginRight: 8 }}
                      />
                      Danh sách bài hát ({hymns.length})
                    </span>
                  }
                  bordered={false}
                  className="glhn-hymns-card"
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={hymns}
                    renderItem={(item) => {
                      const isSelected = selectedHymn?.id === item.id;
                      const isPlaying = playingId === item.id;

                      return (
                        <List.Item
                          actions={[
                            <Button
                              type="text"
                              icon={
                                isPlaying ? (
                                  <PauseCircleFilled
                                    style={{ color: accentGold, fontSize: 24 }}
                                  />
                                ) : (
                                  <PlayCircleFilled
                                    style={{ color: primaryNavy, fontSize: 24 }}
                                  />
                                )
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                setPlayingId(isPlaying ? null : item.id);
                                setSelectedHymn(item);
                              }}
                              className="play-icon-btn"
                            />,
                          ]}
                          className={`hymn-list-item ${isSelected ? "is-selected" : ""}`}
                          onClick={() => setSelectedHymn(item)}
                        >
                          <List.Item.Meta
                            title={
                              <Text className="hymn-item-title">
                                {item.title}
                              </Text>
                            }
                            description={
                              <Space size={8}>
                                <Text className="hymn-item-composer">
                                  Sáng tác: {item.composer}
                                </Text>
                                <Tag className="hymn-tag-gold">
                                  {item.tag || "Thánh ca"}
                                </Tag>
                              </Space>
                            }
                          />
                        </List.Item>
                      );
                    }}
                  />
                </Card>
              </div>

              {/* TRÌNH PHÁT NHẠC & LỜI BÀI HÁT */}
              <div className="hymns-detail-column">
                <Card
                  bordered={false}
                  className="glhn-hymns-card sticky-detail-card"
                >
                  {selectedHymn ? (
                    <div className="fade-in-content">
                      <span className="selected-tag-head">ĐANG CHỌN</span>
                      <Title level={3} className="selected-hymn-title">
                        {selectedHymn.title}
                      </Title>
                      <Text className="selected-composer-text">
                        Sáng tác: <strong>{selectedHymn.composer}</strong>
                      </Text>

                      {/* TRÌNH PHÁT NHẠC (AUDIO PLAYER) */}
                      <div className="audio-player-box">
                        <Text strong className="audio-player-label">
                          TRÌNH PHÁT NHẠC THÁNH CA
                        </Text>
                        <audio
                          controls
                          controlsList="nodownload"
                          style={{ width: "100%", marginTop: 10 }}
                          key={selectedHymn.id}
                        >
                          <source
                            src={selectedHymn.audioUrl || "your-audio-link.mp3"}
                            type="audio/mpeg"
                          />
                          Trình duyệt của bạn không hỗ trợ phát âm thanh.
                        </audio>
                      </div>

                      <Divider orientation="left" className="lyric-divider">
                        LỜI BÀI HÁT
                      </Divider>

                      <div className="lyrics-scroll-container custom-scrollbar">
                        <Paragraph className="lyrics-paragraph">
                          {selectedHymn.lyrics}
                        </Paragraph>
                      </div>

                      <Button
                        block
                        icon={<DownloadOutlined />}
                        className="download-sheet-btn"
                        href={selectedHymn.sheetUrl || "#"}
                        target="_blank"
                      >
                        Tải Sheet Nhạc (PDF)
                      </Button>
                    </div>
                  ) : (
                    <Empty
                      description="Chọn một bài hát từ danh sách bên trái để phát nhạc và xem lời bài hát"
                      style={{ marginTop: 80 }}
                    />
                  )}
                </Card>
              </div>
            </div>
          </Space>
        </div>

        {/* STYLES SCOPED */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .hymns-editorial-layout { 
            background: ${softBg}; 
            min-height: 100vh; 
            padding: 50px 20px 80px 20px; 
            font-family: 'Be Vietnam Pro', sans-serif;
            color: ${textDark};
          }

          .hymns-container { 
            max-width: 1100px; 
            margin: 0 auto; 
            width: 100%; 
          }

          /* Header */
          .hymns-header { 
            text-align: center; 
          }

          .hymns-tag-sacred {
            background: rgba(212, 175, 55, 0.15);
            border: 1px solid ${accentGold};
            color: ${primaryNavy};
            padding: 6px 18px;
            border-radius: 30px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 12px;
          }

          .hymns-title { 
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important; 
            font-size: clamp(28px, 4.5vw, 40px) !important;
            font-weight: 700 !important;
            margin: 0 !important;
          }

          .gold-accent-divider {
            width: 60px;
            height: 3px;
            background: ${accentGold};
            margin: 12px auto;
            border-radius: 2px;
          }

          .hymns-subtitle { 
            color: #64748b; 
            font-size: 15px; 
          }

          /* Grid Layout */
          .hymns-grid-wrapper {
            display: flex;
            gap: 24px;
          }

          .hymns-list-column {
            flex: 1;
            min-width: 320px;
          }

          .hymns-detail-column {
            flex: 1.4;
          }

          /* Card Styling */
          .glhn-hymns-card {
            border-radius: 20px !important;
            border: 1px solid rgba(212, 175, 55, 0.25) !important;
            background: #ffffff !important;
            box-shadow: 0 4px 20px rgba(27, 54, 93, 0.04) !important;
          }

          .card-header-title {
            font-family: 'Playfair Display', Georgia, serif;
            color: ${primaryNavy};
            font-size: 18px;
            font-weight: 700;
          }

          .sticky-detail-card {
            position: sticky;
            top: 24px;
            min-height: 420px;
          }

          /* List Item Styling */
          .hymn-list-item {
            padding: 14px 16px !important;
            border-radius: 12px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.25s ease;
            border: 1px solid transparent !important;
          }

          .hymn-list-item:hover {
            background: rgba(212, 175, 55, 0.08) !important;
            border-color: rgba(212, 175, 55, 0.3) !important;
          }

          .hymn-list-item.is-selected {
            background: rgba(27, 54, 93, 0.06) !important;
            border-color: ${primaryNavy} !important;
          }

          .hymn-item-title {
            font-weight: 700;
            color: ${primaryNavy};
            font-size: 15px;
            display: block;
          }

          .hymn-item-composer {
            font-size: 12px;
            color: #64748b;
          }

          .hymn-tag-gold {
            background: rgba(212, 175, 55, 0.15) !important;
            border: 1px solid ${accentGold} !important;
            color: ${primaryNavy} !important;
            font-weight: 600;
            font-size: 10px;
            border-radius: 10px;
          }

          .play-icon-btn:hover {
            transform: scale(1.1);
          }

          /* Detail Column Content */
          .fade-in-content { 
            animation: fadeIn 0.4s ease-in; 
          }

          @keyframes fadeIn { 
            from { opacity: 0; transform: translateY(10px); } 
            to { opacity: 1; transform: translateY(0); } 
          }

          .selected-tag-head {
            font-size: 10px;
            letter-spacing: 1.5px;
            color: ${accentGold};
            font-weight: 700;
            text-transform: uppercase;
          }

          .selected-hymn-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${primaryNavy} !important;
            margin: 4px 0 6px 0 !important;
            font-weight: 700 !important;
          }

          .selected-composer-text {
            color: #64748b;
            font-size: 13px;
          }

          /* Audio Player Box */
          .audio-player-box {
            margin: 20px 0;
            padding: 16px;
            background: ${softBg};
            border-radius: 14px;
            border: 1px solid rgba(212, 175, 55, 0.3);
            text-align: center;
          }

          .audio-player-label {
            font-size: 11px;
            letter-spacing: 1.5px;
            color: ${primaryNavy};
            display: block;
          }

          .lyric-divider {
            font-size: 11px !important;
            color: ${primaryNavy} !important;
            font-weight: 700 !important;
            letter-spacing: 1px;
            margin: 20px 0 16px 0 !important;
          }

          .lyrics-scroll-container {
            max-height: 280px;
            overflow-y: auto;
            padding-right: 12px;
            white-space: pre-line;
          }

          .lyrics-paragraph {
            font-size: 16px;
            line-height: 2;
            color: ${textDark};
            font-family: 'Be Vietnam Pro', sans-serif;
            text-align: center;
          }

          .download-sheet-btn {
            margin-top: 24px;
            height: 44px !important;
            border-radius: 10px !important;
            font-weight: 700 !important;
            background: ${primaryNavy} !important;
            border-color: ${primaryNavy} !important;
            color: #ffffff !important;
            box-shadow: 0 4px 12px rgba(27, 54, 93, 0.2);
            transition: all 0.3s ease !important;
          }

          .download-sheet-btn:hover {
            background: ${accentGold} !important;
            border-color: ${accentGold} !important;
            color: ${primaryNavy} !important;
          }

          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { 
            background: rgba(212, 175, 55, 0.3); 
            border-radius: 10px; 
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${accentGold}; }

          /* Responsive Breakpoints */
          @media (max-width: 768px) {
            .hymns-grid-wrapper { flex-direction: column; }
            .sticky-detail-card { position: static; min-height: auto; }
            .hymns-editorial-layout { padding: 30px 14px 60px 14px; }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default Hymns;
