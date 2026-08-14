import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Button,
  Tag,
  Card,
  Typography,
  ConfigProvider,
  DatePicker,
  Drawer,
  Spin,
  Empty,
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
  FilterOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import viVN from "antd/lib/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";

import { useSchedule } from "../hooks/useSchedule";
import { useChurch } from "../hooks/useChurch";

dayjs.locale("vi");

const { Title, Text, Paragraph } = Typography;

/* =========================================================
   CONFIG & PALETTE
========================================================= */

const primaryNavy = "#1B365D";
const accentGold = "#D4AF37";
const textDark = "#1E293B";
const softBg = "#F8FAFC";

const TYPE_CONFIG = {
  CN: {
    color: "#dc2626",
    label: "Chúa Nhật",
    bg: "#fef2f2",
    border: "#fca5a5",
    dot: "#dc2626",
  },
  THUONG: {
    color: "#1B365D",
    label: "Thường nhật",
    bg: "#f0f4f9",
    border: "#93c5fd",
    dot: "#1B365D",
  },
  CUOI: {
    color: "#2e7d32",
    label: "Hôn phối",
    bg: "#f0fdf4",
    border: "#86efac",
    dot: "#2e7d32",
  },
  AN_TANG: {
    color: "#475569",
    label: "An táng",
    bg: "#f8fafc",
    border: "#cbd5e1",
    dot: "#475569",
  },
};

const ALL_TYPES = Object.keys(TYPE_CONFIG);

/* =========================================================
   HELPERS
========================================================= */

const getEventType = (event) => {
  return TYPE_CONFIG[event?.type] ? event.type : "THUONG";
};

const getEventTime = (event) => {
  if (!event?.event_time) return "--:--";
  return String(event.event_time).slice(0, 5);
};

const sortEvents = (events = []) => {
  return [...events].sort((a, b) => {
    const dateA = a.event_date ? dayjs(a.event_date).valueOf() : 0;
    const dateB = b.event_date ? dayjs(b.event_date).valueOf() : 0;
    if (dateA !== dateB) return dateA - dateB;
    return getEventTime(a).localeCompare(getEventTime(b));
  });
};

/* =========================================================
   EVENT BADGE (MONTH VIEW)
========================================================= */

const EventBadge = ({ event, onClick }) => {
  const type = getEventType(event);
  const config = TYPE_CONFIG[type];
  const time = getEventTime(event);

  return (
    <button
      type="button"
      className={`event-badge ${
        event.is_priority ? "event-badge-priority" : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      style={{
        background: event.is_priority ? "#fffbe6" : config.bg,
        borderLeftColor: event.is_priority ? accentGold : config.dot,
        color: config.color,
      }}
    >
      <div className="event-badge-title">
        <span className="event-badge-time">{time}</span> {event.title}
      </div>
    </button>
  );
};

/* =========================================================
   MONTH VIEW
========================================================= */

const MonthView = ({
  selectedDate,
  events,
  filters,
  onDayClick,
  onEventClick,
}) => {
  const monthStart = selectedDate.startOf("month");
  const daysInMonth = selectedDate.daysInMonth();
  const firstDayIndex = monthStart.day(); // CN = 0

  const cells = [
    ...Array(firstDayIndex).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const getEventsForDay = (day) => {
    if (!day) return [];
    const date = selectedDate.date(day).format("YYYY-MM-DD");
    return sortEvents(
      events.filter(
        (event) =>
          event.event_date &&
          dayjs(event.event_date).format("YYYY-MM-DD") === date &&
          filters.includes(getEventType(event)),
      ),
    );
  };

  return (
    <div className="calendar-month-wrapper">
      <div className="calendar-week-header">
        {["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map(
          (day, index) => (
            <div
              key={day}
              className="calendar-week-header-item"
              style={{ color: index === 0 ? "#dc2626" : "#475569" }}
            >
              {day}
            </div>
          ),
        )}
      </div>

      <div className="calendar-month-body">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-month-row">
            {week.map((day, index) => {
              const dayDate = day ? selectedDate.date(day) : null;
              const dayEvents = getEventsForDay(day);
              const isToday = dayDate && dayDate.isSame(dayjs(), "day");
              const isSunday = index === 0;

              return (
                <div
                  key={`${weekIndex}-${index}`}
                  className={`calendar-day-cell ${
                    !day ? "calendar-empty-cell" : ""
                  } ${isToday ? "calendar-today-cell" : ""}`}
                  onClick={() => day && onDayClick(dayDate)}
                >
                  {day && (
                    <>
                      <div className="calendar-day-number-wrap">
                        <div
                          className={`calendar-day-number ${
                            isToday ? "calendar-day-number-today" : ""
                          }`}
                          style={{
                            color: isToday
                              ? "#fff"
                              : isSunday
                                ? "#dc2626"
                                : textDark,
                          }}
                        >
                          {day}
                        </div>
                      </div>

                      <div className="calendar-events">
                        {dayEvents.slice(0, 3).map((event) => (
                          <EventBadge
                            key={event.id}
                            event={event}
                            compact
                            onClick={onEventClick}
                          />
                        ))}

                        {dayEvents.length > 3 && (
                          <div className="more-events">
                            +{dayEvents.length - 3} sự kiện khác
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* =========================================================
   WEEK VIEW
========================================================= */

const WeekView = ({ selectedDate, events, filters, onEventClick }) => {
  const weekStart = selectedDate.startOf("week");
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    weekStart.add(index, "day"),
  );

  const getEventsForDay = (date) => {
    const dateStr = date.format("YYYY-MM-DD");
    return sortEvents(
      events.filter(
        (event) =>
          event.event_date &&
          dayjs(event.event_date).format("YYYY-MM-DD") === dateStr &&
          filters.includes(getEventType(event)),
      ),
    );
  };

  return (
    <div className="week-view-wrapper">
      {weekDays.map((day) => {
        const dayEvents = getEventsForDay(day);
        const isToday = day.isSame(dayjs(), "day");

        return (
          <div
            key={day.format("YYYY-MM-DD")}
            className={`week-day-column ${
              isToday ? "week-day-column-today" : ""
            }`}
          >
            <div className="week-day-header">
              <div className="week-day-name">{day.format("dddd")}</div>
              <div
                className={`week-day-number ${
                  isToday ? "week-day-number-today" : ""
                }`}
              >
                {day.format("DD/MM")}
              </div>
              {isToday && <span className="today-pill">Hôm nay</span>}
            </div>

            <div className="week-day-events">
              {dayEvents.length > 0 ? (
                dayEvents.map((event) => {
                  const type = getEventType(event);
                  const config = TYPE_CONFIG[type];

                  return (
                    <div
                      key={event.id}
                      className={`week-event-card ${
                        event.is_priority ? "priority-card" : ""
                      }`}
                      style={{
                        borderLeftColor: event.is_priority
                          ? accentGold
                          : config.color,
                      }}
                      onClick={() => onEventClick(event)}
                    >
                      <div className="week-event-time">
                        <ClockCircleOutlined />
                        {getEventTime(event)}
                      </div>

                      {event.is_priority && (
                        <Tag color="gold" className="priority-tag">
                          <StarFilled /> Lễ trọng
                        </Tag>
                      )}

                      <div className="week-event-title">{event.title}</div>

                      {event.priest && (
                        <div className="week-event-priest">
                          <UserOutlined />
                          {event.priest}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="no-event">Không có lịch</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* =========================================================
   DAY VIEW
========================================================= */

const DayView = ({ selectedDate, events, filters, onEventClick }) => {
  const dateStr = selectedDate.format("YYYY-MM-DD");
  const dayEvents = sortEvents(
    events.filter(
      (event) =>
        event.event_date &&
        dayjs(event.event_date).format("YYYY-MM-DD") === dateStr &&
        filters.includes(getEventType(event)),
    ),
  );

  const isToday = selectedDate.isSame(dayjs(), "day");

  return (
    <div className="day-view-wrapper">
      <div className="day-view-header">
        <div
          className={`day-big-circle ${isToday ? "day-big-circle-today" : ""}`}
        >
          <div>{selectedDate.format("ddd")}</div>
          <strong>{selectedDate.format("DD")}</strong>
        </div>

        <div>
          <Title level={3} style={{ margin: 0, color: primaryNavy }}>
            {selectedDate.format("dddd")}, ngày{" "}
            {selectedDate.format("DD/MM/YYYY")}
          </Title>
          <Text type="secondary">
            {dayEvents.length === 0
              ? "Không có hoạt động phụng vụ nào"
              : `${dayEvents.length} hoạt động được lên lịch`}
          </Text>
        </div>
      </div>

      {dayEvents.length === 0 ? (
        <Empty
          description="Không có lịch phụng vụ trong ngày này"
          className="day-empty"
        />
      ) : (
        <div className="day-timeline">
          {dayEvents.map((event) => {
            const type = getEventType(event);
            const config = TYPE_CONFIG[type];

            return (
              <div key={event.id} className="day-timeline-item">
                <div className="day-timeline-time">
                  <div
                    className="timeline-dot"
                    style={{
                      borderColor: event.is_priority
                        ? accentGold
                        : config.color,
                    }}
                  />
                  <strong
                    style={{
                      color: event.is_priority ? accentGold : config.color,
                    }}
                  >
                    {getEventTime(event)}
                  </strong>
                </div>

                <button
                  type="button"
                  className="day-event-detail-card"
                  onClick={() => onEventClick(event)}
                  style={{
                    borderLeftColor: event.is_priority
                      ? accentGold
                      : config.color,
                  }}
                >
                  <div className="day-card-top">
                    <Tag
                      style={{
                        background: config.bg,
                        borderColor: config.border,
                        color: config.color,
                      }}
                    >
                      {config.label}
                    </Tag>

                    {event.is_priority && (
                      <Tag color="gold">
                        <StarFilled /> Lễ trọng
                      </Tag>
                    )}
                  </div>

                  <Title level={5} style={{ margin: "8px 0 4px 0" }}>
                    {event.title}
                  </Title>

                  {event.priest && (
                    <div className="detail-meta">
                      <UserOutlined /> Chủ tế: <strong>{event.priest}</strong>
                    </div>
                  )}

                  {(event.church_name || event.address) && (
                    <div className="detail-meta">
                      <EnvironmentOutlined />{" "}
                      {event.church_name || event.address}
                    </div>
                  )}

                  {event.note && (
                    <Paragraph className="event-note">{event.note}</Paragraph>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   FILTER BAR
========================================================= */

const FilterBar = ({ filters, onChange }) => {
  const toggle = (type) => {
    if (filters.includes(type)) {
      onChange(filters.filter((item) => item !== type));
    } else {
      onChange([...filters, type]);
    }
  };

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-inner">
        <span className="filter-label">
          <FilterOutlined /> Lọc lễ:
        </span>
        <div className="filter-pills-group">
          {ALL_TYPES.map((type) => {
            const config = TYPE_CONFIG[type];
            const active = filters.includes(type);

            return (
              <button
                key={type}
                type="button"
                className={`filter-pill ${active ? "filter-pill-active" : ""}`}
                style={{
                  background: active ? config.bg : "#fff",
                  color: active ? config.color : "#64748b",
                  borderColor: active ? config.border : "#e2e8f0",
                }}
                onClick={() => toggle(type)}
              >
                <span
                  className="filter-dot"
                  style={{ background: active ? config.dot : "#cbd5e1" }}
                />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>
      {filters.length !== ALL_TYPES.length && (
        <button
          type="button"
          className="show-all-btn"
          onClick={() => onChange(ALL_TYPES)}
        >
          Xem tất cả
        </button>
      )}
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const CommunitySchedulePage = () => {
  const { fetchChurches } = useChurch();
  const { fetchWeek } = useSchedule();

  const [churches, setChurches] = useState([]);
  const [selectedChurchId, setSelectedChurchId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [view, setView] = useState("month");
  const [filters, setFilters] = useState(ALL_TYPES);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    const initChurches = async () => {
      try {
        const res = await fetchChurches();
        const data = res?.data || [];
        setChurches(data);
        if (data.length > 0 && !selectedChurchId) {
          setSelectedChurchId(data[3].id);
        }
      } catch (error) {
        console.error("Không lấy được danh sách giáo xứ:", error);
      }
    };
    initChurches();
  }, [fetchChurches, selectedChurchId]);

  const loadScheduleData = useCallback(async () => {
    if (!selectedChurchId) return;
    setLoading(true);

    try {
      let datesToFetch = [];

      if (view === "month") {
        const monthStart = selectedDate.startOf("month");
        const monthEnd = selectedDate.endOf("month");
        const calendarStart = monthStart.startOf("week");
        const calendarEnd = monthEnd.endOf("week");

        let cursor = calendarStart;
        while (
          cursor.isBefore(calendarEnd, "day") ||
          cursor.isSame(calendarEnd, "day")
        ) {
          datesToFetch.push(cursor.format("YYYY-MM-DD"));
          cursor = cursor.add(7, "day");
        }
      } else {
        datesToFetch = [selectedDate.startOf("week").format("YYYY-MM-DD")];
      }

      const responses = await Promise.all(
        datesToFetch.map(async (week_start) => {
          try {
            return await fetchWeek({
              week_start,
              church_id: selectedChurchId,
            });
          } catch (error) {
            return { events: [] };
          }
        }),
      );

      const allEvents = responses.flatMap((response) => response?.events || []);
      const uniqueEvents = Array.from(
        new Map(allEvents.map((event) => [event.id, event])).values(),
      );

      setEvents(sortEvents(uniqueEvents));
    } catch (error) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedChurchId, selectedDate, view, fetchWeek]);

  useEffect(() => {
    loadScheduleData();
  }, [loadScheduleData]);

  const handlePrev = () => {
    if (view === "month") setSelectedDate((p) => p.subtract(1, "month"));
    else if (view === "week") setSelectedDate((p) => p.subtract(1, "week"));
    else setSelectedDate((p) => p.subtract(1, "day"));
  };

  const handleNext = () => {
    if (view === "month") setSelectedDate((p) => p.add(1, "month"));
    else if (view === "week") setSelectedDate((p) => p.add(1, "week"));
    else setSelectedDate((p) => p.add(1, "day"));
  };

  const handleToday = () => setSelectedDate(dayjs());

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setView("day");
  };

  const openEvent = (event) => {
    setActiveEvent(event);
    setDetailOpen(true);
  };

  const openGoogleMaps = (lat, lng, address, name) => {
    let url = "";
    if (lat != null && lng != null) {
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else {
      const query = `${name || ""} ${address || ""}`.trim();
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        query,
      )}`;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const navigationLabel = useMemo(() => {
    if (view === "month") return selectedDate.format("MMMM YYYY");
    if (view === "week") {
      const start = selectedDate.startOf("week").format("DD/MM/YYYY");
      const end = selectedDate.endOf("week").format("DD/MM/YYYY");
      return `${start} — ${end}`;
    }
    return selectedDate.format("dddd, DD/MM/YYYY");
  }, [selectedDate, view]);

  const stats = useMemo(() => {
    const result = {};
    ALL_TYPES.forEach((type) => {
      result[type] = events.filter((e) => getEventType(e) === type).length;
    });
    return result;
  }, [events]);

  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: primaryNavy,
          borderRadius: 12,
          colorBgLayout: softBg,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');

            * {
              box-sizing: border-box;
            }

            .community-schedule-layout {
              min-height: 100vh;
              background: ${softBg};
              padding: 24px 16px 60px;
              font-family: 'Be Vietnam Pro', sans-serif;
              color: ${textDark};
            }

            .community-schedule-container {
              width: 100%;
              max-width: 1320px;
              margin: 0 auto;
            }

            /* HEADER */
            .community-header-section {
              background: #fff;
              padding: 24px;
              border-radius: 16px;
              box-shadow: 0 4px 20px rgba(27, 54, 93, 0.04);
              margin-bottom: 20px;
              display: flex;
              flex-direction: column;
              gap: 20px;
            }

            @media (min-width: 992px) {
              .community-header-section {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
              }
            }

            .sacred-badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 4px 12px;
              border: 1px solid ${accentGold};
              border-radius: 20px;
              background: rgba(212, 175, 55, 0.1);
              color: ${primaryNavy};
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 6px;
            }

            .community-main-title {
              margin: 0 !important;
              color: ${primaryNavy} !important;
              font-family: 'Playfair Display', serif !important;
              font-size: clamp(22px, 3vw, 28px) !important;
            }

            .community-sub-title {
              margin: 4px 0 0 !important;
              color: #64748b;
              font-size: 13px;
            }

            /* CHURCH SELECTOR PILLS */
            .church-filter-scroll-wrap {
              overflow-x: auto;
              max-width: 100%;
              padding-bottom: 4px;
            }

            .church-filter-pills {
              display: flex;
              gap: 8px;
            }

            .pill-church-btn {
              padding: 8px 16px;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
              background: #f8fafc;
              color: ${textDark};
              font-size: 13px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              white-space: nowrap;
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .pill-church-btn:hover {
              border-color: ${primaryNavy};
              color: ${primaryNavy};
            }

            .pill-church-btn.active {
              background: ${primaryNavy};
              color: #fff;
              border-color: ${primaryNavy};
              box-shadow: 0 4px 12px rgba(27, 54, 93, 0.15);
            }

            /* NAVIGATION CARD */
            .week-navigation-card {
              margin-bottom: 16px;
              border-radius: 14px !important;
              box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03) !important;
              background: #fff !important;
            }

            .nav-card-inner {
              display: flex;
              flex-direction: column;
              gap: 16px;
              align-items: center;
              justify-content: space-between;
            }

            @media (min-width: 992px) {
              .nav-card-inner {
                flex-direction: row;
              }
            }

            .nav-left {
              display: flex;
              align-items: center;
              gap: 10px;
              width: 100%;
              justify-content: space-between;
            }

            @media (min-width: 992px) {
              .nav-left {
                width: auto;
                justify-content: flex-start;
              }
            }

            .nav-arrow-btn {
              border-radius: 8px !important;
              background: #f1f5f9 !important;
              border: none !important;
            }

            .nav-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-family: 'Playfair Display', serif;
              font-size: 16px;
              font-weight: 700;
              color: ${primaryNavy};
            }

            .view-switcher {
              display: flex;
              background: #f1f5f9;
              padding: 4px;
              border-radius: 10px;
              width: 100%;
              justify-content: center;
            }

            @media (min-width: 992px) {
              .view-switcher {
                width: auto;
              }
            }

            .view-btn {
              padding: 6px 20px;
              border: none;
              background: transparent;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 600;
              color: #64748b;
              cursor: pointer;
              transition: all 0.2s;
            }

            .view-btn.active {
              background: #fff;
              color: ${primaryNavy};
              box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }

            .nav-right {
              display: flex;
              align-items: center;
              gap: 10px;
              width: 100%;
              justify-content: flex-end;
            }

            .today-btn {
              border-color: #cbd5e1 !important;
              color: ${primaryNavy} !important;
              font-weight: 600;
              border-radius: 8px !important;
            }

            /* FILTER BAR */
            .filter-bar-container {
              display: flex;
              flex-direction: column;
              gap: 10px;
              margin-bottom: 16px;
              background: #fff;
              padding: 14px 18px;
              border-radius: 12px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.02);
            }

            @media (min-width: 768px) {
              .filter-bar-container {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
              }
            }

            .filter-bar-inner {
              display: flex;
              align-items: center;
              gap: 12px;
              flex-wrap: wrap;
            }

            .filter-label {
              font-size: 12px;
              font-weight: 700;
              color: ${primaryNavy};
              display: inline-flex;
              align-items: center;
              gap: 5px;
            }

            .filter-pills-group {
              display: flex;
              gap: 8px;
              flex-wrap: wrap;
            }

            .filter-pill {
              padding: 5px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              border: 1px solid;
              cursor: pointer;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              transition: all 0.2s;
            }

            .filter-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
            }

            .show-all-btn {
              background: transparent;
              border: none;
              color: ${primaryNavy};
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              text-decoration: underline;
              padding: 0;
            }

            /* MAIN CALENDAR CONTAINER */
            .calendar-main-card {
              border-radius: 16px !important;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
              overflow: hidden;
            }

            /* MONTH VIEW STYLES */
            .calendar-month-wrapper {
              width: 100%;
              overflow-x: auto;
            }

            .calendar-week-header,
            .calendar-month-row {
              display: grid;
              grid-template-columns: repeat(7, minmax(130px, 1fr));
              min-width: 910px;
            }

            .calendar-week-header {
              background: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
            }

            .calendar-week-header-item {
              padding: 12px;
              text-align: center;
              font-size: 12px;
              font-weight: 700;
              border-right: 1px solid #f1f5f9;
            }

            .calendar-month-row {
              min-height: 110px;
              border-bottom: 1px solid #f1f5f9;
            }

            .calendar-day-cell {
              min-height: 110px;
              padding: 8px;
              border-right: 1px solid #f1f5f9;
              cursor: pointer;
              transition: background 0.15s;
              background: #fff;
            }

            .calendar-day-cell:hover {
              background: #f8fafc;
            }

            .calendar-today-cell {
              background: #fffdf0 !important;
            }

            .calendar-day-number-wrap {
              display: flex;
              justify-content: flex-end;
              margin-bottom: 6px;
            }

            .calendar-day-number {
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
              font-size: 12px;
              font-weight: 600;
            }

            .calendar-day-number-today {
              background: ${primaryNavy};
              color: #fff !important;
              font-weight: 700;
            }

            .calendar-events {
              display: flex;
              flex-direction: column;
              gap: 4px;
            }

            .event-badge {
              width: 100%;
              padding: 4px 6px;
              border: none;
              border-left: 3px solid;
              border-radius: 4px;
              text-align: left;
              cursor: pointer;
              font-size: 11px;
              font-weight: 600;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              transition: opacity 0.2s;
            }

            .event-badge:hover {
              opacity: 0.8;
            }

            .event-badge-time {
              font-weight: 700;
              margin-right: 4px;
            }

            .more-events {
              font-size: 10px;
              color: #64748b;
              font-weight: 600;
              text-align: center;
              margin-top: 2px;
            }

            /* WEEK VIEW STYLES */
            .week-view-wrapper {
              display: grid;
              grid-template-columns: repeat(7, minmax(140px, 1fr));
              gap: 12px;
              overflow-x: auto;
              padding-bottom: 8px;
            }

            .week-day-column {
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              background: #fff;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0,0,0,0.02);
            }

            .week-day-column-today {
              border-color: ${accentGold};
              box-shadow: 0 4px 12px rgba(212, 175, 55, 0.15);
            }

            .week-day-header {
              padding: 12px;
              background: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
              text-align: center;
            }

            .week-day-column-today .week-day-header {
              background: ${primaryNavy};
              color: #fff;
            }

            .week-day-name {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              margin-bottom: 2px;
            }

            .week-day-number {
              font-size: 16px;
              font-weight: 700;
              color: ${primaryNavy};
            }

            .week-day-number-today {
              color: #fff;
            }

            .today-pill {
              display: inline-block;
              margin-top: 4px;
              padding: 1px 6px;
              background: ${accentGold};
              color: ${primaryNavy};
              font-size: 9px;
              font-weight: 700;
              border-radius: 10px;
            }

            .week-day-events {
              padding: 10px;
              display: flex;
              flex-direction: column;
              gap: 8px;
              max-height: 500px;
              overflow-y: auto;
            }

            .week-event-card {
              padding: 10px;
              border-radius: 8px;
              background: #fff;
              border: 1px solid #f1f5f9;
              border-left: 3px solid;
              cursor: pointer;
              transition: all 0.2s;
            }

            .week-event-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }

            .week-event-card.priority-card {
              background: #fffbe6;
            }

            .week-event-time {
              font-size: 11px;
              font-weight: 700;
              color: ${primaryNavy};
              display: flex;
              align-items: center;
              gap: 4px;
              margin-bottom: 4px;
            }

            .week-event-title {
              font-size: 12px;
              font-weight: 600;
              color: ${textDark};
              line-height: 1.4;
            }

            .week-event-priest {
              font-size: 11px;
              color: #64748b;
              margin-top: 6px;
              display: flex;
              align-items: center;
              gap: 4px;
            }

            .no-event {
              text-align: center;
              color: #94a3b8;
              font-size: 12px;
              padding: 20px 0;
              font-style: italic;
            }

            /* DAY VIEW STYLES */
            .day-view-wrapper {
              max-width: 800px;
              margin: 0 auto;
              padding: 10px;
            }

            .day-view-header {
              display: flex;
              align-items: center;
              gap: 16px;
              margin-bottom: 24px;
              padding-bottom: 16px;
              border-bottom: 1px solid #e2e8f0;
            }

            .day-big-circle {
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: #f1f5f9;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: ${primaryNavy};
              font-size: 11px;
              font-weight: 700;
            }

            .day-big-circle strong {
              font-size: 20px;
              line-height: 1;
            }

            .day-big-circle-today {
              background: ${primaryNavy};
              color: #fff;
            }

            .day-timeline {
              display: flex;
              flex-direction: column;
              gap: 16px;
              position: relative;
            }

            .day-timeline-item {
              display: flex;
              gap: 16px;
            }

            .day-timeline-time {
              width: 60px;
              text-align: right;
              padding-top: 12px;
              font-size: 13px;
              font-weight: 700;
            }

            .day-event-detail-card {
              flex: 1;
              background: #fff;
              border: 1px solid #e2e8f0;
              border-left: 4px solid;
              border-radius: 10px;
              padding: 16px;
              cursor: pointer;
              text-align: left;
              transition: all 0.2s;
            }

            .day-event-detail-card:hover {
              box-shadow: 0 6px 16px rgba(0,0,0,0.06);
              transform: translateY(-2px);
            }

            .day-card-top {
              display: flex;
              gap: 8px;
              margin-bottom: 6px;
            }

            .detail-meta {
              font-size: 12px;
              color: #64748b;
              margin-top: 6px;
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .event-note {
              margin-top: 8px !important;
              padding-top: 8px;
              border-top: 1px solid #f1f5f9;
              font-size: 12px;
              color: #475569;
            }

            /* STATS FOOTER */
            .schedule-stats {
              margin-top: 16px;
              background: #fff;
              padding: 16px 20px;
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              gap: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.02);
            }

            @media (min-width: 768px) {
              .schedule-stats {
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
              }
            }

            .stats-title {
              font-weight: 700;
              font-size: 13px;
              color: ${primaryNavy};
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .stats-items-group {
              display: flex;
              gap: 16px;
              flex-wrap: wrap;
            }

            .stat-item {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 12px;
              color: #64748b;
            }

            .stat-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
            }

            /* DRAWER STYLES */
            .drawer-title-box {
              display: flex;
              align-items: center;
              gap: 8px;
              font-family: 'Playfair Display', serif;
              font-size: 16px;
              font-weight: 700;
              color: ${primaryNavy};
            }

            .event-detail-content {
              display: flex;
              flex-direction: column;
              gap: 16px;
            }

            .detail-hero-box {
              padding: 16px;
              border-radius: 12px;
              border: 1px solid;
            }

            .detail-hero-time {
              font-size: 13px;
              font-weight: 600;
              color: #64748b;
              margin-top: 8px;
              display: flex;
              align-items: center;
              gap: 6px;
            }

            .detail-section-list {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }

            .detail-row-item {
              display: flex;
              gap: 12px;
              padding: 10px;
              background: #f8fafc;
              border-radius: 8px;
            }

            .row-icon {
              font-size: 16px;
              color: ${primaryNavy};
              margin-top: 2px;
            }

            .row-label {
              font-size: 11px;
              color: #64748b;
              font-weight: 600;
              text-transform: uppercase;
            }

            .row-value {
              font-size: 13px;
              color: ${textDark};
              margin-top: 2px;
            }

            .loading-container {
              padding: 60px 0;
              display: flex;
              justify-content: center;
            }
          `,
        }}
      />

      <div className="community-schedule-layout">
        <div className="community-schedule-container">
          {/* HEADER */}
          <div className="community-header-section">
            <div className="header-text-group">
              <span className="sacred-badge">
                <CompassOutlined /> CỘNG ĐOÀN DÂN CHÚA
              </span>
              <Title level={2} className="community-main-title">
                Lịch Phụng Vụ Giáo Xứ
              </Title>
              <Paragraph className="community-sub-title">
                Tra cứu giờ cử hành Thánh lễ, các bí tích và sinh hoạt cộng đoàn
                nhanh chóng, thuận tiện.
              </Paragraph>
            </div>

            {/* CHỌN GIÁO XỨ */}
            <div className="church-filter-scroll-wrap">
              <div className="church-filter-pills">
                {churches.map((church) => (
                  <button
                    key={church.id}
                    type="button"
                    className={`pill-church-btn ${
                      selectedChurchId === church.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedChurchId(church.id)}
                  >
                    <EnvironmentOutlined /> {church.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NAVIGATION BAR */}
          <Card bordered={false} className="week-navigation-card">
            <div className="nav-card-inner">
              <div className="nav-left">
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handlePrev}
                  className="nav-arrow-btn"
                />
                <div className="nav-title">
                  <CalendarOutlined style={{ color: accentGold }} />
                  <span>{navigationLabel}</span>
                </div>
                <Button
                  icon={<ArrowRightOutlined />}
                  onClick={handleNext}
                  className="nav-arrow-btn"
                />
              </div>

              {/* VIEW SWITCHER */}
              <div className="view-switcher">
                {[
                  ["month", "Tháng"],
                  ["week", "Tuần"],
                  ["day", "Ngày"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    className={`view-btn ${view === key ? "active" : ""}`}
                    onClick={() => setView(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* TODAY + DATE PICKER */}
              <div className="nav-right">
                <Button onClick={handleToday} className="today-btn">
                  Hôm nay
                </Button>
                <DatePicker
                  value={selectedDate}
                  onChange={(date) => date && setSelectedDate(date)}
                  format="DD/MM/YYYY"
                  allowClear={false}
                  style={{ width: 130, borderRadius: 8 }}
                />
              </div>
            </div>
          </Card>

          {/* FILTER BAR */}
          <FilterBar filters={filters} onChange={setFilters} />

          {/* MAIN CONTENT AREA */}
          <Card bordered={false} className="calendar-main-card">
            {loading ? (
              <div className="loading-container">
                <Spin size="large" tip="Đang tải lịch phụng vụ..." />
              </div>
            ) : (
              <>
                {view === "month" && (
                  <MonthView
                    selectedDate={selectedDate}
                    events={events}
                    filters={filters}
                    onDayClick={handleDayClick}
                    onEventClick={openEvent}
                  />
                )}
                {view === "week" && (
                  <WeekView
                    selectedDate={selectedDate}
                    events={events}
                    filters={filters}
                    onEventClick={openEvent}
                  />
                )}
                {view === "day" && (
                  <DayView
                    selectedDate={selectedDate}
                    events={events}
                    filters={filters}
                    onEventClick={openEvent}
                  />
                )}
              </>
            )}
          </Card>

          {/* STATS FOOTER */}
          <div className="schedule-stats">
            <div className="stats-title">
              <CalendarOutlined /> Tổng quan giai đoạn:
            </div>
            <div className="stats-items-group">
              {ALL_TYPES.map((type) => {
                const config = TYPE_CONFIG[type];
                return (
                  <div key={type} className="stat-item">
                    <span
                      className="stat-dot"
                      style={{ background: config.dot }}
                    />
                    <span>
                      {config.label}: <strong>{stats[type] || 0}</strong>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DETAIL DRAWER */}
        <Drawer
          title={
            <div className="drawer-title-box">
              <BookOutlined style={{ color: accentGold }} />
              <span>Thông tin chi tiết Thánh lễ</span>
            </div>
          }
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          width={400}
          closeIcon={<CloseOutlined />}
          className="community-detail-drawer"
          footer={
            <Button
              type="primary"
              block
              icon={<CompassOutlined />}
              disabled={!activeEvent}
              onClick={() => {
                if (!activeEvent) return;
                openGoogleMaps(
                  activeEvent.latitude,
                  activeEvent.longitude,
                  activeEvent.address,
                  activeEvent.church_name,
                );
              }}
              style={{
                backgroundColor: primaryNavy,
                borderRadius: 8,
                fontWeight: 600,
                height: 42,
              }}
            >
              Chỉ đường đến nhà thờ
            </Button>
          }
        >
          {activeEvent && (
            <div className="event-detail-content">
              {(() => {
                const type = getEventType(activeEvent);
                const config = TYPE_CONFIG[type];
                return (
                  <div
                    className="detail-hero-box"
                    style={{
                      background: activeEvent.is_priority
                        ? "#fffbe6"
                        : config.bg,
                      borderColor: activeEvent.is_priority
                        ? accentGold
                        : config.border,
                    }}
                  >
                    <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <Tag
                        style={{
                          background: config.bg,
                          color: config.color,
                          borderColor: config.border,
                          fontWeight: 600,
                        }}
                      >
                        {config.label}
                      </Tag>
                      {activeEvent.is_priority && (
                        <Tag color="gold" style={{ fontWeight: 600 }}>
                          <StarFilled /> Lễ trọng
                        </Tag>
                      )}
                    </div>
                    <Title
                      level={4}
                      style={{ margin: "4px 0", color: textDark }}
                    >
                      {activeEvent.title}
                    </Title>
                    <div className="detail-hero-time">
                      <ClockCircleOutlined /> {getEventTime(activeEvent)} —{" "}
                      {activeEvent.event_date
                        ? dayjs(activeEvent.event_date).format("DD/MM/YYYY")
                        : ""}
                    </div>
                  </div>
                );
              })()}

              <div className="detail-section-list">
                {activeEvent.priest && (
                  <div className="detail-row-item">
                    <UserOutlined className="row-icon" />
                    <div>
                      <span className="row-label">Chủ tế</span>
                      <div className="row-value">{activeEvent.priest}</div>
                    </div>
                  </div>
                )}

                {(activeEvent.church_name || activeEvent.address) && (
                  <div className="detail-row-item">
                    <EnvironmentOutlined className="row-icon" />
                    <div>
                      <span className="row-label">Địa điểm</span>
                      <div className="row-value">
                        {activeEvent.church_name && (
                          <strong>{activeEvent.church_name}</strong>
                        )}
                        {activeEvent.address && (
                          <div>{activeEvent.address}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeEvent.note && (
                  <div className="detail-row-item">
                    <BookOutlined className="row-icon" />
                    <div>
                      <span className="row-label">Ghi chú</span>
                      <div className="row-value">{activeEvent.note}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default CommunitySchedulePage;
