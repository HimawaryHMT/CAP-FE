import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/config";
import axios from "axios";

// Tạo sẵn instance axios có gắn token tự động
const apiToken = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Thêm interceptor để tự động gắn token trước mỗi request
apiToken.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  console.log("📦 Token lấy ra từ AsyncStorage:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiToken;
