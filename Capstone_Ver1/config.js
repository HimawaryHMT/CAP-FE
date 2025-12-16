import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(':')[0]; // Lấy IP tự động
export const BASE_URL = `http://${host}:5060`;

console.log("🌐 BASE_URL:", BASE_URL);
