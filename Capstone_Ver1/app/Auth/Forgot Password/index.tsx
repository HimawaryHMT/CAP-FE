import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View, 
    Alert
} from "react-native";
import { Stack } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState("");

  // Tạo dữ liệu mẫu để kiểm tra
  const mockDatabase = [
    { email: "thang@gmail.com", phone: "1234567890" },
    { email: "user2@example.com", phone: "0987654321" }
  ];

  // Hàm bấm nút gửi yêu cầu đặt lại mật khẩu
  const handleSendRequest = () => {
    const user = mockDatabase.find(
      u => u.email === emailOrPhone || u.phone === emailOrPhone
    );
    if (user) {
        router.push('../Auth/Forgot Password/Verify/Verify_Password');
    } else {
        Alert.alert("Email hoặc số điện thoại không tồn tại trong hệ thống.");
    }

  }



  return (
    <View style={styles.container}>
        <Stack.Screen options={{ title: 'Quên mật khẩu' }} />
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.circle}>
          <Text style={styles.logoText}>H</Text>
        </View>
        <Text style={styles.appName}>HealthApp</Text>
        <Text style={styles.tagline}>Chăm sóc sức khỏe</Text>
      </View>

      {/* Tiêu đề */}
      <Text style={styles.title}>Quên mật khẩu</Text>

      {/* Ô nhập */}
      <TextInput
        style={styles.input}
        placeholder="Email/Số điện thoại"
        placeholderTextColor="#666"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
      />

      {/* Nút gửi */}
      <TouchableOpacity style={styles.sendButton}  onPress={handleSendRequest}>
        <Text style={styles.sendButtonText}>Gửi yêu cầu</Text>
      </TouchableOpacity>

      {/* Quay lại đăng nhập */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>Quay lại Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 60
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30
  },
  circle: {
    backgroundColor: "#4CAF50",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10
  },
  logoText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold"
  },
  appName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50"
  },
  tagline: {
    fontSize: 14,
    color: "#666"
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 20
  },
  sendButton: {
    width: "100%",
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  backText: {
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: 10
  }
});