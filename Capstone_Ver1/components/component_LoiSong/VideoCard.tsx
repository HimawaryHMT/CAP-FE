import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface VideoCardProps {
    title: string;
    imageUrl?: string;
    backgroundColor?: string;
    gradient?: string[];
    emoji?: string;
    onPress?: () => void;
}

export default function VideoCard({
    title,
    imageUrl,
    backgroundColor = '#e5e7eb',
    gradient,
    emoji,
    onPress
}: VideoCardProps) {
    const CardContent = gradient ? (
        <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.imageContainer}
        >
            <View style={styles.overlay}>
                {emoji && (
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>{emoji}</Text>
                    </View>
                )}
                <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                </View>
            </View>
        </LinearGradient>
    ) : (
        <View style={[styles.imageContainer, { backgroundColor }]}>
            <View style={styles.overlay}>
                {emoji && (
                    <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>{emoji}</Text>
                    </View>
                )}
                <View style={styles.playButton}>
                    <Text style={styles.playIcon}>▶</Text>
                </View>
            </View>
        </View>
    );

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            {CardContent}
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 160,
    },
    imageContainer: {
        width: 160,
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 8,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    emojiContainer: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    emoji: {
        fontSize: 24,
    },
    playButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.98)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.8)',
    },
    playIcon: {
        fontSize: 20,
        color: '#1a1a1a',
        marginLeft: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 18,
    },
});