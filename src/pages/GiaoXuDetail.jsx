import React from 'react';
import { 
  Layout, Typography, Row, Col, Card, Space, 
  Divider, Tag, Timeline, List, Avatar, Button, Tabs, Table, Alert, Modal
} from 'antd';
import { 
  EnvironmentOutlined, HistoryOutlined, UserOutlined, TeamOutlined,
  StarOutlined, ClockCircleOutlined, BankOutlined, InfoCircleOutlined,
   PhoneOutlined, MailOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';

import Logo1 from "../assets/images/anhnhatho.jpg"; 

const { Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;

const GiaoXuDongQuanFull = () => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedHo, setSelectedHo] = React.useState(null);

    const showModal = (ho) => {
        setSelectedHo(ho);
        setIsModalOpen(true);
    };

    // 1. DỮ LIỆU CƠ BẢN (Giữ nguyên)
    const parishData = {
        name: "GIÁO XỨ ĐỒNG QUAN",
        diocese: "Thái Bình",
        deanery: "Kiến Xương",
        established: "1911",
        patron: "Đức Mẹ Hồn Xác Lên Trời (15/08)",
        priest: "Cha Jos Vũ Văn Chiều",
        address: "Thôn Đồng Tâm, xã Vũ Quý, tỉnh Hưng Yên",
        population: "1.304 (Toàn xứ)",
        phone: '093 384 84 83',
        subParishes: [
            {
                name: "Họ Kinh Nhuế",
                members: 125,
                patron: "Thánh Phaolô trở lại (25/01) & Thánh Antôn (13/6)",
                address: "Thôn Đoài, xã Hòa Bình, huyện Kiến Xương, Thái Bình",
                distance: "Cách nhà xứ 700m về hướng Đông Nam",
                established: "1923",
                evangelized: "Đầu thế kỷ XX",
                currentChurch: "2004",
                history: [
                    { year: "1920", event: "3 gia đình đầu tiên được Rửa tội, nhận thánh Phaolô làm bổn mạng." },
                    { year: "1923", event: "Dựng nhà nguyện lợp rạ, tên gọi ban đầu là Giáo Tụ Lý Kế." },
                    { year: "1938", event: "Nhà thờ bị đốt cháy; thêm 4 gia đình xin theo đạo." },
                    { year: "Sau đó", event: "Hoàn thành nhà thờ lợp ngói 5 gian; đổi tên thành Kinh Nhuế." },
                    { year: "1960", event: "Sáp nhập 5 gia đình từ Giáo họ Cánh Sẻ vào Kinh Nhuế." },
                    { year: "2004", event: "Khởi công xây dựng nhà thờ mới diện tích 650m2 nhờ sự giúp đỡ của gia đình cụ Phaolô Lương Đức Thiện (Hoa Kỳ)." },
                    { year: "2005", event: "Đức cha Phanxicô Xaviê Nguyễn Văn Sang cắt băng khánh thành nhà thờ (05/04)." }
                ],
                organization: "Ban Ca đoàn, hội con Đức Mẹ, hội Gia trưởng... đang nỗ lực hòa nhịp sinh hoạt cùng Giáo xứ."
            },
            {
                name: "Họ Phụng Thượng",
                members: 23,
                patron: "Sinh Nhật Đức Mẹ (08/09)",
                address: "Xã Vũ An, huyện Kiến Xương, Thái Bình",
                distance: "Cách nhà xứ 1km về hướng Tây Bắc",
                established: "1802",
                evangelized: "Cuối thế kỷ XVIII",
                currentChurch: "2003",
                history: [
                    { year: "1802", event: "Chính thức thành lập Giáo họ." },
                    { year: "1836", event: "Xây dựng ngôi nhà thờ đầu tiên." },
                    { year: "1906", event: "Trùng tu nhà thờ bằng gỗ lim diện tích 200m2." },
                    { year: "1986", event: "Cơn bão phá đổ hoàn toàn nhà thờ; giáo dân dựng lại nhà thờ tạm 3 gian." },
                    { year: "1992", event: "Giáo họ được tái lập thuộc giáo xứ Đồng Quan thời cha Tôma Trần Trung Hà." },
                    { year: "2003", event: "Khởi công xây dựng nhà thờ mới với tháp cao 25m." },
                    { year: "2011", event: "Đức Cha Phêrô Nguyễn Văn Đệ cắt băng khánh thành ngôi nhà thờ mới (08/09)." }
                ],
                organization: "Vì nhân danh ít nên ông trùm phụ trách chung; các hội đoàn sinh hoạt chung với họ Nhà Xứ."
            },
            {
                name: "Họ Việt Hưng",
                members: 43,
                patron: "Thánh Vinhsơn (05/04)",
                address: "Thôn Đề Thái, xã Hòa Bình, huyện Kiến Xương, Thái Bình",
                distance: "Cách nhà xứ 1km về hướng Đông Nam",
                established: "1937",
                evangelized: "Đầu thế kỷ XX",
                currentChurch: "2000",
                history: [
                    { year: "1937", event: "Thành lập giáo họ với tên gọi Bặt Trung (5 gia đình), chưa có nhà thờ." },
                    { year: "1940", event: "Xây dựng ngôi nhà thờ 5 gian bằng tre lợp lá." },
                    { year: "1954", event: "Biến cố chiến tranh, giáo họ chỉ còn 3 hộ gia đình với 11 tín hữu." },
                    { year: "1991", event: "Đổi tên thành Việt Hưng và chính thức nhập về xứ Đồng Quan." },
                    { year: "2000", event: "Khởi công xây dựng nhà thờ mới (dài 17,5m, rộng 7m, tháp cao 17m)." },
                    { year: "2001", event: "Khánh thành nhà thờ vào ngày 03/10." },
                    { year: "2013", event: "Đón Đức cha Phêrô thăm mục vụ hành trình Mùa Chay." }
                ],
                organization: "Huynh đoàn Đaminh, ban Ca, hội Con Đức Mẹ hoạt động tích cực trong tinh thần hiệp thông."
            }
        ]
    };

    // 2. CẤU TRÚC BẢNG GIỜ LỄ (Giữ nguyên)
    const massColumns = [
        { title: 'Thứ', dataIndex: 'day', key: 'day', width: '15%', render: (text) => <Text strong>{text}</Text> },
        { title: 'Ngày', dataIndex: 'days', key: 'days', width: '15%', render: (text) => <Text strong>{text}</Text> },
        { title: 'Địa điểm', dataIndex: 'location', key: 'location', render: (text) => <Space><BankOutlined style={{ color: '#b39164' }} />{text}</Space> },
        { title: 'Giờ lễ', dataIndex: 'time', key: 'time', width: '15%', render: (t) => <Tag color="gold" style={{borderRadius: 20}}>{t}</Tag> },
        { title: 'Ghi chú', dataIndex: 'note', key: 'note', render: (n) => <Text type="secondary" italic>{n}</Text> },
    ];

    const massData = [
        { key: '1', days: '25/2', day: 'Thứ 2', location: 'Nhà thờ Đồng Quan', time: '05:00', note: 'Lễ sáng' },
        { key: '2', days: '25/2', day: 'Thứ 3', location: 'Họ Kinh Nhuế', time: '18:00', note: 'Cha xứ dâng lễ' },
        { key: '3', days: '25/2', day: 'Thứ 4', location: 'Nhà thờ Đồng Quan', time: '05:00', note: 'Lễ sáng' },
        { key: '4', days: '25/2', day: 'Thứ 5', location: 'Họ Phụng Thượng', time: '18:00', note: 'Lễ chiều' },
        { key: '5', days: '25/2', day: 'Thứ 6', location: 'Nhà thờ Đồng Quan', time: '18:30', note: 'Kính Lòng Chúa Thương Xót' },
        { key: '6', days: '25/2', day: 'Thứ 7', location: 'Họ Việt Hưng', time: '17:30', note: 'Lễ thay Chúa Nhật' },
        { key: '7', days: '25/2', day: 'Chúa Nhật', location: 'Nhà thờ Đồng Quan', time: '05:30', note: 'Lễ sáng - Thiếu nhi' },
        { key: '8', days: '25/2', day: 'Chúa Nhật', location: 'Nhà thờ Đồng Quan', time: '08:00', note: 'Lễ Đại Triều' },
        { key: '9', days: '25/2', day: 'Chúa Nhật', location: 'Nhà thờ Đồng Quan', time: '16:30', note: 'Lễ chiều' },
    ];

    const columnsLM = [
        {
            title: 'Linh mục',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Text strong style={{ color: record.isCurrent ? '#b39164' : 'inherit' }}>
                    {text} {record.isCurrent && <Tag color="gold" style={{ marginLeft: 8 }}>Hiện tại</Tag>}
                </Text>
            ),
        },
        {
            title: 'Nhiệm kỳ',
            dataIndex: 'period',
            key: 'period',
            align: 'right',
            render: (text) => <Text type="secondary">{text}</Text>,
        },
    ];

    const dataLM = [
        { key: '1', name: 'Cha Giuse Toàn', period: '-' },
        { key: '2', name: 'Cha Đaminh Thức', period: '1925' },
        { key: '3', name: 'Cha Đaminh Phạm Hữu Quang', period: '-' },
        { key: '4', name: 'Cha Gioan B. Trần Du Đồng', period: '-' },
        { key: '5', name: 'Cha Đaminh Mưu', period: '-' },
        { key: '6', name: 'Cha Giuse Phạm Kim Bảng', period: '-' },
        { key: '7', name: 'Cha Micae Tung', period: '-' },
        { key: '8', name: 'Cha Vinhsơn Thái', period: '-' },
        { key: '9', name: 'Cha Đaminh An', period: '-' },
        { key: '10', name: 'Cha Đaminh Đỉnh', period: '1955' },
        { key: '11', name: 'Cha Giêrônimô Nguyễn Văn Đạo', period: '1973 - 1977' },
        { key: '12', name: 'Cha Giuse Nguyễn Quang Phục', period: '1977 - 1991' },
        { key: '13', name: 'Cha Tôma Aq. Trần Trung Hà', period: '1991 - 1994' },
        { key: '14', name: 'Cha Giuse Nguyễn Thành Hiến', period: '1994 - 1996' },
        { key: '15', name: 'Cha Phanxicô Ass. Nguyễn Tiến Tám', period: '1996 - 2006' },
        { key: '16', name: 'Cha Gioan B. Nguyễn Sơn Hải', period: '2006 - 2010' },
        { key: '17', name: 'Cha Giuse Đinh Xuân Ngọc', period: '2010 - 2014' },
        { key: '18', name: 'Cha Đaminh Trương Văn Thụy', period: '-' },
        { key: '19', name: 'Cha Giuse Hà Đăng Oánh', period: '-' },
        { key: '20', name: 'Cha Giuse Vũ Văn Chiều', period: 'Hiện nay', isCurrent: true },
    ];

    const tabItems = [
        {
            key: 'intro',
            label: <span><InfoCircleOutlined /> GIỚI THIỆU</span>,
            children: (
                <div style={{ padding: '10px 0' }}>
                    <Title level={4} className="tab-section-title"><EnvironmentOutlined /> I. VỊ TRÍ ĐỊA LÝ</Title>
                    <Paragraph className="tab-content-text">
                        Giáo xứ Đồng Quan nằm cách <b>Toà Giám Mục Thái Bình khoảng 7km</b> về phía Đông Nam; phía Tây Bắc giáp với làng Đồng Sách. 
                        Con sông Hoàng Giang chia cắt 2 cánh đồng của làng Đồng Quan với làng Luật Trung và làng Luật Nội.
                    </Paragraph>
                    
                    <Divider />

                    <Title level={4} className="tab-section-title"><HistoryOutlined /> II. HÌNH THÀNH & PHÁT TRIỂN</Title>
                    <Timeline 
                        mode="left"
                        items={[
                            { label: <Text strong>1745</Text>, children: 'Hạt giống Đức Tin nảy mầm qua hai cụ Tuần Lương và Huyện Kiêm.' },
                            { label: <Text strong>1752</Text>, children: 'Ngôi nhà thờ đầu tiên được tiền nhân xây dựng.' },
                            { label: <Text strong>1888</Text>, children: 'Giáo xứ Thân Thượng được thành lập, họ Đồng Quan được cắt về giáo xứ mới này.' },
                            { label: <Text strong>1889</Text>, children: 'Số giáo dân ngày một đông nên nhà thờ được xây dựng lại.' },
                            { label: <Text strong>1911</Text>, children: 'Đức cha Phêrô Munagorri Trung chính thức nâng lên hàng giáo xứ.' },
                            { label: <Text strong>1997</Text>, children: 'Đức cha Phanxicô Xaviê Nguyễn Văn Sang đã cho phép xây dựng nhà thờ mới rộng rãi và bề thế hơn, được cắt băng khánh thành ngày 21/11/2000.' },
                            { label: <Text strong>2003</Text>, children: 'Khởi công xây dựng ngôi nhà xứ mới, rộng 350m2. Năm 2011, Giáo xứ xây dựng và hoàn thiện 4 đài xung quanh nhà thờ.' },
                            { label: <Text strong>2006</Text>, children: 'Hồi sinh: Đón Cha Gioan B. Nguyễn Sơn Hải trực tiếp coi sóc sau 50 năm trống tòa.' },
                            { label: <Text strong>2012</Text>, children: 'Đại lễ tạ ơn kỷ niệm 100 năm thành lập Giáo xứ.' },
                            { label: <Text strong>2014</Text>, children: 'Giáo họ Luật Nội được chuyển từ xứ Đồng Quan về xứ Truyền Tin.' },
                        ]}
                    />
                </div>
            )
        },
        {
            key: 'mass',
            label: <span><ClockCircleOutlined /> GIỜ LỄ</span>,
            children: (
                <div style={{ padding: '10px 0' }}>
                    <Alert 
                        message="Lưu ý: Giờ lễ có thể thay đổi vào các dịp Đại Lễ hoặc theo thông báo của Cha xứ." 
                        type="info" 
                        showIcon 
                        style={{ marginBottom: 16, borderRadius: 8, background: '#fdfaf5', borderColor: '#e6d5b8' }} 
                    />
                    <Table columns={massColumns} dataSource={massData} pagination={false} bordered size="small" className="custom-table" />
                </div>
            )
        },
        {
            key: 'org',
            label: <span><TeamOutlined /> TỔ CHỨC & ƠN GỌI</span>,
            children: (
                <div style={{ padding: '10px 0' }}>
                    <Title level={5} style={{color: '#b39164'}}>ƠN GỌI TIÊU BIỂU:</Title>
                    <Paragraph className="tab-content-text" style={{padding: 16, background: '#fafafa', borderRadius: 8, borderLeft: '4px solid #b39164'}}>
                        Đồng Quan là quê hương của <b>Cha bề trên Đaminh Trần Đình Thủ</b> (1906 - 2007) - Người sáng lập Dòng Đồng Công. Ngoài ra còn có các cha và tu sĩ khác đã và đang phục vụ khắp mọi nơi.
                    </Paragraph>
                    <Divider orientation="left"><Text type="secondary">LINH MỤC QUA CÁC THỜI KỲ</Text></Divider>
                    <Table 
                        columns={columnsLM} 
                        dataSource={dataLM} 
                        pagination={{ pageSize: 8, hideOnSinglePage: true }} 
                        size="middle" 
                        className="custom-table"
                    />
                </div>
            )
        },
        {
            key: 'hoxu',
            label: <span><BankOutlined /> CÁC GIÁO HỌ</span>,
            children: (
                <Row gutter={[16, 16]} style={{ padding: '10px 0' }}>
                    {parishData.subParishes.map((ho, idx) => (
                        <Col xs={24} sm={12} key={idx}>
                            <Card 
                                hoverable 
                                className="subparish-card"
                                onClick={() => showModal(ho)}
                            >
                                <div className="card-accent" />
                                <Title level={5} style={{ margin: 0, color: '#b39164' }}>{ho.name.toUpperCase()}</Title>
                                <Space direction="vertical" size={2} style={{ marginTop: 8 }}>
                                    <Text type="secondary" size="small"><EnvironmentOutlined /> {ho.address}</Text>
                                    <Text strong size="small" style={{color: '#8c7e6a'}}><StarOutlined /> Bổn mạng: {ho.patron}</Text>
                                </Space>
                                <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Tag color="gold" style={{borderRadius: 10}}>{ho.members} giáo dân</Tag>
                                    <Button type="link" size="small" icon={<ArrowRightOutlined />}>Chi tiết</Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )
        }
    ];

    return (
        <Layout className="main-layout">
            {/* HERO SECTION */}
            <div className="hero-banner" style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${Logo1})` }}>
                <div className="hero-content">
                    <Space direction="vertical" size={0}>
                        <Tag color="#b39164" className="diocese-tag">GIÁO PHẬN THÁI BÌNH</Tag>
                        <Title level={1} className="hero-title">{parishData.name}</Title>
                        <div className="hero-subtitle">
                            <EnvironmentOutlined /> {parishData.address}
                        </div>
                    </Space>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <Content className="content-container">
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card bordered={false} className="main-info-card">
                            <Tabs defaultActiveKey="intro" items={tabItems} size="large" className="custom-tabs" />
                        </Card>
                    </Col>

                    <Col xs={24} lg={8}>
                        <Space direction="vertical" style={{ width: '100%' }} size={24}>
                            {/* PRIEST INFO */}
                            <Card bordered={false} className="priest-card">
                                <div className="priest-header">
                                    <Avatar size={100} icon={<UserOutlined />} className="priest-avatar" />
                                    <Title level={4} style={{ margin: '12px 0 0' }}>{parishData.priest}</Title>
                                    <Text className="priest-title">Linh mục chánh xứ</Text>
                                </div>
                                <Divider style={{ margin: '20px 0' }} />
                                <List size="small" className="quick-info-list">
                                    <List.Item><Space><TeamOutlined /> <Text strong>Hạt:</Text> {parishData.deanery}</Space></List.Item>
                                    <List.Item><Space><StarOutlined /> <Text strong>Bổn mạng:</Text> {parishData.patron}</Space></List.Item>
                                    <List.Item><Space><TeamOutlined /> <Text strong>Giáo dân:</Text> {parishData.population}</Space></List.Item>
                                    <List.Item><Space><PhoneOutlined /> <Text strong>Điện thoại:</Text> {parishData.phone}</Space></List.Item>
                                </List>
                            </Card>

                            {/* CONTACT CARD */}
                            <Card bordered={false} className="contact-card">
                                <Title level={5} style={{ color: '#fff', marginBottom: 20 }}>
                                    <PhoneOutlined /> LIÊN HỆ & PHỤNG VỤ
                                </Title>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <div className="contact-item">
                                        <MailOutlined />
                                        <Text style={{ color: '#bbb' }}>dongquan@thaibinhdiocese.org</Text>
                                    </div>
                                    <Button type="primary" block className="action-button">
                                        GỬI Ý LỄ TRỰC TUYẾN
                                    </Button>
                                </Space>
                            </Card>

                            {/* MAP CARD */}
                            <Card bordered={false} className="map-card" bodyStyle={{ padding: 0 }}>
                                <div className="map-container">
                                    <iframe 
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3670.9286361938503!2d106.4010962751596!3d20.42041368108102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135fb75aaaaaaab%3A0xfb0f0731b568e408!2zTmjDoCBUaOG7nSBHacOhbyBY4bupIMSQ4buTbmcgUXVhbg!5e1!3m2!1svi!2s!4v1778647717285!5m2!1svi!2s" 
                                        width="100%" height="100%" style={{ border: 0 }} 
                                        allowFullScreen={true} loading="lazy" 
                                        title="Bản đồ giáo xứ"
                                    />
                                </div>
                                <div className="map-footer">
                                    <EnvironmentOutlined /> <Text strong>Vị trí Giáo xứ trên Google Maps</Text>
                                </div>
                            </Card>
                        </Space>
                    </Col>
                </Row>
            </Content>

            <Footer className="main-footer">
                <Text className="footer-name">{parishData.name}</Text>
                <div className="footer-info">Trực thuộc Giáo phận Thái Bình | Thành lập năm {parishData.established}</div>
                <Text type="secondary" style={{ fontSize: 12 }}>© 2026 Trang thông tin điện tử Giáo xứ. Developed with HT.</Text>
            </Footer>

            {/* MODAL CHI TIẾT GIÁO HỌ (Giữ nguyên logic) */}
            <Modal
                title={<span style={{ color: '#b39164', fontWeight: 600 }}>THÔNG TIN CHI TIẾT GIÁO HỌ</span>}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={750}
                centered
                className="custom-modal"
            >
                {selectedHo && (
                    <div className="modal-scroll-area">
                        <div className="modal-header">
                            <Title level={2} style={{ color: '#b39164', margin: 0 }}>{selectedHo.name}</Title>
                            <Text type="secondary"><EnvironmentOutlined /> {selectedHo.address}</Text>
                            <div className="modal-tags">
                                <Tag color="volcano" icon={<StarOutlined />}>Bổn mạng: {selectedHo.patron}</Tag>
                                <Tag color="blue" icon={<TeamOutlined />}>{selectedHo.members} giáo dân</Tag>
                            </div>
                        </div>

                        <Tabs defaultActiveKey="1" items={[
                            {
                                key: '1',
                                label: 'HÀNH TRÌNH LỊCH SỬ',
                                children: (
                                    <Timeline 
                                        mode="left"
                                        className="modal-timeline"
                                        items={selectedHo?.history?.map(item => ({
                                            label: <Text strong style={{color: '#b39164'}}>{item.year}</Text>,
                                            children: item.event
                                        })) || []}
                                    />
                                )
                            },
                            {
                                key: '2',
                                label: 'TỔ CHỨC & VỊ TRÍ',
                                children: (
                                    <div className="modal-info-grid">
                                        <div className="info-item">
                                            <Title level={5}><TeamOutlined /> Tổ chức đoàn thể</Title>
                                            <Paragraph>{selectedHo.organization}</Paragraph>
                                        </div>
                                        <Divider style={{margin: '12px 0'}} />
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Text type="secondary">Vị trí địa lý:</Text>
                                                <Paragraph strong>{selectedHo.distance}</Paragraph>
                                            </Col>
                                            <Col span={12}>
                                                <Text type="secondary">Năm đón Tin Mừng:</Text>
                                                <Paragraph strong>{selectedHo.evangelized}</Paragraph>
                                            </Col>
                                            <Col span={24}>
                                                <Text type="secondary">Nhà thờ hiện tại:</Text>
                                                <Paragraph strong>Xây dựng năm {selectedHo.currentChurch}</Paragraph>
                                            </Col>
                                        </Row>
                                    </div>
                                )
                            }
                        ]} />
                    </div>
                )}
            </Modal>

            <style dangerouslySetInnerHTML={{ __html: `
                /* Nền tảng Layout */
                .main-layout { background: #f8f9fa; min-height: 100vh; font-family: 'Inter', sans-serif; }
                
                /* Hero Banner */
                .hero-banner { 
                    height: 500px; background-position: center; background-size: cover;
                    display: flex; alignItems: flex-end; padding-bottom: 100px; position: relative;
                }
                .hero-content { maxWidth: 1200px; margin: 0 auto; width: 100%; padding: 0 40px; }
                .hero-title { color: #fff !important; margin: 8px 0 !important; fontSize: 48px !important; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); }
                .hero-subtitle { color: #f0f0f0; fontSize: 18px; display: flex; align-items: center; gap: 8px; }
                .diocese-tag { font-weight: 600; padding: 4px 12px; font-size: 14px; border: none; }

                /* Main Content */
                .content-container { maxWidth: 1200px; margin: -60px auto 0; width: 100%; padding: 0 20px 80px; position: relative; z-index: 10; }
                .main-info-card { border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; }

                /* Tabs Custom */
                .custom-tabs .ant-tabs-nav { padding: 0 20px; background: #fff; margin-bottom: 0; }
                .custom-tabs .ant-tabs-tab-btn { font-weight: 600 !important; font-size: 15px; }
                .custom-tabs .ant-tabs-ink-bar { background: #b39164 !important; height: 3px !important; }
                .custom-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn { color: #b39164 !important; }
                .tab-section-title { color: #8c7e6a !important; margin-bottom: 20px !important; border-bottom: 2px solid #f0ece2; display: inline-block; padding-bottom: 4px; }
                .tab-content-text { font-size: 16px; line-height: 1.8; color: #444; }

                /* Priest Card */
                .priest-card { border-radius: 16px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .priest-avatar { border: 4px solid #f0ece2; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                .priest-title { color: #b39164; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; }
                .quick-info-list .ant-list-item { border: none; padding: 8px 0; }

                /* Contact Card */
                .contact-card { background: #2c2c2c; border-radius: 16px; color: #fff; }
                .contact-item { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; }
                .action-button { background: #b39164; border: none; height: 45px; font-weight: 600; margin-top: 10px; }
                .action-button:hover { background: #c5a67c !important; }

                /* Map Card */
                .map-card { border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                .map-container { height: 250px; }
                .map-footer { padding: 12px; text-align: center; background: #fff; color: #b39164; border-top: 1px solid #f0f0f0; }

                /* Subparish Cards */
                .subparish-card { border-radius: 12px; border: 1px solid #f0f0f0; position: relative; overflow: hidden; transition: all 0.3s; }
                .subparish-card:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(179, 145, 100, 0.15); border-color: #b39164; }
                .card-accent { position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #b39164; }

                /* Table Custom */
                .custom-table .ant-table-thead > tr > th { background: #fdfaf5 !important; color: #8c7e6a !important; font-weight: 700; }
                
                /* Footer */
                .main-footer { text-align: center; background: #fff; padding: 60px 20px; border-top: 1px solid #eee; }
                .footer-name { color: #b39164; font-size: 20px; font-weight: 700; letter-spacing: 1px; }
                .footer-info { margin: 10px 0; color: #888; }

                /* Modal Styling */
                .custom-modal .ant-modal-content { border-radius: 16px; overflow: hidden; padding: 0; }
                .modal-scroll-area { padding: 30px; maxHeight: 85vh; overflow-y: auto; }
                .modal-header { text-align: center; margin-bottom: 30px; }
                .modal-tags { margin-top: 15px; display: flex; justify-content: center; gap: 10px; }
                .modal-timeline { margin-top: 30px; padding: 20px; background: #fafafa; border-radius: 12px; }
            `}} />
        </Layout>
    );
};

export default GiaoXuDongQuanFull;