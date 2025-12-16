import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LatestAlertCard1 } from "@/components/component_Alert/Component_Video_Alert";
import { AlertHistoryItem } from "@/components/component_Alert/Component_History_Alert";
import type { AlertHistoryData } from "@/components/component_Alert/Component_History_Alert";

import { useAlert } from '@/components/component_Alert/AlertComponentContext';
import { getFallEvents } from "@/services/fallEventApi";


// ==================== MAIN SCREEN ====================
export default function FallAlertScreen() {

  type LatestAlert = {
    time: string;
    urlVideo: string;
  };

  const handleContactMedicalSupport = () =>
    console.log("Contacting medical support...");

  const [latestAlert, setLatestAlert] = useState<LatestAlert | null>(null);
  const [alertHistory, setAlertHistory] = useState<AlertHistoryData[]>([]);

  // Khi user vào màn hình Alert → tắt cảnh báo
  const { setHasAlert } = useAlert();
  useEffect(() => {
    setHasAlert(false);
  }, []);

  // ===================== GỌI API LẤY DATA =====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFallEvents(); // data chính là JSON bạn gửi Postman
        console.log("👉 Raw API response:", data);
        console.log("👉 Latest Alert:", latestAlert);
        console.log("👉 Alert History:", alertHistory);

        if (!data || !data.data || data.data.length === 0) {
          console.log("Không có fall events");
          return;
        }

        // Lấy sự kiện mới nhất (phần tử đầu)
        const latest = data.data[0];

        setLatestAlert({
          time: latest.detected_at,
          urlVideo: latest.video_url,
        });

        // Map lại dữ liệu cho lịch sử
        const mappedHistory: AlertHistoryData[] = data.data.map((item: any) => ({
          id: item.event_id,          
          type: "fall",                
          title: "Sự cố té ngã",      
          time: item.detected_at,     
          status: "Đã xử lý",         
        }));

        setAlertHistory(mappedHistory);
      } catch (error) {
        console.log("Lỗi load dữ liệu alert:", error);
      }
    };

    fetchData();
  }, []);


  const alertHistory1: AlertHistoryData[] = [
    {
      id: "1",
      type: "fall",
      title: "Sự cố té ngã ",
      time: "09:30 2 SA, 14 tháng 10, 2024",
      status: "Đã xử lý",
    },
    {
      id: "2",
      type: "abnormal",
      title: "Tình trạng bất thường",
      time: "07:15 SA, 12 tháng 10, 2024",
      status: "Đã xử lý",
    },
  ];

  const latestAlert1 = [
    {
      time: "09:30 SA, 15 tháng 10, 2024",
      urlVideo: "https://res.cloudinary.com/dfwljv9iw/video/upload/v1764778624/fall_events/videos/Ezviz1_ID2_20251203_231651.mp4"
    }
  ]

  return (
    <View style={styles.container}>

      <ScrollView showsVerticalScrollIndicator={false}>

        <Text style={styles.sectionTitleCenter}>
          <Ionicons name="warning-outline" size={26} color="#d7110bff" /> Cảnh báo
        </Text>
        {latestAlert && (
          <LatestAlertCard1
            urlVideo={latestAlert.urlVideo}
            time={latestAlert.time}
            onContactMedicalSupport={handleContactMedicalSupport}
          />
        )}
        <Text style={styles.sectionTitle}>Lịch sử cảnh báo</Text>
        {alertHistory.map((item) => (
          <AlertHistoryItem
            key={item.id}
            id={item.id}
            type={item.type}
            title={item.title}
            time={item.time}
            status={item.status}
          />
        ))}
      </ScrollView>
    </View>
  );
}



// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitleCenter: {
    fontSize: 30,
    fontWeight: "800",
    color: "#d7110bff",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 5,
  },
});
