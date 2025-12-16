import ArticleCard from '@/components/component_LoiSong/ArticleCard';
import HealthCheckCard from '@/components/component_LoiSong/HealthCheckCard';
import RecipeCard from '@/components/component_LoiSong/RecipeCard';
import SectionHeader from '@/components/component_LoiSong/SectionHeader';
import TabBar from '@/components/component_LoiSong/TabBar';
import TipCard from '@/components/component_LoiSong/TipCard';
import VideoCard from '@/components/component_LoiSong/VideoCard';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const TABS = [
    { id: 'all', label: 'TẤT CẢ' },
    { id: 'sleep', label: 'Ngủ ngon hơn' },
    { id: 'health-check', label: 'Kiểm tra sức khỏe' },
    { id: 'articles', label: 'Bài viết' },
    { id: 'health-tips', label: 'Mẹo sức khỏe' },
    { id: 'recipes', label: 'Công thức nấu ăn' },
];

const SLEEP_VIDEOS = [
    { 
        id: '1', 
        title: 'Nhịp sinh học', 
        backgroundColor: '#4a5568',
        gradient: ['#667eea', '#764ba2'],
        emoji: '🌙'
    },
    { 
        id: '2', 
        title: 'Khoảnh khắc hoàn hảo', 
        backgroundColor: '#6b7280',
        gradient: ['#f093fb', '#f5576c'],
        emoji: '✨'
    },
    { 
        id: '3', 
        title: 'Âm thanh thư giãn', 
        backgroundColor: '#8b5a6f',
        gradient: ['#4facfe', '#00f2fe'],
        emoji: '🎵'
    },
    { 
        id: '4', 
        title: 'Thiền định', 
        backgroundColor: '#7c3aed',
        gradient: ['#43e97b', '#38f9d7'],
        emoji: '🧘'
    },
    { 
        id: '5', 
        title: 'Hơi thở sâu', 
        backgroundColor: '#059669',
        gradient: ['#fa709a', '#fee140'],
        emoji: '💨'
    },
    { 
        id: '6', 
        title: 'Thư giãn cơ bắp', 
        backgroundColor: '#dc2626',
        gradient: ['#30cfd0', '#330867'],
        emoji: '🌊'
    },
];

const HEALTH_CHECKS = [
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

const ARTICLES = [
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
        title: 'Tim mạch',
        subtitle: '15 Thông tin chi tiết',
        backgroundColor: '#ef4444',
        icon: '❤️',
    },
    {
        id: '4',
        title: 'Hô hấp',
        subtitle: '8 Thông tin chi tiết',
        backgroundColor: '#06b6d4',
        icon: '🫁',
    },
    {
        id: '5',
        title: 'Tiêu hóa',
        subtitle: '12 Thông tin chi tiết',
        backgroundColor: '#84cc16',
        icon: '🫀',
    },
    {
        id: '6',
        title: 'Tâm lý',
        subtitle: '20 Thông tin chi tiết',
        backgroundColor: '#8b5cf6',
        icon: '🧠',
    },
];

const HEALTH_TIPS = [
    { id: '1', title: 'Sức khỏe tim mạch', icon: '💛', backgroundColor: '#fb923c' },
    { id: '2', title: 'Giảm căng thẳng', icon: '🧘', backgroundColor: '#3b82f6' },
    { id: '3', title: 'Giấc ngủ ngon', icon: '😴', backgroundColor: '#10b981' },
    { id: '4', title: 'Tập thể dục', icon: '🏃', backgroundColor: '#f59e0b' },
    { id: '5', title: 'Dinh dưỡng', icon: '🥗', backgroundColor: '#22c55e' },
    { id: '6', title: 'Tâm lý', icon: '🧠', backgroundColor: '#8b5cf6' },
];

const RECIPES = [
    { id: '1', title: 'Bột yến mạch trái cây', imageEmoji: '🥣', backgroundColor: '#fef3c7' },
    { id: '2', title: 'Trứng nướng thơm ngon', imageEmoji: '🍳', backgroundColor: '#fed7aa' },
    { id: '3', title: 'Salad tươi mát', imageEmoji: '🥗', backgroundColor: '#d1fae5' },
    { id: '4', title: 'Smoothie xanh', imageEmoji: '🥤', backgroundColor: '#dcfce7' },
    { id: '5', title: 'Cá hồi nướng', imageEmoji: '🐟', backgroundColor: '#e0f2fe' },
    { id: '6', title: 'Cháo yến mạch', imageEmoji: '🍲', backgroundColor: '#fef7cd' },
];

export default function LifestyleScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('all');

    return (
        <SafeAreaView style={styles.safeArea} edges={[ 'bottom', 'left', 'right']}>
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                {/* Header với gradient đẹp */}
                <LinearGradient
                    colors={['#667eea', '#764ba2', '#f093fb']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <View style={styles.headerIconContainer}>
                            <Text style={styles.headerIcon}>🌿</Text>
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>Lối sống</Text>
                            <Text style={styles.headerSubtitle}>Sống khỏe, sống vui mỗi ngày</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Tab Bar */}
                <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {activeTab === 'sleep' ? (
                        // Tab Ngủ ngon hơn - hiển thị tất cả video
                        <View style={styles.tabContent}>
                            <Text style={styles.tabDescription}>
                                Khám phá các video giúp bạn có giấc ngủ ngon và sâu hơn
                            </Text>
                            <View style={styles.grid}>
                                {SLEEP_VIDEOS.map((video) => (
                                    <View key={video.id} style={styles.gridItem}>
                                        <VideoCard
                                            title={video.title}
                                            backgroundColor={video.backgroundColor}
                                            gradient={video.gradient}
                                            emoji={video.emoji}
                                            onPress={() => { }}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : activeTab === 'health-check' ? (
                        // Tab Kiểm tra sức khỏe - hiển thị tất cả health checks
                        <View style={styles.tabContent}>
                            <Text style={styles.tabDescription}>
                                Tự kiểm tra sức khỏe của bạn với các bài test nhanh chóng và chính xác
                            </Text>
                            <View style={styles.grid}>
                                {HEALTH_CHECKS.map((check) => (
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
                        </View>
                    ) : activeTab === 'articles' ? (
                        // Tab Bài viết - hiển thị tất cả articles
                        <View style={styles.tabContent}>
                            <Text style={styles.tabDescription}>
                                Khám phá các bài viết hữu ích về sức khỏe và lối sống
                            </Text>
                            <View style={styles.articlesContainer}>
                                {ARTICLES.map((article) => (
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
                        </View>
                    ) : activeTab === 'health-tips' ? (
                        // Tab Mẹo sức khỏe - hiển thị tất cả health tips
                        <View style={styles.tabContent}>
                            <Text style={styles.tabDescription}>
                                Các mẹo sức khỏe hữu ích để bạn có cuộc sống khỏe mạnh hơn
                            </Text>
                            <View style={styles.grid}>
                                {HEALTH_TIPS.map((tip) => (
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
                        </View>
                    ) : activeTab === 'recipes' ? (
                        // Tab Công thức nấu ăn - hiển thị tất cả recipes
                        <View style={styles.tabContent}>
                            <Text style={styles.tabDescription}>
                                Các công thức nấu ăn ngon và bổ dưỡng cho sức khỏe
                            </Text>
                            <View style={styles.grid}>
                                {RECIPES.map((recipe) => (
                                    <View key={recipe.id} style={styles.gridItem}>
                                        <RecipeCard
                                            title={recipe.title}
                                            imageEmoji={recipe.imageEmoji}
                                            backgroundColor={recipe.backgroundColor}
                                            onPress={() => { }}
                                        />
                                    </View>
                                ))}
                            </View>
                        </View>
                    ) : (
                        // Tab TẤT CẢ - hiển thị tất cả sections
                        <>
                            {/* Ngủ ngon hơn Section */}
                            <View style={styles.section}>
                                <SectionHeader title="Ngủ ngon hơn" //  onSeeAllPress={() => router.push("/../components/component_LoiSong/ScreenComponents/ScreenSleepVideo")} 
                                />
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalScrollContent}
                                >
                                    {SLEEP_VIDEOS.map((video) => (
                                        <View key={video.id} style={styles.cardWrapper}>
                                            <VideoCard
                                                title={video.title}
                                                backgroundColor={video.backgroundColor}
                                                gradient={video.gradient}
                                                emoji={video.emoji}
                                                onPress={() => { }}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Kiểm tra sức khỏe Section */}
                            <View style={styles.section}>
                                <SectionHeader title="Kiểm tra sức khỏe" // onSeeAllPress={() => router.push('/../components/component_LoiSong/ScreenComponents/ScreenHealthChecks')} 
                                  />
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalScrollContent}
                                >
                                    {HEALTH_CHECKS.map((check) => (
                                        <View key={check.id} style={styles.cardWrapper}>
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
                                </ScrollView>
                            </View>

                            {/* Bài viết Section */}
                            <View style={styles.section}>
                                <SectionHeader title="Bài viết" // onSeeAllPress={() => router.push('/lifestyle/articles')} 
                                  />
                                <View style={styles.articlesContainer}>
                                    {ARTICLES.map((article) => (
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
                            </View>

                            {/* Mẹo Sức khỏe Section */}
                            <View style={styles.section}>
                                <SectionHeader title="Mẹo Sức khỏe" // onSeeAllPress={() => router.push('/lifestyle/health-tips')} 
                                  />
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalScrollContent}
                                >
                                    {HEALTH_TIPS.map((tip) => (
                                        <View key={tip.id} style={styles.cardWrapper}>
                                            <TipCard
                                                title={tip.title}
                                                icon={tip.icon}
                                                backgroundColor={tip.backgroundColor}
                                                onPress={() => { }}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Công thức nấu ăn Section */}
                            <View style={styles.section}>
                                <SectionHeader title="Công thức nấu ăn" // onSeeAllPress={() => router.push('/lifestyle/recipes')} 
                                  />
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.horizontalScrollContent}
                                >
                                    {RECIPES.map((recipe) => (
                                        <View key={recipe.id} style={styles.cardWrapper}>
                                            <RecipeCard
                                                title={recipe.title}
                                                imageEmoji={recipe.imageEmoji}
                                                backgroundColor={recipe.backgroundColor}
                                                onPress={() => { }}
                                            />
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </>
                    )}

                    {/* Bottom Spacing */}
                    <View style={styles.bottomSpacing} />
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // nền tổng thể sáng nhẹ
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  headerIcon: {
    fontSize: 32,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },

  // Header (chưa dùng, giữ nguyên)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginLeft: 8,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 40,
  },

  // Section blocks (mỗi phần có nền gradient nhẹ, bo góc và đổ bóng)
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 22,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#667eea',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },

  horizontalScrollContent: {
    paddingRight: 20,
    paddingVertical: 6,
  },
  cardWrapper: {
    marginRight: 14,
  },

  // Article cards trong section
  articlesContainer: {
    gap: 12,
  },

  bottomSpacing: {
    height: 50,
  },

  // Tab content
  tabContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabDescription: {
    fontSize: 15,
    color: '#64748b',
    marginBottom: 20,
    lineHeight: 24,
    fontWeight: '500',
    paddingHorizontal: 4,
  },

  // Grid 2 cột
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
