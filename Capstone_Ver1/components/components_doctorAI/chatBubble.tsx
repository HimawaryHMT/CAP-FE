import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChatBubbleProps {
    message: string;
    isUser?: boolean;
    senderName?: string;
    timestamp?: string;
}

export default function ChatBubble({
    message,
    isUser = false,
    senderName = '',
    timestamp = ''
}: ChatBubbleProps) {
    return (
        <View style={styles.container}>
            {!isUser && senderName && (
                <View style={styles.senderHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>👩‍⚕️</Text>
                    </View>
                    <Text style={styles.senderName}>{senderName}</Text>
                </View>
            )}
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.doctorBubble]}>
                <Text style={[styles.messageText, isUser ? styles.userText : styles.doctorText]}>
                    {message}
                </Text>
            </View>
            {!isUser && timestamp && (
                <View style={styles.timestampContainer}>
                    <View style={styles.actionButtons}>
                        <View style={styles.actionButton}>
                            <Text style={styles.actionIcon}>📋</Text>
                        </View>
                        <View style={styles.actionButton}>
                            <Text style={styles.actionIcon}>↗️</Text>
                        </View>
                    </View>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    senderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 4,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarText: {
        fontSize: 14,
    },
    senderName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    bubble: {
        borderRadius: 16,
        padding: 16,
        maxWidth: '85%',
    },
    doctorBubble: {
        backgroundColor: '#E8F5E9',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#3F8F75',
        alignSelf: 'flex-end',
        borderTopRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    doctorText: {
        color: '#1a1a1a',
    },
    userText: {
        color: '#fff',
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginLeft: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        marginRight: 12,
    },
    actionButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    actionIcon: {
        fontSize: 12,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
});