// components/FeatureCard.tsx
import { MaterialCommunityIcons as MCI } from '@expo/vector-icons';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles/style';

interface FeatureCardProps {
  title: string;
  iconName: keyof typeof MCI.glyphMap;
  iconColor: string;
  value?: string;
  unit?: string;
  subtitle?: string;
  onPress?: () => void;
  styleCard?: any;
}

export default function FeatureCard({
  title,
  iconName,
  iconColor,
  value,
  unit,
  subtitle,
  onPress,
  styleCard,
}: FeatureCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.featureCard, styleCard]}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitleBold}>{title}</Text>
        <MCI name={iconName} size={76} color={iconColor} style={styles.tileIcon} />
      </View>

      <View style={styles.cardValueRow}>
        {value && <Text style={styles.cardValueLarge}>{value}</Text>}
        {unit && <Text style={styles.cardUnit}>{unit}</Text>}
      </View>

      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
}
