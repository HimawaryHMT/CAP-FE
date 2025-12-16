import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterPendingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Thông báo' }} />

      <View style={styles.content}>
        <Text style={styles.title}>Đăng ký thành công!</Text>
        <Text style={styles.message}>
          Yêu cầu của bạn đã được gửi và đang chờ xét duyệt. 
          Vui lòng quay lại sau hoặc kiểm tra thông báo trong Email.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('../Auth/Login')}
        >
          <Text style={styles.buttonText}>Quay về đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
