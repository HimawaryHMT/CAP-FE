import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Tab {
    id: string;
    label: string;
}

interface TabBarProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTab;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => onTabChange(tab.id)}
                            activeOpacity={0.7}
                        >
                            {isActive ? (
                                <LinearGradient
                                    colors={['#667eea', '#764ba2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.tab, styles.activeTab]}
                                >
                                    <Text style={[styles.tabText, styles.activeTabText]}>
                                        {tab.label}
                                    </Text>
                                </LinearGradient>
                            ) : (
                                <View style={styles.tab}>
                                    <Text style={styles.tabText}>
                                        {tab.label}
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 6,
    },
    tab: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
        marginRight: 8,
        minWidth: 85,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    activeTab: {
        borderWidth: 0,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        textAlign: 'center',
    },
    activeTabText: {
        color: '#fff',
        fontWeight: '800',
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});