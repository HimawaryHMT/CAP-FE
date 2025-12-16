import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HealthCheckCard from '../HealthCheckCard';

const ALL_HEALTH_CHECKS = [
    {
        id: '1',
        title: 'Tự đánh giá sức khỏe tim mạch',
        subtitle: 'Tim mạch',
        duration: '2 Min',
        questions: '6 Câu hỏi',
        icon: '❤️',
        backgroundColor: '#bfdbfe',
    },
    {
        id: '2',
        title: 'Tự kiểm tra chứng loạn nhịp tim',
        subtitle: 'Nhịp tim',
        duration: '3 Min',
        questions: '9 Câu hỏi',
        icon: '📊',
        backgroundColor: '#c7d2fe',
    },
    {
        id: '3',
        title: 'Tự kiểm tra huyết áp tim mạch',
        subtitle: 'Huyết áp',
        duration: '3 Min',
        questions: '8 Câu hỏi',
        icon: '🩺',
        backgroundColor: '#ddd6fe',
    },
    {
        id: '4',
        title: 'Đánh giá nguy cơ tiểu đường',
        subtitle: 'Đường huyết',
        duration: '4 Min',
        questions: '10 Câu hỏi',
        icon: '💉',
        backgroundColor: '#fce7f3',
    },
    {
        id: '5',
        title: 'Kiểm tra sức khỏe gan',
        subtitle: 'Gan',
        duration: '5 Min',
        questions: '12 Câu hỏi',
        icon: '🫁',
        backgroundColor: '#fed7aa',
    },
    {
        id: '6',
        title: 'Đánh giá stress và lo âu',
        subtitle: 'Tâm lý',
        duration: '3 Min',
        questions: '7 Câu hỏi',
        icon: '🧠',
        backgroundColor: '#d1fae5',
    },
];

export default function HealthChecksScreen() {
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
                    <Text style={styles.headerTitle}>Kiểm tra sức khỏe</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.description}>
                        Tự kiểm tra sức khỏe của bạn với các bài test nhanh chóng và chính xác
                    </Text>

                    <View style={styles.grid}>
                        {ALL_HEALTH_CHECKS.map((check) => (
                            <View key={check.id} style={styles.gridItem}>
                                <HealthCheckCard
                                    title={check.title}
                                    subtitle={check.subtitle}
                                    duration={check.duration}
                                    questions={check.questions}
                                    icon={check.icon}
                                    backgroundColor={check.backgroundColor}
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
        backgroundColor: '#f8f9fa',
    },
    backIcon: {
        fontSize: 24,
        color: '#1a1a1a',
        fontWeight: '600',
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
        fontSize: 16,
        color: '#6b7280',
        marginBottom: 28,
        lineHeight: 24,
        textAlign: 'center',
        paddingHorizontal: 8,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    gridItem: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: 16,
    },
});