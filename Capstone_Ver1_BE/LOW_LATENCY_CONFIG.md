# Cấu hình Low Latency cho Video Streaming

## Tối ưu đã thực hiện

### 1. Backend (FFmpeg) - Giảm delay từ ~4-6s xuống ~1-2s

#### Segment Duration
- **Cũ:** `-hls_time 2` (2 giây mỗi segment)
- **Mới:** `-hls_time 1` (1 giây mỗi segment)
- **Lợi ích:** Giảm delay ~1 giây

#### Playlist Size
- **Cũ:** `-hls_list_size 5` (giữ 5 segments)
- **Mới:** `-hls_list_size 3` (chỉ giữ 3 segments)
- **Lợi ích:** Giảm buffer, phát nhanh hơn

#### Encoding Settings
- **GOP Size:** `-g 30` (30 frames) - Nhỏ hơn để giảm delay
- **Keyframe Interval:** `-keyint_min 30` - Minimum keyframe interval
- **Scene Change:** `-sc_threshold 0` - Tắt scene change detection để giảm delay
- **Flush Packets:** `-flush_packets 1` - Flush packets ngay lập tức

#### HLS Flags
- **Thêm:** `independent_segments` - Segments độc lập cho low latency
- **Thêm:** `hls_start_number_source epoch` - Start từ epoch

### 2. Frontend (expo-video) - Tối ưu player

#### Player Configuration
- **automaticallyWaitsToMinimizeStalling:** `false` - Không đợi buffer
- **requiresLinearPlayback:** `false` - Cho phép non-linear playback
- **allowsExternalPlayback:** `false` - Tắt external playback

## Kết quả mong đợi

### Delay trước khi tối ưu
- Segment creation: ~2 giây
- Buffer trong player: ~2-4 giây
- **Tổng delay: ~4-6 giây**

### Delay sau khi tối ưu
- Segment creation: ~1 giây
- Buffer trong player: ~1-2 giây
- **Tổng delay: ~1-2 giây**

## Trade-offs

### Ưu điểm
- ✅ Delay thấp hơn (~1-2 giây thay vì 4-6 giây)
- ✅ Phản hồi nhanh hơn
- ✅ Phù hợp cho live monitoring

### Nhược điểm
- ⚠️ Tăng CPU usage (do encoding nhanh hơn)
- ⚠️ Có thể tăng bitrate (do GOP size nhỏ)
- ⚠️ Có thể giảm chất lượng nhẹ (do preset ultrafast)

## Cấu hình nâng cao (nếu cần delay thấp hơn)

### Ultra Low Latency (< 1 giây)
```javascript
"-hls_time", "0.5", // 0.5 giây mỗi segment
"-hls_list_size", "2", // Chỉ giữ 2 segments
"-g", "15", // GOP size nhỏ hơn
```

**Lưu ý:** Có thể gây vấn đề về stability và tăng CPU usage đáng kể.

### Balanced (1-2 giây delay)
```javascript
"-hls_time", "1", // 1 giây (hiện tại)
"-hls_list_size", "3", // 3 segments (hiện tại)
"-g", "30", // GOP size 30 (hiện tại)
```

**Đây là cấu hình hiện tại - cân bằng giữa delay và stability.**

## Monitoring

### Kiểm tra delay
1. So sánh thời gian thực với thời gian hiển thị trên video
2. Xem timestamp trong video với thời gian hiện tại
3. Đo thời gian từ khi sự kiện xảy ra đến khi hiển thị trên app

### Logs để theo dõi
- FFmpeg logs: Xem segment creation time
- Player logs: Xem buffer status
- Network logs: Xem download time của segments

## Troubleshooting

### Nếu delay vẫn cao
1. **Kiểm tra network:** Latency giữa camera và server
2. **Kiểm tra RTSP stream:** Delay từ camera đến FFmpeg
3. **Kiểm tra encoding:** CPU có đủ mạnh không?
4. **Kiểm tra player:** Buffer size trong player

### Nếu video bị giật/lag
1. Tăng `hls_time` lên 1.5-2 giây
2. Tăng `hls_list_size` lên 4-5
3. Kiểm tra network bandwidth
4. Kiểm tra CPU usage

### Nếu video không load
1. Kiểm tra segments có được tạo không
2. Kiểm tra m3u8 file có cập nhật không
3. Kiểm tra CORS headers
4. Kiểm tra player configuration

## Best Practices

1. **Network:** Đảm bảo network latency thấp (< 50ms)
2. **CPU:** Đảm bảo CPU đủ mạnh cho encoding
3. **Storage:** Đảm bảo disk I/O đủ nhanh
4. **Monitoring:** Theo dõi delay và adjust nếu cần

## Tùy chỉnh thêm

Nếu cần điều chỉnh, sửa trong `Capstone_Ver1_BE/index.js`:

```javascript
"-hls_time", "1", // Thay đổi segment duration (0.5-2 giây)
"-hls_list_size", "3", // Thay đổi số segments (2-5)
"-g", "30", // Thay đổi GOP size (15-60)
```


