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
     XỬ LÝ ĐƯỜNG DẪN MP3 CHUẨN XÁC (FIX LỖI URL)
  ===================================================== */
  const getAudioSrc = useCallback((item) => {
    if (!item?.file_url) return "";

    const url = item.file_url.trim();
    // 1. Link trực tuyến hoàn chỉnh (http / https / blob)
    if (/^(https?:|blob:|data:)/i.test(url)) {
      return url;
    }

    // 2. Lấy Base URL từ biến môi trường
    let envBase = process.env.REACT_APP_API_URL || "";
    envBase = envBase.replace(/\/+$/, ""); // Xóa slash thừa ở cuối Base URL

    // 3. Đảm bảo path bắt đầu bằng /
    const cleanPath = url.startsWith("/") ? url : `/${url}`;

    return `${envBase}${cleanPath}`;
  }, []);

  /* =====================================================
     LOCAL STORAGE FAVORITES
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

      const audioList = list.filter(
        (item) => item.type === "audio" || item.file_url,
      );

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

  // Categories & Authors Options
  const categories = [
    "ALL",
    ...new Set(hymns.map((h) => h.category || "Thánh ca")),
  ];
  const authors = [
    "ALL",
    ...new Set(hymns.map((h) => h.author || h.uploader_name || "Hà Minh")),
  ];

  // Combined Search & Filter
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
          if (detailedData) {
            setSelectedHymn((prev) => ({ ...prev, ...detailedData }));
          }
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
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Lỗi phát audio:", error);
            message.error(
              "Trình duyệt phát nhạc thất bại hoặc file không hỗ trợ!",
            );
            setIsPlaying(false);
          });
      }
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
    if (isNaN(seconds) || !isFinite(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleCopyLyrics = () => {
    if (selectedHymn?.description) {
      navigator.clipboard.writeText(selectedHymn.description);
      message.success("Đã sao chép toàn bộ lời bài hát!");
    } else {
      message.warning("Bài hát này chưa có thông tin lời!");
    }
  };

  // Tách description thành câu lời
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
              cho thánh lễ
            </Text>
          </header>

          {/* MAIN CONTENT GRID */}
          <div className="hymns-grid">
            {/* CỘT TRÁI: DANH SÁCH BÀI HÁT & BỘ LỌC */}
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

                  {/* BỘ LỌC CHIPS */}
                  <div className="filter-chips-container">
                    <div className="filter-group">
                      <span className="filter-label">
                        <FilterOutlined /> Thể loại:
                      </span>
                      <div className="chips-scroll">
                        {categories.map((cat) => (
                          <Tag
                            key={cat}
                            className={`filter-chip ${
                              selectedCategory === cat ? "active" : ""
                            }`}
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
                            className={`filter-chip ${
                              selectedAuthor === aut ? "active" : ""
                            }`}
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

            {/* CỘT PHẢI: TRÌNH PHÁT & LỜI BÀI HÁT */}
            <div className="hymns-detail-col">
              <Card bordered={false} className="glass-card sticky-card">
                {selectedHymn ? (
                  <div className="player-detail-wrapper fade-in">
                    <div
                      className={`player-hero-card ${
                        isPlaying ? "is-playing" : ""
                      }`}
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
                            Đang nạp dữ liệu âm thanh...
                          </span>
                        </div>
                      )}

                      <div className="visualizer-wrapper">
                        <div
                          className={`equalizer-waves ${
                            isPlaying ? "active" : ""
                          }`}
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

                      {/* TRÌNH PHÁT AUDIO CHÍNH */}
                      <audio
                        ref={audioRef}
                        src={getAudioSrc(selectedHymn)}
                        crossOrigin="anonymous"
                        onTimeUpdate={handleTimeUpdate}
                        onWaiting={() => setAudioLoading(true)}
                        onCanPlay={() => setAudioLoading(false)}
                        onLoadedData={() => setAudioLoading(false)}
                        onError={(e) => {
                          console.error("Audio Load Error Event:", e);
                          setAudioLoading(false);
                          setIsPlaying(false);
                          message.error(
                            "Không thể tải/phát file MP3! Vui lòng kiểm tra lại.",
                          );
                        }}
                        onLoadedMetadata={() =>
                          setDuration(audioRef.current?.duration || 0)
                        }
                        onEnded={handleNextTrack}
                        autoPlay={isPlaying}
                      />

                      {/* THANH THỜI GIAN */}
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

                      {/* PHÍM ĐIỀU KHIỂN & ÂM LƯỢNG */}
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

                    {/* KHU VỰC HIỂN THỊ LỜI BÀI HÁT */}
                    <div
                      className={`lyrics-focus-container ${
                        isFocusMode ? "focus-active" : ""
                      }`}
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
                            className={`focus-toggle-btn ${
                              isFocusMode ? "active" : ""
                            }`}
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
                                className={`lyric-line ${
                                  isActive ? "is-active-line" : ""
                                } ${isRefrain ? "refrain-line" : ""}`}
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

                    {/* PHÍM TẢI FILE */}
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
            width: 60px;
            height: 3px;
            background: ${themeColors.accent};
            margin: 12px auto;
            border-radius: 2px;
          }

          .hymns-subtitle {
            color: ${themeColors.textSecondary};
            font-size: 14px;
          }

          /* Layout Grid */
          .hymns-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
          }

          @media (min-width: 992px) {
            .hymns-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          /* Card Styling */
          .glass-card {
            background: ${themeColors.cardBg} !important;
            border-radius: 20px !important;
            border: 1px solid ${themeColors.border} !important;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04) !important;
            overflow: hidden;
          }

          .sticky-card {
            position: sticky;
            top: 20px;
          }

          /* List Card Header & Filters */
          .list-card-header {
            margin-bottom: 16px;
          }

          .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 12px;
          }

          .header-left h3 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            color: ${themeColors.primary};
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
            font-weight: 600;
          }

          .search-input {
            border-radius: 10px;
            margin-bottom: 12px;
          }

          .filter-chips-container {
            background: #F1F5F9;
            padding: 10px;
            border-radius: 12px;
          }

          .filter-group {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .filter-label {
            font-size: 11px;
            font-weight: 700;
            color: ${themeColors.textSecondary};
            white-space: nowrap;
          }

          .chips-scroll {
            display: flex;
            gap: 6px;
            overflow-x: auto;
            padding-bottom: 2px;
          }

          .filter-chip {
            cursor: pointer;
            border-radius: 10px;
            border: none;
            background: #FFFFFF;
            color: ${themeColors.textSecondary};
            font-size: 12px;
            transition: all 0.2s;
          }

          .filter-chip.active {
            background: ${themeColors.primary};
            color: #FFFFFF;
          }

          /* Scroll Area */
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #CBD5E1;
            border-radius: 10px;
          }

          .list-scroll-area {
            max-height: 520px;
            overflow-y: auto;
            padding-right: 4px;
          }

          /* Hymn Item Card */
          .hymn-item-card {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border-radius: 14px;
            margin-bottom: 8px;
            background: #FFFFFF;
            border: 1px solid #F1F5F9;
            cursor: pointer;
            transition: all 0.2s;
          }

          .hymn-item-card:hover {
            border-color: ${themeColors.accent};
            background: #FAF9F5;
          }

          .hymn-item-card.active-item {
            background: ${themeColors.accentLight};
            border-color: ${themeColors.accent};
          }

          .play-btn-circle {
            background: none;
            border: none;
            font-size: 28px;
            color: ${themeColors.primary};
            cursor: pointer;
            display: flex;
            align-items: center;
          }

          .play-btn-circle.playing {
            color: ${themeColors.accent};
          }

          .item-details {
            flex: 1;
            min-width: 0;
          }

          .hymn-title-text {
            font-weight: 600;
            color: ${themeColors.textPrimary};
            display: block;
          }

          .now-playing-badge {
            font-size: 10px;
            background: ${themeColors.accent};
            color: #FFF;
            padding: 1px 6px;
            border-radius: 8px;
            margin-left: 6px;
          }

          .item-sub-row {
            font-size: 12px;
            color: ${themeColors.textSecondary};
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .dot-divider {
            color: #CBD5E1;
          }

          .category-pill {
            border-radius: 8px;
            font-size: 11px;
            border: none;
            background: #E2E8F0;
          }

          /* Player Detail Right Side */
          .player-hero-card {
            background: linear-gradient(135deg, ${themeColors.primary} 0%, #0D1B2A 100%);
            border-radius: 16px;
            padding: 24px;
            color: #FFFFFF;
            position: relative;
            overflow: hidden;
            box-shadow: 0 12px 28px rgba(27, 54, 93, 0.25);
          }

          .audio-loading-overlay {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.75);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
            backdrop-filter: blur(2px);
          }

          .visualizer-wrapper {
            height: 30px;
            display: flex;
            align-items: flex-end;
            margin-bottom: 12px;
          }

          .equalizer-waves {
            display: flex;
            align-items: flex-end;
            gap: 4px;
            height: 100%;
          }

          .equalizer-waves .bar {
            width: 4px;
            background: ${themeColors.accent};
            border-radius: 2px;
            height: 6px;
            transition: height 0.2s;
          }

          .equalizer-waves.active .bar {
            animation: wave 1s infinite ease-in-out alternate;
          }

          .equalizer-waves.active .bar-1 { animation-delay: 0.1s; }
          .equalizer-waves.active .bar-2 { animation-delay: 0.3s; }
          .equalizer-waves.active .bar-3 { animation-delay: 0.2s; }
          .equalizer-waves.active .bar-4 { animation-delay: 0.4s; }
          .equalizer-waves.active .bar-5 { animation-delay: 0.15s; }

          @keyframes wave {
            0% { height: 4px; }
            100% { height: 26px; }
          }

          .gold-pill {
            background: rgba(212, 175, 55, 0.2);
            border: 1px solid ${themeColors.accent};
            color: ${themeColors.accent};
            border-radius: 10px;
            font-size: 11px;
            margin-bottom: 8px;
          }

          .hero-hymn-title {
            color: #FFFFFF !important;
            margin: 4px 0 !important;
            font-size: 20px !important;
          }

          .hero-hymn-artist {
            color: #94A3B8;
            font-size: 13px;
          }

          .hero-hymn-artist strong {
            color: #E2E8F0;
          }

          .progress-container {
            margin-top: 16px;
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

          .player-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 12px;
          }

          .player-controls .ant-btn {
            color: #FFFFFF;
          }

          .center-controls {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .play-main-btn {
            background: ${themeColors.accent} !important;
            border-color: ${themeColors.accent} !important;
            color: ${themeColors.primary} !important;
            font-size: 24px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 48px !important;
            height: 48px !important;
          }

          .volume-control {
            display: flex;
            align-items: center;
            width: 90px;
            gap: 4px;
          }

          .volume-slider {
            flex: 1;
            margin: 0 !important;
          }

          /* Lyrics Focus Box */
          .lyrics-focus-container {
            margin-top: 20px;
            background: #F8FAFC;
            border: 1px solid #E2E8F0;
            border-radius: 14px;
            padding: 16px;
            transition: all 0.3s;
          }

          .lyrics-focus-container.focus-active {
            background: #0F172A;
            border-color: ${themeColors.accent};
          }

          .lyrics-header-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #E2E8F0;
          }

          .focus-active .lyrics-header-actions {
            border-color: #1E293B;
          }

          .lyrics-badge {
            font-size: 11px;
            font-weight: 700;
            color: ${themeColors.primary};
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .focus-active .lyrics-badge {
            color: ${themeColors.accent};
          }

          .focus-toggle-btn {
            font-size: 11px;
            border-radius: 8px;
          }

          .focus-toggle-btn.active {
            background: ${themeColors.accent};
            color: ${themeColors.primary};
          }

          .lyrics-scroll-box {
            max-height: 240px;
            overflow-y: auto;
            text-align: center;
            padding: 0 8px;
          }

          .lyric-line {
            font-size: 14px;
            color: ${themeColors.textSecondary};
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.2s;
            line-height: 1.6;
          }

          .lyric-line:hover {
            color: ${themeColors.primary};
          }

          .focus-active .lyric-line {
            color: #64748B;
          }

          .lyric-line.is-active-line {
            font-weight: 700;
            font-size: 16px;
            color: ${themeColors.primary};
          }

          .focus-active .lyric-line.is-active-line {
            color: ${themeColors.accent};
            text-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
          }

          .lyric-line.refrain-line {
            font-style: italic;
            font-weight: 600;
          }

          .no-lyrics {
            display: block;
            padding: 20px 0;
          }

          .download-btn {
            margin-top: 16px;
            border-radius: 10px;
            height: 40px;
            font-weight: 600;
            border-color: ${themeColors.primary};
            color: ${themeColors.primary};
          }

          .download-btn:hover {
            background: ${themeColors.primary};
            color: #FFFFFF;
          }

          .empty-player-state {
            padding: 60px 20px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
          }

          .empty-icon {
            font-size: 42px;
            color: #CBD5E1;
          }

          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `,
          }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default Hymns;
