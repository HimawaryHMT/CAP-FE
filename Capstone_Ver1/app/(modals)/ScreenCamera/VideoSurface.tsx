// components/VideoSurface.tsx - Sử dụng expo-video cho HLS tốt hơn
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';

type Props = {
  uri: string;
  onReady?: () => void;
  onError?: (e: unknown) => void;
  style?: any;
  autoPlay?: boolean;
  loop?: boolean;
  useNativeControls?: boolean;
};

export default function VideoSurface({
  uri,
  onReady,
  onError,
  style,
  autoPlay = true,
  loop = true,
  useNativeControls = true,
}: Props) {
  // Cấu hình player cho low latency
  const player = useVideoPlayer(uri, (player) => {
    player.loop = loop;
    // Tối ưu cho low latency - play ngay khi ready
    if (autoPlay) {
      player.play();
    }
  });

  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('statusChange', (status) => {
      console.log('📹 Video status:', status.status, 'for URI:', uri);
      
      if (status.status === 'readyToPlay') {
        console.log('✅ Video ready to play:', uri);
        if (autoPlay && !player.playing) {
          player.play();
        }
        onReady?.();
      } else if (status.status === 'error') {
        const errorMsg = status.error || 'Unknown video error';
        console.error('❌ Video error:', errorMsg);
        onError?.(new Error(String(errorMsg)));
      } else if (status.status === 'playing') {
        console.log('▶️ Video playing:', uri);
        onReady?.();
      } else if (status.status === 'loading') {
        console.log('⏳ Video loading:', uri);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, uri, autoPlay, onReady, onError]);

  useEffect(() => {
    if (player && uri) {
      console.log('🔄 Updating video source:', uri);
      player.replace(uri);
      if (autoPlay) {
        player.play();
      }
    }
  }, [uri, player, autoPlay]);

  if (!player) {
    console.warn('⚠️ Video player not initialized');
    return <View style={[styles.fill, style]} />;
  }

  return (
    <View style={[styles.fill, style]}>
      <VideoView
        player={player}
        style={styles.fill}
        contentFit="cover"
        nativeControls={useNativeControls}
        allowsFullscreen
        allowsPictureInPicture={false}
        // Tối ưu cho low latency
        requiresLinearPlayback={false} // Cho phép non-linear playback để giảm delay
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { width: '100%', height: '100%' },
});
