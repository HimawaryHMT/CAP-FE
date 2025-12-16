// components/charts/MiniBars.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface MiniBarsProps {
  values: number[];
  labels: string[];
  min: number;
  max: number;
  yTicks?: number[];
  showYAxis?: boolean;
  barColor?: string;
  dotColor?: string;
}

export default function MiniBars({
  values,
  labels,
  min,
  max,
  yTicks = [],
  showYAxis = false,
  barColor = "#86efac",
  dotColor = "#22c55e",
}: MiniBarsProps) {
  return (
    <View style={miniStyles.container}>
      {showYAxis && (
        <View style={miniStyles.yAxis}>
          {yTicks.map((tick, idx) => (
            <View key={idx} style={miniStyles.tickRow}>
              <Text style={miniStyles.yTick}>{tick}</Text>
              <View style={miniStyles.tickLine} />
            </View>
          ))}
        </View>
      )}

      <View style={miniStyles.barsWrapper}>
        {values.map((val, idx) => {
          const ratio = (val - min) / (max - min);
          const barHeight = 120 * ratio;
          return (
            <View key={idx} style={miniStyles.barContainer}>
              <Text style={[miniStyles.value, { bottom: barHeight + 28 }]}>
                {val.toFixed(1).replace(".", ",")}
              </Text>
              <View style={[miniStyles.bar, { height: barHeight, backgroundColor: barColor }]} />
              <View
                style={[
                  miniStyles.dot,
                  { bottom: barHeight + 20, backgroundColor: dotColor },
                ]}
              />
              <Text style={miniStyles.label}>{labels[idx]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const miniStyles = StyleSheet.create({
  container: { flexDirection: "row", marginTop: 12 },
  yAxis: { width: 40, marginRight: 8 },
  tickRow: { flexDirection: "row", alignItems: "center", height: 30 },
  yTick: { fontSize: 11, color: "#9ca3af", width: 30, textAlign: "right" },
  tickLine: { flex: 1, height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: "#cfe3db", marginLeft: 4, opacity: 0.6 },
  barsWrapper: { flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", paddingBottom: 20 },
  barContainer: { alignItems: "center", justifyContent: "flex-end", flex: 1, marginHorizontal: 6, position: "relative" },
  bar: { width: 24, borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  dot: { position: "absolute", width: 8, height: 8, borderRadius: 4 },
  value: { position: "absolute", fontSize: 11, fontWeight: "700", color: "#0b4e45" },
  label: { marginTop: 4, fontSize: 10, color: "#374151", fontWeight: "500" },
});