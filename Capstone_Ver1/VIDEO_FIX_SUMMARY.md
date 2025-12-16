# Tóm tắt Sửa lỗi Video Camera

## Vấn đề
Video camera không hiển thị trên app mặc dù:
- ✅ Backend đang chạy (port 5060)
- ✅ FFmpeg đang chạy và tạo HLS files
- ✅ HLS files tồn tại và hợp lệ
- ✅ Backend serve HLS files đúng (Status 200)

## Nguyên nhân
**expo-av không hỗ trợ HLS streaming tốt** trên React Native, đặc biệt là HLS live streams.

## Giải pháp
**Chuyển sang dùng `expo-video`** thay vì `expo-av` vì:
- ✅ Hỗ trợ HLS tốt hơn
- ✅ Hỗ trợ live streaming
- ✅ API đơn giản hơn
- ✅ Đã có sẵn trong package.json

## Thay đổi đã thực hiện

### 1. VideoSurface.tsx
- ❌ Cũ: Dùng `expo-av` Video component
- ✅ Mới: Dùng `expo-video` VideoView và useVideoPlayer

### 2. Cải thiện Error Handling
- Thêm logging chi tiết cho từng status
- Hiển thị URI trong logs để debug
- Xử lý các trạng thái: loading, readyToPlay, playing, error

### 3. Auto-play và Loop
- Tự động play khi video ready
- Hỗ trợ loop cho live stream

## Cách test

### 1. Kiểm tra Backend
```powershell
# Xem FFmpeg đang chạy
Get-Process -Name ffmpeg

# Xem HLS files
Get-ChildItem hls\cam1\*.ts | Sort-Object LastWriteTime -Descending | Select-Object -First 3
```

### 2. Test HLS Stream trong Browser
Mở: `http://localhost:5060/hls/cam1/index.m3u8`

Nếu thấy nội dung file m3u8 → Backend OK ✅

### 3. Test trong App
1. Mở app và vào màn hình Camera
2. Xem console logs:
   - `📹 Video status: loading` → Video đang load
   - `✅ Video ready to play` → Video đã sẵn sàng
   - `▶️ Video playing` → Video đang phát
   - `❌ Video error: ...` → Có lỗi

3. **Quan trọng:** Kiểm tra BASE_URL trong logs:
   ```
   🌐 BASE_URL: http://192.168.100.6:5060
   ```
   IP phải đúng với IP của máy chạy backend.

### 4. Nếu vẫn không hiển thị

**Kiểm tra:**
1. **IP Address:** BASE_URL có đúng IP không?
   - IP của máy: `192.168.100.6` (từ ipconfig)
   - URL đầy đủ: `http://192.168.100.6:5060/hls/cam1/index.m3u8`

2. **Network:** App có cùng network với backend không?
   - Cả app và backend phải cùng WiFi/network

3. **Firewall:** Firewall có chặn port 5060 không?
   - Tạm thời tắt để test

4. **Console Logs:** Xem logs trong app để biết lỗi cụ thể
   - `Video status: error` → Xem error message
   - `Video status: loading` → Đang load, đợi thêm

## So sánh expo-av vs expo-video

| Feature | expo-av | expo-video |
|---------|---------|------------|
| HLS Support | ⚠️ Hạn chế | ✅ Tốt |
| Live Streaming | ❌ Không tốt | ✅ Hỗ trợ tốt |
| API | Phức tạp | Đơn giản |
| Performance | Ổn | Tốt hơn |

## Lưu ý

1. **expo-video** yêu cầu:
   - Expo SDK 50+
   - iOS 13+ / Android 5+
   - Đã có trong package.json

2. **HLS Stream:**
   - Phải là URL đầy đủ (http://...)
   - Không hỗ trợ file://
   - Cần CORS headers (đã có trong backend)

3. **Network:**
   - App và backend phải cùng network
   - Hoặc backend phải accessible từ network của app

## Next Steps

Nếu vẫn không hoạt động:
1. Xem console logs chi tiết
2. Test với video demo trước (nút "Dùng Video Demo")
3. Kiểm tra network connectivity
4. Kiểm tra firewall/port

## Files đã thay đổi

- ✅ `Capstone_Ver1/app/(modals)/ScreenCamera/VideoSurface.tsx` - Chuyển sang expo-video
- ✅ `Capstone_Ver1_BE/index.js` - Cải thiện logging và FFmpeg config




