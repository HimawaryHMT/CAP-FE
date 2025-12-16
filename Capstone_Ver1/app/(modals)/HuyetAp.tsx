// app/(tabs)/HomePage/HuyetAp.tsx
import React, { useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, {
  LinearGradient,
  Path,
  Stop,
  Defs,
  Rect,
  Circle,
  G,
} from "react-native-svg";
import { router } from "expo-router";

type BPReading = {
  id: string;
  sys: number; // Systolic
  dia: number; // Diastolic
  pulse?: number;
  at: string; // ISO date
};

const { width: SCREEN_W } = Dimensions.get("window");
const SPACING = 16;

const COLORS = {
  page: "#f6f7fb",
  bgTop: "#eef9ff",
  bgBottom: "#e8f6ef",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#6b7280",
  border: "#e5e7eb",
  primary: "#2563eb",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  violet: "#7c3aed",
  shadow: "rgba(15, 23, 42, 0.06)",
  goodBand: "rgba(16, 185, 129, 0.08)", // dải SYS tốt
};

function classifyBP(sys: number, dia: number) {
  if (sys > 180 || dia > 120) return { label: "Khẩn cấp", color: COLORS.danger };
  if (sys >= 140 || dia >= 90) return { label: "THA độ 2", color: "#dc2626" };
  if ((sys >= 130 && sys <= 139) || (dia >= 80 && dia <= 89))
    return { label: "THA độ 1", color: COLORS.warning };
  if (sys >= 120 && sys <= 129 && dia < 80)
    return { label: "Tiền THA", color: "#fb923c" };
  if (sys < 120 && dia < 80) return { label: "Bình thường", color: COLORS.success };
  return { label: "—", color: COLORS.textMuted };
}

function mapAndPulse(sys: number, dia: number) {
  const pp = sys - dia; // Pulse Pressure
  const map = Math.round(dia + pp / 3); // Mean Arterial Pressure (xấp xỉ)
  return { pp, map };
}

function formatHM(dateISO: string) {
  const d = new Date(dateISO);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
function formatDMY(dateISO: string) {
  const d = new Date(dateISO);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ====== Demo seed 7 ngày
const seed: BPReading[] = [
  { id: "1", sys: 122, dia: 78, pulse: 72, at: new Date(Date.now() - 6 * 86400000).toISOString() },
  { id: "2", sys: 118, dia: 77, pulse: 70, at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "3", sys: 126, dia: 82, pulse: 74, at: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "4", sys: 130, dia: 84, pulse: 73, at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "5", sys: 128, dia: 80, pulse: 71, at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "6", sys: 135, dia: 86, pulse: 76, at: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "7", sys: 124, dia: 79, pulse: 72, at: new Date().toISOString() },
];

// ====== UI helpers
const Card = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[styles.card, style]}>{children}</View>
);
const Row = ({ children, style }: { children: React.ReactNode; style?: any }) => (
  <View style={[{ flexDirection: "row", alignItems: "center" }, style]}>{children}</View>
);

export default function HuyetAp() {
  const [data, setData] = useState<BPReading[]>(seed);
  const last = data[data.length - 1];

  const [modalOpen, setModalOpen] = useState(false);
  const [sys, setSys] = useState("");
  const [dia, setDia] = useState("");
  const [pulse, setPulse] = useState("");

  const category = useMemo(
    () => classifyBP(last?.sys ?? 0, last?.dia ?? 0),
    [last]
  );
  const { pp, map } = useMemo(
    () => mapAndPulse(last?.sys ?? 0, last?.dia ?? 0),
    [last]
  );

  // ====== Chart calc (SYS)
  const [chartW, setChartW] = useState(SCREEN_W - SPACING * 2); // thực tế theo onLayout
  const CHART_H = 170;

  const chart = useMemo(() => {
    if (!data.length) return { path: "", min: 0, max: 0, points: [] as { x: number; y: number }[] };

    const sysValues = data.map((d) => d.sys);
    const min = Math.min(...sysValues) - 5;
    const max = Math.max(...sysValues) + 5;

    const stepX = chartW / Math.max(1, data.length - 1);
    const points = sysValues.map((v, i) => {
      const x = i * stepX;
      const norm = (v - min) / (max - min || 1);
      const y = CHART_H - norm * CHART_H;
      return { x, y };
    });

    const d = points
      .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
      .join(" ");

    return { path: d, min, max, points };
  }, [data, chartW]);

  const handleAdd = () => {
    const s = Number(sys);
    const d = Number(dia);
    const p = pulse ? Number(pulse) : undefined;

    if (!s || !d) {
      Alert.alert("Thiếu dữ liệu", "Vui lòng nhập đủ SYS và DIA.");
      return;
    }
    if (s < 60 || s > 260 || d < 40 || d > 160) {
      Alert.alert("Giá trị bất thường", "Kiểm tra lại SYS/DIA (60–260 / 40–160).");
      return;
    }
    if (p && (p < 30 || p > 180)) {
      Alert.alert("Nhịp tim bất thường", "Nhịp tim nên trong khoảng 30–180 bpm.");
      return;
    }

    const newItem: BPReading = {
      id: String(Date.now()),
      sys: s,
      dia: d,
      pulse: p,
      at: new Date().toISOString(),
    };
    setData((prev) => [...prev.slice(-6), newItem]); // giữ 7 mục gần nhất cho demo
    setModalOpen(false);
    setSys("");
    setDia("");
    setPulse("");
  };

  const avgSys = Math.round(data.reduce((a, b) => a + b.sys, 0) / data.length);
  const avgDia = Math.round(data.reduce((a, b) => a + b.dia, 0) / data.length);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <Stack.Screen options={{ title: "Huyết áp", headerShown: false }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* ====== Header ====== */}
          <Row style={styles.header}>
            <Row style={{ gap: 10 }}>
              <Pressable style={styles.headerIconWrap} onPress={() => router.back()}>
                <Ionicons name="arrow-back-outline" size={20} color={COLORS.primary} />
              </Pressable>
              <Text style={styles.headerTitle}>Theo dõi Huyết áp</Text>
            </Row>

            <Pressable
              style={styles.syncBtn}
              onPress={() =>
                Alert.alert(
                  "Đồng bộ",
                  "Sắp có: \n• Kết nối Bluetooth máy đo\n• Nhập CSV từ phòng khám"
                )
              }
              android_ripple={{ color: "#e5e7eb", borderless: false }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Đồng bộ thiết bị"
            >
              <Ionicons name="sync-outline" size={16} color={COLORS.primary} />
              <Text style={styles.syncText}>Đồng bộ</Text>
            </Pressable>
          </Row>

          {/* ====== Last Reading ====== */}
          {last && (
            <Card style={{ padding: 14, overflow: "hidden" }}>
              <Svg
                width="100%"
                height="120"
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <Defs>
                  <LinearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0%" stopColor={COLORS.bgTop} />
                    <Stop offset="100%" stopColor={COLORS.bgBottom} />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="120" rx={16} fill="url(#bgGrad)" />
              </Svg>

              <Row style={styles.lastTopRow}>
                <Row style={{ gap: 10 }}>
                  <View
                    style={[
                      styles.pill,
                      {
                        backgroundColor: addAlpha(category.color, 0.12),
                        borderColor: category.color,
                      },
                    ]}
                  >
                    <Ionicons name="pulse-outline" size={14} color={category.color} />
                    <Text style={[styles.pillText, { color: category.color }]}>
                      {category.label}
                    </Text>
                  </View>
                  <Text style={styles.lastTime}>
                    {formatDMY(last.at)} • {formatHM(last.at)}
                  </Text>
                </Row>

                <Pressable
                  style={styles.addBtn}
                  onPress={() => setModalOpen(true)}
                  android_ripple={{ color: "#e5e7eb" }}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel="Thêm bản ghi huyết áp"
                >
                  <Ionicons name="add" size={18} color={COLORS.card} />
                  <Text style={styles.addBtnText}>Thêm</Text>
                </Pressable>
              </Row>

              <Row style={styles.lastNumbersRow}>
                <KPI label="SYS" value={last.sys} unit="mmHg" />
                <View style={styles.vDivider} />
                <KPI label="DIA" value={last.dia} unit="mmHg" />
                <View style={styles.vDivider} />
                <KPI label="Pulse" value={last.pulse ?? "—"} unit="bpm" />
              </Row>
            </Card>
          )}

          {/* ====== Quick stats (3 cột cân) ====== */}
          <Row style={{ gap: 10 }}>
            <StatChip icon="analytics-outline" label="MAP" value={`${map} mmHg`} />
            <StatChip icon="git-branch-outline" label="PP" value={`${pp} mmHg`} />
            <StatChip icon="stats-chart-outline" label="Trung bình" value={`${avgSys}/${avgDia}`} />
          </Row>

          {/* ====== Chart ====== */}
          <Card style={{ paddingVertical: 12 }}>
            <Row style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Diễn biến 7 ngày (SYS)</Text>
              <Text style={styles.cardHint}>
                Min {chart.min} • Max {chart.max}
              </Text>
            </Row>

            <View
              style={{ paddingHorizontal: 12 }}
              onLayout={(e) => setChartW(e.nativeEvent.layout.width)}
            >
              <Svg width={chartW} height={CHART_H}>
                {/* Vùng SYS tốt ~ 110–120 (min/max của dải tham khảo) */}
                <Rect
                  x={0}
                  y={yFromValue(120, chart.min, chart.max, CHART_H)}
                  width={chartW}
                  height={
                    yFromValue(110, chart.min, chart.max, CHART_H) -
                    yFromValue(120, chart.min, chart.max, CHART_H)
                  }
                  fill={COLORS.goodBand}
                />

                {/* Grid ngang (4 dòng) */}
                {Array.from({ length: 4 }).map((_, i) => {
                  const y = Math.round((CHART_H / 4) * (i + 1));
                  return (
                    <Path
                      key={i}
                      d={`M 0 ${y} H ${chartW}`}
                      stroke={COLORS.border}
                      strokeDasharray="4 6"
                    />
                  );
                })}

                {/* baseline */}
                <Path d={`M 0 ${CHART_H - 1} H ${chartW}`} stroke={COLORS.border} strokeWidth={1} />

                {/* line + points */}
                {chart.path ? (
                  <G>
                    {/* area gradient under line */}
                    <Defs>
                      <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor={addAlpha(COLORS.primary, 0.25)} />
                        <Stop offset="100%" stopColor="transparent" />
                      </LinearGradient>
                    </Defs>
                    {/* Fill area path */}
                    <Path
                      d={`${chart.path} L ${chartW} ${CHART_H} L 0 ${CHART_H} Z`}
                      fill="url(#area)"
                      opacity={0.45}
                    />
                    <Path
                      d={chart.path}
                      stroke={COLORS.primary}
                      strokeWidth={2.8}
                      fill="none"
                      strokeLinecap="round"
                    />
                    {chart.points.map((p, i) => (
                      <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={COLORS.primary} />
                    ))}
                  </G>
                ) : null}
              </Svg>
            </View>

            {/* Legend */}
            <View style={styles.chartLegend}>
              {data.map((d) => (
                <Row key={d.id} style={styles.legendItem}>
                  <View style={styles.dot} />
                  <Text style={styles.legendText}>
                    {formatHM(d.at)} {formatDMY(d.at)} • {d.sys}/{d.dia}
                  </Text>
                </Row>
              ))}
            </View>
          </Card>

          {/* ====== History ====== */}
          <Card style={{ paddingVertical: 10 }}>
            <Row style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Lịch sử đo</Text>
              <Pressable
                style={styles.filterBtn}
                onPress={() =>
                  Alert.alert("Bộ lọc", "Ví dụ: Hôm nay / 7 ngày / 30 ngày / Tuỳ chỉnh")
                }
                hitSlop={8}
                accessibilityRole="button"
              >
                <Ionicons name="filter-outline" size={16} color={COLORS.text} />
                <Text style={styles.filterText}>Bộ lọc</Text>
              </Pressable>
            </Row>

            {data
              .slice()
              .reverse()
              .map((item) => {
                const cat = classifyBP(item.sys, item.dia);
                const { pp: ppx, map: mapx } = mapAndPulse(item.sys, item.dia);
                return (
                  <Row key={item.id} style={styles.rowItem}>
                    <View style={styles.rowLeft}>
                      <View style={[styles.badge, { borderColor: cat.color }]}>
                        <Text style={[styles.badgeText, { color: cat.color }]}>
                          {cat.label}
                        </Text>
                      </View>
                      <Text style={styles.rowMain}>
                        {item.sys}/{item.dia}
                      </Text>
                      <Text style={styles.rowSub}>
                        MAP {mapx} • PP {ppx} {item.pulse ? `• ${item.pulse} bpm` : ""}
                      </Text>
                    </View>
                    <View style={styles.rowRight}>
                      <Text style={styles.rowTime}>{formatHM(item.at)}</Text>
                      <Text style={styles.rowDate}>{formatDMY(item.at)}</Text>
                    </View>
                  </Row>
                );
              })}
          </Card>

          {/* ====== Tips ====== */}
          <Row style={styles.tipCard}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.violet} />
            <Text style={styles.tipText}>
              Nghỉ 5 phút trước khi đo, ngồi thẳng lưng, tay ngang tim, không nói chuyện để kết quả chính xác hơn.
            </Text>
          </Row>

          <View style={{ height: 24 }} />
        </ScrollView>

        {/* ====== Modal Add ====== */}
        <Modal
          visible={modalOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setModalOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <Card style={styles.modalCard}>
              <Text style={styles.modalTitle}>Thêm bản ghi</Text>

              <Row style={styles.formRow}>
                <Text style={styles.inputLabel}>SYS</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="vd. 125"
                  value={sys}
                  onChangeText={setSys}
                  style={styles.input}
                />
                <Text style={styles.inputUnit}>mmHg</Text>
              </Row>

              <Row style={styles.formRow}>
                <Text style={styles.inputLabel}>DIA</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="vd. 82"
                  value={dia}
                  onChangeText={setDia}
                  style={styles.input}
                />
                <Text style={styles.inputUnit}>mmHg</Text>
              </Row>

              <Row style={styles.formRow}>
                <Text style={styles.inputLabel}>Nhịp tim</Text>
                <TextInput
                  keyboardType="numeric"
                  placeholder="vd. 72"
                  value={pulse}
                  onChangeText={setPulse}
                  style={styles.input}
                />
                <Text style={styles.inputUnit}>bpm</Text>
              </Row>

              <Row style={styles.modalActions}>
                <Pressable
                  style={[styles.btn, styles.btnGhost]}
                  onPress={() => setModalOpen(false)}
                >
                  <Text style={[styles.btnText, { color: COLORS.text }]}>Huỷ</Text>
                </Pressable>
                <Pressable style={[styles.btn, styles.btnPrimary]} onPress={handleAdd}>
                  <Ionicons name="save-outline" size={16} color="#fff" />
                  <Text style={[styles.btnText, { color: "#fff" }]}>Lưu</Text>
                </Pressable>
              </Row>
            </Card>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ====== Small components
function KPI({ label, value, unit }: { label: string; value: number | string; unit: string }) {
  return (
    <View style={styles.kpi}>
      <Text style={styles.kpiLabel}>{label}</Text>
      <Text style={styles.kpiValue}>{value}</Text>
      <Text style={styles.kpiUnit}>{unit}</Text>
    </View>
  );
}
function StatChip({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statChip}>
      <Ionicons name={icon} size={16} color={COLORS.text} />
      <View style={{ gap: 2 }}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

// ====== Utils
function addAlpha(hexOrRgb: string, alpha: number) {
  // hex (#rrggbb) -> rgba(r,g,b,a)
  if (hexOrRgb.startsWith("#") && hexOrRgb.length === 7) {
    const r = parseInt(hexOrRgb.slice(1, 3), 16);
    const g = parseInt(hexOrRgb.slice(3, 5), 16);
    const b = parseInt(hexOrRgb.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return hexOrRgb;
}
function yFromValue(v: number, min: number, max: number, h: number) {
  const norm = (v - min) / (max - min || 1);
  return Math.max(0, Math.min(h, h - norm * h));
}

// ====== Styles
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.page },
  scroll: { padding: SPACING, gap: 14 },

  header: {
    justifyContent: "space-between",
    marginBottom: 2,
  },
  headerIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dbeafe",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: COLORS.text },
  syncBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#e0e7ff",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  syncText: { color: COLORS.primary, fontWeight: "600" },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },

  lastTopRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  pillText: { fontWeight: "700" },
  lastTime: { color: COLORS.textMuted, fontSize: 12 },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  addBtnText: { color: COLORS.card, fontWeight: "700" },

  lastNumbersRow: {
    gap: 12,
    marginTop: 6,
    justifyContent: "space-between",
  },
  vDivider: { width: 1, height: 48, backgroundColor: COLORS.border },

  kpi: { flex: 1, alignItems: "center" },
  kpiLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 2 },
  kpiValue: { fontSize: 28, fontWeight: "800", color: COLORS.text },
  kpiUnit: { color: COLORS.textMuted, fontSize: 12 },

  statChip: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.shadow,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  statLabel: { color: COLORS.textMuted, fontSize: 12 },
  statValue: { color: COLORS.text, fontWeight: "700", fontSize: 16 },

  cardHeader: {
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  cardHint: { color: COLORS.textMuted, fontSize: 12 },
  chartLegend: { paddingHorizontal: 14, paddingTop: 6, gap: 6 },
  legendItem: { gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: COLORS.primary },
  legendText: { color: COLORS.textMuted, fontSize: 12 },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  filterText: { color: COLORS.text, fontWeight: "600" },

  rowItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    justifyContent: "space-between",
  },
  rowLeft: { gap: 4, flexShrink: 1, flex: 1 },
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  rowMain: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  rowSub: { color: COLORS.textMuted, fontSize: 12 },
  rowRight: { alignItems: "flex-end", minWidth: 84, marginLeft: 8 },
  rowTime: { fontWeight: "700", color: COLORS.text },
  rowDate: { color: COLORS.textMuted, fontSize: 12 },

  tipCard: {
    gap: 10,
    backgroundColor: "#f5f3ff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ede9fe",
  },
  tipText: { color: "#4c1d95", flex: 1, lineHeight: 18 },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  modalCard: { padding: 16, gap: 10, maxWidth: 440, width: "100%" },
  modalTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 4 },
  formRow: { gap: 10, alignItems: "center", marginTop: 4 },
  inputLabel: { width: 70, color: COLORS.text },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#fff",
  },
  inputUnit: { color: COLORS.textMuted, width: 50, textAlign: "right" },
  modalActions: {
    marginTop: 10,
    gap: 10,
    justifyContent: "flex-end",
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnGhost: { backgroundColor: "#f8fafc" },
  btnText: { fontWeight: "700" },
});
