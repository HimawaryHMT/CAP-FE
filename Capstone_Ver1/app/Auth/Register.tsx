import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { api } from "../config/apiRegister";

import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    cameraAddress: "",
    braceletAddress: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev: any) => ({ ...prev, [field]: "" })); // clear error on typing
  };

  //===================
  // VALIDATION
  //===================
  const validate = () => {
    let isValid = true;
    const newErrors: any = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
      isValid = false;
    } else if (!/^(0|\+84)[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
      isValid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự.";
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
      isValid = false;
    }

    // VALIDATE CAMERA ADDRESS
    if (!formData.cameraAddress.trim()) {
      newErrors.cameraAddress = "Vui lòng nhập địa chỉ thiết bị Camera.";
      isValid = false;
    }

    // VALIDATE BRACELET ADDRESS
    if (!formData.braceletAddress.trim()) {
      newErrors.braceletAddress = "Vui lòng nhập địa chỉ thiết bị Vòng tay.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
  if (!validate()) return;

  try {
    const res = await api.post("/api/auth/register", formData);
    // const res = await api.post("/api/auth/register/mock", formData);

    if (res.data.success) {
      router.push({
        pathname: "/Auth/VerifyRegister",
        params: { email: formData.email }
      });
    } else {
      alert(res.data.message || "Đăng ký thất bại!");
    }

  } catch (error) {
    console.log("Register error:", error);
    alert("Không thể kết nối máy chủ!");
  }
  };

  const handleLogin = () => {
    router.push("/Auth/Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Đăng ký tài khoản' }} />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
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

        {/* Title */}
        <Text style={styles.title}>Đăng ký</Text>

        {/* Form */}
        <View style={styles.form}>
          {/** FULL NAME */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              value={formData.fullName}
              onChangeText={(value) => handleInputChange("fullName", value)}
              placeholderTextColor="#999"
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
          </View>

          {/** EMAIL */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/** PHONE */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/** PASSWORD */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              value={formData.password}
              onChangeText={(value) => handleInputChange("password", value)}
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={18}
                color="#999"
              />
            </TouchableOpacity>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/** CONFIRM PASSWORD */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={18}
                color="#999"
              />
            </TouchableOpacity>
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}
          </View>

          {/** CAMERA ADDRESS */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ vật lí thiết bị Camera"
              value={formData.cameraAddress}
              onChangeText={(value) => handleInputChange("cameraAddress", value)}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            {errors.cameraAddress && (
              <Text style={styles.errorText}>{errors.cameraAddress}</Text>
            )}
          </View>

          {/** BRACELET ADDRESS */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ vật lí thiết bị Vòng tay"
              value={formData.braceletAddress}
              onChangeText={(value) => handleInputChange("braceletAddress", value)}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
            {errors.braceletAddress && (
              <Text style={styles.errorText}>{errors.braceletAddress}</Text>
            )}

          </View>

          {/* Button Register */}
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Đăng ký</Text>
          </TouchableOpacity>

          {/* Login link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { paddingVertical: 15, alignItems: "center" },
  logoContainer: { flexDirection: "row", alignItems: "center" },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoText: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  appName: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
  appSlogan: { fontSize: 12, color: "#666" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15,
    marginBottom: 20,
  },
  form: { paddingHorizontal: 20 },
  inputContainer: { marginBottom: 14, position: "relative" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -9 }],
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 2,
  },
  registerButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 10,
    marginBottom: 15,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  loginText: { fontSize: 14, color: "#999" },
  loginLink: { fontSize: 14, color: "#4CAF50", fontWeight: "bold" },
  appInfo: { alignItems: "flex-start" },
});
