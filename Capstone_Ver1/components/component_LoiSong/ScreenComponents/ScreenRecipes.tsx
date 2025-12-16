import RecipeCard from '../RecipeCard'
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const ALL_RECIPES  = [
    { id: '1', title: 'Bột yến mạch trái cây', imageEmoji: '🥣', backgroundColor: '#fef3c7' },
    { id: '2', title: 'Trứng nướng thơm ngon', imageEmoji: '🍳', backgroundColor: '#fed7aa' },
    { id: '3', title: 'Salad tươi mát', imageEmoji: '🥗', backgroundColor: '#d1fae5' },
    { id: '4', title: 'Sinh tố xanh', imageEmoji: '🥤', backgroundColor: '#bbf7d0' },
    { id: '5', title: 'Cá hồi nướng', imageEmoji: '🐟', backgroundColor: '#fecaca' },
    { id: '6', title: 'Gà nướng mật ong', imageEmoji: '🍗', backgroundColor: '#fed7aa' },
    { id: '7', title: 'Súp rau củ', imageEmoji: '🥘', backgroundColor: '#fde68a' },
    { id: '8', title: 'Ức gà salad', imageEmoji: '🥙', backgroundColor: '#d9f99d' },
    { id: '9', title: 'Cơm gạo lứt', imageEmoji: '🍚', backgroundColor: '#ddd6fe' },
    { id: '10', title: 'Bánh mì ngũ cốc', imageEmoji: '🍞', backgroundColor: '#fecdd3' },
];

export default function RecipesScreen() {
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
                    <Text style={styles.headerTitle}>Công thức nấu ăn</Text>
                    <View style={styles.headerRight} />
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <Text style={styles.description}>
                        Khám phá các công thức nấu ăn lành mạnh và ngon miệng
                    </Text>

                    <View style={styles.grid}>
                        {ALL_RECIPES.map((recipe) => (
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