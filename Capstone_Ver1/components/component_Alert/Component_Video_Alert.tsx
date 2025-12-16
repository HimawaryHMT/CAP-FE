import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VideoView, useVideoPlayer } from "expo-video";

// ==================== INTERFACES ====================
export interface LatestAlertCardProps {
  onContactMedicalSupport?: () => void;
   urlVideo: string;
  time: string;
}

// ==================== COMPONENT: LatestAlertCard ====================
export const LatestAlertCard1: React.FC<LatestAlertCardProps> = ({
  onContactMedicalSupport,
  urlVideo,
  time,
}) => {
  const player = useVideoPlayer(
    {
      uri: urlVideo,
    },
    (player) => player.play()
  );

  return (
    <View style={alertCardStyles.container}>
      {/* Video preview */}
      <View style={alertCardStyles.videoContainer}>
        <VideoView player={player} style={alertCardStyles.videoImage} />
      </View>

      {/* Info */}
      <View style={alertCardStyles.info}>
        <View style={alertCardStyles.infoRow}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={alertCardStyles.infoText}>{time}</Text>
        </View>
        <View style={alertCardStyles.infoRow}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={alertCardStyles.infoText}>
            Phát hiện té ngã tại phòng khách
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={alertCardStyles.actionsRow}>
        <TouchableOpacity
          style={[alertCardStyles.actionBtn, { backgroundColor: "#3ad840ff" }]}
          onPress={onContactMedicalSupport}
        >
          <Ionicons name="call" size={18} color="#fff" />
          <Text style={alertCardStyles.actionText}>Liên hệ hỗ trợ y tế</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[alertCardStyles.actionBtn, { backgroundColor: "#ffe66d" }]}
        >
          <Ionicons name="help-buoy" size={18} color="#111" />
          <Text style={[alertCardStyles.actionText, { color: "#111" }]}>
            Hướng dẫn sơ cứu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ==================== STYLES ====================
const alertCardStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    overflow: "hidden",
  },
  videoContainer: {
    position: "relative",
    height: 220,
    backgroundColor: "#f8f8f8",
  },
  videoImage: {
    width: "100%",
    height: "100%",
  },
  incidentTag: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "#e63946",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  incidentTagText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },
  info: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginVertical: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#444",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 6,
  },
});
