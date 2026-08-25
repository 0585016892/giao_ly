import React, { useState, useEffect, useCallback } from "react";
import {
  Col,
  Row,
  Input,
  Tag,
  Button,
  Spin,
  message,
  Pagination,
  Modal,
  Tooltip,
  Upload,
  Select,
  Form,
} from "antd";

import { motion } from "framer-motion";

import {
  Search,
  Image as ImageIcon,
  Video as VideoIcon,
  LayoutGrid,
  List,
  Calendar,
  Eye,
  Camera,
  Download,
  Share2,
  Maximize2,
  Check,
  Upload as UploadIcon,
  X,
  Play,
} from "lucide-react";

import { getGalleryImages } from "../api/galleryApi";

import {
  getMediaById,
  createMedia,
  increaseMediaView,
  getVideos,
} from "../api/mediaApi";

const LibraryPage = () => {
  /* =========================================================
     STATE
  ========================================================= */

  const [activeTab, setActiveTab] = useState("image");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const [loading, setLoading] = useState(true);
  const [libraryItems, setLibraryItems] = useState([]);

  /* Modal xem */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  /* Share */
  const [copied, setCopied] = useState(false);

  /* Upload video */
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadForm] = Form.useForm();

  const [videoFile, setVideoFile] = useState(null);

  const URL = process.env.REACT_APP_API_URL || "http://localhost:12003";

  /* =========================================================
     HELPER
  ========================================================= */

  const getMediaUrl = useCallback(
    (item) => {
      if (!item) return "";

      const mediaPath =
        item.url ||
        item.file ||
        item.file_url ||
        item.media_url ||
        item.video ||
        item.image;

      if (!mediaPath) return "";

      if (mediaPath.startsWith("http://") || mediaPath.startsWith("https://")) {
        return mediaPath;
      }

      let cleanPath = mediaPath;

      if (cleanPath.startsWith("/")) {
        cleanPath = cleanPath.slice(1);
      }

      return `${URL}/${cleanPath}`;
    },
    [URL],
  );

  /* =========================================================
     FORMAT MEDIA
  ========================================================= */

  const formatMediaItem = useCallback(
    (item, index = 0) => {
      const type = item.type || item.media_type || "video";

      let category = item.category || item.category_name || "Sự kiện";

      if (category === "youth") category = "Giới trẻ";
      if (category === "mass") category = "Thánh lễ";
      if (category === "event") category = "Sự kiện";
      if (category === "children") category = "Thiếu nhi";
      if (category === "charity") category = "Bác ái";
      if (category === "catechism") category = "Giáo lý";

      return {
        id: item.id || item.media_id || index,

        title:
          item.title ||
          item.name ||
          item.caption ||
          "Khoảnh khắc Giáo xứ Đông Quan",

        description: item.description || item.content || "",

        category,

        type,

        url: getMediaUrl(item),

        thumbnail:
          item.thumbnail ||
          item.thumbnail_url ||
          item.cover ||
          getMediaUrl(item),

        date:
          item.created_at || item.date
            ? new Date(item.created_at || item.date).toLocaleDateString("vi-VN")
            : "14/08/2026",

        views: Number(item.views || item.view_count || 0),

        status: item.status || "published",

        author:
          item.author ||
          item.author_name ||
          item.user_name ||
          "Cộng đoàn Giáo xứ",

        duration: item.duration || null,

        raw: item,
      };
    },
    [getMediaUrl],
  );

  /* =========================================================
     LOAD IMAGE
  ========================================================= */

  const fetchImages = useCallback(async () => {
    try {
      const res = await getGalleryImages();

      if (res?.data?.success && Array.isArray(res.data.data)) {
        const allowedTypes = ["image", "group", "slide"];

        const filteredData = res.data.data.filter((item) =>
          allowedTypes.includes(item.type),
        );

        const formattedData = filteredData.map((item, index) => {
          let imageUrl =
            "https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=800&q=80";

          if (item.image) {
            if (
              item.image.startsWith("http://") ||
              item.image.startsWith("https://")
            ) {
              imageUrl = item.image;
            } else {
              let subFolder = "";

              if (!item.image.includes("uploads/")) {
                if (item.type === "image") {
                  subFolder = "uploads/events/";
                } else if (item.type === "group") {
                  subFolder = "uploads/groups/";
                } else if (item.type === "slide") {
                  subFolder = "uploads/slides/";
                }
              }

              const cleanImagePath = item.image.startsWith("/")
                ? item.image.slice(1)
                : item.image;

              imageUrl = `${URL}/${subFolder}${cleanImagePath}`;
            }
          }

          return {
            id: item.id || index,

            title: item.name || item.title || "Khoảnh khắc Giáo xứ Đông Quan",

            description: item.description || "",

            category:
              item.type === "group"
                ? "Giới trẻ"
                : item.type === "slide"
                  ? "Sự kiện"
                  : "Thánh lễ",

            type: "image",

            url: imageUrl,

            thumbnail: imageUrl,

            date: item.created_at
              ? new Date(item.created_at).toLocaleDateString("vi-VN")
              : "14/08/2026",

            views: Number(item.views || 0),

            status: "published",

            author: "Giáo xứ Đông Quan",

            raw: item,
          };
        });

        return formattedData;
      }

      return [];
    } catch (error) {
      console.error("Lỗi tải hình ảnh:", error);
      return [];
    }
  }, [URL]);

  /* =========================================================
     LOAD VIDEO
  ========================================================= */

  const fetchVideos = useCallback(async () => {
    try {
      const res = await getVideos();

      /*
       * Backend nên chỉ trả:
       * published / active
       *
       * Nhưng frontend vẫn filter thêm một lần
       * để đảm bảo video draft / hidden không xuất hiện.
       */

      const data = res?.data?.data || res?.data || [];

      if (!Array.isArray(data)) {
        return [];
      }

      return data
        .filter(
          (item) =>
            item.status === "published" ||
            item.status === "active" ||
            !item.status,
        )
        .map((item, index) => formatMediaItem(item, index));
    } catch (error) {
      console.error("Lỗi tải video:", error);
      message.error("Không thể tải danh sách video!");
      return [];
    }
  }, [formatMediaItem]);

  /* =========================================================
     LOAD DATA
  ========================================================= */

  const fetchLibraryData = useCallback(async () => {
    try {
      setLoading(true);

      if (activeTab === "image") {
        const images = await fetchImages();
        setLibraryItems(images);
      } else {
        const videos = await fetchVideos();
        setLibraryItems(videos);
      }
    } catch (error) {
      console.error("Lỗi thư viện:", error);

      message.error("Không thể tải dữ liệu thư viện!");
      setLibraryItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, fetchImages, fetchVideos]);

  useEffect(() => {
    fetchLibraryData();
  }, [fetchLibraryData]);

  /* =========================================================
     CATEGORY
  ========================================================= */

  const categories = [
    {
      name: "Tất cả",
      count: libraryItems.length,
    },
    {
      name: "Thánh lễ",
      count: libraryItems.filter((i) => i.category === "Thánh lễ").length,
    },
    {
      name: "Giáo lý",
      count: libraryItems.filter((i) => i.category === "Giáo lý").length,
    },
    {
      name: "Thiếu nhi",
      count: libraryItems.filter((i) => i.category === "Thiếu nhi").length,
    },
    {
      name: "Giới trẻ",
      count: libraryItems.filter((i) => i.category === "Giới trẻ").length,
    },
    {
      name: "Bác ái",
      count: libraryItems.filter((i) => i.category === "Bác ái").length,
    },
    {
      name: "Sự kiện",
      count: libraryItems.filter((i) => i.category === "Sự kiện").length,
    },
  ];

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredItems = libraryItems.filter((item) => {
    const matchTab =
      activeTab === "image" ? item.type !== "video" : item.type === "video";

    const matchCategory =
      activeCategory === "Tất cả" || item.category === activeCategory;

    const matchSearch =
      item.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchText.toLowerCase());

    return matchTab && matchCategory && matchSearch;
  });

  const startIndex = (currentPage - 1) * pageSize;

  const currentItems = filteredItems.slice(startIndex, startIndex + pageSize);

  /* =========================================================
     CHANGE FILTER
  ========================================================= */

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setActiveCategory("Tất cả");
    setSearchText("");
    setCurrentPage(1);
  };

  /* =========================================================
     OPEN MEDIA
  ========================================================= */

  const handleOpenModal = async (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);

    /*
     * Video:
     * gọi getMediaById
     * rồi tăng view
     */

    if (item.type === "video") {
      try {
        setDetailLoading(true);

        const res = await getMediaById(item.id);

        const detail = res?.data?.data || res?.data;

        if (detail) {
          setSelectedItem((prev) => ({
            ...prev,
            ...formatMediaItem(detail),
          }));
        }

        // Tăng lượt xem
        try {
          await increaseMediaView(item.id);
        } catch (viewError) {
          console.warn("Không thể tăng lượt xem:", viewError);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết video:", error);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  const handleDownload = async (url, title, type = "image") => {
    try {
      message.loading({
        content: "Đang chuẩn bị tải xuống...",
        key: "download",
      });

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Không tải được file");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = blobUrl;

      const safeName =
        title?.replace(/[^a-zA-Z0-9À-ỹ ]/g, "").trim() || "media-giao-xu";

      link.download = `${safeName}.${type === "video" ? "mp4" : "jpg"}`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);

      message.success({
        content: "Tải xuống thành công!",
        key: "download",
      });
    } catch (error) {
      console.error("Lỗi download:", error);

      window.open(url, "_blank");

      message.info({
        content: "Đã mở file trong tab mới.",
        key: "download",
      });
    }
  };

  /* =========================================================
     SHARE
  ========================================================= */

  const handleShare = async (item) => {
    try {
      const shareUrl = `${window.location.origin}/thu-vien/${item.id}`;

      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: item.description || item.title,
          url: shareUrl,
        });

        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);

        setCopied(true);

        message.success("Đã sao chép liên kết!");

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  /* =========================================================
     VIDEO UPLOAD
  ========================================================= */

  const handleSelectVideo = (file) => {
    const isVideo = file.type?.startsWith("video/");

    if (!isVideo) {
      message.error("Vui lòng chọn file video!");
      return Upload.LIST_IGNORE;
    }

    /*
     * Giới hạn 500MB
     */
    const isLt500M = file.size / 1024 / 1024 < 500;

    if (!isLt500M) {
      message.error("Video phải nhỏ hơn 500MB!");
      return Upload.LIST_IGNORE;
    }

    setVideoFile(file);

    return false;
  };

  /* =========================================================
     SUBMIT VIDEO CONTRIBUTION
  ========================================================= */

  const handleSubmitVideo = async (values) => {
    if (!videoFile) {
      message.warning("Vui lòng chọn video!");
      return;
    }

    try {
      setUploadLoading(true);

      const formData = new FormData();

      formData.append("title", values.title);

      formData.append("description", values.description || "");

      formData.append("category", values.category);

      /*
       * CỰC KỲ QUAN TRỌNG
       *
       * Người dùng upload thì luôn:
       *
       * status = draft
       *
       * Không cho frontend public tự gửi published.
       */

      formData.append("status", "draft");

      formData.append("type", "video");

      formData.append("video", videoFile);

      const res = await createMedia(formData);

      if (res?.data?.success || res?.data) {
        message.success(
          "Đã gửi video! Video sẽ được kiểm duyệt trước khi công khai.",
        );

        uploadForm.resetFields();

        setVideoFile(null);

        setIsUploadModalOpen(false);
      } else {
        message.error("Không thể gửi video!");
      }
    } catch (error) {
      console.error("Upload video error:", error);

      message.error(error?.response?.data?.message || "Không thể gửi video!");
    } finally {
      setUploadLoading(false);
    }
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
        fontFamily: "'Be Vietnam Pro', sans-serif",
        paddingBottom: "80px",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .gx-lib-container {
            width: 100%;
            max-width: 1320px;
            margin: 0 auto;
            padding: 24px 16px;
          }

          @media (min-width: 768px) {
            .gx-lib-container {
              padding: 40px 24px 0;
            }
          }

          .gx-lib-container *,
          .gx-lib-container *::before,
          .gx-lib-container *::after {
            box-sizing: border-box;
          }

          .gx-lib-banner {
            position: relative;
            border-radius: 20px;
            overflow: hidden;
            background: linear-gradient(
              135deg,
              #0f172a 0%,
              #1e293b 100%
            );
            padding: 32px 20px;
            color: #fff;
            box-shadow: 0 15px 35px rgba(15,23,42,.12);
            margin-bottom: 24px;
          }

          @media (min-width: 768px) {
            .gx-lib-banner {
              padding: 60px 48px;
              border-radius: 24px;
              margin-bottom: 36px;
            }
          }

          .gx-banner-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: #d4af37;
            text-transform: uppercase;
            background: rgba(212,175,55,.1);
            padding: 5px 12px;
            border-radius: 30px;
            margin-bottom: 12px;
            border: 1px solid rgba(212,175,55,.2);
          }

          .gx-banner-title {
            font-family: 'Playfair Display', serif;
            font-size: clamp(26px,5vw,48px);
            font-weight: 700;
            margin: 0 0 8px;
            color: #fff;
          }

          .gx-banner-desc {
            font-size: 14px;
            color: #94a3b8;
            margin: 0;
            max-width: 600px;
            line-height: 1.6;
          }

          .gx-filter-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            margin-bottom: 24px;
            background: #fff;
            padding: 16px;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
          }

          .gx-category-pills {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            width: 100%;
          }

          .gx-pill-btn {
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: #475569;
          }

          .gx-pill-btn.active {
            background: #0f172a;
            color: #d4af37;
            border-color: #0f172a;
          }

          .gx-gallery-card {
            background: #fff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(15,23,42,.03);
            transition: all .35s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
            cursor: pointer;
          }

          .gx-gallery-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 35px rgba(15,23,42,.08);
          }

          .gx-gallery-img-wrap {
            position: relative;
            width: 100%;
            overflow: hidden;
            background: #0f172a;
          }

          .gx-gallery-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform .6s ease;
          }

          .gx-gallery-card:hover .gx-gallery-img {
            transform: scale(1.05);
          }

          .gx-overlay-actions {
            position: absolute;
            inset: 0;
            background: rgba(15,23,42,.4);
            backdrop-filter: blur(2px);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            opacity: 0;
            transition: opacity .3s ease;
            z-index: 3;
          }

          .gx-gallery-card:hover .gx-overlay-actions {
            opacity: 1;
          }

          .gx-action-btn {
            background: #fff;
            color: #0f172a;
            border: none;
            width: 38px;
            height: 38px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }

          .gx-gallery-content {
            padding: 16px;
            flex: 1;
          }

          .gx-gallery-title {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 12px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .gx-gallery-meta {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #f1f5f9;
            padding-top: 10px;
          }

          .gx-upload-zone {
            border: 2px dashed #cbd5e1;
            border-radius: 14px;
            padding: 30px 20px;
            text-align: center;
            background: #f8fafc;
          }

          .gx-video-play {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: rgba(212,175,55,.95);
            color: #0f172a;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
          }
        `,
        }}
      />

      <div className="gx-lib-container">
        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="gx-lib-banner">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div>
              <div className="gx-banner-badge">
                <Camera size={14} />
                Thư viện giáo xứ
              </div>

              <h1 className="gx-banner-title">Khoảnh khắc Giáo xứ</h1>

              <p className="gx-banner-desc">
                Lưu giữ những kỷ niệm đẹp của cộng đoàn Giáo xứ Đông Quan.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {/* TAB */}

              <div
                style={{
                  display: "flex",
                  background: "rgba(255,255,255,.08)",
                  padding: 4,
                  borderRadius: 12,
                  width: "100%",
                  maxWidth: 320,
                }}
              >
                <Button
                  type={activeTab === "image" ? "primary" : "text"}
                  style={{
                    flex: 1,
                    background: activeTab === "image" ? "#fff" : "transparent",
                    color: activeTab === "image" ? "#0f172a" : "#cbd5e1",
                    border: "none",
                    borderRadius: 8,
                  }}
                  onClick={() => handleTabChange("image")}
                >
                  <ImageIcon size={15} />
                  Hình ảnh
                </Button>

                <Button
                  type={activeTab === "video" ? "primary" : "text"}
                  style={{
                    flex: 1,
                    background: activeTab === "video" ? "#fff" : "transparent",
                    color: activeTab === "video" ? "#0f172a" : "#cbd5e1",
                    border: "none",
                    borderRadius: 8,
                  }}
                  onClick={() => handleTabChange("video")}
                >
                  <VideoIcon size={15} />
                  Video
                </Button>
              </div>

              {/* ĐÓNG GÓP VIDEO */}

              {activeTab === "video" && (
                <Button
                  icon={<UploadIcon size={15} />}
                  onClick={() => setIsUploadModalOpen(true)}
                  style={{
                    height: 46,
                    borderRadius: 10,
                    fontWeight: 700,
                    background: "#d4af37",
                    borderColor: "#d4af37",
                    color: "#0f172a",
                  }}
                >
                  Đóng góp video
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================
            FILTER
        ===================================================== */}

        <div className="gx-filter-bar">
          <div className="gx-category-pills">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`gx-pill-btn ${
                  activeCategory === cat.name ? "active" : ""
                }`}
                onClick={() => handleCategoryChange(cat.name)}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <Input
              placeholder="Tìm kiếm khoảnh khắc..."
              prefix={
                <Search
                  size={16}
                  style={{
                    color: "#94a3b8",
                    marginRight: 8,
                  }}
                />
              }
              value={searchText}
              onChange={handleSearchChange}
              allowClear
              style={{
                borderRadius: 10,
                padding: "8px 12px",
                flex: 1,
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 4,
                background: "#f8fafc",
                padding: 3,
                borderRadius: 10,
              }}
            >
              <Button
                type="text"
                icon={<LayoutGrid size={15} />}
                style={{
                  color: viewMode === "grid" ? "#d4af37" : "#64748b",
                  background: viewMode === "grid" ? "#0f172a" : "transparent",
                }}
                onClick={() => setViewMode("grid")}
              />

              <Button
                type="text"
                icon={<List size={15} />}
                style={{
                  color: viewMode === "list" ? "#d4af37" : "#64748b",
                  background: viewMode === "list" ? "#0f172a" : "transparent",
                }}
                onClick={() => setViewMode("list")}
              />
            </div>
          </div>
        </div>

        {/* RESULT COUNT */}

        <div
          style={{
            marginBottom: 20,
            fontSize: 13,
            color: "#64748b",
          }}
        >
          Hiển thị tổng số{" "}
          <strong style={{ color: "#0f172a" }}>{filteredItems.length}</strong>{" "}
          kết quả
        </div>

        {/* =====================================================
            LIST
        ===================================================== */}

        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
            }}
          >
            <Spin size="large" />
          </div>
        ) : currentItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #e2e8f0",
            }}
          >
            <p
              style={{
                color: "#64748b",
                margin: 0,
              }}
            >
              Không tìm thấy hình ảnh hoặc video phù hợp.
            </p>

            {activeTab === "video" && (
              <Button
                type="primary"
                icon={<UploadIcon size={15} />}
                style={{
                  marginTop: 16,
                  background: "#d4af37",
                  borderColor: "#d4af37",
                  color: "#0f172a",
                }}
                onClick={() => setIsUploadModalOpen(true)}
              >
                Đóng góp video đầu tiên
              </Button>
            )}
          </div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {currentItems.map((item, idx) => (
                <Col
                  xs={24}
                  sm={viewMode === "grid" ? 12 : 24}
                  md={viewMode === "grid" ? 12 : 24}
                  lg={viewMode === "grid" ? 8 : 24}
                  key={item.id || idx}
                >
                  <motion.div
                    className="gx-gallery-card"
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.03,
                    }}
                    style={{
                      flexDirection: viewMode === "list" ? "row" : "column",
                    }}
                    onClick={() => handleOpenModal(item)}
                  >
                    <div
                      className="gx-gallery-img-wrap"
                      style={{
                        width: viewMode === "list" ? 180 : "100%",
                        height: viewMode === "list" ? "auto" : 220,
                        minHeight: viewMode === "list" ? 120 : 220,
                      }}
                    >
                      <Tag
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          zIndex: 5,
                          background: "rgba(15,23,42,.75)",
                          color: "#fff",
                          border: "none",
                          borderRadius: 20,
                        }}
                      >
                        {item.category}
                      </Tag>

                      {/* VIDEO PLAY */}

                      {item.type === "video" && (
                        <div className="gx-video-play">
                          <Play size={24} fill="currentColor" />
                        </div>
                      )}

                      <div
                        className="gx-overlay-actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip title="Xem">
                          <button
                            className="gx-action-btn"
                            onClick={() => handleOpenModal(item)}
                          >
                            {item.type === "video" ? (
                              <Play size={16} />
                            ) : (
                              <Maximize2 size={16} />
                            )}
                          </button>
                        </Tooltip>

                        <Tooltip title="Tải xuống">
                          <button
                            className="gx-action-btn"
                            onClick={() =>
                              handleDownload(item.url, item.title, item.type)
                            }
                          >
                            <Download size={16} />
                          </button>
                        </Tooltip>

                        <Tooltip title="Chia sẻ">
                          <button
                            className="gx-action-btn"
                            onClick={() => handleShare(item)}
                          >
                            <Share2 size={16} />
                          </button>
                        </Tooltip>
                      </div>

                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          poster={`${process.env.REACT_APP_API_URL}${item.thumbnail}`}
                          className="gx-gallery-img"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.title}
                          className="gx-gallery-img"
                        />
                      )}
                    </div>

                    <div className="gx-gallery-content">
                      <h3 className="gx-gallery-title">{item.title}</h3>

                      <div className="gx-gallery-meta">
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Calendar size={13} />
                          {item.date}
                        </span>

                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Eye size={13} />
                          {item.views}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>

            {filteredItems.length > pageSize && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 32,
                }}
              >
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredItems.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}

        {/* =====================================================
            MEDIA MODAL
        ===================================================== */}

        <Modal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
          centered
          width={900}
          styles={{
            body: {
              padding: 0,
              overflow: "hidden",
            },
          }}
        >
          {selectedItem && (
            <div
              style={{
                background: "#0f172a",
                color: "#fff",
              }}
            >
              <div
                style={{
                  background: "#000",
                  minHeight: 300,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {detailLoading ? (
                  <Spin />
                ) : selectedItem.type === "video" ? (
                  <video
                    src={selectedItem.url}
                    poster={`${process.env.REACT_APP_API_URL}${selectedItem.thumbnail}`}
                    controls
                    autoPlay
                    style={{
                      width: "100%",
                      maxHeight: "65vh",
                      background: "#000",
                    }}
                  />
                ) : (
                  <img
                    src={`${selectedItem.url}`}
                    alt={selectedItem.title}
                    style={{
                      width: "100%",
                      maxHeight: "65vh",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>

              <div
                style={{
                  padding: 20,
                  background: "#1e293b",
                }}
              >
                <Tag color="gold">{selectedItem.category}</Tag>

                <h2
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    margin: "10px 0",
                  }}
                >
                  {selectedItem.title}
                </h2>

                {selectedItem.description && (
                  <p
                    style={{
                      color: "#94a3b8",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedItem.description}
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 15,
                    color: "#94a3b8",
                    fontSize: 13,
                    marginBottom: 15,
                  }}
                >
                  <span>
                    <Calendar size={13} /> {selectedItem.date}
                  </span>

                  <span>
                    <Eye size={13} /> {selectedItem.views} lượt xem
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                  }}
                >
                  <Button
                    icon={<Download size={15} />}
                    onClick={() =>
                      handleDownload(
                        selectedItem.url,
                        selectedItem.title,
                        selectedItem.type,
                      )
                    }
                    style={{
                      flex: 1,
                      background: "#d4af37",
                      borderColor: "#d4af37",
                      color: "#0f172a",
                      fontWeight: 700,
                    }}
                  >
                    Tải xuống
                  </Button>

                  <Button
                    icon={copied ? <Check size={15} /> : <Share2 size={15} />}
                    onClick={() => handleShare(selectedItem)}
                    style={{
                      flex: 1,
                    }}
                  >
                    {copied ? "Đã chép" : "Chia sẻ"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* =====================================================
            UPLOAD VIDEO MODAL
        ===================================================== */}

        <Modal
          open={isUploadModalOpen}
          title="Đóng góp video cho Giáo xứ"
          onCancel={() => {
            if (!uploadLoading) {
              setIsUploadModalOpen(false);
              uploadForm.resetFields();
              setVideoFile(null);
            }
          }}
          footer={null}
          centered
          width={600}
        >
          <div
            style={{
              background: "#f8fafc",
              padding: 14,
              borderRadius: 10,
              marginBottom: 20,
              color: "#475569",
              fontSize: 13,
              lineHeight: 1.6,
            }}
          >
            <strong>Lưu ý:</strong> Video sau khi gửi sẽ được chuyển sang trạng
            thái <Tag color="orange">Chờ duyệt</Tag>. Ban quản trị sẽ kiểm tra
            trước khi video được công khai.
          </div>

          <Form
            form={uploadForm}
            layout="vertical"
            onFinish={handleSubmitVideo}
          >
            <Form.Item
              label="Tiêu đề video"
              name="title"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tiêu đề!",
                },
                {
                  min: 3,
                  message: "Tiêu đề tối thiểu 3 ký tự!",
                },
              ]}
            >
              <Input
                placeholder="VD: Thánh lễ Chúa Nhật 15/08/2026"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Danh mục"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn danh mục!",
                },
              ]}
            >
              <Select
                size="large"
                placeholder="Chọn danh mục"
                options={[
                  {
                    label: "Thánh lễ",
                    value: "Thánh lễ",
                  },
                  {
                    label: "Giáo lý",
                    value: "Giáo lý",
                  },
                  {
                    label: "Thiếu nhi",
                    value: "Thiếu nhi",
                  },
                  {
                    label: "Giới trẻ",
                    value: "Giới trẻ",
                  },
                  {
                    label: "Bác ái",
                    value: "Bác ái",
                  },
                  {
                    label: "Sự kiện",
                    value: "Sự kiện",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item label="Mô tả" name="description">
              <Input.TextArea
                rows={4}
                placeholder="Giới thiệu ngắn về video..."
              />
            </Form.Item>

            <Form.Item label="Video">
              <div className="gx-upload-zone">
                <Upload
                  accept="video/mp4,video/webm,video/quicktime"
                  maxCount={1}
                  beforeUpload={handleSelectVideo}
                  showUploadList={false}
                >
                  <Button icon={<UploadIcon size={16} />}>Chọn video</Button>
                </Upload>

                {videoFile && (
                  <div
                    style={{
                      marginTop: 15,
                      padding: 10,
                      background: "#fff",
                      borderRadius: 8,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <VideoIcon size={18} />

                      <span
                        style={{
                          fontSize: 13,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 350,
                        }}
                      >
                        {videoFile.name}
                      </span>
                    </div>

                    <Button
                      type="text"
                      danger
                      icon={<X size={16} />}
                      onClick={() => setVideoFile(null)}
                    />
                  </div>
                )}

                <div
                  style={{
                    marginTop: 10,
                    color: "#94a3b8",
                    fontSize: 12,
                  }}
                >
                  MP4, WebM, MOV • tối đa 500MB
                </div>
              </div>
            </Form.Item>

            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => setIsUploadModalOpen(false)}
                disabled={uploadLoading}
              >
                Hủy
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                loading={uploadLoading}
                icon={<UploadIcon size={15} />}
                style={{
                  background: "#0f172a",
                  borderColor: "#0f172a",
                }}
              >
                Gửi video chờ duyệt
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default LibraryPage;
