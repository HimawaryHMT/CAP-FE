import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface TipCardProps {
    title: string;
    icon: string;
    backgroundColor: string;
    onPress?: () => void;
}

// Gradient colors cho các tips
const getGradientColors = (bgColor: string): string[] => {
    const gradientMap: { [key: string]: string[] } = {
        '#fb923c': ['#f093fb', '#f5576c'],
        '#3b82f6': ['#4facfe', '#00f2fe'],
        '#10b981': ['#43e97b', '#38f9d7'],
        '#f59e0b': ['#fa709a', '#fee140'],
        '#22c55e': ['#30cfd0', '#330867'],
        '#8b5cf6': ['#667eea', '#764ba2'],
    };
    return gradientMap[bgColor] || [bgColor, bgColor];
};

export default function TipCard({
    title,
    icon,
    backgroundColor,
    onPress
}: TipCardProps) {
    const gradientColors = getGradientColors(backgroundColor);
    
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 160,
        height: 160,
        borderRadius: 24,
        padding: 18,
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    icon: {
        fontSize: 32,
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        lineHeight: 22,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
});