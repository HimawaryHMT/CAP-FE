import apiToken from "@/app/config/axiosConfig";
import { BASE_URL } from "@/config";

export interface DoctorAIResponse {
  success: boolean;
  data: {
    question: string;
    answer: string;
    condition: string;
    severity: string;
    whenToSeeDoctor: string;
    isMatched: boolean;
    timestamp: string;
  };
}

export interface ChatHistoryItem {
  id: number;
  user_id: number | null;
  elderly_id: number | null;
  question: string;
  answer: string;
  condition_name: string | null;
  severity: string | null;
  created_at: string;
}

// Chat với Doctor AI
export const chatWithDoctorAI = async (
  question: string,
  user_id?: number,
  elderly_id?: number
): Promise<DoctorAIResponse> => {
  const res = await apiToken.post("/api/doctor-ai/chat", {
    question,
    user_id: user_id || null,
    elderly_id: elderly_id || null,
  });
  return res.data;
};

// Lấy lịch sử chat
export const getChatHistory = async (
  user_id?: number,
  elderly_id?: number
): Promise<{ success: boolean; count: number; data: ChatHistoryItem[] }> => {
  const params: any = {};
  if (user_id) params.user_id = user_id;
  if (elderly_id) params.elderly_id = elderly_id;

  const res = await apiToken.get("/api/doctor-ai/history", { params });
  return res.data;
};

// Lấy danh sách các bệnh thường gặp
export const getCommonConditions = async (): Promise<{
  success: boolean;
  count: number;
  data: Array<{
    condition: string;
    symptoms: string[];
    severity: string;
  }>;
}> => {
  const res = await apiToken.get("/api/doctor-ai/conditions");
  return res.data;
};




