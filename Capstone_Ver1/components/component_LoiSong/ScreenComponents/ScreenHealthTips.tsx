import { SafeAreaView } from 'react-native-safe-area-context';
import TipCard from '../TipCard'
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ALL_HEALTH_TIPS = [
    { id: '1', title: 'Sức khỏe tim mạch', icon: '💛', backgroundColor: '#fb923c' },
    { id: '2', title: 'Giảm căng thẳng', icon: '🧘', backgroundColor: '#3b82f6' },
    { id: '3', title: 'Giấc ngủ ngon', icon: '😴', backgroundColor: '#10b981' },
    { id: '4', title: 'Uống đủ nước', icon: '💧', backgroundColor: '#06b6d4' },
    { id: '5', title: 'Tập thể dục', icon: '🏃', backgroundColor: '#f59e0b' },
    { id: '6', title: 'Ăn nhiều rau xanh', icon: '🥬', backgroundColor: '#22c55e' },
    { id: '7', title: 'Hạn chế đường', icon: '🚫', backgroundColor: '#ef4444' },
    { id: '8', title: 'Thư giãn tinh thần', icon: '🌸', backgroundColor: '#ec4899' },
    { id: '9', title: 'Chăm sóc da', icon: '✨', backgroundColor: '#8b5cf6' },
    { id: '10', title: 'Vitamin C', icon: '🍊', backgroundColor: '#f97316' },
];

export default function HealthTipsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Mẹo Sức khỏe</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.description}>
                        Những mẹo nhỏ giúp cải thiện sức khỏe mỗi ngày
                    </Text>

                    <View style={styles.grid}>
                        {ALL_HEALTH_TIPS.map((tip) => (
                            <View key={tip.id} style={styles.gridItem}>
                                <TipCard
                                    title={tip.title}
                                    icon={tip.icon}
                                    backgroundColor={tip.backgroundColor}
                                    onPress={() => { }}
                                />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#1a1a1a',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        flex: 1,
        marginLeft: 8,
    },
    headerRight: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    description: {
        fontSize: 15,
        color: '#6b7280',
        marginBottom: 24,
        lineHeight: 22,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -6,
    },
    gridItem: {
        width: '50%',
        paddingHorizontal: 6,
        marginBottom: 16,
    },
});
