import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AskDoctorBannerProps {
    onPress?: () => void;
}

export default function AskDoctorBanner({ onPress }: AskDoctorBannerProps) {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Bạn có câu hỏi nào cho bác sĩ?</Text>
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonIcon}>💬</Text>
                    <Text style={styles.buttonText}>Hỏi câu hỏi</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.doctorImageContainer}>
                <Text style={styles.doctorEmoji}>👩‍⚕️</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3F8F75',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 200,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        paddingRight: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        lineHeight: 28,
    },
    button: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
    },
    buttonIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3F8F75',
    },
    doctorImageContainer: {
        width: 140,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doctorEmoji: {
        fontSize: 120,
    },
});