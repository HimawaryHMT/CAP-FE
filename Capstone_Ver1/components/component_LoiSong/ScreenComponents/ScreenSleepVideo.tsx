import VideoCard from '../VideoCard';
import { useRouter } from 'expo-router';
import React from 'react';
import {ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ALL_SLEEP_VIDEOS = [
    { id: '1', title: 'Nhịp sinh học', backgroundColor: '#4a5568' },
    { id: '2', title: 'Khoảnh khắc hoàn hảo', backgroundColor: '#6b7280' },
    { id: '3', title: 'Âm thanh thư giãn', backgroundColor: '#8b5a6f' },
    { id: '4', title: 'Thiền định trước khi ngủ', backgroundColor: '#5b7c99' },
    { id: '5', title: 'Nhạc du dương', backgroundColor: '#7c6a8e' },
    { id: '6', title: 'Giảm stress hiệu quả', backgroundColor: '#6a8e7c' },
    { id: '7', title: 'Hơi thở sâu', backgroundColor: '#8e7c6a' },
    { id: '8', title: 'Yoga tối', backgroundColor: '#6a7c8e' },
];

export default function SleepVideosScreen() {
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
                    <Text style={styles.headerTitle}>Ngủ ngon hơn</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.description}>
                        Khám phá các video giúp bạn có giấc ngủ ngon và sâu hơn
                    </Text>

                    <View style={styles.grid}>
                        {ALL_SLEEP_VIDEOS.map((video) => (
                            <View key={video.id} style={styles.gridItem}>
                                <VideoCard
                                    title={video.title}
                                    backgroundColor={video.backgroundColor}
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
        marginBottom: 20,
    },
});
