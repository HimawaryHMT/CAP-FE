
import ChatBubble from '@/components/components_doctorAI/chatBubble';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Stack } from "expo-router";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chatWithDoctorAI } from '@/services/doctorAIApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
    timestamp?: string;
    senderName?: string;
}

export default function ChatScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const scrollViewRef = useRef<ScrollView>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Xin chào! Tôi là Bác sĩ AI. Tôi có thể giúp bạn tư vấn về các vấn đề sức khỏe thường gặp. Hãy mô tả triệu chứng hoặc câu hỏi của bạn nhé!',
            isUser: false,
            senderName: 'Bác sĩ AI',
            timestamp: new Date().toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(',', '')
        }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (params.question && typeof params.question === 'string') {
            setInputText(params.question);
        }
    }, [params.question]);

    const handleSend = async () => {
        if (!inputText.trim() || isLoading) return;

        const questionText = inputText.trim();
        
        // Thêm câu hỏi của user vào chat
        const userMessage: Message = {
            id: Date.now().toString(),
            text: questionText,
            isUser: true,
        };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Lấy user_id từ AsyncStorage (nếu có)
            // Có thể decode từ token hoặc lưu riêng khi login
            const userData = await AsyncStorage.getItem('userData');
            let user_id: number | undefined;
            let elderly_id: number | undefined;
            
            if (userData) {
                try {
                    const parsed = JSON.parse(userData);
                    user_id = parsed.user_id;
                    elderly_id = parsed.elderly_id;
                } catch (e) {
                    console.log('Không thể parse userData');
                }
            }

            // Gọi API Doctor AI
            const response = await chatWithDoctorAI(questionText, user_id, elderly_id);

            if (response.success && response.data) {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: response.data.answer,
                    isUser: false,
                    senderName: 'Bác sĩ AI',
                    timestamp: new Date().toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    }).replace(',', '')
                };
                setMessages(prev => [...prev, aiResponse]);
            } else {
                throw new Error('Không nhận được phản hồi từ server');
            }
        } catch (error: any) {
            console.error('Lỗi khi gọi API Doctor AI:', error);
            
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại sau hoặc kiểm tra kết nối mạng.',
                isUser: false,
                senderName: 'Bác sĩ AI',
                timestamp: new Date().toLocaleString('vi-VN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }).replace(',', '')
            };
            setMessages(prev => [...prev, errorMessage]);
            
            Alert.alert(
                'Lỗi',
                error.response?.data?.message || 'Không thể kết nối đến server. Vui lòng thử lại.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']} >
            <StatusBar barStyle="dark-content" />
            <Stack.Screen options={{ title: "Trò chuyện" }} />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >

                {/* Messages */}
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                >
                    {messages.map((message) => (
                        <ChatBubble
                            key={message.id}
                            message={message.text}
                            isUser={message.isUser}
                            senderName={message.senderName}
                            timestamp={message.timestamp}
                        />
                    ))}
                </ScrollView>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity style={styles.inputIconButton}>
                            <Text style={styles.inputIcon}>⊞</Text>
                        </TouchableOpacity>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Ví dụ: Tôi bị đau đầu, phải làm sao?"
                            placeholderTextColor="#999"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                            editable={!isLoading}
                        />

                        <TouchableOpacity
                            style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
                            onPress={handleSend}
                            disabled={!inputText.trim() || isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.sendIcon}>➤</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.toolbarContainer}>
                        <TouchableOpacity style={styles.toolbarButton}>
                            <Text style={styles.toolbarIcon}>⊞⊞</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolbarButton}>
                            <Text style={styles.toolbarIcon}>🖼</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolbarButton}>
                            <Text style={styles.toolbarIcon}>GIF</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolbarButton}>
                            <Text style={styles.toolbarIcon}>📄</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolbarButton}>
                            <Text style={styles.toolbarIcon}>⚙️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolbarButton}>
                            <Text style={styles.toolbarIcon}>🎨</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.toolbarButton}>
                            <Text style={styles.toolbarIcon}>🎤</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        includeFontPadding: false,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        flexShrink: 0,
    },
    creditBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E8F5E9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#3F8F75',
        marginRight: 8,
    },
    creditIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    creditText: {
        fontSize: 12,
        color: '#3F8F75',
        fontWeight: '700',
    },
    menuButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 24,
        color: '#1a1a1a',
    },
    messagesContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 8,
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? 0 : 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    inputIconButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    inputIcon: {
        fontSize: 22,
        color: '#666',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#1a1a1a',
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3F8F75',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendIcon: {
        fontSize: 18,
        color: '#fff',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
        opacity: 0.6,
    },
    toolbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    toolbarButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolbarIcon: {
        fontSize: 20,
        color: '#666',
    },
});