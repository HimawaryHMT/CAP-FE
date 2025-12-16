import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SectionHeaderProps {
    title: string;
    showSeeAll?: boolean;
    onSeeAllPress?: () => void;
}

export default function SectionHeader({ title, showSeeAll = true, onSeeAllPress }: SectionHeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {showSeeAll && (
                <TouchableOpacity onPress={onSeeAllPress} style={styles.seeAllButton} activeOpacity={0.7}>
                    <Text style={styles.seeAllText}>Xem thêm</Text>
                    <Text style={styles.seeAllArrow}> ›</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: 0.3,
    },
    seeAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(102, 126, 234, 0.2)',
    },
    seeAllText: {
        fontSize: 13,
        color: '#667eea',
        fontWeight: '700',
    },
    seeAllArrow: {
        fontSize: 16,
        color: '#667eea',
        fontWeight: '800',
        marginLeft: 2,
    },
});