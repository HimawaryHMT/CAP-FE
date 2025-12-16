import { router } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";

export function AddRecordButton() {
  return (
    <Pressable
      onPress={() => {router.push('../../../(modals)/ScreenCanNangVaChiSoBMI/ScreenAddRecord.tsx/AddRecord');}}
      style={({ pressed }) => [
        styles.btn,
        pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }, // hiệu ứng nhấn
      ]}
    >
      <Text style={styles.txt}>+ Thêm bản ghi</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#A7F3D0", // xanh mint pastel nhẹ nhàng
    marginTop: 12,
    marginBottom: 34,
    borderRadius: 30,
    paddingVertical: 14,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3, // cho Android
  },
  txt: { color: "#545454ff", fontWeight: "700", fontSize: 20 },
});
