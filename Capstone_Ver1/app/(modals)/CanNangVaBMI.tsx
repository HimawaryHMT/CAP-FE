import { AddRecordButton } from "@/components/component_BMI/AddRecordButton";
import AllHistory from "@/components/component_BMI/componentHistory";
import SoLieuThongKe from "@/components/component_BMI/soLieuThongKe";
import { BASE_URL } from "@/config";
import axios from "axios";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import BMIStatistic from "../../components/component_BMI/BMIStatistic";
import WeightStatistic from "../../components/component_BMI/CanNangStatistic";
import apiToken from "@/app/config/axiosConfig";

export default function CanNangVaBMI() {

  const [recordCount, setRecordCount] = useState(0); // khai báo ở đầu component

  // === STATE BMI ===
  const [bmiData, setBmiData] = useState({
    max: 23.4,
    min: 19.8,
    avg: 21.6,
    values: [20.0, 20.5, 21.0, 22.2],
    labels: ["T12", "T2", "T3", "T4"],
  });


  // === STATE Weight ===
  const [weightData, setWeightData] = useState({
    max: 70.5,
    min: 61.3,
    avg: 65.4,
    values: [62.0, 63.5, 64.0, 68.2, 70.5],
    labels: ["T1", "T22", "T3", "T4", "T5"],
  });

  const [historyData, setHistoryData] = useState({
    weight: 60.0,
    height: 165,
    bmi: 22.0,
    category: "Bình thường",
    dateTime: "2025-09-28 22:54"
  },
  );

  // === fetch data API BMI ===
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ví dụ API gọi thực tế của bạn
        const res = await apiToken.get(`${BASE_URL}/api/CanNangVaBMI/getAll_BMI`);
        // Giả sử API trả về format tương tự
        setBmiData(res.data.data);
        // ✅ cập nhật state số bản ghi
        setRecordCount(res.data.data.values.length);

        // Fetch Weight
        const resWeight = await apiToken.get(`${BASE_URL}/api/CanNangVaBMI/getAll_CanNang`);
        setWeightData(resWeight.data.data);

        // 
        const resHistoryData = await apiToken.get(`${BASE_URL}/api/CanNangVaBMI/getDetail_CN_BMI`);
        setHistoryData(resHistoryData.data.data)

      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  return (
  <>
    <Stack.Screen
      options={{
        title: "Biểu Đồ Cân Nặng & BMI",
        headerLargeTitle: true,
        headerTitleAlign: "center",
      }}
    />

    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#f3f4f6",
      }}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingTop: 4, // ✅ giảm khoảng cách phía trên
        paddingBottom: 24,
        gap: 16, // ✅ spacing đều và hiện đại
      }}
      showsVerticalScrollIndicator={false}
    >
      <BMIStatistic
        max={bmiData.max}
        min={bmiData.min}
        avg={bmiData.avg}
        values={bmiData.values}
        labels={bmiData.labels}
      />

      <WeightStatistic
        max={weightData.max}
        min={weightData.min}
        avg={weightData.avg}
        values={weightData.values}
        labels={weightData.labels}
      />

      <AllHistory
        weight={historyData.weight}
        height={historyData.height}
        bmi={historyData.bmi}
        date={historyData.dateTime}
      />

      <SoLieuThongKe
        title="Số liệu thống kê"
        subtitle="BMI Overview"
        total={recordCount}
        percent
        min={bmiData.min}
        avg={bmiData.avg}
        max={bmiData.max}
      />
    </ScrollView>

    <AddRecordButton />
  </>
);
}
