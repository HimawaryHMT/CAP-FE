import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HealthCheckCardProps {
    title: string;
    subtitle: string;
    duration: string;
    questions: string;
    icon: string;
    backgroundColor: string;
    onPress?: () => void;
}

export default function HealthCheckCard({
    title,
    subtitle,
    duration,
    questions,
    icon,
    backgroundColor,
    onPress
}: HealthCheckCardProps) {
    return (
        <TouchableOpacity style={[styles.container, { backgroundColor }]} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>{icon}</Text>
                </View>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
                <View style={styles.footer}>
                    <View style={styles.footerRow}>
                        <Text style={styles.infoIcon}>🕐</Text>
                        <Text style={styles.infoText}>{duration}</Text>
                    </View>
                    <View style={styles.footerRow}>
                        <Text style={styles.infoIcon}>❓</Text>
                        <Text style={styles.infoText}>{questions}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 24,
        padding: 18,
        minHeight: 240,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    icon: {
        fontSize: 36,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 6,
        lineHeight: 22,
        flex: 1,
    },
    subtitle: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 12,
        fontWeight: '500',
    },
    footer: {
        marginTop: 8,
        gap: 6,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    infoIcon: {
        fontSize: 12,
        marginRight: 6,
    },
    infoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
    },
});