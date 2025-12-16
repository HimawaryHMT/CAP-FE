import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QuestionCardProps {
    question: string;
    onPress?: () => void;
}

export default function QuestionCard({ question, onPress }: QuestionCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>💬</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0F4F3',
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: 15,
        color: '#1a1a1a',
        fontWeight: '500',
        flex: 1,
        marginRight: 12,
        lineHeight: 22,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3F8F75',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 20,
    },
});