# Hướng dẫn Debug Camera Video Stream

## Vấn đề: Video camera không hiển thị

### 1. Kiểm tra Backend đã chạy chưa

```bash
cd Capstone_Ver1_BE
npm start
```

Kiểm tra console log:
- ✅ `✔ Server + Socket.io running at http://localhost:5060`
- ✅ `✔ FFmpeg starting: RTSP → HLS...`
- ✅ `✔ HLS stream available at: http://localhost:5060/hls/cam1/index.m3u8`

### 2. Kiểm tra FFmpeg đã cài đặt chưa

FFmpeg cần được cài đặt trên máy để convert RTSP → HLS:

**Windows:**
- Tải từ: https://ffmpeg.org/download.html
- Hoặc: `choco install ffmpeg` (nếu có Chocolatey)
- Kiểm tra: `ffmpeg -version`

**Mac:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
sudo apt-get install ffmpeg
```

### 3. Kiểm tra RTSP Stream

RTSP URL hiện tại: `rtsp://admin:thang05112004@192.168.100.5:554/ch1/sub`

**Kiểm tra:**
- Camera có đang bật không?
- IP address `192.168.100.5` có đúng không?
- Username/password có đúng không?
- Port `554` có mở không?

**Test RTSP stream:**
```bash
# Sử dụng VLC hoặc ffplay
ffplay rtsp://admin:thang05112004@192.168.100.5:554/ch1/sub
```

### 4. Kiểm tra HLS Files

Kiểm tra thư mục `Capstone_Ver1_BE/hls/cam1/`:
- File `index.m3u8` có tồn tại không?
- File `.ts` có đang được tạo mới không?

**Nếu không có file:**
- FFmpeg có thể đang gặp lỗi kết nối RTSP
- Kiểm tra console log của backend để xem lỗi

### 5. Kiểm tra Frontend

**URL Stream:**
- Frontend đang dùng: `${BASE_URL}/hls/cam1/index.m3u8`
- `BASE_URL` được lấy từ `config.js` (tự động detect IP)

**Kiểm tra:**
1. Mở DevTools/Console trên Expo
2. Xem log: `🌐 BASE_URL: http://...`
3. Thử mở URL trong browser: `http://YOUR_IP:5060/hls/cam1/index.m3u8`

**Nếu thấy file m3u8:**
- Backend đang hoạt động tốt
- Vấn đề có thể ở frontend video player

**Nếu không thấy:**
- Kiểm tra firewall
- Kiểm tra IP address có đúng không
- Thử dùng `localhost` thay vì IP

### 6. Test với Video Demo

Trong app, nhấn nút **"Dùng Video Demo"** để test:
- Nếu video demo chạy được → Vấn đề ở RTSP/HLS stream
- Nếu video demo không chạy → Vấn đề ở video player

### 7. Debug VideoSurface Component

**Kiểm tra console log:**
- `Video loading started: ...`
- `Video loaded successfully` ✅
- `Video error: ...` ❌

**Các lỗi thường gặp:**

1. **Network Error:**
   - Backend chưa chạy
   - IP address sai
   - Firewall chặn

2. **Format Error:**
   - HLS stream không hợp lệ
   - File m3u8 bị lỗi

3. **Timeout:**
   - RTSP stream không kết nối được
   - Network chậm

### 8. Các bước khắc phục

**Bước 1: Kiểm tra Backend**
```bash
# Restart backend
cd Capstone_Ver1_BE
npm start
```

**Bước 2: Kiểm tra FFmpeg**
```bash
ffmpeg -version
```

**Bước 3: Test RTSP Stream**
```bash
ffplay rtsp://admin:thang05112004@192.168.100.5:554/ch1/sub
```

**Bước 4: Test HLS Stream**
- Mở browser: `http://localhost:5060/hls/cam1/index.m3u8`
- Nếu thấy nội dung file → Backend OK
- Nếu 404 → Kiểm tra thư mục `hls/cam1/`

**Bước 5: Test Frontend**
- Mở app
- Nhấn "Dùng Video Demo" để test player
- Nếu demo chạy → Vấn đề ở stream URL
- Nếu demo không chạy → Vấn đề ở video player

### 9. Cấu hình RTSP URL

Nếu camera của bạn khác, sửa trong `Capstone_Ver1_BE/index.js`:

```javascript
const RTSP_URL = "rtsp://username:password@IP:PORT/path";
```

Ví dụ:
- `rtsp://admin:123456@192.168.1.100:554/stream1`
- `rtsp://user:pass@10.0.0.5:8554/live`

### 10. Logs quan trọng

**Backend logs:**
- `✔ FFmpeg starting: RTSP → HLS...` → FFmpeg đang start
- `[FFmpeg ERROR]` → Có lỗi với FFmpeg
- `⚠️ FFmpeg STOPPED` → FFmpeg đã dừng

**Frontend logs:**
- `Video loading started` → Video đang load
- `Video loaded successfully` → Video đã load thành công
- `Video error` → Có lỗi với video

### 11. Troubleshooting

**Vấn đề: FFmpeg không chạy**
- Kiểm tra FFmpeg đã cài chưa
- Kiểm tra RTSP URL có đúng không
- Kiểm tra camera có đang hoạt động không

**Vấn đề: HLS files không được tạo**
- Kiểm tra quyền ghi file trong thư mục `hls/`
- Kiểm tra FFmpeg có quyền truy cập thư mục không

**Vấn đề: Video không hiển thị trên app**
- Thử dùng video demo trước
- Kiểm tra BASE_URL có đúng không
- Kiểm tra network connection
- Kiểm tra console logs để xem lỗi cụ thể

### 12. Test nhanh

1. **Test Backend:**
   ```bash
   curl http://localhost:5060/hls/cam1/index.m3u8
   ```

2. **Test RTSP:**
   ```bash
   ffplay rtsp://admin:thang05112004@192.168.100.5:554/ch1/sub
   ```

3. **Test Frontend:**
   - Mở app
   - Nhấn "Dùng Video Demo"
   - Nếu chạy → Player OK, vấn đề ở stream
   - Nếu không chạy → Vấn đề ở player

### 13. Liên hệ hỗ trợ

Nếu vẫn gặp vấn đề, cung cấp:
- Console logs từ backend
- Console logs từ frontend
- Thông tin camera (IP, model, RTSP URL)
- Screenshot lỗi (nếu có)

