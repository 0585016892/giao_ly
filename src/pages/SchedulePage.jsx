import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Badge,
  ConfigProvider,
  Spin,
  Empty,
  Button,
} from "antd";
import {
  FireOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getWeekSchedule } from "../api/scheduleApi";

dayjs.locale("vi");

const { Title, Text, Paragraph } = Typography;

const SchedulePage = () => {
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentWeekStart, setCurrentWeekStart] = useState(
    dayjs().startOf("week").add(1, "day"),
  );

  const primaryGold = "#b39164";
  const deepBrown = "#5d4037";
  const softCream = "#fcfaf2";

  const fetchScheduleData = async (startDate) => {
    try {
      setLoading(true);
      const formattedDate = startDate.format("YYYY-MM-DD");

      const res = await getWeekSchedule({
        start_date: formattedDate,
      });

      // Đọc cấu trúc mảng từ API của bạn
      const events = res?.data?.data || res?.data || [];

      const grouped = events.reduce((acc, curr) => {
        const date = curr.event_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
      }, {});

      const sortedDays = Object.keys(grouped)
        .sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
        .map((date) => ({
          date,
          items: grouped[date].sort((a, b) =>
            a.event_time.localeCompare(b.event_time),
          ),
        }));

      setWeeklySchedule(sortedDays);
    } catch (err) {
      console.error("Lỗi gọi API lịch lễ:", err);
      setWeeklySchedule([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Lịch Phụng Vụ & Giờ Lễ | Giáo xứ Đồng Quan";
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    fetchScheduleData(currentWeekStart);
  }, [currentWeekStart]);

  const handleChangeWeek = (direction) => {
    if (direction === "next") {
      setCurrentWeekStart(currentWeekStart.add(1, "week"));
    } else {
      setCurrentWeekStart(currentWeekStart.subtract(1, "week"));
    }
  };

  const currentWeekEnd = currentWeekStart.add(6, "day");

  // Tách biệt Lễ Chúa Nhật và Lễ Ngày Thường dựa trên dayjs.day()
  const sundaySchedule = weeklySchedule.find(
    (day) => dayjs(day.date).day() === 0,
  );
  const weekdaySchedules = weeklySchedule.filter(
    (day) => dayjs(day.date).day() !== 0,
  );

  return (
    <ConfigProvider theme={{ token: { colorPrimary: primaryGold } }}>
      <div className="schedule-page-wrapper">
        <div className="schedule-page-container">
          {/* 1. HEADER EDITORIAL BANNER */}
          <header className="schedule-header" data-aos="fade-up">
            <div className="header-text-block">
              <Text className="sub-brand-tag">• PHỤNG VỤ CỘNG ĐOÀN •</Text>
              <Title className="main-headline">
                LỊCH THÁNH LỄ <span>& PHỤNG VỤ</span>
              </Title>
              <div className="headline-divider" />
              <Paragraph className="lead-paragraph">
                "Hãy đến mà xem" (Jn 1,39). Hiệp thông cùng Giáo hội, cộng đoàn
                Giáo xứ Đồng Quan sốt sắng quy tụ quanh bàn tiệc Lời Chúa và
                Thánh Thể qua các giờ phụng vụ hằng ngày.
              </Paragraph>
            </div>

            {/* Bộ điều khiển chọn tuần */}
            <div className="week-controller-bar">
              <Button
                icon={<LeftOutlined />}
                shape="circle"
                onClick={() => handleChangeWeek("prev")}
              />
              <div className="week-range-text">
                <CalendarOutlined
                  style={{ marginRight: 8, color: primaryGold }}
                />
                <Text strong>
                  Tuần từ: {currentWeekStart.format("DD/MM")} — Đến:{" "}
                  {currentWeekEnd.format("DD/MM/YYYY")}
                </Text>
              </div>
              <Button
                icon={<RightOutlined />}
                shape="circle"
                onClick={() => handleChangeWeek("next")}
              />
            </div>
          </header>

          {loading ? (
            <div className="schedule-loading-box">
              <Spin size="large" tip="Đang đồng bộ lịch phụng vụ Giáo xứ..." />
            </div>
          ) : weeklySchedule.length === 0 ? (
            <div className="schedule-empty-box">
              <Empty description="Hiện tại chưa có lịch phụng vụ cho tuần này. Ban Hành Giáo đang cập nhật." />
            </div>
          ) : (
            <div className="schedule-grid-body">
              <Row gutter={[40, 40]}>
                {/* 2. CỘT TRÁI: NGÀY CHÚA NHẬT (NỔI BẬT ĐIỆN ẢNH) */}
                <Col xs={24} lg={10} data-aos="zoom-in">
                  <div className="sunday-highlight-panel">
                    <div className="sunday-header">
                      <FireOutlined className="sunday-fire-icon" />
                      <Title level={3} className="sunday-panel-title">
                        NGÀY CHÚA NHẬT
                      </Title>
                    </div>

                    {sundaySchedule ? (
                      <div className="sunday-content-list">
                        <Text className="sunday-date-text">
                          Ngày{" "}
                          {dayjs(sundaySchedule.date).format(
                            "DD [Tháng] MM [Năm] YYYY",
                          )}
                        </Text>

                        {sundaySchedule.items.map((item, i) => (
                          <div
                            className={`sunday-mass-card ${item.type === "TRONG" ? "mass-priority-border" : ""}`}
                            key={i}
                          >
                            <div className="mass-time-box">
                              <ClockCircleOutlined />
                              {/* Cắt chuỗi lấy HH:mm (ví dụ "05:00:00" -> "05:00") */}
                              <span>
                                {item.event_time
                                  ? item.event_time.slice(0, 5)
                                  : "00:00"}
                              </span>
                            </div>

                            <div className="mass-detail-box">
                              <div className="mass-title-row">
                                <Title level={5} className="mass-title">
                                  {item.title}
                                </Title>
                                {item.is_priority === 1 && (
                                  <Badge
                                    status="error"
                                    count="LỄ TRỌNG"
                                    className="priority-badge"
                                  />
                                )}
                              </div>

                              {/* Đổ dữ liệu Cha chủ tế từ API */}
                              {item.priest && (
                                <Text className="mass-meta-text">
                                  <UserOutlined /> Chủ tế: {item.priest}
                                </Text>
                              )}

                              <Text className="mass-location">
                                <EnvironmentOutlined />{" "}
                                {item.church_name || "Nhà thờ Chính Giáo xứ"}
                              </Text>

                              {/* Đổ dữ liệu Ghi chú/Note bài lễ từ API nếu có */}
                              {item.note && item.note !== "abc" && (
                                <div className="mass-note-box">
                                  <InfoCircleOutlined />{" "}
                                  <Text className="note-text">{item.note}</Text>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-mass-sunday">
                        <Text>
                          Không tìm thấy dữ liệu giờ lễ Chúa Nhật của tuần này.
                        </Text>
                      </div>
                    )}
                  </div>
                </Col>

                {/* 3. CỘT PHẢI: CÁC NGÀY TRONG TUẦN (MỤC VỤ FLAT TIMELINE) */}
                <Col xs={24} lg={14}>
                  <div className="weekdays-panel">
                    <div className="weekday-header-title">
                      <Title level={4} className="weekday-main-title">
                        THỜI GIAN BIỂU NGÀY THƯỜNG
                      </Title>
                    </div>

                    <div className="weekday-rows-container">
                      {weekdaySchedules.map((day, idx) => (
                        <div
                          className="weekday-row-item"
                          key={idx}
                          data-aos="fade-left"
                          data-aos-delay={idx * 50}
                        >
                          <div className="row-date-side">
                            <span className="day-name-text">
                              {dayjs(day.date).format("dddd")}
                            </span>
                            <span className="day-num-text">
                              {dayjs(day.date).format("DD/MM")}
                            </span>
                          </div>

                          <div className="row-events-side">
                            {day.items.map((item, i) => (
                              <div className="mass-inline-card" key={i}>
                                <span className="pill-time">
                                  {item.event_time
                                    ? item.event_time.slice(0, 5)
                                    : "00:00"}
                                </span>
                                <div className="inline-mass-body">
                                  <div className="inline-title-group">
                                    <span className="pill-title">
                                      {item.title}
                                    </span>
                                    {item.is_priority === 1 && (
                                      <span className="pill-priority-tag">
                                        Lễ Trọng
                                      </span>
                                    )}
                                  </div>
                                  <div className="inline-meta-group">
                                    {item.priest && (
                                      <span className="inline-meta-item">
                                        <UserOutlined /> {item.priest}
                                      </span>
                                    )}
                                    <span className="inline-meta-item">
                                      <EnvironmentOutlined />{" "}
                                      {item.church_name || "Nhà thờ Chính"}
                                    </span>
                                  </div>
                                  {item.note && item.note !== "abc" && (
                                    <div className="inline-note-text">
                                      <InfoCircleOutlined /> {item.note}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </div>

        {/* TOÀN BỘ HỆ THỐNG CSS PHẲNG TRẢI ĐỀU 100% CẢ RESPONSIVE ĐIỆN THOẠI */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .schedule-page-wrapper { background: #ffffff; min-height: 100vh; padding-bottom: 80px; width: 100%; color: #121212; }
          .schedule-page-container { width: 100%; padding: 0 40px; margin: 0 auto; }

          /* Header Layout */
          .schedule-header { padding: 60px 0 30px; border-bottom: 1px solid #eaeaea; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 30px; }
          .header-text-block { max-width: 700px; }
          .sub-brand-tag { font-size: 11px; font-weight: 700; color: ${primaryGold}; letter-spacing: 1.5px; text-transform: uppercase; }
          .main-headline { font-size: 38px !important; font-weight: 800 !important; color: ${deepBrown} !important; margin: 8px 0 16px 0 !important; letter-spacing: -0.5px; }
          .main-headline span { font-weight: 400; font-style: italic; color: transparent; -webkit-text-stroke: 1px ${deepBrown}; }
          .headline-divider { width: 80px; height: 3px; background: ${primaryGold}; border-radius: 2px; margin-bottom: 16px; }
          .lead-paragraph { font-size: 13px; color: #666; line-height: 1.6; margin: 0 !important; text-align: justify; }

          /* Controller tuần */
          .week-controller-bar { display: flex; align-items: center; gap: 14px; background: ${softCream}; padding: 10px 24px; border-radius: 100px; border: 1px solid #f5ebe6; height: 48px; }
          .week-range-text { font-size: 13px; color: ${deepBrown}; white-space: nowrap; display: flex; align-items: center; }

          .schedule-loading-box { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 40vh; }
          .schedule-loading-box .ant-spin-dot-item { background-color: ${primaryGold} !important; }
          .schedule-grid-body { padding: 40px 0 0; }

          /* 2. STYLE PANEL CHÚA NHẬT (NỔI BẬT ĐẲNG CẤP) */
          .sunday-highlight-panel { background: linear-gradient(135deg, ${deepBrown} 0%, #8d6e63 100%); border-radius: 24px; padding: 35px; color: white; box-shadow: 0 15px 35px rgba(93, 64, 55, 0.15); height: 100%; position: relative; overflow: hidden; }
          .sunday-highlight-panel::after { content: "†"; position: absolute; right: -10px; bottom: -30px; font-size: 180px; opacity: 0.04; color: #fff; }
          .sunday-header { display: flex; align-items: center; gap: 12px; margin-bottom: 25px; }
          .sunday-fire-icon { font-size: 22px; color: ${primaryGold}; }
          .sunday-panel-title { color: #fff !important; font-size: 18px !important; font-weight: 700 !important; margin: 0 !important; letter-spacing: 1px; }
          .sunday-date-text { display: block; font-size: 13px; color: ${primaryGold}; font-weight: 600; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
          
          /* Card chi tiết Chúa Nhật */
          .sunday-mass-card { display: flex; align-items: flex-start; background: rgba(255, 255, 255, 0.07); padding: 18px 20px; border-radius: 16px; margin-bottom: 14px; border: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; }
          .sunday-mass-card:hover { background: rgba(255, 255, 255, 0.14); transform: translateY(-2px); }
          .mass-priority-border { border-color: ${primaryGold} !important; background: rgba(179, 145, 100, 0.12); }
          
          .mass-time-box { display: flex; align-items: center; gap: 8px; font-size: 18px; font-weight: 800; color: ${primaryGold}; border-right: 1px solid rgba(255,255,255,0.15); padding-right: 16px; min-width: 90px; flex-shrink: 0; margin-top: 2px; }
          .mass-detail-box { padding-left: 18px; flex: 1; display: flex; flex-direction: column; gap: 4px; }
          .mass-title-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
          .mass-title { color: #fff !important; font-size: 15px !important; font-weight: 700 !important; margin: 0 !important; }
          .mass-meta-text { font-size: 12px; color: rgba(255,255,255,0.75); display: flex; align-items: center; gap: 6px; }
          .mass-location { font-size: 12px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 6px; }
          .priority-badge .ant-badge-count { background-color: #ff4d4f !important; font-size: 9px; font-weight: 700; border: none; height: 16px; line-height: 16px; border-radius: 4px; }
          
          /* Ghi chú trong Card */
          .mass-note-box { background: rgba(0,0,0,0.15); padding: 6px 12px; border-radius: 8px; margin-top: 6px; font-size: 11px; color: rgba(255,255,255,0.7); display: flex; align-items: center; gap: 6px; border-left: 2px solid ${primaryGold}; }
          .note-text { color: rgba(255,255,255,0.85); font-size: 11px; }

          /* 3. STYLE PANEL NGÀY THƯỜNG TRONG TUẦN */
          .weekdays-panel { height: 100%; }
          .weekday-header-title { border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 24px; }
          .weekday-main-title { font-size: 16px !important; font-weight: 700 !important; color: #111 !important; margin: 0 !important; letter-spacing: 0.5px; }
          .weekday-rows-container { display: flex; flex-direction: column; gap: 16px; }
          
          /* Mỗi hàng ngày thường */
          .weekday-row-item { display: flex; align-items: flex-start; padding: 20px; background: ${softCream}; border-radius: 20px; border: 1px solid transparent; transition: all 0.3s ease; }
          .weekday-row-item:hover { background: #ffffff; border-color: ${primaryGold}; transform: translateX(6px); box-shadow: 0 8px 25px rgba(93,64,55,0.05); }
          .row-date-side { min-width: 100px; border-right: 2px solid rgba(179, 145, 100, 0.25); display: flex; flex-direction: column; line-height: 1.3; flex-shrink: 0; }
          .day-name-text { font-weight: 800; color: ${deepBrown}; text-transform: capitalize; font-size: 14px; }
          .day-num-text { font-size: 11px; color: #8c8c8c; font-weight: 600; }
          
          /* Khối sự kiện ngày thường mục vụ */
          .row-events-side { padding-left: 20px; display: flex; flex-direction: column; gap: 14px; flex: 1; width: 100%; }
          .mass-inline-card { display: flex; align-items: flex-start; gap: 14px; width: 100%; }
          .pill-time { color: ${primaryGold}; font-size: 13px; font-weight: 800; background: #fff; padding: 3px 12px; border-radius: 50px; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.02); flex-shrink: 0; }
          .inline-mass-body { display: flex; flex-direction: column; gap: 2px; flex: 1; }
          .inline-title-group { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
          .pill-title { font-weight: 700; color: #222; font-size: 14px; }
          .pill-priority-tag { background: #fff1f0; border: 1px solid #ffa39e; color: #f5222d; font-size: 9px; font-weight: 700; padding: 0 6px; border-radius: 4px; text-transform: uppercase; }
          .inline-meta-group { display: flex; gap: 12px; font-size: 12px; color: #666; flex-wrap: wrap; margin-top: 2px; }
          .inline-meta-item { display: flex; align-items: center; gap: 4px; }
          .inline-note-text { font-size: 11px; color: #888; display: flex; align-items: center; gap: 4px; margin-top: 3px; background: rgba(0,0,0,0.02); padding: 4px 10px; border-radius: 6px; border-left: 2px solid ${primaryGold}; width: fit-content; }

          /* CHUẨN ĐỒNG BỘ RESPONSIVE CHO DI ĐỘNG */
          @media (max-width: 1024px) {
            .schedule-header { flex-direction: column; align-items: flex-start; gap: 20px; }
            .week-controller-bar { width: 100%; justify-content: space-between; }
          }
          @media (max-width: 768px) {
            .schedule-page-container { padding: 0 16px; }
            .schedule-header { padding: 40px 0 20px; }
            .main-headline { font-size: 28px !important; }
            .sunday-highlight-panel { padding: 24px; }
            .sunday-mass-card { flex-direction: column; gap: 12px; padding: 16px; }
            .mass-time-box { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.15); width: 100%; padding-right: 0; padding-bottom: 8px; font-size: 16px; }
            .mass-detail-box { padding-left: 0; width: 100%; }
            .weekday-row-item { flex-direction: column; gap: 16px; padding: 16px; }
            .row-date-side { border-right: none; border-bottom: 1px solid rgba(179, 145, 100, 0.2); width: 100%; padding-bottom: 8px; }
            .row-events-side { padding-left: 0; }
            .mass-inline-card { flex-direction: column; gap: 8px; border-bottom: 1px dashed #e6dfd9; padding-bottom: 12px; }
            .mass-inline-card:last-child { border-bottom: none; padding-bottom: 0; }
            .pill-time { width: fit-content; }
          }
        `,
          }}
        />
      </div>
    </ConfigProvider>
  );
};

export default SchedulePage;
