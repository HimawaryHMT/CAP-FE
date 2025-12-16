// app/(tabs)/HomePage/Đường huyết.tsx
import React, { useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect } from "react-native-svg";

type Unit = "mgdl" | "mmol";
type Reading = {
  id: string;
  value_mgdl: number; // lưu nội bộ theo mg/dL
  when: string; // ISO
  note?: string;
  tag?: "Lúc đói" | "Sau ăn" | "Trước ngủ" | "Ngẫu nhiên";
};

const THEME = {
  bgTop: "#ECFDF5",
  bgBottom: "#E0F2FE",
  card: "#FFFFFF",
  text: "#0F172A",
  sub: "#475569",
  ok: "#10B981",
  high: "#F59E0B",
  danger: "#EF4444",
  line: "#38BDF8",
  fillFrom: "#38BDF8",
  fillTo: "rgba(56,189,248,0.05)",
  chip: "#F1F5F9",
  border: "#E2E8F0",
};

const PRESETS = [80, 110, 140, 180]; // mg/dL
const DEFAULT_TARGET = { min: 80, max: 130 }; // khoảng mục tiêu lúc đói

function mgdlToMmol(v: number) {
  return +(v / 18).toFixed(1);
}
function mmolToMgdl(v: number) {
  return Math.round(v * 18);
}
function fmtValue(vMgdl: number, unit: Unit) {
  return unit === "mgdl" ? `${vMgdl}` : `${mgdlToMmol(vMgdl)}`;
}
function statusColor(v: number, target = DEFAULT_TARGET) {
  if (v < target.min) return THEME.danger;
  if (v > target.max) return THEME.high;
  return THEME.ok;
}
function statusLabel(v: number, target = DEFAULT_TARGET) {
  if (v < target.min) return "Thấp";
  if (v > target.max) return "Cao";
  return "Tốt";
}
function formatTime(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm} • ${d.getDate()}/${d.getMonth() + 1}`;
}

export default function DuongHuyet() {
  // ====== STATE ======
  const [unit, setUnit] = useState<Unit>("mgdl");
  const [target, setTarget] = useState(DEFAULT_TARGET);

  // Demo seed readings (7 ngày gần nhất). Sau này thay bằng dữ liệu từ API.
  const [readings, setReadings] = useState<Reading[]>(() => {
    const now = Date.now();
    const seed: number[] = [102, 118, 134, 128, 142, 95, 120, 171, 87, 111, 126, 138, 90];
    return seed.map((v, idx) => ({
      id: `r${idx}`,
      value_mgdl: v,
      when: new Date(now - (seed.length - 1 - idx) * 6 * 60 * 60 * 1000).toISOString(), // mỗi 6h
      tag: (["Lúc đói", "Sau ăn", "Trước ngủ", "Ngẫu nhiên"] as Reading["tag"][])[idx % 4],
    }));
  });

  // Modal thêm thủ công
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // theo unit hiện tại
  const [inputNote, setInputNote] = useState("");
  const [inputTag, setInputTag] = useState<Reading["tag"]>("Ngẫu nhiên");

  // ====== DERIVED ======
  const latest = readings[readings.length - 1];
  const prev = readings[readings.length - 2];
  const trend = prev ? latest.value_mgdl - prev.value_mgdl : 0;

  const stats = useMemo(() => {
    if (readings.length === 0) return { min: 0, max: 0, avg: 0 };
    let min = Infinity,
      max = -Infinity,
      sum = 0;
    for (const r of readings) {
      min = Math.min(min, r.value_mgdl);
      max = Math.max(max, r.value_mgdl);
      sum += r.value_mgdl;
    }
    return { min, max, avg: +(sum / readings.length).toFixed(1) };
  }, [readings]);

  // Dữ liệu biểu đồ 7 ngày (lấy ~28 điểm gần nhất, nếu có)
  const chartPoints = useMemo(() => {
    const take = Math.min(28, readings.length);
    return readings.slice(-take);
  }, [readings]);

  // ====== ACTIONS ======
  const addReading = (valueMgdl: number, opt?: Partial<Reading>) => {
    if (Number.isNaN(valueMgdl) || valueMgdl <= 0 || valueMgdl > 600) {
      Alert.alert("Giá trị không hợp lệ", "Vui lòng nhập trong khoảng 20–600 mg/dL.");
      return;
    }
    const item: Reading = {
      id: `r${Date.now()}`,
      value_mgdl: Math.round(valueMgdl),
      when: new Date().toISOString(),
      tag: opt?.tag ?? "Ngẫu nhiên",
      note: opt?.note?.trim() || undefined,
    };
    setReadings((s) => [...s, item]);
    // TODO: gọi API tạo bản ghi ở đây
  };

  const handleQuickAdd = (v: number) => addReading(v, { tag: "Ngẫu nhiên" });

  const handleSubmitManual = () => {
    if (!inputValue.trim()) {
      Alert.alert("Thiếu dữ liệu", "Bạn chưa nhập giá trị.");
      return;
    }
    const raw = parseFloat(inputValue.replace(",", "."));
    const mgdl = unit === "mgdl" ? raw : mmolToMgdl(raw);
    addReading(mgdl, { note: inputNote, tag: inputTag });
    setModalOpen(false);
    setInputValue("");
    setInputNote("");
  };

  const toggleUnit = () => setUnit((u) => (u === "mgdl" ? "mmol" : "mgdl"));

  // ====== RENDER ======
  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen options={{ title: "Đường huyết", headerLargeTitle: true ,  headerTitleAlign: "center" }} />

      {/* Background gradient */}
      <View pointerEvents="none" style={styles.bgWrap}>
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs>
            <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={THEME.bgTop} />
              <Stop offset="100%" stopColor={THEME.bgBottom} />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100" height="100" fill="url(#bg)" />
        </Svg>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ===== HEADER CARD ===== */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Chỉ số hiện tại</Text>

            <Pressable onPress={toggleUnit} style={styles.unitBtn} android_ripple={{ color: "#e2e8f0" }}>
              <Text style={styles.unitBtnText}>{unit === "mgdl" ? "mg/dL" : "mmol/L"}</Text>
            </Pressable>
          </View>

          <View style={styles.currentWrap}>
            <Text style={[styles.currentValue, { color: statusColor(latest?.value_mgdl ?? 0, target) }]}>
              {latest ? fmtValue(latest.value_mgdl, unit) : "--"}
            </Text>
            <Text style={styles.currentUnit}>{unit === "mgdl" ? "mg/dL" : "mmol/L"}</Text>
          </View>

          <View style={styles.metaRow}>
            <Badge
              label={`Mục tiêu: ${target.min}–${target.max} mg/dL`}
              color="#0EA5E9"
              textColor="#0C4A6E"
            />
            {latest && (
              <Badge
                label={`Tình trạng: ${statusLabel(latest.value_mgdl, target)}`}
                color={statusColor(latest.value_mgdl, target)}
              />
            )}
            {prev && (
              <Badge
                label={`Xu hướng: ${trend > 0 ? "↑ +" : trend < 0 ? "↓ " : "→"}${Math.abs(trend)} mg/dL`}
                color="#64748B"
              />
            )}
          </View>
        </View>

        {/* ===== QUICK ADD ===== */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ghi nhanh</Text>
          <View style={styles.quickRow}>
            {PRESETS.map((p) => (
              <Pressable
                key={p}
                onPress={() => handleQuickAdd(p)}
                style={({ pressed }) => [styles.quickChip, pressed && { opacity: 0.8 }]}
              >
                <Text style={styles.quickChipText}>{p} mg/dL</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setModalOpen(true)}
              style={({ pressed }) => [styles.quickChipAdd, pressed && { opacity: 0.9 }]}
            >
              <Text style={[styles.quickChipText, { color: "#fff" }]}>+ Thêm</Text>
            </Pressable>
          </View>
        </View>

        {/* ===== CHART ===== */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Xu hướng 7 ngày</Text>
          <MiniLineChart
            data={chartPoints.map((r) => r.value_mgdl)}
            height={160}
            padding={16}
            stroke={THEME.line}
            fillFrom={THEME.fillFrom}
            fillTo={THEME.fillTo}
          />

          <View style={styles.statsRow}>
            <StatItem label="Trung bình" value={`${fmtValue(stats.avg, unit)} ${unit === "mgdl" ? "mg/dL" : "mmol/L"}`} />
            <StatItem
              label="Thấp nhất"
              value={`${fmtValue(stats.min, unit)} ${unit === "mgdl" ? "mg/dL" : "mmol/L"}`}
            />
            <StatItem
              label="Cao nhất"
              value={`${fmtValue(stats.max, unit)} ${unit === "mgdl" ? "mg/dL" : "mmol/L"}`}
            />
          </View>
        </View>

        {/* ===== RECENTS ===== */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Lịch sử gần đây</Text>
          <FlatList
            data={[...readings].reverse().slice(0, 12)}
            keyExtractor={(it) => it.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.sep} />}
            renderItem={({ item }) => (
              <View style={styles.rowItem}>
                <View style={[styles.dot, { backgroundColor: statusColor(item.value_mgdl, target) }]} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowPrimary}>
                    {fmtValue(item.value_mgdl, unit)} {unit === "mgdl" ? "mg/dL" : "mmol/L"}{" "}
                    <Text style={[styles.tag, { color: "#0F766E" }]}>
                      • {statusLabel(item.value_mgdl, target)}
                    </Text>
                  </Text>
                  <Text style={styles.rowSub}>
                    {item.tag ?? "Ngẫu nhiên"} • {formatTime(item.when)}
                  </Text>
                  {item.note ? <Text style={styles.note}>"{item.note}"</Text> : null}
                </View>
              </View>
            )}
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ===== MODAL ADD ===== */}
      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Thêm chỉ số</Text>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Giá trị</Text>
              <View style={styles.inputRight}>
                <TextInput
                  placeholder={unit === "mgdl" ? "vd. 110" : "vd. 6.1"}
                  keyboardType="decimal-pad"
                  value={inputValue}
                  onChangeText={setInputValue}
                  style={styles.input}
                />
                <Pressable onPress={toggleUnit} style={styles.unitSwapBtn}>
                  <Text style={styles.unitSwapText}>{unit === "mgdl" ? "mg/dL" : "mmol/L"}</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Ngữ cảnh</Text>
              <View style={styles.tagsRow}>
                {(["Lúc đói", "Sau ăn", "Trước ngủ", "Ngẫu nhiên"] as Reading["tag"][]).map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setInputTag(t)}
                    style={[
                      styles.tagChip,
                      inputTag === t && { backgroundColor: "#DCFCE7", borderColor: "#22C55E" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagChipText,
                        inputTag === t && { color: "#166534", fontWeight: "600" },
                      ]}
                    >
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Ghi chú</Text>
              <TextInput
                placeholder="(Không bắt buộc)"
                value={inputNote}
                onChangeText={setInputNote}
                style={[styles.input, { height: 42 }]}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setModalOpen(false)} style={[styles.btn, styles.btnGhost]}>
                <Text style={[styles.btnText, { color: THEME.text }]}>Hủy</Text>
              </Pressable>
              <Pressable onPress={handleSubmitManual} style={[styles.btn, styles.btnPrimary]}>
                <Text style={[styles.btnText, { color: "#fff" }]}>Lưu</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/** ===== Small Components ===== */

function Badge({ label, color, textColor = "#fff" }: { label: string; color: string; textColor?: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={[styles.badgeText, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function MiniLineChart({
  data,
  height = 160,
  padding = 12,
  stroke = "#38BDF8",
  fillFrom = "#38BDF8",
  fillTo = "rgba(56,189,248,0.05)",
}: {
  data: number[];
  height?: number;
  padding?: number;
  stroke?: string;
  fillFrom?: string;
  fillTo?: string;
}) {
  const width = 320; // vừa đủ cho hầu hết máy; ScrollView có thể co giãn
  if (!data || data.length < 2) return <Text style={styles.emptyChart}>Chưa đủ dữ liệu để vẽ biểu đồ</Text>;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const yMin = Math.min(min, DEFAULT_TARGET.min - 10);
  const yMax = Math.max(max, DEFAULT_TARGET.max + 10);

  const xStep = (width - padding * 2) / (data.length - 1);
  const yScale = (val: number) =>
    height - padding - ((val - yMin) / (yMax - yMin)) * (height - padding * 2);

  let d = "";
  data.forEach((v, i) => {
    const x = padding + i * xStep;
    const y = yScale(v);
    d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });

  // Path fill
  const fillPath = `${d} L ${padding + (data.length - 1) * xStep} ${height - padding} L ${padding} ${height - padding
    } Z`;

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <Svg width={width} height={height}>
        {/* Target band */}
        <Rect
          x={padding}
          width={width - padding * 2}
          y={yScale(DEFAULT_TARGET.max)}
          height={Math.max(1, yScale(DEFAULT_TARGET.min) - yScale(DEFAULT_TARGET.max))}
          fill="rgba(16,185,129,0.08)"
          rx={6}
        />

        <Defs>
          <LinearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={fillFrom} stopOpacity={0.22} />
            <Stop offset="1" stopColor={fillTo} stopOpacity={0.02} />
          </LinearGradient>
        </Defs>

        <Path d={fillPath} fill="url(#g1)" />
        <Path d={d} stroke={stroke} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots */}
        {data.map((v, i) => {
          const x = padding + i * xStep;
          const y = yScale(v);
          return <Circle key={i} cx={x} cy={y} r={3} fill={stroke} />;
        })}
      </Svg>
    </View>
  );
}

/** ===== Styles ===== */
const styles = StyleSheet.create({
  safe: { flex: 1 },
  bgWrap: { ...StyleSheet.absoluteFillObject, zIndex: -1 },
  scroll: { padding: 16, paddingBottom: 32 },

  headerCard: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: THEME.border,
    marginBottom: 12,
  },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "700", color: THEME.text },
  unitBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: THEME.chip,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  unitBtnText: { fontWeight: "700", color: THEME.sub },

  currentWrap: { flexDirection: "row", alignItems: "flex-end", marginTop: 10, marginBottom: 8 },
  currentValue: { fontSize: 42, fontWeight: "800", lineHeight: 44, letterSpacing: -0.5 },
  currentUnit: { marginLeft: 8, fontSize: 16, color: THEME.sub, marginBottom: 6 },

  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },

  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  badgeText: { fontSize: 12, fontWeight: "700" },

  card: {
    backgroundColor: THEME.card,
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    borderWidth: 1,
    borderColor: THEME.border,
    marginTop: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: THEME.text, marginBottom: 12 },

  quickRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickChip: {
    backgroundColor: THEME.chip,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  quickChipAdd: {
    backgroundColor: "#0EA5E9",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  quickChipText: { fontWeight: "700", color: THEME.text },

  emptyChart: { textAlign: "center", color: THEME.sub, paddingVertical: 24 },

  statsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  statItem: { flex: 1, paddingVertical: 8, alignItems: "center" },
  statLabel: { fontSize: 12, color: THEME.sub },
  statValue: { marginTop: 4, fontSize: 16, fontWeight: "700", color: THEME.text },

  rowItem: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 10 },
  dot: { width: 10, height: 10, borderRadius: 6, marginRight: 10, marginTop: 6 },
  rowPrimary: { fontSize: 15, fontWeight: "700", color: THEME.text },
  rowSub: { fontSize: 12, color: THEME.sub, marginTop: 2 },
  note: { fontSize: 12, color: "#334155", marginTop: 4, fontStyle: "italic" },
  sep: { height: 1, backgroundColor: THEME.border, marginVertical: 4, opacity: 0.7 },

  modalWrap: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: THEME.text },

  inputRow: { gap: 8 },
  inputLabel: { fontSize: 13, color: THEME.sub },
  inputRight: { flexDirection: "row", gap: 8, alignItems: "center" },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    color: THEME.text,
  },
  unitSwapBtn: {
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 10,
    backgroundColor: THEME.chip,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: THEME.border,
  },
  unitSwapText: { fontWeight: "700", color: THEME.sub },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tagChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: THEME.border,
  },
  tagChipText: { fontSize: 13, color: "#0F172A" },

  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 8 },
  btn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  btnGhost: { backgroundColor: "#F1F5F9", borderWidth: 1, borderColor: THEME.border },
  btnPrimary: { backgroundColor: "#0EA5E9" },
  btnText: { fontWeight: "800", letterSpacing: 0.3 },
  tag: {
    fontSize: 13,
    fontWeight: "600",
  },
});
