import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DoctorSpecialtyCardProps {
    name: string;
    specialty: string;
    icon: string;
    avatar: any;
    onPress?: () => void;
}

export default function DoctorSpecialtyCard({
    name,
    specialty,
    icon,
    avatar,
    onPress
}: DoctorSpecialtyCardProps) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarEmoji}>{avatar}</Text>
                </View>
                <View style={styles.iconBadge}>
                    <Text style={styles.iconEmoji}>{icon}</Text>
                </View>
            </View>
            <Text style={styles.name}>{name}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginRight: 16,
        width: 100,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 8,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1E7DD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: {
        fontSize: 40,
    },
    iconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3F8F75',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    iconEmoji: {
        fontSize: 16,
    },
    name: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a1a1a',
        textAlign: 'center',
        lineHeight: 16,
    },
});