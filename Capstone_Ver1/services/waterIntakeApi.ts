import apiToken from "@/app/config/axiosConfig";
import { BASE_URL } from "@/config";

export interface WaterIntakeRecord {
  id: number;
  user_id: number | null;
  elderly_id: number | null;
  amount_ml: number;
  drink_time: string;
  created_at: string;
}


export interface TodayWaterIntake {
  total_ml: number;
  drink_count: number;
  last_drink_time: string | null;
  date: string;
}

export interface WaterIntakeStats {
  date: string;
  total_ml: number;
  drink_count: number;
}

// Thêm bản ghi uống nước
export const addWaterIntake = async (
  amount_ml: number,
  user_id?: number,
  elderly_id?: number,
  drink_time?: string
) => {
  const res = await apiToken.post("/api/water-intake", {
    amount_ml,
    user_id: user_id || null,
    elderly_id: elderly_id || null,
    drink_time: drink_time || new Date().toISOString(),
  });
  return res.data;
};

// Xóa bản ghi
export const deleteWaterIntake = async (
  id: number,
  user_id?: number,
  elderly_id?: number
) => {
  const res = await apiToken.delete(`/api/water-intake/${id}`, {
    data: { user_id, elderly_id },
  });
  return res.data;
};

// Lấy tổng lượng nước hôm nay
export const getTodayWaterIntake = async (
  user_id?: number,
  elderly_id?: number
): Promise<{ success: boolean; data: TodayWaterIntake }> => {
  const params: any = {};
  if (user_id) params.user_id = user_id;
  if (elderly_id) params.elderly_id = elderly_id;

  const res = await apiToken.get("/api/water-intake/today", { params });
  return res.data;
};

// Lấy lịch sử uống nước
export const getWaterIntakeHistory = async (
  user_id?: number,
  elderly_id?: number,
  start_date?: string,
  end_date?: string,
  limit?: number
): Promise<{ success: boolean; count: number; data: WaterIntakeRecord[] }> => {
  const params: any = {};
  if (user_id) params.user_id = user_id;
  if (elderly_id) params.elderly_id = elderly_id;
  if (start_date) params.start_date = start_date;
  if (end_date) params.end_date = end_date;
  if (limit) params.limit = limit;

  const res = await apiToken.get("/api/water-intake/history", { params });
  return res.data;
};

// Lấy thống kê theo ngày
export const getWaterIntakeStats = async (
  user_id?: number,
  elderly_id?: number,
  days?: number
): Promise<{ success: boolean; count: number; data: WaterIntakeStats[] }> => {
  const params: any = {};
  if (user_id) params.user_id = user_id;
  if (elderly_id) params.elderly_id = elderly_id;
  if (days) params.days = days;

  const res = await apiToken.get("/api/water-intake/stats", { params });
  return res.data;
};


