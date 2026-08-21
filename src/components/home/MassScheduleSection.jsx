import React, { useState, useMemo } from "react";
import { Button, Skeleton, Col, Tag } from "antd";
import { motion } from "framer-motion";
import { User, MapPin, Compass } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const MassScheduleSection = ({
  loadingSchedule,
  scheduleList = [],
  navigate,
  openGoogleMaps,
}) => {
  // Xác định tháng/năm hiển thị (ưu tiên lấy theo event đầu tiên hoặc thời gian hiện tại)
  const currentMonthDate = useMemo(() => {
    if (scheduleList.length > 0 && scheduleList[0].event_date) {
      return dayjs(scheduleList[0].event_date);
    }
    return dayjs();
  }, [scheduleList]);

  // Khởi tạo ngày được chọn mặc định là ngày hôm nay (hoặc ngày 1 của tháng)
  const [selectedDate, setSelectedDate] = useState(() => {
    return dayjs().isSame(currentMonthDate, "month")
      ? dayjs().date()
      : currentMonthDate.date();
  });

  // Tính số ô trống cần đẩy ở đầu tháng (Day of week: CN = 0, T2 = 1, ... T7 = 6)
  const firstDayOfMonth = currentMonthDate.startOf("month").day();
  const daysInMonth = currentMonthDate.daysInMonth();

  // Lọc danh sách lịch lễ chuẩn theo cả Ngày, Tháng, Năm
  const filteredScheduleList = useMemo(() => {
    return scheduleList.filter((item) => {
      if (!item.event_date) return false;
      const d = dayjs(item.event_date);
      return (
        d.date() === selectedDate &&
        d.isSame(currentMonthDate, "month") &&
        d.isSame(currentMonthDate, "year")
      );
    });
  }, [scheduleList, selectedDate, currentMonthDate]);

  return (
    <Col xs={24} lg={24}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .gx-phung-vu-section {
              font-family: 'Be Vietnam Pro', sans-serif;
              width: 100%;
              padding: 10px 0;
            }

            .gx-phung-vu-header {
              margin-bottom: 24px;
            }

            .gx-phung-vu-subtitle {
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 1.5px;
              color: #d4af37;
              text-transform: uppercase;
              margin-bottom: 6px;
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .gx-phung-vu-subtitle::before, .gx-phung-vu-subtitle::after {
              content: "";
              display: inline-block;
              width: 24px;
              height: 1px;
              background-color: #d4af37;
              opacity: 0.6;
            }

            .gx-phung-vu-title {
              font-family: 'Playfair Display', serif, sans-serif;
              font-size: clamp(26px, 3.5vw, 36px);
              font-weight: 700;
              color: #0f172a;
              margin: 0 0 6px 0;
              line-height: 1.2;
            }

            .gx-phung-vu-desc {
              font-size: 14px;
              color: #64748b;
              margin: 0;
            }

            .gx-phung-vu-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 24px;
              align-items: start;
            }

            @media (min-width: 992px) {
              .gx-phung-vu-grid {
                grid-template-columns: 1.25fr 0.95fr;
              }
            }

            .gx-mass-list-col {
              display: flex;
              flex-direction: column;
              gap: 14px;
              min-height: 220px;
              width: 100%;
              max-width: 100%;
              box-sizing: border-box;
            }

            .gx-mass-card-item {
              background: #ffffff;
              border-radius: 16px;
              padding: 18px 22px;
              border: 1px solid #e2e8f0;
              box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 16px;
              transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
              width: 100%;
              box-sizing: border-box;
              overflow: hidden;
            }

            .gx-mass-card-item:hover {
              border-color: #d4af37;
              box-shadow: 0 8px 24px rgba(212, 175, 55, 0.12);
              transform: translateY(-2px);
            }

            .gx-mass-time-col {
              font-family: 'Playfair Display', serif, sans-serif;
              font-size: 22px;
              font-weight: 700;
              color: #0f172a;
              min-width: 75px;
              flex-shrink: 0;
              border-right: 1px dashed #cbd5e1;
              padding-right: 12px;
            }

            .gx-mass-info-col {
              flex: 1;
              min-width: 0;
              display: flex;
              flex-direction: column;
              justify-content: center;
            }

            .gx-mass-title-row {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              gap: 10px;
              margin-bottom: 4px;
              flex-wrap: wrap;
            }

            .gx-mass-church-name {
              font-size: 15px;
              font-weight: 700;
              color: #0f172a;
              margin: 0;
              word-break: break-word;
            }

            .gx-mass-tag {
              background: #f8fafc !important;
              color: #0f172a !important;
              border: 1px solid #e2e8f0 !important;
              font-size: 11px !important;
              font-weight: 600 !important;
              border-radius: 20px !important;
              padding: 2px 10px !important;
              margin: 0 !important;
            }

            .gx-mass-meta-priest {
              font-size: 12px;
              color: #475569;
              display: flex;
              align-items: center;
              gap: 5px;
              margin-bottom: 6px;
              word-break: break-word;
            }

            .gx-mass-bottom-row {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 10px;
              margin-top: 4px;
              flex-wrap: wrap;
            }

            .gx-mass-address {
              font-size: 11.5px;
              color: #64748b;
              display: flex;
              align-items: center;
              gap: 4px;
              flex: 1;
              min-width: 140px;
              word-break: break-word;
            }

            .gx-map-btn-inline {
              background: #fdf8e2;
              border: 1px solid #fce8a6;
              color: #856404;
              font-size: 11px;
              font-weight: 600;
              padding: 4px 10px;
              border-radius: 6px;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 4px;
              transition: all 0.2s;
              flex-shrink: 0;
            }

            .gx-map-btn-inline:hover {
              background: #d4af37;
              color: #ffffff;
              border-color: #d4af37;
            }

            .gx-empty-schedule {
              background: #ffffff;
              border-radius: 16px;
              padding: 30px;
              text-align: center;
              color: #64748b;
              border: 1px solid #e2e8f0;
              font-size: 13.5px;
            }

            .gx-mass-actions-row {
              display: flex;
              gap: 12px;
              margin-top: 16px;
            }

            .gx-btn-navy-luxe {
              background: #0f172a !important;
              border-color: #0f172a !important;
              color: #ffffff !important;
              font-weight: 600 !important;
              font-size: 12.5px !important;
              height: 42px !important;
              border-radius: 10px !important;
              flex: 1;
              box-shadow: 0 4px 12px rgba(15, 23, 42, 0.2) !important;
            }

            .gx-calendar-luxe-box {
              background: #0f172a;
              border-radius: 20px;
              padding: 24px;
              color: #ffffff;
              box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.25);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              border: 1px solid rgba(212, 175, 55, 0.2);
              box-sizing: border-box;
              width: 100%;
            }

            .gx-cal-top-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px;
            }

            .gx-cal-month-title {
              font-family: 'Playfair Display', serif, sans-serif;
              font-size: 19px;
              font-weight: 700;
              color: #ffffff;
              margin: 0;
              text-transform: capitalize;
            }

            .gx-cal-week-row {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              text-align: center;
              font-size: 11.5px;
              font-weight: 600;
              color: #94a3b8;
              margin-bottom: 12px;
              text-transform: uppercase;
            }

            .gx-cal-days-grid {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              text-align: center;
              gap: 6px;
            }

            .gx-cal-day-item {
              aspect-ratio: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 13px;
              font-weight: 500;
              color: #e2e8f0;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.2s;
              position: relative;
            }

            .gx-cal-day-item.empty {
              cursor: default;
              pointer-events: none;
            }

            .gx-cal-day-item:not(.empty):hover {
              background: rgba(255, 255, 255, 0.2);
            }

            .gx-cal-day-item.highlight-date {
              background: #d4af37;
              color: #0f172a;
              font-weight: 700;
            }

            .gx-cal-event-dot {
              width: 4px;
              height: 4px;
              background-color: #ffffff;
              border-radius: 50%;
              position: absolute;
              bottom: 5px;
            }

            .gx-cal-bottom-preview {
              margin-top: 24px;
              padding-top: 16px;
              border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .gx-cal-preview-subtitle {
              font-size: 11px;
              color: #d4af37;
              font-weight: 600;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
              display: block;
              text-transform: uppercase;
            }

            .gx-cal-preview-event-line {
              font-size: 13px;
              font-weight: 600;
              color: #ffffff;
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 3px 0;
            }
          `,
        }}
      />

      <div className="gx-phung-vu-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="gx-phung-vu-header">
            <span className="gx-phung-vu-subtitle">Phụng Vụ</span>
            <h2 className="gx-phung-vu-title">Lịch phụng vụ</h2>
            <p className="gx-phung-vu-desc">
              Bấm chọn ngày trên lịch để xem chi tiết lịch lễ cộng đoàn.
            </p>
          </div>

          <div className="gx-phung-vu-grid">
            {/* CỘT TRÁI: DANH SÁCH LỄ CỦA NGÀY ĐƯỢC CHỌN */}
            <div>
              {loadingSchedule ? (
                <div
                  style={{
                    background: "#fff",
                    padding: 24,
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              ) : (
                <div className="gx-mass-list-col">
                  {filteredScheduleList.length > 0 ? (
                    filteredScheduleList.map((item, idx) => {
                      const timeStr = item.event_time
                        ? item.event_time.slice(0, 5)
                        : "19:00";
                      return (
                        <motion.div
                          key={item.event_id || idx}
                          className="gx-mass-card-item"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="gx-mass-time-col">{timeStr}</div>
                          <div className="gx-mass-info-col">
                            <div className="gx-mass-title-row">
                              <h4 className="gx-mass-church-name">
                                {item.church_name}
                              </h4>
                              <Tag className="gx-mass-tag">
                                {item.title || "Lễ thường"}
                              </Tag>
                            </div>
                            {item.priest && (
                              <div className="gx-mass-meta-priest">
                                <User size={12} /> Chủ tế:{" "}
                                <strong>{item.priest}</strong>
                              </div>
                            )}
                            <div className="gx-mass-bottom-row">
                              <div className="gx-mass-address">
                                <MapPin size={12} /> {item.address}
                              </div>
                              <button
                                className="gx-map-btn-inline"
                                onClick={() =>
                                  openGoogleMaps &&
                                  openGoogleMaps(
                                    item.latitude,
                                    item.longitude,
                                    item.address,
                                    item.church_name,
                                  )
                                }
                              >
                                <Compass size={12} /> Chỉ đường
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="gx-empty-schedule">
                      Không có lịch lễ nào trong ngày{" "}
                      <strong>
                        {selectedDate}/{currentMonthDate.format("MM/YYYY")}
                      </strong>
                      .
                    </div>
                  )}
                </div>
              )}

              <div className="gx-mass-actions-row">
                <Button
                  type="primary"
                  className="gx-btn-navy-luxe"
                  onClick={() => navigate && navigate("/lich-phung-vu")}
                >
                  Xem lịch đầy đủ
                </Button>
              </div>
            </div>

            {/* CỘT PHẢI: LỊCH THÁNG TỰ ĐỘNG CHUẨN Ô NĂM/THÁNG */}
            <div className="gx-calendar-luxe-box">
              <div>
                <div className="gx-cal-top-header">
                  <h4 className="gx-cal-month-title">
                    {currentMonthDate.format("MMMM, YYYY")}
                  </h4>
                </div>

                <div className="gx-cal-week-row">
                  <span>CN</span>
                  <span>T2</span>
                  <span>T3</span>
                  <span>T4</span>
                  <span>T5</span>
                  <span>T6</span>
                  <span>T7</span>
                </div>

                <div className="gx-cal-days-grid">
                  {/* Ô trống bổ sung để canh chuẩn thứ trong tuần */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="gx-cal-day-item empty" />
                  ))}

                  {/* Render số ngày thực tế trong tháng */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const isSelected = dayNum === selectedDate;
                    const hasEvent = scheduleList.some((ev) => {
                      if (!ev.event_date) return false;
                      const d = dayjs(ev.event_date);
                      return (
                        d.date() === dayNum &&
                        d.isSame(currentMonthDate, "month") &&
                        d.isSame(currentMonthDate, "year")
                      );
                    });

                    return (
                      <div
                        key={dayNum}
                        className={`gx-cal-day-item ${
                          isSelected ? "highlight-date" : ""
                        }`}
                        onClick={() => setSelectedDate(dayNum)}
                      >
                        <span>{dayNum}</span>
                        {hasEvent && !isSelected && (
                          <div className="gx-cal-event-dot" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="gx-cal-bottom-preview">
                <span className="gx-cal-preview-subtitle">
                  NGÀY ĐÃ CHỌN · {selectedDate}/
                  {currentMonthDate.format("MM/YYYY")}
                </span>
                {filteredScheduleList.length > 0 ? (
                  filteredScheduleList.map((ev, idx) => (
                    <div key={idx} className="gx-cal-preview-event-line">
                      <span style={{ color: "#d4af37", minWidth: 45 }}>
                        {ev.event_time ? ev.event_time.slice(0, 5) : "19:00"}
                      </span>
                      <span
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          flex: 1,
                        }}
                      >
                        {ev.church_name} {ev.priest ? `(${ev.priest})` : ""}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Không có thánh lễ
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Col>
  );
};

export default MassScheduleSection;
