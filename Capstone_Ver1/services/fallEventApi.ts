import api from "@/app/config/axiosConfig";

// Nếu sau này bạn thêm JWT:
// api.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export interface FallEvent {
  event_id: string;
  elderly_id: string;
  device_id: string | null;
  detected_at: string;
  snapshot_url: string | null;
  video_url: string | null;
  created_at: string;
}


export const getFallEvents = async () => {
  const res = await api.get("/api/fall-events");
  return res.data;
};