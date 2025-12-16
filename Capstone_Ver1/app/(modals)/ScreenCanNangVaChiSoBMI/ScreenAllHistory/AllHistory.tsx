import React, { useMemo, useState } from "react";
import { View, Text, SectionList, Pressable, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// --- Types ---
type HistoryItem = {
  weight: number; // kg
  height: number; // cm
  bmi: number;
  category: "Thiếu cân" | "Bình thường" | "Thừa cân" | "Béo phì";
  date: string; // ISO-like string e.g. "2025-09-28 22:54"
};

// --- Mock data (replace with your store/API) ---
const RAW_DATA: HistoryItem[] = [
  { weight: 60.0, height: 165, bmi: 22.0, category: "Bình thường", date: "2025-09-28 22:54" },
  { weight: 59.2, height: 165, bmi: 21.7, category: "Bình thường", date: "2025-09-20 07:31" },
  { weight: 58.4, height: 165, bmi: 21.4, category: "Bình thường", date: "2025-08-10 21:03" },
  { weight: 56.8, height: 165, bmi: 20.9, category: "Bình thường", date: "2025-08-02 06:50" },
  { weight: 54.1, height: 165, bmi: 19.9, category: "Bình thường", date: "2025-07-05 08:11" },
  { weight: 50.0, height: 165, bmi: 18.4, category: "Thiếu cân", date: "2025-06-01 18:44" },
  { weight: 66.2, height: 165, bmi: 24.3, category: "Thừa cân", date: "2025-05-22 10:30" },
  { weight: 72.5, height: 165, bmi: 26.6, category: "Thừa cân", date: "2025-04-08 09:15" },
  { weight: 80.0, height: 165, bmi: 29.4, category: "Thừa cân", date: "2025-03-02 12:00" },
  { weight: 86.0, height: 165, bmi: 31.6, category: "Béo phì", date: "2025-01-12 20:22" },
];

// --- Helpers ---
const monthKey = (d: Date) => `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;

const prettyMonth = (key: string) => {
  const [y, m] = key.split("-");
  const monthNames = [
    "Tháng 01", "Tháng 02", "Tháng 03", "Tháng 04", "Tháng 05", "Tháng 06",
    "Tháng 07", "Tháng 08", "Tháng 09", "Tháng 10", "Tháng 11", "Tháng 12",
  ];
  return `${monthNames[parseInt(m, 10) - 1]} ${y}`;
};

const categoryStyle = (category: HistoryItem["category"]) => {
  switch (category) {
    case "Thiếu cân":
      return { bg: "#eef2ff", fg: "#3730a3" };
    case "Bình thường":
      return { bg: "#ecfeff", fg: "#0e7490" };
    case "Thừa cân":
      return { bg: "#fff7ed", fg: "#c2410c" };
    case "Béo phì":
      return { bg: "#fef2f2", fg: "#b91c1c" };
  }
};

const formatTime = (d: Date) =>
  `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;

const formatDate = (d: Date) =>
  `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;

// --- Screen ---
export default function TatCaLichSu() {
  // If you pass filters via params later
  useLocalSearchParams();

  const [filter, setFilter] = useState<HistoryItem["category"] | "Tất cả">("Tất cả");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filteredSorted = useMemo(() => {
    let list = [...RAW_DATA];
    if (filter !== "Tất cả") list = list.filter((i) => i.category === filter);

    list.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sort === "newest" ? db - da : da - db;
    });
    return list;
  }, [filter, sort]);

  const sections = useMemo(() => {
    const groups = new Map<string, HistoryItem[]>();
    for (const item of filteredSorted) {
      const d = new Date(item.date.replace(" ", "T"));
      const key = monthKey(d);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(item);
    }
    return Array.from(groups.entries())
      .sort(([a], [b]) => (sort === "newest" ? (a < b ? 1 : -1) : a > b ? 1 : -1))
      .map(([key, data]) => ({ title: prettyMonth(key), data }));
  }, [filteredSorted, sort]);

  const stats = useMemo(() => {
    if (filteredSorted.length === 0) return { count: 0, avg: 0, latest: undefined as HistoryItem | undefined };
    const sum = filteredSorted.reduce((acc, it) => acc + it.bmi, 0);
    const avg = sum / filteredSorted.length;
    const latest = [...filteredSorted].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return { count: filteredSorted.length, avg, latest };
  }, [filteredSorted]);

  return (
    <>
     
      {/* Summary */}
      <View style={styles.summaryWrap}>
        <View style={[styles.summaryCard, { flex: 1 }]}> 
          <Text style={styles.summaryLabel}>Tổng số bản ghi</Text>
          <Text style={styles.summaryValue}>{stats.count}</Text>
        </View>
        <View style={[styles.summaryCard, { flex: 1 }]}> 
          <Text style={styles.summaryLabel}>BMI trung bình</Text>
          <Text style={styles.summaryValue}>{stats.avg.toFixed(1)}</Text>
        </View>
      </View>

      {stats.latest && (
        <View style={styles.latestCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.latestTitle}>Gần nhất</Text>
            <Text style={styles.latestSub}>{formatDate(new Date(stats.latest.date.replace(" ", "T")))} • {formatTime(new Date(stats.latest.date.replace(" ", "T")))}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.latestValue}>{stats.latest.weight.toFixed(1)} kg</Text>
            <Text style={styles.latestHint}>BMI {stats.latest.bmi.toFixed(1)} • {stats.latest.category}</Text>
          </View>
        </View>
      )}

      {/* Filters */}
      <View style={styles.filterRow}>
        {(["Tất cả", "Thiếu cân", "Bình thường", "Thừa cân", "Béo phì"] as const).map((c) => {
          const active = filter === c;
          return (
            <Pressable key={c} onPress={() => setFilter(c)} style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{c}</Text>
            </Pressable>
          );
        })}

        <View style={{ flex: 1 }} />
        <Pressable onPress={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))} style={styles.sortBtn}>
          <Ionicons name={sort === "newest" ? "arrow-down" : "arrow-up"} size={16} color="#334155" />
          <Text style={styles.sortText}>{sort === "newest" ? "Mới → Cũ" : "Cũ → Mới"}</Text>
        </Pressable>
      </View>

      {/* List */}
      <SectionList
        sections={sections}
        keyExtractor={(item, idx) => `${item.date}-${idx}`}
        contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        stickySectionHeadersEnabled
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>
        )}
        renderItem={({ item }) => <HistoryRow item={item} />}
        ListEmptyComponent={
          <View style={{ alignItems: "center", padding: 28 }}>
            <Ionicons name="document-text-outline" size={28} color="#94a3b8" />
            <Text style={{ marginTop: 8, color: "#64748b" }}>Không có dữ liệu phù hợp bộ lọc</Text>
          </View>
        }
      />
    </>
  );
}

function HistoryRow({ item }: { item: HistoryItem }) {
  const d = new Date(item.date.replace(" ", "T"));
  const cat = categoryStyle(item.category);

  return (
    <Pressable style={styles.row} android_ripple={{ color: "#e5e7eb" }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
        <View style={styles.weightPill}>
          <Text style={styles.weightPillValue}>{item.weight.toFixed(1)}</Text>
          <Text style={styles.weightPillUnit}>kg</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
              <Text style={[styles.catBadgeText, { color: cat.fg }]}>{item.category}</Text>
            </View>
            <Text style={styles.dim}>BMI {item.bmi.toFixed(1)} • Cao {item.height}cm</Text>
          </View>
          <Text style={styles.dateText}>{formatDate(d)} • {formatTime(d)}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
    </Pressable>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  summaryWrap: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  summaryLabel: { color: "#64748b", fontSize: 12, marginBottom: 4 },
  summaryValue: { color: "#0f172a", fontSize: 20, fontWeight: "700" },

  latestCard: {
    marginTop: 12,
    marginHorizontal: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  latestTitle: { color: "#0f172a", fontSize: 14, fontWeight: "700" },
  latestSub: { color: "#64748b", marginTop: 2 },
  latestValue: { color: "#0f766e", fontSize: 16, fontWeight: "700" },
  latestHint: { color: "#64748b", fontSize: 12 },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  chipActive: {
    backgroundColor: "#0ea5e9",
    borderColor: "#0ea5e9",
  },
  chipText: { color: "#334155", fontSize: 12, fontWeight: "600" },
  chipTextActive: { color: "#ffffff" },

  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  sortText: { color: "#334155", fontSize: 12, fontWeight: "600" },

  sectionHeader: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sectionTitle: { color: "#334155", fontWeight: "700" },

  row: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  weightPill: {
    backgroundColor: "#ecfeff",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: "center",
    minWidth: 64,
  },
  weightPillValue: { color: "#0e7490", fontSize: 18, fontWeight: "800" },
  weightPillUnit: { color: "#0e7490", fontSize: 11, marginTop: -2 },

  catBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  catBadgeText: { fontSize: 12, fontWeight: "700" },

  dim: { color: "#64748b", fontSize: 12 },
  dateText: { color: "#94a3b8", marginTop: 2, fontSize: 12 },
});
