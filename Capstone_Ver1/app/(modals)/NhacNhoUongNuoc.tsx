// WaterReminderScreen.tsx
import { Ionicons, MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Button_DieuChinhLuongNuoc1 from './ScreenNhacNhoUongNuoc/Button_DieuChinhLuongNuoc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  addWaterIntake,
  getTodayWaterIntake,
} from '@/services/waterIntakeApi';

const THEME = {
  // Tươi & đậm hơn
  bgTop: '#e6fbff',
  bgBottom: '#d6f5ea',
  card: '#ffffff',
  textPrimary: '#0b1324',
  textMuted: '#5b6b81',
  // Accents đậm & rực hơn
  accentDeep: '#0284c7',   // cyan-600
  accentMint: '#10b981',   // emerald-500
  accentTeal: '#0f766e',   // teal-700 (đậm để nổi trên nền sáng)
  accentGlass: '#eafff7',
  chipBg: '#f0fffb',
  chipBorder: '#a7f3d0',
  glassBorder: '#a5e4d6',
  glassStrokeBg: '#d7f1ed',
  // Tăng nổi khối
  shadowTint: '#0b4d40',
};

export default function WaterReminderScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [waterAmount, setWaterAmount] = useState(200);
  const [totalDrank, setTotalDrank] = useState(0);
  const [lastDrink, setLastDrink] = useState<number | null>(null);
  const [goal, setGoal] = useState(2000);
  const [cups, setCups] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user_id, setUser_id] = useState<number | undefined>();
  const [elderly_id, setElderly_id] = useState<number | undefined>();

  // Load user data và settings
  useEffect(() => {
    loadUserData();
  }, []);

  // Load dữ liệu khi user_id/elderly_id thay đổi
  useEffect(() => {
    if (user_id || elderly_id) {
      loadData();
    }
  }, [user_id, elderly_id]);

  const loadUserData = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        setUser_id(userData.user_id);
        setElderly_id(userData.elderly_id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load settings từ AsyncStorage
      try {
        const settingsStr = await AsyncStorage.getItem('waterIntakeSettings');
        if (settingsStr) {
          const settings = JSON.parse(settingsStr);
          setGoal(settings.daily_goal_ml || 2000);
          setWaterAmount(settings.default_amount_ml || 200);
        }
      } catch (settingsError) {
        console.warn('Error loading settings from AsyncStorage:', settingsError);
        // Sử dụng giá trị mặc định nếu không load được settings
      }

      // Chỉ load today's intake nếu có user_id hoặc elderly_id
      if (user_id || elderly_id) {
        try {
          const todayRes = await getTodayWaterIntake(user_id, elderly_id);
          if (todayRes && todayRes.success) {
            setTotalDrank(todayRes.data.total_ml || 0);
            setCups(todayRes.data.drink_count || 0);
            if (todayRes.data.last_drink_time) {
              // Tìm lượng nước của lần uống gần nhất
              // Tạm thời set là waterAmount, có thể cải thiện sau
              setLastDrink(waterAmount);
            }
          } else {
            // Nếu API trả về lỗi, set giá trị mặc định
            console.warn('API returned error:', todayRes?.message);
            setTotalDrank(0);
            setCups(0);
          }
        } catch (apiError: any) {
          console.error('Error calling getTodayWaterIntake API:', apiError);
          // Nếu lỗi API, vẫn hiển thị màn hình với giá trị 0
          setTotalDrank(0);
          setCups(0);
          // Chỉ hiển thị alert nếu lỗi nghiêm trọng
          if (apiError.response?.status !== 400) {
            Alert.alert('Lỗi', apiError.response?.data?.message || 'Không thể tải dữ liệu từ server. Vui lòng thử lại.');
          }
        }
      } else {
        // Nếu chưa có user_id/elderly_id, set giá trị mặc định
        setTotalDrank(0);
        setCups(0);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      // Chỉ hiển thị alert cho lỗi không mong đợi
      if (error.message && !error.message.includes('user_id')) {
        Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const progress = useMemo(() => {
    const p = Math.min(100, Math.max(0, Math.round((totalDrank / goal) * 100)));
    return isFinite(p) ? p : 0;
  }, [totalDrank, goal]);

  const handleAdd = async () => {
    if (saving) return;

    try {
      setSaving(true);
      const nextTotal = totalDrank + waterAmount;
      
      if (nextTotal > goal * 3) {
        Alert.alert('Cảnh báo', 'Bạn đã vượt quá mức hợp lý trong ngày!');
      }

      // Gọi API để lưu
      const res = await addWaterIntake(waterAmount, user_id, elderly_id);
      
      if (res.success) {
        setTotalDrank(nextTotal);
        setCups(c => c + 1);
        setLastDrink(waterAmount);
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể lưu dữ liệu');
      }
    } catch (error: any) {
      console.error('Error adding water intake:', error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể kết nối đến server');
    } finally {
      setSaving(false);
    }
  };

  const handleMinus = async () => {
    if (saving || totalDrank < waterAmount) return;

    try {
      setSaving(true);
      // Lấy lịch sử để xóa bản ghi gần nhất
      // Tạm thời chỉ cập nhật UI, có thể cải thiện sau để xóa đúng bản ghi
      const newTotal = Math.max(totalDrank - waterAmount, 0);
      setTotalDrank(newTotal);
      setCups(c => Math.max(c - 1, 0));
      setLastDrink(waterAmount * -1);
      
      // TODO: Implement delete last record properly
      Alert.alert('Thông báo', 'Tính năng xóa bản ghi sẽ được cập nhật sớm');
    } catch (error) {
      console.error('Error subtracting water intake:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetToday = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc muốn reset dữ liệu hôm nay?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setTotalDrank(0);
            setCups(0);
            setLastDrink(null);
          }
        }
      ]
    );
  };

  const handleGoalChange = async (newGoal: number) => {
    try {
      // Lưu settings vào AsyncStorage
      const settingsStr = await AsyncStorage.getItem('waterIntakeSettings');
      const settings = settingsStr ? JSON.parse(settingsStr) : {};
      settings.daily_goal_ml = newGoal;
      await AsyncStorage.setItem('waterIntakeSettings', JSON.stringify(settings));
      setGoal(newGoal);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleWaterAmountChange = async (newAmount: number) => {
    try {
      // Lưu settings vào AsyncStorage
      const settingsStr = await AsyncStorage.getItem('waterIntakeSettings');
      const settings = settingsStr ? JSON.parse(settingsStr) : {};
      settings.default_amount_ml = newAmount;
      await AsyncStorage.setItem('waterIntakeSettings', JSON.stringify(settings));
      setWaterAmount(newAmount);
    } catch (error) {
      console.error('Error updating water amount:', error);
    }
  };

  // Progress ring
  const R = 70;
  const STROKE = 12;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (CIRC * progress) / 100;

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <Stack.Screen options={{ title: 'Nhắc nhở uống nước' }} />

      {/* HEADER */}
      <View style={styles.headerTop}>
        <View style={styles.titleRow}>
          <Text style={styles.titleText}>💧 Uống nước nào!</Text>
          <View style={styles.goalBadge}>
            <Ionicons name="flag-outline" size={14} color={THEME.accentTeal} />
            <Text style={styles.goalBadgeText}>{goal}ml</Text>
          </View>
        </View>
        <Text style={styles.subTitle}>Giữ cơ thể tươi mát mỗi ngày</Text>
      </View>

      {/* CARD PROGRESS */}
      <View style={styles.headerWrap}>
        <View style={styles.ringCard}>
          <Svg width={200} height={200} viewBox="0 0 200 200" style={{ zIndex: 1 }}>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={THEME.accentMint} />
                <Stop offset="100%" stopColor={THEME.accentDeep} />
              </LinearGradient>
              <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#ffffff" />
                <Stop offset="1" stopColor="#f5fffb" />
              </LinearGradient>
            </Defs>

            {/* track */}
            <Circle
              cx="100"
              cy="100"
              r={R}
              stroke={THEME.glassStrokeBg}
              strokeWidth={STROKE}
              fill="none"
            />
            {/* progress */}
            <Circle
              cx="100"
              cy="100"
              r={R}
              stroke="url(#grad)"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${CIRC} ${CIRC}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            {/* glow */}
            <Circle
              cx="100"
              cy="100"
              r={R}
              stroke={THEME.accentMint + '22'}
              strokeWidth={STROKE + 6}
              fill="none"
              opacity={0.4}
            />
          </Svg>

          <View style={styles.centerStat}>
            <Text style={styles.totalMl}>{totalDrank}ml</Text>
            <View style={styles.pctRow}>
              <Ionicons name="water-outline" size={16} color={THEME.accentTeal} />
              <Text style={styles.progressPct}>{progress}%</Text>
            </View>
            <Text style={styles.subtleText}>Hôm nay</Text>
          </View>

          {/* card gradient backdrop (subtle) */}
          <View style={styles.ringBackdrop} />
        </View>

        {/* Chips */}
        <View style={styles.infoRowGroup}>
          <View style={styles.infoChip}>
            <MCI name="cup" size={18} color={THEME.textPrimary} />
            <Text style={styles.infoChipValue}>{goal}ml</Text>
            <Text style={styles.infoChipLabel}>Mục tiêu</Text>
          </View>

          <View style={styles.infoChip}>
            <MCI name="cup-outline" size={18} color={THEME.textPrimary} />
            <Text style={styles.infoChipValue}>
              {lastDrink === null ? '—' : `${Math.abs(lastDrink)}ml ${lastDrink > 0 ? '' : '(trừ)'}`}
            </Text>
            <Text style={styles.infoChipLabel}>Lần gần nhất</Text>
          </View>

          <View style={styles.infoChip}>
            <MCI name="glass-cocktail" size={18} color={THEME.textPrimary} />
            <Text style={styles.infoChipValue}>{cups} lần</Text>
            <Text style={styles.infoChipLabel}>Số lần</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.historyBtn}
          onPress={() => router.push('/ScreenNhacNhoUongNuoc/LichSuVaThongKe')}
        >
          <Text style={styles.historyBtnText}>Lịch sử & Thống kê</Text>
          <Ionicons name="chevron-forward" size={16} color={THEME.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Wave */}
      <Svg height={140} width="100%" viewBox="0 0 1440 320" style={styles.waveSvg} accessible accessibilityLabel="Nền sóng trang trí">
        <Defs>
          <LinearGradient id="wave" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#7cd9c8" />
            <Stop offset="1" stopColor="#a8e6ff" />
          </LinearGradient>
        </Defs>
        <Path
          fill="url(#wave)"
          d="M0,128L40,138.7C80,149,160,171,240,176C320,181,400,171,480,149.3C560,128,640,96,720,101.3C800,107,880,149,960,165.3C1040,181,1120,171,1200,154.7C1280,139,1360,117,1400,117.3L1440,117V320H0Z"
        />
      </Svg>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.roundBtn} onPress={handleMinus} accessibilityRole="button" accessibilityLabel="Trừ lượng nước">
          <Ionicons name="remove" size={28} color="#0b4d40" />
        </TouchableOpacity>

        <View style={styles.centerGlass}>
          <TouchableOpacity onPress={handleAdd} accessibilityRole="button" accessibilityLabel="Thêm lượng nước">
            <Ionicons name="add" size={36} color="#0b4d40" />
          </TouchableOpacity>
          <Text style={styles.centerHint}>+{waterAmount}ml</Text>
        </View>

        <TouchableOpacity
          style={styles.roundBtn}
          onPress={() => setModalVisible(true)}
          accessibilityRole="button"
          accessibilityLabel="Điều chỉnh dung tích mỗi lần uống"
        >
          <FontAwesome6 name="bottle-water" size={30} color="#0b4d40" />
        </TouchableOpacity>
      </View>

      {/* Bottom row */}
      <View style={styles.bottomRow}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => handleGoalChange(goal === 2000 ? 2500 : 2000)}
        >
          <Ionicons name="flag-outline" size={16} color={THEME.accentTeal} />
          <Text style={styles.secondaryBtnText}>Mục tiêu: {goal}ml</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={handleResetToday}>
          <Ionicons name="refresh-outline" size={16} color={THEME.accentTeal} />
          <Text style={styles.secondaryBtnText}>Làm mới</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={THEME.accentTeal} />
        </View>
      )}

      <Button_DieuChinhLuongNuoc1
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        waterAmount={waterAmount}
        setWaterAmount={handleWaterAmountChange}
      />
    </SafeAreaView>
  );
}

const shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { elevation: 6 },
  default: {},
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Gradient-ish background bằng 2 màu (không cần lib):
    backgroundColor: THEME.bgTop,
     paddingBottom: 40,
  },
  headerTop: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: THEME.textPrimary,
  },
  subTitle: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 4,
  },
  goalBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: THEME.chipBg,
    borderWidth: 1,
    borderColor: THEME.chipBorder,
    borderRadius: 999,
    ...shadow,
  },
  goalBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: THEME.accentTeal,
  },

  headerWrap: { paddingTop: 6, paddingHorizontal: 16 },

  ringCard: {
    alignSelf: 'center',
    width: 270,
    height: 270,
    borderRadius: 28,
    backgroundColor: THEME.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    overflow: 'hidden',
    ...shadow,
  },
  ringBackdrop: {
    position: 'absolute',
    inset: 0,
    opacity: 0.65,
    backgroundColor: '#ffffff00',
  },
  centerStat: { position: 'absolute', alignItems: 'center' },
  totalMl: { fontSize: 30, fontWeight: '900', color: THEME.textPrimary },
  pctRow: { marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressPct: { fontSize: 18, fontWeight: '800', color: THEME.accentTeal },
  subtleText: { fontSize: 12, color: THEME.textMuted, marginTop: 6 },

  infoRowGroup: { marginTop: 12, flexDirection: 'row', gap: 10 },
  infoChip: {
    flex: 1,
    backgroundColor: THEME.card,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    ...shadow,
  },
  infoChipValue: { fontSize: 16, fontWeight: '800', color: THEME.textPrimary, marginTop: 6 },
  infoChipLabel: { fontSize: 12, color: THEME.textMuted, marginTop: 2 },

  historyBtn: {
    marginTop: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    ...shadow,
  },
  historyBtnText: { fontSize: 14, fontWeight: '800', color: THEME.textPrimary },

  waveSvg: { marginTop: 12, opacity: 0.95 },

  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    alignItems: 'flex-end',
    marginTop: -6,
  },
  roundBtn: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: THEME.accentGlass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.glassBorder,
    ...shadow,
  },
  centerGlass: {
    width: 128,
    height: 128,
    backgroundColor: THEME.accentGlass,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: THEME.glassBorder,
    ...shadow,
  },
  centerHint: { marginTop: 6, fontSize: 12, fontWeight: '700', color: '#0b4d40' },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingHorizontal: 20,
    gap: 10,
   
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: THEME.card,
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: THEME.glassBorder,
    ...shadow,
  },
  secondaryBtnText: { fontSize: 13, fontWeight: '800', color: THEME.accentTeal },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});
