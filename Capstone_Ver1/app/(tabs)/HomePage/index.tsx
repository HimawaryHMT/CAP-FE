import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../../assets/styles/style';
import { ComponentDevice } from '../../../components/componentHomePage/componentDevice';
import FeatureCard from '../../../components/componentHomePage/componentFeatureCard';


export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      
      <StatusBar barStyle="dark-content" backgroundColor="#da9191ff" />

      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thiết bị</Text>
        <View style={styles.weatherContainer}>
          <Ionicons name="cloud-outline" size={16} color="#ffffff" />
          <Text style={styles.weatherText}>26°C</Text>
        </View>
      </View>

      {/* Device camera card */}
      <ComponentDevice />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Nhật ký sức khỏe</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Feature tiles grid */}
        <View style={styles.cardsGrid}>
          {/* Blood Pressure Card */}
          <FeatureCard
            title="Huyết áp"
            iconName="heart-pulse"
            iconColor="#3b82f6"
            value="100/75"
            unit="mmHg"
            styleCard={styles.tileBlue}
            onPress={() => router.push('../../(modals)/HuyetAp')}
          />

          {/* Blood Sugar Card */}
          <FeatureCard
            title="Đường huyết"
            iconName="diabetes"
            iconColor="#ef4444"
            value="--"
            unit="mmol/L"
            styleCard={styles.tilePink}
            onPress={() => router.push('../../(modals)/DuongHuyet')}
          />


          {/* Weight & BMI Card */}
          <FeatureCard
            title="Cân nặng & chỉ số BMI"
            iconName="scale-bathroom"
            iconColor="#8b5cf6"
            value="--"
            unit="KG"
            styleCard={styles.tileIndigo}
            onPress={() => router.push('../../(modals)/CanNangVaBMI')}
          />

          {/* Water Reminder Card */}
          <FeatureCard
            title="Nhắc nhở uống nước"
            iconName="cup-water"
            iconColor="#06b6d4"
            value="0"
            unit="/2000ml"
            styleCard={styles.tileCyan}
            onPress={() => router.push('../../(modals)/NhacNhoUongNuoc')}         />

          {/* AI Doctor Card */}
          <FeatureCard
            title="Bác sĩ AI"
            iconName="robot-happy"
            iconColor="#10b981"
            subtitle="Tư vấn sức khỏe"
            styleCard={styles.tileTeal}
            onPress={() => router.push('../../(modals)/BacSiAI')}
          />


        </View>
      </ScrollView>

      {/* Bottom Navigation is handled by Tabs */}
    </SafeAreaView>
  );
}

