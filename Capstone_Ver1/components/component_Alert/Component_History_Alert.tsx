import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ==================== INTERFACE ====================
export interface AlertHistoryData {
  id: string;
  type: "fall" | "abnormal";
  title: string;
  time: string;
  status: string;
}

// ==================== COMPONENT ====================
export const AlertHistoryItem: React.FC<AlertHistoryData> = ({
  type,
  title,
  time,
  status,
}) => {
  const color = type === "fall" ? "#e63946" : "#4361ee";

  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        <Ionicons
          name={type === "fall" ? "warning" : "pulse"}
          size={20}
          color="#fff"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.time}>{time}</Text>
        <Text style={[styles.status, { color }]}>
          {status.toUpperCase()}
        </Text>
      </View>
    </View>
  );
};

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  time: {
    fontSize: 13,
    color: "#666",
    marginVertical: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: "700",
  },
});
