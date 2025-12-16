import { Text, StatusBar, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import React, { useMemo, useState, useEffect } from "react";


export default function VerifyScreen() {
  return (
    <>
      {/* ✅ Đặt tiêu đề màn hình */}
      <Stack.Screen options={{ title: "Xác thực tài khoản" }} />

      {/* ✅ Nội dung chính từ VerifyEmailScreen */}
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <AppHeader />
        <Text style={styles.title}>Xác nhận OTP</Text>
        <View style={styles.body}>
          <InfoBox />
          <OtpInputs />
          <CountdownText />
          <PrimaryButton title="Xác nhận" />
          <ResendLink />
        </View>
      </SafeAreaView>
    </>
  );
}

/* ===================== Components nhỏ ===================== */

function AppHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>H</Text>
        </View>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>HealthApp</Text>
          <Text style={styles.appSlogan}>Chăm sóc sức khỏe</Text>
        </View>
      </View>
    </View>
  );
}

function InfoBox() {
  return (
    <View style={styles.infoBox}>
      <View style={styles.infoIcon}>
        <Text style={styles.infoIconText}>i</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoText}>
          Mã xác thực OTP sẽ được gửi đến địa chỉ Gmail đã được bạn xác minh.
          Vui lòng kiểm tra và sử dụng địa chỉ Gmail đó để nhận mã.        </Text>
      </View>
    </View>
  );
}

type OtpInputsProps = { boxes?: number };
function OtpInputs({ boxes = 6 }: OtpInputsProps) {
  const items = useMemo(() => Array.from({ length: boxes }), [boxes]);
  return (
    <View style={styles.otpRow}>
      {items.map((_, idx) => (
        <TextInput key={idx} style={styles.otpInput} keyboardType="number-pad" maxLength={1} />
      ))}
    </View>
  );
}

function CountdownText() {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds === 0) return; // Dừng khi hết thời gian

    const timer = setTimeout(() => {
      setSeconds(seconds - 1);
    }, 1000);

    return () => clearTimeout(timer); // Clear timeout khi component bị unmount hoặc seconds thay đổi
  }, [seconds]);

  return (
    <Text style={styles.countdownText}>
      {seconds > 0 ? `Mã sẽ hết hạn sau ${seconds} giây` : "Mã đã hết hạn"}
    </Text>
  );
}

type PrimaryButtonProps = { title: string; onPress?: () => void };
function PrimaryButton({ title, onPress }: PrimaryButtonProps) {
  return (
    <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7} onPress={onPress}>
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
}

function ResendLink() {
  return (
    <View style={styles.resendRow}>
      <Text style={styles.resendMuted}>Bạn gặp vấn đề? </Text>
      <TouchableOpacity>
        <Text style={styles.resendLink}>Gửi lại mã</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===================== Styles ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: "#fff", paddingTop: 20, paddingBottom: 20, paddingHorizontal: 20, alignItems: "center" },
  logoContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  logo: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#4CAF50", justifyContent: "center", alignItems: "center", marginRight: 12 },
  logoText: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  appInfo: { alignItems: "flex-start" },
  appName: { fontSize: 20, fontWeight: "bold", color: "#4CAF50" },
  appSlogan: { fontSize: 14, color: "#666", marginTop: 2 },
  title: { fontSize: 22, fontWeight: "bold", color: "#000", textAlign: "center", marginTop: 4 },
  body: { paddingHorizontal: 24, paddingTop: 24 },

  infoBox: { flexDirection: "row", alignItems: "flex-start", backgroundColor: "#F4FBFF", borderWidth: 1, borderColor: "#D6EEFF", borderRadius: 12, padding: 12 },
  infoIcon: { width: 22, height: 22, borderRadius: 11, backgroundColor: "#E6F5FF", justifyContent: "center", alignItems: "center", marginRight: 10 },
  infoIconText: { color: "#2094F3", fontWeight: "bold" },
  infoText: { color: "#2F3C4C", fontSize: 14, lineHeight: 20 },

  otpRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 18 },
  otpInput: { width: 44, height: 48, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, textAlign: "center", fontSize: 18, color: "#000", backgroundColor: "#fff" },

  countdownText: { textAlign: "center", color: "#8A8A8A", marginTop: 14 },

  primaryButton: { backgroundColor: "#2EAD67", borderRadius: 10, paddingVertical: 14, marginTop: 16 },
  primaryButtonText: { textAlign: "center", color: "#fff", fontWeight: "bold", fontSize: 16 },

  resendRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 14 },
  resendMuted: { color: "#999" },
  resendLink: { color: "#2EAD67", fontWeight: "bold" },
});
