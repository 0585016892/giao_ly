import React, { useEffect, useState, useCallback } from "react";
import {
  Button,
  Tag,
  Space,
  Card,
  Typography,
  ConfigProvider,
  DatePicker,
  Drawer,
  Spin,
} from "antd";
import {
  EnvironmentOutlined,
  UserOutlined,
  CompassOutlined,
  ClockCircleOutlined,
  BookOutlined,
  StarFilled,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useSchedule } from "../hooks/useSchedule";
import { useChurch } from "../hooks/useChurch";

dayjs.locale("vi");
const { Title, Text, Paragraph } = Typography;

const primaryNavy = "#1B365D";
const accentGold = "#D4AF37";
const textDark = "#1E293B";
const softBg = "#FAFAFA";

const TYPE_CONFIG = {
  CN: {
    color: "#dc2626",
    label: "Chúa Nhật",
    bg: "#fef2f2",
    border: "#fca5a5",
  },
  THUONG: {
    color: "#1B365D",
    label: "Thường nhật",
    bg: "#f0f4f9",
    border: "#93c5fd",
  },
  CUOI: {
    color: "#2e7d32",
    label: "Hôn phối",
    bg: "#f0fdf4",
    border: "#86efac",
  },
  AN_TANG: {
    color: "#475569",
    label: "An táng",
    bg: "#f8fafc",
    border: "#cbd5e1",
  },
};

const CommunitySchedulePage = () => {
  const { fetchChurches } = useChurch();
  const { fetchWeek } = useSchedule();

  const [churches, setChurches] = useState([]);
  const [selectedChurchId, setSelectedChurchId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [detailOpen, setDetailOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  // Thêm fetchChurches vào dependency array của useEffect
  useEffect(() => {
    const initChurches = async () => {
      try {
        const res = await fetchChurches();
        const data = res?.data || [];
        setChurches(data);
        if (data.length > 0) {
          setSelectedChurchId(data[0].id);
        }
      } catch (err) {
        console.error("Không lấy được danh sách giáo xứ", err);
      }
    };
    initChurches();
  }, [fetchChurches]);

  const loadScheduleData = useCallback(async () => {
    if (!selectedChurchId) return;
    setLoading(true);
    try {
      const startOfWeek = selectedDate.startOf("week").format("YYYY-MM-DD");
      const res = await fetchWeek({
        week_start: startOfWeek,
        church_id: selectedChurchId,
      });
      setEvents(res.events || []);
    } catch (e) {
      console.error("Lỗi load lịch cộng đoàn:", e);
    } finally {
      setLoading(false);
    }
  }, [selectedChurchId, selectedDate, fetchWeek]);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  const handlePrevWeek = () =>
    setSelectedDate((prev) => prev.subtract(1, "week"));
  const handleNextWeek = () => setSelectedDate((prev) => prev.add(1, "week"));

  const openGoogleMaps = (lat, lng, address, name) => {
    if (lat && lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        "_blank",
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address || ""}`)}`,
        "_blank",
      );
    }
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = selectedDate.startOf("week").add(i, "day");
    return {
      dateObj: day,
      dateStr: day.format("YYYY-MM-DD"),
      dayName: day.format("dddd"),
      formattedDate: day.format("DD/MM"),
      isToday: day.isSame(dayjs(), "day"),
    };
  });

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 14,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <div className="community-schedule-layout">
        <div className="community-schedule-container">
          {/* HEADER SECTION */}
          <div className="community-header-section">
            <div className="header-text-group">
              <span className="sacred-badge">
                <CompassOutlined /> CỘNG ĐOÀN DÂN CHÚA
              </span>
              <Title level={2} className="community-main-title">
                LỊCH PHỤNG VỤ & THÁNH LỄ TRONG TUẦN
              </Title>
              <Paragraph className="community-sub-title">
                Tra cứu giờ cử hành Thánh lễ, các bí tích và hiệp ý cầu nguyện
                tại các nhà thờ trong giáo xứ.
              </Paragraph>
            </div>

            {/* BỘ LỌC CHỌN GIÁO HỌ */}
            <div className="church-filter-scroll-wrap custom-scroll-x">
              <div className="church-filter-pills">
                {churches.map((c) => (
                  <button
                    key={c.id}
                    className={`pill-church-btn ${selectedChurchId === c.id ? "active" : ""}`}
                    onClick={() => setSelectedChurchId(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* THANH ĐIỀU HƯỚNG TUẦN */}
          <Card bordered={false} className="week-navigation-card">
            <div className="nav-card-inner">
              <Space wrap size="small">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePrevWeek}
                  className="nav-arrow-btn"
                  size="middle"
                >
                  Tuần trước
                </Button>
                <Button
                  type="primary"
                  ghost
                  onClick={() => setSelectedDate(dayjs())}
                  style={{
                    borderColor: accentGold,
                    color: primaryNavy,
                    fontWeight: 600,
                  }}
                  size="middle"
                >
                  Hôm nay
                </Button>
                <Button
                  icon={<ArrowRightOutlined />}
                  onClick={handleNextWeek}
                  className="nav-arrow-btn"
                  iconPosition="right"
                  size="middle"
                >
                  Tuần sau
                </Button>
              </Space>

              <div className="nav-center-label">
                <CalendarOutlined style={{ color: accentGold }} />
                <span>
                  {selectedDate.startOf("week").format("DD/MM/YYYY")} —{" "}
                  {selectedDate.endOf("week").format("DD/MM/YYYY")}
                </span>
              </div>

              <div className="nav-date-picker-wrap">
                <DatePicker
                  value={selectedDate}
                  onChange={(val) => val && setSelectedDate(val)}
                  format="DD/MM/YYYY"
                  style={{ width: "100%", borderRadius: 10 }}
                  placeholder="Chọn ngày/tuần"
                />
              </div>
            </div>
          </Card>

          {/* CHÚ THÍCH PHÂN LOẠI */}
          <div className="legend-pills-bar">
            <span style={{ fontSize: 13, fontWeight: 600, color: primaryNavy }}>
              <BookOutlined style={{ marginRight: 4, color: accentGold }} />{" "}
              Loại hình:
            </span>
            {Object.entries(TYPE_CONFIG).map(([key, val]) => (
              <Tag
                key={key}
                style={{
                  background: val.bg,
                  borderColor: val.border,
                  color: val.color,
                  fontWeight: 600,
                  borderRadius: 8,
                  padding: "2px 10px",
                }}
              >
                {val.label}
              </Tag>
            ))}
            <Tag
              style={{
                background: "#fffbe6",
                borderColor: accentGold,
                color: primaryNavy,
                fontWeight: 700,
                borderRadius: 8,
                padding: "2px 10px",
              }}
            >
              <StarFilled style={{ color: accentGold, marginRight: 4 }} /> Lễ
              Trọng
            </Tag>
          </div>

          {/* KHU VỰC HIỂN THỊ DANH SÁCH LỄ */}
          {loading ? (
            <div className="loading-container">
              <Spin size="large" tip="Đang cập nhật lịch phụng vụ..." />
            </div>
          ) : (
            <div className="week-grid-container">
              {weekDays.map((dayInfo, idx) => {
                const dayEvents = events.filter(
                  (e) =>
                    dayjs(e.event_date).format("YYYY-MM-DD") ===
                    dayInfo.dateStr,
                );

                return (
                  <div
                    key={idx}
                    className={`day-schedule-column ${dayInfo.isToday ? "today-highlight-col" : ""}`}
                  >
                    <div className="day-col-header">
                      <div className="day-name-wrapper">
                        <span className="day-name-text">{dayInfo.dayName}</span>
                        {dayInfo.isToday && (
                          <span className="today-pill">Hôm nay</span>
                        )}
                      </div>
                      <span className="day-date-text">
                        {dayInfo.formattedDate}
                      </span>
                    </div>

                    <div className="day-events-list custom-scroll">
                      {dayEvents.length > 0 ? (
                        dayEvents.map((item) => {
                          const cfg =
                            TYPE_CONFIG[item.type] || TYPE_CONFIG.THUONG;
                          const timeStr = item.event_time
                            ? item.event_time.slice(0, 5)
                            : "--:--";

                          return (
                            <div
                              key={item.id}
                              className={`public-event-card ${item.is_priority ? "priority-card" : ""}`}
                              style={{
                                borderLeftColor: item.is_priority
                                  ? accentGold
                                  : cfg.color,
                              }}
                              onClick={() => {
                                setActiveEvent(item);
                                setDetailOpen(true);
                              }}
                            >
                              <div className="event-card-top">
                                <span className="event-time-badge">
                                  <ClockCircleOutlined /> {timeStr}
                                </span>
                                {item.is_priority && (
                                  <Tag
                                    color="gold"
                                    style={{
                                      margin: 0,
                                      fontWeight: 700,
                                      borderRadius: 6,
                                      fontSize: 10,
                                    }}
                                  >
                                    <StarFilled /> Trọng
                                  </Tag>
                                )}
                              </div>

                              <h4 className="public-event-title">
                                {item.title}
                              </h4>

                              {item.priest && (
                                <div className="public-event-meta">
                                  <UserOutlined style={{ color: accentGold }} />
                                  <span>
                                    Chủ tế: <strong>{item.priest}</strong>
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="no-events-slot">
                          <Text
                            type="secondary"
                            style={{ fontSize: 12, fontStyle: "italic" }}
                          >
                            Chưa có lịch lễ
                          </Text>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* DRAWER CHI TIẾT */}
        <Drawer
          title={
            <div className="drawer-title-box">
              <BookOutlined style={{ color: accentGold }} />
              <span>Chi Tiết Thánh Lễ & Ý Nguyện</span>
            </div>
          }
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          width={420}
          className="community-detail-drawer"
          footer={
            <div style={{ display: "flex", gap: 10, padding: "8px 0" }}>
              <Button
                type="primary"
                block
                icon={<CompassOutlined />}
                onClick={() => {
                  if (activeEvent) {
                    openGoogleMaps(
                      activeEvent.latitude,
                      activeEvent.longitude,
                      activeEvent.address,
                      activeEvent.church_name,
                    );
                  }
                }}
                style={{
                  backgroundColor: primaryNavy,
                  borderRadius: 10,
                  fontWeight: 600,
                  height: 44,
                }}
              >
                Chỉ Đường Google Maps
              </Button>
            </div>
          }
        >
          {activeEvent && (
            <div className="event-detail-content">
              <div
                className="detail-hero-box"
                style={{
                  background: activeEvent.is_priority ? "#fffbe6" : "#f0f4f9",
                }}
              >
                <span className="detail-time-big">
                  {activeEvent.event_time
                    ? activeEvent.event_time.slice(0, 5)
                    : ""}
                </span>
                <span className="detail-date-sub">
                  Ngày {dayjs(activeEvent.event_date).format("DD/MM/YYYY")} (
                  {dayjs(activeEvent.event_date).format("dddd")})
                </span>
                <h3 className="detail-title-main">{activeEvent.title}</h3>
              </div>

              <div className="detail-info-rows">
                <div className="info-row-item">
                  <span className="info-label">
                    <UserOutlined style={{ color: accentGold }} /> Chủ tế:
                  </span>
                  <span className="info-val">
                    {activeEvent.priest || "Đang cập nhật"}
                  </span>
                </div>

                <div className="info-row-item">
                  <span className="info-label">
                    <EnvironmentOutlined style={{ color: primaryNavy }} /> Địa
                    điểm:
                  </span>
                  <span className="info-val">
                    {activeEvent.church_name || "Nhà thờ Giáo xứ"}
                  </span>
                </div>

                {activeEvent.address && (
                  <div className="info-row-item">
                    <span className="info-label">Địa chỉ:</span>
                    <span className="info-val">{activeEvent.address}</span>
                  </div>
                )}

                {activeEvent.note && (
                  <div className="note-box-section">
                    <Text
                      strong
                      style={{
                        color: primaryNavy,
                        display: "block",
                        marginBottom: 4,
                      }}
                    >
                      Ý nguyện / Ghi chú:
                    </Text>
                    <Paragraph
                      style={{
                        margin: 0,
                        color: textDark,
                        fontStyle: "italic",
                      }}
                    >
                      "{activeEvent.note}"
                    </Paragraph>
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>

        {/* CSS TỐI ƯU RESPONSIVE */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

            .community-schedule-layout {
              background: ${softBg};
              min-height: 100vh;
              padding: 24px 12px 60px 12px;
              font-family: 'Be Vietnam Pro', sans-serif;
              color: ${textDark};
            }

            @media (min-width: 768px) {
              .community-schedule-layout {
                padding: 40px 20px 80px 20px;
              }
            }

            .community-schedule-container {
              max-width: 1350px;
              margin: 0 auto;
            }

            .community-header-section {
              display: flex;
              flex-direction: column;
              gap: 16px;
              margin-bottom: 20px;
            }

            @media (min-width: 992px) {
              .community-header-section {
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-end;
              }
            }

            .sacred-badge {
              background: rgba(212, 175, 55, 0.15);
              border: 1px solid ${accentGold};
              color: ${primaryNavy};
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1px;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              margin-bottom: 8px;
            }

            .community-main-title {
              font-family: 'Playfair Display', Georgia, serif !important;
              color: ${primaryNavy} !important;
              margin: 0 !important;
              font-weight: 700 !important;
              font-size: clamp(22px, 4vw, 32px) !important;
            }

            .community-sub-title {
              color: #64748b;
              margin: 6px 0 0 0 !important;
              font-size: 13px;
              max-width: 600px;
            }

            @media (min-width: 768px) {
              .community-sub-title { font-size: 14px; }
            }

            .church-filter-scroll-wrap {
              width: 100%;
              overflow-x: auto;
              padding-bottom: 4px;
            }

            @media (min-width: 992px) {
              .church-filter-scroll-wrap { width: auto; overflow: visible; }
            }

            .church-filter-pills {
              display: flex;
              gap: 8px;
              white-space: nowrap;
            }

            .pill-church-btn {
              background: #ffffff;
              border: 1px solid rgba(27, 54, 93, 0.15);
              color: ${primaryNavy};
              padding: 6px 14px;
              border-radius: 20px;
              font-weight: 600;
              font-size: 12px;
              cursor: pointer;
              transition: all 0.25s ease;
              box-shadow: 0 2px 6px rgba(0,0,0,0.02);
            }

            @media (min-width: 768px) {
              .pill-church-btn { padding: 8px 18px; font-size: 13px; }
            }

            .pill-church-btn:hover { border-color: ${accentGold}; }

            .pill-church-btn.active {
              background: ${primaryNavy};
              color: #ffffff;
              border-color: ${primaryNavy};
              box-shadow: 0 4px 12px rgba(27, 54, 93, 0.25);
            }

            .week-navigation-card {
              border-radius: 14px !important;
              background: #ffffff !important;
              border: 1px solid rgba(212, 175, 55, 0.2) !important;
              margin-bottom: 16px;
              box-shadow: 0 6px 20px rgba(27, 54, 93, 0.04) !important;
              padding: 8px !important;
            }

            .nav-card-inner {
              display: flex;
              flex-direction: column;
              gap: 12px;
              align-items: stretch;
            }

            @media (min-width: 768px) {
              .nav-card-inner {
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              }
            }

            .nav-center-label {
              text-align: center;
              font-family: 'Playfair Display', serif;
              font-weight: 700;
              color: ${primaryNavy};
              font-size: 15px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;
            }

            .nav-date-picker-wrap {
              width: 100%;
            }

            @media (min-width: 768px) {
              .nav-date-picker-wrap { width: 170px; }
            }

            .nav-arrow-btn {
              border-radius: 10px !important;
              font-weight: 600;
              border-color: rgba(27, 54, 93, 0.2) !important;
              font-size: 12px;
            }

            .legend-pills-bar {
              display: flex;
              align-items: center;
              gap: 8px;
              flex-wrap: wrap;
              margin-bottom: 20px;
              padding: 0 2px;
            }

            .week-grid-container {
              display: grid;
              grid-template-columns: 1fr;
              gap: 14px;
            }

            @media (min-width: 640px) {
              .week-grid-container {
                grid-template-columns: repeat(2, 1fr);
              }
            }

            @media (min-width: 1024px) {
              .week-grid-container {
                grid-template-columns: repeat(7, 1fr);
                gap: 12px;
              }
            }

            .day-schedule-column {
              background: #ffffff;
              border-radius: 14px;
              border: 1px solid #e2e8f0;
              display: flex;
              flex-direction: column;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.02);
              transition: all 0.3s ease;
            }

            .day-schedule-column.today-highlight-col {
              border-color: ${accentGold};
              box-shadow: 0 8px 25px rgba(212, 175, 55, 0.15);
            }

            .day-col-header {
              background: #f8fafc;
              padding: 10px;
              text-align: center;
              border-bottom: 1px solid #e2e8f0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            @media (min-width: 1024px) {
              .day-col-header {
                flex-direction: column;
                padding: 12px 8px;
              }
            }

            .today-highlight-col .day-col-header {
              background: linear-gradient(135deg, ${primaryNavy}, #2c4a7c);
              color: #ffffff;
            }

            .day-name-wrapper {
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .day-name-text {
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              color: ${primaryNavy};
            }

            @media (min-width: 1024px) {
              .day-name-text { font-size: 14px; }
            }

            .today-highlight-col .day-name-text {
              color: #ffffff;
            }

            .today-pill {
              background: ${accentGold};
              color: ${primaryNavy};
              font-size: 9px;
              font-weight: 800;
              padding: 1px 5px;
              border-radius: 8px;
            }

            .day-date-text {
              font-size: 12px;
              color: #64748b;
              font-weight: 600;
            }

            .today-highlight-col .day-date-text {
              color: #cbd5e1;
            }

            .day-events-list {
              padding: 10px;
              flex-grow: 1;
              max-height: 380px;
              overflow-y: auto;
              display: flex;
              flex-direction: column;
              gap: 8px;
            }

            @media (min-width: 1024px) {
              .day-events-list {
                max-height: 440px;
              }
            }

            .public-event-card {
              background: #ffffff;
              border-radius: 10px;
              padding: 10px;
              border: 1px solid #f1f5f9;
              border-left: 4px solid ${primaryNavy};
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0 2px 6px rgba(0,0,0,0.02);
            }

            .public-event-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(27, 54, 93, 0.1);
              border-color: rgba(212, 175, 55, 0.4);
            }

            .public-event-card.priority-card {
              background: #fffdf5;
              border-color: rgba(212, 175, 55, 0.4);
            }

            .event-card-top {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;
            }

            .event-time-badge {
              font-size: 11px;
              font-weight: 700;
              color: ${accentGold};
              background: rgba(27, 54, 93, 0.06);
              padding: 2px 6px;
              border-radius: 6px;
              display: inline-flex;
              align-items: center;
              gap: 4px;
            }

            .public-event-title {
              font-size: 13px;
              font-weight: 700;
              color: ${primaryNavy};
              margin: 0 0 6px 0;
              line-height: 1.35;
            }

            .public-event-meta {
              font-size: 11px;
              color: #64748b;
              display: flex;
              align-items: center;
              gap: 4px;
            }

            .no-events-slot {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100%;
              min-height: 80px;
            }

            @media (min-width: 1024px) {
              .no-events-slot { min-height: 150px; }
            }

            .loading-container {
              padding: 60px 0;
              text-align: center;
            }

            .drawer-title-box {
              display: flex;
              align-items: center;
              gap: 8px;
              font-family: 'Playfair Display', serif;
              color: ${primaryNavy};
              font-size: 17px;
              font-weight: 700;
            }

            .detail-hero-box {
              padding: 20px;
              border-radius: 14px;
              text-align: center;
              margin-bottom: 20px;
              border: 1px solid rgba(212, 175, 55, 0.3);
            }

            .detail-time-big {
              font-size: 28px;
              font-weight: 800;
              color: ${primaryNavy};
              display: block;
              line-height: 1;
              margin-bottom: 4px;
            }

            .detail-date-sub {
              font-size: 12px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }

            .detail-title-main {
              font-size: 17px;
              font-weight: 700;
              color: ${primaryNavy};
              margin: 10px 0 0 0;
            }

            .detail-info-rows {
              display: flex;
              flex-direction: column;
              gap: 14px;
            }

            .info-row-item {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              padding-bottom: 10px;
              border-bottom: 1px solid #f1f5f9;
            }

            .info-label {
              font-weight: 600;
              color: #64748b;
              font-size: 13px;
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .info-val {
              font-weight: 700;
              color: ${textDark};
              font-size: 13px;
              text-align: right;
              max-width: 60%;
            }

            .note-box-section {
              background: #f8fafc;
              padding: 14px;
              border-radius: 10px;
              border-left: 3px solid ${accentGold};
              margin-top: 6px;
            }

            .custom-scroll::-webkit-scrollbar { width: 3px; }
            .custom-scroll::-webkit-scrollbar-thumb {
              background: rgba(212, 175, 55, 0.3);
              border-radius: 4px;
            }

            .custom-scroll-x::-webkit-scrollbar { height: 4px; }
            .custom-scroll-x::-webkit-scrollbar-thumb {
              background: rgba(27, 54, 93, 0.2);
              border-radius: 4px;
            }
          `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default CommunitySchedulePage;
