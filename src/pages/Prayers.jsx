import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Card, Button, Space, Empty, Badge, Progress, Tooltip, Switch, Input, Divider } from 'antd';
import { 
  BookOutlined, SafetyCertificateOutlined, StarFilled, 
  EyeInvisibleOutlined, EyeOutlined, CheckCircleFilled, SwapOutlined, 
  MinusCircleOutlined, PlusCircleOutlined, TrophyFilled, HomeOutlined,
  ReloadOutlined, MenuOutlined
} from '@ant-design/icons';
import prayerData from '../api/data';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const Prayers = () => {
  // --- STATE ---
  const [fontSize, setFontSize] = useState(16);
  const [selectedKey, setSelectedKey] = useState('1');
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const [testMode, setTestMode] = useState(false); 
  const [viewMode, setViewMode] = useState('read'); 
  const [collapsed, setCollapsed] = useState(window.innerWidth < 992); 
  const [userAnswers, setUserAnswers] = useState({});
  const [learnedKeys, setLearnedKeys] = useState(() => {
    const saved = localStorage.getItem('learned_prayers');
    return saved ? JSON.parse(saved) : [];
  });

  // --- EFFECT ---
  useEffect(() => {
    localStorage.setItem('learned_prayers', JSON.stringify(learnedKeys));
  }, [learnedKeys]);

  useEffect(() => {
    setUserAnswers({});
  }, [selectedKey, testMode]);

  const currentPrayer = prayerData[selectedKey];

  // --- LOGIC ĐIỀN CHỮ (TEST MODE) ---
  const handleInputChange = (index, value) => {
    setUserAnswers(prev => ({ ...prev, [index]: value }));
  };

  const renderInterativeContent = (text) => {
    if (!testMode || !text) return text;
    return text.split('\n').map((line, lineIndex) => (
      <div key={lineIndex} style={{ minHeight: '1.5em', marginBottom: '8px' }}>
        {line.split(' ').map((word, wordIndex) => {
          const globalIndex = `${lineIndex}-${wordIndex}`;
          if (word.length > 2 && wordIndex % 3 === 0) {
            const cleanWord = (w) => w.replace(/[.,!?;:()]/g, '').toLowerCase().trim();
            const targetWord = cleanWord(word);
            const userWord = cleanWord(userAnswers[globalIndex] || '');
            const isCorrect = userWord === targetWord;
            const hasValue = userAnswers[globalIndex]?.length > 0;

            return (
              <Input
                key={wordIndex}
                className={`test-input ${hasValue ? (isCorrect ? 'input-right' : 'input-wrong') : ''}`}
                style={{ width: `${word.length + 1.2}ch`, fontSize: `${fontSize}px` }}
                value={userAnswers[globalIndex] || ''}
                onChange={(e) => handleInputChange(globalIndex, e.target.value)}
              />
            );
          }
          return <span key={wordIndex}>{word} </span>;
        })}
      </div>
    ));
  };

  // --- TIẾN ĐỘ ---
  const allMandatoryKeys = ['1', '4', '8', '9', '10', '11', '12', '13', '14', '15', '16', '18', '24', '25', '26', '27', '28', '29'];
  const learnedMandatoryCount = learnedKeys.filter(k => allMandatoryKeys.includes(k)).length;
  const progressPercent = Math.round((learnedMandatoryCount / allMandatoryKeys.length) * 100);

  const toggleLearned = (key) => {
    setLearnedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const renderLabel = (label, status, key) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span style={{ 
        color: learnedKeys.includes(key) ? '#52c41a' : 'inherit', 
        fontSize: '12.5px',
        fontWeight: learnedKeys.includes(key) ? '500' : 'normal'
      }}>
        {learnedKeys.includes(key) && <CheckCircleFilled style={{ marginRight: 4, fontSize: '11px' }} />}
        {label}
      </span>
      {status === 1 && <StarFilled style={{ color: '#fa1414', fontSize: '9px' }} />}
    </div>
  );

// --- GIỮ NGUYÊN MENU ITEMS ĐẦY ĐỦ ---
  const menuItems = [
    {
      key: 'sub1',
      label: <span style={{ fontSize: '13px', fontWeight: 'bold' }}>I. KINH SÁNG & TỐI</span>,
      icon: <BookOutlined style={{ fontSize: '14px' }} />,
      children: [
        { key: '1', label: '1. Dấu Thánh Giá', status: 1 },
        { key: '2', label: '2. Kinh Truyền Tin', status: 0 },
        { key: '3', label: '3. Kinh Nữ Vương Thiên Đàng', status: 0 },
        { key: '4', label: '4. Kinh Đức Chúa Thánh Thần', status: 1 },
        { key: '5', label: '5. Kinh Sấp Mình', status: 0 },
        { key: '6', label: '6. Kinh Thờ Lạy', status: 0 },
        { key: '7', label: '7. Kinh Đội Ơn', status: 0 },
        { key: '8', label: '8. Kinh Tin', status: 1 },
        { key: '9', label: '9. Kinh Cậy', status: 1 },
        { key: '10', label: '10. Kinh Mến', status: 1 },
        { key: '11', label: '11. Kinh Lạy Cha', status: 1 },
        { key: '12', label: '12. Kinh Kính Mừng', status: 1 },
        { key: '13', label: '13. Kinh Sáng Danh', status: 1 },
        { key: '14', label: '14. Kinh Tin Kính', status: 1 },
        { key: '15', label: '15. Kinh Thú Nhận', status: 1 },
        { key: '16', label: '16. Kinh Ăn Năn Tội', status: 1 },
        { key: '17', label: '17. Kinh Phù Hộ', status: 0 },
        { key: '18', label: '18. Kinh Sáng Soi', status: 1 },
        { key: '19', label: '19. Kinh Thánh Thiên Thần Bản Mệnh', status: 0 },
        { key: '20', label: '20. Kinh Lạy Nữ Vương', status: 0 },
        { key: '21', label: '21. Kinh Trước Khi Xét Mình', status: 0 },
        { key: '22', label: '22. Kinh Hãy Nhớ', status: 0 },
        { key: '23', label: '23. Kinh Phó Dâng', status: 0 },
        { key: '24', label: '24. Kinh Cám Ơn', status: 1 },
        { key: '25', label: '25. Kinh Trông Cậy', status: 1 },
        { key: '26', label: '26. Các Lời Nguyện Tắt', status: 1 },
      ].map(item => ({ ...item, label: renderLabel(item.label, item.status, item.key) })),
    },
    {
      key: 'sub2',
      label: <span style={{ fontSize: '13px', fontWeight: 'bold' }}>II. KINH CHÚA NHẬT</span>,
      icon: <SafetyCertificateOutlined style={{ fontSize: '14px' }} />,
      children: [
        { key: '27', label: '27. 10 Điều Răn', status: 1 },
        { key: '28', label: '28. 6 Điều Răn', status: 1 },
        { key: '29', label: '29. Bảy Phép Bí Tích', status: 1 },
        { key: '30', label: '30. Thương Người Có 14 Mối', status: 0 },
        { key: '31', label: '31. Cải Tội Bảy Mối', status: 0 },
        { key: '32', label: '32. Phúc Thật 8 Mối', status: 0 },
      ].map(item => ({ ...item, label: renderLabel(item.label, item.status, item.key) })),
    },
    {
      key: 'sub3',
      label: <span style={{ fontSize: '13px', fontWeight: 'bold' }}>III. NGẮM & KINH KHÁC</span>,
      icon: <HomeOutlined style={{ fontSize: '14px' }} />,
      children: [
        { key: '33', label: '33. Ngắm: Năm Sự Vui' },
        { key: '34', label: '34. Ngắm: Năm Sự Sáng' },
        { key: '35', label: '35. Ngắm: Năm Sự Thương' },
        { key: '36', label: '36. Ngắm: Năm Sự Mừng' },
        { key: '37', label: '37. Kinh Dọn Mình Chịu Lễ' },
        { key: '38', label: '38. Kinh Cám Ơn Hiệp Lễ' },
      ].map(item => ({ ...item, label: renderLabel(item.label, item.status, item.key) })),
    }
  ];

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <Button 
            type="text" 
            icon={<MenuOutlined />} 
            className="mobile-trigger" 
            onClick={() => setCollapsed(!collapsed)} 
          />
          <div>
            <Title level={4} style={{ margin: 0, color: '#5d4037', lineHeight: 1.2 }}>KINH NGUYỆN</Title>
            <Text type="secondary" style={{ fontSize: '11px' }}>Cần thuộc <StarFilled style={{ color: '#fa1414', fontSize: '8px' }} /></Text>
          </div>
        </div>
        <div className="header-right">
          <div className="progress-info">
            <Text strong style={{ fontSize: '11px' }}>Hoàn thành: {progressPercent}%</Text>
            <Progress percent={progressPercent} strokeColor="#b39164" size="small" showInfo={false} style={{ width: 80 }} />
          </div>
          {progressPercent === 100 && <TrophyFilled style={{ color: '#faad14', fontSize: '20px', marginLeft: 10 }} />}
        </div>
      </header>

      <Layout className="main-layout">
        <Sider 
          width={280} 
          theme="light" 
          breakpoint="lg" 
          collapsedWidth="0" 
          collapsible 
          collapsed={collapsed}
          trigger={null}
          style={{zIndex:'10000'}}
          className="app-sider"
        >
          <div className="sider-header">
            <Button 
              type="primary" icon={<SwapOutlined />} block
              onClick={() => setViewMode(viewMode === 'read' ? 'flashcard' : 'read')}
              style={{ borderRadius: '6px', fontSize: '12px', height: '35px', background: '#b39164', border: 'none' }}
            >
              {viewMode === 'read' ? 'CHẾ ĐỘ FLASHCARD' : 'CHẾ ĐỘ ĐỌC KINH'}
            </Button>
          </div>
          <div className="menu-wrapper custom-scrollbar">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              openKeys={openKeys}
              onOpenChange={(keys) => setOpenKeys(keys.slice(-1))}
              onSelect={({ key }) => {
                setSelectedKey(key);
                if (window.innerWidth < 992) setCollapsed(true);
              }}
              items={menuItems}
            />
          </div>
        </Sider>

        <Content className={`app-content custom-scrollbar ${!collapsed && window.innerWidth < 992 ? 'content-blurred' : ''}`}>
          {currentPrayer ? (
            <div className="content-container">
              {viewMode === 'read' ? (
                <Badge.Ribbon text={testMode ? "KIỂM TRA" : "HỌC KINH"} color={testMode ? "#f5222d" : "#b39164"}>
                  <Card bordered={false} className="prayer-card">
                    <div className="card-header">
                      <Title level={3} className="prayer-title">{currentPrayer.title}</Title>
                      <Space wrap size="small" className="toolbar">
                        <Tooltip title="Ẩn chữ để kiểm tra">
                          <Switch 
                            size="small"
                            checkedChildren={<EyeInvisibleOutlined />} 
                            unCheckedChildren={<EyeOutlined />} 
                            onChange={setTestMode} 
                          />
                        </Tooltip>
                        <Button size="small" icon={<ReloadOutlined />} onClick={() => setUserAnswers({})} />
                        <Divider type="vertical" />
                        <Button size="small" icon={<MinusCircleOutlined />} onClick={() => setFontSize(f => Math.max(12, f-1))} />
                        <Button size="small" icon={<PlusCircleOutlined />} onClick={() => setFontSize(f => Math.min(24, f+1))} />
                        <Button 
                          size="small"
                          type={learnedKeys.includes(selectedKey) ? "primary" : "default"}
                          onClick={() => toggleLearned(selectedKey)}
                          className={learnedKeys.includes(selectedKey) ? "btn-success" : ""}
                        >
                          {learnedKeys.includes(selectedKey) ? "Đã thuộc" : "Đánh dấu thuộc"}
                        </Button>
                      </Space>
                    </div>
                    <div className="prayer-text-area" style={{ fontSize: `${fontSize}px` }}>
                      {renderInterativeContent(currentPrayer.content)}
                    </div>
                  </Card>
                </Badge.Ribbon>
              ) : (
                <div className="flashcard-section">
                  <div className={`flashcard ${testMode ? 'flipped' : ''}`} onClick={() => setTestMode(!testMode)}>
                    <div className="flashcard-inner">
                      <div className="flashcard-front">
                        <Text type="secondary" style={{ fontSize: '11px', letterSpacing: '1px' }}>CHẠM ĐỂ LẬT</Text>
                        <Title level={2} style={{ color: '#5d4037', textAlign: 'center', marginTop: 20 }}>{currentPrayer.title}</Title>
                      </div>
                      <div className="flashcard-back">
                        <div className="flashcard-content custom-scrollbar" style={{ fontSize: `${fontSize}px` }}>
                          {currentPrayer.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Empty description="Vui lòng chọn một bài kinh bên menu" style={{ marginTop: 100 }} />
          )}
        </Content>
      </Layout>

      <style dangerouslySetInnerHTML={{ __html: `
        :root { --primary-color: #b39164; --bg-color: #fcfaf2; --text-main: #5d4037; }
        
        .app-container { height: 100vh; display: flex; flex-direction: column; background: var(--bg-color); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        
        .app-header { 
          display: flex; justify-content: space-between; align-items: center; 
          padding: 10px 20px; background: white; border-bottom: 1px solid #eee; 
        }
        .header-left { display: flex; align-items: center; gap: 12px; }
        .mobile-trigger { display: none; font-size: 20px; color: var(--text-main); }

        .main-layout { background: transparent; flex: 1; overflow: hidden; display: flex; }
        
        /* Sider styles */
        .app-sider { 
          background: white !important; border-right: 1px solid #f0f0f0; 
          height: 100%; transition: all 0.3s ease; 
        }
        .sider-header { padding: 15px; border-bottom: 1px solid #f9f9f9; }
        .menu-wrapper { height: calc(100vh - 130px); overflow-y: auto; }
        .menu-group-label { font-size: 13px; font-weight: bold; color: #8c7b60; }

        /* Content area */
        .app-content { padding: 30px; flex: 1; overflow-y: auto; background: #fffdf9; transition: all 0.3s; }
        .content-container { max-width: 800px; margin: 0 auto; }
        
        .prayer-card { border-top: 4px solid var(--primary-color); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .prayer-title { margin: 0 !important; color: var(--text-main) !important; }
        .card-header { margin-bottom: 20px; display: flex; flex-direction: column; gap: 15px; }
        
        .prayer-text-area { 
          line-height: 2; padding: 20px; background: #fdfbf7; 
          border-radius: 10px; border: 1px solid #f0e6cc; min-height: 300px;
          white-space: pre-line; color: #444;
        }
        
        /* Interactive Input */
        .test-input {
          border: none; border-bottom: 2px solid #d9d9d9;
          background: transparent; border-radius: 0; padding: 0 4px;
          height: auto; text-align: center; color: var(--text-main); transition: all 0.3s;
        }
        .test-input:focus { border-bottom-color: var(--primary-color); box-shadow: none; background: #fffdf0; }
        .input-right { border-bottom-color: #52c41a !important; color: #52c41a !important; font-weight: bold; }
        .input-wrong { border-bottom-color: #ff4d4f !important; }

        /* Flashcard */
        .flashcard-section { display: flex; justify-content: center; padding-top: 40px; perspective: 1000px; }
        .flashcard { width: 100%; max-width: 450px; height: 300px; cursor: pointer; }
        .flashcard-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s; transform-style: preserve-3d; }
        .flashcard.flipped .flashcard-inner { transform: rotateY(180deg); }
        .flashcard-front, .flashcard-back { 
          position: absolute; width: 100%; height: 100%; backface-visibility: hidden; 
          display: flex; flex-direction: column; justify-content: center; align-items: center; 
          padding: 30px; border-radius: 20px; background: white; border: 2px solid var(--primary-color);
          box-shadow: 0 15px 35px rgba(179, 145, 100, 0.2);
        }
        .flashcard-back { transform: rotateY(180deg); background: #fffef9; }
        .flashcard-content { overflow-y: auto; max-height: 100%; text-align: center; line-height: 1.8; white-space: pre-line; }

        /* Responsive Breakpoints */
        @media (max-width: 992px) {
          .mobile-trigger { display: block; }
          .app-sider { position: absolute !important; left: 0; top: 0; z-index: 1000; box-shadow: 10px 0 30px rgba(0,0,0,0.1); }
          .app-content { padding: 15px; }
          .content-blurred { filter: blur(4px); pointer-events: none; opacity: 0.5; }
          .toolbar { justify-content: space-between; width: 100%; }
          .prayer-text-area { padding: 15px; line-height: 1.8; }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e0d5c1; border-radius: 10px; }
        .btn-success { background: #52c41a !important; border-color: #52c41a !important; color: white !important; }
      `}} />
    </div>
  );
};

export default Prayers;