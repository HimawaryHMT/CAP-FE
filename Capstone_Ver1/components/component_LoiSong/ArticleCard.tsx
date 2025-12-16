import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ArticleCardProps {
    title: string;
    subtitle: string;
    backgroundColor: string;
    icon: string;
    onPress?: () => void;
}

// Gradient colors cho các articles
const getArticleGradient = (bgColor: string): string[] => {
    const gradientMap: { [key: string]: string[] } = {
        '#3F8F75': ['#3F8F75', '#2e7d6b'],
        '#fb923c': ['#fb923c', '#f97316'],
        '#ef4444': ['#ef4444', '#dc2626'],
        '#06b6d4': ['#06b6d4', '#0891b2'],
        '#84cc16': ['#84cc16', '#65a30d'],
        '#8b5cf6': ['#8b5cf6', '#7c3aed'],
    };
    return gradientMap[bgColor] || [bgColor, bgColor];
};

export default function ArticleCard({
    title,
    subtitle,
    backgroundColor,
    icon,
    onPress
}: ArticleCardProps) {
    const gradientColors = getArticleGradient(backgroundColor);
    
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        padding: 22,
        marginBottom: 14,
        minHeight: 110,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    content: {
        flex: 1,
        paddingRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 8,
        lineHeight: 26,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.95)',
        fontWeight: '600',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 3,
    },
    icon: {
        fontSize: 40,
    },
    checkmark: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmarkIcon: {
        fontSize: 16,
        fontWeight: '700',
        color: '#22c55e',
    },
});