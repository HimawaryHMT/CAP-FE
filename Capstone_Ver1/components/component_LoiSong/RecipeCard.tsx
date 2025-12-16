import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface RecipeCardProps {
    title: string;
    imageEmoji: string;
    backgroundColor?: string;
    onPress?: () => void;
}

// Gradient colors cho các recipes
const getRecipeGradient = (bgColor: string): string[] => {
    const gradientMap: { [key: string]: string[] } = {
        '#fef3c7': ['#fef3c7', '#fde68a'],
        '#fed7aa': ['#fed7aa', '#fdba74'],
        '#d1fae5': ['#d1fae5', '#a7f3d0'],
        '#dcfce7': ['#dcfce7', '#bbf7d0'],
        '#e0f2fe': ['#e0f2fe', '#bae6fd'],
        '#fef7cd': ['#fef7cd', '#fef08a'],
    };
    return gradientMap[bgColor] || [bgColor, bgColor];
};

export default function RecipeCard({
    title,
    imageEmoji,
    backgroundColor = '#f3f4f6',
    onPress
}: RecipeCardProps) {
    const gradientColors = getRecipeGradient(backgroundColor);
    
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.imageContainer}
            >
                <View style={styles.emojiWrapper}>
                    <Text style={styles.imageEmoji}>{imageEmoji}</Text>
                </View>
            </LinearGradient>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 140,
    },
    imageContainer: {
        width: 140,
        height: 140,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    emojiWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    imageEmoji: {
        fontSize: 56,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        lineHeight: 18,
    },
});