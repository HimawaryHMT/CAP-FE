// components/charts/chartStyles.ts
import { StyleSheet } from "react-native";

export const chartStyles = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginTop: 8 },
  header: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 18, fontWeight: "700", color: "#0b4e45" },
  unit: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginTop: 8, marginBottom: 16 },
  statBox: { alignItems: "center" },
  statVal: { fontSize: 22, fontWeight: "700", color: "#0b4e45" },
  statLabel: { fontSize: 13, color: "#9ca3af", marginTop: 2 },
});
