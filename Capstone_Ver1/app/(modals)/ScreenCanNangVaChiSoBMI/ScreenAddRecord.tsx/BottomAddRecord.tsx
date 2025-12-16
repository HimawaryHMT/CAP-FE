import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TimePickerCardProps {
  currentDate: string;
  currentHour: string;
  currentMinute: string;
}

export default function TimePickerCard({
  currentDate = "",
  currentHour = "--",
  currentMinute = "--",
}: TimePickerCardProps) {
  return (
    <View style={styles.card} accessible accessibilityLabel="Thời gian đã chọn">
      <View style={[styles.row, styles.currentRow]} accessibilityLabel="Thời gian hiện tại">
        <View style={styles.leftBlock}>
          <Text style={[styles.caption, styles.captionCurrent]}>Đang chọn</Text>
          <Text style={styles.date} numberOfLines={1}>
            {currentDate || "—"}
          </Text>
        </View>

        <View style={styles.timePillActive}>
          <Text style={styles.time}>{currentHour}</Text>
          <Text style={styles.sep}>:</Text>
          <Text style={styles.time}>{currentMinute}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  currentRow: {
    backgroundColor: "#ecfdf5",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  leftBlock: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  caption: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.3,
    color: "#6b7280",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  captionCurrent: {
    color: "#059669",
  },
  date: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  timePillActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 96,
    justifyContent: "center",
  },
  time: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.5,
    includeFontPadding: false,
  },
  sep: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    marginHorizontal: 4,
    includeFontPadding: false,
  },
});