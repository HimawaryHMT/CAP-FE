import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
  total?: number;
  percent?: number; // 0 - 100
  min?: number;
  avg?: number;
  max?: number;
};

export default function SoLieuThongKe({
  title = "Số liệu thống kê",
  subtitle = "BMI Overview",
  total = 5,
  percent = 68,
  min,
  avg,
  max ,
}: any) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>📊</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LIVE</Text>
        </View>
      </View>

      {/* Donut + KPIs */}
      <View style={styles.kpiRow}>
        {/* Donut (đơn giản, không cần thư viện) */}
        <View style={styles.donutWrap}>
          <View style={styles.donutOuter}>
            <View style={styles.donutInner}>
              <Text style={styles.donutNumber}>{percent}%</Text>
              <Text style={styles.donutLabel}>In total {total}</Text>
            </View>
          </View>
          <Text style={styles.donutCaption}>Tỷ lệ trong kỳ</Text>
        </View>

        {/* 3 KPI nhỏ */}
        <View style={styles.metrics}>
          <View style={[styles.metricItem, { borderLeftColor: "#22c55e" }]}>
            <Text style={styles.metricLabel}>Min</Text>
            <Text style={styles.metricValue}>{min}</Text>
          </View>
          <View style={[styles.metricItem, { borderLeftColor: "#3b82f6" }]}>
            <Text style={styles.metricLabel}>Avg</Text>
            <Text style={styles.metricValue}>{avg}</Text>
          </View>
          <View style={[styles.metricItem, { borderLeftColor: "#f59e0b" }]}>
            <Text style={styles.metricLabel}>Max</Text>
            <Text style={styles.metricValue}>{max}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Legend (2 cột) */}
      <View style={styles.legendGrid}>
        {[
          { color: "#7c3aed", label: "Thiếu cân rất trầm trọng" },
          { color: "#3b82f6", label: "Thiếu cân nặng" },
          { color: "#06b6d4", label: "Thiếu cân" },
          { color: "#10b981", label: "Bình thường" },
          { color: "#fbbf24", label: "Thừa cân" },
          { color: "#f97316", label: "Béo phì loại I" },
          { color: "#ef4444", label: "Béo phì độ II" },
          { color: "#dc2626", label: "Béo phì độ III" },
        ].map((item, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(17, 24, 39, 0.06)", // slate-900/6
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerIcon: { fontSize: 22, marginRight: 8 },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a", // slate-900
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b", // slate-500
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.12)", // green-500/12
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.35)",
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#16a34a" },

  /* KPI Row */
  kpiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  /* Donut */
  donutWrap: { alignItems: "center", justifyContent: "center" },
  donutOuter: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 12,
    // màu viền thể hiện “success”; có thể đổi theo trạng thái
    borderColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  donutInner: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  donutNumber: { fontSize: 22, fontWeight: "800", color: "#111827" },
  donutLabel: { fontSize: 12, color: "#6b7280", marginTop: 2 },
  donutCaption: { marginTop: 8, fontSize: 12, color: "#64748b" },

  /* Metrics */
  metrics: {
    flex: 1,
    gap: 10,
  },
  metricItem: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: "rgba(2,6,23,0.06)", // slate-950/6
    marginVertical: 14,
  },

  /* Legend */
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 10,
    columnGap: 10,
  },
  legendItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
  },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 13, color: "#374151", flexShrink: 1 },
});
