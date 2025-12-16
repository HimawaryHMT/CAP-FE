import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoSurface from './VideoSurface';
import { Stack } from 'expo-router';
import { BASE_URL } from '@/config';

const { height, width } = Dimensions.get('window');

const STREAM_URL = `${BASE_URL}/hls/cam1/index.m3u8`;
const DEMO_HLS = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

export default function CameraHome() {
  const router = useRouter();

  const [streamUrl, setStreamUrl] = useState<string>(STREAM_URL);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);

  // animated scale cho fullscreen
  const fullscreenScale = useRef(new Animated.Value(0.9)).current;

  const connected = useMemo(() => !!streamUrl, [streamUrl]);

  const now = new Date();
  const formatted = now.toLocaleString();

  const handleUseDemo = () => {
    setIsReady(false);
    setHasError(false);
    setStreamUrl(DEMO_HLS);
    Alert.alert('Đã dùng link demo', 'Bạn đang xem stream demo HLS.');
  };

  const handleReconnect = () => {
    setIsReady(false);
    // Force re-render bằng cách thêm timestamp vào URL
    const separator = streamUrl.includes('?') ? '&' : '?';
    setStreamUrl(`${streamUrl}${separator}_t=${Date.now()}`);
    setTimeout(() => {
      // Reset về URL gốc sau khi đã trigger reload
      const baseUrl = streamUrl.split('?')[0].split('&')[0];
      setStreamUrl(baseUrl);
    }, 100);
  };

  const handleError = (e: unknown) => {
    console.error('Video error: ', e);
    setIsReady(false);
    setHasError(true);
    
    // Kiểm tra loại lỗi
    const errorMessage = e instanceof Error ? e.message : String(e);
    console.log('Error message:', errorMessage);
    console.log('Stream URL:', streamUrl);
    
    if (errorMessage.includes('network') || errorMessage.includes('timeout') || errorMessage.includes('ECONNREFUSED')) {
      Alert.alert(
        'Lỗi kết nối',
        `Không thể kết nối đến camera.\n\nURL: ${streamUrl}\n\nVui lòng kiểm tra:\n• Backend đã chạy chưa?\n• Địa chỉ IP có đúng không?\n• Firewall có chặn không?`,
        [
          { text: 'Thử lại', onPress: () => { setHasError(false); handleReconnect(); } },
          { text: 'Dùng Demo', onPress: () => { setHasError(false); handleUseDemo(); } },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } else if (errorMessage.includes('format') || errorMessage.includes('codec') || errorMessage.includes('not supported')) {
      Alert.alert(
        'Lỗi định dạng',
        'Video stream không được hỗ trợ. Vui lòng kiểm tra định dạng HLS.',
        [
          { text: 'Dùng Demo', onPress: () => { setHasError(false); handleUseDemo(); } },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } else {
      Alert.alert(
        'Lỗi phát video',
        `Không phát được stream.\n\nLỗi: ${errorMessage}\n\nURL: ${streamUrl}\n\nVui lòng thử:\n• Kiểm tra lại link HLS\n• Dùng video demo để test`,
        [
          { text: 'Dùng Demo', onPress: () => { setHasError(false); handleUseDemo(); } },
          { text: 'Thử lại', onPress: () => { setHasError(false); handleReconnect(); } },
          { text: 'OK', style: 'cancel' }
        ]
      );
    }
  };

  const handleVideoReady = () => {
    setIsReady(true);
    setHasError(false);
    console.log('✅ Video ready:', streamUrl);
  };

  const openFullscreen = () => {
    if (!connected || !isReady) return;
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    Animated.timing(fullscreenScale, {
      toValue: 0.9,
      duration: 160,
      useNativeDriver: true,
    }).start(() => {
      setIsFullscreen(false);
    });
  };

  // Khi isFullscreen = true thì chạy animation zoom-in
  useEffect(() => {
    if (isFullscreen) {
      fullscreenScale.setValue(0.9);
      Animated.timing(fullscreenScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isFullscreen, fullscreenScale]);

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: '#fff' },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>
          ),
          headerTitle: () => (
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>Camera</Text>
              <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                {connected ? 'Live' : 'Chưa kết nối'}
              </Text>
            </View>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/(modals)/ScreenCamera/settingCamera')}
              style={{ paddingHorizontal: 8 }}
            >
              <Ionicons name="settings-outline" size={22} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* VIDEO CARD */}
        <View style={styles.card}>
          <View style={styles.videoWrap}>
            {connected ? (
              <>
                <VideoSurface
                  key={streamUrl} // Force re-render khi URL thay đổi
                  uri={streamUrl}
                  onReady={handleVideoReady}
                  onError={handleError}
                  style={styles.video}
                  autoPlay
                  loop
                  useNativeControls={false}
                />

                {/* Loading overlay */}
                {!isReady && !hasError && (
                  <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Đang kết nối tới camera…</Text>
                    <Text style={styles.loadingSubtext}>{streamUrl}</Text>
                  </View>
                )}

                {/* Error overlay */}
                {hasError && (
                  <View style={styles.errorOverlay}>
                    <Ionicons name="alert-circle" size={48} color="#ff4444" />
                    <Text style={styles.errorText}>Không thể phát video</Text>
                    <Text style={styles.errorSubtext}>Nhấn "Demo" để thử video mẫu</Text>
                    <TouchableOpacity style={styles.errorButton} onPress={handleUseDemo}>
                      <Text style={styles.errorButtonText}>Dùng Video Demo</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* LIVE badge + timestamp */}
                <View style={styles.liveRow}>
                  <View style={styles.liveBadge}>
                    <Ionicons name="radio" size={12} color="#fff" />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                  <View style={styles.timeStampBox}>
                    <Text style={styles.timeStampText}>{formatted}</Text>
                  </View>
                </View>

                {/* Video Controls (overlay góc phải) */}
                <View style={styles.videoControls}>
                  <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="volume-high-outline" size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="videocam-outline" size={20} color="#fff" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="camera-outline" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.placeholderWrap}>
                <View style={styles.placeholderOverlay} />
                <View style={styles.placeholderContent}>
                  <Ionicons name="videocam-off-outline" size={42} color="#fff" />
                  <Text style={styles.placeholderTitle}>Chưa kết nối camera</Text>
                  <Text style={styles.placeholderSub}>
                    Nhấn “Demo” để thử video mẫu hoặc cấu hình link HLS trong phần cài đặt.
                  </Text>
                  <TouchableOpacity style={styles.primaryBtn} onPress={handleUseDemo}>
                    <Text style={styles.primaryBtnText}>Dùng Video Demo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Info Row */}
          <View style={styles.statsRow}>
            <Text style={styles.statItem}>
              {connected ? (isReady ? 'Đang phát' : 'Đang tải…') : 'Chưa kết nối'}
            </Text>
            <View style={styles.statsRight}>
              {connected && <View style={styles.statDot} />}
              {connected && <Text style={styles.statItem}>HLS</Text>}
            </View>
          </View>
        </View>

        {/* QUICK ACTION BUTTONS */}
        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="cloud" size={20} color="#000" />
            <Text style={styles.controlBtnText}>Cloud</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="card" size={20} color="#000" />
            <Text style={styles.controlBtnText}>Xem lại</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="notifications-off" size={20} color="#000" />
            <Text style={styles.controlBtnText}>Báo động</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="layers" size={20} color="#000" />
            <Text style={styles.controlBtnText}>Nhiều kênh</Text>
          </TouchableOpacity>
        </View>

        {/* BOTTOM ACTION */}
        <View style={styles.bottomActionButtons}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="grid" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtnSecondary} onPress={handleReconnect}>
            <Ionicons name="refresh" size={20} color="#666" />
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* FOOTER NAVIGATION */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={handleUseDemo}>
          <Ionicons name="play-circle-outline" size={24} color="#666" />
          <Text style={styles.navButtonText}>Demo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={handleReconnect}>
          <Ionicons name="refresh-outline" size={24} color="#666" />
          <Text style={styles.navButtonText}>Kết nối</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.navButton,
            (!connected || !isReady) && { opacity: 0.4 },
          ]}
          onPress={openFullscreen}
          disabled={!connected || !isReady}
        >
          <Ionicons name="expand-outline" size={24} color="#666" />
          <Text style={styles.navButtonText}>Fullscreen</Text>
        </TouchableOpacity>
      </View>

      {/* FULLSCREEN MODAL (Zoom-in) */}
      <Modal
        visible={isFullscreen}
        onRequestClose={closeFullscreen}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.fullscreenContainer}>
          <Animated.View style={[styles.fullscreenVideoBox, { transform: [{ scale: fullscreenScale }] }]}>
            <VideoSurface
              uri={streamUrl}
              onReady={() => {}}
              onError={handleError}
              style={styles.fullscreenVideo}
              autoPlay
              loop
              useNativeControls
            />

            {/* Close button */}
            <TouchableOpacity style={styles.fullscreenClose} onPress={closeFullscreen}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 }, // Thêm padding bottom để không bị che bởi bottom nav

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginBottom: 20,
    marginHorizontal: 4,
  },

  videoWrap: {
    height: height * 0.45, // Tăng kích thước video để cân đối hơn
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#101317',
  },

  video: { width: '100%', height: '100%' },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorSubtext: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 20,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // LIVE badge + time
  liveRow: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  liveBadge: {
    backgroundColor: 'rgba(231, 63, 63, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  liveText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  timeStampBox: {
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  timeStampText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Video controls
  videoControls: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 10,
  },

  controlButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Placeholder
  placeholderWrap: {
    width: '100%',
    height: '100%',
    backgroundColor: '#0c0f14',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },

  placeholderContent: {
    position: 'absolute',
    alignItems: 'center',
    paddingHorizontal: 24,
  },

  placeholderTitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 12,
    fontWeight: '700',
  },

  placeholderSub: {
    marginTop: 8,
    color: '#ddd',
    fontSize: 13,
    textAlign: 'center',
  },

  primaryBtn: {
    marginTop: 16,
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: '60%',
  },

  primaryBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  // Status row
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  statItem: { fontSize: 13, color: '#666', fontWeight: '500' },

  statsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#31C48D',
  },

  // Top control buttons
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  controlBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },

  controlBtnText: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '600',
    color: '#333',
  },

  // Bottom action
  bottomActionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  actionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#4A90E2',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  actionBtnSecondary: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },


  // Bottom nav
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },

  navButton: {
    alignItems: 'center',
    minWidth: 70,
    paddingVertical: 4,
  },

  navButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },

  // Fullscreen modal
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullscreenVideoBox: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },

  fullscreenClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
