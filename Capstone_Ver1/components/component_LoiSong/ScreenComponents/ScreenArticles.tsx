import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArticleCard from '../ArticleCard';

const ALL_ARTICLES = [
    {
        id: '1',
        title: 'Huyết áp',
        subtitle: '27 Thông tin chi tiết',
        backgroundColor: '#3F8F75',
        icon: '🩺',
    },
    {
        id: '2',
        title: 'Đường huyết',
        subtitle: '11 Thông tin chi tiết',
        backgroundColor: '#fb923c',
        icon: '💉',
    },
    {
        id: '3',
        title: 'Cholesterol',
        subtitle: '15 Thông tin chi tiết',
        backgroundColor: '#3b82f6',
        icon: '🧬',
    },
    {
        id: '4',
        title: 'Tim mạch',
        subtitle: '22 Thông tin chi tiết',
        backgroundColor: '#ef4444',
        icon: '❤️',
    },
    {
        id: '5',
        title: 'Tiêu hóa',
        subtitle: '18 Thông tin chi tiết',
        backgroundColor: '#8b5cf6',
        icon: '🫁',
    },
    {
        id: '6',
        title: 'Cân nặng lý tưởng',
        subtitle: '12 Thông tin chi tiết',
        backgroundColor: '#10b981',
        icon: '⚖️',
    },
];

export default function ArticlesScreen() {
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
                    <Text style={styles.headerTitle}>Bài viết</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.description}>
                        Khám phá các bài viết về sức khỏe được chọn lọc kỹ càng
                    </Text>

                    <View style={styles.articlesContainer}>
                        {ALL_ARTICLES.map((article) => (
                            <ArticleCard
                                key={article.id}
                                title={article.title}
                                subtitle={article.subtitle}
                                backgroundColor={article.backgroundColor}
                                icon={article.icon}
                                onPress={() => { }}
                            />
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
    articlesContainer: {
        gap: 0,
    },
});