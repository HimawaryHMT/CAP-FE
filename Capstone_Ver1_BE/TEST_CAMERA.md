# Hướng dẫn Test Camera Stream

## Kiểm tra nhanh

### 1. Kiểm tra Backend đang chạy
```bash
# Xem process node
Get-Process -Name node

# Xem port 5060
netstat -ano | findstr :5060
```

### 2. Kiểm tra FFmpeg đang chạy
```bash
Get-Process -Name ffmpeg
```

### 3. Kiểm tra HLS files
```bash
# Xem file m3u8
Get-Content hls\cam1\index.m3u8

# Xem các file .ts
Get-ChildItem hls\cam1\*.ts | Select-Object Name, LastWriteTime
```

### 4. Test HLS Stream trong Browser
Mở browser và truy cập:
```
http://localhost:5060/hls/cam1/index.m3u8
```

Hoặc với IP của máy:
```
http://192.168.100.6:5060/hls/cam1/index.m3u8
```

**Kết quả mong đợi:**
- Nếu thấy nội dung file m3u8 (text) → Backend OK ✅
- Nếu thấy 404 → Kiểm tra thư mục hls/cam1/
- Nếu không kết nối được → Kiểm tra firewall

### 5. Test RTSP Stream trực tiếp
```bash
# Sử dụng ffplay (nếu đã cài FFmpeg)
ffplay rtsp://admin:thang05112004@192.168.100.5:554/ch1/sub
```

**Kết quả:**
- Nếu video hiển thị → RTSP stream OK ✅
- Nếu lỗi connection → Camera không kết nối được
- Nếu lỗi authentication → Username/password sai

### 6. Test trong App

1. **Mở app và vào màn hình Camera**
2. **Xem console logs:**
   - `🌐 BASE_URL: http://...` → Xem IP có đúng không
   - `📹 Video loading started: ...` → Video đang load
   - `✅ Video loaded successfully` → Video đã load thành công
   - `Video error: ...` → Có lỗi

3. **Thử các nút:**
   - **"Dùng Video Demo"** → Test video player
   - **"Kết nối"** → Thử kết nối lại
   - **"Fullscreen"** → Xem fullscreen

## Debug Steps

### Bước 1: Kiểm tra Backend
```bash
cd Capstone_Ver1_BE
npm start
```

Xem console:
- ✅ `✔ Server + Socket.io running at http://localhost:5060`
- ✅ `✔ FFmpeg starting: RTSP → HLS...`
- ✅ `✔ HLS stream available at: http://localhost:5060/hls/cam1/index.m3u8`

### Bước 2: Kiểm tra HLS Files
```bash
# Xem nội dung file m3u8
Get-Content hls\cam1\index.m3u8

# Kiểm tra file mới nhất
Get-ChildItem hls\cam1\*.ts | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

**Nếu không có file mới:**
- FFmpeg có thể đang gặp lỗi
- Kiểm tra console log của backend
- Kiểm tra RTSP stream có hoạt động không

### Bước 3: Test HLS trong Browser
Mở: `http://localhost:5060/hls/cam1/index.m3u8`

**Nếu thấy file m3u8:**
- Backend đang serve files đúng ✅
- Vấn đề có thể ở frontend

**Nếu không thấy:**
- Kiểm tra thư mục `hls/cam1/` có tồn tại không
- Kiểm tra quyền truy cập file
- Kiểm tra backend có chạy không

### Bước 4: Kiểm tra Frontend URL
Trong app, xem console log:
```
🌐 BASE_URL: http://192.168.100.6:5060
```

**Kiểm tra:**
- IP có đúng không? (phải là IP của máy chạy backend)
- Port có đúng không? (5060)
- URL đầy đủ: `http://192.168.100.6:5060/hls/cam1/index.m3u8`

### Bước 5: Test Video Player
Nhấn nút **"Dùng Video Demo"** trong app

**Nếu video demo chạy:**
- Video player hoạt động tốt ✅
- Vấn đề ở HLS stream hoặc URL

**Nếu video demo không chạy:**
- Vấn đề ở video player
- Kiểm tra expo-av version
- Kiểm tra platform (iOS/Android)

## Common Issues

### Issue 1: Video không hiển thị, không có lỗi
**Nguyên nhân có thể:**
- Video đang load nhưng chưa ready
- HLS stream chưa có segment nào

**Giải pháp:**
- Đợi vài giây
- Kiểm tra file m3u8 có segments không
- Thử dùng video demo

### Issue 2: Network Error
**Nguyên nhân:**
- Backend chưa chạy
- IP address sai
- Firewall chặn

**Giải pháp:**
- Kiểm tra backend đã chạy chưa
- Kiểm tra IP trong config.js
- Tắt firewall tạm thời để test

### Issue 3: Format Error
**Nguyên nhân:**
- HLS stream không hợp lệ
- expo-av không hỗ trợ format

**Giải pháp:**
- Kiểm tra file m3u8 có đúng format không
- Thử dùng video demo
- Kiểm tra FFmpeg output format

### Issue 4: Video hiển thị nhưng không phát
**Nguyên nhân:**
- Video đã load nhưng chưa play
- AutoPlay không hoạt động

**Giải pháp:**
- Kiểm tra `shouldPlay={true}`
- Thử nhấn play manually (nếu có controls)

## Test Checklist

- [ ] Backend đang chạy (port 5060)
- [ ] FFmpeg đang chạy
- [ ] File m3u8 tồn tại và có nội dung
- [ ] File .ts đang được tạo mới
- [ ] HLS stream accessible trong browser
- [ ] RTSP stream hoạt động (test với ffplay)
- [ ] BASE_URL trong frontend đúng IP
- [ ] Video demo chạy được trong app
- [ ] Console logs không có lỗi

## Next Steps

Nếu tất cả đều OK nhưng video vẫn không hiển thị:
1. Kiểm tra expo-av version
2. Thử dùng expo-video thay vì expo-av
3. Kiểm tra platform-specific issues
4. Xem detailed logs trong console




