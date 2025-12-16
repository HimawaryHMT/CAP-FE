import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatProps {
  label: string;
  value: string | number;
}

export default function Stat({ label, value }: StatProps) {
  const formatted =
    typeof value === "number"
      ? value.toFixed(1).replace(".", ",")
      : value.replace(".", ",");

  return (
    <View style={styles.statBox}>
      <Text style={styles.statVal}>{formatted}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statBox: { alignItems: "center" },
  statVal: { fontSize: 22, fontWeight: "700", color: "#0b4e45" },
  statLabel: { fontSize: 13, color: "#9ca3af", marginTop: 2 },
});// components/charts/Stat.tsx

/* ========================= MiniBars Component ========================= */