import React, { createContext, useState, useContext, ReactNode , useEffect } from "react";
import io from "socket.io-client";
import { BASE_URL } from "@/config";


interface AlertContextType {
  hasAlert: boolean;
  setHasAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertContext = createContext<AlertContextType | null>(null);

interface AlertProviderProps {
  children: ReactNode;
}

export const AlertProvider = ({ children }: AlertProviderProps) => {
  const [hasAlert, setHasAlert] = useState(true);

  useEffect(() => {
    // ⚠️ THAY IP NÀY BẰNG IP MÁY CHẠY BACKEND
    // Ví dụ: "http://192.168.1.10:5060"
    const SOCKET_BACKEND_URL = BASE_URL;

    const socket = io(SOCKET_BACKEND_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to socket:", socket.id);
    });

    // 🔥 Khi backend gửi fall event mới → đổi nút Alert sang màu đỏ
    socket.on("new_fall_event", (event) => {
      console.log("🔥 NEW FALL EVENT RECEIVED:", event);
      setHasAlert(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AlertContext.Provider value={{ hasAlert, setHasAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used inside AlertProvider");
  }
  return context;
};
