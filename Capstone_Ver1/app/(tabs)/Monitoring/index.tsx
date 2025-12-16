// TabThreeScreen.tsx
import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from "expo-router";


export default function TabThreeScreen() {
  // ======= Mock data (có thể thay bằng API của bạn) =======
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: gọi API thật ở đây
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const todayStats = {
    heartRate: 76, // bpm
    steps: 6420,
    bmi: 21.3,
    lastSync: 'Hôm nay, 09:42',
  };

  const weeklySteps = [4200, 5300, 7000, 6100, 8450, 9100, 6420]; // 7 ngày
  const weeklyLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

  const stepsMax = useMemo(
    () => Math.max(...weeklySteps, 1),
    [weeklySteps]
  );

  // ======= UI =======
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <Stack.Screen
        options={{
          headerShown: false, // ✅ Ẩn toàn bộ header, không còn khoảng trắng
        }}
      />
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Theo dõi sức khỏe</Text>
          <Text style={styles.subheading}>Tổng quan hôm nay</Text>
        </View>
        <Pressable
          style={styles.syncPill}
          accessibilityRole="button"
          onPress={onRefresh}
        >
          <Ionicons name="refresh" size={16} />
          <Text style={styles.syncText}>Đồng bộ</Text>
        </Pressable>
      </View>

      {/* Nội dung cuộn */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hàng thẻ thống kê */}
        <View style={styles.row}>
          <StatCard
            icon="heart"
            title="Nhịp tim"
            value={`${todayStats.heartRate}`}
            unit="bpm"
            color="#ef4444"
            hint="Bình thường"
          />
          <StatCard
            icon="walk"
            title="Bước chân"
            value={`${todayStats.steps.toLocaleString('vi-VN')}`}
            unit="/ngày"
            color="#3b82f6"
            hint="Mục tiêu: 8k"
          />
        </View>

        <View style={styles.row}>
          <StatCard
            icon="body"
            title="BMI"
            value={`${todayStats.bmi.toFixed(1)}`}
            unit=""
            color="#10b981"
            hint={getBmiHint(todayStats.bmi)}
          />
          <InfoCard
            icon="cloud-done"
            title="Đồng bộ"
            subtitle={todayStats.lastSync}
          />
        </View>

        {/* Biểu đồ mini: Bước chân theo tuần */}
        <SectionTitle
          title="Xu hướng tuần"
          right={<Tag text="Bước chân" />}
        />
        <MiniBars
          values={weeklySteps}
          labels={weeklyLabels}
          max={stepsMax}
        />

        {/* Chỉ số gần đây */}
        <SectionTitle title="Chỉ số gần đây" />
        <RecentMetric
          icon="water"
          color="#0ea5e9"
          label="Nước uống"
          value="1.2 L"
          note="Hôm nay"
        />
        <RecentMetric
          icon="fitness"
          color="#a855f7"
          label="Calo tiêu thụ"
          value="530 kcal"
          note="Buổi sáng"
        />
        <RecentMetric
          icon="moon"
          color="#f59e0b"
          label="Giấc ngủ"
          value="6h 45m"
          note="Đêm qua"
        />

        {/* Tác vụ nhanh */}
        <SectionTitle title="Tác vụ nhanh" />
        <View style={styles.quickGrid}>
          <QuickAction
            icon="add-circle"
            label="Thêm bản ghi"
            onPress={() => { }}
          />
          <QuickAction
            icon="pulse"
            label="Đo nhịp tim"
            onPress={() => { }}
          />
          <QuickAction
            icon="walk"
            label="Ghi bước chân"
            onPress={() => { }}
          />
          <QuickAction
            icon="water"
            label="Uống nước"
            onPress={() => { }}
          />
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* =======================
 *   Components nhỏ
 * ======================= */

function StatCard({
  icon,
  title,
  value,
  unit,
  color,
  hint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  unit?: string;
  color: string;
  hint?: string;
}) {
  return (
    <View style={styles.statCard} accessible accessibilityLabel={`${title}: ${value} ${unit ?? ''}`}>
      <View style={styles.statTop}>
        <View style={[styles.iconWrap, { backgroundColor: withOpacity(color, 0.12) }]}>
          <Ionicons name={icon} size={18} style={{ color }} />
        </View>
        {hint ? <Text style={styles.hint}>{hint}</Text> : <View />}
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.valueText}>{value}</Text>
        {!!unit && <Text style={styles.unitText}>{unit}</Text>}
      </View>
    </View>
  );
}

function InfoCard({
  icon,
  title,
  subtitle,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}) {
  return (
    <View style={styles.infoCard} accessible accessibilityLabel={`${title}: ${subtitle}`}>
      <View style={styles.infoRow}>
        <View style={[styles.iconWrap, { backgroundColor: withOpacity('#64748b', 0.12) }]}>
          <Ionicons name={icon} size={18} color="#475569" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.infoTitle}>{title}</Text>
          <Text style={styles.infoSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </View>
  );
}

function SectionTitle({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {right ?? null}
    </View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{text}</Text>
    </View>
  );
}

function MiniBars({
  values,
  labels,
  max,
}: {
  values: number[];
  labels: string[];
  max: number;
}) {
  return (
    <View style={styles.barsWrap} accessible accessibilityLabel="Biểu đồ cột bước chân theo tuần">
      <View style={styles.barsRow}>
        {values.map((v, i) => {
          const h = Math.max(8, Math.round((v / max) * 120));
          return (
            <View key={i} style={styles.barItem}>
              <View style={[styles.bar, { height: h }]} />
              <Text style={styles.barLabel}>{labels[i]}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legendRow}>
        <LegendDot />
        <Text style={styles.legendText}>
          Trung bình: {Math.round(values.reduce((a, b) => a + b, 0) / values.length).toLocaleString('vi-VN')} bước/ngày
        </Text>
      </View>
    </View>
  );
}

function LegendDot() {
  return <View style={styles.legendDot} />;
}

function RecentMetric({
  icon,
  color,
  label,
  value,
  note,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <View style={styles.recentRow} accessible accessibilityLabel={`${label}: ${value}${note ? `, ${note}` : ''}`}>
      <View style={[styles.iconWrapLg, { backgroundColor: withOpacity(color, 0.12) }]}>
        <Ionicons name={icon} size={20} style={{ color }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.recentLabel}>{label}</Text>
        {note ? <Text style={styles.recentNote}>{note}</Text> : null}
      </View>
      <Text style={styles.recentValue}>{value}</Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.quickItem} onPress={onPress} accessibilityRole="button" accessibilityLabel={label}>
      <View style={styles.quickIconWrap}>
        <Ionicons name={icon} size={20} color="#0f172a" />
      </View>
      <Text style={styles.quickLabel} numberOfLines={1}>{label}</Text>
    </Pressable>
  );
}

/* =======================
 *   Helpers
 * ======================= */

function withOpacity(hex: string, opacity: number) {
  // hex -> rgba string (opacity: 0..1)
  const c = hex.replace('#', '');
  const bigint = parseInt(c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function getBmiHint(bmi: number) {
  if (bmi < 18.5) return 'Thiếu cân';
  if (bmi < 23) return 'Bình thường';
  if (bmi < 25) return 'Tiền béo phì';
  if (bmi < 30) return 'Béo phì độ I';
  return 'Béo phì độ II+';
}

/* =======================
 *   Styles
 * ======================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',

  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  subheading: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTitle: {
    marginTop: 10,
    fontSize: 13,
    color: '#475569',
  },
  valueRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  valueText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
  },
  unitText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 2,
  },
  infoCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  infoSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748b',
  },
  section: {
    marginTop: 10,
    marginBottom: 8,
    paddingHorizontal: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  tag: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  barsWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 140,
    paddingHorizontal: 6,
  },
  barItem: {
    alignItems: 'center',
    width: 28,
  },
  bar: {
    width: 18,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
  },
  barLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748b',
  },
  legendRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: '#3b82f6',
  },
  legendText: {
    fontSize: 12,
    color: '#475569',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    gap: 12,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconWrapLg: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  recentNote: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  recentValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickItem: {
    width: '23.5%',
    aspectRatio: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#0f172a',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  quickIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
});
