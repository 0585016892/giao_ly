import React, { useEffect, useState } from "react";
import {
  Card,
  Tag,
  Modal,
  Button,
  Select,
  Input,
  message,
  Spin,
} from "antd";

import {
  getBeds,
  assignBed,
  releaseBed,
  getBedStats,
} from "../services/bedApi";

const statusColor = {
  empty: "green",
  occupied: "red",
  maintenance: "orange",
};

export default function BedPage() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedBed, setSelectedBed] = useState(null);
  const [open, setOpen] = useState(false);

  const [patientId, setPatientId] = useState("");

  const [stats, setStats] = useState(null);

  // ================= FETCH DATA =================
  const fetchBeds = async () => {
    setLoading(true);
    try {
      const data = await getBeds();
      setBeds(data);

      const st = await getBedStats();
      setStats(st);
    } catch (err) {
      message.error("Lỗi load dữ liệu");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  // ================= ASSIGN =================
  const handleAssign = async () => {
    try {
      await assignBed(selectedBed.id, patientId);
      message.success("Gán giường thành công");
      setOpen(false);
      setPatientId("");
      fetchBeds();
    } catch (err) {
      message.error(err.response?.data?.message);
    }
  };

  // ================= RELEASE =================
  const handleRelease = async () => {
    try {
      await releaseBed(selectedBed.assignment_id);
      message.success("Trả giường thành công");
      setOpen(false);
      fetchBeds();
    } catch (err) {
      message.error("Lỗi trả giường");
    }
  };

  // ================= UI =================
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🏥 Quản lý giường bệnh</h2>

      {/* ================= STATS ================= */}
      {stats && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <Card>
            🛏 Tổng: {stats.total_beds}
          </Card>
          <Card>🟢 Trống: {stats.empty_beds}</Card>
          <Card>🔴 Đang dùng: {stats.occupied_beds}</Card>
          <Card>🟡 Bảo trì: {stats.maintenance_beds}</Card>
        </div>
      )}

      {/* ================= GRID ================= */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(120px, 1fr))",
          gap: 10,
        }}
      >
        {beds.map((bed) => (
          <Card
            key={bed.id}
            size="small"
            hoverable
            onClick={() => {
              setSelectedBed(bed);
              setOpen(true);
            }}
            style={{
              border: `2px solid ${
                statusColor[bed.status]
              }`,
              textAlign: "center",
            }}
          >
            <b>{bed.bed_code}</b>
            <br />

            <Tag color={statusColor[bed.status]}>
              {bed.status}
            </Tag>

            <div style={{ fontSize: 12 }}>
              {bed.room_name}
            </div>

            <div style={{ fontSize: 12 }}>
              {bed.ward_name}
            </div>
          </Card>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        title="Chi tiết giường"
      >
        {selectedBed && (
          <>
            <p>
              <b>Mã:</b> {selectedBed.bed_code}
            </p>
            <p>
              <b>Phòng:</b> {selectedBed.room_name}
            </p>
            <p>
              <b>Khoa:</b> {selectedBed.ward_name}
            </p>

            <Tag color={statusColor[selectedBed.status]}>
              {selectedBed.status}
            </Tag>

            {/* ================= EMPTY ================= */}
            {selectedBed.status === "empty" && (
              <div style={{ marginTop: 10 }}>
                <Input
                  placeholder="Nhập patient_id"
                  value={patientId}
                  onChange={(e) =>
                    setPatientId(e.target.value)
                  }
                />

                <Button
                  type="primary"
                  style={{ marginTop: 10 }}
                  onClick={handleAssign}
                >
                  Gán bệnh nhân
                </Button>
              </div>
            )}

            {/* ================= OCCUPIED ================= */}
            {selectedBed.status === "occupied" && (
              <Button
                danger
                style={{ marginTop: 10 }}
                onClick={handleRelease}
              >
                Trả giường
              </Button>
            )}
          </>
        )}
      </Modal>
    </div>
  );
}