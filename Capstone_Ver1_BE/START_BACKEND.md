# Hướng dẫn Khởi động Backend đúng cách

## Vấn đề: FFmpeg chạy từ thư mục sai

Nếu bạn thấy FFmpeg đang ghi vào thư mục khác (ví dụ: `D:\Capstone 1\AppNew_Ver2\MyApp_BE\hls\cam1\`), có nghĩa là backend đang chạy từ thư mục cũ.

## Giải pháp

### Bước 1: Dừng tất cả process cũ

```powershell
# Dừng tất cả node và ffmpeg processes
Get-Process -Name node,ffmpeg -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Bước 2: Kiểm tra thư mục hiện tại

```powershell
# Đảm bảo bạn đang ở đúng thư mục
cd "D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE"

# Kiểm tra
Get-Location
```

**Kết quả mong đợi:**
```
Path
----
D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE
```

### Bước 3: Khởi động lại Backend

```powershell
npm start
```

### Bước 4: Kiểm tra Logs

Khi backend khởi động, bạn sẽ thấy:

```
✔ Server + Socket.io running at http://localhost:5060
✔ Current working directory: D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE
✔ HLS output directory: D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE\hls\cam1
✔ HLS stream available at: http://localhost:5060/hls/cam1/index.m3u8
✔ FFmpeg starting: RTSP → HLS...
   Current directory: D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE
   RTSP URL: rtsp://admin:thang05112004@192.168.100.5:554/ch1/sub
   HLS Output: D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE\hls\cam1\index.m3u8
```

**Quan trọng:** Kiểm tra xem đường dẫn HLS Output có đúng không!

### Bước 5: Kiểm tra FFmpeg đang ghi vào đâu

Trong logs, tìm dòng:
```
[FFmpeg] Writing to: D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE\hls\cam1\indexXXXX.ts
```

**Nếu đường dẫn đúng:** ✅ Backend đang chạy từ đúng thư mục

**Nếu đường dẫn sai:** ❌ Backend vẫn chạy từ thư mục cũ, cần dừng và khởi động lại

## Kiểm tra nhanh

### 1. Kiểm tra process đang chạy từ đâu

```powershell
# Xem tất cả node processes
Get-Process -Name node | Select-Object Id, Path, StartTime

# Hoặc xem chi tiết hơn
Get-WmiObject Win32_Process | Where-Object { $_.Name -eq "node.exe" } | Select-Object ProcessId, CommandLine
```

### 2. Kiểm tra file HLS đang được tạo ở đâu

```powershell
# Xem file mới nhất trong thư mục hiện tại
Get-ChildItem "hls\cam1\*.ts" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Format-List FullName, LastWriteTime

# So sánh với thư mục cũ (nếu có)
Get-ChildItem "D:\Capstone 1\AppNew_Ver2\MyApp_BE\hls\cam1\*.ts" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1 | Format-List FullName, LastWriteTime
```

### 3. Test HLS Stream

```powershell
# Test từ thư mục hiện tại
Invoke-WebRequest -Uri "http://localhost:5060/hls/cam1/index.m3u8" -UseBasicParsing | Select-Object StatusCode, Content
```

## Troubleshooting

### Vấn đề: Vẫn thấy FFmpeg ghi vào thư mục cũ

**Nguyên nhân:**
- Có nhiều backend đang chạy cùng lúc
- Backend cũ chưa được dừng hoàn toàn

**Giải pháp:**
1. Dừng tất cả node processes:
   ```powershell
   Get-Process -Name node | Stop-Process -Force
   ```
2. Đợi 5 giây
3. Khởi động lại từ đúng thư mục:
   ```powershell
   cd "D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE"
   npm start
   ```

### Vấn đề: Port 5060 đã được sử dụng

**Giải pháp:**
```powershell
# Tìm process đang dùng port 5060
netstat -ano | findstr :5060

# Dừng process đó (thay PID bằng số từ netstat)
Stop-Process -Id <PID> -Force
```

### Vấn đề: FFmpeg warnings về timestamps

Đã được fix bằng cách thêm `-fflags +genpts` và `-vsync cfr` vào FFmpeg args. Warnings này không ảnh hưởng đến chức năng, nhưng đã được xử lý để code sạch hơn.

## Checklist

Trước khi báo lỗi, đảm bảo:

- [ ] Đã dừng tất cả process cũ
- [ ] Đang ở đúng thư mục: `D:\Nam4\Học kì 1 năm 4\Lịch sử đảng\ad\Capstone_Ver1_BE`
- [ ] Backend khởi động thành công
- [ ] Logs hiển thị đúng đường dẫn HLS output
- [ ] FFmpeg đang ghi vào đúng thư mục
- [ ] File m3u8 và .ts được tạo trong `hls\cam1\`
- [ ] Có thể truy cập `http://localhost:5060/hls/cam1/index.m3u8` trong browser





