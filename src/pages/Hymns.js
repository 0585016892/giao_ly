import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Layout,
  List,
  Card,
  Typography,
  Button,
  Tag,
  Empty,
  ConfigProvider,
  Spin,
  Input,
  Slider,
  Tooltip,
  message,
  Space,
} from "antd";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  CustomerServiceOutlined,
  DownloadOutlined,
  CompassOutlined,
  EyeOutlined,
  SearchOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  SoundOutlined,
  MutedOutlined,
  AimOutlined,
  CopyOutlined,
  LoadingOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import mediaApi from "../api/mediaApi";

const { Title, Text } = Typography;

const Hymns = () => {
  const [hymns, setHymns] = useState([]);
  const [filteredHymns, setFilteredHymns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [selectedHymn, setSelectedHymn] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedAuthor, setSelectedAuthor] = useState("ALL");

  // Audio Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [prevVolume, setPrevVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Favorites (localStorage)
  const [likedIds, setLikedIds] = useState(() => {
    try {
      const saved = localStorage.getItem("hymns_liked_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Lyric / Focus Mode State
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [activeLyricIndex, setActiveLyricIndex] = useState(0);

  // Refs
  const audioRef = useRef(null);
  const lyricRefs = useRef([]);
  const BASE_URL = process.env.REACT_APP_API_URL || "";

  // Bảng màu: Elegant Navy & Warm Champagne Gold
  const themeColors = {
    primary: "#1B365D",
    accent: "#D4AF37",
    accentLight: "rgba(212, 175, 55, 0.12)",
    bgSoft: "#F8FAFC",
    cardBg: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    border: "#E2E8F0",
  };

  /* =====================================================
     LOCAL STORAGE FAVORITES SINK
  ===================================================== */
  useEffect(() => {
    try {
      localStorage.setItem("hymns_liked_ids", JSON.stringify(likedIds));
    } catch (e) {
      console.error("Không thể lưu yêu thích vào localStorage", e);
    }
  }, [likedIds]);

  const toggleLike = (id) => {
    if (!id) return;
    setLikedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        message.info("Đã xóa khỏi danh sách yêu thích");
        return prev.filter((item) => item !== id);
      } else {
        message.success("Đã thêm vào danh sách yêu thích");
        return [...prev, id];
      }
    });
  };

  /* =====================================================
     FETCH DATA
  ===================================================== */
  const fetchAudioHymns = useCallback(async () => {
    try {
      setLoading(true);
      let res;

      if (typeof mediaApi.getAudios === "function") {
        res = await mediaApi.getAudios({ limit: 100 });
      } else if (typeof mediaApi.getMediaByCategory === "function") {
        res = await mediaApi.getMediaByCategory("Thánh ca");
      }

      const responseData = res?.data?.data || res?.data || {};
      const list = Array.isArray(responseData)
        ? responseData
        : responseData?.data || responseData?.items || [];

      const audioList = list.filter((item) => item.type === "audio");

      setHymns(audioList);
      setFilteredHymns(audioList);

      if (audioList.length > 0 && !selectedHymn) {
        setSelectedHymn(audioList[0]);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách thánh ca:", error);
      message.error("Không thể tải danh sách thánh ca");
    } finally {
      setLoading(false);
    }
  }, [selectedHymn]);

  useEffect(() => {
    fetchAudioHymns();
  }, [fetchAudioHymns]);

  // Dynamic Categories & Authors Options
  const categories = [
    "ALL",
    ...new Set(hymns.map((h) => h.category || "Thánh ca")),
  ];
  const authors = [
    "ALL",
    ...new Set(hymns.map((h) => h.author || h.uploader_name || "Hà Minh")),
  ];

  // Combined Search & Dynamic Filter Effect
  useEffect(() => {
    let result = [...hymns];

    if (searchText.trim()) {
      const query = searchText.toLowerCase();
      result = result.filter(
        (h) =>
          h.title?.toLowerCase().includes(query) ||
          (h.author || h.uploader_name || "").toLowerCase().includes(query) ||
          h.category?.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "ALL") {
      result = result.filter(
        (h) => (h.category || "Thánh ca") === selectedCategory,
      );
    }

    if (selectedAuthor !== "ALL") {
      result = result.filter(
        (h) => (h.author || h.uploader_name || "Hà Minh") === selectedAuthor,
      );
    }

    setFilteredHymns(result);
  }, [searchText, selectedCategory, selectedAuthor, hymns]);

  /* =====================================================
     AUTO-SCROLL LYRICS EFFECT
  ===================================================== */
  useEffect(() => {
    if (isPlaying && lyricRefs.current[activeLyricIndex]) {
      lyricRefs.current[activeLyricIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeLyricIndex, isPlaying]);

  /* =====================================================
     PLAYER CONTROLS & HANDLERS
  ===================================================== */
  const handleSelectHymn = async (item, autoPlay = true) => {
    const isSame = selectedHymn?.id === item.id;

    if (!isSame) {
      setSelectedHymn(item);
      setIsPlaying(autoPlay);
      setCurrentTime(0);
      setActiveLyricIndex(0);
      setAudioLoading(true);

      try {
        if (typeof mediaApi.getMediaById === "function") {
          const detailRes = await mediaApi.getMediaById(item.id);
          const detailedData = detailRes?.data?.data || detailRes?.data;
          if (detailedData)
            setSelectedHymn((prev) => ({ ...prev, ...detailedData }));
        }

        if (typeof mediaApi.increaseMediaView === "function") {
          await mediaApi.increaseMediaView(item.id);
          setHymns((prev) =>
            prev.map((h) =>
              h.id === item.id ? { ...h, views: Number(h.views || 0) + 1 } : h,
            ),
          );
        }
      } catch (err) {
        console.error("Lỗi cập nhật thông tin media:", err);
      }
    } else {
      togglePlay();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {
        message.error("Không thể phát nguồn âm thanh này!");
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (!selectedHymn || hymns.length === 0) return;
    const currentIndex = hymns.findIndex((h) => h.id === selectedHymn.id);
    const nextIndex = (currentIndex + 1) % hymns.length;
    handleSelectHymn(hymns[nextIndex], true);
  };

  const handlePrevTrack = () => {
    if (!selectedHymn || hymns.length === 0) return;
    const currentIndex = hymns.findIndex((h) => h.id === selectedHymn.id);
    const prevIndex = (currentIndex - 1 + hymns.length) % hymns.length;
    handleSelectHymn(hymns[prevIndex], true);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = prevVolume;
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      audioRef.current.volume = 0;
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (val) => {
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getAudioSrc = (item) => {
    if (!item?.file_url) return "";
    return item.file_url.startsWith("http")
      ? item.file_url
      : `${BASE_URL}${item.file_url}`;
  };

  const handleCopyLyrics = () => {
    if (selectedHymn?.description) {
      navigator.clipboard.writeText(selectedHymn.description);
      message.success("Đã sao chép toàn bộ lời bài hát!");
    } else {
      message.warning("Bài hát này chưa có thông tin lời!");
    }
  };

  // Tách description thành các câu lời nhạc
  const parsedLyrics = selectedHymn?.description
    ? selectedHymn.description
        .split(/(?:\r\n|\r|\n)+/)
        .filter((line) => line.trim().length > 0)
    : [];

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    setCurrentTime(cur);

    if (duration > 0 && parsedLyrics.length > 0) {
      const step = duration / parsedLyrics.length;
      const index = Math.min(Math.floor(cur / step), parsedLyrics.length - 1);
      setActiveLyricIndex(index);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: themeColors.primary,
          borderRadius: 12,
          colorBgLayout: themeColors.bgSoft,
          fontFamily: "'Be Vietnam Pro', -apple-system, sans-serif",
        },
      }}
    >
      <Layout className="hymns-wrapper">
        <div className="hymns-container">
          {/* HEADER SECTION */}
          <header className="hymns-header">
            <div className="sacred-badge">
              <CompassOutlined /> GIAI ĐIỆU THÁNH THIÊNG
            </div>
            <Title level={1} className="hymns-main-title">
              Thánh Ca Công Giáo
            </Title>
            <div className="title-gold-line" />
            <Text className="hymns-subtitle">
              Tuyển chọn những giai điệu phụng vụ trang trọng & xúc động nhất
              cho thánh lễ hôn phối
            </Text>
          </header>

          {/* MAIN CONTENT GRID */}
          <div className="hymns-grid">
            {/* LEFT COLUMN: DANH SÁCH BÀI HÁT & BỘ LỌC */}
            <div className="hymns-list-col">
              <Card bordered={false} className="glass-card">
                <div className="list-card-header">
                  <div className="header-left">
                    <CustomerServiceOutlined className="gold-icon" />
                    <h3>Danh sách bài hát</h3>
                    <Tag className="count-tag">{filteredHymns.length}</Tag>
                  </div>

                  <Input
                    placeholder="Tìm tên bài hát, tác giả..."
                    prefix={<SearchOutlined style={{ color: "#94A3B8" }} />}
                    allowClear
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="search-input"
                  />

                  {/* FILTER CHIPS (DANH MỤC & TÁC GIẢ) */}
                  <div className="filter-chips-container">
                    <div className="filter-group">
                      <span className="filter-label">
                        <FilterOutlined /> Thể loại:
                      </span>
                      <div className="chips-scroll">
                        {categories.map((cat) => (
                          <Tag
                            key={cat}
                            className={`filter-chip ${selectedCategory === cat ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                          >
                            {cat === "ALL" ? "Tất cả" : cat}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div className="filter-group" style={{ marginTop: 6 }}>
                      <span className="filter-label">
                        <FilterOutlined /> Tác giả:
                      </span>
                      <div className="chips-scroll">
                        {authors.map((aut) => (
                          <Tag
                            key={aut}
                            className={`filter-chip ${selectedAuthor === aut ? "active" : ""}`}
                            onClick={() => setSelectedAuthor(aut)}
                          >
                            {aut === "ALL" ? "Tất cả" : aut}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <Spin spinning={loading}>
                  {filteredHymns.length === 0 && !loading ? (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Không tìm thấy bài thánh ca phù hợp"
                    />
                  ) : (
                    <div className="custom-scrollbar list-scroll-area">
                      <List
                        itemLayout="horizontal"
                        dataSource={filteredHymns}
                        renderItem={(item, index) => {
                          const isSelected = selectedHymn?.id === item.id;
                          const isThisPlaying = isSelected && isPlaying;
                          const isItemLiked = likedIds.includes(item.id);

                          return (
                            <div
                              key={item.id || index}
                              className={`hymn-item-card ${
                                isSelected ? "active-item" : ""
                              }`}
                              onClick={() => handleSelectHymn(item, true)}
                            >
                              <div className="item-index-play">
                                <button
                                  className={`play-btn-circle ${
                                    isThisPlaying ? "playing" : ""
                                  }`}
                                >
                                  {isThisPlaying ? (
                                    <PauseCircleFilled />
                                  ) : (
                                    <PlayCircleFilled />
                                  )}
                                </button>
                              </div>

                              <div className="item-details">
                                <div className="item-title-row">
                                  <Text className="hymn-title-text" ellipsis>
                                    {item.title}
                                  </Text>
                                  {isSelected && (
                                    <span className="now-playing-badge">
                                      Đang chọn
                                    </span>
                                  )}
                                </div>
                                <div className="item-sub-row">
                                  <Text className="hymn-artist-text">
                                    Tác giả:{" "}
                                    {item.author ||
                                      item.uploader_name ||
                                      "Hà Minh"}
                                  </Text>
                                  <span className="dot-divider">•</span>
                                  <span className="views-count">
                                    <EyeOutlined /> {item.views || 0}
                                  </span>
                                </div>
                              </div>

                              <Space
                                size={4}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Button
                                  type="text"
                                  shape="circle"
                                  size="small"
                                  icon={
                                    isItemLiked ? (
                                      <HeartFilled
                                        style={{ color: "#EF4444" }}
                                      />
                                    ) : (
                                      <HeartOutlined
                                        style={{ color: "#94A3B8" }}
                                      />
                                    )
                                  }
                                  onClick={() => toggleLike(item.id)}
                                />
                                <Tag className="category-pill">
                                  {item.category || "Thánh ca"}
                                </Tag>
                              </Space>
                            </div>
                          );
                        }}
                      />
                    </div>
                  )}
                </Spin>
              </Card>
            </div>

            {/* RIGHT COLUMN: TRÌNH PHÁT & LỜI BÀI HÁT */}
            <div className="hymns-detail-col">
              <Card bordered={false} className="glass-card sticky-card">
                {selectedHymn ? (
                  <div className="player-detail-wrapper fade-in">
                    {/* DYNAMIC GRADIENT HERO CARD WITH VISUALIZER & BUFFER STATE */}
                    <div
                      className={`player-hero-card ${isPlaying ? "is-playing" : ""}`}
                    >
                      {/* Audio Loading Overlay */}
                      {audioLoading && (
                        <div className="audio-loading-overlay">
                          <Spin
                            indicator={
                              <LoadingOutlined
                                style={{
                                  fontSize: 32,
                                  color: themeColors.accent,
                                }}
                                spin
                              />
                            }
                          />
                          <span
                            style={{
                              fontSize: 12,
                              marginTop: 8,
                              color: "#94A3B8",
                            }}
                          >
                            Đang tải file âm thanh...
                          </span>
                        </div>
                      )}

                      <div className="visualizer-wrapper">
                        {/* Equalizer Wave Animation */}
                        <div
                          className={`equalizer-waves ${isPlaying ? "active" : ""}`}
                        >
                          <span className="bar bar-1"></span>
                          <span className="bar bar-2"></span>
                          <span className="bar bar-3"></span>
                          <span className="bar bar-4"></span>
                          <span className="bar bar-5"></span>
                        </div>
                      </div>

                      <div className="hymn-hero-info">
                        <Tag className="gold-pill">
                          {selectedHymn.category || "Thánh Ca"}
                        </Tag>
                        <Title level={3} className="hero-hymn-title">
                          {selectedHymn.title}
                        </Title>
                        <Text className="hero-hymn-artist">
                          Tác giả:{" "}
                          <strong>
                            {selectedHymn.author ||
                              selectedHymn.uploader_name ||
                              "Hà Minh"}
                          </strong>
                        </Text>
                      </div>

                      {/* AUDIO REF WITH BUFFER & ERROR HANDLERS */}
                      <audio
                        ref={audioRef}
                        src={getAudioSrc(selectedHymn)}
                        onTimeUpdate={handleTimeUpdate}
                        onWaiting={() => setAudioLoading(true)}
                        onCanPlay={() => setAudioLoading(false)}
                        onError={() => {
                          setAudioLoading(false);
                          setIsPlaying(false);
                          message.error(
                            "Lỗi khi tải hoặc phát file âm thanh này!",
                          );
                        }}
                        onLoadedMetadata={() =>
                          setDuration(audioRef.current?.duration || 0)
                        }
                        onEnded={handleNextTrack}
                        autoPlay={isPlaying}
                      />

                      {/* PROGRESS BAR */}
                      <div className="progress-container">
                        <Slider
                          min={0}
                          max={duration || 100}
                          value={currentTime}
                          onChange={(val) => {
                            if (audioRef.current) {
                              audioRef.current.currentTime = val;
                              setCurrentTime(val);
                            }
                          }}
                          tooltip={{ formatter: (val) => formatTime(val) }}
                          className="custom-slider"
                        />
                        <div className="time-display">
                          <span>{formatTime(currentTime)}</span>
                          <span>{formatTime(duration)}</span>
                        </div>
                      </div>

                      {/* MAIN PLAYER ACTIONS & QUICK-VOLUME */}
                      <div className="player-controls">
                        <Tooltip
                          title={
                            likedIds.includes(selectedHymn.id)
                              ? "Bỏ yêu thích"
                              : "Thêm vào yêu thích"
                          }
                        >
                          <Button
                            type="text"
                            shape="circle"
                            icon={
                              likedIds.includes(selectedHymn.id) ? (
                                <HeartFilled style={{ color: "#EF4444" }} />
                              ) : (
                                <HeartOutlined />
                              )
                            }
                            onClick={() => toggleLike(selectedHymn.id)}
                          />
                        </Tooltip>

                        <div className="center-controls">
                          <Button
                            type="text"
                            shape="circle"
                            icon={<StepBackwardOutlined />}
                            onClick={handlePrevTrack}
                            className="nav-btn"
                          />
                          <Button
                            type="primary"
                            shape="circle"
                            size="large"
                            icon={
                              isPlaying ? (
                                <PauseCircleFilled />
                              ) : (
                                <PlayCircleFilled />
                              )
                            }
                            onClick={togglePlay}
                            className="play-main-btn"
                          />
                          <Button
                            type="text"
                            shape="circle"
                            icon={<StepForwardOutlined />}
                            onClick={handleNextTrack}
                            className="nav-btn"
                          />
                        </div>

                        {/* Quick-Volume Slider */}
                        <div className="volume-control">
                          <Button
                            type="text"
                            shape="circle"
                            className="volume-btn"
                            icon={
                              isMuted || volume === 0 ? (
                                <MutedOutlined />
                              ) : (
                                <SoundOutlined />
                              )
                            }
                            onClick={toggleMute}
                          />
                          <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                          />
                        </div>
                      </div>
                    </div>

                    {/* KARAOKE / FOCUS MODE LYRICS SECTION */}
                    <div
                      className={`lyrics-focus-container ${isFocusMode ? "focus-active" : ""}`}
                    >
                      <div className="lyrics-header-actions">
                        <span className="lyrics-badge">
                          <CustomerServiceOutlined /> LỜI BÀI HÁT PHỤNG VỤ
                        </span>
                        <div className="header-right-tools">
                          <Tooltip title="Sao chép lời">
                            <Button
                              type="text"
                              shape="circle"
                              size="small"
                              icon={<CopyOutlined />}
                              onClick={handleCopyLyrics}
                            />
                          </Tooltip>
                          <Button
                            type="text"
                            size="small"
                            className={`focus-toggle-btn ${isFocusMode ? "active" : ""}`}
                            icon={<AimOutlined />}
                            onClick={() => setIsFocusMode(!isFocusMode)}
                          >
                            {isFocusMode ? "Thoát Focus" : "Focus Mode 🎯"}
                          </Button>
                          <Tooltip title="Chia sẻ liên kết">
                            <Button
                              type="text"
                              shape="circle"
                              size="small"
                              icon={<ShareAltOutlined />}
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  window.location.href,
                                );
                                message.success("Đã sao chép liên kết!");
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>

                      <div className="lyrics-scroll-box custom-scrollbar">
                        {parsedLyrics.length > 0 ? (
                          parsedLyrics.map((line, idx) => {
                            const isActive =
                              isPlaying && idx === activeLyricIndex;
                            const isRefrain = line.trim().startsWith("ĐK:");

                            return (
                              <p
                                key={idx}
                                ref={(el) => (lyricRefs.current[idx] = el)}
                                className={`lyric-line ${isActive ? "is-active-line" : ""} ${isRefrain ? "refrain-line" : ""}`}
                                onClick={() => {
                                  if (audioRef.current && duration > 0) {
                                    const targetTime =
                                      (duration / parsedLyrics.length) * idx;
                                    audioRef.current.currentTime = targetTime;
                                    setCurrentTime(targetTime);
                                  }
                                }}
                              >
                                {line}
                              </p>
                            );
                          })
                        ) : (
                          <Text type="secondary" className="no-lyrics">
                            Chưa có lời bài hát cho tác phẩm thánh ca này.
                          </Text>
                        )}
                      </div>
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    {selectedHymn.file_url && (
                      <Button
                        block
                        icon={<DownloadOutlined />}
                        className="download-btn"
                        href={getAudioSrc(selectedHymn)}
                        download={
                          selectedHymn.file_name || `${selectedHymn.title}.mp3`
                        }
                        target="_blank"
                      >
                        Tải file âm thanh (MP3)
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="empty-player-state">
                    <CustomerServiceOutlined className="empty-icon" />
                    <Text type="secondary">
                      Chọn một bài hát từ danh sách để phát nhạc và xem lời
                    </Text>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* STYLESHEET */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap');

          .hymns-wrapper {
            background: ${themeColors.bgSoft};
            min-height: 100vh;
            padding: 40px 20px 80px 20px;
            font-family: 'Be Vietnam Pro', sans-serif;
          }

          .hymns-container {
            max-width: 1180px;
            margin: 0 auto;
          }

          /* Header */
          .hymns-header {
            text-align: center;
            margin-bottom: 32px;
          }

          .sacred-badge {
            background: ${themeColors.accentLight};
            border: 1px solid ${themeColors.accent};
            color: ${themeColors.primary};
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

          .hymns-main-title {
            font-family: 'Playfair Display', Georgia, serif !important;
            color: ${themeColors.primary} !important;
            font-size: clamp(28px, 4vw, 38px) !important;
            font-weight: 700 !important;
            margin: 0 !important;
          }

          .title-gold-line {
            width: 50px;
            height: 3px;
            background: ${themeColors.accent};
            margin: 12px auto;
            border-radius: 2px;
          }

          .hymns-subtitle {
            color: ${themeColors.textSecondary};
            font-size: 15px;
          }

          /* Grid Layout */
          .hymns-grid {
            display: grid;
            grid-template-columns: 1fr 1.25fr;
            gap: 24px;
            align-items: start;
          }

          /* Cards Styling */
          .glass-card {
            background: ${themeColors.cardBg} !important;
            border-radius: 20px !important;
            border: 1px solid rgba(226, 232, 240, 0.8) !important;
            box-shadow: 0 10px 30px -10px rgba(27, 54, 93, 0.05) !important;
            overflow: hidden;
          }

          .sticky-card {
            position: sticky;
            top: 24px;
          }

          /* Left List Column Header & Chips */
          .list-card-header {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .header-left h3 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 18px;
            font-weight: 700;
            color: ${themeColors.primary};
            margin: 0;
          }

          .gold-icon {
            color: ${themeColors.accent};
            font-size: 20px;
          }

          .count-tag {
            background: ${themeColors.accentLight};
            color: ${themeColors.primary};
            border: none;
            border-radius: 12px;
            font-weight: 700;
          }

          .search-input {
            border-radius: 10px;
            background: #F1F5F9;
            border: 1px solid transparent;
          }

          .search-input:focus, .search-input:hover {
            border-color: ${themeColors.accent} !important;
            background: #FFFFFF;
          }

          .filter-chips-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: #F8FAFC;
            padding: 10px;
            border-radius: 12px;
            border: 1px solid #E2E8F0;
          }

          .filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
            overflow: hidden;
          }

          .filter-label {
            font-size: 11px;
            font-weight: 600;
            color: ${themeColors.textSecondary};
            white-space: nowrap;
          }

          .chips-scroll {
            display: flex;
            align-items: center;
            gap: 6px;
            overflow-x: auto;
            scrollbar-width: none;
            padding-bottom: 2px;
          }

          .chips-scroll::-webkit-scrollbar {
            display: none;
          }

          .filter-chip {
            cursor: pointer;
            border-radius: 12px;
            font-size: 11px;
            padding: 1px 10px;
            background: #FFFFFF;
            border: 1px solid #CBD5E1;
            color: #475569;
            transition: all 0.2s ease;
            margin-right: 0 !important;
          }

          .filter-chip.active {
            background: ${themeColors.primary};
            color: #FFFFFF;
            border-color: ${themeColors.primary};
            font-weight: 600;
          }

          /* List Scroll Area */
          .list-scroll-area {
            max-height: 520px;
            overflow-y: auto;
            padding-right: 6px;
          }

          .hymn-item-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 12px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
          }

          .hymn-item-card:hover {
            background: #F8FAFC;
            border-color: #E2E8F0;
          }

          .hymn-item-card.active-item {
            background: ${themeColors.accentLight};
            border-color: rgba(212, 175, 55, 0.4);
          }

          .play-btn-circle {
            background: transparent;
            border: none;
            font-size: 24px;
            color: ${themeColors.primary};
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            transition: transform 0.2s ease;
          }

          .play-btn-circle.playing {
            color: ${themeColors.accent};
          }

          .hymn-item-card:hover .play-btn-circle {
            transform: scale(1.1);
          }

          .item-details {
            flex: 1;
            min-width: 0;
          }

          .item-title-row {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .hymn-title-text {
            font-weight: 600;
            color: ${themeColors.textPrimary};
            font-size: 14px;
          }

          .now-playing-badge {
            font-size: 10px;
            background: ${themeColors.accent};
            color: #FFF;
            padding: 1px 6px;
            border-radius: 8px;
            font-weight: 600;
            white-space: nowrap;
          }

          .item-sub-row {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 12px;
            color: ${themeColors.textSecondary};
            margin-top: 2px;
          }

          .dot-divider {
            font-size: 10px;
          }

          .category-pill {
            border-radius: 10px;
            font-size: 11px;
            border: none;
            background: #F1F5F9;
            color: ${themeColors.textSecondary};
          }

          /* Right Column: Dynamic Hero Card & Overlay */
          .player-hero-card {
            position: relative;
            background: linear-gradient(135deg, #0F172A 0%, #1B365D 50%, #020617 100%);
            border-radius: 20px;
            padding: 24px;
            color: #FFFFFF;
            box-shadow: 0 12px 30px -8px rgba(15, 23, 42, 0.4);
            transition: all 0.4s ease;
            overflow: hidden;
          }

          .player-hero-card.is-playing {
            box-shadow: 0 16px 40px -6px rgba(212, 175, 55, 0.25);
          }

          .audio-loading-overlay {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.75);
            backdrop-filter: blur(4px);
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          /* Visualizer Waves */
          .visualizer-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 36px;
            margin-bottom: 12px;
          }

          .equalizer-waves {
            display: flex;
            align-items: flex-end;
            gap: 5px;
            height: 28px;
          }

          .equalizer-waves .bar {
            width: 4px;
            height: 6px;
            background: ${themeColors.accent};
            border-radius: 4px;
            transition: height 0.2s ease;
          }

          .equalizer-waves.active .bar-1 { animation: wave 1.2s infinite ease-in-out; }
          .equalizer-waves.active .bar-2 { animation: wave 0.8s infinite ease-in-out 0.2s; }
          .equalizer-waves.active .bar-3 { animation: wave 1.5s infinite ease-in-out 0.4s; }
          .equalizer-waves.active .bar-4 { animation: wave 0.9s infinite ease-in-out 0.1s; }
          .equalizer-waves.active .bar-5 { animation: wave 1.1s infinite ease-in-out 0.3s; }

          @keyframes wave {
            0%, 100% { height: 6px; }
            50% { height: 28px; }
          }

          .hymn-hero-info {
            text-align: center;
            margin-bottom: 20px;
          }

          .gold-pill {
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid ${themeColors.accent};
            color: ${themeColors.accent};
            font-size: 10px;
            border-radius: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .hero-hymn-title {
            color: #FFFFFF !important;
            font-family: 'Playfair Display', Georgia, serif !important;
            margin: 8px 0 4px 0 !important;
            font-size: 20px !important;
          }

          .hero-hymn-artist {
            color: #94A3B8;
            font-size: 13px;
          }

          /* Audio Progress Bar */
          .progress-container {
            margin-bottom: 12px;
          }

          .custom-slider .ant-slider-rail {
            background-color: rgba(255, 255, 255, 0.15) !important;
          }

          .custom-slider .ant-slider-track {
            background-color: ${themeColors.accent} !important;
          }

          .custom-slider .ant-slider-handle::after {
            box-shadow: 0 0 0 2px ${themeColors.accent} !important;
          }

          .time-display {
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #94A3B8;
            margin-top: -4px;
          }

          /* Player Actions & Volume */
          .player-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }

          .player-controls .ant-btn {
            color: #94A3B8;
          }

          .player-controls .ant-btn:hover {
            color: #FFFFFF;
          }

          .center-controls {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .nav-btn {
            font-size: 18px;
            color: #FFFFFF !important;
          }

          .play-main-btn {
            background: ${themeColors.accent} !important;
            border: none !important;
            width: 48px !important;
            height: 48px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 26px !important;
            box-shadow: 0 4px 14px rgba(212, 175, 55, 0.4);
            transition: transform 0.2s ease !important;
          }

          .play-main-btn:hover {
            transform: scale(1.06);
            background: #E5C158 !important;
          }

          .volume-control {
            display: flex;
            align-items: center;
            gap: 4px;
            width: 90px;
          }

          .volume-btn {
            padding: 0 !important;
            font-size: 14px !important;
          }

          .volume-slider {
            flex: 1;
            margin: 0 !important;
          }

          .volume-slider .ant-slider-rail {
            background-color: rgba(255, 255, 255, 0.2) !important;
          }

          .volume-slider .ant-slider-track {
            background-color: #FFFFFF !important;
          }

          /* Lyrics / Karaoke Focus Container */
          .lyrics-focus-container {
            margin-top: 20px;
            background: rgba(248, 250, 252, 0.8);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(212, 175, 55, 0.25);
            border-radius: 16px;
            padding: 16px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
          }

          .lyrics-focus-container.focus-active {
            background: #FFFFFF;
            border-color: ${themeColors.accent};
            box-shadow: 0 8px 30px rgba(212, 175, 55, 0.15);
          }

          .lyrics-header-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px dashed rgba(226, 232, 240, 0.8);
          }

          .lyrics-badge {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.2px;
            color: ${themeColors.primary};
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .header-right-tools {
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .focus-toggle-btn {
            font-size: 11px !important;
            color: ${themeColors.accent} !important;
            font-weight: 600 !important;
            background: rgba(212, 175, 55, 0.1) !important;
            border-radius: 20px !important;
            padding: 2px 10px !important;
          }

          .focus-toggle-btn.active, .focus-toggle-btn:hover {
            background: ${themeColors.accent} !important;
            color: #FFFFFF !important;
          }

          .lyrics-scroll-box {
            max-height: 240px;
            overflow-y: auto;
            padding: 4px 8px;
            text-align: center;
          }

          .lyric-line {
            font-size: 14px;
            line-height: 1.8;
            color: #64748B;
            margin-bottom: 10px !important;
            transition: all 0.3s ease;
            cursor: pointer;
            border-radius: 8px;
            padding: 4px 10px;
          }

          .lyric-line:hover {
            color: ${themeColors.primary};
            background: rgba(27, 54, 93, 0.04);
          }

          .lyric-line.refrain-line {
            font-weight: 600;
            color: #475569;
          }

          .lyric-line.is-active-line {
            color: ${themeColors.primary} !important;
            font-size: 16px !important;
            font-weight: 700 !important;
            background: rgba(212, 175, 55, 0.15);
            border-left: 3px solid ${themeColors.accent};
            border-right: 3px solid ${themeColors.accent};
          }

          .no-lyrics {
            display: block;
            padding: 30px 0;
            font-style: italic;
          }

          .download-btn {
            height: 44px !important;
            border-radius: 10px !important;
            font-weight: 600 !important;
            background: ${themeColors.primary} !important;
            color: #FFFFFF !important;
            border: none !important;
            transition: all 0.2s ease !important;
          }

          .download-btn:hover {
            background: ${themeColors.accent} !important;
            color: ${themeColors.primary} !important;
          }

          .empty-player-state {
            text-align: center;
            padding: 80px 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          .empty-icon {
            font-size: 48px;
            color: #CBD5E1;
          }

          /* Custom Scrollbar */
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #CBD5E1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${themeColors.accent};
          }

          /* Fade in Animation */
          .fade-in {
            animation: fadeIn 0.3s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Responsive Breakpoints */
          @media (max-width: 868px) {
            .hymns-grid {
              grid-template-columns: 1fr;
            }
            .sticky-card {
              position: static;
            }
            .hymns-wrapper {
              padding: 20px 12px;
            }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default Hymns;
